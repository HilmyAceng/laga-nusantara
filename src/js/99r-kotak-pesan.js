// =====================================================================
// KOTAK (pesan & hadiah)
// Ikon kotak surat di HUD (kiri tombol Info) → popup dengan beberapa tab di kiri:
//  - "Pesan": surat dari pengembang/warga berisi hadiah yang bisa diklaim
//    (koin, serpih, jamu, kosmetik, gelar). Kaki popup: kolom Kode Hadiah (99s).
//  - Tab lain didaftarkan fitur lain lewat daftarkanTabKotak({...}) (mis. Harian, 99t).
// Fitur lain mengirim surat dengan kirimPesan({ id, dari, judul, isi, hadiah }).
// Simpanan: S.pesan = [{ id, t, dari, judul, isi, hadiah, baca, klaim }]
// =====================================================================
"use strict";

const TAB_KOTAK = [];
function daftarkanTabKotak(tab) { if (!TAB_KOTAK.some((x) => x.id === tab.id)) TAB_KOTAK.push(tab); }
const dataPesan = () => (S.pesan = S.pesan || []);
function kirimPesan(p) {
  if (!S || dataPesan().some((x) => x.id === p.id)) return false;
  dataPesan().unshift({ t: Date.now(), baca: false, klaim: false, ...p });
  if (dataPesan().length > 60) S.pesan = S.pesan.filter((x, i) => i < 60 || !x.klaim);
  saveSoon(); hudKotak();
  return true;
}
const pesanBelumKlaim = () => dataPesan().filter((p) => p.hadiah && !p.klaim).length;
const pesanBelumBaca = () => dataPesan().filter((p) => !p.baca).length;

function teksHadiahPesan(h) {
  if (!h) return "";
  const b = [];
  if (h.koin) b.push(`🪙 ${h.koin} ${Lx(["koin", "coins"])}`);
  if (h.serpih) b.push(`💎 ${h.serpih} ${Lx(["Serpih Pusaka", "Heirloom Shards"])}`);
  if (h.jamu) b.push(`🧪 ${h.jamu} ${Lx(["jamu", "jamu"])}`);
  for (const id of h.kosmetik || []) if (KOSMETIK[id]) b.push(`👕 ${Lx(KOSMETIK[id].nama)}`);
  for (const id of h.gelar || []) if (GELAR[id]) b.push(`🎖 ${Lx(["Gelar", "Title"])} «${Lx(GELAR[id].nama)}»`);
  return b.join(" · ");
}
function beriHadiahPesan(h) {
  if (!h) return;
  if (h.koin) S.gold += h.koin;
  if (h.serpih) { S.jimat = S.jimat || {}; S.jimat.serpih = (S.jimat.serpih || 0) + h.serpih; }
  if (h.jamu) S.potions += h.jamu;
  for (const id of h.kosmetik || []) beriKosmetik(id);
  for (const id of h.gelar || []) beriGelar(id);
  refreshHud(true);
}
function klaimPesan(p) {
  if (!p || p.klaim || !p.hadiah) return;
  p.klaim = true; beriHadiahPesan(p.hadiah);
  sfx.coin(); notifItem && notifItem(teksHadiahPesan(p.hadiah));
  saveSoon(); hudKotak();
}

// ---------- Popup ----------
const popKotak = buatPopup("kotak", "kotak");
let tabKotak = "pesan", pesanPilih = null;
const hudBtnKotak = tombolHud("btnKotakHud",
  `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2.2" fill="#f4b942" stroke="#8a5a12" stroke-width="1.4"/><path d="M3.8 7.2 12 13.4l8.2-6.2" fill="none" stroke="#8a5a12" stroke-width="1.6" stroke-linejoin="round"/></svg>`, "Kotak");
