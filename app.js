const SVG_NS = "http://www.w3.org/2000/svg";

const palette = {
  amorphous: "#A5A5A5",
  "ZIF-C": "#20D1DC",
  sod: "#4900F8",
  dia: "#F10000",
  U13: "#DDB600",
  U12: "#00E45C",
  mixed: "#9933FF",
  missing: "#4A4A4A",
  other: "#8D735B",
};

const mixedLegendColors = {
  left: "#F10000",
  right: "#20D1DC",
};

const frameworkModeKey = "FRAMEWORK";
const frameworkComponentDefaults = [
  { key: "crystallinity", label: "crystalline ZIF", color: palette.mixed },
  { key: "amorphous", label: "Am-ZIF", color: palette.amorphous },
  { key: "protein", label: "Am-protein", color: "#EE0000" },
];

const phaseFamilies = [
  ["amorphous", "amorphous"],
  ["ZIF-C", "ZIF-C"],
  ["sod", "sod"],
  ["dia", "dia"],
  ["U13", "U13"],
  ["U12", "U12"],
  ["mixed", "mixed"],
];

const phaseReplicateStats = {
  WW: {
    17: {
      "25 mg/mL": [
        { token: "sod", mean: 6, error: 4.582576 },
        { token: "ZIF-C", mean: 94, error: 4.582576 },
      ],
      "75 mg/mL": [
        { token: "sod", mean: 2, error: 0 },
        { token: "ZIF-C", mean: 98, error: 0 },
      ],
      "100 mg/mL": [
        { token: "sod", mean: 9, error: 7 },
        { token: "ZIF-C", mean: 91, error: 7 },
      ],
    },
    18: {
      "25 mg/mL": [
        { token: "sod", mean: 3.666667, error: 2.886751 },
        { token: "ZIF-C", mean: 96.333333, error: 2.886751 },
      ],
      "50 mg/mL": [
        { token: "sod", mean: 2.666667, error: 1.154701 },
        { token: "ZIF-C", mean: 97.333333, error: 1.154701 },
      ],
      "75 mg/mL": [
        { token: "sod", mean: 4, error: 3.464102 },
        { token: "ZIF-C", mean: 96, error: 3.464102 },
      ],
      "100 mg/mL": [
        { token: "sod", mean: 7.333333, error: 2.081666 },
        { token: "ZIF-C", mean: 92.666667, error: 2.081666 },
      ],
    },
    19: {
      "50 mg/mL": [
        { token: "sod", mean: 16.333333, error: 7.637626 },
        { token: "ZIF-C", mean: 83.666667, error: 7.637626 },
      ],
    },
    25: {
      "75 mg/mL": [
        { token: "ZIF-C", mean: 74.333333, error: 16.802778 },
        { token: "U12", mean: 25.666667, error: 16.802778 },
      ],
    },
    27: {
      "25 mg/mL": [
        { token: "sod", mean: 57.666667, error: 8.736895 },
        { token: "ZIF-C", mean: 42.333333, error: 8.736895 },
      ],
    },
    31: {
      "25 mg/mL": [
        { token: "sod", mean: 17.333333, error: 3.05505 },
        { token: "ZIF-C", mean: 82.666667, error: 3.05505 },
      ],
    },
    32: {
      "25 mg/mL": [
        { token: "dia", mean: 54, error: 25.059928 },
        { token: "ZIF-C", mean: 46, error: 25.059928 },
      ],
    },
    34: {
      "25 mg/mL": [
        { token: "sod", mean: 24.333333, error: 14.189198 },
        { token: "dia", mean: 75.666667, error: 14.189198 },
      ],
      "50 mg/mL": [
        { token: "sod", mean: 26, error: 12.124356 },
        { token: "dia", mean: 74, error: 12.124356 },
      ],
      "75 mg/mL": [
        { token: "sod", mean: 59.666667, error: 33.724373 },
        { token: "dia", mean: 40.333333, error: 33.724373 },
      ],
    },
    35: {
      "25 mg/mL": [
        { token: "sod", mean: 93.333333, error: 2.886751 },
        { token: "ZIF-C", mean: 6.666667, error: 4.041452 },
      ],
    },
  },
  EW: {
    32: {
      "75 mg/mL": [
        { token: "sod", mean: 10.666667, error: 3.21455 },
        { token: "dia", mean: 89.333333, error: 3.21455 },
      ],
      "100 mg/mL": [
        { token: "sod", mean: 12.333333, error: 8.621678 },
        { token: "dia", mean: 87.666667, error: 8.621678 },
      ],
    },
  },
};

const phaseTokenPattern = "amorphous|ZIF-C|Sodalite|SOD|DIA|U13|U12";

const metricModes = [
  ["Phase", "phase"],
  ["EE%", "EE"],
  ["LC%", "LC"],
  ["IR-ratio [%]", "IR"],
  ["Amorphous fraction [%]", "AF"],
  ["Framework to amorphous ratio", frameworkModeKey],
];

const metricPalettes = {
  EE: { low: "#FFFFFF", high: "#EE0000", missing: "#4A4A4A" },
  LC: { low: "#FFFFFF", high: "#EE0000", missing: "#4A4A4A" },
  IR: { low: "#FFFFFF", high: "#EE0000", missing: "#4A4A4A" },
  AF: { low: "#FFFFFF", high: "#757575", missing: "#4A4A4A", colorMin: 30, colorMax: 100 },
};

const valueFilterKeys = ["M", "L", "BSA", "EE", "LC", "IR", "AF"];
const valueFilterLabels = {
  M: "M (wt.%)",
  L: "L (wt.%)",
  BSA: "BSA (wt.%)",
  EE: "EE%",
  LC: "LC%",
  IR: "IR-ratio [%]",
  AF: "Amorphous fraction [%]",
};

const fontScaleOptions = [0.5, 0.75, 1, 1.5, 2, 2.5, 3];
const sampleSizeLevels = fontScaleOptions;

const defaultValueFilters = Object.freeze({
  M: Object.freeze({ min: 0, max: 100 }),
  L: Object.freeze({ min: 0, max: 100 }),
  BSA: Object.freeze({ min: 0, max: 100 }),
  EE: Object.freeze({ min: 0, max: 100 }),
  LC: Object.freeze({ min: 0, max: 100 }),
  IR: Object.freeze({ min: 0, max: 100 }),
  AF: Object.freeze({ min: 0, max: 100 }),
});

const plot = {
  width: 1320,
  height: 1280,
  triangleWidth: 500,
  triangleHeight: 433,
  minLayerGap: 130,
  maxLayerGap: 285,
  defaultLayerGap: 200,
  layerGapStep: 1,
  margin: 76,
  gridStep: 38,
  exportScale: 4,
};

const xrdPlot = {
  width: 520,
  height: 330,
  margin: { top: 22, right: 18, bottom: 42, left: 50 },
  colors: ["#172124", "#172124", "#172124"],
};

const irPlot = {
  width: 520,
  height: 260,
  margin: { top: 18, right: 18, bottom: 42, left: 54 },
  color: "#EE0000",
};
const irRawYMax = 100;
const irDisplayYMax = 1;

const datasetLabels = Object.freeze({
  WW: Object.freeze({ text: "TD-H2O", parts: ["TD-H", "2", "O"] }),
  EW: Object.freeze({ text: "TD-EtOH", parts: ["TD-EtOH"] }),
});

const defaultView = {
  rotationX: 1.25,
  rotationY: 0,
  rotationZ: 0,
  zoom: 1,
  panX: 0,
  panY: 0,
};

const concentrationLabelLayout = Object.freeze({
  gapRatio: 0.18,
  baselineRatio: 0.34,
});

const searchConcentrationBounds = Object.freeze({
  min: 12.5,
  max: 100,
  step: 1,
});

const defaultSearchPoint = Object.freeze({
  M: "",
  L: "",
  BSA: "",
  concentration: "25",
  autoKey: null,
});

let state = {
  dataset: "WW",
  sample: 35,
  concentration: "25 mg/mL",
  layerGap: plot.defaultLayerGap,
  visibleConcentration: "all",
  phaseFilter: "all",
  visualization: "phase",
  showSampleNumbers: true,
  showConcentrationLabels: true,
  showAxisLabels: true,
  showAxisTicks: true,
  concentrationFontScale: 1,
  axisTickFontScale: 1,
  axisLabelFontScale: 1,
  legendFontScale: 1,
  sampleCircleSizeLevel: 1,
  sampleNumberSizeLevel: 1,
  xrdZoom: 1,
  xrdPan: 0,
  irZoom: 1,
  irPan: 0,
  valueFilters: valueFilterKeys.reduce(
    (filters, key) => ({ ...filters, [key]: { ...defaultValueFilters[key] } }),
    {},
  ),
  searchPoint: { ...defaultSearchPoint },
  dragMode: "rotate",
  ...defaultView,
};

let dragState = null;
let hitTargets = [];
let isExporting = false;

const els = {
  svg: document.getElementById("ternaryStack"),
  plotFrame: document.querySelector(".plot-frame"),
  legend: document.getElementById("legend"),
  phaseLegendDock: document.getElementById("phaseLegendDock"),
  tabs: Array.from(document.querySelectorAll(".dataset-tab")),
  concentrationFilters: document.getElementById("concentrationFilters"),
  visualizationFilters: document.getElementById("visualizationFilters"),
  sampleNumberToggle: document.getElementById("sampleNumberToggle"),
  concentrationLabelToggle: document.getElementById("concentrationLabelToggle"),
  axisLabelToggle: document.getElementById("axisLabelToggle"),
  axisTickToggle: document.getElementById("axisTickToggle"),
  concentrationFontScale: document.getElementById("concentrationFontScale"),
  axisTickFontScale: document.getElementById("axisTickFontScale"),
  axisLabelFontScale: document.getElementById("axisLabelFontScale"),
  legendFontScale: document.getElementById("legendFontScale"),
  sampleCircleSizeLevel: document.getElementById("sampleCircleSizeLevel"),
  sampleNumberSizeLevel: document.getElementById("sampleNumberSizeLevel"),
  layerGapControl: document.getElementById("layerGapControl"),
  layerGapNumber: document.getElementById("layerGapNumber"),
  valueFilters: document.getElementById("valueFilters"),
  resetValueFilters: document.getElementById("resetValueFilters"),
  compositionSearch: document.getElementById("compositionSearch"),
  searchInputs: Array.from(document.querySelectorAll("[data-search-key]")),
  searchConcentration: document.getElementById("searchConcentration"),
  clearSearchPoint: document.getElementById("clearSearchPoint"),
  searchStatus: document.getElementById("searchStatus"),
  phaseFilters: document.getElementById("phaseFilters"),
  modeTabs: Array.from(document.querySelectorAll(".mode-tab")),
  resetView: document.getElementById("resetView"),
  downloadPng: document.getElementById("downloadPng"),
  downloadPagePng: document.getElementById("downloadPagePng"),
  zoomIn: document.getElementById("zoomIn"),
  zoomOut: document.getElementById("zoomOut"),
  viewButtons: Array.from(document.querySelectorAll("[data-view]")),
  detailDataset: document.getElementById("detailDataset"),
  detailHeaderConcentration: document.getElementById("detailHeaderConcentration"),
  detailTitle: document.getElementById("detailTitle"),
  selectedConcentration: document.getElementById("selectedConcentration"),
  selectedPhase: document.getElementById("selectedPhase"),
  detailM: document.getElementById("detailM"),
  detailL: document.getElementById("detailL"),
  detailBSA: document.getElementById("detailBSA"),
  detailRatio: document.getElementById("detailRatio"),
  detailEE: document.getElementById("detailEE"),
  detailLC: document.getElementById("detailLC"),
  detailIR: document.getElementById("detailIR"),
  detailAF: document.getElementById("detailAF"),
  detailFramework: document.getElementById("detailFramework"),
  phaseRows: document.getElementById("phaseRows"),
  xrdPlot: document.getElementById("xrdPlot"),
  xrdLegend: document.getElementById("xrdLegend"),
  xrdStatus: document.getElementById("xrdStatus"),
  xrdZoomIn: document.getElementById("xrdZoomIn"),
  xrdZoomOut: document.getElementById("xrdZoomOut"),
  xrdDownloadPng: document.getElementById("xrdDownloadPng"),
  xrdDownloadCsv: document.getElementById("xrdDownloadCsv"),
  xrdReset: document.getElementById("xrdReset"),
  irPlot: document.getElementById("irPlot"),
  irStatus: document.getElementById("irStatus"),
  irZoomIn: document.getElementById("irZoomIn"),
  irZoomOut: document.getElementById("irZoomOut"),
  irDownloadPng: document.getElementById("irDownloadPng"),
  irDownloadCsv: document.getElementById("irDownloadCsv"),
  irReset: document.getElementById("irReset"),
};

function createSvgElement(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => {
    node.setAttribute(key, value);
  });
  return node;
}

function formatNumber(value, digits = 3) {
  return Number(value).toLocaleString("en-US", {
    maximumFractionDigits: digits,
  });
}

function concentrationPrefix(value) {
  return String(value).replace(/\s*mg\/mL/i, " mg mL");
}

function formatConcentrationPlain(value) {
  return `${concentrationPrefix(value)}^-1`;
}

function formatConcentrationFile(value) {
  return `${concentrationPrefix(value)}-1`.replace(/\s+/g, "-");
}

function renderConcentrationHtml(container, value) {
  const sup = document.createElement("sup");
  sup.textContent = "-1";
  container.replaceChildren(document.createTextNode(concentrationPrefix(value)), sup);
}

function datasetLabelParts(dataset) {
  return datasetLabels[dataset]?.parts || [String(dataset || "")];
}

function datasetPlainLabel(dataset) {
  return datasetLabels[dataset]?.text || String(dataset || "");
}

function renderDatasetLabel(container, dataset) {
  const parts = datasetLabelParts(dataset);
  if (parts.length === 3) {
    const sub = document.createElement("sub");
    sub.textContent = parts[1];
    container.replaceChildren(document.createTextNode(parts[0]), sub, document.createTextNode(parts[2]));
    return;
  }
  container.textContent = parts.join("");
}

function searchPointValue(rawValue) {
  const text = String(rawValue ?? "").trim();
  if (!text) return null;
  const value = Number(text);
  return Number.isFinite(value) ? value : null;
}

function formatSearchInputValue(value) {
  const rounded = Number(value.toFixed(2));
  return Number.isFinite(rounded) ? String(rounded) : "";
}

function fixedConcentrationValue(concentration) {
  const value = Number.parseFloat(String(concentration ?? ""));
  return Number.isFinite(value) ? value : null;
}

function searchConcentrationValue(rawValue) {
  const text = String(rawValue ?? "").trim();
  if (!text) return null;
  const value = Number(text);
  if (
    !Number.isFinite(value) ||
    value < searchConcentrationBounds.min ||
    value > searchConcentrationBounds.max
  ) {
    return null;
  }
  return value;
}

function formatSearchConcentrationValue(value) {
  return formatNumber(value, 1);
}

function formatSearchConcentrationPlain(value) {
  return `${formatSearchConcentrationValue(value)} mg mL^-1`;
}

function searchConcentrationLayerIndex(value) {
  const layers = PHASE_DATA.concentrations
    .map((concentration, index) => ({
      concentration,
      index,
      value: fixedConcentrationValue(concentration),
    }))
    .filter((layer) => layer.value !== null);
  if (!layers.length) return 0;
  if (value <= layers[0].value) return layers[0].index;

  for (let index = 0; index < layers.length - 1; index += 1) {
    const lower = layers[index];
    const upper = layers[index + 1];
    if (value <= upper.value) {
      const span = Math.max(1, upper.value - lower.value);
      const progress = (value - lower.value) / span;
      return lower.index + (upper.index - lower.index) * progress;
    }
  }

  return layers[layers.length - 1].index;
}

function searchMatchesFixedLayer(concentration, value) {
  const fixedValue = fixedConcentrationValue(concentration);
  return fixedValue !== null && Math.abs(fixedValue - value) <= 0.05;
}

function autoCompleteSearchPoint(searchPoint, changedKey = null) {
  const keys = ["M", "L", "BSA"];
  const next = { ...searchPoint };
  const previousAutoKey = state.searchPoint.autoKey;
  if (previousAutoKey && changedKey === previousAutoKey) {
    next.autoKey = null;
  } else if (previousAutoKey && keys.includes(previousAutoKey)) {
    const sourceKeys = keys.filter((key) => key !== previousAutoKey);
    const sourceValues = sourceKeys.map((key) => searchPointValue(next[key]));
    if (sourceValues.every((value) => value !== null && value >= 0 && value <= 100)) {
      const remaining = 100 - sourceValues.reduce((sum, value) => sum + value, 0);
      if (remaining >= -0.05 && remaining <= 100.05) {
        next[previousAutoKey] = formatSearchInputValue(clamp(remaining, 0, 100));
        next.autoKey = previousAutoKey;
        return next;
      }
    }
    next[previousAutoKey] = "";
    next.autoKey = null;
  }

  const filledKeys = keys.filter((key) => String(next[key] ?? "").trim() !== "");
  if (filledKeys.length !== 2) return next;

  const missingKey = keys.find((key) => !filledKeys.includes(key));
  const values = filledKeys.map((key) => searchPointValue(next[key]));
  if (!missingKey || !values.every((value) => value !== null && value >= 0 && value <= 100)) {
    return next;
  }

  const remaining = 100 - values.reduce((sum, value) => sum + value, 0);
  if (remaining < -0.05 || remaining > 100.05) return next;
  next[missingKey] = formatSearchInputValue(clamp(remaining, 0, 100));
  next.autoKey = missingKey;
  return next;
}

function searchPointStatus(searchPoint = state.searchPoint) {
  const rawValues = [searchPoint.M, searchPoint.L, searchPoint.BSA].map((value) =>
    String(value ?? "").trim(),
  );
  const hasInput = rawValues.some(Boolean);
  const concentration = searchConcentrationValue(searchPoint.concentration);
  const fallbackConcentration =
    searchConcentrationValue(defaultSearchPoint.concentration) ?? searchConcentrationBounds.min;
  if (!hasInput) {
    return {
      valid: false,
      hasInput,
      concentration: concentration ?? fallbackConcentration,
      message: "",
    };
  }

  if (concentration === null) {
    return {
      valid: false,
      hasInput,
      concentration: fallbackConcentration,
      message: `Conc. ${searchConcentrationBounds.min}-${searchConcentrationBounds.max}`,
    };
  }

  const [m, l, bsa] = rawValues.map(searchPointValue);
  if (
    [m, l, bsa].some(
      (value, index) => rawValues[index] && (value === null || value < 0 || value > 100),
    )
  ) {
    return { valid: false, hasInput, concentration, message: "Use 0-100" };
  }

  if (![m, l, bsa].every((value) => value !== null)) {
    const partialTotal = [m, l, bsa].reduce(
      (sum, value) => sum + (value === null ? 0 : value),
      0,
    );
    return {
      valid: false,
      hasInput,
      concentration,
      total: partialTotal,
      message: partialTotal > 100.05 ? `Total ${formatNumber(partialTotal, 1)}%` : "",
    };
  }

  const total = m + l + bsa;
  if (Math.abs(total - 100) > 0.05) {
    return {
      valid: false,
      hasInput,
      m,
      l,
      bsa,
      concentration,
      total,
      message: `Total ${formatNumber(total, 1)}%`,
    };
  }

  return {
    valid: true,
    hasInput,
    m,
    l,
    bsa,
    concentration,
    total,
    message: `${formatNumber(total, 1)}%`,
  };
}

function visualSizeScale() {
  if (isExporting) {
    return 0.78;
  }
  return Math.min(2.8, Math.max(1.25, 1.25 + (state.zoom - 1) * 0.9));
}

function scaledSize(value) {
  return value * visualSizeScale();
}

function scaledSampleSize(value) {
  return scaledSize(value) * (isExporting ? 1.6 : 1);
}

function sampleSizeLevelScale(level) {
  const value = Number(level);
  return sampleSizeLevels.includes(value) ? value : 1;
}

function scaledSampleCircleSize(value) {
  return scaledSampleSize(value) * sampleSizeLevelScale(state.sampleCircleSizeLevel);
}

function scaledSampleNumberSize(value) {
  return scaledSampleSize(value) * sampleSizeLevelScale(state.sampleNumberSizeLevel);
}

function textSizeForClass(className) {
  const sizes = {
    "layer-label": 21,
    "axis-label": 16,
    "tick-label": 11,
    "sample-number": 13.5,
  };
  const scaleByClass = {
    "layer-label": state.concentrationFontScale,
    "axis-label": state.axisLabelFontScale,
    "tick-label": state.axisTickFontScale,
  };
  return (sizes[className] || 16) * (scaleByClass[className] || 1);
}

function readFontScale(control) {
  const value = Number(control?.value);
  return fontScaleOptions.includes(value) ? value : 1;
}

function legendFontScaleValue() {
  const value = Number(state.legendFontScale);
  return fontScaleOptions.includes(value) ? value : 1;
}

function readSampleSizeLevel(control) {
  const value = Number(control?.value);
  return sampleSizeLevels.includes(value) ? value : 1;
}

function svgConcentrationText(group, value, point, className, attrs = {}) {
  const node = createSvgElement("text", {
    class: className,
    x: point.x,
    y: point.y,
    style: `font-size: ${scaledSize(textSizeForClass(className))}px`,
    ...attrs,
  });
  const base = createSvgElement("tspan");
  base.textContent = concentrationPrefix(value);
  const sup = createSvgElement("tspan", {
    "baseline-shift": "super",
    "font-size": "70%",
  });
  sup.textContent = "-1";
  node.append(base, sup);
  group.append(node);
  return node;
}

function normalizedToken(token) {
  const upper = String(token).toUpperCase();
  if (upper === "SOD" || upper === "SODALITE") return "sod";
  if (upper === "DIA") return "dia";
  if (upper === "AMORPHOUS") return "amorphous";
  if (upper === "ZIF-C") return "ZIF-C";
  if (upper === "U13") return "U13";
  if (upper === "U12") return "U12";
  return token;
}

function displayPhasePlain(phase) {
  return String(phase || "-").replace(
    /amorphous|ZIF-C|Sodalite|SOD|DIA|U13|U12/gi,
    (match) => normalizedToken(match),
  );
}

function phaseStatsFor(sampleOrNumber, concentration, dataset = state.dataset) {
  const sampleNumber =
    typeof sampleOrNumber === "object" ? sampleOrNumber?.sample : sampleOrNumber;
  return phaseReplicateStats[dataset]?.[sampleNumber]?.[concentration] || null;
}

function formatPhasePercent(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric.toFixed(1) : "0.0";
}

function formatPhaseComponentText(component, options = {}) {
  const showError = options.showError !== false;
  if (showError && Number.isFinite(component.error)) {
    return `${formatPhasePercent(component.percent)}% +/- ${formatPhasePercent(component.error)}%${component.label}`;
  }
  return `${formatNumber(component.percent, 1)}%${component.label}`;
}

