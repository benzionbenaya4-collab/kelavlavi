// כלבלבי – main app. Runs fully on the device.
import { SUBJECTS, TOPICS, STORIES } from './data.js';
import { S, save, hashPin, nextQ, record, report, exportCode } from './store.js';
import { puppySVG, ITEMS } from './puppy.js';
import { VOICES, speak, stopSpeak, setMuted, canListen, listen, similar } from './speech.js';
import { drawChart } from './report.js';

const $ = (s, r = document) => r.querySelector(s);
const app = $('#app');
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const nm = () => S.name || 'חמודה';
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const say = (t, lang) => speak(t, S.voice.preset, lang);
setMuted(!!S.mute);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});

// ---------------------------------------------------------------- router
function go(view, ...a) { stopSpeak(); window.scrollTo(0, 0); app.replaceChildren(); VIEWS[view](...a); }
const VIEWS = { onboard, home, map, task, shop, story, command };

function topbar(back) {
  const b = h(`<div class="bar">
    ${back ? '<button class="back" type="button">→ חזרה</button>' : ''}
    <span class="chip" title="כוכבים">⭐ <span class="n">${S.stars}</span></span>
    <span class="chip" title="עצמות">🦴 <span class="n">${S.bones}</span></span>
    <span class="sp"></span>
    <button class="iconbtn" data-a="mute" type="button" aria-label="${S.mute ? 'הפעלת קול' : 'השתקת כלבלבי'}">${S.mute ? '🔇' : '🔊'}</button>
    <button class="iconbtn" data-a="shop" type="button" aria-label="חנות">🏪</button>
  </div>`);
  b.querySelector('.back')?.addEventListener('click', back);
  b.querySelector('[data-a=mute]').onclick = (e) => { S.mute = !S.mute; save(); setMuted(S.mute); e.currentTarget.textContent = S.mute ? '🔇' : '🔊'; };
  b.querySelector('[data-a=shop]').onclick = () => go('shop');
  return b;
}

// ---------------------------------------------------------------- onboarding (first time only)
function onboard(step = 0) {
  const steps = 6, dots = `<div class="stepdots">${Array.from({ length: steps }, (_, i) => `<i class="${i === step ? 'on' : ''}"></i>`).join('')}</div>`;
  const W = h(`<div class="wrap"></div>`); app.append(W);
  const card = (html) => { const c = h(`<section class="onb">${html}${dots}</section>`); W.append(c); return c; };
  if (step === 0) { const c = card(`<div class="art">${puppySVG('math')}</div><h2>ברוכים הבאים לכלבלבי! 🐶💜</h2><p>שלושה גורים פרוותיים עוזרים ללמוד <b>חשבון, אנגלית ועברית</b> של כיתה ב׳.</p><button class="btn big" type="button">הבא ←</button>`); c.querySelector('button').onclick = () => go('onboard', 1); }
  if (step === 1) { const c = card(`<h2>איך מרוויחים? 🦴⭐</h2><p>על כל משימה – <b>עצם 🦴</b>.<br>אחרי <b>10 משימות – כוכב ⭐</b>.</p><p>עם העצמות מאכילים את הגורים ומקבלים להם בגדים. הכוכבים הם <b>החנות של אבא</b> – אבא מפנק עליהם!</p><p>נתקעת? לוחצים על <b>🐶 כלבלבי</b> והוא מסביר.</p><button class="btn big" type="button">הבא ←</button>`); c.querySelector('button').onclick = () => go('onboard', 2); }
  if (step === 2) { const c = card(`<h2>אבא – סיסמה 🔐</h2><p>בחר סיסמה של 4 ספרות. איתה תוכל לראות את הדוח ולהוריד כוכבים אחרי שפינקת.</p><button class="btn big" type="button">ליצירת סיסמה</button>`);
    c.querySelector('button').onclick = async () => { const p1 = await pinPad('אבא, בחר סיסמה'); if (!p1) return; const p2 = await pinPad('שוב, לאישור'); if (p1 !== p2) { toast('הסיסמאות לא תואמות – ננסה שוב'); return; } S.pinHash = await hashPin(p1); save(); go('onboard', 3); }; }
  if (step === 3) { const c = card(`<h2>איך קוראים לה? 💜</h2><p>השם נשמר רק במכשיר הזה.</p><input type="text" id="kidname" maxlength="14" autocomplete="off" aria-label="שם"><button class="btn big" type="button">הבא ←</button>`);
    const i = c.querySelector('input'); i.value = S.name; c.querySelector('button').onclick = () => { const v = i.value.trim(); if (!v) { i.focus(); return; } S.name = v; save(); go('onboard', 4); }; }
  if (step === 4) { const c = card(`<div class="art">${puppySVG('en')}</div><h2>הקול של כלבלבי 🔊</h2><p>לוחצים על קול – ושומעים אותו.</p><div class="voices">${VOICES.map((v) => `<button type="button" data-v="${v.id}" aria-pressed="${S.voice.preset === v.id}">🐶 ${v.name}</button>`).join('')}</div><button class="btn big" type="button" data-next>הבא ←</button>`);
    c.querySelectorAll('[data-v]').forEach((b) => b.onclick = () => { S.voice.preset = b.dataset.v; save(); c.querySelectorAll('[data-v]').forEach((x) => x.setAttribute('aria-pressed', String(x === b))); say(`שלום ${nm()}! אני כלבלבי.`); });
    c.querySelector('[data-next]').onclick = () => go('onboard', 5); }
  if (step === 5) { const c = card(`<h2>התקנה 📲</h2><p>אפשר להתקין את כלבלבי כמו אפליקציה – עם אייקון במסך הבית, ועובד גם בלי אינטרנט.</p>
      <button class="btn big pink" type="button" data-inst>📲 התקן</button><div class="how" id="how" hidden></div><button class="btn big" type="button" data-go>יאללה, מתחילים! 🐾</button>`);
    c.querySelector('[data-inst]').onclick = () => install(c.querySelector('#how'));
    c.querySelector('[data-go]').onclick = () => { S.setup = true; save(); go('home'); setTimeout(() => say(`שלום ${nm()}! מה תרצי ללמוד?`), 300); }; }
}

