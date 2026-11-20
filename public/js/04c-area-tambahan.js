// =====================================================================
// AREA TAMBAHAN DUNIA 1-3 (bab 6-8)
//   Dunia 1: Sawah Terasering, Makam Kuno (puzzle gong & dorong batu, Gerbang Bayang)
//   Dunia 2: Desa Apung (aman), Gua Laut (puzzle memori & tebakan)
//   Dunia 3: Lembah Angin, Istana Awan (puzzle lonceng & dorong batu)
// Pintu yang terbuka karena puzzle dibaca dari S.teka di build().
// =====================================================================
"use strict";

const tekaBeres = (id) => !!(S && S.teka && S.teka[id]);
const kunciBuka = (k) => !!(S && S.buka && S.buka[k]);

Object.assign(AREAS, {
  // ---------------- Dunia 1 ----------------
  sawah: {
    dunia: 1, nama: "Sawah Terasering", sub: "Petak sawah di selatan desa · Lv 28+", namaEn: "Terraced Paddies", subEn: "Rice terraces south of the village · Lv 28+",
    lagu: "luar", tepi: TREE, w: 40, h: 32,
    zona: { sawahUtara: { x0: 4, y0: 3, x1: 35, y1: 11 }, sawahSelatan: { x0: 4, y0: 19, x1: 35, y1: 28 } },
    gerbang: [
      { x0: 11, y0: 0, x1: 13, y1: 0, ke: "desa", masuk: { x: 12.5, y: 21.5 }, label: "Ke Desa", labelEn: "To Village" },
      { x0: 39, y0: 14, x1: 39, y1: 16, ke: "makam", masuk: { x: 2.5, y: 15.5 }, label: "Makam →", labelEn: "Tomb →", kunci: "makam" },
    ],
    teleport: { id: "sawah", x: 7.5, y: 17.5 },
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (x < 2 || y < 2 || x >= MW - 2 || y >= MH - 2) setT(x, y, TREE);
        else if (y % 4 === 0) setT(x, y, r() < 0.08 ? FLOWER : G);        // pematang
        else setT(x, y, r() < 0.06 ? REED : MUD);                          // petak sawah berair
      }
      fillRect(11, 0, 13, 2, PATH); fillRect(12, 2, 12, 15, PATH);
      fillRect(0, 14, MW - 1, 16, PATH);
      fillRect(MW - 2, 14, MW - 1, 16, kunciBuka("makam") ? PATH : ROCK);
      for (const [hx, hy] of [[15, 9], [31, 9]]) { houses.push({ x: hx, y: hy }); fillRect(hx, hy, hx + 2, hy + 1, HOUSE); }
      bersihkan([[7, 17], [14, 15], [34, 13], [12, 1]], G);
    },
  },
  makam: {
    dunia: 1, nama: "Makam Kuno", sub: "Pemakaman raja-raja lama · Lv 29+", namaEn: "Ancient Tomb", subEn: "Resting place of old kings · Lv 29+",
    lagu: "gua", tepi: WALL, w: 36, h: 30, gelap: true,
    zona: { makamAula: { x0: 3, y0: 17, x1: 10, y1: 27 }, makamTengah: { x0: 14, y0: 2, x1: 24, y1: 9 } },
    gerbang: [
      { x0: 0, y0: 14, x1: 0, y1: 16, ke: "sawah", masuk: { x: 37.5, y: 15.5 }, label: "← Sawah", labelEn: "← Paddies" },
      // Gerbang Bayang ke dunia 4 (terbuka akhir bab 8)
      { x0: 29, y0: 0, x1: 31, y1: 0, ke: "perkemahan", masuk: { x: 16.5, y: 22.5 }, label: "Gerbang Bayang", labelEn: "Shadow Gate", kunci: "bayang" },
    ],
    teleport: { id: "makam", x: 4.5, y: 24.5 },
    bos: { x: 30, y: 15.5, monster: "rajaJerangkong" },
    objek: [
      { kind: "petunjuk", id: "gong", x: 6.5, y: 9.5 },
      { kind: "saklar", id: "gong", simbol: "merah", x: 3.5, y: 5.5 },
      { kind: "saklar", id: "gong", simbol: "hijau", x: 5.5, y: 5.5 },
      { kind: "saklar", id: "gong", simbol: "biru", x: 7.5, y: 5.5 },
      { kind: "saklar", id: "gong", simbol: "emas", x: 9.5, y: 5.5 },
      { kind: "batuDorong", id: "batuMakam", x: 16, y: 17 }, { kind: "batuDorong", id: "batuMakam", x: 19, y: 19 }, { kind: "batuDorong", id: "batuMakam", x: 22, y: 17 },
      { kind: "lempeng", id: "batuMakam", x: 14, y: 23 }, { kind: "lempeng", id: "batuMakam", x: 19, y: 25 }, { kind: "lempeng", id: "batuMakam", x: 23, y: 22 },
      { kind: "tuas", id: "batuMakam", x: 14.5, y: 27.5 },
    ],
    build() {
      fillRect(0, 0, MW - 1, MH - 1, WALL);
      fillRect(1, 1, MW - 2, MH - 2, CAVE);
      fillRect(0, 14, 0, 16, CAVE);
      // pintu aula → ruang tengah (gong), ruang tengah → ruang raja (batu)
      fillRect(12, 1, 12, MH - 2, WALL); if (tekaBeres("gong")) fillRect(12, 14, 12, 16, CAVE);
      fillRect(25, 1, 25, MH - 2, WALL); if (tekaBeres("batuMakam")) fillRect(25, 13, 25, 17, CAVE);
      if (kunciBuka("bayang")) fillRect(29, 0, 31, 0, CAVE);
      for (const [x, y] of [[3, 12], [10, 12], [28, 6], [33, 6], [28, 24], [33, 24]]) setT(x, y, WALL);
    },
  },

  // ---------------- Dunia 2 ----------------
  desaApung: {
    dunia: 2, nama: "Desa Apung", sub: "Rumah panggung di atas laut — zona aman · Lv 31+", namaEn: "Floating Village", subEn: "Stilt houses over the sea — safe zone · Lv 31+",
    lagu: "pesisir", tepi: WATER, w: 36, h: 28, aman: true,
    zona: { desa: { x0: 2, y0: 2, x1: 33, y1: 25 } },
    gerbang: [
      { x0: 17, y0: 0, x1: 19, y1: 0, ke: "bandar", masuk: { x: 19.5, y: 23.5 }, label: "Ke Bandar", labelEn: "To Harbor" },
      { x0: 35, y0: 13, x1: 35, y1: 15, ke: "goaLaut", masuk: { x: 2.5, y: 14.5 }, label: "Gua Laut →", labelEn: "Sea Cave →", kunci: "goaLaut" },
    ],
    teleport: { id: "desaApung", x: 18.5, y: 17.5 },
    build() {
      fillRect(0, 0, MW - 1, MH - 1, WATER);
      // jalan papan berbentuk kisi
      fillRect(17, 0, 19, 24, BRIDGE); fillRect(3, 13, 32, 15, BRIDGE); fillRect(6, 5, 30, 6, BRIDGE); fillRect(6, 21, 30, 22, BRIDGE);
      fillRect(6, 5, 7, 22, BRIDGE); fillRect(29, 5, 30, 22, BRIDGE);
      fillRect(33, 13, 35, 15, kunciBuka("goaLaut") ? BRIDGE : WATER);
      // panggung rumah
      for (const [hx, hy] of [[9, 2], [21, 2], [9, 9], [21, 9], [9, 17], [23, 17]]) { fillRect(hx - 1, hy, hx + 3, hy + 3, SAND); houses.push({ x: hx, y: hy }); fillRect(hx, hy, hx + 2, hy + 1, HOUSE); }
      fillRect(16, 16, 20, 19, SAND);
    },
  },
  goaLaut: {
    dunia: 2, nama: "Gua Laut", sub: "Gua karang yang tergenang · Lv 32+", namaEn: "Sea Cave", subEn: "A flooded coral cave · Lv 32+",
    lagu: "gua", tepi: WALL, w: 38, h: 30, gelap: true,
    zona: { goaLautA: { x0: 2, y0: 16, x1: 13, y1: 27 }, goaLautB: { x0: 17, y0: 18, x1: 25, y1: 27 } },
    gerbang: [{ x0: 0, y0: 13, x1: 0, y1: 15, ke: "desaApung", masuk: { x: 32.5, y: 14.5 }, label: "← Desa Apung", labelEn: "← Floating Village" }],
    teleport: { id: "goaLaut", x: 4.5, y: 24.5 },
    bos: { x: 31.5, y: 14.5, monster: "guritaRaksasa" },
    objek: [
      { kind: "batuMemori", id: "pasang", x: 8.5, y: 6.5 },
      { kind: "lempengMemori", id: "pasang", i: 0, x: 5, y: 10 }, { kind: "lempengMemori", id: "pasang", i: 1, x: 7, y: 10 },
      { kind: "lempengMemori", id: "pasang", i: 2, x: 9, y: 10 }, { kind: "lempengMemori", id: "pasang", i: 3, x: 11, y: 10 },
      { kind: "batuTanya", id: "tebakLaut", x: 20.5, y: 8.5 },
    ],
    build(r) {
      fillRect(0, 0, MW - 1, MH - 1, WALL);
      fillRect(1, 1, MW - 2, MH - 2, CAVE);
      fillRect(0, 13, 0, 15, CAVE);
      fillRect(15, 1, 15, MH - 2, WALL); if (tekaBeres("pasang")) fillRect(15, 12, 15, 16, CAVE);
      fillRect(26, 1, 26, MH - 2, WALL); if (tekaBeres("tebakLaut")) fillRect(26, 12, 26, 16, CAVE);
      // kolam air & karang
      for (const [x, y] of [[29, 4], [30, 4], [34, 5], [34, 24], [33, 24], [29, 25], [3, 3], [12, 26]]) setT(x, y, WATER);
      for (let i = 0; i < 8; i++) { const x = 17 + Math.floor(r() * 8), y = 19 + Math.floor(r() * 8); setT(x, y, CORAL); }
      bersihkan([[4, 24], [20, 8], [8, 6]], CAVE);
    },
  },

  // ---------------- Dunia 3 ----------------
  lembahAngin: {
    dunia: 3, nama: "Lembah Angin", sub: "Padang berangin kencang · Lv 34+", namaEn: "Wind Valley", subEn: "A gusty upland meadow · Lv 34+",
    lagu: "luar", tepi: CLOUD, w: 44, h: 34,
    zona: { anginBarat: { x0: 4, y0: 4, x1: 17, y1: 28 }, anginTimur: { x0: 26, y0: 19, x1: 39, y1: 29 } },
    gerbang: [
      { x0: 43, y0: 13, x1: 43, y1: 15, ke: "awan", masuk: { x: 2.5, y: 14.5 }, label: "Kampung →", labelEn: "Village →" },
      { x0: 20, y0: 0, x1: 22, y1: 0, ke: "istanaAwan", masuk: { x: 21.5, y: 31.5 }, label: "Istana Awan", labelEn: "Cloud Palace", kunci: "istana" },
    ],
    teleport: { id: "lembahAngin", x: 36.5, y: 16.5 },
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (x < 2 || y < 2 || x >= MW - 1 || y >= MH - 2) setT(x, y, CLOUD);
        else { const v = r(); setT(x, y, v < 0.07 ? FLOWER : v < 0.11 ? ROCK : v < 0.13 ? TREE : G); }
      }
      fillRect(20, 0, 22, 2, kunciBuka("istana") ? BRIDGE : CLOUD);
      fillRect(21, 2, 21, 14, PATH); fillRect(2, 14, MW - 1, 14, PATH); fillRect(40, 13, 43, 15, PATH);
      houses.push({ x: 28, y: 7 }); fillRect(28, 7, 30, 8, HOUSE);
      bersihkan([[36, 16], [30, 10], [21, 5], [21, 3]], G);
    },
  },
  istanaAwan: {
    dunia: 3, nama: "Istana Awan", sub: "Istana runtuh yang melayang · Lv 35+", namaEn: "Cloud Palace", subEn: "A ruined floating palace · Lv 35+",
    lagu: "gua", tepi: CLOUD, w: 42, h: 34,
    zona: { istanaTengah: { x0: 30, y0: 11, x1: 38, y1: 13 } },
    gerbang: [{ x0: 20, y0: 33, x1: 22, y1: 33, ke: "lembahAngin", masuk: { x: 21.5, y: 2.5 }, label: "Ke Lembah", labelEn: "To Valley" }],
    teleport: { id: "istanaAwan", x: 7.5, y: 28.5 },
    bos: { x: 21, y: 5.5, monster: "rajawaliPetir" },
    objek: [
      { kind: "petunjuk", id: "lonceng", x: 25.5, y: 28.5 },
      { kind: "saklar", id: "lonceng", simbol: "merah", x: 6.5, y: 23.5 },
      { kind: "saklar", id: "lonceng", simbol: "biru", x: 11.5, y: 23.5 },
      { kind: "saklar", id: "lonceng", simbol: "emas", x: 16.5, y: 23.5 },
      { kind: "saklar", id: "lonceng", simbol: "hijau", x: 29.5, y: 23.5 },
      { kind: "saklar", id: "lonceng", simbol: "ungu", x: 35.5, y: 23.5 },
      { kind: "batuDorong", id: "batuAwan", x: 10, y: 14 }, { kind: "batuDorong", id: "batuAwan", x: 15, y: 16 }, { kind: "batuDorong", id: "batuAwan", x: 30, y: 14 },
      { kind: "lempeng", id: "batuAwan", x: 10, y: 18 }, { kind: "lempeng", id: "batuAwan", x: 13, y: 12 }, { kind: "lempeng", id: "batuAwan", x: 33, y: 17 },
      { kind: "tuas", id: "batuAwan", x: 4.5, y: 18.5 },
    ],
    build() {
      fillRect(0, 0, MW - 1, MH - 1, CLOUD);
      fillRect(2, 2, MW - 3, MH - 3, STONE);
      fillRect(20, MH - 3, 22, MH - 1, BRIDGE);
      fillRect(2, 20, MW - 3, 20, WALL); if (tekaBeres("lonceng")) fillRect(19, 20, 23, 20, STONE);
      fillRect(2, 10, MW - 3, 10, WALL); if (tekaBeres("batuAwan")) fillRect(19, 10, 23, 10, STONE);
      for (const [x, y] of [[5, 4], [37, 4], [5, 8], [37, 8], [3, 30], [38, 30]]) setT(x, y, WALL);
    },
  },
});

