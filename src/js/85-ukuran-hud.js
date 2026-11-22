// =====================================================================
// UKURAN HUD (Menu › Pengaturan › Layar)
// Pemain bisa memperbesar / memperkecil: peta mini, kotak misi, dan ikon
// kanan atas (tombol pintas, koin, jamu, jeda). 60%–160%, langkah 10%.
// Disimpan per perangkat (localStorage "laga.ukuranHud"). Memakai CSS zoom supaya
// tata letak di sekitarnya ikut menyesuaikan (tidak saling menimpa).
// =====================================================================
"use strict";

const UKURAN_KEY = "laga.ukuranHud", UKURAN_MIN = 0.6, UKURAN_MAKS = 1.6;
const BAGIAN_HUD = {
  peta: () => [$("mini")],
  misi: () => [document.querySelector(".hud .me")],
  ikon: () => [document.querySelector(".hud .chips")],
};
let ukuranHud = Object.assign({ peta: 1, misi: 1, ikon: 1 }, store.get(UKURAN_KEY, {}));

function terapkanUkuranHud() {
  for (const [k, ambil] of Object.entries(BAGIAN_HUD)) for (const el of ambil()) if (el) el.style.zoom = ukuranHud[k] === 1 ? "" : ukuranHud[k];
  for (const k of Object.keys(BAGIAN_HUD)) { const v = $("uk-" + k); if (v) v.textContent = Math.round(ukuranHud[k] * 100) + "%"; }
  for (const b of document.querySelectorAll("[data-ukuran]")) {
    const [k, arah] = b.dataset.ukuran.split(":");
    b.disabled = arah === "+" ? ukuranHud[k] >= UKURAN_MAKS - 0.001 : ukuranHud[k] <= UKURAN_MIN + 0.001;
  }
}
for (const b of document.querySelectorAll("[data-ukuran]")) b.addEventListener("click", () => {
  const [k, arah] = b.dataset.ukuran.split(":");
  ukuranHud[k] = Math.round(Math.min(UKURAN_MAKS, Math.max(UKURAN_MIN, ukuranHud[k] + (arah === "+" ? 0.1 : -0.1))) * 10) / 10;
  store.set(UKURAN_KEY, ukuranHud); terapkanUkuranHud(); sfx.click();
});
$("btnUkuranReset").addEventListener("click", () => { ukuranHud = { peta: 1, misi: 1, ikon: 1 }; store.set(UKURAN_KEY, ukuranHud); terapkanUkuranHud(); sfx.click(); });
terapkanUkuranHud();
{ const layarAsli = refreshLayar; refreshLayar = function () { layarAsli(); terapkanUkuranHud(); }; }
