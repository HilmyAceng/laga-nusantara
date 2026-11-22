// =====================================================================
// HINDAR DIAM (Hindar TANPA arah) — aksi khas tiap hero, tetap memakai 1 lapis hindar
//  - Pendobrak : TANGKIS (50-hindar-tangkis.js) — kuda-kuda, penyerang lumpuh lama, dibalas.
//  - Pendekar  : TEBAS BALAS — kuda-kuda balasan: saat diserang, melesat ke belakang
//                penyerang & menebas kritis (damage besar, lumpuh singkat).
//  - Pemanah   : LOMPAT MUNDUR — salto menjauhi musuh terdekat, kebal sesaat;
//                kalau musuh dekat, panah berikutnya pasti kritis.
//  - Penyihir  : KEDIP — teleport menjauh, meninggalkan ledakan es (musuh lambat & kena damage).
// Semua: dipakai TEPAT saat serangan datang = hindar sempurna & memecahkan perisai biru
// (kuda-kuda) bos — jadi setiap hero punya cara melawan bos yang bertahan.
// Angka di ATURAN.hindarDiam (config.js).
// =====================================================================
"use strict";

const HD = () => ATURAN.hindarDiam;
const aksiDiam = () => (S && HD().aksi[S.cls]) || "tangkis";

// lapis hindar dipakai (sama seperti berguling/tangkis)
function pakaiLapis() {
  if (!(P.lapis > 0)) {
    if (!(P.habisT > 0)) { P.habisT = 0.6; numbers.push({ x: P.x, y: P.y - 80, v: t("hindar.habis"), life: 0.7, color: "#c9bfd6", size: 18 }); sfx.click(); }
    return false;
  }
  if (P.lapis === lapisMaks()) P.lapisT = isiUlangHindar();
  P.lapis--;
  return true;
}
// arah menjauh dari musuh terdekat (kalau tidak ada: membelakangi arah hadap)
function arahMenjauh(jarak) {
  const m = musuhDekat(jarak)[0];
  const a = m ? Math.atan2(P.y - m.y, P.x - m.x) : (P.face || 0) + Math.PI;
  return { a, m };
}
// tepat waktu → hindar sempurna + pecahkan kuda-kuda bos (ancaman dicek SEBELUM bergerak)
function cekTepatWaktu(ancam) {
  if (!ancam) return false;
  hindarSempurna(ancam === true ? null : ancam);
  if (ancam !== true && ancam.d && typeof pecahkanKudaKuda === "function") pecahkanKudaKuda(ancam);
  return true;
}
// latihan dasar langkah "tangkis": cukup lakukan aksi khas di dekat boneka / saat diserang
function latihanDiam() { if (monsters.some((m) => m.d.latihan && dist(m, P) < 220)) latihanAksi("tangkis"); }

{
  const hindarLama = hindarAtauTangkis;
  hindarAtauTangkis = function (inp) {
    const aksi = aksiDiam();
    if (inp.mx || inp.my || ["tangkis", "balas", "wayang", "sembur"].includes(aksi)) {
      const ok = hindarLama(inp);
      if (ok && !inp.mx && !inp.my) P.jenisDiam = aksi;   // wayang / sembur ditangani hero baru (90, 91)
      if (ok && !inp.mx && !inp.my && aksi === "balas") { P.balas = true; numbers.push({ x: P.x, y: P.y - 80, v: t("hd.balasSiap"), life: 0.5, color: "#ffd166", size: 16 }); }
      return ok;
    }
    if (!pakaiLapis()) return false;
    const C = HD(), ancam = ancamanDekat();
    if (aksi === "lompat") {
      const { a, m } = arahMenjauh(320);
      P.rdx = Math.cos(a); P.rdy = Math.sin(a);
      P.roll = C.lompatLama; P.rollT = 0; P.rollCd = ATURAN.hindar.jeda;
      P.inv = Math.max(P.inv, C.lompatLama + 0.12); P.lompat = 18;
      if (m && dist(m, P) < C.lompatKritisJarak) { P.kritisSiap = true; numbers.push({ x: P.x, y: P.y - 80, v: t("hd.lompatKritis"), life: 0.8, color: "#ffd166", size: 18 }); }
      sfx.roll();
    } else if (aksi === "bayang") {   // Jawara: muncul di belakang musuh terdekat, pukulan berikutnya kritis
      const m = musuhDekat(C.bayangJarak)[0];
      if (m) {
        const a = Math.atan2(m.y - P.y, m.x - P.x), x1 = m.x + Math.cos(a) * (m.r + 30), y1 = m.y + Math.sin(a) * (m.r + 30);
        kedipFx.push({ x0: P.x, y0: P.y, x1, y1, t: 0, dur: 0.35, emas: true });
        if (!solidAt(x1, y1)) { P.x = x1; P.y = y1; P.face = a + Math.PI; }
      } else { const { a } = arahMenjauh(200); const x1 = P.x + Math.cos(a) * 120, y1 = P.y + Math.sin(a) * 120; if (!solidAt(x1, y1)) { P.x = x1; P.y = y1; } }
      P.kritisSiap = true; P.inv = Math.max(P.inv, 0.4); P.rollCd = ATURAN.hindar.jeda;
      numbers.push({ x: P.x, y: P.y - 80, v: t("hd.bayang"), life: 0.8, color: "#c9a6ff", size: 18 }); sfx.roll();
    } else if (aksi === "kedip") {
      const { a } = arahMenjauh(300), x0 = P.x, y0 = P.y;
      let d = C.kedipJarak;
      while (d > 20 && solidAt(x0 + Math.cos(a) * d, y0 + Math.sin(a) * d)) d -= 20;
      P.x = x0 + Math.cos(a) * d; P.y = y0 + Math.sin(a) * d;
      P.inv = Math.max(P.inv, 0.35); P.rollCd = ATURAN.hindar.jeda;
      for (const m of monsters) if (!m.dead && Math.hypot(m.x - x0, m.y - y0) < C.esR + m.r) {
        lambatkanMonster(m, C.esLambat);
        damageMonster(m, atkPower() * C.esKali, Math.atan2(m.y - y0, m.x - x0), 80, { tanpaTenaga: true });
      }
      kedipFx.push({ x0, y0, x1: P.x, y1: P.y, t: 0, dur: 0.45 });
      spark(x0, y0 - 20, "#aee6ff", 14); sfx.zap ? sfx.zap() : sfx.roll();
    }
    cekTepatWaktu(ancam);
    latihanDiam();
    return true;
  };
}
let kedipFx = [];