function appendPhaseComponentText(container, component, options = {}) {
  const showError = options.showError !== false && Number.isFinite(component.error);
  const span = document.createElement("span");
  span.className = "phase-component";
  span.style.color = component.color;
  span.style.webkitTextFillColor = component.color;

  if (showError) {
    span.append(document.createTextNode(`${formatPhasePercent(component.percent)}%`));
    const error = document.createElement("span");
    error.className = "phase-error";
    error.style.color = component.color;
    error.style.webkitTextFillColor = component.color;
    error.textContent = ` +/- ${formatPhasePercent(component.error)}%`;
    span.append(error, document.createTextNode(component.label));
  } else {
    span.textContent = formatPhaseComponentText(component, { showError: false });
  }

  container.append(span);
}

function renderPhaseText(container, phase) {
  const source = String(phase || "-");
  const pattern = /amorphous|ZIF-C|Sodalite|SOD|DIA|U13|U12/gi;
  let cursor = 0;
  let match = pattern.exec(source);
  container.replaceChildren();

  while (match) {
    if (match.index > cursor) {
      container.append(document.createTextNode(source.slice(cursor, match.index)));
    }

    const label = normalizedToken(match[0]);
    const color = colorForPhase(label);
    const strong = document.createElement("strong");
    strong.className = "phase-component";
    strong.style.color = color;
    strong.style.webkitTextFillColor = color;
    strong.textContent = label;
    container.append(strong);
    cursor = pattern.lastIndex;
    match = pattern.exec(source);
  }

  if (cursor < source.length) {
    container.append(document.createTextNode(source.slice(cursor)));
  }
}

function renderMixedPhaseText(container, phase, stats = null, options = {}) {
  const components = phaseColorComponents(phase, stats);
  if (components.length < 2) return false;

  container.replaceChildren();

  components.forEach((component, index) => {
    if (index > 0) container.append(document.createTextNode("+"));
    appendPhaseComponentText(container, component, options);
  });
  return true;
}

function normalizePhase(phase) {
  const text = String(phase || "").trim();
  const upper = text.toUpperCase();

  if (!text || text === "-" || upper === "N/A" || upper === "NA") return "missing";
  if (upper.includes("+") || upper.includes("%")) return "mixed";
  if (upper.includes("AMORPHOUS")) return "amorphous";
  if (upper.includes("ZIF-C")) return "ZIF-C";
  if (upper.includes("SOD") || upper.includes("SODALITE")) return "sod";
  if (upper.includes("DIA")) return "dia";
  if (upper.includes("U13")) return "U13";
  if (upper.includes("U12")) return "U12";
  return "other";
}

function colorForPhase(phase) {
  return palette[normalizePhase(phase)] || palette.other;
}

