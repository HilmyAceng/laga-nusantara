// =====================================================================
// PENCAPAIAN (Menu › Gameplay › Pencapaian)
// Daftar target yang bisa diraih pemain: petualangan, pertarungan, koleksi, catur, rahasia.
//  - Dicek tiap 1 detik saat bermain + saat kejadian tertentu (hindar sempurna, jamu, pingsan, dll.)
//  - Tercapai → notifikasi 🏆 + hadiah koin/serpih langsung masuk.
//  - Dicatat lengkap di S.capai = { id: waktu } supaya nanti hadiah kosmetik & gelar bisa
//    dikirim (lewat pesan) ke pemain yang SUDAH meraihnya.
//  - Statistik pendukung di S.statistik (hindar sempurna, tangkis, jamu, pamungkas, pingsan, ...).
//  - Simpanan lama: pencapaian yang sudah terpenuhi langsung dibuka sekaligus (satu notifikasi).
// Fitur lain menambah pencapaian sendiri lewat daftarkanCapai({...}) (mis. harta karun, memancing).
// =====================================================================
"use strict";

const stat = (k) => (S && S.statistik && S.statistik[k]) || 0;
function tambahStat(k, n = 1) { if (!S) return; S.statistik = S.statistik || {}; S.statistik[k] = (S.statistik[k] || 0) + n; cekCapaiSegera = true; }
const nomorBab = (l) => { const m = l && /(\d+)/.exec(l.bab || ""); return m ? +m[1] : 0; };   // angka pertama: "Bab 11 · …" / "Chapter 11 · …"
const babSelesai = (n) => !!S && (S.cerita.idx >= CERITA.length || nomorBab(CERITA[S.cerita.idx]) > n);
const daftarBos = () => Object.keys(MONSTERS).filter((k) => MONSTERS[k].boss && !MONSTERS[k].latihan);
const jumlahBos = () => daftarBos().filter((k) => S.bos && S.bos[k]).length;
const jumlahJimat = () => Object.keys(S.jimat.punya).filter((id) => JIMAT[id]).length;
const kalahJenis = (k) => (S.bestiari && S.bestiari[k] && S.bestiari[k].kalah) || 0;
const musuhBiasa = () => daftarMusuh().filter((k) => !MONSTERS[k].boss);
const sampinganSelesai = () => Object.values(S.side || {}).filter((s) => s.status === "selesai").length;
const caturMenang = (tg) => { try { return !!dataCatur().menang[tg]; } catch (e) { return false; } };
const HDH = (koin, serpih = 0) => ({ koin, serpih });   // hadiah pencapaian

