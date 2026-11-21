// =====================================================================
// UPDATE
// Dijalankan tiap frame: gerak pemain, AI monster, peluru, efek.
// =====================================================================
"use strict";

function updatePlayer(dt) {
  if (P.dead) {
    P.deadT -= dt;
    if (P.deadT <= 0) {
      const revive = () => { const keepFace = P.face; P = makePlayer(); P.face = keepFace; P.inv = 2; cam.x = P.x; cam.y = P.y; };
      if (areaId !== "desa") { P.deadT = 99; goArea("desa", null, revive); } else revive();
    }
    return;
  }
  const C = CLASSES[S.cls];
  const inp = readInput();
  if (punyaDebuff("bingung")) { inp.mx = -inp.mx; inp.my = -inp.my; }   // debuff bingung: arah terbalik
  P.inv = Math.max(0, P.inv - dt); P.flash = Math.max(0, P.flash - dt);
  P.atkCd = Math.max(0, P.atkCd - dt); P.rollCd = Math.max(0, P.rollCd - dt);
  P.comboT = Math.max(0, P.comboT - dt); P.swing = Math.max(0, P.swing - dt);
  P.moving = false;

  if (P.dash > 0) {
    P.dash -= dt;
    moveEnt(P, P.rdx * 1150 * dt, P.rdy * 1150 * dt);
    for (const m of monsters) if (!m.dead && !P.dashHit.has(m) && dist(P, m) < m.r + 26) { P.dashHit.add(m); damageMonster(m, P.dashDmg, Math.atan2(P.rdy, P.rdx), 300); if (P.dashDot) beriDotMonster(m, P.dashDot); }
    if (Math.random() < 0.8) parts.push({ x: P.x, y: P.y - rand(5, 35), z: 0, vz: 0, vx: -P.rdx * 60, vy: -P.rdy * 60, life: 0.25, max: 0.25, color: C.color });
    return;
  }
  if (jurusMengunci(dt)) return;          // lompatan palu / langkah bayang (48-jurus.js)
  if (punyaDebuff("lumpuh")) {            // lumpuh: diam di tempat (55-debuff-baru.js)
    if (P.kbx || P.kby) { moveEnt(P, P.kbx * dt, P.kby * dt); const k = Math.exp(-12 * dt); P.kbx *= k; P.kby *= k; }
    nearNpc = null; return;
  }
  if (P.roll > 0) { P.roll -= dt; moveEnt(P, P.rdx * ATURAN.hindar.kecepatan * dt, P.rdy * ATURAN.hindar.kecepatan * dt); P.run += dt * 30; return; }

  const slow = (P.swing > 0 ? 0.35 : 1) * kaliGerak() * (1 + bonusStat("gerak"));   // debuff lambat (32-debuff.js), jimat/ramuan gerak
  if (inp.mx || inp.my) {
    moveEnt(P, inp.mx * C.speed * slow * dt, inp.my * C.speed * slow * dt);
    P.moving = true; P.run += dt * 11;
    if (P.swing <= 0) P.face = Math.atan2(inp.my, inp.mx);
  }
  if (P.kbx || P.kby) { moveEnt(P, P.kbx * dt, P.kby * dt); const k = Math.exp(-12 * dt); P.kbx *= k; P.kby *= k; if (Math.abs(P.kbx) + Math.abs(P.kby) < 5) P.kbx = P.kby = 0; }

  // hindar: dengan arah = berguling, tanpa arah = tangkis (50-hindar-tangkis.js)
  if (inp.roll && P.rollCd <= 0 && hindarAtauTangkis(inp)) return;
  if (inp.ult) pakaiPamungkas();                 // 49-pamungkas.js
  else if (inp.skill) pakaiJurus(0);             // 48-jurus.js
  else if (inp.skill2) pakaiJurus(1);
  else if (inp.attack && P.atkCd <= 0 && !P.spin) playerAttack();
  if (inp.potion) {
    latihanAksi("jamu");
    // jamu: pulihkan nyawa; setelah belajar resep penawar (Pak Joko) juga menyembuhkan semua debuff
    const obati = S.penawar && adaDebuff();
    if (S.potions > 0 && (P.hp < maxHp() || obati)) { S.potions--; const h = Math.round(maxHp() * ATURAN.jamuPulih * (1 + bonusStat("jamu"))); P.hp = Math.min(maxHp(), P.hp + h); numbers.push({ x: P.x, y: P.y - 56, v: "+" + h, life: 0.9, color: "#5ad17a", size: 22 }); sfx.drink(); if (obati) sembuhkanDebuff("jamu"); saveSoon(); }
    else if (S.potions <= 0) toast(t("toast.jamuHabis"), false);
  }
  nearNpc = null;
  for (const n of NPCS) if (bisaBicara(n) && dist(P, n) < ATURAN.jarakBicara) nearNpc = n;
  if (!P.dead) checkGates();
  if (inp.talk && nearNpc) talk(nearNpc);
}

