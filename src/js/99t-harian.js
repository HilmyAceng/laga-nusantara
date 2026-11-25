// =====================================================================
// HARIAN: ABSEN + TANTANGAN HARIAN & MINGGUAN (tab "Harian" di popup Kotak)
//  - Absen harian: kalender 7 hari, hadiah kecil, hari ke-7 sedikit lebih besar.
//    TANPA hukuman: bolong sehari tidak mengulang dari nol, hitungan lanjut.
//    Siklus pertama hari ke-7 → ikat «Ungu Setia» + gelar «Rajin Berlatih»; absen ke-30 → gelar «Pendekar Setia».
//  - Tantangan harian: 3 tugas acak dari ±18 jenis (ganti tiap tengah malam).
//  - Tantangan mingguan: 3 tugas lebih berat (ganti tiap Senin). Semua selesai → kosmetik (sekali) / serpih.
//  Hadiah sengaja kecil; tugasnya yang banyak & bervariasi.
//  Waktu memakai jam perangkat (tanpa server).
// Progres tugas = penghitung kumulatif sekarang − nilai saat tugas dibuat (base).
// Simpanan: S.harian = { hari, tugas:[{id,base,klaim}], bonus, minggu, tugasM:[...], bonusM, absen:{terakhir,jumlah}, mingguSelesai }
// =====================================================================
"use strict";

// ---------- Penghitung tambahan ----------
{
  const asli = killMonster;
  killMonster = function (m) { const hidup = !m.dead; asli(m); if (hidup && m.d.boss && (m.dead || m.ulang)) tambahStat("bos"); };
}
{
  const asli = akhirPartai;
  akhirPartai = function (hasil, alasan) { if (catur && !catur.selesai) { tambahStat("caturMain"); if (hasil === "menang") tambahStat("caturMenang"); } return asli(hasil, alasan); };
}
let emasLalu = null, detikMain = 0;
UPDATE_TAMBAHAN.push((dt) => {
  if (!S) return;
  if (emasLalu != null && S.gold > emasLalu) tambahStat("koinDapat", S.gold - emasLalu);
  emasLalu = S.gold;
  if (mode === "play") { detikMain += dt; if (detikMain >= 60) { detikMain -= 60; tambahStat("menitMain"); } }
});
// area berbeda yang dikunjungi hari ini (pakai tanggal hari ini langsung, supaya aman walau tugas harian belum disiapkan)
SAAT_MASUK_AREA.push((id) => {
  if (!S) return;
  const H = dataHarian(), hari = kunciHari();
  if (!H.area || H.area.hari !== hari || !H.area.ids) H.area = { hari, ids: {} };
  if (!H.area.ids[id]) { H.area.ids[id] = 1; tambahStat("areaBaruHarian"); }
});

