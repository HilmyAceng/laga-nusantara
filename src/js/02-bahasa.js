// =====================================================================
// BAHASA
// Pengaturan › Bahasa: Indonesia (bawaan) atau English. Pilihan tersimpan.
//
// Cara kerja:
//  - Teks di HTML diberi tanda data-t="kunci" (teks biasa), data-th="kunci"
//    (boleh berisi <span>), atau data-ta="kunci" (aria-label).
//    Teks Indonesianya tetap ditulis di HTML; teks Inggrisnya ada di TEKS.en.
//  - Teks dari kode memakai t("kunci", { nilai }) → TEKS.id / TEKS.en.
//    {nama} di dalam teks diganti dengan nilai yang dikirim.
//  - Nama & keterangan dari data game (kelas, monster, misi, area) diterjemahkan
//    dengan DATA_EN. Teks Indonesianya tetap di config.js / 04-peta.js.
// Menambah teks baru? Tambahkan kuncinya di TEKS.id DAN TEKS.en.
// =====================================================================
"use strict";

const BAHASA_KEY = "laga.bahasa";
let bahasa = store.get(BAHASA_KEY, "id");
if (bahasa !== "id" && bahasa !== "en") bahasa = "id";

const TEKS = {
  id: {
    // HUD & misi
    "hud.bebas": "<b>Bebas bertualang</b>Semua misi selesai",
    "hud.misiBaru": "<b>Misi baru</b>Temui Ki Lurah (tanda !)",
    "hud.kalahkan": "Kalahkan", "hud.kumpulkan": "Kumpulkan",
    "hud.lapor": "Selesai! Lapor ke Ki Lurah",
    // toast
    "toast.naikLevel": "Naik level! Lv {lv}",
    "toast.misiSelesai": "Misi selesai: {judul}. Lapor ke Ki Lurah",
    "toast.jamuHabis": "Jamu habis. Beli di warung desa",
    "toast.dukungKosong": "Link dukungan belum diisi (config.js › ATURAN.dukung.tautan)",
    "toast.dapatJamu": "Dapat jamu", "toast.dapatTaring": "Dapat taring babi",
    "toast.musik": "Musik {status}", "toast.nyala": "nyala", "toast.mati": "mati",
    "toast.pingsan": "Kamu pingsan... dibawa pulang ke desa (−{koin} koin)",
    "toast.bosTumbang": "{nama} tumbang!",
    "toast.hadiah": "+{koin} koin · +{exp} EXP",
    "toast.senjata": "Senjata tingkat {lv}",
    "toast.mulai": "Temui Resi Wening di dekat alun-alun desa",
    "toast.lanjut": "Melanjutkan di {area}",
    "toast.pulihPenuh": "Nyawa pulih penuh",
    "toast.bosMuncul": "{nama} muncul dari cermin!",
    "toast.bosUlang": "{nama} tumbang! {hadiah}",
    // dialog NPC
    "dlg.tutup": "Tutup", "dlg.nanti": "Nanti dulu", "dlg.terima": "Terima misi", "dlg.siap": "Siap",
    "dlg.terimaHadiah": "Terima hadiah",
    "dlg.lurahSelesai": "Berkat kamu, Wanasari kembali tenang. Hutan masih luas, silakan terus berlatih.",
    "dlg.hadiah": " (Hadiah: {koin} koin, {exp} EXP)",
    "dlg.progres": "{judul}: {prog} dari {need}. Hati-hati di luar sana.",
    "dlg.lurahHadiah": "Luar biasa! Terimalah hadiah ini dari warga desa.",
    "dlg.toko": "Mau beli apa, Nak? Koinmu {koin}. Jamu memulihkan {pulih}% nyawa. Senjatamu tingkat {lv} (tingkatkan di Tukang Pahat).",
    "dlg.beliJamu": "Beli jamu ({harga})",
    "dlg.asah": "Asah senjata +{atk} serangan ({harga})",
    "cermin.nama": "Cermin Gaib",
    "cermin.redup": "Permukaan cermin masih redup dan berkabut. Bisa dipakai lagi dalam {detik} detik.",
    "cermin.tanya": "Bayangan gelap bergerak di dalam cermin... Munculkan {nama}?",
    "cermin.jangan": "Jangan", "cermin.munculkan": "Munculkan {nama}",
    "cermin.detik": "{detik} detik", "cermin.sentuh": "[E] Sentuh cermin",
    "npc.bicara": "[E] Bicara",
    // teleport
    "tele.nama": "Mesin Teleport", "tele.energi": "Energi {poin} / {maks}", "tele.tanya": "Pindah ke {area}?",
    // peta besar
    "peta.dunia": "Peta <span>Dunia</span>", "peta.kamuDi": "Peta · Kamu di {area}", "peta.sub": "Peta · {sub}",
    "peta.hintSentuh": "Cubit dua jari untuk zoom, geser untuk melihat sekeliling. Ketuk ✕ atau di luar peta untuk menutup.",
    "peta.hintKey": "Tab = ganti tab · roda mouse / + - = zoom · seret = geser · {k} atau Esc = tutup.",
    "peta.kamu": "Kamu", "peta.kamuDiSini": "Kamu di sini",
    // layar judul
    "judul.nyawa": "Nyawa", "judul.lanjutkan": "Lanjutkan ({kelas} Lv {lv}{area})",
    "judul.mulaiBaru": "Mulai baru (progres lama terhapus)", "judul.mulai": "Mulai petualangan",
    "judul.keys": "{gerak} gerak · {serang} serang (tahan) · {jurus} jurus · {hindar} hindar · {jamu} minum jamu · {bicara} bicara · {peta} peta · {misi} misi · {jeda} jeda · {musik} musik",
    // menu jeda
    "jeda.stats": "{kelas} Lv {lv} · {kills} monster dikalahkan · serangan {atk} · senjata tingkat {senjata}. Progres tersimpan otomatis.",
    "menang.stats": "{kelas} Lv {lv} menuntaskan kisah ini dan mengalahkan {kills} makhluk. Kabut merah sirna, bayangan Kalamurka tersegel, dan keempat negeri kembali damai.",
    "ctl.gerak": "Gerak",
    "ctl.serang": "Serang <small>— tahan untuk serang terus, otomatis membidik musuh terdekat</small>",
    "ctl.jurus": "Jurus: {nama} <small>— lalu tunggu jeda {cd} detik</small>",
    "ctl.hindar": "Hindar <small>— guling cepat, kebal sesaat</small>",
    "ctl.jamu": "Minum jamu <small>— pulihkan {pulih}% nyawa</small>",
    "ctl.bicara": "Bicara <small>— saat dekat NPC, juga menutup dialog</small>",
    "ctl.peta": "Buka / tutup peta besar <small>— bisa juga klik peta mini</small>",
    "ctl.jeda": "Jeda / lanjut", "ctl.musik": "Musik nyala / mati",
    "ctlT.misi": "<b>Kotak misi</b> kiri atas — ketuk untuk memilih misi yang dilacak",
    "ctl.misi": "Daftar misi <small>— pilih misi yang diikuti panah emas, bisa juga klik kotak misi</small>",
    "misi.jUtama": "Cerita utama", "misi.jDari": "Misi dari {npc}",
    "misi.lapor": "Selesai! Lapor ke {npc}",
    "misi.kalahkan": "Kalahkan {n} {nama}", "misi.kumpulkan": "Kumpulkan {n} {nama}",
    "misi.hadiah": "Hadiah", "misi.lacak": "Lacak misi ini", "misi.dilacak": "Sedang dilacak ✓",
    "misi.melacak": "Melacak: {judul}", "misi.kosong": "Belum ada misi. Bicaralah dengan warga yang bertanda !",
    "misi.lain": "+{n} misi lain", "misi.ketuk": "ketuk untuk daftar misi", "misi.tekan": "{k} daftar misi",
    "h.misiEyebrow": "Jurnal", "h.misiJudul": "Daftar <span>Misi</span>", "h.misiLead": "Pilih misi yang ingin kamu lanjutkan. Panah emas dan bintang di peta akan menunjuk ke sana.",
    "h.tutupMisi": "Tutup daftar misi", "h.zIn": "Perbesar peta", "h.zOut": "Perkecil peta", "h.zPusat": "Kembali ke posisimu",
    "ctlT.stick": "<b>Joystick kiri</b> — geser ke arah mana pun untuk berjalan",
    "ctlT.serang": "<b>Serang</b> — tahan untuk serang terus, otomatis membidik",
    "ctlT.jurus": "<b>Jurus</b> — {nama}. Lingkaran gelap = sedang diisi ulang",
    "ctlT.hindar": "<b>Hindar</b> — guling ke arah joystick, kebal sesaat",
    "ctlT.jamu": "<b>Jamu</b> — pulihkan {pulih}% nyawa",
    "ctlT.bicara": "<b>Bicara</b> — hanya muncul saat dekat NPC",
    "ctlT.peta": "<b>Peta mini</b> kanan atas — ketuk untuk buka peta besar",
    "ctlT.jeda": "<b>❚❚</b> kanan atas — jeda. <small>Putar HP ke mode lanskap biar leluasa.</small>",
    // pengaturan
    "set.nyala": "Nyala", "set.mati": "Mati",
    "vol.aria": "{jenis} {status}", "vol.musik": "Musik", "vol.sfx": "Efek suara",
    "vol.ariaNyala": "nyala, tekan untuk mematikan", "vol.ariaMati": "mati, tekan untuk menyalakan",
    "fs.aplikasi": "Game dibuka sebagai aplikasi terpasang, jadi sudah tampil layar penuh.",
    "fs.tidakBisa": "Browser ini belum mendukung layar penuh. Di iPhone, pasang game lewat Bagikan › Tambahkan ke Layar Utama agar tampil penuh.",
    "fs.ketuk": "Ketuk layar sekali untuk masuk layar penuh lagi.",
    // cerita utama, misi sampingan, teka-teki
    "joko.sapa": "Ada yang bisa Bapak bantu, Nak?", "joko.tanya": "Tanya soal debuff", "joko.lain": "Urusan lain",
    "joko.pembuka": "Makhluk-makhluk berkabut bisa meninggalkan penyakit di tubuhmu. Dengarkan baik-baik, ada lima macam.",
    "joko.dari": "Biasanya dari: {daftar}.",
    "joko.penutup": "Semuanya hilang sendiri setelah beberapa detik, atau langsung sembuh di zona aman dekat mesin teleport. Mau jamu penawar? Bantu Bapak cari daun sambiloto.",
    "joko.penutupPunya": "Semuanya hilang sendiri, sembuh di zona aman, dan karena kau sudah tahu resepnya, setiap jamu juga menyembuhkannya.",
    "debuff.efek.racun": "nyawa berkurang pelan, tapi tidak sampai membuatmu pingsan.",
    "debuff.efek.terbakar": "seperti racun, tapi nyawa berkurang lebih cepat.",
    "debuff.efek.lambat": "langkahmu jadi jauh lebih pelan.",
    "debuff.efek.lemah": "serangan dan jurusmu melemah.",
    "debuff.efek.bingung": "arah gerakmu terbalik: tekan kiri malah ke kanan!",
    "debuff.dari": "Dari: {daftar}",
    "debuff.obat": "Cara sembuh: tunggu beberapa detik, atau masuk zona aman (bendera hijau). Selesaikan misi Pak Joko untuk jamu penawar.",
    "debuff.obatPunya": "Cara sembuh: tunggu, masuk zona aman (bendera hijau), atau minum jamu (kau sudah punya resep penawar).",
    "item.dapat": "+1 {nama} (×{n})",
    "bab.tamat": "Tamat", "bab.mulai": "Mulai",
    "peta.duniaKe": "Dunia {n}",
    "kala.putusAsa": "Prabu Kalamurka putus asa!",
    "warna.merah": "Merah", "warna.biru": "Biru", "warna.hijau": "Hijau", "warna.emas": "Emas", "warna.ungu": "Ungu",
    "tk.n_gong": "Gong {warna}", "tk.n_lonceng": "Lonceng {warna}", "tk.n_lentera": "Lentera {warna}",
    "tk.nPetunjuk": "Pahatan Petunjuk", "tk.nTuas": "Tuas Batu", "tk.nMemori": "Batu Ingatan", "tk.nTanya": "Batu Bertanya", "tk.nUnggun": "Api Unggun Abadi",
    "tk.gongPetunjuk": "Pahatan berbunyi: \"Laut membangunkan darah. Darah memanggil matahari. Matahari menumbuhkan daun.\"",
    "tk.loncengPetunjuk": "Pahatan berbunyi: \"Senja turun lebih dulu, lalu mentari terbit, jatuh ke laut, laut memerah oleh fajar, dan fajar membangunkan hutan.\"",
    "tk.lenteraPetunjuk": "Tulisan di dinding: \"Daun gugur ke tanah senja, senja terbakar menjadi bara, bara padam di dalam air, dan air memantulkan mahkota sang raja.\"",
    "tk.sudah": "Teka-teki ini sudah terpecahkan.",
    "tk.salahUrutan": "Urutannya salah! Semuanya padam...",
    "tk.lempeng": "Lempeng tertekan: {n} / {max}",
    "tk.tuasTanya": "Tarik tuas untuk mengembalikan semua batu ke tempat awal?", "tk.tuasYa": "Tarik tuas",
    "tk.memoriTanya": "Batu ini berdenyut pelan. Lempeng di depannya akan berkedip berurutan; injak lempeng dengan urutan yang sama.", "tk.memoriMulai": "Mulai",
    "tk.memoriRonde": "Ronde {n} / {max}: perhatikan lempengnya!", "tk.memoriGiliran": "Giliranmu: injak lempeng sesuai urutan",
    "tk.memoriSalah": "Salah lempeng! Ulangi ronde ini",
    "tk.tanyaSelesai": "Batu ini diam. Semua teka-tekinya sudah terjawab.", "tk.tanyaSalah": "Jawaban salah! Sesuatu bangkit dari kegelapan...",
    "tk.l1": "Aku punya kota tanpa rumah, sungai tanpa air, dan gunung tanpa batu. Siapa aku?", "tk.l1a": "Peta", "tk.l1b": "Lukisan", "tk.l1c": "Mimpi",
    "tk.l2": "Aku justru basah saat mengeringkan. Apa aku?", "tk.l2a": "Handuk", "tk.l2b": "Angin", "tk.l2c": "Matahari",
    "tk.l3": "Punya leher tanpa kepala, perut tanpa makanan, tapi menyimpan air. Apa aku?", "tk.l3a": "Kendi", "tk.l3b": "Perahu", "tk.l3c": "Kerang",
    "tk.b1": "Makin terang cahaya, makin jelas aku. Tanpa cahaya, aku lenyap. Siapa aku?", "tk.b1a": "Bayangan", "tk.b1b": "Api", "tk.b1c": "Kaca",
    "tk.b2": "Aku pecah begitu namaku disebut. Apa aku?", "tk.b2a": "Hening", "tk.b2b": "Kaca", "tk.b2c": "Janji",
    "tk.b3": "Semua orang punya sama banyak setiap hari. Tak bisa disimpan, tak bisa dibeli dengan emas. Apa aku?", "tk.b3a": "Waktu", "tk.b3b": "Udara", "tk.b3c": "Nama",
    "item.ekorTikus": "Ekor tikus", "item.tulangTua": "Tulang tua", "item.serpihBayang": "Serpih bayang", "item.sisikListrik": "Sisik listrik",
    "item.intiAngin": "Inti angin", "item.lencanaBayang": "Lencana bayang", "item.debuLelembut": "Debu lelembut", "item.mutiaraHitam": "Mutiara hitam", "item.kainBayang": "Kain bayang",
    "item.segelBumi": "Segel Bumi", "item.segelSegara": "Segel Segara", "item.segelAwan": "Segel Awan", "item.tombakCahaya": "Tombak Cahaya", "item.mahkotaKala": "Mahkota Kala",
    "cerita.ep": "Ep {n}",
    "item.daunSambiloto": "Daun sambiloto", "item.kristalKabut": "Kristal kabut", "item.taringUlar": "Taring ular", "item.cakarKumbang": "Cakar kumbang",
    "item.mutiara": "Mutiara bercahaya", "item.koinBajak": "Koin bajak laut", "item.intiArca": "Inti arca", "item.buluElang": "Bulu elang batu",
    "item.sisikApi": "Sisik api", "item.kerangLaut": "Kerang bercahaya", "item.pecahanArca": "Pecahan arca", "item.kompasLaut": "Kompas Laut",
    "item.sisikNaga": "Sisik Naga", "item.batuPelangi": "Batu Pelangi", "item.mustikaKencana": "Mustika Kencana",
    "side.hPenawar": "resep jamu penawar",
    "toast.penawar": "Resep penawar dipelajari! Jamu kini juga menyembuhkan semua debuff",
    "toast.jalanTerbuka": "Jalan baru terbuka!",
    "debuff.racun": "Racun", "debuff.terbakar": "Terbakar", "debuff.lambat": "Lambat", "debuff.lemah": "Lemah", "debuff.bingung": "Bingung",
    "debuff.info.racun": "Kena racun: nyawa berkurang pelan. Cari zona aman atau tanya Pak Joko",
    "debuff.info.terbakar": "Terbakar: nyawa berkurang cepat. Cari zona aman atau tanya Pak Joko",
    "debuff.info.lambat": "Lambat: gerakanmu melambat sebentar",
    "debuff.info.lemah": "Lemah: seranganmu melemah sebentar",
    "debuff.info.bingung": "Bingung: arah gerakmu terbalik sebentar!",
    "debuff.sembuhJamu": "Jamu penawar: semua debuff sembuh", "debuff.sembuhAman": "Zona aman: semua debuff sembuh",
    "aman.masuk": "Zona aman · monster tidak bisa masuk",
    "tantang.tk": "Tingkat {n}", "tantang.saran": "Level disarankan: Lv {lv}",
    "tantang.terkunci": "Terkunci · menangkan Tingkat {n} dulu", "tantang.menang": "Sudah menang ✓ · tantang lagi", "tantang.mulai": "Tantang ›",
    "tantang.kunciToast": "Menangkan Tingkat {n} dulu", "tantang.terbuka": "Tingkat {n} terbuka!",
    "naga.mengamuk": "Naga Kencana mengamuk!",
    "peta.duniaSub": "Peta dunia · Kamu di {area}", "peta.tujuanDunia": "Tujuan misi ada di {dunia} »",
    "cerita.narator": "Cerita",
    "cerita.lanjut": "Lanjut ›",
    "cerita.hKoin": "+{n} koin",
    "cerita.hJamu": "+{n} jamu",
    "cerita.tujuanBaru": "Tujuan baru: {tujuan}",
    "cerita.hudTamat": "<b>Tamat</b>Keempat negeri damai. Bebas bertualang!",
    "item.mustikaBumi": "Mustika Bumi",
    "item.mustikaTirta": "Mustika Tirta",
    "item.mustikaBayu": "Mustika Bayu",
    "item.kantong": "Kantong curian",
    "item.sisik": "Sisik buaya",
    "item.taring": "Taring babi",
    "side.hSenjata": "senjata +1 tingkat",
    "side.hadiah": "Hadiah",
    "side.lapor": "lapor ke {npc}",
    "toast.misiSelesai2": "Misi selesai: {judul}. Lapor ke {npc}",
    "toast.dicopet": "Dicopet tuyul! −{n} koin",
    "toast.bosMarah": "{nama} mengamuk!",
    "toast.lurahTamat": "Semua misi Ki Lurah selesai! Cermin Gaib terbangun di Gua Genderuwo.",
    "teka.nPrasasti": "Prasasti",
    "teka.nObor": "Obor",
    "teka.nPitutur": "Batu Pitutur",
    "teka.nAltar": "Altar Mustika",
    "teka.periksa": "[E] Periksa",
    "teka.prasasti": "Empat api penjaga menunggu dinyalakan. Ikuti perjalanan sang surya: saat ia lahir, saat ia tegak di atas kepala, saat ia tenggelam. Lalu sambutlah sang rembulan.",
    "teka.prasastiSelesai": "Keempat api menyala tenang. Jalan ke ruang dalam sudah terbuka.",
    "teka.oborNyala": "Api menyala ({n}/{max})",
    "teka.oborSalah": "Salah urutan... semua api padam. Baca lagi prasastinya.",
    "teka.pituturSelesai": "Batu itu kini diam. Jembatan ke pulau sudah muncul.",
    "teka.pituturKabut": "Tulisan di batu tertutup kabut tebal, belum bisa dibaca. Mungkin Mbah Tirto tahu sesuatu.",
    "teka.pituturSalah": "Jawaban salah! Kabut bergolak dan hantu-hantu muncul...",
    "teka.altarSelesai": "Ketiga mustika bersinar di altar. Jembatan batu membentang di atas lava.",
    "teka.altarKurang": "Tiga cekungan berbentuk mustika: hijau, biru, dan putih. Mustika yang kamu bawa: {n}/{max} ({daftar}).",
    "teka.altarTanya": "Ketiga mustika di tasmu bergetar, seperti ingin pulang. Letakkan di altar?",
    "teka.altarTaruh": "Letakkan mustika",
    "teka.r1": "Aku selalu datang, tapi tak pernah tiba hari ini. Siapakah aku?",
    "teka.r1a": "Besok",
    "teka.r1b": "Kemarin",
    "teka.r1c": "Malam",
    "teka.r2": "Semakin banyak kau ambil dariku, semakin besar aku jadinya. Apakah aku?",
    "teka.r2a": "Lubang",
    "teka.r2b": "Batu",
    "teka.r2c": "Bayangan",
    "teka.r3": "Aku punya banyak gigi, tapi tak pernah menggigit. Apakah aku?",
    "teka.r3a": "Sisir",
    "teka.r3b": "Buaya",
    "teka.r3c": "Kepiting",
    "peta.tujuan": "Tujuan",
  },
  en: {
    "hud.bebas": "<b>Free roam</b>All quests complete",
    "hud.misiBaru": "<b>New quest</b>Talk to Ki Lurah (! mark)",
    "hud.kalahkan": "Defeat", "hud.kumpulkan": "Collect",
    "hud.lapor": "Done! Report to Ki Lurah",
    "toast.naikLevel": "Level up! Lv {lv}",
    "toast.misiSelesai": "Quest complete: {judul}. Report to Ki Lurah",
    "toast.jamuHabis": "Out of jamu. Buy more at a village stall",
    "toast.dukungKosong": "Support link not set yet (config.js › ATURAN.dukung.tautan)",
    "toast.dapatJamu": "Got a jamu", "toast.dapatTaring": "Got a boar tusk",
    "toast.musik": "Music {status}", "toast.nyala": "on", "toast.mati": "off",
    "toast.pingsan": "You fainted... carried back to the village (−{koin} coins)",
    "toast.bosTumbang": "{nama} defeated!",
    "toast.hadiah": "+{koin} coins · +{exp} EXP",
    "toast.senjata": "Weapon level {lv}",

    "toast.lanjut": "Continuing in {area}",
    "toast.pulihPenuh": "Fully healed",
    "toast.bosMuncul": "{nama} emerges from the mirror!",
    "toast.bosUlang": "{nama} defeated! {hadiah}",
    "dlg.tutup": "Close", "dlg.nanti": "Maybe later", "dlg.terima": "Accept quest", "dlg.siap": "Got it",
    "dlg.terimaHadiah": "Take reward",
    "dlg.lurahSelesai": "Thanks to you, Wanasari is peaceful again. The forest is still vast, keep training.",
    "dlg.hadiah": " (Reward: {koin} coins, {exp} EXP)",
    "dlg.progres": "{judul}: {prog} of {need}. Be careful out there.",
    "dlg.lurahHadiah": "Wonderful! Please accept this gift from the villagers.",
    "dlg.toko": "What would you like, dear? You have {koin} coins. Jamu restores {pulih}% health. Your weapon is tier {lv} (upgrade it at the Carver).",
    "dlg.beliJamu": "Buy jamu ({harga})",
    "dlg.asah": "Sharpen weapon +{atk} attack ({harga})",
    "cermin.nama": "Mystic Mirror",
    "cermin.redup": "The mirror is still dim and misty. It can be used again in {detik} seconds.",
    "cermin.tanya": "A dark shadow moves inside the mirror... Summon {nama}?",
    "cermin.jangan": "Don't", "cermin.munculkan": "Summon {nama}",
    "cermin.detik": "{detik} s", "cermin.sentuh": "[E] Touch the mirror",
    "npc.bicara": "[E] Talk",
    "tele.nama": "Teleport Beacon", "tele.energi": "Energy {poin} / {maks}", "tele.tanya": "Travel to {area}?",
    "peta.dunia": "World <span>Map</span>", "peta.kamuDi": "Map · You are in {area}", "peta.sub": "Map · {sub}",
    "peta.hintSentuh": "Pinch to zoom, drag to look around. Tap ✕ or outside the map to close.",
    "peta.hintKey": "Tab = switch tab · mouse wheel / + - = zoom · drag = pan · {k} or Esc = close.",
    "peta.kamu": "You", "peta.kamuDiSini": "You are here",
    "judul.nyawa": "HP", "judul.lanjutkan": "Continue ({kelas} Lv {lv}{area})",
    "judul.mulaiBaru": "New game (old progress is erased)", "judul.mulai": "Start adventure",
    "judul.keys": "{gerak} move · {serang} attack (hold) · {jurus} skill · {hindar} dodge · {jamu} drink jamu · {bicara} talk · {peta} map · {misi} quests · {jeda} pause · {musik} music",
    "jeda.stats": "{kelas} Lv {lv} · {kills} monsters defeated · attack {atk} · weapon level {senjata}. Progress is saved automatically.",
    "menang.stats": "{kelas} Lv {lv} finished the tale and defeated {kills} creatures. The red mist is gone, Kalamurka's shadow is sealed, and all four realms are at peace again.",
    "ctl.gerak": "Move",
    "ctl.serang": "Attack <small>— hold to keep attacking, auto-aims at the nearest enemy</small>",
    "ctl.jurus": "Skill: {nama} <small>— then wait {cd} seconds</small>",
    "ctl.hindar": "Dodge <small>— quick roll, briefly invincible</small>",
    "ctl.jamu": "Drink jamu <small>— restores {pulih}% health</small>",
    "ctl.bicara": "Talk <small>— near an NPC, also closes dialogs</small>",
    "ctl.peta": "Open / close the big map <small>— or click the mini map</small>",
    "ctl.jeda": "Pause / resume", "ctl.musik": "Music on / off",
    "ctlT.misi": "<b>Quest box</b> top left — tap to choose which quest to track",
    "ctl.misi": "Quest list <small>— choose the quest the gold arrow follows, or click the quest box</small>",
    "misi.jUtama": "Main story", "misi.jDari": "Quest from {npc}",
    "misi.lapor": "Done! Report to {npc}",
    "misi.kalahkan": "Defeat {n} {nama}", "misi.kumpulkan": "Collect {n} {nama}",
    "misi.hadiah": "Reward", "misi.lacak": "Track this quest", "misi.dilacak": "Tracking ✓",
    "misi.melacak": "Tracking: {judul}", "misi.kosong": "No quests yet. Talk to villagers marked with !",
    "misi.lain": "+{n} more", "misi.ketuk": "tap for quest list", "misi.tekan": "{k} quest list",
    "h.misiEyebrow": "Journal", "h.misiJudul": "Quest <span>List</span>", "h.misiLead": "Choose the quest you want to continue. The gold arrow and the star on the map will point to it.",
    "h.tutupMisi": "Close quest list", "h.zIn": "Zoom in", "h.zOut": "Zoom out", "h.zPusat": "Back to your position",
    "ctlT.stick": "<b>Left joystick</b> — drag in any direction to walk",
    "ctlT.serang": "<b>Attack</b> — hold to keep attacking, auto-aims",
    "ctlT.jurus": "<b>Skill</b> — {nama}. Dark circle = recharging",
    "ctlT.hindar": "<b>Dodge</b> — roll toward the joystick, briefly invincible",
    "ctlT.jamu": "<b>Jamu</b> — restores {pulih}% health",
    "ctlT.bicara": "<b>Talk</b> — only appears near an NPC",
    "ctlT.peta": "<b>Mini map</b> top right — tap to open the big map",
    "ctlT.jeda": "<b>❚❚</b> top right — pause. <small>Turn your phone sideways for more room.</small>",
    "set.nyala": "On", "set.mati": "Off",
    "vol.aria": "{jenis} {status}", "vol.musik": "Music", "vol.sfx": "Sound effects",
    "vol.ariaNyala": "on, press to turn off", "vol.ariaMati": "off, press to turn on",
    "fs.aplikasi": "The game is running as an installed app, so it is already full screen.",
    "fs.tidakBisa": "This browser does not support full screen yet. On iPhone, install the game via Share › Add to Home Screen to play full screen.",
    "fs.ketuk": "Tap the screen once to go full screen again.",
    "joko.sapa": "Anything I can help you with, child?", "joko.tanya": "Ask about debuffs", "joko.lain": "Something else",
    "joko.pembuka": "Mist creatures can leave ailments in your body. Listen closely, there are five kinds.",
    "joko.dari": "Usually from: {daftar}.",
    "joko.penutup": "They all wear off after a few seconds, or are cured at once in a safe zone near a teleport beacon. Want antidote jamu? Help me find sambiloto leaves.",
    "joko.penutupPunya": "They all wear off, are cured in safe zones, and since you know the recipe, every jamu cures them too.",
    "debuff.efek.racun": "health drains slowly, but it won't knock you out.",
    "debuff.efek.terbakar": "like poison, but health drains faster.",
    "debuff.efek.lambat": "your steps become much slower.",
    "debuff.efek.lemah": "your attacks and skills grow weaker.",
    "debuff.efek.bingung": "your movement is reversed: press left and you go right!",
    "debuff.dari": "From: {daftar}",
    "debuff.obat": "Cure: wait a few seconds, or enter a safe zone (green flags). Finish Pak Joko's quest for antidote jamu.",
    "debuff.obatPunya": "Cure: wait, enter a safe zone (green flags), or drink jamu (you know the antidote recipe).",
    "item.dapat": "+1 {nama} (×{n})",
    "bab.tamat": "Complete", "bab.mulai": "Begin",
    "peta.duniaKe": "World {n}",
    "kala.putusAsa": "King Kalamurka is desperate!",
    "warna.merah": "Red", "warna.biru": "Blue", "warna.hijau": "Green", "warna.emas": "Gold", "warna.ungu": "Purple",
    "tk.n_gong": "{warna} Gong", "tk.n_lonceng": "{warna} Bell", "tk.n_lentera": "{warna} Lantern",
    "tk.nPetunjuk": "Clue Carving", "tk.nTuas": "Stone Lever", "tk.nMemori": "Memory Stone", "tk.nTanya": "Asking Stone", "tk.nUnggun": "Eternal Campfire",
    "tk.gongPetunjuk": "The carving reads: \"The sea awakens the blood. The blood calls the sun. The sun grows the leaves.\"",
    "tk.loncengPetunjuk": "The carving reads: \"Dusk falls first, then the sun rises, sinks into the sea, the sea reddens with dawn, and dawn wakes the forest.\"",
    "tk.lenteraPetunjuk": "Words on the wall: \"Leaves fall to the dusk ground, dusk burns into embers, embers die in the water, and the water mirrors the king's crown.\"",
    "tk.sudah": "This puzzle is already solved.",
    "tk.salahUrutan": "Wrong order! Everything goes dark...",
    "tk.lempeng": "Plates pressed: {n} / {max}",
    "tk.tuasTanya": "Pull the lever to return every stone to its starting place?", "tk.tuasYa": "Pull lever",
    "tk.memoriTanya": "The stone pulses softly. The plates in front will flash in order; step on them in the same order.", "tk.memoriMulai": "Start",
    "tk.memoriRonde": "Round {n} / {max}: watch the plates!", "tk.memoriGiliran": "Your turn: step on the plates in order",
    "tk.memoriSalah": "Wrong plate! Repeat this round",
    "tk.tanyaSelesai": "The stone is silent. All its riddles have been answered.", "tk.tanyaSalah": "Wrong answer! Something rises from the dark...",
    "tk.l1": "I have cities but no houses, rivers but no water, mountains but no stone. What am I?", "tk.l1a": "A map", "tk.l1b": "A painting", "tk.l1c": "A dream",
    "tk.l2": "I get wetter the more I dry. What am I?", "tk.l2a": "A towel", "tk.l2b": "The wind", "tk.l2c": "The sun",
    "tk.l3": "I have a neck but no head, a belly but no food, and I hold water. What am I?", "tk.l3a": "A water jug", "tk.l3b": "A boat", "tk.l3c": "A shell",
    "tk.b1": "The brighter the light, the clearer I am. Without light, I vanish. What am I?", "tk.b1a": "A shadow", "tk.b1b": "Fire", "tk.b1c": "Glass",
    "tk.b2": "I break the moment you say my name. What am I?", "tk.b2a": "Silence", "tk.b2b": "Glass", "tk.b2c": "A promise",
    "tk.b3": "Everyone gets the same amount each day. It can't be saved or bought with gold. What am I?", "tk.b3a": "Time", "tk.b3b": "Air", "tk.b3c": "A name",
    "item.ekorTikus": "Rat tail", "item.tulangTua": "Old bone", "item.serpihBayang": "Shadow shard", "item.sisikListrik": "Electric scale",
    "item.intiAngin": "Wind core", "item.lencanaBayang": "Shadow badge", "item.debuLelembut": "Wraith dust", "item.mutiaraHitam": "Black pearl", "item.kainBayang": "Shadow cloth",
    "item.segelBumi": "Earth Seal", "item.segelSegara": "Sea Seal", "item.segelAwan": "Cloud Seal", "item.tombakCahaya": "Spear of Light", "item.mahkotaKala": "Kala Crown",
    "h.gameplay": "Gameplay", "h.gpEyebrow": "Pause › Gameplay", "h.gpJudul": "Game<span>play</span>", "h.debuff": "Debuffs",
    "h.dbEyebrow": "Gameplay › Debuffs", "h.dbJudul": "De<span>buffs</span>", "h.pilihDunia": "World",
    "cerita.ep": "Ep {n}",
    "item.daunSambiloto": "Sambiloto leaf", "item.kristalKabut": "Mist crystal", "item.taringUlar": "Snake fang", "item.cakarKumbang": "Panther claw",
    "item.mutiara": "Glowing pearl", "item.koinBajak": "Pirate coin", "item.intiArca": "Statue core", "item.buluElang": "Stone eagle feather",
    "item.sisikApi": "Fire scale", "item.kerangLaut": "Glowing shell", "item.pecahanArca": "Statue shard", "item.kompasLaut": "Sea Compass",
    "item.sisikNaga": "Dragon Scale", "item.batuPelangi": "Rainbow Stone", "item.mustikaKencana": "Kencana Gem",
    "side.hPenawar": "antidote recipe",
    "toast.penawar": "Antidote recipe learned! Jamu now also cures all debuffs",
    "toast.jalanTerbuka": "A new path has opened!",
    "debuff.racun": "Poison", "debuff.terbakar": "Burn", "debuff.lambat": "Slow", "debuff.lemah": "Weak", "debuff.bingung": "Confused",
    "debuff.info.racun": "Poisoned: health drains slowly. Find a safe zone or ask Pak Joko",
    "debuff.info.terbakar": "Burning: health drains fast. Find a safe zone or ask Pak Joko",
    "debuff.info.lambat": "Slowed: you move slower for a while",
    "debuff.info.lemah": "Weakened: your attacks are weaker for a while",
    "debuff.info.bingung": "Confused: your movement is reversed for a moment!",
    "debuff.sembuhJamu": "Antidote jamu: all debuffs cured", "debuff.sembuhAman": "Safe zone: all debuffs cured",
    "aman.masuk": "Safe zone · monsters can't enter",
    "tantang.tk": "Level {n}", "tantang.saran": "Recommended: Lv {lv}",
    "tantang.terkunci": "Locked · win Level {n} first", "tantang.menang": "Won ✓ · fight again", "tantang.mulai": "Challenge ›",
    "tantang.kunciToast": "Win Level {n} first", "tantang.terbuka": "Level {n} unlocked!",
    "naga.mengamuk": "The Golden Dragon is enraged!",
    "peta.duniaSub": "World map · You are in {area}", "peta.tujuanDunia": "Quest goal is in {dunia} »",
    "h.tantangEyebrow": "Mystic Mirror · Challenge", "h.tantangLead": "Choose a difficulty. Win a level to unlock the next one.", "h.tutupTantang": "Close challenge",
    "cerita.narator": "Story",
    "cerita.lanjut": "Next ›",
    "cerita.hKoin": "+{n} coins",
    "cerita.hJamu": "+{n} jamu",
    "cerita.tujuanBaru": "New goal: {tujuan}",
    "cerita.hudTamat": "<b>The End</b>All four realms are at peace. Free roam!",
    "item.mustikaBumi": "Earth Gem",
    "item.mustikaTirta": "Water Gem",
    "item.mustikaBayu": "Wind Gem",
    "item.kantong": "Stolen pouch",
    "item.sisik": "Crocodile scale",
    "item.taring": "Boar tusk",
    "side.hSenjata": "weapon +1 level",
    "side.hadiah": "Reward",
    "side.lapor": "report to {npc}",
    "toast.misiSelesai2": "Quest complete: {judul}. Report to {npc}",
    "toast.dicopet": "Pickpocketed by a tuyul! −{n} coins",
    "toast.bosMarah": "{nama} is enraged!",
    "toast.lurahTamat": "All of Ki Lurah's quests are done! A Mystic Mirror awakens in Genderuwo Cave.",
    "teka.nPrasasti": "Inscription",
    "teka.nObor": "Torch",
    "teka.nPitutur": "Pitutur Stone",
    "teka.nAltar": "Gem Altar",
    "teka.periksa": "[E] Inspect",
    "teka.prasasti": "Four guardian flames wait to be lit. Follow the journey of the sun: when it is born, when it stands overhead, when it sinks. Then welcome the moon.",
    "teka.prasastiSelesai": "All four flames burn calmly. The way to the inner chamber is open.",
    "teka.oborNyala": "Flame lit ({n}/{max})",
    "teka.oborSalah": "Wrong order... every flame goes out. Read the inscription again.",
    "teka.pituturSelesai": "The stone is silent now. The bridge to the island has risen.",
    "teka.pituturKabut": "Thick mist covers the writing on the stone. Maybe Mbah Tirto knows something.",
    "teka.pituturSalah": "Wrong answer! The mist churns and ghosts appear...",
    "teka.altarSelesai": "The three gems shine on the altar. A stone bridge stretches across the lava.",
    "teka.altarKurang": "Three gem-shaped hollows: green, blue and white. Gems you carry: {n}/{max} ({daftar}).",
    "teka.altarTanya": "The three gems in your bag tremble, as if they want to go home. Place them on the altar?",
    "teka.altarTaruh": "Place the gems",
    "teka.r1": "I am always coming, but I never arrive today. What am I?",
    "teka.r1a": "Tomorrow",
    "teka.r1b": "Yesterday",
    "teka.r1c": "Night",
    "teka.r2": "The more you take from me, the bigger I become. What am I?",
    "teka.r2a": "A hole",
    "teka.r2b": "A stone",
    "teka.r2c": "A shadow",
    "teka.r3": "I have many teeth, but I never bite. What am I?",
    "teka.r3a": "A comb",
    "teka.r3b": "A crocodile",
    "teka.r3c": "A crab",
    "peta.tujuan": "Goal",
    "h.panah": "Goal arrow",
    "h.panahNote": "A gold arrow at the screen edge pointing to your story goal.",
    "toast.mulai": "Meet Resi Wening by the village square",


    // ---- teks HTML (Indonesianya ada langsung di game.html) ----
    "h.petaPetualangan": "Laga Nusantara adventure map",
    "h.koin": "Coins", "h.jamu": "Jamu", "h.jeda": "Pause", "h.petaMini": "Mini map — click to open the big map",
    "h.putar": "Turn your phone sideways for more room",
    "h.bicara": "Talk", "h.hindar": "Dodge", "h.jamuBtn": "Jamu", "h.jurus": "Skill", "h.serang": "Attack",
    "h.memasuki": "Entering",
    "h.eyebrowJudul": "Action adventure",
    "h.lead": "A red mist pours from Mount Geni and the creatures of the forest grow wild. Choose your hero, gather the three gems, and face the Banaspati King.",
    "h.jedaEyebrow": "Paused", "h.jedaJudul": "Take a <span>breather</span>",
    "h.lanjut": "Resume", "h.pengaturan": "Settings", "h.credit": "Credits", "h.menuUtama": "Main menu", "h.keluar": "Quit Game",
    "h.setEyebrow": "Paused › Settings", "h.setJudul": "Set<span>tings</span>",
    "h.bahasa": "Language", "h.kontrol": "Controls", "h.volume": "Volume", "h.layar": "Display", "h.kembali": "← Back",
    "h.bhsEyebrow": "Settings › Language", "h.bhsJudul": "Lang<span>uage</span>",
    "h.volEyebrow": "Settings › Volume", "h.volJudul": "Vol<span>ume</span>",
    "h.musik": "Music", "h.sfx": "Sound effects",
    "h.musKecil": "Lower music", "h.musBesar": "Raise music", "h.sfxKecil": "Lower sound effects", "h.sfxBesar": "Raise sound effects",
    "h.keluarEyebrow": "Paused › Quit", "h.keluarJudul": "Quit <span>game?</span>",
    "h.keluarLead": "Your progress is saved. Choose \"Continue\" later to come back here.",
    "h.keluarYa": "Yes, quit", "h.batal": "Cancel",
    "h.layarEyebrow": "Settings › Display", "h.layarJudul": "Dis<span>play</span>",
    "h.ctlEyebrow": "Settings › Controls", "h.ctlJudul": "Con<span>trols</span>", "h.ctlSentuh": "Phone / touch screen",
    "h.creditEyebrow": "Paused › Credits", "h.creditJudul": "Cre<span>dits</span>",
    "h.cr1": "Idea, design & development", "h.cr2": "Coding assistant",
    "h.cr3": "Graphics", "h.cr3v": "Drawn entirely with code (Canvas 2D), no image files",
    "h.cr4": "Music & sound", "h.cr4v": "Original gamelan tunes in slendro & pelog scales, played with Web Audio",
    "h.cr5": "Fonts", "h.cr6": "Inspiration", "h.cr6v": "Folk tales and culture of the Nusantara archipelago",
    "h.crTerima": "Thank you for playing!",
    "h.dukung": "Support Us", "h.dukungLead": "Enjoying the game? Help its maker keep adding new stories, monsters and areas.",
    "h.petaEyebrow": "Map", "h.tutupPeta": "Close map", "h.areaIni": "This area", "h.petaDunia": "World map", "h.peta": "Map",
    "h.teleport": "Teleport",
    "h.lgKamu": "You", "h.lgWarga": "Villagers", "h.lgKeluar": "Exits", "h.lgMonster": "Monsters", "h.lgBos": "Boss",
    "h.lgTele": "Teleport beacon (click)", "h.lgJalan": "Paths between areas", "h.lgMisi": "Quest goal",
    "h.byeEyebrow": "See you", "h.byeJudul": "Progress <span>saved</span>",
    "h.byeLead": "Close the app from your phone: swipe up / Home button, or close this browser tab.",
    "h.mainLagi": "Play again",
    "h.winEyebrow": "The End · Mist of Mount Geni", "h.winJudul": "Peace <span>restored</span>", "h.lanjutTualang": "Keep adventuring",
  },
};

