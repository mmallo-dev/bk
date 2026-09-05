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
      { x: 150, y: 20 },
      { x: 80, y: 46 },
      { x: 35, y: 112 },
      { x: 26, y: 190 },
    ],
  },
  {
    id: "helix_inferior",
    label: "Hélix Inferior",
    maxQty: 2,
    points: [
      { x: 31, y: 240 },
      { x: 44, y: 283 },
    ],
  },
  {
    id: "industrial",
    label: "Industrial",
    maxQty: 1,
    isBar: true,
    barEnds: [
      { x: 76, y: 50 },
      { x: 30, y: 184 },
    ],
    points: [{ x: 46, y: 120 }],
  },
  {
    id: "rook",
    label: "Rook",
    maxQty: 1,
    points: [{ x: 96, y: 146 }],
  },
  {
    id: "anti_helix",
    label: "Anti-Hélix",
    maxQty: 1,
    points: [{ x: 111, y: 196 }],
  },
  {
    id: "daith",
    label: "Daith",
    maxQty: 1,
    points: [{ x: 141, y: 224 }],
  },
  {
    id: "snug",
    label: "Snug",
    maxQty: 1,
    points: [{ x: 128, y: 256 }],
  },
  {
    id: "tragus",
    label: "Tragus",
    maxQty: 1,
    points: [{ x: 180, y: 251 }],
  },
  {
    id: "anti_tragus",
    label: "Anti-tragus",
    maxQty: 1,
    points: [{ x: 132, y: 307 }],
  },
  {
    id: "concha_interna",
    label: "Concha Interna",
    maxQty: 5,
    points: [
      { x: 130, y: 190 },
      { x: 155, y: 205 },
      { x: 120, y: 220 },
      { x: 140, y: 236 },
      { x: 158, y: 178 },
    ],
  },
  {
    id: "concha_externa",
    label: "Concha Externa",
    maxQty: 2,
    points: [
      { x: 190, y: 200 },
      { x: 181, y: 233 },
    ],
  },
  {
    id: "lobulo",
    label: "Lóbulo",
    maxQty: 4,
    points: [
      { x: 95, y: 369 },
      { x: 112, y: 387 },
      { x: 128, y: 393 },
      { x: 79, y: 351 },
    ],
  },
  {
    id: "lobulo_superior",
    label: "Lóbulo Superior",
    maxQty: 2,
    points: [
      { x: 108, y: 332 },
      { x: 96, y: 318 },
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

const DEFAULT_JEWEL = { mode: "color", color: JEWEL_COLORS[0].hex };

// Modelos reales de Bonkeers Accesorios (www.bonkeersaccesorios.com), tomados
// de las categorías AROS, Piercings y Piercings Titanio. Se usan como ejemplo
// de joya real para "vestir" cada perforación seleccionada en el simulador.
const BONKEERS_PRODUCTS = [
  {
    name: "Argollitas Cubic Fini",
    price: "$79.250",
    url: "https://www.bonkeersaccesorios.com/productos/argollitas-cubic-fini/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/f77e87d3-bb30-41f7-b708-bbd75a94dc6a1-d13aa97303074fae0c16830431216944-320-0.webp",
  },
  {
    name: "Mini hoop basic",
    price: "$39.250",
    url: "https://www.bonkeersaccesorios.com/productos/mini-hoop-basic-7-10-12-mm/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/3d6e543a-0f25-4714-914c-79707858d9d3_nube-7e9ca528f8a5bb648f16026958605000-320-0.webp",
  },
  {
    name: "Argollitas Tini",
    price: "$92.250",
    url: "https://www.bonkeersaccesorios.com/productos/argollitas-tini/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/image-fad2d7cb72cd97149b16221429341603-320-0.webp",
  },
  {
    name: "Argollita Thunder Small",
    price: "$48.250",
    url: "https://www.bonkeersaccesorios.com/productos/argollita-thunder-small/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/9b0e93d8-628e-4f40-bf56-315b23c884c8-3cd5c63455cf62c66916523169190039-320-0.webp",
  },
  {
    name: "Argollita Circle doble",
    price: "$45.250",
    url: "https://www.bonkeersaccesorios.com/productos/argollita-circle-doble1/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/ca0b6fe3-0bdc-4d47-9d18-a57a84ccec17-1805fc987830ec7db616421020666780-320-0.webp",
  },
  {
    name: "Mini hoop Lele",
    price: "$48.250",
    url: "https://www.bonkeersaccesorios.com/productos/mini-hoop-lele/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/352a74c4-a0f0-4904-8815-f97948b6cd74_nube-96ad392aca65f700a216026955111322-320-0.webp",
  },
  {
    name: "Argollita Camile",
    price: "$48.250",
    url: "https://www.bonkeersaccesorios.com/productos/argollita-camile/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/faeee800-171b-46b1-a552-fdff99bbb076-590bd9b7c02ef6328d16421044359546-320-0.webp",
  },
  {
    name: "Doble Pasante Baby",
    price: "$65.250",
    url: "https://www.bonkeersaccesorios.com/productos/pasante-baby/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/8ceca2f8-fd56-43be-92f1-f763d512181b_nube-eef92e3bfb1b8a740c16048776384475-320-0.webp",
  },
  {
    name: "Argollitas Jazmin",
    price: "$98.250",
    url: "https://www.bonkeersaccesorios.com/productos/argollitas-jazmin/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/ff6f1388-5195-4fef-a956-95be4e470aaf-3003cc2d585369524f16481455983582-320-0.webp",
  },
  {
    name: "Argollita Cubic Fini Xs",
    price: "$39.250",
    url: "https://www.bonkeersaccesorios.com/productos/argollita-cubic-fini-xs/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/55db5fd8-430b-433f-b602-334d1d3829301-959baf7db3ddd0bae016772607906161-320-0.webp",
  },
  {
    name: "Piercing Emily Plata",
    price: "$59.250",
    url: "https://www.bonkeersaccesorios.com/productos/piercing-emily-plata1/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_5449_jpg-54b2df75b152669d5917285938324368-320-0.webp",
  },
  {
    name: "Piercing Dreams Plata",
    price: "$65.250",
    url: "https://www.bonkeersaccesorios.com/productos/piercing-dreams-plata-px64p/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_0858-918deae19718b32c3717679012956023-320-0.webp",
  },
  {
    name: "Piercing Clover Gold",
    price: "$55.250",
    url: "https://www.bonkeersaccesorios.com/productos/piercing-clover-gold/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_1558_jpg-d6a4203cbb28ffddfc17416283120447-320-0.webp",
  },
  {
    name: "Piercing Dotties Plata",
    price: "$55.250",
    url: "https://www.bonkeersaccesorios.com/productos/piercing-dotties-plata/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_4381_jpg-dadca5db293bd1451217495024942729-320-0.webp",
  },
  {
    name: "Piercing Angie Plata",
    price: "$55.250",
    url: "https://www.bonkeersaccesorios.com/productos/piercing-angie-plata/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/671bcd71-c991-41de-92ee-aaac1b271e9d-4c3a151a410b208d2917222909595937-320-0.webp",
  },
  {
    name: "Piercing Molly Plata",
    price: "$55.250",
    url: "https://www.bonkeersaccesorios.com/productos/piercing-molly-plata/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_1589_jpg-2929e3e3ecc05187eb17414411657253-320-0.webp",
  },
  {
    name: "Piercing Trinity Mini Plata",
    price: "$55.250",
    url: "https://www.bonkeersaccesorios.com/productos/piercing-trinity-mini-plata/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_7793_jpg-e62b9233a1980d31c717584925495100-320-0.webp",
  },
  {
    name: "Argollita piercing daith cubic",
    price: "$39.250",
    url: "https://www.bonkeersaccesorios.com/productos/argollita-piercing-daith-cubic/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_2894_jpg-8ba23d03f6f167bab917235113972796-320-0.webp",
  },
  {
    name: "Piercing Dainty Plata",
    price: "$59.250",
    url: "https://www.bonkeersaccesorios.com/productos/piercing-dainty-plata/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_6823_jpg-c9015bbd4c0311ba8d17315293088279-320-0.webp",
  },
  {
    name: "Argollitas Links Plata",
    price: "$145.250",
    url: "https://www.bonkeersaccesorios.com/productos/argollitas-links-plata/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/854f0f06-e06a-4a24-953b-b74605180e19-62702f362b91148e9a16431466472492-320-0.webp",
  },
  {
    name: "Piercing Micro Cristal Titanio",
    price: "$45.000",
    url: "https://www.bonkeersaccesorios.com/productos/piercing-micro-cristal-titanio-1l0ji/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_3260-c4af94e3d67388613517755165662511-320-0.webp",
  },
  {
    name: "Argollita Clicker Annie Titanio (dorada)",
    price: "$65.250",
    url: "https://www.bonkeersaccesorios.com/productos/argollita-clicker-annie-titanio-dorada-1b5kz/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_3360-dda41f1cc33f5a981617756992391592-320-0.webp",
  },
  {
    name: "Piercing Mini Beads Titanio (dorado)",
    price: "$60.000",
    url: "https://www.bonkeersaccesorios.com/productos/piercing-mini-beads-titanio-dorado-1p96n/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_3475-79db4f4c133d4fbc9e17756962122546-320-0.webp",
  },
  {
    name: "Argollita Clicker Titanio Cristales Laterales 12 mm",
    price: "$65.250",
    url: "https://www.bonkeersaccesorios.com/productos/argollita-clicker-titanio-cristales-laterales/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/7b19db6b-e135-4ece-858d-93415f6c1da7-d3dd7a69bf2bcf5a0a17196143865254-320-0.webp",
  },
  {
    name: "Piercing Starlite Titanio (dorado)",
    price: "$60.000",
    url: "https://www.bonkeersaccesorios.com/productos/piercing-starlite-titanio-dorado-1q9zv/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_3447-ac70e8f842643974dd17757464340593-320-0.webp",
  },
  {
    name: "Piercing Lust Titanio (dorado)",
    price: "$60.000",
    url: "https://www.bonkeersaccesorios.com/productos/piercing-lust-titanio-dorado-c8gcg/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_3356-f2486999d3b100155e17757458674577-320-0.webp",
  },
  {
    name: "Piercing Corazón Cristal Titanio (dorado)",
    price: "$45.000",
    url: "https://www.bonkeersaccesorios.com/productos/piercing-corazon-cristal-titanio-dorado-6apg2/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_3413-821805de67f64f66be17756982764277-320-0.webp",
  },
  {
    name: "Piercing Florcita Titanio (dorado)",
    price: "$65.000",
    url: "https://www.bonkeersaccesorios.com/productos/piercing-florcita-titanio-dorado-1rinj/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_3512-4ad32e718009b0e01517756965042419-320-0.webp",
  },
  {
    name: "Piercing Donna Titanio (dorado)",
    price: "$65.000",
    url: "https://www.bonkeersaccesorios.com/productos/piercing-donna-titanio-dorado-6ot44/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_3396-c177805862c91a56a917756958981722-320-0.webp",
  },
  {
    name: "Piercing Deny Titanio (dorado)",
    price: "$65.000",
    url: "https://www.bonkeersaccesorios.com/productos/piercing-deny-titanio-dorado-cjmoj/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_3378-9a7b5dbb43cf35e67617756920282333-320-0.webp",
  },
  {
    name: "Piercing Arya Titanio",
    price: "$65.250",
    url: "https://www.bonkeersaccesorios.com/productos/piercing-arya-titanio-1l7df/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_3151-454e3e30971ef2499517755227792729-320-0.webp",
  },
  {
    name: "Piercing Bolita Lisa Titanio",
    price: "$45.000",
    url: "https://www.bonkeersaccesorios.com/productos/piercing-bolita-lisa-titanio-dthtz/",
    img: "https://acdn-us.mitiendanube.com/stores/364/245/products/img_3137-bca3b6c3dd5f76f86e17755217521238-320-0.webp",
  },
];

// ---------- Estado ----------
// Cada perforación habilitada guarda su propia lista de "joyas" (una por
// punto/slot), así cada perforación puede tener un color o un modelo real
// distinto en vez de compartir uno global.
const state = {
  side: "both",
  selections: {}, // id -> { enabled: bool, qty: number, jewels: [{mode:'color'|'product', color?, img?, name?}] }
  activeSlot: null, // { typeId, slotIndex } — la perforación que se está "vistiendo" ahora
};

PIERCING_TYPES.forEach((t) => {
  state.selections[t.id] = { enabled: false, qty: 1, jewels: [] };
});

function cloneJewel(j) {
  return j ? { ...j } : { ...DEFAULT_JEWEL };
}

function ensureJewelSlots(sel, qty) {
  while (sel.jewels.length < qty) sel.jewels.push(cloneJewel(DEFAULT_JEWEL));
  sel.jewels.length = qty;
}

function getType(typeId) {
  return PIERCING_TYPES.find((t) => t.id === typeId);
}

function getActiveJewel() {
  if (!state.activeSlot) return null;
  const sel = state.selections[state.activeSlot.typeId];
  if (!sel) return null;
  return sel.jewels[state.activeSlot.slotIndex] || null;
}

function setActiveSlot(typeId, slotIndex) {
  state.activeSlot = { typeId, slotIndex };
  renderPiercingList();
  renderColorSelector();
  renderProductGallery();
  renderStage();
}

// ---------- Construcción de la oreja (SVG) ----------
// Silueta e interior inspirados en una oreja realista (hélix redondeado,
// antihélix en Y, concha profunda, trago/antitrago marcados y lóbulo
// carnoso), en vez del esquema geométrico original.

function earOutlineSVG() {
  return `
  <defs>
    <radialGradient id="skinGradient" cx="32%" cy="24%" r="90%">
      <stop offset="0%" stop-color="#fce3d6" />
      <stop offset="45%" stop-color="#f3bfa6" />
      <stop offset="100%" stop-color="#d99a79" />
    </radialGradient>
    <radialGradient id="metalGradient" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="45%" stop-color="#cfd6de" />
      <stop offset="100%" stop-color="#8b939c" />
    </radialGradient>
    <radialGradient id="conchaShadow" cx="68%" cy="58%" r="70%">
      <stop offset="0%" stop-color="#5c3018" stop-opacity="0.55" />
      <stop offset="55%" stop-color="#5c3018" stop-opacity="0.22" />
      <stop offset="100%" stop-color="#5c3018" stop-opacity="0" />
    </radialGradient>
    <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#4a2f1c" flood-opacity="0.22" />
    </filter>
    <filter id="glossBlur" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="10" />
    </filter>
  </defs>

  <path class="ear-outline" filter="url(#softShadow)" fill="url(#skinGradient)"
    stroke="#c07f57" stroke-width="2"
    d="M168 16
       C132 4 92 10 66 34
       C36 60 22 100 24 148
       C26 192 20 232 30 268
       C38 298 46 322 58 344
       C72 368 92 388 118 398
       C136 404 150 394 152 378
       C154 362 144 348 134 336
       C122 322 118 306 122 292
       C128 272 146 262 164 270
       C182 278 196 266 200 246
       C204 226 196 206 182 196
       C190 176 194 152 186 128
       C196 104 196 76 180 52
       C174 40 168 28 168 16 Z" />

  <ellipse class="ear-gloss" cx="88" cy="92" rx="52" ry="66"
    fill="#ffffff" opacity="0.28" filter="url(#glossBlur)" />

  <ellipse class="ear-concha" cx="140" cy="212" rx="60" ry="70"
    fill="url(#conchaShadow)" />

  <path class="ear-fold" fill="none" stroke="#b97a52" stroke-opacity="0.5"
    stroke-width="9" stroke-linecap="round"
    d="M150 40 C110 70 90 110 88 152 C86 190 100 218 128 236" />
  <path class="ear-fold-hi" fill="none" stroke="#ffe3c9" stroke-opacity="0.45"
    stroke-width="3" stroke-linecap="round"
    d="M150 40 C110 70 90 110 88 152 C86 190 100 218 128 236" />

  <path class="ear-fold" fill="none" stroke="#b97a52" stroke-opacity="0.42"
    stroke-width="8" stroke-linecap="round"
    d="M108 150 C84 162 68 184 64 210" />
  <path class="ear-fold-hi" fill="none" stroke="#ffe3c9" stroke-opacity="0.4"
    stroke-width="3" stroke-linecap="round"
    d="M108 150 C84 162 68 184 64 210" />

  <path class="ear-antitragus" fill="url(#skinGradient)" stroke="#c07f57" stroke-width="1.3"
    d="M114 292 C108 306 112 322 128 326 C142 329 152 316 146 302
       C142 292 122 284 114 292 Z" />

  <path class="ear-tragus" filter="url(#softShadow)" fill="url(#skinGradient)" stroke="#c07f57" stroke-width="1.5"
    d="M160 234 C150 250 152 268 172 274 C190 278 202 262 194 244
       C188 230 168 222 160 234 Z" />
  `;
}

let clipIdCounter = 0;

function jewelSVG(x, y, jewel, radius = 8, typeId = null, slotIndex = null, isActive = false) {
  const attrs = typeId !== null
    ? ` class="jewel" data-type="${typeId}" data-slot="${slotIndex}" tabindex="0"`
    : ` class="jewel"`;
  const activeRing = isActive
    ? `<circle cx="${x}" cy="${y}" r="${radius + 5}" class="jewel-active-ring" fill="none" />`
    : "";

  if (jewel && jewel.mode === "product" && jewel.img) {
    const r = radius * 0.62;
    const clipId = `jewel-clip-${clipIdCounter++}`;
    return `
      <g${attrs}>
        ${activeRing}
        <circle cx="${x}" cy="${y}" r="${radius}" fill="url(#metalGradient)" stroke="#7c848c" stroke-width="0.8"/>
        <clipPath id="${clipId}"><circle cx="${x}" cy="${y}" r="${r}" /></clipPath>
        <image href="${jewel.img}" x="${x - r}" y="${y - r}" width="${r * 2}" height="${r * 2}"
          preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})" />
      </g>`;
  }

  const color = (jewel && jewel.mode === "color" && jewel.color) || DEFAULT_JEWEL.color;
  return `
    <g${attrs}>
      ${activeRing}
      <circle cx="${x}" cy="${y}" r="${radius}" fill="url(#metalGradient)" stroke="#7c848c" stroke-width="0.8"/>
      <circle cx="${x}" cy="${y}" r="${radius * 0.55}" fill="${color}" />
      <circle cx="${x - radius * 0.25}" cy="${y - radius * 0.25}" r="${radius * 0.18}" fill="#ffffff" fill-opacity="0.85" />
    </g>`;
}

function barSVG(x1, y1, x2, y2, jewel, typeId, isActive) {
  return `
    <g class="jewel-bar">
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="url(#metalGradient)" stroke-width="5" stroke-linecap="round"/>
      ${jewelSVG(x1, y1, jewel, 7, typeId, 0, isActive)}
      ${jewelSVG(x2, y2, jewel, 7, typeId, 0, isActive)}
    </g>`;
}

function buildEarSVG() {
  let content = earOutlineSVG();
  let count = 0;

  PIERCING_TYPES.forEach((type) => {
    const sel = state.selections[type.id];
    if (!sel.enabled) return;

    const isActiveType = state.activeSlot && state.activeSlot.typeId === type.id;

    if (type.isBar) {
      const jewel = sel.jewels[0] || DEFAULT_JEWEL;
      content += barSVG(
        type.barEnds[0].x, type.barEnds[0].y,
        type.barEnds[1].x, type.barEnds[1].y,
        jewel, type.id, isActiveType && state.activeSlot.slotIndex === 0
      );
      count += 1;
      return;
    }

    const qty = Math.min(sel.qty, type.maxQty, type.points.length);
    for (let i = 0; i < qty; i++) {
      const p = type.points[i];
      const jewel = sel.jewels[i] || DEFAULT_JEWEL;
      const isActive = isActiveType && state.activeSlot.slotIndex === i;
      content += jewelSVG(p.x, p.y, jewel, 8, type.id, i, isActive);
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

function handleStageClick(evt) {
  const jewelEl = evt.target.closest(".jewel");
  if (!jewelEl) return;
  const typeId = jewelEl.getAttribute("data-type");
  const slotIndex = Number(jewelEl.getAttribute("data-slot"));
  if (!typeId) return;
  setActiveSlot(typeId, slotIndex);
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

function renderActiveSlotBanner() {
  const el = document.getElementById("active-slot-banner");
  if (!el) return;
  if (!state.activeSlot) {
    el.textContent = "Elegí una perforación de la lista para asignarle una joya.";
    el.classList.remove("has-target");
    return;
  }
  const type = getType(state.activeSlot.typeId);
  const label = type.isBar ? type.label : `${type.label} ${state.activeSlot.slotIndex + 1}`;
  el.textContent = `Eligiendo joya para: ${label}`;
  el.classList.add("has-target");
}

function renderColorSelector() {
  const wrap = document.getElementById("color-selector");
  wrap.innerHTML = "";
  renderActiveSlotBanner();

  const activeJewel = getActiveJewel();
  const disabled = !state.activeSlot;
  wrap.classList.toggle("disabled", disabled);

  JEWEL_COLORS.forEach((c) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "color-swatch" + (activeJewel && activeJewel.mode === "color" && activeJewel.color === c.hex ? " selected" : "");
    btn.style.background = c.hex;
    btn.title = c.label;
    btn.setAttribute("aria-label", c.label);
    btn.disabled = disabled;
    btn.addEventListener("click", () => {
      if (!state.activeSlot) return;
      const sel = state.selections[state.activeSlot.typeId];
      sel.jewels[state.activeSlot.slotIndex] = { mode: "color", color: c.hex };
      renderPiercingList();
      renderColorSelector();
      renderProductGallery();
      renderStage();
    });
    wrap.appendChild(btn);
  });
}

function renderProductGallery() {
  const wrap = document.getElementById("product-gallery");
  wrap.innerHTML = "";

  const activeJewel = getActiveJewel();
  const disabled = !state.activeSlot;
  wrap.classList.toggle("disabled", disabled);

  BONKEERS_PRODUCTS.forEach((p) => {
    const isSelected = !disabled && activeJewel && activeJewel.mode === "product" && activeJewel.img === p.img;
    const card = document.createElement("div");
    card.className = "product-card" + (isSelected ? " selected" : "");

    const img = document.createElement("img");
    img.src = p.img;
    img.alt = p.name;
    img.loading = "lazy";
    card.appendChild(img);

    const info = document.createElement("div");
    info.className = "product-info";
    info.innerHTML = `<span class="product-name">${p.name}</span><span class="product-price">${p.price}</span>`;
    card.appendChild(info);

    const actions = document.createElement("div");
    actions.className = "product-actions";

    const useBtn = document.createElement("button");
    useBtn.type = "button";
    useBtn.className = "product-use-btn";
    useBtn.textContent = isSelected ? "En uso" : "Usar esta joya";
    useBtn.disabled = disabled;
    useBtn.addEventListener("click", () => {
      if (!state.activeSlot) return;
      const sel = state.selections[state.activeSlot.typeId];
      sel.jewels[state.activeSlot.slotIndex] = isSelected
        ? { ...DEFAULT_JEWEL }
        : { mode: "product", img: p.img, name: p.name };
      renderPiercingList();
      renderColorSelector();
      renderProductGallery();
      renderStage();
    });
    actions.appendChild(useBtn);

    const link = document.createElement("a");
    link.href = p.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.className = "product-link";
    link.textContent = "Ver en Bonkeers";
    actions.appendChild(link);

    card.appendChild(actions);
    wrap.appendChild(card);
  });
}

function slotPreviewStyle(jewel) {
  if (jewel && jewel.mode === "product" && jewel.img) {
    return `background-image: url('${jewel.img}'); background-size: cover; background-position: center;`;
  }
  const color = (jewel && jewel.mode === "color" && jewel.color) || DEFAULT_JEWEL.color;
  return `background: ${color};`;
}

function slotLabelText(jewel) {
  if (jewel && jewel.mode === "product" && jewel.name) return jewel.name;
  if (jewel && jewel.mode === "color") {
    const c = JEWEL_COLORS.find((j) => j.hex === jewel.color);
    return c ? c.label : "Color";
  }
  return "Elegir joya";
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
      if (sel.enabled) {
        ensureJewelSlots(sel, sel.qty);
        state.activeSlot = { typeId: type.id, slotIndex: 0 };
      } else if (state.activeSlot && state.activeSlot.typeId === type.id) {
        state.activeSlot = null;
      }
      renderPiercingList();
      renderColorSelector();
      renderProductGallery();
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
          if (sel.enabled) ensureJewelSlots(sel, sel.qty);
          if (state.activeSlot && state.activeSlot.typeId === type.id && state.activeSlot.slotIndex >= sel.qty) {
            state.activeSlot = sel.qty > 0 ? { typeId: type.id, slotIndex: sel.qty - 1 } : null;
          }
          renderPiercingList();
          renderColorSelector();
          renderProductGallery();
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
          if (sel.enabled) ensureJewelSlots(sel, sel.qty);
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

    if (sel.enabled) {
      const slotsWrap = document.createElement("div");
      slotsWrap.className = "slot-list";
      const qty = Math.min(sel.qty, type.maxQty, type.points.length);
      const slotCount = type.isBar ? 1 : qty;

      for (let i = 0; i < slotCount; i++) {
        const jewel = sel.jewels[i] || DEFAULT_JEWEL;
        const isActive = state.activeSlot && state.activeSlot.typeId === type.id && state.activeSlot.slotIndex === i;
        const slotRow = document.createElement("button");
        slotRow.type = "button";
        slotRow.className = "slot-row" + (isActive ? " active" : "");
        slotRow.innerHTML = `
          <span class="slot-preview" style="${slotPreviewStyle(jewel)}"></span>
          <span class="slot-text">
            <span class="slot-label">${type.isBar ? type.label : `${type.label} ${i + 1}`}</span>
            <span class="slot-jewel-name">${slotLabelText(jewel)}</span>
          </span>
        `;
        slotRow.addEventListener("click", () => setActiveSlot(type.id, i));
        slotsWrap.appendChild(slotRow);
      }
      list.appendChild(slotsWrap);
    }
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
      state.selections[t.id] = { enabled: false, qty: 1, jewels: [] };
    });
    state.activeSlot = null;
    state.side = "both";
    document.querySelector('input[name="side"][value="both"]').checked = true;
    renderColorSelector();
    renderProductGallery();
    renderPiercingList();
    renderStage();
  });
}

function setupStageClicks() {
  document.getElementById("stage").addEventListener("click", handleStageClick);
}

function init() {
  renderColorSelector();
  renderProductGallery();
  renderPiercingList();
  setupSideSelector();
  setupReset();
  setupStageClicks();
  renderStage();
}

document.addEventListener("DOMContentLoaded", init);