function hexToRgba(hex, alpha = 1) {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function phaseColorComponents(phase, stats = null) {
  if (Array.isArray(stats) && stats.length > 1) {
    const valid = stats
      .map((component) => {
        const label = normalizedToken(component.token);
        return {
          label,
          key: normalizePhase(label),
          percent: Number(component.mean),
          error: Number(component.error),
          color: colorForPhase(label),
        };
      })
      .filter(
        (component) =>
          Number.isFinite(component.percent) && component.percent > 0 && component.key !== "missing",
      );
    const total = valid.reduce((sum, component) => sum + component.percent, 0);
    if (!valid.length || total <= 0) return [];

    return valid.map((component) => ({
      ...component,
      fraction: component.percent / total,
    }));
  }

  const source = String(phase || "").trim();
  if (normalizePhase(source) !== "mixed") return [];

  const components = [];
  const percentPatterns = [
    { regex: new RegExp(`(\\d+(?:\\.\\d+)?)\\s*%\\s*(${phaseTokenPattern})`, "gi"), percent: 1, token: 2 },
    { regex: new RegExp(`(${phaseTokenPattern})\\s*(\\d+(?:\\.\\d+)?)\\s*%`, "gi"), percent: 2, token: 1 },
  ];

  for (const pattern of percentPatterns) {
    let match = pattern.regex.exec(source);
    while (match) {
      const label = normalizedToken(match[pattern.token]);
      components.push({
        label,
        key: normalizePhase(label),
        percent: Number(match[pattern.percent]),
        color: colorForPhase(label),
      });
      match = pattern.regex.exec(source);
    }
    if (components.length) break;
  }

  if (!components.length) {
    const plainToken = new RegExp(phaseTokenPattern, "gi");
    let match = plainToken.exec(source);
    while (match) {
      const label = normalizedToken(match[0]);
      components.push({
        label,
        key: normalizePhase(label),
        percent: 1,
        color: colorForPhase(label),
      });
      match = plainToken.exec(source);
    }
  }

  const valid = components.filter(
    (component) => Number.isFinite(component.percent) && component.percent > 0 && component.key !== "missing",
  );
  const total = valid.reduce((sum, component) => sum + component.percent, 0);
  if (!valid.length || total <= 0) return [];

  return valid.map((component) => ({
    ...component,
    fraction: component.percent / total,
  }));
}

function phaseGradientStops(phase, alpha = 1, showSeparator = false, stats = null) {
  const components = phaseColorComponents(phase, stats);
  if (components.length < 2) return [];

  let cursor = 0;
  let nextStart = 0;
  const separatorColor = alpha < 1 ? "rgba(23, 33, 36, 0.42)" : "#172124";
  const separatorHalfWidth = 0.55;

  return components.flatMap((component, index) => {
    const start = cursor;
    const end = index === components.length - 1 ? 100 : cursor + component.fraction * 100;
    cursor = end;
    const color = alpha < 1 ? hexToRgba(component.color, alpha) : component.color;
    const visibleStart = Math.max(start, nextStart);

    if (showSeparator && index < components.length - 1) {
      const separatorStart = clamp(end - separatorHalfWidth, visibleStart, end);
      const separatorEnd = clamp(end + separatorHalfWidth, end, 100);
      nextStart = separatorEnd;
      return [
        { color, offset: visibleStart },
        { color, offset: separatorStart },
        { color: separatorColor, offset: separatorStart },
        { color: separatorColor, offset: separatorEnd },
      ];
    }

    return [
      { color, offset: visibleStart },
      { color, offset: end },
    ];
  });
}

function phaseGradientCss(phase, alpha = 1, showSeparator = false, stats = null) {
  const stops = phaseGradientStops(phase, alpha, showSeparator, stats);
  if (!stops.length) return "";
  return `linear-gradient(90deg, ${stops
    .map((stop) => `${stop.color} ${stop.offset.toFixed(2)}%`)
    .join(", ")})`;
}

function createPhaseSvgGradient(id, phase, stats = null) {
  const stops = phaseGradientStops(phase, 1, true, stats);
  if (!stops.length) return null;

  const defs = createSvgElement("defs");
  const gradient = createSvgElement("linearGradient", {
    id,
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "0%",
  });
  stops.forEach((stop) => {
    gradient.append(
      createSvgElement("stop", {
        offset: `${stop.offset.toFixed(2)}%`,
        "stop-color": stop.color,
      }),
    );
  });
  defs.append(gradient);
  return defs;
}

function metricDefinition(metricKey) {
  return window.METRIC_DATA?.metrics?.[metricKey] || null;
}

function metricEntry(metricKey, sampleOrNumber, concentration, dataset = state.dataset) {
  const definition = metricDefinition(metricKey);
  if (!definition) return null;
  if (metricKey === "EE" && dataset === "EW") return null;

  const sampleNumber =
    typeof sampleOrNumber === "object" ? sampleOrNumber.sample : sampleOrNumber;
  const sampleKey = String(sampleNumber);

  return (
    definition.datasets?.[dataset]?.[sampleKey]?.[concentration] ||
    definition.shared?.[sampleKey]?.[concentration] ||
    null
  );
}

function metricValue(metricKey, sampleOrNumber, concentration, dataset = state.dataset) {
  const entry = metricEntry(metricKey, sampleOrNumber, concentration, dataset);
  const value = Number(entry?.value);
  return Number.isFinite(value) ? value : null;
}

function formatMetricEntry(entry, includeError = true, metricKey = "") {
  const value = Number(entry?.value);
  if (!Number.isFinite(value)) return "-";

  const base = ["EE", "LC", "IR", "AF"].includes(metricKey) ? `${value.toFixed(1)}%` : `${formatNumber(value, 1)}%`;
  const error = Number(entry?.error);
  if (includeError && Number.isFinite(error)) {
    return `${base} +/- ${formatNumber(error, 1)}%`;
  }
  return base;
}

function frameworkDefinition() {
  return window.FRAMEWORK_DATA || null;
}

function frameworkComponentDefinitions() {
  const components = frameworkDefinition()?.components;
  return Array.isArray(components) && components.length ? components : frameworkComponentDefaults;
}

function frameworkEntry(sampleOrNumber, concentration, dataset = state.dataset) {
  const sampleNumber =
    typeof sampleOrNumber === "object" ? sampleOrNumber?.sample : sampleOrNumber;
  return frameworkDefinition()?.datasets?.[dataset]?.[String(sampleNumber)]?.[concentration] || null;
}

function frameworkEntryIsComplete(entry) {
  if (!entry) return false;
  return frameworkComponentDefinitions().every((component) => Number.isFinite(Number(entry[component.key])));
}

function frameworkSegments(entry) {
  if (!frameworkEntryIsComplete(entry)) return [];

  const components = frameworkComponentDefinitions().map((component) => ({
    ...component,
    value: Number(entry[component.key]),
  }));
  const total = components.reduce((sum, component) => sum + Math.max(0, component.value), 0);
  if (total <= 0) return [];

  return components.map((component) => ({
    ...component,
    fraction: Math.max(0, component.value) / total,
  }));
}

function formatFrameworkEntry(entry) {
  if (!frameworkEntryIsComplete(entry)) return "No data";
  return frameworkComponentDefinitions()
    .map((component) => `${component.label} ${formatNumber(Number(entry[component.key]), 1)}%`)
    .join(" | ");
}

function renderFrameworkDetail(container, entry) {
  if (!container) return;
  container.replaceChildren();

  const segments = frameworkSegments(entry);
  if (!segments.length) {
    const empty = document.createElement("span");
    empty.className = "framework-detail-empty";
    empty.textContent = "No data";
    container.append(empty);
    return;
  }

  const bar = document.createElement("span");
  bar.className = "framework-ratio-bar";
  segments.forEach((segment) => {
    const item = document.createElement("span");
    item.className = "framework-ratio-segment";
    item.style.flexGrow = String(Math.max(segment.value, 0));
    item.style.background = segment.color;
    item.title = `${segment.label} ${formatNumber(segment.value, 1)}%`;
    bar.append(item);
  });

  const values = document.createElement("span");
  values.className = "framework-ratio-values";
  segments.forEach((segment) => {
    const item = document.createElement("span");
    item.className = "framework-ratio-item";

    const swatch = document.createElement("span");
    swatch.className = "framework-ratio-swatch";
    swatch.style.background = segment.color;

    const label = document.createElement("span");
    label.className = "framework-ratio-label";
    label.textContent = segment.label;

    const value = document.createElement("strong");
    value.textContent = `${formatNumber(segment.value, 1)}%`;

    item.append(swatch, label, value);
    values.append(item);
  });

  container.append(bar, values);
}

function renderFrameworkTableRatio(container, entry) {
  if (!container) return;
  container.replaceChildren();

  const segments = frameworkSegments(entry);
  if (!segments.length) {
    const empty = document.createElement("span");
    empty.className = "framework-table-empty";
    empty.textContent = "No data";
    container.append(empty);
    return;
  }

  const wrap = document.createElement("span");
  wrap.className = "framework-table-ratio";
  wrap.title = formatFrameworkEntry(entry);

  const bar = document.createElement("span");
  bar.className = "framework-table-bar";
  segments.forEach((segment) => {
    const item = document.createElement("span");
    item.className = "framework-table-segment";
    item.style.flexGrow = String(Math.max(segment.value, 0));
    item.style.background = segment.color;
    bar.append(item);
  });

  const values = document.createElement("span");
  values.className = "framework-table-values";
  segments.forEach((segment) => {
    const item = document.createElement("span");
    item.textContent = `${formatNumber(segment.value, 1)}%`;
    values.append(item);
  });

  wrap.append(bar, values);
  container.append(wrap);
}

function frameworkNoDataLabel() {
  return "No data";
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b]
    .map((value) => Math.round(value).toString(16).padStart(2, "0"))
    .join("")}`;
}

function interpolateColor(start, end, amount) {
  const from = hexToRgb(start);
  const to = hexToRgb(end);
  return rgbToHex({
    r: from.r + (to.r - from.r) * amount,
    g: from.g + (to.g - from.g) * amount,
    b: from.b + (to.b - from.b) * amount,
  });
}

function metricColorDomain(metricKey) {
  const paletteConfig = metricPalettes[metricKey] || metricPalettes.EE;
  const min = Number.isFinite(Number(paletteConfig.colorMin)) ? Number(paletteConfig.colorMin) : 0;
  const max = Number.isFinite(Number(paletteConfig.colorMax)) ? Number(paletteConfig.colorMax) : 100;
  return max > min ? { min, max } : { min: 0, max: 100 };
}

function colorForMetric(metricKey, value) {
  const paletteConfig = metricPalettes[metricKey] || metricPalettes.EE;
  if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value))) {
    return paletteConfig.missing;
  }
  const domain = metricColorDomain(metricKey);
  const displayValue = clamp(Number(value), domain.min, domain.max);
  return interpolateColor(
    paletteConfig.low,
    paletteConfig.high,
    clamp((displayValue - domain.min) / (domain.max - domain.min), 0, 1),
  );
}

function colorForSample(sample, concentration, phase) {
  if (state.visualization === "phase") {
    return colorForPhase(phase);
  }

  return colorForMetric(state.visualization, metricValue(state.visualization, sample, concentration));
}

function valueForFilter(key, sample, concentration) {
  if (key === "M" || key === "L" || key === "BSA") {
    const value = Number(sample[key]);
    return Number.isFinite(value) ? value : null;
  }

  return metricValue(key, sample, concentration);
}

function filterRangeIsActive(key) {
  const range = state.valueFilters[key] || defaultValueFilters[key];
  return Number(range.min) > defaultValueFilters[key].min || Number(range.max) < defaultValueFilters[key].max;
}

function valueMatchesFilter(key, sample, concentration) {
  const range = state.valueFilters[key] || defaultValueFilters[key];
  if (!filterRangeIsActive(key)) {
    return true;
  }

  const value = valueForFilter(key, sample, concentration);

  if (value === null) {
    return false;
  }

  return value >= Number(range.min) && value <= Number(range.max);
}

function valueFiltersMatch(sample, concentration) {
  return valueFilterKeys.every((key) => valueMatchesFilter(key, sample, concentration));
}

function selectedPhaseFilters() {
  if (Array.isArray(state.phaseFilter)) return state.phaseFilter;
  if (!state.phaseFilter || state.phaseFilter === "all") return [];
  return [state.phaseFilter];
}

function phaseFilterIsAll() {
  return selectedPhaseFilters().length === 0;
}

function phaseFilterButtonActive(key) {
  return key === "all" ? phaseFilterIsAll() : selectedPhaseFilters().includes(key);
}

function nextPhaseFilter(currentFilter, clickedKey) {
  if (clickedKey === "all") return "all";

  const current = Array.isArray(currentFilter)
    ? currentFilter
    : !currentFilter || currentFilter === "all"
      ? []
      : [currentFilter];
  const next = new Set(current);
  if (next.has(clickedKey)) {
    next.delete(clickedKey);
  } else {
    next.add(clickedKey);
  }

  if (!next.size) return "all";
  return phaseFamilies.map(([, key]) => key).filter((key) => next.has(key));
}

function activeConcentrations() {
  return PHASE_DATA.concentrations
    .map((concentration, index) => ({ concentration, index }))
    .filter(
      (item) =>
        state.visibleConcentration === "all" ||
        item.concentration === state.visibleConcentration,
    );
}

function displayConcentrations() {
  return activeConcentrations();
}

function phaseMatches(phase) {
  const activeFilters = selectedPhaseFilters();
  return !activeFilters.length || activeFilters.includes(normalizePhase(phase));
}

function visibleSamplesFor(concentration) {
  const samples = PHASE_DATA.datasets[state.dataset] || [];
  return samples.filter(
    (sample) => phaseMatches(sample.phases[concentration]) && valueFiltersMatch(sample, concentration),
  );
}

function firstVisibleTarget() {
  const layers = activeConcentrations();
  for (const layer of layers) {
    const sample = visibleSamplesFor(layer.concentration)[0];
    if (sample) {
      return {
        sample: Number(sample.sample),
        concentration: layer.concentration,
      };
    }
  }
  return null;
}

function syncSelectionToVisibleData() {
  const visibleConcentration =
    state.visibleConcentration === "all" ? state.concentration : state.visibleConcentration;
  const sample = currentSample();
  const currentVisible =
    sample &&
    activeConcentrations().some((layer) => layer.concentration === visibleConcentration) &&
    phaseMatches(sample.phases[visibleConcentration]) &&
    valueFiltersMatch(sample, visibleConcentration);

  if (currentVisible) {
    state = {
      ...state,
      concentration: visibleConcentration,
    };
    return;
  }

  const fallback = firstVisibleTarget();
  if (fallback) {
    state = {
      ...state,
      ...fallback,
    };
  }
}

function layerZ(index) {
  const midpoint = (PHASE_DATA.concentrations.length - 1) / 2;
  return (index - midpoint) * state.layerGap;
}

function localForComposition(sample) {
  const m = Number(sample.M);
  const l = Number(sample.L);
  const bsa = Number(sample.BSA);
  const x = ((l + bsa * 0.5) / 100) * plot.triangleWidth - plot.triangleWidth / 2;
  const y = plot.triangleHeight - (bsa / 100) * plot.triangleHeight - plot.triangleHeight / 2;
  return { x, y };
}

function makePoint(m, l, bsa) {
  return localForComposition({ M: m, L: l, BSA: bsa });
}

function layerLocalVertices() {
  return [
    makePoint(100, 0, 0),
    makePoint(0, 100, 0),
    makePoint(0, 0, 100),
  ];
}

function rotatePoint(point) {
  const cosZ = Math.cos(state.rotationZ);
  const sinZ = Math.sin(state.rotationZ);
  const xz = point.x * cosZ - point.y * sinZ;
  const yz = point.x * sinZ + point.y * cosZ;

  const cosX = Math.cos(state.rotationX);
  const sinX = Math.sin(state.rotationX);
  const yx = yz * cosX - point.z * sinX;
  const zx = yz * sinX + point.z * cosX;

  const cosY = Math.cos(state.rotationY);
  const sinY = Math.sin(state.rotationY);
  const xy = xz * cosY + zx * sinY;
  const zy = -xz * sinY + zx * cosY;

  return { x: xy, y: yx, depth: zy };
}

function boundsForPoints(points) {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  };
}

function projectedLayerVertices(index) {
  return layerLocalVertices().map((vertex) => rotatePoint({ ...vertex, z: layerZ(index) }));
}

function concentrationLabelAnchorForLayer(vertices) {
  const layerBounds = boundsForPoints(vertices);
  const baseBounds = boundsForPoints([vertices[0], vertices[1]]);
  return {
    x: baseBounds.minX - layerBounds.width * concentrationLabelLayout.gapRatio,
    y: baseBounds.centerY,
  };
}

function projectedBounds() {
  const points = [];

  displayConcentrations().forEach(({ index }) => {
    const vertices = projectedLayerVertices(index);
    points.push(...vertices, concentrationLabelAnchorForLayer(vertices));
  });

  const search = searchPointStatus();
  if (search.valid) {
    const searchLayerIndex = searchConcentrationLayerIndex(search.concentration);
    const vertices = projectedLayerVertices(searchLayerIndex);
    points.push(...vertices, concentrationLabelAnchorForLayer(vertices));
  }

  const { minX, maxX, minY, maxY } = boundsForPoints(points);
  const baseScale = Math.min(
    (plot.width - plot.margin * 2) / Math.max(1, maxX - minX),
    (plot.height - plot.margin * 2) / Math.max(1, maxY - minY),
  );
  const scale = baseScale * state.zoom;

  return {
    scale,
    offsetX: plot.width / 2 - ((minX + maxX) / 2) * scale + state.panX,
    offsetY: plot.height / 2 - ((minY + maxY) / 2) * scale + state.panY,
  };
}

function screenFor(local, layerIndex, fit, dx = 0, dy = 0) {
  const rotated = rotatePoint({ ...local, z: layerZ(layerIndex) });
  return {
    x: rotated.x * fit.scale + fit.offsetX + dx,
    y: rotated.y * fit.scale + fit.offsetY + dy,
    depth: rotated.depth,
  };
}

function layerScreenVertices(index, fit) {
  return layerLocalVertices().map((vertex) => screenFor(vertex, index, fit));
}

function concentrationLabelPointForLayer(vertices) {
  const anchor = concentrationLabelAnchorForLayer(vertices);
  const fontSize = scaledSize(textSizeForClass("layer-label"));
  return {
    x: anchor.x,
    y: anchor.y + fontSize * concentrationLabelLayout.baselineRatio,
  };
}

function pointsAttribute(points) {
  return points.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");
}

function textAt(group, text, point, className, attrs = {}) {
  const node = createSvgElement("text", {
    class: className,
    x: point.x,
    y: point.y,
    style: `font-size: ${scaledSize(textSizeForClass(className))}px`,
    ...attrs,
  });
  node.textContent = text;
  group.append(node);
  return node;
}

function lineBetween(group, a, b, className = "layer-grid") {
  group.append(
    createSvgElement("line", {
      class: className,
      x1: a.x,
      y1: a.y,
      x2: b.x,
      y2: b.y,
    }),
  );
}

function createLegendSwatch(key, className) {
  if (key !== "mixed") {
    const swatch = document.createElement("span");
    swatch.className = className;
    swatch.style.background = palette[key];
    return swatch;
  }

  const swatch = createSvgElement("svg", {
    class: `${className} mixed-legend-swatch`,
    viewBox: "0 0 20 20",
    "aria-hidden": "true",
    focusable: "false",
  });
  swatch.append(
    createSvgElement("circle", {
      cx: 10,
      cy: 10,
      r: 8.8,
      fill: mixedLegendColors.right,
    }),
    createSvgElement("path", {
      d: "M 10 1.2 A 8.8 8.8 0 0 0 10 18.8 L 10 1.2 Z",
      fill: mixedLegendColors.left,
    }),
    createSvgElement("circle", {
      cx: 10,
      cy: 10,
      r: 8.8,
      fill: "none",
      stroke: "rgba(0, 0, 0, 0.24)",
      "stroke-width": 1.2,
    }),
  );
  return swatch;
}

function triangleScreenBounds(svgNode = els.svg) {
  const xs = Array.from(svgNode?.querySelectorAll(".layer-plane") || [])
    .flatMap((polygon) =>
      String(polygon.getAttribute("points") || "")
        .trim()
        .split(/\s+/)
        .map((pair) => Number(pair.split(",")[0]))
        .filter(Number.isFinite),
    );
  if (xs.length < 2) {
    const centerX = plot.width / 2;
    return {
      minX: centerX - plot.triangleWidth / 2,
      maxX: centerX + plot.triangleWidth / 2,
      width: plot.triangleWidth,
      centerX,
    };
  }

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  return {
    minX,
    maxX,
    width: maxX - minX,
    centerX: (minX + maxX) / 2,
  };
}

function triangleScreenWidth(svgNode = els.svg) {
  return triangleScreenBounds(svgNode).width;
}

function updateLegendDockWidth() {
  if (!els.phaseLegendDock) return;
  const frame = els.plotFrame?.getBoundingClientRect();
  const frameWidth = frame?.width || plot.width;
  const sideReserve = 34;
  const maxWidth = Math.max(260, frameWidth - sideReserve * 2);
  const targetRatio = state.visualization === "phase" ? 0.74 : 0.72;
  const legendControlScale = legendFontScaleValue();
  const widthScale = legendControlScale > 1 ? clamp(1 + (legendControlScale - 1) * 0.16, 1, 1.32) : 1;
  const preferredWidth = frameWidth * targetRatio * widthScale;
  const minWidth = Math.min(maxWidth, state.visualization === "phase" ? 330 : 390);
  const legendWidth = Math.max(minWidth, Math.min(maxWidth, preferredWidth));
  const scale = clamp(legendWidth / 720, 0.62, 1) * legendControlScale;

  els.phaseLegendDock.style.setProperty("--legend-width", `${Math.round(legendWidth)}px`);
  els.phaseLegendDock.style.setProperty("--legend-font-size", `${(16 * scale).toFixed(1)}px`);
  els.phaseLegendDock.style.setProperty("--legend-gap", `${Math.round(18 * scale)}px`);
  els.phaseLegendDock.style.setProperty("--legend-item-gap", `${Math.max(4, Math.round(7 * scale))}px`);
  els.phaseLegendDock.style.setProperty("--legend-padding-x", `${Math.max(8, Math.round(18 * scale))}px`);
  els.phaseLegendDock.style.setProperty("--legend-padding-y", `${Math.max(5, Math.round(10 * scale))}px`);
  const swatchSize = Math.max(10, Math.round(16 * scale));
  const metricScaleWidth = Math.max(118, Math.round(260 * scale));
  els.phaseLegendDock.style.setProperty("--legend-swatch-size", `${swatchSize % 2 ? swatchSize + 1 : swatchSize}px`);
  els.phaseLegendDock.style.setProperty("--metric-label-width", `${Math.max(148, Math.round(228 * scale))}px`);
  els.phaseLegendDock.style.setProperty("--metric-scale-width", `${metricScaleWidth}px`);
  els.phaseLegendDock.style.setProperty("--legend-offset-x", `${Math.round(metricScaleWidth * 0.2)}px`);
}

function scheduleLegendDockUpdate() {
  window.requestAnimationFrame(updateLegendDockWidth);
}

function bindLegendDockResize() {
  window.addEventListener("resize", scheduleLegendDockUpdate);
  window.visualViewport?.addEventListener("resize", scheduleLegendDockUpdate);

  if (window.ResizeObserver && els.plotFrame) {
    const observer = new ResizeObserver(scheduleLegendDockUpdate);
    observer.observe(els.plotFrame);
  }
}

function createPhaseLegendElements() {
  return phaseFamilies.map(([label, key]) => {
    const item = document.createElement("span");
    item.className = "legend-item";

    const text = document.createElement("strong");
    text.textContent = label;

    item.append(createLegendSwatch(key, "legend-swatch"), text);
    return item;
  });
}

function createMetricLegendElement() {
  const metricKey = state.visualization;
  const definition = metricDefinition(metricKey);
  const paletteConfig = metricPalettes[metricKey] || metricPalettes.EE;
  const domain = metricColorDomain(metricKey);
  const legend = document.createElement("span");
  legend.className = "metric-legend";

  const label = document.createElement("strong");
  label.className = "metric-label";
  label.textContent = definition?.label || metricKey;

  const low = document.createElement("span");
  low.textContent = `${formatNumber(domain.min, 0)}%`;

  const scale = document.createElement("span");
  scale.className = "metric-scale";
  scale.style.background = `linear-gradient(90deg, ${paletteConfig.low}, ${paletteConfig.high})`;

  const high = document.createElement("span");
  high.textContent = `${formatNumber(domain.max, 0)}%`;

  const missing = document.createElement("span");
  missing.className = "metric-missing";
  missing.style.background = paletteConfig.missing;
  missing.style.borderColor = paletteConfig.missing;

  const missingText = document.createElement("span");
  missingText.textContent = "No data";

  legend.append(label, low, scale, high, missing, missingText);
  return legend;
}

function createFrameworkLegendElements() {
  const label = document.createElement("strong");
  label.className = "metric-label framework-legend-label";
  label.textContent = "Framework to amorphous ratio";

  const items = frameworkComponentDefinitions().map((component) => {
    const item = document.createElement("span");
    item.className = "legend-item";

    const swatch = document.createElement("span");
    swatch.className = "legend-swatch";
    swatch.style.background = component.color;

    const text = document.createElement("strong");
    text.textContent = component.label;

    item.append(swatch, text);
    return item;
  });

  const missing = document.createElement("span");
  missing.className = "legend-item";

  const swatch = document.createElement("span");
  swatch.className = "legend-swatch";
  swatch.style.background = palette.missing;

  const text = document.createElement("strong");
  text.textContent = frameworkNoDataLabel();

  missing.append(swatch, text);
  return [label, ...items, missing];
}

function renderLegend() {
  els.legend.replaceChildren();

  if (!els.phaseLegendDock) return;
  els.phaseLegendDock.classList.toggle("is-framework-ratio", state.visualization === frameworkModeKey);
  if (state.visualization === "phase") {
    els.phaseLegendDock.replaceChildren(...createPhaseLegendElements());
  } else if (state.visualization === frameworkModeKey) {
    els.phaseLegendDock.replaceChildren(...createFrameworkLegendElements());
  } else {
    els.phaseLegendDock.replaceChildren(createMetricLegendElement());
  }
  els.phaseLegendDock.classList.remove("is-hidden");
  scheduleLegendDockUpdate();
}

function renderGrid(group, index, fit) {
  for (let value = 20; value < 100; value += 20) {
    lineBetween(
      group,
      screenFor(makePoint(100 - value, 0, value), index, fit),
      screenFor(makePoint(0, 100 - value, value), index, fit),
    );
    lineBetween(
      group,
      screenFor(makePoint(100 - value, value, 0), index, fit),
      screenFor(makePoint(0, value, 100 - value), index, fit),
    );
    lineBetween(
      group,
      screenFor(makePoint(value, 0, 100 - value), index, fit),
      screenFor(makePoint(value, 100 - value, 0), index, fit),
    );
  }

  lineBetween(
    group,
    screenFor(makePoint(100, 0, 0), index, fit),
    screenFor(makePoint(0, 100, 0), index, fit),
    "layer-edge",
  );
  lineBetween(
    group,
    screenFor(makePoint(0, 100, 0), index, fit),
    screenFor(makePoint(0, 0, 100), index, fit),
    "layer-edge",
  );
  lineBetween(
    group,
    screenFor(makePoint(0, 0, 100), index, fit),
    screenFor(makePoint(100, 0, 0), index, fit),
    "layer-edge",
  );
}

function renderAxisLabels(group, index, fit) {
  const axisColors = {
    M: "#000000",
    L: "#008A2E",
    BSA: "#EE0000",
  };
  const isLView = lShortcutViewActive();
  const axisLabels = isLView
    ? [
        ["M (wt.%)", makePoint(100, 0, 0), -92, 30, "end", axisColors.M],
        ["L (wt.%)", makePoint(0, 100, 0), 92, 30, "start", axisColors.L],
        ["BSA (wt.%)", makePoint(0, 0, 100), 0, -132, "middle", axisColors.BSA],
      ]
    : [
        ["M (wt.%)", makePoint(100, 0, 0), -54, 24, "end", axisColors.M],
        ["L (wt.%)", makePoint(0, 100, 0), 54, 24, "start", axisColors.L],
        ["BSA (wt.%)", makePoint(0, 0, 100), 0, -36, "middle", axisColors.BSA],
      ];

  if (state.showAxisLabels) {
    axisLabels.forEach(([label, local, dx, dy, anchor, color]) => {
      const node = textAt(group, label, screenFor(local, index, fit, dx, dy), "axis-label", {
        "text-anchor": anchor,
      });
      node.style.fill = color;
    });
  }

  if (state.showAxisTicks) {
    const centroid = makePoint(100 / 3, 100 / 3, 100 / 3);
    const lViewTopLayerIndex = (() => {
      if (!isLView) return index;
      const topVertex = makePoint(0, 0, 100);
      return activeConcentrations().reduce((topIndex, layer) => {
        const currentY = screenFor(topVertex, layer.index, fit).y;
        const topY = screenFor(topVertex, topIndex, fit).y;
        return currentY < topY ? layer.index : topIndex;
      }, index);
    })();
    const normalizeVector = (vector) => {
      const length = Math.hypot(vector.x, vector.y) || 1;
      return { x: vector.x / length, y: vector.y / length };
    };
    const outwardNormal = (edgeStart, edgeEnd) => {
      const a = screenFor(edgeStart, index, fit);
      const b = screenFor(edgeEnd, index, fit);
      const center = screenFor(centroid, index, fit);
      const midpoint = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const tangent = { x: b.x - a.x, y: b.y - a.y };
      let normal = normalizeVector({ x: -tangent.y, y: tangent.x });
      const awayFromCenter = { x: midpoint.x - center.x, y: midpoint.y - center.y };
      if (normal.x * awayFromCenter.x + normal.y * awayFromCenter.y < 0) {
        normal = { x: -normal.x, y: -normal.y };
      }
      return normal;
    };
    const lViewTickPoint = (local, edgeStart, edgeEnd, distance, mode = "normal") => {
      const point = screenFor(local, index, fit);
      const normal = outwardNormal(edgeStart, edgeEnd);
      if (mode === "horizontal") {
        return {
          ...point,
          x: point.x + Math.sign(normal.x || 1) * distance,
        };
      }
      if (mode === "vertical") {
        return {
          ...point,
          y: point.y + Math.sign(normal.y || 1) * distance,
        };
      }
      return {
        ...point,
        x: point.x + normal.x * distance,
        y: point.y + normal.y * distance,
      };
    };
    const centeredTickAttrs = {
      "text-anchor": "middle",
      "dominant-baseline": "central",
      "alignment-baseline": "central",
    };
    const lViewEdgeTickLift = isLView ? 8 * state.axisTickFontScale : 0;
    const lViewCenterX = isLView ? screenFor(makePoint(0, 0, 100), lViewTopLayerIndex, fit).x : 0;
    const lViewEdgeTickNudge = isLView ? 12 * state.axisTickFontScale : 0;
    const lViewAwayFromCenterX = (point, fallbackDirection) => {
      const direction = Math.sign(point.x - lViewCenterX) || fallbackDirection;
      return point.x + direction * lViewEdgeTickNudge;
    };

    for (let value = 20; value <= 100; value += 20) {
      const mLocal = makePoint(value, 0, 100 - value);
      const mIntersection = screenFor(mLocal, index, fit);
      const mTopIntersection = isLView ? screenFor(mLocal, lViewTopLayerIndex, fit) : mIntersection;
      const mPoint = isLView
        ? { ...mIntersection, x: lViewAwayFromCenterX(mIntersection, -1), y: mTopIntersection.y - lViewEdgeTickLift }
        : { ...mIntersection, x: mIntersection.x - 20 };
      const mTick = textAt(
        group,
        value,
        mPoint,
        "tick-label",
        isLView ? centeredTickAttrs : { "text-anchor": "end" },
      );
      mTick.style.fill = axisColors.M;

      const lPoint = isLView
        ? lViewTickPoint(
            makePoint(100 - value, value, 0),
            makePoint(100, 0, 0),
            makePoint(0, 100, 0),
            26,
            "vertical",
          )
        : screenFor(makePoint(100 - value, value, 0), index, fit, 0, 24);
      const lTick = textAt(
        group,
        value,
        lPoint,
        "tick-label",
        isLView
          ? { "text-anchor": "middle", "dominant-baseline": "central", "alignment-baseline": "central" }
          : { "text-anchor": "middle" },
      );
      lTick.style.fill = axisColors.L;

      const bsaLocal = makePoint(0, 100 - value, value);
      const bsaIntersection = screenFor(bsaLocal, index, fit);
      const bsaTopIntersection = isLView ? screenFor(bsaLocal, lViewTopLayerIndex, fit) : bsaIntersection;
      const bsaPoint = isLView
        ? { ...bsaIntersection, x: lViewAwayFromCenterX(bsaIntersection, 1), y: bsaTopIntersection.y - lViewEdgeTickLift }
        : { ...bsaIntersection, x: bsaIntersection.x + 20 };
      const bsaTick = textAt(
        group,
        value,
        bsaPoint,
        "tick-label",
        isLView ? centeredTickAttrs : { "text-anchor": value === 100 ? "middle" : "start" },
      );
      bsaTick.style.fill = axisColors.BSA;
    }
  }
}

function lShortcutViewActive() {
  return (
    Math.abs(state.rotationX - 0.07) < 0.0001 &&
    Math.abs(state.rotationY) < 0.0001 &&
    Math.abs(state.rotationZ) < 0.0001
  );
}

function shouldRenderAxisForLayer(index) {
  if (!lShortcutViewActive()) return true;
  return index === activeConcentrations()[0]?.index;
}

function createFrameworkBallDefs() {
  const defs = createSvgElement("defs");
  const gradient = createSvgElement("radialGradient", {
    id: "frameworkBallGloss",
    cx: "34%",
    cy: "28%",
    r: "72%",
  });
  gradient.append(
    createSvgElement("stop", { offset: "0%", "stop-color": "#ffffff", "stop-opacity": "0.5" }),
    createSvgElement("stop", { offset: "54%", "stop-color": "#ffffff", "stop-opacity": "0" }),
    createSvgElement("stop", { offset: "100%", "stop-color": "#000000", "stop-opacity": "0.16" }),
  );
  defs.append(gradient);
  return defs;
}

function circleAreaFractionAtX(normalizedX) {
  const x = clamp(normalizedX, -1, 1);
  return (x * Math.sqrt(Math.max(0, 1 - x * x)) + Math.asin(x) + Math.PI / 2) / Math.PI;
}

function circleXForAreaFraction(fraction) {
  const target = clamp(fraction, 0, 1);
  if (target <= 0) return -1;
  if (target >= 1) return 1;

  let low = -1;
  let high = 1;
  for (let index = 0; index < 32; index += 1) {
    const mid = (low + high) / 2;
    if (circleAreaFractionAtX(mid) < target) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}

function verticalBandPath(cx, cy, radius, startFraction, endFraction) {
  const left = cx + radius * circleXForAreaFraction(startFraction);
  const right = cx + radius * circleXForAreaFraction(endFraction);
  const steps = 14;
  const top = [];
  const bottom = [];

  for (let index = 0; index <= steps; index += 1) {
    const x = left + ((right - left) * index) / steps;
    const dx = clamp((x - cx) / radius, -1, 1);
    const yOffset = radius * Math.sqrt(Math.max(0, 1 - dx * dx));
    top.push({ x, y: cy - yOffset });
    bottom.push({ x, y: cy + yOffset });
  }

  return [
    `M ${top[0].x.toFixed(2)} ${top[0].y.toFixed(2)}`,
    ...top.slice(1).map((point) => `L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`),
    ...bottom.reverse().map((point) => `L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`),
    "Z",
  ].join(" ");
}

function createPlainSampleDot(point, radius, fill) {
  return createSvgElement("circle", {
    class: "sample-dot",
    cx: point.x,
    cy: point.y,
    r: radius,
    fill,
  });
}

function createGlossyBallNodes(point, radius, segments, groupClass = "") {
  const visibleSegments = segments.filter((segment) => segment.fraction > 0);
  if (!visibleSegments.length) return [];

  const ball = createSvgElement("g", {
    class: ["framework-ball", groupClass].filter(Boolean).join(" "),
  });
  let cursor = 0;
  visibleSegments.forEach((segment, index) => {
    const end = index === visibleSegments.length - 1 ? 1 : cursor + segment.fraction;
    ball.append(
      createSvgElement("path", {
        class: "framework-slice",
        d: verticalBandPath(point.x, point.y, radius, cursor, end),
        fill: segment.color,
        stroke: segment.color,
        "data-component": segment.key || "",
      }),
    );
    cursor = end;
  });

  ball.append(
    createSvgElement("circle", {
      class: "framework-ball-shade",
      cx: point.x,
      cy: point.y,
      r: radius,
    }),
    createSvgElement("circle", {
      class: "sample-dot framework-outline",
      cx: point.x,
      cy: point.y,
      r: radius,
    }),
  );
  return [ball];
}

function createFrameworkBallNodes(point, radius, entry) {
  const segments = frameworkSegments(entry);
  if (!segments.length) {
    return [
      createPlainSampleDot(point, radius, palette.missing),
    ];
  }

  return createGlossyBallNodes(point, radius, segments, "framework-ratio-ball");
}

function createPhaseBallNodes(point, radius, phase, stats = null) {
  if (normalizePhase(phase) === "missing") {
    return [createPlainSampleDot(point, radius, palette.missing)];
  }

  const components = phaseColorComponents(phase, stats);
  const segments = components.length
    ? components.map((component) => ({
        key: component.key,
        color: component.color,
        fraction: component.fraction,
      }))
    : [{ key: normalizePhase(phase), color: colorForPhase(phase), fraction: 1 }];

  return createGlossyBallNodes(point, radius, segments, "phase-ball");
}

function createMetricBallNodes(point, radius, sample, concentration) {
  const value = metricValue(state.visualization, sample, concentration);
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return [createPlainSampleDot(point, radius, colorForMetric(state.visualization, value))];
  }

  return createGlossyBallNodes(point, radius, [
    {
      key: state.visualization,
      color: colorForMetric(state.visualization, value),
      fraction: 1,
    },
  ], "metric-ball");
}

function createSampleBallNodes(point, radius, sample, concentration, phase, stats, framework) {
  if (state.visualization === frameworkModeKey) {
    return createFrameworkBallNodes(point, radius, framework);
  }
  if (state.visualization === "phase") {
    return createPhaseBallNodes(point, radius, phase, stats);
  }
  return createMetricBallNodes(point, radius, sample, concentration);
}

function renderSamples(group, concentration, index, fit, samples) {
  samples.forEach((sample) => {
    const point = screenFor(localForComposition(sample), index, fit);
    const phase = sample.phases[concentration];
    const phaseStats = phaseStatsFor(sample, concentration);
    const isFrameworkMode = state.visualization === frameworkModeKey;
    const framework = isFrameworkMode ? frameworkEntry(sample, concentration) : null;
    const displayText = isFrameworkMode
      ? formatFrameworkEntry(framework)
      : phaseStats
        ? phaseColorComponents(phase, phaseStats).map(formatPhaseComponentText).join("+")
        : displayPhasePlain(phase);
    const metricText =
      state.visualization === "phase" || isFrameworkMode
        ? ""
        : `, ${state.visualization} ${formatMetricEntry(metricEntry(state.visualization, sample, concentration), false, state.visualization)}`;
    if (!phaseMatches(phase) || !valueFiltersMatch(sample, concentration)) {
      return;
    }
    hitTargets.push({
      sample: Number(sample.sample),
      concentration,
      x: point.x,
      y: point.y,
      depth: point.depth,
    });
    const sampleGroup = createSvgElement("g", {
      class: "sample-point",
      tabindex: "0",
      role: "button",
      "data-sample": sample.sample,
      "data-concentration": concentration,
      "aria-label": `Sample ${sample.sample}, ${formatConcentrationPlain(concentration)}, ${displayText}${metricText}`,
    });
    const sampleNodes = [
      createSvgElement("circle", {
        class: "sample-hit",
        cx: point.x,
        cy: point.y,
        r: scaledSampleCircleSize(25),
      }),
      createSvgElement("circle", {
        class: "sample-ring",
        cx: point.x,
        cy: point.y,
        r: scaledSampleCircleSize(18),
      }),
      ...createSampleBallNodes(point, scaledSampleCircleSize(12.5), sample, concentration, phase, phaseStats, framework),
    ];
    if (state.showSampleNumbers) {
      const numberNode = createSvgElement("text", {
        class: "sample-number",
        x: point.x,
        y: point.y + 0.6,
        style: `font-size: ${scaledSampleNumberSize(textSizeForClass("sample-number"))}px`,
      });
      numberNode.textContent = sample.sample;
      sampleNodes.push(numberNode);
    }
    sampleGroup.append(...sampleNodes);

    const title = createSvgElement("title");
    title.textContent = `Sample ${sample.sample} | ${formatConcentrationPlain(concentration)} | ${displayText}${metricText.replace(", ", " | ")}`;
    sampleGroup.append(title);

    sampleGroup.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectSample(sample.sample, concentration);
      }
    });

    group.append(sampleGroup);
  });
}

function renderSearchMarkerAt(group, point, search) {
  const markerRadius = scaledSize(15);
  const crossRadius = scaledSize(23);
  const marker = createSvgElement("g", {
    class: "composition-search-marker",
    role: "img",
    "aria-label": `Search point, ${formatNumber(search.m, 1)} M, ${formatNumber(search.l, 1)} L, ${formatNumber(search.bsa, 1)} BSA, ${formatSearchConcentrationPlain(search.concentration)}`,
  });

  marker.append(
    createSvgElement("circle", {
      class: "search-marker-halo",
      cx: point.x,
      cy: point.y,
      r: markerRadius,
    }),
    createSvgElement("line", {
      class: "search-marker-cross",
      x1: point.x - crossRadius,
      y1: point.y,
      x2: point.x + crossRadius,
      y2: point.y,
    }),
    createSvgElement("line", {
      class: "search-marker-cross",
      x1: point.x,
      y1: point.y - crossRadius,
      x2: point.x,
      y2: point.y + crossRadius,
    }),
    createSvgElement("circle", {
      class: "search-marker-core",
      cx: point.x,
      cy: point.y,
      r: scaledSize(5.5),
    }),
  );

  const label = createSvgElement("text", {
    class: "search-marker-label",
    x: point.x + scaledSize(18),
    y: point.y - scaledSize(14),
    style: `font-size: ${scaledSize(13)}px`,
  });
  label.textContent = "Search";
  marker.append(label);

  const title = createSvgElement("title");
  title.textContent = `Search | M ${formatNumber(search.m, 1)} wt.% | L ${formatNumber(search.l, 1)} wt.% | BSA ${formatNumber(search.bsa, 1)} wt.% | ${formatSearchConcentrationPlain(search.concentration)}`;
  marker.append(title);

  group.append(marker);
}

function renderSearchOverlay(fit) {
  const search = searchPointStatus();
  if (!search.valid) return null;

  const layerIndex = searchConcentrationLayerIndex(search.concentration);
  const vertices = layerScreenVertices(layerIndex, fit);
  const averageDepth = vertices.reduce((sum, point) => sum + point.depth, 0) / vertices.length;
  const group = createSvgElement("g", {
    class: "composition-search-overlay",
    "data-search-concentration": String(search.concentration),
    "data-depth": averageDepth,
  });
  const fixedLayerVisible = activeConcentrations().some(({ concentration }) =>
    searchMatchesFixedLayer(concentration, search.concentration),
  );

  if (!fixedLayerVisible) {
    group.append(
      createSvgElement("polygon", {
        class: "search-layer-plane",
        points: pointsAttribute(vertices),
      }),
    );

    if (state.showConcentrationLabels) {
      const labelNode = svgConcentrationText(
        group,
        `${formatSearchConcentrationValue(search.concentration)} mg/mL`,
        concentrationLabelPointForLayer(vertices),
        "layer-label",
        {
          "text-anchor": "end",
        },
      );
      labelNode.classList.add("search-layer-label");
    }
  }

  renderSearchMarkerAt(
    group,
    screenFor(makePoint(search.m, search.l, search.bsa), layerIndex, fit),
    search,
  );
  return group;
}

function renderLayer(concentration, index, fit, samples, options = {}) {
  const vertices = layerScreenVertices(index, fit);
  const averageDepth = vertices.reduce((sum, point) => sum + point.depth, 0) / vertices.length;
  const group = createSvgElement("g", {
    class: "ternary-layer",
    "data-concentration": concentration,
    "data-depth": averageDepth,
  });

  group.append(
    createSvgElement("polygon", {
      class: "layer-shadow",
      points: pointsAttribute(vertices.map((point) => ({ x: point.x + 12, y: point.y + 14 }))),
    }),
    createSvgElement("polygon", {
      class: "layer-plane",
      points: pointsAttribute(vertices),
    }),
  );

  renderGrid(group, index, fit);
  if (shouldRenderAxisForLayer(index)) {
    renderAxisLabels(group, index, fit);
  }
  if (options.showSamples !== false) {
    renderSamples(group, concentration, index, fit, samples);
  }

  if (state.showConcentrationLabels) {
    svgConcentrationText(
      group,
      concentration,
      concentrationLabelPointForLayer(vertices),
      "layer-label",
      {
        "text-anchor": "end",
      },
    );
  }

  return group;
}

function renderPlotBackground() {
  const group = createSvgElement("g", {
    class: "plot-grid-bg",
    "aria-hidden": "true",
  });
  const step = 38;

  group.append(
    createSvgElement("rect", {
      class: "plot-grid-fill",
      x: 0,
      y: 0,
      width: plot.width,
      height: plot.height,
    }),
  );

  for (let x = 0; x <= plot.width; x += step) {
    group.append(
      createSvgElement("line", {
        class: "plot-grid-line",
        x1: x,
        y1: 0,
        x2: x,
        y2: plot.height,
      }),
    );
  }

  for (let y = 0; y <= plot.height; y += step) {
    group.append(
      createSvgElement("line", {
        class: "plot-grid-line",
        x1: 0,
        y1: y,
        x2: plot.width,
        y2: y,
      }),
    );
  }

  return group;
}

function renderPlot() {
  const samples = PHASE_DATA.datasets[state.dataset] || [];
  const fit = projectedBounds();
  hitTargets = [];
  const layers = displayConcentrations()
    .map(({ concentration, index }) => renderLayer(concentration, index, fit, samples))
    .sort((a, b) => Number(a.dataset.depth) - Number(b.dataset.depth));
  const searchOverlay = renderSearchOverlay(fit);
  const defs = [createFrameworkBallDefs()];

  els.svg.setAttribute("viewBox", `0 0 ${plot.width} ${plot.height}`);
  els.svg.replaceChildren(
    ...(isExporting ? [] : [renderPlotBackground()]),
    ...defs,
    ...layers,
    ...(searchOverlay ? [searchOverlay] : []),
  );
  updateLegendDockWidth();
  updateHighlights();
}

function currentSample() {
  if (state.sample === null || state.sample === undefined) return null;
  const samples = PHASE_DATA.datasets[state.dataset] || [];
  return samples.find((sample) => Number(sample.sample) === Number(state.sample));
}

function selectSample(sampleNumber, concentration) {
  state = {
    ...state,
    sample: Number(sampleNumber),
    concentration,
  };
  updateDetail();
  updateHighlights();
}

function clearSampleSelection() {
  state = {
    ...state,
    sample: null,
  };
  updateDetail();
  updateHighlights();
}

function updateHighlights() {
  const points = els.svg.querySelectorAll(".sample-point");
  const hasSelection = state.sample !== null && state.sample !== undefined;
  points.forEach((point) => {
    const isSample = hasSelection && Number(point.dataset.sample) === Number(state.sample);
    const isLayer = point.dataset.concentration === state.concentration;
    point.classList.toggle("is-selected-sample", isSample);
    point.classList.toggle("is-selected-layer", isSample && isLayer);
  });
}

function xrdTriplicatesFor(sample, concentration) {
  const dataset = window.XRD_DATA?.datasets?.[state.dataset];
  return dataset?.[String(sample.sample)]?.[concentration] || [];
}

function createXrdText(text, x, y, className, attrs = {}) {
  const node = createSvgElement("text", {
    class: className,
    x,
    y,
    ...attrs,
  });
  node.textContent = text;
  return node;
}

function createSvgSupText(parts, x, y, className, attrs = {}) {
  const node = createSvgElement("text", {
    class: className,
    x,
    y,
    ...attrs,
  });
  parts.forEach((part) => {
    const tspan = createSvgElement("tspan");
    tspan.textContent = part.text;
    if (part.sup) {
      tspan.setAttribute("baseline-shift", "super");
      tspan.setAttribute("font-size", "70%");
    }
    node.append(tspan);
  });
  return node;
}

function spectrumRange(xMeta, zoom = 1, pan = 0) {
  const start = Number(xMeta?.start) || 0;
  const step = Number(xMeta?.step) || 1;
  const count = Math.max(1, Number(xMeta?.count) || 1);
  const end = start + step * (count - 1);
  const rawMin = Math.min(start, end);
  const rawMax = Math.max(start, end);
  const fullSpan = Math.max(1, rawMax - rawMin);
  const visibleSpan = fullSpan / clamp(zoom, 1, 8);
  const maxPan = Math.max(0, (fullSpan - visibleSpan) / 2);
  const center = (rawMin + rawMax) / 2 + clamp(pan, -maxPan, maxPan);
  const min = clamp(center - visibleSpan / 2, rawMin, rawMax);
  const max = clamp(center + visibleSpan / 2, rawMin, rawMax);
  return { min, max, rawMin, rawMax, descending: step < 0 };
}

function spectrumPanLimit(xMeta, zoom = 1) {
  const start = Number(xMeta?.start) || 0;
  const step = Number(xMeta?.step) || 1;
  const count = Math.max(1, Number(xMeta?.count) || 1);
  const end = start + step * (count - 1);
  const fullSpan = Math.max(1, Math.abs(end - start));
  const visibleSpan = fullSpan / clamp(zoom, 1, 8);
  return Math.max(0, (fullSpan - visibleSpan) / 2);
}

function spectrumX(value, geometry, range, descending = false) {
  const span = Math.max(1, range.max - range.min);
  const ratio = descending ? (range.max - value) / span : (value - range.min) / span;
  return geometry.left + ratio * geometry.width;
}

function axisTicks(range, preferredTicks, decimals = 0) {
  const ticks = preferredTicks.filter((tick) => tick >= range.min && tick <= range.max);
  if (ticks.length >= 2) return ticks;

  const generated = [range.min, (range.min + range.max) / 2, range.max];
  return generated.map((tick) => Number(tick.toFixed(decimals)));
}

function formatAxisTick(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(1)));
}

function xrdStackGeometry(geometry, index, count) {
  const gap = 12;
  const bandHeight = (geometry.height - gap * Math.max(0, count - 1)) / Math.max(1, count);
  const top = geometry.top + (count - 1 - index) * (bandHeight + gap);
  return {
    top,
    baseline: top + bandHeight,
    height: bandHeight,
  };
}

function xrdPathFor(values, geometry, xMeta, stackIndex, stackCount, range) {
  const maxIndex = Math.max(1, values.length - 1);
  const xMin = Number(xMeta?.start) || 5;
  const xStep = Number(xMeta?.step) || 0.02;
  const yRange = 100;
  const stack = xrdStackGeometry(geometry, stackIndex, stackCount);

  return values
    .map((value, index) => {
      const theta = xMin + xStep * index;
      if (theta < range.min || theta > range.max) return null;
      const x = spectrumX(theta, geometry, range);
      const y = stack.baseline - (clamp(Number(value), 0, 100) / yRange) * stack.height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .filter(Boolean)
    .join(" ");
}

function renderXrdPlot(sample) {
  if (!els.xrdPlot || !els.xrdLegend || !els.xrdStatus) return;

  const xrdData = window.XRD_DATA;
  const synthesisLabels = xrdData?.syntheses || ["First synthesis", "Second synthesis", "Third synthesis"];
  const triplicates = sample ? xrdTriplicatesFor(sample, state.concentration) : [];
  const available = triplicates
    .map((values, index) => ({ values, index }))
    .filter((item) => Array.isArray(item.values) && item.values.length > 1);

  const geometry = {
    left: xrdPlot.margin.left,
    top: xrdPlot.margin.top,
    width: xrdPlot.width - xrdPlot.margin.left - xrdPlot.margin.right,
    height: xrdPlot.height - xrdPlot.margin.top - xrdPlot.margin.bottom,
  };
  const xRange = spectrumRange(xrdData?.x, state.xrdZoom, state.xrdPan);

  const nodes = [
    createSvgElement("rect", {
      class: "xrd-plot-bg",
      x: 0,
      y: 0,
      width: xrdPlot.width,
      height: xrdPlot.height,
      rx: 8,
    }),
  ];

  [0, 1, 2].forEach((index) => {
    const stack = xrdStackGeometry(geometry, index, 3);
    const labelY = stack.baseline - 4;
    nodes.push(
      createSvgElement("line", {
        class: "xrd-grid-line",
        x1: geometry.left,
        y1: stack.baseline,
        x2: geometry.left + geometry.width,
        y2: stack.baseline,
      }),
      createXrdText(`${index + 1}`, geometry.left - 10, stack.baseline - 4, "xrd-tick-label", {
        "text-anchor": "end",
      }),
      createXrdText(synthesisLabels[index] || `Synthesis ${index + 1}`, geometry.left + 8, labelY, "xrd-line-label", {
        "text-anchor": "start",
      }),
    );
  });

  axisTicks(xRange, [5, 10, 15, 20], 1).forEach((tick) => {
    const x = spectrumX(tick, geometry, xRange);
    nodes.push(
      createSvgElement("line", {
        class: "xrd-grid-line",
        x1: x,
        y1: geometry.top,
        x2: x,
        y2: geometry.top + geometry.height,
      }),
      createXrdText(formatAxisTick(tick), x, geometry.top + geometry.height + 20, "xrd-tick-label", {
        "text-anchor": "middle",
      }),
    );
  });

  nodes.push(
    createSvgElement("line", {
      class: "xrd-axis-line",
      x1: geometry.left,
      y1: geometry.top + geometry.height,
      x2: geometry.left + geometry.width,
      y2: geometry.top + geometry.height,
    }),
    createSvgElement("line", {
      class: "xrd-axis-line",
      x1: geometry.left,
      y1: geometry.top,
      x2: geometry.left,
      y2: geometry.top + geometry.height,
    }),
    createSvgElement("line", {
      class: "xrd-axis-line",
      x1: geometry.left,
      y1: geometry.top,
      x2: geometry.left + geometry.width,
      y2: geometry.top,
    }),
    createSvgElement("line", {
      class: "xrd-axis-line",
      x1: geometry.left + geometry.width,
      y1: geometry.top,
      x2: geometry.left + geometry.width,
      y2: geometry.top + geometry.height,
    }),
    createXrdText("2theta [degree]", geometry.left + geometry.width / 2, xrdPlot.height - 8, "xrd-axis-title", {
      "text-anchor": "middle",
    }),
    createXrdText("Normalized intensity [a.u.]", 15, geometry.top + geometry.height / 2, "xrd-axis-title", {
      "text-anchor": "middle",
      transform: `rotate(-90 15 ${geometry.top + geometry.height / 2})`,
    }),
  );

  if (!available.length) {
    nodes.push(
      createXrdText("No XRD data", xrdPlot.width / 2, xrdPlot.height / 2, "xrd-empty", {
        "text-anchor": "middle",
      }),
    );
  } else {
    available.forEach(({ values, index }) => {
      nodes.push(
        createSvgElement("polyline", {
          class: "xrd-pattern-line",
          points: xrdPathFor(values, geometry, xrdData?.x, index, 3, xRange),
          stroke: xrdPlot.colors[index] || xrdPlot.colors[0],
        }),
      );
    });
  }

  els.xrdPlot.setAttribute("viewBox", `0 0 ${xrdPlot.width} ${xrdPlot.height}`);
  els.xrdPlot.replaceChildren(...nodes);
  els.xrdStatus.textContent = `${available.length}/3 triplicates`;
  if (els.xrdZoomOut) els.xrdZoomOut.disabled = state.xrdZoom <= 1;
  if (els.xrdZoomIn) els.xrdZoomIn.disabled = state.xrdZoom >= 8;
  if (els.xrdReset) els.xrdReset.disabled = state.xrdZoom <= 1 && Math.abs(state.xrdPan) < 0.0001;

  els.xrdLegend.replaceChildren();
}

function irSpectrumFor(sample, concentration) {
  const dataset = window.IR_DATA?.datasets?.[state.dataset];
  return dataset?.[String(sample.sample)]?.[concentration] || null;
}

function irXFor(wavenumber, geometry, range) {
  return spectrumX(wavenumber, geometry, range, true);
}

function irPathFor(values, geometry, xMeta, range) {
  const start = Number(xMeta?.start) || 4000;
  const step = Number(xMeta?.step) || -4;

  return values
    .map((value, index) => {
      const wavenumber = start + step * index;
      if (wavenumber < range.min || wavenumber > range.max) return null;
      const x = irXFor(wavenumber, geometry, range);
      const y = geometry.top + geometry.height - (clamp(Number(value), 0, irRawYMax) / irRawYMax) * geometry.height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .filter(Boolean)
    .join(" ");
}

function formatIrYAxisTick(rawValue) {
  const displayValue = (rawValue / irRawYMax) * irDisplayYMax;
  return Number.isInteger(displayValue) ? String(displayValue) : String(Number(displayValue.toFixed(1)));
}

function renderIrPlot(sample) {
  if (!els.irPlot || !els.irStatus) return;

  const irData = window.IR_DATA;
  const spectrum = sample ? irSpectrumFor(sample, state.concentration) : null;
  const hasSpectrum = Array.isArray(spectrum) && spectrum.length > 1;
  const geometry = {
    left: irPlot.margin.left,
    top: irPlot.margin.top,
    width: irPlot.width - irPlot.margin.left - irPlot.margin.right,
    height: irPlot.height - irPlot.margin.top - irPlot.margin.bottom,
  };
  const xRange = spectrumRange(irData?.x, state.irZoom, state.irPan);

  const nodes = [
    createSvgElement("rect", {
      class: "xrd-plot-bg",
      x: 0,
      y: 0,
      width: irPlot.width,
      height: irPlot.height,
      rx: 8,
    }),
  ];

  [0, 50, 100].forEach((tick) => {
    const y = geometry.top + geometry.height - (tick / irRawYMax) * geometry.height;
    nodes.push(
      createSvgElement("line", {
        class: "xrd-grid-line",
        x1: geometry.left,
        y1: y,
        x2: geometry.left + geometry.width,
        y2: y,
      }),
      createXrdText(formatIrYAxisTick(tick), geometry.left - 10, y + 4, "xrd-tick-label", {
        "text-anchor": "end",
      }),
    );
  });

  axisTicks(xRange, [4000, 3000, 2000, 1000, 400], 0).forEach((tick) => {
    const x = irXFor(tick, geometry, xRange);
    if (x < geometry.left - 1 || x > geometry.left + geometry.width + 1) return;
    nodes.push(
      createSvgElement("line", {
        class: "xrd-grid-line",
        x1: x,
        y1: geometry.top,
        x2: x,
        y2: geometry.top + geometry.height,
      }),
      createXrdText(formatAxisTick(tick), x, geometry.top + geometry.height + 20, "xrd-tick-label", {
        "text-anchor": "middle",
      }),
    );
  });

  nodes.push(
    createSvgElement("line", {
      class: "xrd-axis-line",
      x1: geometry.left,
      y1: geometry.top + geometry.height,
      x2: geometry.left + geometry.width,
      y2: geometry.top + geometry.height,
    }),
    createSvgElement("line", {
      class: "xrd-axis-line",
      x1: geometry.left,
      y1: geometry.top,
      x2: geometry.left,
      y2: geometry.top + geometry.height,
    }),
    createSvgElement("line", {
      class: "xrd-axis-line",
      x1: geometry.left,
      y1: geometry.top,
      x2: geometry.left + geometry.width,
      y2: geometry.top,
    }),
    createSvgElement("line", {
      class: "xrd-axis-line",
      x1: geometry.left + geometry.width,
      y1: geometry.top,
      x2: geometry.left + geometry.width,
      y2: geometry.top + geometry.height,
    }),
    createSvgSupText(
      [
        { text: "Wavenumber [cm" },
        { text: "-1", sup: true },
        { text: "]" },
      ],
      geometry.left + geometry.width / 2,
      irPlot.height - 8,
      "xrd-axis-title",
      {
        "text-anchor": "middle",
      },
    ),
    createXrdText("Normalized absorbance [a.u.]", 16, geometry.top + geometry.height / 2, "xrd-axis-title", {
      "text-anchor": "middle",
      transform: `rotate(-90 16 ${geometry.top + geometry.height / 2})`,
    }),
  );

  if (!hasSpectrum) {
    nodes.push(
      createXrdText("No ATR-IR data", irPlot.width / 2, irPlot.height / 2, "xrd-empty", {
        "text-anchor": "middle",
      }),
    );
  } else {
    nodes.push(
      createSvgElement("polyline", {
        class: "ir-pattern-line",
        points: irPathFor(spectrum, geometry, irData?.x, xRange),
        stroke: irPlot.color,
      }),
    );
  }

  els.irPlot.setAttribute("viewBox", `0 0 ${irPlot.width} ${irPlot.height}`);
  els.irPlot.replaceChildren(...nodes);
  els.irStatus.textContent = hasSpectrum ? "1/1 spectrum" : "No data";
  if (els.irZoomOut) els.irZoomOut.disabled = state.irZoom <= 1;
  if (els.irZoomIn) els.irZoomIn.disabled = state.irZoom >= 8;
  if (els.irReset) els.irReset.disabled = state.irZoom <= 1 && Math.abs(state.irPan) < 0.0001;
}

function csvValue(value) {
  if (value === null || value === undefined || value === "") return "";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "";
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function xValueAt(index, xMeta, fallbackStart, fallbackStep) {
  const start = Number(xMeta?.start) || fallbackStart;
  const step = Number(xMeta?.step) || fallbackStep;
  return Number((start + step * index).toFixed(5));
}

function downloadCsv(rows, filename) {
  const csv = rows.map((row) => row.map(csvValue).join(",")).join("\r\n");
  downloadBlob(new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" }), filename);
}

function spectrumFilePrefix(kind) {
  const fileSafeConcentration = formatConcentrationFile(state.concentration);
  return `${kind}-${state.dataset}-sample-${state.sample}-${fileSafeConcentration}`;
}

function downloadXrdCsv() {
  const sample = currentSample();
  if (!sample) return;

  const xrdData = window.XRD_DATA;
  const triplicates = xrdTriplicatesFor(sample, state.concentration);
  const labels = xrdData?.syntheses || ["First synthesis", "Second synthesis", "Third synthesis"];
  const maxLength = Math.max(0, ...triplicates.map((values) => (Array.isArray(values) ? values.length : 0)));
  const rows = [["2theta [degree]", ...labels.map((label) => `${label} normalized intensity [a.u.]`)]];

  for (let index = 0; index < maxLength; index += 1) {
    rows.push([
      xValueAt(index, xrdData?.x, 5, 0.02),
      ...triplicates.map((values) => (Array.isArray(values) ? values[index] : "")),
    ]);
  }

  downloadCsv(rows, `${spectrumFilePrefix("PXRD")}.csv`);
}

function downloadIrCsv() {
  const sample = currentSample();
  if (!sample) return;

  const irData = window.IR_DATA;
  const spectrum = irSpectrumFor(sample, state.concentration);
  const rows = [["Wavenumber [cm^-1]", "Normalized absorbance [a.u.]"]];

  if (Array.isArray(spectrum)) {
    spectrum.forEach((value, index) => {
      rows.push([xValueAt(index, irData?.x, 4000, -4), value]);
    });
  }

  downloadCsv(rows, `${spectrumFilePrefix("ATR-IR")}.csv`);
}

function spectrumExportStyles() {
  return `
    svg { background: #ffffff; }
    text { font-family: Arial, sans-serif; letter-spacing: 0; }
    .xrd-plot-bg { fill: #ffffff; }
    .xrd-grid-line { stroke: rgba(29, 37, 40, 0.12); stroke-width: 1; }
    .xrd-axis-line { stroke: #172124; stroke-width: 1.6; }
    .xrd-pattern-line { fill: none; stroke-width: 1.9; stroke-linejoin: round; stroke-linecap: round; }
    .ir-pattern-line { fill: none; stroke: ${irPlot.color}; stroke-width: 1.9; stroke-linejoin: round; stroke-linecap: round; }
    .xrd-tick-label, .xrd-axis-title, .xrd-line-label { fill: #172124; font-size: 12px; font-weight: 720; }
    .xrd-line-label { font-size: 11px; font-weight: 780; }
    .xrd-axis-title { font-size: 13px; font-weight: 400; }
    .xrd-empty { fill: #637074; font-size: 18px; font-weight: 780; }
  `;
}

function cloneSpectrumSvg(svg, width, height) {
  const clone = svg.cloneNode(true);
  clone.setAttribute("xmlns", SVG_NS);
  clone.setAttribute("width", width);
  clone.setAttribute("height", height);

  const background = createSvgElement("rect", {
    x: 0,
    y: 0,
    width,
    height,
    fill: "#ffffff",
  });
  const defs = createSvgElement("defs");
  const style = createSvgElement("style");
  style.textContent = spectrumExportStyles();
  defs.append(style);
  clone.prepend(background);
  clone.prepend(defs);
  return clone;
}

function downloadSpectrumPng(kind) {
  const isXrd = kind === "xrd";
  const svg = isXrd ? els.xrdPlot : els.irPlot;
  const width = isXrd ? xrdPlot.width : irPlot.width;
  const height = isXrd ? xrdPlot.height : irPlot.height;
  if (!svg) return;

  const clone = cloneSpectrumSvg(svg, width, height);
  const svgText = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width * plot.exportScale;
    canvas.height = height * plot.exportScale;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      async (blob) => {
        if (blob) {
          const dpiBlob = await pngWithDpi(blob, 300);
          downloadBlob(dpiBlob, `${spectrumFilePrefix(isXrd ? "PXRD" : "ATR-IR")}.png`);
        }
        URL.revokeObjectURL(url);
      },
      "image/png",
      1,
    );
  };
  image.onerror = () => URL.revokeObjectURL(url);
  image.src = url;
}

function setSpectrumZoom(kind, nextZoom) {
  const key = kind === "xrd" ? "xrdZoom" : "irZoom";
  const panKey = kind === "xrd" ? "xrdPan" : "irPan";
  const xMeta = kind === "xrd" ? window.XRD_DATA?.x : window.IR_DATA?.x;
  const zoom = clamp(nextZoom, 1, 8);
  const panLimit = spectrumPanLimit(xMeta, zoom);
  state = {
    ...state,
    [key]: zoom,
    [panKey]: zoom <= 1 ? 0 : clamp(state[panKey], -panLimit, panLimit),
  };

  const sample = currentSample();
  if (!sample) return;
  if (kind === "xrd") {
    renderXrdPlot(sample);
  } else {
    renderIrPlot(sample);
  }
}

function resetSpectrumView(kind) {
  const zoomKey = kind === "xrd" ? "xrdZoom" : "irZoom";
  const panKey = kind === "xrd" ? "xrdPan" : "irPan";
  state = {
    ...state,
    [zoomKey]: 1,
    [panKey]: 0,
  };

  const sample = currentSample();
  if (!sample) return;
  if (kind === "xrd") {
    renderXrdPlot(sample);
  } else {
    renderIrPlot(sample);
  }
}

function setSpectrumPan(kind, nextPan) {
  const panKey = kind === "xrd" ? "xrdPan" : "irPan";
  const zoom = kind === "xrd" ? state.xrdZoom : state.irZoom;
  const xMeta = kind === "xrd" ? window.XRD_DATA?.x : window.IR_DATA?.x;
  const panLimit = spectrumPanLimit(xMeta, zoom);

  state = {
    ...state,
    [panKey]: clamp(nextPan, -panLimit, panLimit),
  };

  const sample = currentSample();
  if (!sample) return;
  if (kind === "xrd") {
    renderXrdPlot(sample);
  } else {
    renderIrPlot(sample);
  }
}

function createMetricChip(metricKey, sample, concentration) {
  const chip = document.createElement("span");
  chip.className = "metric-value";

  const entry = metricEntry(metricKey, sample, concentration);
  const value = Number(entry?.value);
  chip.textContent = formatMetricEntry(entry, false, metricKey);

  if (Number.isFinite(value)) {
    const color = colorForMetric(metricKey, value);
    chip.style.background = `${color}24`;
    chip.style.borderColor = `${color}88`;
  } else {
    const color = metricPalettes[metricKey]?.missing || "#4A4A4A";
    chip.style.background = color;
    chip.style.borderColor = color;
    chip.style.color = "#ffffff";
  }

  return chip;
}

function resetSelectedPhaseStyle() {
  els.selectedPhase.classList.remove("is-mixed-phase");
  els.selectedPhase.style.backgroundImage = "";
  els.selectedPhase.style.backgroundClip = "";
  els.selectedPhase.style.removeProperty("-webkit-background-clip");
  els.selectedPhase.style.removeProperty("-webkit-text-fill-color");
  els.selectedPhase.style.color = "";
}

function renderSelectedPhase(phase, stats = null) {
  resetSelectedPhaseStyle();
  if (phaseColorComponents(phase, stats).length > 1) {
    els.selectedPhase.classList.add("is-mixed-phase");
    renderMixedPhaseText(els.selectedPhase, phase, stats, { showError: true });
    return;
  }

  renderPhaseText(els.selectedPhase, phase);
  els.selectedPhase.style.color = colorForPhase(phase);
}

function stylePhaseChip(chip, phase, stats = null) {
  const phaseType = normalizePhase(phase);
  const phaseColor = colorForPhase(phase);
  chip.classList.toggle("is-mixed-phase", phaseColorComponents(phase, stats).length > 1);

  if (phaseColorComponents(phase, stats).length > 1) {
    chip.style.background = phaseGradientCss(phase, 0.15, true, stats);
    chip.style.borderColor = palette.mixed;
    chip.style.color = "#172124";
    return;
  }

  chip.style.background = phaseType === "missing" ? phaseColor : `${phaseColor}26`;
  chip.style.borderColor = phaseType === "missing" ? phaseColor : `${phaseColor}9A`;
  chip.style.color = phaseType === "missing" ? "#ffffff" : "";
}

function updateDetail() {
  const sample = currentSample();
  if (!sample) {
    renderDatasetLabel(els.detailDataset, state.dataset);
    if (els.detailHeaderConcentration) els.detailHeaderConcentration.textContent = "";
    els.detailTitle.textContent = "No sample selected";
    els.selectedConcentration.textContent = "";
    resetSelectedPhaseStyle();
    els.selectedPhase.textContent = "";
    [
      els.detailM,
      els.detailL,
      els.detailBSA,
      els.detailRatio,
      els.detailEE,
      els.detailLC,
      els.detailIR,
      els.detailAF,
      els.detailFramework,
    ]
      .filter(Boolean)
      .forEach((item) => {
        item.replaceChildren();
      });
    els.phaseRows.replaceChildren();
    renderXrdPlot(null);
    renderIrPlot(null);
    return;
  }

  const phase = sample.phases[state.concentration] || "-";
  const phaseStats = phaseStatsFor(sample, state.concentration);
  const eeEntry = metricEntry("EE", sample, state.concentration);
  const lcEntry = metricEntry("LC", sample, state.concentration);
  const irEntry = metricEntry("IR", sample, state.concentration);
  const afEntry = metricEntry("AF", sample, state.concentration);
  const currentFrameworkEntry = frameworkEntry(sample, state.concentration);

  renderDatasetLabel(els.detailDataset, state.dataset);
  els.detailTitle.textContent = `Sample ${sample.sample}`;
  if (els.detailHeaderConcentration) renderConcentrationHtml(els.detailHeaderConcentration, state.concentration);
  renderConcentrationHtml(els.selectedConcentration, state.concentration);
  renderSelectedPhase(phase, phaseStats);
  els.detailM.textContent = formatNumber(sample.M);
  els.detailL.textContent = formatNumber(sample.L);
  els.detailBSA.textContent = formatNumber(sample.BSA);
  els.detailRatio.textContent = formatNumber(sample.ratio);
  els.detailEE.textContent = formatMetricEntry(eeEntry, true, "EE");
  els.detailLC.textContent = formatMetricEntry(lcEntry, true, "LC");
  if (els.detailIR) els.detailIR.textContent = formatMetricEntry(irEntry, true, "IR");
  if (els.detailAF) els.detailAF.textContent = formatMetricEntry(afEntry, true, "AF");
  renderFrameworkDetail(els.detailFramework, currentFrameworkEntry);
  renderXrdPlot(sample);
  renderIrPlot(sample);

  els.phaseRows.replaceChildren(
    ...[...PHASE_DATA.concentrations].reverse().map((concentration) => {
      const row = document.createElement("tr");
      row.className = "phase-row";
      row.classList.toggle("is-active", concentration === state.concentration);
      row.addEventListener("click", () => selectSample(sample.sample, concentration));

      const concentrationCell = document.createElement("td");
      renderConcentrationHtml(concentrationCell, concentration);

      const phaseCell = document.createElement("td");
      const chip = document.createElement("span");
      const rowPhase = sample.phases[concentration] || "-";
      const rowPhaseStats = phaseStatsFor(sample, concentration);
      chip.className = "phase-chip";
      if (!renderMixedPhaseText(chip, rowPhase, rowPhaseStats, { showError: false })) {
        renderPhaseText(chip, rowPhase);
      }
      stylePhaseChip(chip, rowPhase, rowPhaseStats);
      phaseCell.append(chip);

      const frameworkCell = document.createElement("td");
      renderFrameworkTableRatio(frameworkCell, frameworkEntry(sample, concentration));

      const eeCell = document.createElement("td");
      eeCell.append(createMetricChip("EE", sample, concentration));

      const lcCell = document.createElement("td");
      lcCell.append(createMetricChip("LC", sample, concentration));

      const irCell = document.createElement("td");
      irCell.append(createMetricChip("IR", sample, concentration));

      const afCell = document.createElement("td");
      afCell.append(createMetricChip("AF", sample, concentration));

      row.append(concentrationCell, phaseCell, frameworkCell, eeCell, lcCell, irCell, afCell);
      return row;
    }),
  );
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clientToSvgPoint(event) {
  const ctm = els.svg.getScreenCTM();
  if (!ctm) return null;

  const point = els.svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  return point.matrixTransform(ctm.inverse());
}

function pickSampleAt(event) {
  const point = clientToSvgPoint(event);
  if (!point) return null;

  const radius = scaledSampleCircleSize(18);
  const radiusSquared = radius * radius;
  let best = null;

  hitTargets.forEach((target) => {
    const dx = point.x - target.x;
    const dy = point.y - target.y;
    const distanceSquared = dx * dx + dy * dy;
    if (distanceSquared > radiusSquared) return;

    if (
      !best ||
      distanceSquared < best.distanceSquared - 2 ||
      (Math.abs(distanceSquared - best.distanceSquared) <= 2 && target.depth > best.depth)
    ) {
      best = {
        ...target,
        distanceSquared,
      };
    }
  });

  return best;
}

function setZoom(nextZoom) {
  state = {
    ...state,
    zoom: clamp(nextZoom, 0.55, 2.8),
  };
  renderPlot();
}

function setView(view) {
  const shortcutPanStep = plot.gridStep * 2;
  const views = {
    z: { rotationX: 0, rotationY: 0, rotationZ: 0, panX: -shortcutPanStep, panY: 0 },
    l: { rotationX: 0.07, rotationY: 0, rotationZ: 0, panX: -shortcutPanStep, panY: 0 },
    y: { rotationX: 1.25, rotationY: 0, rotationZ: 0, panX: -shortcutPanStep, panY: 0 },
    x: { rotationX: 1.18, rotationY: -1.25, rotationZ: 0, panX: shortcutPanStep, panY: 0 },
  };

  state = {
    ...state,
    ...(views[view] || defaultView),
  };
  renderPlot();
}

function renderFilterControls() {
  if (els.searchConcentration) {
    els.searchConcentration.min = String(searchConcentrationBounds.min);
    els.searchConcentration.max = String(searchConcentrationBounds.max);
    els.searchConcentration.step = String(searchConcentrationBounds.step);
  }

  const allConcentration = document.createElement("button");
  allConcentration.className = "filter-button is-active";
  allConcentration.type = "button";
  allConcentration.dataset.concentrationFilter = "all";
  allConcentration.textContent = "All";

  const concentrationButtons = PHASE_DATA.concentrations.map((concentration) => {
    const button = document.createElement("button");
    button.className = "filter-button";
    button.type = "button";
    button.dataset.concentrationFilter = concentration;
    renderConcentrationHtml(button, concentration);
    return button;
  });
  els.concentrationFilters.replaceChildren(allConcentration, ...concentrationButtons);

  const allPhase = document.createElement("button");
  allPhase.className = "filter-button is-active";
  allPhase.type = "button";
  allPhase.dataset.phaseFilter = "all";
  allPhase.textContent = "All";

  const phaseButtons = phaseFamilies.map(([label, key]) => {
    const button = document.createElement("button");
    button.className = "filter-button";
    button.type = "button";
    button.dataset.phaseFilter = key;

    const isPrimaryPhase = key !== "mixed";
    const text = document.createElement(isPrimaryPhase ? "strong" : "span");
    text.className = `phase-filter-label${isPrimaryPhase ? " is-primary-phase" : ""}`;
    text.textContent = label;

    button.append(createLegendSwatch(key, "phase-dot"), text);
    return button;
  });
  els.phaseFilters.replaceChildren(allPhase, ...phaseButtons);
}

function updateControlStates() {
  els.tabs.forEach((item) => {
    renderDatasetLabel(item, item.dataset.dataset);
    item.setAttribute("aria-label", datasetPlainLabel(item.dataset.dataset));
    item.classList.toggle("is-active", item.dataset.dataset === state.dataset);
  });
  els.concentrationFilters.querySelectorAll("[data-concentration-filter]").forEach((button) => {
    button.classList.toggle(
      "is-active",
      button.dataset.concentrationFilter === state.visibleConcentration,
    );
  });
  els.phaseFilters.querySelectorAll("[data-phase-filter]").forEach((button) => {
    const active = phaseFilterButtonActive(button.dataset.phaseFilter);
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  els.visualizationFilters.querySelectorAll("[data-visualization]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.visualization === state.visualization);
  });
  if (els.sampleNumberToggle) {
    els.sampleNumberToggle.checked = state.showSampleNumbers;
  }
  if (els.concentrationLabelToggle) {
    els.concentrationLabelToggle.checked = state.showConcentrationLabels;
  }
  if (els.axisLabelToggle) {
    els.axisLabelToggle.checked = state.showAxisLabels;
  }
  if (els.axisTickToggle) {
    els.axisTickToggle.checked = state.showAxisTicks;
  }
  if (els.concentrationFontScale) {
    els.concentrationFontScale.value = String(state.concentrationFontScale);
  }
  if (els.axisTickFontScale) {
    els.axisTickFontScale.value = String(state.axisTickFontScale);
  }
  if (els.axisLabelFontScale) {
    els.axisLabelFontScale.value = String(state.axisLabelFontScale);
  }
  if (els.legendFontScale) {
    els.legendFontScale.value = String(state.legendFontScale);
  }
  if (els.sampleCircleSizeLevel) {
    els.sampleCircleSizeLevel.value = String(state.sampleCircleSizeLevel);
  }
  if (els.sampleNumberSizeLevel) {
    els.sampleNumberSizeLevel.value = String(state.sampleNumberSizeLevel);
  }
  if (els.layerGapControl) {
    els.layerGapControl.min = String(plot.minLayerGap);
    els.layerGapControl.max = String(plot.maxLayerGap);
    els.layerGapControl.step = String(plot.layerGapStep);
    els.layerGapControl.value = String(state.layerGap);
  }
  if (els.layerGapNumber) {
    const displayValue = String(Math.round(state.layerGap));
    els.layerGapNumber.min = String(plot.minLayerGap);
    els.layerGapNumber.max = String(plot.maxLayerGap);
    els.layerGapNumber.step = String(plot.layerGapStep);
    els.layerGapNumber.value = displayValue;
  }
  els.valueFilters.querySelectorAll("[data-filter-key][data-range-bound]").forEach((input) => {
    const range = state.valueFilters[input.dataset.filterKey];
    input.value = range[input.dataset.rangeBound];
  });
  if (els.compositionSearch) {
    const search = searchPointStatus();
    els.searchInputs.forEach((input) => {
      input.min = "0";
      input.max = "100";
      input.step = "1";
      input.value = state.searchPoint[input.dataset.searchKey] ?? "";
    });
    if (els.searchConcentration) {
      els.searchConcentration.min = String(searchConcentrationBounds.min);
      els.searchConcentration.max = String(searchConcentrationBounds.max);
      els.searchConcentration.step = String(searchConcentrationBounds.step);
      els.searchConcentration.value =
        state.searchPoint.concentration ?? defaultSearchPoint.concentration;
    }
    els.compositionSearch.classList.toggle("has-search-point", search.valid);
    els.compositionSearch.classList.toggle("has-search-error", search.hasInput && !search.valid);
    if (els.searchStatus) {
      els.searchStatus.textContent = search.message;
    }
  }
  els.modeTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.dragMode === state.dragMode);
  });
  els.plotFrame.classList.toggle("is-pan-mode", state.dragMode === "pan");
}

function resetValueFilters() {
  state = {
    ...state,
    valueFilters: valueFilterKeys.reduce(
      (filters, key) => ({ ...filters, [key]: { ...defaultValueFilters[key] } }),
      {},
    ),
  };
}

function updateValueFilter(input) {
  const key = input.dataset.filterKey;
  const bound = input.dataset.rangeBound;
  if (!valueFilterKeys.includes(key) || (bound !== "min" && bound !== "max")) return;

  const fallback = defaultValueFilters[key][bound];
  const value = clamp(input.value === "" ? fallback : Number(input.value), 0, 100);
  const current = state.valueFilters[key] || defaultValueFilters[key];
  const nextRange = {
    ...current,
    [bound]: value,
  };

  state = {
    ...state,
    valueFilters: {
      ...state.valueFilters,
      [key]: nextRange,
    },
  };
}

function updateSearchPointFromControls(changedKey = null) {
  const nextSearch = { ...state.searchPoint };
  els.searchInputs.forEach((input) => {
    nextSearch[input.dataset.searchKey] = input.value;
  });
  if (els.searchConcentration) {
    nextSearch.concentration = els.searchConcentration.value;
  }

  state = {
    ...state,
    searchPoint: autoCompleteSearchPoint(nextSearch, changedKey),
  };
  updateControlStates();
  renderPlot();
}

function clearSearchPoint() {
  state = {
    ...state,
    searchPoint: {
      ...defaultSearchPoint,
      concentration: state.searchPoint.concentration || defaultSearchPoint.concentration,
    },
  };
  updateControlStates();
  renderPlot();
}

function bindRotation() {
  els.svg.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 && event.button !== 1) return;
    event.preventDefault();
    const mode = event.shiftKey || event.button === 1 ? "pan" : state.dragMode;
    dragState = {
      mode,
      startX: event.clientX,
      startY: event.clientY,
      rotationX: state.rotationX,
      rotationY: state.rotationY,
      panX: state.panX,
      panY: state.panY,
      moved: false,
    };
    els.svg.setPointerCapture(event.pointerId);
    els.plotFrame.classList.add("is-dragging");
  });

  els.svg.addEventListener("pointermove", (event) => {
    if (!dragState) return;

    const dx = event.clientX - dragState.startX;
    const dy = event.clientY - dragState.startY;
    dragState.moved = dragState.moved || Math.abs(dx) + Math.abs(dy) > 4;
    if (dragState.mode === "pan") {
      const bounds = els.svg.getBoundingClientRect();
      state = {
        ...state,
        panX: dragState.panX + dx * (plot.width / Math.max(1, bounds.width)),
        panY: dragState.panY + dy * (plot.height / Math.max(1, bounds.height)),
      };
    } else {
      state = {
        ...state,
        rotationY: dragState.rotationY + dx * 0.006,
        rotationX: clamp(dragState.rotationX + dy * 0.006, -1.35, 1.35),
      };
    }
    renderPlot();
  });

  const stopDragging = (event) => {
    if (!dragState) return;
    const wasClick = !dragState.moved;
    dragState = null;
    els.plotFrame.classList.remove("is-dragging");
    if (event.pointerId !== undefined && els.svg.hasPointerCapture(event.pointerId)) {
      els.svg.releasePointerCapture(event.pointerId);
    }
    if (wasClick) {
      const picked = pickSampleAt(event);
      if (picked) {
        selectSample(picked.sample, picked.concentration);
      }
    }
  };

  els.svg.addEventListener("pointerup", stopDragging);
  els.svg.addEventListener("pointercancel", stopDragging);

  els.svg.addEventListener("dblclick", (event) => {
    const picked = pickSampleAt(event);
    if (picked) return;
    clearSampleSelection();
  });

  els.svg.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      const nextZoom = state.zoom * (event.deltaY < 0 ? 1.08 : 0.92);
      setZoom(nextZoom);
    },
    { passive: false },
  );
}

function bindSpectrumPan(svg, kind) {
  if (!svg) return;

  let spectrumDrag = null;
  svg.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();

    const zoom = kind === "xrd" ? state.xrdZoom : state.irZoom;
    const pan = kind === "xrd" ? state.xrdPan : state.irPan;
    const xMeta = kind === "xrd" ? window.XRD_DATA?.x : window.IR_DATA?.x;
    const bounds = svg.getBoundingClientRect();
    const range = spectrumRange(xMeta, zoom, pan);

    spectrumDrag = {
      startX: event.clientX,
      startPan: pan,
      range,
      width: Math.max(1, bounds.width),
    };
    svg.setPointerCapture(event.pointerId);
    svg.classList.add("is-spectrum-dragging");
  });

  svg.addEventListener("pointermove", (event) => {
    if (!spectrumDrag) return;
    const dx = event.clientX - spectrumDrag.startX;
    const visibleSpan = Math.max(1, spectrumDrag.range.max - spectrumDrag.range.min);
    const direction = spectrumDrag.range.descending ? 1 : -1;
    const nextPan = spectrumDrag.startPan + direction * (dx / spectrumDrag.width) * visibleSpan;
    setSpectrumPan(kind, nextPan);
  });

  const stopSpectrumDrag = (event) => {
    if (!spectrumDrag) return;
    spectrumDrag = null;
    svg.classList.remove("is-spectrum-dragging");
    if (event.pointerId !== undefined && svg.hasPointerCapture(event.pointerId)) {
      svg.releasePointerCapture(event.pointerId);
    }
  };

  svg.addEventListener("pointerup", stopSpectrumDrag);
  svg.addEventListener("pointercancel", stopSpectrumDrag);
}

function exportStyles() {
  const layerLabelSize = 18 * state.concentrationFontScale;
  const axisLabelSize = 13 * state.axisLabelFontScale;
  const tickLabelSize = 8 * state.axisTickFontScale;
  const legendTextSize = 13 * legendFontScaleValue();
  return `
    svg { background: #ffffff; }
    text { font-family: Arial, sans-serif; letter-spacing: 0; }
    .layer-shadow { fill: transparent; }
    .layer-plane { fill: transparent; stroke: rgba(45, 47, 41, 0.62); stroke-width: 1.25; }
    .layer-grid { stroke: rgba(124, 117, 103, 0.28); stroke-width: 0.9; }
    .layer-edge { stroke: rgba(29, 37, 40, 0.58); stroke-width: 1; }
    .layer-label { fill: #000000; font-size: ${layerLabelSize}px; font-weight: 760; }
    .axis-label { fill: #000000; font-size: ${axisLabelSize}px; font-weight: 780; }
    .tick-label { fill: #000000; font-size: ${tickLabelSize}px; font-weight: 720; }
    .sample-hit { fill: transparent; }
    .sample-dot { stroke: #ffffff; stroke-width: 2; }
    .framework-ball { filter: none; }
    .framework-slice { stroke-width: 0.45; }
    .framework-ball-shade { fill: url(#frameworkBallGloss); }
    .framework-outline { fill: none; }
    .sample-number { fill: #000000; font-size: 9.5px; font-weight: 800; text-anchor: middle; dominant-baseline: middle; paint-order: stroke; stroke: #ffffff; stroke-width: 3px; }
    .sample-ring { opacity: 0; }
    .sample-point.is-selected-sample .sample-dot { stroke: #1d2528; stroke-width: 2.4; }
    .sample-point.is-selected-layer .sample-ring { fill: none; stroke: #1d2528; stroke-width: 3; opacity: 1; }
    .export-legend-panel { fill: #ffffff; stroke: none; }
    .export-legend-text { fill: #1d2528; font-size: ${legendTextSize}px; font-weight: 760; dominant-baseline: middle; }
    .export-legend-text-bold { fill: #1d2528; font-size: ${legendTextSize}px; font-weight: 850; dominant-baseline: middle; }
    .export-legend-swatch { stroke: rgba(0, 0, 0, 0.2); stroke-width: 1; }
    .export-metric-scale { stroke: rgba(0, 0, 0, 0.22); stroke-width: 1; }
  `;
}

function exportContentBottom(svgNode = els.svg) {
  let bottom = 0;

  svgNode?.querySelectorAll(".layer-plane, .plot-grid-fill").forEach((node) => {
    const points = String(node.getAttribute("points") || "")
      .trim()
      .split(/\s+/)
      .map((pair) => Number(pair.split(",")[1]))
      .filter(Number.isFinite);
    if (points.length) bottom = Math.max(bottom, ...points);
  });

  svgNode?.querySelectorAll(".sample-dot, .sample-ring").forEach((node) => {
    const cy = Number(node.getAttribute("cy"));
    const r = Number(node.getAttribute("r"));
    if (Number.isFinite(cy) && Number.isFinite(r)) {
      bottom = Math.max(bottom, cy + r);
    }
  });

  svgNode?.querySelectorAll(".layer-label, .axis-label, .tick-label").forEach((node) => {
    const y = Number(node.getAttribute("y"));
    if (Number.isFinite(y)) bottom = Math.max(bottom, y + 18);
  });

  return bottom || plot.height;
}

function mergeExportBounds(bounds, next) {
  if (
    !next ||
    !Number.isFinite(next.x) ||
    !Number.isFinite(next.y) ||
    !Number.isFinite(next.width) ||
    !Number.isFinite(next.height)
  ) {
    return bounds;
  }

  return {
    minX: Math.min(bounds.minX, next.x),
    minY: Math.min(bounds.minY, next.y),
    maxX: Math.max(bounds.maxX, next.x + next.width),
    maxY: Math.max(bounds.maxY, next.y + next.height),
  };
}

function elementExportBox(node) {
  if (!node || typeof node.getBBox !== "function") return null;
  try {
    const box = node.getBBox();
    if (!Number.isFinite(box.x) || !Number.isFinite(box.y)) return null;
    return box;
  } catch (error) {
    return null;
  }
}

function pointsExportBox(node) {
  const points = String(node.getAttribute("points") || "")
    .trim()
    .split(/\s+/)
    .map((pair) => pair.split(",").map(Number))
    .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
  if (!points.length) return null;
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return {
    x: minX,
    y: minY,
    width: Math.max(...xs) - minX,
    height: Math.max(...ys) - minY,
  };
}

function lineExportBox(node) {
  const x1 = Number(node.getAttribute("x1"));
  const y1 = Number(node.getAttribute("y1"));
  const x2 = Number(node.getAttribute("x2"));
  const y2 = Number(node.getAttribute("y2"));
  if (![x1, y1, x2, y2].every(Number.isFinite)) return null;
  const minX = Math.min(x1, x2);
  const minY = Math.min(y1, y2);
  return {
    x: minX,
    y: minY,
    width: Math.max(x1, x2) - minX,
    height: Math.max(y1, y2) - minY,
  };
}

function circleExportBox(node) {
  const cx = Number(node.getAttribute("cx"));
  const cy = Number(node.getAttribute("cy"));
  const r = Number(node.getAttribute("r"));
  if (![cx, cy, r].every(Number.isFinite)) return null;
  return {
    x: cx - r,
    y: cy - r,
    width: r * 2,
    height: r * 2,
  };
}

function textExportBox(node) {
  const x = Number(node.getAttribute("x"));
  const y = Number(node.getAttribute("y"));
  if (![x, y].every(Number.isFinite)) return null;

  const className = String(node.getAttribute("class") || "").split(/\s+/)[0] || "";
  const styleSize = Number(String(node.getAttribute("style") || "").match(/font-size:\s*([\d.]+)/)?.[1]);
  const size = Number.isFinite(styleSize) ? styleSize : scaledSize(textSizeForClass(className));
  const width = Math.max(10, estimatedExportTextWidth(node.textContent || "", size));
  const height = Math.max(10, size * 1.25);
  const anchor = node.getAttribute("text-anchor");
  const left = anchor === "end" ? x - width : anchor === "middle" ? x - width / 2 : x;

  return {
    x: left,
    y: y - height,
    width,
    height: height * 1.35,
  };
}

function manualElementExportBox(node) {
  const tagName = String(node?.tagName || "").toLowerCase();
  if (tagName === "polygon" || tagName === "polyline") return pointsExportBox(node);
  if (tagName === "line") return lineExportBox(node);
  if (tagName === "circle") return circleExportBox(node);
  if (tagName === "text") return textExportBox(node);
  return null;
}

function exportContentBounds(svgNode = els.svg) {
  const initialBounds = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
  };
  const selectors = [
    ".ternary-layer",
    ".sample-point",
    ".framework-ball",
    ".sample-dot",
    ".sample-ring",
    ".layer-plane",
    ".layer-shadow",
    ".layer-grid",
    ".layer-edge",
    ".layer-label",
    ".axis-label",
    ".tick-label",
  ].join(", ");
  const bounds = Array.from(svgNode?.querySelectorAll(selectors) || []).reduce(
    (merged, node) => mergeExportBounds(mergeExportBounds(merged, manualElementExportBox(node)), elementExportBox(node)),
    initialBounds,
  );

  if (
    Number.isFinite(bounds.minX) &&
    Number.isFinite(bounds.minY) &&
    Number.isFinite(bounds.maxX) &&
    Number.isFinite(bounds.maxY)
  ) {
    return bounds;
  }

  return {
    minX: 0,
    minY: 0,
    maxX: plot.width,
    maxY: exportContentBottom(svgNode),
  };
}

function exportLegendLayout(svgNode = els.svg) {
  const panelHeight = Math.max(30, Math.round(44 * legendFontScaleValue()));
  const previousPanelY = plot.height + 22;
  const contentBottom = exportContentBottom(svgNode);
  const panelY = contentBottom + Math.max(18, (previousPanelY - contentBottom) / 2);
  const diagramBounds = triangleScreenBounds(svgNode);
  return {
    panelHeight,
    panelY,
    centerY: panelY + panelHeight / 2,
    diagramCenterX: diagramBounds.centerX,
    diagramWidth: diagramBounds.width,
    height: panelY + panelHeight + 28,
  };
}

function exportViewport(layout, svgNode = els.svg) {
  const bounds = exportContentBounds(svgNode);
  const margin = 72;
  const x = Math.floor(Math.min(0, bounds.minX - margin));
  const y = Math.floor(Math.min(0, bounds.minY - margin));
  const right = Math.ceil(Math.max(plot.width, bounds.maxX + margin));
  const bottom = Math.ceil(Math.max(layout.height, bounds.maxY + margin));
  return {
    x,
    y,
    width: right - x,
    height: bottom - y,
  };
}

function exportLegendTargetWidth(layout = exportLegendLayout()) {
  const widthScale = Math.max(1, 1 + (legendFontScaleValue() - 1) * 0.18);
  return clamp(layout.diagramWidth * widthScale, 260, plot.width - 220);
}

function exportLegendPanelX(panelWidth, layout = exportLegendLayout()) {
  return layout.diagramCenterX - panelWidth / 2;
}

function estimatedExportTextWidth(text, size = 13) {
  return String(text || "").length * size * 0.56;
}

function createExportText(text, x, y, className = "export-legend-text", attrs = {}) {
  const node = createSvgElement("text", {
    class: className,
    x,
    y,
    ...attrs,
  });
  node.textContent = text;
  return node;
}

function createExportColorLegendSwatch(color, cx, cy, r = 6) {
  return createSvgElement("circle", {
    class: "export-legend-swatch",
    cx,
    cy,
    r,
    fill: color,
  });
}

function createExportLegendSwatch(key, cx, cy, r = 6) {
  if (key !== "mixed") {
    return [createExportColorLegendSwatch(palette[key], cx, cy, r)];
  }

  return [
    createSvgElement("circle", {
      cx,
      cy,
      r,
      fill: mixedLegendColors.right,
    }),
    createSvgElement("path", {
      d: `M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} L ${cx} ${cy - r} Z`,
      fill: mixedLegendColors.left,
    }),
    createSvgElement("circle", {
      class: "export-legend-swatch",
      cx,
      cy,
      r,
      fill: "none",
    }),
  ];
}

function createExportLegend(layout = exportLegendLayout()) {
  const group = createSvgElement("g", {
    class: "export-legend",
    "aria-hidden": "true",
  });
  const { panelHeight, panelY, centerY } = layout;
  const legendScale = legendFontScaleValue();
  const legendTextSize = 13 * legendScale;
  const swatchRadius = Math.max(4, 6 * legendScale);
  const swatchTextGap = Math.max(6, 7 * legendScale);
  const itemGapBase = Math.max(12, 18 * legendScale);
  const panelPadding = Math.max(14, 14 * legendScale);
  const itemTextX = (x) => x + swatchRadius * 2 + swatchTextGap;

  if (state.visualization === "phase") {
    const itemWidths = phaseFamilies.map(([label]) => swatchRadius * 2 + swatchTextGap + estimatedExportTextWidth(label, legendTextSize));
    const itemWidthTotal = itemWidths.reduce((sum, width) => sum + width, 0);
    const panelWidth = Math.max(exportLegendTargetWidth(layout), itemWidthTotal + panelPadding * 2 + itemGapBase * Math.max(0, itemWidths.length - 1));
    const itemGap =
      phaseFamilies.length > 1 ? Math.max(itemGapBase, (panelWidth - panelPadding * 2 - itemWidthTotal) / (phaseFamilies.length - 1)) : 0;
    const panelX = exportLegendPanelX(panelWidth, layout);
    let x = panelX + panelPadding;

    group.append(
      createSvgElement("rect", {
        class: "export-legend-panel",
        x: panelX,
        y: panelY,
        width: panelWidth,
        height: panelHeight,
      }),
    );

    phaseFamilies.forEach(([label, key], index) => {
      group.append(
        ...createExportLegendSwatch(key, x + swatchRadius, centerY, swatchRadius),
        createExportText(label, itemTextX(x), centerY, "export-legend-text-bold"),
      );
      x += itemWidths[index] + itemGap;
    });
    return group;
  }

  if (state.visualization === frameworkModeKey) {
    const items = [
      ...frameworkComponentDefinitions().map((component) => ({
        label: component.label,
        color: component.color,
      })),
      { label: frameworkNoDataLabel(), color: palette.missing },
    ];
    const itemWidths = items.map((item) => swatchRadius * 2 + swatchTextGap + estimatedExportTextWidth(item.label, legendTextSize));
    const itemWidthTotal = itemWidths.reduce((sum, width) => sum + width, 0);
    const panelWidth = Math.max(exportLegendTargetWidth(layout), itemWidthTotal + panelPadding * 2 + itemGapBase * Math.max(0, itemWidths.length - 1));
    const itemGap =
      items.length > 1 ? Math.max(itemGapBase, (panelWidth - panelPadding * 2 - itemWidthTotal) / (items.length - 1)) : 0;
    const panelX = exportLegendPanelX(panelWidth, layout);
    let x = panelX + panelPadding;

    group.append(
      createSvgElement("rect", {
        class: "export-legend-panel",
        x: panelX,
        y: panelY,
        width: panelWidth,
        height: panelHeight,
      }),
    );

    items.forEach((item, index) => {
      group.append(
        createExportColorLegendSwatch(item.color, x + swatchRadius, centerY, swatchRadius),
        createExportText(item.label, itemTextX(x), centerY, "export-legend-text-bold"),
      );
      x += itemWidths[index] + itemGap;
    });
    return group;
  }

  const metricKey = state.visualization;
  const definition = metricDefinition(metricKey);
  const paletteConfig = metricPalettes[metricKey] || metricPalettes.EE;
  const domain = metricColorDomain(metricKey);
  const label = definition?.label || metricKey;
  const labelWidth = estimatedExportTextWidth(label, legendTextSize);
  const metricScaleHeight = Math.max(8, 12 * legendScale);
  const metricScaleMinWidth = Math.max(90, 126 * legendScale);
  const panelWidth = Math.max(
    exportLegendTargetWidth(layout),
    labelWidth + 10 * legendScale + 22 * legendScale + 9 * legendScale + metricScaleMinWidth + 10 * legendScale + 38 * legendScale + 18 * legendScale + swatchRadius * 2 + swatchTextGap + 52 * legendScale + panelPadding * 2,
  );
  const panelX = exportLegendPanelX(panelWidth, layout);
  let x = panelX + panelPadding;
  const scaleWidth = Math.max(
    metricScaleMinWidth,
    panelWidth - panelPadding * 2 - (labelWidth + 10 * legendScale + 22 * legendScale + 9 * legendScale + 10 * legendScale + 38 * legendScale + 18 * legendScale + swatchRadius * 2 + swatchTextGap + 52 * legendScale),
  );
  const gradientId = `exportMetricGradient${metricKey}`;

  const defs = createSvgElement("defs");
  const gradient = createSvgElement("linearGradient", {
    id: gradientId,
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "0%",
  });
  gradient.append(
    createSvgElement("stop", { offset: "0%", "stop-color": paletteConfig.low }),
    createSvgElement("stop", { offset: "100%", "stop-color": paletteConfig.high }),
  );
  defs.append(gradient);

  group.append(
    defs,
    createSvgElement("rect", {
      class: "export-legend-panel",
      x: panelX,
      y: panelY,
      width: panelWidth,
      height: panelHeight,
    }),
    createExportText(label, x, centerY, "export-legend-text-bold"),
  );
  x += labelWidth + 10 * legendScale;
  group.append(createExportText(`${formatNumber(domain.min, 0)}%`, x, centerY));
  x += 31 * legendScale;
  group.append(
    createSvgElement("rect", {
      class: "export-metric-scale",
      x,
      y: centerY - metricScaleHeight / 2,
      width: scaleWidth,
      height: metricScaleHeight,
      rx: metricScaleHeight / 2,
      fill: `url(#${gradientId})`,
    }),
  );
  x += scaleWidth + 10 * legendScale;
  group.append(createExportText(`${formatNumber(domain.max, 0)}%`, x, centerY));
  x += 56 * legendScale;
  group.append(
    createSvgElement("circle", {
      class: "export-legend-swatch",
      cx: x + swatchRadius,
      cy: centerY,
      r: swatchRadius,
      fill: paletteConfig.missing,
      stroke: paletteConfig.missing,
    }),
    createExportText("No data", itemTextX(x), centerY),
  );
  return group;
}

function cloneSvgForFullExport() {
  const previousView = {
    zoom: state.zoom,
    panX: state.panX,
    panY: state.panY,
    layerGap: state.layerGap,
  };

  isExporting = true;
  state = {
    ...state,
    zoom: 1,
    panX: previousView.panX,
    panY: previousView.panY,
    layerGap: previousView.layerGap,
  };
  renderPlot();
  const clone = cloneSvgForExport();

  state = {
    ...state,
    ...previousView,
  };
  isExporting = false;
  renderPlot();
  return clone;
}

function cloneSvgForExport() {
  const layout = exportLegendLayout(els.svg);
  const viewport = exportViewport(layout, els.svg);
  const clone = els.svg.cloneNode(true);
  clone.setAttribute("xmlns", SVG_NS);
  clone.setAttribute("width", viewport.width);
  clone.setAttribute("height", viewport.height);
  clone.setAttribute("viewBox", `${viewport.x} ${viewport.y} ${viewport.width} ${viewport.height}`);

  const background = createSvgElement("rect", {
    x: viewport.x,
    y: viewport.y,
    width: viewport.width,
    height: viewport.height,
    fill: "#ffffff",
  });
  const defs = createSvgElement("defs");
  const style = createSvgElement("style");
  style.textContent = exportStyles();
  defs.append(style);
  clone.append(createExportLegend(layout));
  clone.prepend(background);
  clone.prepend(defs);
  return clone;
}

function downloadBlob(blob, filename) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 3000);
}

function readUint32(bytes, offset) {
  return (
    bytes[offset] * 0x1000000 +
    (bytes[offset + 1] << 16) +
    (bytes[offset + 2] << 8) +
    bytes[offset + 3]
  );
}

function writeUint32(bytes, offset, value) {
  bytes[offset] = (value >>> 24) & 255;
  bytes[offset + 1] = (value >>> 16) & 255;
  bytes[offset + 2] = (value >>> 8) & 255;
  bytes[offset + 3] = value & 255;
}

function crc32(bytes) {
  let crc = -1;
  for (let index = 0; index < bytes.length; index += 1) {
    crc ^= bytes[index];
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ -1) >>> 0;
}

function makePngChunk(type, data) {
  const typeBytes = new TextEncoder().encode(type);
  const chunk = new Uint8Array(12 + data.length);
  writeUint32(chunk, 0, data.length);
  chunk.set(typeBytes, 4);
  chunk.set(data, 8);

  const crcInput = new Uint8Array(typeBytes.length + data.length);
  crcInput.set(typeBytes, 0);
  crcInput.set(data, typeBytes.length);
  writeUint32(chunk, 8 + data.length, crc32(crcInput));
  return chunk;
}

function joinBytes(parts) {
  const length = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  parts.forEach((part) => {
    output.set(part, offset);
    offset += part.length;
  });
  return output;
}

async function pngWithDpi(blob, dpi) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  const pixelsPerMeter = Math.round(dpi * 39.37007874015748);
  const physicalData = new Uint8Array(9);
  writeUint32(physicalData, 0, pixelsPerMeter);
  writeUint32(physicalData, 4, pixelsPerMeter);
  physicalData[8] = 1;
  const physicalChunk = makePngChunk("pHYs", physicalData);

  const output = [bytes.slice(0, 8)];
  let offset = 8;
  while (offset < bytes.length) {
    const length = readUint32(bytes, offset);
    const type = String.fromCharCode(
      bytes[offset + 4],
      bytes[offset + 5],
      bytes[offset + 6],
      bytes[offset + 7],
    );
    const end = offset + 12 + length;

    if (type !== "pHYs") {
      output.push(bytes.slice(offset, end));
    }
    if (type === "IHDR") {
      output.push(physicalChunk);
    }
    offset = end;
  }

  return new Blob([joinBytes(output)], { type: "image/png" });
}

function downloadPng() {
  const clone = cloneSvgForFullExport();
  const svgText = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const image = new Image();
  const fileSafeConcentration = formatConcentrationFile(state.concentration);
  const width = Number(clone.getAttribute("width")) || plot.width;
  const height = Number(clone.getAttribute("height")) || plot.height;

  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width * plot.exportScale;
    canvas.height = height * plot.exportScale;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      async (blob) => {
        if (blob) {
          const dpiBlob = await pngWithDpi(blob, 300);
          downloadBlob(
            dpiBlob,
            `phase-ternary-${state.dataset}-sample-${state.sample}-${fileSafeConcentration}.png`,
          );
        }
        URL.revokeObjectURL(url);
      },
      "image/png",
      1,
    );
  };
  image.src = url;
}

async function waitForPageAssets() {
  await document.fonts?.ready;
  await Promise.all(
    Array.from(document.images).map((image) => {
      if (image.complete && image.naturalWidth) return Promise.resolve();
      return image.decode?.().catch(() => undefined) || Promise.resolve();
    }),
  );
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error("The image could not be converted to a data URL."));
    reader.readAsDataURL(blob);
  });
}

async function imageUrlToDataUrl(url) {
  const response = await fetch(url, { cache: "force-cache" });
  if (!response.ok) {
    throw new Error(`Image request failed with status ${response.status}.`);
  }
  return blobToDataUrl(await response.blob());
}

function imageElementToDataUrl(image) {
  const width = image.naturalWidth || Number(image.getAttribute("width")) || 0;
  const height = image.naturalHeight || Number(image.getAttribute("height")) || 0;
  if (!width || !height) {
    throw new Error("The loaded logo image has no readable intrinsic size.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("The logo data URL canvas could not be created.");
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/png");
}

function embeddedPtcLogoDataUrl() {
  const src = window.PTC_LOGO_DATA_URL;
  return typeof src === "string" && src.startsWith("data:image/") ? src : "";
}

async function pageCaptureLogoInfo() {
  const logo = document.querySelector(".ptc-logo-image");
  if (!logo) return null;

  const rect = logo.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width || logo.width || logo.naturalWidth || 0));
  const height = Math.max(1, Math.round(rect.height || logo.height || logo.naturalHeight || 0));
  const fallbackSrc = logo.currentSrc || logo.src || "PTC.png?v=20260529";
  let src = embeddedPtcLogoDataUrl();
  let safeForCanvas = Boolean(src);

  if (!src) {
    try {
      src = await imageUrlToDataUrl(new URL("PTC.png", document.baseURI).href);
      safeForCanvas = src.startsWith("data:image/");
    } catch (error) {
      try {
        src = imageElementToDataUrl(logo);
        safeForCanvas = src.startsWith("data:image/");
      } catch (canvasError) {
        src = fallbackSrc;
        safeForCanvas = false;
        console.warn("PTC logo data URL conversion failed; using the original image source.", canvasError || error);
      }
    }
  }

  return { src: src || fallbackSrc, width, height, safeForCanvas };
}

function loadImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The page snapshot SVG could not be loaded."));
    image.src = url;
  });
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("The page canvas could not be converted to PNG."));
      },
      "image/png",
      1,
    );
  });
}

