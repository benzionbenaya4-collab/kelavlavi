// Voice of כלבלבי – same engine as Jarvis Prime (the device's own speech), tuned to a cute puppy voice.
export const VOICES = [
  { id: 'cute', name: 'גור חמוד', pitch: 1.6, rate: 1.0 },
  { id: 'happy', name: 'גור שמח', pitch: 1.85, rate: 1.1 },
  { id: 'calm', name: 'גור רגוע', pitch: 1.3, rate: 0.9 },
];
const synth = 'speechSynthesis' in window ? speechSynthesis : null;
let voices = []; const load = () => { voices = synth ? synth.getVoices() : []; };
if (synth) { load(); synth.addEventListener?.('voiceschanged', load); }
export const canSpeak = !!synth;
export const hasHebrewVoice = () => voices.some((v) => /^(he|iw)/i.test(v.lang));
let muted = false; export const setMuted = (m) => { muted = m; if (m) synth?.cancel(); };
export function speak(text, preset = 'cute', lang) {
  if (!synth || muted || !text) return Promise.resolve();
  const p = VOICES.find((v) => v.id === preset) || VOICES[0];
  const L = lang || (/[֐-׿]/.test(text) ? 'he-IL' : 'en-US');
  synth.cancel();
  return new Promise((done) => {
    const u = new SpeechSynthesisUtterance(text.replace(/[^\p{L}\p{N}\s.,!?'"־–\-+×=]/gu, ''));
    u.lang = L; const v = voices.find((x) => x.lang.replace('_', '-').toLowerCase().startsWith(L.slice(0, 2).toLowerCase()) || (L.startsWith('he') && /^iw/i.test(x.lang)));
    if (v) u.voice = v; u.pitch = p.pitch; u.rate = p.rate * (L.startsWith('en') ? 0.85 : 1);
    u.onend = u.onerror = () => done(); synth.speak(u); setTimeout(done, 12000);
  });
}
export const stopSpeak = () => synth?.cancel();

// ---------------------------------------------------------------- listening (reading aloud)
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
export const canListen = !!SR && !!navigator.mediaDevices?.getUserMedia;
export function listen(lang = 'he-IL') {
  return new Promise((resolve, reject) => {
    const r = new SR(); r.lang = lang; r.interimResults = false; r.maxAlternatives = 3; r.continuous = false;
    let got = false;
    r.onresult = (e) => { got = true; resolve([...e.results[0]].map((a) => a.transcript)); };
    r.onerror = (e) => reject(e.error); r.onend = () => { if (!got) reject('no-speech'); };
    try { r.start(); } catch (e) { reject('busy'); }
    setTimeout(() => { try { r.stop(); } catch {} }, 9000);
  });
}
// how close what she read is to the text (0..1)
const clean = (s) => s.replace(/[֑-ׇ]/g, '').replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim().toLowerCase();
export function similar(said, target) {
  const a = clean(target).split(' '), b = clean(said).split(' ');
  let hit = 0; for (const w of a) if (b.some((x) => x === w || (w.length > 2 && (x.startsWith(w.slice(0, -1)) || w.startsWith(x.slice(0, -1)))))) hit++;
  return hit / a.length;
}
