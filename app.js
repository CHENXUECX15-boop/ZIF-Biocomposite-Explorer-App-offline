const SVG_NS = "http://www.w3.org/2000/svg";

const palette = {
  amorphous: "#A5A5A5",
  "ZIF-C": "#20D1DC",
  sod: "#4900F8",
  dia: "#F10000",
  U13: "#DDB600",
  U12: "#00E45C",
  mixed: "#9933FF",
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

const defaultView = {
  rotationX: 1.18,
  rotationY: 0,
  rotationZ: 0,
  zoom: 1,
  panX: 0,
  panY: 0,
};

let state = {
  dataset: "WW",
  sample: 34,
  concentration: "100 mg/mL",
  layerGap: plot.minLayerGap,
  visibleConcentration: "all",
  phaseFilter: "all",
  dragMode: "rotate",
  ...defaultView,
};

let dragState = null;
let hitTargets = [];

const els = {
  svg: document.getElementById("ternaryStack"),
  plotFrame: document.querySelector(".plot-frame"),
  legend: document.getElementById("legend"),
  tabs: Array.from(document.querySelectorAll(".dataset-tab")),
  concentrationFilters: document.getElementById("concentrationFilters"),
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
  phaseRows: document.getElementById("phaseRows"),
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

function svgConcentrationText(group, value, point, className, attrs = {}) {
  const node = createSvgElement("text", {
    class: className,
    x: point.x,
    y: point.y,
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

    const strong = document.createElement("strong");
    strong.textContent = normalizedToken(match[0]);
    container.append(strong);
    cursor = pattern.lastIndex;
    match = pattern.exec(source);
  }

  if (cursor < source.length) {
    container.append(document.createTextNode(source.slice(cursor)));
  }
}

function normalizePhase(phase) {
  const text = String(phase || "").trim();
  const upper = text.toUpperCase();

  if (!text) return "other";
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
  return samples.filter((sample) => phaseMatches(sample.phases[concentration]));
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
    phaseMatches(sample.phases[visibleConcentration]);

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

function renderLegend() {
  els.legend.replaceChildren(
    ...phaseFamilies.map(([label, key]) => {
      const item = document.createElement("span");
      item.className = "legend-item";

      const swatch = document.createElement("span");
      swatch.className = "legend-swatch";
      swatch.style.background = palette[key];

      const text = document.createElement("strong");
      text.textContent = label;

      item.append(swatch, text);
      return item;
    }),
  );
}

function renderGrid(group, index, fit) {
  for (let value = 10; value < 100; value += 10) {
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

  for (let value = 10; value <= 100; value += 10) {
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
    if (!phaseMatches(phase)) {
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
      "aria-label": `Sample ${sample.sample}, ${formatConcentrationPlain(concentration)}, ${displayPhasePlain(phase)}`,
    });

    sampleGroup.append(
      createSvgElement("circle", {
        class: "sample-hit",
        cx: point.x,
        cy: point.y,
        r: 16,
      }),
      createSvgElement("circle", {
        class: "sample-ring",
        cx: point.x,
        cy: point.y,
        r: 13.5,
      }),
      createSvgElement("circle", {
        class: "sample-dot",
        cx: point.x,
        cy: point.y,
        r: 9.2,
        fill: colorForPhase(phase),
      }),
      createSvgElement("text", {
        class: "sample-number",
        x: point.x,
        y: point.y + 0.6,
      }),
    );
    sampleGroup.lastElementChild.textContent = sample.sample;

    const title = createSvgElement("title");
    title.textContent = `Sample ${sample.sample} | ${formatConcentrationPlain(concentration)} | ${displayPhasePlain(phase)}`;
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
    x: minX - 88,
    y: (minY + maxY) / 2,
  };
  svgConcentrationText(group, concentration, labelPoint, "layer-label", {
    "text-anchor": "end",
  });

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
  els.svg.replaceChildren(...layers);
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

function updateDetail() {
  const sample = currentSample();
  if (!sample) return;

  const phase = sample.phases[state.concentration] || "-";

  els.detailDataset.textContent = state.dataset;
  els.detailTitle.textContent = `Sample ${sample.sample}`;
  renderConcentrationHtml(els.selectedConcentration, state.concentration);
  renderPhaseText(els.selectedPhase, phase);
  els.detailM.textContent = `${formatNumber(sample.M)}%`;
  els.detailL.textContent = `${formatNumber(sample.L)}%`;
  els.detailBSA.textContent = `${formatNumber(sample.BSA)}%`;
  els.detailRatio.textContent = formatNumber(sample.ratio);
  els.selectedPhase.style.color = colorForPhase(phase);

  els.phaseRows.replaceChildren(
    ...PHASE_DATA.concentrations.map((concentration) => {
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
      chip.style.background = `${colorForPhase(rowPhase)}26`;
      chip.style.borderColor = `${colorForPhase(rowPhase)}9A`;
      renderPhaseText(chip, rowPhase);
      phaseCell.append(chip);

      row.append(concentrationCell, phaseCell);
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
    y: { rotationX: 1.18, rotationY: 0, rotationZ: 0 },
    x: { rotationX: 1.18, rotationY: -1.45, rotationZ: 0 },
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
  els.modeTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.dragMode === state.dragMode);
  });
  els.plotFrame.classList.toggle("is-pan-mode", state.dragMode === "pan");
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

function exportStyles() {
  return `
    svg { background: transparent; }
    text { font-family: Arial, sans-serif; letter-spacing: 0; }
    .layer-shadow { fill: rgba(39, 42, 39, 0.045); }
    .layer-plane { fill: rgba(255, 253, 248, 0.18); stroke: rgba(45, 47, 41, 0.62); stroke-width: 1.25; }
    .layer-grid { stroke: rgba(124, 117, 103, 0.28); stroke-width: 0.9; }
    .layer-edge { stroke: rgba(29, 37, 40, 0.58); stroke-width: 1; }
    .layer-label { fill: #2f383a; font-size: 13px; font-weight: 760; }
    .axis-label { fill: #506064; font-size: 10.5px; font-weight: 780; }
    .tick-label { fill: rgba(67, 77, 79, 0.82); font-size: 8.2px; font-weight: 680; }
    .sample-hit { fill: transparent; }
    .sample-dot { stroke: #ffffff; stroke-width: 2; }
    .sample-number { fill: #162124; font-size: 8.6px; font-weight: 800; text-anchor: middle; dominant-baseline: middle; }
    .sample-ring { opacity: 0; }
    .sample-point.is-selected-sample .sample-dot { stroke: #1d2528; stroke-width: 2.4; }
    .sample-point.is-selected-layer .sample-ring { fill: none; stroke: #1d2528; stroke-width: 3; opacity: 1; }
  `;
}

function cloneSvgForExport() {
  const clone = els.svg.cloneNode(true);
  clone.setAttribute("xmlns", SVG_NS);
  clone.setAttribute("width", plot.width);
  clone.setAttribute("height", plot.height);

  const defs = createSvgElement("defs");
  const style = createSvgElement("style");
  style.textContent = exportStyles();
  defs.append(style);
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
  const clone = cloneSvgForExport();
  const svgText = new XMLSerializer().serializeToString(clone);
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);
  const image = new Image();
  const fileSafeConcentration = formatConcentrationFile(state.concentration);

  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = plot.width * plot.exportScale;
    canvas.height = plot.height * plot.exportScale;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
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
  bindRotation();
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
