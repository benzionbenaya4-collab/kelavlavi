// כלבלבי – content and question generators for 2nd grade (math, English, Hebrew).
// Every question: { topic, type, prompt, say, answer, options?, emoji?, help: [steps], speak?: text to read }
// types: choice (multiple choice) · write (keyboard) · read (read aloud) · match (pairs) · order (tap letters)

export const SUBJECTS = {
  math: { name: 'גור החשבון', short: 'חשבון', color: '#3d8bff', fur: '#b58cff', icon: '🧮' },
  en: { name: 'גור האנגלית', short: 'אנגלית', color: '#9b5cff', fur: '#d4b3ff', icon: '🔤' },
  he: { name: 'גור העברית', short: 'עברית', color: '#2fbf71', fur: '#c39bff', icon: '📖' },
};

export const TOPICS = {
  math: { add10: 'חיבור עד 10', sub10: 'חיסור עד 10', add20: 'חיבור עד 20', sub20: 'חיסור עד 20', add100: 'חיבור עשרות עד 100', addc: 'חיבור עם המרה', subb: 'חיסור עם פריטה', mul: 'כפל (2, 5, 10)', word: 'בעיות מילוליות' },
  en: { letters: 'אותיות גדולות וקטנות', abc: 'סדר האותיות', words: 'מילים ותמונות', spell: 'כתיבת מילים', listen: 'הקשבה' },
  he: { first: 'אות ראשונה', missing: 'אות חסרה', words: 'מילה ותמונה', readw: 'קריאת מילים', sentence: 'השלמת משפט', write: 'כתיבת מילים' },
};
// which topics open at which level (level grows by 1 every 10 questions, silently)
export const UNLOCK = {
  // start of 2nd grade = very easy: small numbers, short words, mostly multiple choice
  math: [['add10', 1], ['sub10', 2], ['add20', 3], ['word', 4], ['sub20', 4], ['add100', 5], ['addc', 6], ['subb', 7], ['mul', 8]],
  en: [['words', 1], ['listen', 1], ['letters', 2], ['abc', 3], ['spell', 4]],
  he: [['first', 1], ['words', 1], ['readw', 1], ['missing', 3], ['sentence', 3], ['write', 4]],
};

const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const numOpts = (ans, spread = 3) => { const s = new Set([ans]); while (s.size < 4) { const d = R(-spread * 3, spread * 3); if (d && ans + d >= 0) s.add(ans + d); } return shuffle([...s]).map(String); };

