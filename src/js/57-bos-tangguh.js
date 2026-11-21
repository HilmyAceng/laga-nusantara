// =====================================================================
// BOS TANGGUH
// Lapisan trik untuk SEMUA bos, makin banyak sesuai tier (BOS_TANGGUH di config.js):
//   tipuan   : bos berkedip seolah menyerang, tapi pukulannya baru datang sesaat kemudian.
//              Jangan buru-buru berguling — tunggu pukulan yang asli!
//   amukan   : serangan pamungkas bos. Layar memerah, muncul lingkaran hijau.
//              Siapa pun di luar lingkaran hijau saat hitungan habis terkena damage
//              sangat besar (tidak bisa ditangkis / dihindari dengan berguling).
//              Setelah mengamuk bos kelelahan: damage yang diterimanya ×1,5.
//   kudaKuda : bos bertahan (perisai biru, damage yang diterima -75%). Tangkis salah
//              satu serangannya untuk memecahkan pertahanan → bos lumpuh & rentan.
//   kombo    : setelah menyerang, bos kadang langsung menyerang lagi.
// Bos dari Cermin Gaib tingkat 5+ memakai semua trik lebih sering.
// =====================================================================
"use strict";

function cfgBos(m) {
  const c = { tier: 1, ...(BOS_TANGGUH[m.type] || {}) };
  const tk = m.tingkat || 0;
  if (tk >= 4 && !c.amukan && m.type !== "naga") c.amukan = 26;
  if (tk >= 5) {
    c.tipuan = (c.tipuan || 0) + 0.15; c.kombo = (c.kombo || 0) + 0.15;
    if (c.amukan) c.amukan -= 4;
    if (c.kudaKuda) c.kudaKuda -= 3; else if (tk >= 6) c.kudaKuda = 18;
  }
  return c;
}
const SERANG = ["ancang", "windup"];
const sedangBertarung = (m) => m.aggro && !["idle", "pulang", "return"].includes(m.state);

// Dipanggil dari updateMonster sebelum AI bos. true = frame ini sudah ditangani (AI dilewati).
function bosTangguh(m, dt, dp, toP) {
  if (m.d.latihan) return false;
  if (transisiFaseBos(m, dt)) return true;   // sedang bangkit ke fase berikutnya (62-fase-bos.js)
  const c = m.cfg || (m.cfg = cfgBos(m));
  if (m.amuk) return updateAmukan(m, dt, dp, toP);
  if (m.capek > 0) { m.capek -= dt; if (Math.random() < 0.3) parts.push({ x: m.x + rand(-20, 20), y: m.y, z: m.d.h, vz: 20, vx: 0, vy: 0, life: 0.6, max: 0.6, color: "#c9bfd6", s: 6, float: true }); return true; }
  if (m.jaga > 0) m.jaga -= dt;
  // jurus khas tiap bos (59-jurus-khas-bos.js)
  if (jurusKhasBos(m, dt, sedangBertarung(m) && !P.dead && !SERANG.includes(m.state) && dp < 650)) { m.stLalu = m.state; return true; }
  if (!sedangBertarung(m) || P.dead) { m.stLalu = m.state; return false; }
  m.waktuTarung = (m.waktuTarung || 0) + dt;
  // tipuan: saat bos baru mulai ancang-ancang
  if (SERANG.includes(m.state) && !SERANG.includes(m.stLalu) && c.tipuan && Math.random() < c.tipuan) {
    m.tipu = Math.max(0.05, m.st * 0.55); m.st += 0.45;
  }
  if (m.tipu > 0) {
    m.tipu -= dt;
    if (m.tipu <= 0) { m.flash = 0.12; shake = Math.max(shake, 0.15); sfx.claw(); spark(m.x, m.y - m.d.h * 0.6, "#fff", 8); numbers.push({ x: m.x, y: m.y - m.d.h - 30, v: t("bos.tipu"), life: 0.7, color: "#ffd166", size: 20 }); }
  }
  // kombo: setelah serangan selesai, kadang langsung menyerang lagi
  if (!SERANG.includes(m.state) && SERANG.includes(m.stLalu) && c.kombo && Math.random() < c.kombo) m.cd = Math.min(m.cd, 0.15);
  m.stLalu = m.state;
  // kuda-kuda
  if (c.kudaKuda) {
    m.jagaT = (m.jagaT ?? c.kudaKuda * 0.6) - dt;
    if (m.jagaT <= 0) {
      m.jagaT = c.kudaKuda; m.jaga = 5;
      sfx.heavy(); numbers.push({ x: m.x, y: m.y - m.d.h - 30, v: t("bos.kudaKuda"), life: 1.2, color: "#8fd3ff", size: 22 });
      if (!bosInfo.jaga) { bosInfo.jaga = true; toast(t("bos.kudaKudaInfo", { k: isTouch ? t("bos.tanpaArahSentuh") : kb("hindar").replace(/<[^>]+>/g, "") }), false); }
    }
  }
  // amukan
  if (c.amukan && dp < 650) {
    m.amukT = (m.amukT ?? Math.min(12, c.amukan * 0.55)) - dt;
    if (m.amukT <= 0 && !SERANG.includes(m.state)) { m.amukT = c.amukan; mulaiAmukan(m); return true; }   // tunggu serangan yang sedang berjalan selesai
  }
  return false;
}
const bosInfo = {};