// ---------------------------------------------------------------- install
let deferred = null; addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferred = e; });
async function install(box) {
  if (matchMedia('(display-mode: standalone)').matches) { toast('כלבלבי כבר מותקן ✓'); return; }
  if (deferred) { deferred.prompt(); const r = await deferred.userChoice.catch(() => ({})); deferred = null; if (r.outcome === 'accepted') toast('הותקן! 🎉'); return; }
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  box.hidden = false;
  box.innerHTML = ios ? '<b>באייפון / אייפד (Safari):</b><ol><li>לוחצים על כפתור השיתוף ⬆️</li><li>"הוסף למסך הבית" ➕</li><li>"הוסף"</li></ol>'
    : '<b>באנדרואיד / מחשב (Chrome):</b><ol><li>תפריט ⋮ למעלה</li><li>"התקנת אפליקציה" או "הוסף למסך הבית"</li><li>"התקן"</li></ol>';
}

// ---------------------------------------------------------------- home
function home() {
  const W = h(`<div class="wrap"></div>`); app.append(W);
  W.append(topbar());
  W.append(h(`<h1 class="hello">שלום ${esc(nm())}, מה תרצי ללמוד?</h1>`));
  const pups = h(`<div class="pups"></div>`);
  for (const [k, s] of Object.entries(SUBJECTS)) {
    const b = h(`<button class="pup" type="button">${puppySVG(k, S.worn[k])}<span class="t"><b>${s.name}</b><small>שלב ${S.subj[k].stage}</small></span></button>`);
    b.onclick = () => go('map', k); pups.append(b);
  }
  W.append(pups);
  const st = h(`<button class="story-card" type="button"><span>📖</span><span><b>סיפור עם כלבלבי</b><small>קוראים ביחד ועונים על שאלות</small></span></button>`);
  st.onclick = () => go('story'); W.append(st);
  const dad = h(`<button class="back" type="button" style="align-self:center">👨 מרכז הפיקוד של אבא</button>`);
  dad.onclick = async () => { if (await askPin()) go('command'); }; W.append(dad);
}