const pageExportTheme = {
  bg: "rgba(255, 255, 255, 0)",
  surface: "#ffffff",
  surfaceStrong: "#efe7d8",
  ink: "#1d2528",
  muted: "#637074",
  line: "#d9d1c4",
  lineStrong: "#a99f90",
  accent: "#0f7f79",
  accentDark: "#07524f",
};

function setCanvasFont(ctx, size, weight = 700) {
  ctx.font = `${weight} ${size}px Arial, sans-serif`;
}

function drawRoundRect(ctx, x, y, width, height, radius, fill, stroke = "", lineWidth = 1) {
  ctx.save();
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
  }
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

function drawCardShadow(ctx, x, y, width, height, radius = 8) {
  ctx.save();
  ctx.shadowColor = "rgba(42, 38, 31, 0.13)";
  ctx.shadowBlur = 34;
  ctx.shadowOffsetY = 15;
  drawRoundRect(ctx, x, y, width, height, radius, pageExportTheme.surface, "rgba(143, 129, 109, 0.34)", 1);
  ctx.restore();
}

function drawGridBackground(ctx, x, y, width, height, grid = 38) {
  ctx.save();
  ctx.fillStyle = "#fbfaf6";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "rgba(217, 209, 196, 0.42)";
  ctx.lineWidth = 1;
  for (let gx = x; gx <= x + width; gx += grid) {
    ctx.beginPath();
    ctx.moveTo(gx, y);
    ctx.lineTo(gx, y + height);
    ctx.stroke();
  }
  for (let gy = y; gy <= y + height; gy += grid) {
    ctx.beginPath();
    ctx.moveTo(x, gy);
    ctx.lineTo(x + width, gy);
    ctx.stroke();
  }
  ctx.restore();
}

