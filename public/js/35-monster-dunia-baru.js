// =====================================================================
// MONSTER DUNIA 2 & 3
//  - Pola serangan bos "umum" (dipakai Siluman Ular, Panglima Karang,
//    Kelabang Raksasa). Urutan serangannya dari `pola` di MONSTERS:
//      sembur  : peluru menyebar ke arah pemain
//      terjang : menerjang lurus (tanda merah memanjang)
//      hantam  : hantaman di sekeliling (dipakai otomatis bila pemain dekat)
//      hujan   : lingkaran bahaya di sekitar pemain (`jenisHujan`: racun / air / batu / api)
//    Di bawah 50% nyawa: marah, lebih cepat, memanggil 2 `anak`, sembur jadi melingkar.
//  - Gambar semua monster baru dunia 2 & 3 (kecuali naga: 36-naga.js)
// =====================================================================
"use strict";

AI_BOS.umum = function (m, dt, dp, toP) {
  if (bosUmum(m, dt, dp, toP)) return;
  const d = m.d, cepat = m.fase2 ? 1.3 : 1;
  m.cd -= dt;
  if (m.state === "kejar") {
    kejar(m, dt, toP, d.range + d.r, cepat);
    if (m.cd > 0) return;
    m.urut = ((m.urut ?? -1) + 1) % d.pola.length;
    let s = d.pola[m.urut];
    if (d.pola.includes("hantam") && dp < d.range + d.r + 30) s = "hantam";
    if (s === "hujan") {
      const n = m.fase2 ? 6 : 4;
      for (let i = 0; i < n; i++) { const a = rand(0, 6.28), r = i === 0 ? 0 : rand(35, 130); tandaBahaya(P.x + Math.cos(a) * r, P.y + Math.sin(a) * r, 42, 1.05, d.atk * 0.85, d.jenisHujan || "batu"); }
      sfx.growl(); m.cd = 2.1 / cepat;
      return;
    }
    m.state = "ancang"; m.serang = s; m.ang = toP;
    m.st = s === "sembur" ? 0.6 : 0.9;
    if (s !== "sembur") sfx.growl();
  } else if (m.state === "ancang") {
    m.st -= dt * cepat;
    if (m.serang === "sembur" || (m.serang === "terjang" && m.st > 0.25)) m.ang = toP;
    if (m.st > 0) return;
    if (m.serang === "hantam") {
      shake = 0.5; sfx.slam(); effects.push({ kind: "ring", x: m.x, y: m.y, r: 150, t: 0, dur: 0.5, red: true });
      if (dp < 150 + P.r) hurtPlayer(d.atk * 1.3, toP);
      m.state = "kejar"; m.cd = d.cd / cepat;
    } else if (m.serang === "sembur") {
      const n = m.fase2 ? 7 : 5, lebar = m.fase2 ? 1.3 : 0.9;
      for (let i = 0; i < n; i++) tembak(m, m.ang - lebar / 2 + (lebar * i) / (n - 1), 260, d.atk * 0.7, 10);
      if (m.fase2) for (let i = 0; i < 8; i++) tembak(m, (i / 8) * 6.28 + 0.2, 180, d.atk * 0.55, 8);
      sfx.fire(); m.state = "kejar"; m.cd = d.cd / cepat;
    } else { m.state = "terjang"; m.st = 0.75; m.hitP = false; sfx.charge(); }
  } else if (m.state === "terjang") {
    m.st -= dt;
    const bx = m.x, by = m.y;
    moveEnt(m, Math.cos(m.ang) * 540 * dt, Math.sin(m.ang) * 540 * dt);
    if (!m.hitP && dist(m, P) < d.r + P.r + 6) { m.hitP = true; hurtPlayer(d.atk * 1.2, m.ang); }
    if (m.st <= 0 || (bx === m.x && by === m.y)) { m.state = "lelah"; m.st = 0.8; shake = 0.2; }
  } else if (m.state === "lelah") { m.st -= dt; if (m.st <= 0) { m.state = "kejar"; m.cd = d.cd / cepat; } }
};