// Terjemahan data game (bahasa Inggris). Bahasa Indonesia = isi asli di config.js & 04-peta.js.
const DATA_EN = {
  kelas: {
    pendekar: { name: "Warrior", role: "Melee", skill: "Lightning Slash",
      desc: "Three-hit machete combo. Lightning Slash dashes straight through enemies." },
    pemanah: { name: "Archer", role: "Ranged", skill: "Triple Shot",
      desc: "Shoots arrows from afar, auto-aims at the nearest enemy. Triple Shot fires a spread." },
    pendobrak: { name: "Breaker", role: "Tank", skill: "Bulwark",
      desc: "Thick health, heavy hammer blows, iron skin (20% less damage taken). Bulwark blocks attacks with a shield." },
    penyihir: { name: "Mage", role: "Area magic", skill: "Fire Pillar",
      desc: "Fireballs that explode and hit several enemies. Fire Pillar bursts from the ground." },
  },
  monster: { kera: "Wild Monkey", kelelawar: "Bat", babi: "Wild Boar", genderuwo: "Genderuwo",
    hantuKabut: "Mist Ghost", buaya: "Swamp Crocodile", tuyul: "Tuyul", kepiting: "Reef Crab", banaspati: "Banaspati",
    dwarapala: "Dwarapala", buayaPutih: "White Crocodile", rajaBanaspati: "Banaspati King" },
  misi: [
    { title: "Drive Off the Monkeys", offer: "Wild monkeys are wrecking the gardens in the east forest, across the bridge. Please drive off five of them." },
    { title: "Boar Tusks", offer: "Mbok Darmi needs boar tusks for a potion. Wild boars roam the southern meadow. Bring back three tusks." },
    { title: "Guardian of the Cave", offer: "It is time. The Genderuwo in the far east cave is what unsettles every creature in the forest. Defeat it, my child." },
  ],
  area: {
    desa: { nama: "Wanasari Village", sub: "Safe place — no monsters", gerbang: ["Forest →"] },
    alam: { nama: "Forest & Meadow", sub: "Careful, lots of monsters", gerbang: ["← Village", "Cave →", "To Temple", "To Swamp"] },
    gua: { nama: "Genderuwo Cave", sub: "Lair of the forest guardian", gerbang: ["← Exit"] },
    candi: { nama: "Wingit Temple", sub: "Haunted ruins north of the forest · Lv 5+", gerbang: ["To Forest", "To Crater"] },
    rawa: { nama: "Misty Swamp", sub: "Black water & faint whispers · Lv 7+", gerbang: ["To Forest", "Village →"] },
    pesisir: { nama: "Fishing Village", sub: "A village by the sea · Lv 7+", gerbang: ["← Swamp"] },
    kawah: { nama: "Geni Crater", sub: "Summit of the volcano · Lv 11+", gerbang: ["To Temple"] },
  },
  // Cerita utama: terjemahannya ada di tiap langkah (`en`) di src/cerita/

  sampingan: {
    kepiting: { title: "Naughty Crabs", offer: "Reef crabs are wrecking our nets on the south beach. Could you drive off six of them?", done: "The beach is safe again! Here's a reward from the fishermen." },
    sisik: { title: "Crocodile Scales", offer: "Bring me three swamp crocodile scales and I'll reforge your weapon. The crocodiles live in the southern swamp.", done: "Fine scales. Let me reforge your weapon a moment... there, sharper!" },
  },
  obrolan: {
    resi: ["That mist comes from Mount Geni. I can feel it.", "Keep training, child. The enemies ahead will grow stronger.", "Mbok Sum's stall sells good jamu. Don't leave without supplies."],
    tirto: ["This swamp used to be clear, young one. The fish were huge.", "Don't go too near deep water. Swamp crocodiles love to lunge.", "Mist ghosts fear light. Sadly I'm too old to carry a torch."],
    jala: ["The sea is calm. Hope tomorrow's catch is good.", "If you're tired, stop by Mak Ijah's stall.", "Watch out for tuyul. Your purse can suddenly feel light!"],
    kardi: ["Today's waves are perfect for sailing.", "Reef crabs have hard shells. Keep hitting, no mercy!"],
  },
};

