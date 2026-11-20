// Service worker: simpan file game agar bisa dimainkan offline.
const CACHE = "laga-v9";
const FILES = ["./", "./index.html", "./config.js", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./js/01-alat.js", "./js/02-rumus.js", "./js/03-peta.js", "./js/04-status.js", "./js/05-area.js", "./js/06-audio.js", "./js/07-musik.js", "./js/08-input.js", "./js/09-tarung.js", "./js/10-progres.js", "./js/11-dialog.js", "./js/12-update.js", "./js/13-gambar.js", "./js/14-peta-mini.js", "./js/15-peta-besar.js", "./js/16-hud.js", "./js/17-menu-jeda.js", "./js/18-layar-judul.js", "./js/19-main.js"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
    const copy = res.clone();
    if (res.ok && new URL(e.request.url).origin === location.origin) caches.open(CACHE).then((c) => c.put(e.request, copy));
    return res;
  }).catch(() => caches.match("./index.html"))));
});
