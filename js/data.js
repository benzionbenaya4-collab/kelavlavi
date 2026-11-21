// כלבלבי – content and question generators, grades 1–12 (math, English, Hebrew).
// One global level scale: about 4 levels per grade (grade g ≈ levels 4g-3 … 4g).
// Every question: { topic, type, prompt, answer, options?, emoji?, big?, help: [steps], speak? }
// types: choice · write · read · match · order. Text is written in the feminine; G() turns it masculine.

export const SUBJECTS = {
  math: { name: 'החשבון', short: 'מתמטיקה', icon: '🧮' },
  en: { name: 'האנגלית', short: 'אנגלית', icon: '🔤' },
  he: { name: 'העברית', short: 'עברית', icon: '📖' },
};
export const GRADES = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ז׳', 'ח׳', 'ט׳', 'י׳', 'י״א', 'י״ב'];

// [topic id, name, the level it opens at]
export const TOPIC_LIST = {
  math: [['add5', 'חיבור עד 5', 1], ['add10', 'חיבור עד 10', 1], ['sub10', 'חיסור עד 10', 2], ['cmp', 'גדול / קטן', 2], ['add20', 'חיבור עד 20', 3], ['sub20', 'חיסור עד 20', 4],
    ['add100', 'חיבור עשרות עד 100', 5], ['word', 'בעיות מילוליות', 5], ['addc', 'חיבור עם המרה', 6], ['subb', 'חיסור עם פריטה', 7], ['mul', 'כפל (2, 5, 10)', 8],
    ['multab', 'לוח הכפל', 9], ['div', 'חילוק', 10], ['add1000', 'חיבור וחיסור עד 1000', 11], ['word2', 'בעיות כפל וחילוק', 12], ['mul2d', 'כפל דו־ספרתי', 13],
    ['divr', 'חילוק עם שארית', 14], ['frac', 'שבר של כמות', 15], ['round', 'עיגול מספרים', 16], ['fracadd', 'חיבור שברים', 17], ['dec', 'מספרים עשרוניים', 18],
    ['pct', 'אחוזים', 19], ['area', 'שטח והיקף', 20], ['fracdiff', 'שברים במכנים שונים', 21], ['neg', 'מספרים שליליים', 22], ['ratio', 'יחס', 23], ['avg', 'ממוצע', 24],
    ['eq1', 'משוואות פשוטות', 25], ['ops', 'סדר פעולות', 26], ['pow', 'חזקות', 27], ['eq2', 'משוואות בשני שלבים', 29], ['pyth', 'משפט פיתגורס', 31], ['slope', 'שיפוע ישר', 32],
    ['expand', 'פתיחת סוגריים', 33], ['prob', 'הסתברות', 35], ['quad', 'משוואה ריבועית', 37], ['expo', 'משוואות מעריכיות', 38], ['seq', 'סדרה חשבונית', 39],
    ['log', 'לוגריתמים', 41], ['deriv', 'נגזרת', 42], ['trig', 'טריגונומטריה', 43], ['integ', 'אינטגרל', 45]],
  en: [['words', 'מילים ותמונות', 1], ['listen', 'הקשבה', 1], ['letters', 'אותיות גדולות וקטנות', 3], ['abc', 'סדר האותיות', 5], ['spell', 'כתיבת מילים', 7],
    ['he2en', 'תרגום לאנגלית', 9], ['en2he', 'פירוש מילים', 10], ['plural', 'רבים', 11], ['opp', 'הפכים', 13], ['be', 'am / is / are', 15], ['past', 'עבר רגיל', 17],
    ['irreg', 'פעלים חריגים', 21], ['comp', 'השוואה (bigger)', 23], ['cont', 'הווה מתמשך', 27], ['syn', 'מילים נרדפות', 29], ['read', 'הבנת הנקרא', 31],
    ['cond', 'משפטי תנאי', 37], ['passive', 'סביל', 41], ['vocab', 'אוצר מילים מתקדם', 45]],
  he: [['first', 'אות ראשונה', 1], ['words', 'מילה ותמונה', 1], ['readw', 'קריאת מילים', 1], ['missing', 'אות חסרה', 3], ['sentence', 'השלמת משפט', 5], ['write', 'כתיבת מילים', 6],
    ['plural', 'יחיד ורבים', 9], ['opp', 'הפכים', 11], ['gender', 'זכר ונקבה', 13], ['tense', 'זמנים', 17], ['root', 'שורש', 19], ['syn', 'מילים נרדפות', 21],
    ['conn', 'מילות קישור', 25], ['idiom', 'ניבים וביטויים', 29], ['high', 'מילים גבוהות', 35], ['prov', 'פתגמים', 41]],
};
export const TOPICS = Object.fromEntries(Object.entries(TOPIC_LIST).map(([s, l]) => [s, Object.fromEntries(l.map(([t, n]) => [t, n]))]));

const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
export const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const numOpts = (ans, spread = 3) => { const s = new Set([ans]); let g = 0; while (s.size < 4 && g++ < 200) { const d = R(-spread * 3, spread * 3); if (d && (ans + d >= 0 || ans < 0)) s.add(ans + d); } return shuffle([...s]).map(String); };
const strOpts = (ans, pool) => shuffle([ans, ...shuffle(pool.filter((x) => x !== ans)).slice(0, 3)]);
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const fr = (n, d) => { const g = gcd(n, d); return d / g === 1 ? `${n / g}` : `${n / g}/${d / g}`; };
const fmt = (x) => String(Math.round(x * 100) / 100);
// numeric question helper: choice at low levels, sometimes typing
function num(topic, prompt, ans, help, lvl, extra = {}) {
  const type = lvl <= 6 ? 'choice' : Math.random() < 0.5 ? 'choice' : 'write';
  const a = typeof ans === 'number' ? ans : null;
  return { topic, type, prompt, ltr: /^[\d\s+\-×÷=?().,/x²√^:]+$/.test(prompt), answer: String(ans), options: extra.options || (a != null && Number.isInteger(a) ? numOpts(a, Math.max(1, Math.round(Math.abs(a) / 8))) : extra.pool), help, ...extra };
}

