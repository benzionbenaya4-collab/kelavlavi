// Everything is saved only on this device (localStorage). Nothing is sent anywhere.
import { SUBJECTS, TOPICS, TOPIC_LIST, makeQ } from './data.js';
const KEY = 'klv.v1';
const fresh = () => ({
  setup: false, pinHash: '', name: '', voice: { preset: 'cute', name: '' }, mute: false, micCloud: null,
  profile: { gender: 'f', color: 'purple', animal: 'dog', grade: 2 }, schoolYear: schoolYear(), parsha: [],
  bones: 0, stars: 0, starsEver: 0, spent: [],
  subj: { math: { lvl: 1, stage: 1, done: 0, recent: [] }, en: { lvl: 1, stage: 1, done: 0, recent: [] }, he: { lvl: 1, stage: 1, done: 0, recent: [] } },
  stats: {}, owned: { math: [], en: [], he: [] }, worn: { math: [], en: [], he: [] }, focus: null, stories: [], days: {},
});
// ---------------------------------------------------------------- school calendar (Israel: September → June, July–August = summer)
export function schoolYear(d = new Date()) { return d.getMonth() >= 8 ? d.getFullYear() : d.getFullYear() - 1; }
export function schoolMonth(d = new Date()) { const m = d.getMonth(); return m >= 8 ? m - 8 : m <= 5 ? m + 4 : null; } // Sep=0 … Jun=9, null = summer
export const isSummer = (d = new Date()) => schoolMonth(d) === null;
// the level the calendar says she should be at: ~4 levels per grade, rising through the year
export function baseLevel(grade, d = new Date()) { const m = schoolMonth(d); return (grade - 1) * 4 + 1 + (m === null ? 2 : Math.min(3, Math.floor(m / 2.5))); }

export let S = load();
function load() {
  let s = null; try { s = JSON.parse(localStorage.getItem(KEY)); } catch {}
  if (!s) return fresh();
  s = Object.assign(fresh(), s);
  if (!s.profile || !s.profile.grade) s.profile = { gender: 'f', color: 'purple', animal: 'dog', grade: 2 };
  if (!s.v2) { // old accounts used a grade-2-only scale: move them onto the new scale
    const b = baseLevel(s.profile.grade); for (const k of Object.keys(s.subj)) s.subj[k].lvl = b + Math.max(0, (s.subj[k].lvl || 1) - 1); s.v2 = true; }
  // a new school year (September): move up a grade
  const sy = schoolYear(); if (s.schoolYear && sy > s.schoolYear && s.profile.grade < 12) { s.profile.grade = Math.min(12, s.profile.grade + (sy - s.schoolYear)); for (const k of Object.keys(s.subj)) s.subj[k].lvl = baseLevel(s.profile.grade); s.newGrade = true; }
  s.schoolYear = sy;
  return s;
}
export function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }
export function resetAll() { try { localStorage.removeItem(KEY); } catch {} S = fresh(); S.v2 = true; save(); }
export function startLevels() { const b = baseLevel(S.profile.grade); for (const k of Object.keys(S.subj)) Object.assign(S.subj[k], { lvl: b, stage: 1, done: 0, recent: [] }); S.v2 = true; save(); }

export async function hashPin(pin) {
  try { const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('klv:' + pin)); return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join(''); }
  catch { let h = 7; for (const c of 'klv:' + pin) h = (h * 31 + c.charCodeAt(0)) >>> 0; return 'x' + h; }
}

// effective level: never below what the calendar says (minus one, so a hard month can still ease off)
export const effLevel = (subj) => Math.max(S.subj[subj].lvl, baseLevel(S.profile.grade) - 1);
// topics open at this level, from about the last two grades (no 1st-grade sums in high school)
export const unlocked = (subj, lvl = effLevel(subj)) => { const all = TOPIC_LIST[subj].filter(([, , l]) => l <= lvl); const recent = all.filter(([, , l]) => l > lvl - 9); return (recent.length >= 2 ? recent : all.slice(-3)).map(([t]) => t); };
// summer: a light, fun review of everything from the grade that just ended
const summerTopics = (subj) => { const g = S.profile.grade, lo = (g - 1) * 4 + 1, hi = g * 4; const t = TOPIC_LIST[subj].filter(([, , l]) => l <= hi && l > lo - 4).map(([x]) => x); return t.length ? t : unlocked(subj); };
const key = (subj, t) => `${subj}.${t}`;
export function acc(subj, t) { const st = S.stats[key(subj, t)]; if (!st || st.n < 3) return null; const r = st.r.slice(-12); return r.reduce((a, b) => a + b, 0) / r.length; }

