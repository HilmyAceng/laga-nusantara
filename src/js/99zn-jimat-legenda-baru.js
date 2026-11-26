// =====================================================================
// PASIF UNIK JIMAT LEGENDA ARC 2 (data jimat di 04i-monster-arc2.js)
//   rampas        Topeng Juragan      mengalahkan musuh: 25% koin tambahan, 4% satu jamu
//   lariAngin     Tapal Sembrani      berlari 2 detik tanpa henti → pukulan berikutnya +30%
//   kulitBatu     Inti Watu Gede      tiap 12 detik dapat perisai 15% nyawa maksimal
//   pelukWewe     Selendang Wewe      nyawa < 30%: tak tersentuh 3 detik & pulih 20% (jeda 60 detik)
//   esRetak       Taring Yaksa Es     musuh yang lumpuh menerima damage +30% darimu
//   aumanPutih    Kumis Macan Putih   tiap 20 detik mengaum: musuh sekitar lemah 4 detik
//   wayangBayangan Wayang Sepi        wayang bayangan menebas musuh terdekat tiap 2,5 detik (40% damage)
//   jejakEs       Kalung Salju Abadi  berguling meninggalkan jejak es: musuh di atasnya lambat
// (Tugu Mini Leluhur memakai pasif pulihDiam yang sudah ada.)
// =====================================================================
"use strict";

for (const k of ["rampas", "lariAngin", "kulitBatu", "pelukWewe", "esRetak", "aumanPutih", "wayangBayangan", "jejakEs"]) { EFEK_UNIK.add(k); if (!EFEK_STATUS.includes(k)) EFEK_STATUS.push(k); }
Object.assign(LEGENDA, {
  rampasPeluang: 0.25, rampasJamu: 0.04, lariWaktu: 2, lariKali: 1.3, batuJeda: 12, batuPerisai: 0.15,
  weweBatas: 0.3, weweJeda: 60, wewePulih: 0.2, weweKebal: 3, esKali: 1.3, aumJeda: 20, aumR: 230, aumLemah: 4,
  wayangJeda: 2.5, wayangJarak: 280, wayangKali: 0.4, jejakEsLama: 2.5, jejakEsR: 34,
});
Object.assign(TEKS.id, {
  "efek.rampas": "Rampasan Juragan: mengalahkan musuh, 25% peluang koin tambahan & 4% peluang jamu",
  "efek.lariAngin": "Lari Sembrani: berlari 2 detik tanpa henti → pukulan berikutnya +30%",
  "efek.kulitBatu": "Kulit Batu: tiap 12 detik dapat perisai 15% nyawa maksimal",
  "efek.pelukWewe": "Pelukan Wewe: nyawa < 30% → tak tersentuh 3 detik & pulih 20% (tiap 60 detik)",
  "efek.esRetak": "Es Retak: musuh yang lumpuh menerima damage +30% darimu",
  "efek.aumanPutih": "Auman Putih: tiap 20 detik mengaum, musuh di sekitar menjadi lemah 4 detik",
  "efek.wayangBayangan": "Wayang Bayangan: wayang bayangan menebas musuh terdekat tiap 2,5 detik (40% damage)",
  "efek.jejakEs": "Jejak Es: berguling meninggalkan jejak es yang melambatkan musuh",
});
Object.assign(TEKS.en, {
  "efek.rampas": "Smuggler's Loot: defeating an enemy has a 25% chance of extra coins & 4% chance of a jamu",
  "efek.lariAngin": "Sembrani Stride: run for 2 seconds nonstop → your next hit +30%",
  "efek.kulitBatu": "Stone Skin: every 12 seconds gain a shield of 15% max health",
  "efek.pelukWewe": "Wewe's Embrace: below 30% health → untouchable for 3 seconds & heal 20% (every 60 seconds)",
  "efek.esRetak": "Cracking Ice: stunned enemies take +30% damage from you",
  "efek.aumanPutih": "White Roar: every 20 seconds you roar, weakening nearby enemies for 4 seconds",
  "efek.wayangBayangan": "Shadow Puppet: a shadow puppet slashes the nearest enemy every 2.5 seconds (40% damage)",
  "efek.jejakEs": "Ice Trail: rolling leaves an ice trail that slows enemies",
});

// ---------- Damage keluar: lari angin, es retak; kalah: rampasan ----------
{
  const asli = damageMonster;
  damageMonster = function (m, amount, ang, kb, opts = {}) {
    if (!opts.dot && !opts.gema && !opts.tanpaTenaga) {
      if (P && P.anginSiap && punyaUnik("lariAngin")) { amount *= LEGENDA.lariKali; P.anginSiap = false; P.lariT = 0; spark(m.x, m.y - 20, "#d9b36a", 10); }
      if (m.stun > 0 && punyaUnik("esRetak")) amount *= LEGENDA.esKali;
    }
    const hidup = !m.dead, hasil = asli(m, amount, ang, kb, opts);
    if (hidup && m.dead && punyaUnik("rampas")) {
      if (Math.random() < LEGENDA.rampasPeluang) { const g = Math.round((m.d.gold[0] + m.d.gold[1]) / 2 * 0.6); S.gold += g; efekTeksMelayang(m.x, m.y - 40, `+${g}`, "#f4b942"); }
      if (Math.random() < LEGENDA.rampasJamu) { S.potions++; notifItem("+1 " + Lx(["Jamu", "Jamu"])); }
    }
    return hasil;
  };
}