// ------------------------------------------------------------------ math
const NAMES_OBJ = [['עצמות', '🦴'], ['כדורים', '⚽'], ['עוגיות', '🍪'], ['פרחים', '🌸'], ['כוכבים', '⭐'], ['בלונים', '🎈']];
function mathQ(topic, lvl) {
  let a, b, op = '+', ans, help;
  switch (topic) {
    case 'sub10': a = R(3, lvl <= 2 ? 7 : 10); b = R(1, a - 1); op = '-'; ans = a - b; help = [`מתחילים מ־${a}.`, `סופרים אחורה ${b}: ${Array.from({ length: b }, (_, i) => a - i - 1).join(', ')}.`, `נשארנו עם ${ans}!`]; break;
    case 'add10': a = R(1, lvl <= 1 ? 4 : 6); b = R(1, (lvl <= 1 ? 6 : 10) - a); ans = a + b; help = [`מתחילים מ־${a}.`, `סופרים קדימה ${b}: ${Array.from({ length: b }, (_, i) => a + i + 1).join(', ')}.`, `הגענו ל־${ans}!`]; break;
    case 'add20': a = R(4, 12); b = R(2, 20 - a); ans = a + b; help = a + b > 10 && a < 10 ? [`משלימים ל־10: ${a} + ${10 - a} = 10.`, `נשאר להוסיף ${b - (10 - a)}.`, `10 + ${b - (10 - a)} = ${ans}.`] : [`מתחילים מ־${a} וסופרים ${b} קדימה.`, `${a} + ${b} = ${ans}.`]; break;
    case 'sub20': a = R(8, 20); b = R(1, Math.min(9, a)); op = '-'; ans = a - b; help = [`מתחילים מ־${a}.`, `סופרים אחורה ${b}.`, `${a} - ${b} = ${ans}.`]; break;
    case 'add100': a = R(1, 6) * 10; b = R(1, 9 - a / 10) * 10; ans = a + b; help = [`${a} זה ${a / 10 === 1 ? 'עשרת אחת' : a / 10 + ' עשרות'}, ${b} זה ${b / 10 === 1 ? 'עשרת אחת' : b / 10 + ' עשרות'}.`, `${a / 10} + ${b / 10} = ${a / 10 + b / 10} עשרות.`, `כלומר ${ans}.`]; break;
    case 'addc': do { a = R(15, 68); b = R(12, 99 - a); } while ((a % 10) + (b % 10) < 10 || a + b > 99); ans = a + b;
      help = [`מפרקים לעשרות ויחידות.`, `עשרות: ${a - (a % 10)} + ${b - (b % 10)} = ${a - (a % 10) + b - (b % 10)}.`, `יחידות: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}.`, `ביחד: ${a - (a % 10) + b - (b % 10)} + ${(a % 10) + (b % 10)} = ${ans}.`]; break;
    case 'subb': do { a = R(31, 95); b = R(12, a - 10); } while ((a % 10) >= (b % 10)); op = '-'; ans = a - b;
      help = [`קודם מורידים את העשרות: ${a} - ${b - (b % 10)} = ${a - (b - (b % 10))}.`, `עכשיו מורידים את היחידות: ${a - (b - (b % 10))} - ${b % 10} = ${ans}.`]; break;
    case 'mul': a = pick([2, 5, 10]); b = R(1, 10); op = '×'; ans = a * b; help = [`${a} × ${b} זה ${b} פעמים ${a}.`, `${Array.from({ length: b }, () => a).join(' + ')}`, `= ${ans}.`]; break;
    case 'word': { const [w, e] = pick(NAMES_OBJ); a = R(3, 12); b = R(2, 9); const sub = Math.random() < 0.45 && a > b;
      if (sub) { ans = a - b; return { topic, type: pick(['choice', 'write']), prompt: `לגור היו ${a} ${w} ${e}. הוא נתן ${b} לחבר. כמה נשארו לו?`, answer: String(ans), options: numOpts(ans), help: [`היו ${a}, נתן ${b} – מורידים.`, `${a} - ${b} = ${ans}.`] }; }
      ans = a + b; return { topic, type: pick(['choice', 'write']), prompt: `לגור היו ${a} ${w} ${e}. הוא קיבל עוד ${b}. כמה יש לו עכשיו?`, answer: String(ans), options: numOpts(ans), help: [`היו ${a}, קיבל עוד ${b} – מוסיפים.`, `${a} + ${b} = ${ans}.`] }; }
  }
  const type = lvl <= 2 ? 'choice' : Math.random() < 0.5 ? 'choice' : 'write';
  return { topic, type, prompt: `${a} ${op} ${b} = ?`, ltr: true, answer: String(ans), options: numOpts(ans, /10$/.test(topic) ? 1 : 3), help };
}

// ------------------------------------------------------------------ English
const EN = [['dog', '🐶', 'כלב'], ['cat', '🐱', 'חתול'], ['sun', '☀️', 'שמש'], ['ball', '⚽', 'כדור'], ['apple', '🍎', 'תפוח'], ['fish', '🐟', 'דג'], ['car', '🚗', 'מכונית'],
  ['book', '📖', 'ספר'], ['tree', '🌳', 'עץ'], ['house', '🏠', 'בית'], ['star', '⭐', 'כוכב'], ['bird', '🐦', 'ציפור'], ['cake', '🎂', 'עוגה'], ['moon', '🌙', 'ירח'],
  ['egg', '🥚', 'ביצה'], ['hat', '🎩', 'כובע'], ['bed', '🛏️', 'מיטה'], ['cup', '☕', 'כוס'], ['pen', '🖊️', 'עט'], ['milk', '🥛', 'חלב'], ['bus', '🚌', 'אוטובוס'], ['bee', '🐝', 'דבורה']];
