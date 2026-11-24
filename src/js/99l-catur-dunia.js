// =====================================================================
// CATUR LAGA DI DUNIA GAME
// Papan catur digelar di tanah Desa Wanasari (persimpangan jalan di utara rumah
// Pak Wowo), bukan di kotak popup. Selama partai:
//  - kamera menyorot papan dan sedikit diperbesar (zoomKamera, 16-gambar.js)
//    supaya petaknya mudah diketuk di HP;
//  - Pak Wowo berdiri di sisi atas papan, hero di sisi bawah;
//  - bidak klasik berdiri di petaknya; kotak terpilih, langkah yang boleh,
//    lingkaran merah (bisa memakan), langkah terakhir & skak ditandai di tanah;
//  - ketuk/klik petak di layar game untuk melangkah;
//  - info (giliran, jam, bidak termakan, Cara main, Keluar) tampil sebagai HUD (#ctHud).
// Layar pilih pasukan, tutorial, dan hasil tetap memakai panel menu (#caturBox).
// Aturan & AI: 99c · alur & menu: 99d · duel: 99e.
// =====================================================================
"use strict";

const PAPAN_DUNIA = { area: "desa", cx: 16.5 * T, cy: 9.6 * T, uk: 24 };
// zoom otomatis: papan + sedikit ruang mengisi tinggi layar, dan tidak lebih lebar dari ±60% layar
function zoomPapan() {
  const dasar = clamp(Math.min(W / 720, H / 420), 0.75, 2.2), sisi = 8 * PAPAN_DUNIA.uk;
  return clamp(Math.min((W * 0.6) / (sisi + 110), H / (sisi + 70)) / dasar, 1, 3);
}
const papanX0 = () => PAPAN_DUNIA.cx - 4 * PAPAN_DUNIA.uk, papanY0 = () => PAPAN_DUNIA.cy - 4 * PAPAN_DUNIA.uk;
const indeksDariTampil = (v) => (catur && !catur.pemainPutih ? 63 - v : v);   // bidak pemain selalu di bawah
const papanDiLayar = () => !!catur && mode === "catur" && $("caturBox").dataset.layar === "papan";

// ---------- Posisi hero & Pak Wowo di samping papan ----------
let posisiSimpan = null;
function aturPosisiPapan() {
  const w = NPCS.find((n) => n.id === "wowo");
  if (!posisiSimpan) posisiSimpan = { px: P.x, py: P.y, pf: P.face, w, wx: w && w.x, wy: w && w.y, wf: w && w.face };
  // hero di kiri papan (dekat bidaknya), Pak Wowo di kanan: tidak menutupi petak
  P.x = papanX0() - 30; P.y = papanY0() + 6 * PAPAN_DUNIA.uk; P.face = 0; P.moving = false;
  if (w) { w.x = papanX0() + 8 * PAPAN_DUNIA.uk + 30; w.y = papanY0() + 2.6 * PAPAN_DUNIA.uk; w.face = Math.PI; }
  cam.x = PAPAN_DUNIA.cx; cam.y = PAPAN_DUNIA.cy;
}
function kembalikanPosisi() {
  if (!posisiSimpan) return;
  const s = posisiSimpan; posisiSimpan = null;
  P.x = s.px; P.y = s.py; P.face = s.pf;
  if (s.w) { s.w.x = s.wx; s.w.y = s.wy; s.w.face = s.wf; }
}

// ---------- Layar: papan di tanah ↔ panel menu ----------
{
  const tampilAsli = tampilLayarCatur;
  tampilLayarCatur = function (nama) {
    tampilAsli(nama);
    if (mode !== "catur") return;
    const diPapan = nama === "papan";
    $("caturBox").hidden = diPapan;
    $("ctHud").hidden = !diPapan;
    zoomTuju = diPapan ? zoomPapan() : 1;
    if (diPapan && areaId === PAPAN_DUNIA.area) aturPosisiPapan();
  };
  const tutupAsli = tutupCatur;
  tutupCatur = function () { $("ctHud").hidden = true; zoomTuju = 1; kembalikanPosisi(); tutupAsli(); };
}
// kamera menyorot papan selama partai
{
  const kameraAsli = targetKamera;
  targetKamera = function () {
    if (!papanDiLayar()) return kameraAsli();
    zoomTuju = zoomPapan();   // ikut berubah kalau layar diputar / jendela diubah ukurannya
    // geser kamera ke kanan setengah lebar panel HUD, supaya papan tidak tertutup panel
    const panel = $("ctHud").querySelector(".ct-samping"), lebar = panel ? panel.offsetWidth + 12 : 0;
    return { x: PAPAN_DUNIA.cx + lebar / 2 / (kameraTerakhir.scale || 1), y: PAPAN_DUNIA.cy };
  };
}

