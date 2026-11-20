// =====================================================================
// NAGA KENCANA (bos terakhir, Puncak Naga)
// Pola serangan berputar:
//   sembur  : ancang-ancang (tanda kerucut merah), lalu menyembur api ke depan
//   meteor  : hujan batu api di sekitar pemain
//   ekor    : kibasan ekor kalau pemain terlalu dekat
//   terbang : (setelah marah) terbang tinggi — tidak bisa diserang — lalu menukik
//             ke titik bertanda merah. Menghindar!
// < 50% nyawa: marah, memanggil 2 anak naga.  < 25%: mengamuk, lebih cepat.
// =====================================================================
"use strict";

const POLA_NAGA = ["sembur", "meteor", "ekor", "sembur", "terbang"];

AI_BOS.naga = function (m, dt, dp, toP) {
  if (m.state !== "terbang" && m.state !== "tukik" && bosUmum(m, dt, dp, toP)) return;
  const d = m.d;
  if (!m.fase3 && m.hp < d.hp * 0.25) { m.fase3 = true; shake = 0.8; sfx.growl(); toast(t("naga.mengamuk"), true); }
  const cepat = m.fase3 ? 1.45 : m.fase2 ? 1.2 : 1;
  m.cd -= dt;
  if (Math.random() < 0.3) parts.push({ x: m.x + rand(-40, 40), y: m.y, z: rand(30, 120) + (m.z || 0), vz: rand(20, 60), vx: 0, vy: 0, life: 0.6, max: 0.6, color: Math.random() < 0.5 ? "#ffd166" : "#ff7b39", s: 5, float: true });

  if (m.state === "kejar") {
    kejar(m, dt, toP, 210, cepat);
    if (m.cd > 0) return;
    m.urut = ((m.urut ?? -1) + 1) % POLA_NAGA.length;
    let s = POLA_NAGA[m.urut];
    if (s === "terbang" && !m.fase2) s = "meteor";
    if (s === "ekor" && dp > 190) s = "sembur";
    if (dp < 140 && s !== "terbang") s = "ekor";
    if (s === "meteor") {
      const n = m.fase3 ? 10 : m.fase2 ? 8 : 6;
      for (let i = 0; i < n; i++) { const a = rand(0, 6.28), r = i === 0 ? 0 : rand(40, 170); tandaBahaya(P.x + Math.cos(a) * r, P.y + Math.sin(a) * r, 46, 1.15, d.atk * 0.8, "api"); }
      sfx.growl(); m.cd = 2.2 / cepat;
      return;
    }
    if (s === "terbang") { m.state = "terbang"; m.st = 0; m.kebal = true; sfx.charge(); shake = 0.4; return; }
    m.state = "ancang"; m.serang = s; m.ang = toP; m.st = s === "sembur" ? 1 : 0.7;
    sfx.growl();
  } else if (m.state === "ancang") {
    m.st -= dt * cepat;
    if (m.serang === "sembur" && m.st > 0.3) m.ang = toP;
    if (m.st > 0) return;
    if (m.serang === "ekor") {
      shake = 0.5; sfx.slam(); effects.push({ kind: "ring", x: m.x, y: m.y, r: 125, t: 0, dur: 0.45, red: true });
      if (dp < 125 + P.r) hurtPlayer(d.atk * 1.2, toP);
      m.state = "kejar"; m.cd = d.cd / cepat;
    } else { m.state = "nafas"; m.st = m.fase3 ? 1.1 : 0.8; m.semburT = 0; sfx.fire(); }
  } else if (m.state === "nafas") {
    // semburan api: bola-bola api kecil ke arah kerucut
    m.st -= dt; m.semburT -= dt;
    if (m.semburT <= 0) { m.semburT = 0.07; tembak(m, m.ang + rand(-0.4, 0.4), rand(280, 360), d.atk * 0.45, 10); }
    if (m.st <= 0) { m.state = "kejar"; m.cd = d.cd / cepat; }
  } else if (m.state === "terbang") {
    // naik tinggi, bayangannya mengikuti pemain
    m.st += dt;
    m.z = Math.min(260, (m.z || 0) + 420 * dt);
    const a = Math.atan2(P.y - m.y, P.x - m.x);
    if (m.st > 0.6) moveEnt(m, Math.cos(a) * 260 * cepat * dt, Math.sin(a) * 260 * cepat * dt, true);
    if (m.st > 2) {
      m.state = "tukik"; m.st = 0.9; m.tx = P.x; m.ty = P.y;
      tandaBahaya(P.x, P.y, 110, 0.9, d.atk * 1.5, "api");
    }
  } else if (m.state === "tukik") {
    m.st -= dt;
    moveEnt(m, (m.tx - m.x) * 4 * dt, (m.ty - m.y) * 4 * dt, true);
    m.z = Math.max(0, m.z - 300 * dt);
    if (m.st <= 0) { m.z = 0; m.kebal = false; shake = 0.9; sfx.slam(); m.state = "lelah"; m.st = 1.2; spark(m.x, m.y, "#ff7b39", 30); }
  } else if (m.state === "lelah") { m.st -= dt; if (m.st <= 0) { m.state = "kejar"; m.cd = d.cd / cepat; } }
};

