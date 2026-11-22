// =====================================================================
// HERO JARAK DEKAT (Pendekar & Pendobrak)
// Supaya hero melee tidak kewalahan melawan bos (angka di ATURAN.melee, config.js):
//  - +1 lapis hindar (3 lapis, ranged tetap 2).
//  - Pendekar: pasif Kuda-kuda (damage diterima -10%); Tebasan Kilat kini kebal 1 detik setelah menerjang; jurus baru
//    Tebas Balik (tebas lalu lompat mundur, kebal) menggantikan Badai Golok.
//  - Pendobrak: pasif Kulit Baja (damage diterima -20%); Benteng kini perisai yang
//    menyerap damage (30% nyawa maks) & terbuka sejak Lv 1; jurus baru Dobrakan
//    Perisai (terjang kebal, musuh lumpuh, bos goyah) menggantikan Raungan.
//  - Poin jurus yang dulu dipakai di jurus yang diganti dikembalikan otomatis.
// =====================================================================
"use strict";

const M = ATURAN.melee;
const heroMelee = () => !!(S && M.kelas.includes(S.cls));
// lapis hindar maksimal (dipakai 50-hindar-tangkis.js, 05-status.js, 66-status-karakter.js)
const lapisMaks = () => ATURAN.hindar.lapis + (heroMelee() ? M.lapisTambah : 0);
// pasif pengurang damage per kelas: Kuda-kuda Pendekar & Kulit Baja Pendobrak (dipakai hurtPlayer)
const kulitBaja = () => (S && M.tahanKelas[S.cls]) || 0;

// ---------- Perisai (Benteng & Dobrakan) ----------
// perisai menyerap damage lebih dulu; sisanya mengenai nyawa (dipanggil hurtPlayer)
function serapPerisai(dmg) {
  if (!(P.perisai > 0)) return dmg;
  const serap = Math.min(P.perisai, dmg);
  P.perisai -= serap;
  numbers.push({ x: P.x + 18, y: P.y - 70, v: t("melee.serap") + " -" + Math.round(serap), life: 0.8, color: "#8fd3ff", size: 16 });
  if (P.perisai <= 0) { P.perisai = 0; spark(P.x, P.y - 30, "#8fd3ff", 12); }
  return dmg - serap;
}
function beriPerisai(bagian, lama) {
  const n = Math.round(maxHp() * bagian);
  P.perisai = Math.max(P.perisai || 0, n); P.perisaiMaks = Math.max(P.perisai, P.perisaiMaks || 0);
  P.perisaiT = Math.max(P.perisaiT || 0, lama);
}
UPDATE_TAMBAHAN.push((dt) => {
  if (!P) return;
  if (P.perisaiT > 0) { P.perisaiT -= dt; if (P.perisaiT <= 0) { P.perisai = 0; P.perisaiMaks = 0; } }
  if (P.kilau > 0) P.kilau -= dt;
});

// ---------- Jurus ----------
// Tebasan Kilat: tetap menerjang seperti biasa, lalu kebal sebentar (kilau emas)
{
  const dashAsli = JALAN_JURUS.dash;
  JALAN_JURUS.dash = function (j, r, dmg) {
    dashAsli(j, r, dmg);
    P.dashLumpuh = null;
    P.inv = Math.max(P.inv, P.dash + M.kebalKilat); P.kilau = P.dash + M.kebalKilat;
  };
}
// Tebas Balik: tebasan lebar ke depan, lalu lompat mundur menjauhi musuh
JALAN_JURUS.tebasBalik = function (j, r, dmg) {
  const ang = aimAngle(j.r + 60); P.face = ang; P.swing = P.swingDur = 0.2;
  const jang = j.r * (r >= 3 ? 1.3 : 1);
  for (const m of musuhDekat(jang)) {
    if (angDiff(Math.atan2(m.y - P.y, m.x - P.x), ang) > 1.3) continue;      // hanya di depan
    damageMonster(m, dmg, ang, 260);
    if (r >= 5) beriDotMonster(m, "berdarah");
  }
  if (r >= 5) P.kritisSiap = true;
  jurusFx.push({ kind: "tebasBalik", x: P.x, y: P.y, ang, r: jang, t: 0, dur: 0.25 });
  // lompat mundur memakai gerak terjang (15-update.js), tanpa menabrak musuh lagi
  P.dash = 0.16; P.rdx = -Math.cos(ang); P.rdy = -Math.sin(ang); P.dashHit = new Set(monsters); P.dashDmg = 0; P.dashDot = null; P.dashLanjut = 0; P.dashLumpuh = null;
  const kebal = r >= 3 ? M.kebalBalik3 : M.kebalBalik;
  P.inv = Math.max(P.inv, P.dash + kebal); P.kilau = P.dash + kebal;
  sfx.swing(); sfx.roll();
};
// Benteng: perisai penyerap + damage diterima berkurang (ATURAN.melee.bentengTahan di hurtPlayer)
JALAN_JURUS.guard = function (j, r) {
  const lama = r >= 3 ? 5 : j.lama;
  P.benteng = lama; P.bentengPulih = r >= 5;
  beriPerisai(r >= 3 ? M.perisai3 : M.perisai, lama);
  spark(P.x, P.y - 30, "#8fd3ff", 16); sfx.heavy();
};
// Dobrakan Perisai: terjang ke arah bidikan, kebal; yang tertabrak terpental & lumpuh
JALAN_JURUS.dobrak = function (j, r, dmg) {
  const ang = aimAngle(340); P.face = ang;
  P.dash = 0.3; P.rdx = Math.cos(ang); P.rdy = Math.sin(ang); P.dashHit = new Set(); P.dashDmg = dmg; P.dashDot = null; P.dashLanjut = 0;
  P.dashLumpuh = r >= 5 ? [1.8, 1] : [1.2, 0.6];          // [monster biasa, bos] detik
  P.inv = Math.max(P.inv, P.dash + 0.25); P.kilau = P.dash + 0.25;
  if (r >= 3) beriPerisai(M.perisaiDobrak, 6);
  shake = Math.max(shake, 0.25); sfx.charge(); sfx.dash();
};

