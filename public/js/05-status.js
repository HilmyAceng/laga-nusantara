// =====================================================================
// STATUS PERMAINAN
// Variabel utama permainan (S = progres tersimpan, P = pemain, monsters, ...),
// NPC desa, serta pembuat pemain & monster.
// =====================================================================
"use strict";

const SAVE_KEY = "laga.rpg.save";
let S = null;              // progres yang disimpan
let P = null;              // tubuh pemain di peta
let mode = "select", chosen = "pendekar";
let monsters = [], projs = [], effects = [], parts = [], numbers = [], pickups = [];
let freeze = 0, shake = 0, saveTimer = 0, nearNpc = null;
const START = { x: 12 * T + T / 2, y: 12 * T + T / 2 };   // titik muncul di desa
// Semua NPC di dunia. area = di peta mana. x, y dalam petak.
// diam: true = belum bisa diajak bicara. toko: true = menjual jamu & asah senjata.
// obrolan = kalimat acak saat diajak bicara (kalau tidak ada urusan cerita/misi).
const NPC_DATA = [
  { id: "lurah", name: "Ki Lurah", area: "desa", x: 12.5, y: 8.5, color: "#6d597a", accent: "#f4b942", hat: "#2b2238", hair: "#d9d4cc", face: Math.PI / 2 },
  { id: "dagang", name: "Mbok Darmi", area: "desa", x: 9.5, y: 14.5, color: "#c0563a", accent: "#e9d3a9", face: 0, toko: true },
  { id: "wowo", name: "Pak Wowo", area: "desa", x: 16.5, y: 14.5, color: "#3d6b8f", accent: "#d9c38a", hat: "#1f1a24", hair: "#2a201b", face: Math.PI, diam: true },
  { id: "resi", name: "Resi Wening", area: "desa", x: 8.5, y: 9.4, color: "#e8e2d0", accent: "#c9a24a", hair: "#f2f2f2", face: Math.PI / 2,
    obrolan: ["Kabut itu datang dari Gunung Geni. Aku bisa merasakannya.", "Berlatihlah, Nak. Musuh di depan akan makin kuat.", "Mbok Darmi menjual jamu yang bagus. Jangan pergi tanpa bekal."] },
  { id: "tirto", name: "Mbah Tirto", area: "rawa", x: 21.5, y: 6.3, color: "#6b5a3a", accent: "#c9b48a", hair: "#d9d4cc", face: Math.PI / 2,
    obrolan: ["Rawa ini dulu jernih, Le. Ikannya besar-besar.", "Jangan terlalu dekat air dalam. Buaya rawa suka menerjang tiba-tiba.", "Hantu kabut itu takut cahaya. Sayang Mbah sudah tak kuat bawa obor."] },
  { id: "jala", name: "Pak Jala", area: "pesisir", x: 30.5, y: 12.6, color: "#2d6a96", accent: "#e9d3a9", hat: "#c9a26b", face: Math.PI,
    obrolan: ["Laut sedang tenang. Semoga besok tangkapan bagus.", "Kalau capek, singgahlah di warung Mak Inah.", "Hati-hati dengan tuyul. Kantongmu bisa tiba-tiba ringan!"] },
  { id: "inah", name: "Mak Inah", area: "pesisir", x: 17.5, y: 8.5, color: "#a0436b", accent: "#f4d58a", face: 0, toko: true },
  { id: "kardi", name: "Bang Kardi", area: "pesisir", x: 33.5, y: 20.5, color: "#4e7f52", accent: "#e1c699", hair: "#1f1a24", face: Math.PI / 2,
    obrolan: ["Ombak hari ini cocok buat melaut.", "Kepiting karang itu cangkangnya keras. Pukul terus jangan kasih ampun!"] },
  // tabib desa: misi sampingan "Ramuan Penawar" (cara menyembuhkan debuff)
  { id: "joko", name: "Pak Joko", area: "desa", x: 6.5, y: 19.4, color: "#4f7a5a", accent: "#e9d3a9", hat: "#3b2a22", hair: "#8d8894", face: 0,
    obrolan: ["Kalau kena racun, cepat cari zona aman di dekat mesin teleport.", "Sambiloto itu pahit, tapi pahit yang menyembuhkan.", "Jangan remehkan rasa pening, Nak. Bisa-bisa kau berjalan ke arah yang salah."],
    obrolanEn: ["If you're poisoned, find a safe zone near a teleport beacon quickly.", "Sambiloto is bitter, but it's a healing bitterness.", "Don't shrug off dizziness, my child. You might walk the wrong way."] },

  // ---- Dunia 2 · Bandar Segara ----
  { id: "bahar", name: "Datuk Bahar", area: "bandar", x: 11.5, y: 12.4, color: "#1f4e79", accent: "#f4b942", hat: "#1b1208", hair: "#d9d4cc", face: Math.PI / 2,
    obrolan: ["Setiap kapal yang masuk, aku catat. Setiap kabut yang datang, aku curigai.", "Pelabuhan ini tak pernah tidur, Kisanak."],
    obrolanEn: ["Every ship that docks, I log. Every mist that rolls in, I suspect.", "This harbor never sleeps, traveler."] },
  { id: "laras", name: "Nyi Laras", area: "bandar", x: 27.5, y: 17.4, color: "#2a9d8f", accent: "#e9f5f2", hair: "#1f1a2a", face: Math.PI,
    obrolan: ["Laut menyimpan semua cerita. Kita hanya perlu mendengar.", "Air tenang bukan berarti tak berarus."],
    obrolanEn: ["The sea keeps every story. We only have to listen.", "Calm water doesn't mean there's no current."] },
  { id: "bayu", name: "Bayu", area: "bandar", x: 8.5, y: 17.4, color: "#e07a3a", accent: "#f7efe3", hair: "#1f1a2a", face: 0,
    obrolan: ["Kak, ajari aku jurus dong!", "Suatu hari aku juga mau jadi pendekar keliling!"],
    obrolanEn: ["Teach me a move, please!", "Someday I'll be a wandering hero too!"] },
  { id: "sari", name: "Mbak Sari", area: "bandar", x: 15.5, y: 17.4, color: "#b5466b", accent: "#f4d58a", face: 0, toko: true },
  { id: "rimba", name: "Pak Rimba", area: "bandar", x: 22.5, y: 3.4, color: "#5a4a2a", accent: "#9c7a3a", hat: "#3a2c1a", hair: "#8d8894", face: Math.PI / 2,
    obrolan: ["Hutan Larangan itu bukan tempat main-main.", "Dengarkan hutan. Kalau burung diam, ada pemangsa dekat."],
    obrolanEn: ["The Forbidden Forest is no playground.", "Listen to the forest. When the birds go quiet, a predator is near."] },

  // ---- Dunia 3 · Kampung Awan ----
  { id: "sukma", name: "Eyang Sukma", area: "awan", x: 17.5, y: 9.4, color: "#f2efe6", accent: "#8fd3ff", hair: "#ffffff", face: Math.PI / 2,
    obrolan: ["Dari sini, dunia di bawah tampak kecil sekali. Masalahnya tidak.", "Wening masih suka jambu? Hihihi."],
    obrolanEn: ["From up here the world below looks tiny. Its troubles don't.", "Does Wening still love guavas? Hee hee."] },
  { id: "kirana", name: "Kirana", area: "awan", x: 24.5, y: 16.4, color: "#7a3b8f", accent: "#f4b942", hair: "#2a1a1a", face: Math.PI,
    obrolan: ["Aku tidak butuh bantuan. ...Tapi terima kasih.", "Busurku belum pernah meleset. Hampir."],
    obrolanEn: ["I don't need help. ...But thanks.", "My bow has never missed. Almost."] },
  { id: "gora", name: "Empu Gora", area: "awan", x: 9.5, y: 12.4, color: "#5c3a2a", accent: "#ff9f43", hair: "#2a201b", face: 0, toko: true },
  { id: "angon", name: "Ki Angon", area: "awan", x: 27.5, y: 21.4, color: "#9c8a5a", accent: "#f7efe3", hat: "#c9a26b", face: Math.PI,
    obrolan: ["Kambing awan itu lembut seperti awan, galak seperti petir.", "Mau coba keju kambing awan? Baunya... luar biasa."],
    obrolanEn: ["Cloud goats are soft as clouds and fierce as thunder.", "Want to try cloud-goat cheese? The smell is... remarkable."] },

  // ---- Bab 6-10 ----
  { id: "parmin", name: "Pak Parmin", area: "sawah", x: 14.5, y: 15.4, color: "#7a6a3a", accent: "#e9d3a9", hat: "#c9a26b", face: Math.PI / 2,
    obrolan: ["Tikus segede kucing! Kucing segede... ah sudahlah.", "Padi tahun ini bagus, kalau tidak dimakan bayangan."],
    obrolanEn: ["Rats as big as cats! Cats as big as... never mind.", "The rice is good this year, if the shadows don't eat it."] },
  { id: "juru", name: "Mbah Juru", area: "sawah", x: 34.5, y: 13.4, color: "#4a4038", accent: "#c9a24a", hair: "#f2f2f2", face: Math.PI,
    obrolan: ["Tujuh turunan keluargaku menjaga makam itu.", "Wening kecil dulu suka mencuri kemenyan. Jangan bilang-bilang."],
    obrolanEn: ["Seven generations of my family have kept that tomb.", "Little Wening used to steal incense. Don't tell anyone."] },
  { id: "wulan", name: "Wulan", area: "desaApung", x: 12.5, y: 14.4, color: "#2a7f9e", accent: "#f7efe3", hair: "#1f1a2a", face: 0,
    obrolan: ["Laut itu rumahku. Aku bisa menahan napas lama sekali!", "Ibu dulu bernyanyi untuk penjaga gua."],
    obrolanEn: ["The sea is my home. I can hold my breath for ages!", "Mother used to sing for the cave's guardian."] },
  { id: "sanip", name: "Pak Sanip", area: "desaApung", x: 22.5, y: 14.4, color: "#8f5a2a", accent: "#f4d58a", hat: "#3a2c1a", face: Math.PI, toko: true },
  { id: "bujang", name: "Bujang Angin", area: "lembahAngin", x: 30.5, y: 10.4, color: "#e0a03a", accent: "#2a9d8f", hair: "#2a201b", face: Math.PI / 2,
    obrolan: ["Angin di sini bisa menerbangkan sandalmu. Pegang erat-erat!", "Layangan terbaik butuh benang terkuat."],
    obrolanEn: ["The wind here can blow your sandals away. Hold on tight!", "The best kite needs the strongest string."] },
  { id: "ratri", name: "Nyai Ratri", area: "lembahAngin", x: 21.5, y: 5.4, color: "#c9d6ea", accent: "#b88cff", hair: "#e8e2f0", face: Math.PI / 2,
    obrolan: ["Istana itu dulu penuh lagu. Sekarang hanya angin yang bernyanyi.", "Aku menunggu seseorang... sudah terlalu lama."],
    obrolanEn: ["That palace was once full of songs. Now only the wind sings.", "I've been waiting for someone... for far too long."] },
  { id: "cahya", name: "Ki Cahya", area: "perkemahan", x: 14.5, y: 10.4, color: "#f2e6c9", accent: "#ff9f43", hair: "#ffffff", face: Math.PI / 2,
    obrolan: ["Jaga apimu tetap menyala, Nak. Di sini, cahaya adalah nyawa.", "Bayanganmu masih utuh. Bagus."],
    obrolanEn: ["Keep your fire burning, child. Here, light is life.", "Your shadow is still whole. Good."] },
  { id: "lintang", name: "Lintang", area: "perkemahan", x: 21.5, y: 15.4, color: "#5a6a8f", accent: "#f4b942", hair: "#2a201b", face: Math.PI, toko: true },
  { id: "sekar", name: "Sekar", area: "perkemahan", x: 10.5, y: 15.4, color: "#e8e2f0", accent: "#ff9fbf", hair: "#1f1a2a", face: 0,
    obrolan: ["Aku tidak punya bayangan. Jangan takut.", "Dulu di sini ada taman melati..."],
    obrolanEn: ["I have no shadow. Don't be afraid.", "There used to be a jasmine garden here..."] },
];
for (const n of NPC_DATA) { n.x *= T; n.y *= T; }
const npcDi = (id) => NPC_DATA.filter((n) => n.area === id);
const npcById = (id) => NPC_DATA.find((n) => n.id === id);
let NPCS = npcDi("desa");     // NPC di area sekarang
const cam = { x: START.x, y: START.y };

