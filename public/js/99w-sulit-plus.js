// =====================================================================
// SULIT+ (PENDEKAR SEJATI) — tingkat kesulitan setelah tamat
// Terbuka setelah cerita tamat (pencapaian "tamat"); tersimpan juga per perangkat
// (laga.sulitPlus) supaya bisa dipilih untuk permainan baru di layar judul.
//  - Musuh lebih tebal & jauh lebih sakit (ATURAN.kesulitan.sulitPlus).
//  - TANDA SERANGAN DIHILANGKAN: tidak ada area merah sebelum musuh/bos menyerang.
//    Baca gerakan ancang-ancangnya sendiri!
//  - Musuh ancang-ancang lebih cepat & jeda serangnya lebih pendek.
//  - Hadiah EXP & koin lebih besar. Kalahkan Prabu Kalamurka di Sulit+ → gelar «Pendekar Sejati».
// =====================================================================
"use strict";

ATURAN.kesulitan.sulitPlus = { keMusuh: 0.7, dariMusuh: 1.6, exp: 1.35, koin: 1.4 };
PILIHAN_KESULITAN.push("sulitPlus");
Object.assign(TEKS.id, {
  "kes.sulitPlus": "Sulit+",
  "kes.sulitPlus.desc": "Pendekar Sejati: tanpa tanda serangan, musuh lebih cepat & sakit.",
  "kes.sulitPlus.kunci": "Terbuka setelah cerita tamat.",
});
Object.assign(TEKS.en, {
  "kes.sulitPlus": "Hard+",
  "kes.sulitPlus.desc": "True Warrior: no attack warnings, faster & deadlier enemies.",
  "kes.sulitPlus.kunci": "Unlocks after finishing the story.",
});
const SULIT_PLUS_KEY = "laga.sulitPlus";
const sulitPlusTerbuka = () => store.get(SULIT_PLUS_KEY, false) || (S && capaiTercapai("tamat"));
const sulitPlusAktif = () => kesulitanNow() === "sulitPlus";
UPDATE_TAMBAHAN.push(() => { if (S && capaiTercapai("tamat") && !store.get(SULIT_PLUS_KEY, false)) store.set(SULIT_PLUS_KEY, true); });

// tombol pilihan: Sulit+ terkunci sampai tamat
{
  const asli = tombolKesulitan;
  tombolKesulitan = function (aktif, attr) {
    let html = asli(aktif, attr);
    if (!sulitPlusTerbuka()) html = html.replace(new RegExp(`<button type="button" class="kes-btn kes-sulitPlus" ${attr}="sulitPlus"[^>]*>`),
      `<button type="button" class="kes-btn kes-sulitPlus kes-kunci" disabled aria-disabled="true">`).replace(t("kes.sulitPlus.desc"), "🔒 " + t("kes.sulitPlus.kunci"));
    return html;
  };
}

// tanda serangan hilang
{
  const asliBos = tandaBos;
  tandaBos = function (m) { if (sulitPlusAktif()) return; return asliBos(m); };
  const asli = drawMonster;
  drawMonster = function (m, time) {
    if (!sulitPlusAktif() || m.state !== "windup") return asli(m, time);
    // sembunyikan area merah: gambar dengan status sementara, tapi pose ancang-ancang tetap (bergetar)
    m.state = "windupDiam";
    const ox = m.x; m.x += Math.sin(time * 60) * 1.2;
    try { asli(m, time); } finally { m.x = ox; m.state = "windup"; }
  };
}
// musuh lebih cepat
{
  const asli = makeMonster;
  makeMonster = function (type, spot) {
    const m = asli(type, spot);
    if (S && sulitPlusAktif() && !m.d.latihan) m.d = { ...m.d, wind: m.d.wind * 0.8, cd: m.d.cd * 0.85, speed: Math.round(m.d.speed * 1.08) };
    return m;
  };
}
// gelar setelah mengalahkan bos terakhir di Sulit+
{
  const asli = killMonster;
  killMonster = function (m) {
    const hidup = !m.dead; asli(m);
    if (hidup && m.dead && m.type === "kalamurka" && sulitPlusAktif() && !punyaGelar("pendekarSejati")) {
      kirimPesan({ id: "pendekarSejati", dari: ["Resi Wening", "Resi Wening"], judul: ["Pendekar Sejati", "True Warrior"],
        isi: ["Tanpa tanda, tanpa ragu, kau membaca setiap gerak lawan. Nusantara mengakuimu sebagai Pendekar Sejati.", "No warnings, no hesitation: you read every move. Nusantara names you a True Warrior."],
        hadiah: { gelar: ["pendekarSejati"], serpih: 10, koin: 2000 } });
      toast(Lx(["🎖 Gelar «Pendekar Sejati» menunggumu di Kotak!", "🎖 The «True Warrior» title awaits in your Mailbox!"]), true);
    }
  };
}