function drawButtonCanvas(ctx, text, x, y, width, height, active = false) {
  drawRoundRect(ctx, x, y, width, height, 7, active ? pageExportTheme.ink : "#ffffff", pageExportTheme.line, 1);
  setCanvasFont(ctx, 16, 760);
  ctx.fillStyle = active ? "#ffffff" : pageExportTheme.muted;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + width / 2, y + height / 2 + 1);
}

function measureDatasetLabelCanvas(ctx, dataset, size, weight) {
  const parts = datasetLabelParts(dataset);
  if (parts.length !== 3) {
    setCanvasFont(ctx, size, weight);
    return ctx.measureText(parts.join("")).width;
  }

  setCanvasFont(ctx, size, weight);
  const prefixWidth = ctx.measureText(parts[0]).width;
  const suffixWidth = ctx.measureText(parts[2]).width;
  setCanvasFont(ctx, size * 0.68, weight);
  return prefixWidth + ctx.measureText(parts[1]).width + suffixWidth;
}

function drawDatasetLabelCanvas(ctx, dataset, x, y, size = 16, weight = 760, align = "left") {
  const parts = datasetLabelParts(dataset);
  const totalWidth = measureDatasetLabelCanvas(ctx, dataset, size, weight);
  let cursor = x;
  if (align === "center") cursor -= totalWidth / 2;
  if (align === "right") cursor -= totalWidth;

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  if (parts.length !== 3) {
    setCanvasFont(ctx, size, weight);
    ctx.fillText(parts.join(""), cursor, y);
    return;
  }

  setCanvasFont(ctx, size, weight);
  ctx.fillText(parts[0], cursor, y);
  cursor += ctx.measureText(parts[0]).width;

  setCanvasFont(ctx, size * 0.68, weight);
  ctx.fillText(parts[1], cursor, y + size * 0.28);
  cursor += ctx.measureText(parts[1]).width;

  setCanvasFont(ctx, size, weight);
  ctx.fillText(parts[2], cursor, y);
}

