// =====================================================================
// KONFIGURASI LAGA NUSANTARA
// ---------------------------------------------------------------------
// Semua angka & teks yang boleh kamu ubah ada di file ini.
// File game.html hanya berisi "mesin" game (gerak, gambar, AI, dll).
// Setelah mengubah, simpan lalu refresh browser (atau jalankan ./build.sh).
// =====================================================================

// ---------------------------------------------------------------------
// 1. KONTROL KEYBOARD
// Isi dengan nama tombol. Huruf ditulis kecil ("d"), tombol khusus pakai
// nama resminya: "ArrowUp", "Enter", "Escape", " " (spasi), "Shift".
// Satu aksi boleh punya beberapa tombol: ["e", "Enter"].
// ---------------------------------------------------------------------
const KONTROL = {
  atas: ["ArrowUp"],
  bawah: ["ArrowDown"],
  kiri: ["ArrowLeft"],
  kanan: ["ArrowRight"],
  serang: ["d"],
  jurus: ["s"],
  hindar: ["a"],
  jamu: ["w"],
  bicara: ["e", "Enter"],
  jeda: ["Escape", "p"],
  peta: ["m"],            // buka / tutup peta besar
  misi: ["j"],            // buka / tutup daftar misi (pilih misi yang dilacak)
  jurus2: ["f"],          // jurus di slot ke-2 (pilih di halaman Jurus: tombol ⚔ / K)
  pamungkas: ["r"],       // jurus pamungkas (saat bar Tenaga Dalam penuh)
  menuJurus: ["k"],       // buka halaman Jurus & Poin Jurus
  menuJimat: ["i"],       // buka halaman Jimat
  menuStatus: ["Tab", "c"], // buka / tutup halaman Status Karakter
  musik: ["n"],           // nyalakan / matikan musik
};

// ---------------------------------------------------------------------
// 2. ATURAN UMUM
// Waktu dalam detik, jarak dalam piksel (1 petak = 40 piksel),
// peluang dari 0 sampai 1 (0.25 = 25%).
// ---------------------------------------------------------------------
const ATURAN = {
  awal: { koin: 10, jamu: 3 },            // modal saat mulai baru

  level: {
    expDasar: 32, expPangkat: 1.55,       // EXP untuk naik level = expDasar × level^expPangkat (dulu 25 & 1.45: ±1,5-2× lebih lambat)
    maks: 80,                             // level tertinggi karakter; setelah itu EXP tidak bertambah lagi
    nyawaPerLevel: 14,                    // tambahan nyawa tiap naik level
    seranganPerLevel: 2,                  // tambahan serangan tiap naik level
    seranganPerSenjata: 3,                // tambahan serangan tiap asah senjata
  },

  toko: {
    hargaJamu: 15,
    hargaAsah: 40,                        // asah ke-1 = 40, ke-2 = 80, ke-3 = 120, ...
  },

  jamuPulih: 0.4,                         // jamu memulihkan 40% nyawa maksimal
  jamuJeda: 10,                           // detik jeda setelah minum jamu sebelum bisa minum lagi (65-jamu-jeda.js)

  // hindar (berguling) punya `lapis` muatan. Tiap lapis terisi lagi setelah `isiUlang` detik (satu per satu).
  // jeda = jarak minimal antar-gulingan supaya 2 lapis bisa dipakai beruntun.
  // versi game (tampil di layar judul & menu jeda) & halaman laporan masukan (74-versi-masukan.js).
  // Kirim Masukan membuka aplikasi email pemain dengan subjek & isi laporan yang sudah terisi.
  versi: "0.9.1-beta",
  masukan: { email: "laganusantara28@gmail.com" },
  // tingkat kesulitan (71-kesulitan.js): keMusuh = damage pemain ke musuh, dariMusuh = damage musuh
  // ke pemain, exp & koin = hadiah dari monster
  kesulitan: {
    santai: { keMusuh: 1.6, dariMusuh: 0.55, exp: 1.4, koin: 1.5 },
    normal: { keMusuh: 1, dariMusuh: 1, exp: 1, koin: 1 },
    sulit:  { keMusuh: 0.8, dariMusuh: 1.3, exp: 1.15, koin: 1.2 },
  },
  // area bos: seberapa jauh bos (cerita & Cermin Gaib) mengejar dari sarangnya sebelum menyerah & pulang.
  // jarak = max(jarak dasar bos × kali, minimal) piksel (1 petak = 40 px)
  areaBos: { kali: 1.8, minimal: 820 },
  // hero jarak dekat (76-melee.js): lapis hindar tambahan, kebal setelah jurus terjang,
  // Kulit Baja (pasif Pendobrak), perisai jurus Benteng (bagian dari nyawa maksimal)
  melee: { kelas: ["pendekar", "pendobrak", "jawara"], lapisTambah: 1, kebalKilat: 1, kebalBalik: 1, kebalBalik3: 1.5,
    tahanKelas: { pendekar: 0.1, pendobrak: 0.2 },   // pasif: Kuda-kuda Pendekar -10%, Kulit Baja Pendobrak -20% damage diterima
    perisai: 0.3, perisai3: 0.4, bentengTahan: 0.5, perisaiDobrak: 0.15 },
  hindar: { lama: 0.22, jeda: 0.3, kecepatan: 470, kebal: 0.28, lapis: 2, isiUlang: 5 },

  kritis: { peluang: 0.12, kali: 1.6 },   // pukulan kritis: peluang & pengali damage

  pingsan: { koinHilang: 0, lama: 2.2 },  // saat nyawa habis: koin TIDAK hilang (drop koin sudah dikurangi)

  jarakBicara: 84,

  // Cermin Gaib di sarang bos: muncul setelah bos pernah dikalahkan.
  // Sentuh cermin → pilih tingkat kesulitan 1-7 → bos muncul lagi.
  // Tingkat N baru bisa dipilih setelah tingkat N-1 dimenangkan.
  cermin: {
    jeda: 30,                             // detik sampai cermin bisa dipakai lagi
    tingkat: 7,                           // jumlah tingkat kesulitan
    nyawaTambah: 0.85,                    // tiap tingkat: nyawa bos +85%
    seranganTambah: 0.32,                 // tiap tingkat: serangan bos +32%
    cepatTambah: 0.08,                    // tiap tingkat: gerak bos +8%
    seranganCepatTambah: 0.06,            // tiap tingkat: kecepatan serang bos +6%
    levelTambah: 4,                       // level karakter yang disarankan naik 4 tiap tingkat
    koin: 0.2,                            // hadiah koin = koin bos × 0.2 × tingkat
    exp: 0.3,                             // hadiah EXP  = EXP bos × 0.3 × tingkat
    // hadiah equipment (jimat) tiap tingkat — pasti didapat setiap menang. "legenda" = jimat khas bos itu.
    // Jimat yang sudah dimiliki otomatis dilebur jadi Serpih Pusaka (untuk menempa).
    jimat: { 1: ["biasa"], 2: ["biasa"], 3: ["biasa", "langka"], 4: ["biasa", "langka"], 5: ["biasa", "langka"], 6: ["langka", "legenda"], 7: ["langka", "legenda"] },
  },

  // Debuff = efek buruk dari serangan monster tertentu (lihat `debuff` di MONSTERS).
  //   racun    : nyawa berkurang pelan (bagian dari nyawa maksimal per detik)
  //   terbakar : seperti racun tapi lebih cepat
  //   lambat   : jalan lebih pelan
  //   lemah    : serangan lebih lemah
  //   bingung  : arah gerak terbalik
  // Debuff hilang sendiri setelah beberapa detik, di zona aman, atau dengan jamu
  // (setelah belajar resep penawar dari Pak Joko).
  debuff: {
    racun:    { warna: "#7bd64a", perDetik: 0.012 },
    terbakar: { warna: "#ff7b39", perDetik: 0.025 },
    lambat:   { warna: "#7fb2ff", kali: 0.55 },
    lemah:    { warna: "#b88cff", kali: 0.6 },
    bingung:  { warna: "#ff8fd8" },
    lumpuh:   { warna: "#ffe066", kebalSetelah: 2.5 },   // stun: tidak bisa bergerak & menyerang; setelahnya kebal lumpuh sebentar
    berdarah: { warna: "#e5484d", perDetik: 0.018, tumpukMaks: 3 },   // damage over time, bisa bertumpuk sampai 3 (tiap tumpukan menambah sakit)
  },

  // Zona aman: monster tidak bisa masuk, peluru musuh lenyap, debuff hilang, nyawa pulih pelan.
  // Ada di area aman (desa, kota) dan di sekitar setiap mesin teleport.
  zonaAman: {
    radius: 3.2,                          // jari-jari di sekitar mesin teleport (petak)
    pulihPerDetik: 0.03,                  // nyawa pulih 3% per detik
    // bendera di sekeliling mesin teleport hanya dipasang di area-area ini
    benderaTeleport: ["pesisir"],
  },

  // Peta besar: zoom paling dekat (1 = seluruh peta terlihat, 4 = 4 kali lebih dekat)
  peta: {
    zoomMaks: 4,
  },

  // Mesin Teleport (tiang bendera). Berdiri di dekatnya = nyawa pulih memakai energi mesin.
  // Klik mesin di peta besar (tombol M) untuk pindah ke sana.
  // (pengaturan mesin teleport ada di bawah)

  // Tombol "Dukung Kami" di halaman Credit. Isi dengan link donasi kamu,
  // contoh "https://trakteer.id/namakamu" atau "https://saweria.co/namakamu".
  // Selama kosong, tombol tetap tampil tapi hanya memberi tahu bahwa link belum diisi.
  dukung: {
    tautan: "https://saweria.co/hilmyaceng",
    lamaNotif: 10,                        // notif "Dukung Kami" tiap bab selesai hilang sendiri setelah 10 detik
  },

  teleport: {
    // mesin teleport hanya dipasang di desa/kota (bukan di hutan, gua, atau sarang bos)
    area: ["desa", "pesisir", "bandar", "desaApung", "awan", "perkemahan"],
    energiMaks: 1000,                     // energi maksimal tiap mesin (1 energi = 1 nyawa)
    isiUlangPoin: 1,                      // energi bertambah sebanyak ini...
    isiUlangDetik: 300,                   // ...setiap sekian detik (300 = 5 menit), walau game ditutup
    pulihPerDetik: 30,                    // kecepatan nyawa pulih saat berdiri di dekat mesin
    jarak: 70,                            // seberapa dekat (piksel) agar nyawa pulih
  },                        // seberapa dekat ke NPC agar bisa bicara

  monster: {
    munculLagi: 16,                       // detik sampai monster biasa muncul lagi
    dropJamu: 0.08,                       // peluang monster menjatuhkan jamu
    // koin dari monster kecil (bukan bos): hanya kadang jatuh & jumlahnya dikurangi,
    // supaya koin terasa hasil "farming". Rata-rata = peluang × kali ≈ 28% dari dulu.
    koinPeluang: 0.4,                     // peluang monster kecil menjatuhkan koin
    koinKali: 0.7,                        // pengali jumlah koin monster kecil
    dropTaring: 0.6,                      // peluang babi menjatuhkan taring (saat misi 2)
    dropKantong: 0.45,                    // peluang tuyul menjatuhkan kantong curian (cerita bab 3)
    dropSisik: 0.5,                       // peluang buaya rawa menjatuhkan sisik (misi Mbah Tirto)
    // barang misi lain diatur di langkah cerita / misi sampingan: `dari` (monster) & `peluang`
  },

  petaSeed: 20251119,                     // ganti angka ini = bentuk peta berubah

  audio: {
    musik: 0.6,                           // volume awal musik (0 = diam, 1 = penuh). Pemain bisa ubah di menu jeda
    sfx: 0.9,                             // volume awal efek suara
    suara: 0.8,                           // volume awal suara makhluk (monster, bos, hero, ocehan NPC)
    penguat: 3.0,                         // pengeras keseluruhan: makin besar makin keras (1 = tanpa penguat)
  },
};