// ---------------------------------------------------------------- map of bones
const BONE = (fill, stroke) => `<svg viewBox="0 0 120 64" aria-hidden="true"><path d="M30 18 a14 14 0 1 0 -6 24 a14 14 0 1 0 6 6 h60 a14 14 0 1 0 6 -6 a14 14 0 1 0 -6 -24 z" fill="${fill}" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/></svg>`;
function map(subj) {
  const sj = S.subj[subj], W = h(`<div class="wrap"></div>`); app.append(W);
  W.append(topbar(() => go('home')));
  W.append(h(`<div class="maphead"><h2>${SUBJECTS[subj].icon} ${SUBJECTS[subj].name}</h2></div>`));
  const total = Math.max(sj.stage + 6, 12), gapY = 112, height = total * gapY + 120;
  const M = h(`<div class="map" style="height:${height}px"></div>`);
  const pts = []; for (let i = 0; i < total; i++) { const y = height - 80 - i * gapY, x = 50 + Math.sin(i * 0.95) * 30; pts.push([x, y]); }
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  M.append(h(`<svg class="path" viewBox="0 0 100 ${height}" preserveAspectRatio="none" aria-hidden="true"><path d="${d}" stroke="#d9c2ff" stroke-width="2.4" stroke-dasharray="1 3" stroke-linecap="round" fill="none" vector-effect="non-scaling-stroke" style="stroke-width:10px"/></svg>`));
  pts.forEach(([x, y], i) => {
    const n = i + 1, done = n < sj.stage, cur = n === sj.stage;
    const b = h(`<button class="node ${cur ? 'cur' : done ? '' : 'locked'}" type="button" style="left:${x}%;top:${y}px" aria-label="שלב ${n}${done ? ' – הושלם' : cur ? ' – השלב הנוכחי' : ' – נעול'}">
      ${BONE(done ? '#ffc531' : cur ? '#8b4ff0' : '#cbb8ea', done ? '#c98a00' : cur ? '#6a2fd1' : '#a993cf')}<span>${done ? '⭐' : n}</span>${cur ? `<div class="pupmini">${puppySVG(subj, S.worn[subj])}</div>` : ''}</button>`);
    if (cur) b.onclick = () => go('task', subj); else if (done) b.onclick = () => toast('את השלב הזה כבר עברת! ⭐');
    M.append(b);
  });
  W.append(M);
  setTimeout(() => M.querySelector('.cur')?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 60);
}

// ---------------------------------------------------------------- one task at a time
function task(subj) {
  const sj = S.subj[subj], q = nextQ(subj), W = h(`<div class="wrap"></div>`); app.append(W); window.__klvQ = q;
  W.append(topbar(() => go('map', subj)));
  const T = h(`<section class="task"><div class="prog" aria-label="התקדמות בשלב"><i style="width:${sj.done * 10}%"></i></div></section>`); W.append(T);
  let tries = 0, solved = false;
  const fb = h(`<p class="feedback" aria-live="polite"></p>`);
  const helpBox = h(`<div class="helper" hidden><div class="pupmini">${puppySVG(subj, S.worn[subj])}</div><div class="bubble"></div></div>`);
  const helpBtn = h(`<button class="helpbtn" type="button" hidden>🐶 כלבלבי</button>`);
  helpBtn.onclick = () => explain(q, helpBox);
  T.append(h(`<p class="q ${q.ltr && /^[\d\s+\-×=?]+$/.test(q.prompt) ? 'ltr' : ''}">${esc(q.prompt)}</p>`));
  if (q.emoji) T.append(h(`<p class="emoji">${q.emoji}</p>`));
  if (q.big) T.append(h(`<p class="big ${/[A-Za-z]/.test(q.big) || q.ltr ? 'ltr' : ''}">${esc(q.big)}</p>`));
  if (q.speak) { const sb = h(`<button class="btn soft" type="button" style="align-self:center">🔊 הקשיבי</button>`); sb.onclick = () => say(q.speak.text, q.speak.lang); T.append(sb); setTimeout(() => say(q.speak.text, q.speak.lang), 400); }
  const done = (ok) => {
    const first = tries === 0; tries++;
    if (!ok) { fb.className = 'feedback bad'; fb.textContent = pick(['כמעט! נסי שוב 💜', 'לא נורא, עוד ניסיון!', 'אופס, נסי שוב']); helpBtn.hidden = false; if (tries === 1) record(subj, q.topic, false, true); return false; }
    if (solved) return true; solved = true;
    const r = first ? record(subj, q.topic, true, true) : record(subj, q.topic, true, false);
    const msg = `כל הכבוד ${nm()}, אני גאה בך! קחי עצם 🦴`;
    fb.className = 'feedback ok'; fb.textContent = msg; say(msg.replace('🦴', ''));
    helpBtn.hidden = true;
    const next = h(`<button class="btn big" type="button" style="align-self:center">הבא ←</button>`);
    next.onclick = () => (r.star ? starParty(subj) : go('task', subj)); T.append(next); next.focus();
    T.querySelector('.prog i').style.width = (r.star ? 100 : S.subj[subj].done * 10) + '%';
    return true;
  };
  renderAnswer(q, T, done);
  T.append(fb, helpBtn, helpBox);
}