const st = (k) => () => (S.statistik && S.statistik[k]) || 0;
const jumlahPetiTerbuka = () => Object.keys((S.harta && S.harta.buka) || {}).length;
const masihAdaPeti = () => { try { return Object.keys(AREAS).some((id) => hitungHarta(id)[0] < hitungHarta(id)[1]); } catch (e) { return false; } };
// syarat: tugas hanya muncul kalau fiturnya sudah terbuka
const TUGAS = {
  // harian
  kalah30: { n: 30, nilai: () => S.kills, teks: ["Kalahkan {n} musuh", "Defeat {n} enemies"], koin: 40 },
  kalah60: { n: 60, nilai: () => S.kills, teks: ["Kalahkan {n} musuh", "Defeat {n} enemies"], koin: 60 },
  sempurna5: { n: 5, nilai: st("sempurna"), teks: ["Lakukan {n} Hindar Sempurna", "Do {n} Perfect Dodges"], koin: 50 },
  tangkis5: { n: 5, nilai: st("tangkis"), teks: ["Tangkis {n} serangan", "Parry {n} attacks"], koin: 50 },
  pamungkas2: { n: 2, nilai: st("pamungkas"), teks: ["Keluarkan jurus pamungkas {n} kali", "Use your ultimate {n} times"], koin: 50 },
  kritis15: { n: 15, nilai: st("kritis"), teks: ["Daratkan {n} pukulan kritis", "Land {n} critical hits"], koin: 40 },
  koin300: { n: 300, nilai: st("koinDapat"), teks: ["Kumpulkan {n} koin", "Collect {n} coins"], koin: 50 },
  jamu2: { n: 2, nilai: st("jamu"), teks: ["Minum {n} jamu", "Drink {n} jamu"], koin: 30 },
  bos1: { n: 1, nilai: st("bos"), teks: ["Kalahkan {n} bos (termasuk Cermin Gaib)", "Defeat {n} boss (Mirror counts)"], koin: 80, syarat: () => capaiTercapai("bos1") },
  main15: { n: 15, nilai: st("menitMain"), teks: ["Bertualang selama {n} menit", "Adventure for {n} minutes"], koin: 40 },
  area3: { n: 3, nilai: st("areaBaruHarian"), teks: ["Kunjungi {n} area berbeda", "Visit {n} different areas"], koin: 40 },
  ikan3: { n: 3, nilai: st("ikan"), teks: ["Tangkap {n} ikan", "Catch {n} fish"], koin: 50, syarat: () => eventTerbuka("mancing") },
  catur1: { n: 1, nilai: st("caturMain"), teks: ["Main {n} partai Catur Laga", "Play {n} Battle Chess match"], koin: 50, syarat: () => eventTerbuka("catur") },
  peti1: { n: 1, nilai: jumlahPetiTerbuka, teks: ["Buka {n} peti harta", "Open {n} treasure chest"], koin: 50, syarat: masihAdaPeti },
  bagikan1: { n: 1, nilai: st("bagikan"), teks: ["Bagikan {n} momen ke temanmu", "Share {n} moment with friends"], koin: 30 },
  gelombang5: { n: 5, nilai: st("gelombang"), teks: ["Tuntaskan {n} gelombang Mode Bertahan", "Clear {n} Survival waves"], koin: 60, syarat: () => typeof bertahanTerbuka === "function" && bertahanTerbuka() },
  // mingguan
  mKalah400: { n: 400, nilai: () => S.kills, teks: ["Kalahkan {n} musuh", "Defeat {n} enemies"], koin: 250, serpih: 2, mingguan: true },
  mSempurna40: { n: 40, nilai: st("sempurna"), teks: ["Lakukan {n} Hindar Sempurna", "Do {n} Perfect Dodges"], koin: 250, serpih: 2, mingguan: true },
  mBos5: { n: 5, nilai: st("bos"), teks: ["Kalahkan {n} bos", "Defeat {n} bosses"], koin: 300, serpih: 2, mingguan: true, syarat: () => capaiTercapai("bos1") },
  mKoin3000: { n: 3000, nilai: st("koinDapat"), teks: ["Kumpulkan {n} koin", "Collect {n} coins"], koin: 250, serpih: 2, mingguan: true },
  mIkan20: { n: 20, nilai: st("ikan"), teks: ["Tangkap {n} ikan", "Catch {n} fish"], koin: 250, serpih: 2, mingguan: true, syarat: () => eventTerbuka("mancing") },
  mCatur2: { n: 2, nilai: st("caturMenang"), teks: ["Menangkan {n} partai Catur Laga", "Win {n} Battle Chess matches"], koin: 300, serpih: 2, mingguan: true, syarat: () => eventTerbuka("catur") },
  mMain120: { n: 120, nilai: st("menitMain"), teks: ["Bertualang selama {n} menit", "Adventure for {n} minutes"], koin: 250, serpih: 2, mingguan: true },
  mHarian12: { n: 12, nilai: st("tugasHarian"), teks: ["Selesaikan {n} tantangan harian", "Complete {n} daily challenges"], koin: 300, serpih: 3, mingguan: true },
  mGelombang8: { n: 8, nilai: st("gelombangTertinggi"), mutlak: true, teks: ["Capai gelombang {n} di Mode Bertahan", "Reach wave {n} in Survival"], koin: 300, serpih: 3, mingguan: true, syarat: () => typeof bertahanTerbuka === "function" && bertahanTerbuka() },
};
const ABSEN = [{ koin: 30 }, { jamu: 1 }, { koin: 60 }, { serpih: 1 }, { koin: 80 }, { jamu: 2 }, { serpih: 2, koin: 100 }];