// ------------------------------------------------------------------ math
const OBJ = [['עצמות', '🦴'], ['כדורים', '⚽'], ['עוגיות', '🍪'], ['פרחים', '🌸'], ['כוכבים', '⭐'], ['בלונים', '🎈'], ['מדבקות', '🏷️']];
function mathQ(t, lvl) {
  let a, b, c, ans;
  switch (t) {
    case 'add5': a = R(1, 3); b = R(1, 5 - a); ans = a + b; return num(t, `${a} + ${b} = ?`, ans, [`מתחילים מ־${a}.`, `סופרים עוד ${b}: ${Array.from({ length: b }, (_, i) => a + i + 1).join(', ')}.`, `יצא ${ans}!`], 1);
    case 'add10': a = R(1, 6); b = R(1, 10 - a); ans = a + b; return num(t, `${a} + ${b} = ?`, ans, [`מתחילים מ־${a}.`, `סופרים קדימה ${b}: ${Array.from({ length: b }, (_, i) => a + i + 1).join(', ')}.`, `הגענו ל־${ans}!`], lvl);
    case 'sub10': a = R(3, 10); b = R(1, a - 1); ans = a - b; return num(t, `${a} - ${b} = ?`, ans, [`מתחילים מ־${a}.`, `סופרים אחורה ${b}: ${Array.from({ length: b }, (_, i) => a - i - 1).join(', ')}.`, `נשארנו עם ${ans}!`], lvl);
    case 'cmp': a = R(1, lvl < 4 ? 20 : 99); do { b = R(1, lvl < 4 ? 20 : 99); } while (b === a); return { topic: t, type: 'choice', prompt: 'איזה מספר גדול יותר?', options: shuffle([String(a), String(b)]), answer: String(Math.max(a, b)), ltrOpts: true, help: a > 9 || b > 9 ? ['קודם משווים את העשרות.', 'אם העשרות שוות – משווים את היחידות.', `${Math.max(a, b)} גדול יותר.`] : [`סופרים: מי מגיע מאוחר יותר?`, `${Math.max(a, b)} גדול יותר.`] };
    case 'add20': a = R(4, 12); b = R(2, 20 - a); ans = a + b; return num(t, `${a} + ${b} = ?`, ans, a < 10 && ans > 10 ? [`משלימים ל־10: ${a} + ${10 - a} = 10.`, `נשאר להוסיף ${b - (10 - a)}.`, `10 + ${b - (10 - a)} = ${ans}.`] : [`מתחילים מ־${a} וסופרים ${b} קדימה.`, `${a} + ${b} = ${ans}.`], lvl);
    case 'sub20': a = R(8, 20); b = R(1, Math.min(9, a)); ans = a - b; return num(t, `${a} - ${b} = ?`, ans, [`מתחילים מ־${a}.`, `סופרים אחורה ${b}.`, `${a} - ${b} = ${ans}.`], lvl);
    case 'add100': a = R(1, 6) * 10; b = R(1, 9 - a / 10) * 10; ans = a + b; return num(t, `${a} + ${b} = ?`, ans, [`${a} זה ${a / 10} עשרות, ${b} זה ${b / 10} עשרות.`, `${a / 10} + ${b / 10} = ${a / 10 + b / 10} עשרות.`, `כלומר ${ans}.`], lvl);
    case 'addc': do { a = R(15, 68); b = R(12, 99 - a); } while ((a % 10) + (b % 10) < 10 || a + b > 99); ans = a + b;
      return num(t, `${a} + ${b} = ?`, ans, ['מפרקים לעשרות ויחידות.', `עשרות: ${a - (a % 10)} + ${b - (b % 10)} = ${a - (a % 10) + b - (b % 10)}.`, `יחידות: ${a % 10} + ${b % 10} = ${(a % 10) + (b % 10)}.`, `ביחד: ${ans}.`], lvl);
    case 'subb': do { a = R(31, 95); b = R(12, a - 10); } while ((a % 10) >= (b % 10)); ans = a - b;
      return num(t, `${a} - ${b} = ?`, ans, [`קודם מורידים את העשרות: ${a} - ${b - (b % 10)} = ${a - (b - (b % 10))}.`, `ואז את היחידות: ${a - (b - (b % 10))} - ${b % 10} = ${ans}.`], lvl);
    case 'mul': a = pick([2, 5, 10]); b = R(1, 10); ans = a * b; return num(t, `${a} × ${b} = ?`, ans, [`${a} × ${b} זה ${b} פעמים ${a}.`, `${Array.from({ length: b }, () => a).join(' + ')} = ${ans}.`], lvl);
    case 'multab': a = R(2, 10); b = R(2, 10); ans = a * b; return num(t, `${a} × ${b} = ?`, ans, [`${a} × ${b} זה ${b} קבוצות של ${a}.`, `טריק: ${a} × ${b - 1} = ${a * (b - 1)}, ועוד ${a} = ${ans}.`], lvl);
    case 'div': b = R(2, 10); ans = R(2, 10); a = b * ans; return num(t, `${a} ÷ ${b} = ?`, ans, [`שואלים: ${b} כפול כמה זה ${a}?`, `${b} × ${ans} = ${a}, אז התשובה ${ans}.`], lvl);
    case 'add1000': if (Math.random() < 0.5) { a = R(120, 600); b = R(100, 999 - a); ans = a + b; return num(t, `${a} + ${b} = ?`, ans, ['מחברים מאות, עשרות ויחידות בנפרד.', `${a} + ${b} = ${ans}.`], lvl); }
      a = R(300, 999); b = R(100, a - 50); ans = a - b; return num(t, `${a} - ${b} = ?`, ans, ['מחסרים מאות, עשרות ויחידות. אם חסר – פורטים.', `${a} - ${b} = ${ans}.`], lvl);
    case 'word2': { const [w, e] = pick(OBJ); a = R(3, 9); b = R(2, 8);
      if (Math.random() < 0.5) return num(t, `ב־${a} קופסאות יש ${b} ${w} ${e} בכל אחת. כמה ${w} יש בסך הכול?`, a * b, [`${a} קופסאות כפול ${b} בכל אחת.`, `${a} × ${b} = ${a * b}.`], lvl);
      return num(t, `${a * b} ${w} ${e} מחלקים שווה בשווה ל־${a} ילדים. כמה יקבל כל ילד?`, b, [`מחלקים: ${a * b} ÷ ${a}.`, `${a} × ${b} = ${a * b}, אז כל אחד מקבל ${b}.`], lvl); }
    case 'word': { const [w, e] = pick(OBJ); a = R(3, 12); b = R(2, 9);
      if (Math.random() < 0.45 && a > b) return num(t, `לגור היו ${a} ${w} ${e}. הוא נתן ${b} לחבר. כמה נשארו לו?`, a - b, [`היו ${a}, נתן ${b} – מורידים.`, `${a} - ${b} = ${a - b}.`], lvl);
      return num(t, `לגור היו ${a} ${w} ${e}. הוא קיבל עוד ${b}. כמה יש לו עכשיו?`, a + b, [`היו ${a}, קיבל עוד ${b} – מוסיפים.`, `${a} + ${b} = ${a + b}.`], lvl); }
    case 'mul2d': a = R(12, 49); b = R(2, 9); ans = a * b; return num(t, `${a} × ${b} = ?`, ans, [`מפרקים: ${a} = ${a - (a % 10)} + ${a % 10}.`, `${a - (a % 10)} × ${b} = ${(a - (a % 10)) * b}, ${a % 10} × ${b} = ${(a % 10) * b}.`, `ביחד: ${ans}.`], lvl);
    case 'divr': b = R(3, 9); c = R(3, 9); const r = R(1, b - 1); a = b * c + r; return { topic: t, type: 'choice', prompt: `${a} ÷ ${b} = ?`, ltr: true, answer: `${c} (${r})`, options: shuffle([`${c} (${r})`, `${c + 1} (${r})`, `${c} (${(r + 1) % b || 1})`, `${c - 1} (${r + b > a ? r : r + 1})`]).filter((v, i, s) => s.indexOf(v) === i).concat([]).slice(0, 4), ltrOpts: true, help: [`כמה פעמים ${b} נכנס ב־${a}? ${b} × ${c} = ${b * c}.`, `נשאר: ${a} - ${b * c} = ${r}.`, `התשובה: ${c} ושארית ${r}.`] };
    case 'frac': { const d = pick([2, 3, 4, 5, 10]), n = R(1, d - 1), m = d * R(2, 6); ans = (m / d) * n; return num(t, `כמה זה ${n}/${d} מ־${m}?`, ans, [`קודם מחלקים ל־${d}: ${m} ÷ ${d} = ${m / d}.`, `ואז כפול ${n}: ${m / d} × ${n} = ${ans}.`], lvl); }
    case 'round': { a = R(101, 989); const to = pick([10, 100]); ans = Math.round(a / to) * to; return num(t, `עגלי את ${a} ל${to === 10 ? 'עשרת' : 'מאה'} הקרובה`, ans, [`מסתכלים על הספרה ${to === 10 ? 'של היחידות' : 'של העשרות'}.`, '5 ומעלה – מעגלים למעלה, פחות מ־5 – למטה.', `${a} ← ${ans}.`], lvl); }
    case 'fracadd': { const d = R(3, 9); a = R(1, d - 2); b = R(1, d - a - 1); return { topic: t, type: 'choice', prompt: `${a}/${d} + ${b}/${d} = ?`, ltr: true, answer: `${a + b}/${d}`, options: shuffle([`${a + b}/${d}`, `${a + b}/${2 * d}`, `${a * b}/${d}`, `${Math.abs(a - b) || a + b + 1}/${d}`]).filter((v, i, s) => s.indexOf(v) === i), ltrOpts: true, help: ['כשהמכנה זהה – מחברים רק את המונים.', `${a} + ${b} = ${a + b}, והמכנה נשאר ${d}.`] }; }
    case 'dec': a = R(11, 99) / 10; b = R(11, 99) / 10; ans = Math.round((a + b) * 10) / 10; return num(t, `${a} + ${b} = ?`, ans, ['מסדרים את הנקודה העשרונית אחת מתחת לשנייה.', 'מחברים עשיריות, ואז שלמים.', `${a} + ${b} = ${ans}.`], lvl, { options: shuffle([ans, ans + 1, Math.round((ans - 0.1) * 10) / 10, Math.round((ans + 0.2) * 10) / 10].map(String)) });
    case 'pct': { const p = pick([10, 20, 25, 50, 75]); a = pick([40, 60, 80, 120, 200, 400]); ans = (a * p) / 100; return num(t, `כמה זה ${p}% מ־${a}?`, ans, [`${p}% זה ${p}/100.`, p === 50 ? 'חצי.' : p === 25 ? 'רבע.' : p === 10 ? 'עשירית – מחלקים ב־10.' : `${a} × ${p} ÷ 100.`, `= ${ans}.`], lvl); }
    case 'area': { a = R(3, 12); b = R(2, 9); const per = Math.random() < 0.5; return num(t, `מלבן באורך ${a} וברוחב ${b}. מה ה${per ? 'היקף' : 'שטח'} שלו?`, per ? 2 * (a + b) : a * b, per ? ['היקף = סכום כל הצלעות.', `${a} + ${b} + ${a} + ${b} = ${2 * (a + b)}.`] : ['שטח מלבן = אורך × רוחב.', `${a} × ${b} = ${a * b}.`], lvl); }
    case 'fracdiff': { const [p, q] = pick([[2, 4], [2, 3], [3, 6], [2, 6], [4, 8], [3, 4]]); a = 1; b = 1; const l = (p * q) / gcd(p, q), n = l / p + l / q; ans = fr(n, l);
      return { topic: t, type: 'choice', prompt: `1/${p} + 1/${q} = ?`, ltr: true, answer: ans, options: [...new Set([ans, `2/${p + q}`, fr(n + 1, l), fr(1, l)])].slice(0, 4).sort(() => Math.random() - 0.5), ltrOpts: true, help: [`מכנה משותף: ${l}.`, `1/${p} = ${l / p}/${l}, 1/${q} = ${l / q}/${l}.`, `ביחד: ${n}/${l} = ${ans}.`] }; }
    case 'neg': a = R(-9, 9); b = R(-9, 9); ans = a + b; return num(t, `(${a}) + (${b}) = ?`, ans, ['על ציר המספרים: מתחילים במספר הראשון.', b >= 0 ? `זזים ${b} ימינה.` : `זזים ${-b} שמאלה.`, `מגיעים ל־${ans}.`], lvl);
    case 'ratio': { a = R(1, 5); b = R(1, 5); const k = R(2, 6); return num(t, `היחס בין בנים לבנות הוא ${a}:${b}. יש ${a * k} בנים. כמה בנות?`, b * k, [`${a * k} בנים = ${a} × ${k}.`, `אז הבנות: ${b} × ${k} = ${b * k}.`], lvl); }
    case 'avg': { const xs = Array.from({ length: R(3, 4) }, () => R(2, 20)); while (xs.reduce((x, y) => x + y, 0) % xs.length) xs[0]++; const S2 = xs.reduce((x, y) => x + y, 0);
      return num(t, `מה הממוצע של ${xs.join(', ')}?`, S2 / xs.length, [`מחברים: ${xs.join(' + ')} = ${S2}.`, `מחלקים במספר המספרים (${xs.length}): ${S2 / xs.length}.`], lvl); }
    case 'eq1': if (Math.random() < 0.5) { a = R(2, 30); ans = R(1, 30); return num(t, `x + ${a} = ${ans + a}`, ans, [`מעבירים את ${a} לצד השני: x = ${ans + a} - ${a}.`, `x = ${ans}.`], lvl, { prompt: `x + ${a} = ${ans + a} ,  x = ?` }); }
      a = R(2, 9); ans = R(2, 12); return num(t, `${a}x = ${a * ans} ,  x = ?`, ans, [`מחלקים את שני הצדדים ב־${a}.`, `x = ${a * ans} ÷ ${a} = ${ans}.`], lvl);
    case 'ops': a = R(2, 9); b = R(2, 9); c = R(2, 9); ans = a + b * c; return num(t, `${a} + ${b} × ${c} = ?`, ans, ['קודם כפל, אחר כך חיבור.', `${b} × ${c} = ${b * c}.`, `${a} + ${b * c} = ${ans}.`], lvl, { options: shuffle([...new Set([ans, (a + b) * c, ans + 1, ans - 2])].map(String)) });
    case 'pow': a = R(2, 5); b = R(2, a < 4 ? 4 : 3); ans = a ** b; return num(t, `${a}^${b} = ?`, ans, [`${a}^${b} זה ${a} כפול עצמו ${b} פעמים.`, `${Array(b).fill(a).join(' × ')} = ${ans}.`], lvl, { options: shuffle([...new Set([ans, a * b, ans + a, a ** (b - 1)])].map(String)) });
    case 'eq2': a = R(2, 9); ans = R(-6, 12); b = R(1, 20); return num(t, `${a}x + ${b} = ${a * ans + b} ,  x = ?`, ans, [`מחסרים ${b} משני הצדדים: ${a}x = ${a * ans}.`, `מחלקים ב־${a}: x = ${ans}.`], lvl);
    case 'pyth': { const [p, q, h] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17]]); return num(t, `במשולש ישר־זווית הניצבים ${p} ו־${q}. מה היתר?`, h, ['פיתגורס: a² + b² = c².', `${p}² + ${q}² = ${p * p} + ${q * q} = ${h * h}.`, `c = √${h * h} = ${h}.`], lvl); }
    case 'slope': { const x1 = R(-3, 3), m = R(-4, 5) || 2, dx = R(1, 4), y1 = R(-5, 5); return num(t, `מה השיפוע של הישר דרך (${x1},${y1}) ו־(${x1 + dx},${y1 + m * dx})?`, m, ['שיפוע = Δy ÷ Δx.', `Δy = ${m * dx}, Δx = ${dx}.`, `m = ${m}.`], lvl); }
    case 'expand': a = R(1, 7); b = R(-6, 7) || 3; return { topic: t, type: 'choice', prompt: `(x + ${a})(x ${b < 0 ? '-' : '+'} ${Math.abs(b)}) = ?`, ltr: true, answer: tri(a + b, a * b), options: shuffle([...new Set([tri(a + b, a * b), tri(a * b, a + b), tri(a - b, a * b), tri(a + b, a + b)])]), ltrOpts: true, help: ['כופלים כל איבר בכל איבר.', `x·x = x², x·${b} + ${a}·x = ${a + b}x, ${a}·${b} = ${a * b}.`, `= ${tri(a + b, a * b)}.`] };
    case 'prob': { const n = pick([6, 8, 10, 12]), k = R(1, n - 1); return { topic: t, type: 'choice', prompt: `בשקית ${n} כדורים, ${k} מהם אדומים. מה ההסתברות להוציא כדור אדום?`, answer: fr(k, n), options: [...new Set([fr(k, n), fr(n - k, n), fr(1, n), fr(k, n + k)])].sort(() => Math.random() - 0.5), ltrOpts: true, help: ['הסתברות = מקרים רצויים ÷ כל המקרים.', `${k} ÷ ${n} = ${fr(k, n)}.`] }; }
    case 'quad': { const r1 = R(-6, 6), r2 = R(-6, 6), B = -(r1 + r2), C = r1 * r2, roots = [...new Set([r1, r2])].sort((x, y) => x - y).join(', ');
      return { topic: t, type: 'choice', prompt: `x² ${B < 0 ? '-' : '+'} ${Math.abs(B)}x ${C < 0 ? '-' : '+'} ${Math.abs(C)} = 0`, ltr: true, answer: `x = ${roots}`, options: [...new Set([`x = ${roots}`, `x = ${[-r1, -r2].sort((x, y) => x - y).join(', ')}`, `x = ${[r1 + 1, r2].sort((x, y) => x - y).join(', ')}`, `x = ${[r1, r2 - 2].sort((x, y) => x - y).join(', ')}`])].sort(() => Math.random() - 0.5), ltrOpts: true,
        help: ['מחפשים שני מספרים שסכומם ' + (-B) + ' ומכפלתם ' + C + '.', `אלה ${r1} ו־${r2}.`, `הפתרונות: ${roots}.`] }; }
    case 'expo': a = pick([2, 3, 5]); b = R(2, a === 2 ? 6 : 4); return num(t, `${a}^x = ${a ** b} ,  x = ?`, b, [`כותבים את ${a ** b} כחזקה של ${a}.`, `${a ** b} = ${a}^${b}, אז x = ${b}.`], lvl);
    case 'seq': a = R(1, 10); b = R(2, 7); c = R(5, 15); return num(t, `סדרה: ${a}, ${a + b}, ${a + 2 * b}, … מה האיבר ה־${c}?`, a + (c - 1) * b, ['איבר n = a₁ + (n−1)·d.', `a₁ = ${a}, d = ${b}.`, `${a} + ${c - 1}·${b} = ${a + (c - 1) * b}.`], lvl);
    case 'log': a = pick([2, 3, 10]); b = R(1, a === 10 ? 4 : 5); return num(t, `log${sub(a)}(${a ** b}) = ?`, b, [`שואלים: ${a} בחזקת כמה שווה ${a ** b}?`, `${a}^${b} = ${a ** b}, אז התשובה ${b}.`], lvl);
    case 'deriv': { a = R(1, 6); const n = R(2, 4); c = R(-3, 3) || 1; ans = a * n * c ** (n - 1); return num(t, `f(x) = ${a}x^${n} ,  f'(${c}) = ?`, ans, ['נגזרת של axⁿ היא a·n·xⁿ⁻¹.', `f'(x) = ${a * n}x^${n - 1}.`, `f'(${c}) = ${a * n}·${c}^${n - 1} = ${ans}.`], lvl); }
    case 'trig': { const [q, A] = pick([['sin 30°', '1/2'], ['cos 60°', '1/2'], ['sin 90°', '1'], ['cos 0°', '1'], ['tan 45°', '1'], ['sin 0°', '0'], ['cos 90°', '0'], ['sin 60°', '√3/2'], ['cos 30°', '√3/2']]);
      return { topic: t, type: 'choice', prompt: `${q} = ?`, ltr: true, answer: A, options: shuffle(['1/2', '1', '0', '√3/2']), ltrOpts: true, help: ['זוויות מיוחדות כדאי לזכור:', 'sin 30° = cos 60° = 1/2, sin 90° = 1, tan 45° = 1, sin 60° = √3/2.'] }; }
    case 'integ': { a = R(1, 4) * 3; const top = R(1, 3); ans = (a / 3) * top ** 3; return num(t, `∫₀^${top} ${a}x² dx = ?`, ans, ['∫ax² dx = a·x³/3.', `${a}·x³/3 = ${a / 3}x³.`, `מציבים ${top}: ${a / 3}·${top ** 3} = ${ans}.`], lvl); }
  }
}
const tri = (b, c) => `x² ${b < 0 ? '-' : '+'} ${Math.abs(b)}x ${c < 0 ? '-' : '+'} ${Math.abs(c)}`;
const sub = (n) => String(n).split('').map((d) => '₀₁₂₃₄₅₆₇₈₉'[d]).join('');

