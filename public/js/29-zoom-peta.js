// =====================================================================
// ZOOM PETA BESAR
// Perbesar / perkecil peta besar (18-peta-besar.js):
//   - tombol + dan - di pojok peta, tombol bulat = kembali ke posisimu
//   - roda mouse (zoom ke arah kursor), tombol + / - di keyboard
//   - HP: cubit dua jari untuk zoom, geser satu jari untuk menggeser peta
// Zoom disimpan terpisah untuk tab "Area ini" dan "Peta dunia".
// Batas zoom diatur di config.js: ATURAN.peta.zoomMaks
// =====================================================================
"use strict";

// cx, cy = titik tengah tampilan (0..1 dari lebar/tinggi kanvas saat zoom 1)
// ikut   = tampilan mengikuti posisi pemain (mati setelah peta digeser)
const zoomPeta = { area: { z: 1, cx: 0.5, cy: 0.5, ikut: true }, world: { z: 1, cx: 0.5, cy: 0.5, ikut: true } };
const zoomMaks = () => (ATURAN.peta && ATURAN.peta.zoomMaks) || 4;
const zNow = () => zoomPeta[mapTab];

// Dipanggil oleh drawAreaMap/drawWorldMap setelah ukuran "pas layar" dihitung.
// pfx, pfy = posisi pemain di kanvas saat zoom 1.
// Hasil: { z, ax, ay } → posisi akhir = posisi_zoom1 × z + (ax, ay)
function tampilanPeta(cw, ch, pfx, pfy) {
  const Z = zNow();
  if (Z.ikut) { Z.cx = pfx / cw; Z.cy = pfy / ch; }
  const h = 0.5 / Z.z;                       // tampilan tidak boleh keluar dari peta
  Z.cx = clamp(Z.cx, h, 1 - h); Z.cy = clamp(Z.cy, h, 1 - h);
  return { z: Z.z, ax: cw / 2 - Z.cx * cw * Z.z, ay: ch / 2 - Z.cy * ch * Z.z };
}

// Ubah zoom. (mx, my) = titik kanvas (px CSS) yang tetap diam; kosong = tengah.
function setZoomPeta(zBaru, mx, my) {
  const Z = zNow(), w = bigMap.clientWidth, h = bigMap.clientHeight;
  zBaru = clamp(zBaru, 1, zoomMaks());
  if (zBaru === Z.z) return;
  if (mx != null && !Z.ikut) {
    // titik di bawah kursor tetap di tempatnya
    const fx = (mx - w / 2) / Z.z / w + Z.cx, fy = (my - h / 2) / Z.z / h + Z.cy;
    Z.cx = fx - (mx - w / 2) / zBaru / w; Z.cy = fy - (my - h / 2) / zBaru / h;
  }
  Z.z = zBaru;
  refreshZoomBtn();
}
function zoomLangkah(arah) { setZoomPeta(zNow().z * (arah > 0 ? 1.5 : 1 / 1.5)); sfx.click(); }
function pusatkanPeta() { zNow().ikut = true; sfx.click(); }
function refreshZoomBtn() {
  const Z = zNow();
  $("zIn").disabled = Z.z >= zoomMaks() - 1e-6;
  $("zOut").disabled = Z.z <= 1 + 1e-6;
}
// buka peta → kembali mengikuti posisi pemain
function resetIkutPeta() { zoomPeta.area.ikut = zoomPeta.world.ikut = true; refreshZoomBtn(); }

$("zIn").addEventListener("click", () => zoomLangkah(1));
$("zOut").addEventListener("click", () => zoomLangkah(-1));
$("zPusat").addEventListener("click", pusatkanPeta);
addEventListener("keydown", (e) => {
  if (mode !== "map") return;
  if (e.key === "+" || e.key === "=") zoomLangkah(1);
  if (e.key === "-" || e.key === "_") zoomLangkah(-1);
});
bigMap.addEventListener("wheel", (e) => {
  e.preventDefault();
  const r = bigMap.getBoundingClientRect();
  zNow().ikut = false;   // zoom ke arah kursor
  setZoomPeta(zNow().z * (e.deltaY < 0 ? 1.2 : 1 / 1.2), e.clientX - r.left, e.clientY - r.top);
}, { passive: false });

// ---------- geser & cubit (mouse dan sentuh) ----------
const jari = new Map();   // pointerId → {x, y}
let jarakCubit = 0, digeser = false, awalGeser = null;
bigMap.addEventListener("pointerdown", (e) => {
  bigMap.setPointerCapture(e.pointerId);
  jari.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (jari.size === 1) { digeser = false; awalGeser = { x: e.clientX, y: e.clientY }; }
  if (jari.size === 2) { const [a, b] = [...jari.values()]; jarakCubit = Math.hypot(a.x - b.x, a.y - b.y); }
});
bigMap.addEventListener("pointermove", (e) => {
  const lama = jari.get(e.pointerId);
  if (!lama) return;
  const Z = zNow(), w = bigMap.clientWidth, h = bigMap.clientHeight;
  if (jari.size === 1) {
    if (!digeser && Math.hypot(e.clientX - awalGeser.x, e.clientY - awalGeser.y) < 6) return;
    if (!digeser) { digeser = true; }
    if (Z.z > 1) { Z.ikut = false; Z.cx -= (e.clientX - lama.x) / Z.z / w; Z.cy -= (e.clientY - lama.y) / Z.z / h; }
  }
  jari.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (jari.size === 2) {
    digeser = true;
    const [a, b] = [...jari.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
    if (jarakCubit > 0) {
      const r = bigMap.getBoundingClientRect();
      Z.ikut = false;
      setZoomPeta(Z.z * d / jarakCubit, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
    }
    jarakCubit = d;
  }
});
const lepasJari = (e) => { jari.delete(e.pointerId); if (jari.size < 2) jarakCubit = 0; };
bigMap.addEventListener("pointerup", lepasJari);
bigMap.addEventListener("pointercancel", lepasJari);
// habis menggeser jangan dianggap klik (supaya tidak tidak sengaja teleport)
bigMap.addEventListener("click", (e) => { if (digeser) { e.stopImmediatePropagation(); digeser = false; } }, true);
