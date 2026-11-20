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

  // Cermin Gaib di gua: muncul setelah bos pernah kalah & misi utama selesai.
  // Sentuh cermin untuk memanggil bos lagi.
  cermin: {
    hadiahKoin: 10,                       // koin setiap bos dari cermin dikalahkan
    jeda: 30,                             // detik sampai cermin bisa dipakai lagi
  },

  // Mesin Teleport (tiang bendera). Berdiri di dekatnya = nyawa pulih memakai energi mesin.
  // Klik mesin di peta besar (tombol M) untuk pindah ke sana.
  // Peta besar: zoom paling dekat (1 = seluruh peta terlihat, 4 = 4 kali lebih dekat)
  peta: {
    zoomMaks: 4,
  },

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
const MONSTERS = {
  kera:      { name: "Kera Liar",  lv: 1, hp: 32,  atk: 6,  speed: 115, r: 14, h: 34, exp: 9,   gold: [1, 4],    range: 26,  wind: 0.4,  cd: 1.1, aggro: 190 },
  kelelawar: { name: "Kelelawar",  lv: 3, hp: 30,  atk: 8,  speed: 165, r: 12, h: 48, exp: 13,  gold: [2, 5],    range: 22,  wind: 0.3,  cd: 1.0, aggro: 230, fly: true },
  babi:      { name: "Babi Hutan", lv: 4, hp: 75,  atk: 12, speed: 95,  r: 18, h: 30, exp: 20,  gold: [3, 8],    range: 160, wind: 0.6,  cd: 1.6, aggro: 200, charge: true },
  genderuwo: { name: "Genderuwo",  lv: 8, hp: 700, atk: 20, speed: 85,  r: 30, h: 84, exp: 220, gold: [90, 130], range: 50,  wind: 0.75, cd: 1.3, aggro: 330, boss: true },

  // ---- monster baru (cerita utama) ----
  // kedip  = berteleportasi ke dekat pemain setiap sekian detik
  // copet  = [min, max] koin yang dicuri saat memukul; dikembalikan kalau tuyulnya kalah
  // tembak = menembak bola api: cd (detik), speed, jarak
  hantuKabut: { name: "Hantu Kabut",     lv: 6,  hp: 55,  atk: 11, speed: 115, r: 14, h: 46, exp: 24, gold: [3, 8],   range: 24,  wind: 0.45, cd: 1.2, aggro: 220, fly: true, kedip: 3.5 },
  buaya:      { name: "Buaya Rawa",      lv: 7,  hp: 110, atk: 15, speed: 75,  r: 20, h: 22, exp: 30, gold: [4, 10],  range: 170, wind: 0.7,  cd: 1.8, aggro: 200, charge: true },
  tuyul:      { name: "Tuyul",           lv: 5,  hp: 38,  atk: 5,  speed: 170, r: 10, h: 28, exp: 16, gold: [1, 3],   range: 20,  wind: 0.25, cd: 0.9, aggro: 210, copet: [3, 7] },
  kepiting:   { name: "Kepiting Karang", lv: 8,  hp: 150, atk: 14, speed: 65,  r: 18, h: 22, exp: 34, gold: [5, 12],  range: 30,  wind: 0.55, cd: 1.4, aggro: 170 },
  banaspati:  { name: "Banaspati",       lv: 11, hp: 85,  atk: 17, speed: 105, r: 14, h: 48, exp: 46, gold: [8, 15],  range: 24,  wind: 0.4,  cd: 1.3, aggro: 300, fly: true, tembak: { cd: 2.2, speed: 260, jarak: 330 } },

  // ---- bos baru (pola serangannya ada di js/26-monster-baru.js, lihat `ai`) ----
  dwarapala:     { name: "Dwarapala",      lv: 10, hp: 1100, atk: 22, speed: 70, r: 34, h: 100, exp: 300, gold: [120, 160], range: 56, wind: 0.8, cd: 1.4, aggro: 340, boss: true, ai: "dwarapala" },
  buayaPutih:    { name: "Buaya Putih",    lv: 13, hp: 1500, atk: 26, speed: 90, r: 36, h: 44,  exp: 450, gold: [150, 200], range: 60, wind: 0.8, cd: 1.3, aggro: 360, boss: true, ai: "buayaPutih" },
  rajaBanaspati: { name: "Raja Banaspati", lv: 16, hp: 2400, atk: 30, speed: 85, r: 34, h: 110, exp: 800, gold: [250, 320], range: 60, wind: 0.7, cd: 1.2, aggro: 400, boss: true, ai: "rajaBanaspati", fly: true },
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
// 7. CERITA UTAMA: "Kabut dari Gunung Geni" (urut dari atas ke bawah)
// Tiap langkah punya `tipe`:
//   "bicara" : bicara dengan NPC `npc`
//   "datang" : masuk ke area `area`
//   "kill"   : kalahkan `need` monster `target`
//   "collect": kumpulkan `need` barang `item` (dijatuhkan monster)
//   "teka"   : selesaikan teka-teki `id` ("obor", "pitutur", "altar")
//   "bos"    : kalahkan bos `monster` (bos baru muncul saat langkah ini aktif)
// tujuan = tulisan di kotak misi. teks = percakapan yang muncul saat langkah
// SELESAI: [pembicara, kalimat]. Pembicara "narasi" = narator.
// hadiah = { gold, exp, potion, item } diberikan saat langkah selesai.
// Langkah terakhir selesai = layar TAMAT.
// ---------------------------------------------------------------------
const CERITA = [
  // ===== BAB 1 =====
  { bab: "Bab 1 · Kabut Pertama", tipe: "bicara", npc: "resi",
    tujuan: "Temui Resi Wening di tepi alun-alun desa",
    teks: [
      ["resi", "Akhirnya kau datang, Nak. Namaku Resi Wening, pertapa dari lereng Gunung Geni."],
      ["resi", "Tiga malam lalu, gunung itu memuntahkan kabut merah. Sejak itu makhluk hutan menjadi beringas, dan arwah-arwah tua terbangun."],
      ["resi", "Di Candi Wingit, utara hutan, tersimpan Mustika Bumi, satu dari tiga mustika penjaga. Aku khawatir ia dalam bahaya."],
      ["resi", "Pergilah ke sana dan periksa. Ikuti panah emas di layarmu kalau bingung arah."],
    ],
    hadiah: { exp: 30 } },
  { bab: "Bab 1 · Kabut Pertama", tipe: "datang", area: "candi",
    tujuan: "Pergi ke Candi Wingit (utara Hutan & Padang)",
    teks: [
      ["narasi", "Udara Candi Wingit dingin dan berbau dupa tua. Pintu ke ruang dalam tertutup dinding batu."],
      ["narasi", "Di aula masuk berdiri sebuah prasasti. Mungkin ada petunjuk di sana."],
    ],
    hadiah: { exp: 40 } },
  { bab: "Bab 1 · Kabut Pertama", tipe: "teka", id: "obor",
    tujuan: "Nyalakan keempat obor di aula tengah sesuai petunjuk prasasti",
    teks: [
      ["narasi", "Api keempat menyala. Dinding batu di utara bergemuruh, lalu bergeser terbuka."],
      ["narasi", "Dari kegelapan ruang dalam, sepasang mata batu menyala merah..."],
    ],
    hadiah: { exp: 80 } },
  { bab: "Bab 1 · Kabut Pertama", tipe: "bos", monster: "dwarapala",
    tujuan: "Kalahkan Dwarapala, arca penjaga Candi Wingit",
    teks: [
      ["narasi", "Arca penjaga itu runtuh berkeping-keping. Di antara puingnya, sebutir batu hijau berdenyut pelan."],
      ["narasi", "Kamu mendapatkan Mustika Bumi! Di belakang ruangan, sebuah lorong menuju puncak kini terbuka."],
    ],
    hadiah: { gold: 120, exp: 200, item: "mustikaBumi" } },
  { bab: "Bab 1 · Kabut Pertama", tipe: "bicara", npc: "resi",
    tujuan: "Bawa Mustika Bumi kepada Resi Wening di desa",
    teks: [
      ["resi", "Mustika Bumi... syukurlah. Tapi lihat retakan ini. Ada yang mencoba mencurinya."],
      ["resi", "Dwarapala tak pernah menyerang tamu biasa. Ia dikendalikan kabut merah itu."],
      ["resi", "Dahulu, Raja Banaspati, roh api penguasa kawah, disegel leluhur kita dengan tiga mustika: Bumi, Tirta, dan Bayu. Kini segel itu melemah."],
      ["resi", "Mustika Tirta disimpan di Rawa Kabut, di selatan hutan. Pergilah sebelum kabut menelannya. Bawalah jamu ini."],
    ],
    hadiah: { exp: 80, potion: 2 } },

  // ===== BAB 2 =====
  { bab: "Bab 2 · Rawa Kabut", tipe: "datang", area: "rawa",
    tujuan: "Pergi ke Rawa Kabut (selatan Hutan & Padang)",
    teks: [
      ["narasi", "Kabut tebal menggantung di atas air hitam. Suara-suara lirih seperti memanggil namamu."],
      ["narasi", "Di dekat pintu masuk ada gubuk tua. Asap tipis keluar dari dapurnya."],
    ],
    hadiah: { exp: 60 } },
  { bab: "Bab 2 · Rawa Kabut", tipe: "bicara", npc: "tirto",
    tujuan: "Temui Mbah Tirto di gubuk tepi rawa",
    teks: [
      ["tirto", "Hehe... jarang ada orang berani masuk ke sini, Le."],
      ["tirto", "Mustika Tirta ada di pulau tengah rawa, dijaga Buaya Putih yang sudah ratusan tahun hidup. Tapi kini matanya merah, seperti dirasuki."],
      ["tirto", "Jembatan ke pulau itu ditenggelamkan leluhur. Hanya yang bisa menjawab teka-teki Batu Pitutur yang mampu memunculkannya kembali."],
      ["tirto", "Tapi hantu kabut berkeliaran di sekitar rawa utara. Usir dulu lima ekor, biar kau tenang berpikir di depan batu itu."],
    ],
    hadiah: { exp: 40 } },
  { bab: "Bab 2 · Rawa Kabut", tipe: "kill", target: "hantuKabut", need: 5,
    tujuan: "Usir Hantu Kabut di rawa utara",
    teks: [["narasi", "Kabut sedikit menipis. Batu Pitutur di tepi air kini terlihat jelas, tulisannya berpendar."]],
    hadiah: { exp: 120, gold: 40 } },
  { bab: "Bab 2 · Rawa Kabut", tipe: "teka", id: "pitutur",
    tujuan: "Jawab tiga teka-teki Batu Pitutur",
    teks: [["narasi", "Air rawa bergolak. Sebuah jembatan batu muncul perlahan dari dalam lumpur, menuju pulau di tengah rawa."]],
    hadiah: { exp: 120 } },
  { bab: "Bab 2 · Rawa Kabut", tipe: "bos", monster: "buayaPutih",
    tujuan: "Kalahkan Buaya Putih di pulau tengah rawa",
    teks: [
      ["narasi", "Buaya Putih terkulai, lalu matanya kembali jernih. Ia menatapmu sebentar, kemudian menyelam pergi."],
      ["narasi", "Di tepian pulau tertinggal sebutir batu biru yang dingin. Kamu mendapatkan Mustika Tirta!"],
      ["narasi", "Dari timur rawa tercium bau laut. Mungkin Mustika Bayu ada di sana."],
    ],
    hadiah: { gold: 150, exp: 300, item: "mustikaTirta" } },

  // ===== BAB 3 =====
  { bab: "Bab 3 · Kampung Nelayan", tipe: "datang", area: "pesisir",
    tujuan: "Ikuti jalan di timur rawa menuju Kampung Nelayan",
    teks: [
      ["narasi", "Angin laut menyambutmu. Tapi kampung ini sepi, pintu-pintu tertutup rapat."],
      ["narasi", "Seorang lelaki bertopi caping melambai dari dermaga."],
    ],
    hadiah: { exp: 80 } },
  { bab: "Bab 3 · Kampung Nelayan", tipe: "bicara", npc: "jala",
    tujuan: "Temui Pak Jala, kepala Kampung Nelayan",
    teks: [
      ["jala", "Kau pembawa mustika? Resi Wening sudah mengirim kabar lewat burung."],
      ["jala", "Mustika Bayu dijaga turun-temurun oleh keluarga kami... tapi semalam, gerombolan tuyul menyelinap dan mencurinya!"],
      ["jala", "Mereka berlarian di sekitar kampung. Tangkap mereka dan rebut kembali kantong-kantong curian itu."],
      ["jala", "Awas, tuyul suka mencopet koin orang yang lengah. Kalahkan mereka supaya koinmu kembali."],
    ],
    hadiah: { exp: 40 } },
  { bab: "Bab 3 · Kampung Nelayan", tipe: "collect", item: "kantong", need: 3,
    tujuan: "Rebut kantong curian dari Tuyul",
    teks: [["narasi", "Kantong ketiga terasa berat. Di dalamnya ada sesuatu yang berhembus dingin seperti angin."]],
    hadiah: { exp: 100 } },
  { bab: "Bab 3 · Kampung Nelayan", tipe: "bicara", npc: "jala",
    tujuan: "Kembalikan kantong curian kepada Pak Jala",
    teks: [
      ["jala", "Ini dia! Mustika Bayu, utuh! Leluhur kami pasti tersenyum."],
      ["jala", "Terimalah, Nak. Bawa ketiga mustika ke Kawah Geni, di puncak gunung, lewat lorong terdalam Candi Wingit."],
      ["jala", "Mesin teleport di kampung ini sudah menyala. Buka peta kalau ingin pulang cepat."],
    ],
    hadiah: { gold: 100, exp: 200, potion: 3, item: "mustikaBayu" } },

  // ===== BAB 4 =====
  { bab: "Bab 4 · Kawah Geni", tipe: "datang", area: "kawah",
    tujuan: "Naik ke Kawah Geni lewat lorong utara Candi Wingit",
    teks: [
      ["narasi", "Panas menyengat kulit. Sungai lava membelah kawah, dan di seberangnya bara raksasa berdenyut seperti jantung."],
      ["narasi", "Di tepi lava berdiri sebuah altar dengan tiga cekungan."],
    ],
    hadiah: { exp: 100 } },
  { bab: "Bab 4 · Kawah Geni", tipe: "teka", id: "altar",
    tujuan: "Letakkan ketiga mustika di altar",
    teks: [
      ["narasi", "Ketiga mustika bersinar: hijau, biru, dan putih. Lava di depanmu mendesis, lalu mengeras menjadi jembatan batu."],
      ["raja", "Siapa berani menginjak kawahku? Datanglah, anak manusia. Akan kujadikan kau abu!"],
    ],
    hadiah: { exp: 150 } },
  { bab: "Bab 4 · Kawah Geni", tipe: "bos", monster: "rajaBanaspati",
    tujuan: "Kalahkan Raja Banaspati",
    teks: [
      ["raja", "Mustahil... dikalahkan... anak manusia..."],
      ["narasi", "Api raksasa itu meredup menjadi bara kecil, lalu padam. Kabut merah di langit perlahan menghilang."],
      ["narasi", "Kembalilah ke Resi Wening di Desa Wanasari."],
    ],
    hadiah: { gold: 300, exp: 500 } },
  { bab: "Bab 4 · Kawah Geni", tipe: "bicara", npc: "resi",
    tujuan: "Kembali ke Resi Wening di Desa Wanasari",
    teks: [
      ["resi", "Kabut sudah hilang. Dengar, burung-burung kembali bernyanyi."],
      ["resi", "Segel sudah kupulihkan dengan ketiga mustika. Seluruh Nusantara berutang padamu, Nak."],
      ["resi", "Tapi ingat: api tak pernah benar-benar padam. Tetaplah berlatih. Cermin-cermin gaib kini terbangun di sarang para penjaga, bila kau ingin menguji diri lagi."],
    ],
    hadiah: { exp: 300 } },
];

// ---------------------------------------------------------------------
// 8. MISI SAMPINGAN LAIN (dari NPC selain Ki Lurah)
// npc = siapa yang memberi. type & isi sama seperti misi Ki Lurah.
// hadiah.weapon = naik tingkat senjata gratis.
// ---------------------------------------------------------------------
const SAMPINGAN = [
  { id: "kepiting", npc: "kardi", title: "Kepiting Nakal", type: "kill", target: "kepiting", need: 6,
    offer: "Kepiting karang merusak jaring kami di pantai selatan. Bisa kau usir enam ekor?",
    done: "Pantai aman lagi! Ini upah dari para nelayan.",
    reward: { gold: 70, exp: 120, potion: 2 } },
  { id: "sisik", npc: "tirto", title: "Sisik Buaya", type: "collect", item: "sisik", need: 3,
    offer: "Mbah butuh tiga sisik buaya rawa untuk menempa ulang senjatamu. Buaya-buaya itu ada di rawa selatan.",
    done: "Sisik yang bagus. Sini, Mbah tempa senjatamu sebentar... nah, lebih tajam!",
    reward: { gold: 40, exp: 150, weapon: 1 } },
];
