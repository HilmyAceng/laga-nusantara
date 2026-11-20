// =====================================================================
// MONSTER BAB 6-10 (bayangan Kalamurka)
// Gambar: Tikus Sawah, Bayangan, Jerangkong, Belut Listrik, Roh Angin,
// Prajurit Bayang, Lelembut, serta bos Raja Jerangkong, Gurita Raksasa,
// Rajawali Petir, Penjaga Menara (pola serangannya "umum", 35-monster-dunia-baru.js).
// Prabu Kalamurka ada di 46-kalamurka.js.
// =====================================================================
"use strict";

WARNA_BAHAYA.petir = "#ffe066";

function gambarKerangka(s, w, mahkota) {
  ctx.save(); ctx.scale(s, s);
  const tulang = putih(w, "#e9e2c8"), gelap = "#2b2238";
  ctx.strokeStyle = tulang; ctx.lineWidth = 3; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(-4, -14); ctx.moveTo(6, 0); ctx.lineTo(4, -14); ctx.stroke();     // kaki
  ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(0, -34); ctx.stroke();                                          // tulang punggung
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-8, -18 - i * 5); ctx.quadraticCurveTo(0, -15 - i * 5, 8, -18 - i * 5); ctx.stroke(); }   // rusuk
  ctx.beginPath(); ctx.moveTo(-8, -32); ctx.lineTo(-14, -20); ctx.moveTo(8, -32); ctx.lineTo(16, -26); ctx.stroke();  // lengan
  ctx.fillStyle = tulang; ctx.beginPath(); ctx.arc(0, -42, 9, 0, 6.28); ctx.fill();
  ctx.fillStyle = gelap; ctx.fillRect(-5, -45, 4, 4); ctx.fillRect(2, -45, 4, 4); ctx.fillRect(-3, -37, 7, 2);
  if (mahkota) { ctx.fillStyle = "#c9a24a"; ctx.beginPath(); ctx.moveTo(-9, -49); ctx.lineTo(-7, -58); ctx.lineTo(-3, -52); ctx.lineTo(0, -60); ctx.lineTo(3, -52); ctx.lineTo(7, -58); ctx.lineTo(9, -49); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
function gambarHantu(hover, warna, w, time, mata) {
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = putih(w, warna);
  ctx.beginPath(); ctx.moveTo(-13, hover); ctx.quadraticCurveTo(-15, hover - 30, 0, hover - 32); ctx.quadraticCurveTo(15, hover - 30, 13, hover);
  for (let i = 0; i <= 4; i++) ctx.lineTo(13 - i * 6.5, hover + 12 + Math.sin(time * 7 + i) * 4 * (i % 2 ? 1 : -1));
  ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = mata; ctx.shadowColor = mata; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.arc(-4, hover - 18, 2.6, 0, 6.28); ctx.arc(5, hover - 18, 2.6, 0, 6.28); ctx.fill(); ctx.shadowBlur = 0;
}

Object.assign(GAMBAR_MONSTER, {
  tikusSawah(m, time, w) {
    const b = Math.abs(Math.sin(m.run * 1.6)) * 2;
    ctx.strokeStyle = putih(w, "#c99a8a"); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-14, -8); ctx.quadraticCurveTo(-28, -6, -30, -16 + Math.sin(time * 6) * 3); ctx.stroke();
    ctx.fillStyle = putih(w, "#6b5a50"); ctx.beginPath(); ctx.ellipse(0, -10 - b, 16, 9, 0, 0, 6.28); ctx.fill();
    ctx.beginPath(); ctx.ellipse(16, -12 - b, 9, 6, 0.2, 0, 6.28); ctx.fill();
    ctx.fillStyle = putih(w, "#c99a8a"); ctx.beginPath(); ctx.arc(10, -19 - b, 4, 0, 6.28); ctx.fill(); ctx.fillRect(23, -12 - b, 3, 3);
    ctx.fillStyle = "#ff4f4f"; ctx.fillRect(17, -15 - b, 2.5, 2.5);
  },
  bayangan(m, time, w) { gambarHantu(-30 + Math.sin(m.run * 0.6) * 5, "#1a1424", w, time, "#b88cff"); },
  jerangkong(m, time, w) { gambarKerangka(1, w, false); },
  rajaJerangkong(m, time, w) {
    gambarKerangka(2.1, w, true);
    ctx.save(); ctx.translate(34, -60); ctx.rotate(m.state === "ancang" ? -1.4 : -0.4);
    ctx.fillStyle = "#5d5868"; ctx.fillRect(-3, -50, 6, 60); ctx.fillStyle = putih(w, "#c9d6e3"); ctx.beginPath(); ctx.moveTo(-4, -50); ctx.lineTo(0, -70); ctx.lineTo(4, -50); ctx.fill();
    ctx.restore();
    ctx.fillStyle = "rgba(184,140,255,0.5)"; ctx.beginPath(); ctx.arc(0, -88, 6 + Math.sin(time * 4) * 2, 0, 6.28); ctx.fill();
  },
  belutListrik(m, time, w) {
    const geli = m.state === "charge" ? 3 : 1;
    for (let i = 8; i >= 0; i--) {
      const x = -i * 5, y = -8 + Math.sin(m.run * geli - i * 0.8) * 3;
      ctx.fillStyle = putih(w, i % 3 ? "#2a4a6a" : "#3a6a8f"); ctx.beginPath(); ctx.arc(x, y, 5.5 - i * 0.3, 0, 6.28); ctx.fill();
    }
    ctx.fillStyle = "#ffe066"; ctx.fillRect(4, -11 + Math.sin(m.run * geli) * 3, 2, 2);
    if (Math.sin(time * 20 + m.x) > 0.6) { ctx.strokeStyle = "#ffe066"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-20, -16); ctx.lineTo(-14, -10); ctx.lineTo(-10, -18); ctx.stroke(); }
  },
  rohAngin(m, time, w) {
    const hover = -32 + Math.sin(m.run * 0.6) * 6;
    ctx.strokeStyle = putih(w, "#dff4ff"); ctx.lineWidth = 3; ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(0, hover + i * 6, 14 - i * 3, time * 4 + i, time * 4 + i + 4); ctx.stroke(); }
    ctx.fillStyle = putih(w, "#9fd8ff"); ctx.beginPath(); ctx.arc(0, hover - 6, 7, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#1a3a5a"; ctx.fillRect(-3, hover - 8, 2, 2); ctx.fillRect(2, hover - 8, 2, 2);
  },
  prajuritBayang(m, time, w) {
    const b = m.state === "charge" ? Math.abs(Math.sin(m.run * 3)) * 3 : 0;
    ctx.fillStyle = putih(w, "#1a1424"); ctx.fillRect(-9, -16, 7, 16); ctx.fillRect(2, -16, 7, 16);
    ctx.beginPath(); ctx.moveTo(-14, -16 - b); ctx.lineTo(14, -16 - b); ctx.lineTo(10, -44 - b); ctx.lineTo(-10, -44 - b); ctx.closePath(); ctx.fill();   // jubah
    ctx.fillStyle = putih(w, "#3a3048"); ctx.beginPath(); ctx.arc(0, -50 - b, 9, 0, 6.28); ctx.fill();                                                     // helm
    ctx.fillRect(-10, -52 - b, 20, 3);
    ctx.fillStyle = "#b88cff"; ctx.fillRect(-5, -51 - b, 10, 2);
    ctx.fillStyle = "#5d5868"; ctx.fillRect(12, -50 - b, 3, 40); ctx.fillStyle = "#b88cff"; ctx.beginPath(); ctx.moveTo(10, -50 - b); ctx.lineTo(13.5, -62 - b); ctx.lineTo(17, -50 - b); ctx.fill();   // tombak
  },
  lelembut(m, time, w) { gambarHantu(-34 + Math.sin(m.run * 0.5) * 6, "#d9c8ff", w, time, "#5a2a8a"); },
  guritaRaksasa(m, time, w) {
    const b = Math.sin(m.run * 0.4) * 3, kulit = putih(w, m.fase2 ? "#a13a5a" : "#c9506a"), terang = putih(w, "#ff8fa8");
    // tentakel
    for (let i = 0; i < 8; i++) {
      const a0 = Math.PI * 0.1 + (i / 7) * Math.PI * 0.8, panjang = 60 + (i % 2) * 14;
      ctx.strokeStyle = kulit; ctx.lineWidth = 10 - (i % 3); ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(Math.cos(a0) * 26 - 0, -26);
      ctx.quadraticCurveTo(Math.cos(a0) * panjang, -10 + Math.sin(time * 3 + i) * 10, Math.cos(a0) * (panjang + 14) + Math.sin(time * 2 + i) * 8, 4);
      ctx.stroke();
    }
    ctx.fillStyle = kulit; ctx.beginPath(); ctx.ellipse(0, -56 - b, 34, 40, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = terang; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-18 + i * 9, -70 - b + (i % 2) * 6, 3, 0, 6.28); ctx.fill(); }
    ctx.fillStyle = "#ffe066"; ctx.beginPath(); ctx.ellipse(-11, -48 - b, 7, 5, 0, 0, 6.28); ctx.ellipse(13, -48 - b, 7, 5, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#1a1020"; ctx.fillRect(-12, -51 - b, 3, 6); ctx.fillRect(12, -51 - b, 3, 6);
  },
  rajawaliPetir(m, time, w) {
    const hover = -66 + Math.sin(m.run * 0.5) * 6, kepak = Math.sin(m.run * 1.4) * 20, bulu = putih(w, "#3a4a6a");
    ctx.fillStyle = bulu;
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, hover); ctx.lineTo(s * 70, hover - 22 - kepak); ctx.lineTo(s * 56, hover - 4); ctx.lineTo(s * 74, hover + 4 - kepak * 0.4); ctx.lineTo(s * 20, hover + 14); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = putih(w, "#2a3450"); ctx.beginPath(); ctx.ellipse(0, hover + 6, 18, 24, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = putih(w, "#f2efe6"); ctx.beginPath(); ctx.arc(8, hover - 22, 13, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#f4b942"; ctx.beginPath(); ctx.moveTo(18, hover - 24); ctx.lineTo(30, hover - 18); ctx.lineTo(18, hover - 16); ctx.fill();
    ctx.fillStyle = "#ffe066"; ctx.shadowColor = "#ffe066"; ctx.shadowBlur = 10; ctx.fillRect(10, hover - 26, 4, 4); ctx.shadowBlur = 0;
    if (Math.sin(time * 9) > 0.3) { ctx.strokeStyle = "#ffe066"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-40, hover - 10); ctx.lineTo(-30, hover); ctx.lineTo(-36, hover + 6); ctx.lineTo(-24, hover + 16); ctx.stroke(); }
  },
  penjagaMenara(m, time, w) {
    const b = Math.sin(m.run * 0.4) * 2, angkat = m.state === "ancang" ? clamp(1 - m.st, 0, 1) : 0;
    const baja = putih(w, "#2e2a3a"), kilau = putih(w, "#5d5070");
    ctx.fillStyle = baja; ctx.fillRect(-22, -30, 16, 30); ctx.fillRect(6, -30, 16, 30);
    ctx.fillStyle = putih(w, "#1a1424"); ctx.beginPath(); ctx.moveTo(-34, -30); ctx.lineTo(34, -30); ctx.lineTo(28, -84 - b); ctx.lineTo(-28, -84 - b); ctx.closePath(); ctx.fill();   // jubah
    ctx.fillStyle = kilau; ctx.fillRect(-26, -84 - b, 52, 30);                                                                                                // zirah dada
    ctx.fillStyle = baja; ctx.beginPath(); ctx.arc(0, -98 - b, 17, 0, 6.28); ctx.fill(); ctx.fillRect(-17, -100 - b, 34, 6);
    ctx.fillStyle = "#b88cff"; ctx.shadowColor = "#b88cff"; ctx.shadowBlur = 12; ctx.fillRect(-10, -99 - b, 20, 3); ctx.shadowBlur = 0;
    ctx.save(); ctx.translate(34, -70 - b); ctx.rotate(-0.3 - angkat * 1.3);
    ctx.fillStyle = "#5d5868"; ctx.fillRect(-3, -70, 6, 80); ctx.fillStyle = "#b88cff"; ctx.beginPath(); ctx.moveTo(-10, -70); ctx.lineTo(0, -96); ctx.lineTo(10, -70); ctx.fill();
    ctx.restore();
  },
});
