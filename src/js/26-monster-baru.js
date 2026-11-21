// =====================================================================
// MONSTER & BOS BARU
//  - Perilaku khusus monster biasa (lihat MONSTERS di config.js):
//      kedip  : Hantu Kabut berteleportasi ke dekat pemain
//      copet  : Tuyul mencuri koin lalu kabur; kalahkan untuk mengambil kembali
//      tembak : Banaspati menembakkan bola api
//  - Pola serangan bos baru (`ai` di MONSTERS): dwarapala, buayaPutih, rajaBanaspati
//  - Peluru musuh (tembakan) & zona bahaya bertanda merah (bahaya)
//  - Gambar semua makhluk baru (GAMBAR_MONSTER)
// =====================================================================
"use strict";

let tembakan = [];   // peluru musuh: { x, y, vx, vy, life, dmg, r }
let bahaya = [];     // lingkaran merah: meledak setelah `dur` detik { x, y, r, t, dur, dmg, jenis }

// peluru & bahaya membawa debuff monster penembaknya (32-debuff.js)
function tembak(m, ang, speed, dmg, r = 9) {
  const warna = m.d.warnaPeluru || (m.d.tembak && m.d.tembak.warna) || null;
  tembakan.push({ x: m.x, y: m.y - 30, vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed, life: 2.4, dmg, r, deb: m.d.debuff || null, warna, dari: m });
}
function tandaBahaya(x, y, r, dur, dmg, jenis) { bahaya.push({ x, y, r, t: 0, dur, dmg, jenis, deb: musuhAktif ? musuhAktif.d.debuff || null : null, dari: musuhAktif }); }

function updateMusuhKhusus(dt) {
  for (const s of tembakan) {
    s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt;
    const tl = tileAt(Math.floor(s.x / T), Math.floor((s.y + 30) / T));
    if (tl === TREE || tl === ROCK || tl === HOUSE || tl === WALL) s.life = 0;
    if (diZonaAman(s.x, s.y + 30)) { s.life = 0; spark(s.x, s.y, "#7dffa8", 6); continue; }   // lenyap di zona aman
    if (!P.dead && Math.hypot(P.x - s.x, P.y - 30 - s.y) < s.r + 12) { hurtPlayer(s.dmg, Math.atan2(s.vy, s.vx), s.deb, { dari: s.dari }); s.life = 0; spark(s.x, s.y, s.warna || "#ff9f43", 8); }
    if (Math.random() < 0.6) parts.push({ x: s.x, y: s.y + 30, z: 30, vz: 20, vx: rand(-15, 15), vy: rand(-15, 15), life: 0.3, max: 0.3, color: s.warna || "#ffb347" });
  }
  tembakan = tembakan.filter((s) => s.life > 0);
  for (const b of bahaya) {
    b.t += dt;
    if (b.t >= b.dur && !b.done) {
      b.done = true; shake = Math.max(shake, 0.3);
      if (!P.dead && Math.hypot(P.x - b.x, P.y - b.y) < b.r + P.r) hurtPlayer(b.dmg, Math.atan2(P.y - b.y, P.x - b.x), b.deb, { dari: b.dari });
      const warna = WARNA_BAHAYA[b.jenis] || "#8d8894";
      for (let i = 0; i < 14; i++) { const a = rand(0, 6.28), rr = rand(0, b.r); parts.push({ x: b.x + Math.cos(a) * rr, y: b.y + Math.sin(a) * rr, z: 0, vz: rand(150, 330), vx: 0, vy: 0, life: 0.5, max: 0.5, color: warna }); }
      b.jenis === "api" ? sfx.boom() : b.jenis === "air" ? sfx.roll() : sfx.slam();
    }
  }
  bahaya = bahaya.filter((b) => b.t < b.dur + 0.3);
}

const WARNA_BAHAYA = { api: "#ff7b39", batu: "#8d8894", racun: "#7bd64a", air: "#6fd3ff" };

