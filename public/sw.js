// Service worker: simpan file game agar bisa dimainkan offline.
// Online: selalu ambil file terbaru dari server. Offline: pakai simpanan.
const CACHE = "laga-v17";
const FILES = ["./", "./index.html", "./config.js", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./js/00-galat.js", "./js/01-alat.js", "./js/02-rumus.js", "./js/03-peta.js", "./js/04-status.js", "./js/05-area.js", "./js/06-audio.js", "./js/07-musik.js", "./js/08-input.js", "./js/09-tarung.js", "./js/10-progres.js", "./js/11-dialog.js", "./js/12-cermin.js", "./js/13-teleport.js", "./js/14-update.js", "./js/15-gambar.js", "./js/16-peta-mini.js", "./js/17-peta-besar.js", "./js/18-hud.js", "./js/19-menu-jeda.js", "./js/20-layar-penuh.js", "./js/21-layar-judul.js", "./js/22-main.js"];
// Pasang: simpan semua file. {cache: "reload"} = ambil langsung dari server, bukan dari
// cache browser (GitHub Pages menyimpan file 10 menit), supaya versi file tidak tercampur.
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((u) => new Request(u, { cache: "reload" })))));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
// Ambil: utamakan internet (selalu versi terbaru), simpanan hanya dipakai saat offline.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req, { cache: "no-cache" }).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || (req.mode === "navigate" ? caches.match("./index.html") : Response.error())))
  );
});
