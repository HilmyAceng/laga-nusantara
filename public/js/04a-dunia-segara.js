// =====================================================================
// DUNIA 2 · KEPULAUAN SEGARA
// Area: Bandar Segara (kota aman), Hutan Bakau, Hutan Larangan, Kuil Samudra.
// Dicapai dengan perahu dari dermaga Kampung Nelayan (gerbang berkunci "kapal").
// Format area sama seperti di 04-peta.js.
// =====================================================================
"use strict";

// bersihkan petak keras di sekitar titik-titik (NPC, teleport) supaya bisa didekati
function bersihkan(titik, ganti) {
  for (const [x, y] of titik) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
    const v = tileAt(x + dx, y + dy);
    if (SOLID.has(v) && v !== HOUSE) setT(x + dx, y + dy, ganti);
  }
}
// jalan berkelok dari (x0,y0) ke (x1,y1) selebar `lebar` petak
function jalanKelok(r, x0, y0, x1, y1, lebar, v) {
  let x = x0, y = y0;
  for (let i = 0; i < 400 && (x !== x1 || y !== y1); i++) {
    fillRect(x, y, x + lebar - 1, y + lebar - 1, v);
    const kx = Math.sign(x1 - x), ky = Math.sign(y1 - y);
    if (kx && (!ky || r() < 0.45)) x += kx; else y += ky;
  }
  fillRect(x1, y1, x1 + lebar - 1, y1 + lebar - 1, v);
}