function drawDatasetButtonCanvas(ctx, dataset, x, y, width, height, active = false) {
  drawRoundRect(ctx, x, y, width, height, 7, active ? pageExportTheme.ink : "#ffffff", pageExportTheme.line, 1);
  const size = 14;
  ctx.fillStyle = active ? "#ffffff" : pageExportTheme.muted;
  drawDatasetLabelCanvas(ctx, dataset, x + width / 2, y + height / 2 + size * 0.36, size, 760, "center");
}

function drawSectionTitle(ctx, text, x, y) {
  setCanvasFont(ctx, 15, 820);
  ctx.fillStyle = pageExportTheme.muted;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text.toUpperCase(), x, y);
}

function drawConcentrationCanvas(ctx, concentration, x, y, size = 15, weight = 760) {
  const prefix = concentrationPrefix(concentration);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  setCanvasFont(ctx, size, weight);
  ctx.fillText(prefix, x, y);
  const prefixWidth = ctx.measureText(prefix).width;
  setCanvasFont(ctx, size * 0.72, weight);
  ctx.fillText("-1", x + prefixWidth + 1, y - size * 0.42);
}

function drawConcentrationButtonCanvas(ctx, concentration, x, y, width, height, active = false) {
  drawRoundRect(ctx, x, y, width, height, 7, active ? pageExportTheme.ink : "#ffffff", pageExportTheme.line, 1);
  ctx.fillStyle = active ? "#ffffff" : pageExportTheme.muted;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  if (concentration === "all") {
    setCanvasFont(ctx, 14, 760);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("All", x + width / 2, y + height / 2 + 1);
    return;
  }

  const size = 13;
  const prefix = concentrationPrefix(concentration);
  setCanvasFont(ctx, size, 760);
  const prefixWidth = ctx.measureText(prefix).width;
  setCanvasFont(ctx, size * 0.72, 760);
  const supWidth = ctx.measureText("-1").width;
  const startX = x + (width - prefixWidth - supWidth - 1) / 2;
  const baselineY = y + height / 2 + size * 0.36;

  setCanvasFont(ctx, size, 760);
  ctx.fillText(prefix, startX, baselineY);
  setCanvasFont(ctx, size * 0.72, 760);
  ctx.fillText("-1", startX + prefixWidth + 1, baselineY - size * 0.42);
}