function renderAnswer(q, T, done) {
  if (q.type === 'choice') {
    const o = h(`<div class="opts"></div>`);
    for (const opt of q.options) {
      const b = h(`<button class="opt ${q.emojiOpts ? 'emo' : ''} ${q.ltr || q.ltrOpts ? 'ltr' : ''}" type="button">${esc(opt)}</button>`);
      b.onclick = () => { if (b.classList.contains('ok')) return; const ok = opt === q.answer; b.classList.add(ok ? 'ok' : 'bad'); if (!ok) setTimeout(() => b.classList.remove('bad'), 500); done(ok); };
      o.append(b);
    }
    T.append(o);
  } else if (q.type === 'write') {
    const f = h(`<form class="write" autocomplete="off"><input id="ans" ${q.ltr ? 'dir="ltr" inputmode="text" lang="en"' : /^\d+$/.test(q.answer) ? 'inputmode="numeric" dir="ltr"' : 'dir="rtl"'} aria-label="התשובה שלך" autocapitalize="off" spellcheck="false"><button class="btn" type="submit">בדיקה ✓</button></form>`);
    f.onsubmit = (e) => { e.preventDefault(); const v = f.ans.value.trim().toLowerCase().replace(/\s+/g, ' '); if (!v) return; done(v === q.answer.toLowerCase()); };
    T.append(f); setTimeout(() => f.ans.focus(), 50);
  } else if (q.type === 'read') readTask(q.answer, T, done);
  else if (q.type === 'match') {
    const M = h(`<div class="match"><div class="col a"></div><div class="col b"></div></div>`); let sel = null, left = q.pairs.length;
    const words = [...q.pairs].sort(() => Math.random() - 0.5), pics = [...q.pairs].sort(() => Math.random() - 0.5);
    words.forEach(([w]) => { const b = h(`<button class="tile ${/[A-Za-z]/.test(w) ? 'ltr' : ''}" type="button">${esc(w)}</button>`); b.onclick = () => { if (b.classList.contains('done')) return; M.querySelectorAll('.tile.sel').forEach((x) => x.classList.remove('sel')); sel = [w, b]; b.classList.add('sel'); }; M.querySelector('.a').append(b); });
    pics.forEach(([w, e]) => { const b = h(`<button class="tile e" type="button">${e}</button>`); b.onclick = () => { if (!sel || b.classList.contains('done')) return; if (sel[0] === w) { b.classList.add('done'); sel[1].classList.add('done'); sel[1].classList.remove('sel'); sel = null; if (--left === 0) done(true); } else { b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 400); done(false); } }; M.querySelector('.b').append(b); });
    T.append(M);
  } else if (q.type === 'order') {
    const slots = h(`<div class="slots">${q.answer.split('').map(() => '<span></span>').join('')}</div>`), L = h(`<div class="letters"></div>`); let pos = 0;
    q.letters.forEach((c) => { const b = h(`<button type="button">${c}</button>`); b.onclick = () => { if (c === q.answer[pos]) { slots.children[pos].textContent = c; b.disabled = true; if (++pos === q.answer.length) done(true); } else { b.animate([{ transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'none' }], 300); done(false); } }; L.append(b); });
    T.append(slots, L);
  }
}

// reading aloud: microphone if possible, always with a "קראתי!" button as backup
async function micAllowed() {
  if (!canListen) return false;
  if (S.micCloud === true) return true; if (S.micCloud === false) return false;
  return new Promise((res) => {
    const m = h(`<div class="modal"><div class="box"><h3>🎤 מיקרופון</h3><p>כדי שכלבלבי ישמע אותך קוראת, הדפדפן שולח את הקול לזיהוי (כמו המקלדת הקולית). שום דבר לא נשמר. להפעיל?</p><div class="row"><button class="btn" type="button" data-y>כן</button><button class="btn soft" type="button" data-n>לא, אלחץ "קראתי!"</button></div></div></div>`);
    m.querySelector('[data-y]').onclick = () => { S.micCloud = true; save(); m.remove(); res(true); };
    m.querySelector('[data-n]').onclick = () => { S.micCloud = false; save(); m.remove(); res(false); };
    document.body.append(m);
  });
}
function readTask(text, T, done, onOk) {
  const row = h(`<div class="row"><button class="btn big pink" type="button" data-mic>🎤 אני קוראת</button><button class="btn soft" type="button" data-ok>✅ קראתי!</button></div>`);
  const mic = row.querySelector('[data-mic]');
  if (!canListen || S.micCloud === false) mic.hidden = true;
  mic.onclick = async () => {
    if (!(await micAllowed())) { mic.hidden = true; return; }
    mic.disabled = true; mic.textContent = '👂 מקשיב…';
    try { const alts = await listen('he-IL'); const sc = Math.max(...alts.map((a) => similar(a, text)));
      if (sc >= 0.6) { done(true); onOk?.(); } else { done(false); say('כמעט! בואי ננסה שוב, לאט.'); }
    } catch (e) { toast(e === 'not-allowed' ? 'צריך לאשר מיקרופון בהגדרות הדפדפן' : 'לא שמעתי – נסי שוב או לחצי "קראתי!"'); }
    mic.disabled = false; mic.textContent = '🎤 אני קוראת';
  };
  row.querySelector('[data-ok]').onclick = () => { done(true); onOk?.(); };
  T.append(row);
}

