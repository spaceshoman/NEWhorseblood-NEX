/* 血統くん PWA service worker */
const CACHE = "keitokun-v1";
const ASSETS = [
  ".", "index.html", "血統くん.html", "manifest.json",
  "data.js", "theme.js", "tweaks-panel.jsx", "ui.jsx", "home.jsx",
  "racedetail.jsx", "diagnosis.jsx", "diagnosis-eyes.jsx", "review.jsx",
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
  if (url.origin !== location.origin) return; // CDN(React/Babel/Fonts)はそのまま通す
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