function newSave(cls) {
  return { cls, lv: 1, exp: 0, gold: ATURAN.awal.koin, potions: ATURAN.awal.jamu, weapon: 0, q: { idx: 0, prog: 0, status: "none" }, items: { taring: 0 }, kills: 0, bossDown: false, pos: null, tele: {},
    cerita: { idx: 0, prog: 0 },   // langkah cerita utama (23-cerita.js)
    teka: {},                       // teka-teki yang sudah selesai (25-teka-teki.js)
    bos: {},                        // bos yang pernah dikalahkan
    side: {},                       // misi sampingan lain (24-sampingan.js)
    dikunjungi: { desa: true },     // area yang pernah didatangi (peta dunia & teleport)
    buka: {},                       // gerbang yang sudah dibuka cerita (kapal, kuil, pelangi)
    cermin: {},                     // tingkat tantangan bos tertinggi yang sudah dimenangkan (34-tantangan-bos.js)
    ceritaV: 2,                     // versi cerita (lihat migrasi di 23-cerita.js)
  };
}
// Simpan progres + posisi terakhir (area, titik, nyawa) supaya "Lanjutkan" mulai di tempat tadi.
// Saat pindah area (transit) posisi lama dipertahankan; saat pingsan → nanti mulai di desa.
function save() {
  if (!S) return;
  if (P && mode !== "select" && mode !== "transit") {
    S.pos = P.dead ? null : { area: areaId, x: +(P.x / T).toFixed(2), y: +(P.y / T).toFixed(2), hp: Math.ceil(P.hp) };
  }
  store.set(SAVE_KEY, S);
}

