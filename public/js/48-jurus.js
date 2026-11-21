// =====================================================================
// JURUS
// Tiap kelas punya 4 jurus (JURUS di config.js) yang terbuka bertahap sesuai
// level. Dua jurus bisa dipasang sekaligus:
//   slot 1 = tombol S (KONTROL.jurus)   slot 2 = tombol F (KONTROL.jurus2)
// Pilih jurus untuk slot di Menu › Pengaturan › Gameplay › Jurus (51-poin-jurus.js).
// Rank jurus (poin jurus) menambah damage, memperpendek jeda, dan di rank 3 / 5
// membuka kemampuan tambahan (naik3 / naik5).
// Simpanan: S.jurus = { slot: [id, id], rank: { id: n }, pasif: { id: n } }
// =====================================================================
"use strict";

// ---------- Simpanan ----------
// Simpanan lama belum punya data jurus/jimat/ramuan: lengkapi (dipanggil saat mulai main)
function lengkapiSave() {
  if (!S) return;
  S.jurus = S.jurus || { slot: [], rank: {}, pasif: {} };
  S.jurus.rank = S.jurus.rank || {}; S.jurus.pasif = S.jurus.pasif || {};
  S.jimat = S.jimat || { punya: {}, pakai: [], serpih: 0, pity: {} };
  S.jimat.punya = S.jimat.punya || {}; S.jimat.pakai = S.jimat.pakai || []; S.jimat.pity = S.jimat.pity || {}; S.jimat.serpih = S.jimat.serpih || 0;
  S.ramuan = S.ramuan || {};
  aturSlotAwal();
}

// ---------- Data ----------
const jurusKelas = () => JURUS[S.cls];
const jurusById = (id) => jurusKelas().find((j) => j.id === id);
const jurusTerbuka = (j) => S.lv >= j.buka;
const rankJurus = (id) => (S.jurus && S.jurus.rank[id]) || 0;
const teksJ = (j, k) => (bahasa === "en" && j.en && j.en[k]) || j[k];   // teks jurus sesuai bahasa
const namaJurus = (j) => teksJ(j, "name");
// slot kosong diisi jurus terbuka yang belum terpasang
function aturSlotAwal() {
  const sl = S.jurus.slot;
  for (let i = 0; i < 2; i++) if (sl[i] && !(jurusById(sl[i]) && jurusTerbuka(jurusById(sl[i])))) sl[i] = null;
  for (let i = 0; i < 2; i++) if (!sl[i]) { const j = jurusKelas().find((x) => jurusTerbuka(x) && !sl.includes(x.id)); sl[i] = j ? j.id : null; }
}
const jurusSlot = (i) => { const id = S.jurus && S.jurus.slot[i]; return id ? jurusById(id) : null; };
// jeda & damage setelah rank, jimat, dan ramuan
const cdJurus = (j) => j.cd * (1 - ATURAN.poinJurus.cdPerRank * rankJurus(j.id)) * (1 - bonusStat("cd"));
const multJurus = (j) => (j.mult || 1) * (1 + ATURAN.poinJurus.damagePerRank * rankJurus(j.id));
const dmgJurus = (j) => atkPower() * multJurus(j);

// musuh hidup dalam jarak tertentu, terdekat dulu
function musuhDekat(jarak, dari = P) {
  return monsters.filter((m) => !m.dead && !m.kebal && dist(dari, m) - m.r < jarak).sort((a, b) => dist(dari, a) - dist(dari, b));
}

// efek & peluru milik jurus (digambar oleh file ini)
let jurusFx = [], peluruJurus = [];

// ---------- Memakai jurus ----------
function pakaiJurus(slot) {
  const j = jurusSlot(slot);
  if (!j) { if (slot === 1) toast(t("jurus.slotKosong", { lv: (jurusKelas()[1] || {}).buka }), false); return; }
  if (P.cd[slot] > 0) return;
  P.cd[slot] = cdJurus(j); P.cdMaks[slot] = P.cd[slot];
  const r = rankJurus(j.id), dmg = dmgJurus(j);
  P.slotAktif = slot;
  latihanAksi("jurus");                 // latihan dasar (56-cara-bermain.js)
  JALAN_JURUS[j.type](j, r, dmg);
}