function drawPhaseCanvasText(ctx, phase, x, y, size = 28, weight = 900, stats = null, options = {}) {
  const components = phaseColorComponents(phase, stats);
  setCanvasFont(ctx, size, weight);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  if (components.length > 1) {
    let cursor = x;
    components.forEach((component, index) => {
      if (index > 0) {
        setCanvasFont(ctx, size, weight);
        ctx.fillStyle = pageExportTheme.ink;
        ctx.fillText("+", cursor, y);
        cursor += ctx.measureText("+").width;
      }
      ctx.fillStyle = component.color;
      const percentText = `${formatPhasePercent(component.percent)}%`;
      setCanvasFont(ctx, size, weight);
      ctx.fillText(percentText, cursor, y);
      cursor += ctx.measureText(percentText).width;

      if (options.showError !== false && Number.isFinite(component.error)) {
        const errorText = ` +/- ${formatPhasePercent(component.error)}%`;
        setCanvasFont(ctx, size * 0.18, weight);
        ctx.fillText(errorText, cursor, y);
        cursor += ctx.measureText(errorText).width;
      }

      setCanvasFont(ctx, size, weight);
      ctx.fillText(component.label, cursor, y);
      cursor += ctx.measureText(component.label).width;
    });
    return;
  }

  const label = phase && phase !== "-" ? phase : "No data";
  ctx.fillStyle = colorForPhase(label);
  ctx.fillText(label, x, y);
}

function drawPhaseLegendSwatchCanvas(ctx, key, x, y, radius = 9) {
  if (key === "mixed") {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = mixedLegendColors.left;
    ctx.fillRect(x - radius, y - radius, radius, radius * 2);
    ctx.fillStyle = mixedLegendColors.right;
    ctx.fillRect(x, y - radius, radius, radius * 2);
    ctx.restore();
    ctx.strokeStyle = "rgba(0,0,0,0.24)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    return;
  }
  ctx.fillStyle = palette[key];
  ctx.strokeStyle = "rgba(0,0,0,0.18)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

function drawPhaseChipCanvas(ctx, phase, x, y, width, height, size = 15, stats = null, options = {}) {
  const components = phaseColorComponents(phase, stats);
  const phaseType = normalizePhase(phase);
  const color = colorForPhase(phase);

  if (components.length > 1) {
    const gradient = ctx.createLinearGradient(x, y, x + width, y);
    phaseGradientStops(phase, 0.42, true, stats).forEach((stop) => {
      gradient.addColorStop(clamp(stop.offset / 100, 0, 1), stop.color);
    });
    drawRoundRect(ctx, x, y, width, height, height / 2, gradient, palette.mixed, 1.4);
  } else {
    drawRoundRect(
      ctx,
      x,
      y,
      width,
      height,
      height / 2,
      phaseType === "missing" ? color : hexToRgba(color, 0.16),
      phaseType === "missing" ? color : hexToRgba(color, 0.6),
      1.2,
    );
  }

  ctx.save();
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, width, height, height / 2);
  else ctx.rect(x, y, width, height);
  ctx.clip();
  drawPhaseCanvasText(ctx, phase, x + 12, y + height / 2 + size * 0.36, size, 860, stats, options);
  ctx.restore();
}

function drawMetricChipCanvas(ctx, metricKey, sample, concentration, x, y, width, height) {
  const entry = metricEntry(metricKey, sample, concentration);
  const value = Number(entry?.value);
  const text = formatMetricEntry(entry, false, metricKey);
  const color = Number.isFinite(value)
    ? colorForMetric(metricKey, value)
    : metricPalettes[metricKey]?.missing || "#4A4A4A";
  drawRoundRect(
    ctx,
    x,
    y,
    width,
    height,
    height / 2,
    Number.isFinite(value) ? hexToRgba(color, 0.12) : color,
    Number.isFinite(value) ? hexToRgba(color, 0.52) : color,
    1,
  );
  setCanvasFont(ctx, 13, 820);
  ctx.fillStyle = Number.isFinite(value) ? pageExportTheme.ink : "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x + width / 2, y + height / 2 + 1);
}

function drawFrameworkTableRatioCanvas(ctx, entry, x, y, width) {
  const segments = frameworkSegments(entry);
  if (!segments.length) {
    drawRoundRect(ctx, x, y + 8, 62, 24, 12, palette.missing, palette.missing, 1);
    setCanvasFont(ctx, 11, 820);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("No data", x + 9, y + 20);
    return;
  }

  const barH = 11;
  drawRoundRect(ctx, x, y + 8, width, barH, barH / 2, "#f5f5f5", "rgba(0, 0, 0, 0.16)", 1);
  ctx.save();
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y + 8, width, barH, barH / 2);
  else ctx.rect(x, y + 8, width, barH);
  ctx.clip();
  let cursor = x;
  segments.forEach((segment, index) => {
    const segmentWidth = index === segments.length - 1 ? x + width - cursor : width * segment.fraction;
    ctx.fillStyle = segment.color;
    ctx.fillRect(cursor, y + 8, segmentWidth, barH);
    cursor += segmentWidth;
  });
  ctx.restore();

  setCanvasFont(ctx, 10, 760);
  ctx.fillStyle = pageExportTheme.muted;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const itemW = width / 3;
  segments.forEach((segment, index) => {
    ctx.fillText(`${formatNumber(segment.value, 1)}%`, x + itemW * index, y + 36);
  });
}

function svgDimensions(svg) {
  const viewBox = String(svg.getAttribute("viewBox") || "").split(/\s+/).map(Number);
  return {
    width: Number(svg.getAttribute("width")) || viewBox[2] || plot.width,
    height: Number(svg.getAttribute("height")) || viewBox[3] || plot.height,
  };
}

async function svgCloneToImage(svg) {
  const svgText = new XMLSerializer().serializeToString(svg);
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  try {
    return await loadImageFromUrl(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawControlsPanel(ctx, x, y, width) {
  const sectionX = x + 24;
  const innerW = width - 48;
  const panelHeight = 1260;
  let cursor = y + 48;
  drawCardShadow(ctx, x, y, width, panelHeight);

  drawSectionTitle(ctx, "Dataset", sectionX, cursor);
  cursor += 18;
  drawRoundRect(ctx, sectionX, cursor, innerW, 60, 8, "rgba(255,253,248,0.8)", pageExportTheme.line, 1);
  const datasetButtonGap = 8;
  const datasetButtonW = (innerW - 16 - datasetButtonGap) / 2;
  drawDatasetButtonCanvas(ctx, "WW", sectionX + 8, cursor + 8, datasetButtonW, 44, state.dataset === "WW");
  drawDatasetButtonCanvas(
    ctx,
    "EW",
    sectionX + 8 + datasetButtonW + datasetButtonGap,
    cursor + 8,
    datasetButtonW,
    44,
    state.dataset === "EW",
  );
  cursor += 96;

  drawSectionTitle(ctx, "Concentration", sectionX, cursor);
  cursor += 18;
  const buttonGap = 10;
  const allW = 54;
  const rowH = 44;
  drawConcentrationButtonCanvas(ctx, "all", sectionX, cursor, allW, 38, state.visibleConcentration === "all");
  drawConcentrationButtonCanvas(
    ctx,
    PHASE_DATA.concentrations[0],
    sectionX + allW + buttonGap,
    cursor,
    innerW - allW - buttonGap,
    38,
    state.visibleConcentration === PHASE_DATA.concentrations[0],
  );
  PHASE_DATA.concentrations.slice(1).forEach((concentration, index) => {
    const colW = (innerW - buttonGap) / 2;
    const bx = sectionX + (index % 2) * (colW + buttonGap);
    const by = cursor + rowH + Math.floor(index / 2) * rowH;
    drawConcentrationButtonCanvas(ctx, concentration, bx, by, colW, 38, state.visibleConcentration === concentration);
  });
  cursor += 150;

  drawSectionTitle(ctx, "Visualization", sectionX, cursor);
  cursor += 18;
  const metricRows = Math.ceil(metricModes.length / 2);
  const metricPanelHeight = 16 + metricRows * 38 + Math.max(0, metricRows - 1) * 9;
  drawRoundRect(ctx, sectionX, cursor, innerW, metricPanelHeight, 8, "rgba(255,253,248,0.8)", pageExportTheme.line, 1);
  metricModes.forEach(([label, key], index) => {
    const bx = sectionX + 8 + (index % 2) * ((innerW - 24) / 2 + 8);
    const by = cursor + 8 + Math.floor(index / 2) * 47;
    drawButtonCanvas(ctx, label, bx, by, (innerW - 32) / 2, 38, state.visualization === key);
  });
  cursor += metricPanelHeight + 36;

  drawSectionTitle(ctx, "Filters", sectionX, cursor);
  cursor += 23;
  valueFilterKeys.forEach((key) => {
    setCanvasFont(ctx, 14, 780);
    ctx.fillStyle = pageExportTheme.muted;
    ctx.textAlign = "left";
    ctx.fillText(valueFilterLabels[key] || `${key}%`, sectionX, cursor + 25);
    const range = state.valueFilters[key] || defaultValueFilters[key];
    drawRoundRect(ctx, sectionX + 108, cursor, 72, 36, 6, "#ffffff", pageExportTheme.line, 1);
    drawRoundRect(ctx, sectionX + 198, cursor, 72, 36, 6, "#ffffff", pageExportTheme.line, 1);
    setCanvasFont(ctx, 14, 760);
    ctx.fillStyle = pageExportTheme.ink;
    ctx.fillText(String(range.min), sectionX + 120, cursor + 24);
    ctx.fillText("-", sectionX + 187, cursor + 24);
    ctx.fillText(String(range.max), sectionX + 210, cursor + 24);
    cursor += 44;
  });
  drawButtonCanvas(ctx, "Reset filters", sectionX, cursor + 5, innerW, 38, false);
  cursor += 70;

  drawSectionTitle(ctx, "Phase", sectionX, cursor);
  cursor += 22;
  const phaseButtons = [["All", "all"], ...phaseFamilies];
  phaseButtons.forEach(([label, key], index) => {
    const colW = (innerW - buttonGap) / 2;
    const bx = sectionX + (index % 2) * (colW + buttonGap);
    const by = cursor + Math.floor(index / 2) * 44;
    const active = phaseFilterButtonActive(key);
    drawButtonCanvas(ctx, label, bx, by, key === "all" ? 58 : colW, 36, active);
    if (key !== "all") drawPhaseLegendSwatchCanvas(ctx, key, bx + 16, by + 18, 5);
  });
  cursor += 190;

  return y + panelHeight;
}

function drawTable(ctx, sample, x, y, width) {
  const rowH = 64;
  const headerH = 54;
  const cols = [0, 118, 242, 402, 468, 532];
  const tableH = headerH + rowH * PHASE_DATA.concentrations.length;

  drawRoundRect(ctx, x, y, width, tableH, 8, "#ffffff", pageExportTheme.line, 1);
  setCanvasFont(ctx, 12, 820);
  ctx.fillStyle = pageExportTheme.muted;
  ctx.textAlign = "left";
  ctx.fillText("Total", x + 16, y + 21);
  ctx.fillText("concentration", x + 16, y + 36);
  ctx.fillText("Phase", x + cols[1] + 16, y + 31);
  ctx.fillText("Framework to", x + cols[2] + 16, y + 18);
  ctx.fillText("amorphous", x + cols[2] + 16, y + 32);
  ctx.fillText("ratio", x + cols[2] + 16, y + 46);
  ctx.fillText("EE", x + cols[3] + 16, y + 31);
  ctx.fillText("LC", x + cols[4] + 16, y + 31);
  ctx.fillText("IR-ratio", x + cols[5] + 16, y + 31);

  [...PHASE_DATA.concentrations].reverse().forEach((concentration, index) => {
    const rowY = y + headerH + index * rowH;
    ctx.fillStyle = concentration === state.concentration ? "rgba(15, 127, 121, 0.08)" : "#ffffff";
    ctx.fillRect(x + 1, rowY, width - 2, rowH);
    ctx.strokeStyle = pageExportTheme.line;
    ctx.beginPath();
    ctx.moveTo(x, rowY);
    ctx.lineTo(x + width, rowY);
    ctx.stroke();

    setCanvasFont(ctx, 13, 520);
    ctx.fillStyle = pageExportTheme.ink;
    ctx.textAlign = "left";
    drawConcentrationCanvas(ctx, concentration, x + 16, rowY + 35, 13, 520);
    drawPhaseChipCanvas(
      ctx,
      sample.phases[concentration] || "-",
      x + cols[1] + 16,
      rowY + 15,
      104,
      28,
      13,
      phaseStatsFor(sample, concentration),
      { showError: false },
    );
    drawFrameworkTableRatioCanvas(ctx, frameworkEntry(sample, concentration), x + cols[2] + 16, rowY + 10, 124);
    drawMetricChipCanvas(ctx, "EE", sample, concentration, x + cols[3] + 16, rowY + 18, 58, 26);
    drawMetricChipCanvas(ctx, "LC", sample, concentration, x + cols[4] + 16, rowY + 18, 58, 26);
    drawMetricChipCanvas(ctx, "IR", sample, concentration, x + cols[5] + 16, rowY + 18, 64, 26);
  });

  return tableH;
}

function drawSpectrumCanvasPanel(ctx, image, title, status, x, y, width, imageWidth, imageHeight) {
  const pad = 18;
  const chartW = width - pad * 2;
  const chartH = chartW * (imageHeight / imageWidth);
  const panelH = 62 + chartH + 18;
  drawRoundRect(ctx, x, y, width, panelH, 8, "#ffffff", pageExportTheme.line, 1);
  setCanvasFont(ctx, 18, 850);
  ctx.fillStyle = pageExportTheme.ink;
  ctx.textAlign = "left";
  ctx.fillText(title, x + pad, y + 34);
  setCanvasFont(ctx, 13, 760);
  ctx.fillStyle = pageExportTheme.muted;
  ctx.textAlign = "right";
  ctx.fillText(status, x + width - pad, y + 33);
  ctx.drawImage(image, x + pad, y + 52, chartW, chartH);
  return panelH;
}

function drawFrameworkDetailCanvas(ctx, entry, x, y, width) {
  const height = 112;
  const pad = 16;
  const segments = frameworkSegments(entry);

  drawRoundRect(ctx, x, y, width, height, 8, "#ffffff", pageExportTheme.line, 1);
  setCanvasFont(ctx, 13, 820);
  ctx.fillStyle = pageExportTheme.muted;
  ctx.textAlign = "left";
  ctx.fillText("Framework to amorphous ratio", x + pad, y + 25);

  if (!segments.length) {
    drawRoundRect(ctx, x + pad, y + 44, 76, 28, 14, palette.missing, palette.missing, 1);
    setCanvasFont(ctx, 13, 820);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("No data", x + pad + 12, y + 63);
    return height;
  }

  const barX = x + pad;
  const barY = y + 40;
  const barW = width - pad * 2;
  const barH = 16;
  drawRoundRect(ctx, barX, barY, barW, barH, 8, "#f5f5f5", "rgba(0, 0, 0, 0.18)", 1);
  ctx.save();
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(barX, barY, barW, barH, 8);
  } else {
    ctx.rect(barX, barY, barW, barH);
  }
  ctx.clip();
  let cursor = barX;
  segments.forEach((segment, index) => {
    const segmentWidth = index === segments.length - 1 ? barX + barW - cursor : barW * segment.fraction;
    ctx.fillStyle = segment.color;
    ctx.fillRect(cursor, barY, segmentWidth, barH);
    cursor += segmentWidth;
  });
  ctx.restore();

  const itemW = barW / 3;
  segments.forEach((segment, index) => {
    const itemX = barX + itemW * index;
    ctx.fillStyle = segment.color;
    ctx.beginPath();
    ctx.arc(itemX + 5, y + 77, 5, 0, Math.PI * 2);
    ctx.fill();
    setCanvasFont(ctx, 12, 760);
    ctx.fillStyle = pageExportTheme.muted;
    ctx.fillText(segment.label, itemX + 16, y + 80);
    setCanvasFont(ctx, 15, 860);
    ctx.fillStyle = pageExportTheme.ink;
    ctx.fillText(`${formatNumber(segment.value, 1)}%`, itemX + 16, y + 100);
  });

  return height;
}

function drawDetailPanel(ctx, sample, x, y, width, xrdImage, irImage) {
  const phase = sample.phases[state.concentration] || "-";
  const phaseStats = phaseStatsFor(sample, state.concentration);
  const eeEntry = metricEntry("EE", sample, state.concentration);
  const lcEntry = metricEntry("LC", sample, state.concentration);
  const irEntry = metricEntry("IR", sample, state.concentration);
  const afEntry = metricEntry("AF", sample, state.concentration);
  const frameworkDetailEntry = frameworkEntry(sample, state.concentration);
  let cursor = y + 46;

  drawCardShadow(ctx, x, y, width, 1860);
  setCanvasFont(ctx, 34, 880);
  ctx.fillStyle = pageExportTheme.accentDark;
  ctx.textAlign = "left";
  drawDatasetLabelCanvas(ctx, state.dataset, x + 24, cursor, 34, 880);
  setCanvasFont(ctx, 34, 880);
  ctx.fillStyle = pageExportTheme.ink;
  ctx.textAlign = "right";
  ctx.fillText(`Sample ${sample.sample}`, x + width - 24, cursor);
  cursor += 28;

  drawRoundRect(ctx, x + 24, cursor, width - 48, 104, 8, pageExportTheme.surfaceStrong, pageExportTheme.line, 1);
  ctx.fillStyle = pageExportTheme.muted;
  drawConcentrationCanvas(ctx, state.concentration, x + 44, cursor + 35, 14, 800);
  drawPhaseCanvasText(ctx, phase, x + 44, cursor + 78, 32, 900, phaseStats);
  cursor += 124;

  const cardW = (width - 60) / 2;
  const metrics = [
    ["M (wt.%)", formatNumber(sample.M)],
    ["L (wt.%)", formatNumber(sample.L)],
    ["BSA (wt.%)", formatNumber(sample.BSA)],
    ["L/M mass ratio", formatNumber(sample.ratio)],
    ["EE +/-", formatMetricEntry(eeEntry, true, "EE")],
    ["LC", formatMetricEntry(lcEntry, true, "LC")],
  ];
  metrics.forEach(([label, value], index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const cx = x + 24 + col * (cardW + 12);
    const cy = cursor + row * 86;
    drawRoundRect(ctx, cx, cy, cardW, 74, 8, "#ffffff", pageExportTheme.line, 1);
    setCanvasFont(ctx, 13, 820);
    ctx.fillStyle = pageExportTheme.muted;
    ctx.textAlign = "left";
    ctx.fillText(label, cx + 14, cy + 24);
    setCanvasFont(ctx, 24, 850);
    ctx.fillStyle = pageExportTheme.ink;
    ctx.fillText(value, cx + 14, cy + 56);
  });
  cursor += 260;
  [
    ["IR-ratio", formatMetricEntry(irEntry, true, "IR")],
    ["Amorphous fraction +/-", formatMetricEntry(afEntry, true, "AF")],
  ].forEach(([label, value], index) => {
    const cx = x + 24 + index * (cardW + 12);
    drawRoundRect(ctx, cx, cursor, cardW, 74, 8, "#ffffff", pageExportTheme.line, 1);
    setCanvasFont(ctx, 13, 820);
    ctx.fillStyle = pageExportTheme.muted;
    ctx.textAlign = "left";
    ctx.fillText(label, cx + 14, cursor + 24);
    setCanvasFont(ctx, 24, 850);
    ctx.fillStyle = pageExportTheme.ink;
    ctx.fillText(value, cx + 14, cursor + 56);
  });
  cursor += 94;

  cursor += drawFrameworkDetailCanvas(ctx, frameworkDetailEntry, x + 24, cursor, width - 48) + 22;

  cursor += drawTable(ctx, sample, x + 24, cursor, width - 48) + 22;
  cursor += drawSpectrumCanvasPanel(ctx, xrdImage, "PXRD patterns", els.xrdStatus?.textContent || "", x + 24, cursor, width - 48, xrdPlot.width, xrdPlot.height) + 22;
  cursor += drawSpectrumCanvasPanel(ctx, irImage, "ATR-IR spectrum", els.irStatus?.textContent || "", x + 24, cursor, width - 48, irPlot.width, irPlot.height);
  return cursor + 24;
}

function drawHeader(ctx, x, y, width) {
  setCanvasFont(ctx, 50, 880);
  ctx.fillStyle = "#0c1b26";
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("ZIF Biocomposite Explorer App - Offline Version", x, y + 66);

  setCanvasFont(ctx, 72, 500);
  ctx.fillStyle = "#ffc33f";
  ctx.strokeStyle = "#f0b400";
  ctx.lineWidth = 4;
  const logoX = x + 1220;
  ctx.strokeText("PTC", logoX, y + 74);
  ctx.fillText("PTC", logoX, y + 74);
  setCanvasFont(ctx, 12, 700);
  ctx.fillStyle = "#1d2528";
  ctx.fillText("Institute of Physical and Theoretical Chemistry", logoX + 6, y + 96);

  drawRoundRect(ctx, width - 268, y + 26, 216, 54, 8, "#07524f", "#07524f", 1);
  setCanvasFont(ctx, 12, 850);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Download Page PNG", width - 160, y + 54);
}

function visualizationTitle() {
  if (state.visualization === "phase") return "Phase";
  if (state.visualization === frameworkModeKey) return "Framework to amorphous ratio";
  return metricDefinition(state.visualization)?.shortLabel || state.visualization;
}

function drawPlotPanel(ctx, ternaryImage, x, y, width, imageWidth, imageHeight) {
  const toolbarH = 76;
  const pad = 18;
  const imageW = width - pad * 2;
  const imageH = imageW * (imageHeight / imageWidth);
  const panelH = toolbarH + imageH + pad;

  drawCardShadow(ctx, x, y, width, panelH);
  drawRoundRect(ctx, x, y, width, panelH, 8, "rgba(0,0,0,0)", "rgba(143, 129, 109, 0.34)", 1);
  drawRoundRect(ctx, x, y, width, toolbarH, 8, "#ffffff", "", 0);
  setCanvasFont(ctx, 15, 800);
  ctx.fillStyle = pageExportTheme.muted;
  ctx.textAlign = "left";
  ctx.fillText(`${visualizationTitle()} ternary diagram`, x + 22, y + 44);
  drawButtonCanvas(ctx, "Reset View", x + width - 260, y + 22, 112, 40, false);
  drawButtonCanvas(ctx, "Download PNG", x + width - 138, y + 22, 116, 40, true);
  drawGridBackground(ctx, x + 1, y + toolbarH, width - 2, imageH + pad - 1, 38);
  ctx.drawImage(ternaryImage, x + pad, y + toolbarH, imageW, imageH);
  return panelH;
}

function waitForAnimationFrames(count = 2) {
  return new Promise((resolve) => {
    const step = () => {
      count -= 1;
      if (count <= 0) resolve();
      else window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  });
}

function waitForVideoFrame(video) {
  return new Promise((resolve) => {
    if ("requestVideoFrameCallback" in video) {
      video.requestVideoFrameCallback(() => resolve());
    } else {
      window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
    }
  });
}

function captureStops(total, viewport) {
  const max = Math.max(0, total - viewport);
  if (max <= 0) return [0];

  const stops = [];
  for (let value = 0; value < max; value += viewport) {
    stops.push(value);
  }
  if (stops.at(-1) !== max) stops.push(max);
  return stops;
}

function pageScrollSize() {
  const root = document.documentElement;
  const body = document.body;
  return {
    width: Math.ceil(Math.max(root.scrollWidth, body.scrollWidth, root.clientWidth, window.innerWidth)),
    height: Math.ceil(Math.max(root.scrollHeight, body.scrollHeight, root.clientHeight, window.innerHeight)),
  };
}

function ensurePageCaptureStyle() {
  let style = document.getElementById("pageCaptureStyle");
  if (style) return style;

  style = document.createElement("style");
  style.id = "pageCaptureStyle";
  style.textContent = `
    html.is-page-capturing,
    body.is-page-capturing {
      background: #ffffff !important;
      scrollbar-width: none !important;
    }

    html.is-page-capturing::-webkit-scrollbar,
    body.is-page-capturing::-webkit-scrollbar,
    html.is-page-capturing *::-webkit-scrollbar {
      width: 0 !important;
      height: 0 !important;
    }

    body.is-page-capturing .app-header {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) max-content !important;
      align-items: center !important;
      background: #ffffff !important;
      gap: 18px !important;
    }

    body.is-page-capturing .title-row {
      display: grid !important;
      grid-template-columns: minmax(0, max-content) max-content !important;
      align-items: center !important;
      justify-content: start !important;
      gap: 18px !important;
      min-width: 0 !important;
    }

    body.is-page-capturing .title-row h1 {
      min-width: 0 !important;
      white-space: nowrap !important;
    }

    body.is-page-capturing .ptc-logo-link {
      display: inline-flex !important;
      flex-wrap: nowrap !important;
      background: #ffffff !important;
      max-width: none !important;
      min-width: 0 !important;
      justify-self: start !important;
    }

    body.is-page-capturing .ptc-logo-lockup {
      background: #ffffff !important;
      flex: 0 0 auto !important;
    }

    body.is-page-capturing .ptc-logo-image {
      display: block !important;
      max-width: none !important;
      object-fit: unset !important;
      object-position: initial !important;
      background: #ffffff !important;
    }

    body.is-page-capturing .ptc-mark {
      width: 76px !important;
      height: 45.6px !important;
    }

    body.is-page-capturing .ptc-wordmark {
      flex: 0 0 auto !important;
      width: 178px !important;
    }

    body.is-page-capturing .ptc-university-text {
      flex: 0 0 auto !important;
      font-size: 13px !important;
      white-space: nowrap !important;
    }

    body.is-page-capturing .controls-panel {
      position: static !important;
      top: auto !important;
    }

    body.is-page-capturing .app-shell {
      align-items: stretch !important;
    }

    body.is-page-capturing .controls-panel,
    body.is-page-capturing .visual-surface,
    body.is-page-capturing .detail-panel {
      align-self: stretch !important;
      height: auto !important;
      min-height: 0 !important;
    }

    body.is-page-capturing .detail-panel {
      position: static !important;
      top: auto !important;
    }

    body.is-page-capturing .phase-table-wrap {
      overflow-x: hidden !important;
      overflow-y: hidden !important;
      background: #ffffff !important;
    }

    body.is-page-capturing .phase-table-scroll-hint {
      position: sticky !important;
      left: 0 !important;
      z-index: 1 !important;
      display: block !important;
      width: calc(100% - 22px) !important;
      min-width: 140px !important;
      height: 9px !important;
      margin: 3px 11px 8px !important;
      border-radius: 999px !important;
      background: #d7d7d7 !important;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08) !important;
      pointer-events: none !important;
    }

    body.is-page-capturing .phase-table-scroll-hint::before {
      content: "" !important;
      display: block !important;
      width: 58% !important;
      height: 100% !important;
      border-radius: inherit !important;
      background: #858585 !important;
    }

    body.is-page-capturing .visual-surface {
      grid-template-rows: auto minmax(0, 1fr) !important;
    }

    body.is-page-capturing .plot-frame {
      min-height: 0 !important;
    }

    body.is-page-capturing .page-download-button {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      align-self: center !important;
      justify-self: end !important;
      width: 168px !important;
      min-width: 168px !important;
      max-width: none !important;
      height: 44px !important;
      padding: 6px 12px !important;
      margin-left: 0 !important;
      font-size: 14px !important;
      line-height: 20px !important;
      white-space: nowrap !important;
      pointer-events: none !important;
    }

    body.is-page-capturing .xrd-panel {
      overflow: visible !important;
    }

    body.is-page-capturing .xrd-heading {
      display: grid !important;
      grid-template-columns: max-content max-content !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 12px !important;
      min-width: 0 !important;
    }

    body.is-page-capturing .xrd-heading h3,
    body.is-page-capturing .xrd-heading span,
    body.is-page-capturing .spectrum-toolbar {
      white-space: nowrap !important;
    }

    body.is-page-capturing .spectrum-toolbar {
      display: grid !important;
      grid-auto-flow: column !important;
      grid-auto-columns: max-content !important;
      align-items: center !important;
      justify-content: end !important;
      gap: 5px !important;
    }

    body.is-page-capturing .spectrum-button {
      appearance: none !important;
      -webkit-appearance: none !important;
      box-sizing: border-box !important;
      display: inline-grid !important;
      place-items: center !important;
      min-width: 34px !important;
      height: 24px !important;
      padding: 0 7px !important;
      line-height: 1 !important;
    }

    body.is-page-capturing .spectrum-button.icon-button {
      width: 24px !important;
      min-width: 24px !important;
      padding: 0 !important;
    }
  `;
  document.head.append(style);
  return style;
}

async function startPageCaptureStream() {
  if (!navigator.mediaDevices?.getDisplayMedia) {
    throw new Error("This browser does not support page capture. Please use Chrome or Edge.");
  }

  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      displaySurface: "browser",
      preferCurrentTab: true,
      selfBrowserSurface: "include",
      surfaceSwitching: "exclude",
      width: { ideal: 3840 },
      height: { ideal: 2160 },
      frameRate: { ideal: 5, max: 10 },
    },
    audio: false,
  });
  const [track] = stream.getVideoTracks();
  const surface = track?.getSettings?.().displaySurface;
  if (surface && surface !== "browser") {
    stream.getTracks().forEach((item) => item.stop());
    throw new Error("Please choose the current browser tab / This tab, not a window or screen.");
  }

  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.srcObject = stream;
  await new Promise((resolve, reject) => {
    video.onloadedmetadata = resolve;
    video.onerror = () => reject(new Error("The browser capture stream could not be loaded."));
  });
  await video.play();
  await waitForVideoFrame(video);
  return { stream, video };
}