// ---------- Gambar ----------
GAMBAR_MONSTER.naga = function (m, time, w) {
  const z = m.z || 0, b = Math.sin(m.run * 0.35) * 4, marah = m.fase2;
  const emas = putih(w, marah ? "#e8a317" : "#d4a017"), terang = putih(w, "#ffe08a"), gelap = putih(w, "#8a5a10");
  ctx.save(); ctx.translate(0, -z);
  // sayap (mengepak cepat saat terbang)
  const kepak = Math.sin(time * (z > 0 ? 9 : 2)) * (z > 0 ? 22 : 7);
  for (const [dx, a] of [[-24, 0.7], [-6, 1]]) {
    ctx.fillStyle = putih(w, marah ? "rgba(200,60,30,0.85)" : "rgba(180,80,30,0.8)"); ctx.globalAlpha = a;
    ctx.beginPath(); ctx.moveTo(dx, -82 + b);
    ctx.lineTo(dx - 70, -150 - kepak); ctx.lineTo(dx - 40, -120 - kepak * 0.6); ctx.lineTo(dx - 92, -110 - kepak * 0.5);
    ctx.lineTo(dx - 52, -96); ctx.lineTo(dx - 76, -76); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1;
  }
  // badan beruas: dari ekor ke leher
  const seg = 13;
  for (let i = seg; i >= 0; i--) {
    const x = -20 - i * 13, y = -46 + Math.sin(m.run * 0.45 - i * 0.55) * 10 + i * 2.6, r = 26 - i * 1.4;
    ctx.fillStyle = emas; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.28); ctx.fill();
    ctx.fillStyle = terang; ctx.beginPath(); ctx.ellipse(x, y + r * 0.45, r * 0.7, r * 0.35, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = gelap; ctx.beginPath(); ctx.moveTo(x - 5, y - r + 2); ctx.lineTo(x, y - r - 9 + i * 0.4); ctx.lineTo(x + 5, y - r + 2); ctx.fill();   // duri punggung
  }
  // kaki depan
  ctx.fillStyle = gelap; ctx.fillRect(-12, -28, 10, 28); ctx.fillRect(6, -26, 10, 26);
  // leher & kepala
  const hx = 40, hy = -92 + b + (m.state === "ancang" && m.serang === "sembur" ? -10 : 0);
  ctx.strokeStyle = emas; ctx.lineWidth = 26; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(-14, -52); ctx.quadraticCurveTo(14, -60 + b, hx - 8, hy + 6); ctx.stroke();
  ctx.fillStyle = emas; ctx.beginPath(); ctx.ellipse(hx, hy, 26, 18, 0.15, 0, 6.28); ctx.fill();
  ctx.beginPath(); ctx.ellipse(hx + 24, hy + 6, 18, 11, 0.2, 0, 6.28); ctx.fill();                      // moncong
  const buka = m.state === "nafas" ? 8 : 0;
  ctx.fillStyle = "#4a1a08"; ctx.beginPath(); ctx.ellipse(hx + 28, hy + 14 + buka / 2, 14, 3 + buka, 0.2, 0, 6.28); ctx.fill();
  if (m.state === "nafas") { ctx.fillStyle = "rgba(255,180,60,0.9)"; ctx.beginPath(); ctx.arc(hx + 42, hy + 14, 10 + Math.sin(time * 30) * 3, 0, 6.28); ctx.fill(); }
  // tanduk, surai, kumis
  ctx.fillStyle = terang;
  ctx.beginPath(); ctx.moveTo(hx - 12, hy - 12); ctx.quadraticCurveTo(hx - 34, hy - 40, hx - 44, hy - 34); ctx.quadraticCurveTo(hx - 26, hy - 26, hx - 4, hy - 14); ctx.fill();
  ctx.beginPath(); ctx.moveTo(hx, hy - 16); ctx.quadraticCurveTo(hx - 14, hy - 46, hx - 22, hy - 44); ctx.quadraticCurveTo(hx - 8, hy - 32, hx + 8, hy - 16); ctx.fill();
  ctx.fillStyle = putih(w, marah ? "#ff5a2a" : "#ff7b39");
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(hx - 18 - i * 5, hy - 2 + i * 4); ctx.lineTo(hx - 34 - i * 6 + Math.sin(time * 6 + i) * 4, hy + 2 + i * 5); ctx.lineTo(hx - 16 - i * 5, hy + 6 + i * 4); ctx.fill(); }
  ctx.strokeStyle = terang; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(hx + 34, hy + 4); ctx.quadraticCurveTo(hx + 56, hy + 2 + Math.sin(time * 3) * 6, hx + 64, hy + 18); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(hx + 30, hy + 10); ctx.quadraticCurveTo(hx + 46, hy + 24 + Math.sin(time * 3 + 1) * 6, hx + 40, hy + 34); ctx.stroke();
  // mata
  ctx.fillStyle = marah ? "#ff3b3b" : "#7dffa8"; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.ellipse(hx + 6, hy - 4, 5, 3.5, 0.2, 0, 6.28); ctx.fill(); ctx.shadowBlur = 0;
  // retakan bercahaya di dada (jantung naga yang retak)
  ctx.strokeStyle = `rgba(255,70,60,${0.5 + 0.4 * Math.sin(time * 4)})`; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(-18, -66); ctx.lineTo(-10, -54); ctx.lineTo(-20, -44); ctx.lineTo(-12, -34); ctx.stroke();
  ctx.restore();
};
