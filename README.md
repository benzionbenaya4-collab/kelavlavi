# כלבלבי 🐶💜

Learning pets for grades 1–12 (level follows the school calendar; summer review in July–August) – math, English and Hebrew. Static site, runs fully on the device (localStorage), installable (PWA), works offline. No server, no tracking.

- `index.html` – the app · `dad.html` – parent's report page (scan a QR from the child's device).
- `js/data.js` content & question generators · `js/store.js` progress, levels, adaptive question choice, report export · `js/puppy.js` SVG puppies & items · `js/speech.js` voice & reading aloud · `js/report.js` chart.
- `vendor/qrcode.js` – QR Code Generator by Kazuhiko Arase (MIT).
- `js/parsha.js` – weekly Torah portion (Israel), computed on the device from the Hebrew calendar; checked against a reference calendar for 2025–2039 (724/724 Shabbatot). `js/parsha-stories.js` – stories by grade.
