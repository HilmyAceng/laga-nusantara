// =====================================================================
// FASE BOS
// Semua bos (cerita & Cermin Gaib) punya 2-3 fase (FASE_BOS di config.js).
// Saat nyawa bos habis di fase 1, ia BANGKIT LAGI dengan nyawa penuh dan masuk
// fase berikutnya dengan kekuatan tambahan yang berbeda:
//   Fase 2 · Murka           : serangan, kecepatan serang & gerak naik, memanggil anak buah
//   Fase 3 · Amarah Terakhir : lebih kuat & cepat lagi, kebal sebagian damage, jurus khas lebih sering
// Bos baru benar-benar kalah setelah fase terakhir habis. Kalau pemain kabur dan bos
// pulang ke sarangnya, bos kembali ke fase 1.
// Di bar nyawa bos tertulis "Fase n/m".
// =====================================================================
"use strict";

function faseMaksBos(m) {
  if ((m.tingkat || 0) >= FASE_BOS.cerminTigaFase) return 3;
  const c = BOS_TANGGUH[m.type] || { tier: 1 };
  return c.tier <= FASE_BOS.duaFaseSampaiTier ? 2 : 3;
}
function siapkanFase(m) {
  if (m.fase) return;
  m.fase = 1; m.faseMaks = faseMaksBos(m); m.dFase1 = m.d;
}

// Dipanggil dari killMonster (10-tarung.js). true = bos bangkit ke fase berikutnya (belum kalah).
function naikFaseBos(m) {
  siapkanFase(m);
  if (m.fase >= m.faseMaks) return false;
  m.fase++;
  const F = FASE_BOS.fase[m.fase - 1], d0 = m.dFase1, c0 = d0.kaliSerangCepat || 1, cepat = c0 * F.cepat;
  m.d = { ...d0, atk: Math.round(d0.atk * F.atk), kaliSerangCepat: cepat, speed: d0.speed * c0 * F.gerak / cepat };
  m.hp = m.d.hp; m.dead = false;
  m.tahanFase = F.tahan || 0; m.khasKali = F.khas || 1;
  // hentikan apa pun yang sedang berjalan, lalu jeda kebangkitan (kebal)
  if (m.khas) { if (m.khas.selesai) m.khas.selesai(m); m.khas = null; }
  m.amuk = null; m.capek = 0; m.jaga = 0; m.stun = 0; m.dots = null; m.z = 0;
  m.transisi = FASE_BOS.transisi; m.kebal = true;
  kilat = 0.8; shake = 1; sfx.thunder(); sfx.growl();
  if (typeof suaraMonster === "function") suaraMonster(m, "raung");   // 61-suara-makhluk.js
  effects.push({ kind: "ring", x: m.x, y: m.y, r: 260, t: 0, dur: 0.8 });
  spark(m.x, m.y - m.d.h * 0.5, F.warna, 40);
  toast(t("fase.mulai", { nama: m.d.name, n: m.fase, judul: t("fase.nama" + m.fase) }), true);
  // anak buah
  const anak = F.anak && (m.d.anak || { buayaPutih: "buaya", rajaBanaspati: "banaspati", genderuwo: "kera", dwarapala: "arcaHidup" }[m.type]);
  panggilAnakBos(m, anak, 2, 110);   // batas & aturan anak buah: 26-monster-baru.js
  saveSoon();
  return true;
}

// Dipanggil paling awal di bosTangguh (57-bos-tangguh.js). true = sedang bangkit (lewati AI).
function transisiFaseBos(m, dt) {
  if (!(m.transisi > 0)) return false;
  m.transisi -= dt;
  const F = FASE_BOS.fase[m.fase - 1];
  if (Math.random() < 0.8) parts.push({ x: m.x + rand(-m.r, m.r), y: m.y, z: rand(0, m.d.h), vz: rand(80, 200), vx: 0, vy: 0, life: 0.6, max: 0.6, color: F ? F.warna : "#fff", s: 6, float: true });
  if (m.transisi <= 0) { m.kebal = false; m.state = m.d.ai ? "kejar" : "chase"; m.cd = 0.8; m.aggro = true; }
  return true;
}

// Bos pulang ke sarang (pemain kabur) → kembali ke fase 1
UPDATE_TAMBAHAN.push(function () {
  for (const m of monsters) {
    if (m.dead || !m.d.boss || !(m.fase > 1) || m.aggro || m.state !== "idle") continue;
    m.fase = 1; m.d = m.dFase1; m.hp = m.d.hp; m.tahanFase = 0; m.khasKali = 1;
  }
});

// teks "Fase n/m" di bar nyawa bos & warna bar sesuai fase
function hudFaseBos(boss) {
  const maks = boss.faseMaks || faseMaksBos(boss), n = boss.fase || 1;
  const warna = n > 1 ? FASE_BOS.fase[n - 1].warna : "";
  if (last.faseWarna !== warna) { last.faseWarna = warna; ui.bossFill.style.background = warna; }
  return maks > 1 ? `${boss.d.name} · ${t("fase.label", { n, m: maks })}` : boss.d.name;
}

// aura warna fase di sekitar bos (fase 2 merah, fase 3 ungu), cahaya kebangkitan saat transisi
GAMBAR_TANAH.push(function (time) {
  for (const m of monsters) {
    if (m.dead || !m.d.boss || !(m.fase > 1)) continue;
    const F = FASE_BOS.fase[m.fase - 1];
    ctx.save(); ctx.globalAlpha = 0.35 + 0.15 * Math.sin(time * 6);
    ctx.strokeStyle = F.warna; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(m.x, m.y, m.r + 16, (m.r + 16) * 0.5, 0, 0, 6.28); ctx.stroke();
    ctx.restore();
    if (m.transisi > 0) {
      const k = m.transisi / FASE_BOS.transisi;
      const g = ctx.createLinearGradient(0, m.y - 400, 0, m.y);
      g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(1, F.warna);
      ctx.save(); ctx.globalAlpha = 0.6 * k; ctx.fillStyle = g; ctx.fillRect(m.x - m.r - 10, m.y - 400, (m.r + 10) * 2, 400); ctx.restore();
    }
  }
});
