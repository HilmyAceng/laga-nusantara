// =====================================================================
// LANTAI ES & PUZZLE SELUNCUR
//  - Petak ES (04e-dunia-baru.js) licin: begitu melangkah ke atasnya, pemain meluncur lurus
//    (arah utama gerakannya) sampai petak berikutnya padat, atau sampai tiba di petak bukan es.
//    Selama meluncur, tombol gerak tidak berpengaruh.
//  - `tujuanEs` { id, x, y }: berdiri di petak itu → puzzle selesai.
//  - Tombol "↺ Ulang" muncul saat berada di atas es puzzle: kembali ke TEKA_BARU[id].mulai.
// =====================================================================
"use strict";

let luncur = null;   // { dx, dy, tx, ty } petak tujuan saat ini
const LAJU_LUNCUR = 300;
const diAtasEs = (px, py) => tileAt(Math.floor(px / T), Math.floor(py / T)) === ES;

function petakBolehLuncur(tx, ty) { return !SOLID.has(tileAt(tx, ty)) && !padatTambahan(tx, ty); }
function mulaiLuncur(dx, dy) {
  const tx = Math.floor(P.x / T), ty = Math.floor(P.y / T);
  luncur = { dx, dy, tx, ty };
  majuLuncur();
}
// tentukan petak tujuan berikutnya dari petak sekarang
function majuLuncur() {
  const L = luncur, nx = L.tx + L.dx, ny = L.ty + L.dy;
  if (!petakBolehLuncur(nx, ny)) { luncur = null; return; }
  L.tx = nx; L.ty = ny;
}
{
  const asli = update;
  update = function (dt) {
    if (luncur && mode === "play" && P && !P.dead) {
      const sx = P.x, sy = P.y;
      asli(dt);
      P.x = sx; P.y = sy;
      const L = luncur, gx = (L.tx + 0.5) * T, gy = (L.ty + 0.5) * T, d = Math.hypot(gx - P.x, gy - P.y), v = LAJU_LUNCUR * dt;
      if (d <= v) {
        P.x = gx; P.y = gy;
        if (tileAt(L.tx, L.ty) === ES) majuLuncur(); else luncur = null;   // sampai di salju/lantai biasa: berhenti
      } else { P.x += (gx - P.x) / d * v; P.y += (gy - P.y) / d * v; }
      P.moving = false;
      if (Math.random() < 0.3) spark(P.x, P.y, "#e6f6ff", 1);
      return;
    }
    const lx = P ? P.x : 0, ly = P ? P.y : 0;
    asli(dt);
    // baru menginjak es sambil bergerak → mulai meluncur ke arah gerak utama
    if (mode === "play" && P && !P.dead && P.moving && diAtasEs(P.x, P.y)) {
      const mx = P.x - lx, my = P.y - ly;
      if (Math.abs(mx) + Math.abs(my) < 0.01) return;
      const [dx, dy] = Math.abs(mx) >= Math.abs(my) ? [Math.sign(mx), 0] : [0, Math.sign(my)];
      // rapikan ke tengah petak agar luncuran lurus
      P.x = (Math.floor(P.x / T) + 0.5) * T; P.y = (Math.floor(P.y / T) + 0.5) * T;
      mulaiLuncur(dx, dy);
    }
  };
}
SAAT_MASUK_AREA.push(() => { luncur = null; });

// ---------- Tujuan ----------
UPDATE_TAMBAHAN.push(() => {
  if (luncur || !P) return;
  const tx = Math.floor(P.x / T), ty = Math.floor(P.y / T);
  for (const o of area.objek || []) {
    if (o.kind !== "tujuanEs" || o.x !== tx || o.y !== ty || tekaSelesai(o.id)) continue;
    if (tekaBelumSaatnya(o.id)) { notifBelum("es:" + o.id, t("belum.benda") + " " + teksNanti(langkahTeka(o.id).l)); continue; }
    selesaiTeka(o.id);
  }
});
function ulangSeluncur(id) {
  const m = TEKA_BARU[id] && TEKA_BARU[id].mulai; if (!m) return;
  luncur = null; P.x = (m[0] + 0.5) * T; P.y = (m[1] + 0.5) * T; cam.x = P.x; cam.y = P.y;
  spark(P.x, P.y - 20, "#bfe8ff", 12); sfx.click();
}
// puzzle es terdekat (untuk tombol ulang)
function tekaEsDekat() {
  if (!area || !diAtasEs(P.x, P.y)) return null;
  let best = null, jarak = 1e9;
  for (const o of area.objek || []) if (o.kind === "tujuanEs" && !tekaSelesai(o.id)) { const m = TEKA_BARU[o.id].mulai, d = Math.hypot(m[0] * T - P.x, m[1] * T - P.y); if (d < jarak) { jarak = d; best = o.id; } }
  return best;
}
{
  const b = document.createElement("button");
  b.id = "btnUlangEs"; b.type = "button"; b.hidden = true; b.textContent = "↺";
  document.querySelector(".stage").appendChild(b);
  b.addEventListener("click", () => { const id = tekaEsDekat(); if (id) ulangSeluncur(id); });
}
UPDATE_TAMBAHAN.push(() => {
  const b = $("btnUlangEs"), id = mode === "play" && P ? tekaEsDekat() : null;
  if (b.hidden !== !id) b.hidden = !id;
  if (id) { const k = Lx(["↺ Ulang es", "↺ Reset ice"]); if (b.textContent !== k) b.textContent = k; }
});
{
  const asli = showUI;
  showUI = function () { asli(); if (mode !== "play") $("btnUlangEs").hidden = true; };
}