// ------------------------------------------------------------------ English
const EN = [['dog', '🐶', 'כלב'], ['cat', '🐱', 'חתול'], ['sun', '☀️', 'שמש'], ['ball', '⚽', 'כדור'], ['apple', '🍎', 'תפוח'], ['fish', '🐟', 'דג'], ['car', '🚗', 'מכונית'],
  ['book', '📖', 'ספר'], ['tree', '🌳', 'עץ'], ['house', '🏠', 'בית'], ['star', '⭐', 'כוכב'], ['bird', '🐦', 'ציפור'], ['cake', '🎂', 'עוגה'], ['moon', '🌙', 'ירח'],
  ['egg', '🥚', 'ביצה'], ['hat', '🎩', 'כובע'], ['bed', '🛏️', 'מיטה'], ['cup', '☕', 'כוס'], ['pen', '🖊️', 'עט'], ['milk', '🥛', 'חלב'], ['bus', '🚌', 'אוטובוס'], ['bee', '🐝', 'דבורה']];
const VOC = [['big', 'גדול'], ['small', 'קטן'], ['happy', 'שמח'], ['sad', 'עצוב'], ['run', 'לרוץ'], ['eat', 'לאכול'], ['school', 'בית ספר'], ['friend', 'חבר'], ['water', 'מים'],
  ['red', 'אדום'], ['green', 'ירוק'], ['blue', 'כחול'], ['door', 'דלת'], ['window', 'חלון'], ['family', 'משפחה'], ['teacher', 'מורה'], ['city', 'עיר'], ['sea', 'ים'], ['day', 'יום'],
  ['night', 'לילה'], ['fast', 'מהיר'], ['slow', 'איטי'], ['hot', 'חם'], ['cold', 'קר'], ['new', 'חדש'], ['old', 'ישן'], ['open', 'לפתוח'], ['close', 'לסגור'], ['buy', 'לקנות'], ['write', 'לכתוב']];