// ---------- Per frame ----------
let batuT = 0, weweT = 0, aumT = 0, wayangT = 0, jejakEs = [], aumFx = [], tebasWayang = [];
UPDATE_TAMBAHAN.push((dt) => {
  if (!P || P.dead || !S) return;
  // Tapal Sembrani
  if (punyaUnik("lariAngin")) { P.lariT = P.moving ? (P.lariT || 0) + dt : 0; if (P.lariT >= LEGENDA.lariWaktu && !P.anginSiap) { P.anginSiap = true; spark(P.x, P.y - 10, "#d9b36a", 8); } }
  // Inti Watu Gede
  if (punyaUnik("kulitBatu")) { batuT -= dt; if (batuT <= 0) { batuT = LEGENDA.batuJeda; if (typeof beriPerisai === "function") beriPerisai(LEGENDA.batuPerisai, LEGENDA.batuJeda); } }
  // Selendang Wewe
  weweT -= dt;
  if (punyaUnik("pelukWewe") && weweT <= 0 && P.hp > 0 && P.hp < maxHp() * LEGENDA.weweBatas) {
    weweT = LEGENDA.weweJeda; P.inv = Math.max(P.inv || 0, LEGENDA.weweKebal);
    P.hp = Math.min(maxHp(), P.hp + maxHp() * LEGENDA.wewePulih);
    spark(P.x, P.y - 30, "#c9a6ff", 18); toast(Lx(["✦ Pelukan Wewe melindungimu!", "✦ Wewe's Embrace shields you!"]), false);
  }
  // Kumis Macan Putih
  if (punyaUnik("aumanPutih")) {
    aumT -= dt;
    if (aumT <= 0 && monsters.some((m) => !m.dead && Math.hypot(m.x - P.x, m.y - P.y) < LEGENDA.aumR)) {
      aumT = LEGENDA.aumJeda; aumFx.push({ x: P.x, y: P.y, t: 0 }); shake = Math.max(shake, 0.2); sfx.growl && sfx.growl();
      for (const m of monsters) if (!m.dead && Math.hypot(m.x - P.x, m.y - P.y) < LEGENDA.aumR) lemahkanMonster(m, LEGENDA.aumLemah);
    }
  }
  // Wayang Sepi
  if (punyaUnik("wayangBayangan")) {
    wayangT -= dt;
    if (wayangT <= 0) {
      let sasaran = null, dekat = LEGENDA.wayangJarak;
      for (const m of monsters) { if (m.dead) continue; const j = Math.hypot(m.x - P.x, m.y - P.y); if (j < dekat) { dekat = j; sasaran = m; } }
      if (sasaran) { wayangT = LEGENDA.wayangJeda; damageMonster(sasaran, atkPower() * LEGENDA.wayangKali, Math.atan2(sasaran.y - P.y, sasaran.x - P.x), 30, { gema: true, tanpaTenaga: true }); tebasWayang.push({ x: sasaran.x, y: sasaran.y, t: 0 }); }
      else wayangT = 0.5;
    }
  }
  // Kalung Salju Abadi
  if (punyaUnik("jejakEs") && P.roll > 0 && (!jejakEs.length || Math.hypot(jejakEs[jejakEs.length - 1].x - P.x, jejakEs[jejakEs.length - 1].y - P.y) > 18)) jejakEs.push({ x: P.x, y: P.y, t: 0 });
  for (const j of jejakEs) { j.t += dt; for (const m of monsters) if (!m.dead && Math.hypot(m.x - j.x, m.y - j.y) < LEGENDA.jejakEsR + m.r * 0.5) lambatkanMonster(m, 0.6); }
  jejakEs = jejakEs.filter((j) => j.t < LEGENDA.jejakEsLama);
  for (const a of aumFx) a.t += dt; aumFx = aumFx.filter((a) => a.t < 0.6);
  for (const w of tebasWayang) w.t += dt; tebasWayang = tebasWayang.filter((w) => w.t < 0.35);
});
GAMBAR_TANAH.push(function () {
  for (const j of jejakEs) { ctx.fillStyle = `rgba(191,232,255,${0.6 * (1 - j.t / LEGENDA.jejakEsLama)})`; ctx.beginPath(); ctx.ellipse(j.x, j.y, LEGENDA.jejakEsR * 0.7, LEGENDA.jejakEsR * 0.35, 0, 0, 6.28); ctx.fill(); }
});
GAMBAR_ATAS.push(function () {
  for (const a of aumFx) { ctx.strokeStyle = `rgba(242,246,255,${1 - a.t / 0.6})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(a.x, a.y - 20, LEGENDA.aumR * a.t / 0.6, 0, 6.28); ctx.stroke(); }
  for (const w of tebasWayang) { ctx.strokeStyle = `rgba(90,58,138,${1 - w.t / 0.35})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(w.x, w.y - 24, 26, -2.4 + w.t * 6, -0.6 + w.t * 6); ctx.stroke(); }
  if (P && P.anginSiap) { ctx.fillStyle = "rgba(217,179,106,0.5)"; ctx.beginPath(); ctx.arc(P.x - Math.cos(P.face) * 18, P.y - 16, 5, 0, 6.28); ctx.fill(); }
});
SAAT_MASUK_AREA.push(() => { jejakEs = []; });