// ---------- Amukan (dipakai juga oleh naga: 36-naga.js) ----------
// opts: { dur, kali (bagian nyawa maks pemain), spot (jumlah lingkaran aman), r, nama, lelah }
function mulaiAmukan(m, opts = {}) {
  const c = m.cfg || cfgBos(m);
  const dur = opts.dur || Math.max(2.4, 3.4 - c.tier * 0.06), n = opts.spot || (c.tier >= 9 ? 2 : 3), r = opts.r || 62;
  const spots = [];
  for (let tries = 0; spots.length < n && tries < 200; tries++) {
    const a = rand(0, 6.28), d = rand(170, 330), x = P.x + Math.cos(a) * d, y = P.y + Math.sin(a) * d;
    if (solidAt(x, y) || x < 2 * T || y < 2 * T || x > (MW - 2) * T || y > (MH - 2) * T) continue;
    if (spots.some((s) => Math.hypot(s.x - x, s.y - y) < r * 3)) continue;
    if (Math.hypot(x - m.x, y - m.y) < r + m.r + 40) continue;
    spots.push({ x, y, r });
  }
  if (!spots.length) spots.push({ x: P.x, y: P.y, r });
  m.amuk = { t: 0, dur, spots, kali: opts.kali || 0.4 + 0.015 * c.tier, lelah: opts.lelah || 2.5, nama: opts.nama };
  m.kebal = !!opts.kebal;
  shake = 0.5; sfx.growl(); sfx.summon();
  toast(opts.nama ? t("bos.amukanJurus", { bos: m.d.name, nama: opts.nama }) : t("bos.amukan", { nama: m.d.name }), true);
}
function updateAmukan(m, dt, dp, toP) {
  const A = m.amuk; A.t += dt;
  if (Math.random() < 0.6) { const a = rand(0, 6.28); parts.push({ x: m.x + Math.cos(a) * m.r * 1.5, y: m.y + Math.sin(a) * m.r, z: rand(0, m.d.h), vz: rand(40, 120), vx: 0, vy: 0, life: 0.5, max: 0.5, color: "#ff4a3a", s: 5, float: true }); }
  if (A.t < A.dur) return true;
  const aman = A.spots.some((s) => Math.hypot(P.x - s.x, P.y - s.y) < s.r + 4);
  kilat = 0.9; shake = 1; sfx.boom(); sfx.slam(); sfx.thunder();
  effects.push({ kind: "ring", x: m.x, y: m.y, r: 600, t: 0, dur: 0.7, red: true });
  if (!aman && !P.dead) hurtPlayer(maxHp() * A.kali, toP, null, { mutlak: true, dari: m });
  else if (!P.dead) { numbers.push({ x: P.x, y: P.y - 80, v: t("bos.selamat"), life: 1, color: "#7dffa8", size: 24 }); tambahTenaga(10, true); }
  m.amuk = null; m.kebal = false;
  m.capek = A.lelah;
  numbers.push({ x: m.x, y: m.y - m.d.h - 30, v: t("bos.lelah"), life: 1.4, color: "#c9bfd6", size: 24 });
  if (m.state === "ancang" || m.state === "windup") m.state = m.d.ai ? "kejar" : "chase";
  return true;
}
// tangkisan pemain mengenai bos yang berkuda-kuda (50-hindar-tangkis.js)
function pecahkanKudaKuda(m) {
  if (!(m.jaga > 0)) return false;
  m.jaga = 0; m.stun = 2.5; m.stunJenis = "lumpuh"; m.rentan = 2.5;
  shake = 0.6; sfx.slam(); sfx.crit();
  toast(t("bos.pecah"), true);
  return true;
}
// pengali damage dari keadaan bos (dipakai di damageMonster)
function kaliKeadaanBos(m) {
  let k = 1;
  if (m.jaga > 0) k *= 0.25;
  if (m.capek > 0) k *= 1.5;
  if (m.rentan > 0) k *= 1.3;
  if (m.amuk) k *= 0.5;
  if (m.tahanFase) k *= 1 - m.tahanFase;   // fase 3: kebal sebagian damage (62-fase-bos.js)
  return k;
}