const JALAN_JURUS = {
  dash(j, r, dmg) {
    const ang = aimAngle(j.dist); P.face = ang;
    P.dash = 0.2; P.rdx = Math.cos(ang); P.rdy = Math.sin(ang); P.dashHit = new Set(); P.inv = Math.max(P.inv, 0.3);
    P.dashDmg = dmg; P.dashDot = r >= 5 ? "berdarah" : null; P.dashLanjut = r >= 3 ? 1 : 0;
    sfx.dash();
  },
  spin(j, r, dmg) {
    P.spin = { t: 0, dur: 0.75, hits: j.hits, done: 0, r: j.r * (r >= 3 ? 1.3 : 1), dmg, tarik: r >= 5 };
    sfx.dash();
  },
  wave(j, r, dmg) {
    const ang = aimAngle(j.range); P.face = ang; P.swing = P.swingDur = 0.2;
    for (const a of r >= 3 ? [-0.26, 0, 0.26] : [0])
      peluruJurus.push({ kind: "gelombang", x: P.x, y: P.y, vx: Math.cos(ang + a) * j.speed, vy: Math.sin(ang + a) * j.speed, life: j.range / j.speed, dmg, lebar: 34, hit: new Set(), lumpuh: r >= 5 ? 0.8 : 0 });
    sfx.swing(); sfx.dash();
  },
  blink(j, r, dmg) {
    const list = musuhDekat(j.jarak).slice(0, r >= 3 ? 5 : j.target);
    if (!list.length) { P.cd[P.slotAktif] = 0.5; toast(t("jurus.takAdaMusuh"), false); return; }
    P.blink = { list, i: 0, t: 0, dmg, kritis: r >= 5 }; P.inv = Math.max(P.inv, 0.2 + list.length * 0.14);
    sfx.roll();
  },
  volley(j, r, dmg) {
    const C = CLASSES[S.cls], ang = aimAngle(C.attack.range); P.face = ang; P.swing = P.swingDur = 0.15;
    const sebar = r >= 3 ? [-0.39, -0.26, -0.13, 0, 0.13, 0.26, 0.39] : [-0.28, -0.14, 0, 0.14, 0.28];
    for (const a of sebar) {
      if (r >= 5) peluruJurus.push({ kind: "panah", x: P.x, y: P.y, vx: Math.cos(ang + a) * C.attack.speed, vy: Math.sin(ang + a) * C.attack.speed, life: C.attack.range / C.attack.speed, dmg, lebar: 10, hit: new Set() });
      else fire("arrow", ang + a, C.attack.speed, C.attack.range, dmg, 0, true);
    }
    sfx.volley();
  },
  snare(j, r, dmg) {
    const C = CLASSES[S.cls], ang = aimAngle(C.attack.range); P.face = ang; P.swing = P.swingDur = 0.15;
    peluruJurus.push({ kind: "jerat", x: P.x, y: P.y, vx: Math.cos(ang) * 620, vy: Math.sin(ang) * 620, life: 0.7, dmg, lebar: 12, hit: new Set(), sekali: true, ledak: r >= 3, kuat: r >= 5 });
    sfx.arrow();
  },
  rain(j, r, dmg) {
    const m = nearestMonster(380);
    const x = m ? m.x : P.x + Math.cos(P.face) * 200, y = m ? m.y : P.y + Math.sin(P.face) * 200;
    jurusFx.push({ kind: "hujan", x, y, r: j.r * (r >= 3 ? 1.3 : 1), t: 0, dur: 1.6, tick: 0, ticks: j.ticks, dmg, racun: r >= 5 });
    sfx.volley();
  },
  pierce(j, r, dmg) {
    const ang = aimAngle(j.range); P.face = ang; P.swing = P.swingDur = 0.25;
    for (const a of r >= 3 ? [-0.07, 0.07] : [0])
      peluruJurus.push({ kind: "tembus", x: P.x, y: P.y, vx: Math.cos(ang + a) * j.speed, vy: Math.sin(ang + a) * j.speed, life: j.range / j.speed, dmg, lebar: 26, hit: new Set(), bos: 1.5, dot: r >= 5 ? "berdarah" : null });
    shake = Math.max(shake, 0.2); sfx.arrow(); sfx.dash();
  },
  quake(j, r, dmg) {
    const rr = j.r * (r >= 3 ? 1.3 : 1);
    gempaDi(P.x, P.y, rr, dmg, r >= 3 ? 0.7 : 0, 0);
    if (r >= 5) jurusFx.push({ kind: "susulan", x: P.x, y: P.y, r: rr * 1.15, t: 0, dur: 0.5, dmg: dmg * 0.6 });
    P.swing = P.swingDur = 0.3; sfx.quake();
  },
  guard(j, r) {
    P.benteng = r >= 3 ? 4.5 : j.lama; P.bentengPulih = r >= 5;
    spark(P.x, P.y - 30, "#8fd3ff", 16); sfx.heavy();
  },
  leap(j, r, dmg) {
    const m = nearestMonster(j.jarak);
    const x1 = m ? m.x : P.x + Math.cos(P.face) * 150, y1 = m ? m.y : P.y + Math.sin(P.face) * 150;
    P.leap = { t: 0, dur: 0.42, x0: P.x, y0: P.y, x1, y1, r: j.r * (r >= 3 ? 1.3 : 1), dmg, kuat: r >= 5 };
    P.inv = Math.max(P.inv, 0.5); sfx.charge();
  },
  roar(j, r) {
    const lama = r >= 3 ? 9 : j.lama;
    for (const m of musuhDekat(j.r)) { lumpuhkanMonster(m, m.d.boss ? 0.5 : 1.2); lemahkanMonster(m, lama); }
    P.raung = lama;
    if (r >= 5) tambahTenaga(30, true);
    jurusFx.push({ kind: "raung", x: P.x, y: P.y, r: j.r, t: 0, dur: 0.6 });
    shake = Math.max(shake, 0.4); sfx.growl();
  },
  pillar(j, r, dmg) {
    const tgt = nearestMonster(j.dist + 120);
    const ang = tgt ? Math.atan2(tgt.y - P.y, tgt.x - P.x) : P.face; P.face = ang; P.swing = P.swingDur = 0.2;
    const x = tgt ? tgt.x : P.x + Math.cos(ang) * j.dist, y = tgt ? tgt.y : P.y + Math.sin(ang) * j.dist;
    const titik = r >= 3 ? [[0, 0], [-70, 25], [70, -25]] : [[0, 0]];
    titik.forEach(([dx, dy], i) => effects.push({ kind: "pillar", x: x + dx, y: y + dy, r: j.r, t: 0, delay: 0.3 + i * 0.12, dur: 0.45, done: false, dmg, dot: r >= 5 ? "terbakar" : null }));
    sfx.pillar();
  },
  orbit(j, r, dmg) {
    P.orbit = { t: 0, lama: j.lama, n: r >= 3 ? 5 : j.bola, dmg, kena: new Map(), hancur: r >= 5 };
    sfx.fire();
  },
  freeze(j, r, dmg) {
    const rr = j.r * (r >= 3 ? 1.27 : 1);
    for (const m of musuhDekat(rr)) {
      damageMonster(m, dmg, Math.atan2(m.y - P.y, m.x - P.x), 60);
      lumpuhkanMonster(m, m.d.boss ? (r >= 5 ? 1 : 0.6) : (r >= 5 ? 3 : 2), "beku");
      if (r >= 5) m.rentan = m.stun;
    }
    jurusFx.push({ kind: "es", x: P.x, y: P.y, r: rr, t: 0, dur: 0.5 });
    sfx.zap(); sfx.quake();
  },
  meteor(j, r, dmg) {
    const m = nearestMonster(420);
    const x = m ? m.x : P.x + Math.cos(P.face) * 200, y = m ? m.y : P.y + Math.sin(P.face) * 200;
    jatuhkanMeteor(x, y, j.r, dmg, 1.2, r >= 5);
    if (r >= 3) jatuhkanMeteor(x + rand(-90, 90), y + rand(-60, 60), j.r * 0.8, dmg * 0.7, 1.5, r >= 5);
    sfx.charge();
  },
};

