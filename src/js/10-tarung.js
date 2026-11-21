// =====================================================================
// PERTARUNGAN
// Serangan biasa, peluru, damage ke monster & pemain. (Jurus: 48-jurus.js)
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
// opts: { kritis: pasti kritis, dot: jenis (damage berkala: tanpa kritis/terpental/efek), tanpaTenaga }
function damageMonster(m, amount, ang, kb, opts = {}) {
  if (m.dead || m.kebal) return;   // kebal: misalnya naga yang sedang terbang
  if (m.d.latihan) latihanAksi("serang");   // latihan dasar (56-cara-bermain.js)
  // pengali: selisih level (54), keadaan bos (57), jimat bos & beku rentan
  amount *= kaliKeMusuh(m) * (m.d.boss ? kaliKeadaanBos(m) * (1 + bonusStat("bos")) : 1) * (!m.d.boss && m.rentan > 0 ? 1.3 : 1);
  if (opts.dot) {
    const dmg = Math.max(1, Math.round(amount));
    m.hp -= dmg; m.aggro = true; m.seen = 4;
    numbers.push({ x: m.x + rand(-10, 10), y: m.y - m.d.h - 6, v: dmg, life: 0.6, color: (ATURAN.debuff[opts.dot] || {}).warna || "#ff9f43", size: 16 });
    if (m.hp <= 0) killMonster(m);
    return;
  }
  const kritisSiap = P && P.kritisSiap;   // setelah hindar sempurna (50-hindar-tangkis.js)
  const crit = opts.kritis || kritisSiap || Math.random() < ATURAN.kritis.peluang + bonusStat("kritis");
  if (kritisSiap) P.kritisSiap = false;
  const dmg = Math.max(1, Math.round(amount * rand(0.9, 1.1) * (crit ? ATURAN.kritis.kali + bonusStat("kritisKali") : 1)));
  m.hp -= dmg; m.flash = 0.12; m.aggro = true; m.seen = 4;
  if (!m.d.boss && kb) { m.kbx = Math.cos(ang) * kb; m.kby = Math.sin(ang) * kb; if (kb > 250 && m.state === "windup") { m.state = "recover"; m.st = 0.5; } }
  numbers.push({ x: m.x + rand(-8, 8), y: m.y - m.d.h - 10, v: dmg, life: 0.8, color: crit ? "#ffd166" : "#fff6e8", size: crit ? 30 : 22 });
  spark(m.x, m.y - m.d.h * 0.5, crit ? "#ffd166" : "#fff2c4", crit ? 14 : 8);
  freeze = Math.max(freeze, crit ? 0.06 : 0.035);
  (crit ? sfx.crit : sfx.hit)();
  // jimat: hisap nyawa, debuff ke musuh, lumpuh
  const hisap = bonusStat("hisap");
  if (hisap && P && !P.dead) P.hp = Math.min(maxHp(), P.hp + dmg * hisap);
  for (const e of dotSerangan()) if (Math.random() < e.peluang) beriDotMonster(m, e.jenis);
  if (bonusStat("lumpuh") && Math.random() < bonusStat("lumpuh")) lumpuhkanMonster(m, m.d.boss ? 0.4 : 1);
  if (!opts.tanpaTenaga) tambahTenaga(ATURAN.tenaga.pukul);
  if (m.hp <= 0) killMonster(m);
}

function killMonster(m) {
  if (m.ulang) return bosUlangKalah(m);   // bos dari cermin gaib: hadiahnya lain (13-cermin.js)
  if (m.d.latihan) { m.hp = m.d.hp; return; }
  m.dead = true; m.respawn = ATURAN.monster.munculLagi; S.kills++; sfx.die();
  spark(m.x, m.y - m.d.h * 0.5, "#c9bfd6", 18);
  tambahTenaga(ATURAN.tenaga.bunuh, true);
  dropMonster(m);                         // jimat & serpih (53-drop-langka.js)
  const coins = Math.round(rand(m.d.gold[0], m.d.gold[1]) * (1 + bonusStat("koin")));
  for (let i = 0; i < Math.min(6, coins); i++) pickups.push({ kind: "coin", v: Math.ceil(coins / Math.min(6, coins)), x: m.x + rand(-16, 16), y: m.y + rand(-12, 12), t: 0 });
  if (Math.random() < ATURAN.monster.dropJamu) pickups.push({ kind: "jamu", x: m.x, y: m.y + 6, t: 0 });
  const q = QUESTS[S.q.idx];
  if (q && S.q.status === "active") {
    if (q.type === "kill" && q.target === m.type) progressQuest(1);
    if (q.type === "collect" && m.type === "babi" && Math.random() < ATURAN.monster.dropTaring) pickups.push({ kind: "taring", x: m.x - 8, y: m.y, t: 0 });
  }
  kembalikanCurian(m);                    // tuyul: koin curian kembali (26-monster-baru.js)
  ceritaDrop(m); sampinganDrop(m);        // kantong curian / sisik buaya
  gainExp(m.d.exp);
  if (m.d.boss) {
    S.bos[m.type] = true; if (m.type === "genderuwo") S.bossDown = true;
    shake = 0.6; toast(t("toast.bosTumbang", { nama: m.d.name }), true); victory();
    setelahBosKalah(m.type);              // buka lorong (25-teka-teki.js)
  }
  ceritaKill(m); sampinganKill(m);        // progres cerita & misi sampingan
  saveSoon();
}

