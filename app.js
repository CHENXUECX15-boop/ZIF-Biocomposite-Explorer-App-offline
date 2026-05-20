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

const phaseFamilies = [
  ["amorphous", "amorphous"],
  ["ZIF-C", "ZIF-C"],
  ["sod", "sod"],
  ["dia", "dia"],
  ["U13", "U13"],
  ["U12", "U12"],
  ["mixed", "mixed"],
];

const phaseTokenPattern = "amorphous|ZIF-C|Sodalite|SOD|DIA|U13|U12";

const metricModes = [
  ["Phase", "phase"],
  ["EE%", "EE"],
  ["LC%", "LC"],
  ["IR-ratio%", "IR"],
];

const metricPalettes = {
  EE: { low: "#FFFFFF", high: "#EE0000", missing: "#4A4A4A" },
  LC: { low: "#FFFFFF", high: "#EE0000", missing: "#4A4A4A" },
  IR: { low: "#FFFFFF", high: "#EE0000", missing: "#4A4A4A" },
};

const valueFilterKeys = ["M", "L", "BSA", "EE", "LC"];

const defaultValueFilters = Object.freeze({
  M: Object.freeze({ min: 0, max: 100 }),
  L: Object.freeze({ min: 0, max: 100 }),
  BSA: Object.freeze({ min: 0, max: 100 }),
  EE: Object.freeze({ min: 0, max: 100 }),
  LC: Object.freeze({ min: 0, max: 100 }),
});

