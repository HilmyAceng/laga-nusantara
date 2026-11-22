// =====================================================================
// SUTRADARA CUTSCENE
// Adegan pendek di dalam game (bukan video): kamera bergerak sendiri, teks narasi
// & dialog, judul besar, layar gelap/terang, guncangan, kilat. Selama adegan,
// mode = "adegan": pemain & monster berhenti, HUD disembunyikan, pita hitam film.
//
// mainkanAdegan(langkah, selesai) — langkah = daftar objek, dijalankan berurutan:
//   { kamera: "pemain" | "bos" | { x, y } (piksel) | { tx, ty } (petak), lama }  geser kamera
//   { tunggu: detik }
//   { teks: "isi", nama: "pembicara", lama }       teks di bawah (ketuk = lanjut)
//   { judul: "besar", sub: "kecil", lama }         judul di tengah layar
//   { gelap: 0..1, lama }                          layar menggelap / terang kembali
//   { guncang: kekuatan }  { kilat: true }  { lakukan: fungsi }   (langsung lanjut)
// Lewati: tombol "Lewati", Esc, atau tahan ketuk. Ketuk / Enter / Spasi = langkah berikutnya.
// =====================================================================
"use strict";

let adegan = null;   // { langkah, i, t, lama, selesai, kamera, modeLama }

function mainkanAdegan(langkah, selesai, opsi = {}) {
  if (adegan) return;
  adegan = { langkah, i: -1, t: 0, lama: 0, selesai, kamera: null, modeLama: mode, bos: opsi.bos || null };
  if (mode === "dialog") closeDialog();
  mode = "adegan"; showUI();
  $("hud").hidden = true;
  const box = $("adegan"); box.hidden = false; box.classList.remove("selesai");
  requestAnimationFrame(() => box.classList.add("buka"));
  $("adeganTeks").hidden = true; $("adeganJudul").hidden = true;
  langkahBerikut();
}
function langkahBerikut() {
  const A = adegan; if (!A) return;
  while (++A.i < A.langkah.length) {
    const L = A.langkah[A.i];
    A.t = 0; A.lama = L.lama != null ? L.lama : 0;
    if (L.kamera) {
      A.kamera = L.kamera === "pemain" ? { x: P.x, y: P.y - 20 }
        : L.kamera === "bos" ? (A.bos ? { x: A.bos.x, y: A.bos.y - 30 } : null)
        : L.kamera.tx != null ? { x: L.kamera.tx * T, y: L.kamera.ty * T } : L.kamera;
      if (!A.lama) A.lama = 1;
      return;
    }
    if (L.tunggu != null) { A.lama = L.tunggu; return; }
    if (L.teks != null) {
      $("adeganJudul").hidden = true;
      $("adeganNama").textContent = L.nama || ""; $("adeganNama").hidden = !L.nama;
      $("adeganIsi").textContent = L.teks;
      $("adeganTeks").hidden = false;
      if (!A.lama) A.lama = Math.max(2.4, L.teks.length * 0.055);   // lama baca otomatis
      return;
    }
    if (L.judul != null) {
      $("adeganTeks").hidden = true;
      $("adeganJudulBesar").textContent = L.judul; $("adeganJudulKecil").textContent = L.sub || "";
      const j = $("adeganJudul"); j.hidden = false; j.classList.remove("muncul"); void j.offsetWidth; j.classList.add("muncul");
      if (!A.lama) A.lama = 2.2;
      return;
    }
    if (L.gelap != null) {
      const g = $("adeganGelap"); g.style.transitionDuration = (L.lama || 0.6) + "s"; g.style.opacity = L.gelap;
      A.lama = L.lama || 0.6; return;
    }
    // langkah langsung
    if (L.guncang) shake = Math.max(shake, L.guncang);
    if (L.kilat) kilat = 1;
    if (L.lakukan) L.lakukan(A);
  }
  akhiriAdegan();
}
function akhiriAdegan() {
  const A = adegan; if (!A) return;
  adegan = null;
  const box = $("adegan"); box.classList.remove("buka");
  $("adeganGelap").style.transitionDuration = "0.4s"; $("adeganGelap").style.opacity = 0;
  setTimeout(() => { if (!adegan) box.hidden = true; }, 400);
  mode = A.modeLama === "adegan" ? "play" : A.modeLama || "play";
  if (mode !== "play" && mode !== "dialog") mode = "play";
  showUI(); refreshHud(true);
  if (P) P.inv = Math.max(P.inv, 0.8);    // jeda aman sebentar setelah adegan
  if (A.selesai) A.selesai();
}
// lanjut ke langkah berikutnya (ketuk) / lewati semua
function majuAdegan() { if (adegan) langkahBerikut(); }
function lewatiAdegan() {
  if (!adegan) return;
  // langkah "lakukan" yang belum jalan tetap dijalankan (mis. menandai bos sudah dikenalkan)
  const A = adegan;
  for (let i = A.i + 1; i < A.langkah.length; i++) if (A.langkah[i].lakukan) A.langkah[i].lakukan(A);
  A.i = A.langkah.length; akhiriAdegan(); sfx.click();
}

// Kamera mengikuti adegan (dibaca render() di 16-gambar.js)
function targetKamera() { return adegan && adegan.kamera; }

// detak adegan: dipanggil dari update() saat mode "adegan"
function detakAdegan(dt) {
  const A = adegan; if (!A) return;
  if (shake > 0) shake -= dt;
  if (kilat > 0) kilat = Math.max(0, kilat - dt * 2.5);
  for (const p of parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.z = (p.z || 0) + (p.vz || 0) * dt; p.life -= dt; }
  parts = parts.filter((p) => p.life > 0);
  A.t += dt;
  if (A.t >= A.lama) langkahBerikut();
}
{
  const updateAsli = update;
  update = function (dt) { if (mode === "adegan") return detakAdegan(dt); return updateAsli(dt); };
}

// ---------- Kontrol ----------
let tahanAdegan = 0;
$("btnAdeganLewati").addEventListener("click", (e) => { e.stopPropagation(); lewatiAdegan(); });
$("adegan").addEventListener("pointerdown", (e) => { if (e.target.closest("#btnAdeganLewati")) return; tahanAdegan = performance.now(); });
$("adegan").addEventListener("pointerup", (e) => {
  if (e.target.closest("#btnAdeganLewati") || !tahanAdegan) return;
  const lama = performance.now() - tahanAdegan; tahanAdegan = 0;
  if (lama > 700) lewatiAdegan(); else majuAdegan();
});
addEventListener("keydown", (e) => {
  if (mode !== "adegan") return;
  if (e.key === "Escape") { e.preventDefault(); e.stopImmediatePropagation(); lewatiAdegan(); }
  else if (e.key === "Enter" || e.key === " " || ACTION_OF[keyName(e)] === "bicara") { e.preventDefault(); majuAdegan(); }
}, true);