// ---------- Gambar ----------
// lantai: layar merah dengan lubang lingkaran hijau saat amukan
GAMBAR_TANAH.push(function (time) {
  for (const m of monsters) {
    if (m.dead || !m.amuk) continue;
    const A = m.amuk, k = A.t / A.dur;
    ctx.save();
    ctx.beginPath(); ctx.rect(0, 0, MW * T, MH * T);
    for (const s of A.spots) { ctx.moveTo(s.x + s.r, s.y); ctx.ellipse(s.x, s.y, s.r, s.r * 0.62, 0, 0, 6.28, true); }
    ctx.fillStyle = `rgba(220,20,20,${0.28 + 0.32 * k + 0.1 * Math.sin(time * 20) * k})`; ctx.fill("evenodd");
    for (const s of A.spots) {
      ctx.fillStyle = "rgba(125,255,168,0.3)"; ctx.beginPath(); ctx.ellipse(s.x, s.y, s.r, s.r * 0.62, 0, 0, 6.28); ctx.fill();
      ctx.strokeStyle = `rgba(160,255,190,${0.75 + 0.25 * Math.sin(time * 8)})`; ctx.lineWidth = 5; ctx.stroke();
      // panah kecil memantul di atas lingkaran aman
      const by = s.y - s.r * 0.62 - 18 + Math.sin(time * 6) * 5;
      ctx.fillStyle = "#7dffa8"; ctx.beginPath(); ctx.moveTo(s.x - 9, by - 8); ctx.lineTo(s.x + 9, by - 8); ctx.lineTo(s.x, by + 4); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }
});
// atas: hitungan mundur amukan, perisai kuda-kuda, tanda lelah
GAMBAR_ATAS.push(function (time) {
  for (const m of monsters) {
    if (m.dead || !m.d.boss) continue;
    if (m.amuk) {
      const sisa = Math.max(0, m.amuk.dur - m.amuk.t);
      ctx.font = "700 34px Teko, sans-serif"; ctx.textAlign = "center"; ctx.lineWidth = 4; ctx.strokeStyle = "rgba(10,6,20,0.9)";
      const y = m.y - m.d.h - 40 - (m.z || 0);
      ctx.strokeText(sisa.toFixed(1), m.x, y); ctx.fillStyle = "#ff6b5a"; ctx.fillText(sisa.toFixed(1), m.x, y);
    }
    if (m.jaga > 0) {
      ctx.save(); ctx.strokeStyle = `rgba(143,211,255,${0.6 + 0.3 * Math.sin(time * 6)})`; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.ellipse(m.x, m.y - m.d.h / 2, m.r + 18, m.d.h / 2 + 18, 0, 0, 6.28); ctx.stroke();
      ctx.fillStyle = "rgba(143,211,255,0.12)"; ctx.fill(); ctx.restore();
    }
    if (m.capek > 0) {
      ctx.font = "700 18px Teko, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#c9bfd6";
      ctx.fillText(t("bos.lelah") + " ×1.5", m.x, m.y - m.d.h - 20);
    }
  }
});
