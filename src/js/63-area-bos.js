// =====================================================================
// AREA BOS
// Bos mengejar pemain jauh lebih luas dari sarangnya sebelum menyerah & pulang
// (supaya pertarungan tidak terasa sempit dan pemain tidak mudah "mengakali" bos
// dengan mundur sedikit). Aturannya di ATURAN.areaBos (config.js).
// Dipakai 15-update.js (bos lama) & 26-monster-baru.js (bosUmum).
// =====================================================================
"use strict";

function jarakAreaBos(d, dasar) {
  if (!d.boss) return dasar;
  const A = ATURAN.areaBos;
  return Math.max(dasar * A.kali, A.minimal);
}
