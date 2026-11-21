// Weekly Torah portion (Israel schedule), computed on the device from the Hebrew calendar (Intl, calendar "hebrew").
export const PARSHIYOT = ['בראשית', 'נח', 'לך לך', 'וירא', 'חיי שרה', 'תולדות', 'ויצא', 'וישלח', 'וישב', 'מקץ', 'ויגש', 'ויחי',
  'שמות', 'וארא', 'בא', 'בשלח', 'יתרו', 'משפטים', 'תרומה', 'תצוה', 'כי תשא', 'ויקהל', 'פקודי',
  'ויקרא', 'צו', 'שמיני', 'תזריע', 'מצורע', 'אחרי מות', 'קדושים', 'אמור', 'בהר', 'בחוקותי',
  'במדבר', 'נשא', 'בהעלותך', 'שלח לך', 'קרח', 'חוקת', 'בלק', 'פינחס', 'מטות', 'מסעי',
  'דברים', 'ואתחנן', 'עקב', 'ראה', 'שופטים', 'כי תצא', 'כי תבוא', 'נצבים', 'וילך', 'האזינו'];
const PAIRS = [[21, 22], [26, 27], [28, 29], [31, 32], [38, 39], [41, 42], [50, 51]];

const fmt = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const MONTHS = { Tishri: 'tishrei', Heshvan: 'cheshvan', Kislev: 'kislev', Tevet: 'tevet', Shevat: 'shvat', 'Adar I': 'adar1', 'Adar II': 'adar2', Adar: 'adar', Nisan: 'nisan', Iyar: 'iyar', Sivan: 'sivan', Tamuz: 'tamuz', Av: 'av', Elul: 'elul' };
export function hdate(d) {
  const p = Object.fromEntries(fmt.formatToParts(d).map((x) => [x.type, x.value]));
  return { day: +p.day, month: MONTHS[p.month] || p.month, year: +String(p.year).replace(/\D/g, '') };
}
const DAY = 864e5, utc = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
// first gregorian date (UTC midnight) of a Hebrew date, searching forward from `from`
function find(from, month, day, max = 420) { let d = utc(from); for (let i = 0; i < max; i++, d = new Date(d.getTime() + DAY)) { const h = hdate(d); if (h.month === month && h.day === day) return d; } return null; }
// Shabbatot that are festivals in Israel (no weekly portion)
function isHoliday(h) {
  if (h.month === 'tishrei') return [1, 2, 10, 15, 16, 17, 18, 19, 20, 21, 22].includes(h.day);
  if (h.month === 'nisan') return h.day >= 15 && h.day <= 21;
  if (h.month === 'sivan') return h.day === 6;
  return false;
}

const cache = {};
// schedule for the cycle that starts after Simchat Torah of Hebrew year hy: { 'YYYY-MM-DD': 'name' }
function cycle(hy) {
  if (cache[hy]) return cache[hy];
  const st = find(new Date(Date.UTC(hy - 3761, 7, 15)), 'tishrei', 22);       // Simchat Torah (Israel)
  const st2 = find(new Date(st.getTime() + 330 * DAY), 'tishrei', 22);        // next year's
  const rh2 = find(new Date(st.getTime() + 320 * DAY), 'tishrei', 1);
  const pesach = find(st, 'nisan', 15), shavuot = find(st, 'sivan', 6), av9 = find(st, 'av', 9);
  const leap = !!find(st, 'adar1', 1, 200);
  let sat = new Date(st.getTime() + ((6 - st.getUTCDay() + 7) % 7 || 7) * DAY);
  const slots = []; for (; sat < st2; sat = new Date(sat.getTime() + 7 * DAY)) if (!isHoliday(hdate(sat))) slots.push(sat);
  const before = (lim) => slots.filter((s) => s < lim).length;
  const nDevarim = before(new Date(av9.getTime() + DAY)) - 1, nShavuot = before(shavuot), nPesach = before(pesach), nRH = before(rh2);
  // try every set of joined pairs; keep the ones that put the anchors in the right place
  let best = null;
  for (const strict of [true, false]) { if (best) break;
  for (let mask = 0; mask < 128; mask++) {
    const list = []; for (let i = 0; i < PARSHIYOT.length; i++) { const pr = PAIRS.findIndex(([a], k) => a === i && mask & (1 << k)); if (pr >= 0) { list.push([i, i + 1]); i++; } else list.push([i]); }
    if (list.length !== slots.length) continue;
    const at = (i) => list.findIndex((x) => x.includes(i));
    if (at(43) !== nDevarim) continue;                                  // Devarim: Shabbat before Tisha B'Av
    if (at(33) >= nShavuot) continue;                                   // Bamidbar before Shavuot
    if (at(50) !== nRH - 1) continue;                                   // Nitzavim: Shabbat before Rosh Hashana
    if (!leap && at(24) !== nPesach - 1) continue;                      // regular year: Tzav before Pesach
    if (leap && (strict ? at(27) !== nPesach - 1 : ![27, 28].some((i) => at(i) === nPesach - 1))) continue; // leap: Metzora (or Acharei Mot) before Pesach
    const score = [0, 1, 2, 3, 4, 5, 6].reduce((s, k) => s + (mask & (1 << k) ? [3, 4, 5, 6, 64, 1, 0][k] : 0), 0); // prefer the usual joins
    if (!best || score < best.score) best = { score, list };
  } }
  const out = {};
  if (best) best.list.forEach((x, i) => { out[slots[i].toISOString().slice(0, 10)] = x.map((k) => PARSHIYOT[k]).join('-'); });
  return (cache[hy] = out);
}
// the portion for the Shabbat on/after `date` (null on festivals): { name, date, idx }
export function parshaFor(date = new Date()) {
  const d = utc(date), sat = new Date(d.getTime() + ((6 - d.getUTCDay() + 7) % 7) * DAY), key = sat.toISOString().slice(0, 10);
  const h = hdate(sat);
  for (const hy of [h.year - 1, h.year]) { const c = cycle(hy); if (key in c) { const name = c[key]; return { name, date: sat, idx: PARSHIYOT.indexOf(name.split('-')[0]) }; } }
  return { name: null, date: sat, idx: -1 };
}
export const _cycle = cycle;