// ---------- Kalender ----------
const duaDigit = (n) => String(n).padStart(2, "0");
const kunciHari = (d = new Date()) => `${d.getFullYear()}-${duaDigit(d.getMonth() + 1)}-${duaDigit(d.getDate())}`;
function kunciMinggu(d = new Date()) {
  const s = new Date(d.getFullYear(), d.getMonth(), d.getDate()); s.setDate(s.getDate() - ((s.getDay() + 6) % 7));   // Senin
  return "M" + kunciHari(s);
}
function acakDari(kunci, daftar, n) {
  let h = 2166136261; for (const ch of kunci) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
  const a = [...daftar], hasil = [];
  while (a.length && hasil.length < n) { h = Math.imul(h ^ (h >>> 13), 0x5bd1e995) >>> 0; hasil.push(a.splice(h % a.length, 1)[0]); }
  return hasil;
}
const dataHarian = () => (S.harian = S.harian || { absen: { terakhir: "", jumlah: 0 }, mingguSelesai: 0 });
function segarkanHarian() {
  const H = dataHarian(), hari = kunciHari(), minggu = kunciMinggu();
  if (H.hari !== hari) {
    const pool = Object.keys(TUGAS).filter((id) => !TUGAS[id].mingguan && (!TUGAS[id].syarat || TUGAS[id].syarat()));
    // jangan dua tugas "kalahkan musuh" sekaligus
    let pilih = acakDari(hari, pool, 4).filter((id, i, a) => !(id.startsWith("kalah") && a.slice(0, i).some((x) => x.startsWith("kalah")))).slice(0, 3);
    H.hari = hari; H.bonus = false; H.tugas = pilih.map((id) => ({ id, base: TUGAS[id].nilai(), klaim: false }));
  }
  if (H.minggu !== minggu) {
    const pool = Object.keys(TUGAS).filter((id) => TUGAS[id].mingguan && (!TUGAS[id].syarat || TUGAS[id].syarat()));
    H.minggu = minggu; H.bonusM = false; H.tugasM = acakDari(minggu, pool, 3).map((id) => ({ id, base: TUGAS[id].mutlak ? 0 : TUGAS[id].nilai(), klaim: false }));
  }
}
const progresTugas = (x) => { const T0 = TUGAS[x.id]; return Math.min(T0.n, Math.max(0, T0.nilai() - x.base)); };
const tugasSelesai = (x) => progresTugas(x) >= TUGAS[x.id].n;
const bisaAbsen = () => S && dataHarian().absen.terakhir !== kunciHari();
const adaKlaimHarian = () => {
  if (!S) return false; segarkanHarian(); const H = dataHarian();
  return bisaAbsen() || [...H.tugas, ...H.tugasM].some((x) => !x.klaim && tugasSelesai(x))
    || (!H.bonus && H.tugas.every((x) => x.klaim)) || (!H.bonusM && H.tugasM.length && H.tugasM.every((x) => x.klaim));
};

// ---------- Klaim ----------
function klaimAbsen() {
  if (!bisaAbsen()) return;
  const A = dataHarian().absen, hariKe = A.jumlah % 7, h = { ...ABSEN[hariKe] };
  A.terakhir = kunciHari(); A.jumlah++;
  if (hariKe === 6 && !punyaKosmetik("unguAbsen")) { h.kosmetik = ["unguAbsen"]; h.gelar = ["rajin"]; }
  if (A.jumlah === 30) h.gelar = [...(h.gelar || []), "setia"];
  beriHadiahPesan(h); sfx.coin(); notifItem(teksHadiahPesan(h)); saveSoon();
}
function klaimTugas(x) {
  if (!x || x.klaim || !tugasSelesai(x)) return;
  const T0 = TUGAS[x.id], h = { koin: T0.koin, serpih: T0.serpih || 0 };
  x.klaim = true; beriHadiahPesan(h); if (!T0.mingguan) tambahStat("tugasHarian");
  sfx.coin(); notifItem(teksHadiahPesan(h)); saveSoon();
}
function klaimBonus(mingguan) {
  const H = dataHarian();
  if (mingguan) {
    if (H.bonusM || !H.tugasM.every((x) => x.klaim)) return;
    H.bonusM = true; H.mingguSelesai = (H.mingguSelesai || 0) + 1;
    const kos = !punyaKosmetik("unguSenja") ? "unguSenja" : !punyaKosmetik("kabut") ? "kabut" : null;
    kirimPesan({ id: "mingguan-" + H.minggu, dari: ["Ki Lurah", "Ki Lurah"], judul: ["Tantangan mingguan tuntas!", "Weekly challenges complete!"],
      isi: ["Luar biasa! Seluruh tantangan minggu ini kau selesaikan. Terimalah hadiah kecil dari desa.", "Splendid! You finished all of this week's challenges. Please accept a small gift from the village."],
      hadiah: kos ? { kosmetik: [kos], koin: 200 } : { serpih: 3, koin: 200 } });
    toast(Lx(["Hadiah mingguan dikirim ke Pesan!", "Weekly reward sent to Mail!"]), true);
  } else {
    if (H.bonus || !H.tugas.every((x) => x.klaim)) return;
    H.bonus = true; const h = { serpih: 1, koin: 30 };
    beriHadiahPesan(h); notifItem(teksHadiahPesan(h));
  }
  sfx.quest ? sfx.quest() : sfx.coin(); saveSoon();
}

