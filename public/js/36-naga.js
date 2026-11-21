// =====================================================================
// NAGA KENCANA (bos dunia 3, Puncak Naga) — 3 fase yang benar-benar berbeda
// FASE 1 · Penjaga Puncak (nyawa > 60%) — di darat
//   cakar   : kombo 3 cakaran dengan jeda tidak sama (cepat-cepat-lambat). Hafalkan iramanya!
//   sembur  : ancang-ancang lalu menyembur api ke depan (kadang menipu: menahan napas dulu)
//   meteor  : hujan batu api di sekitar pemain
//   ekor    : kibasan ekor kalau pemain terlalu dekat
// FASE 2 · Langit Membara (60% - 30%) — memanggil 2 anak naga, sering terbang
//   terbang : terbang tinggi (tak bisa diserang), lalu menukik ke tanda merah
//   garis   : tiga lajur api menyapu arena — cari celahnya
//   cincin  : cincin api mengepung lalu menyempit — keluar lewat celah
// FASE 3 · Amarah Matahari (< 30%) — lebih cepat, semua serangan digabung
//   amukan "Nafas Matahari" tiap ±18 detik: naga naik ke tengah arena, semua tempat
//   terbakar kecuali di balik batu (lingkaran hijau). Sesudahnya naga jatuh kelelahan.
// =====================================================================
"use strict";

const POLA_NAGA = [
  ["cakar", "sembur", "meteor", "cakar", "ekor", "sembur"],
  ["sembur", "terbang", "garis", "cakar", "meteor", "cincin"],
  ["garis", "cakar", "terbang", "cincin", "sembur", "meteor", "cakar"],
];
const IRAMA_CAKAR = [0.55, 0.35, 0.8];   // jeda tiap cakaran dalam kombo

