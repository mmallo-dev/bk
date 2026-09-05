// Simulador de perforaciones de oreja
// Todas las coordenadas están definidas para una oreja "izquierda" en un
// viewBox de 300x420. La oreja derecha se obtiene aplicando un espejo
// (transform: scaleX(-1)) al SVG completo, así que no hace falta recalcular
// ninguna coordenada: outline y puntos se reflejan juntos.

const VIEWBOX = "0 0 300 420";

// Definición de cada tipo de perforación: id, etiqueta, cantidad máxima
// permitida y las posiciones (en orden) que se van habilitando a medida que
// aumenta la cantidad elegida.
const PIERCING_TYPES = [
  {
    id: "helix",
    label: "Hélix",
    maxQty: 4,
    points: [
      { x: 100, y: 40 },
      { x: 65, y: 85 },
      { x: 35, y: 150 },
      { x: 25, y: 210 },
    ],
  },
  {
    id: "helix_inferior",
    label: "Hélix Inferior",
    maxQty: 2,
    points: [
      { x: 35, y: 270 },
      { x: 45, y: 305 },
    ],
  },
  {
    id: "industrial",
    label: "Industrial",
    maxQty: 1,
    isBar: true,
    barEnds: [
      { x: 60, y: 90 },
      { x: 28, y: 205 },
    ],
    points: [{ x: 44, y: 147 }],
  },
  {
    id: "rook",
    label: "Rook",
    maxQty: 1,
    points: [{ x: 95, y: 120 }],
  },
  {
    id: "anti_helix",
    label: "Anti-Hélix",
    maxQty: 1,
    points: [{ x: 125, y: 155 }],
  },
  {
    id: "daith",
    label: "Daith",
    maxQty: 1,
    points: [{ x: 140, y: 205 }],
  },
  {
    id: "snug",
    label: "Snug",
    maxQty: 1,
    points: [{ x: 168, y: 225 }],
  },
  {
    id: "tragus",
    label: "Tragus",
    maxQty: 1,
    points: [{ x: 165, y: 285 }],
  },
  {
    id: "anti_tragus",
    label: "Anti-tragus",
    maxQty: 1,
    points: [{ x: 150, y: 316 }],
  },
  {
    id: "concha_interna",
    label: "Concha Interna",
    maxQty: 5,
    points: [
      { x: 160, y: 200 },
      { x: 178, y: 213 },
      { x: 148, y: 220 },
      { x: 165, y: 236 },
      { x: 182, y: 188 },
    ],
  },
  {
    id: "concha_externa",
    label: "Concha Externa",
    maxQty: 2,
    points: [
      { x: 227, y: 218 },
      { x: 216, y: 255 },
    ],
  },
  {
    id: "lobulo",
    label: "Lóbulo",
    maxQty: 4,
    points: [
      { x: 130, y: 358 },
      { x: 140, y: 380 },
      { x: 150, y: 398 },
      { x: 118, y: 342 },
    ],
  },
  {
    id: "lobulo_superior",
    label: "Lóbulo Superior",
    maxQty: 2,
    points: [
      { x: 103, y: 330 },
      { x: 92, y: 313 },
    ],
  },
];

const JEWEL_COLORS = [
  { id: "plata", label: "Plateado", hex: "#e3e7ee" },
  { id: "oro", label: "Dorado", hex: "#e9c877" },
  { id: "rosa", label: "Rosa", hex: "#f0a8c0" },
  { id: "celeste", label: "Celeste", hex: "#9fd3ec" },
  { id: "turquesa", label: "Turquesa", hex: "#7fd8c6" },
];

const state = {
  side: "both",
  color: JEWEL_COLORS[0].hex,
  selections: {}, // id -> { enabled: bool, qty: number }
};

PIERCING_TYPES.forEach((t) => {
  state.selections[t.id] = { enabled: false, qty: 1 };
});

// ---------- Construcción de la oreja (SVG) ----------

function earOutlineSVG() {
  return `
  <defs>
    <radialGradient id="skinGradient" cx="35%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#f2c9a4" />
      <stop offset="55%" stop-color="#e2ab7c" />
      <stop offset="100%" stop-color="#c98d5f" />
    </radialGradient>
    <radialGradient id="metalGradient" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="45%" stop-color="#cfd6de" />
      <stop offset="100%" stop-color="#8b939c" />
    </radialGradient>
    <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#4a2f1c" flood-opacity="0.25" />
    </filter>
  </defs>

  <path class="ear-outline" filter="url(#softShadow)" fill="url(#skinGradient)"
    stroke="#a9764c" stroke-width="2"
    d="M195 18
       C140 6 85 25 55 70
       C25 115 15 170 20 220
       C25 268 40 308 68 342
       C92 372 118 392 148 404
       C168 411 182 402 185 387
       C188 372 178 356 165 344
       C150 330 142 312 148 294
       C154 276 172 270 188 280
       C208 292 226 276 236 250
       C246 222 244 186 232 155
       C242 130 246 100 232 72
       C222 50 212 32 195 18 Z" />

  <path class="ear-fold" fill="none" stroke="#a9764c" stroke-opacity="0.45"
    stroke-width="7" stroke-linecap="round"
    d="M158 48 C122 82 102 128 100 172 C98 208 112 236 138 256" />
  <path class="ear-fold" fill="none" stroke="#a9764c" stroke-opacity="0.35"
    stroke-width="6" stroke-linecap="round"
    d="M118 142 C94 152 78 172 74 196" />

  <ellipse class="ear-concha" cx="168" cy="208" rx="52" ry="46"
    fill="#a9764c" fill-opacity="0.18" />

  <path class="ear-tragus" fill="#dca173" stroke="#a9764c" stroke-width="1.5"
    d="M150 270 C144 285 147 301 165 306 C181 309 191 295 185 278
       C180 265 160 258 150 270 Z" />
  `;
}

