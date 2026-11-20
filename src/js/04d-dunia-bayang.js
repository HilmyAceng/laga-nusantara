// =====================================================================
// DUNIA 4 · NEGERI BAYANG (bab 9-10)
// Dimasuki lewat Gerbang Bayang di Makam Kuno (kunci "bayang").
// Area: Perkemahan Cahaya (aman), Padang Bayang, Kota Mati (puzzle memori &
// tebakan), Menara Kala (puzzle lentera & dorong batu), Singgasana Bayang.
// `bayang: true` = rumput kelabu & cahaya ungu redup (16-gambar.js).
// =====================================================================
"use strict";

DUNIA.push({ id: 4, nama: "Negeri Bayang", namaEn: "Shadow Realm" });

Object.assign(AREAS, {
  perkemahan: {
    dunia: 4, nama: "Perkemahan Cahaya", sub: "Api unggun yang tak pernah padam — zona aman · Lv 36+", namaEn: "Camp of Light", subEn: "A fire that never dies — safe zone · Lv 36+",
    lagu: "desa", tepi: ROCK, w: 34, h: 26, aman: true, bayang: true, alasBatu: "#2e2a38",
    zona: { kemah: { x0: 3, y0: 3, x1: 30, y1: 22 } },
    gerbang: [
      { x0: 15, y0: 25, x1: 17, y1: 25, ke: "makam", masuk: { x: 30.5, y: 2.5 }, label: "Gerbang Bayang", labelEn: "Shadow Gate" },
      { x0: 15, y0: 0, x1: 17, y1: 0, ke: "padangBayang", masuk: { x: 24.5, y: 36.5 }, label: "Ke Padang", labelEn: "To the Plain" },
    ],
    teleport: { id: "perkemahan", x: 24.5, y: 8.5 },
    objek: [{ kind: "unggun", x: 16.5, y: 13, diam: true }],
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (x < 2 || y < 2 || x >= MW - 2 || y >= MH - 2) setT(x, y, ROCK);
        else setT(x, y, r() < 0.06 ? ROCK : r() < 0.4 ? ASH : G);
      }
      fillRect(15, 0, 17, 25, PATH); fillRect(4, 13, 29, 13, PATH);
      for (const [hx, hy] of [[5, 4], [24, 3], [5, 17], [24, 18]]) { houses.push({ x: hx, y: hy }); fillRect(hx, hy, hx + 2, hy + 1, HOUSE); }
      fillRect(13, 10, 20, 16, G);
      bersihkan([[24, 8], [14, 10], [21, 15], [10, 15], [16, 23]], G);
    },
  },
  padangBayang: {
    dunia: 4, nama: "Padang Bayang", sub: "Padang abu-abu tanpa matahari · Lv 37+", namaEn: "Shadow Plain", subEn: "A grey plain without a sun · Lv 37+",
    lagu: "luar", tepi: ROCK, w: 50, h: 40, bayang: true, alasBatu: "#2e2a38",
    zona: { padangSelatan: { x0: 4, y0: 24, x1: 45, y1: 34 }, padangUtara: { x0: 4, y0: 4, x1: 45, y1: 15 } },
    gerbang: [
      { x0: 23, y0: 39, x1: 25, y1: 39, ke: "perkemahan", masuk: { x: 16.5, y: 2.5 }, label: "Ke Perkemahan", labelEn: "To Camp" },
      { x0: 49, y0: 18, x1: 49, y1: 20, ke: "kotaMati", masuk: { x: 2.5, y: 19.5 }, label: "Kota Mati →", labelEn: "Dead City →" },
    ],
    teleport: { id: "padangBayang", x: 27.5, y: 33.5 },
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (x < 2 || y < 2 || x >= MW - 1 || y >= MH - 1) setT(x, y, ROCK);
        else { const v = r(); setT(x, y, v < 0.08 ? ROCK : v < 0.13 ? TREE : v < 0.45 ? ASH : G); }
      }
      jalanKelok(r, 24, 37, 10, 20, 2, PATH);
      jalanKelok(r, 10, 20, 47, 18, 2, PATH);
      fillRect(23, 36, 25, 39, PATH); fillRect(46, 18, 49, 20, PATH);
      bersihkan([[27, 33], [24, 37]], ASH);
    },
  },
  kotaMati: {
    dunia: 4, nama: "Kota Mati", sub: "Reruntuhan ibu kota Kalamurka · Lv 39+", namaEn: "Dead City", subEn: "Ruins of Kalamurka's capital · Lv 39+",
    lagu: "gua", tepi: WALL, w: 48, h: 40, bayang: true, alasBatu: "#2e2a38",
    zona: { kotaBarat: { x0: 3, y0: 24, x1: 19, y1: 36 }, kotaTimur: { x0: 31, y0: 14, x1: 44, y1: 36 } },
    gerbang: [
      { x0: 0, y0: 18, x1: 0, y1: 20, ke: "padangBayang", masuk: { x: 47.5, y: 19.5 }, label: "← Padang", labelEn: "← Plain" },
      { x0: 22, y0: 0, x1: 24, y1: 0, ke: "menaraKala", masuk: { x: 23.5, y: 37.5 }, label: "Menara Kala", labelEn: "Kala Tower", kunci: "teka:tebakBayang" },
    ],
    teleport: { id: "kotaMati", x: 6.5, y: 31.5 },
    objek: [
      { kind: "batuMemori", id: "memoriKota", x: 10.5, y: 15.5 },
      { kind: "lempengMemori", id: "memoriKota", i: 0, x: 5, y: 19 }, { kind: "lempengMemori", id: "memoriKota", i: 1, x: 7, y: 19 },
      { kind: "lempengMemori", id: "memoriKota", i: 2, x: 9, y: 19 }, { kind: "lempengMemori", id: "memoriKota", i: 3, x: 11, y: 19 },
      { kind: "lempengMemori", id: "memoriKota", i: 4, x: 13, y: 19 }, { kind: "lempengMemori", id: "memoriKota", i: 5, x: 15, y: 19 },
      { kind: "batuTanya", id: "tebakBayang", x: 23.5, y: 7.5 },
    ],
    build(r) {
      fillRect(0, 0, MW - 1, MH - 1, WALL);
      for (let y = 1; y < MH - 1; y++) for (let x = 1; x < MW - 1; x++) setT(x, y, r() < 0.07 ? ROCK : STONE);
      // reruntuhan rumah
      for (let i = 0; i < 16; i++) {
        const x = 3 + Math.floor(r() * 40), y = 22 + Math.floor(r() * 14), w = 2 + Math.floor(r() * 3), h = 2 + Math.floor(r() * 2);
        if (Math.abs(x - 23) > 4 && y > 21) fillRect(x, y, x + w, y + h, WALL);
      }
      // balai kota: dibuka puzzle memori; jalan ke menara dibuka puzzle tebakan
      fillRect(16, 3, 30, 3, WALL); fillRect(16, 3, 16, 12, WALL); fillRect(30, 3, 30, 12, WALL); fillRect(16, 12, 30, 12, WALL);
      fillRect(17, 4, 29, 11, STONE);
      if (tekaBeres("memoriKota")) fillRect(22, 12, 24, 12, STONE);
      if (tekaBeres("tebakBayang")) fillRect(22, 0, 24, 3, STONE); else fillRect(22, 0, 24, 2, WALL);
      // jalan utama
      fillRect(1, 18, MW - 2, 20, STONE); fillRect(22, 12, 24, 38, STONE);
      fillRect(0, 18, 0, 20, STONE);
      bersihkan([[6, 31], [10, 15], [23, 7]], STONE);
    },
  },
  menaraKala: {
    dunia: 4, nama: "Menara Kala", sub: "Menara tiga lantai Kalamurka · Lv 41+", namaEn: "Kala Tower", subEn: "Kalamurka's three-storey tower · Lv 41+",
    lagu: "gua", tepi: WALL, w: 40, h: 40, gelap: true, bayang: true,
    zona: { menaraBawah: { x0: 3, y0: 30, x1: 14, y1: 36 } },
    gerbang: [
      { x0: 22, y0: 39, x1: 24, y1: 39, ke: "kotaMati", masuk: { x: 23.5, y: 2.5 }, label: "Ke Kota", labelEn: "To City" },
      { x0: 22, y0: 0, x1: 24, y1: 0, ke: "singgasana", masuk: { x: 24.5, y: 36.5 }, label: "Singgasana", labelEn: "Throne", kunci: "bos:penjagaMenara" },
    ],
    teleport: { id: "menaraKala", x: 6.5, y: 35.5 },
    bos: { x: 23, y: 6.5, monster: "penjagaMenara" },
    objek: [
      { kind: "petunjuk", id: "lenteraKala", x: 27.5, y: 34.5 },
      { kind: "saklar", id: "lenteraKala", simbol: "biru", x: 6.5, y: 29.5 },
      { kind: "saklar", id: "lenteraKala", simbol: "emas", x: 12.5, y: 29.5 },
      { kind: "saklar", id: "lenteraKala", simbol: "hijau", x: 17.5, y: 29.5 },
      { kind: "saklar", id: "lenteraKala", simbol: "merah", x: 30.5, y: 29.5 },
      { kind: "saklar", id: "lenteraKala", simbol: "ungu", x: 36.5, y: 29.5 },
      { kind: "batuDorong", id: "batuKala", x: 8, y: 17 }, { kind: "batuDorong", id: "batuKala", x: 14, y: 20 },
      { kind: "batuDorong", id: "batuKala", x: 30, y: 17 }, { kind: "batuDorong", id: "batuKala", x: 34, y: 21 },
      { kind: "lempeng", id: "batuKala", x: 8, y: 22 }, { kind: "lempeng", id: "batuKala", x: 12, y: 16 },
      { kind: "lempeng", id: "batuKala", x: 33, y: 23 }, { kind: "lempeng", id: "batuKala", x: 36, y: 15 },
      { kind: "tuas", id: "batuKala", x: 3.5, y: 24.5 },
    ],
    build() {
      fillRect(0, 0, MW - 1, MH - 1, WALL);
      fillRect(1, 1, MW - 2, MH - 2, STONE);
      fillRect(22, 39, 24, 39, STONE);
      fillRect(1, 26, MW - 2, 26, WALL); if (tekaBeres("lenteraKala")) fillRect(21, 26, 25, 26, STONE);
      fillRect(1, 13, MW - 2, 13, WALL); if (tekaBeres("batuKala")) fillRect(21, 13, 25, 13, STONE);
      if (S && S.bos && S.bos.penjagaMenara) fillRect(22, 0, 24, 0, STONE);
      for (const [x, y] of [[5, 4], [35, 4], [5, 10], [35, 10], [3, 37], [36, 37]]) setT(x, y, WALL);
    },
  },
  singgasana: {
    dunia: 4, nama: "Singgasana Bayang", sub: "Takhta Prabu Kalamurka · Lv 44+", namaEn: "Shadow Throne", subEn: "Throne of King Kalamurka · Lv 44+",
    lagu: "kawah", tepi: WALL, w: 48, h: 40, bayang: true, gelap: true,
    zona: {},
    gerbang: [{ x0: 23, y0: 39, x1: 25, y1: 39, ke: "menaraKala", masuk: { x: 23.5, y: 2.5 }, label: "Ke Menara", labelEn: "To Tower" }],
    teleport: { id: "singgasana", x: 31.5, y: 35.5 },
    bos: { x: 24, y: 10.5, monster: "kalamurka" },
    build() {
      fillRect(0, 0, MW - 1, MH - 1, WALL);
      fillRect(1, 1, MW - 2, MH - 2, STONE);
      fillRect(23, 39, 25, 39, STONE);
      // tiang-tiang & kolam lava ungu di tepi arena
      for (const [x, y] of [[8, 8], [40, 8], [8, 20], [40, 20], [8, 31], [40, 31], [16, 4], [32, 4]]) setT(x, y, WALL);
      for (const [x, y] of [[3, 3], [4, 3], [44, 3], [43, 3], [3, 36], [44, 36]]) setT(x, y, LAVA);
      fillRect(21, 2, 27, 4, ASH);   // undakan takhta
    },
  },
});

buildArea("desa");
