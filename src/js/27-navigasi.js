// =====================================================================
// NAVIGASI
// Membantu pemain tahu harus ke mana:
//  - panah emas di tepi layar menuju tujuan cerita (atau gerbang menuju
//    area tujuan), dengan jarak dalam meter (1 petak = 1 m)
//  - titik tujuan untuk peta mini & peta besar (bintang emas)
//  - jalur antar-area (dipakai peta dunia)
// Panah bisa dimatikan: Pengaturan › Layar › Panah tujuan.
// =====================================================================
"use strict";

const PANAH_KEY = "laga.panah";
let panahNyala = store.get(PANAH_KEY, true) !== false;
let panahSudut = null;   // arah panah yang dihaluskan

// Jalur terpendek antar-area lewat gerbang: ["alam", "rawa", "pesisir"]
function jalurArea(dari, ke) {
  if (dari === ke) return [dari];
  const prev = { [dari]: null }, antre = [dari];
  while (antre.length) {
    const a = antre.shift();
    for (const g of AREAS[a].gerbang) {
      if (g.ke in prev || !gerbangTerbuka(g)) continue;
      prev[g.ke] = a;
      if (g.ke === ke) { const j = [ke]; let x = a; while (x) { j.unshift(x); x = prev[x]; } return j; }
      antre.push(g.ke);
    }
  }
  return null;
}
// Tujuan di area sekarang: titik tujuan itu sendiri, atau gerbang menuju area berikutnya.
function tujuanDiArea() {
  if (!S || !P) return null;
  const tg = targetLacak();   // misi yang sedang dilacak (30-daftar-misi.js)
  if (!tg) return null;
  if (tg.area === areaId) return tg.x != null ? { x: tg.x, y: tg.y, npc: tg.npc } : null;
  const jalur = jalurArea(areaId, tg.area);
  if (!jalur || jalur.length < 2) return null;
  const g = area.gerbang.find((x) => x.ke === jalur[1]);
  if (!g) return null;
  return { x: (g.x0 + g.x1 + 1) / 2 * T, y: (g.y0 + g.y1 + 1) / 2 * T, ke: jalur[1] };
}

// Panah di layar. toScreen(x, y) → [sx, sy] (piksel layar).
function drawPanahTujuan(toScreen, time) {
  if (!panahNyala) return;
  const tj = tujuanDiArea();
  if (!tj) { panahSudut = null; return; }
  const [sx, sy] = toScreen(tj.x, tj.y), [px, py] = toScreen(P.x, P.y - 20);
  // batas aman: hindari kotak misi (atas) dan tombol/jurus (bawah)
  const m = 46, atas = 96, bawah = isTouch ? 150 : 110;
  const dalam = sx > m && sx < W - m && sy > atas && sy < H - bawah;
  const jarak = Math.round(dist(P, tj) / T);
  if (jarak < 2) return;
  ctx.save();
  if (dalam) {
    // tujuan terlihat: panah kecil memantul di atasnya (NPC sudah punya tanda sendiri)
    if (!tj.npc) {
      const by = sy - 40 + Math.sin(time * 5) * 5;
      ctx.fillStyle = "#f4b942"; ctx.strokeStyle = "#1b1208"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(sx - 10, by - 12); ctx.lineTo(sx + 10, by - 12); ctx.lineTo(sx, by); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
  } else {
    // di luar layar: panah mengitari hero pada jarak TETAP (tidak melompat dekat-jauh mengikuti tepi layar),
    // arahnya dihaluskan supaya tidak bergoyang
    const aTarget = Math.atan2(sy - py, sx - px);
    if (panahSudut == null) panahSudut = aTarget;
    panahSudut += Math.atan2(Math.sin(aTarget - panahSudut), Math.cos(aTarget - panahSudut)) * 0.18;
    const a = panahSudut, R = clamp(Math.min(W, H) * 0.24, 70, 120);
    const ax = clamp(px + Math.cos(a) * R, m, W - m), ay = clamp(py + Math.sin(a) * R, atas * 0.6, H - bawah * 0.6);
    ctx.translate(ax, ay);
    ctx.fillStyle = "rgba(20,14,34,0.6)"; ctx.beginPath(); ctx.arc(0, 0, 17, 0, 6.28); ctx.fill();
    ctx.rotate(a);
    ctx.fillStyle = "#f4b942"; ctx.beginPath(); ctx.moveTo(11, 0); ctx.lineTo(-6, -8); ctx.lineTo(-2, 0); ctx.lineTo(-6, 8); ctx.closePath(); ctx.fill();
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.font = "700 15px Teko, sans-serif"; ctx.textAlign = "center"; ctx.lineWidth = 3; ctx.strokeStyle = "rgba(10,6,20,0.85)";
    const teks = (tj.ke ? AREAS[tj.ke].nama + " · " : "") + jarak + " m";
    const ly = ay + (Math.sin(a) > 0 ? 32 : -24);
    const lx = clamp(ax, 70, W - 70);
    ctx.strokeText(teks, lx, ly); ctx.fillStyle = "#f4b942"; ctx.fillText(teks, lx, ly);
  }
  ctx.restore();
}

// Bintang tujuan untuk peta (c = konteks kanvas, ukuran u)
function bintang(c, x, y, u, time) {
  const r = (7 + Math.sin(time * 5)) * u;
  c.save(); c.translate(x, y);
  c.fillStyle = "#f4b942"; c.strokeStyle = "#1b1208"; c.lineWidth = 1.5 * u;
  c.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; c.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  c.closePath(); c.fill(); c.stroke();
  c.restore();
}

// Pengaturan › Layar › Panah tujuan
function refreshPanah() {
  const b = $("btnPanah");
  b.textContent = t(panahNyala ? "set.nyala" : "set.mati");
  b.setAttribute("aria-pressed", String(panahNyala));
}
$("btnPanah").addEventListener("click", () => { panahNyala = !panahNyala; store.set(PANAH_KEY, panahNyala); refreshPanah(); sfx.click(); });
refreshPanah();
