// כלבלבי – works offline after the first visit. Newest files first, saved copy when offline.
const CACHE = 'klv-v1';
const SHELL = ['./', 'index.html', 'dad.html', 'manifest.webmanifest', 'css/style.css', 'js/app.js', 'js/data.js', 'js/store.js', 'js/puppy.js', 'js/speech.js', 'js/report.js',
  'vendor/qrcode.js', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())));
self.addEventListener('activate', (e) => e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  const url = new URL(req.url), fonts = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin !== location.origin && !fonts) return;
  const keep = (res) => { if (res.ok || res.type === 'opaque') { const c = res.clone(); caches.open(CACHE).then((x) => x.put(req, c)); } return res; };
  if (fonts) e.respondWith(caches.match(req).then((h) => h || fetch(req).then(keep)));
  else e.respondWith(fetch(req, { cache: 'no-cache' }).then(keep).catch(() => caches.match(req).then((h) => h || caches.match('index.html'))));
});