const OPP = [['big', 'small'], ['hot', 'cold'], ['happy', 'sad'], ['fast', 'slow'], ['open', 'close'], ['up', 'down'], ['day', 'night'], ['old', 'new'], ['tall', 'short'], ['full', 'empty'], ['early', 'late'], ['strong', 'weak']];
const PLUR = [['cat', 'cats'], ['box', 'boxes'], ['baby', 'babies'], ['child', 'children'], ['man', 'men'], ['foot', 'feet'], ['mouse', 'mice'], ['bus', 'buses'], ['city', 'cities'], ['tooth', 'teeth'], ['leaf', 'leaves'], ['dog', 'dogs']];
const PAST = [['play', 'played'], ['jump', 'jumped'], ['walk', 'walked'], ['cook', 'cooked'], ['clean', 'cleaned'], ['help', 'helped'], ['open', 'opened'], ['watch', 'watched']];
const IRR = [['go', 'went'], ['eat', 'ate'], ['see', 'saw'], ['take', 'took'], ['write', 'wrote'], ['buy', 'bought'], ['come', 'came'], ['run', 'ran'], ['drink', 'drank'], ['give', 'gave'], ['make', 'made'], ['swim', 'swam'], ['think', 'thought'], ['catch', 'caught']];
const COMP = [['big', 'bigger'], ['small', 'smaller'], ['tall', 'taller'], ['happy', 'happier'], ['good', 'better'], ['bad', 'worse'], ['hot', 'hotter'], ['fast', 'faster'], ['beautiful', 'more beautiful']];
const SYN = [['big', 'large'], ['happy', 'glad'], ['begin', 'start'], ['quick', 'fast'], ['smart', 'clever'], ['little', 'small'], ['look', 'see'], ['angry', 'mad'], ['finish', 'end'], ['gift', 'present']];
const ADV = [['enormous', 'ענק'], ['ancient', 'עתיק'], ['improve', 'לשפר'], ['achieve', 'להשיג'], ['reluctant', 'מסויג'], ['significant', 'משמעותי'], ['efficient', 'יעיל'], ['obvious', 'ברור מאליו'], ['curious', 'סקרן'], ['generous', 'נדיב'], ['brave', 'אמיץ'], ['scarce', 'נדיר']];
const NAMES = ['Tom', 'Dana', 'Sam', 'Noa', 'Ben', 'Maya'];
function enQ(t, lvl) {
  const short = EN.filter((w) => w[0].length <= (lvl < 4 ? 3 : 5));
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  switch (t) {
    case 'words': { const w = pick(short), o = shuffle(EN.filter((x) => x !== w)).slice(0, 3);
      if (lvl >= 3 && Math.random() < 0.3) return { topic: t, type: 'match', prompt: 'התאימי כל מילה לתמונה', pairs: shuffle([w, ...o.slice(0, 2)]).map((x) => [x[0], x[1]]), answer: 'match', help: ['קראי כל מילה לאט.', ...[w, ...o.slice(0, 2)].map((x) => `${x[0]} = ${x[1]} ${x[2]}`)] };
      return { topic: t, type: 'choice', prompt: 'איזו מילה מתאימה לתמונה?', emoji: w[1], answer: w[0], options: shuffle([w, ...o].map((x) => x[0])), ltrOpts: true, help: [`בתמונה יש ${w[2]}.`, `${w[2]} באנגלית זה ${w[0]}.`] }; }
    case 'listen': { const w = pick(short), o = shuffle(EN.filter((x) => x !== w)).slice(0, 3);
      return { topic: t, type: 'choice', prompt: 'הקשיבי ובחרי את התמונה', speak: { text: w[0], lang: 'en-US' }, answer: w[1], options: shuffle([w, ...o].map((x) => x[1])), emojiOpts: true, help: [`המילה הייתה ${w[0]}.`, `${w[0]} זה ${w[2]} ${w[1]}.`] }; }
    case 'letters': { const L = pick(ABC); return { topic: t, type: 'choice', prompt: `איזו אות קטנה מתאימה ל־${L}?`, big: L, answer: L.toLowerCase(), options: shuffle([L, ...shuffle(ABC.split('').filter((c) => c !== L)).slice(0, 3)].map((c) => c.toLowerCase())), ltrOpts: true, help: [`האות הגדולה ${L}.`, `האות הקטנה שלה: ${L.toLowerCase()}.`] }; }
    case 'abc': { const i = R(0, 22), s = ABC.slice(i, i + 3); return { topic: t, type: 'choice', prompt: 'איזו אות באה אחרי?', big: `${s[0]} ${s[1]} ?`, answer: s[2], options: strOpts(s[2], ABC.split('')), ltrOpts: true, help: [`סדר האותיות: …${s[0]}, ${s[1]}, ${s[2]}…`] }; }
    case 'spell': { const w = pick(short);
      if (Math.random() < 0.5) return { topic: t, type: 'order', prompt: `סדרי את האותיות: ${w[1]}`, letters: shuffle(w[0].split('')), answer: w[0], ltr: true, help: [`${w[1]} זה ${w[2]}.`, `באנגלית: ${w[0].split('').join(' - ')}.`] };
      return { topic: t, type: 'write', prompt: `כתבי באנגלית: ${w[2]} ${w[1]}`, answer: w[0], ltr: true, help: [`${w[2]} באנגלית זה ${w[0]}.`, `האותיות: ${w[0].toUpperCase().split('').join(' - ')}.`] }; }
    case 'he2en': { const [e, h] = pick(VOC); return Math.random() < 0.6 || lvl < 12 ? { topic: t, type: 'choice', prompt: `איך אומרים "${h}" באנגלית?`, answer: e, options: strOpts(e, VOC.map((x) => x[0])), ltrOpts: true, help: [`"${h}" באנגלית: ${e}.`] } : { topic: t, type: 'write', prompt: `כתבי באנגלית: "${h}"`, answer: e, ltr: true, help: [`המילה מתחילה ב־${e[0]}.`, `"${h}" = ${e}.`] }; }
    case 'en2he': { const [e, h] = pick(VOC); return { topic: t, type: 'choice', prompt: 'מה הפירוש?', big: e, answer: h, options: strOpts(h, VOC.map((x) => x[1])), help: [`${e} = ${h}.`] }; }
    case 'plural': { const [s, p] = pick(PLUR); return { topic: t, type: 'choice', prompt: 'מה הרבים של המילה?', big: s, answer: p, options: shuffle([...new Set([p, s + 's', s + 'es', s.replace(/y$/, 'ies')])]).slice(0, 4).concat([]).filter((v, i, a) => a.indexOf(v) === i), ltrOpts: true, help: ['רוב המילים: מוסיפים s.', 'מילים שנגמרות ב־x/s/ch: es. ב־y: ies. ויש חריגים!', `${s} → ${p}.`] }; }
    case 'opp': { const [a, b] = pick(OPP), [x, y] = Math.random() < 0.5 ? [a, b] : [b, a]; return { topic: t, type: 'choice', prompt: 'מה ההפך?', big: x, answer: y, options: strOpts(y, OPP.flat()), ltrOpts: true, help: [`ההפך של ${x} הוא ${y}.`] }; }
    case 'be': { const [subj, v] = pick([['I', 'am'], ['He', 'is'], ['She', 'is'], ['It', 'is'], ['We', 'are'], ['They', 'are'], ['You', 'are']]); const end = pick(['happy', 'at school', 'my friend', 'tall', 'in the park']);
      return { topic: t, type: 'choice', prompt: 'מה חסר?', big: `${subj} ___ ${end}.`, answer: v, options: shuffle(['am', 'is', 'are', 'be']), ltrOpts: true, help: ['I → am. He / She / It → is. We / You / They → are.', `${subj} ${v} ${end}.`] }; }
    case 'past': { const [p, d] = pick(PAST), n = pick(NAMES); return { topic: t, type: 'choice', prompt: 'מה חסר? (אתמול)', big: `Yesterday ${n} ___ .`, answer: d, options: shuffle([d, p, p + 's', p + 'ing']), ltrOpts: true, help: ['בעבר רגיל מוסיפים ed לפועל.', `${p} → ${d}.`] }; }
    case 'irreg': { const [p, d] = pick(IRR); return Math.random() < 0.6 ? { topic: t, type: 'choice', prompt: 'מה צורת העבר?', big: p, answer: d, options: strOpts(d, IRR.map((x) => x[1]).concat([p + 'ed'])), ltrOpts: true, help: ['זה פועל חריג – צריך לזכור אותו.', `${p} → ${d}.`] } : { topic: t, type: 'write', prompt: `כתבי את צורת העבר של: ${p}`, answer: d, ltr: true, help: [`${p} → ${d}.`] }; }
    case 'comp': { const [a, b] = pick(COMP); return { topic: t, type: 'choice', prompt: 'השלימי:', big: `A whale is ___ than a fish. (${a})`, answer: b, options: shuffle([...new Set([b, a + 'er', 'more ' + a, a + 'est'])]).filter((v, i, s) => s.indexOf(v) === i), ltrOpts: true, help: ['מילה קצרה: er. מילה ארוכה: more. ויש חריגים (good → better).', `${a} → ${b}.`] }; }
    case 'cont': { const v = pick(['play', 'read', 'swim', 'eat', 'write', 'run']), ing = v === 'swim' ? 'swimming' : v === 'run' ? 'running' : v === 'write' ? 'writing' : v + 'ing', s = pick([['I', 'am'], ['She', 'is'], ['They', 'are']]);
      return { topic: t, type: 'choice', prompt: 'מה חסר? (עכשיו)', big: `${s[0]} ___ now.`, answer: `${s[1]} ${ing}`, options: shuffle([`${s[1]} ${ing}`, `${s[1]} ${v}`, ing, `${s[1]} ${v}ed`]), ltrOpts: true, help: ['הווה מתמשך: am/is/are + פועל עם ing.', `${s[0]} ${s[1]} ${ing} now.`] }; }
    case 'syn': { const [a, b] = pick(SYN); return { topic: t, type: 'choice', prompt: 'איזו מילה דומה במשמעות?', big: a, answer: b, options: strOpts(b, SYN.map((x) => x[1]).concat(['slow', 'sad', 'stop'])), ltrOpts: true, help: [`${a} ו־${b} – כמעט אותה משמעות.`] }; }
    case 'read': { const n = pick(NAMES), k = R(2, 6), [an] = pick([['dogs'], ['cats'], ['books'], ['balls']]), place = pick(['park', 'school', 'beach']);
      const qs = [[`How many ${an} does ${n} have?`, String(k), [String(k + 1), String(k - 1), String(k + 2)]], [`Where does ${n} go on Monday?`, `to the ${place}`, ['to the moon', 'to the shop', 'home'].filter((x) => x !== `to the ${place}`)]];
      const [q, a, o] = pick(qs); return { topic: t, type: 'choice', prompt: `${n} has ${k} ${an}. On Monday ${n} goes to the ${place}.`, big: q, answer: a, options: shuffle([a, ...o.slice(0, 3)]), ltrOpts: true, ltrPrompt: true, help: ['קוראים את הקטע שוב ומחפשים את המילה מהשאלה.', `התשובה: ${a}.`] }; }
    case 'cond': { const [c, r, f] = pick([['it rains', 'take', 'an umbrella'], ['I study', 'pass', 'the test'], ['you heat ice', 'melt', 'it'], ['we hurry', 'catch', 'the bus']]);
      return { topic: t, type: 'choice', prompt: 'השלימי (תנאי ראשון):', big: `If ${c}, I ___ ${f}.`, answer: `will ${r}`, options: shuffle([`will ${r}`, `would ${r}`, `${r}ed`, `am ${r}`]), ltrOpts: true, help: ['תנאי ראשון: If + הווה, will + פועל.', `If ${c}, I will ${r} ${f}.`] }; }
    case 'passive': { const [act, pas] = pick([['The cat eats the fish.', 'The fish is eaten by the cat.'], ['Tom writes a letter.', 'A letter is written by Tom.'], ['They built the house.', 'The house was built by them.'], ['Maya opened the door.', 'The door was opened by Maya.']]);
      return { topic: t, type: 'choice', prompt: 'מה המשפט בסביל?', big: act, answer: pas, options: shuffle([pas, act.replace('.', ' by.'), pas.replace(/is|was/, 'has'), pas.replace(' by', '')]), ltrOpts: true, help: ['סביל: המושא עובר להתחלה + be + פועל בצורת V3 + by.', pas] }; }
    case 'vocab': { const [e, h] = pick(ADV); return { topic: t, type: 'choice', prompt: 'מה הפירוש?', big: e, answer: h, options: strOpts(h, ADV.map((x) => x[1])), help: [`${e} = ${h}.`] }; }
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
const READ2 = ['בבוקר הלכנו לגן החיות וראינו פיל ענק', 'הספרייה בעיר פתוחה עד שעה מאוחרת', 'המדען בדק את התוצאות בזהירות רבה', 'החורף השנה היה קר וגשום במיוחד', 'הם החליטו לצאת לטיול בצפון הארץ'];
const HPL = [['ילד', 'ילדים'], ['ילדה', 'ילדות'], ['ספר', 'ספרים'], ['עיפרון', 'עפרונות'], ['שולחן', 'שולחנות'], ['אישה', 'נשים'], ['עיר', 'ערים'], ['ציפור', 'ציפורים'], ['חלון', 'חלונות'], ['ביצה', 'ביצים'], ['איש', 'אנשים'], ['יום', 'ימים']];
const HOPP = [['גדול', 'קטן'], ['חם', 'קר'], ['שמח', 'עצוב'], ['מהר', 'לאט'], ['למעלה', 'למטה'], ['יום', 'לילה'], ['חדש', 'ישן'], ['גבוה', 'נמוך'], ['מלא', 'ריק'], ['קל', 'כבד'], ['פתוח', 'סגור'], ['רחוק', 'קרוב']];
const HGEN = [['הילד', 'שמח', 'שמחה'], ['הילדה', 'שמחה', 'שמח'], ['הכלבה', 'קטנה', 'קטן'], ['הכלב', 'גדול', 'גדולה'], ['המורה (היא)', 'נחמדה', 'נחמד'], ['התלמידים', 'חכמים', 'חכמות'], ['הבנות', 'רצות', 'רצים']];
const HTENSE = [['אכלתי', 'עבר'], ['אוכל', 'הווה'], ['אוכל מחר', 'עתיד'], ['כתבנו', 'עבר'], ['נכתוב', 'עתיד'], ['כותבת', 'הווה'], ['שיחקו', 'עבר'], ['משחקים', 'הווה'], ['ישחקו', 'עתיד'], ['רצתי', 'עבר'], ['ארוץ', 'עתיד']];
const HROOT = [['כותבים', 'כ-ת-ב'], ['מכתב', 'כ-ת-ב'], ['שמירה', 'ש-מ-ר'], ['לומדת', 'ל-מ-ד'], ['תלמיד', 'ל-מ-ד'], ['משחק', 'ש-ח-ק'], ['אכילה', 'א-כ-ל'], ['מסגרת', 'ס-ג-ר'], ['הליכה', 'ה-ל-כ'], ['ספרייה', 'ס-פ-ר']];
const HSYN = [['שמח', 'עליז'], ['מהיר', 'זריז'], ['גדול', 'ענק'], ['יפה', 'נאה'], ['להתחיל', 'לפתוח'], ['חכם', 'נבון'], ['פחד', 'חשש'], ['מתנה', 'שי'], ['לרוץ', 'לדהור'], ['רעש', 'המולה']];
const HCONN = [['ירד גשם, ___ לקחתי מטרייה', 'לכן'], ['רציתי לצאת, ___ היה מאוחר', 'אבל'], ['למדתי הרבה, ___ קיבלתי ציון טוב', 'ולכן'], ['נשארנו בבית ___ ירד שלג', 'כי'], ['___ שהיה קשה, הוא לא ויתר', 'אף על פי'], ['אכלנו ארוחת ערב ___ הלכנו לישון', 'ואחר כך']];
const HIDIOM = [['לשבור את הראש', 'לחשוב קשה'], ['יד רוחצת יד', 'עוזרים זה לזה'], ['על קצה המזלג', 'בקצרה'], ['לעמוד על רגליו', 'להיות עצמאי'], ['לב זהב', 'אדם טוב מאוד'], ['לשים לב', 'להתרכז / להבחין'], ['בין הפטיש לסדן', 'במצב קשה בין שני לחצים'], ['להוריד את הכובע', 'להעריך מאוד']];
const HHIGH = [['רבתי', 'גדול / מרכזי'], ['נחרץ', 'החלטי'], ['עגום', 'עצוב'], ['מתון', 'לא קיצוני'], ['להפציר', 'לבקש מאוד'], ['מופלג', 'רב מאוד'], ['להתמהמה', 'לאחר / להתעכב'], ['ארעי', 'זמני']];
const HPROV = [['אל תדון את חברך עד שתגיע למקומו', 'לא לשפוט אחרים בלי להבין את מצבם'], ['מעט מן האור דוחה הרבה מן החושך', 'גם מעשה טוב קטן משנה הרבה'], ['אם אין אני לי – מי לי', 'צריך לקחת אחריות על עצמך'], ['לא הביישן למד', 'צריך לשאול כדי ללמוד'], ['כל ההתחלות קשות', 'בהתחלה זה קשה ואחר כך קל יותר']];
function heQ(t, lvl) {
  const easy = HE.filter((w) => w[0].length <= (lvl < 2 ? 3 : lvl < 4 ? 4 : 5));
  const ch = (prompt, answer, pool, help, extra = {}) => ({ topic: t, type: 'choice', prompt, answer, options: strOpts(answer, pool), help, ...extra });
  switch (t) {
    case 'first': { const w = pick(easy), L = w[0][0]; return ch('באיזו אות מתחילה המילה?', L, LETTERS.split(''), [`המילה היא "${w[0]}".`, `אומרים לאט: ${w[0]}… הצליל הראשון הוא ${L}.`], { emoji: w[1] }); }
    case 'missing': { const w = pick(easy.filter((x) => x[0].length >= 3)), i = R(0, w[0].length - 1), L = w[0][i], shown = w[0].slice(0, i) + '_' + w[0].slice(i + 1);
      if (lvl >= 4 && Math.random() < 0.5) return { topic: t, type: 'write', prompt: `השלימי את האות החסרה: ${shown} ${w[1]}`, answer: L, help: [`המילה היא "${w[0]}".`, `האות החסרה היא ${L}.`] };
      return ch('איזו אות חסרה?', L, LETTERS.split(''), [`המילה היא "${w[0]}".`, `האות החסרה היא ${L}.`], { big: `${shown} ${w[1]}` }); }
    case 'words': { const w = pick(easy), o = shuffle(HE.filter((x) => x !== w)).slice(0, 3);
      if (lvl >= 2 && Math.random() < 0.3) return { topic: t, type: 'match', prompt: 'התאימי כל מילה לתמונה', pairs: shuffle([w, ...o.slice(0, 2)]).map((x) => [x[0], x[1]]), answer: 'match', help: ['קראי כל מילה לאט ומצאי את התמונה שלה.'] };
      return { topic: t, type: 'choice', prompt: 'איזו מילה מתאימה לתמונה?', emoji: w[1], answer: w[0], options: shuffle([w, ...o].map((x) => x[0])), help: [`בתמונה רואים ${w[1]}.`, `זו המילה "${w[0]}".`] }; }
    case 'readw': { const s = lvl < 3 ? pick(easy)[0] : lvl < 12 ? pick(READ) : pick(READ2); return { topic: t, type: 'read', prompt: 'קראי בקול:', big: s, answer: s, help: ['קוראים לאט, מילה אחרי מילה.', `"${s}"`] }; }
    case 'sentence': { const [s, a, o] = pick(SENT); return { topic: t, type: 'choice', prompt: 'איזו מילה חסרה?', big: s, answer: a, options: shuffle([a, ...o]), help: ['קוראים את המשפט עם כל מילה ובודקים מה נשמע נכון.', `"${s.replace('___', a)}".`] }; }
    case 'write': { const w = pick(easy); return { topic: t, type: 'write', prompt: 'כתבי את המילה של התמונה', emoji: w[1], answer: w[0], help: [`המילה מתחילה ב־${w[0][0]}.`, `המילה היא "${w[0]}".`] }; }
    case 'plural': { const [s, p] = pick(HPL); return lvl >= 12 && Math.random() < 0.4 ? { topic: t, type: 'write', prompt: `כתבי ברבים: ${s}`, answer: p, help: [`${s} ← ${p}.`] } : ch('מה הרבים?', p, HPL.map((x) => x[1]).concat([s + 'ים', s + 'ות']), ['ברוב המילים מוסיפים ים או ות – אבל יש יוצאים מן הכלל.', `${s} ← ${p}.`], { big: s }); }
    case 'opp': { const [a, b] = pick(HOPP), [x, y] = Math.random() < 0.5 ? [a, b] : [b, a]; return ch('מה ההפך?', y, HOPP.flat(), [`ההפך של "${x}" הוא "${y}".`], { big: x }); }
    case 'gender': { const [n, a, w] = pick(HGEN); return { topic: t, type: 'choice', prompt: 'איזו מילה מתאימה?', big: `${n} ___`, answer: a, options: shuffle([a, w]), help: ['שם עצם ותואר צריכים להתאים: זכר עם זכר, נקבה עם נקבה, רבים עם רבים.', `${n} ${a}.`] }; }
    case 'tense': { const [w, a] = pick(HTENSE); return { topic: t, type: 'choice', prompt: 'באיזה זמן הפועל?', big: w, answer: a, options: shuffle(['עבר', 'הווה', 'עתיד']), help: ['עבר – כבר קרה. הווה – קורה עכשיו. עתיד – יקרה.', `"${w}" – ${a}.`] }; }
    case 'root': { const [w, r] = pick(HROOT); return ch('מה השורש?', r, HROOT.map((x) => x[1]).concat(['כ-ב-ת', 'מ-ש-ק']), ['מורידים תוספות (מ, ת, ים, ות, ה…) ומחפשים 3 אותיות שחוזרות במשפחת המילים.', `${w} ← ${r}.`], { big: w }); }
    case 'syn': { const [a, b] = pick(HSYN); return ch('איזו מילה דומה במשמעות?', b, HSYN.map((x) => x[1]).concat(['עצוב', 'איטי']), [`"${a}" ו"${b}" – כמעט אותה משמעות.`], { big: a }); }
    case 'conn': { const [s, a] = pick(HCONN); return ch('איזו מילת קישור מתאימה?', a, HCONN.map((x) => x[1]), ['שואלים: מה הקשר בין שני חלקי המשפט – סיבה, תוצאה, ניגוד או זמן?', `"${s.replace('___', a)}".`], { big: s }); }
    case 'idiom': { const [i, m] = pick(HIDIOM); return ch('מה פירוש הביטוי?', m, HIDIOM.map((x) => x[1]), [`"${i}" פירושו: ${m}.`], { big: i }); }
    case 'high': { const [i, m] = pick(HHIGH); return ch('מה פירוש המילה?', m, HHIGH.map((x) => x[1]), [`"${i}" = ${m}.`], { big: i }); }
    case 'prov': { const [i, m] = pick(HPROV); return ch('מה פירוש הפתגם?', m, HPROV.map((x) => x[1]), [`"${i}" – ${m}.`], { big: i }); }
  }
}

export function makeQ(subj, topic, lvl) {
  const q = (subj === 'math' ? mathQ : subj === 'en' ? enQ : heQ)(topic, lvl);
  if (q.options) q.options = [...new Set(q.options)];
  if (q.options && !q.options.includes(q.answer)) q.options[0] = q.answer, (q.options = shuffle(q.options));
  return q;
}

// ------------------------------------------------------------------ short stories (read line by line, then questions)
export const STORIES = [
  { title: 'הגור והעצם', lines: ['לגור קוראים מוקה.', 'מוקה אוהב עצמות.', 'יום אחד מוקה מצא עצם גדולה.', 'הוא נתן חצי לחבר שלו.', 'עכשיו שניהם שמחים.'],
    qs: [['איך קוראים לגור?', 'מוקה', ['רקס', 'לולו', 'בובי']], ['מה מוקה מצא?', 'עצם גדולה', ['כדור', 'עוגה', 'נעל']], ['מה מוקה עשה עם העצם?', 'נתן חצי לחבר', ['אכל הכול', 'זרק אותה', 'הסתיר אותה']]] },
  { title: 'גור בגשם', lines: ['בחוץ יורד גשם.', 'הגור לולו רוצה לשחק.', 'אמא שמה לו מעיל סגול.', 'לולו קופץ בשלוליות.', 'אחר כך הוא ישן חם במיטה.'],
    qs: [['מה יורד בחוץ?', 'גשם', ['שלג', 'עלים', 'כדורים']], ['איזה צבע המעיל?', 'סגול', ['אדום', 'ירוק', 'צהוב']], ['איפה לולו ישן?', 'במיטה', ['בגינה', 'באוטו', 'בשלולית']]] },
  { title: 'יום הולדת לגור', lines: ['היום יום הולדת לגור בובי.', 'כל החברים באו.', 'הייתה עוגה עם נר אחד.', 'בובי קיבל כדור חדש.', 'זה היה יום שמח מאוד.'],
    qs: [['למי יום הולדת?', 'לבובי', ['למוקה', 'ללולו', 'לחתול']], ['כמה נרות היו על העוגה?', 'אחד', ['שניים', 'חמישה', 'אף אחד']], ['מה בובי קיבל?', 'כדור חדש', ['עצם', 'מעיל', 'ספר']]] },
];
