// =====================================================================
// LAYAR PENUH
// Menu Jeda › Pengaturan › Layar › Full Screen (Nyala/Mati).
// Pilihan tersimpan. Browser hanya mengizinkan layar penuh setelah pemain
// menyentuh/menekan sesuatu, jadi setelah halaman dibuka ulang, layar penuh
// dinyalakan lagi pada sentuhan pertama.
// =====================================================================
"use strict";

const LAYAR_KEY = "laga.layar";
const layar = Object.assign({ penuh: true }, store.get(LAYAR_KEY, {}));   // bawaan: layar penuh otomatis (sentuhan/tombol pertama)
const docEl = document.documentElement;
// Bisa layar penuh? (iPhone Safari belum mendukung untuk halaman web biasa)
const fsBisa = !!(docEl.requestFullscreen || docEl.webkitRequestFullscreen);
const fsAktif = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
// Dibuka sebagai aplikasi terpasang (sudah tampil penuh dari manifest)?
// Catatan: saat layar penuh dari tombol kita, browser juga melapor "display-mode: fullscreen",
// jadi kondisi itu hanya dihitung kalau BUKAN karena layar penuh dari tombol.
const fsAplikasi = () => (matchMedia("(display-mode: fullscreen)").matches && !fsAktif()) || matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;

let fsDariSaya = false;   // perubahan layar penuh karena tombol kita (bukan pemain keluar sendiri)
function masukPenuh() {
  if (!fsBisa || fsAktif()) return;
  fsDariSaya = true;
  const req = docEl.requestFullscreen ? docEl.requestFullscreen({ navigationUI: "hide" }) : docEl.webkitRequestFullscreen();
  if (req && req.then) req.then(kunciMendatar).catch(() => { fsDariSaya = false; refreshLayar(); });
  else kunciMendatar();
}
// HP: kunci layar mendatar (hanya bisa saat layar penuh; iPhone belum mendukung → petunjuk "putar HP")
function kunciMendatar() {
  if (!isTouch || !screen.orientation || !screen.orientation.lock) return;
  screen.orientation.lock("landscape").catch(() => {});
}
function keluarPenuh() {
  if (!fsAktif()) return;
  fsDariSaya = true;
  const ex = document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen();
  if (ex && ex.catch) ex.catch(() => {});
}
function setLayarPenuh(on) {
  layar.penuh = on; store.set(LAYAR_KEY, layar);
  if (on) masukPenuh(); else keluarPenuh();
  refreshLayar();
}

// Tampilan tombol & keterangan di halaman Layar
function refreshLayar() {
  const btn = $("btnFull"), note = $("fsNote");
  let on = fsAktif(), bisa = fsBisa, teks = "";
  if (fsAplikasi()) { on = true; bisa = false; teks = t("fs.aplikasi"); }
  else if (!fsBisa) teks = t("fs.tidakBisa");
  else if (layar.penuh && !on) teks = t("fs.ketuk");
  btn.textContent = t(on ? "set.nyala" : "set.mati");
  btn.setAttribute("aria-pressed", String(on));
  btn.disabled = !bisa;
  note.textContent = teks; note.hidden = !teks;
}

$("btnFull").addEventListener("click", () => setLayarPenuh(!fsAktif()));
const onFsChange = () => {
  // pemain keluar sendiri (tombol kembali / geser) saat halaman terlihat → anggap dimatikan
  if (!fsAktif() && !fsDariSaya && !document.hidden) { layar.penuh = false; store.set(LAYAR_KEY, layar); }
  fsDariSaya = false;
  refreshLayar(); resize();
};
document.addEventListener("fullscreenchange", onFsChange);
document.addEventListener("webkitfullscreenchange", onFsChange);
// Pilihan "Nyala" tersimpan → masuk layar penuh lagi pada sentuhan/tombol pertama
const fsLagi = () => { if (layar.penuh && !fsAktif() && !fsAplikasi()) masukPenuh(); };
addEventListener("pointerup", fsLagi);
addEventListener("keyup", fsLagi);
refreshLayar();
