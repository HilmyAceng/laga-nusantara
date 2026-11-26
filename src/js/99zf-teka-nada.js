// =====================================================================
// PUZZLE NADA (gamelan): pukul `bilah` sesuai urutan di TEKA_BARU[id].urutan
//  - Tiap bilah berbunyi nadanya (laras slendro, 08-musik.js) dan nadanya melayang sebentar.
//  - Salah satu nada → urutan diulang dari awal + muncul monster hukuman.
//  - `esBernyanyi`: membunyikan seluruh lagu sambil menyalakan bilahnya satu per satu
//    (petunjuk untuk nada yang tertutup es di prasasti).
// =====================================================================
"use strict";

let nadaDipukul = {};        // id puzzle → nada yang sudah benar
let bilahNyala = {};         // "id:nada" → sisa waktu menyala
let laguEs = null;           // { id, i, t } lagu yang sedang dinyanyikan es

function bunyiBilah(nada) {
  if (!audio() || !sfxBus) return;
  const f = parseNote(nada) || NADA_DASAR;
  SUARA.saron(f, actx.currentTime, 0.45, sfxBus);
}
function nyalakanBilah(id, nada, lama = 0.6) { bilahNyala[id + ":" + nada] = lama; }

TEKA_BICARA.bilah = function (n) {
  const id = n.tekaId, P0 = TEKA_BARU[id];
  bunyiBilah(n.nada); nyalakanBilah(id, n.nada);
  efekTeksMelayang(n.x, n.y - 54, String(n.nada), "#ffe7a8");
  if (tekaSelesai(id)) return;
  const sudah = (nadaDipukul[id] = nadaDipukul[id] || []);
  if (P0.urutan[sudah.length] !== String(n.nada)) {
    nadaDipukul[id] = [];
    sfx.hurt(); shake = 0.25;
    toast(Lx(["Nadanya sumbang... ulangi dari awal.", "That note was off... start over."]), false);
    if (P0.hukuman && Math.random() < 0.6) { const a = rand(0, 6.28), m = makeMonster(P0.hukuman, { x: P.x + Math.cos(a) * 120, y: P.y + Math.sin(a) * 120 }); if (!solidAt(m.x, m.y)) { m.aggro = true; m.state = "chase"; monsters.push(m); } }
    return;
  }
  sudah.push(String(n.nada));
  if (sudah.length === P0.urutan.length) {
    setTimeout(() => { P0.urutan.forEach((nd, i) => setTimeout(() => { bunyiBilah(nd); nyalakanBilah(id, nd, 0.5); }, i * 220)); }, 300);
    setTimeout(() => selesaiTeka(id), 300 + P0.urutan.length * 220);
  } else notifItem(`♪ ${sudah.length} / ${P0.urutan.length}`);
};
TEKA_BICARA.esBernyanyi = function (n) {
  if (laguEs) return;
  laguEs = { id: n.tekaId, i: 0, t: 0.4 };
  toast(Lx(["Es itu berdenting pelan... dengarkan & perhatikan bilah yang menyala.", "The ice chimes softly... listen and watch which keys light up."]), false);
};
UPDATE_TAMBAHAN.push((dt) => {
  for (const k in bilahNyala) { bilahNyala[k] -= dt; if (bilahNyala[k] <= 0) delete bilahNyala[k]; }
  if (!laguEs) return;
  laguEs.t -= dt;
  if (laguEs.t > 0) return;
  const ur = TEKA_BARU[laguEs.id].urutan;
  if (laguEs.i >= ur.length) { laguEs = null; return; }
  const nd = ur[laguEs.i++];
  bunyiBilah(nd); nyalakanBilah(laguEs.id, nd, 0.5); laguEs.t = 0.75;
});
SAAT_MASUK_AREA.push(() => { nadaDipukul = {}; laguEs = null; bilahNyala = {}; });

// teks kecil melayang ke atas (dipakai juga puzzle lain)
let teksMelayang = [];
function efekTeksMelayang(x, y, teks, warna) { teksMelayang.push({ x, y, teks, warna, t: 0 }); }
UPDATE_TAMBAHAN.push((dt) => { for (const e of teksMelayang) e.t += dt; teksMelayang = teksMelayang.filter((e) => e.t < 1.1); });
GAMBAR_ATAS.push(() => {
  for (const e of teksMelayang) {
    ctx.globalAlpha = Math.max(0, 1 - e.t / 1.1); ctx.font = "800 18px Teko, sans-serif"; ctx.textAlign = "center";
    ctx.fillStyle = e.warna; ctx.fillText(e.teks, e.x, e.y - e.t * 30);
  }
  ctx.globalAlpha = 1;
});

// ---------- Gambar ----------
GAMBAR_OBJEK.bilah = function (n, time) {
  const x = n.x, y = n.y, es = n.gaya === "es", nyala = bilahNyala[n.tekaId + ":" + n.nada] || 0;
  const nada = parseInt(n.nada, 10), tinggi = 10 + (String(n.nada).includes("'") ? 7 : nada) * 1.6;
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 18, 5, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = es ? "#6f9ab8" : "#5b3a24"; ctx.fillRect(x - 17, y - 14, 34, 12);                 // rancakan
  ctx.fillStyle = es ? "#4a7090" : "#3a2618"; ctx.fillRect(x - 17, y - 4, 4, 4); ctx.fillRect(x + 13, y - 4, 4, 4);
  if (nyala > 0) { const g = ctx.createRadialGradient(x, y - 22, 2, x, y - 22, 46); g.addColorStop(0, es ? "rgba(190,232,255,0.8)" : "rgba(255,220,130,0.8)"); g.addColorStop(1, "rgba(255,220,130,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y - 22, 46, 0, 6.28); ctx.fill(); }
  ctx.fillStyle = es ? (nyala > 0 ? "#ffffff" : "#bfe8ff") : (nyala > 0 ? "#ffe9a8" : "#c9a24a");
  roundRect(ctx, x - 15, y - 16 - tinggi * 0.4, 30, 9, 3); ctx.fill();                              // bilah logam/es
  ctx.fillStyle = es ? "#3a6a9a" : "#5b3a24"; ctx.font = "800 12px Nunito, sans-serif"; ctx.textAlign = "center";
  ctx.fillText(String(n.nada), x, y - 9 - tinggi * 0.4);
  labelObjek(n, "#ffffff", 40);
};
GAMBAR_OBJEK.esBernyanyi = function (n, time) {
  const x = n.x, y = n.y, k = laguEs ? 0.8 : 0.35 + 0.15 * Math.sin(time * 2);
  ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.beginPath(); ctx.ellipse(x, y, 20, 6, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = `rgba(190,232,255,${k})`; ctx.beginPath(); ctx.moveTo(x - 16, y); ctx.lineTo(x - 6, y - 56); ctx.lineTo(x + 2, y - 30); ctx.lineTo(x + 10, y - 64); ctx.lineTo(x + 16, y); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.lineWidth = 1.5; ctx.stroke();
  if (laguEs) for (let i = 0; i < 3; i++) { ctx.fillStyle = "#ffffff"; ctx.font = "800 14px Teko"; ctx.fillText("♪", x - 20 + i * 18, y - 70 - ((time * 40 + i * 12) % 30)); }
  labelObjek(n, "#bfe8ff", 78);
};