// Pendekar: TEBAS BALAS menggantikan tangkis biasa saat serangan masuk
{
  const cekLama = cekHindarTangkis;
  cekHindarTangkis = function (amount, ang, opts) {
    if (!(P && P.tangkis > 0 && P.balas && !opts.mutlak && !P.dead)) return cekLama(amount, ang, opts);
    const C = HD(), dari = opts.dari || musuhAktif;
    P.tangkis = 0; P.balas = false; P.rollCd = 0;
    numbers.push({ x: P.x, y: P.y - 80, v: t("hd.balas"), life: 1, color: "#ffd166", size: 26 });
    freeze = Math.max(freeze, 0.08); sfx.crit(); sfx.dash();
    tambahTenaga(ATURAN.tenaga.tangkis, true);
    if (dari && !dari.dead && dist(dari, P) < 320) {
      // melesat ke belakang penyerang
      const a = Math.atan2(dari.y - P.y, dari.x - P.x), jauh = dari.r + 34;
      const x1 = dari.x + Math.cos(a) * jauh, y1 = dari.y + Math.sin(a) * jauh;
      kedipFx.push({ x0: P.x, y0: P.y, x1: solidAt(x1, y1) ? P.x : x1, y1: solidAt(x1, y1) ? P.y : y1, t: 0, dur: 0.3, emas: true });
      if (!solidAt(x1, y1)) { P.x = x1; P.y = y1; }
      P.face = a + Math.PI; P.swing = P.swingDur = 0.2; P.inv = Math.max(P.inv, 0.45);
      const pecah = typeof pecahkanKudaKuda === "function" && pecahkanKudaKuda(dari);
      if (!pecah) lumpuhkanMonster(dari, dari.d.boss ? C.balasLumpuhBos : C.balasLumpuh);
      damageMonster(dari, atkPower() * C.balasKali, a, 220, { kritis: true, tanpaTenaga: true });
      spark(dari.x, dari.y - 30, "#ffd166", 18);
    }
    latihanAksi("tangkis");
    return true;
  };
}
UPDATE_TAMBAHAN.push((dt) => {
  if (P && !(P.tangkis > 0)) P.balas = false;
  if (P && P.lompat > 0 && !(P.roll > 0)) P.lompat = 0;
  for (const f of kedipFx) f.t += dt;
  kedipFx = kedipFx.filter((f) => f.t < f.dur);
});

// ---------- Gambar ----------
GAMBAR_TANAH.push(function () {
  for (const f of kedipFx) {
    const k = 1 - f.t / f.dur;
    ctx.strokeStyle = f.emas ? `rgba(255,209,102,${k})` : `rgba(174,230,255,${k})`; ctx.lineWidth = 4 * k + 1;
    ctx.beginPath(); ctx.moveTo(f.x0, f.y0 - 24); ctx.lineTo(f.x1, f.y1 - 24); ctx.stroke();
    if (!f.emas) { ctx.fillStyle = `rgba(174,230,255,${0.25 * k})`; ctx.beginPath(); ctx.ellipse(f.x0, f.y0, HD().esR, HD().esR * 0.55, 0, 0, 6.28); ctx.fill(); }
  }
  // kuda-kuda Tebas Balas: kilau emas di kaki
  if (P && P.tangkis > 0 && P.balas) { ctx.strokeStyle = "rgba(255,209,102,0.8)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(P.x, P.y, 24, 9, 0, 0, 6.28); ctx.stroke(); }
});
