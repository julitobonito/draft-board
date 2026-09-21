/* Draft Room service worker.
   The app shell (index.html) and rankings (data/*.json) are served NETWORK-FIRST,
   so the newest version loads whenever you're online and falls back to cache offline.
   That means replacing index.html in the repo is enough — no version bump needed for
   app changes. Bump SHELL_VERSION only to force-clear caches (e.g. icon/asset changes). */
const SHELL_VERSION = "v7";
const SHELL_CACHE = "draftroom-shell-" + SHELL_VERSION;
const DATA_CACHE  = "draftroom-data";
const SHELL = [
  "./", "./index.html", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-512-maskable.png",
  "./icons/apple-touch-icon.png",
  "./data/redraft.json", "./data/dynasty.json", "./data/ros.json"
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
  if(url.origin !== location.origin) return; // Sleeper API + fonts go straight to network
  const isDoc = e.request.mode === "navigate" || url.pathname.endsWith("/") || url.pathname.endsWith("index.html");
  if(isDoc || url.pathname.includes("/data/")){
    // network-first, cache fallback
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(isDoc ? SHELL_CACHE : DATA_CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match(e.request).then(hit => hit || caches.match("./index.html")))
    );
  } else {
    // cache-first for static assets (icons, manifest)
    e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request)));
  }
});