// ~60% from what needs practice, the rest from everything she has; dad's weekly focus first
export function nextQ(subj) {
  const sj = S.subj[subj], summer = isSummer(), topics = summer ? summerTopics(subj) : unlocked(subj), eff = summer ? Math.max(1, baseLevel(S.profile.grade) - 2) : effLevel(subj);
  const lvl = sj.done === 0 ? Math.max(1, eff - 1) : eff; // first question of a stage is a bit easier
  let t;
  const f = S.focus && S.focus.startsWith(subj + '.') ? S.focus.split('.')[1] : null;
  if (f && Math.random() < 0.45) t = topics.includes(f) ? f : null;
  if (!t && Math.random() < 0.6) {
    const scored = topics.map((x) => [x, acc(subj, x)]).map(([x, a]) => [x, a == null ? 0.55 : a]).sort((a, b) => a[1] - b[1]);
    const weak = scored.filter(([, a]) => a < 0.8).map(([x]) => x);
    t = (weak.length ? weak : scored.map(([x]) => x)).slice(0, 2)[Math.floor(Math.random() * Math.min(2, (weak.length || scored.length)))];
  }
  if (!t) t = topics[Math.floor(Math.random() * topics.length)];
  const q = makeQ(subj, t, lvl); if (summer) q.summer = true; return q;
}

// returns { bone, star, levelUp }
export function record(subj, topic, ok, firstTry) {
  const k = key(subj, topic), st = (S.stats[k] ||= { c: 0, n: 0, r: [] }), sj = S.subj[subj];
  st.n++; if (firstTry && ok) st.c++; st.r.push(firstTry && ok ? 1 : 0); if (st.r.length > 30) st.r.shift();
  sj.recent.push(firstTry && ok ? 1 : 0); if (sj.recent.length > 8) sj.recent.shift();
  const today = new Date().toISOString().slice(0, 10); S.days[today] = (S.days[today] || 0) + 1;
  const res = { bone: false, star: false };
  if (ok) {
    S.bones++; res.bone = true; sj.done++;
    if (sj.done >= 10) { sj.done = 0; sj.stage++; sj.lvl = Math.min(48, Math.max(sj.lvl, baseLevel(S.profile.grade) - 1) + 1); S.stars++; S.starsEver++; res.star = true; sj.recent = []; } // silent level-up with the star
  }
  // too many mistakes lately → quietly make it easier
  const r = sj.recent; if (r.length >= 6 && r.slice(-6).filter((x) => !x).length >= 4 && sj.lvl > baseLevel(S.profile.grade) - 2) { sj.lvl = Math.max(1, sj.lvl - 1); sj.recent = []; }
  save(); return res;
}

// ---------------------------------------------------------------- report (shared with dad.html)
export function report(state = S) {
  const out = {};
  for (const subj of Object.keys(SUBJECTS)) {
    const rows = Object.keys(TOPICS[subj]).map((t) => { const st = state.stats[key(subj, t)]; if (!st || st.n < 3) return null; const r = st.r.slice(-12); return { t, name: TOPICS[subj][t], a: r.reduce((x, y) => x + y, 0) / r.length, n: st.n }; }).filter(Boolean);
    const all = rows.reduce((s, x) => s + x.a * x.n, 0) / (rows.reduce((s, x) => s + x.n, 0) || 1);
    out[subj] = { acc: rows.length ? all : null, best: rows.filter((x) => x.a >= 0.75).sort((a, b) => b.a - a.a).slice(0, 2), need: rows.filter((x) => x.a < 0.7).sort((a, b) => a.a - b.a).slice(0, 2),
      lvl: state.subj[subj].lvl, stage: state.subj[subj].stage, answered: rows.reduce((s, x) => s + x.n, 0) };
  }
  return out;
}
// compact export for the QR code
export function exportCode() {
  const st = {}; for (const [k, v] of Object.entries(S.stats)) st[k] = [v.c, v.n, v.r.slice(-12).join('')];
  const o = { v: 1, g: S.profile.grade, t: Date.now(), s: S.stars, e: S.starsEver, b: S.bones, l: Object.fromEntries(Object.entries(S.subj).map(([k, v]) => [k, [v.lvl, v.stage]])), st, d: Object.keys(S.days).filter((d) => Date.now() - new Date(d) < 7 * 864e5).length };
  return 'KLV1:' + btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/=+$/, '');
}
export function importCode(code) {
  const m = String(code).trim().match(/^KLV1:([A-Za-z0-9+/]+)$/); if (!m) return null;
  try { const o = JSON.parse(decodeURIComponent(escape(atob(m[1])))); const f = fresh();
    f.stars = o.s; f.starsEver = o.e; f.bones = o.b; for (const [k, [lv, sg]] of Object.entries(o.l)) Object.assign(f.subj[k], { lvl: lv, stage: sg });
    for (const [k, [c, n, r]] of Object.entries(o.st)) f.stats[k] = { c, n, r: r.split('').map(Number) }; f.t = o.t; f.week = o.d; if (o.g) f.profile.grade = o.g; return f; } catch { return null; }
}
