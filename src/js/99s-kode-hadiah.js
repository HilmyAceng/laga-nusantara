// =====================================================================
// KODE HADIAH (di kaki tab Pesan, popup Kotak)
// Dua jenis kode:
//  1. Kode Pendukung pribadi untuk pendukung Saweria: LNP-NAMA-XXXXXX
//     (NAMA = huruf/angka, XXXXXX = tanda tangan pendek dari nama). Dibuat dengan alat
//     di luar repo (~/BikinGame/alat-laga-nusantara/kode-pendukung.html).
//     Hadiah: set kosmetik Pendukung + gelar «Pendukung · Nama».
//  2. Kode promo/event: daftar KODE_PROMO di bawah (huruf besar), bisa diberi batas tanggal.
// Setiap kode hanya bisa dipakai sekali per save. Hadiah dikirim ke Kotak Pesan.
// Simpanan: S.kodeDipakai = { KODE: waktu }
// Catatan: game tanpa server, jadi kode ini "kunci sopan", bukan pengaman mutlak.
// Karena hadiahnya hanya kosmetik, itu tidak merusak keseimbangan game.
// =====================================================================
"use strict";

const RAHASIA_KODE = "wanasari-kabut-merah-28";
const KODE_PROMO = {
  // contoh: "MERDEKA81": { hadiah: { koin: 300, kosmetik: ["merahPutih"] }, judul: ["Hadiah 17 Agustus", "Independence Day gift"], sampai: "2027-08-31" },
  LAGABETA: { hadiah: { koin: 200, jamu: 2 }, judul: ["Hadiah penguji beta", "Beta tester gift"] },
};
function tandaKode(nama) {
  let a = 0x811c9dc5, b = 0x1505;
  const s = RAHASIA_KODE + "|" + nama;
  for (let i = 0; i < s.length; i++) { a = Math.imul(a ^ s.charCodeAt(i), 0x01000193) >>> 0; b = (Math.imul(b, 33) + s.charCodeAt(i)) >>> 0; }
  return ((a ^ (b << 7)) >>> 0).toString(36).toUpperCase().padStart(6, "0").slice(-6);
}
const rapikanNama = (n) => n.charAt(0) + n.slice(1).toLowerCase();

function tukarKode(teks) {
  const kode = (teks || "").trim().toUpperCase().replace(/\s+/g, "");
  if (!kode) return;
  S.kodeDipakai = S.kodeDipakai || {};
  if (S.kodeDipakai[kode]) return pesanKodeHadiah(Lx(["Kode ini sudah pernah dipakai.", "This code has already been used."]), false);
  // kode pendukung pribadi
  const m = kode.match(/^LNP-([A-Z0-9]{2,12})-([A-Z0-9]{6})$/);
  if (m) {
    if (tandaKode(m[1]) !== m[2]) return pesanKodeHadiah(Lx(["Kode tidak valid. Periksa lagi hurufnya.", "Invalid code. Please check the letters."]), false);
    const nama = rapikanNama(m[1]);
    S.kodeDipakai[kode] = Date.now(); dataGaya().pendukung = nama;
    kirimPesan({
      id: "pendukung-" + kode, dari: ["Pengembang", "Developer"],
      judul: [`Terima kasih, ${nama}! 💛`, `Thank you, ${nama}! 💛`],
      isi: ["Dukunganmu membantu Laga Nusantara terus berkembang. Terimalah set kosmetik Pendukung dan gelar khusus dengan namamu. Pakai di Menu › Gameplay › Kosmetik & Gelar.", "Your support keeps Laga Nusantara growing. Please accept the Supporter cosmetic set and a special title with your name. Equip them in Menu › Gameplay › Cosmetics & Titles."],
      hadiah: { kosmetik: ["emasKeraton", "ikatPendukung", "mahkota", "bintang"], gelar: ["pendukung"] },
    });
    pesanKodeHadiah(Lx(["Berhasil! Hadiah dikirim ke Pesan di atas.", "Success! Rewards sent to your Mail above."]), true);
    tambahStat && tambahStat("kodePendukung");
    return isiKotak();
  }
  const p = KODE_PROMO[kode];
  if (!p) return pesanKodeHadiah(Lx(["Kode tidak dikenal.", "Unknown code."]), false);
  if (p.sampai && Date.now() > new Date(p.sampai + "T23:59:59").getTime()) return pesanKodeHadiah(Lx(["Kode ini sudah kedaluwarsa.", "This code has expired."]), false);
  S.kodeDipakai[kode] = Date.now();
  kirimPesan({ id: "promo-" + kode, dari: ["Pengembang", "Developer"], judul: p.judul, isi: p.isi || [`Hadiah dari kode ${kode}.`, `A gift from code ${kode}.`], hadiah: p.hadiah });
  pesanKodeHadiah(Lx(["Berhasil! Hadiah dikirim ke Pesan di atas.", "Success! Rewards sent to your Mail above."]), true);
  isiKotak();
}
let pesanKodeSimpan = null;
function pesanKodeHadiah(teks, bagus) {
  pesanKodeSimpan = bagus ? { teks, bagus } : null;
  const el = $("kodeHadiahPesan"); if (el) { el.textContent = teks; el.className = "kt-kode-pesan " + (bagus ? "bagus" : "gagal"); }
  (bagus ? sfx.quest || sfx.coin : sfx.hurt)();
}
function kakiKodeHadiah() {
  const p = pesanKodeSimpan; pesanKodeSimpan = null;
  return `<form class="kt-kode" id="formKodeHadiah" autocomplete="off">
    <label for="kodeHadiahIsi">${Lx(["Punya kode hadiah?", "Have a gift code?"])}</label>
    <input id="kodeHadiahIsi" type="text" maxlength="24" spellcheck="false" placeholder="LNP-NAMA-XXXXXX">
    <button type="submit" class="go kecil">${Lx(["Tukar", "Redeem"])}</button>
    <small id="kodeHadiahPesan" class="kt-kode-pesan ${p ? (p.bagus ? "bagus" : "gagal") : ""}">${p ? p.teks : Lx(["Pendukung Saweria mendapat kode pribadi berisi kosmetik & gelar khusus.", "Saweria supporters get a personal code with special cosmetics & a title."])}</small>
  </form>`;
}
document.addEventListener("submit", (e) => {
  if (e.target.id !== "formKodeHadiah") return;
  e.preventDefault(); tukarKode($("kodeHadiahIsi").value);
});
// supaya mengetik kode tidak ikut menggerakkan hero / membuka menu
addEventListener("keydown", (e) => { if (e.target && e.target.id === "kodeHadiahIsi" && e.key !== "Escape") e.stopImmediatePropagation(); }, true);