async function stitchCurrentPageFromCapture(video) {
  ensurePageCaptureStyle();
  document.documentElement.classList.add("is-page-capturing");
  document.body.classList.add("is-page-capturing");
  await waitForAnimationFrames(3);

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const { width, height } = pageScrollSize();
  const scaleX = video.videoWidth / viewportWidth || window.devicePixelRatio || 1;
  const scaleY = video.videoHeight / viewportHeight || window.devicePixelRatio || 1;
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(width * scaleX);
  canvas.height = Math.ceil(height * scaleY);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("The stitched page canvas could not be created.");

  context.fillStyle = pageExportTheme.bg;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const xStops = captureStops(width, viewportWidth);
  const yStops = captureStops(height, viewportHeight);
  const visited = new Set();

  for (const y of yStops) {
    for (const x of xStops) {
      window.scrollTo(x, y);
      await waitForAnimationFrames(3);
      await waitForVideoFrame(video);

      const actualX = Math.round(window.scrollX);
      const actualY = Math.round(window.scrollY);
      const key = `${actualX},${actualY}`;
      if (visited.has(key)) continue;
      visited.add(key);

      context.drawImage(
        video,
        0,
        0,
        video.videoWidth,
        video.videoHeight,
        Math.round(actualX * scaleX),
        Math.round(actualY * scaleY),
        video.videoWidth,
        video.videoHeight,
      );
    }
  }

  return canvas;
}

function pageExportScale() {
  return 3;
}

function syncCloneTextColors(clonedDocument, selector) {
  const sourceNodes = [...document.querySelectorAll(selector)];
  const clonedNodes = [...clonedDocument.querySelectorAll(selector)];
  sourceNodes.forEach((sourceNode, index) => {
    const clonedNode = clonedNodes[index];
    if (!clonedNode) return;
    const sourceStyle = getComputedStyle(sourceNode);
    const color = sourceStyle.color;
    if (!color) return;
    clonedNode.style.color = color;
    clonedNode.style.webkitTextFillColor = color;
  });
}

async function renderCurrentPageWithHtml2Canvas(logoInfo = null) {
  const renderer = window.html2canvas;
  if (typeof renderer !== "function") {
    throw new Error("The offline page renderer is missing. Please refresh the page and make sure vendor/html2canvas.min.js is present.");
  }

  ensurePageCaptureStyle();
  document.documentElement.classList.add("is-page-capturing");
  document.body.classList.add("is-page-capturing");
  window.scrollTo(0, 0);
  await waitForAnimationFrames(3);

  const { width, height } = pageScrollSize();
  const options = {
    backgroundColor: "#ffffff",
    scale: pageExportScale(),
    useCORS: true,
    allowTaint: false,
    logging: false,
    imageTimeout: 15000,
    foreignObjectRendering: false,
    scrollX: 0,
    scrollY: 0,
    x: 0,
    y: 0,
    width,
    height,
    windowWidth: width,
    windowHeight: height,
    onclone: (clonedDocument) => {
      clonedDocument.documentElement.classList.add("is-page-capturing");
      clonedDocument.body.classList.add("is-page-capturing");
      clonedDocument.documentElement.style.background = "#ffffff";
      clonedDocument.body.style.background = "#ffffff";

      syncCloneTextColors(
        clonedDocument,
        "#selectedPhase, #selectedPhase .phase-component, #selectedPhase .phase-error, .phase-chip, .phase-chip .phase-component",
      );

      ["controls-panel", "detail-panel"].forEach((className) => {
        clonedDocument.querySelectorAll(`.${className}`).forEach((panel) => {
          panel.style.position = "static";
          panel.style.top = "auto";
        });
      });

      clonedDocument.querySelectorAll(".app-header, .ptc-logo-link, .ptc-logo-lockup").forEach((node) => {
        node.style.background = "#ffffff";
      });

      const clonedLogo = clonedDocument.querySelector(".ptc-logo-image");
      if (clonedLogo) {
        clonedLogo.removeAttribute("srcset");
        clonedLogo.removeAttribute("sizes");
        clonedLogo.setAttribute("src", logoInfo?.src || clonedLogo.getAttribute("src") || "PTC.png?v=20260529");
        if (logoInfo?.safeForCanvas === false) {
          clonedLogo.setAttribute("crossorigin", "anonymous");
        }
        if (logoInfo?.width && logoInfo?.height) {
          clonedLogo.setAttribute("width", String(logoInfo.width));
          clonedLogo.setAttribute("height", String(logoInfo.height));
          clonedLogo.style.width = `${logoInfo.width}px`;
          clonedLogo.style.height = `${logoInfo.height}px`;
        }
        clonedLogo.style.display = "block";
        clonedLogo.style.maxWidth = "none";
        clonedLogo.style.minWidth = "0";
        clonedLogo.style.objectFit = "unset";
        clonedLogo.style.objectPosition = "initial";
        clonedLogo.style.background = "#ffffff";
        clonedLogo.style.flex = "0 0 auto";
      }
      const clonedButton = clonedDocument.getElementById("downloadPagePng");
      if (clonedButton) {
        clonedButton.disabled = false;
        clonedButton.textContent = "Download Page PNG";
      }
    },
  };

  return renderer(document.body, options);
}

async function downloadPagePng() {
  const button = els.downloadPagePng;
  const previousLabel = button?.textContent;
  const previousScroll = { x: window.scrollX, y: window.scrollY };

  if (button) {
    button.disabled = true;
    button.textContent = "Rendering page...";
  }

  try {
    await waitForPageAssets();
    const logoInfo = await pageCaptureLogoInfo();
    const canvas = await renderCurrentPageWithHtml2Canvas(logoInfo);
    if (button) {
      button.disabled = true;
      button.textContent = "Saving PNG...";
    }
    const blob = await canvasToBlob(canvas);
    const dpiBlob = await pngWithDpi(blob, 300);
    downloadBlob(dpiBlob, `ZIF-biocomposite-page-${state.dataset}-sample-${state.sample}.png`);
  } catch (error) {
    console.error(error);
    window.alert(`Page PNG export failed: ${error.message || error}`);
  } finally {
    document.documentElement.classList.remove("is-page-capturing");
    document.body.classList.remove("is-page-capturing");
    window.scrollTo(previousScroll.x, previousScroll.y);
    if (button) {
      button.disabled = false;
      button.textContent = previousLabel;
    }
  }
}

function bindEvents() {
  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      state = {
        ...state,
        dataset: tab.dataset.dataset,
      };
      syncSelectionToVisibleData();
      updateControlStates();
      renderPlot();
      updateDetail();
    });
  });

  els.concentrationFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-concentration-filter]");
    if (!button) return;

    const filter = button.dataset.concentrationFilter;
    state = {
      ...state,
      visibleConcentration: filter,
      concentration: filter === "all" ? state.concentration : filter,
    };
    syncSelectionToVisibleData();
    updateControlStates();
    renderPlot();
    updateDetail();
  });

  els.phaseFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-phase-filter]");
    if (!button) return;

    state = {
      ...state,
      phaseFilter: nextPhaseFilter(state.phaseFilter, button.dataset.phaseFilter),
    };
    syncSelectionToVisibleData();
    updateControlStates();
    renderPlot();
    updateDetail();
  });

  els.visualizationFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-visualization]");
    if (!button) return;

    state = {
      ...state,
      visualization: button.dataset.visualization,
    };
    renderLegend();
    updateControlStates();
    renderPlot();
    updateDetail();
  });

  els.sampleNumberToggle?.addEventListener("change", () => {
    state = {
      ...state,
      showSampleNumbers: els.sampleNumberToggle.checked,
    };
    renderPlot();
  });

  els.concentrationLabelToggle?.addEventListener("change", () => {
    state = {
      ...state,
      showConcentrationLabels: els.concentrationLabelToggle.checked,
    };
    renderPlot();
  });

  els.axisLabelToggle?.addEventListener("change", () => {
    state = {
      ...state,
      showAxisLabels: els.axisLabelToggle.checked,
    };
    renderPlot();
  });

  els.axisTickToggle?.addEventListener("change", () => {
    state = {
      ...state,
      showAxisTicks: els.axisTickToggle.checked,
    };
    renderPlot();
  });

  els.concentrationFontScale?.addEventListener("change", () => {
    state = {
      ...state,
      concentrationFontScale: readFontScale(els.concentrationFontScale),
    };
    updateControlStates();
    renderPlot();
  });

  els.axisTickFontScale?.addEventListener("change", () => {
    state = {
      ...state,
      axisTickFontScale: readFontScale(els.axisTickFontScale),
    };
    updateControlStates();
    renderPlot();
  });

  els.axisLabelFontScale?.addEventListener("change", () => {
    state = {
      ...state,
      axisLabelFontScale: readFontScale(els.axisLabelFontScale),
    };
    updateControlStates();
    renderPlot();
  });

  els.legendFontScale?.addEventListener("change", () => {
    state = {
      ...state,
      legendFontScale: readFontScale(els.legendFontScale),
    };
    updateControlStates();
    updateLegendDockWidth();
  });

  els.sampleCircleSizeLevel?.addEventListener("change", () => {
    state = {
      ...state,
      sampleCircleSizeLevel: readSampleSizeLevel(els.sampleCircleSizeLevel),
    };
    updateControlStates();
    renderPlot();
  });

  els.sampleNumberSizeLevel?.addEventListener("change", () => {
    state = {
      ...state,
      sampleNumberSizeLevel: readSampleSizeLevel(els.sampleNumberSizeLevel),
    };
    updateControlStates();
    renderPlot();
  });

  els.layerGapControl?.addEventListener("input", () => {
    state = {
      ...state,
      layerGap: clamp(Number(els.layerGapControl.value), plot.minLayerGap, plot.maxLayerGap),
    };
    updateControlStates();
    renderPlot();
  });

  const updateLayerGapFromNumber = (force = false) => {
    const rawValue = String(els.layerGapNumber?.value || "").trim();
    if (!force && rawValue.length < 3) return;
    const nextGap = clamp(
      Number(rawValue || state.layerGap),
      plot.minLayerGap,
      plot.maxLayerGap,
    );
    state = {
      ...state,
      layerGap: nextGap,
    };
    updateControlStates();
    renderPlot();
  };

  els.layerGapNumber?.addEventListener("input", () => updateLayerGapFromNumber(false));
  els.layerGapNumber?.addEventListener("change", () => updateLayerGapFromNumber(true));

  els.compositionSearch?.addEventListener("input", (event) => {
    const input = event.target.closest("[data-search-key]");
    if (!input) return;
    updateSearchPointFromControls(input.dataset.searchKey);
  });

  els.searchConcentration?.addEventListener("input", () => updateSearchPointFromControls());
  els.searchConcentration?.addEventListener("change", () => updateSearchPointFromControls());
  els.clearSearchPoint?.addEventListener("click", clearSearchPoint);

  els.valueFilters.addEventListener("input", (event) => {
    const input = event.target.closest("[data-filter-key][data-range-bound]");
    if (!input) return;

    updateValueFilter(input);
    syncSelectionToVisibleData();
    updateControlStates();
    renderPlot();
    updateDetail();
  });

  els.resetValueFilters.addEventListener("click", () => {
    resetValueFilters();
    syncSelectionToVisibleData();
    updateControlStates();
    renderPlot();
    updateDetail();
  });

  els.modeTabs.forEach((button) => {
    button.addEventListener("click", () => {
      state = {
        ...state,
        dragMode: button.dataset.dragMode,
      };
      updateControlStates();
    });
  });

  els.resetView.addEventListener("click", () => {
    state = {
      ...state,
      ...defaultView,
    };
    renderPlot();
  });

  els.zoomIn.addEventListener("click", () => setZoom(state.zoom * 1.15));
  els.zoomOut.addEventListener("click", () => setZoom(state.zoom / 1.15));

  els.viewButtons.forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  els.downloadPng.addEventListener("click", downloadPng);
  els.downloadPagePng?.addEventListener("click", downloadPagePng);
  els.xrdZoomIn?.addEventListener("click", () => setSpectrumZoom("xrd", state.xrdZoom * 1.4));
  els.xrdZoomOut?.addEventListener("click", () => setSpectrumZoom("xrd", state.xrdZoom / 1.4));
  els.irZoomIn?.addEventListener("click", () => setSpectrumZoom("ir", state.irZoom * 1.4));
  els.irZoomOut?.addEventListener("click", () => setSpectrumZoom("ir", state.irZoom / 1.4));
  els.xrdReset?.addEventListener("click", () => resetSpectrumView("xrd"));
  els.irReset?.addEventListener("click", () => resetSpectrumView("ir"));
  els.xrdDownloadCsv?.addEventListener("click", downloadXrdCsv);
  els.irDownloadCsv?.addEventListener("click", downloadIrCsv);
  els.xrdDownloadPng?.addEventListener("click", () => downloadSpectrumPng("xrd"));
  els.irDownloadPng?.addEventListener("click", () => downloadSpectrumPng("ir"));
  bindLegendDockResize();
  bindRotation();
  bindSpectrumPan(els.xrdPlot, "xrd");
  bindSpectrumPan(els.irPlot, "ir");
}

function init() {
  if (!window.PHASE_DATA) {
    throw new Error("phase-data.js is missing.");
  }

  renderLegend();
  renderFilterControls();
  updateControlStates();
  bindEvents();
  renderPlot();
  updateDetail();
}

init();
