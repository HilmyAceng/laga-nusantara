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
    atkCd: 0, skillCd: 0, rollCd: 0, roll: 0, rdx: 0, rdy: 0, dash: 0, dashHit: null, combo: 0, comboT: 0,
    swing: 0, swingDur: 0.18, kbx: 0, kby: 0, dead: false, deadT: 0 };
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
