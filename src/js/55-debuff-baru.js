// =====================================================================
// DEBUFF BARU: LUMPUH (stun) & BERDARAH (damage over time)
// Pemain:
//   lumpuh   : tidak bisa bergerak, menyerang, atau berguling sebentar. Setelahnya
//              kebal lumpuh beberapa detik (tidak bisa dilumpuhkan terus-menerus).
//   berdarah : nyawa berkurang terus; bisa bertumpuk sampai 3 (makin sakit).
//   Monster pemberinya: DEBUFF_TAMBAHAN di config.js.
// Monster juga bisa terkena status dari jurus & jimatmu:
//   lumpuh / beku / jerat (diam), lambat, lemah (pukulannya lebih pelan sakitnya),
//   racun / terbakar / berdarah (damage berkala dari seranganmu).
// =====================================================================
"use strict";

JENIS_DEBUFF.push("lumpuh", "berdarah");
for (const [id, deb] of Object.entries(DEBUFF_TAMBAHAN)) if (MONSTERS[id]) MONSTERS[id].debuff = [...[].concat(MONSTERS[id].debuff || []), deb];

// ---------- Status monster ----------
const DOT_MONSTER = { racun: { per: 0.22, lama: 4 }, terbakar: { per: 0.32, lama: 3 }, berdarah: { per: 0.26, lama: 5 } };
function lumpuhkanMonster(m, detik, jenis = "lumpuh") {
  if (!m || m.dead || !detik || m.amuk) return;
  if (m.d.boss) detik *= m.lumpuhKebal > 0 ? 0 : 1;   // bos tidak bisa dilumpuhkan beruntun
  if (detik <= 0) return;
  m.stun = Math.max(m.stun || 0, detik); m.stunJenis = jenis;
  if (m.d.boss) m.lumpuhKebal = detik + 3;
  if (m.state === "windup" || m.state === "charge") { m.state = "recover"; m.st = 0.2; }
}
function beriDotMonster(m, jenis, lama) {
  if (!m || m.dead) return;
  const D = DOT_MONSTER[jenis];
  m.dots = m.dots || {};
  const lama2 = lama || D.lama, sekarang = m.dots[jenis];
  m.dots[jenis] = { sisa: Math.max(sekarang ? sekarang.sisa : 0, lama2), tumpuk: jenis === "berdarah" ? Math.min(3, (sekarang ? sekarang.tumpuk : 0) + 1) : 1, tick: sekarang ? sekarang.tick : 0.5, dps: atkPower() * D.per };
}
const lambatkanMonster = (m, detik) => { if (m && !m.dead) m.lambat = Math.max(m.lambat || 0, detik); };
const lemahkanMonster = (m, detik) => { if (m && !m.dead) m.lemah = Math.max(m.lemah || 0, detik); };
const kaliLemahMonster = (m) => (m && m.lemah > 0 ? 0.65 : 1);
// dipanggil dari updateMonster: true = monster sedang lumpuh (lewati AI)
function monsterLumpuh(m, dt) {
  if (m.lumpuhKebal > 0) m.lumpuhKebal -= dt;
  if (m.lambat > 0) m.lambat -= dt;
  if (m.lemah > 0) m.lemah -= dt;
  if (m.rentan > 0) m.rentan -= dt;
  if (!(m.stun > 0)) return false;
  m.stun -= dt;
  return true;
}
function updateDotMonster(dt) {
  for (const m of monsters) {
    if (m.dead || !m.dots) continue;
    for (const [j, D] of Object.entries(m.dots)) {
      D.sisa -= dt; D.tick -= dt;
      if (D.tick <= 0) { D.tick = 0.5; damageMonster(m, D.dps * D.tumpuk * 0.5, 0, 0, { dot: j }); if (m.dead) break; }
      if (Math.random() < 0.2) parts.push({ x: m.x + rand(-10, 10), y: m.y, z: rand(10, m.d.h), vz: 30, vx: 0, vy: 0, life: 0.4, max: 0.4, color: ATURAN.debuff[j].warna, s: 4, float: true });
      if (D.sisa <= 0) delete m.dots[j];
    }
  }
  if (P && P.kebalLumpuh > 0) P.kebalLumpuh -= dt;
}
UPDATE_TAMBAHAN.push(updateDotMonster);

// bintang berputar di atas monster lumpuh, es untuk yang beku, jaring untuk yang terjerat
GAMBAR_ATAS.push(function (time) {
  for (const m of monsters) {
    if (m.dead || !(m.stun > 0)) continue;
    const y = m.y - m.d.h - 8;
    if (m.stunJenis === "beku") {
      ctx.fillStyle = "rgba(180,230,255,0.35)"; ctx.beginPath(); ctx.ellipse(m.x, m.y - m.d.h / 2, m.r + 8, m.d.h / 2 + 6, 0, 0, 6.28); ctx.fill();
      ctx.strokeStyle = "rgba(220,245,255,0.8)"; ctx.lineWidth = 2; ctx.stroke();
    }
    for (let i = 0; i < 3; i++) {
      const a = time * 5 + (i / 3) * 6.28, x = m.x + Math.cos(a) * 16, yy = y + Math.sin(a) * 5;
      ctx.fillStyle = m.stunJenis === "beku" ? "#bfe9ff" : "#ffe066";
      ctx.beginPath(); for (let k = 0; k < 5; k++) { const b = (k / 5) * 6.28 - Math.PI / 2; ctx.lineTo(x + Math.cos(b) * 4.5, yy + Math.sin(b) * 4.5); ctx.lineTo(x + Math.cos(b + 0.63) * 2, yy + Math.sin(b + 0.63) * 2); } ctx.closePath(); ctx.fill();
    }
  }
});

// ikon kecil di dalam lingkaran ikon debuff pemain (dipanggil dari 32-debuff.js)
function ikonDebuffBaru(j, x, y) {
  if (j === "lumpuh") { ctx.beginPath(); for (let k = 0; k < 5; k++) { const b = (k / 5) * 6.28 - Math.PI / 2; ctx.lineTo(x + Math.cos(b) * 5, y + Math.sin(b) * 5); ctx.lineTo(x + Math.cos(b + 0.63) * 2.2, y + Math.sin(b + 0.63) * 2.2); } ctx.closePath(); ctx.fill(); return true; }
  if (j === "berdarah") {
    ctx.beginPath(); ctx.moveTo(x - 2, y - 5); ctx.quadraticCurveTo(x + 3, y, x - 2, y + 4); ctx.quadraticCurveTo(x - 6, y, x - 2, y - 5); ctx.fill();
    const n = (P.tumpuk && P.tumpuk.berdarah) || 1;
    if (n > 1) { ctx.font = "900 8px Nunito, sans-serif"; ctx.textAlign = "center"; ctx.fillText(n, x + 4, y + 4); }
    return true;
  }
  return false;
}
