// =====================================================================
// JIMAT, RAMUAN & KEGUNAAN KOIN
//  - Jimat (JIMAT di config.js) dipasang di slot (2, ditambah 1 di level 25).
//    Rarity: Biasa (dibeli di toko), Langka & Legenda (drop bos: 53-drop-langka.js).
//  - Tempa jimat di toko: koin + Serpih Pusaka → bintang naik, efek +25% per bintang.
//    Jimat kembar otomatis dilebur jadi Serpih Pusaka.
//  - Ramuan sementara (RAMUAN): dibeli di toko & langsung diminum, efek 2 menit.
// Halaman: tombol 💎 di HUD (66-status-karakter.js), tombol I, atau "Jimat" di toko.
// Simpanan: S.jimat = { punya: { id: bintang }, pakai: [id], serpih, pity }, S.ramuan = { id: jam selesai }
// =====================================================================
"use strict";

const namaJimat = (id) => { const j = JIMAT[id]; return (bahasa === "en" && j.en && j.en.name) || j.name; };
const slotJimat = () => ATURAN.jimat.slot + (S && S.lv >= ATURAN.jimat.slotTambah ? 1 : 0);
const bintangJimat = (id) => (S && S.jimat && S.jimat.punya[id]) || 0;
const kaliBintang = (id) => 1 + ATURAN.jimat.perBintang * (Math.max(1, bintangJimat(id)) - 1);   // belum punya = tampil sebagai bintang 1
const ramuanAktif = (id) => !!(S && S.ramuan && S.ramuan[id] > Date.now());
const BATAS_BONUS = { cd: 0.5, tahan: 0.6, hindarCd: 0.6, kritis: 0.5 };

// Jumlah bonus satu jenis dari jimat terpasang, ramuan aktif, dan jurus (raungan)
function bonusStat(k) {
  if (!S || !S.jimat) return 0;
  let n = 0;
  for (const id of S.jimat.pakai) { const e = JIMAT[id] && JIMAT[id].efek[k]; if (typeof e === "number") n += e * kaliBintang(id); }
  for (const [id, r] of Object.entries(RAMUAN)) if (typeof r.efek[k] === "number" && ramuanAktif(id)) n += r.efek[k];
  if (k === "atk" && P && P.raung > 0) n += 0.3;
  return BATAS_BONUS[k] ? Math.min(BATAS_BONUS[k], n) : n;
}
// kebal debuff jenis j? (jimat dengan `kebal`, atau Ramuan Penangkal)
function kebalDebuff(j) {
  if (!S || !S.jimat) return false;
  if (ramuanAktif("penangkal")) return true;
  return S.jimat.pakai.some((id) => JIMAT[id] && (JIMAT[id].efek.kebal || []).includes(j));
}
// daftar efek "seranganmu memberi debuff ke musuh"
function dotSerangan() {
  if (!S || !S.jimat) return [];
  return S.jimat.pakai.map((id) => JIMAT[id] && JIMAT[id].efek.dot && { ...JIMAT[id].efek.dot, peluang: JIMAT[id].efek.dot.peluang * kaliBintang(id) }).filter(Boolean);
}

// ---------- Mendapat jimat ----------
function beriJimat(id) {
  const J = JIMAT[id]; if (!J) return;
  const r = ["biasa", "langka", "legenda"].indexOf(J.rarity);
  if (bintangJimat(id) > 0) {
    const n = ATURAN.jimat.serpihGanda[r];
    S.jimat.serpih += n;
    notifItem(t("jimat.lebur", { nama: namaJimat(id), n }));
  } else {
    S.jimat.punya[id] = 1;
    if (S.jimat.pakai.length < slotJimat()) S.jimat.pakai.push(id);
    toast(t("jimat.dapat", { rarity: t("rarity." + J.rarity), nama: namaJimat(id) }), true);
  }
  sfx.item(); saveSoon();
}
function beriSerpih(n) { S.jimat.serpih += n; notifItem(t("jimat.serpih", { n })); }

// ---------- Teks efek ----------
function teksEfek(id) {
  const J = JIMAT[id], k = kaliBintang(id), out = [];
  for (const [e, v] of Object.entries(J.efek)) {
    if (e === "kebal") out.push(t("efek.kebal", { daftar: v.map((j) => t("debuff." + j)).join(", ") }));
    else if (e === "dot") out.push(t("efek.dot", { n: Math.round(v.peluang * k * 100), jenis: t("debuff." + v.jenis) }));
    else if (e === "jejakApi" || e === "bangkit") out.push(t("efek." + e));
    else if (e === "tangkis") out.push(t("efek.tangkis", { n: (v * k).toFixed(2) }));
    else out.push(t("efek." + e, { n: Math.round(v * k * 100) }));
  }
  return out.join(" · ");
}

