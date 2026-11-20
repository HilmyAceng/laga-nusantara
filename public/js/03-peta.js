// =====================================================================
// PETA
// Jenis petak, dan bentuk semua area (Desa, Hutan & Padang, Gua, Candi Wingit).
// Tiap area punya build() untuk menyusun petak dan gerbang[] untuk pindah area.
// =====================================================================
"use strict";

const T = 40;
const G = 0, PATH = 1, WATER = 2, BRIDGE = 3, TREE = 4, ROCK = 5, HOUSE = 6, CAVE = 7, FLOWER = 8, WALL = 9;
const SOLID = new Set([WATER, TREE, ROCK, HOUSE, WALL]);
// Peta yang sedang aktif. Isinya diganti setiap pindah area (lihat loadArea).
let MW = 0, MH = 0, map = new Uint8Array(0), houses = [], ZONES = {}, area = null, areaId = "";
function seeded(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
// Di luar batas peta dianggap "tepi" area: pohon untuk desa/alam, dinding untuk gua.
const tileAt = (tx, ty) => (tx < 0 || ty < 0 || tx >= MW || ty >= MH ? area.tepi : map[ty * MW + tx]);
const setT = (tx, ty, v) => { if (tx >= 0 && ty >= 0 && tx < MW && ty < MH) map[ty * MW + tx] = v; };
const inZone = (z, tx, ty) => tx >= z.x0 && tx <= z.x1 && ty >= z.y0 && ty <= z.y1;
const fillRect = (x0, y0, x1, y1, v) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) setT(x, y, v); };