// Pertarungan lanjutan (48-56 di js/)
ATURAN.tenaga = {                         // bar Tenaga Dalam untuk jurus pamungkas
  maks: 100, bukaLevel: 5,                // pamungkas terbuka mulai level 5
  pukul: 1.6, dipukul: 4, bunuh: 3,       // tambahan tenaga tiap memukul / dipukul / mengalahkan musuh
  sempurna: 15, tangkis: 20,              // tambahan tenaga dari hindar sempurna & tangkis
};
ATURAN.hindarSempurna = {                 // berguling TEPAT saat serangan datang
  jendela: 0.2,                           // detik pertama gulingan yang dihitung "tepat"
  lambat: 0.3, lamaLambat: 0.6,           // waktu melambat jadi 30% selama 0.6 detik
};
// Hindar TANPA arah = aksi khas tiap hero (87-hindar-diam.js). Pendobrak = tangkis biasa.
ATURAN.hindarDiam = {
  aksi: { pendobrak: "tangkis", pendekar: "balas", pemanah: "lompat", penyihir: "kedip", dalang: "wayang", tabib: "sembur", jawara: "bayang" },
  bayangJarak: 230,                                             // Lebur Bayang (Jawara)
  balasKali: 1.8, balasLumpuh: 0.7, balasLumpuhBos: 0.25,      // Tebas Balas (Pendekar)
  lompatLama: 0.32, lompatKritisJarak: 160,                     // Lompat Mundur (Pemanah)
  kedipJarak: 170, esR: 95, esLambat: 2, esKali: 0.6,           // Kedip (Penyihir)
};
ATURAN.tangkis = {                        // Hindar TANPA arah = kuda-kuda tangkis
  jendela: 0.32, jeda: 0.75,              // lama kuda-kuda & jeda sebelum bisa menangkis/berguling lagi
  lumpuhMusuh: 1.6, lumpuhBos: 0.5,       // musuh yang ditangkis jadi lumpuh
  balas: 1.5,                             // serangan balik = serangan × 1.5
};
ATURAN.poinJurus = {
  rankMaks: 10,                           // tiap jurus/pasif bisa dinaikkan sampai 10 (★3 & ★5 membuka kemampuan, ★10 = Mahir)
  damagePerRank: 0.12, cdPerRank: 0.04,   // tiap rank: damage +12%, jeda -4%
  mahirDamage: 0.25, mahirCd: 0.1, cdMin: 0.35,   // ★10 Mahir: damage +25% & jeda -10% tambahan; jeda tidak bisa di bawah 35%
  resetHarga: 60,                         // atur ulang poin = 60 koin × level
};
ATURAN.jimat = {
  slot: 2, slotTambah: 25, slotTambah2: 50,   // 2 slot jimat; slot ke-3 terbuka di level 25, slot ke-4 (maksimal) di level 50
  bintangMaks: 5, perBintang: 0.25,       // tiap bintang: efek +25%
  tempaKoin: [60, 180, 500],              // biaya tempa (× bintang sekarang): biasa, langka, legenda
  tempaSerpih: [3, 6, 12],
  serpihGanda: [2, 5, 15],                // jimat kembar dilebur jadi serpih pusaka
  dropMonster: { serpih: 0.03, biasa: 0.004, langka: 0.0012 },   // peluang drop dari monster biasa
};
ATURAN.skalaMonster = {
  // Monster ikut menguat sesuai level pemain, tapi tidak lebih dari `batasAtas` level di atas level aslinya
  // (Kera Liar Lv 1 → paling tinggi Lv 4). Jadi monster area awal tetap terasa lemah saat kamu sudah kuat.
  batasAtas: 3,
  // EXP dari monster yang jauh lebih lemah (selisih > expLemahMulai level) berkurang expLemahPerLv tiap level,
  // paling sedikit expLemahMin (10%). Bos tidak terkena. Supaya tidak "farming" di area awal.
  expLemahMulai: 5, expLemahPerLv: 0.15, expLemahMin: 0.1,
  nyawaPerLv: 0.16, seranganPerLv: 0.1, hadiahPerLv: 0.08,
  kaliSerang: 1.15, kaliNyawa: 1.1,       // semua monster sedikit lebih galak dari dulu
  // makin tinggi level asli monster (dunia berikutnya), makin tebal nyawa & makin sakit pukulannya:
  // nyawa × (1 + nyawaPerLvAsli × level asli), serangan × (1 + seranganPerLvAsli × level asli)
  nyawaPerLvAsli: 0.012, seranganPerLvAsli: 0.007,
  // bos menguat lebih cepat dari monster biasa (berlaku juga untuk bos Cermin Gaib)
  bosNyawaPerLv: 0.15, bosSeranganPerLv: 0.1, bosNyawaPerLvAsli: 0.02, bosSeranganPerLvAsli: 0.01,
  // bos juga makin cepat tiap level menguat: gerak +2% & kecepatan serang +2.5% per level (paling cepat ×1.4)
  // kecepatan serang = semua ancang-ancang, jeda antar-serangan & pola bos berjalan lebih cepat
  bosGerakPerLv: 0.035, bosSeranganCepatPerLv: 0.025, bosCepatMaks: 1.5,
  bosGerakDasar: 1.4,                     // semua bos 40% lebih cepat bergerak dari angka di MONSTERS (supaya tidak gampang dikabur)
  // selisih level: musuh yang levelnya di atasmu lebih sulit dilukai & lebih sakit pukulannya
  kurangiPerLv: 0.05, tambahPerLv: 0.06, selisihMaks: 10,
  // monster dunia 2+ atau yang sudah menguat 4 level: lebih cepat & kadang memukul dua kali
  trikLevel: 13, trikSelisih: 4, serangGanda: 0.3,
};

// ---------------------------------------------------------------------
// 3. KELAS HERO
// hp = nyawa, atk = serangan, speed = kecepatan jalan.
// attack.cd / skill.cd = jeda (detik) sebelum bisa dipakai lagi.
// skill.mult = pengali damage jurus. color/accent = warna baju.
// type serangan: "melee" (dekat) atau "proj" (peluru: "arrow"/"fire").
// type jurus: "dash", "volley", "quake", "pillar" (diatur di game.html).
// ---------------------------------------------------------------------
const CLASSES = {
  pendekar: {
    name: "Pendekar", role: "Jarak dekat", color: "#2a9d8f", accent: "#f4b942", weapon: "golok",
    hp: 120, atk: 10, speed: 190,
    desc: "Combo golok tiga tebasan, kuda-kuda kokoh (damage diterima -10%). Jurus Tebasan Kilat menerjang menembus musuh lalu kebal sesaat.",
    attack: { type: "melee", range: 64, arc: 1.1, cd: 0.3, combo: [1, 1, 1.7] },
    skill: { name: "Tebasan Kilat", type: "dash", cd: 5, mult: 2.4, dist: 230 },
  },
  pemanah: {
    name: "Pemanah", role: "Jarak jauh", color: "#7fb069", accent: "#e9d3a9", weapon: "bow",
    hp: 90, atk: 9, speed: 205,
    desc: "Panah dari kejauhan, otomatis membidik musuh terdekat. Jurus Panah Tiga menyebar.",
    attack: { type: "proj", proj: "arrow", speed: 600, range: 400, cd: 0.38 },
    skill: { name: "Panah Tiga", type: "volley", cd: 4.5, mult: 1.4 },
  },
  pendobrak: {
    name: "Pendobrak", role: "Tank", color: "#b5651d", accent: "#e5484d", weapon: "hammer",
    hp: 170, atk: 13, speed: 165,
    desc: "Nyawa tebal, pukulan palu berat, kulit baja (damage diterima -20%). Jurus Benteng menahan serangan dengan perisai.",
    attack: { type: "melee", range: 72, arc: 1.35, cd: 0.5, combo: [1, 1, 1.9] },
    skill: { name: "Benteng", type: "guard", cd: 10 },
  },
  penyihir: {
    name: "Penyihir", role: "Sihir area", color: "#8e5bd6", accent: "#ff9f43", weapon: "staff",
    hp: 95, atk: 12, speed: 185,
    desc: "Bola api yang meledak mengenai beberapa musuh. Jurus Pilar Api menyembur dari tanah.",
    attack: { type: "proj", proj: "fire", speed: 400, range: 360, cd: 0.55, splash: 46 },
    skill: { name: "Pilar Api", type: "pillar", cd: 6, mult: 3, dist: 150, r: 70 },
  },
};

