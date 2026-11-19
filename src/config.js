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

  jarakBicara: 84,                        // seberapa dekat ke NPC agar bisa bicara

  monster: {
    munculLagi: 16,                       // detik sampai monster biasa muncul lagi
    dropJamu: 0.08,                       // peluang monster menjatuhkan jamu
    dropTaring: 0.6,                      // peluang babi menjatuhkan taring (saat misi 2)
  },

  petaSeed: 20251119,                     // ganti angka ini = bentuk peta berubah
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
// Zona: "forest" (hutan timur), "north" (padang utara), "south" (padang selatan).
// Bos Genderuwo tidak ditulis di sini: dia muncul sendiri saat misi ke-3 aktif.
const SPAWN = [
  { monster: "kera", zona: "forest", jumlah: 9 },
  { monster: "kelelawar", zona: "north", jumlah: 6 },
  { monster: "babi", zona: "south", jumlah: 7 },
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
