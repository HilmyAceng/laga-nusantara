// =====================================================================
// MODE GRAFIS RINGAN (Menu › Pengaturan › Layar)
// Untuk HP yang patah-patah: resolusi kanvas 1× (bukan 2×), partikel dikurangi
// banyak (percikan, debu, serpihan), dan jumlah partikel di layar dibatasi.
// Pilihan disimpan per perangkat (localStorage "laga.grafisRingan"), dibaca juga
// oleh resize() di 16-gambar.js.
// =====================================================================
"use strict";

const GRAFIS_KEY = "laga.grafisRingan";
let grafisRingan = store.get(GRAFIS_KEY, false);

// percikan: hanya sepertiganya
{
  const sparkAsli = spark;
  spark = function (x, y, color, n) { return sparkAsli(x, y, color, grafisRingan ? Math.ceil(n / 3) : n); };
}
// batasi partikel di layar
UPDATE_TAMBAHAN.push(() => { if (grafisRingan && parts.length > 60) parts.splice(0, parts.length - 60); });

function refreshGrafis() {
  const b = $("btnGrafis");
  b.textContent = t(grafisRingan ? "set.nyala" : "set.mati");
  b.setAttribute("aria-pressed", String(grafisRingan));
}
$("btnGrafis").addEventListener("click", () => {
  grafisRingan = !grafisRingan; store.set(GRAFIS_KEY, grafisRingan);
  resize(); refreshGrafis(); sfx.click();
});
{ const layarAsli = refreshLayar; refreshLayar = function () { layarAsli(); refreshGrafis(); }; }