// ---------- Tab "Harian" ----------
function sisaWaktu(akhir) {
  const ms = Math.max(0, akhir - Date.now()), j = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000);
  return j >= 24 ? Lx([`${Math.floor(j / 24)} hari ${j % 24} jam`, `${Math.floor(j / 24)}d ${j % 24}h`]) : Lx([`${j} jam ${m} menit`, `${j}h ${m}m`]);
}
function barisTugas(x, i, mingguan) {
  const T0 = TUGAS[x.id], p = progresTugas(x), ok = p >= T0.n;
  const h = teksHadiahPesan({ koin: T0.koin, serpih: T0.serpih });
  return `<div class="hr-tugas${x.klaim ? " klaim" : ok ? " siap" : ""}">
    <div><b>${Lx(T0.teks).replace("{n}", T0.n.toLocaleString())}</b>
    <span class="cp-prog"><i style="width:${Math.round((p / T0.n) * 100)}%"></i></span><small>${p.toLocaleString()} / ${T0.n.toLocaleString()} · ${h}</small></div>
    ${x.klaim ? `<em>✓</em>` : `<button type="button" class="go kecil ${ok ? "" : "alt"}" data-klaim-tugas="${mingguan ? "m" : "h"}${i}" ${ok ? "" : "disabled"}>${Lx(["Klaim", "Claim"])}</button>`}
  </div>`;
}
function isiTabHarian(el) {
  segarkanHarian();
  const H = dataHarian(), A = H.absen, hariKe = A.jumlah % 7, sudah = !bisaAbsen();
  const besok = new Date(); besok.setHours(24, 0, 0, 0);
  const senin = new Date(); senin.setHours(0, 0, 0, 0); senin.setDate(senin.getDate() + (((8 - senin.getDay()) % 7) || 7));
  const kotakAbsen = ABSEN.map((h, i) => {
    const ambilSiklus = sudah ? (hariKe === 0 ? 7 : hariKe) : hariKe;   // kotak yang sudah diambil di siklus ini
    const diambil = i < ambilSiklus, kini = !sudah && i === hariKe;
    const isi = h.serpih ? `💎${h.serpih}` : h.jamu ? `🧪${h.jamu}` : `🪙${h.koin}`;
    return `<div class="hr-hari${diambil ? " ambil" : ""}${kini ? " kini" : ""}${i === 6 ? " besar" : ""}"><small>${Lx(["Hari", "Day"])} ${i + 1}</small><b>${isi}</b>${diambil ? "<em>✓</em>" : ""}</div>`;
  }).join("");
  el.innerHTML = `
    <h3 class="hr-judul">${Lx(["Absen harian", "Daily check-in"])} <small>${Lx([`Total: ${A.jumlah} hari`, `Total: ${A.jumlah}`])}</small></h3>
    <div class="hr-absen">${kotakAbsen}</div>
    ${sudah ? `<p class="hr-ket">${Lx(["Sudah absen hari ini. Kembali besok!", "Checked in today. Come back tomorrow!"])}</p>` : `<button type="button" class="go" data-absen="1">${Lx(["Absen & ambil hadiah", "Check in & claim"])}</button>`}
    <p class="hr-ket kecil">${Lx(["Bolong sehari? Tidak apa-apa, hitungan tetap lanjut. Hari ke-7 pertama: ikat «Ungu Setia» + gelar.", "Missed a day? No problem, your count continues. First Day 7: «Loyal Violet» band + a title."])}</p>
    <h3 class="hr-judul">${Lx(["Tantangan harian", "Daily challenges"])} <small>${Lx(["ganti dalam", "resets in"])} ${sisaWaktu(besok)}</small></h3>
    ${H.tugas.map((x, i) => barisTugas(x, i, false)).join("")}
    ${H.tugas.every((x) => x.klaim) ? (H.bonus ? `<p class="hr-ket">✓ ${Lx(["Bonus harian diambil.", "Daily bonus claimed."])}</p>` : `<button type="button" class="go kecil" data-bonus="h">${Lx(["Ambil bonus: 💎1 · 🪙30", "Claim bonus: 💎1 · 🪙30"])}</button>`) : `<p class="hr-ket kecil">${Lx(["Selesaikan ketiganya untuk bonus 💎1.", "Finish all three for a 💎1 bonus."])}</p>`}
    <h3 class="hr-judul">${Lx(["Tantangan mingguan", "Weekly challenges"])} <small>${Lx(["ganti dalam", "resets in"])} ${sisaWaktu(senin)}</small></h3>
    ${H.tugasM.map((x, i) => barisTugas(x, i, true)).join("")}
    ${H.tugasM.length && H.tugasM.every((x) => x.klaim) ? (H.bonusM ? `<p class="hr-ket">✓ ${Lx(["Hadiah mingguan dikirim ke Pesan.", "Weekly reward sent to Mail."])}</p>` : `<button type="button" class="go kecil" data-bonus="m">${Lx(["Ambil hadiah mingguan", "Claim weekly reward"])}</button>`) : `<p class="hr-ket kecil">${Lx(["Tuntaskan ketiganya: hadiah kosmetik (atau 💎3) lewat Pesan.", "Finish all three: a cosmetic reward (or 💎3) via Mail."])}</p>`}`;
}
daftarkanTabKotak({
  id: "harian", ikon: "📅", nama: ["Harian", "Daily"],
  sub: () => { segarkanHarian(); const H = dataHarian(); return Lx([`${H.tugas.filter(tugasSelesai).length}/3 harian · ${H.tugasM.filter(tugasSelesai).length}/3 mingguan`, `${H.tugas.filter(tugasSelesai).length}/3 daily · ${H.tugasM.filter(tugasSelesai).length}/3 weekly`]); },
  lencana: adaKlaimHarian, isi: isiTabHarian,
  kaki: () => `<span>${Lx(["Waktu mengikuti jam di perangkatmu.", "Timers follow your device clock."])}</span>`,
});
popKotak.el.addEventListener("click", (e) => {
  if (e.target.closest("[data-absen]")) { klaimAbsen(); return isiKotak(); }
  const t0 = e.target.closest("[data-klaim-tugas]");
  if (t0) { const k = t0.dataset.klaimTugas, H = dataHarian(); klaimTugas((k[0] === "m" ? H.tugasM : H.tugas)[+k.slice(1)]); return isiKotak(); }
  const b = e.target.closest("[data-bonus]");
  if (b) { klaimBonus(b.dataset.bonus === "m"); return isiKotak(); }
});
// lencana di ikon HUD
let cekHarianT = 0;
UPDATE_TAMBAHAN.push((dt) => { cekHarianT -= dt; if (cekHarianT > 0 || !S || mode === "select") return; cekHarianT = 3; hudKotak(); });
// hari baru saat game dibuka → ingatkan sekali
let ingatAbsen = false;
UPDATE_TAMBAHAN.push(() => {
  if (ingatAbsen || !S || mode !== "play" || !S.prologSelesai) return;
  ingatAbsen = true;
  if (bisaAbsen()) setTimeout(() => toast(Lx(["📅 Absen harian tersedia! Buka ikon Kotak.", "📅 Daily check-in ready! Open the Mailbox icon."]), false), 2500);
});