function updateMonster(m, dt) {
  const d = m.d;
  if (d.kaliSerangCepat) dt *= d.kaliSerangCepat;   // bos yang menguat: semua gerakan & serangannya lebih cepat (54-skala-monster.js)
  if (m.dead) {
    if (!d.boss) { m.respawn -= dt; if (m.respawn <= 0 && dist(P, m.home) > 420) Object.assign(m, makeMonster(m.type, m.home)); }
    return;
  }
  m.flash = Math.max(0, m.flash - dt); m.cd = Math.max(0, m.cd - dt); m.seen = Math.max(0, m.seen - dt); m.run += dt * 8;
  if (m.kbx || m.kby) { moveEnt(m, m.kbx * dt, m.kby * dt, d.fly); const k = Math.exp(-10 * dt); m.kbx *= k; m.kby *= k; if (Math.abs(m.kbx) + Math.abs(m.kby) < 5) m.kbx = m.kby = 0; }
  if (monsterLumpuh(m, dt)) return;                    // lumpuh / beku / terjerat (55-debuff-baru.js)
  const alive = !P.dead && !pAman, dp = dist(m, P), toP = Math.atan2(P.y - m.y, P.x - m.x);   // pemain di zona aman = tidak dikejar
  const reach = d.range + d.r + P.r;
  if (d.boss && bosTangguh(m, dt, dp, toP)) return;   // tipuan, amukan, kuda-kuda, kombo (57-bos-tangguh.js)
  if (d.ai) { AI_BOS[d.ai](m, dt, dp, toP); return; }   // bos baru punya pola sendiri (26-monster-baru.js)
  perilakuMonster(m, dt, dp, toP);                       // kedip / tembak
  switch (m.state) {
    case "idle": {
      m.wt -= dt;
      if (m.wt <= 0) { m.wt = rand(1, 3); const a = rand(0, 6.28); const go = Math.random() < 0.6; m.wx = go ? Math.cos(a) : 0; m.wy = go ? Math.sin(a) : 0; }
      if (dist(m, m.home) > 140) { const a = Math.atan2(m.home.y - m.y, m.home.x - m.x); m.wx = Math.cos(a); m.wy = Math.sin(a); }
      moveEnt(m, m.wx * d.speed * 0.35 * dt, m.wy * d.speed * 0.35 * dt, d.fly);
      if (alive && (dp < d.aggro || m.aggro)) { m.state = "chase"; m.aggro = true; }
      break;
    }
    case "chase": {
      if (!alive || dist(m, m.home) > (d.boss ? 380 : 560)) { m.state = "return"; break; }
      m.seen = 4;
      const wob = d.fly ? Math.sin(m.run * 0.6) * 0.8 : 0;
      if (dp > reach - 6) moveEnt(m, Math.cos(toP + wob) * d.speed * dt, Math.sin(toP + wob) * d.speed * dt, d.fly);
      if (dp <= reach && m.cd <= 0) {
        m.state = "windup"; m.ang = toP;
        if (d.boss) { m.next = m.next === "slam" ? "swipe" : "slam"; m.st = m.next === "slam" ? 0.9 : d.wind; if (m.next === "slam") sfx.growl(); }
        else m.st = d.wind;
      }
      break;
    }
    case "windup": {
      m.st -= dt;
      if (!d.charge && !d.boss) m.ang = toP;
      if (m.st <= 0) {
        if (d.charge) { m.state = "charge"; m.st = 0.55; m.hitP = false; sfx.charge(); break; }
        if (d.boss && m.next === "slam") {
          shake = 0.5; sfx.slam(); effects.push({ kind: "ring", x: m.x, y: m.y, r: 130, t: 0, dur: 0.5, red: true });
          if (dp < 130 + P.r) hurtPlayer(d.atk * 1.5, toP);
        } else if (dp <= reach + 10 && angDiff(toP, m.ang) < 1.2) {
          const kena = P.inv <= 0 && !P.dead;
          hurtPlayer(d.atk, m.ang);
          if (kena && d.copet) { copet(m); break; }    // tuyul mencopet lalu kabur
        }
        effects.push({ kind: "claw", x: m.x, y: m.y - d.h * 0.4, ang: m.ang, r: d.range + d.r, t: 0, dur: 0.15 }); sfx.claw();
        selesaiSerang(m, toP);                         // kadang memukul dua kali (54-skala-monster.js)
      }
      break;
    }
    case "charge": {
      m.st -= dt;
      const bx = m.x, by = m.y;
      moveEnt(m, Math.cos(m.ang) * 400 * dt, Math.sin(m.ang) * 400 * dt);
      if (!m.hitP && dist(m, P) < d.r + P.r + 4) { m.hitP = true; hurtPlayer(d.atk, m.ang); }
      if (m.st <= 0 || (bx === m.x && by === m.y)) { m.state = "recover"; m.st = 0.6; m.cd = d.cd; }
      break;
    }
    case "recover": m.st -= dt; if (m.st <= 0) m.state = alive ? "chase" : "return"; break;
    case "lari": lari(m, dt, toP); break;
    case "return": {
      const a = Math.atan2(m.home.y - m.y, m.home.x - m.x);
      moveEnt(m, Math.cos(a) * d.speed * dt, Math.sin(a) * d.speed * dt, d.fly);
      m.hp = Math.min(d.hp, m.hp + d.hp * 0.5 * dt);
      if (dist(m, m.home) < 20) { m.state = "idle"; m.aggro = false; m.hp = d.hp; }
      break;
    }
  }
}

