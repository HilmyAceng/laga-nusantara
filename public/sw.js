// Service worker: simpan file game agar bisa dimainkan offline.
// Online: selalu ambil file terbaru dari server. Offline: pakai simpanan.
const CACHE = "laga-v22";
const FILES = ["./", "./index.html", "./config.js", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./js/00-galat.js", "./js/01-alat.js", "./js/02-bahasa.js", "./js/03-rumus.js", "./js/04-peta.js", "./js/05-status.js", "./js/06-area.js", "./js/07-audio.js", "./js/08-musik.js", "./js/09-input.js", "./js/10-tarung.js", "./js/11-progres.js", "./js/12-dialog.js", "./js/13-cermin.js", "./js/14-teleport.js", "./js/15-update.js", "./js/16-gambar.js", "./js/17-peta-mini.js", "./js/18-peta-besar.js", "./js/19-hud.js", "./js/20-menu-jeda.js", "./js/21-layar-penuh.js", "./js/22-layar-judul.js", "./js/23-cerita.js", "./js/24-sampingan.js", "./js/25-teka-teki.js", "./js/26-monster-baru.js", "./js/27-navigasi.js", "./js/28-dukung.js", "./js/29-zoom-peta.js", "./js/30-daftar-misi.js", "./js/31-main.js"];
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