// Gerbang baru di area lama: Desa → Sawah, Bandar → Desa Apung, Kampung Awan → Lembah Angin
AREAS.desa.gerbang.push({ x0: 11, y0: 23, x1: 13, y1: 23, ke: "sawah", masuk: { x: 12.5, y: 2.5 }, label: "Ke Sawah", labelEn: "To Paddies" });
AREAS.bandar.gerbang.push({ x0: 18, y0: 29, x1: 20, y1: 29, ke: "desaApung", masuk: { x: 18.5, y: 2.5 }, label: "Desa Apung", labelEn: "Floating Village" });
AREAS.awan.gerbang.push({ x0: 0, y0: 13, x1: 0, y1: 15, ke: "lembahAngin", masuk: { x: 41.5, y: 14.5 }, label: "← Lembah Angin", labelEn: "← Wind Valley" });
// jalan menuju gerbang baru (ditambahkan setelah build lama)
for (const [id, buat] of [
  ["desa", () => { fillRect(11, 21, 13, 23, PATH); fillRect(12, 12, 12, 23, PATH); }],
  ["bandar", () => { fillRect(18, 24, 20, 29, BRIDGE); }],
  ["awan", () => { fillRect(0, 13, 5, 15, PATH); }],
]) { const lama = AREAS[id].build; AREAS[id].build = function (r) { lama.call(this, r); buat(); }; }
