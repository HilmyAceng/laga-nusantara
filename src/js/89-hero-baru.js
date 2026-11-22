// =====================================================================
// HERO BARU — bagian bersama (Dalang, Tabib, Jawara: 90-92)
//  - daftarkanHero(id, data): memasukkan kelas, jurus, pamungkas, suara, teks EN,
//    dan pratinjau layar judul sekaligus.
//  - senjata baru digambar: wayang (gapit kulit), labu (labu jamu + tongkat), kerambit.
//  - peluru baru digambar lewat GAMBAR_PELURU (16-gambar.js).
//  - jurusKhusus(type, fn) / pamungkasKhusus(type, mulai, detak): jenis jurus &
//    pamungkas baru tanpa mengubah 48-jurus.js / 49-pamungkas.js.
// =====================================================================
"use strict";

function daftarkanHero(id, h) {
  CLASSES[id] = h.kelas;
  JURUS[id] = h.jurus;
  PAMUNGKAS[id] = h.pamungkas;
  SUARA_HERO[id] = h.suara;
  if (typeof DATA_EN !== "undefined" && DATA_EN.kelas) DATA_EN.kelas[id] = h.en;
  previews[id] = { x: 70, y: 96, face: 0.3, run: 0, moving: false, swing: 0, swingDur: 0.3, inv: 0, flash: 0 };
}

// ---------- Jenis jurus & pamungkas baru ----------
const jurusKhusus = (type, fn) => { JALAN_JURUS[type] = fn; };
const PAMUNGKAS_KHUSUS = {};   // type → { mulai(U, dmg), detak(U, dt) }
{
  const pamAsli = pakaiPamungkas;
  pakaiPamungkas = function () {
    const U = PAMUNGKAS[S.cls], K = U && PAMUNGKAS_KHUSUS[U.type];
    if (!K) return pamAsli();
    if (!pamungkasTerbuka()) { toast(t("pam.terkunci", { lv: ATURAN.tenaga.bukaLevel }), false); return; }
    if (!tenagaPenuh()) { toast(t("pam.belum"), false); return; }
    P.tenaga = 0;
    const dmg = atkPower() * U.mult * kaliPamungkas();
    P.inv = Math.max(P.inv, 1); kilatPamungkas = 1; shake = 0.6;
    toast(teksPam("name") + "!", true);
    latihanAksi("pamungkas");
    P.ult = { type: U.type, t: 0, dur: U.dur || 1, khusus: true };
    K.mulai(P.ult, dmg, U);
  };
}
UPDATE_TAMBAHAN.push((dt) => {
  if (!P || !P.ult || !P.ult.khusus) return;
  const U = P.ult, K = PAMUNGKAS_KHUSUS[U.type];
  if (K && K.detak) K.detak(U, dt);
  if (U.t >= U.dur) P.ult = null;   // waktu U.t dimajukan oleh updatePamungkas (49)
});

// ---------- Senjata ----------
{
  const senjataAsli = drawWeapon;
  drawWeapon = function (c, weapon, pull) {
    if (weapon === "wayang") {          // gapit bambu + wayang kulit kecil
      c.strokeStyle = "#8b5e3c"; c.lineWidth = 2.5; c.beginPath(); c.moveTo(0, 6); c.lineTo(0, 40); c.stroke();
      c.fillStyle = "#c9862a"; c.beginPath(); c.moveTo(0, 26); c.lineTo(7, 32); c.lineTo(4, 46); c.lineTo(-4, 46); c.lineTo(-7, 32); c.closePath(); c.fill();
      c.fillStyle = "#3a2a1a"; c.beginPath(); c.arc(0, 24, 4, 0, 6.28); c.fill();
      c.strokeStyle = "#f4b942"; c.lineWidth = 1; c.beginPath(); c.moveTo(-5, 36); c.lineTo(5, 36); c.moveTo(-4, 41); c.lineTo(4, 41); c.stroke();
    } else if (weapon === "labu") {     // tongkat kayu dengan labu jamu tergantung
      c.strokeStyle = "#6d4c2f"; c.lineWidth = 3.5; c.beginPath(); c.moveTo(0, -4); c.lineTo(0, 40); c.stroke();
      c.fillStyle = "#c9a24a"; c.beginPath(); c.arc(0, 44, 7, 0, 6.28); c.fill(); c.beginPath(); c.arc(0, 35, 4.5, 0, 6.28); c.fill();
      c.fillStyle = "#5ad17a"; c.beginPath(); c.arc(0, 44, 2.6, 0, 6.28); c.fill();
    } else if (weapon === "kerambit") { // pisau melengkung seperti kuku harimau
      c.strokeStyle = "#3a2a1a"; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 10); c.lineTo(0, 18); c.stroke();
      c.strokeStyle = "#dfe6ee"; c.lineWidth = 3.2; c.lineCap = "round"; c.beginPath(); c.arc(-7, 20, 9, -0.2, 1.9); c.stroke();
      c.strokeStyle = "#9aa3ad"; c.lineWidth = 1; c.beginPath(); c.arc(0, 12, 3, 0, 6.28); c.stroke();
    } else senjataAsli(c, weapon, pull);
  };
}
