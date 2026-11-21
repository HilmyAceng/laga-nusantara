// =====================================================================
// PETA
// Jenis petak, dan bentuk semua area (Desa, Hutan & Padang, Gua, Candi Wingit).
// Tiap area punya build() untuk menyusun petak dan gerbang[] untuk pindah area.
// =====================================================================
"use strict";

const T = 40;
const G = 0, PATH = 1, WATER = 2, BRIDGE = 3, TREE = 4, ROCK = 5, HOUSE = 6, CAVE = 7, FLOWER = 8, WALL = 9;
// petak baru: pasir pantai, lava (tidak bisa dilewati), abu vulkanik, lumpur rawa, ilalang rawa (tidak bisa dilewati)
const SAND = 10, LAVA = 11, ASH = 12, MUD = 13, REED = 14;
// petak dunia 2 & 3: awan (tidak bisa dilewati), lantai batu, karang laut (tidak bisa dilewati)
const CLOUD = 15, STONE = 16, CORAL = 17;
const SOLID = new Set([WATER, TREE, ROCK, HOUSE, WALL, LAVA, REED, CLOUD, CORAL]);
// Tiga dunia. Area mana masuk dunia mana: `dunia` di tiap area.
const DUNIA = [
  { id: 1, nama: "Tanah Wanasari", namaEn: "Wanasari Lands" },
  { id: 2, nama: "Kepulauan Segara", namaEn: "Segara Isles" },
  { id: 3, nama: "Negeri Awan", namaEn: "Cloud Highlands" },
];
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
//   bos      = titik bos & jenisnya (bos muncul sesuai cerita / misi)
//   teleport = mesin teleport (14-teleport.js)
//   objek    = benda teka-teki: obor, prasasti, batu pitutur, altar (25-teka-teki.js)
//   kabut / panas / gelap = efek layar (rawa berkabut, kawah panas, gua gelap)
//   dunia    = 1, 2, atau 3 (peta dunia dikelompokkan per dunia)
//   aman     = true → seluruh area adalah zona aman (33-zona-aman.js)
//   gerbang.kunci = gerbang tertutup sampai S.buka[kunci] (dibuka cerita), atau "bos:<jenis>"
//                   (terbuka setelah bos itu kalah)
// build() boleh membaca S (progres) untuk membuka pintu/jembatan yang sudah dibuka pemain.
// ---------------------------------------------------------------------
const AREAS = {
  desa: {
    dunia: 1, nama: "Desa Wanasari", sub: "Tempat aman — tidak ada monster", aman: true, lagu: "desa", tepi: TREE, w: 24, h: 24,
    zona: { village: { x0: 3, y0: 3, x1: 20, y1: 21 } },
    gerbang: [{ x0: 23, y0: 10, x1: 23, y1: 12, ke: "alam", masuk: { x: 3.5, y: 22.5 }, label: "Hutan →" }],
    teleport: { id: "desa", x: 19.5, y: 14.5 },
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
      for (const [x, y] of [[12, 8], [9, 14], [16, 14], [12, 12], [8, 9], [19, 14]]) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (SOLID.has(tileAt(x + dx, y + dy)) && tileAt(x + dx, y + dy) !== HOUSE) setT(x + dx, y + dy, G);
    },
  },
  alam: {
    dunia: 1, nama: "Hutan & Padang", sub: "Hati-hati, banyak monster", lagu: "luar", tepi: TREE, w: 40, h: 44,
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
      { x0: 15, y0: 43, x1: 17, y1: 43, ke: "rawa", masuk: { x: 19.5, y: 2.5 }, label: "Ke Rawa" },
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
      // jalan ke utara menuju Candi Wingit, dan ke selatan menuju Rawa Kabut
      fillRect(15, 0, 17, 3, PATH);
      fillRect(15, 39, 17, 43, PATH);
    },
  },
  candi: {
    dunia: 1, nama: "Candi Wingit", sub: "Reruntuhan angker di utara hutan · Lv 5+", lagu: "gua", tepi: WALL, w: 40, h: 26, gelap: true,
    // monster di aula tengah; aula masuk (selatan) aman; ruang dalam (utara) = sarang Dwarapala
    zona: { candi: { x0: 3, y0: 12, x1: 36, y1: 16 } },
    gerbang: [
      { x0: 14, y0: 25, x1: 16, y1: 25, ke: "alam", masuk: { x: 16.5, y: 2.5 }, label: "Ke Hutan" },
      { x0: 14, y0: 0, x1: 16, y1: 0, ke: "kawah", masuk: { x: 17.5, y: 27.5 }, label: "Ke Kawah" },
    ],
    teleport: { id: "candi", x: 18.5, y: 22.5 },
    bos: { x: 20, y: 5.5, monster: "dwarapala" },   // ruang dalam diperluas: 38×10 petak
    objek: [
      { kind: "prasasti", id: "obor", x: 11.5, y: 20.5 },
      { kind: "obor", simbol: "senja", x: 2.5, y: 12.6 },
      { kind: "obor", simbol: "fajar", x: 37.5, y: 12.6 },
      { kind: "obor", simbol: "siang", x: 2.5, y: 15.6 },
      { kind: "obor", simbol: "malam", x: 37.5, y: 15.6 },
    ],
    build() {
      const st = S || {}, teka = st.teka || {}, bos = st.bos || {};
      fillRect(0, 0, MW - 1, MH - 1, WALL);
      fillRect(1, 1, MW - 2, MH - 2, CAVE);
      fillRect(14, 25, 16, 25, CAVE);              // pintu masuk dari hutan
      // aula masuk | aula tengah (4 obor) | ruang dalam
      fillRect(1, 17, MW - 2, 17, WALL); fillRect(13, 17, 17, 17, CAVE);
      fillRect(1, 11, MW - 2, 11, WALL);
      if (teka.obor) fillRect(13, 11, 17, 11, CAVE);  // terbuka setelah teka-teki obor
      if (bos.dwarapala) fillRect(14, 0, 16, 0, CAVE);   // lorong ke kawah setelah Dwarapala kalah
      // tiang-tiang batu
      for (const [x, y] of [[6, 13], [6, 15], [11, 13], [11, 15], [19, 13], [19, 15], [24, 13], [24, 15], [30, 13], [30, 15], [8, 21], [22, 21], [31, 21], [6, 3], [33, 3], [6, 8], [33, 8]]) setT(x, y, WALL);
    },
  },
  rawa: {
    dunia: 1, nama: "Rawa Kabut", sub: "Air hitam & suara-suara lirih · Lv 7+", lagu: "gua", tepi: TREE, w: 40, h: 34, kabut: true,
    zona: {
      rawaUtara: { x0: 3, y0: 10, x1: 36, y1: 16 },
      rawaSelatan: { x0: 33, y0: 19, x1: 37, y1: 31 },
      danau: { x0: 8, y0: 19, x1: 31, y1: 31 },
    },
    gerbang: [
      { x0: 18, y0: 0, x1: 20, y1: 0, ke: "alam", masuk: { x: 16.5, y: 41.5 }, label: "Ke Hutan" },
      { x0: 39, y0: 15, x1: 39, y1: 17, ke: "pesisir", masuk: { x: 1.5, y: 16.5 }, label: "Kampung →" },
    ],
    teleport: { id: "rawa", x: 16.5, y: 5.5 },
    bos: { x: 21, y: 25.5, monster: "buayaPutih" },   // pulau diperluas: 17×10 petak
    objek: [{ kind: "pitutur", id: "pitutur", x: 12.5, y: 18.2 }],
    build(r) {
      const teka = (S && S.teka) || {};
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (y < 2 || y >= MH - 2 || x < 2 || x >= MW - 1) setT(x, y, TREE);
        else { const v = r(); setT(x, y, v < 0.86 ? MUD : v < 0.9 ? FLOWER : G); }
      }
      // gumpalan ilalang & genangan air
      for (let y = 2; y < 18; y++) for (let x = 2; x < MW - 2; x++) { const v = r(); if (v < 0.07) setT(x, y, REED); else if (v < 0.1) setT(x, y, WATER); }
      // danau besar di selatan + pulau di tengahnya
      const d = ZONES.danau;
      for (let y = d.y0; y <= d.y1; y++) for (let x = d.x0; x <= d.x1; x++) {
        const edge = (x === d.x0 || x === d.x1 || y === d.y1) && r() < 0.5;
        setT(x, y, edge ? REED : WATER);
      }
      fillRect(12, 21, 29, 30, MUD); fillRect(13, 22, 28, 29, G);
      for (let y = 19; y <= 32; y++) for (let x = 32; x <= 37; x++) if (tileAt(x, y) === WATER) setT(x, y, MUD);
      // jembatan ke pulau (muncul setelah teka-teki Batu Pitutur)
      if (teka.pitutur) fillRect(21, 19, 22, 22, BRIDGE);
      // jalan setapak: dari hutan → gubuk → batu pitutur, dan ke timur menuju kampung
      for (let y = 0; y <= 18; y++) setT(19, y, PATH), setT(20, y, PATH);
      for (let x = 10; x <= 20; x++) setT(x, 18, PATH);
      for (let x = 20; x < MW; x++) for (let y = 15; y <= 17; y++) setT(x, y, PATH);
      // gubuk Mbah Tirto
      houses.push({ x: 22, y: 3 }); fillRect(22, 3, 24, 4, HOUSE);
      for (const [x, y] of [[21, 6], [16, 5], [12, 18], [21, 18]]) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (SOLID.has(tileAt(x + dx, y + dy)) && tileAt(x + dx, y + dy) !== HOUSE) setT(x + dx, y + dy, MUD);
    },
  },
  pesisir: {
    dunia: 1, nama: "Kampung Nelayan", sub: "Kampung di tepi laut · Lv 7+", lagu: "pesisir", tepi: TREE, w: 44, h: 30,
    zona: {
      kampungLuar: { x0: 3, y0: 19, x1: 16, y1: 24 },
      pantai: { x0: 22, y0: 21, x1: 36, y1: 24 },
    },
    gerbang: [
      { x0: 0, y0: 15, x1: 0, y1: 17, ke: "rawa", masuk: { x: 37.5, y: 16.5 }, label: "← Rawa" },
      // perahu Pak Jala ke Kepulauan Segara (dibuka cerita bab 2)
      { x0: 43, y0: 12, x1: 43, y1: 13, ke: "bandar", masuk: { x: 3.5, y: 14.5 }, label: "Berlayar →", labelEn: "Set sail →", kunci: "kapal" },
    ],
    teleport: { id: "pesisir", x: 24.5, y: 12.5 },
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (y < 2 || x < 1) setT(x, y, TREE);
        else if (x >= 38 || y >= 25) setT(x, y, WATER);          // laut
        else if (x >= 33 || y >= 21) setT(x, y, SAND);           // pantai
        else { const v = r(); setT(x, y, v < 0.05 ? FLOWER : v < 0.09 ? TREE : G); }
      }
      // pohon kelapa di pantai
      for (let y = 3; y < 25; y++) for (let x = 2; x < 38; x++) if (tileAt(x, y) === SAND && r() < 0.04) setT(x, y, TREE);
      // jalan kampung
      for (let x = 0; x <= 33; x++) for (let y = 15; y <= 17; y++) setT(x, y, PATH);
      for (let y = 6; y <= 21; y++) setT(19, y, PATH);
      for (let x = 19; x <= 35; x++) setT(x, 12, PATH);
      // dermaga (ujungnya tersambung ke perahu setelah Pak Jala siap berlayar)
      fillRect(36, 12, 42, 13, BRIDGE);
      if (S && S.buka && S.buka.kapal) fillRect(43, 12, 43, 13, BRIDGE);
      // rumah-rumah nelayan
      for (const [hx, hy] of [[7, 4], [13, 4], [22, 4], [7, 10], [27, 7]]) { houses.push({ x: hx, y: hy }); fillRect(hx, hy, hx + 2, hy + 1, HOUSE); }
      for (const [x, y] of [[30, 12], [17, 8], [33, 20], [24, 12], [1, 16]]) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (SOLID.has(tileAt(x + dx, y + dy)) && tileAt(x + dx, y + dy) !== HOUSE && tileAt(x + dx, y + dy) !== WATER) setT(x + dx, y + dy, tileAt(x + dx, y + dy) === TREE && x + dx >= 33 ? SAND : G);
    },
  },
  kawah: {
    dunia: 1, nama: "Kawah Geni", sub: "Puncak gunung berapi · Lv 11+", lagu: "kawah", tepi: WALL, w: 42, h: 30, panas: true,
    zona: { kawahTengah: { x0: 3, y0: 17, x1: 30, y1: 23 } },
    gerbang: [{ x0: 16, y0: 29, x1: 18, y1: 29, ke: "candi", masuk: { x: 15.5, y: 1.5 }, label: "Ke Candi" }],
    teleport: { id: "kawah", x: 13.5, y: 26.5 },
    bos: { x: 21, y: 6.5, monster: "rajaBanaspati" },   // arena diperluas: 36×10 petak
    objek: [{ kind: "altar", id: "altar", x: 17.5, y: 17.6 }],
    build(r) {
      const teka = (S && S.teka) || {};
      fillRect(0, 0, MW - 1, MH - 1, WALL);
      for (let y = 1; y < MH - 1; y++) for (let x = 1; x < MW - 1; x++) setT(x, y, r() < 0.04 ? LAVA : ASH);
      fillRect(16, 29, 18, 29, ASH);
      // sungai lava membelah kawah
      fillRect(1, 13, MW - 2, 15, LAVA);
      if (teka.altar) fillRect(16, 13, 18, 15, ASH);   // jembatan batu setelah altar
      // arena bos di utara: bersih, dikelilingi kolam lava
      fillRect(3, 2, MW - 4, 11, ASH);
      for (const [x, y] of [[2, 2], [3, 2], [2, 3], [MW - 3, 2], [MW - 4, 2], [MW - 3, 3], [2, 11], [MW - 3, 11]]) setT(x, y, LAVA);
      for (const [x, y] of [[8, 4], [33, 4], [8, 9], [33, 9], [5, 20], [28, 20], [36, 20], [10, 25], [24, 25], [33, 25]]) setT(x, y, WALL);
      // area aman sekitar pintu, teleport & altar
      fillRect(12, 25, 22, 28, ASH); fillRect(15, 16, 20, 19, ASH);
    },
  },
  gua: {
    dunia: 1, nama: "Gua Genderuwo", sub: "Sarang penunggu hutan", lagu: "gua", tepi: WALL, w: 30, h: 23, gelap: true,
    zona: {},
    gerbang: [{ x0: 0, y0: 7, x1: 0, y1: 9, ke: "alam", masuk: { x: 23.5, y: 22.5 }, label: "← Keluar" }],
    bos: { x: 18.5, y: 11.5, monster: "genderuwo" },   // titik bos & jenisnya (cermin gaib juga di sini)
    build() {
      fillRect(0, 0, MW - 1, MH - 1, WALL);
      fillRect(1, 1, MW - 2, MH - 2, CAVE);
      fillRect(0, 7, 0, 9, CAVE);
      for (const [x, y] of [[6, 4], [6, 17], [11, 7], [11, 15], [17, 3], [17, 19], [25, 5], [25, 17]]) setT(x, y, WALL);
    },
  },
};
// Bangun peta area `id` (selalu sama karena pakai seed).
function buildArea(id) {
  area = AREAS[id]; areaId = id;
  MW = area.w; MH = area.h; map = new Uint8Array(MW * MH); houses = []; ZONES = area.zona;
  area.build(seeded(ATURAN.petaSeed + id.length * 7919));
}
// (buildArea("desa") pertama dipanggil di 04d-dunia-bayang.js, setelah semua area terdaftar)