// kategori: jalan (petualangan), tarung, koleksi, catur, rahasia
// progres() → [sekarang, target] untuk bar kemajuan (opsional)
const CAPAI = [
  // ---- Petualangan ----
  { id: "bab1", kat: "jalan", judul: ["Kabut Pertama", "First Mist"], desc: ["Tamatkan Bab 1.", "Finish Chapter 1."], hadiah: HDH(100), syarat: () => babSelesai(1) },
  { id: "bab3", kat: "jalan", judul: ["Menyeberang Lautan", "Across the Sea"], desc: ["Tamatkan Bab 3.", "Finish Chapter 3."], hadiah: HDH(200, 2), syarat: () => babSelesai(3) },
  { id: "bab5", kat: "jalan", judul: ["Di Atas Awan", "Above the Clouds"], desc: ["Tamatkan Bab 5.", "Finish Chapter 5."], hadiah: HDH(300, 3), syarat: () => babSelesai(5) },
  { id: "tamat", kat: "jalan", judul: ["Penyelamat Nusantara", "Savior of Nusantara"], desc: ["Tamatkan seluruh cerita utama.", "Finish the whole main story."], hadiah: HDH(1000, 10), syarat: () => S.cerita.idx >= CERITA.length },
  { id: "jelajah10", kat: "jalan", judul: ["Pengembara", "Wanderer"], desc: ["Kunjungi 10 area.", "Visit 10 areas."], hadiah: HDH(150, 1), progres: () => [Object.keys(S.dikunjungi).length, 10] },
  { id: "jelajahSemua", kat: "jalan", judul: ["Penjelajah Nusantara", "Nusantara Explorer"], desc: ["Kunjungi semua area.", "Visit every area."], hadiah: HDH(500, 5), progres: () => [Object.keys(S.dikunjungi).filter((a) => AREAS[a]).length, Object.keys(AREAS).length] },
  { id: "lv10", kat: "jalan", judul: ["Pendekar Muda", "Young Fighter"], desc: ["Capai level 10.", "Reach level 10."], hadiah: HDH(100), progres: () => [S.lv, 10] },
  { id: "lv30", kat: "jalan", judul: ["Pendekar Tangguh", "Seasoned Fighter"], desc: ["Capai level 30.", "Reach level 30."], hadiah: HDH(300, 3), progres: () => [S.lv, 30] },
  { id: "lv50", kat: "jalan", judul: ["Pendekar Sakti", "Mighty Fighter"], desc: ["Capai level 50.", "Reach level 50."], hadiah: HDH(500, 5), progres: () => [S.lv, 50] },
  { id: "lv80", kat: "jalan", judul: ["Mahaguru", "Grandmaster"], desc: ["Capai level maksimal (80).", "Reach the max level (80)."], hadiah: HDH(1000, 10), progres: () => [S.lv, 80] },
  { id: "misi10", kat: "jalan", judul: ["Si Penolong", "Helping Hand"], desc: ["Selesaikan 10 misi sampingan.", "Complete 10 side quests."], hadiah: HDH(200, 2), progres: () => [sampinganSelesai(), 10] },

  // ---- Pertarungan ----
  { id: "kalah1", kat: "tarung", judul: ["Langkah Pertama", "First Blood"], desc: ["Kalahkan musuh pertamamu.", "Defeat your first enemy."], hadiah: HDH(20), progres: () => [S.kills, 1] },
  { id: "kalah100", kat: "tarung", judul: ["Seratus Laga", "A Hundred Fights"], desc: ["Kalahkan 100 musuh.", "Defeat 100 enemies."], hadiah: HDH(150, 1), progres: () => [S.kills, 100] },
  { id: "kalah1000", kat: "tarung", judul: ["Seribu Laga", "A Thousand Fights"], desc: ["Kalahkan 1.000 musuh.", "Defeat 1,000 enemies."], hadiah: HDH(600, 6), progres: () => [S.kills, 1000] },
  { id: "kera100", kat: "tarung", judul: ["Pawang Kera", "Monkey Tamer"], desc: ["Kalahkan 100 Kera Liar.", "Defeat 100 Wild Monkeys."], hadiah: HDH(100, 1), progres: () => [kalahJenis("kera"), 100] },
  { id: "bos1", kat: "tarung", judul: ["Penakluk Bos", "Boss Slayer"], desc: ["Kalahkan bos pertamamu.", "Defeat your first boss."], hadiah: HDH(150, 1), progres: () => [jumlahBos(), 1] },
  { id: "bosSemua", kat: "tarung", judul: ["Penakluk Segala Bos", "Slayer of All Bosses"], desc: ["Kalahkan semua bos.", "Defeat every boss."], hadiah: HDH(1000, 10), progres: () => [jumlahBos(), daftarBos().length] },
  { id: "tanpaJamu", kat: "tarung", judul: ["Tanpa Jamu", "No Jamu Needed"], desc: ["Kalahkan bos tanpa minum jamu selama pertarungan.", "Defeat a boss without drinking jamu during the fight."], hadiah: HDH(300, 3), syarat: () => stat("bosTanpaJamu") > 0 },
  { id: "sempurna50", kat: "tarung", judul: ["Seringan Angin", "Light as Wind"], desc: ["Lakukan 50 Hindar Sempurna.", "Perform 50 Perfect Dodges."], hadiah: HDH(200, 2), progres: () => [stat("sempurna"), 50] },
  { id: "tangkis30", kat: "tarung", judul: ["Benteng Hidup", "Living Fortress"], desc: ["Pakai aksi khas hero (tangkis, dll.) 30 kali.", "Use your hero's own move (parry, etc.) 30 times."], hadiah: HDH(200, 2), progres: () => [stat("tangkis"), 30] },
  { id: "pamungkas10", kat: "tarung", judul: ["Jurus Pamungkas", "Ultimate Power"], desc: ["Pakai Pamungkas 10 kali.", "Use your Ultimate 10 times."], hadiah: HDH(200, 2), progres: () => [stat("pamungkas"), 10] },
  { id: "cermin7", kat: "tarung", judul: ["Di Balik Cermin", "Through the Mirror"], desc: ["Menangkan Cermin Gaib tingkat 7.", "Win a Mystic Mirror challenge at level 7."], hadiah: HDH(800, 8), syarat: () => Object.values(S.cermin || {}).some((n) => n >= 7) },

  // ---- Koleksi ----
  { id: "jimat5", kat: "koleksi", judul: ["Pengumpul Jimat", "Charm Collector"], desc: ["Miliki 5 jimat berbeda.", "Own 5 different charms."], hadiah: HDH(150, 2), progres: () => [jumlahJimat(), 5] },
  { id: "jimat15", kat: "koleksi", judul: ["Lemari Pusaka", "Heirloom Cabinet"], desc: ["Miliki 15 jimat berbeda.", "Own 15 different charms."], hadiah: HDH(400, 5), progres: () => [jumlahJimat(), 15] },
  { id: "jimatLegenda", kat: "koleksi", judul: ["Benda Legenda", "Legendary Find"], desc: ["Dapatkan jimat Legenda.", "Obtain a Legendary charm."], hadiah: HDH(300, 5), syarat: () => Object.keys(S.jimat.punya).some((id) => JIMAT[id] && JIMAT[id].rarity === "legenda") },
  { id: "jimatMaks", kat: "koleksi", judul: ["Tempaan Sempurna", "Perfect Forging"], desc: ["Tempa satu jimat sampai bintang maksimal.", "Forge a charm to max stars."], hadiah: HDH(300, 3), syarat: () => Object.values(S.jimat.punya).some((b) => b >= ATURAN.jimat.bintangMaks) },
  { id: "ensiklopedia", kat: "koleksi", judul: ["Ahli Makhluk", "Creature Expert"], desc: ["Temui semua jenis musuh biasa.", "Encounter every regular enemy type."], hadiah: HDH(300, 3), progres: () => [musuhBiasa().filter((k) => S.bestiari && S.bestiari[k]).length, musuhBiasa().length] },
  { id: "koin5000", kat: "koleksi", judul: ["Saudagar", "Merchant"], desc: ["Punya 5.000 koin sekaligus.", "Hold 5,000 coins at once."], hadiah: HDH(0, 5), progres: () => [S.gold, 5000] },

  // ---- Catur Laga ----
  { id: "caturSantai", kat: "catur", judul: ["Murid Pak Wowo", "Pak Wowo's Student"], desc: ["Menang Catur Laga tingkat Santai.", "Win Battle Chess on Easy."], hadiah: HDH(100), syarat: () => caturMenang("santai") },
  { id: "caturSedang", kat: "catur", judul: ["Lawan Sepadan", "Worthy Rival"], desc: ["Menang Catur Laga tingkat Sedang.", "Win Battle Chess on Medium."], hadiah: HDH(200, 2), syarat: () => caturMenang("sedang") },
  { id: "caturJago", kat: "catur", judul: ["Raja Papan", "King of the Board"], desc: ["Menang Catur Laga tingkat Jago.", "Win Battle Chess on Hard."], hadiah: HDH(400, 4), syarat: () => caturMenang("jago") },
  { id: "caturUtuh", kat: "catur", judul: ["Menteri Setia", "Loyal Queen"], desc: ["Menang Catur Laga tanpa kehilangan Menteri.", "Win Battle Chess without losing your Queen."], hadiah: HDH(200, 2), syarat: () => stat("caturUtuh") > 0 },
  { id: "caturKilat", kat: "catur", judul: ["Catur Kilat", "Blitz Master"], desc: ["Menang Catur Laga dengan jam 3 menit.", "Win Battle Chess with a 3-minute clock."], hadiah: HDH(200, 2), syarat: () => stat("caturKilat") > 0 },

  // ---- Rahasia (judul & cara tersembunyi sebelum tercapai) ----
  { id: "pingsan1", kat: "rahasia", rahasia: true, judul: ["Bangkit Lagi", "Rise Again"], desc: ["Pingsan untuk pertama kalinya. Jatuh itu biasa!", "Faint for the first time. Everyone falls!"], hadiah: HDH(50), syarat: () => stat("pingsan") > 0 },
  { id: "jamu50", kat: "rahasia", rahasia: true, judul: ["Langganan Warung", "Stall Regular"], desc: ["Minum 50 jamu.", "Drink 50 jamu."], hadiah: HDH(150, 1), syarat: () => stat("jamu") >= 50 },
  { id: "begadang", kat: "rahasia", rahasia: true, judul: ["Pendekar Begadang", "Night Owl"], desc: ["Bermain antara tengah malam dan jam 3 pagi.", "Play between midnight and 3 AM."], hadiah: HDH(50), syarat: () => { const j = new Date().getHours(); return j >= 0 && j < 3; } },
  { id: "kalahBoneka", kat: "rahasia", rahasia: true, judul: ["Sahabat Boneka", "Dummy's Best Friend"], desc: ["Lakukan Hindar Sempurna terhadap Boneka Latihan.", "Perfect-dodge the Training Dummy."], hadiah: HDH(30), syarat: () => stat("sempurnaBoneka") > 0 },
];
function daftarkanCapai(c) { if (!CAPAI.some((x) => x.id === c.id)) CAPAI.push(c); }