// Gempa di titik (x, y): damage + lumpuh (musuh biasa / bos)
function gempaDi(x, y, r, dmg, lumpuh, lumpuhBos) {
  effects.push({ kind: "ring", x, y, r, t: 0, dur: 0.5 });
  shake = Math.max(shake, 0.45);
  for (let i = 0; i < 24; i++) { const a = rand(0, 6.28), rr = rand(0, r); parts.push({ x: x + Math.cos(a) * rr, y: y + Math.sin(a) * rr, z: 0, vz: rand(150, 380), vx: 0, vy: 0, life: 0.6, max: 0.6, color: "#c9a26b" }); }
  for (const m of monsters) if (!m.dead && Math.hypot(m.x - x, m.y - y) <= r + m.r) {
    damageMonster(m, dmg, Math.atan2(m.y - y, m.x - x), 360);
    const l = m.d.boss ? lumpuhBos : lumpuh;
    if (l) lumpuhkanMonster(m, l);
  }
}
function jatuhkanMeteor(x, y, r, dmg, delay, kawah) {
  jurusFx.push({ kind: "meteor", x, y, r, t: 0, dur: delay + 0.4, delay, dmg, kawah, jatuh: false });
}

// ---------- Jurus yang mengunci gerak (dipanggil dari updatePlayer) ----------
// true = pemain sedang melompat / berpindah kilat, jangan proses gerak biasa
function jurusMengunci(dt) {
  if (P.leap) {
    const L = P.leap; L.t += dt;
    const k = Math.min(1, L.t / L.dur);
    P.x = lerp(L.x0, L.x1, k); P.y = lerp(L.y0, L.y1, k); P.lompat = Math.sin(k * Math.PI) * 70;
    if (k >= 1) {
      P.leap = null; P.lompat = 0;
      if (solidAt(P.x, P.y)) { P.x = L.x0; P.y = L.y0; }
      gempaDi(P.x, P.y, L.r, L.dmg, L.kuat ? 1.8 : 1, L.kuat ? 0.8 : 0); sfx.slam();
    }
    return true;
  }
  if (P.blink) {
    const B = P.blink; B.t -= dt;
    if (B.t <= 0) {
      const m = B.list[B.i];
      if (!m) { P.blink = null; P.inv = Math.max(P.inv, 0.3); return false; }
      B.i++; B.t = 0.13;
      if (!m.dead) {
        const a = Math.atan2(m.y - P.y, m.x - P.x), x = m.x + Math.cos(a) * (m.r + 18), y = m.y + Math.sin(a) * (m.r + 18);
        spark(P.x, P.y - 20, "#3a2a55", 10);
        if (!solidAt(x, y)) { P.x = x; P.y = y; }
        P.face = a + Math.PI;
        effects.push({ kind: "slash", x: m.x, y: m.y - 20, ang: a, r: 70, arc: 1.4, t: 0, dur: 0.14, big: true });
        damageMonster(m, B.dmg, a, 200, { kritis: B.kritis });
        sfx.swing();
      }
    }
    return true;
  }
  return false;
}

