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
    expDasar: 25, expPangkat: 1.45,       // EXP untuk naik level = expDasar × level^expPangkat
    nyawaPerLevel: 14,                    // tambahan nyawa tiap naik level
    seranganPerLevel: 2,                  // tambahan serangan tiap naik level
    seranganPerSenjata: 3,                // tambahan serangan tiap asah senjata
  },

  toko: {
    hargaJamu: 15,
    hargaAsah: 40,                        // asah ke-1 = 40, ke-2 = 80, ke-3 = 120, ...
  },

  jamuPulih: 0.4,                         // jamu memulihkan 40% nyawa maksimal

  hindar: { lama: 0.22, jeda: 0.9, kecepatan: 470, kebal: 0.28 },

  kritis: { peluang: 0.12, kali: 1.6 },   // pukulan kritis: peluang & pengali damage

  pingsan: { koinHilang: 0.2, lama: 2.2 },// saat nyawa habis: kehilangan 20% koin

  jarakBicara: 84,

  // Cermin Gaib di sarang bos: muncul setelah bos pernah dikalahkan.
  // Sentuh cermin → pilih tingkat kesulitan 1-7 → bos muncul lagi.
  // Tingkat N baru bisa dipilih setelah tingkat N-1 dimenangkan.
  cermin: {
    jeda: 30,                             // detik sampai cermin bisa dipakai lagi
    tingkat: 7,                           // jumlah tingkat kesulitan
    nyawaTambah: 0.45,                    // tiap tingkat: nyawa bos +45%
    seranganTambah: 0.18,                 // tiap tingkat: serangan bos +18%
    cepatTambah: 0.04,                    // tiap tingkat: gerak bos +4%
    levelTambah: 2,                       // level karakter yang disarankan naik 2 tiap tingkat
    koin: 0.2,                            // hadiah koin = koin bos × 0.2 × tingkat
    exp: 0.3,                             // hadiah EXP  = EXP bos × 0.3 × tingkat
    jamuMulai: 4,                         // tingkat 4 ke atas: bonus jamu (tingkat - 3)
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
  },

  // Zona aman: monster tidak bisa masuk, peluru musuh lenyap, debuff hilang, nyawa pulih pelan.
  // Ada di area aman (desa, kota) dan di sekitar setiap mesin teleport.
  zonaAman: {
    radius: 3.2,                          // jari-jari di sekitar mesin teleport (petak)
    pulihPerDetik: 0.03,                  // nyawa pulih 3% per detik
    // bendera di sekeliling mesin teleport hanya dipasang di area-area ini
    benderaTeleport: ["candi", "kawah", "bakau", "goaLaut", "hutanBatu", "padangBayang"],
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
  },

  teleport: {
    energiMaks: 1000,                     // energi maksimal tiap mesin (1 energi = 1 nyawa)
    isiUlangPoin: 1,                      // energi bertambah sebanyak ini...
    isiUlangDetik: 300,                   // ...setiap sekian detik (300 = 5 menit), walau game ditutup
    pulihPerDetik: 30,                    // kecepatan nyawa pulih saat berdiri di dekat mesin
    jarak: 70,                            // seberapa dekat (piksel) agar nyawa pulih
  },                        // seberapa dekat ke NPC agar bisa bicara

  monster: {
    munculLagi: 16,                       // detik sampai monster biasa muncul lagi
    dropJamu: 0.08,                       // peluang monster menjatuhkan jamu
    dropTaring: 0.6,                      // peluang babi menjatuhkan taring (saat misi 2)
    dropKantong: 0.45,                    // peluang tuyul menjatuhkan kantong curian (cerita bab 3)
    dropSisik: 0.5,                       // peluang buaya rawa menjatuhkan sisik (misi Mbah Tirto)
    // barang misi lain diatur di langkah cerita / misi sampingan: `dari` (monster) & `peluang`
  },

  petaSeed: 20251119,                     // ganti angka ini = bentuk peta berubah

  audio: {
    musik: 0.6,                           // volume awal musik (0 = diam, 1 = penuh). Pemain bisa ubah di menu jeda
    sfx: 0.9,                             // volume awal efek suara
    penguat: 3.0,                         // pengeras keseluruhan: makin besar makin keras (1 = tanpa penguat)
  },
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
    desc: "Combo golok tiga tebasan. Jurus Tebasan Kilat menerjang menembus musuh.",
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
    desc: "Nyawa tebal, pukulan palu berat. Jurus Gempa menghantam semua musuh di sekitar.",
    attack: { type: "melee", range: 72, arc: 1.35, cd: 0.5, combo: [1, 1, 1.9] },
    skill: { name: "Gempa", type: "quake", cd: 7, mult: 2.6, r: 140 },
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
  { monster: "uburUbur", zona: "kuilKolam", jumlah: 4 },
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
    tempo: 300, suara: "saron", gong: 32, keras: 0.85,
    melodi: "3 5 6 1' 6 5 3 5 6 . 5 3 2 3 5 . 2 3 5 6 5 3 2 1 2 . 3 2 1 6, 1 .",
    isian: ". . 5' . . . 6' . . . 5' . 3' . . . . . 2' . . . 3' . 5' . . . 6' . 5' .", suaraIsian: "suling",
    bas: "1,, . 1, . 5,, . 5, . 6,, . 6, . 2,, . 2, .", suaraBas: "bas",
    kendang: "D . t . D t . t D . t . D t t t",
    perkusi: ". k . k . k . k",
  },
  // TEGANG: sangat cepat, bas menderu terus, kecrek tanpa henti
  luar: {
    tempo: 380, suara: "saron", gong: 16, keras: 0.75,
    melodi: "6, 1 2 1 6, 1 2 3 5 3 2 1 2 3 5 6 5 6 1' 6 5 3 5 6 5 3 2 3 2 1 6, 1",
    isian: "6 . 5 . 3 . 5 . 6 . 1' . 6 . 5 .", suaraIsian: "peking",
    bas: "6,, 6,, 6, 6,, 1, 6,, 3,, 5,,", suaraBas: "bas",
    kendang: "D . t D . t D . D . t D . t t t",
    perkusi: "x . x x x . x x",
  },
  // SERAM: pelog, pelan & jarang, dengung panjang, bisikan sumbang,
  // detak jantung (D D), dan tetesan air (k) yang tidak beraturan
  gua: {
    tempo: 200, tangga: "pelog", suara: "gelap", gong: 0, keras: 1.6,
    melodi: "1, . . . . . 2, . . . . . 1, . . . 7,, . . . . . 4, . . . . . 5, . . . . . 4, . . . 2, . . . . . . . . .",
    isian: ". . . . . . . . 2'' . . . . . . . . . . . 1'' . . . . . . 7' . . . . . . . . . . . . 4' . .", suaraIsian: "bisik",
    bas: "1,, . . . . . . . . . . . . . . . 2,, . . . . . . . . . . . . . . .", suaraBas: "dengung",
    kendang: "D D . . . . . . . . . . D D . . . . . . . . . . . . . . . . . . . . . .",
    perkusi: ". . . . . . . k . . . . . . . . . . . . . . . . . . k . . . . . . . . . . . . . B . . . . . . . . . . . . . . . . . . . . . . .",
  },
  // PALING TEGANG (bos): pelog, sangat cepat, gendang & kecrek rapat, gong tiap 8 ketukan
  bos: {
    tempo: 420, tangga: "pelog", suara: "saron", gong: 8, keras: 0.85,
    melodi: "1 2 1 7, 1 2 4 2 1 2 4 5 4 2 1 7, 5 4 2 4 5 6 5 4 2 1 2 4 2 1 7, 1",
    isian: "1' . 7 . 5 . 4 . 5 . 7 . 1' . 2' .", suaraIsian: "peking",
    bas: "1,, 1,, 1, 1,, 2,, 1,, 7,,, 7,,,", suaraBas: "bas",
    kendang: "D t D t D D t . D t D t D t t t",
    perkusi: "x x x . x x x .",
  },
  // PESISIR (Kampung Nelayan): riang, berayun seperti ombak, suling di atas bas yang santai
  pesisir: {
    tempo: 260, suara: "bonang", gong: 32, keras: 0.9,
    melodi: "5 . 6 1' . 6 5 3 5 . 3 2 . 3 5 . 6 . 5 6 1' 2' 1' 6 5 . 3 5 6 . 5 .",
    isian: ". . . . 3' . . . . . 2' . . . . . 5' . . . 6' . . . . . 1'' . . . . .", suaraIsian: "suling",
    bas: "5,, . . 5, 1,, . . 1, 6,, . . 6, 2,, . 3,, .", suaraBas: "bas",
    kendang: "D . . t . . D . D . t . . t . .",
    perkusi: ". . k . . . k . . . k . . k k .",
  },
  // KAWAH (Kawah Geni): pelog, menghentak berat, dentum besar & kecrek panas
  kawah: {
    tempo: 330, tangga: "pelog", suara: "saron", gong: 16, keras: 0.8,
    melodi: "1 . 2 1 7, . 1 2 4 . 2 1 2 . 4 5 6 . 5 4 2 . 1 2 4 5 4 2 1 . 7, .",
    isian: "5 . . 4 . . 5 . 6 . . 5 . . 4 .", suaraIsian: "peking",
    bas: "1,, . 1,, 1, 7,,, . 7,,, 1,,", suaraBas: "bas",
    kendang: "B . t . D . t D B . t . D t D t",
    perkusi: "x . x . x x x . x . x . x x x x",
  },
  // KEMENANGAN: naik bertahap ke nada tinggi, gendang makin rapat, ditutup gong
  menang: {
    tempo: 300, suara: "saron", ulang: false,
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
  { id: "penawar", npc: "joko", title: "Ramuan Penawar", type: "collect", item: "daunSambiloto", need: 5, dari: ["kera", "babi", "kelelawar"], peluang: 0.5,
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