const KAT_CAPAI = { jalan: ["Petualangan", "Adventure"], tarung: ["Pertarungan", "Combat"], koleksi: ["Koleksi", "Collection"], catur: ["Catur Laga", "Battle Chess"], rahasia: ["Rahasia", "Secret"] };
const capaiTercapai = (id) => !!(S && S.capai && S.capai[id]);
const syaratCapai = (c) => { try { if (c.syarat) return !!c.syarat(); const [n, m] = c.progres(); return n >= m; } catch (e) { return false; } };

// ---------- Membuka pencapaian ----------
function bukaCapai(c, diam) {
  S.capai[c.id] = Date.now();
  if (c.hadiah.koin) S.gold += c.hadiah.koin;
  if (c.hadiah.serpih) S.jimat.serpih += c.hadiah.serpih;
  if (!diam) {
    toast("🏆 " + Lx(["Pencapaian: ", "Achievement: "]) + Lx(c.judul), true);
    setTimeout(() => notifItem(teksHadiahCapai(c.hadiah)), 400);
    sfx.quest ? sfx.quest() : sfx.level();
  }
  saveSoon();
}
const teksHadiahCapai = (h) => [h.koin && `+${h.koin} ${Lx(["koin", "coins"])}`, h.serpih && `+${h.serpih} ${Lx(["Serpih Pusaka", "Heirloom Shards"])}`].filter(Boolean).join(" · ");

