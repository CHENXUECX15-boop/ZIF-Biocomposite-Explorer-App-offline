#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const DEFAULT_CONCENTRATIONS = ["12.5 mg/mL", "25 mg/mL", "50 mg/mL", "75 mg/mL", "100 mg/mL"];
const DEFAULT_DATASETS = ["WW", "EW"];
const DEFAULT_SYNTHESES = ["First synthesis", "Second synthesis", "Third synthesis"];

function usage() {
  console.log(`Usage:
  node tools/csv-to-js-data.js <input.csv> <output.js> [options]

Options:
  --preset raw|phase|xrd-long       Output structure. Default: raw
  --var NAME                        Window variable name. Defaults by preset
  --delimiter ,                     CSV delimiter. Default: auto-detect
  --pretty                          Pretty-print generated JSON
  --dataset WW                      Default dataset if CSV has no dataset column
  --datasets WW,EW                  Dataset order for structured presets
  --concentrations "12.5 mg/mL,25 mg/mL,50 mg/mL,75 mg/mL,100 mg/mL"
  --sample-count 36                 Expected samples for xrd-long missing report
  --stride 2                        XRD down-sampling stride. Default: 2
  --x-min 5 --x-max 20              XRD x-axis range. Default: 5..20

Examples:
  node tools/csv-to-js-data.js phase.csv data/phase-data.js --preset phase
  node tools/csv-to-js-data.js xrd-long.csv data/xrd-data.js --preset xrd-long
  node tools/csv-to-js-data.js any-table.csv data/my-data.js --var MY_DATA --pretty
`);
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      args._.push(token);
      continue;
    }

    const name = token.slice(2);
    if (name === "pretty" || name === "no-coerce") {
      args[name] = true;
      continue;
    }

    const next = argv[index + 1];
    if (next === undefined || next.startsWith("--")) {
      args[name] = true;
      continue;
    }

    args[name] = next;
    index += 1;
  }
  return args;
}

function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/).find((line) => line.trim()) || "";
  const candidates = [",", ";", "\t"];
  return candidates
    .map((delimiter) => ({ delimiter, count: firstLine.split(delimiter).length }))
    .sort((a, b) => b.count - a.count)[0].delimiter;
}

function parseCsv(text, delimiter) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && char === delimiter) {
      row.push(field);
      field = "";
      continue;
    }

    if (!inQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((value) => value.trim() !== "")) rows.push(row);
  return rows;
}

function parseCsvObjects(filePath, delimiterArg) {
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const delimiter = delimiterArg || detectDelimiter(raw);
  const rows = parseCsv(raw, delimiter);
  if (rows.length < 2) throw new Error("CSV must contain a header row and at least one data row.");

  const headers = rows[0].map((header) => header.trim());
  const records = rows.slice(1).map((row) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = (row[index] || "").trim();
    });
    return record;
  });

  return { headers, records, delimiter };
}