// ---------------------------------------------------------------- כלבלבי explains
function explain(q, box) {
  box.hidden = false;
  const steps = q.help || ['בואי נקרא את השאלה שוב, לאט.'];
  box.querySelector('.bubble').innerHTML = `<b>🐶 כלבלבי:</b><ol>${steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>`;
  (async () => { for (const s of ['בואי נפתור ביחד.', ...steps]) { if (box.isConnected) await say(s); } })();
  box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

// ---------------------------------------------------------------- star party (every 10 tasks)
function starParty(subj) {
  go('home');
  confetti();
  const pupEl = [...document.querySelectorAll('.pup')][Object.keys(SUBJECTS).indexOf(subj)]; pupEl?.querySelector('svg')?.classList.add('hop');
  toast(`⭐ קיבלת כוכב! ⭐<br><small>כל הכבוד ${esc(nm())}!</small>`, 3500);
  say(`וואו ${nm()}! קיבלת כוכב! אני כל כך גאה בך!`);
}
function confetti() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = h(`<canvas id="confetti"></canvas>`); document.body.append(c);
  const g = c.getContext('2d'), d = devicePixelRatio || 1; c.width = innerWidth * d; c.height = innerHeight * d;
  const cols = ['#8b4ff0', '#ff6fae', '#ffc531', '#2fbf71', '#3d8bff', '#d9c2ff'];
  const P = Array.from({ length: 160 }, () => ({ x: c.width / 2, y: c.height * 0.35, vx: (Math.random() - 0.5) * 18 * d, vy: (-Math.random() * 16 - 4) * d, r: (4 + Math.random() * 6) * d, c: pick(cols), a: Math.random() * 6, s: Math.random() < 0.3 }));
  let t = 0; const step = () => { t++; g.clearRect(0, 0, c.width, c.height);
    for (const p of P) { p.vy += 0.45 * d; p.x += p.vx; p.y += p.vy; p.a += 0.2; g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.fillStyle = p.c; if (p.s) { g.font = `${p.r * 3}px sans-serif`; g.fillText('⭐', 0, 0); } else g.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); g.restore(); }
    if (t < 170) requestAnimationFrame(step); else c.remove(); };
  step();
}
function toast(html, ms = 2200) { const t = h(`<div class="toast" role="status">${html}</div>`); document.body.append(t); setTimeout(() => t.remove(), ms); }

