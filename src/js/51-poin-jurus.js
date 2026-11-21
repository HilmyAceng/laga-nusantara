// =====================================================================
// POIN JURUS
// Tiap naik level dapat 1 poin jurus. Poin dipakai untuk menaikkan rank jurus
// (damage +, jeda -, kemampuan baru di rank 3 & 5) atau pasif (PASIF di config.js).
// Halaman: Menu › Pengaturan › Gameplay › Jurus, atau tombol K (KONTROL.menuJurus).
// Di halaman yang sama kamu memilih jurus untuk slot 1 & slot 2.
// Poin bisa diatur ulang dengan koin (ATURAN.poinJurus.resetHarga × level).
// =====================================================================
"use strict";

const rankPasif = (id) => (S && S.jurus && S.jurus.pasif[id]) || 0;
const pasifNilai = (id) => { const p = PASIF.find((x) => x.id === id); return p ? rankPasif(id) * p.per : 0; };
const poinTerpakai = () => Object.values(S.jurus.rank).reduce((a, b) => a + b, 0) + Object.values(S.jurus.pasif).reduce((a, b) => a + b, 0);
const poinSisa = () => Math.max(0, S.lv - 1 - poinTerpakai());
const hargaReset = () => ATURAN.poinJurus.resetHarga * S.lv;

// Dipanggil dari gainExp setiap naik level
function setelahNaikLevel(lv) {
  for (const j of jurusKelas()) if (j.buka === lv) {
    setTimeout(() => toast(t("jurus.baru", { nama: namaJurus(j) }), true), 900);
    aturSlotAwal();
  }
  if (lv === ATURAN.tenaga.bukaLevel) setTimeout(() => toast(t("pam.terbuka", { nama: teksPam("name"), k: kb("pamungkas").replace(/<[^>]+>/g, "") }), true), 1800);
  if (lv === ATURAN.jimat.slotTambah) setTimeout(() => toast(t("jimat.slotBaru"), true), 2600);
  setTimeout(() => toast(t("jurus.poinBaru", { n: poinSisa(), k: isTouch ? t("jurus.lewatMenu") : "K" }), false), 1300);
}

// ---------- Halaman ----------
function pips(n, maks) { return `<span class="pips">${Array.from({ length: maks }, (_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("")}</span>`; }
function isiHalamanJurus() {
  const sisa = poinSisa(), M = ATURAN.poinJurus.rankMaks;
  const kartu = jurusKelas().map((j) => {
    const buka = jurusTerbuka(j), r = rankJurus(j.id), di = S.jurus.slot.indexOf(j.id);
    return `
    <div class="jr-card${buka ? "" : " kunci"}">
      <div class="jr-head"><b>${namaJurus(j)}</b>${buka ? pips(r, M) : `<span class="jr-lv">${t("jurus.bukaLv", { lv: j.buka })}</span>`}</div>
      <p>${teksJ(j, "desc")} <small>${t("jurus.cd", { cd: (buka ? cdJurus(j) : j.cd).toFixed(1) })}</small></p>
      <p class="jr-naik${r >= 3 ? " on" : ""}">★3 · ${teksJ(j, "naik3")}</p>
      <p class="jr-naik${r >= 5 ? " on" : ""}">★5 · ${teksJ(j, "naik5")}</p>
      ${buka ? `<div class="jr-aksi">
        <button type="button" data-aksi="rank" data-id="${j.id}" ${sisa > 0 && r < M ? "" : "disabled"}>+ ${t("jurus.rank")}</button>
        <button type="button" data-aksi="slot" data-i="0" data-id="${j.id}" aria-pressed="${di === 0}">${t("jurus.slot", { n: 1 })}</button>
        <button type="button" data-aksi="slot" data-i="1" data-id="${j.id}" aria-pressed="${di === 1}">${t("jurus.slot", { n: 2 })}</button>
      </div>` : ""}
    </div>`;
  }).join("");
  const pam = `
    <div class="jr-card pam${pamungkasTerbuka() ? "" : " kunci"}">
      <div class="jr-head"><b>${teksPam("name")}</b><span class="jr-lv">${pamungkasTerbuka() ? t("pam.label") : t("jurus.bukaLv", { lv: ATURAN.tenaga.bukaLevel })}</span></div>
      <p>${teksPam("desc")}</p>
      <p class="jr-naik on">${t("pam.cara")}</p>
    </div>`;
  const pasif = PASIF.map((p) => `
    <div class="jr-pasif">
      <div><b>${(bahasa === "en" && p.en ? p.en.name : p.name)}</b><small>${(bahasa === "en" && p.en ? p.en.desc : p.desc)}</small></div>
      ${pips(rankPasif(p.id), M)}
      <button type="button" data-aksi="pasif" data-id="${p.id}" ${sisa > 0 && rankPasif(p.id) < M ? "" : "disabled"}>+</button>
    </div>`).join("");
  $("jurusIsi").innerHTML = `
    <div class="jr-top"><span>${t("jurus.poin")}: <b>${sisa}</b></span>
      <button type="button" data-aksi="reset" ${poinTerpakai() > 0 && S.gold >= hargaReset() ? "" : "disabled"}>${t("jurus.reset", { harga: hargaReset() })}</button></div>
    <h3>${t("jurus.judulJurus")}</h3><div class="jr-grid">${kartu}</div>
    <h3>${t("pam.judul")}</h3>${pam}
    <h3>${t("jurus.judulPasif")}</h3><div class="jr-pasifs">${pasif}</div>`;
}
$("jurusIsi").addEventListener("click", (e) => {
  const b = e.target.closest("[data-aksi]");
  if (!b || b.disabled) return;
  const id = b.dataset.id, M = ATURAN.poinJurus.rankMaks;
  if (b.dataset.aksi === "rank" && poinSisa() > 0 && rankJurus(id) < M) { S.jurus.rank[id] = rankJurus(id) + 1; sfx.level(); }
  if (b.dataset.aksi === "pasif" && poinSisa() > 0 && rankPasif(id) < M) { S.jurus.pasif[id] = rankPasif(id) + 1; sfx.level(); if (id === "nyawa") P.hp = Math.min(P.hp, maxHp()); }
  if (b.dataset.aksi === "slot") {
    const i = +b.dataset.i, sl = S.jurus.slot, lain = sl.indexOf(id);
    if (lain >= 0 && lain !== i) sl[lain] = sl[i] || null;   // tukar tempat
    sl[i] = id; sfx.click();
  }
  if (b.dataset.aksi === "reset" && S.gold >= hargaReset()) {
    S.gold -= hargaReset(); S.jurus.rank = {}; S.jurus.pasif = {}; P.hp = Math.min(P.hp, maxHp()); sfx.coin();
    toast(t("jurus.direset"), false);
  }
  saveSoon(); refreshHud(true); isiHalamanJurus();
});

// buka halaman menu langsung (tombol K / I) dari permainan
function bukaHalamanMenu(view) {
  if (mode === "play") { togglePause(); showPauseView(view); }
  else if (mode === "pause") { if (pauseView === view) togglePause(); else showPauseView(view); }
}
addEventListener("keydown", (e) => {
  if (e.repeat) return;
  const act = ACTION_OF[keyName(e)];
  if (act === "menuJurus") bukaHalamanMenu("jurus");
  if (act === "menuJimat") bukaHalamanMenu("jimat");
});
