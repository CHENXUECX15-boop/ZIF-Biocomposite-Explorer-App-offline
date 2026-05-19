const fs = require("fs");
const path = require("path");

const [, , sourceRoot, outputPath] = process.argv;

if (!sourceRoot || !outputPath) {
  console.error("Usage: node tools/export-xrd-data.js <XRD(TXT) folder> <output data/xrd-data.js>");
  process.exit(1);
}

const syntheses = [
  { folder: "first synthesis", label: "First synthesis", index: 0 },
  { folder: "second synthesis", label: "Second synthesis", index: 1 },
  { folder: "third synthesis", label: "Third synthesis", index: 2 },
];

const concentrationLabels = {
  "12.5": "12.5 mg/mL",
  "25": "25 mg/mL",
  "50": "50 mg/mL",
  "75": "75 mg/mL",
  "100": "100 mg/mL",
};

const datasets = ["WW", "EW"];
const dataLine = /^\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/;
const stride = 2;

function parsePattern(filePath) {
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  const points = [];

  lines.forEach((line) => {
    const match = dataLine.exec(line);
    if (!match) return;

    const x = Number(match[1]);
    const y = Number(match[2]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    if (x < 5 || x > 20) return;
    points.push({ x, y });
  });

  if (!points.length) return null;

  const maxIntensity = Math.max(...points.map((point) => point.y));
  const divisor = maxIntensity > 0 ? maxIntensity : 1;
  const y = points
    .filter((_, index) => index % stride === 0)
    .map((point) => Number(((point.y / divisor) * 100).toFixed(1)));

  return {
    start: points[0].x,
    step: Number(((points[Math.min(stride, points.length - 1)].x || points[0].x) - points[0].x).toFixed(4)),
    count: y.length,
    y,
  };
}

function ensurePatternSlot(output, dataset, sample, concentration) {
  output.datasets[dataset][sample] ||= {};
  output.datasets[dataset][sample][concentration] ||= [null, null, null];
  return output.datasets[dataset][sample][concentration];
}

function sampleNumberFromFile(fileName, dataset) {
  const match = new RegExp(`(?:^|_)(\\d+)${dataset}(?:_\\d+)?\\.txt$`, "i").exec(fileName);
  return match ? Number(match[1]) : null;
}

const output = {
  x: {
    start: 5,
    step: 0.02,
    count: 751,
    label: "2theta [degree]",
  },
  y: {
    label: "Normalized intensity [a.u.]",
  },
  syntheses: syntheses.map((item) => item.label),
  expectedPatterns: syntheses.length * Object.keys(concentrationLabels).length * datasets.length * 36,
  sourceFiles: 0,
  missingPatterns: [],
  datasets: {
    WW: {},
    EW: {},
  },
};

let parsedFiles = 0;
let missingDirectories = 0;
let metadataSet = false;

datasets.forEach((dataset) => {
  for (let sample = 1; sample <= 36; sample += 1) {
    Object.values(concentrationLabels).forEach((concentration) => {
      ensurePatternSlot(output, dataset, String(sample), concentration);
    });
  }
});

syntheses.forEach((synthesis) => {
  Object.entries(concentrationLabels).forEach(([folderConcentration, concentration]) => {
    datasets.forEach((dataset) => {
      const directory = path.join(sourceRoot, synthesis.folder, folderConcentration, dataset);
      if (!fs.existsSync(directory)) {
        missingDirectories += 1;
        return;
      }

      fs.readdirSync(directory)
        .filter((fileName) => fileName.toLowerCase().endsWith(".txt"))
        .forEach((fileName) => {
          const sample = sampleNumberFromFile(fileName, dataset);
          if (!sample) return;

          const parsed = parsePattern(path.join(directory, fileName));
          if (!parsed) return;

          if (!metadataSet) {
            output.x = {
              ...output.x,
              start: parsed.start,
              step: parsed.step,
              count: parsed.count,
            };
            metadataSet = true;
          }

          const slot = ensurePatternSlot(output, dataset, String(sample), concentration);
          slot[synthesis.index] = parsed.y;
          parsedFiles += 1;
        });
    });
  });
});

output.sourceFiles = parsedFiles;
datasets.forEach((dataset) => {
  for (let sample = 1; sample <= 36; sample += 1) {
    Object.values(concentrationLabels).forEach((concentration) => {
      const triplicates = output.datasets[dataset][String(sample)][concentration];
      triplicates.forEach((pattern, index) => {
        if (!pattern) {
          output.missingPatterns.push({
            dataset,
            sample,
            concentration,
            synthesis: syntheses[index].label,
          });
        }
      });
    });
  }
});

const banner = "/* Generated from XRD TXT files. Do not edit manually. */\n";
const js = `${banner}window.XRD_DATA = ${JSON.stringify(output)};\n`;
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, js);

console.log(`Parsed ${parsedFiles} XRD TXT files into ${output.expectedPatterns} expected pattern slots.`);
console.log(`Missing pattern slots: ${output.missingPatterns.length}.`);
if (missingDirectories) {
  console.log(`Skipped ${missingDirectories} missing directories.`);
}
console.log(`Wrote ${outputPath}`);