// ---------------------------------------------------------------------
// 4. MONSTER
// lv = level yang ditampilkan, r = besar badan, h = tinggi gambar,
// exp/gold = hadiah ([min, max] koin), range = jarak serang,
// wind = lama ancang-ancang (tanda merah), cd = jeda antar serangan,
// aggro = jarak mulai mengejar. fly/charge/boss = perilaku khusus.
// ---------------------------------------------------------------------
// debuff = { jenis, peluang (0-1) tiap kena serangan, lama (detik) } → lihat ATURAN.debuff
const MONSTERS = {
  kera:      { name: "Kera Liar",  lv: 1, hp: 32,  atk: 6,  speed: 115, r: 14, h: 34, exp: 9,   gold: [1, 4],    range: 26,  wind: 0.4,  cd: 1.1, aggro: 190 },
  kelelawar: { name: "Kelelawar",  lv: 3, hp: 30,  atk: 8,  speed: 165, r: 12, h: 48, exp: 13,  gold: [2, 5],    range: 22,  wind: 0.3,  cd: 1.0, aggro: 230, fly: true },
  babi:      { name: "Babi Hutan", lv: 4, hp: 75,  atk: 12, speed: 95,  r: 18, h: 30, exp: 20,  gold: [3, 8],    range: 160, wind: 0.6,  cd: 1.6, aggro: 200, charge: true },
  genderuwo: { name: "Genderuwo",  lv: 8, hp: 700, atk: 20, speed: 85,  r: 30, h: 84, exp: 220, gold: [90, 130], range: 50,  wind: 0.75, cd: 1.3, aggro: 330, boss: true, debuff: { jenis: "lemah", peluang: 0.35, lama: 5 } },

  // ---- monster baru (cerita utama) ----
  // kedip  = berteleportasi ke dekat pemain setiap sekian detik
  // copet  = [min, max] koin yang dicuri saat memukul; dikembalikan kalau tuyulnya kalah
  // tembak = menembak bola api: cd (detik), speed, jarak
  hantuKabut: { name: "Hantu Kabut",     lv: 6,  hp: 55,  atk: 11, speed: 115, r: 14, h: 46, exp: 24, gold: [3, 8],   range: 24,  wind: 0.45, cd: 1.2, aggro: 220, fly: true, kedip: 3.5, debuff: { jenis: "lambat", peluang: 0.3, lama: 3 } },
  buaya:      { name: "Buaya Rawa",      lv: 7,  hp: 110, atk: 15, speed: 75,  r: 20, h: 22, exp: 30, gold: [4, 10],  range: 170, wind: 0.7,  cd: 1.8, aggro: 200, charge: true, debuff: { jenis: "lambat", peluang: 0.3, lama: 2.5 } },
  tuyul:      { name: "Tuyul",           lv: 5,  hp: 38,  atk: 5,  speed: 170, r: 10, h: 28, exp: 16, gold: [1, 3],   range: 20,  wind: 0.25, cd: 0.9, aggro: 210, copet: [3, 7] },
  kepiting:   { name: "Kepiting Karang", lv: 8,  hp: 150, atk: 14, speed: 65,  r: 18, h: 22, exp: 34, gold: [5, 12],  range: 30,  wind: 0.55, cd: 1.4, aggro: 170 },
  banaspati:  { name: "Banaspati",       lv: 11, hp: 85,  atk: 17, speed: 105, r: 14, h: 48, exp: 46, gold: [8, 15],  range: 24,  wind: 0.4,  cd: 1.3, aggro: 300, fly: true, tembak: { cd: 2.2, speed: 260, jarak: 330 }, debuff: { jenis: "terbakar", peluang: 0.3, lama: 3 } },

  // ---- bos baru (pola serangannya ada di js/26-monster-baru.js, lihat `ai`) ----
  dwarapala:     { name: "Dwarapala",      lv: 10, hp: 1100, atk: 22, speed: 70, r: 34, h: 100, exp: 300, gold: [120, 160], range: 56, wind: 0.8, cd: 1.4, aggro: 340, boss: true, ai: "dwarapala", debuff: { jenis: "lambat", peluang: 0.35, lama: 3 } },
  buayaPutih:    { name: "Buaya Putih",    lv: 13, hp: 1500, atk: 26, speed: 90, r: 36, h: 44,  exp: 450, gold: [150, 200], range: 60, wind: 0.8, cd: 1.3, aggro: 360, boss: true, ai: "buayaPutih", debuff: { jenis: "lambat", peluang: 0.4, lama: 3 } },
  rajaBanaspati: { name: "Raja Banaspati", lv: 16, hp: 2400, atk: 30, speed: 85, r: 34, h: 110, exp: 800, gold: [250, 320], range: 60, wind: 0.7, cd: 1.2, aggro: 400, boss: true, ai: "rajaBanaspati", fly: true, debuff: { jenis: "terbakar", peluang: 0.45, lama: 4 } },

  // ---- Dunia 2 · Kepulauan Segara ----
  ularWelang:     { name: "Ular Welang",      nameEn: "Welang Snake",      lv: 13, hp: 120, atk: 18, speed: 130, r: 13, h: 20, exp: 55,  gold: [8, 16],  range: 110, wind: 0.45, cd: 1.3, aggro: 220, charge: true, debuff: { jenis: "racun", peluang: 0.4, lama: 5 } },
  uburUbur:       { name: "Ubur-ubur Api",    nameEn: "Fire Jellyfish",    lv: 14, hp: 110, atk: 16, speed: 80,  r: 14, h: 46, exp: 60,  gold: [8, 15],  range: 26,  wind: 0.5,  cd: 1.4, aggro: 200, fly: true, kedip: 4.5, debuff: { jenis: "bingung", peluang: 0.35, lama: 3 } },
  harimauKumbang: { name: "Harimau Kumbang",  nameEn: "Black Panther",     lv: 15, hp: 200, atk: 24, speed: 150, r: 18, h: 34, exp: 75,  gold: [10, 20], range: 30,  wind: 0.35, cd: 1.0, aggro: 260, debuff: { jenis: "lemah", peluang: 0.3, lama: 5 } },
  hantuBajak:     { name: "Hantu Bajak Laut", nameEn: "Ghost Pirate",      lv: 16, hp: 160, atk: 20, speed: 95,  r: 15, h: 48, exp: 80,  gold: [12, 24], range: 26,  wind: 0.4,  cd: 1.2, aggro: 300, tembak: { cd: 2.4, speed: 280, jarak: 320, warna: "#c9d6e3" }, debuff: { jenis: "lambat", peluang: 0.35, lama: 3 } },
  silumanUlar:    { name: "Siluman Ular",     nameEn: "Serpent Spirit",    lv: 18, hp: 4000, atk: 34, speed: 95, r: 34, h: 74,  exp: 1100, gold: [300, 380], range: 60, wind: 0.8, cd: 1.2, aggro: 380, boss: true, ai: "umum",
    pola: ["sembur", "terjang", "hujan"], anak: "ularWelang", jenisHujan: "racun", warnaPeluru: "#7bd64a", debuff: { jenis: "racun", peluang: 0.5, lama: 6 } },
  panglimaKarang: { name: "Panglima Karang",  nameEn: "Coral Warlord",     lv: 21, hp: 5200, atk: 38, speed: 85, r: 36, h: 96,  exp: 1500, gold: [380, 460], range: 62, wind: 0.8, cd: 1.2, aggro: 380, boss: true, ai: "umum",
    pola: ["hantam", "hujan", "terjang", "sembur"], anak: "hantuBajak", jenisHujan: "air", warnaPeluru: "#6fd3ff", debuff: { jenis: "lambat", peluang: 0.45, lama: 3 } },

  // ---- Dunia 3 · Negeri Awan ----
  arcaHidup:      { name: "Arca Hidup",       nameEn: "Living Statue",     lv: 20, hp: 380, atk: 30, speed: 60,  r: 20, h: 58, exp: 120, gold: [15, 30], range: 150, wind: 0.7,  cd: 1.8, aggro: 220, charge: true, debuff: { jenis: "lemah", peluang: 0.4, lama: 5 } },
  elangBatu:      { name: "Elang Batu",       nameEn: "Stone Eagle",       lv: 21, hp: 150, atk: 26, speed: 190, r: 14, h: 52, exp: 105, gold: [12, 25], range: 24,  wind: 0.3,  cd: 0.9, aggro: 300, fly: true, debuff: { jenis: "bingung", peluang: 0.2, lama: 2.5 } },
  anakNaga:       { name: "Anak Naga",        nameEn: "Dragon Whelp",      lv: 23, hp: 240, atk: 30, speed: 110, r: 16, h: 54, exp: 140, gold: [18, 34], range: 26,  wind: 0.4,  cd: 1.2, aggro: 320, fly: true, tembak: { cd: 2, speed: 300, jarak: 340 }, debuff: { jenis: "terbakar", peluang: 0.35, lama: 3 } },
  kelabang:       { name: "Kelabang Raksasa", nameEn: "Giant Centipede",   lv: 25, hp: 6500, atk: 42, speed: 120, r: 34, h: 44, exp: 2000, gold: [450, 560], range: 60, wind: 0.7, cd: 1.1, aggro: 400, boss: true, ai: "umum",
    pola: ["terjang", "sembur", "terjang", "hujan"], anak: "elangBatu", jenisHujan: "racun", warnaPeluru: "#7bd64a", debuff: { jenis: "racun", peluang: 0.5, lama: 6 } },
  naga:           { name: "Naga Kencana",     nameEn: "Kencana the Golden Dragon", lv: 28, hp: 10000, atk: 46, speed: 90, r: 58, h: 150, exp: 4000, gold: [700, 900], range: 80, wind: 0.8, cd: 1.1, aggro: 520, boss: true, ai: "naga", jarakPulang: 900,
    anak: "anakNaga", debuff: { jenis: "terbakar", peluang: 0.5, lama: 4 } },

  // ---- Bab 6-10: bayangan Kalamurka (dunia 1-4) ----
  tikusSawah:     { name: "Tikus Sawah Raksasa", nameEn: "Giant Paddy Rat", lv: 28, hp: 300, atk: 36, speed: 170, r: 12, h: 18, exp: 170, gold: [18, 32], range: 22, wind: 0.3, cd: 0.8, aggro: 240, debuff: { jenis: "racun", peluang: 0.25, lama: 4 } },
  bayangan:       { name: "Bayangan",         nameEn: "Shade",             lv: 30, hp: 340, atk: 40, speed: 130, r: 14, h: 50, exp: 200, gold: [20, 36], range: 26, wind: 0.4, cd: 1.1, aggro: 280, fly: true, kedip: 3.5, debuff: { jenis: "lemah", peluang: 0.35, lama: 5 } },
  jerangkong:     { name: "Jerangkong",       nameEn: "Skeleton",          lv: 30, hp: 420, atk: 42, speed: 100, r: 15, h: 52, exp: 210, gold: [22, 40], range: 30, wind: 0.45, cd: 1.2, aggro: 260, tembak: { cd: 2.8, speed: 300, jarak: 300, warna: "#e9e2c8" }, debuff: { jenis: "lambat", peluang: 0.3, lama: 3 } },
  belutListrik:   { name: "Belut Listrik",    nameEn: "Electric Eel",      lv: 32, hp: 380, atk: 44, speed: 120, r: 14, h: 20, exp: 230, gold: [24, 42], range: 120, wind: 0.5, cd: 1.4, aggro: 230, charge: true, debuff: { jenis: "bingung", peluang: 0.35, lama: 3 } },
  rohAngin:       { name: "Roh Angin",        nameEn: "Wind Spirit",       lv: 35, hp: 420, atk: 46, speed: 170, r: 15, h: 52, exp: 260, gold: [26, 46], range: 26, wind: 0.35, cd: 1.0, aggro: 300, fly: true, kedip: 4, debuff: { jenis: "bingung", peluang: 0.3, lama: 3 } },
  prajuritBayang: { name: "Prajurit Bayang",  nameEn: "Shadow Soldier",    lv: 38, hp: 700, atk: 52, speed: 105, r: 17, h: 58, exp: 320, gold: [30, 52], range: 150, wind: 0.6, cd: 1.5, aggro: 260, charge: true, debuff: { jenis: "lemah", peluang: 0.4, lama: 5 } },
  lelembut:       { name: "Lelembut",         nameEn: "Wraith",            lv: 39, hp: 480, atk: 50, speed: 110, r: 14, h: 52, exp: 330, gold: [30, 54], range: 26, wind: 0.4, cd: 1.2, aggro: 330, fly: true, tembak: { cd: 2, speed: 300, jarak: 340, warna: "#b88cff" }, debuff: { jenis: "racun", peluang: 0.35, lama: 5 } },
  rajaJerangkong: { name: "Raja Jerangkong",  nameEn: "Skeleton King",     lv: 31, hp: 14000, atk: 52, speed: 90, r: 34, h: 104, exp: 4500, gold: [900, 1100], range: 62, wind: 0.8, cd: 1.2, aggro: 380, boss: true, ai: "umum",
    pola: ["hantam", "sembur", "hujan", "terjang"], anak: "jerangkong", jenisHujan: "batu", warnaPeluru: "#e9e2c8", debuff: { jenis: "lambat", peluang: 0.45, lama: 3 } },
  guritaRaksasa:  { name: "Gurita Raksasa",   nameEn: "Giant Octopus",     lv: 34, hp: 17000, atk: 56, speed: 70, r: 46, h: 84, exp: 5500, gold: [1000, 1300], range: 70, wind: 0.8, cd: 1.2, aggro: 380, boss: true, ai: "umum",
    pola: ["sembur", "hujan", "hantam", "sembur"], anak: "belutListrik", jenisHujan: "air", warnaPeluru: "#3a2a55", debuff: { jenis: "bingung", peluang: 0.4, lama: 3 } },
  rajawaliPetir:  { name: "Rajawali Petir",   nameEn: "Thunder Hawk",      lv: 37, hp: 20000, atk: 60, speed: 120, r: 36, h: 92, exp: 6500, gold: [1100, 1400], range: 60, wind: 0.7, cd: 1.1, aggro: 400, boss: true, ai: "umum", fly: true,
    pola: ["terjang", "hujan", "sembur", "terjang"], anak: "rohAngin", jenisHujan: "petir", warnaPeluru: "#ffe066", debuff: { jenis: "bingung", peluang: 0.35, lama: 3 } },
  penjagaMenara:  { name: "Penjaga Menara",   nameEn: "Tower Warden",      lv: 41, hp: 26000, atk: 66, speed: 85, r: 38, h: 112, exp: 8000, gold: [1300, 1600], range: 66, wind: 0.8, cd: 1.1, aggro: 400, boss: true, ai: "umum",
    pola: ["hantam", "terjang", "sembur", "hujan"], anak: "prajuritBayang", jenisHujan: "batu", warnaPeluru: "#b88cff", debuff: { jenis: "lemah", peluang: 0.45, lama: 5 } },
  kalamurka:      { name: "Prabu Kalamurka",  nameEn: "King Kalamurka",    lv: 45, hp: 40000, atk: 72, speed: 95, r: 36, h: 124, exp: 15000, gold: [3000, 3600], range: 70, wind: 0.8, cd: 1.0, aggro: 560, boss: true, ai: "kalamurka", jarakPulang: 900,
    anak: "bayangan", debuff: [{ jenis: "lemah", peluang: 0.4, lama: 5 }, { jenis: "bingung", peluang: 0.2, lama: 3 }] },
};