// ---------- Update tiap frame ----------
function updateJurus(dt) {
  if (!P || P.dead) { jurusFx = []; peluruJurus = []; return; }
  for (let i = 0; i < 2; i++) P.cd[i] = Math.max(0, P.cd[i] - dt);
  // tebasan kilat rank 3: terjang lagi ke musuh terdekat
  if (P.dashLanjut && P.dash <= 0) {
    P.dashLanjut = 0;
    const m = musuhDekat(260).find((x) => !P.dashHit.has(x));
    if (m) { const a = Math.atan2(m.y - P.y, m.x - P.x); P.dash = 0.16; P.rdx = Math.cos(a); P.rdy = Math.sin(a); P.face = a; P.inv = Math.max(P.inv, 0.25); sfx.dash(); }
  }
  // badai golok
  if (P.spin) {
    const sp = P.spin; sp.t += dt;
    while (sp.done < sp.hits && sp.t >= (sp.done * sp.dur) / sp.hits) {
      sp.done++;
      for (const m of monsters) if (!m.dead && dist(P, m) <= sp.r + m.r) {
        const a = Math.atan2(m.y - P.y, m.x - P.x);
        damageMonster(m, sp.dmg, a, sp.tarik ? 0 : 90);
        if (sp.tarik && !m.d.boss) moveEnt(m, -Math.cos(a) * 26, -Math.sin(a) * 26, m.d.fly);
        if (sp.tarik) beriDotMonster(m, "berdarah");
      }
      sfx.swing();
    }
    if (sp.t >= sp.dur) P.spin = null;
  }
  if (P.benteng > 0) {
    P.benteng -= dt;
    if (P.benteng <= 0 && P.bentengPulih) { P.hp = Math.min(maxHp(), P.hp + maxHp() * 0.15); if (adaDebuff()) P.debuff = {}; spark(P.x, P.y - 30, "#7dffa8", 16); }
  }
  if (P.raung > 0) P.raung -= dt;
  // perisai api
  if (P.orbit) {
    const O = P.orbit; O.t += dt;
    for (let i = 0; i < O.n; i++) {
      const a = O.t * 4 + (i / O.n) * 6.28, x = P.x + Math.cos(a) * 70, y = P.y - 16 + Math.sin(a) * 44;
      for (const m of monsters) {
        if (m.dead || Math.hypot(m.x - x, m.y - 16 - y) > m.r + 22) continue;
        if ((O.kena.get(m) || 0) > O.t) continue;
        O.kena.set(m, O.t + 0.45);
        damageMonster(m, O.dmg, a, 120); beriDotMonster(m, "terbakar", 2);
      }
      if (O.hancur) for (const s of tembakan) if (Math.hypot(s.x - x, s.y + 14 - y) < 24) { s.life = 0; spark(s.x, s.y, "#ffb347", 6); }
    }
    if (O.t >= O.lama) P.orbit = null;
  }
  // peluru jurus
  for (const p of peluruJurus) {
    p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
    const tl = tileAt(Math.floor(p.x / T), Math.floor(p.y / T));
    if (tl === WALL || tl === HOUSE || (p.kind !== "gelombang" && p.kind !== "tembus" && (tl === TREE || tl === ROCK))) p.life = 0;
    if (p.life <= 0) continue;
    for (const m of monsters) {
      if (m.dead || p.hit.has(m) || Math.hypot(m.x - p.x, m.y - p.y) > m.r + p.lebar) continue;
      p.hit.add(m);
      const a = Math.atan2(p.vy, p.vx);
      damageMonster(m, p.dmg * (m.d.boss && p.bos ? p.bos : 1), a, p.kind === "tembus" ? 220 : 140);
      if (p.lumpuh) lumpuhkanMonster(m, m.d.boss ? 0 : p.lumpuh);
      if (p.dot) beriDotMonster(m, p.dot);
      if (p.kind === "jerat") {
        const kena = p.ledak ? monsters.filter((x) => !x.dead && Math.hypot(x.x - m.x, x.y - m.y) < 80 + x.r) : [m];
        for (const x of kena) { lambatkanMonster(x, 3); lumpuhkanMonster(x, x.d.boss ? (p.kuat ? 0.8 : 0) : (p.kuat ? 2 : 1.2), "jerat"); }
        jurusFx.push({ kind: "jaring", x: m.x, y: m.y, r: p.ledak ? 80 : 30, t: 0, dur: 0.5 });
      }
      if (p.sekali) { p.life = 0; break; }
    }
    if (Math.random() < 0.6) parts.push({ x: p.x, y: p.y, z: 18, vz: 10, vx: rand(-20, 20), vy: rand(-20, 20), life: 0.25, max: 0.25, color: p.kind === "gelombang" ? "#e9f5f2" : p.kind === "jerat" ? "#c9a26b" : "#ffe08a" });
  }
  peluruJurus = peluruJurus.filter((p) => p.life > 0);
  // efek berjangka
  for (const e of jurusFx) {
    e.t += dt;
    if (e.kind === "hujan") {
      while (e.tick < e.ticks && e.t >= (e.tick * e.dur) / e.ticks) {
        e.tick++;
        for (const m of monsters) if (!m.dead && Math.hypot(m.x - e.x, m.y - e.y) < e.r + m.r) { damageMonster(m, e.dmg, -Math.PI / 2, 30); if (e.racun) beriDotMonster(m, "racun"); }
        for (let i = 0; i < 5; i++) { const a = rand(0, 6.28), rr = rand(0, e.r); parts.push({ x: e.x + Math.cos(a) * rr, y: e.y + Math.sin(a) * rr * 0.6, z: 120, vz: -600, vx: 0, vy: 0, life: 0.22, max: 0.22, color: "#e8d6b5", s: 3 }); }
        sfx.arrow();
      }
    } else if (e.kind === "susulan" && !e.done && e.t >= e.dur) { e.done = true; gempaDi(e.x, e.y, e.r, e.dmg, 0.5, 0); sfx.quake(); }
    else if (e.kind === "meteor" && !e.jatuh && e.t >= e.delay) {
      e.jatuh = true; shake = Math.max(shake, 0.6); sfx.boom(); sfx.slam();
      for (const m of monsters) if (!m.dead && Math.hypot(m.x - e.x, m.y - e.y) < e.r + m.r) { damageMonster(m, e.dmg, Math.atan2(m.y - e.y, m.x - e.x), 300); beriDotMonster(m, "terbakar"); }
      spark(e.x, e.y, "#ff7b39", 30);
      if (e.kawah) jurusFx.push({ kind: "kawah", x: e.x, y: e.y, r: e.r * 0.9, t: 0, dur: 3, tick: 0, dmg: e.dmg * 0.12 });
    } else if (e.kind === "kawah") {
      if (e.t >= e.tick) { e.tick += 0.5; for (const m of monsters) if (!m.dead && Math.hypot(m.x - e.x, m.y - e.y) < e.r + m.r) damageMonster(m, e.dmg, 0, 0, { dot: true }); }
    }
  }
  jurusFx = jurusFx.filter((e) => e.t < e.dur);
}
UPDATE_TAMBAHAN.push(updateJurus);

