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
const NPC_DESA = [
  { id: "lurah", name: "Ki Lurah", x: 12 * T + T / 2, y: 8 * T + T / 2, color: "#6d597a", accent: "#f4b942", face: Math.PI / 2 },
  { id: "dagang", name: "Mbok Darmi", x: 9 * T + T / 2, y: 14 * T + T / 2, color: "#c0563a", accent: "#e9d3a9", face: 0 },
  // diam: true = belum bisa diajak bicara (tidak ada tombol Bicara)
  { id: "wowo", name: "Pak Wowo", x: 16 * T + T / 2, y: 14 * T + T / 2, color: "#3d6b8f", accent: "#d9c38a", hat: "#1f1a24", hair: "#2a201b", face: Math.PI, diam: true },
];
let NPCS = NPC_DESA;       // NPC di area sekarang (hanya desa yang punya NPC)
const cam = { x: START.x, y: START.y };

function newSave(cls) {
  return { cls, lv: 1, exp: 0, gold: ATURAN.awal.koin, potions: ATURAN.awal.jamu, weapon: 0, q: { idx: 0, prog: 0, status: "none" }, items: { taring: 0 }, kills: 0, bossDown: false, pos: null, tele: {} };
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
function ensureBoss() {
  const need = S.q.idx === 2 && S.q.status === "active";
  if (need && area.bos && !monsters.some((m) => m.d.boss)) monsters.push(makeMonster(area.bos.monster || "genderuwo", { x: area.bos.x * T, y: area.bos.y * T }));
}
