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
};

// Berapa banyak monster di tiap zona peta.
// Zona di peta "Hutan & Padang": "forest" (hutan), "north" (padang utara),
// "south" (padang selatan). Zona di peta "Candi Wingit": "candi".
// Bos Genderuwo tidak ditulis di sini: dia muncul di peta Gua saat misi ke-3 aktif.
const SPAWN = [
  { monster: "kera", zona: "forest", jumlah: 9 },
  { monster: "kelelawar", zona: "north", jumlah: 6 },
  { monster: "babi", zona: "south", jumlah: 7 },
  // Candi Wingit (dungeon di utara hutan)
  { monster: "kelelawar", zona: "candi", jumlah: 7 },
  { monster: "babi", zona: "candi", jumlah: 4 },
];

// ---------------------------------------------------------------------
// 5. MISI DARI KI LURAH (urut dari atas ke bawah)
// type "kill": kalahkan `need` monster jenis `target`.
// type "collect": kumpulkan `need` barang `item`.
// Misi terakhir selesai = layar "Desa selamat".
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
