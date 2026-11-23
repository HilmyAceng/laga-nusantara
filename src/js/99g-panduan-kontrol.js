// =====================================================================
// PANDUAN KONTROL KEYBOARD (khusus komputer, bukan HP)
// Banyak pemain desktop langsung main tanpa membaca petunjuk. Jadi:
//  1. Setiap memulai progres BARU, begitu benar-benar bermain (setelah prolog/cutscene), muncul kartu
//     "Kontrol Keyboard" bergambar tombol. Game berhenti sampai pemain menekan "Mengerti".
//  2. Setelah itu, strip kecil di bawah layar mengingatkan Serang / Jurus / Hindar
//     sampai ketiganya pernah dipakai (atau 3 menit berlalu).
// Tombol dibaca dari KONTROL (config.js). Penanda di simpanan: S.panduanKontrol
// (false = belum dilihat; simpanan lama tidak punya penanda ini, jadi tidak ditampilkan).
// =====================================================================
"use strict";

const PK_LATIH = ["serang", "jurus", "hindar"];
let pkStrip = null;   // { sudah: Set, sisa: detik }

const pkTombol = (act) => KONTROL[act].map((k) => `<kbd>${KEY_LABEL[k] || (k.length === 1 ? k.toUpperCase() : k)}</kbd>`).join("");
function isiPanduanKontrol() {
  $("pkPanah").innerHTML = `${pkTombol("atas")}${pkTombol("kiri")}${pkTombol("bawah")}${pkTombol("kanan")}<small>${Lx(["Gerak", "Move"])}</small>`;
  const baris = [
    ["serang", ["Serang (tahan)", "Attack (hold)"], true], ["jurus", ["Jurus 1", "Skill 1"], true],
    ["hindar", ["Hindar", "Dodge"], true], ["jurus2", ["Jurus 2", "Skill 2"]],
    ["pamungkas", ["Pamungkas", "Ultimate"]], ["jamu", ["Minum jamu", "Drink jamu"]],
    ["bicara", ["Bicara", "Talk"]], ["peta", ["Peta", "Map"]],
    ["misi", ["Misi", "Quests"]], ["jeda", ["Menu / jeda", "Menu / pause"]],
  ];
  $("pkDaftar").innerHTML = baris.map(([act, nama, utama]) => `<div class="${utama ? "utama" : ""}">${pkTombol(act)}<span>${Lx(nama)}</span></div>`).join("");
}
function bukaPanduanKontrol() {
  isiPanduanKontrol();
  mode = "panduan"; showUI();
  $("panduanBox").hidden = false; sfx.click();
}
function tutupPanduanKontrol() {
  $("panduanBox").hidden = true;
  if (S) { S.panduanKontrol = true; saveSoon(); }
  if (mode === "panduan") { mode = "play"; showUI(); }
  pkStrip = { sudah: new Set(), sisa: 180 }; tampilStrip();
  sfx.click();
}
function tampilStrip() {
  const el = $("pkStrip");
  if (!pkStrip || mode !== "play") { el.hidden = true; return; }
  el.hidden = false;
  const nama = { serang: ["Serang", "Attack"], jurus: ["Jurus", "Skill"], hindar: ["Hindar", "Dodge"] };
  el.innerHTML = PK_LATIH.map((a) => `<span class="${pkStrip.sudah.has(a) ? "sudah" : ""}">${pkTombol(a)}${Lx(nama[a])}</span>`).join("") +
    `<span>${pkTombol("jeda")}${Lx(["Menu", "Menu"])}</span>`;
}
$("btnPkOke").addEventListener("click", tutupPanduanKontrol);

// muncul saat progres baru sudah benar-benar bermain di komputer
// (prolog baru diputar 0,6 detik setelah game dibuat → tunggu S.prologSelesai, lalu beri jeda 1 detik)
let pkTunggu = 1;
UPDATE_TAMBAHAN.push((dt) => {
  if (isTouch) return;
  if (S && S.panduanKontrol === false) {
    if (adegan || !S.prologSelesai) { pkTunggu = 1; return; }
    pkTunggu -= dt; if (pkTunggu <= 0) bukaPanduanKontrol();
    return;
  }
  if (pkStrip) { pkStrip.sisa -= dt; if (pkStrip.sisa <= 0) { pkStrip = null; tampilStrip(); } }
});
// progres baru → kartu kontrol akan muncul lagi
{
  const startAsli = startGame;
  startGame = function (fresh) {
    if (fresh) pkStrip = null;
    startAsli(fresh);
    if (fresh && S) { S.panduanKontrol = false; saveSoon(); }
  };
}
// strip hanya tampil saat bermain (disembunyikan di menu, dialog, peta, dll.)
{
  const showUIAsli = showUI;
  showUI = function () { showUIAsli(); if ($("pkStrip")) tampilStrip(); };
}
addEventListener("keydown", (e) => {
  if (mode === "panduan") {
    if (e.key === "Enter" || e.key === "Escape" || e.key === " ") { e.preventDefault(); e.stopImmediatePropagation(); tutupPanduanKontrol(); }
    else e.stopImmediatePropagation();   // game sedang berhenti: tombol lain diabaikan
    return;
  }
  if (!pkStrip || e.repeat) return;
  const act = ACTION_OF[keyName(e)];
  if (PK_LATIH.includes(act) && !pkStrip.sudah.has(act)) {
    pkStrip.sudah.add(act); tampilStrip();
    if (pkStrip.sudah.size === PK_LATIH.length) setTimeout(() => { pkStrip = null; tampilStrip(); toast(Lx(["Mantap! Kontrol lengkap ada di menu (Esc) › Kontrol.", "Nice! The full controls are in the menu (Esc) › Controls."]), false); }, 900);
  }
}, true);