// Berapa banyak monster di tiap zona peta.
// Zona di peta "Hutan & Padang": "forest" (hutan), "north" (padang utara),
// "south" (padang selatan). "Candi Wingit": "candi". "Rawa Kabut": "rawaUtara",
// "rawaSelatan". "Kampung Nelayan": "kampungLuar", "pantai". "Kawah Geni": "kawahTengah".
// Bos Genderuwo tidak ditulis di sini: dia muncul di peta Gua saat misi ke-3 aktif.
const SPAWN = [
  { monster: "kera", zona: "forest", jumlah: 9 },
  { monster: "kelelawar", zona: "north", jumlah: 6 },
  { monster: "babi", zona: "south", jumlah: 7 },
  // Candi Wingit (dungeon di utara hutan)
  { monster: "kelelawar", zona: "candi", jumlah: 7 },
  { monster: "babi", zona: "candi", jumlah: 4 },
  // Rawa Kabut
  { monster: "hantuKabut", zona: "rawaUtara", jumlah: 7 },
  { monster: "buaya", zona: "rawaSelatan", jumlah: 6 },
  // Kampung Nelayan
  { monster: "tuyul", zona: "kampungLuar", jumlah: 6 },
  { monster: "kepiting", zona: "pantai", jumlah: 7 },
  // Kawah Geni
  { monster: "banaspati", zona: "kawahTengah", jumlah: 7 },
  // Dunia 2 · Kepulauan Segara
  { monster: "ularWelang", zona: "bakauBarat", jumlah: 6 },
  { monster: "uburUbur", zona: "bakauPantai", jumlah: 6 },
  { monster: "harimauKumbang", zona: "laranganTengah", jumlah: 6 },
  { monster: "ularWelang", zona: "laranganSelatan", jumlah: 5 },
  { monster: "hantuBajak", zona: "kuilAula", jumlah: 7 },
  { monster: "uburUbur", zona: "kuilAula", jumlah: 4 },
  // Dunia 3 · Negeri Awan
  { monster: "arcaHidup", zona: "batuSelatan", jumlah: 6 },
  { monster: "elangBatu", zona: "batuUtara", jumlah: 7 },
  { monster: "anakNaga", zona: "batuTimur", jumlah: 3 },
  { monster: "anakNaga", zona: "nagaLereng", jumlah: 7 },
  { monster: "elangBatu", zona: "nagaTebing", jumlah: 5 },
  { monster: "arcaHidup", zona: "nagaGerbang", jumlah: 4 },
  // Bab 6-10
  { monster: "tikusSawah", zona: "sawahUtara", jumlah: 7 },
  { monster: "bayangan", zona: "sawahSelatan", jumlah: 5 },
  { monster: "jerangkong", zona: "makamAula", jumlah: 5 },
  { monster: "jerangkong", zona: "makamTengah", jumlah: 3 },
  { monster: "belutListrik", zona: "goaLautA", jumlah: 5 },
  { monster: "uburUbur", zona: "goaLautB", jumlah: 3 },
  { monster: "bayangan", zona: "goaLautB", jumlah: 3 },
  { monster: "rohAngin", zona: "anginBarat", jumlah: 7 },
  { monster: "elangBatu", zona: "anginTimur", jumlah: 4 },
  { monster: "rohAngin", zona: "istanaTengah", jumlah: 3 },
  { monster: "bayangan", zona: "padangSelatan", jumlah: 7 },
  { monster: "prajuritBayang", zona: "padangUtara", jumlah: 6 },
  { monster: "jerangkong", zona: "kotaBarat", jumlah: 6 },
  { monster: "lelembut", zona: "kotaTimur", jumlah: 5 },
  { monster: "prajuritBayang", zona: "kotaTimur", jumlah: 3 },
  { monster: "prajuritBayang", zona: "menaraBawah", jumlah: 3 },
  { monster: "lelembut", zona: "menaraBawah", jumlah: 2 },
];

// ---------------------------------------------------------------------
// 5. MISI SAMPINGAN DARI KI LURAH (urut dari atas ke bawah)
// (Cerita utama ada di bagian 7. Misi sampingan lain di bagian 8.)
// type "kill": kalahkan `need` monster jenis `target`.
// type "collect": kumpulkan `need` barang `item`.
// Semua selesai = Cermin Gaib muncul di Gua Genderuwo.
// ---------------------------------------------------------------------
const QUESTS = [
  { title: "Usir Kera Liar", type: "kill", target: "kera", need: 5,
    offer: "Kera liar mengacak-acak kebun di hutan timur, seberang jembatan. Tolong usir lima ekor, ya.",
    reward: { gold: 30, exp: 40, potion: 2 } },
  { title: "Taring Babi Hutan", type: "collect", item: "taring", need: 3,
    offer: "Mbok Darmi butuh taring babi hutan untuk ramuan. Babi hutan berkeliaran di padang selatan. Bawakan tiga taring.",
    reward: { gold: 60, exp: 80, potion: 2 } },
  { title: "Penunggu Gua", type: "kill", target: "genderuwo", need: 1,
    offer: "Sudah waktunya. Genderuwo di gua ujung timur yang membuat semua makhluk hutan gelisah. Kalahkan dia, Nak.",
    reward: { gold: 200, exp: 250, potion: 3 } },
];

// ---------------------------------------------------------------------
// 6. MUSIK LATAR (gaya gamelan, dibuat oleh kode, tanpa file audio)
// Musik berganti otomatis sesuai tempat:
//   desa  = riang (juga di layar judul)     luar = tegang (hutan & padang)
//   gua   = seram (gua & candi)             bos  = paling tegang (saat Genderuwo mengejar)
//   menang = musik kemenangan, diputar sekali (bos tumbang & layar "Desa selamat")
// semangat = 0..1 seberapa ramai (imbal, kendang rapat, kenong/kempul, isian kendang)
// ayun = ketukan ganjil sedikit terlambat (0 = kaku, 0.15 = berayun), frasa = panjang satu frasa (ketukan)
// Lagu mana dipakai di area mana: lihat `lagu` tiap area di js/03-peta.js.
//
// Cara menulis nada:
//   tangga  = "slendro" (nada 1 2 3 5 6, cerah) atau "pelog" (nada 1-7, gelap & seram)
//   1 2 3 5 6   = nada          .  = diam satu ketukan
//   6,  atau 1, = satu oktaf lebih rendah (tambah koma lagi: makin rendah)
//   1'          = satu oktaf lebih tinggi
// Tiap baris berulang sendiri-sendiri, jadi panjangnya boleh beda.
//
// tempo   = berapa ketukan (termasuk ".") per menit. Makin besar makin cepat
// melodi  + suara      : nada utama
// isian   + suaraIsian : nada kedua, menghias melodi (boleh dikosongkan)
// bas     + suaraBas   : nada rendah (boleh dikosongkan)
//   pilihan suara: "saron" (logam nyaring), "bonang" (gong kecil lembut),
//   "peking" (logam kecil tinggi), "suling" (seruling), "gelap" (dengung berat),
//   "bisik" (nada tinggi sumbang, seram), "bas" (bas menghentak), "dengung" (bas panjang)
// kendang & perkusi = pola gendang (dua baris, berbunyi bersamaan):
//   D = dhung (rendah)  t = tak (tinggi)  k = ketuk kayu  x = kecrek
//   B = dentum besar    G = gong          . = diam
// gong    = gong otomatis setiap berapa ketukan (0 = tanpa gong)
// ulang   = false → lagu dimainkan sekali saja (untuk musik kemenangan)
// keras   = pengali volume lagu ini saja (1 = biasa, 0.5 = setengah, 2 = dua kali)
// Semua lagu di bawah ini ciptaan sendiri untuk game ini.
// ---------------------------------------------------------------------
const LAGU = {
  // RIANG: cepat, melodi naik-turun, bas melompat oktaf, ketuk kayu di sela ketukan
  desa: {
    semangat: 0.85, ayun: 0.08, tempo: 330, suara: "saron", gong: 32, keras: 0.85,
    melodi: "3 5 6 1' 6 5 3 5 6 . 5 3 2 3 5 . 2 3 5 6 5 3 2 1 2 . 3 2 1 6, 1 .",
    isian: ". . 5' . . . 6' . . . 5' . 3' . . . . . 2' . . . 3' . 5' . . . 6' . 5' .", suaraIsian: "suling",
    bas: "1,, . 1, . 5,, . 5, . 6,, . 6, . 2,, . 2, .", suaraBas: "bas",
    kendang: "D . t . D t . t D . t . D t t t",
    perkusi: ". k . k . k . k",
  },
  // TEGANG: sangat cepat, bas menderu terus, kecrek tanpa henti
  luar: {
    semangat: 1, ayun: 0.05, tempo: 410, suara: "saron", gong: 16, keras: 0.75,
    melodi: "6, 1 2 1 6, 1 2 3 5 3 2 1 2 3 5 6 5 6 1' 6 5 3 5 6 5 3 2 3 2 1 6, 1",
    isian: "6 . 5 . 3 . 5 . 6 . 1' . 6 . 5 .", suaraIsian: "peking",
    bas: "6,, 6,, 6, 6,, 1, 6,, 3,, 5,,", suaraBas: "bas",
    kendang: "D . t D . t D . D . t D . t t t",
    perkusi: "x . x x x . x x",
  },
  // SERAM: pelog, pelan & jarang, dengung panjang, bisikan sumbang,
  // detak jantung (D D), dan tetesan air (k) yang tidak beraturan
  gua: {
    semangat: 0.7, ayun: 0, frasa: 48, tempo: 225, tangga: "pelog", suara: "gelap", gong: 0, keras: 1.6,
    melodi: "1, . . . . . 2, . . . . . 1, . . . 7,, . . . . . 4, . . . . . 5, . . . . . 4, . . . 2, . . . . . . . . .",
    isian: ". . . . . . . . 2'' . . . . . . . . . . . 1'' . . . . . . 7' . . . . . . . . . . . . 4' . .", suaraIsian: "bisik",
    bas: "1,, . . . . . . . . . . . . . . . 2,, . . . . . . . . . . . . . . .", suaraBas: "dengung",
    kendang: "D D . . . . . . . . . . D D . . . . . . . . . . . . . . . . . . . . . .",
    perkusi: ". . . . . . . k . . . . . . . . . . . . . . . . . . k . . . . . . . . . . . . . B . . . . . . . . . . . . . . . . . . . . . . .",
  },
  // PALING TEGANG (bos): pelog, sangat cepat, gendang & kecrek rapat, gong tiap 8 ketukan
  bos: {
    semangat: 1, ayun: 0.04, tempo: 450, tangga: "pelog", suara: "saron", gong: 8, keras: 0.85,
    melodi: "1 2 1 7, 1 2 4 2 1 2 4 5 4 2 1 7, 5 4 2 4 5 6 5 4 2 1 2 4 2 1 7, 1",
    isian: "1' . 7 . 5 . 4 . 5 . 7 . 1' . 2' .", suaraIsian: "peking",
    bas: "1,, 1,, 1, 1,, 2,, 1,, 7,,, 7,,,", suaraBas: "bas",
    kendang: "D t D t D D t . D t D t D t t t",
    perkusi: "x x x . x x x .",
  },
  // PESISIR (Kampung Nelayan): riang, berayun seperti ombak, suling di atas bas yang santai
  pesisir: {
    semangat: 0.8, ayun: 0.12, tempo: 290, suara: "bonang", gong: 32, keras: 0.9,
    melodi: "5 . 6 1' . 6 5 3 5 . 3 2 . 3 5 . 6 . 5 6 1' 2' 1' 6 5 . 3 5 6 . 5 .",
    isian: ". . . . 3' . . . . . 2' . . . . . 5' . . . 6' . . . . . 1'' . . . . .", suaraIsian: "suling",
    bas: "5,, . . 5, 1,, . . 1, 6,, . . 6, 2,, . 3,, .", suaraBas: "bas",
    kendang: "D . . t . . D . D . t . . t . .",
    perkusi: ". . k . . . k . . . k . . k k .",
  },
  // KAWAH (Kawah Geni): pelog, menghentak berat, dentum besar & kecrek panas
  kawah: {
    semangat: 1, ayun: 0.03, tempo: 360, tangga: "pelog", suara: "saron", gong: 16, keras: 0.8,
    melodi: "1 . 2 1 7, . 1 2 4 . 2 1 2 . 4 5 6 . 5 4 2 . 1 2 4 5 4 2 1 . 7, .",
    isian: "5 . . 4 . . 5 . 6 . . 5 . . 4 .", suaraIsian: "peking",
    bas: "1,, . 1,, 1, 7,,, . 7,,, 1,,", suaraBas: "bas",
    kendang: "B . t . D . t D B . t . D t D t",
    perkusi: "x . x . x x x . x . x . x x x x",
  },
  // KEMENANGAN: naik bertahap ke nada tinggi, gendang makin rapat, ditutup gong
  menang: {
    semangat: 0.2, tempo: 330, suara: "saron", ulang: false,
    melodi: "5, 6, 1 2 3 . 2 3 5 . 3 5 6 . 1' 6 1' 2' 3' . . 2' 1' . 6 . 1' . . . . . . . . .",
    isian: ". . . . 3' . . . 5' . . . 6' . . . 1'' . . . . . . . . . . . 1'' . . . . . . . .", suaraIsian: "peking",
    bas: "1,, . . . 1, . . . 5,, . . . 6,, . . . 1, . . . 5,, . . . 1,, . . . . . . . . .", suaraBas: "bas",
    kendang: "G . t . D . t . D . t . D t D t D t D t D . . . D . . . G . . . . . . . . .",
    perkusi: "x . x . x . x . x . x . x . x . x x x x x . . . . . . . x . . . . . . . . .",
  },
};