// ---------- Gambar ----------
const putih = (w, c) => (w ? "#fff" : c);
Object.assign(GAMBAR_MONSTER, {
  ularWelang(m, time, w) { gambarUlar(m, time, w, 1, "#1d1d22", "#f2ead8"); },
  silumanUlar(m, time, w) {
    // badan ular besar + tubuh atas perempuan bermahkota
    gambarUlar(m, time, w, 2.2, m.fase2 ? "#2f6b2a" : "#3d8a3a", "#c9e27a");
    const b = Math.sin(m.run * 0.5) * 3, angkat = m.state === "ancang" ? 6 : 0;
    ctx.fillStyle = putih(w, "#3d8a3a"); ctx.beginPath(); ctx.ellipse(10, -46 - b - angkat, 14, 22, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = putih(w, "#e3ae7f"); ctx.beginPath(); ctx.arc(12, -72 - b - angkat, 11, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#1a1420"; ctx.beginPath(); ctx.arc(10, -75 - b - angkat, 12, Math.PI, 0); ctx.fill(); ctx.fillRect(-2, -76 - b - angkat, 6, 26);
    ctx.fillStyle = "#f4b942"; ctx.beginPath(); ctx.moveTo(1, -82 - b - angkat); ctx.lineTo(5, -94 - b - angkat); ctx.lineTo(10, -85 - b - angkat); ctx.lineTo(14, -96 - b - angkat); ctx.lineTo(18, -85 - b - angkat); ctx.lineTo(22, -92 - b - angkat); ctx.lineTo(23, -81 - b - angkat); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#c9e27a"; ctx.fillRect(14, -74 - b - angkat, 3, 3); ctx.fillRect(19, -74 - b - angkat, 3, 3);
  },
  uburUbur(m, time, w) {
    const hover = -34 + Math.sin(m.run * 0.5) * 6;
    ctx.globalAlpha = 0.85;
    const g = ctx.createRadialGradient(0, hover - 6, 2, 0, hover - 6, 20);
    g.addColorStop(0, putih(w, "#ffe08a")); g.addColorStop(1, putih(w, "#ff6b9a"));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, hover, 17, Math.PI, 0); ctx.quadraticCurveTo(0, hover + 8, -17, hover); ctx.fill();
    ctx.strokeStyle = putih(w, "#ff9fbf"); ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) { const x = -12 + i * 6; ctx.beginPath(); ctx.moveTo(x, hover + 2); ctx.quadraticCurveTo(x + Math.sin(time * 5 + i) * 6, hover + 14, x + Math.sin(time * 4 + i) * 4, hover + 26); ctx.stroke(); }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#3a1428"; ctx.fillRect(-6, hover - 6, 3, 4); ctx.fillRect(4, hover - 6, 3, 4);
  },
  harimauKumbang(m, time, w) {
    const run = Math.sin(m.run * 1.3), b = Math.abs(run) * 2;
    ctx.fillStyle = putih(w, "#16141c");
    ctx.fillRect(-16 + run * 3, -10, 5, 10); ctx.fillRect(10 - run * 3, -10, 5, 10);           // kaki
    ctx.beginPath(); ctx.ellipse(0, -16 - b, 22, 10, 0, 0, 6.28); ctx.fill();                       // badan
    ctx.beginPath(); ctx.arc(22, -22 - b, 10, 0, 6.28); ctx.fill();                                // kepala
    ctx.beginPath(); ctx.moveTo(16, -30 - b); ctx.lineTo(18, -37 - b); ctx.lineTo(22, -31 - b); ctx.moveTo(24, -31 - b); ctx.lineTo(28, -37 - b); ctx.lineTo(29, -29 - b); ctx.fill();
    ctx.strokeStyle = putih(w, "#16141c"); ctx.lineWidth = 4; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-20, -18 - b); ctx.quadraticCurveTo(-34, -24, -30, -36 + Math.sin(time * 4) * 3); ctx.stroke();  // ekor
    ctx.fillStyle = "#f4d35e"; ctx.fillRect(24, -25 - b, 3, 2.5); ctx.fillRect(28, -25 - b, 2.5, 2.5);
    ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.beginPath(); ctx.ellipse(-4, -22 - b, 12, 3, 0, 0, 6.28); ctx.fill();
  },
  hantuBajak(m, time, w) {
    const hover = -6 + Math.sin(m.run * 0.6) * 3;
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = putih(w, "#9fb4c7");
    ctx.beginPath(); ctx.moveTo(-12, hover - 34); ctx.lineTo(12, hover - 34); ctx.lineTo(14, hover - 6);
    for (let i = 0; i <= 4; i++) ctx.lineTo(14 - i * 7, hover + Math.sin(time * 6 + i) * 3 * (i % 2 ? 1 : -1));
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = putih(w, "#5b2a3a"); ctx.fillRect(-12, hover - 24, 26, 6);                         // ikat pinggang
    ctx.fillStyle = putih(w, "#c9d6e3"); ctx.beginPath(); ctx.arc(1, hover - 42, 10, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#1a1420"; ctx.beginPath(); ctx.moveTo(-14, hover - 45); ctx.lineTo(16, hover - 45); ctx.lineTo(10, hover - 56); ctx.lineTo(-8, hover - 56); ctx.closePath(); ctx.fill();   // topi
    ctx.fillStyle = "#f2ead8"; ctx.fillRect(-2, hover - 53, 6, 4);
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#1a1420"; ctx.fillRect(2, hover - 44, 7, 4);                                      // penutup mata
    ctx.fillStyle = "#6fd3ff"; ctx.fillRect(-4, hover - 44, 3, 3);
    ctx.strokeStyle = "#5c616b"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(12, hover - 26); ctx.lineTo(26, hover - 30); ctx.stroke();   // pistol
  },
  panglimaKarang(m, time, w) {
    const b = Math.sin(m.run * 0.4) * 2, angkat = m.state === "ancang" ? clamp(1 - m.st, 0, 1) : 0;
    const karang = putih(w, m.fase2 ? "#d0506a" : "#e0708a"), gelap = putih(w, "#7a2f45");
    ctx.fillStyle = gelap; ctx.fillRect(-24, -26, 14, 26); ctx.fillRect(10, -26, 14, 26);
    ctx.fillStyle = karang; ctx.beginPath(); ctx.ellipse(0, -54 - b, 30, 30, 0, 0, 6.28); ctx.fill();
    for (let i = 0; i < 6; i++) { const a = -2.6 + i * 0.5; ctx.beginPath(); ctx.arc(Math.cos(a) * 30, -54 - b + Math.sin(a) * 30, 7, 0, 6.28); ctx.fill(); }
    ctx.fillStyle = putih(w, "#2d6a96"); ctx.fillRect(-28, -44 - b, 56, 7);                             // sabuk laut
    ctx.fillStyle = karang; ctx.beginPath(); ctx.arc(0, -92 - b, 18, 0, 6.28); ctx.fill();
    ctx.fillStyle = gelap; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-14 + i * 7, -104 - b); ctx.lineTo(-11 + i * 7, -120 - b - (i % 2) * 6); ctx.lineTo(-8 + i * 7, -104 - b); ctx.fill(); }   // mahkota karang
    ctx.fillStyle = "#6fd3ff"; ctx.shadowColor = "#6fd3ff"; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(-6, -94 - b, 3.5, 0, 6.28); ctx.arc(8, -94 - b, 3.5, 0, 6.28); ctx.fill(); ctx.shadowBlur = 0;
    // trisula
    ctx.save(); ctx.translate(30, -64 - b); ctx.rotate(-0.3 - angkat * 1.3);
    ctx.fillStyle = gelap; ctx.fillRect(-3, -60, 6, 70);
    ctx.fillStyle = "#f4b942"; ctx.fillRect(-12, -62, 24, 4); for (const x of [-12, -2, 8]) ctx.fillRect(x, -76, 4, 16);
    ctx.restore();
  },
  arcaHidup(m, time, w) {
    const b = m.state === "charge" ? Math.abs(Math.sin(m.run * 3)) * 3 : Math.abs(Math.sin(m.run * 0.5));
    const batu = putih(w, "#8a8494"), gelap = putih(w, "#625c6c");
    ctx.fillStyle = gelap; ctx.fillRect(-14, -14, 10, 14); ctx.fillRect(4, -14, 10, 14);
    ctx.fillStyle = batu; ctx.fillRect(-16, -40 - b, 32, 28);
    ctx.fillStyle = gelap; ctx.fillRect(-16, -26 - b, 32, 4);
    ctx.fillStyle = batu; ctx.fillRect(-11, -58 - b, 22, 18);
    ctx.fillStyle = gelap; ctx.fillRect(-13, -62 - b, 26, 5);
    ctx.fillStyle = "#ff4f4f"; ctx.shadowColor = "#ff4f4f"; ctx.shadowBlur = 8; ctx.fillRect(-6, -52 - b, 4, 4); ctx.fillRect(3, -52 - b, 4, 4); ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,80,60,0.6)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-8, -38 - b); ctx.lineTo(-2, -30 - b); ctx.lineTo(-6, -20 - b); ctx.stroke();
  },
  elangBatu(m, time, w) {
    const hover = -40 + Math.sin(m.run * 0.6) * 5, flap = Math.sin(m.run * 2.5) * 12;
    ctx.fillStyle = putih(w, "#7d7480");
    ctx.beginPath(); ctx.moveTo(-4, hover); ctx.lineTo(-30, hover - 8 - flap); ctx.lineTo(-22, hover + 4); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(4, hover); ctx.lineTo(30, hover - 8 - flap); ctx.lineTo(22, hover + 4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = putih(w, "#5c5560"); ctx.beginPath(); ctx.ellipse(0, hover, 9, 12, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = putih(w, "#d9d4cc"); ctx.beginPath(); ctx.arc(4, hover - 12, 6, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#f4b942"; ctx.beginPath(); ctx.moveTo(9, hover - 13); ctx.lineTo(15, hover - 10); ctx.lineTo(9, hover - 9); ctx.fill();
    ctx.fillStyle = "#1a1420"; ctx.fillRect(5, hover - 14, 2, 2);
  },
  anakNaga(m, time, w) {
    const hover = -34 + Math.sin(m.run * 0.6) * 4, flap = Math.sin(m.run * 2) * 8;
    const sisik = putih(w, "#d4a017"), perut = putih(w, "#ffe08a");
    ctx.fillStyle = putih(w, "#b0451f");
    ctx.beginPath(); ctx.moveTo(-2, hover - 4); ctx.lineTo(-20, hover - 16 - flap); ctx.lineTo(-12, hover + 2); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = sisik; ctx.lineWidth = 5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-6, hover + 6); ctx.quadraticCurveTo(-18, hover + 16, -24, hover + 8 + Math.sin(time * 5) * 3); ctx.stroke();
    ctx.fillStyle = sisik; ctx.beginPath(); ctx.ellipse(0, hover, 11, 9, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = perut; ctx.beginPath(); ctx.ellipse(2, hover + 3, 6, 5, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = sisik; ctx.beginPath(); ctx.ellipse(11, hover - 9, 8, 6, 0.2, 0, 6.28); ctx.fill();
    ctx.fillStyle = perut; ctx.beginPath(); ctx.moveTo(8, hover - 14); ctx.lineTo(6, hover - 22); ctx.lineTo(12, hover - 15); ctx.fill();
    ctx.fillStyle = "#1a1420"; ctx.fillRect(13, hover - 11, 2.5, 2.5);
    if (m.tembakT != null && m.tembakT < 0.3) { ctx.fillStyle = "rgba(255,140,60,0.8)"; ctx.beginPath(); ctx.arc(20, hover - 7, 4, 0, 6.28); ctx.fill(); }
  },
  kelabang(m, time, w) {
    // badan beruas panjang yang meliuk
    const marah = m.fase2, n = 9, gerak = m.state === "terjang" ? 3 : 1;
    for (let i = n - 1; i >= 0; i--) {
      const x = -i * 11, y = -16 + Math.sin(m.run * gerak * 0.8 - i * 0.7) * 5;
      ctx.strokeStyle = putih(w, "#3a1d14"); ctx.lineWidth = 2.5;
      for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x, y + 4); ctx.lineTo(x - 4 + Math.sin(m.run * 3 + i) * 3, y + 16 * (s > 0 ? 1 : 0.2) + 2); ctx.stroke(); }
      ctx.fillStyle = putih(w, i % 2 ? (marah ? "#a3261c" : "#8a2a1a") : (marah ? "#c9351f" : "#b03a20"));
      ctx.beginPath(); ctx.ellipse(x, y, 10, 9, 0, 0, 6.28); ctx.fill();
      ctx.fillStyle = "rgba(255,200,120,0.25)"; ctx.fillRect(x - 6, y - 7, 12, 3);
    }
    const hy = -20 + Math.sin(m.run * gerak * 0.8) * 5;
    ctx.fillStyle = putih(w, "#5a1a10"); ctx.beginPath(); ctx.ellipse(10, hy, 13, 11, 0, 0, 6.28); ctx.fill();
    ctx.strokeStyle = putih(w, "#f2ead8"); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(18, hy + 4); ctx.quadraticCurveTo(28, hy + 6, 24, hy + 14); ctx.moveTo(18, hy - 2); ctx.quadraticCurveTo(30, hy - 2, 28, hy + 8); ctx.stroke();   // taring
    ctx.strokeStyle = putih(w, "#3a1d14"); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(12, hy - 9); ctx.quadraticCurveTo(20, hy - 26, 30, hy - 22); ctx.stroke();      // antena
    ctx.fillStyle = "#c9e27a"; ctx.fillRect(14, hy - 5, 3, 3); ctx.fillRect(9, hy - 5, 3, 3);
  },
});
// ular: badan meliuk dari ekor ke kepala; s = skala
function gambarUlar(m, time, w, s, kulit, belang) {
  ctx.save(); ctx.scale(s, s);
  const geli = m.state === "charge" || m.state === "terjang" ? 3 : 1;
  for (let i = 7; i >= 0; i--) {
    const x = -i * 5, y = -5 + Math.sin(m.run * 0.9 * geli - i * 0.8) * 3;
    ctx.fillStyle = putih(w, i % 2 ? belang : kulit); ctx.beginPath(); ctx.arc(x, y, 5 - i * 0.25, 0, 6.28); ctx.fill();
  }
  const hy = -9 + Math.sin(m.run * 0.9 * geli) * 3;
  ctx.fillStyle = putih(w, kulit); ctx.beginPath(); ctx.ellipse(6, hy, 7, 5, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#ffef9a"; ctx.fillRect(8, hy - 3, 2, 2);
  ctx.strokeStyle = "#e5484d"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(13, hy); ctx.lineTo(17, hy + (Math.sin(time * 12) > 0 ? 1 : -1)); ctx.stroke();
  ctx.restore();
}
