/* Draft Room service worker.
   Bump SHELL_VERSION only when you change index.html / sw.js / icons.
   Rankings live in ./data/*.json and are fetched network-first, so a data
   refresh shows up automatically the next time the app is opened online —
   no version bump needed for ranking updates. */
const SHELL_VERSION = "v1";
const SHELL_CACHE = "draftroom-shell-" + SHELL_VERSION;
const DATA_CACHE  = "draftroom-data";
const SHELL = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-512-maskable.png",
  "./icons/apple-touch-icon.png",
  "./data/redraft.json", "./data/dynasty.json"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SHELL_CACHE).then(c => c.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k!==SHELL_CACHE && k!==DATA_CACHE).map(k => caches.delete(k)))
  ).then(()=>self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if(url.pathname.includes("/data/")){
    // network-first for rankings, fall back to cache when offline
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(DATA_CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match(e.request))
    );
  } else {
    // cache-first for the app shell
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
  }
});
