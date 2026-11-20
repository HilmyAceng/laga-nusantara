// =====================================================================
// PERTARUNGAN
// Serangan, jurus tiap kelas, peluru, damage ke monster & pemain.
// =====================================================================
"use strict";

function nearestMonster(range) {
  let best = null, bd = range;
  for (const m of monsters) { if (m.dead) continue; const d = dist(P, m) - m.r; if (d < bd) { bd = d; best = m; } }
  return best;
}
function aimAngle(range) {
  const m = nearestMonster(range);
  return m ? Math.atan2(m.y - P.y, m.x - P.x) : P.face;
}

function playerAttack() {
  const C = CLASSES[S.cls], A = C.attack;
  if (A.type === "melee") {
    const ang = aimAngle(A.range + 70); P.face = ang;
    P.combo = P.comboT > 0 ? (P.combo + 1) % 3 : 0; P.comboT = 0.6;
    const mult = A.combo[P.combo], last = P.combo === 2;
    P.swing = P.swingDur = last ? 0.24 : 0.16; P.atkCd = A.cd * (last ? 1.5 : 1);
    P.kbx += Math.cos(ang) * 140; P.kby += Math.sin(ang) * 140;
    effects.push({ kind: "slash", x: P.x, y: P.y - 18, ang, r: A.range, arc: A.arc, t: 0, dur: 0.14, big: last });
    C.weapon === "hammer" ? sfx.heavy() : sfx.swing();
    for (const m of monsters) {
      if (m.dead) continue;
      const d = dist(P, m);
      if (d <= A.range + m.r && (d < m.r + 14 || angDiff(Math.atan2(m.y - P.y, m.x - P.x), ang) <= A.arc)) {
        damageMonster(m, atkPower() * mult, ang, last ? 320 : 150);
      }
    }
  } else {
    const ang = aimAngle(A.range); P.face = ang;
    P.swing = P.swingDur = 0.12; P.atkCd = A.cd;
    fire(A.proj, ang, A.speed, A.range, atkPower(), A.splash || 0);
  }
}
function fire(kind, ang, speed, range, dmg, splash, quiet) {
  if (!quiet) kind === "fire" ? sfx.fire() : sfx.arrow();
  projs.push({ kind, x: P.x + Math.cos(ang) * 14, y: P.y + Math.sin(ang) * 14, vx: Math.cos(ang) * speed, vy: Math.sin(ang) * speed, life: range / speed, dmg, splash });
}
function playerSkill() {
  const C = CLASSES[S.cls], K = C.skill;
  P.skillCd = K.cd; sfx[K.type]();
  if (K.type === "dash") {
    const ang = aimAngle(K.dist); P.face = ang;
    P.dash = 0.2; P.rdx = Math.cos(ang); P.rdy = Math.sin(ang); P.dashHit = new Set(); P.inv = Math.max(P.inv, 0.3);
  } else if (K.type === "volley") {
    const ang = aimAngle(C.attack.range); P.face = ang; P.swing = P.swingDur = 0.15;
    for (const a of [-0.28, -0.14, 0, 0.14, 0.28]) fire("arrow", ang + a, C.attack.speed, C.attack.range, atkPower() * K.mult, 0, true);
  } else if (K.type === "quake") {
    P.swing = P.swingDur = 0.3; shake = Math.max(shake, 0.45);
    effects.push({ kind: "ring", x: P.x, y: P.y, r: K.r, t: 0, dur: 0.5 });
    for (let i = 0; i < 24; i++) { const a = rand(0, 6.28), rr = rand(0, K.r); parts.push({ x: P.x + Math.cos(a) * rr, y: P.y + Math.sin(a) * rr, z: 0, vz: rand(150, 380), vx: 0, vy: 0, life: 0.6, max: 0.6, color: "#c9a26b" }); }
    for (const m of monsters) if (!m.dead && dist(P, m) <= K.r + m.r) damageMonster(m, atkPower() * K.mult, Math.atan2(m.y - P.y, m.x - P.x), 360);
  } else if (K.type === "pillar") {
    const tgt = nearestMonster(K.dist + 120);
    const ang = tgt ? Math.atan2(tgt.y - P.y, tgt.x - P.x) : P.face; P.face = ang; P.swing = P.swingDur = 0.2;
    const x = tgt ? tgt.x : P.x + Math.cos(ang) * K.dist, y = tgt ? tgt.y : P.y + Math.sin(ang) * K.dist;
    effects.push({ kind: "pillar", x, y, r: K.r, t: 0, delay: 0.3, dur: 0.45, done: false, dmg: atkPower() * K.mult });
  }
}