// ---------------------------------------------------------------------
// 7. CERITA UTAMA: "Kabut dari Gunung Geni" — 5 bab × 10 episode
// Ada di folder src/cerita/ (bab-1.js ... bab-5.js, digabung di semua.js).
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// 7b. PUZZLE BARU (bab 6-10). Letak bendanya: `objek` di area (js/04c, 04d).
//   urutan : sentuh benda sesuai urutan warna. petunjuk = kunci teks di 02-bahasa.js
//            salah → semua padam & muncul `hukuman` (monster)
//   dorong : dorong semua batu ke lempeng tekan (tuas = kembalikan batu ke awal)
//   memori : perhatikan lempeng yang berkedip, lalu injak sesuai urutan.
//            ronde dari `mulai` sampai `sampai` kedipan
//   tebak  : jawab semua teka-teki. salah → muncul 2 `hukuman`
// ---------------------------------------------------------------------
const TEKA_BARU = {
  gong:        { jenis: "urutan", gaya: "gong",    urutan: ["biru", "merah", "emas", "hijau"], petunjuk: "tk.gongPetunjuk", hukuman: "jerangkong" },
  batuMakam:   { jenis: "dorong" },
  pasang:      { jenis: "memori", mulai: 3, sampai: 6, hukuman: "belutListrik" },
  tebakLaut:   { jenis: "tebak", hukuman: "belutListrik", soal: [
    { q: "tk.l1", a: ["tk.l1a", "tk.l1b", "tk.l1c"], benar: 0 },
    { q: "tk.l2", a: ["tk.l2a", "tk.l2b", "tk.l2c"], benar: 0 },
    { q: "tk.l3", a: ["tk.l3a", "tk.l3b", "tk.l3c"], benar: 0 } ] },
  lonceng:     { jenis: "urutan", gaya: "lonceng", urutan: ["ungu", "emas", "biru", "merah", "hijau"], petunjuk: "tk.loncengPetunjuk", hukuman: "rohAngin" },
  batuAwan:    { jenis: "dorong" },
  memoriKota:  { jenis: "memori", mulai: 3, sampai: 7, hukuman: "bayangan" },
  tebakBayang: { jenis: "tebak", hukuman: "bayangan", soal: [
    { q: "tk.b1", a: ["tk.b1a", "tk.b1b", "tk.b1c"], benar: 0 },
    { q: "tk.b2", a: ["tk.b2a", "tk.b2b", "tk.b2c"], benar: 0 },
    { q: "tk.b3", a: ["tk.b3a", "tk.b3b", "tk.b3c"], benar: 0 } ] },
  lenteraKala: { jenis: "urutan", gaya: "lentera", urutan: ["hijau", "ungu", "merah", "biru", "emas"], petunjuk: "tk.lenteraPetunjuk", hukuman: "lelembut" },
  batuKala:    { jenis: "dorong" },
};
const WARNA_SIMBOL = { merah: "#ff5a4a", biru: "#4aa8ff", hijau: "#5ad17a", emas: "#f4c542", ungu: "#b88cff" };

// ---------------------------------------------------------------------
// 8. MISI SAMPINGAN LAIN (dari NPC selain Ki Lurah)
// npc = siapa yang memberi. type & isi sama seperti misi Ki Lurah.
// reward.weapon = naik tingkat senjata gratis. reward.penawar = belajar resep jamu penawar.
// collect: barang jatuh dari monster `dari` (satu jenis atau daftar) dengan `peluang`, hanya saat misinya aktif.
// en = terjemahan bahasa Inggris.
// ---------------------------------------------------------------------
const SAMPINGAN = [
  { id: "kepiting", npc: "kardi", title: "Kepiting Nakal", type: "kill", target: "kepiting", need: 6,
    offer: "Kepiting karang merusak jaring kami di pantai selatan. Bisa kau usir enam ekor?",
    done: "Pantai aman lagi! Ini upah dari para nelayan.",
    reward: { gold: 70, exp: 120, potion: 2 } },
  { id: "sisik", npc: "tirto", title: "Sisik Buaya", type: "collect", item: "sisik", need: 3, dari: "buaya", peluang: 0.5,
    offer: "Mbah butuh tiga sisik buaya rawa untuk menempa ulang senjatamu. Buaya-buaya itu ada di rawa selatan.",
    done: "Sisik yang bagus. Sini, Mbah tempa senjatamu sebentar... nah, lebih tajam!",
    reward: { gold: 40, exp: 150, weapon: 1 } },
  { id: "penawar", npc: "joko", panduan: true, title: "Ramuan Penawar", type: "collect", item: "daunSambiloto", need: 5, dari: ["kera", "babi", "kelelawar"], peluang: 0.5,
    offer: "Racun, luka bakar, rasa lemas, kepala pening... itu ulah makhluk berkabut, Nak. Cara menyembuhkannya ada dua: beristirahat di zona aman dekat mesin teleport, atau minum jamu yang diracik dengan sambiloto. Bawakan lima daun sambiloto dari monster di Hutan & Padang, nanti kuajari resepnya.",
    done: "Daun yang segar! Perhatikan: tumbuk, seduh, campur ke jamu. Mulai sekarang setiap jamu yang kau minum juga menyembuhkan SEMUA debuff.",
    reward: { gold: 30, exp: 80, potion: 3, penawar: true },
    en: { title: "Antidote Brew", offer: "Poison, burns, weakness, dizziness... that's the work of the mist creatures, my child. There are two cures: rest in a safe zone near a teleport beacon, or drink jamu brewed with sambiloto. Bring me five sambiloto leaves from monsters in the Forest & Meadow and I'll teach you the recipe.",
      done: "Fresh leaves! Watch closely: grind, steep, mix into jamu. From now on every jamu you drink also cures ALL debuffs." } },
  { id: "kerang", npc: "bayu", title: "Kerang Bercahaya", type: "collect", item: "kerangLaut", need: 4, dari: "uburUbur", peluang: 0.5,
    offer: "Kak, ubur-ubur api di pantai bakau suka menelan kerang bercahaya. Ibuku butuh empat buat lampu rumah. Tolong ya, Kak!",
    done: "Wah, terang sekali! Ibu pasti senang. Ini tabunganku, Kak... jangan bilang siapa-siapa.",
    reward: { gold: 120, exp: 300, potion: 2 },
    en: { title: "Glowing Shells", offer: "The fire jellyfish on the mangrove shore keep swallowing glowing shells. My mom needs four for our house lamps. Please help!",
      done: "Wow, so bright! Mom will love it. Here are my savings... don't tell anyone." } },
  { id: "kumbang", npc: "rimba", title: "Raja Hutan Hitam", type: "kill", target: "harimauKumbang", need: 6,
    offer: "Harimau kumbang di Hutan Larangan makin berani mendekati kebun warga. Usir enam ekor. Hati-hati, cakarnya membuat lengan lemas.",
    done: "Jejak mereka sudah menjauh. Kau pemburu yang baik. Terimalah ini.",
    reward: { gold: 150, exp: 420, potion: 1 },
    en: { title: "Kings of the Black Forest", offer: "The black panthers in the Forbidden Forest are getting bold, creeping toward our gardens. Drive off six. Careful, their claws leave your arms weak.",
      done: "Their tracks lead away now. You're a fine hunter. Take this." } },
  { id: "bajak", npc: "laras", title: "Arwah Pelaut", type: "kill", target: "hantuBajak", need: 8,
    offer: "Arwah bajak laut berkeliaran di aula Kuil Samudra. Bebaskan delapan dari mereka agar mereka bisa beristirahat.",
    done: "Laut terasa lebih tenang. Terima kasih, mereka akhirnya pulang.",
    reward: { gold: 180, exp: 520, potion: 3 },
    en: { title: "Sailors' Souls", offer: "Pirate ghosts wander the halls of the Sea Temple. Free eight of them so they can finally rest.",
      done: "The sea feels calmer. Thank you, they have finally gone home." } },
  { id: "langit", npc: "kirana", title: "Langit Bersih", type: "kill", target: "elangBatu", need: 8,
    offer: "Elang batu mengacau jalur gembala. Aku bisa sendiri sih... tapi kalau kau mau ikut, kalahkan delapan. Kita lihat siapa lebih cepat.",
    done: "Hmph. Lumayan. Baiklah, kau menang kali ini. Ambil hadiahnya.",
    reward: { gold: 220, exp: 700 },
    en: { title: "Clear Skies", offer: "Stone eagles keep raiding the shepherd trails. I could do it alone... but if you want in, take down eight. Let's see who's faster.",
      done: "Hmph. Not bad. Fine, you win this time. Take the reward." } },
  { id: "arca", npc: "gora", title: "Pecahan Arca", type: "collect", item: "pecahanArca", need: 5, dari: "arcaHidup", peluang: 0.5,
    offer: "Pecahan arca hidup itu logam langit, Kisanak. Bawakan lima, akan kutempa senjatamu jadi lebih tajam.",
    done: "Dengar dentingnya! Senjatamu sekarang setara pusaka. Gunakan dengan bijak.",
    reward: { gold: 100, exp: 600, weapon: 1 },
    en: { title: "Statue Shards", offer: "Those living-statue shards are sky metal, traveler. Bring me five and I'll forge your weapon sharper.",
      done: "Hear that ring! Your weapon is fit for an heirloom now. Use it wisely." } },
  { id: "anakNaga", npc: "angon", title: "Kambing Awan Ketakutan", type: "kill", target: "anakNaga", need: 5,
    offer: "Kambing-kambingku tidak mau keluar kandang, anak naga terus menyembur di padang! Usir lima ekor, nanti kubuatkan susu kambing awan. Enak lho.",
    done: "Mbeeek! Eh, maksudku, terima kasih! Kambingku sudah berani merumput lagi.",
    reward: { gold: 260, exp: 900, potion: 3 },
    en: { title: "Frightened Cloud Goats", offer: "My goats won't leave the pen, the dragon whelps keep breathing fire in the pasture! Drive off five and I'll make you cloud-goat milk. It's tasty.",
      done: "Baaah! I mean, thank you! My goats are brave enough to graze again." } },
  { id: "tikus", npc: "parmin", title: "Perang Tikus", type: "kill", target: "tikusSawah", need: 8,
    offer: "Tikus-tikus raksasa itu menghabiskan padiku! Aku... aku tidak berani turun dari bangku. Tolong usir delapan ekor!",
    done: "Akhirnya aku bisa turun dari bangku! Ini, beras terbaik untukmu. Eh, maksudku koin. Beras berat dibawa.",
    reward: { gold: 400, exp: 2500, potion: 2 },
    en: { title: "Rat War", offer: "Those giant rats are eating all my rice! I... I don't dare get off this bench. Please drive off eight of them!",
      done: "I can finally get off the bench! Here, my best rice for you. Er, I mean coins. Rice is heavy to carry." } },
  { id: "mutiaraHitam", npc: "wulan", title: "Mutiara Hitam", type: "collect", item: "mutiaraHitam", need: 4, dari: "belutListrik", peluang: 0.5,
    offer: "Belut listrik di Gua Laut menyimpan mutiara hitam di perutnya. Bawakan empat, aku mau membuat kalung untuk Ibu... untuk mengenangnya.",
    done: "Cantik sekali. Ibu pasti tersenyum di sana. Terima kasih, sungguh.",
    reward: { gold: 450, exp: 3000, potion: 3 },
    en: { title: "Black Pearls", offer: "The electric eels in the Sea Cave keep black pearls in their bellies. Bring me four, I want to make a necklace for Mother... in her memory.",
      done: "So beautiful. Mother must be smiling up there. Thank you, truly." } },
  { id: "layangan", npc: "bujang", title: "Layang-layang Putus", type: "kill", target: "rohAngin", need: 8,
    offer: "Roh angin terus memutus benang layang-layangku! Kalahkan delapan, nanti kubuatkan layangan paling gagah se-Negeri Awan.",
    done: "Lihat, layanganku terbang tinggi lagi! Kau pahlawan para pembuat layangan.",
    reward: { gold: 500, exp: 3600, potion: 2 },
    en: { title: "Cut Kite Strings", offer: "The wind spirits keep snapping my kite strings! Defeat eight and I'll make you the finest kite in the Cloud Realm.",
      done: "Look, my kite is flying high again! You're the hero of kite makers." } },
  { id: "kainBayang", npc: "lintang", title: "Kain Bayang", type: "collect", item: "kainBayang", need: 5, dari: "prajuritBayang", peluang: 0.5,
    offer: "Jubah prajurit bayang itu kainnya hangat, aneh ya? Bawakan lima potong, akan kujahit selimut untuk anak-anak di perkemahan.",
    done: "Anak-anak bisa tidur nyenyak malam ini. Ambil ini, kau pantas mendapatkannya.",
    reward: { gold: 600, exp: 4200, potion: 3 },
    en: { title: "Shadow Cloth", offer: "The shadow soldiers' cloaks are oddly warm, right? Bring me five pieces and I'll sew blankets for the children in camp.",
      done: "The children can sleep soundly tonight. Take this, you've earned it." } },
  { id: "dayang", npc: "sekar", title: "Dayang-dayang yang Tersesat", type: "kill", target: "lelembut", need: 8,
    offer: "Lelembut di Kota Mati dulu dayang-dayangku. Bebaskan delapan dari mereka... biar mereka tidak menangis lagi.",
    done: "Aku mendengar mereka tertawa sebelum pergi. Terima kasih, Kisanak.",
    reward: { gold: 700, exp: 5000, weapon: 1 },
    en: { title: "Lost Handmaidens", offer: "The wraiths in the Dead City were once my handmaidens. Free eight of them... so they won't weep anymore.",
      done: "I heard them laughing before they left. Thank you, traveler." } },
];