// deb = debuff dari serangan ini; kosong = debuff milik monster yang sedang menyerang
// opts: { dari: monster penyerang, mutlak: amukan bos (tak bisa ditangkis/dihindari), latihan: pukulan boneka }
function hurtPlayer(amount, ang, deb, opts = {}) {
  if (P.dead) return;
  if (cekHindarTangkis(amount, ang, opts)) return;          // hindar sempurna & tangkis (50-hindar-tangkis.js)
  if (opts.latihan) { numbers.push({ x: P.x, y: P.y - 60, v: t("latihan.kena"), life: 0.8, color: "#ff8b8e", size: 20 }); sfx.hurt(); return; }
  if ((P.inv > 0 && !opts.mutlak) || pAman) return;
  const dari = opts.dari || musuhAktif;
  const sumber = deb !== undefined ? deb : dari ? dari.d.debuff : null;
  // pengali: selisih level, monster melemah, jimat/ramuan tahan, jurus benteng
  let kali = (opts.mutlak ? 1 : kaliDariMusuh(dari) * kaliLemahMonster(dari)) * (1 - bonusStat("tahan"));
  if (P.benteng > 0) kali *= 0.3;
  const dmg = Math.max(1, Math.round(amount * rand(0.9, 1.1) * kali));
  P.hp -= dmg; P.inv = 0.6; P.flash = 0.15;
  if (!(P.benteng > 0)) { P.kbx = Math.cos(ang) * 280; P.kby = Math.sin(ang) * 280; }
  shake = Math.max(shake, 0.25); sfx.hurt();
  numbers.push({ x: P.x, y: P.y - 56, v: dmg, life: 0.8, color: "#ff8b8e", size: 22 });
  if (navigator.vibrate) { try { navigator.vibrate(40); } catch (e) {} }
  tambahTenaga(ATURAN.tenaga.dipukul, true);
  // pantulan damage (jimat duri / jurus benteng) ke penyerang jarak dekat
  const duri = bonusStat("duri") + (P.benteng > 0 ? 0.5 : 0);
  if (duri && dari && !dari.dead && dist(dari, P) < 200) damageMonster(dari, dmg * duri, Math.atan2(dari.y - P.y, dari.x - P.x), 0, { tanpaTenaga: true });
  // jimat bangkit (Sisik Naga): sekali tiap 5 menit
  if (P.hp <= 0 && bonusStat("bangkit") && !(S.bangkitSampai > Date.now())) {
    S.bangkitSampai = Date.now() + 300000; P.hp = Math.round(maxHp() * 0.3); P.inv = 2;
    toast(t("jimat.bangkit"), true); spark(P.x, P.y - 30, "#f4b942", 30); sfx.level();
    return;
  }
  if (P.hp <= 0) {
    P.hp = 0; P.dead = true; P.deadT = ATURAN.pingsan.lama; sfx.faint();
    const lost = Math.floor(S.gold * ATURAN.pingsan.koinHilang); S.gold -= lost;
    toast(t("toast.pingsan", { koin: lost }), false);
    saveSoon();
  } else beriDebuff(sumber);
}

function spark(x, y, color, n) {
  for (let i = 0; i < n; i++) { const a = rand(0, 6.28), s = rand(60, 260); parts.push({ x, y, z: 0, vz: 0, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: rand(0.2, 0.45), max: 0.45, color }); }
}