// ---------- Perilaku monster biasa (dipanggil tiap frame dari updateMonster) ----------
function perilakuMonster(m, dt, dp, toP) {
  const d = m.d;
  if (!m.aggro || P.dead) return;
  if (d.kedip && m.state === "chase") {
    m.kedipT = (m.kedipT ?? d.kedip) - dt;
    if (m.kedipT <= 0) {
      m.kedipT = d.kedip + rand(-0.5, 0.8);
      const a = rand(0, 6.28), x = P.x + Math.cos(a) * rand(70, 110), y = P.y + Math.sin(a) * rand(70, 110);
      if (!solidAt(x, y)) { spark(m.x, m.y - 30, "#c9bfd6", 10); m.x = x; m.y = y; spark(x, y - 30, "#c9bfd6", 10); sfx.roll(); }
    }
  }
  if (d.tembak && (m.state === "chase" || m.state === "recover") && dp < d.tembak.jarak) {
    m.tembakT = (m.tembakT ?? rand(0.5, d.tembak.cd)) - dt;
    if (m.tembakT <= 0) { m.tembakT = d.tembak.cd; tembak(m, toP, d.tembak.speed, d.atk * 0.8); sfx.fire(); }
  }
}
// Tuyul mencopet: dipanggil saat serangannya kena
function copet(m) {
  const n = Math.min(S.gold, Math.round(rand(m.d.copet[0], m.d.copet[1])));
  if (n <= 0) return;
  S.gold -= n; m.curian = (m.curian || 0) + n;
  numbers.push({ x: P.x, y: P.y - 60, v: "−" + n, life: 0.9, color: "#f4b942", size: 20 });
  toast(t("toast.dicopet", { n }), false); sfx.coin();
  m.state = "lari"; m.st = 2.6;
}
function lari(m, dt, toP) {
  m.st -= dt;
  moveEnt(m, -Math.cos(toP) * m.d.speed * 1.15 * dt, -Math.sin(toP) * m.d.speed * 1.15 * dt);
  if (m.st <= 0) m.state = "chase";
}
// Koin curian kembali saat tuyul kalah
function kembalikanCurian(m) {
  if (!m.curian) return;
  const n = Math.min(6, m.curian);
  for (let i = 0; i < n; i++) pickups.push({ kind: "coin", v: Math.ceil(m.curian / n), x: m.x + rand(-16, 16), y: m.y + rand(-12, 12), t: 0 });
  m.curian = 0;
}

// ---------- Bos ----------
// Bagian bersama: kejar pemain, kembali ke sarang kalau pemain kabur terlalu jauh.
function bosUmum(m, dt, dp, toP) {
  const d = m.d;
  if (m.state === "idle") { if (!P.dead && dp < d.aggro) { m.state = "kejar"; m.aggro = true; m.cd = 1; } return true; }
  if (m.state === "pulang") {
    const a = Math.atan2(m.home.y - m.y, m.home.x - m.x);
    moveEnt(m, Math.cos(a) * d.speed * 1.5 * dt, Math.sin(a) * d.speed * 1.5 * dt, d.fly);
    m.hp = Math.min(d.hp, m.hp + d.hp * 0.5 * dt);
    if (dist(m, m.home) < 20) { m.state = "idle"; m.aggro = false; m.hp = d.hp; m.fase2 = m.f2 = m.fase3 = false; m.urut = -1; }
    return true;
  }
  if (P.dead || pAman || dist(m, m.home) > jarakAreaBos(d, d.jarakPulang || 520)) { m.state = "pulang"; return true; }
  m.seen = 4;
  if (!m.fase2 && m.hp < d.hp * 0.5) { m.fase2 = true; fase2(m); }
  return false;
}
function fase2(m) {
  shake = 0.6; sfx.growl(); toast(t("toast.bosMarah", { nama: m.d.name }), true);
  const anak = m.d.anak || { buayaPutih: "buaya", rajaBanaspati: "banaspati" }[m.type];
  const hidup = monsters.filter((x) => !x.dead && x.type === anak).length;   // jangan menumpuk anak buah
  if (anak && hidup < 4) for (let i = 0; i < 2; i++) {
    const a = rand(0, 6.28), spot = { x: m.x + Math.cos(a) * 90, y: m.y + Math.sin(a) * 90 };
    if (!solidAt(spot.x, spot.y)) { const c = makeMonster(anak, spot); c.aggro = true; c.state = "chase"; monsters.push(c); spark(spot.x, spot.y - 20, "#c9bfd6", 12); }
  }
}
function kejar(m, dt, toP, jarakIdeal, kali = 1) {
  const dp = dist(m, P);
  const arah = dp > jarakIdeal ? 1 : dp < jarakIdeal - 40 ? -0.6 : 0;
  if (arah) moveEnt(m, Math.cos(toP) * m.d.speed * kali * arah * dt, Math.sin(toP) * m.d.speed * kali * arah * dt, m.d.fly);
}

