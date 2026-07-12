/* 血統くん refined PWA service worker */
const CACHE = "keitokun-v15";
const ASSETS = [
  ".", "index.html", "血統くん.html", "manifest.json",
  "data.js", "theme.js", "tweaks-panel.jsx", "ui.jsx", "home.jsx",
  "racedetail.jsx", "diagnosis.jsx", "diagnosis-eyes.jsx", "review.jsx",
  "race-loader.js", "race-panel.jsx",
  "shirasagiS2026.json", "fuchuFillies2026.json", "hakodateKinen2026.json", "kitakyushu2026.json", "tanabata2026.json",
  "win5-data.js", "win5.jsx",
  "analysis.jsx", "extras.jsx", "app.jsx",
  "icon-192.png", "icon-512.png"
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("index.html")))
  );
});