function normalizeKey(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function findColumn(headers, candidates) {
  const lookup = new Map(headers.map((header) => [normalizeKey(header), header]));
  for (const candidate of candidates) {
    const found = lookup.get(normalizeKey(candidate));
    if (found) return found;
  }
  return null;
}

function numberOrNull(value) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim().replace(/,/g, ".");
  if (!text) return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function maybeNumber(value) {
  const parsed = numberOrNull(value);
  return parsed === null ? value : parsed;
}

function splitList(value, fallback) {
  if (!value) return fallback;
  return String(value)
    .split(/[|,;]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function concentrationNumber(label) {
  const match = String(label || "").replace(/,/g, ".").match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function normalizeConcentrationLabel(value, concentrations) {
  const text = String(value || "").trim();
  if (!text) return text;

  const numeric = concentrationNumber(text);
  if (numeric !== null) {
    const matched = concentrations.find((label) => concentrationNumber(label) === numeric);
    if (matched) return matched;
    return `${numeric} mg/mL`;
  }
  return text;
}

function phaseColumnForConcentration(headers, concentration) {
  const numeric = concentrationNumber(concentration);
  const numericText = numeric === null ? concentration : String(numeric);
  const candidates = [
    concentration,
    concentration.replace("mg/mL", "mg mL-1"),
    concentration.replace("mg/mL", "mg mL^-1"),
    numericText,
    `${numericText} mg/mL`,
    `${numericText} mg mL-1`,
    `${numericText} mg mL^-1`,
    `phase ${numericText}`,
    `phase_${numericText}`,
    `phase-${numericText}`,
    `${numericText} phase`,
    `${numericText}_phase`,
  ];
  return findColumn(headers, candidates);
}

function buildRawData(records, args) {
  if (args["no-coerce"]) return records;
  return records.map((record) => {
    const output = {};
    Object.entries(record).forEach(([key, value]) => {
      output[key] = maybeNumber(value);
    });
    return output;
  });
}

function buildPhaseData(headers, records, args) {
  const concentrations = splitList(args.concentrations, DEFAULT_CONCENTRATIONS);
  const datasetOrder = splitList(args.datasets, DEFAULT_DATASETS);
  const defaultDataset = args.dataset || datasetOrder[0] || "WW";

  const datasetCol = findColumn(headers, ["dataset", "washing", "wash", "TD", "solvent"]);
  const sampleCol = findColumn(headers, ["sample", "sample number", "sample_number", "id"]);
  const mCol = findColumn(headers, ["M", "M wt.%", "M wt%", "metal", "Zn"]);
  const lCol = findColumn(headers, ["L", "L wt.%", "L wt%", "ligand", "HmIM"]);
  const bsaCol = findColumn(headers, ["BSA", "BSA wt.%", "BSA wt%", "protein"]);
  const ratioCol = findColumn(headers, ["ratio", "L/M ratio", "L/M mass ratio", "LM ratio"]);
  const concentrationCol = findColumn(headers, ["concentration", "conc", "total concentration"]);
  const phaseCol = findColumn(headers, ["phase", "phases", "phase result", "result"]);

  if (!sampleCol || !mCol || !lCol || !bsaCol) {
    throw new Error("Phase preset requires sample, M, L, and BSA columns.");
  }

  const widePhaseColumns = new Map();
  concentrations.forEach((concentration) => {
    const column = phaseColumnForConcentration(headers, concentration);
    if (column) widePhaseColumns.set(concentration, column);
  });

  if (!phaseCol && widePhaseColumns.size === 0) {
    throw new Error("Phase preset requires either a phase column with concentration column, or one phase column per concentration.");
  }

  const byDatasetSample = new Map();

  function getEntry(row) {
    const dataset = (datasetCol ? row[datasetCol] : defaultDataset) || defaultDataset;
    const sample = numberOrNull(row[sampleCol]);
    if (!Number.isFinite(sample)) return null;

    const key = `${dataset}|${sample}`;
    if (!byDatasetSample.has(key)) {
      const m = numberOrNull(row[mCol]);
      const l = numberOrNull(row[lCol]);
      const bsa = numberOrNull(row[bsaCol]);
      const ratioFromCsv = ratioCol ? numberOrNull(row[ratioCol]) : null;
      const ratio = ratioFromCsv ?? (m && l !== null ? Number((l / m).toFixed(6)) : null);
      const phases = Object.fromEntries(concentrations.map((concentration) => [concentration, "-"]));

      byDatasetSample.set(key, {
        dataset,
        entry: { sample, M: m, L: l, BSA: bsa, ratio, phases },
      });
    }
    return byDatasetSample.get(key);
  }

  records.forEach((row) => {
    const holder = getEntry(row);
    if (!holder) return;

    if (phaseCol && concentrationCol) {
      const concentration = normalizeConcentrationLabel(row[concentrationCol], concentrations);
      if (!holder.entry.phases[concentration]) holder.entry.phases[concentration] = "-";
      holder.entry.phases[concentration] = row[phaseCol] || "-";
      return;
    }

    widePhaseColumns.forEach((column, concentration) => {
      holder.entry.phases[concentration] = row[column] || "-";
    });
  });

  const output = {
    concentrations,
    datasets: Object.fromEntries(datasetOrder.map((dataset) => [dataset, []])),
  };

  [...byDatasetSample.values()].forEach(({ dataset, entry }) => {
    output.datasets[dataset] ||= [];
    output.datasets[dataset].push(entry);
  });

  Object.values(output.datasets).forEach((samples) => {
    samples.sort((a, b) => a.sample - b.sample);
  });

  return output;
}

function synthesisIndex(value, syntheses) {
  const text = String(value || "").trim();
  const numeric = numberOrNull(text);
  if (numeric !== null && numeric >= 1 && numeric <= syntheses.length) return numeric - 1;

  const normalized = normalizeKey(text);
  const index = syntheses.findIndex((label) => normalizeKey(label) === normalized);
  if (index >= 0) return index;

  if (normalized.includes("first")) return 0;
  if (normalized.includes("second")) return 1;
  if (normalized.includes("third")) return 2;
  return 0;
}

function ensureXrdSlot(output, dataset, sample, concentration, syntheses) {
  output.datasets[dataset] ||= {};
  output.datasets[dataset][sample] ||= {};
  output.datasets[dataset][sample][concentration] ||= syntheses.map(() => null);
  return output.datasets[dataset][sample][concentration];
}

function buildXrdLongData(headers, records, args) {
  const concentrations = splitList(args.concentrations, DEFAULT_CONCENTRATIONS);
  const datasets = splitList(args.datasets, DEFAULT_DATASETS);
  const syntheses = splitList(args.syntheses, DEFAULT_SYNTHESES);
  const sampleCount = Number(args["sample-count"] || 36);
  const stride = Math.max(1, Number(args.stride || 2));
  const xMin = Number(args["x-min"] || 5);
  const xMax = Number(args["x-max"] || 20);

  const datasetCol = findColumn(headers, ["dataset", "washing", "wash"]);
  const sampleCol = findColumn(headers, ["sample", "sample number", "sample_number", "id"]);
  const concentrationCol = findColumn(headers, ["concentration", "conc", "total concentration"]);
  const synthesisCol = findColumn(headers, ["synthesis", "replicate", "replicate index", "run"]);
  const xCol = findColumn(headers, ["x", "2theta", "2 theta", "two theta", "angle", "degree"]);
  const yCol = findColumn(headers, ["y", "intensity", "normalized intensity", "counts"]);

  if (!sampleCol || !concentrationCol || !xCol || !yCol) {
    throw new Error("xrd-long preset requires sample, concentration, x/2theta, and y/intensity columns.");
  }

  const output = {
    x: { start: xMin, step: 0.02, count: 0, label: "2theta [degree]" },
    y: { label: "Normalized intensity [a.u.]" },
    syntheses,
    expectedPatterns: syntheses.length * concentrations.length * datasets.length * sampleCount,
    sourceFiles: 0,
    missingPatterns: [],
    datasets: Object.fromEntries(datasets.map((dataset) => [dataset, {}])),
  };

  datasets.forEach((dataset) => {
    for (let sample = 1; sample <= sampleCount; sample += 1) {
      concentrations.forEach((concentration) => {
        ensureXrdSlot(output, dataset, String(sample), concentration, syntheses);
      });
    }
  });

  const groups = new Map();
  records.forEach((row) => {
    const dataset = (datasetCol ? row[datasetCol] : args.dataset) || datasets[0];
    const sample = numberOrNull(row[sampleCol]);
    const concentration = normalizeConcentrationLabel(row[concentrationCol], concentrations);
    const sIndex = synthesisIndex(synthesisCol ? row[synthesisCol] : "1", syntheses);
    const x = numberOrNull(row[xCol]);
    const y = numberOrNull(row[yCol]);
    if (!dataset || !Number.isFinite(sample) || !concentration || !Number.isFinite(x) || !Number.isFinite(y)) return;
    if (x < xMin || x > xMax) return;

    const key = `${dataset}|${sample}|${concentration}|${sIndex}`;
    if (!groups.has(key)) groups.set(key, { dataset, sample: String(sample), concentration, sIndex, points: [] });
    groups.get(key).points.push({ x, y });
  });

  let metadataSet = false;
  groups.forEach((group) => {
    const points = group.points.sort((a, b) => a.x - b.x).filter((_, index) => index % stride === 0);
    if (!points.length) return;

    const maxIntensity = Math.max(...points.map((point) => point.y));
    const divisor = maxIntensity > 0 ? maxIntensity : 1;
    const y = points.map((point) => Number(((point.y / divisor) * 100).toFixed(1)));

    if (!metadataSet) {
      output.x.start = points[0].x;
      output.x.step = Number(((points[Math.min(1, points.length - 1)].x || points[0].x) - points[0].x).toFixed(5));
      output.x.count = y.length;
      metadataSet = true;
    }

    const slot = ensureXrdSlot(output, group.dataset, group.sample, group.concentration, syntheses);
    slot[group.sIndex] = y;
    output.sourceFiles += 1;
  });

  datasets.forEach((dataset) => {
    for (let sample = 1; sample <= sampleCount; sample += 1) {
      concentrations.forEach((concentration) => {
        const triplicates = ensureXrdSlot(output, dataset, String(sample), concentration, syntheses);
        triplicates.forEach((pattern, index) => {
          if (!pattern) {
            output.missingPatterns.push({ dataset, sample, concentration, synthesis: syntheses[index] });
          }
        });
      });
    }
  });

  return output;
}

function toWindowAssignment(variableName, data, pretty, banner) {
  const spacing = pretty ? 2 : 0;
  return `${banner}\nwindow.${variableName} = ${JSON.stringify(data, null, spacing)};\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const [inputPath, outputPath] = args._;
  if (!inputPath || !outputPath || args.help) {
    usage();
    process.exit(inputPath && outputPath ? 0 : 1);
  }

  const preset = args.preset || "raw";
  const defaultVariable = preset === "phase" ? "PHASE_DATA" : preset === "xrd-long" ? "XRD_DATA" : "CSV_DATA";
  const variableName = args.var || defaultVariable;
  const { headers, records, delimiter } = parseCsvObjects(inputPath, args.delimiter);

  let data;
  if (preset === "phase") {
    data = buildPhaseData(headers, records, args);
  } else if (preset === "xrd-long") {
    data = buildXrdLongData(headers, records, args);
  } else if (preset === "raw") {
    data = buildRawData(records, args);
  } else {
    throw new Error(`Unknown preset: ${preset}`);
  }

  const banner = `/* Generated from ${path.basename(inputPath)} with csv-to-js-data.js. Do not edit manually. */`;
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, toWindowAssignment(variableName, data, args.pretty, banner), "utf8");

  console.log(`Read ${records.length} CSV rows with delimiter ${JSON.stringify(delimiter)}.`);
  console.log(`Preset: ${preset}`);
  console.log(`Wrote window.${variableName} to ${outputPath}`);
}

try {
  main();
} catch (error) {
  console.error(error.message || error);
  process.exit(1);
}