const AI_BOS = {
  // Arca raksasa: hantaman tanah, sapuan gada, dan hujan batu (lingkaran merah di sekitar pemain)
  dwarapala(m, dt, dp, toP) {
    if (bosUmum(m, dt, dp, toP)) return;
    const d = m.d, cepat = m.fase2 ? 1.35 : 1;
    m.cd -= dt;
    if (m.state === "kejar") {
      kejar(m, dt, toP, d.range + d.r, cepat);
      if (m.cd <= 0) {
        m.urut = ((m.urut || 0) + 1) % 3;
        if (m.urut === 0) { // hujan batu
          const n = m.fase2 ? 6 : 4;
          for (let i = 0; i < n; i++) { const a = rand(0, 6.28), r = i === 0 ? 0 : rand(30, 120); tandaBahaya(P.x + Math.cos(a) * r, P.y + Math.sin(a) * r, 38, 1.1, d.atk * 0.9, "batu"); }
          sfx.growl(); m.cd = 2.2 / cepat;
        } else if (dp < 160) { m.state = "ancang"; m.serang = dp < d.range + d.r + 20 ? "sapu" : "hantam"; m.st = m.serang === "hantam" ? 1.0 : 0.6; m.ang = toP; if (m.serang === "hantam") sfx.growl(); }
        else m.cd = 0.3;
      }
    } else if (m.state === "ancang") {
      m.st -= dt * cepat;
      if (m.serang === "sapu") m.ang = toP;
      if (m.st <= 0) {
        if (m.serang === "hantam") { shake = 0.55; sfx.slam(); effects.push({ kind: "ring", x: m.x, y: m.y, r: 150, t: 0, dur: 0.5, red: true }); if (dp < 150 + P.r) hurtPlayer(d.atk * 1.4, toP); }
        else { effects.push({ kind: "claw", x: m.x, y: m.y - 50, ang: m.ang, r: d.range + d.r, t: 0, dur: 0.15 }); sfx.heavy(); if (dp <= d.range + d.r + 24 && angDiff(toP, m.ang) < 1.3) hurtPlayer(d.atk, m.ang); }
        m.state = "kejar"; m.cd = d.cd / cepat;
      }
    }
  },
  // Buaya raksasa: terjangan panjang, kibasan ekor; marah → memanggil 2 buaya rawa
  buayaPutih(m, dt, dp, toP) {
    if (bosUmum(m, dt, dp, toP)) return;
    const d = m.d, cepat = m.fase2 ? 1.3 : 1;
    m.cd -= dt;
    if (m.state === "kejar") {
      kejar(m, dt, toP, d.range + d.r, cepat);
      if (m.cd <= 0) {
        m.urut = ((m.urut || 0) + 1) % 2;
        m.state = "ancang"; m.ang = toP;
        m.serang = dp > 140 || m.urut === 0 ? "terjang" : "ekor";
        m.st = m.serang === "terjang" ? 0.9 : 0.7; sfx.growl();
      }
    } else if (m.state === "ancang") {
      m.st -= dt * cepat;
      if (m.serang === "terjang" && m.st > 0.25) m.ang = toP;
      if (m.st <= 0) {
        if (m.serang === "terjang") { m.state = "terjang"; m.st = 0.75; m.hitP = false; sfx.charge(); }
        else { shake = 0.4; sfx.slam(); effects.push({ kind: "ring", x: m.x, y: m.y, r: 125, t: 0, dur: 0.45, red: true }); if (dp < 125 + P.r) hurtPlayer(d.atk, toP); m.state = "kejar"; m.cd = d.cd / cepat; }
      }
    } else if (m.state === "terjang") {
      m.st -= dt;
      const bx = m.x, by = m.y;
      moveEnt(m, Math.cos(m.ang) * 560 * dt, Math.sin(m.ang) * 560 * dt);
      if (!m.hitP && dist(m, P) < d.r + P.r + 6) { m.hitP = true; hurtPlayer(d.atk * 1.2, m.ang); }
      if (m.st <= 0 || (bx === m.x && by === m.y)) { m.state = "lelah"; m.st = 0.9; shake = 0.2; }
    } else if (m.state === "lelah") { m.st -= dt; if (m.st <= 0) { m.state = "kejar"; m.cd = d.cd / cepat; } }
  },
  // Roh api raksasa: semburan bola api menyebar, hujan api, hantaman bila didekati
  rajaBanaspati(m, dt, dp, toP) {
    if (bosUmum(m, dt, dp, toP)) return;
    const d = m.d, cepat = m.fase2 ? 1.35 : 1;
    m.cd -= dt;
    if (Math.random() < 0.5) parts.push({ x: m.x + rand(-26, 26), y: m.y, z: rand(20, 90), vz: rand(30, 90), vx: 0, vy: 0, life: 0.5, max: 0.5, color: Math.random() < 0.5 ? "#ff7b39" : "#ffd166", s: 5, float: true });
    if (m.state === "kejar") {
      kejar(m, dt, toP, 190, cepat);
      if (m.cd <= 0) {
        m.urut = ((m.urut || 0) + 1) % 3;
        if (dp < d.range + d.r + 30) { m.state = "ancang"; m.serang = "hantam"; m.st = 0.75; sfx.growl(); }
        else if (m.urut === 1) { m.state = "ancang"; m.serang = "sembur"; m.st = 0.6; m.ang = toP; }
        else { // hujan api
          const n = m.fase2 ? 5 : 3;
          for (let i = 0; i < n; i++) { const a = rand(0, 6.28), r = i === 0 ? 0 : rand(40, 130); tandaBahaya(P.x + Math.cos(a) * r, P.y + Math.sin(a) * r, 44, 1.0, d.atk * 0.9, "api"); }
          sfx.fire(); m.cd = 2 / cepat;
        }
      }
    } else if (m.state === "ancang") {
      m.st -= dt * cepat;
      if (m.serang === "sembur") m.ang = toP;
      if (m.st <= 0) {
        if (m.serang === "sembur") {
          const n = m.fase2 ? 9 : 5, lebar = m.fase2 ? 1.6 : 0.9;
          for (let i = 0; i < n; i++) tembak(m, m.ang - lebar / 2 + (lebar * i) / (n - 1), 250, d.atk * 0.7, 11);
          if (m.fase2) for (let i = 0; i < 8; i++) tembak(m, (i / 8) * 6.28, 180, d.atk * 0.6, 9);
          sfx.fire();
        } else { shake = 0.5; sfx.slam(); effects.push({ kind: "ring", x: m.x, y: m.y, r: 140, t: 0, dur: 0.5, red: true }); if (dp < 140 + P.r) hurtPlayer(d.atk * 1.3, toP); }
        m.state = "kejar"; m.cd = d.cd / cepat;
      }
    }
  },
};