let cekCapaiT = 1, cekCapaiSegera = false;
function cekCapai() {
  if (!S || !P) return;
  if (!S.capai) {   // simpanan yang belum pernah dicek: buka yang sudah terpenuhi sekaligus, satu notifikasi saja
    S.capai = {};
    const sudah = CAPAI.filter((c) => !c.rahasia && syaratCapai(c));
    for (const c of sudah) bukaCapai(c, true);
    if (sudah.length) toast("🏆 " + Lx([`${sudah.length} pencapaian terbuka dari progresmu! Lihat di Menu › Gameplay › Pencapaian.`, `${sudah.length} achievements unlocked from your progress! See Menu › Gameplay › Achievements.`]), false);
    return;
  }
  for (const c of CAPAI) if (!S.capai[c.id] && syaratCapai(c)) { bukaCapai(c); return; }   // satu per pengecekan, supaya notif tidak menumpuk
}
UPDATE_TAMBAHAN.push((dt) => {
  cekCapaiT -= dt;
  if (cekCapaiT > 0 && !cekCapaiSegera) return;
  cekCapaiT = 1; cekCapaiSegera = false;
  if (!adegan) cekCapai();
});

// ---------- Pencatat kejadian ----------
// latihanAksi dipanggil game untuk hindar sempurna, tangkis, jamu, pamungkas (56-cara-bermain.js)
{
  const latihanAsli = latihanAksi;
  latihanAksi = function (jenis, dari) {
    latihanAsli(jenis, dari);
    if (!S) return;
    if (jenis === "sempurna") { tambahStat("sempurna"); if (dari && dari.d && dari.d.latihan) tambahStat("sempurnaBoneka"); }
    if (jenis === "tangkis") tambahStat("tangkis");
    if (jenis === "pamungkas") tambahStat("pamungkas");
  };
}
// jamu benar-benar diminum = stok jamu berkurang (tombol jamu saat jeda/stok habis tidak dihitung)
let jamuTadi = null;
UPDATE_TAMBAHAN.push(() => {
  if (!S) return;
  if (jamuTadi != null && S.potions < jamuTadi) { tambahStat("jamu", jamuTadi - S.potions); jamuSaatBos = true; }
  jamuTadi = S.potions;
});
SAAT_MASUK_AREA.push(() => { jamuTadi = S ? S.potions : null; });
// pingsan
{
  const hurtAsli = hurtPlayer;
  hurtPlayer = function (...a) { const hidup = P && !P.dead; const r = hurtAsli(...a); if (hidup && P.dead) tambahStat("pingsan"); return r; };
}
// bos tanpa jamu: tanda direset saat masuk area bos, bos tumbang → cek
let jamuSaatBos = false;
SAAT_MASUK_AREA.push(() => { jamuSaatBos = false; });
{
  const killAsli = killMonster;
  killMonster = function (m) {
    const sudah = m.dead; killAsli(m);
    if (!sudah && m.dead && m.d.boss && !jamuSaatBos) tambahStat("bosTanpaJamu");
    if (!sudah && m.dead && m.d.boss) jamuSaatBos = false;
  };
}
// catur: menang tanpa kehilangan Menteri / dengan jam 3 menit
{
  const akhirAsli = akhirPartai;
  akhirPartai = function (hasil, alasan) {
    if (catur && !catur.selesai && hasil === "menang") {
      const milik = catur.pemainPutih ? "putih" : "hitam";
      if (!catur.dimakan[milik].includes("q")) tambahStat("caturUtuh");
      if (dataCatur().waktu === 180 && catur.jam) tambahStat("caturKilat");
    }
    akhirAsli(hasil, alasan);
  };
}