function jewelSVG(x, y, color, radius = 8) {
  return `
    <g class="jewel">
      <circle cx="${x}" cy="${y}" r="${radius}" fill="url(#metalGradient)" stroke="#7c848c" stroke-width="0.8"/>
      <circle cx="${x}" cy="${y}" r="${radius * 0.55}" fill="${color}" />
      <circle cx="${x - radius * 0.25}" cy="${y - radius * 0.25}" r="${radius * 0.18}" fill="#ffffff" fill-opacity="0.85" />
    </g>`;
}

function barSVG(x1, y1, x2, y2, color) {
  return `
    <g class="jewel-bar">
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="url(#metalGradient)" stroke-width="5" stroke-linecap="round"/>
      ${jewelSVG(x1, y1, color, 7)}
      ${jewelSVG(x2, y2, color, 7)}
    </g>`;
}

function buildEarSVG() {
  let content = earOutlineSVG();
  let count = 0;

  PIERCING_TYPES.forEach((type) => {
    const sel = state.selections[type.id];
    if (!sel.enabled) return;

    if (type.isBar) {
      content += barSVG(
        type.barEnds[0].x, type.barEnds[0].y,
        type.barEnds[1].x, type.barEnds[1].y,
        state.color
      );
      count += 1;
      return;
    }

    const qty = Math.min(sel.qty, type.maxQty, type.points.length);
    for (let i = 0; i < qty; i++) {
      const p = type.points[i];
      content += jewelSVG(p.x, p.y, state.color);
      count += 1;
    }
  });

  const svg = `<svg viewBox="${VIEWBOX}" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
  return { svg, count };
}

function renderEarCard(title, mirrored) {
  const { svg, count } = buildEarSVG();
  const card = document.createElement("div");
  card.className = "ear-card";
  card.innerHTML = `
    <h3>${title}</h3>
    <div class="ear-svg-wrap ${mirrored ? "mirrored" : ""}">${svg}</div>
    <div class="ear-count">${count} perforación${count === 1 ? "" : "es"} seleccionada${count === 1 ? "" : "s"}</div>
  `;
  return card;
}

function renderStage() {
  const stage = document.getElementById("stage");
  stage.innerHTML = "";

  if (state.side === "both") {
    stage.appendChild(renderEarCard("Oreja Izquierda", false));
    stage.appendChild(renderEarCard("Oreja Derecha", true));
  } else if (state.side === "left") {
    stage.appendChild(renderEarCard("Oreja Izquierda", false));
  } else {
    stage.appendChild(renderEarCard("Oreja Derecha", true));
  }
}

// ---------- Controles ----------

function renderColorSelector() {
  const wrap = document.getElementById("color-selector");
  wrap.innerHTML = "";
  JEWEL_COLORS.forEach((c) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "color-swatch" + (state.color === c.hex ? " selected" : "");
    btn.style.background = c.hex;
    btn.title = c.label;
    btn.setAttribute("aria-label", c.label);
    btn.addEventListener("click", () => {
      state.color = c.hex;
      renderColorSelector();
      renderStage();
    });
    wrap.appendChild(btn);
  });
}

function renderPiercingList() {
  const list = document.getElementById("piercing-list");
  list.innerHTML = "";

  PIERCING_TYPES.forEach((type) => {
    const sel = state.selections[type.id];
    const row = document.createElement("div");
    row.className = "piercing-row";

    const labelWrap = document.createElement("label");
    labelWrap.className = "check";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = sel.enabled;
    checkbox.addEventListener("change", () => {
      sel.enabled = checkbox.checked;
      renderStage();
    });
    const span = document.createElement("span");
    span.textContent = type.label;
    labelWrap.appendChild(checkbox);
    labelWrap.appendChild(span);
    row.appendChild(labelWrap);

    if (type.maxQty > 1) {
      const qtyControl = document.createElement("div");
      qtyControl.className = "qty-control";

      const minusBtn = document.createElement("button");
      minusBtn.type = "button";
      minusBtn.textContent = "−";
      minusBtn.addEventListener("click", () => {
        if (sel.qty > 1) {
          sel.qty -= 1;
          renderPiercingList();
          renderStage();
        }
      });

      const qtySpan = document.createElement("span");
      qtySpan.textContent = sel.qty;

      const plusBtn = document.createElement("button");
      plusBtn.type = "button";
      plusBtn.textContent = "+";
      plusBtn.addEventListener("click", () => {
        if (sel.qty < type.maxQty) {
          sel.qty += 1;
          renderPiercingList();
          renderStage();
        }
      });

      minusBtn.disabled = sel.qty <= 1;
      plusBtn.disabled = sel.qty >= type.maxQty;

      qtyControl.appendChild(minusBtn);
      qtyControl.appendChild(qtySpan);
      qtyControl.appendChild(plusBtn);
      row.appendChild(qtyControl);
    }

    list.appendChild(row);
  });
}

function setupSideSelector() {
  const radios = document.querySelectorAll('input[name="side"]');
  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        state.side = radio.value;
        renderStage();
      }
    });
  });
}

function setupReset() {
  document.getElementById("reset-btn").addEventListener("click", () => {
    PIERCING_TYPES.forEach((t) => {
      state.selections[t.id] = { enabled: false, qty: 1 };
    });
    state.color = JEWEL_COLORS[0].hex;
    state.side = "both";
    document.querySelector('input[name="side"][value="both"]').checked = true;
    renderColorSelector();
    renderPiercingList();
    renderStage();
  });
}

function init() {
  renderColorSelector();
  renderPiercingList();
  setupSideSelector();
  setupReset();
  renderStage();
}

document.addEventListener("DOMContentLoaded", init);
