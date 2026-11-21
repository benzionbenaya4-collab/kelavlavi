// Fluffy purple puppies drawn in SVG (no images). Items are drawn on top.
export const ITEMS = [
  { id: 'collar', name: 'קולר', icon: '📿', cost: 5 },
  { id: 'bow', name: 'פפיון', icon: '🎀', cost: 8 },
  { id: 'scarf', name: 'צעיף', icon: '🧣', cost: 10 },
  { id: 'glasses', name: 'משקפיים', icon: '🕶️', cost: 12 },
  { id: 'hat', name: 'כובע', icon: '🎩', cost: 15 },
  { id: 'flower', name: 'פרח', icon: '🌸', cost: 6 },
  { id: 'bed', name: 'מיטה', icon: '🛏️', cost: 20 },
  { id: 'crown', name: 'כתר', icon: '👑', cost: 30 },
];

// fur: main colour; dark: ears/shadow
const LOOKS = {
  math: { fur: '#c7a4ff', dark: '#8f63e6', patch: '#ead9ff' },
  en: { fur: '#e2c6ff', dark: '#a77cf0', patch: '#f6edff' },
  he: { fur: '#b48af5', dark: '#7a4fd6', patch: '#dcc6ff' },
};

function fluff(cx, cy, r, n, fill, wob = 0.18) {
  // a fluffy blob: many small circles around a centre
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, rr = r * (0.9 + ((i * 37) % 7) / 7 * wob); s += `<circle cx="${(cx + Math.cos(a) * r * 0.82).toFixed(1)}" cy="${(cy + Math.sin(a) * r * 0.82).toFixed(1)}" r="${(rr * 0.34).toFixed(1)}" fill="${fill}"/>`; }
  return s;
}

export function puppySVG(kind, worn = [], opts = {}) {
  const L = LOOKS[kind] || LOOKS.math, W = (id) => worn.includes(id);
  const happy = opts.happy ? ' class="hop"' : '';
  let s = `<svg viewBox="0 0 200 200" role="img" aria-label="גור פרוותי"${happy}>`;
  if (W('bed')) s += `<ellipse cx="100" cy="178" rx="88" ry="20" fill="#7a4fd6"/><ellipse cx="100" cy="172" rx="76" ry="15" fill="#f3e8ff"/>`;
  s += `<ellipse cx="100" cy="186" rx="58" ry="8" fill="rgba(60,20,110,.18)"/>`;
  // tail
  s += `<g class="tail">${fluff(152, 132, 12, 7, L.fur)}</g>`;
  // body + paws
  s += fluff(100, 140, 44, 14, L.fur);
  s += fluff(100, 146, 22, 9, L.patch);
  s += fluff(74, 176, 13, 7, L.fur) + fluff(126, 176, 13, 7, L.fur);
  s += `<circle cx="70" cy="181" r="2.4" fill="${L.dark}"/><circle cx="78" cy="181" r="2.4" fill="${L.dark}"/><circle cx="122" cy="181" r="2.4" fill="${L.dark}"/><circle cx="130" cy="181" r="2.4" fill="${L.dark}"/>`;
  // ears (floppy) + head
  s += `<g class="ear l">${fluff(52, 72, 18, 8, L.dark)}${fluff(46, 96, 14, 7, L.dark)}</g>`;
  s += `<g class="ear r">${fluff(148, 72, 18, 8, L.dark)}${fluff(154, 96, 14, 7, L.dark)}</g>`;
  s += fluff(100, 78, 46, 16, L.fur);
  s += fluff(100, 94, 22, 9, L.patch);
  // neck items go on top of the head's fluff so they are always visible
  if (W('scarf')) s += `<path d="M64 122 Q100 142 136 122" stroke="#3ddc84" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M116 132 l12 30 l-15 -1 z" fill="#2fbf71" stroke="#1f9a59" stroke-width="1.5"/>`;
  if (W('collar')) s += `<path d="M68 124 Q100 140 132 124" stroke="#ff4fa3" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="100" cy="137" r="7.5" fill="#ffd23f" stroke="#c98a00" stroke-width="2"/><circle cx="100" cy="137" r="2" fill="#c98a00"/>`;
  // eyes
  s += `<g class="eyes"><circle cx="82" cy="74" r="8.5" fill="#2a1446"/><circle cx="118" cy="74" r="8.5" fill="#2a1446"/><circle cx="85" cy="71" r="3" fill="#fff"/><circle cx="121" cy="71" r="3" fill="#fff"/></g>`;
  s += `<circle cx="70" cy="90" r="6" fill="#ff9fcf" opacity=".55"/><circle cx="130" cy="90" r="6" fill="#ff9fcf" opacity=".55"/>`;
  // nose + mouth + tongue
  s += `<ellipse cx="100" cy="88" rx="6.5" ry="5" fill="#2a1446"/><path d="M100 93 v3 M94 97 Q97 100.5 100 96.5 Q103 100.5 106 97" stroke="#2a1446" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  s += `<path d="M97.5 99.5 Q100 106 102.5 99.5 Z" fill="#ff6fa8"/>`;
  if (W('glasses')) s += `<g fill="rgba(40,20,70,.85)" stroke="#111" stroke-width="2"><circle cx="82" cy="74" r="12"/><circle cx="118" cy="74" r="12"/></g><path d="M94 74 h12" stroke="#111" stroke-width="3"/>`;
  if (W('bow')) s += `<g transform="translate(130 42) rotate(18)"><path d="M0 0 l-16 -10 v20 z M0 0 l16 -10 v20 z" fill="#ff4fa3"/><circle r="5" fill="#ff8cc6"/></g>`;
  if (W('flower')) s += `<g transform="translate(68 40)">${[0, 72, 144, 216, 288].map((a) => `<circle cx="${(Math.cos(a * Math.PI / 180) * 7).toFixed(1)}" cy="${(Math.sin(a * Math.PI / 180) * 7).toFixed(1)}" r="6" fill="#ffb3d9"/>`).join('')}<circle r="4.5" fill="#ffd23f"/></g>`;
  if (W('hat')) s += `<g transform="translate(100 26)"><rect x="-22" y="-26" width="44" height="30" rx="4" fill="#3b2163"/><rect x="-34" y="2" width="68" height="8" rx="4" fill="#3b2163"/><rect x="-22" y="-6" width="44" height="7" fill="#ff4fa3"/></g>`;
  if (W('crown')) s += `<g transform="translate(100 30)"><path d="M-26 6 L-26 -14 L-13 -2 L0 -20 L13 -2 L26 -14 L26 6 Z" fill="#ffd23f" stroke="#c98a00" stroke-width="2"/><circle cy="-2" r="3.5" fill="#ff4fa3"/></g>`;
  return s + '</svg>';
}