// ---------------------------------------------------------------------
// 9. JURUS (48-jurus.js), PAMUNGKAS (49), POIN JURUS (51)
// Tiap kelas punya 4 jurus. `buka` = level saat jurus terbuka.
// Pasang 2 jurus sekaligus (slot 1 = tombol S, slot 2 = tombol F).
// cd = jeda (detik), mult = pengali serangan.
// naik3 / naik5 = kemampuan tambahan saat jurus mencapai rank 3 / rank 5 (poin jurus).
// ---------------------------------------------------------------------
const JURUS = {
  pendekar: [
    { id: "tebasanKilat", name: "Tebasan Kilat", type: "dash", buka: 1, cd: 5, mult: 2.4, dist: 230,
      desc: "Menerjang lurus menembus musuh, lalu kebal 1 detik.", naik3: "Langsung menerjang sekali lagi ke musuh terdekat.", naik5: "Musuh yang ditembus jadi berdarah.",
      en: { name: "Lightning Slash", desc: "Dash straight through enemies, then stay invulnerable for 1s.", naik3: "Instantly dash again at the nearest enemy.", naik5: "Enemies you pass through start bleeding." } },
    { id: "tebasBalik", name: "Tebas Balik", type: "tebasBalik", buka: 8, cd: 6, mult: 2.2, r: 100,
      desc: "Menebas musuh di depan lalu melompat mundur menjauhi bahaya. Kebal 1 detik.", naik3: "Tebasan lebih lebar & kebal 1,5 detik.", naik5: "Musuh yang kena berdarah & pukulan berikutnya pasti kritis.",
      en: { name: "Backslash", desc: "Slash enemies in front, then leap back out of danger. Invulnerable for 1s.", naik3: "Wider slash & 1.5s invulnerability.", naik5: "Enemies hit bleed & your next hit is a guaranteed critical." } },
    { id: "gelombangAngin", name: "Gelombang Angin", type: "wave", buka: 18, cd: 6, mult: 2.2, speed: 700, range: 440,
      desc: "Melempar gelombang tebasan yang menembus barisan musuh.", naik3: "Tiga gelombang sekaligus, menyebar.", naik5: "Musuh yang kena jadi lumpuh sebentar.",
      en: { name: "Wind Wave", desc: "Hurl a slashing wave that pierces enemy lines.", naik3: "Three waves at once, fanned out.", naik5: "Enemies hit are briefly stunned." } },
    { id: "langkahBayang", name: "Langkah Bayang", type: "blink", buka: 30, cd: 10, mult: 2.8, jarak: 320, target: 3,
      desc: "Berpindah kilat menebas 3 musuh terdekat satu per satu. Kebal selama jurus.", naik3: "Menebas sampai 5 musuh.", naik5: "Setiap tebasan pasti kritis.",
      en: { name: "Shadow Step", desc: "Flash between and slash the 3 nearest enemies. Invulnerable while active.", naik3: "Slashes up to 5 enemies.", naik5: "Every slash is a critical hit." } },
  ],
  pemanah: [
    { id: "panahTiga", name: "Panah Tiga", type: "volley", buka: 1, cd: 4.5, mult: 1.4,
      desc: "Lima anak panah menyebar sekaligus.", naik3: "Tujuh anak panah.", naik5: "Anak panah menembus musuh.",
      en: { name: "Triple Shot", desc: "Five arrows fanned out at once.", naik3: "Seven arrows.", naik5: "Arrows pierce enemies." } },
    { id: "panahJerat", name: "Panah Jerat", type: "snare", buka: 8, cd: 6, mult: 1.6,
      desc: "Panah berjaring: musuh melambat 3 detik & lumpuh sebentar.", naik3: "Jaring meledak, menjerat musuh di sekitarnya.", naik5: "Lumpuh lebih lama, bos pun ikut terjerat.",
      en: { name: "Snare Arrow", desc: "A net arrow: enemy slowed for 3s and briefly stunned.", naik3: "The net bursts, snaring nearby enemies.", naik5: "Longer stun, even bosses get snared." } },
    { id: "hujanPanah", name: "Hujan Panah", type: "rain", buka: 18, cd: 8, mult: 0.6, r: 110, ticks: 8,
      desc: "Panah berjatuhan di area musuh terdekat selama 1,6 detik.", naik3: "Area hujan lebih luas.", naik5: "Panah beracun (racun).",
      en: { name: "Arrow Rain", desc: "Arrows rain on the nearest enemy's area for 1.6s.", naik3: "Wider rain area.", naik5: "Poisoned arrows." } },
    { id: "panahTembus", name: "Panah Tembus", type: "pierce", buka: 30, cd: 9, mult: 4, speed: 950, range: 620,
      desc: "Panah raksasa menembus semua musuh. Damage ×1,5 ke bos.", naik3: "Dua panah raksasa.", naik5: "Musuh yang kena berdarah.",
      en: { name: "Piercing Shot", desc: "A giant arrow pierces every enemy. ×1.5 damage to bosses.", naik3: "Two giant arrows.", naik5: "Enemies hit start bleeding." } },
  ],
  pendobrak: [
    { id: "benteng", name: "Benteng", type: "guard", buka: 1, cd: 10, lama: 4,
      desc: "Perisai menyerap damage sebesar 30% nyawa maksimal & damage diterima -50% selama 4 detik. Tak terpental, memantulkan pukulan.", naik3: "Perisai 40% & bertahan 5 detik.", naik5: "Saat selesai: pulih 15% nyawa & semua debuff hilang.",
      en: { name: "Bulwark", desc: "A shield absorbs damage equal to 30% max HP and you take 50% less damage for 4s. No knockback, reflects hits.", naik3: "40% shield & lasts 5s.", naik5: "When it ends: heal 15% HP and clear all debuffs." } },
    { id: "gempa", name: "Gempa", type: "quake", buka: 8, cd: 7, mult: 2.6, r: 140,
      desc: "Menghantam tanah, semua musuh di sekitar terkena.", naik3: "Area +30% & musuh biasa lumpuh.", naik5: "Gempa susulan setengah detik kemudian.",
      en: { name: "Earthquake", desc: "Slam the ground, hitting every enemy around.", naik3: "Area +30% and normal enemies are stunned.", naik5: "An aftershock half a second later." } },
    { id: "lompatanPalu", name: "Lompatan Palu", type: "leap", buka: 18, cd: 8, mult: 3, r: 110, jarak: 300,
      desc: "Melompat ke musuh terdekat lalu menghantam: musuh di sekitar lumpuh.", naik3: "Area hantaman lebih luas.", naik5: "Lumpuh lebih lama, bos ikut goyah.",
      en: { name: "Hammer Leap", desc: "Leap to the nearest enemy and slam: nearby enemies are stunned.", naik3: "Wider slam area.", naik5: "Longer stun, bosses stagger too." } },
    { id: "dobrakan", name: "Dobrakan Perisai", type: "dobrak", buka: 30, cd: 9, mult: 3.2,
      desc: "Menerjang dengan perisai, kebal selama menerjang: musuh terpental & lumpuh, bos goyah sebentar.", naik3: "Setelah menerjang dapat perisai 15% nyawa maksimal.", naik5: "Lumpuh lebih lama (bos 1 detik).",
      en: { name: "Shield Bash", desc: "Charge with your shield, invulnerable while charging: enemies are knocked back and stunned, bosses briefly stagger.", naik3: "Gain a 15% max HP shield after charging.", naik5: "Longer stun (bosses 1s)." } },
  ],
  penyihir: [
    { id: "pilarApi", name: "Pilar Api", type: "pillar", buka: 1, cd: 6, mult: 3, dist: 150, r: 70,
      desc: "Pilar api menyembur dari tanah di bawah musuh.", naik3: "Dua pilar tambahan di sekitarnya.", naik5: "Musuh yang kena terbakar.",
      en: { name: "Fire Pillar", desc: "A pillar of fire erupts under an enemy.", naik3: "Two extra pillars around it.", naik5: "Enemies hit start burning." } },
    { id: "perisaiApi", name: "Perisai Api", type: "orbit", buka: 8, cd: 10, mult: 0.8, lama: 6, bola: 3,
      desc: "3 bola api mengitarimu 6 detik, membakar musuh yang tersentuh.", naik3: "5 bola api.", naik5: "Bola api juga menghancurkan peluru musuh.",
      en: { name: "Flame Shield", desc: "3 fireballs orbit you for 6s, burning enemies they touch.", naik3: "5 fireballs.", naik5: "Fireballs also destroy enemy projectiles." } },
    { id: "tapakEs", name: "Tapak Es", type: "freeze", buka: 18, cd: 9, mult: 1.2, r: 150,
      desc: "Gelombang es: musuh di sekitar membeku (lumpuh) 2 detik.", naik3: "Jangkauan lebih luas.", naik5: "Beku 3 detik & musuh beku menerima damage +30%.",
      en: { name: "Frost Step", desc: "A frost wave: nearby enemies freeze (stun) for 2s.", naik3: "Wider reach.", naik5: "Freeze lasts 3s and frozen enemies take +30% damage." } },
    { id: "meteor", name: "Meteor", type: "meteor", buka: 30, cd: 12, mult: 6, r: 120,
      desc: "Meteor jatuh setelah 1,2 detik: damage sangat besar & membakar.", naik3: "Dua meteor.", naik5: "Kawah api tertinggal 3 detik.",
      en: { name: "Meteor", desc: "A meteor lands after 1.2s: huge damage and burning.", naik3: "Two meteors.", naik5: "Leaves a fire crater for 3s." } },
  ],
};
// Jurus pamungkas tiap kelas: dipakai saat bar Tenaga Dalam penuh (tombol R)
const PAMUNGKAS = {
  pendekar: { name: "Seribu Tebasan", type: "seribu", mult: 0.75, r: 300, desc: "Waktu seolah berhenti: semua musuh dekat ditebas 10 kali.",
    en: { name: "Thousand Cuts", desc: "Time seems to stop: every nearby enemy is slashed 10 times." } },
  pemanah: { name: "Panah Garuda", type: "garuda", mult: 9, desc: "Seberkas panah cahaya raksasa menembus semua musuh di depan.",
    en: { name: "Garuda Arrow", desc: "A giant beam of light pierces every enemy ahead." } },
  pendobrak: { name: "Palu Bumi", type: "palu", mult: 2.6, desc: "Tiga gempa beruntun makin luas, musuh lumpuh.",
    en: { name: "Earth Hammer", desc: "Three widening quakes in a row, stunning enemies." } },
  penyihir: { name: "Hujan Meteor", type: "hujanMeteor", mult: 2.6, desc: "Sepuluh meteor menghujani area di sekitarmu.",
    en: { name: "Meteor Shower", desc: "Ten meteors rain down around you." } },
};
// Pasif (poin jurus): tiap rank menambah sedikit
const PASIF = [
  { id: "nyawa", name: "Tubuh Baja", per: 0.04, desc: "Nyawa maksimal +4% per rank.", en: { name: "Steel Body", desc: "Max HP +4% per rank." } },
  { id: "kuat", name: "Tenaga Otot", per: 0.03, desc: "Serangan +3% per rank.", en: { name: "Muscle Power", desc: "Attack +3% per rank." } },
  { id: "tangkas", name: "Tangkas", per: 0.06, desc: "Jeda hindar -6% & kuda-kuda tangkis lebih lama per rank.", en: { name: "Agility", desc: "Dodge cooldown -6% and longer parry stance per rank." } },
  { id: "batin", name: "Olah Batin", per: 0.1, desc: "Tenaga Dalam terisi +10% lebih cepat per rank.", en: { name: "Inner Training", desc: "Inner Power fills 10% faster per rank." } },
  { id: "pamungkas", name: "Puncak Ilmu", per: 0.15, desc: "Damage jurus pamungkas +15% per rank.", en: { name: "Peak Mastery", desc: "Ultimate damage +15% per rank." } },
];

