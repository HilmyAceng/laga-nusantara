// =====================================================================
// LOOP UTAMA
// Detak game: update → gambar → musik → HUD, diulang tiap frame.
// File ini dimuat paling akhir.
// =====================================================================
"use strict";

let prev = performance.now(), miniT = 0, autoSaveT = 3;
function frame(now) {
  const dt = Math.min(0.033, (now - prev) / 1000); prev = now;
  update(dt * skalaWaktu(dt));   // hindar sempurna: waktu melambat (50-hindar-tangkis.js)
  render(now);
  drawPreviews(now / 1000);
  if (mode === "map") drawBigMap(now / 1000);
  if (actx) playMusic(pickMusic());
  // simpan otomatis tiap 3 detik selama bermain (posisi ikut tersimpan)
  if (mode === "play") { autoSaveT -= dt; if (autoSaveT <= 0) { autoSaveT = 3; save(); } }
  if (mode !== "select" && P) { refreshHud(false); miniT -= dt; if (miniT <= 0) { miniT = 0.2; drawMini(); } }
  requestAnimationFrame(frame);
}

// Tab disembunyikan → simpan & jeda. Ukuran jendela berubah → atur ulang kanvas.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) { save(); if (mode === "play") togglePause(); if (actx) actx.suspend(); }
  else if (actx) actx.resume();
});
addEventListener("resize", resize);
// halaman ditutup / di-refresh → simpan dulu
addEventListener("pagehide", save);

const saved0 = store.get(SAVE_KEY, null);
if (saved0 && CLASSES[saved0.cls]) chosen = saved0.cls;
buildMiniBase();
terapkanSemua(); showUI();
requestAnimationFrame(frame);
