// Service worker: simpan file game agar bisa dimainkan offline.
// Online: selalu ambil file terbaru dari server. Offline: pakai simpanan.
const CACHE = "laga-20261124060839";
const FILES = ["./", "./index.html", "./config.js", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./cerita/bab-10.js", "./cerita/bab-1.js", "./cerita/bab-2.js", "./cerita/bab-3.js", "./cerita/bab-4.js", "./cerita/bab-5.js", "./cerita/bab-6.js", "./cerita/bab-7.js", "./cerita/bab-8.js", "./cerita/bab-9.js", "./cerita/semua.js", "./js/00a-kompat.js", "./js/00-galat.js", "./js/01-alat.js", "./js/02a-teks-tempur.js", "./js/02-bahasa.js", "./js/03-rumus.js", "./js/04a-dunia-segara.js", "./js/04b-dunia-awan.js", "./js/04c-area-tambahan.js", "./js/04d-dunia-bayang.js", "./js/04-peta.js", "./js/05-status.js", "./js/06-area.js", "./js/07-audio.js", "./js/08-musik.js", "./js/09-input.js", "./js/100-main.js", "./js/10-tarung.js", "./js/11-progres.js", "./js/12-dialog.js", "./js/13-cermin.js", "./js/14-teleport.js", "./js/15-update.js", "./js/16-gambar.js", "./js/17-peta-mini.js", "./js/18-peta-besar.js", "./js/19-hud.js", "./js/20-menu-jeda.js", "./js/21-layar-penuh.js", "./js/22-layar-judul.js", "./js/23-cerita.js", "./js/24-sampingan.js", "./js/25-teka-teki.js", "./js/26-monster-baru.js", "./js/27-navigasi.js", "./js/28-dukung.js", "./js/29-zoom-peta.js", "./js/30-daftar-misi.js", "./js/32-debuff.js", "./js/33-zona-aman.js", "./js/34-tantangan-bos.js", "./js/35-monster-dunia-baru.js", "./js/36-naga.js", "./js/38-panduan-debuff.js", "./js/39-notif-item.js", "./js/40-ganti-bab.js", "./js/41-teka-urutan.js", "./js/42-teka-dorong.js", "./js/43-teka-memori.js", "./js/44-teka-tebak.js", "./js/45-monster-bayang.js", "./js/46-kalamurka.js", "./js/48-jurus.js", "./js/49-pamungkas.js", "./js/50-hindar-tangkis.js", "./js/51-poin-jurus.js", "./js/52-jimat.js", "./js/53-drop-langka.js", "./js/54-skala-monster.js", "./js/55-debuff-baru.js", "./js/56-cara-bermain.js", "./js/57-bos-tangguh.js", "./js/59-jurus-khas-bos.js", "./js/60-belum-saatnya.js", "./js/61-suara-makhluk.js", "./js/62-fase-bos.js", "./js/63-area-bos.js", "./js/64-cermin-peta.js", "./js/65-jamu-jeda.js", "./js/66-status-karakter.js", "./js/67-koleksi-jimat.js", "./js/68-hiasan.js", "./js/69-warga-keliling.js", "./js/70-warung-pahat.js", "./js/71-kesulitan.js", "./js/72-kode-save.js", "./js/73-grafis-ringan.js", "./js/74-versi-masukan.js", "./js/76-melee.js", "./js/78-sutradara.js", "./js/79-prolog.js", "./js/80-adegan-bos.js", "./js/81-ensiklopedia-musuh.js", "./js/83-pasif-legenda.js", "./js/85-ukuran-hud.js", "./js/87-hindar-diam.js", "./js/89-hero-baru.js", "./js/90-hero-dalang.js", "./js/91-hero-tabib.js", "./js/92-hero-jawara.js", "./js/94-gerbang-cerita.js", "./js/95-arena-bos-bersih.js", "./js/97-kepala-menu.js", "./js/99a-ikon-teks.js", "./js/99b-event.js", "./js/99c-catur-aturan.js", "./js/99d-catur-papan.js", "./js/99e-catur-duel.js", "./js/99f-info.js", "./js/99g-panduan-kontrol.js", "./js/99-pembaruan.js"];
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
  if (new URL(req.url).pathname.endsWith("/versi.json")) return;   // cek versi selalu langsung ke server (99-pembaruan.js)
  e.respondWith(
    fetch(req, { cache: "no-cache" }).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || (req.mode === "navigate" ? caches.match("./index.html") : Response.error())))
  );
});
