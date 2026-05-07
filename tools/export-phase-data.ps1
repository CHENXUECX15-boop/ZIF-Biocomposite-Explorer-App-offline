param(
  [string]$WorkbookPath = "D:\Users\19104\Desktop\digital chemi\project\XRD - only once.xlsx",
  [string]$OutputPath = "D:\Users\19104\Documents\New project\phase-ternary-site\data\phase-data.js"
)

Add-Type -AssemblyName System.IO.Compression.FileSystem

$zip = [System.IO.Compression.ZipFile]::OpenRead($WorkbookPath)

function Read-ZipText($Name) {
  $entry = $zip.GetEntry($Name)
  if (-not $entry) {
    return $null
  }

  $reader = [System.IO.StreamReader]::new($entry.Open())
  try {
    return $reader.ReadToEnd()
  }
  finally {
    $reader.Dispose()
  }
}

function Get-ColumnIndex($CellRef) {
  $letters = $CellRef -replace "\d", ""
  $index = 0
  foreach ($char in $letters.ToCharArray()) {
    $index = $index * 26 + ([int][char]$char - [int][char]"A" + 1)
  }
  return $index
}

try {
  [xml]$workbook = Read-ZipText "xl/workbook.xml"
  [xml]$relationships = Read-ZipText "xl/_rels/workbook.xml.rels"
  [xml]$sharedStrings = Read-ZipText "xl/sharedStrings.xml"

  $shared = @()
  if ($sharedStrings.sst.si) {
    foreach ($item in $sharedStrings.sst.si) {
      if ($item.t) {
        $shared += [string]$item.t
      }
      else {
        $shared += (($item.r | ForEach-Object { $_.t }) -join "")
      }
    }
  }

  $relationshipMap = @{}
  foreach ($relationship in $relationships.Relationships.Relationship) {
    $relationshipMap[$relationship.Id] = $relationship.Target
  }

  function Get-CellText($Cell) {
    $value = [string]$Cell.v
    if ($Cell.t -eq "s") {
      if ($value -match "^\d+$") {
        return $shared[[int]$value]
      }
      return $value
    }
    if ($Cell.t -eq "inlineStr") {
      return [string]$Cell.is.t
    }
    return $value
  }

  $concentrations = @("12.5 mg/mL", "25 mg/mL", "50 mg/mL", "75 mg/mL", "100 mg/mL")
  $datasets = [ordered]@{}

  foreach ($sheet in $workbook.workbook.sheets.sheet) {
    $relationshipId = $sheet.GetAttribute(
      "id",
      "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
    )
    $target = $relationshipMap[$relationshipId]
    if ($target -notlike "xl/*") {
      $target = "xl/$target"
    }

    [xml]$worksheet = Read-ZipText $target
    $rows = @()

    foreach ($row in $worksheet.worksheet.sheetData.row) {
      $rowNumber = [int]$row.r
      if ($rowNumber -lt 4) {
        continue
      }

      $cells = @{}
      foreach ($cell in $row.c) {
        $cells[(Get-ColumnIndex $cell.r)] = Get-CellText $cell
      }

      if (-not $cells[1]) {
        continue
      }

      $phases = [ordered]@{}
      for ($index = 0; $index -lt $concentrations.Count; $index++) {
        $phases[$concentrations[$index]] = $cells[6 + $index]
      }

      $rows += [ordered]@{
        sample = [int]$cells[1]
        M = [double]$cells[2]
        L = [double]$cells[3]
        BSA = [double]$cells[4]
        ratio = [double]$cells[5]
        phases = $phases
      }
    }

    $datasets[$sheet.name] = $rows
  }

  $payload = [ordered]@{
    concentrations = $concentrations
    datasets = $datasets
  }

  $json = $payload | ConvertTo-Json -Depth 8
  $directory = Split-Path -Parent $OutputPath
  if (-not (Test-Path -LiteralPath $directory)) {
    New-Item -ItemType Directory -Path $directory | Out-Null
  }

  "window.PHASE_DATA = $json;" | Set-Content -LiteralPath $OutputPath -Encoding UTF8
  Write-Output "Exported phase data to $OutputPath"
}
finally {
  $zip.Dispose()
}