// ---------------------------------------------------------------------
// AREA. Masing-masing peta sendiri; pindah lewat "gerbang"
// (kotak petak). Saat pemain menginjak gerbang: layar gelap → area baru.
//   gerbang.masuk = titik muncul (dalam petak) di area tujuan
// ---------------------------------------------------------------------
const AREAS = {
  desa: {
    nama: "Desa Wanasari", sub: "Tempat aman — tidak ada monster", lagu: "desa", tepi: TREE, w: 24, h: 24,
    zona: { village: { x0: 3, y0: 3, x1: 20, y1: 21 } },
    gerbang: [{ x0: 23, y0: 10, x1: 23, y1: 12, ke: "alam", masuk: { x: 3.5, y: 22.5 }, label: "Hutan →" }],
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (x < 2 || y < 2 || y >= MH - 2 || x === MW - 1) setT(x, y, TREE);
        else if (r() < 0.035) setT(x, y, FLOWER);
      }
      for (let y = 2; y < MH - 2; y++) for (let x = 2; x < 21; x++) if (!inZone(ZONES.village, x, y) && r() < 0.14) setT(x, y, TREE);
      // sungai di timur desa + jembatan menuju hutan
      for (let y = 0; y < MH; y++) for (const x of [21, 22]) setT(x, y, y >= 10 && y <= 12 ? BRIDGE : WATER);
      // jalan
      for (let x = 4; x <= 20; x++) for (let y = 10; y <= 12; y++) setT(x, y, PATH);
      fillRect(23, 10, 23, 12, PATH);
      for (let y = ZONES.village.y0; y <= ZONES.village.y1; y++) setT(12, y, PATH);
      // rumah-rumah desa (3x2 petak)
      for (const [hx, hy] of [[5, 5], [15, 5], [5, 16], [15, 16]]) { houses.push({ x: hx, y: hy }); fillRect(hx, hy, hx + 2, hy + 1, HOUSE); }
      // bersihkan area di sekitar NPC & titik mulai
      for (const [x, y] of [[12, 8], [9, 14], [16, 14], [12, 12]]) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (SOLID.has(tileAt(x + dx, y + dy)) && tileAt(x + dx, y + dy) !== HOUSE) setT(x + dx, y + dy, G);
    },
  },
  alam: {
    nama: "Hutan & Padang", sub: "Hati-hati, banyak monster", lagu: "luar", tepi: TREE, w: 40, h: 44,
    zona: {
      forest: { x0: 7, y0: 15, x1: 22, y1: 29 },
      north: { x0: 6, y0: 3, x1: 36, y1: 12 },
      south: { x0: 6, y0: 32, x1: 36, y1: 40 },
      gunung: { x0: 25, y0: 15, x1: 37, y1: 29 },
    },
    gerbang: [
      { x0: 0, y0: 21, x1: 0, y1: 23, ke: "desa", masuk: { x: 19.5, y: 11.5 }, label: "← Desa" },
      { x0: 25, y0: 21, x1: 26, y1: 23, ke: "gua", masuk: { x: 2.5, y: 8.5 }, label: "Gua →" },
      { x0: 15, y0: 0, x1: 17, y1: 0, ke: "candi", masuk: { x: 15.5, y: 23.5 }, label: "Ke Candi" },
    ],
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (y < 2 || y >= MH - 2 || x >= MW - 2) setT(x, y, TREE);
        else if (r() < 0.035) setT(x, y, FLOWER);
      }
      // sungai di barat + jembatan kembali ke desa
      for (let y = 0; y < MH; y++) for (const x of [0, 1]) setT(x, y, y >= 21 && y <= 23 ? BRIDGE : WATER);
      const Z = ZONES;
      for (let y = 2; y < MH - 2; y++) for (let x = 2; x < MW - 2; x++) {
        if (inZone(Z.forest, x, y) && r() < 0.17) setT(x, y, TREE);
        else if (inZone(Z.north, x, y)) { const v = r(); if (v < 0.06) setT(x, y, ROCK); else if (v < 0.13) setT(x, y, TREE); }
        else if (inZone(Z.south, x, y)) { const v = r(); if (v < 0.05) setT(x, y, TREE); else if (v < 0.13) setT(x, y, FLOWER); }
        else if (!inZone(Z.gunung, x, y) && x > 2 && r() < 0.05) setT(x, y, TREE);
      }
      // bukit batu dengan mulut gua
      const g = Z.gunung;
      fillRect(g.x0, g.y0, g.x1, g.y1, WALL);
      fillRect(g.x0, 21, g.x0 + 1, 23, CAVE);
      // jalan
      for (let x = 2; x < g.x0; x++) for (let y = 21; y <= 23; y++) setT(x, y, y === 22 || x < 4 ? PATH : (r() < 0.75 ? PATH : G));
      for (let y = 4; y <= 38; y++) setT(16, y, PATH);
      // jalan ke utara menuju Candi Wingit
      fillRect(15, 0, 17, 3, PATH);
    },
  },
  candi: {
    nama: "Candi Wingit", sub: "Reruntuhan angker di utara hutan", lagu: "gua", tepi: WALL, w: 30, h: 26, gelap: true,
    // monster hanya di aula tengah & bilik utara; aula masuk (selatan) aman
    zona: { candi: { x0: 2, y0: 1, x1: 27, y1: 15 } },
    gerbang: [{ x0: 14, y0: 25, x1: 16, y1: 25, ke: "alam", masuk: { x: 16.5, y: 2.5 }, label: "Ke Hutan" }],
    // mesin teleport (13-teleport.js), dekat pintu masuk dari hutan
    teleport: { id: "candi", x: 18.5, y: 22.5 },
    build() {
      fillRect(0, 0, MW - 1, MH - 1, WALL);
      fillRect(1, 1, MW - 2, MH - 2, CAVE);
      fillRect(14, 25, 16, 25, CAVE);              // pintu masuk dari hutan
      // tembok pemisah: aula masuk | aula tengah | dua bilik utara
      fillRect(1, 17, 28, 17, WALL); fillRect(13, 17, 17, 17, CAVE);
      fillRect(1, 9, 28, 9, WALL); fillRect(4, 9, 6, 9, CAVE); fillRect(23, 9, 25, 9, CAVE);
      fillRect(15, 1, 15, 8, WALL); fillRect(15, 4, 15, 5, CAVE);
      // tiang-tiang batu
      for (const [x, y] of [[6, 12], [6, 14], [11, 12], [11, 14], [19, 12], [19, 14], [24, 12], [24, 14], [8, 21], [22, 21], [5, 3], [10, 6], [20, 3], [25, 6]]) setT(x, y, WALL);
    },
  },
  gua: {
    nama: "Gua Genderuwo", sub: "Sarang penunggu hutan", lagu: "gua", tepi: WALL, w: 22, h: 17, gelap: true,
    zona: {},
    gerbang: [{ x0: 0, y0: 7, x1: 0, y1: 9, ke: "alam", masuk: { x: 23.5, y: 22.5 }, label: "← Keluar" }],
    bos: { x: 16.5, y: 8.5, monster: "genderuwo" },   // titik bos & jenisnya (cermin gaib juga di sini)
    build() {
      fillRect(0, 0, MW - 1, MH - 1, WALL);
      fillRect(1, 1, MW - 2, MH - 2, CAVE);
      fillRect(0, 7, 0, 9, CAVE);
      for (const [x, y] of [[6, 4], [6, 12], [10, 6], [10, 11], [14, 3], [14, 13], [19, 5], [19, 12]]) setT(x, y, WALL);
    },
  },
};
// Bangun peta area `id` (selalu sama karena pakai seed).
function buildArea(id) {
  area = AREAS[id]; areaId = id;
  MW = area.w; MH = area.h; map = new Uint8Array(MW * MH); houses = []; ZONES = area.zona;
  area.build(seeded(ATURAN.petaSeed + id.length * 7919));
}
buildArea("desa");

function solidAt(px, py) { return SOLID.has(tileAt(Math.floor(px / T), Math.floor(py / T))); }
function moveEnt(e, dx, dy, fly) {
  const r = e.r * 0.8;
  if (fly) { e.x = clamp(e.x + dx, 2 * T, (MW - 2) * T); e.y = clamp(e.y + dy, 2 * T, (MH - 2) * T); return; }
  if (dx) { const nx = e.x + dx, sx = nx + Math.sign(dx) * r; if (!solidAt(sx, e.y - r * 0.6) && !solidAt(sx, e.y + r * 0.4)) e.x = nx; }
  if (dy) { const ny = e.y + dy, sy = ny + Math.sign(dy) * r * 0.6; if (!solidAt(e.x - r, sy) && !solidAt(e.x + r, sy)) e.y = ny; }
}
function freeSpot(z) {
  for (let i = 0; i < 200; i++) {
    const tx = Math.floor(rand(z.x0 + 1, z.x1)), ty = Math.floor(rand(z.y0 + 1, z.y1));
    if (!SOLID.has(tileAt(tx, ty))) return { x: tx * T + T / 2, y: ty * T + T / 2 };
  }
  return { x: (z.x0 + 2) * T, y: (z.y0 + 2) * T };
}