// ---------------------------------------------------------------------
// 10. JIMAT (52-jimat.js) & DROP LANGKA (53-drop-langka.js)
// rarity: "biasa" (dijual di toko), "langka" (drop bos & cermin), "legenda" (khas tiap bos, dari Cermin Gaib).
// efek (angka = nilai di bintang 1; tiap bintang +25%):
//   atk / hp / tahan / bos / cd / koin / exp / gerak / jamu / tenaga / pamungkas / hindarCd = persen (0.1 = 10%)
//   kritis = tambahan peluang kritis, kritisKali = tambahan pengali kritis, hisap = nyawa dari damage,
//   duri = pantulan damage ke penyerang, tangkis = tambahan detik kuda-kuda
//   dot = { jenis, peluang } (seranganmu memberi racun/berdarah/terbakar ke musuh), lumpuh = peluang musuh lumpuh
//   kebal = [debuff] (tidak bisa terkena), jejakApi = berguling meninggalkan api, bangkit = bangkit sekali saat pingsan
// harga = harga di toko (khusus biasa).
// ---------------------------------------------------------------------
const JIMAT = {
  gelangBesi:   { name: "Gelang Besi", rarity: "biasa", harga: 120, efek: { atk: 0.06 }, en: { name: "Iron Bangle" } },
  kalungAkar:   { name: "Kalung Akar Bahar", rarity: "biasa", harga: 120, efek: { hp: 0.08 }, en: { name: "Sea-Root Necklace" } },
  cincinTembaga:{ name: "Cincin Tembaga", rarity: "biasa", harga: 150, efek: { kritis: 0.04 }, en: { name: "Copper Ring" } },
  sabukKulit:   { name: "Sabuk Kulit Kerbau", rarity: "biasa", harga: 150, efek: { tahan: 0.05 }, en: { name: "Buffalo-Hide Belt" } },
  buluPerkutut: { name: "Bulu Perkutut", rarity: "biasa", harga: 130, efek: { gerak: 0.06 }, en: { name: "Dove Feather" } },
  kantongKepeng:{ name: "Kantong Kepeng", rarity: "biasa", harga: 100, efek: { koin: 0.12 }, en: { name: "Coin Pouch" } },
  daunSirih:    { name: "Daun Sirih Kering", rarity: "biasa", harga: 110, efek: { jamu: 0.15 }, en: { name: "Dried Betel Leaf" } },
  batuAsah:     { name: "Batu Asah Saku", rarity: "biasa", harga: 180, efek: { cd: 0.05 }, en: { name: "Pocket Whetstone" } },

  tasbihCendana:{ name: "Tasbih Cendana", rarity: "langka", efek: { tenaga: 0.2, hp: 0.05 }, en: { name: "Sandalwood Beads" } },
  taringMacan:  { name: "Taring Macan", rarity: "langka", efek: { atk: 0.1, dot: { jenis: "berdarah", peluang: 0.12 } }, en: { name: "Tiger Fang" } },
  mataKucing:   { name: "Batu Mata Kucing", rarity: "langka", efek: { kritis: 0.07, kritisKali: 0.2 }, en: { name: "Cat's-Eye Stone" } },
  rajahPenangkal:{ name: "Rajah Penangkal", rarity: "langka", efek: { tahan: 0.04, kebal: ["racun", "terbakar"] }, en: { name: "Warding Talisman" } },
  gelangLeluhur:{ name: "Gelang Perak Leluhur", rarity: "langka", efek: { bos: 0.12 }, en: { name: "Ancestral Silver Bangle" } },
  selendangAngin:{ name: "Selendang Angin", rarity: "langka", efek: { hindarCd: 0.2, gerak: 0.06 }, en: { name: "Wind Shawl" } },
  cincinDarah:  { name: "Cincin Darah", rarity: "langka", efek: { hisap: 0.04 }, en: { name: "Blood Ring" } },
  wesiKuning:   { name: "Wesi Kuning", rarity: "langka", efek: { tangkis: 0.08, duri: 0.3 }, en: { name: "Yellow Iron" } },

  // legenda: khas tiap bos (bos = jenis bos yang menjatuhkannya)
  buluGenderuwo:  { name: "Bulu Genderuwo", rarity: "legenda", bos: "genderuwo", efek: { tahan: 0.1, duri: 0.5, amuk: 1 }, en: { name: "Genderuwo Fur" } },
  gadaDwarapala:  { name: "Gada Dwarapala Mini", rarity: "legenda", bos: "dwarapala", efek: { atk: 0.08, lumpuh: 0.08, hantam5: 1 }, en: { name: "Miniature Dwarapala Club" } },
  sisikBuayaPutih:{ name: "Sisik Buaya Putih", rarity: "legenda", bos: "buayaPutih", efek: { hp: 0.15, kebal: ["lambat"], pulihDiam: 1 }, en: { name: "White Crocodile Scale" } },
  mahkotaBanaspati:{ name: "Mahkota Banaspati", rarity: "legenda", bos: "rajaBanaspati", efek: { jejakApi: 1, atk: 0.06, kebal: ["terbakar"] }, en: { name: "Banaspati Crown" } },
  mustikaUlar:    { name: "Mustika Ular", rarity: "legenda", bos: "silumanUlar", efek: { dot: { jenis: "racun", peluang: 0.2 }, kebal: ["racun"], racunPeka: 1 }, en: { name: "Serpent Gem" } },
  perisaiKarang:  { name: "Perisai Karang", rarity: "legenda", bos: "panglimaKarang", efek: { tahan: 0.15, tangkis: 0.06, karangHidup: 1 }, en: { name: "Coral Shield" } },
  taringKelabang: { name: "Taring Kelabang", rarity: "legenda", bos: "kelabang", efek: { hisap: 0.06, dot: { jenis: "berdarah", peluang: 0.15 }, pulihBunuh: 1 }, en: { name: "Centipede Fang" } },
  sisikNaga:      { name: "Sisik Naga Kencana", rarity: "legenda", bos: "naga", efek: { atk: 0.15, kebal: ["terbakar"], bangkit: 1 }, en: { name: "Golden Dragon Scale" } },
  tulangRaja:     { name: "Tulang Raja Jerangkong", rarity: "legenda", bos: "rajaJerangkong", efek: { exp: 0.2, kritisKali: 0.3, tumpukTulang: 1 }, en: { name: "Skeleton King's Bone" } },
  tintaGurita:    { name: "Tinta Gurita", rarity: "legenda", bos: "guritaRaksasa", efek: { cd: 0.12, kebal: ["bingung"], tintaGuling: 1 }, en: { name: "Octopus Ink" } },
  buluRajawali:   { name: "Bulu Rajawali Petir", rarity: "legenda", bos: "rajawaliPetir", efek: { gerak: 0.12, hindarCd: 0.25, kebal: ["lumpuh"], petirGuling: 1 }, en: { name: "Thunder Eagle Feather" } },
  kunciMenara:    { name: "Kunci Menara Kala", rarity: "legenda", bos: "penjagaMenara", efek: { tenaga: 0.35, pamungkas: 0.2, hentiWaktu: 1 }, en: { name: "Kala Tower Key" } },
  mahkotaKalamurka:{ name: "Mahkota Kalamurka", rarity: "legenda", bos: "kalamurka", efek: { bos: 0.2, atk: 0.1, kritis: 0.06, gemaBayang: 1 }, en: { name: "Kalamurka's Crown" } },
};
const WARNA_RARITY = { biasa: "#e8e2d0", langka: "#6fb7ff", legenda: "#f4b942" };