// ---------------------------------------------------------------- story with כלבלבי
function story(idx) {
  const W = h(`<div class="wrap"></div>`); app.append(W); W.append(topbar(() => go('home')));
  if (idx == null) {
    const P = h(`<section class="panel"><h2 style="margin:0">📖 בחרי סיפור</h2></section>`);
    STORIES.forEach((s, i) => { const b = h(`<button class="story-card" type="button"><span>${S.stories.includes(i) ? '⭐' : '📖'}</span><span><b>${s.title}</b><small>${s.lines.length} שורות · ${s.qs.length} שאלות</small></span></button>`); b.onclick = () => go('story', i); P.append(b); });
    W.append(P); return;
  }
  const s = STORIES[idx]; let line = 0;
  const T = h(`<section class="task"><div class="prog"><i style="width:0%"></i></div><p class="q">${s.title}</p></section>`); W.append(T);
  const helper = h(`<div class="helper"><div class="pupmini">${puppySVG('he', S.worn.he)}</div><div class="bubble">קראי לי את השורה בקול 💜</div></div>`);
  const area = h(`<div style="display:flex;flex-direction:column;gap:14px"></div>`); T.append(area, helper);
  const showLine = () => {
    area.replaceChildren(); T.querySelector('.prog i').style.width = (line / (s.lines.length + s.qs.length)) * 100 + '%';
    if (line >= s.lines.length) return askQs(0);
    area.append(h(`<p class="big" style="font-size:clamp(28px,8vw,44px)">${esc(s.lines[line])}</p>`));
    const fb = h(`<p class="feedback"></p>`);
    readTask(s.lines[line], area, (ok) => { if (!ok) { fb.className = 'feedback bad'; fb.textContent = 'נסי שוב, לאט 💜'; return; }
      record('he', 'readw', true, true); const m = `כל הכבוד ${nm()}, אני גאה בך! קחי עצם`; helper.querySelector('.bubble').textContent = m + ' 🦴'; say(m); line++; setTimeout(showLine, 1200); });
    area.append(fb);
  };
  const askQs = (k) => {
    area.replaceChildren(); T.querySelector('.prog i').style.width = ((s.lines.length + k) / (s.lines.length + s.qs.length)) * 100 + '%';
    if (k >= s.qs.length) { if (!S.stories.includes(idx)) S.stories.push(idx); save(); helper.querySelector('.bubble').textContent = `סיימת את הסיפור! 🎉`; confetti(); say(`סיימת את הסיפור, ${nm()}! מדהים!`); const b = h(`<button class="btn big" type="button" style="align-self:center">לסיפורים ←</button>`); b.onclick = () => go('story'); area.append(b); return; }
    const [q, a, o] = s.qs[k]; const qq = { topic: 'readw', prompt: q, options: [a, ...o].sort(() => Math.random() - 0.5), answer: a, help: ['בואי נחזור לסיפור:', ...s.lines] };
    area.append(h(`<p class="q">${esc(q)}</p>`));
    const fb = h(`<p class="feedback"></p>`), hb = h(`<button class="helpbtn" type="button" hidden>🐶 כלבלבי</button>`), box = h(`<div class="helper" hidden><div class="bubble"></div></div>`);
    hb.onclick = () => explain(qq, box);
    renderAnswer({ ...qq, type: 'choice' }, area, (ok) => { if (!ok) { fb.className = 'feedback bad'; fb.textContent = 'כמעט! נסי שוב'; hb.hidden = false; return; } record('he', 'sentence', true, true); fb.className = 'feedback ok'; fb.textContent = 'נכון! קחי עצם 🦴'; say('נכון! קחי עצם'); setTimeout(() => askQs(k + 1), 1200); });
    area.append(fb, hb, box);
  };
  showLine();
}

// ---------------------------------------------------------------- shop: ⭐ dad's store + 🦴 bone shop
function shop(tab = 'bones', who = 'math') {
  const W = h(`<div class="wrap"></div>`); app.append(W); W.append(topbar(() => go('home')));
  const tabs = h(`<div class="tabs" role="tablist"><button role="tab" type="button" data-t="bones" aria-selected="${tab === 'bones'}">🦴 חנות העצמות</button><button role="tab" type="button" data-t="stars" aria-selected="${tab === 'stars'}">⭐ החנות של אבא</button></div>`);
  tabs.querySelectorAll('button').forEach((b) => b.onclick = () => go('shop', b.dataset.t, who)); W.append(tabs);
  if (tab === 'stars') {
    const P = h(`<section class="panel"><p class="stars-big">⭐ ${S.stars}<small>כוכבים לפנק עליהם</small></p><p style="text-align:center;margin:0">כל כוכב הוא כמו מטבע. אבא מחליט במה לפנק! 💜</p><button class="btn big" type="button" style="align-self:center">👨 אבא שילם</button></section>`);
    P.querySelector('button').onclick = async () => { if (await askPin()) dadPay(); }; W.append(P); return;
  }
  const P = h(`<section class="panel"><div class="pick-pup">${Object.keys(SUBJECTS).map((k) => `<button type="button" data-k="${k}" aria-pressed="${k === who}" aria-label="${SUBJECTS[k].name}">${puppySVG(k, S.worn[k])}</button>`).join('')}</div>
    <div class="dress">${puppySVG(who, S.worn[who])}</div><p style="text-align:center;margin:0">מאכילים את ${SUBJECTS[who].name} בעצמות – והוא מקבל פריט! יש לך 🦴 ${S.bones}</p><div class="items"></div></section>`);
  P.querySelectorAll('[data-k]').forEach((b) => b.onclick = () => go('shop', 'bones', b.dataset.k));
  const box = P.querySelector('.items');
  for (const it of ITEMS) {
    const own = S.owned[who].includes(it.id), on = S.worn[who].includes(it.id);
    const b = h(`<button class="item ${own ? 'own' : ''} ${on ? 'on' : ''}" type="button"><span class="i">${it.icon}</span>${it.name}<small>${own ? (on ? 'לובש ✓' : 'להלביש') : `🦴 ${it.cost}`}</small></button>`);
    b.onclick = () => {
      if (own) { S.worn[who] = on ? S.worn[who].filter((x) => x !== it.id) : [...S.worn[who], it.id]; save(); go('shop', 'bones', who); return; }
      if (S.bones < it.cost) { toast(`צריך עוד ${it.cost - S.bones} עצמות 🦴`); return; }
      S.bones -= it.cost; S.owned[who].push(it.id); S.worn[who].push(it.id); save(); go('shop', 'bones', who); say(`יאמי! תודה! קיבלתי ${it.name}!`); confetti();
    };
    box.append(b);
  }
  W.append(P);
}