// ---------- Poin jurus untuk jurus yang diganti ----------
const JURUS_DIGANTI = ["badaiGolok", "raungan"];
{
  const lengkapiAsli = lengkapiSave;
  lengkapiSave = function () {
    lengkapiAsli();
    if (!S || !S.jurus) return;
    let n = 0;
    for (const id of JURUS_DIGANTI) if (S.jurus.rank[id]) { n += S.jurus.rank[id]; delete S.jurus.rank[id]; }
    aturSlotAwal();                                            // slot berisi jurus lama diisi ulang
    if (n) setTimeout(() => toast(t("melee.refund", { n }), true), 2500);
  };
}

// ---------- Gambar ----------
GAMBAR_TANAH.push(function (time) {
  if (!P) return;
  // kilau emas saat kebal dari jurus terjang
  if (P.kilau > 0) {
    ctx.save(); ctx.strokeStyle = `rgba(255,209,102,${Math.min(1, P.kilau) * (0.55 + 0.3 * Math.sin(time * 20))})`; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.ellipse(P.x, P.y, 22, 9, 0, 0, 6.28); ctx.stroke(); ctx.restore();
    if (Math.random() < 0.4) parts.push({ x: P.x + rand(-14, 14), y: P.y - rand(5, 45), z: 0, vz: 0, vx: 0, vy: -30, life: 0.3, max: 0.3, color: "#ffd166", s: 2.5 });
  }
  // perisai: gelembung biru, makin tipis saat perisai terkuras
  if (P.perisai > 0 && P.perisaiMaks > 0) {
    const k = P.perisai / P.perisaiMaks;
    ctx.save(); ctx.fillStyle = `rgba(143,211,255,${0.1 + 0.15 * k})`; ctx.strokeStyle = `rgba(143,211,255,${0.45 + 0.4 * k})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(P.x, P.y - 28, 34, 44, 0, 0, 6.28); ctx.fill(); ctx.stroke();
    // bar perisai kecil di bawah kaki
    ctx.fillStyle = "rgba(10,6,20,0.7)"; ctx.fillRect(P.x - 22, P.y + 8, 44, 4);
    ctx.fillStyle = "#8fd3ff"; ctx.fillRect(P.x - 22, P.y + 8, 44 * k, 4);
    ctx.restore();
  }
  // jejak tebasan Tebas Balik
  for (const e of jurusFx) if (e.kind === "tebasBalik") {
    const a = 1 - e.t / e.dur;
    ctx.save(); ctx.strokeStyle = `rgba(255,240,200,${a})`; ctx.lineWidth = 6 * a + 1;
    ctx.beginPath(); ctx.arc(e.x, e.y - 20, e.r * 0.8, e.ang - 1.1, e.ang + 1.1); ctx.stroke(); ctx.restore();
  }
});
// efek tebasBalik cukup memudar (jurusFx diperbarui di 48-jurus.js; jenis yang tak dikenal tinggal dihapus saat t >= dur)
