// =====================================================================
// CUACA ACAK
// Di luar adegan cerita, langit berganti sendiri tiap beberapa menit (jam dunia nyata).
//  - Cuaca CERITA (99zt) selalu menang; cuaca acak hanya mengisi saat cerita diam.
//  - Tiap area punya "iklim" (IKLIM_CUACA) yang menentukan peluang tiap cuaca.
//    Area satu dunia dengan iklim sama berbagi cuaca, jadi berjalan dari kampung
//    ke hutan sebelah tidak tiba-tiba berubah dari hujan ke cerah.
//  - Salju acak hanya di area bersalju (area.salju / bagian atas area.saljuMulai).
//  - Sabana: kemarau panjang sampai hujan pertama di Bab 13 ep 10 (sesuai cerita).
//  - Gua (area.gelap) & area tanpa langit (TANPA_CUACA) tidak pernah kena cuaca.
// =====================================================================
"use strict";

const CUACA_ACAK_MENIT = 5;   // lama satu giliran cuaca

// Peluang tiap cuaca per iklim (angka = bobot, tidak harus berjumlah 100). null = cerah.
const IKLIM_CUACA = {
  biasa:  { cerah: 70, gerimis: 15, hujan: 9, hujanPetir: 5, badai: 1 },
  lembap: { cerah: 50, gerimis: 20, hujan: 18, hujanPetir: 10, badai: 2 },   // hutan hujan
  pantai: { cerah: 64, gerimis: 12, hujan: 10, hujanPetir: 7, badai: 7 },    // badai laut
  kering: { cerah: 88, gerimis: 8, hujan: 4 },                               // sabana
  salju:  { cerah: 25, salju: 55, badaiSalju: 20 },
};
// Area pesisir & laut
const AREA_PANTAI = ["pesisir", "bandar", "bakau", "desaApung", "mercusuar", "labuhan", "gangLabuhan"];
// Area tanpa langit terbuka / tidak masuk akal kehujanan (kawah panas, di atas awan, dalam bangunan)
const TANPA_CUACA = ["kawah", "puncakNaga", "singgasana", "tuguAgung", "awan", "tamanGantung", "istanaAwan", "kuil"];

function iklimArea() {
  if (!area || area.gelap || TANPA_CUACA.includes(areaId)) return null;
  if (area.salju || (area.saljuMulai != null && P && P.y / T < area.saljuMulai)) return "salju";
  if (area.sabana) return sabanaSudahHujan() ? "kering" : null;
  if (area.rimba) return "lembap";
  if (AREA_PANTAI.includes(areaId)) return "pantai";
  return "biasa";
}
// Sudah lewat hujan pertama Bab 13 ep 10?
let idxHujanPertama = null;
function sabanaSudahHujan() {
  if (idxHujanPertama == null) idxHujanPertama = CERITA.findIndex((l) => babLangkah(l) === 13 && l.ep === 10);
  return idxHujanPertama >= 0 && S && S.cerita && S.cerita.idx >= idxHujanPertama;
}

// Angka acak tetap untuk (giliran, dunia, iklim): semua orang yang menunggu di tempat sama
// melihat cuaca sama selama satu giliran.
function acakTetap(teks) {
  let h = 2166136261;
  for (let i = 0; i < teks.length; i++) { h ^= teks.charCodeAt(i); h = Math.imul(h, 16777619); }
  h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}
function cuacaAcak() {
  const iklim = iklimArea(); if (!iklim) return null;
  const giliran = Math.floor(Date.now() / (CUACA_ACAK_MENIT * 60000));
  const bobot = IKLIM_CUACA[iklim], total = Object.values(bobot).reduce((a, b) => a + b, 0);
  let r = acakTetap(giliran + ":" + (area.dunia || 0) + ":" + iklim) * total;
  for (const k in bobot) { r -= bobot[k]; if (r < 0) return k === "cerah" ? null : k; }
  return null;
}