function makePlayer() {
  return { x: START.x, y: START.y, r: 12, face: 0, run: 0, moving: false, hp: maxHp(), inv: 1, flash: 0,
    atkCd: 0, cd: [0, 0], cdMaks: [1, 1], tenaga: 0, rollCd: 0, lapis: ATURAN.hindar.lapis, lapisT: 0, roll: 0, rdx: 0, rdy: 0, dash: 0, dashHit: null, combo: 0, comboT: 0,
    swing: 0, swingDur: 0.18, kbx: 0, kby: 0, dead: false, deadT: 0, debuff: {} };
}

function makeMonster(type, spot) {
  const d = MONSTERS[type];
  return { type, d, x: spot.x, y: spot.y, home: { ...spot }, r: d.r, hp: d.hp, state: "idle", st: 0, cd: rand(0, 1), wt: rand(0, 2),
    wx: 0, wy: 0, ang: 0, kbx: 0, kby: 0, flash: 0, dead: false, respawn: 0, aggro: false, seen: 0, hitP: false, next: "swipe", run: Math.random() * 6 };
}
function spawnMonsters() {
  monsters = [];
  for (const sp of SPAWN) if (ZONES[sp.zona]) for (let i = 0; i < sp.jumlah; i++) monsters.push(makeMonster(sp.monster, freeSpot(ZONES[sp.zona])));
  ensureBoss();
}
// Bos area ini perlu muncul? Genderuwo: saat misi ke-3 Ki Lurah aktif. Bos lain: saat langkah cerita-nya aktif.
function bosPerluMuncul() {
  if (!area.bos || !S) return false;
  const jenis = area.bos.monster;
  if (jenis === "genderuwo") return S.q.idx === 2 && S.q.status === "active";
  return ceritaButuhBos(jenis);
}
function ensureBoss() {
  if (bosPerluMuncul() && !monsters.some((m) => m.d.boss && !m.dead)) monsters.push(makeMonster(area.bos.monster, { x: area.bos.x * T, y: area.bos.y * T }));
}
