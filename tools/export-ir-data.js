const fs = require("fs");
const path = require("path");

const [, , sourceRoot, outputPath] = process.argv;

if (!sourceRoot || !outputPath) {
  console.error("Usage: node tools/export-ir-data.js <ATR IR (TXT) folder> <output data/ir-data.js>");
  process.exit(1);
}

const concentrationLabels = {
  "12,5": "12.5 mg/mL",
  "25": "25 mg/mL",
  "50": "50 mg/mL",
  "75": "75 mg/mL",
  "100": "100 mg/mL",
};

const datasets = ["WW", "EW"];
const dataLine = /^\s*(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/;
const stride = 2;

function parseSpectrum(filePath) {
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  const points = [];

  lines.forEach((line) => {
    const match = dataLine.exec(line);
    if (!match) return;

    const x = Number(match[1]);
    const y = Number(match[2]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    points.push({ x, y });
  });

  if (!points.length) return null;

  const sampled = points.filter((_, index) => index % stride === 0);
  const ys = sampled.map((point) => point.y);
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const range = max > min ? max - min : 1;
  const y = ys.map((value) => Number((((value - min) / range) * 100).toFixed(1)));

  return {
    start: sampled[0].x,
    step: Number(((sampled[Math.min(1, sampled.length - 1)].x || sampled[0].x) - sampled[0].x).toFixed(5)),
    count: y.length,
    y,
  };
}

function ensureSpectrumSlot(output, dataset, sample, concentration) {
  output.datasets[dataset][sample] ||= {};
  output.datasets[dataset][sample][concentration] ||= null;
  return output.datasets[dataset][sample][concentration];
}

function sampleNumberFromFile(fileName) {
  const base = path.parse(fileName).name.replace(/[.,]\d+$/i, "");
  const match = /-(\d{1,2})(?:[A-Z]+)?$/i.exec(base);
  if (!match) return null;

  const sample = Number(match[1]);
  return sample >= 1 && sample <= 36 ? sample : null;
}

function datasetFromPath(filePath) {
  const text = filePath.toUpperCase();
  if (text.includes("WW")) return "WW";
  if (text.includes("EW")) return "EW";
  return null;
}

const output = {
  x: {
    start: 3997.10701,
    step: -4.11225,
    count: 875,
    label: "Wavelength [cm^-1]",
  },
  y: {
    label: "Normalized absorbance [a.u.]",
  },
  expectedSpectra: Object.keys(concentrationLabels).length * datasets.length * 36,
  sourceFiles: 0,
  missingSpectra: [],
  datasets: {
    WW: {},
    EW: {},
  },
};

let parsedFiles = 0;
let metadataSet = false;

datasets.forEach((dataset) => {
  for (let sample = 1; sample <= 36; sample += 1) {
    Object.values(concentrationLabels).forEach((concentration) => {
      ensureSpectrumSlot(output, dataset, String(sample), concentration);
    });
  }
});

Object.entries(concentrationLabels).forEach(([folderConcentration, concentration]) => {
  const concentrationRoot = path.join(sourceRoot, folderConcentration);
  if (!fs.existsSync(concentrationRoot)) return;

  fs.readdirSync(concentrationRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .forEach((entry) => {
      const directory = path.join(concentrationRoot, entry.name);
      fs.readdirSync(directory)
        .filter((fileName) => fileName.toLowerCase().endsWith(".txt"))
        .forEach((fileName) => {
          const dataset = datasetFromPath(path.join(directory, fileName));
          const sample = sampleNumberFromFile(fileName);
          if (!dataset || !sample || sample < 1 || sample > 36) return;

          const parsed = parseSpectrum(path.join(directory, fileName));
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

          output.datasets[dataset][String(sample)][concentration] = parsed.y;
          parsedFiles += 1;
        });
    });
});

output.sourceFiles = parsedFiles;
datasets.forEach((dataset) => {
  for (let sample = 1; sample <= 36; sample += 1) {
    Object.values(concentrationLabels).forEach((concentration) => {
      if (!output.datasets[dataset][String(sample)][concentration]) {
        output.missingSpectra.push({ dataset, sample, concentration });
      }
    });
  }
});

const banner = "/* Generated from ATR IR TXT files. Do not edit manually. */\n";
const js = `${banner}window.IR_DATA = ${JSON.stringify(output)};\n`;
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, js);

console.log(`Parsed ${parsedFiles} IR TXT files into ${output.expectedSpectra} expected spectrum slots.`);
console.log(`Missing spectrum slots: ${output.missingSpectra.length}.`);
console.log(`Wrote ${outputPath}`);
