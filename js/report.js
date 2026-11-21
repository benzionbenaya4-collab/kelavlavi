// Bar chart per subject (shared by the app and dad.html). Colours: Hebrew green, Math blue, English purple.
export function drawChart(cv, R) {
  const d = Math.min(2, devicePixelRatio || 1), r = cv.getBoundingClientRect(); cv.width = r.width * d; cv.height = r.height * d;
  const g = cv.getContext('2d'), W = cv.width, H = cv.height, css = getComputedStyle(document.documentElement);
  const bars = [['he', 'עברית', css.getPropertyValue('--he') || '#2fbf71'], ['math', 'מתמטיקה', css.getPropertyValue('--math') || '#3d8bff'], ['en', 'אנגלית', css.getPropertyValue('--en') || '#9b5cff']];
  const top = 26 * d, bottom = H - 34 * d, left = 40 * d, right = W - 12 * d, bw = (right - left) / 3;
  g.clearRect(0, 0, W, H); g.font = `${12 * d}px Varela Round, Rubik, sans-serif`; g.fillStyle = '#7d68a3'; g.textAlign = 'right'; g.strokeStyle = '#eadcff'; g.lineWidth = d;
  for (const p of [0, 25, 50, 75, 100]) { const y = bottom - (bottom - top) * p / 100; g.beginPath(); g.moveTo(left, y); g.lineTo(right, y); g.stroke(); g.fillText(p + '%', left - 6 * d, y + 4 * d); }
  bars.forEach(([k, name, col], i) => {
    const a = R[k].acc, x = left + bw * i + bw * 0.2, w = bw * 0.6;
    g.textAlign = 'center'; g.fillStyle = '#3b1f66'; g.font = `bold ${14 * d}px Varela Round, Rubik, sans-serif`; g.fillText(name, x + w / 2, H - 10 * d);
    if (a == null) { g.fillStyle = '#b9a9d6'; g.font = `${12 * d}px Varela Round, sans-serif`; g.fillText('אין נתונים', x + w / 2, bottom - 8 * d); return; }
    const y = bottom - (bottom - top) * a; g.fillStyle = col.trim(); g.beginPath(); g.roundRect(x, y, w, bottom - y, [10 * d, 10 * d, 0, 0]); g.fill();
    g.fillStyle = '#3b1f66'; g.fillText(Math.round(a * 100) + '%', x + w / 2, y - 8 * d);
  });
}