function hudKotak() {
  if (!S) return;
  const ada = pesanBelumKlaim() > 0 || pesanBelumBaca() > 0 || TAB_KOTAK.some((x) => x.lencana && x.lencana());
  hudBtnKotak.classList.toggle("baru", ada);
}
function bukaKotak(tab) {
  if (tab) tabKotak = tab;
  if (!popKotak.buka()) return;
  isiKotak();
}
function isiKotak() {
  popKotak.judul(["Pesan & Hadiah", "Mail & Rewards"], bahasa === "en" ? ["Re", "wards"] : ["Ko", "tak"]);
  const tabs = [{ id: "pesan", ikon: "📬", nama: ["Pesan", "Mail"], sub: () => Lx([`${pesanBelumKlaim()} hadiah belum diklaim`, `${pesanBelumKlaim()} unclaimed`]), lencana: () => pesanBelumKlaim() > 0 || pesanBelumBaca() > 0 }, ...TAB_KOTAK];
  popKotak.daftar.innerHTML = tabs.map((x) => `<button type="button" class="ev-item ${x.id === tabKotak ? "pilih" : ""}" data-tab-kotak="${x.id}">
    <b>${x.ikon} ${Lx(x.nama)}</b><small>${x.sub ? x.sub() : ""}</small>${x.lencana && x.lencana() ? `<i class="ev-baru">!</i>` : ""}</button>`).join("");
  const tab = TAB_KOTAK.find((x) => x.id === tabKotak);
  if (tab) { tab.isi(popKotak.detail); popKotak.kaki.innerHTML = tab.kaki ? tab.kaki() : ""; }
  else { isiTabPesan(popKotak.detail); popKotak.kaki.innerHTML = typeof kakiKodeHadiah === "function" ? kakiKodeHadiah() : ""; }
  hudKotak();
}
function isiTabPesan(el) {
  const daftar = dataPesan();
  if (!daftar.length) { el.innerHTML = `<p class="kt-kosong">${Lx(["Belum ada pesan.", "No mail yet."])}</p>`; return; }
  const tgl = (t) => new Date(t).toLocaleDateString(bahasa === "en" ? "en-GB" : "id-ID", { day: "numeric", month: "short" });
  const adaKlaim = pesanBelumKlaim() > 1;
  el.innerHTML = (adaKlaim ? `<button type="button" class="go kecil kt-semua" data-klaim-semua="1">${Lx(["Klaim semua", "Claim all"])}</button>` : "") +
    daftar.map((p) => `<div class="kt-pesan${p.baca ? "" : " baru"}${p.klaim ? " klaim" : ""}">
      <div class="kt-kepala"><b>${Lx(p.judul)}</b><small>${Lx(p.dari || ["Laga Nusantara", "Laga Nusantara"])} · ${tgl(p.t)}</small></div>
      <p>${Lx(p.isi)}</p>
      ${p.hadiah ? `<div class="kt-hadiah"><span>${teksHadiahPesan(p.hadiah)}</span>${p.klaim ? `<em>✓ ${Lx(["Diklaim", "Claimed"])}</em>` : `<button type="button" class="go kecil" data-klaim="${p.id}">${Lx(["Klaim", "Claim"])}</button>`}</div>` : ""}
    </div>`).join("");
  // dibuka = dibaca
  let ubah = false; for (const p of daftar) if (!p.baca) { p.baca = true; ubah = true; }
  if (ubah) saveSoon();
}
hudBtnKotak.addEventListener("click", () => bukaKotak());
popKotak.el.addEventListener("click", (e) => {
  const tb = e.target.closest("[data-tab-kotak]");
  if (tb) { tabKotak = tb.dataset.tabKotak; sfx.click(); return isiKotak(); }
  const k = e.target.closest("[data-klaim]");
  if (k) { klaimPesan(dataPesan().find((p) => p.id === k.dataset.klaim)); return isiKotak(); }
  if (e.target.closest("[data-klaim-semua]")) {
    const semua = dataPesan().filter((p) => p.hadiah && !p.klaim), gabung = { koin: 0, serpih: 0, jamu: 0, kosmetik: [], gelar: [] };
    for (const p of semua) { p.klaim = true; beriHadiahPesan(p.hadiah); for (const k of ["koin", "serpih", "jamu"]) gabung[k] += p.hadiah[k] || 0; gabung.kosmetik.push(...(p.hadiah.kosmetik || [])); gabung.gelar.push(...(p.hadiah.gelar || [])); }
    sfx.coin(); notifItem && notifItem(teksHadiahPesan(gabung)); saveSoon(); return isiKotak();
  }
});

// ---------- Surat otomatis ----------
let cekPesanT = 0;
UPDATE_TAMBAHAN.push((dt) => {
  cekPesanT -= dt; if (cekPesanT > 0 || !S || mode === "select") return; cekPesanT = 2;
  kirimPesan({
    id: "selamatDatang", dari: ["Pengembang", "Developer"],
    judul: ["Selamat datang di Kotak!", "Welcome to your Mailbox!"],
    isi: ["Di sini kamu akan menerima hadiah dari event, tantangan mingguan, dan kejutan lain. Jangan lupa cek tab Harian setiap hari ya!", "Here you'll receive rewards from events, weekly challenges, and other surprises. Don't forget to check the Daily tab every day!"],
    hadiah: { koin: 100, jamu: 1 },
  });
  kirimPesan({
    id: "terimaKasih-" + ATURAN.versi, dari: ["Pengembang", "Developer"],
    judul: [`Terima kasih sudah main v${ATURAN.versi}!`, `Thanks for playing v${ATURAN.versi}!`],
    isi: ["Ada banyak fitur baru di versi ini. Lihat ikon Info (i) untuk daftarnya. Masukanmu sangat berarti, kirim lewat Menu › Kirim Masukan.", "This version brings lots of new features. Check the Info (i) icon for the list. Your feedback means a lot, send it via Menu › Send Feedback."],
    hadiah: { koin: 150 },
  });
  hudKotak();
});