// ---------------------------------------------------------------- PIN
function pinPad(title) {
  return new Promise((res) => {
    let v = ''; const m = h(`<div class="modal"><div class="box" role="dialog" aria-label="${title}"><h3>${title}</h3><div class="dots">${'<i></i>'.repeat(4)}</div><p class="err"></p>
      <div class="keys">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button type="button">${n}</button>`).join('')}<button type="button" data-x>✕</button><button type="button">0</button><button type="button" data-b>⌫</button></div></div></div>`);
    const upd = () => m.querySelectorAll('.dots i').forEach((d, i) => d.classList.toggle('f', i < v.length));
    m.querySelectorAll('.keys button').forEach((b) => b.onclick = () => {
      if (b.dataset.x != null) { m.remove(); res(null); return; } if (b.dataset.b != null) { v = v.slice(0, -1); upd(); return; }
      v += b.textContent; upd(); if (v.length === 4) setTimeout(() => { m.remove(); res(v); }, 150);
    });
    document.body.append(m); m.querySelector('.keys button').focus();
  });
}
async function askPin() { const p = await pinPad('סיסמת אבא'); if (!p) return false; if ((await hashPin(p)) === S.pinHash) return true; toast('סיסמה לא נכונה'); return false; }

function dadPay() {
  let n = 1; const m = h(`<div class="modal"><div class="box"><h3>👨 אבא שילם</h3><p style="text-align:center;margin:0">יש ${S.stars} ⭐. כמה כוכבים להוריד?</p><div class="starrow"><button type="button" data-m>−</button><b style="font-size:40px" id="pn">1</b><button type="button" data-p>+</button></div><div class="row"><button class="btn" type="button" data-ok>הורד ⭐</button><button class="btn soft" type="button" data-c>ביטול</button></div></div></div>`);
  const upd = () => (m.querySelector('#pn').textContent = n);
  m.querySelector('[data-m]').onclick = () => { n = Math.max(1, n - 1); upd(); }; m.querySelector('[data-p]').onclick = () => { n = Math.min(S.stars, n + 1); upd(); };
  m.querySelector('[data-c]').onclick = () => m.remove();
  m.querySelector('[data-ok]').onclick = () => { if (S.stars < n) { toast('אין מספיק כוכבים'); return; } S.stars -= n; S.spent.push({ n, t: Date.now() }); save(); m.remove(); toast(`הורדו ${n} ⭐ – תהנו! 💜`); go('shop', 'stars'); };
  document.body.append(m);
}

// ---------------------------------------------------------------- dad's command center (on her device)
function command() {
  const W = h(`<div class="wrap cc"></div>`); app.append(W);
  W.append(h(`<div class="bar"><button class="back" type="button">→ יציאה</button><span class="sp"></span><b>👨 מרכז הפיקוד של אבא</b></div>`));
  W.querySelector('.back').onclick = () => go('home');
  const R = report();
  const P = h(`<section class="panel"><h2>📊 איך ${esc(nm())} מתקדמת</h2><canvas class="chart" aria-label="גרף הצלחה לפי מקצוע"></canvas>
    <div class="legend"><span><i style="background:var(--he)"></i>עברית</span><span><i style="background:var(--math)"></i>מתמטיקה</span><span><i style="background:var(--en)"></i>אנגלית</span></div><div class="subjs" style="display:flex;flex-direction:column;gap:10px"></div></section>`);
  W.append(P); drawChart(P.querySelector('canvas'), R);
  subjCards(P.querySelector('.subjs'), R);
  const days = Object.keys(S.days).filter((d) => Date.now() - new Date(d) < 7 * 864e5).length;
  P.append(h(`<p style="margin:0">⭐ כוכבים עכשיו: <b>${S.stars}</b> · נאספו בסה״כ: <b>${S.starsEver}</b> · 🦴 ${S.bones} · ימי לימוד השבוע: <b>${days}</b></p>`));
  // stars + weekly focus
  const C = h(`<section class="panel"><h2>⭐ כוכבים</h2><div class="row"><button class="btn" type="button" data-pay>אבא שילם (הורדת כוכבים)</button><button class="btn soft" type="button" data-gift>+1 ⭐ מתנה</button></div>
    <h2>🎯 משימה של אבא לשבוע</h2><p style="margin:0">השאלות יתמקדו בנושא שתבחר.</p><select id="focus"><option value="">בלי – האלגוריתם מחליט לבד</option>${Object.entries(TOPICS).map(([s, t]) => `<optgroup label="${SUBJECTS[s].short}">${Object.entries(t).map(([k, n]) => `<option value="${s}.${k}">${n}</option>`).join('')}</optgroup>`).join('')}</select></section>`);
  C.querySelector('[data-pay]').onclick = dadPay;
  C.querySelector('[data-gift]').onclick = () => { S.stars++; S.starsEver++; save(); toast('+1 ⭐'); go('command'); };
  const sel = C.querySelector('#focus'); sel.value = S.focus || ''; sel.onchange = () => { S.focus = sel.value || null; save(); toast(sel.value ? 'נשמר! 🎯' : 'בוטל'); };
  W.append(C);
  // send to dad's phone
  const Q = h(`<section class="panel"><h2>📱 לראות בטלפון של אבא</h2><p style="margin:0">פותחים בטלפון של אבא את <b>דף הפיקוד</b> וסורקים את הקוד. בלי שרת – הנתונים עוברים ישר.</p><div id="qr" style="display:flex;justify-content:center"></div>
    <p style="margin:0;text-align:center;direction:ltr"><a href="dad.html" target="_blank" rel="noopener">dad.html – דף הפיקוד</a></p><details><summary>קוד טקסט (אם אין מצלמה)</summary><textarea readonly style="width:100%;height:90px;direction:ltr" id="codeTxt"></textarea><button class="btn soft" type="button" data-cp>העתק</button></details>
    <h2>🔐 החלפת סיסמה</h2><button class="btn soft" type="button" data-pin>החלף סיסמה</button></section>`);
  const code = exportCode();
  try { const qr = qrcode(0, 'L'); qr.addData(code); qr.make(); Q.querySelector('#qr').innerHTML = qr.createImgTag(6, 12); Q.querySelector('#qr img').alt = 'קוד QR עם הדוח'; } catch { Q.querySelector('#qr').textContent = 'לא הצלחתי ליצור QR – השתמש בקוד הטקסט.'; }
  Q.querySelector('#codeTxt').value = code;
  Q.querySelector('[data-cp]').onclick = (e) => navigator.clipboard?.writeText(code).then(() => (e.target.textContent = 'הועתק ✓'), () => Q.querySelector('#codeTxt').select());
  Q.querySelector('[data-pin]').onclick = async () => { const p1 = await pinPad('סיסמה חדשה'); if (!p1) return; const p2 = await pinPad('שוב, לאישור'); if (p1 !== p2) { toast('לא תואם'); return; } S.pinHash = await hashPin(p1); save(); toast('הסיסמה הוחלפה ✓'); };
  W.append(Q);
}
export function subjCards(box, R) {
  for (const [k, s] of Object.entries(SUBJECTS)) {
    const r = R[k], c = h(`<div class="subj" style="--c:var(--${k})"><b>${s.short}</b> · רמה ${r.lvl} · שלב ${r.stage}${r.acc != null ? ` · ${Math.round(r.acc * 100)}% הצלחה` : ''}
      <p>💪 הכי טובה ב: ${r.best.length ? r.best.map((x) => x.name).join(', ') : '<span style="color:var(--muted)">עוד אין מספיק נתונים</span>'}</p>
      <p>🎯 דרוש תרגול: ${r.need.length ? r.need.map((x) => `${x.name} (${Math.round(x.a * 100)}%)`).join(', ') : r.answered ? 'הכול נראה טוב! 👏' : '<span style="color:var(--muted)">עוד אין מספיק נתונים</span>'}</p></div>`);
    box.append(c);
  }
}

// ---------------------------------------------------------------- start
go(S.setup ? 'home' : 'onboard', 0);
window.__klv = { S, go };
