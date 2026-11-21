// =====================================================================
// HINDAR SEMPURNA & TANGKIS
//  - Hindar (A) + arah  = berguling. Ada ATURAN.hindar.lapis muatan (awalnya 2); tiap lapis
//    terisi lagi setelah ATURAN.hindar.isiUlang detik, satu per satu. Tangkis juga memakai satu lapis.
//    Berguling Kalau serangan datang di detik-detik pertama
//    gulingan (ATURAN.hindarSempurna.jendela) → HINDAR SEMPURNA: waktu melambat,
//    pukulan berikutnya pasti kritis, Tenaga Dalam bertambah.
//  - Hindar (A) TANPA arah = kuda-kuda TANGKIS sebentar (ATURAN.tangkis.jendela).
//    Serangan yang datang saat itu ditangkis: tidak sakit, penyerangnya lumpuh,
//    kamu membalas, Tenaga Dalam bertambah. Bos yang sedang berkuda-kuda (perisai
//    biru, 57-bos-tangguh.js) pertahanannya pecah kalau serangannya ditangkis.
//  - Serangan "mutlak" (amukan bos) tidak bisa ditangkis atau dihindari dengan
//    berguling: lari ke lingkaran hijau!
// =====================================================================
"use strict";

let waktuLambat = 0;   // sisa detik (waktu nyata) gerak lambat setelah hindar sempurna

// Dipanggil dari updatePlayer saat tombol hindar ditekan. true = sudah ditangani.
function hindarAtauTangkis(inp) {
  const kurangi = 1 - bonusStat("hindarCd") - pasifNilai("tangkas");
  // berguling & tangkis sama-sama memakai satu lapis
  if (!(P.lapis > 0)) {   // lapis habis: tunggu terisi
    if (!(P.habisT > 0)) { P.habisT = 0.6; numbers.push({ x: P.x, y: P.y - 80, v: t("hindar.habis"), life: 0.7, color: "#c9bfd6", size: 18 }); sfx.click(); }
    return false;
  }
  if (P.lapis === ATURAN.hindar.lapis) P.lapisT = isiUlangHindar();   // mulai mengisi lapis yang terpakai
  P.lapis--;
  if (!inp.mx && !inp.my) {
    P.tangkis = ATURAN.tangkis.jendela + bonusStat("tangkis") + pasifNilai("tangkas") * 0.5;
    P.rollCd = ATURAN.tangkis.jeda * Math.max(0.4, kurangi);
    P.swing = P.swingDur = 0.2;
    sfx.click();
    return true;
  }
  const l = Math.hypot(inp.mx, inp.my);
  P.rdx = inp.mx / l; P.rdy = inp.my / l;
  P.roll = ATURAN.hindar.lama; P.rollT = 0; P.rollCd = ATURAN.hindar.jeda;
  P.inv = Math.max(P.inv, ATURAN.hindar.kebal); sfx.roll();
  if (bonusStat("jejakApi")) P.jejakApi = 0.01;
  latihanAksi("hindar");
  const ancam = ancamanDekat();
  if (ancam) hindarSempurna(ancam === true ? null : ancam);
  return true;
}
// detik untuk mengisi satu lapis (jimat/ramuan/pasif "tangkas" mempercepat)
const isiUlangHindar = () => ATURAN.hindar.isiUlang * Math.max(0.4, 1 - bonusStat("hindarCd") - pasifNilai("tangkas"));
// Serangan yang akan kena dalam sekejap? (dicek saat mulai berguling)
// → monster di akhir ancang-ancang & dalam jangkauan, sedang menerjang/menukik ke arahmu,
//   lingkaran bahaya yang hampir meledak di bawahmu, atau peluru yang hampir mengenai.
function ancamanDekat() {
  const J = ATURAN.hindarSempurna.jendela + 0.12;
  for (const m of monsters) {
    if (m.dead || m.stun > 0) continue;
    const d = dist(m, P), jangkau = (m.d.boss ? 170 : m.d.range + m.d.r) + P.r + 40;
    if ((m.state === "windup" || m.state === "ancang") && m.st <= J && d < Math.max(jangkau, m.serang === "hantam" || m.serang === "ekor" ? 190 : 0)) return m;
    if (["charge", "terjang", "tukik", "nafas"].includes(m.state) && d < 210) return m;
  }
  for (const b of bahaya) if (!b.done && b.dur - b.t <= J && Math.hypot(P.x - b.x, P.y - b.y) < b.r + P.r + 6) return b.dari || true;
  for (const s of tembakan) {
    const dx = P.x - s.x, dy = P.y - 30 - s.y, v = Math.hypot(s.vx, s.vy) || 1;
    if (Math.hypot(dx, dy) < 90 && (dx * s.vx + dy * s.vy) / v > 0) return s.dari || true;
  }
  return null;
}
function hindarSempurna(dari) {
  if (P.sempurnaT > 0) return;
  P.sempurnaT = 0.5;
  P.kritisSiap = true;
  P.inv = Math.max(P.inv, 0.5);
  waktuLambat = ATURAN.hindarSempurna.lamaLambat;
  numbers.push({ x: P.x, y: P.y - 80, v: t("sempurna.teks"), life: 1.1, color: "#f4b942", size: 26 });
  spark(P.x, P.y - 24, "#f4b942", 14); sfx.zap(); sfx.roll();
  tambahTenaga(ATURAN.tenaga.sempurna, true);
  latihanAksi("sempurna", dari);
}