// Gerbang terbuka? (lihat gerbang.kunci)
function gerbangTerbuka(g) {
  if (!g.kunci) return true;
  if (!S) return false;
  if (g.kunci.startsWith("bos:")) return !!S.bos[g.kunci.slice(4)];
  if (g.kunci.startsWith("teka:")) return !!S.teka[g.kunci.slice(5)];
  return !!(S.buka && S.buka[g.kunci]);
}
// Buka kunci (dari cerita). Kalau sedang di area yang terpengaruh, petanya dibangun ulang.
function bukaKunci(k) {
  S.buka = S.buka || {};
  if (S.buka[k]) return;
  S.buka[k] = true;
  bangunUlangArea();
}
function bangunUlangArea() {
  if (!area || mode === "select") return;
  buildArea(areaId);
  buildMiniBase();
  resetPetaDunia();   // peta dunia digambar ulang (18-peta-besar.js)
}

// petak padat tambahan (mis. batu yang bisa didorong, 42-teka-dorong.js)
let padatTambahan = () => false;
function solidAt(px, py) { const tx = Math.floor(px / T), ty = Math.floor(py / T); return SOLID.has(tileAt(tx, ty)) || padatTambahan(tx, ty); }
function moveEnt(e, dx, dy, fly) {
  if (e.lambat > 0) { dx *= 0.5; dy *= 0.5; }   // monster terjerat/lambat (55-debuff-baru.js)
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