function damageMonster(m, amount, ang, kb) {
  if (m.dead) return;
  const crit = Math.random() < ATURAN.kritis.peluang;
  const dmg = Math.max(1, Math.round(amount * rand(0.9, 1.1) * (crit ? ATURAN.kritis.kali : 1)));
  m.hp -= dmg; m.flash = 0.12; m.aggro = true; m.seen = 4;
  if (!m.d.boss) { m.kbx = Math.cos(ang) * kb; m.kby = Math.sin(ang) * kb; if (kb > 250 && m.state === "windup") { m.state = "recover"; m.st = 0.5; } }
  numbers.push({ x: m.x + rand(-8, 8), y: m.y - m.d.h - 10, v: dmg, life: 0.8, color: crit ? "#ffd166" : "#fff6e8", size: crit ? 30 : 22 });
  spark(m.x, m.y - m.d.h * 0.5, crit ? "#ffd166" : "#fff2c4", crit ? 14 : 8);
  freeze = Math.max(freeze, crit ? 0.06 : 0.035);
  (crit ? sfx.crit : sfx.hit)();
  if (m.hp <= 0) killMonster(m);
}

function killMonster(m) {
  if (m.ulang) return bosUlangKalah(m);   // bos dari cermin gaib: hadiahnya lain (12-cermin.js)
  m.dead = true; m.respawn = ATURAN.monster.munculLagi; S.kills++; sfx.die();
  spark(m.x, m.y - m.d.h * 0.5, "#c9bfd6", 18);
  const coins = Math.round(rand(m.d.gold[0], m.d.gold[1]));
  for (let i = 0; i < Math.min(6, coins); i++) pickups.push({ kind: "coin", v: Math.ceil(coins / Math.min(6, coins)), x: m.x + rand(-16, 16), y: m.y + rand(-12, 12), t: 0 });
  if (Math.random() < ATURAN.monster.dropJamu) pickups.push({ kind: "jamu", x: m.x, y: m.y + 6, t: 0 });
  const q = QUESTS[S.q.idx];
  if (q && S.q.status === "active") {
    if (q.type === "kill" && q.target === m.type) progressQuest(1);
    if (q.type === "collect" && m.type === "babi" && Math.random() < ATURAN.monster.dropTaring) pickups.push({ kind: "taring", x: m.x - 8, y: m.y, t: 0 });
  }
  gainExp(m.d.exp);
  if (m.d.boss) { S.bossDown = true; shake = 0.6; toast("Genderuwo tumbang!", true); victory(); }
  saveSoon();
}

function hurtPlayer(amount, ang) {
  if (P.inv > 0 || P.dead) return;
  const dmg = Math.max(1, Math.round(amount * rand(0.9, 1.1)));
  P.hp -= dmg; P.inv = 0.6; P.flash = 0.15; P.kbx = Math.cos(ang) * 280; P.kby = Math.sin(ang) * 280;
  shake = Math.max(shake, 0.25); sfx.hurt();
  numbers.push({ x: P.x, y: P.y - 56, v: dmg, life: 0.8, color: "#ff8b8e", size: 22 });
  if (navigator.vibrate) { try { navigator.vibrate(40); } catch (e) {} }
  if (P.hp <= 0) {
    P.hp = 0; P.dead = true; P.deadT = ATURAN.pingsan.lama; sfx.faint();
    const lost = Math.floor(S.gold * ATURAN.pingsan.koinHilang); S.gold -= lost;
    toast(`Kamu pingsan... dibawa pulang ke desa (−${lost} koin)`, false);
    saveSoon();
  }
}

function spark(x, y, color, n) {
  for (let i = 0; i < n; i++) { const a = rand(0, 6.28), s = rand(60, 260); parts.push({ x, y, z: 0, vz: 0, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rand(0.2, 0.45), max: 0.45, color }); }
}