// ---------- Tempa ----------
const idxRarity = (id) => ["biasa", "langka", "legenda"].indexOf(JIMAT[id].rarity);
const biayaTempa = (id) => ({ koin: ATURAN.jimat.tempaKoin[idxRarity(id)] * bintangJimat(id), serpih: ATURAN.jimat.tempaSerpih[idxRarity(id)] * bintangJimat(id) });
function tempa(id) {
  const b = biayaTempa(id);
  if (bintangJimat(id) >= ATURAN.jimat.bintangMaks || S.gold < b.koin || S.jimat.serpih < b.serpih) return;
  S.gold -= b.koin; S.jimat.serpih -= b.serpih; S.jimat.punya[id]++;
  sfx.level(); toast(t("jimat.ditempa", { nama: namaJimat(id), n: bintangJimat(id) }), false);
}

// ---------- Ramuan ----------
const hargaRamuan = (id) => RAMUAN[id].dasar + RAMUAN[id].perLevel * S.lv;
const namaRamuan = (id) => (bahasa === "en" && RAMUAN[id].en ? RAMUAN[id].en.name : RAMUAN[id].name);
const descRamuan = (id) => (bahasa === "en" && RAMUAN[id].en ? RAMUAN[id].en.desc : RAMUAN[id].desc);
function tokoRamuan(npc) {
  openDialog(npc.name, t("ramuan.tawar", { koin: S.gold }), [
    ...Object.keys(RAMUAN).map((id) => ({ label: `${namaRamuan(id)} · ${hargaRamuan(id)} ${t("ramuan.koin")}${ramuanAktif(id) ? " ✓" : ""}`, disabled: S.gold < hargaRamuan(id),
      run: () => { S.gold -= hargaRamuan(id); S.ramuan[id] = Date.now() + RAMUAN[id].lama * 1000; sfx.drink(); toast(`${namaRamuan(id)}: ${descRamuan(id)}`, false); if (id === "penangkal" && adaDebuff()) P.debuff = {}; saveSoon(); tokoRamuan(npc); } })),
    { label: t("dlg.kembali"), run: () => talk(npc, true) },
  ]);
}
// ikon ramuan aktif di samping bar nyawa (koordinat layar)
function drawIkonRamuan(px, py) {
  if (!S || !S.ramuan) return;
  const aktif = Object.keys(RAMUAN).filter(ramuanAktif);
  let x = px + 60;
  for (const id of aktif) {
    const sisa = (S.ramuan[id] - Date.now()) / 1000 / RAMUAN[id].lama;
    ctx.fillStyle = "rgba(10,6,20,0.8)"; ctx.beginPath(); ctx.arc(x, py - 11, 6.5, 0, 6.28); ctx.fill();
    ctx.fillStyle = RAMUAN[id].warna; ctx.beginPath(); ctx.moveTo(x, py - 11); ctx.arc(x, py - 11, 5, -Math.PI / 2, -Math.PI / 2 + 6.28 * sisa); ctx.closePath(); ctx.fill();
    x += 15;
  }
}