function t(key, v) {
  const s = (TEKS[bahasa] && TEKS[bahasa][key]) ?? TEKS.id[key] ?? key;
  return v ? s.replace(/\{(\w+)\}/g, (_, k) => (v[k] ?? "")) : s;
}

// ---------- Teks di HTML ----------
// Teks Indonesia dibaca langsung dari HTML (sekali, saat pertama dimuat).
for (const el of document.querySelectorAll("[data-t]")) TEKS.id[el.dataset.t] ??= el.textContent;
for (const el of document.querySelectorAll("[data-th]")) TEKS.id[el.dataset.th] ??= el.innerHTML;
for (const el of document.querySelectorAll("[data-ta]")) TEKS.id[el.dataset.ta] ??= el.getAttribute("aria-label");
function terapkanHTML() {
  document.documentElement.lang = bahasa;
  for (const el of document.querySelectorAll("[data-t]")) el.textContent = t(el.dataset.t);
  for (const el of document.querySelectorAll("[data-th]")) el.innerHTML = t(el.dataset.th);
  for (const el of document.querySelectorAll("[data-ta]")) el.setAttribute("aria-label", t(el.dataset.ta));
}

// ---------- Data game ----------
// Isi asli (Indonesia) disalin sekali, lalu nama/keterangan diganti sesuai bahasa.
let dataAsli = null;
function terapkanData() {
  if (!dataAsli) {
    dataAsli = {
      kelas: Object.fromEntries(Object.entries(CLASSES).map(([k, c]) => [k, { name: c.name, role: c.role, desc: c.desc, skill: c.skill.name }])),
      monster: Object.fromEntries(Object.entries(MONSTERS).map(([k, m]) => [k, m.name])),
      misi: QUESTS.map((q) => ({ title: q.title, offer: q.offer })),
      area: Object.fromEntries(Object.entries(AREAS).map(([k, a]) => [k, { nama: a.nama, sub: a.sub, gerbang: a.gerbang.map((g) => g.label) }])),
      cerita: CERITA.map((c) => ({ bab: c.bab, judul: c.judul, tujuan: c.tujuan, teks: (c.teks || []).map((x) => x[1]) })),
      dunia: DUNIA.map((d) => d.nama),
      sampingan: Object.fromEntries(SAMPINGAN.map((q) => [q.id, { title: q.title, offer: q.offer, done: q.done }])),
      obrolan: Object.fromEntries(NPC_DATA.filter((n) => n.obrolan).map((n) => [n.id, [...n.obrolan]])),
    };
  }
  const en = bahasa === "en";
  for (const [k, c] of Object.entries(CLASSES)) {
    const s = (en && DATA_EN.kelas[k]) || dataAsli.kelas[k];
    c.name = s.name; c.role = s.role; c.desc = s.desc; c.skill.name = s.skill;
  }
  for (const [k, m] of Object.entries(MONSTERS)) m.name = (en && (DATA_EN.monster[k] || m.nameEn)) || dataAsli.monster[k];
  DUNIA.forEach((d, i) => { d.nama = en ? d.namaEn : dataAsli.dunia[i]; });
  QUESTS.forEach((q, i) => { const s = (en && DATA_EN.misi[i]) || dataAsli.misi[i]; q.title = s.title; q.offer = s.offer; });
  for (const [k, a] of Object.entries(AREAS)) {
    const asli = dataAsli.area[k];
    const s = (en && (DATA_EN.area[k] || (a.namaEn && { nama: a.namaEn, sub: a.subEn, gerbang: a.gerbang.map((g) => g.labelEn) }))) || asli;
    a.nama = s.nama; a.sub = s.sub;
    a.gerbang.forEach((g, i) => { g.label = (s.gerbang && s.gerbang[i]) || (en && g.labelEn) || asli.gerbang[i]; });
  }
  CERITA.forEach((c, i) => {
    const s = (en && c.en) || dataAsli.cerita[i];
    c.bab = s.bab; c.judul = s.judul; c.tujuan = s.tujuan;
    (c.teks || []).forEach((x, j) => { x[1] = (s.teks && s.teks[j]) || dataAsli.cerita[i].teks[j]; });
  });
  for (const q of SAMPINGAN) { const s = (en && (DATA_EN.sampingan[q.id] || q.en)) || dataAsli.sampingan[q.id]; q.title = s.title; q.offer = s.offer; q.done = s.done; }
  for (const n of NPC_DATA) if (n.obrolan) n.obrolan = (en && (DATA_EN.obrolan[n.id] || n.obrolanEn)) || dataAsli.obrolan[n.id];
}