// ---------- Halaman ----------
const IKON_PIALA = (warna) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v2h3v2a4 4 0 0 1-4 4h-.3A5 5 0 0 1 13 13.9V17h3v3H8v-3h3v-3.1A5 5 0 0 1 8.3 11H8a4 4 0 0 1-4-4V5h3Zm-1 4a2 2 0 0 0 2 2V7Zm12 2a2 2 0 0 0 2-2h-2Z" fill="${warna}"/></svg>`;
function isiPencapaian() {
  const total = CAPAI.length, dapat = CAPAI.filter((c) => capaiTercapai(c.id)).length;
  let html = `<div class="cp-ringkas"><b>${dapat}</b> / ${total} ${Lx(["tercapai", "unlocked"])}<span class="cp-bar"><i style="width:${Math.round((dapat / total) * 100)}%"></i></span></div>`;
  for (const [kat, nama] of Object.entries(KAT_CAPAI)) {
    const isi = CAPAI.filter((c) => c.kat === kat);
    if (!isi.length) continue;
    html += `<h3 class="cp-kat">${Lx(nama)} <small>${isi.filter((c) => capaiTercapai(c.id)).length}/${isi.length}</small></h3><div class="cp-grid">`;
    html += isi.map((c) => {
      const ok = capaiTercapai(c.id), tutup = c.rahasia && !ok;
      let prog = "";
      if (!ok && c.progres && !tutup) { try { const [n, m] = c.progres(); prog = `<span class="cp-prog"><i style="width:${Math.min(100, Math.round((n / m) * 100))}%"></i></span><small class="cp-angka">${Math.min(n, m).toLocaleString()} / ${m.toLocaleString()}</small>`; } catch (e) {} }
      const tgl = ok ? new Date(S.capai[c.id]).toLocaleDateString(bahasa === "en" ? "en-GB" : "id-ID", { day: "numeric", month: "short", year: "numeric" }) : "";
      return `<div class="cp-kartu${ok ? " dapat" : ""}">
        <span class="cp-ikon">${IKON_PIALA(ok ? "#f4b942" : "#5d5672")}</span>
        <div><b>${tutup ? "???" : Lx(c.judul)}</b>
          <p>${tutup ? Lx(["Pencapaian rahasia. Temukan sendiri caranya!", "Secret achievement. Find out how yourself!"]) : Lx(c.desc)}</p>
          ${prog}
          <small class="cp-hadiah">${ok ? "✓ " + tgl + " · " : ""}${teksHadiahCapai(c.hadiah)}</small></div></div>`;
    }).join("") + `</div>`;
  }
  $("capaiIsi").innerHTML = html;
}
PAUSE_BACK.capai = "gameplay";
{
  const showPauseViewAsli = showPauseView;
  showPauseView = function (view, silent) { showPauseViewAsli(view, silent); if (view === "capai") isiPencapaian(); };
}
