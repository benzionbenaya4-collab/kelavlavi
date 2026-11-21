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
  { id: 'cap', name: 'כובע מצחייה', icon: '🧢', cost: 8, boy: true },
  { id: 'ball', name: 'כדורגל', icon: '⚽', cost: 6, boy: true },
  { id: 'headphones', name: 'אוזניות', icon: '🎧', cost: 14, boy: true },
  { id: 'cape', name: 'גלימת גיבור', icon: '🦸', cost: 22, boy: true },
  { id: 'tie', name: 'עניבה', icon: '👔', cost: 10, boy: true },
];
// for boys the shop shows these first, and hides the bow and the flower
export const itemsFor = (gender) => (gender === 'm' ? [...ITEMS.filter((i) => i.boy), ...ITEMS.filter((i) => !i.boy && !['bow', 'flower'].includes(i.id))] : ITEMS.filter((i) => !i.boy).concat(ITEMS.filter((i) => i.boy)));

// favourite colours → fur palettes (three shades, one per subject)
export const COLORS = {
  purple: { name: 'סגול', accent: '#8b4ff0', dark: '#6a2fd1', shades: [['#c7a4ff', '#8f63e6', '#ead9ff'], ['#e2c6ff', '#a77cf0', '#f6edff'], ['#b48af5', '#7a4fd6', '#dcc6ff']] },
  pink: { name: 'ורוד', accent: '#ff4fa3', dark: '#d12f80', shades: [['#ffb3d6', '#f06aa8', '#ffe3f0'], ['#ffc9e2', '#f58cbd', '#fff0f7'], ['#ff9fca', '#e2559a', '#ffd6ea']] },
  blue: { name: 'כחול', accent: '#3d8bff', dark: '#1f63d1', shades: [['#a9cbff', '#5c95ee', '#e0edff'], ['#c4dcff', '#79a9f2', '#eef5ff'], ['#93bcff', '#4b80dd', '#d4e5ff']] },
  green: { name: 'ירוק', accent: '#2fbf71', dark: '#1f9a59', shades: [['#a8e6c3', '#56c08a', '#def7ea'], ['#c2efd6', '#76cfa0', '#eefbf4'], ['#93dcb4', '#3fae78', '#d0f3e0']] },
  yellow: { name: 'צהוב', accent: '#e0a500', dark: '#b37f00', shades: [['#ffe08a', '#e8b437', '#fff4cf'], ['#ffe9a8', '#efc55a', '#fff8e1'], ['#ffd76b', '#dba52a', '#ffefbf']] },
  orange: { name: 'כתום', accent: '#ff8a3d', dark: '#d9651c', shades: [['#ffc39a', '#f08a4b', '#ffe7d6'], ['#ffd3b5', '#f5a06a', '#fff1e7'], ['#ffb382', '#e5763a', '#ffdcc4']] },
  red: { name: 'אדום', accent: '#ff4d5e', dark: '#d12f3f', shades: [['#ffa8b0', '#ef5d6c', '#ffe0e3'], ['#ffc0c6', '#f47c88', '#fff0f1'], ['#ff929c', '#e2475a', '#ffd4d8']] },
  brown: { name: 'חום', accent: '#a0642d', dark: '#7a4a1f', shades: [['#d9b38c', '#a8784a', '#f3e6d6'], ['#e5c6a6', '#b98e63', '#f8efe4'], ['#cfa073', '#956438', '#ecd9c4']] },
};
export const ANIMALS = { dog: { name: 'כלב', ic: '🐶', kid: 'גור' }, cat: { name: 'חתול', ic: '🐱', kid: 'חתלתול' }, bunny: { name: 'ארנב', ic: '🐰', kid: 'ארנבון' }, bear: { name: 'דובי', ic: '🧸', kid: 'דובון' } };
let look = { color: 'purple', animal: 'dog' };
export function setLook(color, animal) { look = { color: COLORS[color] ? color : 'purple', animal: ANIMALS[animal] ? animal : 'dog' }; }
const LOOKS = () => { const sh = COLORS[look.color].shades; return { math: { fur: sh[0][0], dark: sh[0][1], patch: sh[0][2] }, en: { fur: sh[1][0], dark: sh[1][1], patch: sh[1][2] }, he: { fur: sh[2][0], dark: sh[2][1], patch: sh[2][2] } }; };