// Ramuan sementara (dibeli di toko, langsung diminum). harga = dasar + perLevel × level pemain.
const RAMUAN = {
  kuat:      { name: "Ramuan Kuat", lama: 120, dasar: 50, perLevel: 6, efek: { atk: 0.25 }, warna: "#ff7b39", desc: "Serangan +25% selama 2 menit.", en: { name: "Strength Brew", desc: "Attack +25% for 2 minutes." } },
  baja:      { name: "Ramuan Baja", lama: 120, dasar: 50, perLevel: 6, efek: { tahan: 0.25 }, warna: "#8fd3ff", desc: "Damage yang diterima -25% selama 2 menit.", en: { name: "Iron Brew", desc: "Damage taken -25% for 2 minutes." } },
  penangkal: { name: "Ramuan Penangkal", lama: 120, dasar: 40, perLevel: 4, efek: { kebalSemua: 1 }, warna: "#7dffa8", desc: "Kebal semua debuff selama 2 menit.", en: { name: "Warding Brew", desc: "Immune to all debuffs for 2 minutes." } },
  gesit:     { name: "Ramuan Gesit", lama: 120, dasar: 40, perLevel: 4, efek: { gerak: 0.2, hindarCd: 0.3 }, warna: "#f4b942", desc: "Gerak +20% & jeda hindar -30% selama 2 menit.", en: { name: "Swift Brew", desc: "Move +20% and dodge cooldown -30% for 2 minutes." } },
};

// ---------------------------------------------------------------------
// 11. BOS TANGGUH (57-bos-tangguh.js) & DEBUFF TAMBAHAN (55-debuff-baru.js)
// tier 1 (mudah) → 13 (paling sulit). Semakin tinggi tier, semakin banyak trik:
//   tipuan    : peluang bos pura-pura menyerang (tahan sebentar, lalu baru memukul)
//   amukan    : serangan pamungkas bos tiap `jeda` detik — layar memerah, lari ke lingkaran hijau!
//   kudaKuda  : bos sesekali bertahan (perisai biru, damage -75%). Tangkis serangannya untuk memecahkan
//   kombo     : peluang bos langsung menyerang lagi tanpa jeda
// Di Cermin Gaib tingkat 5+ semua trik ini makin sering.
// ---------------------------------------------------------------------
const BOS_TANGGUH = {
  genderuwo:      { tier: 1,  tipuan: 0.15 },
  dwarapala:      { tier: 2,  tipuan: 0.18, amukan: 26 },
  buayaPutih:     { tier: 3,  tipuan: 0.2,  amukan: 24 },
  rajaBanaspati:  { tier: 4,  tipuan: 0.22, amukan: 22, kombo: 0.15 },
  silumanUlar:    { tier: 5,  tipuan: 0.24, amukan: 22, kombo: 0.15, kudaKuda: 18 },
  panglimaKarang: { tier: 6,  tipuan: 0.25, amukan: 21, kombo: 0.2,  kudaKuda: 16 },
  kelabang:       { tier: 7,  tipuan: 0.26, amukan: 20, kombo: 0.25, kudaKuda: 16 },
  naga:           { tier: 8,  tipuan: 0.25, kombo: 0.2 },   // naga punya amukan sendiri (36-naga.js)
  rajaJerangkong: { tier: 9,  tipuan: 0.28, amukan: 19, kombo: 0.25, kudaKuda: 15 },
  guritaRaksasa:  { tier: 10, tipuan: 0.3,  amukan: 18, kombo: 0.3,  kudaKuda: 14 },
  rajawaliPetir:  { tier: 11, tipuan: 0.32, amukan: 17, kombo: 0.3,  kudaKuda: 14 },
  penjagaMenara:  { tier: 12, tipuan: 0.34, amukan: 16, kombo: 0.35, kudaKuda: 13 },
  kalamurka:      { tier: 13, tipuan: 0.36, amukan: 15, kombo: 0.35, kudaKuda: 12 },
};
// FASE BOS (62-fase-bos.js): nyawa bos habis → bangkit dengan nyawa PENUH di fase berikutnya.
// Bos tier ≤ duaFaseSampaiTier punya 2 fase, sisanya 3 fase. Di Cermin Gaib tingkat ≥ cerminTigaFase semua bos 3 fase.
// Tiap fase punya kekuatan tambahan berbeda (dikalikan dari fase 1):
//   atk = serangan, cepat = kecepatan serang, gerak = kecepatan gerak, tahan = damage diterima berkurang,
//   anak = memanggil anak buah, khas = jurus khas lebih sering (pengali jeda)
const FASE_BOS = {
  duaFaseSampaiTier: 3, cerminTigaFase: 4, transisi: 2.2,
  fase: [
    null,
    { atk: 1.2, cepat: 1.15, gerak: 1.12, anak: true, warna: "#ff5a3a" },                       // Fase 2 · Murka
    { atk: 1.4, cepat: 1.3, gerak: 1.25, tahan: 0.2, khas: 0.65, anak: true, warna: "#b84aff" }, // Fase 3 · Amarah Terakhir
  ],
};

// Debuff lumpuh (stun) & berdarah (damage over time) yang ditambahkan ke monster tertentu
const DEBUFF_TAMBAHAN = {
  babi:           { jenis: "lumpuh",   peluang: 0.2,  lama: 0.8 },
  genderuwo:      { jenis: "lumpuh",   peluang: 0.25, lama: 1 },
  dwarapala:      { jenis: "lumpuh",   peluang: 0.3,  lama: 1.1 },
  harimauKumbang: { jenis: "berdarah", peluang: 0.4,  lama: 6 },
  kelabang:       { jenis: "berdarah", peluang: 0.4,  lama: 6 },
  arcaHidup:      { jenis: "lumpuh",   peluang: 0.25, lama: 1 },
  jerangkong:     { jenis: "berdarah", peluang: 0.35, lama: 6 },
  belutListrik:   { jenis: "lumpuh",   peluang: 0.3,  lama: 0.9 },
  prajuritBayang: { jenis: "berdarah", peluang: 0.35, lama: 6 },
  rajaJerangkong: { jenis: "berdarah", peluang: 0.4,  lama: 7 },
  rajawaliPetir:  { jenis: "lumpuh",   peluang: 0.3,  lama: 1 },
  penjagaMenara:  { jenis: "lumpuh",   peluang: 0.3,  lama: 1.1 },
  kalamurka:      { jenis: "berdarah", peluang: 0.3,  lama: 7 },
};

// ---------------------------------------------------------------------
// 12. CARA BERMAIN (56-cara-bermain.js): latihan dasar bersama Ki Sabda di desa.
// Langkah dikerjakan berurutan. jumlah = berapa kali harus dilakukan.
// Sengaja hanya 4 dasar. Sisanya (jamu, hindar sempurna, tangkis, peta, misi, jurus, jimat,
// pamungkas, debuff, teleport, cermin) diajarkan SAAT dibutuhkan lewat kiat (99h-kiat.js).
// ---------------------------------------------------------------------
const LATIHAN = [
  { id: "gerak", jumlah: 1 }, { id: "serang", jumlah: 5 }, { id: "jurus", jumlah: 1 }, { id: "hindar", jumlah: 2 },
];
MONSTERS.boneka = { name: "Boneka Latihan", nameEn: "Training Dummy", lv: 1, hp: 99999, atk: 0, speed: 0, r: 14, h: 50, exp: 0, gold: [0, 0], range: 46, wind: 1, cd: 3, aggro: 170, ai: "boneka", latihan: true };
SAMPINGAN.unshift({ id: "latihan", npc: "sabda", panduan: true, title: "Latihan Dasar", type: "latihan", need: LATIHAN.length,
  offer: "Kisanak baru di sini? Sebelum keluar desa, berlatihlah dulu dengan bonekaku. Kuajari empat dasar: bergerak, menyerang, jurus, dan berguling. Sisanya akan kau pelajari di perjalanan.",
  done: "Bagus sekali! Kau sudah siap menghadapi dunia luar. Ingat: musuh yang kuat bisa dikalahkan dengan sabar membaca gerakannya.",
  reward: { gold: 60, exp: 30, potion: 3, jimat: "gelangBesi" },
  en: { title: "Basic Training", offer: "New around here? Before leaving the village, train with my dummy first. I'll teach you four basics: moving, attacking, skills, and rolling. The rest you'll learn on the road.",
    done: "Excellent! You're ready for the outside world. Remember: strong foes can be beaten by patiently reading their moves." } });

// ---------------------------------------------------------------------
// 13. WARUNG & TUKANG PAHAT (70-warung-pahat.js): misi panduan di Desa Wanasari.
// type "aksi" = lakukan sesuatu `need` kali (aksi: "belanja" = beli jamu di warung,
// "pahat" = tingkatkan senjata di Tukang Pahat). panduan: true = misi yang mengajari
// cara bermain; diutamakan di daftar misi (lebih dulu dari cerita utama).
// ---------------------------------------------------------------------
SAMPINGAN.splice(1, 0,
  { id: "belanja", npc: "warung-desa", panduan: true, title: "Belanja di Warung", type: "aksi", aksi: "belanja", need: 1,
    offer: "Selamat datang di warungku, Nak! Di sini ada jamu, ramuan, dan jimat. Coba beli satu jamu dulu, biar kau tahu caranya. Warung seperti ini ada di setiap desa.",
    done: "Nah, gampang kan? Kalau jamumu habis, mampir saja ke warung desa mana pun.",
    reward: { gold: 30, exp: 40, potion: 1 },
    en: { title: "Shopping at the Stall", offer: "Welcome to my stall, dear! I sell jamu, tonics, and charms. Try buying one jamu first so you know how. There's a stall like this in every village.",
      done: "See, easy! When you run out of jamu, just stop by any village stall." } },
  { id: "pahatSenjata", npc: "pahat-desa", panduan: true, title: "Senjata Lebih Tajam", type: "aksi", aksi: "pahat", need: 1,
    offer: "Aku tukang pahat desa ini. Kayu, batu, besi, semua bisa kupahat dan kuasah. Bawa senjatamu ke sini, sekali tingkatkan saja, nanti ongkosnya kuganti sebagian. Bengkel pahat ada di setiap desa.",
    done: "Lihat kilaunya! Makin tinggi tingkat senjatamu, makin keras pukulanmu. Ini, kukembalikan sebagian ongkosnya.",
    reward: { gold: 40, exp: 60 },
    en: { title: "A Sharper Weapon", offer: "I'm this village's carver. Wood, stone, iron, I can carve and hone them all. Bring your weapon here and upgrade it once; I'll refund part of the cost. There's a carver's workshop in every village.",
      done: "Look at that shine! The higher your weapon's tier, the harder you hit. Here, part of the cost back." } });