// ---------- Gambar papan & bidak ----------
// Digambar di lapisan atas (GAMBAR_ATAS) supaya hiasan desa (bangku, pot, kucing) dan label
// tidak menimpa petak; hero & Pak Wowo berdiri di samping papan jadi tidak tertutup.
GAMBAR_ATAS.push(function (time) {
  if (!catur || areaId !== PAPAN_DUNIA.area || (mode !== "catur" && mode !== "duel")) return;
  const uk = PAPAN_DUNIA.uk, x0 = papanX0(), y0 = papanY0(), s = catur.s;
  // tikar/bingkai kayu & bayangan
  ctx.fillStyle = "rgba(0,0,0,0.28)"; ctx.fillRect(x0 - 6, y0 - 2, 8 * uk + 14, 8 * uk + 14);
  ctx.fillStyle = "#5b3a24"; ctx.fillRect(x0 - 8, y0 - 8, 8 * uk + 16, 8 * uk + 16);
  ctx.fillStyle = "#7a4a26"; ctx.fillRect(x0 - 5, y0 - 5, 8 * uk + 10, 8 * uk + 10);
  const skak = kenaSkak(s, s.putih) ? posisiRaja(s, s.putih) : -1;
  const tujuan = new Map(catur.langkahPilih.map((m) => [m.ke, m]));
  for (let v = 0; v < 64; v++) {
    const i = indeksDariTampil(v), r = i >> 3, c = i & 7, x = x0 + (v & 7) * uk, y = y0 + (v >> 3) * uk;
    ctx.fillStyle = (r + c) % 2 ? "#a5754b" : "#ecd9b3"; ctx.fillRect(x, y, uk, uk);
    if (catur.terakhir && (i === catur.terakhir.dari || i === catur.terakhir.ke)) { ctx.fillStyle = "rgba(244,185,66,0.38)"; ctx.fillRect(x, y, uk, uk); }
    if (i === catur.pilih) { ctx.fillStyle = "rgba(90,209,122,0.5)"; ctx.fillRect(x, y, uk, uk); }
    if (i === skak) { ctx.fillStyle = `rgba(229,72,77,${0.45 + 0.2 * Math.sin(time * 8)})`; ctx.fillRect(x, y, uk, uk); }
  }
  // huruf & angka di tepi
  ctx.fillStyle = "rgba(247,239,227,0.75)"; ctx.font = "800 6px Nunito, sans-serif"; ctx.textAlign = "center";
  for (let k = 0; k < 8; k++) {
    const kol = catur.pemainPutih ? k : 7 - k, bar = catur.pemainPutih ? 8 - k : k + 1;
    ctx.fillText("abcdefgh"[kol], x0 + k * uk + uk / 2, y0 + 8 * uk + 6.5);
    ctx.fillText(String(bar), x0 - 4.5, y0 + k * uk + uk / 2 + 2);
  }
  // tanda langkah yang boleh
  for (const [ke, m] of tujuan) {
    const v = catur.pemainPutih ? ke : 63 - ke, x = x0 + (v & 7) * uk + uk / 2, y = y0 + (v >> 3) * uk + uk / 2;
    if (m.makan) { ctx.strokeStyle = "rgba(229,72,77,0.9)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, uk * 0.42, 0, 6.28); ctx.stroke(); }
    else { ctx.fillStyle = "rgba(43,34,56,0.5)"; ctx.beginPath(); ctx.arc(x, y, uk * 0.15, 0, 6.28); ctx.fill(); }
  }
  // bidak (berdiri, dengan bayangan)
  for (let v = 0; v < 64; v++) {
    const x = s.b[indeksDariTampil(v)]; if (!x) continue;
    const px = x0 + (v & 7) * uk + uk / 2, py = y0 + (v >> 3) * uk + uk / 2;
    ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.beginPath(); ctx.ellipse(px, py + uk * 0.32, uk * 0.3, uk * 0.1, 0, 0, 6.28); ctx.fill();
    gambarBidakKanvas(ctx, x.t, x.w, px, py - 2, uk * 1.02);
  }
});

// ---------- Ketuk / klik petak di layar game ----------
$("cv").addEventListener("pointerdown", (e) => {
  if (!papanDiLayar() || !$("ctKonfirm").hidden || catur.sibuk) return;
  const r = $("cv").getBoundingClientRect(), k = kameraTerakhir;
  const wx = (e.clientX - r.left - W / 2) / k.scale + k.cx, wy = (e.clientY - r.top - H / 2) / k.scale + k.cy;
  const kol = Math.floor((wx - papanX0()) / PAPAN_DUNIA.uk), bar = Math.floor((wy - papanY0()) / PAPAN_DUNIA.uk);
  if (kol < 0 || kol > 7 || bar < 0 || bar > 7) { catur.pilih = -1; catur.langkahPilih = []; return; }
  e.preventDefault();
  klikKotakCatur(indeksDariTampil(bar * 8 + kol));
});
// kursor tangan saat di atas papan (komputer)
$("cv").addEventListener("pointermove", (e) => {
  if (!papanDiLayar()) { if ($("cv").style.cursor) $("cv").style.cursor = ""; return; }
  const r = $("cv").getBoundingClientRect(), k = kameraTerakhir;
  const wx = (e.clientX - r.left - W / 2) / k.scale + k.cx, wy = (e.clientY - r.top - H / 2) / k.scale + k.cy;
  const di = wx >= papanX0() && wx < papanX0() + 8 * PAPAN_DUNIA.uk && wy >= papanY0() && wy < papanY0() + 8 * PAPAN_DUNIA.uk;
  $("cv").style.cursor = di ? "pointer" : "";
});
