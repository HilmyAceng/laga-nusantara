// =====================================================================
// GAMBAR
// Menggambar dunia ke kanvas: petak, pohon, rumah, karakter, monster, efek.
// =====================================================================
"use strict";

let W = 0, H = 0, DPR = 1;
function resize() {
  const r = cv.getBoundingClientRect();
  DPR = store.get("laga.grafisRingan", false) ? 1 : Math.min(2, window.devicePixelRatio || 1);   // mode grafis ringan (73-grafis-ringan.js)
  W = Math.max(1, r.width); H = Math.max(1, r.height);
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  $("rotate").hidden = !(isTouch && H > W && mode === "play");
}
const hash = (x, y) => ((x * 73856093) ^ (y * 19349663)) >>> 0;

// Kait gambar untuk fitur lain: GAMBAR_TANAH = fungsi(time) digambar di atas petak;
// BENDA_TINGGI = fungsi(time) yang mengembalikan [{ y, f }] (ikut urutan kedalaman)
// GAMBAR_ATAS = fungsi(time) digambar di atas semua makhluk (efek jurus, bintang lumpuh, ...)
const GAMBAR_TANAH = [], BENDA_TINGGI = [], GAMBAR_ATAS = [];
const GAMBAR_PELURU = {};   // gambar peluru jenis baru: GAMBAR_PELURU[kind](p, time)
function drawGround(tx, ty, time) {
  const x = tx * T, y = ty * T, t = tileAt(tx, ty), h = hash(tx, ty);
  if (t === WATER || t === BRIDGE) {
    ctx.fillStyle = area.kabut ? "#28403f" : "#2d6a96"; ctx.fillRect(x, y, T, T);
    ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 2; ctx.beginPath();
    const o = Math.sin(time * 2 + ty) * 6; ctx.moveTo(x + 6 + o, y + 14); ctx.lineTo(x + 18 + o, y + 14); ctx.moveTo(x + 20 - o, y + 30); ctx.lineTo(x + 32 - o, y + 30); ctx.stroke();
    if (t === BRIDGE) {
      ctx.fillStyle = "#8b5e3c"; ctx.fillRect(x, y + 2, T, T - 4);
      ctx.fillStyle = "rgba(0,0,0,0.25)"; for (let i = 0; i < 4; i++) ctx.fillRect(x + i * 10, y + 2, 2, T - 4);
    }
    return;
  }
  if (t === LAVA) {
    const p = 0.5 + 0.5 * Math.sin(time * 2 + tx * 0.7 + ty);
    ctx.fillStyle = "#c2361a"; ctx.fillRect(x, y, T, T);
    ctx.fillStyle = `rgba(255,170,60,${0.35 + 0.35 * p})`; ctx.beginPath(); ctx.ellipse(x + 10 + (h % 20), y + 12 + (h % 14), 8, 5, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "rgba(255,230,140,0.5)"; if ((h + Math.floor(time * 2)) % 7 === 0) ctx.fillRect(x + (h % 30), y + (h % 26), 4, 4);
    return;
  }
  if (t === ASH) {
    ctx.fillStyle = h % 5 === 0 ? "#3a3232" : "#413838"; ctx.fillRect(x, y, T, T);
    if (h % 4 === 0) { ctx.strokeStyle = `rgba(255,110,40,${0.25 + 0.15 * Math.sin(time * 3 + h)})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 6, y + 10 + (h % 20)); ctx.lineTo(x + 18, y + 16 + (h % 12)); ctx.lineTo(x + 30, y + 12 + (h % 18)); ctx.stroke(); }
    return;
  }
  if (t === SAND) {
    ctx.fillStyle = h % 4 === 0 ? "#dcc086" : "#e2c891"; ctx.fillRect(x, y, T, T);
    ctx.fillStyle = "rgba(150,110,60,0.25)"; ctx.fillRect(x + (h % 31), y + (h % 29), 2, 2); ctx.fillRect(x + (h % 17) + 12, y + (h % 13) + 18, 2, 2);
    return;
  }
  if (t === MUD || t === REED) {
    ctx.fillStyle = h % 5 === 0 ? "#3d4630" : "#434d34"; ctx.fillRect(x, y, T, T);
    if (h % 6 === 0) { ctx.fillStyle = "rgba(120,150,170,0.25)"; ctx.beginPath(); ctx.ellipse(x + 12 + (h % 16), y + 14 + (h % 12), 7, 3, 0, 0, 6.28); ctx.fill(); }
    if (t === REED) {
      ctx.strokeStyle = "#6b7a3a"; ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) { const rx = x + 5 + i * 6, sw = Math.sin(time * 1.6 + tx + i) * 2; ctx.beginPath(); ctx.moveTo(rx, y + T - 2); ctx.lineTo(rx + sw, y + 6 + (i % 3) * 4); ctx.stroke(); }
      ctx.fillStyle = "#7a5a3a"; ctx.fillRect(x + 11, y + 6, 3, 7); ctx.fillRect(x + 25, y + 9, 3, 7);
    }
    return;
  }
  if (t === CLOUD) {
    // gumpalan awan putih yang bergerak pelan
    ctx.fillStyle = "#c9d6ea"; ctx.fillRect(x, y, T, T);
    const o = Math.sin(time * 0.6 + tx * 0.9 + ty * 0.5) * 4;
    ctx.fillStyle = "#eef3fb"; ctx.beginPath(); ctx.arc(x + 12 + o, y + 16, 13, 0, 6.28); ctx.arc(x + 28 - o, y + 24, 14, 0, 6.28); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.beginPath(); ctx.arc(x + 14 + o, y + 12, 6, 0, 6.28); ctx.fill();
    return;
  }
  if (t === STONE) {
    ctx.fillStyle = h % 5 === 0 ? "#76737f" : "#7d7a86"; ctx.fillRect(x, y, T, T);
    ctx.strokeStyle = "rgba(30,25,40,0.35)"; ctx.lineWidth = 1.5; ctx.strokeRect(x + 1, y + 1, T - 2, T - 2);
    if (h % 4 === 0) { ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(x + (h % 26) + 4, y + (h % 22) + 6, 6, 3); }
    return;
  }
  if (t === CORAL) {
    ctx.fillStyle = "#2d6a96"; ctx.fillRect(x, y, T, T);
    ctx.fillStyle = h % 2 ? "#e0708a" : "#f09a6a";
    for (let i = 0; i < 4; i++) { const cx = x + 8 + ((h >> (i * 3)) % 24), cy = y + 10 + ((h >> (i * 4)) % 22); ctx.beginPath(); ctx.arc(cx, cy, 5 + (i % 2) * 2, 0, 6.28); ctx.fill(); ctx.fillRect(cx - 1.5, cy, 3, 9); }
    return;
  }
  if (t === CAVE || t === WALL) {
    ctx.fillStyle = "#3a3142"; ctx.fillRect(x, y, T, T);
    ctx.fillStyle = "rgba(255,255,255,0.04)"; if (h % 3 === 0) ctx.fillRect(x + (h % 30), y + (h % 23), 4, 3);
    if (t === WALL) { ctx.fillStyle = "#231c2b"; ctx.fillRect(x, y + 8, T, T - 8); ctx.fillStyle = "#4e4258"; ctx.fillRect(x, y, T, 10); }
    return;
  }
  // alas batu besar: rumput, atau warna lantai area (area.alasBatu) di hutan batu / puncak naga
  // Negeri Bayang (area.bayang): rumput kelabu keunguan
  ctx.fillStyle = t === ROCK && area.alasBatu ? area.alasBatu : area.bayang ? (h % 5 === 0 ? "#38334a" : "#3d3850") : h % 5 === 0 ? "#3d7a37" : "#428340"; ctx.fillRect(x, y, T, T);
  if (t === PATH) {
    ctx.fillStyle = "#c8a46e"; ctx.fillRect(x, y, T, T);
    ctx.fillStyle = "rgba(90,60,30,0.25)"; ctx.fillRect(x + (h % 31), y + (h % 29), 3, 3); ctx.fillRect(x + (h % 17) + 10, y + (h % 13) + 20, 2, 2);
  } else if (t === FLOWER) {
    for (let i = 0; i < 3; i++) { ctx.fillStyle = ["#ffd166", "#ef476f", "#f7efe3"][(h + i) % 3]; ctx.beginPath(); ctx.arc(x + 8 + ((h >> (i * 3)) % 24), y + 8 + ((h >> (i * 4)) % 24), 2.5, 0, 6.28); ctx.fill(); }
  } else if (t === ROCK) {
    ctx.fillStyle = "#6f6a75"; ctx.beginPath(); ctx.ellipse(x + T / 2, y + T / 2 + 4, 16, 12, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#8d8894"; ctx.beginPath(); ctx.ellipse(x + T / 2 - 3, y + T / 2, 10, 7, 0, 0, 6.28); ctx.fill();
  } else if (h % 7 === 0) {
    ctx.strokeStyle = "rgba(20,60,20,0.5)"; ctx.lineWidth = 2; ctx.beginPath();
    ctx.moveTo(x + 12, y + 26); ctx.lineTo(x + 14, y + 19); ctx.moveTo(x + 16, y + 26); ctx.lineTo(x + 18, y + 18); ctx.stroke();
  }
}
function drawTree(tx, ty, time) {
  const x = tx * T + T / 2, y = ty * T + T, h = hash(tx, ty), sway = Math.sin(time * 1.5 + tx) * 1.5;
  ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.beginPath(); ctx.ellipse(x, y - 4, 18, 6, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#5b3a24"; ctx.fillRect(x - 4, y - 20, 8, 18);
  ctx.fillStyle = h % 2 ? "#2e6b34" : "#2a6230"; ctx.beginPath(); ctx.arc(x + sway, y - 34, 20, 0, 6.28); ctx.fill();
  ctx.fillStyle = h % 2 ? "#3a8a40" : "#367f3b"; ctx.beginPath(); ctx.arc(x - 6 + sway, y - 40, 12, 0, 6.28); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.beginPath(); ctx.arc(x - 8 + sway, y - 44, 6, 0, 6.28); ctx.fill();
}
function drawHouse(hs) {
  const x = hs.x * T, y = hs.y * T, w = 3 * T;
  ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(x + 4, y + 2 * T - 6, w, 8);
  ctx.fillStyle = "#e1c699"; ctx.fillRect(x + 6, y + 18, w - 12, 2 * T - 20);
  ctx.fillStyle = "#8b5e3c"; ctx.fillRect(x + 6, y + 18, 5, 2 * T - 20); ctx.fillRect(x + w - 11, y + 18, 5, 2 * T - 20);
  ctx.fillStyle = "#5b3a24"; ctx.fillRect(x + w / 2 - 9, y + 2 * T - 30, 18, 28);
  ctx.fillStyle = "#7da2c4"; ctx.fillRect(x + 20, y + 40, 14, 12); ctx.fillRect(x + w - 34, y + 40, 14, 12);
  // atap joglo bertingkat
  ctx.fillStyle = "#7a3b2e"; ctx.beginPath(); ctx.moveTo(x - 6, y + 24); ctx.lineTo(x + w + 6, y + 24); ctx.lineTo(x + w - 22, y - 6); ctx.lineTo(x + 22, y - 6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#93493a"; ctx.beginPath(); ctx.moveTo(x + 20, y - 4); ctx.lineTo(x + w - 20, y - 4); ctx.lineTo(x + w - 40, y - 30); ctx.lineTo(x + 40, y - 30); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.fillRect(x - 6, y + 20, w + 12, 4);
}

function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

function drawWeapon(c, weapon, pull) {
  if (weapon === "golok") {
    c.strokeStyle = "#5b3a24"; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 12); c.lineTo(0, 20); c.stroke();
    c.fillStyle = "#dfe6ee"; c.beginPath(); c.moveTo(-3, 20); c.lineTo(-3, 44); c.quadraticCurveTo(4, 50, 7, 40); c.lineTo(3, 20); c.closePath(); c.fill();
  } else if (weapon === "hammer") {
    c.strokeStyle = "#5b3a24"; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 6); c.lineTo(0, 44); c.stroke();
    c.fillStyle = "#8a8f99"; c.fillRect(-12, 38, 24, 17); c.fillStyle = "#5c616b"; c.fillRect(-12, 38, 24, 4);
  } else if (weapon === "bow") {
    c.strokeStyle = "#7a4b2a"; c.lineWidth = 3.5; c.beginPath(); c.arc(0, 6, 20, 0.25, Math.PI - 0.25); c.stroke();
    c.strokeStyle = "rgba(255,255,255,0.7)"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(19, 11); c.lineTo(0, 14 - pull); c.lineTo(-19, 11); c.stroke();
  } else if (weapon === "staff") {
    c.strokeStyle = "#6d4c2f"; c.lineWidth = 4; c.beginPath(); c.moveTo(0, -8); c.lineTo(0, 40); c.stroke();
    c.fillStyle = "rgba(255,140,60,0.3)"; c.beginPath(); c.arc(0, 45, 10, 0, 6.28); c.fill();
    c.fillStyle = "#ff9f43"; c.beginPath(); c.arc(0, 45, 5.5, 0, 6.28); c.fill();
  }
}

// Karakter manusia (pemain, NPC, pratinjau). e: {x,y,face,run,moving,swing,swingDur,inv,flash}
function drawPerson(c, e, look, time, opts = {}) {
  c.save(); c.translate(e.x, e.y - (e.lompat || 0));
  c.fillStyle = "rgba(0,0,0,0.3)"; c.beginPath(); c.ellipse(0, 0, 12, 4.5, 0, 0, 6.28); c.fill();
  if (e.inv > 0 && !opts.preview && Math.floor(time * 18) % 2 === 0) c.globalAlpha = 0.45;
  const flip = Math.cos(e.face) < -0.05 ? -1 : 1;
  const bob = e.moving ? Math.abs(Math.sin(e.run)) * 2 : 0, leg = e.moving ? Math.sin(e.run) * 3 : 0;
  const white = e.flash > 0;
  c.scale(flip, 1);
  c.fillStyle = "#2b2238"; c.fillRect(-7, -11 - bob + leg, 5, 11 - leg); c.fillRect(2, -11 - bob - leg, 5, 11 + leg);
  const up = Math.sin(e.face) < -0.5;
  const drawArm = () => {
    if (!look.weapon) return;
    let a = flip > 0 ? e.face : Math.PI - e.face;
    if (e.swing > 0 && (look.weapon === "golok" || look.weapon === "hammer" || look.weapon === "kerambit")) a += lerp(-1.5, 1.4, 1 - e.swing / e.swingDur);
    c.save(); c.translate(3, -22 - bob); c.rotate(a - Math.PI / 2);
    c.strokeStyle = white ? "#fff" : "#e3ae7f"; c.lineWidth = 5; c.lineCap = "round"; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 12); c.stroke();
    drawWeapon(c, look.weapon, e.swing > 0 && look.weapon === "bow" ? 6 : 0);
    c.restore();
  };
  if (up) drawArm();
  c.fillStyle = white ? "#fff" : look.color; roundRect(c, -10, -31 - bob, 20, 21, 6); c.fill();
  c.fillStyle = look.accent; c.fillRect(-10, -15 - bob, 20, 4);
  c.fillStyle = white ? "#fff" : "#e3ae7f"; c.beginPath(); c.arc(0, -41 - bob, 12, 0, 6.28); c.fill();
  c.fillStyle = look.hair || "#1f1a2a"; c.beginPath(); c.arc(0, -43 - bob, 12.5, Math.PI, Math.PI * 2); c.fill();
  if (look.hat) { c.fillStyle = look.hat; c.beginPath(); c.ellipse(0, -52 - bob, 16, 5, 0, 0, 6.28); c.fill(); c.fillRect(-7, -60 - bob, 14, 8); }
  else { c.fillStyle = look.accent; c.fillRect(-12.5, -48 - bob, 25, 4); c.beginPath(); c.moveTo(-12, -47 - bob); c.lineTo(-22, -44 - bob + Math.sin(time * 8 + e.x) * 2); c.lineTo(-20, -50 - bob); c.closePath(); c.fill(); }
  if (!up) { c.fillStyle = "#1f1a2a"; c.fillRect(3, -42 - bob, 2.5, 3.5); c.fillRect(8, -42 - bob, 2.5, 3.5); }
  if (!up) drawArm();
  c.restore();
}

function drawMonster(m, time) {
  const d = m.d, w = m.flash > 0;
  const flip = (m.state === "idle" ? m.wx : Math.cos(Math.atan2(P.y - m.y, P.x - m.x))) < 0 ? -1 : 1;
  ctx.save(); ctx.translate(m.x, m.y);
  // tanda serangan (telegraph)
  if (m.state === "windup") {
    const k = 1 - m.st / (d.boss && m.next === "slam" ? 0.9 : d.wind);
    ctx.fillStyle = `rgba(229,72,77,${0.15 + 0.35 * k})`;
    if (d.boss && m.next === "slam") { ctx.beginPath(); ctx.ellipse(0, 0, 130, 78, 0, 0, 6.28); ctx.fill(); }
    else if (d.charge) { ctx.save(); ctx.rotate(m.ang); ctx.fillRect(0, -d.r * 0.8, 200, d.r * 1.6); ctx.restore(); }
    else { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, d.range + d.r + 8, m.ang - 1, m.ang + 1); ctx.closePath(); ctx.fill(); }
  }
  if (d.ai) tandaBos(m);                     // tanda serangan bos baru (26-monster-baru.js)
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(0, 0, d.r, d.r * 0.38, 0, 0, 6.28); ctx.fill();
  ctx.scale(flip, 1);
  if (GAMBAR_MONSTER[m.type]) GAMBAR_MONSTER[m.type](m, time, w);
  else if (m.type === "kera") {
    const b = Math.abs(Math.sin(m.run)) * 3;
    ctx.strokeStyle = w ? "#fff" : "#6b4429"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-10, -10 - b); ctx.quadraticCurveTo(-24, -14, -20, -28 - b); ctx.stroke();
    ctx.fillStyle = w ? "#fff" : "#8a5a3b"; ctx.beginPath(); ctx.ellipse(0, -13 - b, 12, 11, 0, 0, 6.28); ctx.fill();
    ctx.beginPath(); ctx.arc(2, -28 - b, 9, 0, 6.28); ctx.fill();
    ctx.fillStyle = w ? "#fff" : "#d9a77a"; ctx.beginPath(); ctx.ellipse(5, -27 - b, 6, 5, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#1f1a2a"; ctx.fillRect(4, -30 - b, 2, 2.5); ctx.fillRect(8, -30 - b, 2, 2.5);
  } else if (m.type === "kelelawar") {
    const hover = -30 + Math.sin(m.run * 0.7) * 4, flap = Math.sin(m.run * 3) * 10;
    ctx.fillStyle = w ? "#fff" : "#3c2a52";
    ctx.beginPath(); ctx.moveTo(0, hover); ctx.lineTo(-24, hover - 6 - flap); ctx.lineTo(-14, hover + 4); ctx.lineTo(-6, hover + 2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(0, hover); ctx.lineTo(24, hover - 6 - flap); ctx.lineTo(14, hover + 4); ctx.lineTo(6, hover + 2); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.ellipse(0, hover, 8, 9, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#ff5c5c"; ctx.fillRect(1, hover - 3, 2, 2); ctx.fillRect(4, hover - 3, 2, 2);
  } else if (m.type === "babi") {
    const b = m.state === "charge" ? Math.abs(Math.sin(m.run * 3)) * 3 : Math.abs(Math.sin(m.run)) * 1.5;
    ctx.fillStyle = w ? "#fff" : "#2b211b"; ctx.fillRect(-12, -8, 5, 8); ctx.fillRect(6, -8, 5, 8);
    ctx.fillStyle = w ? "#fff" : "#4a3a30"; ctx.beginPath(); ctx.ellipse(0, -15 - b, 20, 12, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = w ? "#fff" : "#3a2c24"; ctx.beginPath(); ctx.moveTo(-14, -26 - b); ctx.lineTo(4, -28 - b); ctx.lineTo(-4, -22 - b); ctx.fill();
    ctx.fillStyle = w ? "#fff" : "#8c6a5a"; ctx.beginPath(); ctx.ellipse(20, -14 - b, 6, 5, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#f2ead8"; ctx.beginPath(); ctx.moveTo(16, -10 - b); ctx.lineTo(22, -20 - b); ctx.lineTo(19, -9 - b); ctx.fill();
    ctx.fillStyle = "#ff5c5c"; ctx.fillRect(10, -20 - b, 2.5, 2.5);
  } else if (m.type === "genderuwo") {
    const b = Math.sin(m.run * 0.5) * 2, raise = m.state === "windup" ? 1 - m.st / 0.9 : 0;
    ctx.fillStyle = w ? "#fff" : "#2b2420";
    ctx.beginPath(); ctx.ellipse(0, -42 - b, 28, 38, 0, 0, 6.28); ctx.fill();
    for (let i = 0; i < 10; i++) { const a = -Math.PI + (i / 9) * Math.PI; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 26, -42 - b + Math.sin(a) * 36); ctx.lineTo(Math.cos(a) * 34, -42 - b + Math.sin(a) * 44); ctx.lineTo(Math.cos(a + 0.2) * 26, -42 - b + Math.sin(a + 0.2) * 36); ctx.fill(); }
    ctx.strokeStyle = w ? "#fff" : "#2b2420"; ctx.lineWidth = 10; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(18, -50 - b); ctx.lineTo(34, -30 - b - raise * 40); ctx.moveTo(-18, -50 - b); ctx.lineTo(-30, -24 - b - raise * 40); ctx.stroke();
    ctx.fillStyle = "#ff3b3b"; ctx.shadowColor = "#ff3b3b"; ctx.shadowBlur = 10;
    ctx.beginPath(); ctx.arc(6, -62 - b, 3.5, 0, 6.28); ctx.arc(16, -62 - b, 3.5, 0, 6.28); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = "#e9d3a9"; ctx.beginPath(); ctx.moveTo(6, -50 - b); ctx.lineTo(9, -44 - b); ctx.lineTo(12, -50 - b); ctx.fill();
  }
  ctx.restore();
  if ((m.seen > 0 || m.hp < d.hp) && !d.boss) {
    const y = m.y - d.h - 14;
    ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(m.x - 21, y, 42, 5);
    ctx.fillStyle = "#e5484d"; ctx.fillRect(m.x - 20, y + 1, 40 * clamp(m.hp / d.hp, 0, 1), 3);
    // warna level: abu-abu = jauh lebih lemah, putih = setara, jingga = sedikit lebih kuat, merah = jauh lebih kuat
    const beda = d.lv - S.lv;
    ctx.font = "700 10px Nunito, sans-serif"; ctx.textAlign = "center";
    ctx.fillStyle = beda <= -ATURAN.skalaMonster.expLemahMulai ? "rgba(170,163,184,0.9)" : beda >= 3 ? "#ff7b7b" : beda >= 1 ? "#ffb86b" : "rgba(247,239,227,0.9)";
    ctx.fillText(`${d.name} Lv${d.lv}`, m.x, y - 3);
  }
}

function drawNpc(n, time) {
  if (n.kind === "cermin") return drawCermin(n, time);
  if (n.kind === "teleport") return drawTeleport(n, time);
  if (n.kind && GAMBAR_OBJEK[n.kind]) return GAMBAR_OBJEK[n.kind](n, time);   // benda teka-teki (25-teka-teki.js)
  const look = { color: n.color, accent: n.accent, hat: n.hat, hair: n.hair || "#3b2a22" };
  const face = Math.atan2(P.y - n.y, P.x - n.x);
  drawPerson(ctx, { x: n.x, y: n.y, face: dist(P, n) < 160 ? face : n.face, run: 0, moving: false, swing: 0, inv: 0, flash: 0 }, look, time);
  // nama: putih bergaris tepi hitam supaya terbaca di latar apa pun
  ctx.font = "800 11px Nunito, sans-serif"; ctx.textAlign = "center"; ctx.lineJoin = "round";
  ctx.lineWidth = 3; ctx.strokeStyle = "#000"; ctx.strokeText(n.name, n.x, n.y - 66);
  ctx.fillStyle = "#fff"; ctx.fillText(n.name, n.x, n.y - 66);
  // tanda di atas kepala: emas = cerita utama, biru = misi sampingan. "!" = ada misi, "?" = lapor
  const tanda = tandaNpc(n);
  if (tanda) {
    const by = n.y - 84 + Math.sin(time * 4) * 3;
    ctx.fillStyle = tanda.warna; ctx.beginPath(); ctx.arc(n.x, by, 10, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#1b1208"; ctx.font = "700 18px Teko, sans-serif"; ctx.fillText(tanda.mark, n.x, by + 6);
  }
  if (nearNpc === n && !isTouch) { ctx.font = "800 11px Nunito, sans-serif"; ctx.fillStyle = "#f7efe3"; ctx.fillText(t("npc.bicara"), n.x, n.y + 18); }
}

// Status hero di atas kepalanya: nama + level, bar nyawa (dengan angka), bar EXP tipis.
// Digambar dalam ukuran layar (tidak ikut zoom) supaya selalu terbaca.
function drawPlayerTag(px, py) {
  const mh = maxHp(), hp = Math.max(0, Math.ceil(P.hp)), w = 104, x = Math.round(px - w / 2);
  let y = Math.round(py);
  ctx.textAlign = "center"; ctx.lineJoin = "round";
  // nama & level
  ctx.font = "600 17px Teko, sans-serif";
  const nm = CLASSES[S.cls].name, lv = "Lv " + S.lv, gap = 6;
  const wn = ctx.measureText(nm).width, wl = ctx.measureText(lv).width, sx = px - (wn + gap + wl) / 2;
  ctx.textAlign = "left"; ctx.lineWidth = 3; ctx.strokeStyle = "rgba(10,6,20,0.85)";
  ctx.strokeText(nm, sx, y - 22); ctx.fillStyle = "#f7efe3"; ctx.fillText(nm, sx, y - 22);
  ctx.strokeText(lv, sx + wn + gap, y - 22); ctx.fillStyle = "#f4b942"; ctx.fillText(lv, sx + wn + gap, y - 22);
  // bar nyawa
  ctx.fillStyle = "rgba(10,6,20,0.8)"; ctx.fillRect(x - 2, y - 18, w + 4, 18);
  ctx.fillStyle = "rgba(255,255,255,0.12)"; ctx.fillRect(x, y - 16, w, 11);
  ctx.fillStyle = hp < mh * 0.3 ? "#e5484d" : "#5ad17a"; ctx.fillRect(x, y - 16, w * clamp(hp / mh, 0, 1), 11);
  ctx.font = "800 10px Nunito, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#fff";
  ctx.fillText(`${hp} / ${mh}`, px, y - 7);
  // bar EXP
  ctx.fillStyle = "#7fb2ff"; ctx.fillRect(x, y - 4, w * (levelMaks() ? 1 : clamp(S.exp / expNeed(S.lv), 0, 1)), 3);
}

// warna barang misi yang jatuh dari monster
const WARNA_BARANG = { kantong: "#c9a26b", sisik: "#9cc46a", daunSambiloto: "#5ad17a", kristalKabut: "#c9d6ff", taringUlar: "#e9e2c8", cakarKumbang: "#8d8894",
  mutiara: "#ffe6f0", kerangLaut: "#7fe3ff", koinBajak: "#f4b942", intiArca: "#b88cff", pecahanArca: "#a7a2b5", buluElang: "#d9b47a", sisikApi: "#ff7b39",
  ekorTikus: "#c99a8a", tulangTua: "#e9e2c8", serpihBayang: "#8a5ad0", sisikListrik: "#ffe066", intiAngin: "#9fd8ff", lencanaBayang: "#5d5070",
  debuLelembut: "#d9c8ff", mutiaraHitam: "#3a3048", kainBayang: "#2b1a40" };
function drawPickup(k, time) {
  if (GAMBAR_PICKUP[k.kind]) return GAMBAR_PICKUP[k.kind](k, time);   // jimat & serpih (53-drop-langka.js)
  const by = Math.sin(time * 5 + k.x) * 2 - 6;
  ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.beginPath(); ctx.ellipse(k.x, k.y, 6, 2.5, 0, 0, 6.28); ctx.fill();
  if (k.kind === "coin") { ctx.fillStyle = "#f4b942"; ctx.beginPath(); ctx.arc(k.x, k.y + by, 5, 0, 6.28); ctx.fill(); ctx.fillStyle = "#ffe08a"; ctx.fillRect(k.x - 1, k.y + by - 3, 2, 4); }
  else if (k.kind === "jamu") { ctx.fillStyle = "#c0563a"; roundRect(ctx, k.x - 5, k.y + by - 8, 10, 13, 3); ctx.fill(); ctx.fillStyle = "#e9d3a9"; ctx.fillRect(k.x - 4, k.y + by - 10, 8, 4); }
  else if (k.kind !== "taring") {
    // barang misi lain: kantong bercahaya berwarna (warna dari WARNA_BARANG)
    const col = WARNA_BARANG[k.kind] || "#f4b942", g = 0.5 + 0.5 * Math.sin(time * 6 + k.x);
    ctx.fillStyle = col; ctx.globalAlpha = 0.25 + 0.2 * g; ctx.beginPath(); ctx.arc(k.x, k.y + by - 3, 11, 0, 6.28); ctx.fill(); ctx.globalAlpha = 1;
    ctx.beginPath(); ctx.moveTo(k.x, k.y + by - 10); ctx.lineTo(k.x + 6, k.y + by - 3); ctx.lineTo(k.x, k.y + by + 4); ctx.lineTo(k.x - 6, k.y + by - 3); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.fillRect(k.x - 2, k.y + by - 7, 2, 3);
  }
  else if (k.kind === "taring") { ctx.fillStyle = "#f2ead8"; ctx.beginPath(); ctx.moveTo(k.x - 5, k.y + by + 4); ctx.quadraticCurveTo(k.x - 4, k.y + by - 10, k.x + 6, k.y + by - 10); ctx.quadraticCurveTo(k.x, k.y + by - 4, k.x + 1, k.y + by + 4); ctx.fill(); }
}

function render(now) {
  const time = now / 1000;
  const scale = clamp(Math.min(W / 720, H / 420), 0.75, 2.2);
  const vw = W / scale, vh = H / scale;
  let tx, ty;
  const tk = typeof targetKamera === "function" && targetKamera();   // cutscene (78-sutradara.js)
  if (tk) { tx = tk.x; ty = tk.y; }
  else if (P && mode !== "select") { tx = P.x; ty = P.y - 20; }
  else { tx = MW * T / 2 + Math.sin(time * 0.12) * 200; ty = 11 * T; }
  cam.x += (tx - cam.x) * 0.12; cam.y += (ty - cam.y) * 0.12;
  if (mode === "select") { cam.x = tx; cam.y = ty; }
  // kalau peta lebih kecil dari layar (misalnya gua), peta ditaruh di tengah
  const cx = MW * T <= vw ? MW * T / 2 : clamp(cam.x, vw / 2, MW * T - vw / 2);
  const cy = MH * T <= vh ? MH * T / 2 : clamp(cam.y, vh / 2, MH * T - vh / 2);
  let sx = 0, sy = 0;
  if (shake > 0) { sx = rand(-7, 7) * shake; sy = rand(-7, 7) * shake; }
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.fillStyle = "#1d3b1b"; ctx.fillRect(0, 0, W, H);
  ctx.setTransform(DPR * scale, 0, 0, DPR * scale, DPR * (W / 2 - cx * scale + sx), DPR * (H / 2 - cy * scale + sy));

  // termasuk petak di luar peta (digambar sebagai tepi area: pohon / dinding gua)
  const x0 = Math.floor((cx - vw / 2) / T) - 1, x1 = Math.ceil((cx + vw / 2) / T) + 1;
  const y0 = Math.floor((cy - vh / 2) / T) - 1, y1 = Math.ceil((cy + vh / 2) / T) + 2;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) drawGround(x, y, time);

  // efek di tanah
  for (const e of effects) {
    const k = e.t / e.dur;
    if (e.kind === "ring") { ctx.strokeStyle = e.red ? `rgba(229,72,77,${1 - k})` : `rgba(232,190,130,${1 - k})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(e.x, e.y, e.r * k, e.r * k * 0.6, 0, 0, 6.28); ctx.stroke(); }
    else if (e.kind === "pillar" && e.t < e.delay) { ctx.fillStyle = `rgba(255,120,50,${0.25 + 0.25 * Math.sin(time * 30)})`; ctx.beginPath(); ctx.ellipse(e.x, e.y, e.r, e.r * 0.55, 0, 0, 6.28); ctx.fill(); }
    else if (e.kind === "summon") drawSummonGround(e, time);
    else if (e.kind === "boom") { ctx.fillStyle = `rgba(255,150,60,${0.5 * (1 - k)})`; ctx.beginPath(); ctx.ellipse(e.x, e.y, e.r * (0.5 + k * 0.5), e.r * 0.6 * (0.5 + k * 0.5), 0, 0, 6.28); ctx.fill(); }
  }
  drawZonaAman(time);                        // lingkaran zona aman di sekitar teleport (33-zona-aman.js)
  for (const f of GAMBAR_TANAH) f(time);
  for (const k of pickups) drawPickup(k, time);

  // benda tinggi & makhluk diurutkan berdasarkan y (yang di bawah digambar belakangan)
  const list = [];
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (tileAt(x, y) === TREE) list.push({ y: (y + 1) * T - 2, f: () => drawTree(x, y, time) });
  for (const hs of houses) if (hs.x + 3 >= x0 && hs.x <= x1 && hs.y + 2 >= y0 && hs.y - 1 <= y1) list.push({ y: (hs.y + 2) * T - 1, f: () => drawHouse(hs) });
  if (mode !== "select" && P) {
    for (const n of NPCS) list.push({ y: n.y, f: () => drawNpc(n, time) });
    for (const b of benderaAman) list.push({ y: b.y, f: () => drawBenderaAman(b, time) });   // 33-zona-aman.js
    for (const f of BENDA_TINGGI) list.push(...f(time));
    for (const m of monsters) if (!m.dead) list.push({ y: m.y, f: () => drawMonster(m, time) });
    if (!P.dead) { const C = CLASSES[S.cls]; list.push({ y: P.y, f: () => drawPerson(ctx, P, { color: C.color, accent: C.accent, weapon: C.weapon }, time) }); }
  }
  list.sort((a, b) => a.y - b.y);
  for (const o of list) o.f();
  drawMusuhKhusus(time);                     // lingkaran bahaya & bola api musuh (26-monster-baru.js)
  if (mode !== "select") for (const f of GAMBAR_ATAS) f(time);

  // efek di udara
  for (const e of effects) {
    const k = e.t / e.dur;
    if (e.kind === "slash") { ctx.strokeStyle = `rgba(255,248,220,${0.85 * (1 - k)})`; ctx.lineWidth = e.big ? 7 : 5; ctx.beginPath(); ctx.arc(e.x, e.y, e.r * 0.85, e.ang - e.arc * (1 - k * 0.3), e.ang + e.arc * (0.4 + k * 0.6)); ctx.stroke(); }
    else if (e.kind === "summon") drawSummonAir(e);
    else if (e.kind === "petir") drawPetir(e);
    else if (e.kind === "claw") { ctx.strokeStyle = `rgba(255,90,90,${1 - k})`; ctx.lineWidth = 4; for (const o of [-8, 0, 8]) { ctx.beginPath(); ctx.arc(e.x, e.y + o, e.r * 0.7, e.ang - 0.6, e.ang + 0.6); ctx.stroke(); } }
    else if (e.kind === "pillar" && e.t >= e.delay) {
      const kk = (e.t - e.delay) / e.dur, h = 150 * Math.min(1, kk * 4);
      const g = ctx.createLinearGradient(0, e.y - h, 0, e.y);
      g.addColorStop(0, "rgba(255,209,102,0)"); g.addColorStop(0.4, "rgba(255,140,60,0.85)"); g.addColorStop(1, "rgba(255,80,40,0.95)");
      ctx.globalAlpha = 1 - Math.max(0, kk - 0.7) / 0.3; ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(e.x, e.y - h / 2, e.r * 0.55 + Math.sin(time * 40) * 3, h / 2, 0, 0, 6.28); ctx.fill(); ctx.globalAlpha = 1;
    }
  }
  for (const p of projs) {
    if (p.kind === "arrow") {
      const a = Math.atan2(p.vy, p.vx); ctx.save(); ctx.translate(p.x, p.y - 18); ctx.rotate(a);
      ctx.strokeStyle = "#e8d6b5"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(6, 0); ctx.stroke();
      ctx.fillStyle = "#dfe6ee"; ctx.beginPath(); ctx.moveTo(11, 0); ctx.lineTo(4, -3.5); ctx.lineTo(4, 3.5); ctx.closePath(); ctx.fill(); ctx.restore();
    } else if (GAMBAR_PELURU[p.kind]) GAMBAR_PELURU[p.kind](p, time);   // peluru hero baru (89-hero-baru.js)
    else {
      ctx.fillStyle = "rgba(255,140,60,0.3)"; ctx.beginPath(); ctx.arc(p.x, p.y - 18, 15, 0, 6.28); ctx.fill();
      ctx.fillStyle = "#ff7b39"; ctx.beginPath(); ctx.arc(p.x, p.y - 18, 8, 0, 6.28); ctx.fill();
      ctx.fillStyle = "#ffe08a"; ctx.beginPath(); ctx.arc(p.x, p.y - 18, 3.5, 0, 6.28); ctx.fill();
    }
  }
  for (const p of parts) { ctx.globalAlpha = Math.max(0, p.life / p.max); ctx.fillStyle = p.color;
    if (p.float) { ctx.globalAlpha *= 0.4; ctx.beginPath(); ctx.arc(p.x, p.y - p.z, p.s / 2, 0, 6.28); ctx.fill(); }   // kabut: bulat & tembus pandang
    else { const ps = p.s || 4; ctx.fillRect(p.x - ps / 2, p.y - p.z - ps / 2, ps, ps); }
  }
  ctx.globalAlpha = 1;
  ctx.textAlign = "center";
  for (const n of numbers) {
    ctx.font = `700 ${n.size}px Teko, sans-serif`; ctx.globalAlpha = Math.min(1, n.life * 2);
    ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillText(n.v, n.x + 1.5, n.y + 1.5); ctx.fillStyle = n.color; ctx.fillText(n.v, n.x, n.y);
  }
  ctx.globalAlpha = 1;
  // papan penunjuk arah di setiap gerbang
  if (mode !== "select") {
    ctx.font = "700 15px Teko, sans-serif"; ctx.textAlign = "center";
    for (const g of area.gerbang) {
      const gx = Math.min(Math.max((g.x0 + g.x1 + 1) / 2, 1.6), MW - 1.6) * T, gy = g.y0 === 0 ? (g.y1 + 1) * T + 22 : g.y0 * T - 10;
      const w = ctx.measureText(g.label).width + 16;
      ctx.fillStyle = "rgba(20,14,34,0.75)"; ctx.fillRect(gx - w / 2, gy - 15, w, 20);
      ctx.fillStyle = "#f4b942"; ctx.fillText(g.label, gx, gy);
    }
  }
  // gua: gelap di sekeliling pemain
  if (area.gelap && P && mode !== "select") {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const px = W / 2 + (P.x - cx) * scale, py = H / 2 + (P.y - 20 - cy) * scale;
    const g = ctx.createRadialGradient(px, py, 90 * scale, px, py, 330 * scale);
    g.addColorStop(0, "rgba(6,3,12,0)"); g.addColorStop(1, "rgba(6,3,12,0.82)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  // rawa berkabut: gumpalan kabut putih yang melayang pelan
  if (area.kabut && mode !== "select") {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.fillStyle = "rgba(20,30,30,0.22)"; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 7; i++) {
      const fx = ((i * 263 + time * (14 + i * 3)) % (W + 400)) - 200, fy = (i * 151) % H, r = 140 + (i % 3) * 60;
      const g = ctx.createRadialGradient(fx, fy, 10, fx, fy, r);
      g.addColorStop(0, "rgba(220,228,230,0.22)"); g.addColorStop(1, "rgba(220,228,230,0)");
      ctx.fillStyle = g; ctx.fillRect(fx - r, fy - r, r * 2, r * 2);
    }
  }
  // kawah panas: cahaya merah dari bawah
  // Negeri Bayang: cahaya ungu redup, tepi layar gelap
  if (area.bayang && mode !== "select") {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.fillStyle = `rgba(40,10,70,${0.16 + 0.03 * Math.sin(time * 0.8)})`; ctx.fillRect(0, 0, W, H);
    const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
    g.addColorStop(0, "rgba(10,4,20,0)"); g.addColorStop(1, "rgba(10,4,20,0.55)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  if (area.panas && mode !== "select") {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "rgba(255,80,20,0.04)"); g.addColorStop(1, `rgba(255,80,20,${0.16 + 0.04 * Math.sin(time * 2)})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  if (P && !P.dead && mode !== "select") {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    drawPlayerTag(W / 2 + (P.x - cx + sx) * scale, H / 2 + (P.y - 64 - cy + sy) * scale);
    drawIkonDebuff(W / 2 + (P.x - cx + sx) * scale, H / 2 + (P.y - 64 - cy + sy) * scale);   // 32-debuff.js
    drawIkonRamuan(W / 2 + (P.x - cx + sx) * scale, H / 2 + (P.y - 64 - cy + sy) * scale);   // 52-jimat.js
    drawTenaga(W / 2 + (P.x - cx + sx) * scale, H / 2 + (P.y - 64 - cy + sy) * scale);       // 49-pamungkas.js
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    drawLayarLambat();                                                                      // 50-hindar-tangkis.js
    // panah penunjuk tujuan (27-navigasi.js)
    if (mode === "play") drawPanahTujuan((x, y) => [W / 2 + (x - cx + sx) * scale, H / 2 + (y - cy + sy) * scale], time);
  }
  // kilatan putih (pemanggilan bos dari cermin)
  if (kilat > 0) { ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.fillStyle = `rgba(235,225,255,${0.75 * kilat})`; ctx.fillRect(0, 0, W, H); }
  if (P && P.dead) {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.fillStyle = "rgba(10,6,20,0.55)"; ctx.fillRect(0, 0, W, H);
  }
}