function fluff(cx, cy, r, n, fill, wob = 0.18) {
  // a fluffy blob: many small circles around a centre
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, rr = r * (0.9 + ((i * 37) % 7) / 7 * wob); s += `<circle cx="${(cx + Math.cos(a) * r * 0.82).toFixed(1)}" cy="${(cy + Math.sin(a) * r * 0.82).toFixed(1)}" r="${(rr * 0.34).toFixed(1)}" fill="${fill}"/>`; }
  return s;
}

export function puppySVG(kind, worn = [], opts = {}) {
  const L = LOOKS()[kind] || LOOKS().math, W = (id) => worn.includes(id), A = opts.animal || look.animal;
  const happy = opts.happy ? ' class="hop"' : '';
  let s = `<svg viewBox="0 -24 200 224" role="img" aria-label="${ANIMALS[A].kid} פרוותי"${happy}>`;
  if (W('bed')) s += `<ellipse cx="100" cy="178" rx="88" ry="20" fill="#7a4fd6"/><ellipse cx="100" cy="172" rx="76" ry="15" fill="#f3e8ff"/>`;
  s += `<ellipse cx="100" cy="186" rx="58" ry="8" fill="rgba(60,20,110,.18)"/>`;
  if (W('cape')) s += `<path d="M62 112 Q48 168 58 186 L142 186 Q152 168 138 112 Z" fill="#e5383b" stroke="#a4161a" stroke-width="2.5"/>`;
  // tail
  s += A === 'cat' ? `<path d="M140 160 Q178 150 168 112 Q164 100 156 108" stroke="${L.dark}" stroke-width="11" fill="none" stroke-linecap="round"/>` : A === 'bunny' ? fluff(146, 160, 11, 7, L.patch) : A === 'bear' ? '' : `<g class="tail">${fluff(152, 132, 12, 7, L.fur)}</g>`;
  // body + paws
  s += fluff(100, 140, 44, 14, L.fur);
  s += fluff(100, 146, 22, 9, L.patch);
  s += fluff(74, 176, 13, 7, L.fur) + fluff(126, 176, 13, 7, L.fur);
  s += `<circle cx="70" cy="181" r="2.4" fill="${L.dark}"/><circle cx="78" cy="181" r="2.4" fill="${L.dark}"/><circle cx="122" cy="181" r="2.4" fill="${L.dark}"/><circle cx="130" cy="181" r="2.4" fill="${L.dark}"/>`;
  // ears (floppy) + head
  if (A === 'dog') { s += `<g class="ear l">${fluff(52, 72, 18, 8, L.dark)}${fluff(46, 96, 14, 7, L.dark)}</g>`; s += `<g class="ear r">${fluff(148, 72, 18, 8, L.dark)}${fluff(154, 96, 14, 7, L.dark)}</g>`; }
  if (A === 'cat') { s += `<path d="M58 62 L64 18 L96 44 Z" fill="${L.fur}" stroke="${L.dark}" stroke-width="3" stroke-linejoin="round"/><path d="M66 50 L68 30 L84 44 Z" fill="#ffb3d6"/><path d="M142 62 L136 18 L104 44 Z" fill="${L.fur}" stroke="${L.dark}" stroke-width="3" stroke-linejoin="round"/><path d="M134 50 L132 30 L116 44 Z" fill="#ffb3d6"/>`; }
  if (A === 'bunny') { s += `<g><ellipse cx="78" cy="22" rx="13" ry="36" fill="${L.fur}" transform="rotate(-10 78 40)"/><ellipse cx="78" cy="24" rx="6" ry="26" fill="#ffc6e0" transform="rotate(-10 78 40)"/><ellipse cx="122" cy="22" rx="13" ry="36" fill="${L.fur}" transform="rotate(10 122 40)"/><ellipse cx="122" cy="24" rx="6" ry="26" fill="#ffc6e0" transform="rotate(10 122 40)"/></g>`; }
  if (A === 'bear') { s += `${fluff(62, 42, 17, 8, L.fur)}<circle cx="62" cy="42" r="8" fill="${L.dark}"/>${fluff(138, 42, 17, 8, L.fur)}<circle cx="138" cy="42" r="8" fill="${L.dark}"/>`; }
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
  if (A === 'cat') s += `<g stroke="${L.dark}" stroke-width="1.6" stroke-linecap="round" opacity=".55"><path d="M64 92 h-14 M65 98 l-13 4"/><path d="M136 92 h14 M135 98 l13 4"/></g>`;
  if (A === 'bear') s += `<ellipse cx="100" cy="92" rx="16" ry="12" fill="${L.patch}" opacity=".0"/>`;
  if (W('tie')) s += `<path d="M100 130 l-8 6 l8 4 l8 -4 z" fill="#1f63d1"/><path d="M100 140 l-7 24 l7 8 l7 -8 z" fill="#3d8bff" stroke="#1f63d1" stroke-width="1.5"/>`;
  if (W('ball')) s += `<g transform="translate(150 172)"><circle r="14" fill="#fff" stroke="#222" stroke-width="2"/><path d="M0 -6 l6 4 l-2 7 h-8 l-2 -7 z" fill="#222"/></g>`;
  if (W('glasses')) s += `<g fill="rgba(40,20,70,.85)" stroke="#111" stroke-width="2"><circle cx="82" cy="74" r="12"/><circle cx="118" cy="74" r="12"/></g><path d="M94 74 h12" stroke="#111" stroke-width="3"/>`;
  if (W('bow')) s += `<g transform="translate(130 42) rotate(18)"><path d="M0 0 l-16 -10 v20 z M0 0 l16 -10 v20 z" fill="#ff4fa3"/><circle r="5" fill="#ff8cc6"/></g>`;
  if (W('flower')) s += `<g transform="translate(68 40)">${[0, 72, 144, 216, 288].map((a) => `<circle cx="${(Math.cos(a * Math.PI / 180) * 7).toFixed(1)}" cy="${(Math.sin(a * Math.PI / 180) * 7).toFixed(1)}" r="6" fill="#ffb3d9"/>`).join('')}<circle r="4.5" fill="#ffd23f"/></g>`;
  if (W('hat')) s += `<g transform="translate(100 26)"><rect x="-22" y="-26" width="44" height="30" rx="4" fill="#3b2163"/><rect x="-34" y="2" width="68" height="8" rx="4" fill="#3b2163"/><rect x="-22" y="-6" width="44" height="7" fill="#ff4fa3"/></g>`;
  if (W('cap')) s += `<g transform="translate(100 34)"><path d="M-38 6 Q-38 -26 0 -28 Q38 -26 38 6 Z" fill="#1f63d1"/><path d="M-6 6 Q30 2 62 12 Q34 20 -6 14 Z" fill="#164aa0"/><circle cy="-27" r="4" fill="#ffd23f"/></g>`;
  if (W('headphones')) s += `<path d="M50 80 Q50 20 100 20 Q150 20 150 80" stroke="#2a2a3a" stroke-width="7" fill="none"/><rect x="38" y="70" width="18" height="28" rx="8" fill="#ff4d5e"/><rect x="144" y="70" width="18" height="28" rx="8" fill="#ff4d5e"/>`;
  if (W('crown')) s += `<g transform="translate(100 30)"><path d="M-26 6 L-26 -14 L-13 -2 L0 -20 L13 -2 L26 -14 L26 6 Z" fill="#ffd23f" stroke="#c98a00" stroke-width="2"/><circle cy="-2" r="3.5" fill="#ff4fa3"/></g>`;
  return s + '</svg>';
}