// Dipanggil paling awal di hurtPlayer. true = serangan ini tidak mengenai.
// opts.dari = monster penyerang, opts.mutlak = tidak bisa ditangkis/dihindari
function cekHindarTangkis(amount, ang, opts) {
  if (!P || P.dead || opts.mutlak) return false;
  const dari = opts.dari || musuhAktif;
  // tangkis
  if (P.tangkis > 0) {
    P.tangkis = 0; P.rollCd = 0;
    numbers.push({ x: P.x, y: P.y - 80, v: t("tangkis.teks"), life: 1, color: "#8fd3ff", size: 26 });
    spark(P.x + Math.cos(ang + Math.PI) * 18, P.y - 30, "#dff4ff", 16);
    effects.push({ kind: "ring", x: P.x, y: P.y, r: 60, t: 0, dur: 0.3 });
    freeze = Math.max(freeze, 0.08); sfx.crit(); sfx.heavy();
    tambahTenaga(ATURAN.tenaga.tangkis, true);
    if (dari && !dari.dead && dist(dari, P) < 300) {   // penyerang jauh (peluru, hujan batu) tidak ikut terbalas
      const pecah = typeof pecahkanKudaKuda === "function" && pecahkanKudaKuda(dari);   // 57-bos-tangguh.js
      if (!pecah) lumpuhkanMonster(dari, dari.d.boss ? ATURAN.tangkis.lumpuhBos : ATURAN.tangkis.lumpuhMusuh);
      const a = Math.atan2(dari.y - P.y, dari.x - P.x);
      damageMonster(dari, atkPower() * ATURAN.tangkis.balas, a, 260, { tanpaTenaga: true });
    }
    latihanAksi("tangkis", dari);
    return true;
  }
  // hindar sempurna: diserang saat baru mulai berguling
  if (P.roll > 0 && P.rollT <= ATURAN.hindarSempurna.jendela) { hindarSempurna(dari); return true; }
  return false;
}

// Pengali waktu permainan (dipanggil dari loop utama dengan dt nyata)
function skalaWaktu(dt) {
  if (waktuLambat <= 0) return 1;
  waktuLambat -= dt;
  return ATURAN.hindarSempurna.lambat;
}

function updateHindarTangkis(dt) {
  if (!P) return;
  if (P.tangkis > 0) P.tangkis -= dt;
  if (P.habisT > 0) P.habisT -= dt;
  // isi ulang lapis hindar satu per satu
  if (P.lapis < ATURAN.hindar.lapis) {
    P.lapisT -= dt;
    if (P.lapisT <= 0) { P.lapis++; if (P.lapis < ATURAN.hindar.lapis) P.lapisT = isiUlangHindar(); }
  }
  if (P.roll > 0) P.rollT = (P.rollT || 0) + dt;
  if (P.sempurnaT > 0) P.sempurnaT -= dt;
  // jimat Mahkota Banaspati: gulingan meninggalkan jejak api
  if (P.jejakApi && P.roll > 0) {
    P.jejakApi -= dt;
    if (P.jejakApi <= 0) { P.jejakApi = 0.05; jurusFx.push({ kind: "kawah", x: P.x, y: P.y, r: 26, t: 0, dur: 1.5, tick: 0, dmg: atkPower() * 0.3 }); }
  } else P.jejakApi = 0;
}
UPDATE_TAMBAHAN.push(updateHindarTangkis);

// kuda-kuda tangkis: perisai cahaya di depan pemain; gerak lambat: layar sedikit kebiruan
GAMBAR_ATAS.push(function (time) {
  if (!P || P.dead) return;
  if (P.tangkis > 0) {
    ctx.save(); ctx.translate(P.x, P.y - 26);
    ctx.strokeStyle = `rgba(190,230,255,${0.6 + 0.4 * Math.sin(time * 40)})`; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, 30, P.face - 1.2, P.face + 1.2); ctx.stroke();
    ctx.fillStyle = "rgba(190,230,255,0.15)"; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 30, P.face - 1.2, P.face + 1.2); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  if (P.kritisSiap) { ctx.fillStyle = "rgba(244,185,66,0.6)"; ctx.beginPath(); ctx.arc(P.x + Math.cos(time * 8) * 16, P.y - 30 + Math.sin(time * 8) * 8, 3, 0, 6.28); ctx.fill(); }
});
// HUD: kotak Hindar (PC) & tombol Hindar (HP) — angka = sisa lapis, lingkaran gelap = lapis berikutnya sedang terisi
function hudHindar() {
  const maks = ATURAN.hindar.lapis, penuh = P.lapis >= maks;
  const isi = penuh ? 0 : clamp(P.lapisT / isiUlangHindar(), 0, 1);
  // putaran gelap selalu penuh 360° → 0° selama satu lapis terisi; kalau masih ada lapis, gelapnya tipis (kelas "masih")
  const c = Math.round(isi * 60) / 60;
  if (last.rc !== c) { last.rc = c; ui.bRoll.style.setProperty("--cd", c); }
  ui.bRoll.dataset.lapis = P.lapis;
  ui.bRoll.classList.toggle("habis", P.lapis <= 0);
  ui.bRoll.classList.toggle("masih", P.lapis > 0 && !penuh);
  if (!isTouch) {
    const el = ui.sRoll;
    if (last.src !== c) { last.src = c; el.style.setProperty("--cd", c); }
    el.classList.toggle("masih", P.lapis > 0 && !penuh);
    el.classList.toggle("ready", P.lapis > 0);
    el.dataset.lapis = P.lapis;
    setText(ui.sRollSec, "srs", P.lapis > 0 ? "" : String(Math.ceil(P.lapisT)));
  }
}
function drawLayarLambat() {
  if (waktuLambat <= 0) return;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.fillStyle = "rgba(120,170,255,0.12)"; ctx.fillRect(0, 0, W, H);
}