const plot = {
  width: 1320,
  height: 1280,
  triangleWidth: 530,
  triangleHeight: 459,
  maxLayerGap: 590,
  minLayerGap: 590 / 3,
  margin: 76,
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

const defaultView = {
  rotationX: 1.25,
  rotationY: 0,
  rotationZ: 0,
  zoom: 1,
  panX: 0,
  panY: 0,
};

let state = {
  dataset: "WW",
  sample: 32,
  concentration: "25 mg/mL",
  layerGap: plot.minLayerGap,
  visibleConcentration: "all",
  phaseFilter: "all",
  visualization: "phase",
  xrdZoom: 1,
  xrdPan: 0,
  irZoom: 1,
  irPan: 0,
  valueFilters: valueFilterKeys.reduce(
    (filters, key) => ({ ...filters, [key]: { ...defaultValueFilters[key] } }),
    {},
  ),
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
  valueFilters: document.getElementById("valueFilters"),
  resetValueFilters: document.getElementById("resetValueFilters"),
  phaseFilters: document.getElementById("phaseFilters"),
  modeTabs: Array.from(document.querySelectorAll(".mode-tab")),
  resetView: document.getElementById("resetView"),
  downloadPng: document.getElementById("downloadPng"),
  zoomIn: document.getElementById("zoomIn"),
  zoomOut: document.getElementById("zoomOut"),
  viewButtons: Array.from(document.querySelectorAll("[data-view]")),
  detailDataset: document.getElementById("detailDataset"),
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

function textSizeForClass(className) {
  const sizes = {
    "layer-label": 21,
    "axis-label": 18,
    "tick-label": 16,
    "sample-number": 13.5,
  };
  return sizes[className] || 16;
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

function renderMixedPhaseText(container, phase) {
  const components = phaseColorComponents(phase);
  if (components.length < 2) return false;

  container.replaceChildren();

  components.forEach((component, index) => {
    if (index > 0) container.append(document.createTextNode("+"));
    const span = document.createElement("span");
    span.className = "phase-component";
    span.style.color = component.color;
    span.style.webkitTextFillColor = component.color;
    span.textContent = `${formatNumber(component.percent, 1)}%${component.label}`;
    container.append(span);
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

function phaseColorComponents(phase) {
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

function phaseGradientStops(phase, alpha = 1) {
  const components = phaseColorComponents(phase);
  if (components.length < 2) return [];

  let cursor = 0;
  return components.flatMap((component, index) => {
    const start = cursor;
    const end = index === components.length - 1 ? 100 : cursor + component.fraction * 100;
    cursor = end;
    const color = alpha < 1 ? hexToRgba(component.color, alpha) : component.color;
    return [
      { color, offset: start },
      { color, offset: end },
    ];
  });
}

function phaseGradientCss(phase, alpha = 1) {
  const stops = phaseGradientStops(phase, alpha);
  if (!stops.length) return "";
  return `linear-gradient(90deg, ${stops
    .map((stop) => `${stop.color} ${stop.offset.toFixed(2)}%`)
    .join(", ")})`;
}

function createPhaseSvgGradient(id, phase) {
  const stops = phaseGradientStops(phase);
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

  const base = ["EE", "LC", "IR"].includes(metricKey) ? `${value.toFixed(1)}%` : `${formatNumber(value, 1)}%`;
  const error = Number(entry?.error);
  if (includeError && Number.isFinite(error)) {
    return `${base} +/- ${formatNumber(error, 1)}%`;
  }
  return base;
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

function colorForMetric(metricKey, value) {
  const paletteConfig = metricPalettes[metricKey] || metricPalettes.EE;
  if (value === null || value === undefined || value === "" || !Number.isFinite(Number(value))) {
    return paletteConfig.missing;
  }
  return interpolateColor(paletteConfig.low, paletteConfig.high, clamp(Number(value) / 100, 0, 1));
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

function activeConcentrations() {
  return PHASE_DATA.concentrations
    .map((concentration, index) => ({ concentration, index }))
    .filter(
      (item) =>
        state.visibleConcentration === "all" ||
        item.concentration === state.visibleConcentration,
    );
}

function phaseMatches(phase) {
  return state.phaseFilter === "all" || normalizePhase(phase) === state.phaseFilter;
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

function projectedBounds() {
  const points = [];
  const labelPoint = { x: -plot.triangleWidth / 2 - 130, y: -plot.triangleHeight / 2 + 26 };
  const vertices = [
    makePoint(100, 0, 0),
    makePoint(0, 100, 0),
    makePoint(0, 0, 100),
    labelPoint,
  ];

  activeConcentrations().forEach(({ index }) => {
    vertices.forEach((vertex) => {
      points.push(rotatePoint({ ...vertex, z: layerZ(index) }));
    });
  });

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
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

function triangleScreenWidth(svgNode = els.svg) {
  const widths = Array.from(svgNode?.querySelectorAll(".layer-plane") || [])
    .map((polygon) => {
      const xs = String(polygon.getAttribute("points") || "")
        .trim()
        .split(/\s+/)
        .map((pair) => Number(pair.split(",")[0]))
        .filter(Number.isFinite);
      if (xs.length < 2) return 0;
      return Math.max(...xs) - Math.min(...xs);
    })
    .filter((width) => width > 0);
  return widths.length ? Math.max(...widths) : plot.triangleWidth;
}

function updateLegendDockWidth() {
  if (!els.phaseLegendDock) return;
  els.phaseLegendDock.style.removeProperty("--legend-width");
}

function createPhaseLegendElements() {
  return phaseFamilies.map(([label, key]) => {
    const item = document.createElement("span");
    item.className = "legend-item";

    const swatch = document.createElement("span");
    swatch.className = "legend-swatch";
    swatch.style.background = palette[key];

    const text = document.createElement("strong");
    text.textContent = label;

    item.append(swatch, text);
    return item;
  });
}

function createMetricLegendElement() {
  const metricKey = state.visualization;
  const definition = metricDefinition(metricKey);
  const paletteConfig = metricPalettes[metricKey] || metricPalettes.EE;
  const legend = document.createElement("span");
  legend.className = "metric-legend";

  const label = document.createElement("strong");
  label.className = "metric-label";
  label.textContent = definition?.label || metricKey;

  const low = document.createElement("span");
  low.textContent = "0%";

  const scale = document.createElement("span");
  scale.className = "metric-scale";
  scale.style.background = `linear-gradient(90deg, ${paletteConfig.low}, ${paletteConfig.high})`;

  const high = document.createElement("span");
  high.textContent = "100%";

  const missing = document.createElement("span");
  missing.className = "metric-missing";
  missing.style.background = paletteConfig.missing;
  missing.style.borderColor = paletteConfig.missing;

  const missingText = document.createElement("span");
  missingText.textContent = "No data";

  legend.append(label, low, scale, high, missing, missingText);
  return legend;
}

function renderLegend() {
  els.legend.replaceChildren();

  if (!els.phaseLegendDock) return;
  if (state.visualization === "phase") {
    els.phaseLegendDock.replaceChildren(...createPhaseLegendElements());
  } else {
    els.phaseLegendDock.replaceChildren(createMetricLegendElement());
  }
  els.phaseLegendDock.classList.remove("is-hidden");
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
  const axisLabels = [
    ["M(%)", makePoint(100, 0, 0), -42, 20, "end"],
    ["L(%)", makePoint(0, 100, 0), 42, 20, "start"],
    ["BSA(%)", makePoint(0, 0, 100), 0, -18, "middle"],
  ];

  axisLabels.forEach(([label, local, dx, dy, anchor]) => {
    textAt(group, label, screenFor(local, index, fit, dx, dy), "axis-label", {
      "text-anchor": anchor,
    });
  });

  for (let value = 20; value <= 100; value += 20) {
    textAt(
      group,
      value,
      screenFor(makePoint(value, 100 - value, 0), index, fit, 0, 18),
      "tick-label",
      { "text-anchor": "middle" },
    );
    textAt(
      group,
      value,
      screenFor(makePoint(0, value, 100 - value), index, fit, 12, 4),
      "tick-label",
      { "text-anchor": "start" },
    );
    textAt(
      group,
      value,
      screenFor(makePoint(100 - value, 0, value), index, fit, -12, 4),
      "tick-label",
      { "text-anchor": "end" },
    );
  }
}

function renderSamples(group, concentration, index, fit, samples) {
  samples.forEach((sample) => {
    const point = screenFor(localForComposition(sample), index, fit);
    const phase = sample.phases[concentration];
    const metricText =
      state.visualization === "phase"
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
      "aria-label": `Sample ${sample.sample}, ${formatConcentrationPlain(concentration)}, ${displayPhasePlain(phase)}${metricText}`,
    });
    const mixedGradientId = `phaseMix${state.dataset}${index}${String(concentration).replace(/[^a-z0-9]/gi, "")}${sample.sample}`;
    const mixedGradient =
      state.visualization === "phase" ? createPhaseSvgGradient(mixedGradientId, phase) : null;
    const dotFill = mixedGradient ? `url(#${mixedGradientId})` : colorForSample(sample, concentration, phase);

    const sampleNodes = [
      createSvgElement("circle", {
        class: "sample-hit",
        cx: point.x,
        cy: point.y,
        r: scaledSampleSize(25),
      }),
      createSvgElement("circle", {
        class: "sample-ring",
        cx: point.x,
        cy: point.y,
        r: scaledSampleSize(18),
      }),
      createSvgElement("circle", {
        class: "sample-dot",
        cx: point.x,
        cy: point.y,
        r: scaledSampleSize(12.5),
        fill: dotFill,
      }),
      createSvgElement("text", {
        class: "sample-number",
        x: point.x,
        y: point.y + 0.6,
        style: `font-size: ${scaledSampleSize(textSizeForClass("sample-number"))}px`,
      }),
    ];
    if (mixedGradient) sampleNodes.unshift(mixedGradient);
    sampleGroup.append(...sampleNodes);
    sampleGroup.lastElementChild.textContent = sample.sample;

    const title = createSvgElement("title");
    title.textContent = `Sample ${sample.sample} | ${formatConcentrationPlain(concentration)} | ${displayPhasePlain(phase)}${metricText.replace(", ", " | ")}`;
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

function renderLayer(concentration, index, fit, samples) {
  const vertices = [
    screenFor(makePoint(100, 0, 0), index, fit),
    screenFor(makePoint(0, 100, 0), index, fit),
    screenFor(makePoint(0, 0, 100), index, fit),
  ];
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
  renderAxisLabels(group, index, fit);
  renderSamples(group, concentration, index, fit, samples);

  const minX = Math.min(...vertices.map((point) => point.x));
  const minY = Math.min(...vertices.map((point) => point.y));
  const maxY = Math.max(...vertices.map((point) => point.y));
  const labelPoint = {
    x: minX - 112,
    y: (minY + maxY) / 2,
  };
  svgConcentrationText(group, concentration, labelPoint, "layer-label", {
    "text-anchor": "end",
  });

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
  const layers = activeConcentrations()
    .map(({ concentration, index }) => renderLayer(concentration, index, fit, samples))
    .sort((a, b) => Number(a.dataset.depth) - Number(b.dataset.depth));

  els.svg.setAttribute("viewBox", `0 0 ${plot.width} ${plot.height}`);
  els.svg.replaceChildren(...(isExporting ? [] : [renderPlotBackground()]), ...layers);
  updateLegendDockWidth();
  updateHighlights();
}

function currentSample() {
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

function updateHighlights() {
  const points = els.svg.querySelectorAll(".sample-point");
  points.forEach((point) => {
    const isSample = Number(point.dataset.sample) === Number(state.sample);
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
  const triplicates = xrdTriplicatesFor(sample, state.concentration);
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
    const labelY = Math.min(stack.baseline + 14, geometry.top + geometry.height - 8);
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
      const y = geometry.top + geometry.height - (clamp(Number(value), 0, 100) / 100) * geometry.height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .filter(Boolean)
    .join(" ");
}

function renderIrPlot(sample) {
  if (!els.irPlot || !els.irStatus) return;

  const irData = window.IR_DATA;
  const spectrum = irSpectrumFor(sample, state.concentration);
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
    const y = geometry.top + geometry.height - (tick / 100) * geometry.height;
    nodes.push(
      createSvgElement("line", {
        class: "xrd-grid-line",
        x1: geometry.left,
        y1: y,
        x2: geometry.left + geometry.width,
        y2: y,
      }),
      createXrdText(tick, geometry.left - 10, y + 4, "xrd-tick-label", {
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
        { text: "Wavelength [cm" },
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
  const rows = [["Wavelength [cm^-1]", "Normalized absorbance [a.u.]"]];

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
    .xrd-axis-title { font-size: 13px; font-weight: 820; }
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

function renderSelectedPhase(phase) {
  resetSelectedPhaseStyle();
  if (phaseColorComponents(phase).length > 1) {
    els.selectedPhase.classList.add("is-mixed-phase");
    renderMixedPhaseText(els.selectedPhase, phase);
    return;
  }

  renderPhaseText(els.selectedPhase, phase);
  els.selectedPhase.style.color = colorForPhase(phase);
}

function stylePhaseChip(chip, phase) {
  const phaseType = normalizePhase(phase);
  const phaseColor = colorForPhase(phase);
  chip.classList.toggle("is-mixed-phase", phaseColorComponents(phase).length > 1);

  if (phaseColorComponents(phase).length > 1) {
    chip.style.background = phaseGradientCss(phase, 0.42);
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
  if (!sample) return;

  const phase = sample.phases[state.concentration] || "-";
  const eeEntry = metricEntry("EE", sample, state.concentration);
  const lcEntry = metricEntry("LC", sample, state.concentration);
  const irEntry = metricEntry("IR", sample, state.concentration);

  els.detailDataset.textContent = state.dataset;
  els.detailTitle.textContent = `Sample ${sample.sample}`;
  renderConcentrationHtml(els.selectedConcentration, state.concentration);
  renderSelectedPhase(phase);
  els.detailM.textContent = `${formatNumber(sample.M)}%`;
  els.detailL.textContent = `${formatNumber(sample.L)}%`;
  els.detailBSA.textContent = `${formatNumber(sample.BSA)}%`;
  els.detailRatio.textContent = formatNumber(sample.ratio);
  els.detailEE.textContent = formatMetricEntry(eeEntry, true, "EE");
  els.detailLC.textContent = formatMetricEntry(lcEntry, true, "LC");
  if (els.detailIR) els.detailIR.textContent = formatMetricEntry(irEntry, true, "IR");
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
      chip.className = "phase-chip";
      if (!renderMixedPhaseText(chip, rowPhase)) {
        renderPhaseText(chip, rowPhase);
      }
      stylePhaseChip(chip, rowPhase);
      phaseCell.append(chip);

      const eeCell = document.createElement("td");
      eeCell.append(createMetricChip("EE", sample, concentration));

      const lcCell = document.createElement("td");
      lcCell.append(createMetricChip("LC", sample, concentration));

      const irCell = document.createElement("td");
      irCell.append(createMetricChip("IR", sample, concentration));

      row.append(concentrationCell, phaseCell, eeCell, lcCell, irCell);
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

  const radius = 18;
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
  const views = {
    z: { rotationX: 0, rotationY: 0, rotationZ: 0 },
    l: { rotationX: 0.07, rotationY: 0, rotationZ: 0 },
    y: { rotationX: 1.25, rotationY: 0, rotationZ: 0 },
    x: { rotationX: 1.18, rotationY: -1.25, rotationZ: 0 },
  };

  state = {
    ...state,
    ...(views[view] || defaultView),
  };
  renderPlot();
}

function renderFilterControls() {
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

    const dot = document.createElement("span");
    dot.className = "phase-dot";
    dot.style.background = palette[key];
    const text = document.createElement("strong");
    text.textContent = label;

    button.append(dot, text);
    return button;
  });
  els.phaseFilters.replaceChildren(allPhase, ...phaseButtons);
}

function updateControlStates() {
  els.tabs.forEach((item) =>
    item.classList.toggle("is-active", item.dataset.dataset === state.dataset),
  );
  els.concentrationFilters.querySelectorAll("[data-concentration-filter]").forEach((button) => {
    button.classList.toggle(
      "is-active",
      button.dataset.concentrationFilter === state.visibleConcentration,
    );
  });
  els.phaseFilters.querySelectorAll("[data-phase-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.phaseFilter === state.phaseFilter);
  });
  els.visualizationFilters.querySelectorAll("[data-visualization]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.visualization === state.visualization);
  });
  els.valueFilters.querySelectorAll("[data-filter-key][data-range-bound]").forEach((input) => {
    const range = state.valueFilters[input.dataset.filterKey];
    input.value = range[input.dataset.rangeBound];
  });
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

  if (nextRange.min > nextRange.max) {
    nextRange[bound === "min" ? "max" : "min"] = value;
  }

  state = {
    ...state,
    valueFilters: {
      ...state.valueFilters,
      [key]: nextRange,
    },
  };
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
  return `
    svg { background: #ffffff; }
    text { font-family: Arial, sans-serif; letter-spacing: 0; }
    .layer-shadow { fill: transparent; }
    .layer-plane { fill: transparent; stroke: rgba(45, 47, 41, 0.62); stroke-width: 1.25; }
    .layer-grid { stroke: rgba(124, 117, 103, 0.28); stroke-width: 0.9; }
    .layer-edge { stroke: rgba(29, 37, 40, 0.58); stroke-width: 1; }
    .layer-label { fill: #000000; font-size: 18px; font-weight: 760; }
    .axis-label { fill: #000000; font-size: 15px; font-weight: 780; }
    .tick-label { fill: #000000; font-size: 13px; font-weight: 720; }
    .sample-hit { fill: transparent; }
    .sample-dot { stroke: #ffffff; stroke-width: 2; }
    .sample-number { fill: #000000; font-size: 9.5px; font-weight: 800; text-anchor: middle; dominant-baseline: middle; paint-order: stroke; stroke: #ffffff; stroke-width: 3px; }
    .sample-ring { opacity: 0; }
    .sample-point.is-selected-sample .sample-dot { stroke: #1d2528; stroke-width: 2.4; }
    .sample-point.is-selected-layer .sample-ring { fill: none; stroke: #1d2528; stroke-width: 3; opacity: 1; }
    .export-legend-panel { fill: #ffffff; stroke: none; }
    .export-legend-text { fill: #1d2528; font-size: 13px; font-weight: 760; dominant-baseline: middle; }
    .export-legend-text-bold { fill: #1d2528; font-size: 13px; font-weight: 850; dominant-baseline: middle; }
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

function exportLegendLayout(svgNode = els.svg) {
  const panelHeight = 44;
  const previousPanelY = plot.height + 22;
  const contentBottom = exportContentBottom(svgNode);
  const panelY = contentBottom + Math.max(18, (previousPanelY - contentBottom) / 2);
  return {
    panelHeight,
    panelY,
    centerY: panelY + panelHeight / 2,
    height: panelY + panelHeight + 28,
  };
}

function exportLegendTargetWidth() {
  return clamp(triangleScreenWidth(), 560, plot.width - 220);
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

function createExportLegend(layout = exportLegendLayout()) {
  const group = createSvgElement("g", {
    class: "export-legend",
    "aria-hidden": "true",
  });
  const { panelHeight, panelY, centerY } = layout;

  if (state.visualization === "phase") {
    const itemWidths = phaseFamilies.map(([label]) => 21 + estimatedExportTextWidth(label));
    const itemWidthTotal = itemWidths.reduce((sum, width) => sum + width, 0);
    const panelWidth = Math.max(exportLegendTargetWidth(), itemWidthTotal + 28 + 18 * Math.max(0, itemWidths.length - 1));
    const itemGap =
      phaseFamilies.length > 1 ? Math.max(18, (panelWidth - 28 - itemWidthTotal) / (phaseFamilies.length - 1)) : 0;
    const panelX = (plot.width - panelWidth) / 2;
    let x = panelX + 14;

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
        createSvgElement("circle", {
          class: "export-legend-swatch",
          cx: x + 6,
          cy: centerY,
          r: 6,
          fill: palette[key],
        }),
        createExportText(label, x + 19, centerY, "export-legend-text-bold"),
      );
      x += itemWidths[index] + itemGap;
    });
    return group;
  }

  const metricKey = state.visualization;
  const definition = metricDefinition(metricKey);
  const paletteConfig = metricPalettes[metricKey] || metricPalettes.EE;
  const label = definition?.label || metricKey;
  const labelWidth = estimatedExportTextWidth(label, 13);
  const panelWidth = Math.max(exportLegendTargetWidth(), labelWidth + 10 + 22 + 9 + 126 + 10 + 38 + 18 + 12 + 8 + 52 + 28);
  const panelX = (plot.width - panelWidth) / 2;
  let x = panelX + 14;
  const scaleWidth = Math.max(126, panelWidth - 28 - (labelWidth + 10 + 22 + 9 + 10 + 38 + 18 + 12 + 8 + 52));
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
  x += labelWidth + 10;
  group.append(createExportText("0%", x, centerY));
  x += 31;
  group.append(
    createSvgElement("rect", {
      class: "export-metric-scale",
      x,
      y: centerY - 6,
      width: scaleWidth,
      height: 12,
      rx: 6,
      fill: `url(#${gradientId})`,
    }),
  );
  x += scaleWidth + 10;
  group.append(createExportText("100%", x, centerY));
  x += 56;
  group.append(
    createSvgElement("circle", {
      class: "export-legend-swatch",
      cx: x + 6,
      cy: centerY,
      r: 6,
      fill: paletteConfig.missing,
      stroke: paletteConfig.missing,
    }),
    createExportText("No data", x + 20, centerY),
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
    panX: 0,
    panY: 0,
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
  const height = layout.height;
  const clone = els.svg.cloneNode(true);
  clone.setAttribute("xmlns", SVG_NS);
  clone.setAttribute("width", plot.width);
  clone.setAttribute("height", height);
  clone.setAttribute("viewBox", `0 0 ${plot.width} ${height}`);

  const background = createSvgElement("rect", {
    x: 0,
    y: 0,
    width: plot.width,
    height,
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
  const height = Number(clone.getAttribute("height")) || plot.height;

  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = plot.width * plot.exportScale;
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
      phaseFilter: button.dataset.phaseFilter,
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