// Kait update untuk fitur lain (mis. puzzle): fungsi(dt) dipanggil tiap frame saat bermain
const UPDATE_TAMBAHAN = [];
function update(dt) {
  if (mode !== "play") return;
  if (freeze > 0) { freeze -= dt; return; }
  updatePlayer(dt);
  for (const m of monsters) { musuhAktif = m; updateMonster(m, dt); if (!m.dead) jagaZonaAman(m); }
  musuhAktif = null;
  updateDebuff(dt);       // 32-debuff.js
  updateZonaAman(dt);     // 33-zona-aman.js
  for (const f of UPDATE_TAMBAHAN) f(dt);

  for (const p of projs) {
    p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
    const t = tileAt(Math.floor(p.x / T), Math.floor(p.y / T));
    if (t === TREE || t === ROCK || t === HOUSE || t === WALL) p.life = 0;
    if (p.life <= 0) { if (p.kind === "fire") explode(p); continue; }
    for (const m of monsters) {
      if (m.dead) continue;
      if (Math.hypot(m.x - p.x, m.y - p.y) < m.r + 10) {
        if (p.kind === "fire") explode(p); else damageMonster(m, p.dmg, Math.atan2(p.vy, p.vx), 120);
        p.life = 0; break;
      }
    }
    if (p.kind === "fire" && Math.random() < 0.7) parts.push({ x: p.x, y: p.y, z: 18, vz: 30, vx: rand(-20, 20), vy: rand(-20, 20), life: 0.3, max: 0.3, color: "#ffb347" });
  }
  projs = projs.filter((p) => p.life > 0);

  for (const e of effects) {
    e.t += dt;
    if (e.kind === "pillar" && !e.done && e.t >= e.delay) {
      e.done = true; shake = Math.max(shake, 0.25);
      for (const m of monsters) if (!m.dead && Math.hypot(m.x - e.x, m.y - e.y) < e.r + m.r) { damageMonster(m, e.dmg, Math.atan2(m.y - e.y, m.x - e.x), 200); if (e.dot) beriDotMonster(m, e.dot); }
    }
    if (e.kind === "pillar" && e.t >= e.delay && e.t <= e.delay + e.dur) for (let i = 0; i < 3; i++) parts.push({ x: e.x + rand(-e.r * 0.6, e.r * 0.6), y: e.y + rand(-10, 10), z: rand(0, 40), vz: rand(180, 380), vx: 0, vy: 0, life: 0.4, max: 0.4, color: Math.random() < 0.5 ? "#ff7b39" : "#ffd166" });
  }
  effects = effects.filter((e) => e.t < (e.delay || 0) + e.dur);
  updateCermin(dt);
  updateTeleport(dt);
  updateMusuhKhusus(dt);

  for (const k of pickups) {
    k.t += dt;
    const d = dist(k, P);
    if (!P.dead && d < 90 && k.t > 0.3) { const a = Math.atan2(P.y - k.y, P.x - k.x); k.x += Math.cos(a) * 320 * dt; k.y += Math.sin(a) * 320 * dt; }
    if (!P.dead && d < 22 && k.t > 0.3) {
      k.got = true;
      if (ambilKhusus(k)) {}                         // jimat & serpih pusaka (53-drop-langka.js)
      else if (k.kind === "coin") { S.gold += k.v; sfx.coin(); }
      else if (k.kind === "jamu") { S.potions++; notifItem(t("toast.dapatJamu")); sfx.item(); }
      else if (k.kind === "taring") { S.items.taring = (S.items.taring || 0) + 1; sfx.item(); const q = QUESTS[S.q.idx]; if (q && q.type === "collect" && S.q.status === "active") progressQuest(1); else notifItem(t("toast.dapatTaring")); }
      else {   // barang cerita / misi: notif kecil kiri bawah (39-notif-item.js)
        S.items[k.kind] = (S.items[k.kind] || 0) + 1; sfx.item();
        const l = langkahCerita();
        if (!(l && l.tipe === "collect" && l.item === k.kind)) notifDapat(k.kind);
        ceritaItem(k.kind); sampinganItem(k.kind);
      }
      saveSoon();
    }
    if (k.t > 40 && k.kind !== "jimat") k.got = true;
  }
  pickups = pickups.filter((k) => !k.got);

  for (const p of parts) { p.x += p.vx * dt; p.y += p.vy * dt; p.vz -= (p.float ? 0 : 900) * dt; p.z = Math.max(0, p.z + p.vz * dt); p.life -= dt; }
  parts = parts.filter((p) => p.life > 0);
  for (const n of numbers) { n.y -= 36 * dt; n.life -= dt; }
  numbers = numbers.filter((n) => n.life > 0);
  if (shake > 0) shake -= dt;
  if (saveTimer > 0) { saveTimer -= dt; if (saveTimer <= 0) save(); }
}
function explode(p) {
  effects.push({ kind: "boom", x: p.x, y: p.y, r: p.splash, t: 0, dur: 0.3 }); sfx.boom();
  spark(p.x, p.y, "#ff9f43", 10);
  for (const m of monsters) if (!m.dead && Math.hypot(m.x - p.x, m.y - p.y) < p.splash + m.r) damageMonster(m, p.dmg, Math.atan2(m.y - p.y, m.x - p.x), 160);
}