// ---------- Gambar ----------
// di tanah: area hujan panah, tanda meteor, kawah, gelombang es, raungan
GAMBAR_TANAH.push(function (time) {
  if (!P) return;
  for (const e of jurusFx) {
    const k = e.t / e.dur;
    ctx.save();
    if (e.kind === "hujan") {
      ctx.fillStyle = "rgba(232,214,181,0.16)"; ctx.strokeStyle = "rgba(232,214,181,0.6)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.ellipse(e.x, e.y, e.r, e.r * 0.6, 0, 0, 6.28); ctx.fill(); ctx.stroke();
    } else if (e.kind === "meteor" && !e.jatuh) {
      const kk = e.t / e.delay;
      ctx.fillStyle = `rgba(255,110,40,${0.15 + 0.3 * kk})`; ctx.beginPath(); ctx.ellipse(e.x, e.y, e.r * kk, e.r * kk * 0.6, 0, 0, 6.28); ctx.fill();
      ctx.strokeStyle = "rgba(255,180,90,0.8)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(e.x, e.y, e.r, e.r * 0.6, 0, 0, 6.28); ctx.stroke();
    } else if (e.kind === "kawah") {
      ctx.fillStyle = `rgba(255,90,30,${0.35 * (1 - k) + 0.1})`; ctx.beginPath(); ctx.ellipse(e.x, e.y, e.r, e.r * 0.6, 0, 0, 6.28); ctx.fill();
      if (Math.random() < 0.5) parts.push({ x: e.x + rand(-e.r, e.r) * 0.7, y: e.y + rand(-e.r, e.r) * 0.4, z: 0, vz: rand(60, 160), vx: 0, vy: 0, life: 0.4, max: 0.4, color: Math.random() < 0.5 ? "#ff7b39" : "#ffd166" });
    } else if (e.kind === "es") {
      ctx.strokeStyle = `rgba(170,230,255,${1 - k})`; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(e.x, e.y, e.r * k, e.r * k * 0.6, 0, 0, 6.28); ctx.stroke();
      ctx.fillStyle = `rgba(200,240,255,${0.25 * (1 - k)})`; ctx.fill();
    } else if (e.kind === "raung") {
      for (let i = 0; i < 3; i++) { const kk = Math.min(1, k + i * 0.2); ctx.strokeStyle = `rgba(255,120,80,${0.7 * (1 - kk)})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(e.x, e.y, e.r * kk, e.r * kk * 0.6, 0, 0, 6.28); ctx.stroke(); }
    } else if (e.kind === "jaring") {
      ctx.strokeStyle = `rgba(201,162,107,${1 - k})`; ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.28; ctx.beginPath(); ctx.moveTo(e.x, e.y); ctx.lineTo(e.x + Math.cos(a) * e.r, e.y + Math.sin(a) * e.r * 0.6); ctx.stroke(); }
      ctx.beginPath(); ctx.ellipse(e.x, e.y, e.r * 0.6, e.r * 0.36, 0, 0, 6.28); ctx.stroke();
    }
    ctx.restore();
  }
});
// di udara: peluru jurus, meteor jatuh, badai golok, perisai api, benteng
GAMBAR_ATAS.push(function (time) {
  if (!P || P.dead) return;
  for (const p of peluruJurus) {
    const a = Math.atan2(p.vy, p.vx);
    ctx.save(); ctx.translate(p.x, p.y - 18); ctx.rotate(a);
    if (p.kind === "gelombang") {
      ctx.strokeStyle = "rgba(233,245,242,0.9)"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(-10, 0, 30, -1.1, 1.1); ctx.stroke();
      ctx.strokeStyle = "rgba(120,220,200,0.6)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(-18, 0, 26, -1, 1); ctx.stroke();
    } else if (p.kind === "tembus") {
      ctx.shadowColor = "#ffe08a"; ctx.shadowBlur = 16; ctx.strokeStyle = "#fff3c4"; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(14, 0); ctx.stroke();
      ctx.fillStyle = "#ffe08a"; ctx.beginPath(); ctx.moveTo(26, 0); ctx.lineTo(10, -9); ctx.lineTo(10, 9); ctx.closePath(); ctx.fill();
    } else {
      ctx.strokeStyle = p.kind === "jerat" ? "#c9a26b" : "#e8d6b5"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(6, 0); ctx.stroke();
      ctx.fillStyle = "#dfe6ee"; ctx.beginPath(); ctx.moveTo(11, 0); ctx.lineTo(4, -3.5); ctx.lineTo(4, 3.5); ctx.closePath(); ctx.fill();
      if (p.kind === "jerat") { ctx.strokeStyle = "rgba(201,162,107,0.8)"; ctx.beginPath(); ctx.arc(-14, 0, 6, 0, 6.28); ctx.stroke(); }
    }
    ctx.restore();
  }
  for (const e of jurusFx) if (e.kind === "meteor" && !e.jatuh) {
    const kk = e.t / e.delay, h = 420 * (1 - kk);
    ctx.save(); ctx.shadowColor = "#ff7b39"; ctx.shadowBlur = 20;
    ctx.fillStyle = "#ff7b39"; ctx.beginPath(); ctx.arc(e.x + h * 0.4, e.y - h, 16 + e.r * 0.08, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#ffe08a"; ctx.beginPath(); ctx.arc(e.x + h * 0.4, e.y - h, 8, 0, 6.28); ctx.fill(); ctx.restore();
  }
  if (P.spin) {
    const a0 = P.spin.t * 22;
    ctx.save(); ctx.strokeStyle = "rgba(255,248,220,0.8)"; ctx.lineWidth = 5;
    for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.ellipse(P.x, P.y - 16, P.spin.r, P.spin.r * 0.6, 0, a0 + i * Math.PI, a0 + i * Math.PI + 1.6); ctx.stroke(); }
    ctx.restore();
  }
  if (P.orbit) for (let i = 0; i < P.orbit.n; i++) {
    const a = P.orbit.t * 4 + (i / P.orbit.n) * 6.28, x = P.x + Math.cos(a) * 70, y = P.y - 16 + Math.sin(a) * 44;
    ctx.fillStyle = "rgba(255,140,60,0.35)"; ctx.beginPath(); ctx.arc(x, y, 14, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#ff7b39"; ctx.beginPath(); ctx.arc(x, y, 8, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#ffe08a"; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 6.28); ctx.fill();
  }
  if (P.benteng > 0) {
    ctx.save(); ctx.strokeStyle = `rgba(143,211,255,${0.55 + 0.25 * Math.sin(time * 10)})`; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(P.x, P.y - 28, 30, 38, 0, 0, 6.28); ctx.stroke();
    ctx.fillStyle = "rgba(143,211,255,0.12)"; ctx.fill(); ctx.restore();
  }
  if (P.raung > 0 && Math.random() < 0.3) parts.push({ x: P.x + rand(-12, 12), y: P.y, z: rand(10, 40), vz: 60, vx: 0, vy: 0, life: 0.4, max: 0.4, color: "#ff7b39", s: 4, float: true });
});

// ---------- Tombol ----------
addEventListener("keydown", (e) => {
  if (e.repeat) return;
  const act = ACTION_OF[keyName(e)];
  if (act === "jurus2") press.skill2 = true;
  if (act === "pamungkas") press.ult = true;
});
bindBtn("bSkill2", () => (press.skill2 = true));
bindBtn("bUlt", () => (press.ult = true));

// ---------- HUD: kotak jeda jurus (PC) & tombol sentuh ----------
function hudJurus() {
  const lbl = (act) => { const k = KONTROL[act][0]; return KEY_LABEL[k] || (k.length === 1 ? k.toUpperCase() : k); };
  for (let i = 0; i < 2; i++) {
    const j = jurusSlot(i), sfxid = i ? "2" : "";
    const nama = j ? namaJurus(j) : t("jurus.kosong");
    const key = "hj" + i, cd = j ? P.cd[i] : 0, maks = j ? P.cdMaks[i] || cdJurus(j) : 1;
    if (!isTouch) {
      setSlot($("sSkill" + sfxid), $("sSkill" + sfxid + "Sec"), "ss" + i, cd, maks);
      setText($("sSkill" + sfxid + "Name"), "sn" + i, nama);
      setText($("sSkill" + sfxid + "Key"), "sk" + i, lbl(i ? "jurus2" : "jurus"));
      $("sSkill" + sfxid).classList.toggle("kosong", !j);
    }
    const b = $("bSkill" + sfxid), c = Math.round((cd / maks) * 40) / 40;
    if (last[key] !== c) { last[key] = c; b.style.setProperty("--cd", c); }
    setText(b.firstElementChild, "bn" + i, nama);
    b.classList.toggle("kosong", !j);
  }
  hudPamungkas(lbl("pamungkas"));   // 49-pamungkas.js
}
