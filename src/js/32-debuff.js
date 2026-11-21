// =====================================================================
// DEBUFF
// Efek buruk dari serangan monster tertentu (`debuff` di MONSTERS, config.js):
//   racun / terbakar : nyawa berkurang pelan (tidak sampai pingsan, sisa 1)
//   lambat           : jalan lebih pelan
//   lemah            : serangan lebih lemah
//   bingung          : arah gerak terbalik
//   lumpuh, berdarah : lihat 55-debuff-baru.js
// Disimpan di P.debuff = { jenis: sisa detik }. Hilang sendiri, di zona aman
// (33-zona-aman.js), atau dengan jamu setelah belajar resep penawar dari Pak Joko.
// Ikon debuff tampil di atas kepala pemain.
// =====================================================================
"use strict";

let musuhAktif = null;            // monster yang sedang bergerak/menyerang (diisi di update)
const JENIS_DEBUFF = ["racun", "terbakar", "lambat", "lemah", "bingung"];
const debuffKenal = {};           // jenis yang sudah pernah dijelaskan lewat pesan

const adaDebuff = () => !!P && !!P.debuff && Object.keys(P.debuff).length > 0;
const punyaDebuff = (j) => !!(P && P.debuff && P.debuff[j] > 0);
const kaliGerak = () => (punyaDebuff("lambat") ? ATURAN.debuff.lambat.kali : 1);
const kaliSerang = () => (punyaDebuff("lemah") ? ATURAN.debuff.lemah.kali : 1);

// deb = { jenis, peluang, lama } atau daftar beberapa debuff
function beriDebuff(deb) {
  if (!deb || !P || P.dead || pAman) return;
  P.debuff = P.debuff || {};
  for (const d of [].concat(deb)) {
    if (Math.random() >= d.peluang) continue;
    if (kebalDebuff(d.jenis) || (d.jenis === "lumpuh" && P.kebalLumpuh > 0)) continue;   // jimat/ramuan penangkal, kebal lumpuh sesaat
    const baru = !(P.debuff[d.jenis] > 0);
    P.debuff[d.jenis] = Math.max(P.debuff[d.jenis] || 0, d.lama);
    if (d.jenis === "berdarah") { P.tumpuk = P.tumpuk || {}; P.tumpuk.berdarah = baru ? 1 : Math.min(ATURAN.debuff.berdarah.tumpukMaks, (P.tumpuk.berdarah || 1) + 1); }
    if (baru) {
      const w = ATURAN.debuff[d.jenis].warna;
      numbers.push({ x: P.x, y: P.y - 76, v: t("debuff." + d.jenis), life: 1.1, color: w, size: 18 });
      if (!debuffKenal[d.jenis]) { debuffKenal[d.jenis] = true; toast(t("debuff.info." + d.jenis), false); }
    }
  }
}
// Hapus semua debuff. alasan: "aman" | "jamu"
function sembuhkanDebuff(alasan) {
  if (!adaDebuff()) return false;
  P.debuff = {};
  toast(t(alasan === "jamu" ? "debuff.sembuhJamu" : "debuff.sembuhAman"), false);
  spark(P.x, P.y - 30, "#7dffa8", 14);
  return true;
}

// Dipanggil tiap frame dari update()
function updateDebuff(dt) {
  if (!P || P.dead || !P.debuff) return;
  for (const j of Object.keys(P.debuff)) {
    P.debuff[j] -= dt;
    const A = ATURAN.debuff[j];
    const tumpuk = (j === "berdarah" && P.tumpuk && P.tumpuk.berdarah) || 1;
    if (A && A.perDetik && P.hp > 1) P.hp = Math.max(1, P.hp - maxHp() * A.perDetik * tumpuk * dt);
    // butiran kecil di badan
    if (Math.random() < 0.25) {
      const warna = A ? A.warna : "#fff";
      parts.push({ x: P.x + rand(-10, 10), y: P.y + rand(-3, 3), z: rand(10, 40), vz: rand(20, 60), vx: 0, vy: 0, life: 0.5, max: 0.5, color: warna, s: 4, float: true });
    }
    if (P.debuff[j] <= 0) {
      delete P.debuff[j];
      if (j === "lumpuh") P.kebalLumpuh = ATURAN.debuff.lumpuh.kebalSetelah;
      if (j === "berdarah" && P.tumpuk) P.tumpuk.berdarah = 0;
    }
  }
}

// Ikon debuff di atas tag nama pemain (koordinat layar)
function drawIkonDebuff(px, py) {
  if (!P || !P.debuff) return;
  const ada = JENIS_DEBUFF.filter((j) => P.debuff[j] > 0);
  if (!ada.length) return;
  const r = 9, gap = 4, w = ada.length * (r * 2 + gap) - gap;
  let x = px - w / 2 + r;
  const y = py - 48;
  ctx.save();
  for (const j of ada) {
    const A = ATURAN.debuff[j], sisa = P.debuff[j];
    ctx.fillStyle = "rgba(10,6,20,0.8)"; ctx.beginPath(); ctx.arc(x, y, r + 2, 0, 6.28); ctx.fill();
    ctx.fillStyle = A.warna; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.28); ctx.fill();
    ikonDebuff(j, x, y);
    // sisa waktu: busur gelap
    ctx.strokeStyle = "rgba(10,6,20,0.55)"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(x, y, r + 0.5, -Math.PI / 2, -Math.PI / 2 + 6.28 * (1 - Math.min(1, sisa / 6))); ctx.stroke();
    x += r * 2 + gap;
  }
  ctx.restore();
}
// gambar kecil di dalam ikon
function ikonDebuff(j, x, y) {
  ctx.fillStyle = "#1b1208"; ctx.strokeStyle = "#1b1208"; ctx.lineWidth = 1.8; ctx.lineCap = "round";
  ctx.beginPath();
  if (ikonDebuffBaru(j, x, y)) return;   // lumpuh & berdarah (55-debuff-baru.js)
  if (j === "racun") { ctx.moveTo(x, y - 5); ctx.quadraticCurveTo(x + 5, y + 1, x, y + 5); ctx.quadraticCurveTo(x - 5, y + 1, x, y - 5); ctx.fill(); }          // tetes
  else if (j === "terbakar") { ctx.moveTo(x - 4, y + 4); ctx.quadraticCurveTo(x - 5, y - 2, x, y - 6); ctx.quadraticCurveTo(x + 5, y - 2, x + 4, y + 4); ctx.closePath(); ctx.fill(); } // api
  else if (j === "lambat") { ctx.moveTo(x - 4, y - 4); ctx.lineTo(x, y); ctx.lineTo(x + 4, y - 4); ctx.moveTo(x - 4, y); ctx.lineTo(x, y + 4); ctx.lineTo(x + 4, y); ctx.stroke(); } // panah turun
  else if (j === "lemah") { ctx.moveTo(x - 4, y + 4); ctx.lineTo(x + 1, y - 1); ctx.moveTo(x + 2, y - 2); ctx.lineTo(x + 4, y - 4); ctx.stroke(); }  // pedang patah
  else if (j === "bingung") { ctx.arc(x, y, 4, 0, 4.7); ctx.stroke(); }                                                                                    // putaran
}