// ---------- Gambar ----------
function drawMusuhKhusus(time) {
  for (const b of bahaya) {
    const k = Math.min(1, b.t / b.dur);
    if (b.t < b.dur) {
      ctx.fillStyle = `rgba(229,72,77,${0.12 + 0.3 * k})`; ctx.beginPath(); ctx.ellipse(b.x, b.y, b.r, b.r * 0.6, 0, 0, 6.28); ctx.fill();
      ctx.strokeStyle = "rgba(255,120,120,0.8)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(b.x, b.y, b.r * k, b.r * 0.6 * k, 0, 0, 6.28); ctx.stroke();
      if (b.jenis === "batu") { const h = (1 - k) * 260; ctx.fillStyle = "#6f6a75"; ctx.beginPath(); ctx.ellipse(b.x, b.y - h - 10, 14, 11, 0, 0, 6.28); ctx.fill(); }
    } else if (b.jenis === "racun" || b.jenis === "air") {
      const k2 = (b.t - b.dur) / 0.3, w = WARNA_BAHAYA[b.jenis];
      ctx.globalAlpha = 1 - k2; ctx.fillStyle = w; ctx.beginPath(); ctx.ellipse(b.x, b.y, b.r * (0.6 + k2 * 0.5), b.r * 0.6 * (0.6 + k2 * 0.5), 0, 0, 6.28); ctx.fill();
      if (b.jenis === "air") { ctx.fillRect(b.x - 5, b.y - 70 * (1 - k2), 10, 70 * (1 - k2)); }
      ctx.globalAlpha = 1;
    } else if (b.jenis === "api") {
      const g = ctx.createLinearGradient(0, b.y - 120, 0, b.y);
      g.addColorStop(0, "rgba(255,209,102,0)"); g.addColorStop(1, "rgba(255,90,40,0.9)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(b.x, b.y - 60, b.r * 0.6, 60, 0, 0, 6.28); ctx.fill();
    }
  }
  for (const s of tembakan) {
    if (s.warna) {   // peluru berwarna (racun, air, peluru hantu)
      ctx.fillStyle = s.warna; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.arc(s.x, s.y, s.r + 6, 0, 6.28); ctx.fill(); ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.28); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.75)"; ctx.beginPath(); ctx.arc(s.x - s.r * 0.3, s.y - s.r * 0.3, s.r * 0.35, 0, 6.28); ctx.fill();
      continue;
    }
    ctx.fillStyle = "rgba(255,120,50,0.35)"; ctx.beginPath(); ctx.arc(s.x, s.y, s.r + 6, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#ff5a2a"; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#ffe08a"; ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 0.45, 0, 6.28); ctx.fill();
  }
}
// Tanda serangan bos (digambar sebelum badannya, tanpa dibalik)
function tandaBos(m) {
  if (m.state !== "ancang") return;
  const k = 1 - m.st / (m.serang === "hantam" ? 1 : 0.9);
  ctx.fillStyle = `rgba(229,72,77,${0.15 + 0.35 * clamp(k, 0, 1)})`;
  if (m.serang === "hantam") { ctx.beginPath(); ctx.ellipse(0, 0, m.type === "rajaBanaspati" ? 140 : 150, 90, 0, 0, 6.28); ctx.fill(); }
  else if (m.serang === "cakar") { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 150, m.ang - 1, m.ang + 1); ctx.closePath(); ctx.fill(); }
  else if (m.serang === "ekor") { ctx.beginPath(); ctx.ellipse(0, 0, 125, 75, 0, 0, 6.28); ctx.fill(); }
  else if (m.serang === "terjang") { ctx.save(); ctx.rotate(m.ang); ctx.fillRect(0, -m.d.r * 0.8, 420, m.d.r * 1.6); ctx.restore(); }
  else if (m.serang === "sapu") { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, m.d.range + m.d.r + 20, m.ang - 1.2, m.ang + 1.2); ctx.closePath(); ctx.fill(); }
  else if (m.serang === "sembur") { ctx.save(); ctx.rotate(m.ang); ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 300, -0.45, 0.45); ctx.closePath(); ctx.fill(); ctx.restore(); }
}
// w = sedang berkedip putih (kena pukul). Koordinat sudah digeser ke kaki monster & dibalik menghadap pemain.
const GAMBAR_MONSTER = {
  hantuKabut(m, time, w) {
    const hover = -32 + Math.sin(m.run * 0.6) * 5;
    ctx.globalAlpha = 0.82;
    ctx.fillStyle = w ? "#fff" : "#d8dde6";
    ctx.beginPath(); ctx.moveTo(-14, hover + 4);
    ctx.quadraticCurveTo(-16, hover - 22, 0, hover - 24); ctx.quadraticCurveTo(16, hover - 22, 14, hover + 4);
    for (let i = 0; i <= 4; i++) ctx.lineTo(14 - i * 7, hover + 14 + Math.sin(time * 6 + i) * 4 * (i % 2 ? 1 : -1));
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#1a1420"; ctx.fillRect(-12, hover - 26, 24, 8);   // rambut
    ctx.beginPath(); ctx.moveTo(-13, hover - 20); ctx.lineTo(-17, hover + 6); ctx.lineTo(-10, hover - 6); ctx.fill();
    ctx.fillStyle = "#2b2238"; ctx.beginPath(); ctx.ellipse(-4, hover - 10, 2.6, 3.5, 0, 0, 6.28); ctx.ellipse(5, hover - 10, 2.6, 3.5, 0, 0, 6.28); ctx.fill();
    ctx.globalAlpha = 1;
  },
  buaya(m, time, w) { gambarBuaya(m, w, 1, "#4e6b3a", "#6b8a4a", "#e9d36a"); },
  buayaPutih(m, time, w) { gambarBuaya(m, w, 1.9, "#d9d4c7", "#f2efe6", "#ff3b3b"); },
  tuyul(m, time, w) {
    const b = Math.abs(Math.sin(m.run * 1.4)) * 3;
    ctx.fillStyle = w ? "#fff" : "#8fa889";
    ctx.fillRect(-6, -10 - b, 4, 10); ctx.fillRect(2, -10 - b, 4, 10);
    ctx.beginPath(); ctx.ellipse(0, -15 - b, 8, 8, 0, 0, 6.28); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -27 - b, 9, 0, 6.28); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-10, -28 - b, 4, 6, -0.4, 0, 6.28); ctx.ellipse(10, -28 - b, 4, 6, 0.4, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#1f1a2a"; ctx.fillRect(1, -30 - b, 2.5, 3); ctx.fillRect(5, -30 - b, 2.5, 3);
    ctx.strokeStyle = "#1f1a2a"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(4, -25 - b, 3, 0.2, 2.8); ctx.stroke();
    ctx.fillStyle = "#e9d3a9"; ctx.fillRect(-8, -16 - b, 16, 5);   // kain
    if (m.curian) { ctx.fillStyle = "#c9a26b"; ctx.beginPath(); ctx.ellipse(-11, -18 - b, 6, 7, 0, 0, 6.28); ctx.fill(); ctx.fillStyle = "#f4b942"; ctx.fillRect(-12, -26 - b, 3, 3); }
  },
  kepiting(m, time, w) {
    const b = Math.abs(Math.sin(m.run * 1.2)) * 1.5, capit = m.state === "windup" ? 6 : Math.sin(m.run) * 2;
    ctx.strokeStyle = w ? "#fff" : "#9c3b26"; ctx.lineWidth = 2.5;
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(s * 10, -8 - i * 3); ctx.lineTo(s * 22, -2 + i * 2 - b); ctx.stroke(); }
    ctx.fillStyle = w ? "#fff" : "#c9512f"; ctx.beginPath(); ctx.ellipse(0, -12 - b, 18, 11, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = w ? "#fff" : "#e0693f"; ctx.beginPath(); ctx.ellipse(-3, -15 - b, 10, 5, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = w ? "#fff" : "#c9512f";
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.ellipse(s * 20, -24 - b - capit, 7, 6, 0, 0, 6.28); ctx.fill(); ctx.fillStyle = "#1f1a2a"; ctx.fillRect(s * 20 - 1, -28 - b - capit, 2, 6); ctx.fillStyle = w ? "#fff" : "#c9512f"; }
    ctx.fillStyle = "#1f1a2a"; ctx.fillRect(-5, -26 - b, 3, 5); ctx.fillRect(3, -26 - b, 3, 5);
  },
  banaspati(m, time, w) {
    const hover = -34 + Math.sin(m.run * 0.8) * 4;
    const g = ctx.createRadialGradient(0, hover, 2, 0, hover, 22);
    g.addColorStop(0, w ? "#fff" : "#ffe08a"); g.addColorStop(0.6, w ? "#fff" : "#ff7b39"); g.addColorStop(1, "rgba(255,90,40,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, hover, 22, 0, 6.28); ctx.fill();
    ctx.fillStyle = w ? "#fff" : "#ff7b39";
    for (let i = 0; i < 4; i++) { const x = -9 + i * 6; ctx.beginPath(); ctx.moveTo(x - 4, hover - 8); ctx.quadraticCurveTo(x, hover - 26 - Math.sin(time * 12 + i) * 5, x + 4, hover - 8); ctx.fill(); }
    ctx.fillStyle = "#3a1408"; ctx.beginPath(); ctx.ellipse(-4, hover - 2, 2.5, 3.5, 0, 0, 6.28); ctx.ellipse(5, hover - 2, 2.5, 3.5, 0, 0, 6.28); ctx.fill();
    ctx.beginPath(); ctx.arc(1, hover + 6, 4, 0, Math.PI); ctx.fill();
  },
  dwarapala(m, time, w) {
    const b = Math.sin(m.run * 0.4) * 1.5, angkat = m.state === "ancang" ? clamp(1 - m.st, 0, 1) : 0;
    const batu = w ? "#fff" : "#7a7488", gelap = w ? "#fff" : "#5d5868";
    ctx.fillStyle = gelap; ctx.fillRect(-26, -24, 16, 24); ctx.fillRect(10, -24, 16, 24);           // kaki
    ctx.fillStyle = batu; ctx.beginPath(); ctx.ellipse(0, -50 - b, 34, 32, 0, 0, 6.28); ctx.fill();  // perut
    ctx.fillStyle = gelap; ctx.fillRect(-30, -40 - b, 60, 8);                                         // sabuk
    ctx.fillStyle = batu; ctx.beginPath(); ctx.arc(0, -88 - b, 22, 0, 6.28); ctx.fill();              // kepala
    ctx.fillStyle = gelap;
    for (let i = 0; i < 7; i++) { const a = -Math.PI + (i / 6) * Math.PI; ctx.beginPath(); ctx.arc(Math.cos(a) * 20, -92 - b + Math.sin(a) * 20, 7, 0, 6.28); ctx.fill(); }  // rambut ikal
    ctx.fillStyle = "#ff3b3b"; ctx.shadowColor = "#ff3b3b"; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(-7, -90 - b, 4.5, 0, 6.28); ctx.arc(9, -90 - b, 4.5, 0, 6.28); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = "#f2ead8"; ctx.beginPath(); ctx.moveTo(-6, -76 - b); ctx.lineTo(-3, -68 - b); ctx.lineTo(0, -76 - b); ctx.moveTo(4, -76 - b); ctx.lineTo(7, -68 - b); ctx.lineTo(10, -76 - b); ctx.fill();
    // gada
    ctx.save(); ctx.translate(30, -60 - b); ctx.rotate(-0.6 - angkat * 1.4);
    ctx.fillStyle = gelap; ctx.fillRect(-4, -46, 8, 50); ctx.fillStyle = batu; ctx.beginPath(); ctx.ellipse(0, -52, 12, 16, 0, 0, 6.28); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "rgba(30,20,40,0.5)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-14, -66 - b); ctx.lineTo(-6, -54 - b); ctx.lineTo(-12, -40 - b); ctx.stroke();
  },
  rajaBanaspati(m, time, w) {
    const hover = -60 + Math.sin(m.run * 0.5) * 5, marah = m.fase2;
    const g = ctx.createRadialGradient(0, hover, 6, 0, hover, 56);
    g.addColorStop(0, w ? "#fff" : "#fff3b0"); g.addColorStop(0.45, w ? "#fff" : marah ? "#ff3b1f" : "#ff7b39"); g.addColorStop(1, "rgba(255,60,20,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, hover, 56, 0, 6.28); ctx.fill();
    ctx.fillStyle = w ? "#fff" : marah ? "#ff3b1f" : "#ff7b39";
    for (let i = 0; i < 7; i++) { const x = -27 + i * 9; ctx.beginPath(); ctx.moveTo(x - 6, hover - 22); ctx.quadraticCurveTo(x, hover - 62 - Math.sin(time * 10 + i) * 10, x + 6, hover - 22); ctx.fill(); }
    // lengan api
    ctx.strokeStyle = w ? "#fff" : "#ff9f43"; ctx.lineWidth = 9; ctx.lineCap = "round";
    const ay = m.state === "ancang" ? -20 : 0;
    ctx.beginPath(); ctx.moveTo(-26, hover + 8); ctx.quadraticCurveTo(-52, hover + 20 + ay, -46, hover + 40 + ay); ctx.moveTo(26, hover + 8); ctx.quadraticCurveTo(52, hover + 20 + ay, 46, hover + 40 + ay); ctx.stroke();
    // mahkota
    ctx.fillStyle = "#f4b942"; ctx.beginPath(); ctx.moveTo(-18, hover - 26); ctx.lineTo(-14, hover - 42); ctx.lineTo(-6, hover - 30); ctx.lineTo(0, hover - 46); ctx.lineTo(6, hover - 30); ctx.lineTo(14, hover - 42); ctx.lineTo(18, hover - 26); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#3a1408"; ctx.beginPath(); ctx.ellipse(-9, hover - 6, 5, 7, 0.2, 0, 6.28); ctx.ellipse(9, hover - 6, 5, 7, -0.2, 0, 6.28); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-10, hover + 12); ctx.quadraticCurveTo(0, hover + 22, 10, hover + 12); ctx.quadraticCurveTo(0, hover + 16, -10, hover + 12); ctx.fill();
  },
};
function gambarBuaya(m, w, s, kulit, perut, mata) {
  const jalan = Math.sin(m.run * 1.5) * 2;
  ctx.save(); ctx.scale(s, s);
  ctx.fillStyle = w ? "#fff" : kulit;
  ctx.beginPath(); ctx.moveTo(-34, -6); ctx.quadraticCurveTo(-20, -14, -8, -12); ctx.lineTo(-8, -4); ctx.closePath(); ctx.fill();   // ekor
  for (const [x, y] of [[-6, -2], [10, -2]]) ctx.fillRect(x + jalan * (x < 0 ? 1 : -1), y, 5, 5);                                 // kaki
  ctx.beginPath(); ctx.ellipse(2, -10, 16, 8, 0, 0, 6.28); ctx.fill();                                                               // badan
  ctx.beginPath(); ctx.moveTo(14, -14); ctx.lineTo(34, -11); ctx.lineTo(34, -6); ctx.lineTo(14, -5); ctx.closePath(); ctx.fill();      // moncong
  ctx.fillStyle = w ? "#fff" : perut; ctx.fillRect(16, -7, 18, 2);
  ctx.fillStyle = w ? "#fff" : kulit; for (let i = 0; i < 5; i++) ctx.fillRect(-8 + i * 5, -19, 3, 3);                              // sisik punggung
  ctx.fillStyle = mata; ctx.fillRect(16, -16, 3, 3);
  ctx.fillStyle = "#f2ead8"; for (let i = 0; i < 4; i++) ctx.fillRect(20 + i * 4, -6, 1.5, 2);
  ctx.restore();
}