// Ganti bahasa & segarkan semua yang sedang tampil
function setBahasa(b) {
  bahasa = b === "en" ? "en" : "id";
  store.set(BAHASA_KEY, bahasa);
  terapkanSemua();
}
function terapkanSemua() {
  terapkanData();
  terapkanHTML();
  buildKeysHint();
  for (const n of NPCS) {
    if (n.kind === "cermin") n.name = t("cermin.nama");
    if (n.kind === "teleport") n.name = t("tele.nama");
    if (n.namaKey) n.name = t(n.namaKey, { warna: n.simbol ? t("warna." + n.simbol) : "" });
  }
  if (area) $("areaName").textContent = area.nama;
  if (mode === "select") buildSelect();
  if (S && P) refreshHud(true);
  refreshAudioButtons(); refreshLayar(); refreshBahasa(); refreshPanah();
  if (pauseView === "control") buildControls();
  if (S) isiStatJeda();
  resetPetaDunia();   // peta dunia dibuat ulang (nama area)
}
// Tombol di halaman Bahasa
function refreshBahasa() {
  for (const b of document.querySelectorAll("[data-bahasa]")) b.setAttribute("aria-pressed", String(b.dataset.bahasa === bahasa));
}
for (const b of document.querySelectorAll("[data-bahasa]")) b.addEventListener("click", () => setBahasa(b.dataset.bahasa));
terapkanHTML();
