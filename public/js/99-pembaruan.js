// =====================================================================
// PEMBARUAN OTOMATIS
// Setiap build punya nomor unik (window.LAGA_BUILD, dibuat build.sh) dan file versi.json.
// Saat game dibuka, kembali dibuka dari latar belakang, & tiap 10 menit, game mengecek
// versi.json (tanpa cache). Kalau ada versi lebih baru:
//   - di layar judul / menu jeda → progres disimpan, halaman langsung dimuat ulang;
//   - sedang bermain → notif kecil, dimuat ulang begitu pemain membuka menu jeda / layar judul.
// Pengaman: tiap versi baru hanya memicu satu kali muat ulang per sesi (mencegah putaran
// muat ulang kalau server belum selesai memperbarui semua file).
// =====================================================================
"use strict";

let versiBaru = null;
async function cekPembaruan() {
  if (!window.LAGA_BUILD || location.protocol === "file:") return;
  try {
    const r = await fetch("versi.json?t=" + Date.now(), { cache: "no-store" });
    if (!r.ok) return;
    const v = (await r.json()).build;
    if (!v || v === window.LAGA_BUILD) return;
    if (sessionStorage.getItem("laga.muatUlang") === v) return;   // sudah dicoba untuk versi ini
    versiBaru = v;
    if (mode === "select" || mode === "pause") muatUlangVersiBaru();
    else toast(t("baru.ada"), false);
  } catch (e) {}
}
function muatUlangVersiBaru() {
  if (!versiBaru) return;
  try { sessionStorage.setItem("laga.muatUlang", versiBaru); } catch (e) {}
  if (S && mode !== "select") save();
  toast(t("baru.memuat"), true);
  setTimeout(() => location.reload(), 600);
}
// sedang bermain saat versi baru terdeteksi → muat ulang saat membuka menu / kembali ke judul
{
  const tampilAsli = showUI;
  showUI = function () { tampilAsli(); if (versiBaru && (mode === "pause" || mode === "select")) muatUlangVersiBaru(); };
}
setTimeout(cekPembaruan, 2500);
document.addEventListener("visibilitychange", () => { if (!document.hidden) cekPembaruan(); });
setInterval(cekPembaruan, 10 * 60 * 1000);
