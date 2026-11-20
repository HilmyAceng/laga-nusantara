// =====================================================================
// DUNIA 3 · NEGERI AWAN
// Area: Kampung Awan (aman), Hutan Batu, Puncak Naga (peta besar, sarang naga).
// Dicapai lewat Tangga Pelangi dari Kuil Samudra (gerbang berkunci "pelangi").
// =====================================================================
"use strict";

Object.assign(AREAS, {
  awan: {
    dunia: 3, nama: "Kampung Awan", sub: "Desa di atas awan — zona aman · Lv 19+", namaEn: "Cloud Village", subEn: "A village above the clouds — safe zone · Lv 19+",
    lagu: "desa", tepi: CLOUD, w: 36, h: 28, aman: true,
    zona: { kampung: { x0: 3, y0: 3, x1: 32, y1: 24 } },
    gerbang: [
      { x0: 16, y0: 27, x1: 18, y1: 27, ke: "kuil", masuk: { x: 17.5, y: 3.5 }, label: "Tangga Pelangi", labelEn: "Rainbow Stair" },
      { x0: 16, y0: 0, x1: 18, y1: 0, ke: "hutanBatu", masuk: { x: 22.5, y: 41.5 }, label: "Ke Hutan Batu", labelEn: "To Stone Forest" },
    ],
    teleport: { id: "awan", x: 21.5, y: 13.5 },
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (x < 2 || y < 2 || x >= MW - 2 || y >= MH - 2) setT(x, y, CLOUD);
        else { const v = r(); setT(x, y, v < 0.06 ? FLOWER : v < 0.09 ? TREE : G); }
      }
      // awan bergumpal di tepi
      for (let y = 2; y < MH - 2; y++) for (let x = 2; x < MW - 2; x++) if ((x < 4 || x >= MW - 4 || y < 4 || y >= MH - 4) && r() < 0.35) setT(x, y, CLOUD);
      fillRect(16, 0, 18, 4, PATH); fillRect(16, MH - 4, 18, MH - 1, BRIDGE);
      fillRect(17, 4, 17, MH - 4, PATH); fillRect(5, 13, 30, 13, PATH);
      for (const [hx, hy] of [[6, 6], [11, 5], [23, 5], [27, 10], [6, 16], [24, 18]]) { houses.push({ x: hx, y: hy }); fillRect(hx, hy, hx + 2, hy + 1, HOUSE); }
      bersihkan([[17, 9], [24, 16], [9, 12], [27, 21], [21, 13], [17, 24], [17, 3]], G);
    },
  },
  hutanBatu: {
    dunia: 3, nama: "Hutan Batu", sub: "Pilar-pilar batu menjulang · Lv 20+", namaEn: "Stone Forest", subEn: "Towering stone pillars · Lv 20+",
    lagu: "luar", tepi: ROCK, w: 44, h: 44, alasBatu: "#7d7a86",
    zona: {
      batuSelatan: { x0: 4, y0: 28, x1: 39, y1: 39 },
      batuUtara: { x0: 4, y0: 15, x1: 39, y1: 25 },
      batuTimur: { x0: 33, y0: 4, x1: 40, y1: 12 },
    },
    gerbang: [
      { x0: 21, y0: 43, x1: 23, y1: 43, ke: "awan", masuk: { x: 17.5, y: 2.5 }, label: "Ke Kampung", labelEn: "To Village" },
      // celah ke Puncak Naga: terbuka setelah Kelabang Raksasa kalah
      { x0: 21, y0: 0, x1: 23, y1: 0, ke: "puncakNaga", masuk: { x: 30.5, y: 56.5 }, label: "Puncak Naga", labelEn: "Dragon Peak", kunci: "bos:kelabang" },
    ],
    teleport: { id: "hutanBatu", x: 26.5, y: 39.5 },
    bos: { x: 22, y: 7.5, monster: "kelabang" },
    build(r) {
      const lewat = S && S.bos && S.bos.kelabang;
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (x < 2 || y < 2 || x >= MW - 2 || y >= MH - 1) setT(x, y, ROCK);
        else { const v = r(); setT(x, y, v < 0.15 ? ROCK : v < 0.19 ? TREE : v < 0.5 ? STONE : G); }
      }
      // sarang kelabang: lapangan batu di utara
      fillRect(12, 2, 32, 12, STONE);
      for (let x = 12; x <= 32; x++) if (x < 20 || x > 24) setT(x, 13, ROCK);
      for (const [x, y] of [[14, 4], [30, 4], [14, 10], [30, 10]]) setT(x, y, ROCK);
      fillRect(21, 0, 23, 1, lewat ? STONE : ROCK);
      // jalan setapak berkelok
      jalanKelok(r, 22, 41, 8, 30, 2, PATH);
      jalanKelok(r, 8, 30, 35, 20, 2, PATH);
      jalanKelok(r, 35, 20, 21, 13, 2, PATH);
      fillRect(21, 41, 23, 43, PATH);
      jalanKelok(r, 35, 20, 36, 8, 2, STONE);
      bersihkan([[26, 39], [22, 41]], STONE);
    },
  },
  puncakNaga: {
    dunia: 3, nama: "Puncak Naga", sub: "Dataran bara, sarang Naga Kencana · Lv 24+", namaEn: "Dragon Peak", subEn: "Ember plateau, lair of the Golden Dragon · Lv 24+",
    lagu: "kawah", tepi: WALL, w: 60, h: 60, panas: true, alasBatu: "#413838",
    zona: {
      nagaGerbang: { x0: 8, y0: 44, x1: 52, y1: 55 },
      nagaLereng: { x0: 6, y0: 26, x1: 54, y1: 38 },
      nagaTebing: { x0: 4, y0: 4, x1: 11, y1: 22 },
    },
    gerbang: [{ x0: 29, y0: 59, x1: 31, y1: 59, ke: "hutanBatu", masuk: { x: 22.5, y: 1.5 }, label: "Ke Hutan Batu", labelEn: "To Stone Forest" }],
    teleport: { id: "puncakNaga", x: 35.5, y: 54.5 },
    bos: { x: 30, y: 10.5, monster: "naga" },
    build(r) {
      fillRect(0, 0, MW - 1, MH - 1, WALL);
      for (let y = 1; y < MH - 1; y++) for (let x = 1; x < MW - 1; x++) { const v = r(); setT(x, y, v < 0.04 ? LAVA : v < 0.1 ? ROCK : v < 0.55 ? ASH : STONE); }
      fillRect(29, 56, 31, 59, STONE);
      // dua sungai lava melintang, masing-masing dengan jembatan batu
      for (let x = 1; x < MW - 1; x++) { const y = 41 + Math.round(Math.sin(x * 0.2) * 1.5); fillRect(x, y, x, y + 1, LAVA); }
      fillRect(28, 38, 32, 45, STONE);
      for (let x = 1; x < MW - 1; x++) { const y = 22 + Math.round(Math.sin(x * 0.17 + 1) * 1.5); fillRect(x, y, x, y + 1, LAVA); }
      fillRect(13, 19, 17, 26, STONE); fillRect(43, 19, 47, 26, STONE);
      // arena naga di utara: lapang, dikelilingi kolam lava
      fillRect(13, 2, 47, 18, ASH);
      for (const [x, y] of [[13, 2], [14, 2], [13, 3], [47, 2], [46, 2], [47, 3], [13, 18], [47, 18], [20, 5], [40, 5], [20, 15], [40, 15]]) setT(x, y, LAVA);
      for (const [x, y] of [[24, 8], [36, 8], [24, 13], [36, 13]]) setT(x, y, ROCK);
      // jalan menanjak dari selatan
      jalanKelok(r, 30, 56, 12, 48, 2, STONE);
      jalanKelok(r, 12, 48, 29, 40, 2, STONE);
      jalanKelok(r, 31, 37, 48, 30, 2, STONE);
      jalanKelok(r, 48, 30, 45, 21, 2, STONE);
      jalanKelok(r, 45, 19, 30, 17, 2, STONE);
      bersihkan([[35, 54], [30, 56], [30, 18]], STONE);
    },
  },
});