const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function enQ(topic, lvl) {
  const short = EN.filter((w) => w[0].length <= (lvl < 4 ? 3 : 5));
  switch (topic) {
    case 'letters': { const L = pick(ABC), others = shuffle(ABC.split('').filter((c) => c !== L)).slice(0, 3);
      return { topic, type: 'choice', prompt: `איזו אות קטנה מתאימה ל־${L}?`, big: L, answer: L.toLowerCase(), options: shuffle([L, ...others].map((c) => c.toLowerCase())), ltrOpts: true, help: [`האות הגדולה ${L}.`, `האות הקטנה שלה נראית ככה: ${L.toLowerCase()}.`] }; }
    case 'abc': { const i = R(0, 22), seq = ABC.slice(i, i + 3);
      return { topic, type: 'choice', prompt: 'איזו אות באה אחרי?', big: `${seq[0]} ${seq[1]} ?`, answer: seq[2], options: shuffle([seq[2], ...shuffle(ABC.split('').filter((c) => c !== seq[2])).slice(0, 3)]), ltrOpts: true, help: [`סדר האותיות: ...${seq[0]}, ${seq[1]}, ${seq[2]}...`, `אחרי ${seq[1]} באה ${seq[2]}.`] }; }
    case 'words': { const w = pick(short), others = shuffle(EN.filter((x) => x !== w)).slice(0, 3);
      if (Math.random() < 0.3) return { topic, type: 'match', prompt: 'התאימי כל מילה לתמונה', pairs: shuffle([w, ...others.slice(0, 2)]).map((x) => [x[0], x[1]]), answer: 'match', help: ['קראי כל מילה לאט.', ...[w, ...others.slice(0, 2)].map((x) => `${x[0]} = ${x[1]} ${x[2]}`)] };
      return { topic, type: 'choice', prompt: `איזו מילה מתאימה לתמונה?`, emoji: w[1], answer: w[0], options: shuffle([w, ...others].map((x) => x[0])), ltrOpts: true, help: [`בתמונה יש ${w[2]}.`, `${w[2]} באנגלית זה ${w[0]}.`] }; }
    case 'listen': { const w = pick(short), others = shuffle(EN.filter((x) => x !== w)).slice(0, 3);
      return { topic, type: 'choice', prompt: 'הקשיבי ובחרי את התמונה', speak: { text: w[0], lang: 'en-US' }, answer: w[1], options: shuffle([w, ...others].map((x) => x[1])), emojiOpts: true, help: [`המילה הייתה ${w[0]}.`, `${w[0]} זה ${w[2]} ${w[1]}.`] }; }
    case 'spell': { const w = pick(short);
      if (Math.random() < 0.5) return { topic, type: 'order', prompt: `סדרי את האותיות: ${w[1]}`, letters: shuffle(w[0].split('')), answer: w[0], ltr: true, help: [`${w[1]} זה ${w[2]}.`, `באנגלית: ${w[0].split('').join(' - ')}.`] };
      return { topic, type: 'write', prompt: `כתבי באנגלית: ${w[2]} ${w[1]}`, answer: w[0], ltr: true, help: [`${w[2]} באנגלית זה ${w[0]}.`, `האותיות: ${w[0].toUpperCase().split('').join(' - ')}.`] }; }
  }
}

// ------------------------------------------------------------------ Hebrew
const HE = [['כלב', '🐶'], ['חתול', '🐱'], ['שמש', '☀️'], ['כדור', '⚽'], ['תפוח', '🍎'], ['דג', '🐟'], ['ספר', '📖'], ['עץ', '🌳'], ['בית', '🏠'], ['כוכב', '⭐'],
  ['ציפור', '🐦'], ['עוגה', '🎂'], ['ירח', '🌙'], ['ביצה', '🥚'], ['כובע', '🎩'], ['מיטה', '🛏️'], ['פרח', '🌸'], ['בננה', '🍌'], ['פיל', '🐘'], ['שעון', '⏰'], ['מטריה', '☂️'], ['גלידה', '🍦']];
const LETTERS = 'אבגדהוזחטיכלמנסעפצקרשת';
const SENT = [['הכלב ___ בחצר', 'רץ', ['ספר', 'כחול', 'מים']], ['הילדה ___ ספר', 'קוראת', ['שמש', 'ירוק', 'עוגה']], ['השמש ___ בשמיים', 'זורחת', ['אוכלת', 'כלב', 'שולחן']],
  ['הגור ___ עצם', 'אוכל', ['כותב', 'שמיים', 'כדור']], ['אני ___ מים', 'שותה', ['רוקד', 'בית', 'צהוב']], ['החתול ___ על המיטה', 'ישן', ['שר', 'עץ', 'אדום']],
  ['הציפור ___ בשמיים', 'עפה', ['שוחה', 'ספר', 'כיסא']], ['אבא ___ עוגה', 'אופה', ['טס', 'ירח', 'נעל']]];
