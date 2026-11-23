// =====================================================================
// KOLEKSI JIMAT (Menu › Gameplay › Koleksi Jimat)
// Daftar SEMUA jimat di game, dikelompokkan per rarity, supaya pemain tahu
// berapa banyak yang ada & yang sudah terkumpul.
//  - sudah didapat : kartu berwarna rarity, nama, bintang, efek
//  - belum didapat : kartu redup, nama, efek, dan cara mendapatkannya
// Data jimat di JIMAT (config.js); kepemilikan di S.jimat.punya (52-jimat.js).
// =====================================================================
"use strict";

const URUT_RARITY = ["biasa", "langka", "legenda"];

// petunjuk cara mendapatkan jimat yang belum dimiliki
function sumberJimat(id) {
  const J = JIMAT[id];
  // tingkat Cermin Gaib terendah yang memberi hadiah legenda (ATURAN.cermin.jimat)
  const tingkat = Object.keys(ATURAN.cermin.jimat).find((n) => ATURAN.cermin.jimat[n].includes("legenda"));
  if (J.bos) return t("koleksi.dariBos", { bos: MONSTERS[J.bos].name, tingkat });
  if (J.sumber) return t(J.sumber);   // sumber khusus (mis. hadiah Catur Laga)
  return t("koleksi.sumber." + J.rarity);
}
function kartuKoleksi(id) {
  const J = JIMAT[id], punya = bintangJimat(id) > 0;
  return `<div class="jm-card ${punya ? "" : "kk-belum"}" style="--rc:${WARNA_RARITY[J.rarity]}">
    <div class="jm-head"><b>${punya ? "" : "🔒 "}${namaJimat(id)}</b>${punya ? bintangHtml(id) : `<span class="jm-rar">${t("koleksi.belum")}</span>`}</div>
    <p>${teksEfek(id)}</p>
    ${punya ? "" : `<small>${sumberJimat(id)}</small>`}</div>`;
}
function isiKoleksiJimat() {
  const semua = Object.keys(JIMAT), dapat = semua.filter((id) => bintangJimat(id) > 0).length;
  const bagian = URUT_RARITY.map((r) => {
    const ids = semua.filter((id) => JIMAT[id].rarity === r);
    const n = ids.filter((id) => bintangJimat(id) > 0).length;
    // yang sudah dimiliki di depan
    ids.sort((a, b) => (bintangJimat(b) > 0) - (bintangJimat(a) > 0));
    return `<h3 style="color:${WARNA_RARITY[r]}">${t("rarity." + r)} · ${n} / ${ids.length}</h3>
      <div class="jr-grid">${ids.map(kartuKoleksi).join("")}</div>`;
  }).join("");
  $("koleksiIsi").innerHTML = `
    <div class="st-box"><b>${t("koleksi.total", { n: dapat, total: semua.length })}</b>
      <div class="st-bar"><i style="width:${(100 * dapat) / semua.length}%"></i></div>
      <small>${t("koleksi.info")}</small></div>
    ${bagian}`;
}