// ---------- Halaman jimat ----------
let jimatDariToko = false, jimatTab = "koleksi";
function bukaJimatToko() { closeDialog(); mode = "play"; togglePause(); jimatDariToko = true; jimatTab = "toko"; showPauseView("jimat"); }
function bintangHtml(id) { return `<span class="bintang">${"★".repeat(bintangJimat(id))}${"☆".repeat(ATURAN.jimat.bintangMaks - bintangJimat(id))}</span>`; }
function kartuJimat(id, aksi) {
  const J = JIMAT[id];
  return `<div class="jm-card" style="--rc:${WARNA_RARITY[J.rarity]}">
    <div class="jm-head"><b>${namaJimat(id)}</b><span class="jm-rar">${t("rarity." + J.rarity)}</span></div>
    ${bintangJimat(id) ? bintangHtml(id) : ""}
    <p>${teksEfek(id)}</p>
    ${J.bos ? `<small>${t("jimat.dariBos", { nama: MONSTERS[J.bos].name })}</small>` : ""}
    <div class="jr-aksi">${aksi}</div></div>`;
}
function isiHalamanJimat() {
  const tokoAda = jimatDariToko;
  if (!tokoAda && jimatTab === "toko") jimatTab = "koleksi";
  const pakai = S.jimat.pakai, punya = Object.keys(S.jimat.punya).filter((id) => JIMAT[id]);
  const slots = Array.from({ length: slotJimat() }, (_, i) => pakai[i]
    ? `<span class="jm-slot" style="--rc:${WARNA_RARITY[JIMAT[pakai[i]].rarity]}">${namaJimat(pakai[i])}</span>`
    : `<span class="jm-slot kosong">${t("jimat.slotKosong")}</span>`).join("");
  let isi = "";
  if (jimatTab === "koleksi") {
    const urut = punya.sort((a, b) => idxRarity(b) - idxRarity(a));
    isi = urut.length ? urut.map((id) => {
      const dipakai = pakai.includes(id), b = biayaTempa(id), maks = bintangJimat(id) >= ATURAN.jimat.bintangMaks;
      const tombol = `<button type="button" data-jm="${dipakai ? "lepas" : "pasang"}" data-id="${id}" ${!dipakai && pakai.length >= slotJimat() ? "disabled" : ""}>${t(dipakai ? "jimat.lepas" : "jimat.pasang")}</button>`
        + (tokoAda ? `<button type="button" data-jm="tempa" data-id="${id}" ${maks || S.gold < b.koin || S.jimat.serpih < b.serpih ? "disabled" : ""}>${maks ? t("jimat.maks") : t("jimat.tempa", { koin: b.koin, serpih: b.serpih })}</button>` : "");
      return kartuJimat(id, tombol);
    }).join("") : `<p class="misi-kosong">${t("jimat.kosong")}</p>`;
  } else {
    isi = Object.keys(JIMAT).filter((id) => JIMAT[id].rarity === "biasa").map((id) => kartuJimat(id, bintangJimat(id)
      ? `<button type="button" disabled>${t("jimat.sudahPunya")}</button>`
      : `<button type="button" data-jm="beli" data-id="${id}" ${S.gold < JIMAT[id].harga ? "disabled" : ""}>${t("jimat.beli", { harga: JIMAT[id].harga })}</button>`)).join("");
  }
  $("jimatIsi").innerHTML = `
    <div class="jr-top"><span><i class="coin"></i> ${S.gold} · ${t("jimat.serpihLabel")}: <b>${S.jimat.serpih}</b></span></div>
    <div class="jm-slots">${slots}</div>
    <div class="tabs" role="tablist">
      <button type="button" role="tab" data-jmtab="koleksi" aria-selected="${jimatTab === "koleksi"}">${t("jimat.koleksi")}</button>
      ${tokoAda ? `<button type="button" role="tab" data-jmtab="toko" aria-selected="${jimatTab === "toko"}">${t("jimat.toko")}</button>` : ""}
    </div>
    ${!tokoAda ? `<p class="jm-info">${t("jimat.infoTempa")}</p>` : ""}
    <div class="jr-grid">${isi}</div>`;
}
$("jimatIsi").addEventListener("click", (e) => {
  const tab = e.target.closest("[data-jmtab]");
  if (tab) { jimatTab = tab.dataset.jmtab; sfx.click(); return isiHalamanJimat(); }
  const b = e.target.closest("[data-jm]");
  if (!b || b.disabled) return;
  const id = b.dataset.id, pakai = S.jimat.pakai;
  if (b.dataset.jm === "pasang" && pakai.length < slotJimat()) { pakai.push(id); sfx.click(); }
  if (b.dataset.jm === "lepas") { S.jimat.pakai = pakai.filter((x) => x !== id); sfx.click(); }
  if (b.dataset.jm === "tempa") tempa(id);
  if (b.dataset.jm === "beli" && S.gold >= JIMAT[id].harga && !bintangJimat(id)) { S.gold -= JIMAT[id].harga; sfx.coin(); beriJimat(id); }
  P.hp = Math.min(P.hp, maxHp());
  saveSoon(); refreshHud(true); isiHalamanJimat();
});
// tombol kembali di halaman jimat: dari toko → langsung main lagi
$("btnJimatBack").addEventListener("click", () => {
  // halaman jimat dibuka dari toko atau tombol 💎 di HUD → kembali langsung ke permainan
  jimatDariToko = false; togglePause(); showUI();
});
