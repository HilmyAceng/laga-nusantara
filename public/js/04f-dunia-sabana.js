// =====================================================================
// DUNIA 5 · SABANA TIMUR (bab 11-14, arc "Benang Sepi")
// Dimasuki dengan kapal dari Bandar Segara (kunci "timur", lihat 04h-area-gema.js).
// Area: Kota Labuhan Lama (aman), Gang & Atap Labuhan, Gudang Labuhan (puzzle dorong
// peti, bos Juragan Topeng), Padang Sabana (Bukit Sembrani: bos Kuda Sembrani; puzzle
// opsional lantai), Kampung Megalit (aman), Lembah Tugu (puzzle putar & lantai,
// puzzle opsional tugu rahasia), Tugu Agung (bos Watu Gede).
// =====================================================================
"use strict";

Object.assign(AREAS, {
  labuhan: {
    dunia: 5, nama: "Kota Labuhan Lama", sub: "Kota pelabuhan tua di timur — zona aman · Lv 48+", namaEn: "Old Harbor City", subEn: "An old eastern port town — safe zone · Lv 48+",
    lagu: "timur", tepi: WATER, w: 40, h: 32, aman: true,
    zona: { kota: { x0: 3, y0: 3, x1: 36, y1: 24 } },
    gerbang: [
      { x0: 0, y0: 15, x1: 0, y1: 16, ke: "bandar", masuk: { x: 13.5, y: 27.5 }, label: "← Bandar Segara", labelEn: "← Segara Harbor" },
      { x0: 19, y0: 0, x1: 21, y1: 0, ke: "gangLabuhan", masuk: { x: 22.5, y: 31.5 }, label: "Gang ↑", labelEn: "Alleys ↑" },
      { x0: 39, y0: 8, x1: 39, y1: 10, ke: "sabana", masuk: { x: 2.5, y: 9.5 }, label: "Sabana →", labelEn: "Savanna →", kunci: "sabana" },
    ],
    teleport: { id: "labuhan", x: 12.5, y: 12.5 },
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (y < 2 || x >= MW - 2) setT(x, y, TREE);
        else if (x < 2 || y >= MH - 5) setT(x, y, WATER);
        else if (y >= MH - 7) setT(x, y, SAND);
        else { const v = r(); setT(x, y, v < 0.03 ? FLOWER : v < 0.045 ? TREE : G); }
      }
      fillRect(0, 15, 6, 16, BRIDGE);                  // dermaga barat (kapal dari Bandar Segara)
      fillRect(6, 15, 37, 16, PATH);                   // jalan utama
      fillRect(19, 0, 21, 24, PATH);                   // jalan ke gang di utara
      fillRect(21, 8, MW - 1, 10, PATH);               // jalan ke sabana di timur
      fillRect(14, 11, 26, 20, STONE);                 // alun-alun pasar
      fillRect(9, 25, 10, 30, BRIDGE); fillRect(29, 25, 30, 30, BRIDGE);   // dermaga perahu
      for (const [hx, hy] of [[4, 4], [9, 4], [25, 4], [31, 4], [4, 19], [9, 19], [30, 19], [34, 12]]) { houses.push({ x: hx, y: hy }); fillRect(hx, hy, hx + 2, hy + 1, HOUSE); }
      bersihkan([[7, 13], [16, 12], [24, 19], [27, 13], [12, 12], [17, 8], [31, 22], [33, 22], [3, 15], [37, 9], [20, 2], [12, 21], [35, 17]], G);
    },
  },
  gangLabuhan: {
    dunia: 5, nama: "Gang & Atap Labuhan", sub: "Lorong sempit, atap rapat, begal bertopeng · Lv 48+", namaEn: "Harbor Alleys", subEn: "Narrow lanes, packed roofs, masked bandits · Lv 48+",
    lagu: "luar", tepi: WALL, w: 44, h: 34,
    zona: { gangBarat: { x0: 2, y0: 2, x1: 19, y1: 30 }, gangTimur: { x0: 24, y0: 2, x1: 41, y1: 30 } },
    gerbang: [
      { x0: 21, y0: 33, x1: 23, y1: 33, ke: "labuhan", masuk: { x: 20.5, y: 2.5 }, label: "↓ Ke Kota", labelEn: "↓ To Town" },
      { x0: 43, y0: 4, x1: 43, y1: 6, ke: "gudang", masuk: { x: 2.5, y: 13.5 }, label: "Gudang →", labelEn: "Warehouse →" },
    ],
    build(r) {
      fillRect(0, 0, MW - 1, MH - 1, WALL);
      fillRect(1, 1, MW - 2, MH - 2, PATH);
      // deretan rumah rapat dengan gang selebar 2 petak; gang utama (x 21-23, y 17-18) selalu kosong
      for (let i = 0; i < 8; i++) for (let j = 0; j < 7; j++) {
        const hx = 2 + i * 5, hy = 2 + j * 4;
        if (i === 4 || j === 4 || r() < 0.18) continue;
        houses.push({ x: hx, y: hy }); fillRect(hx, hy, hx + 2, hy + 1, HOUSE);
      }
      fillRect(21, 1, 23, MH - 1, PATH); fillRect(1, 17, MW - 2, 18, PATH);
      fillRect(MW - 1, 4, MW - 1, 6, PATH);
      for (let y = 28; y <= 32; y++) for (let x = 1; x < MW - 1; x++) if (r() < 0.04) setT(x, y, ROCK);   // tumpukan peti & tong
      bersihkan([[22, 31], [41, 5], [22, 2]], PATH);
    },
  },
  gudang: {
    dunia: 5, nama: "Gudang Labuhan", sub: "Gudang tua penuh peti selundupan · Lv 51+", namaEn: "Harbor Warehouse", subEn: "An old warehouse full of smuggled crates · Lv 51+",
    lagu: "gua", tepi: WALL, w: 40, h: 28, gelap: true,
    zona: { gudangDepan: { x0: 2, y0: 2, x1: 12, y1: 25 } },
    gerbang: [
      { x0: 0, y0: 12, x1: 0, y1: 14, ke: "gangLabuhan", masuk: { x: 41.5, y: 5.5 }, label: "← Gang", labelEn: "← Alleys" },
    ],
    bos: { x: 33, y: 13.5, monster: "juraganTopeng" },
    objek: [
      // puzzle dorong peti (ruang tengah, petak x15-25, y9-17; dicek dengan pemecah: minimal 15 dorongan)
      { kind: "batuDorong", id: "petiGudang", x: 17, y: 11, gaya: "peti" }, { kind: "batuDorong", id: "petiGudang", x: 23, y: 11, gaya: "peti" },
      { kind: "batuDorong", id: "petiGudang", x: 19, y: 13, gaya: "peti" },
      { kind: "lempeng", id: "petiGudang", x: 19, y: 14 }, { kind: "lempeng", id: "petiGudang", x: 21, y: 14 }, { kind: "lempeng", id: "petiGudang", x: 20, y: 15 },
      { kind: "tuas", id: "petiGudang", x: 11.5, y: 11.5 },
    ],
    build() {
      fillRect(0, 0, MW - 1, MH - 1, WALL);
      fillRect(1, 1, MW - 2, MH - 2, STONE);
      fillRect(0, 12, 0, 14, STONE);
      // dinding sekat: ruang depan | ruang peti | ruang juragan
      fillRect(13, 1, 13, MH - 2, WALL); fillRect(13, 12, 13, 14, STONE);
      fillRect(14, 1, 27, MH - 2, WALL); fillRect(14, 12, 14, 14, STONE);
      const peta = [
        "###########",
        "#..#...#..#",
        "#....#....#",
        "....#.#...#",
        "..#.....#.#",
        "#....#....#",
        "#.#.....#.#",
        "#.........#",
        "###########"];
      peta.forEach((baris, ly) => [...baris].forEach((c, lx) => setT(15 + lx, 9 + ly, c === "#" ? WALL : STONE)));
      if (tekaBeres("petiGudang")) fillRect(25, 12, 27, 13, STONE);   // pintu ke ruang juragan
      for (const [x, y] of [[4, 4], [9, 4], [4, 22], [9, 22], [31, 4], [36, 4], [31, 22], [36, 22]]) setT(x, y, WALL);   // tumpukan peti
    },
  },
  sabana: {
    dunia: 5, nama: "Padang Sabana", sub: "Rumput kering sejauh mata memandang · Lv 56+", namaEn: "Savanna Plains", subEn: "Dry grass as far as the eye can see · Lv 56+",
    lagu: "luar", tepi: TREE, w: 60, h: 48, sabana: true,
    zona: {
      sabanaBarat: { x0: 4, y0: 18, x1: 22, y1: 44 },
      sabanaTengah: { x0: 24, y0: 18, x1: 46, y1: 26 },
      sabanaTimur: { x0: 36, y0: 34, x1: 55, y1: 44 },
      sabanaUtara: { x0: 4, y0: 13, x1: 56, y1: 15 },
    },
    gerbang: [
      { x0: 0, y0: 8, x1: 0, y1: 10, ke: "labuhan", masuk: { x: 37.5, y: 9.5 }, label: "← Labuhan", labelEn: "← Harbor" },
      { x0: 59, y0: 24, x1: 59, y1: 26, ke: "kampungBatu", masuk: { x: 2.5, y: 14.5 }, label: "Kampung →", labelEn: "Village →" },
    ],
    bos: { x: 30, y: 6.5, monster: "kudaSembrani" },   // Bukit Sembrani di utara
    objek: [
      { kind: "lantai", id: "rahasiaSabana", x: 5, y: 37, n: 5 },   // 5×5 berjarak: petak x5-13, y37-45
      { kind: "pilarLantai", id: "rahasiaSabana", x: 4.5, y: 36.6 },
    ],
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (y < 2 || y >= MH - 2 || x >= MW - 1 || (x < 1)) setT(x, y, TREE);
        else { const v = r(); setT(x, y, v < 0.025 ? TREE : v < 0.04 ? ROCK : v < 0.1 ? G : RUMPUT_KERING); }
      }
      // Bukit Sembrani: lingkaran batu megalit, tengahnya lapang
      for (let y = 2; y <= 12; y++) for (let x = 14; x <= 46; x++) setT(x, y, RUMPUT_KERING);
      for (let a = 0; a < 28; a++) { const x = Math.round(30 + Math.cos(a / 28 * 6.28) * 15), y = Math.round(7 + Math.sin(a / 28 * 6.28) * 5); if (a % 4 && y > 2) setT(x, y, ROCK); }
      // kubangan air di tengah selatan
      for (let y = 28; y <= 34; y++) for (let x = 25; x <= 34; x++) setT(x, y, (x - 29.5) ** 2 / 20 + (y - 31) ** 2 / 9 < 1 ? WATER : SAND);
      // jalan setapak: labuhan → kampung, dan cabang ke bukit
      jalanKelok(r, 1, 9, 30, 20, 2, PATH);
      jalanKelok(r, 30, 20, 57, 24, 2, PATH);
      fillRect(29, 12, 30, 20, PATH);
      fillRect(0, 8, 2, 10, PATH); fillRect(56, 24, MW - 1, 26, PATH);
      // petak puzzle opsional (pojok barat daya, tersembunyi di balik semak)
      fillRect(4, 36, 14, 45, RUMPUT_KERING);
      for (let x = 3; x <= 15; x++) { setT(x, 35, TREE); setT(x, 46, TREE); } for (let y = 35; y <= 46; y++) { setT(3, y, TREE); setT(15, y, TREE); }
      setT(15, 40, RUMPUT_KERING); setT(15, 41, RUMPUT_KERING); setT(16, 40, RUMPUT_KERING); setT(16, 41, RUMPUT_KERING);
      bersihkan([[2, 9], [57, 25], [30, 18], [30, 6], [16, 40], [33, 31]], RUMPUT_KERING);
    },
  },
  kampungBatu: {
    dunia: 5, nama: "Kampung Megalit", sub: "Kampung kubur batu & rumah berkolong — zona aman · Lv 56+", namaEn: "Megalith Village", subEn: "Stone tombs & stilt houses — safe zone · Lv 56+",
    lagu: "timur", tepi: TREE, w: 40, h: 30, aman: true, sabana: true,
    zona: { kampung: { x0: 3, y0: 3, x1: 36, y1: 26 } },
    gerbang: [
      { x0: 0, y0: 13, x1: 0, y1: 15, ke: "sabana", masuk: { x: 57.5, y: 25.5 }, label: "← Sabana", labelEn: "← Savanna" },
      { x0: 39, y0: 13, x1: 39, y1: 15, ke: "lembahTugu", masuk: { x: 2.5, y: 20.5 }, label: "Lembah Tugu →", labelEn: "Pillar Valley →", kunci: "tugu" },
    ],
    teleport: { id: "kampungBatu", x: 19.5, y: 16.5 },
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (y < 2 || y >= MH - 2 || x < 1 || x >= MW - 1) setT(x, y, TREE);
        else { const v = r(); setT(x, y, v < 0.03 ? FLOWER : v < 0.05 ? TREE : v < 0.35 ? G : RUMPUT_KERING); }
      }
      fillRect(0, 13, MW - 1, 15, PATH);
      fillRect(19, 3, 20, 26, PATH);
      fillRect(15, 6, 24, 11, STONE);                          // pelataran kubur batu
      for (const [x, y] of [[16, 7], [23, 7], [16, 10], [23, 10]]) setT(x, y, ROCK);   // kubur batu (dolmen)
      for (const [hx, hy] of [[4, 4], [9, 4], [27, 4], [4, 19], [26, 20], [31, 20], [9, 20]]) { houses.push({ x: hx, y: hy }); fillRect(hx, hy, hx + 2, hy + 1, HOUSE); }
      bersihkan([[14, 10], [22, 10], [26, 18], [19, 16], [14, 22], [30, 9], [28, 9], [2, 14], [37, 14]], G);
    },
  },
  lembahTugu: {
    dunia: 5, nama: "Lembah Tugu", sub: "Ratusan batu tegak yang konon bernyanyi · Lv 60+", namaEn: "Valley of Pillars", subEn: "Hundreds of standing stones said to sing · Lv 60+",
    lagu: "gua", tepi: ROCK, w: 52, h: 40, sabana: true, alasBatu: "#a8936a",
    zona: { lembahSelatan: { x0: 3, y0: 26, x1: 48, y1: 36 }, lembahUtara: { x0: 3, y0: 3, x1: 20, y1: 12 } },
    gerbang: [
      { x0: 0, y0: 19, x1: 0, y1: 21, ke: "kampungBatu", masuk: { x: 37.5, y: 14.5 }, label: "← Kampung", labelEn: "← Village" },
      { x0: 24, y0: 0, x1: 26, y1: 0, ke: "tuguAgung", masuk: { x: 22.5, y: 33.5 }, label: "Tugu Agung", labelEn: "Great Pillar", kunci: "teka:lantaiTugu" },
      { x0: 49, y0: 18, x1: 50, y1: 20, ke: "rumahPanjang", masuk: { x: 3.5, y: 15.5 }, label: "Rakit ke Rimba →", labelEn: "Raft to the Jungle →", kunci: "rimba" },
    ],
    objek: [
      // tugu matahari: 4 tugu di sekeliling batu tengah (putar ke arah yang benar)
      { kind: "prasastiTeka", id: "tuguMatahari", x: 13.5, y: 22.6 },
      { kind: "arcaPutar", id: "tuguMatahari", i: 0, x: 20.5, y: 17.6 }, { kind: "arcaPutar", id: "tuguMatahari", i: 1, x: 25.5, y: 20.6 },
      { kind: "arcaPutar", id: "tuguMatahari", i: 2, x: 20.5, y: 23.6 }, { kind: "arcaPutar", id: "tuguMatahari", i: 3, x: 15.5, y: 20.6 },
      // lantai tugu 4×4 di balik pintu batu (terbuka setelah tugu matahari)
      { kind: "lantai", id: "lantaiTugu", x: 22, y: 5, n: 4 },   // 4×4 berjarak: petak x22-28, y5-11
      { kind: "pilarLantai", id: "lantaiTugu", x: 20.5, y: 4.6 },
      // tugu rahasia (opsional, sulit): 6 tugu di ceruk timur
      { kind: "prasastiTeka", id: "tuguRahasia", x: 41.5, y: 4.6 },
      { kind: "arcaPutar", id: "tuguRahasia", i: 0, x: 38.5, y: 7.6 }, { kind: "arcaPutar", id: "tuguRahasia", i: 1, x: 41.5, y: 7.6 }, { kind: "arcaPutar", id: "tuguRahasia", i: 2, x: 44.5, y: 7.6 },
      { kind: "arcaPutar", id: "tuguRahasia", i: 3, x: 38.5, y: 10.6 }, { kind: "arcaPutar", id: "tuguRahasia", i: 4, x: 41.5, y: 10.6 }, { kind: "arcaPutar", id: "tuguRahasia", i: 5, x: 44.5, y: 10.6 },
    ],
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (y < 2 || y >= MH - 2 || x < 1 || x >= MW - 1) setT(x, y, ROCK);
        else { const v = r(); setT(x, y, v < 0.07 ? ROCK : v < 0.3 ? G : RUMPUT_KERING); }
      }
      // jalan utama barat → timur (rakit) & ke utara
      fillRect(0, 19, MW - 1, 21, PATH);
      fillRect(24, 0, 26, 19, PATH);
      // lingkaran tugu matahari
      for (let y = 16; y <= 25; y++) for (let x = 13; x <= 28; x++) if (tileAt(x, y) === ROCK) setT(x, y, RUMPUT_KERING);
      setT(20, 20, ROCK);   // batu tengah
      // tembok batu di utara: ruang lantai (x 20-30, y 4-12), pintunya dibuka tugu matahari
      fillRect(19, 3, 31, 13, WALL); fillRect(20, 4, 30, 12, STONE);
      if (tekaBeres("tuguMatahari")) fillRect(24, 13, 26, 13, STONE);
      fillRect(24, 0, 26, 3, tekaBeres("lantaiTugu") ? PATH : WALL);
      // ceruk tugu rahasia (timur laut), masuk lewat celah sempit
      fillRect(36, 3, 47, 13, ROCK); fillRect(37, 4, 46, 12, RUMPUT_KERING); fillRect(41, 13, 41, 18, RUMPUT_KERING);
      // sungai di timur (rakit menunggu di tepinya)
      fillRect(49, 2, 50, MH - 3, WATER); fillRect(49, 18, 50, 20, BRIDGE);   // petak rakit (digambar sebagai rakit di sungai, 99zr-rupa-gerbang.js)
      bersihkan([[2, 20], [49, 19], [25, 2], [13, 22], [41, 15]], RUMPUT_KERING);
    },
  },
  tuguAgung: {
    dunia: 5, nama: "Tugu Agung", sub: "Batu tegak tertinggi di negeri timur · Lv 63+", namaEn: "The Great Pillar", subEn: "The tallest standing stone of the east · Lv 63+",
    lagu: "kawah", tepi: ROCK, w: 44, h: 36, sabana: true, alasBatu: "#a8936a",
    zona: { tuguPinggir: { x0: 3, y0: 22, x1: 40, y1: 31 } },
    gerbang: [{ x0: 21, y0: 35, x1: 23, y1: 35, ke: "lembahTugu", masuk: { x: 25.5, y: 2.5 }, label: "↓ Lembah", labelEn: "↓ Valley" }],
    bos: { x: 22, y: 9.5, monster: "watuGede" },
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (y < 2 || y >= MH - 1 || x < 2 || x >= MW - 2) setT(x, y, ROCK);
        else setT(x, y, r() < 0.04 ? ROCK : RUMPUT_KERING);
      }
      fillRect(21, 31, 23, MH - 1, PATH);
      fillRect(4, 3, MW - 5, 17, RUMPUT_KERING);   // pelataran bos
      for (const [x, y] of [[6, 4], [37, 4], [6, 15], [37, 15], [14, 3], [29, 3]]) setT(x, y, ROCK);
      fillRect(21, 2, 23, 3, STONE);               // kaki tugu agung
      for (let x = 3; x < MW - 3; x++) if (x < 19 || x > 25) setT(x, 19, ROCK);   // pagar batu
    },
  },
});
