// =====================================================================
// LAYAR JUDUL
// Layar pilih hero (gambar hero bergerak) dan mulai permainan.
// =====================================================================
"use strict";

function buildSelect() {
  const wrap = $("heroes"); wrap.innerHTML = "";
  for (const [id, c] of Object.entries(CLASSES)) {
    const b = document.createElement("button"); b.type = "button"; b.className = "hero"; b.dataset.id = id;
    b.setAttribute("aria-pressed", String(id === chosen));
    b.innerHTML = `<canvas></canvas><b>${c.name}</b><span class="role">${c.role} · ${t("judul.nyawa")} ${c.hp}</span><p class="desc">${c.desc}</p>`;
    b.addEventListener("click", () => { chosen = id; wrap.querySelectorAll(".hero").forEach((x) => x.setAttribute("aria-pressed", String(x.dataset.id === id))); });
    wrap.appendChild(b);
  }
  const saved = store.get(SAVE_KEY, null);
  const cont = $("btnCont");
  if (saved && CLASSES[saved.cls]) { cont.hidden = false; cont.textContent = t("judul.lanjutkan", { kelas: CLASSES[saved.cls].name, lv: saved.lv, area: saved.pos && AREAS[saved.pos.area] ? " · " + AREAS[saved.pos.area].nama : "" }); $("btnNew").textContent = t("judul.mulaiBaru"); }
  else { cont.hidden = true; $("btnNew").textContent = t("judul.mulai"); $("btnNew").className = "go"; }
}
const previews = {};
for (const id of Object.keys(CLASSES)) previews[id] = { x: 70, y: 96, face: 0.3, run: 0, moving: false, swing: 0, swingDur: 0.3, inv: 0, flash: 0 };
function drawPreviews(time) {
  if (mode !== "select") return;
  document.querySelectorAll(".hero").forEach((b) => {
    const c = b.querySelector("canvas").getContext("2d"), id = b.dataset.id, C = CLASSES[id], e = previews[id];
    // Ukuran gambar mengikuti ukuran kotak di layar, supaya hero tidak gepeng/melar.
    const cv = c.canvas, dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = Math.round(cv.clientWidth * dpr), H = Math.round(cv.clientHeight * dpr);
    if (!W || !H) return;
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = "#3d7a37"; c.fillRect(0, 0, W, H);
    const k = H / 80;                     // tinggi kotak = 80 satuan dunia game
    c.setTransform(k, 0, 0, k, 0, 0);
    e.x = W / k / 2 - 6; e.y = 70;
    const sel = id === chosen;
    e.moving = sel; e.run = time * 10;
    const ph = (time * 0.8) % 1.6;
    e.swing = sel && ph < 0.3 ? 0.3 - ph : 0;
    drawPerson(c, e, { color: C.color, accent: C.accent, weapon: C.weapon }, time, { preview: true });
  });
}

function startGame(fresh) {
  if (fresh) { S = newSave(chosen); save(); }
  // simpanan lama: catat Genderuwo yang sudah kalah & area tempat terakhir sebagai sudah dikunjungi
  if (S.bossDown) S.bos.genderuwo = true;
  if (S.pos && AREAS[S.pos.area]) S.dikunjungi[S.pos.area] = true;
  P = makePlayer();
  // Lanjutkan: kembali ke area & titik terakhir (kalau datanya masih cocok dengan peta)
  const pos = !fresh && S.pos;
  if (pos && AREAS[pos.area]) {
    loadArea(pos.area);
    if (pos.x > 0 && pos.y > 0 && pos.x < MW && pos.y < MH && !solidAt(pos.x * T, pos.y * T)) {
      P.x = pos.x * T; P.y = pos.y * T;
      if (pos.hp > 0) P.hp = Math.min(maxHp(), pos.hp);
    } else loadArea("desa");
  } else loadArea("desa");
  P.inv = 1.5; // kebal sebentar saat baru muncul
  cam.x = P.x; cam.y = P.y - 20;
  mode = "play"; showUI(); refreshHud(true);
  sfx.start();
  if (fresh) toast(t("toast.mulai"), false);
  else toast(t("toast.lanjut", { area: area.nama }), false);
}

// Tombol di layar judul
$("btnNew").addEventListener("click", () => startGame(true));
$("btnCont").addEventListener("click", () => { const s = store.get(SAVE_KEY, null); if (s && CLASSES[s.cls]) { S = Object.assign(newSave(s.cls), s); chosen = S.cls; startGame(false); } });