Object.assign(AREAS, {
  bandar: {
    dunia: 2, nama: "Bandar Segara", sub: "Kota pelabuhan — zona aman · Lv 12+", namaEn: "Segara Harbor", subEn: "Harbor town — safe zone · Lv 12+",
    lagu: "segara", tepi: WATER, w: 40, h: 30, aman: true,
    zona: { kota: { x0: 3, y0: 3, x1: 36, y1: 25 } },
    gerbang: [
      { x0: 0, y0: 14, x1: 0, y1: 15, ke: "pesisir", masuk: { x: 40.5, y: 12.5 }, label: "← Pulang", labelEn: "← Sail home" },
      { x0: 39, y0: 13, x1: 39, y1: 15, ke: "bakau", masuk: { x: 2.5, y: 14.5 }, label: "Bakau →", labelEn: "Mangrove →" },
      { x0: 18, y0: 0, x1: 20, y1: 0, ke: "larangan", masuk: { x: 19.5, y: 37.5 }, label: "Ke Larangan", labelEn: "To the Forest" },
    ],
    teleport: { id: "bandar", x: 22.5, y: 11.5 },
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (y < 2) setT(x, y, TREE);
        else if (x < 2 || x >= MW - 2 || y >= MH - 3) setT(x, y, WATER);
        else if (x < 4 || x >= MW - 4 || y >= MH - 5) setT(x, y, SAND);
        else { const v = r(); setT(x, y, v < 0.04 ? FLOWER : v < 0.06 ? TREE : G); }
      }
      // dermaga barat & jembatan timur
      fillRect(0, 14, 5, 15, BRIDGE);
      fillRect(35, 13, 39, 15, BRIDGE);
      // jalan
      fillRect(5, 14, 35, 15, PATH);
      fillRect(19, 0, 20, 24, PATH); fillRect(18, 0, 18, 2, PATH);
      fillRect(8, 9, 32, 9, PATH);
      // pohon kelapa di pasir
      for (let y = 2; y < MH - 3; y++) for (let x = 2; x < MW - 2; x++) if (tileAt(x, y) === SAND && r() < 0.05 && (y < 13 || y > 16)) setT(x, y, TREE);
      for (const [hx, hy] of [[7, 5], [13, 5], [24, 5], [30, 5], [7, 19], [24, 19], [30, 19]]) { houses.push({ x: hx, y: hy }); fillRect(hx, hy, hx + 2, hy + 1, HOUSE); }
      bersihkan([[11, 12], [27, 17], [8, 17], [15, 17], [22, 3], [22, 11], [3, 14], [36, 14]], G);
    },
  },
  bakau: {
    dunia: 2, nama: "Hutan Bakau", sub: "Akar-akar di air payau · Lv 13+", namaEn: "Mangrove Forest", subEn: "Roots in brackish water · Lv 13+",
    lagu: "luar", tepi: TREE, w: 44, h: 34,
    zona: {
      bakauBarat: { x0: 4, y0: 3, x1: 30, y1: 11 },
      bakauPantai: { x0: 8, y0: 22, x1: 38, y1: 28 },
    },
    gerbang: [
      { x0: 0, y0: 13, x1: 0, y1: 15, ke: "bandar", masuk: { x: 36.5, y: 14.5 }, label: "← Bandar", labelEn: "← Harbor" },
      // jembatan karang ke Kuil Samudra: muncul setelah Nyi Laras membuka segel (cerita bab 4)
      { x0: 43, y0: 13, x1: 43, y1: 15, ke: "kuil", masuk: { x: 2.5, y: 16.5 }, label: "Kuil →", labelEn: "Temple →", kunci: "kuil" },
    ],
    teleport: { id: "bakau", x: 6.5, y: 18.5 },
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (y < 2 || x < 1) setT(x, y, TREE);
        else if (x >= 39 || y >= 30) setT(x, y, WATER);           // laut
        else if (y >= 21) setT(x, y, r() < 0.06 ? TREE : SAND);   // pantai
        else { const v = r(); setT(x, y, v < 0.12 ? TREE : v < 0.2 ? REED : v < 0.26 ? WATER : MUD); }
      }
      // kanal air payau
      for (let x = 2; x < 38; x++) { const y = 18 + Math.round(Math.sin(x * 0.35) * 1.5); setT(x, y, WATER); setT(x, y + 1, WATER); }
      fillRect(10, 17, 12, 20, BRIDGE); fillRect(28, 17, 30, 20, BRIDGE);
      // jalan setapak
      fillRect(0, 13, 38, 15, PATH);
      for (let y = 15; y <= 24; y++) setT(11, y, PATH), setT(29, y, PATH);
      // jembatan ke kuil
      const buka = S && S.buka && S.buka.kuil;
      fillRect(39, 13, 43, 15, buka ? BRIDGE : WATER);
      bersihkan([[6, 18], [2, 14], [37, 14]], MUD);
    },
  },
  larangan: {
    dunia: 2, nama: "Hutan Larangan", sub: "Hutan lebat yang dikeramatkan · Lv 15+", namaEn: "Forbidden Forest", subEn: "A dense, sacred jungle · Lv 15+",
    lagu: "luar", tepi: TREE, w: 40, h: 40, gelap: true,
    zona: {
      laranganTengah: { x0: 4, y0: 15, x1: 35, y1: 24 },
      laranganSelatan: { x0: 4, y0: 27, x1: 35, y1: 35 },
    },
    gerbang: [{ x0: 18, y0: 39, x1: 20, y1: 39, ke: "bandar", masuk: { x: 19.5, y: 2.5 }, label: "Ke Bandar", labelEn: "To Harbor" }],
    teleport: { id: "larangan", x: 23.5, y: 35.5 },
    bos: { x: 20, y: 7.5, monster: "silumanUlar" },   // lapangan diperluas: 30×12 petak
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (x < 2 || y < 2 || x >= MW - 2 || y >= MH - 1) setT(x, y, TREE);
        else { const v = r(); setT(x, y, v < 0.2 ? TREE : v < 0.25 ? FLOWER : v < 0.28 ? ROCK : G); }
      }
      // tanah lapang sarang siluman di utara, dikelilingi pohon
      fillRect(5, 2, 34, 13, G);
      for (let x = 5; x <= 34; x++) setT(x, 14, TREE);
      fillRect(18, 14, 21, 14, PATH);
      for (const [x, y] of [[8, 4], [31, 4], [8, 11], [31, 11]]) setT(x, y, ROCK);
      // jalan berkelok dari selatan ke sarang
      jalanKelok(r, 19, 37, 8, 26, 2, PATH);
      jalanKelok(r, 8, 26, 30, 18, 2, PATH);
      jalanKelok(r, 30, 18, 19, 14, 2, PATH);
      fillRect(18, 36, 20, 39, PATH);
      bersihkan([[23, 35], [19, 37]], G);
    },
  },
  kuil: {
    dunia: 2, nama: "Kuil Samudra", sub: "Reruntuhan kuil di atas karang · Lv 17+", namaEn: "Sea Temple", subEn: "Temple ruins on the reef · Lv 17+",
    lagu: "gua", tepi: WATER, w: 44, h: 32,
    zona: {
      kuilAula: { x0: 5, y0: 14, x1: 38, y1: 26 },
    },
    gerbang: [
      { x0: 0, y0: 15, x1: 0, y1: 17, ke: "bakau", masuk: { x: 40.5, y: 14.5 }, label: "← Bakau", labelEn: "← Mangrove" },
      // Tangga Pelangi ke Negeri Awan (dibuka di akhir bab 4)
      { x0: 16, y0: 0, x1: 18, y1: 0, ke: "awan", masuk: { x: 17.5, y: 24.5 }, label: "Tangga Pelangi", labelEn: "Rainbow Stair", kunci: "pelangi" },
    ],
    teleport: { id: "kuil", x: 6.5, y: 23.5 },
    bos: { x: 22, y: 7.5, monster: "panglimaKarang" },   // ruang suci (dulu 16×8, kini 36×9 petak)
    build(r) {
      const buka = (S && S.buka) || {};
      fillRect(0, 0, MW - 1, MH - 1, WATER);
      fillRect(3, 2, MW - 4, MH - 3, STONE);
      // tepi karang
      for (let y = 2; y < MH - 2; y++) for (let x = 3; x < MW - 3; x++) {
        const tepi = x === 3 || x === MW - 4 || y === 2 || y === MH - 3;
        if (tepi && r() < 0.7) setT(x, y, CORAL);
      }
      fillRect(0, 15, 4, 17, BRIDGE);
      // tembok pemisah: ruang suci bos (utara, lapang) | aula besar (selatan)
      fillRect(4, 12, MW - 5, 12, WALL); fillRect(10, 12, 14, 12, STONE); fillRect(29, 12, 32, 12, STONE);
      // kolam kecil di sudut ruang suci
      for (const [x, y] of [[5, 3], [6, 3], [5, 4], [MW - 6, 3], [MW - 7, 3], [MW - 6, 4]]) setT(x, y, WATER);
      // tiang-tiang aula & ruang suci
      for (const [x, y] of [[8, 16], [8, 22], [14, 16], [14, 22], [21, 16], [21, 22], [27, 16], [27, 22], [34, 16], [34, 22], [9, 5], [MW - 10, 5], [9, 10], [MW - 10, 10]]) setT(x, y, WALL);
      for (let i = 0; i < 12; i++) setT(Math.floor(r() * 32) + 6, Math.floor(r() * 10) + 14, CORAL);
      // jalan ke Tangga Pelangi
      fillRect(16, 0, 18, 2, buka.pelangi ? BRIDGE : WATER);
      if (buka.pelangi) fillRect(16, 2, 18, 2, STONE);
      bersihkan([[6, 23], [2, 16], [17, 3], [12, 13], [30, 13], [12, 11], [30, 11]], STONE);
    },
  },
});