AI_BOS.naga = function (m, dt, dp, toP) {
  const udara = m.state === "terbang" || m.state === "tukik";
  if (!udara && bosUmum(m, dt, dp, toP)) return;
  const d = m.d;
  // pergantian fase (bosUmum sudah memicu fase2 di 50%; naga memakai 60% & 30%)
  if (!m.f2 && m.hp < d.hp * 0.6) { m.f2 = true; m.fase2 = true; fase2(m); toast(t("naga.fase2"), true); m.urut = -1; }
  if (!m.fase3 && m.hp < d.hp * 0.3) {
    m.fase3 = true; shake = 0.8; sfx.growl(); toast(t("naga.mengamuk"), true); m.urut = -1;
    if (!udara) { nafasMatahari(m); return; }
  }
  const fase = m.fase3 ? 2 : m.f2 ? 1 : 0, cepat = [1, 1.2, 1.45][fase];
  m.cd -= dt;
  if (Math.random() < 0.3) parts.push({ x: m.x + rand(-40, 40), y: m.y, z: rand(30, 120) + (m.z || 0), vz: rand(20, 60), vx: 0, vy: 0, life: 0.6, max: 0.6, color: Math.random() < 0.5 ? "#ffd166" : "#ff7b39", s: 5, float: true });
  if (m.fase3 && m.state === "kejar") {
    m.nafasT = (m.nafasT ?? 18) - dt;
    if (m.nafasT <= 0) { m.nafasT = 18; nafasMatahari(m); return; }
  }

  if (m.state === "kejar") {
    kejar(m, dt, toP, fase ? 230 : 190, cepat);
    if (m.cd > 0) return;
    const pola = POLA_NAGA[fase];
    m.urut = ((m.urut ?? -1) + 1) % pola.length;
    let s = pola[m.urut];
    if (s === "ekor" && dp > 190) s = "sembur";
    if (dp < 130 && s !== "terbang" && s !== "garis" && s !== "cincin") s = Math.random() < 0.5 ? "ekor" : "cakar";
    if (s === "meteor") {
      const n = [6, 8, 11][fase];
      for (let i = 0; i < n; i++) { const a = rand(0, 6.28), r = i === 0 ? 0 : rand(40, 180); tandaBahaya(P.x + Math.cos(a) * r, P.y + Math.sin(a) * r, 46, 1.15, d.atk * 0.8, "api"); }
      sfx.growl(); m.cd = 2.2 / cepat; return;
    }
    if (s === "garis") { garisApi(m, d, fase); sfx.growl(); m.cd = 2.6 / cepat; return; }
    if (s === "cincin") { cincinApi(m, d); sfx.growl(); m.cd = 3 / cepat; return; }
    if (s === "terbang") { m.state = "terbang"; m.st = 0; m.kebal = true; sfx.charge(); shake = 0.4; return; }
    if (s === "cakar") { m.state = "ancang"; m.serang = "cakar"; m.kombo = 0; m.ang = toP; m.st = IRAMA_CAKAR[0] / cepat; sfx.growl(); return; }
    m.state = "ancang"; m.serang = s; m.ang = toP; m.st = s === "sembur" ? 1 : 0.7;
    if (s === "sembur" && Math.random() < 0.3 + fase * 0.1) m.st += 0.6;   // menahan napas (tipuan)
    sfx.growl();
  } else if (m.state === "ancang") {
    m.st -= dt * cepat;
    if ((m.serang === "sembur" && m.st > 0.3) || (m.serang === "cakar" && m.st > 0.15)) m.ang = toP;
    if (m.st > 0) return;
    if (m.serang === "ekor") {
      shake = 0.5; sfx.slam(); effects.push({ kind: "ring", x: m.x, y: m.y, r: 125, t: 0, dur: 0.45, red: true });
      if (dp < 125 + P.r) hurtPlayer(d.atk * 1.2, toP);
      m.state = "kejar"; m.cd = d.cd / cepat;
    } else if (m.serang === "cakar") {
      // satu cakaran dari kombo: maju sedikit lalu menyabet kerucut di depan
      moveEnt(m, Math.cos(m.ang) * 36, Math.sin(m.ang) * 36);
      effects.push({ kind: "claw", x: m.x, y: m.y - 50, ang: m.ang, r: 150, t: 0, dur: 0.15 }); sfx.heavy();
      if (dist(m, P) < 150 + P.r && angDiff(Math.atan2(P.y - m.y, P.x - m.x), m.ang) < 1.0) hurtPlayer(d.atk * (m.kombo === 2 ? 1.3 : 0.8), m.ang);
      m.kombo++;
      if (m.kombo < 3) { m.st = IRAMA_CAKAR[m.kombo] / cepat; m.ang = Math.atan2(P.y - m.y, P.x - m.x); }
      else { m.state = "kejar"; m.cd = d.cd / cepat; }
    } else { m.state = "nafas"; m.st = m.fase3 ? 1.1 : 0.8; m.semburT = 0; sfx.fire(); }
  } else if (m.state === "nafas") {
    m.st -= dt; m.semburT -= dt;
    if (m.semburT <= 0) { m.semburT = 0.07; tembak(m, m.ang + rand(-0.4, 0.4), rand(280, 360), d.atk * 0.45, 10); }
    if (m.st <= 0) { m.state = "kejar"; m.cd = d.cd / cepat; }
  } else if (m.state === "terbang") {
    m.st += dt;
    m.z = Math.min(260, (m.z || 0) + 420 * dt);
    const a = Math.atan2(P.y - m.y, P.x - m.x);
    if (m.st > 0.6) moveEnt(m, Math.cos(a) * 260 * cepat * dt, Math.sin(a) * 260 * cepat * dt, true);
    // fase 3: menjatuhkan bola api saat terbang
    if (m.fase3 && m.st > 0.6) { m.jatuhT = (m.jatuhT || 0) - dt; if (m.jatuhT <= 0) { m.jatuhT = 0.45; tandaBahaya(P.x + rand(-60, 60), P.y + rand(-40, 40), 40, 0.9, d.atk * 0.6, "api"); } }
    if (m.st > 2) { m.state = "tukik"; m.st = 0.9; m.tx = P.x; m.ty = P.y; tandaBahaya(P.x, P.y, 110, 0.9, d.atk * 1.5, "api"); }
  } else if (m.state === "tukik") {
    m.st -= dt;
    moveEnt(m, (m.tx - m.x) * 4 * dt, (m.ty - m.y) * 4 * dt, true);
    m.z = Math.max(0, m.z - 300 * dt);
    if (m.st <= 0) { m.z = 0; m.kebal = false; shake = 0.9; sfx.slam(); m.state = "lelah"; m.st = 1.2; spark(m.x, m.y, "#ff7b39", 30); }
  } else if (m.state === "lelah") { m.st -= dt; if (m.st <= 0) { m.state = "kejar"; m.cd = d.cd / cepat; } }
};

// tiga lajur api sejajar menyapu arena; satu lajur dibiarkan kosong sebagai celah
function garisApi(m, d, fase) {
  const datar = Math.random() < 0.5, lajur = 5, celah = Math.floor(rand(0, lajur)), jarak = 70;
  for (let i = 0; i < lajur; i++) {
    if (i === celah) continue;
    const off = (i - (lajur - 1) / 2) * jarak;
    for (let k = -6; k <= 6; k++) {
      const x = datar ? P.x + k * 60 : P.x + off, y = datar ? P.y + off : P.y + k * 60;
      tandaBahaya(x, y, 34, 1.1 + Math.abs(k) * 0.05 + fase * 0.02, d.atk * 0.75, "api");
    }
  }
}
// cincin api mengepung pemain dengan satu celah, lalu cincin kedua yang lebih kecil
function cincinApi(m, d) {
  for (const [r, delay] of [[260, 1.2], [150, 1.9]]) {
    const celah = rand(0, 6.28), n = Math.round(r / 22);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 6.28;
      if (angDiff(a, celah) < 0.45) continue;
      tandaBahaya(P.x + Math.cos(a) * r, P.y + Math.sin(a) * r * 0.75, 32, delay, d.atk * 0.8, "api");
    }
  }
}
// amukan khas naga: Nafas Matahari
function nafasMatahari(m) {
  m.state = "kejar"; m.z = 0;
  mulaiAmukan(m, { dur: 3.2, kali: 0.6, spot: 3, r: 58, lelah: 3, nama: t("naga.nafas") });   // 57-bos-tangguh.js
}

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
