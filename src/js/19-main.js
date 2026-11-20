// =====================================================================
// LOOP UTAMA
// Detak game: update → gambar → musik → HUD, diulang tiap frame.
// File ini dimuat paling akhir.
// =====================================================================
"use strict";

let prev = performance.now(), miniT = 0;
function frame(now) {
  const dt = Math.min(0.033, (now - prev) / 1000); prev = now;
  update(dt);
  render(now);
  drawPreviews(now / 1000);
  if (mode === "map") drawBigMap(now / 1000);
  if (actx) playMusic(pickMusic());
  if (mode !== "select" && P) { refreshHud(false); miniT -= dt; if (miniT <= 0) { miniT = 0.2; drawMini(); } }
  requestAnimationFrame(frame);
}

// Tab disembunyikan → simpan & jeda. Ukuran jendela berubah → atur ulang kanvas.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) { save(); if (mode === "play") togglePause(); if (actx) actx.suspend(); }
  else if (actx) actx.resume();
});
addEventListener("resize", resize);

const saved0 = store.get(SAVE_KEY, null);
if (saved0 && CLASSES[saved0.cls]) chosen = saved0.cls;
buildMiniBase();
buildSelect(); showUI();
requestAnimationFrame(frame);