const READ = ['כלב קטן', 'שמש גדולה', 'הגור אוהב עצם', 'אני אוהבת ללמוד', 'החתול ישן', 'בית יפה', 'הכלב רץ מהר', 'יש לי כדור', 'הפרח אדום', 'אבא ואמא בבית'];
function heQ(topic, lvl) {
  const easy = HE.filter((w) => w[0].length <= (lvl < 2 ? 3 : lvl < 4 ? 4 : 5));
  switch (topic) {
    case 'first': { const w = pick(easy), L = w[0][0], others = shuffle(LETTERS.split('').filter((c) => c !== L)).slice(0, 3);
      return { topic, type: 'choice', prompt: `באיזו אות מתחילה המילה?`, emoji: w[1], answer: L, options: shuffle([L, ...others]), help: [`המילה היא "${w[0]}".`, `אומרים לאט: ${w[0]}… הצליל הראשון הוא ${L}.`] }; }
    case 'missing': { const w = pick(easy.filter((x) => x[0].length >= 3)), i = R(0, w[0].length - 1), L = w[0][i], shown = w[0].slice(0, i) + '_' + w[0].slice(i + 1);
      if (lvl >= 3 && Math.random() < 0.5) return { topic, type: 'write', prompt: `השלימי את האות החסרה: ${shown} ${w[1]}`, answer: L, help: [`המילה היא "${w[0]}".`, `האות החסרה היא ${L}.`] };
      return { topic, type: 'choice', prompt: `איזו אות חסרה?`, big: `${shown} ${w[1]}`, answer: L, options: shuffle([L, ...shuffle(LETTERS.split('').filter((c) => c !== L)).slice(0, 3)]), help: [`המילה היא "${w[0]}".`, `האות החסרה היא ${L}.`] }; }
    case 'words': { const w = pick(easy), others = shuffle(HE.filter((x) => x !== w)).slice(0, 3);
      if (lvl >= 2 && Math.random() < 0.3) return { topic, type: 'match', prompt: 'התאימי כל מילה לתמונה', pairs: shuffle([w, ...others.slice(0, 2)]).map((x) => [x[0], x[1]]), answer: 'match', help: ['קראי כל מילה לאט ומצאי את התמונה שלה.'] };
      return { topic, type: 'choice', prompt: 'איזו מילה מתאימה לתמונה?', emoji: w[1], answer: w[0], options: shuffle([w, ...others].map((x) => x[0])), help: [`בתמונה רואים ${w[1]}.`, `זו המילה "${w[0]}".`] }; }
    case 'readw': { const s = lvl < 3 ? pick(easy)[0] : pick(READ);
      return { topic, type: 'read', prompt: 'קראי בקול:', big: s, answer: s, help: [`קוראים לאט, מילה אחרי מילה.`, `"${s}"`] }; }
    case 'sentence': { const [s, a, o] = pick(SENT);
      return { topic, type: 'choice', prompt: 'איזו מילה חסרה?', big: s, answer: a, options: shuffle([a, ...o]), help: [`קוראים את המשפט עם כל מילה ובודקים מה נשמע נכון.`, `"${s.replace('___', a)}".`] }; }
    case 'write': { const w = pick(easy);
      return { topic, type: 'write', prompt: `כתבי את המילה של התמונה`, emoji: w[1], answer: w[0], help: [`זו ${w[0].length > 3 ? 'מילה של ' + w[0].length + ' אותיות' : 'מילה קצרה'}.`, `המילה מתחילה ב־${w[0][0]}.`, `המילה היא "${w[0]}".`] }; }
  }
}

export function makeQ(subj, topic, lvl) { return (subj === 'math' ? mathQ : subj === 'en' ? enQ : heQ)(topic, lvl); }

// ------------------------------------------------------------------ stories (read line by line, then questions)
export const STORIES = [
  { title: 'הגור והעצם', lines: ['לגור קוראים מוקה.', 'מוקה אוהב עצמות.', 'יום אחד מוקה מצא עצם גדולה.', 'הוא נתן חצי לחבר שלו.', 'עכשיו שניהם שמחים.'],
    qs: [['איך קוראים לגור?', 'מוקה', ['רקס', 'לולו', 'בובי']], ['מה מוקה מצא?', 'עצם גדולה', ['כדור', 'עוגה', 'נעל']], ['מה מוקה עשה עם העצם?', 'נתן חצי לחבר', ['אכל הכול', 'זרק אותה', 'הסתיר אותה']]] },
  { title: 'גור בגשם', lines: ['בחוץ יורד גשם.', 'הגור לולו רוצה לשחק.', 'אמא שמה לו מעיל סגול.', 'לולו קופץ בשלוליות.', 'אחר כך הוא ישן חם במיטה.'],
    qs: [['מה יורד בחוץ?', 'גשם', ['שלג', 'עלים', 'כדורים']], ['איזה צבע המעיל?', 'סגול', ['אדום', 'ירוק', 'צהוב']], ['איפה לולו ישן?', 'במיטה', ['בגינה', 'באוטו', 'בשלולית']]] },
  { title: 'יום הולדת לגור', lines: ['היום יום הולדת לגור בובי.', 'כל החברים באו.', 'הייתה עוגה עם נר אחד.', 'בובי קיבל כדור חדש.', 'זה היה יום שמח מאוד.'],
    qs: [['למי יום הולדת?', 'לבובי', ['למוקה', 'ללולו', 'לחתול']], ['כמה נרות היו על העוגה?', 'אחד', ['שניים', 'חמישה', 'אף אחד']], ['מה בובי קיבל?', 'כדור חדש', ['עצם', 'מעיל', 'ספר']]] },
];
