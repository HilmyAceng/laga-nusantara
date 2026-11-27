// =====================================================================
// DUNIA 6 · RIMBA RAYA → PUNCAK SALJU ABADI (bab 15-20, arc "Benang Sepi")
// Dimasuki dengan rakit dari Lembah Tugu (kunci "rimba").
// Area: Kampung Rumah Panjang (aman), Rimba Raya, Beringin Tua (puzzle cermin cahaya &
// lantai jamur, bos Wewe Gombel), Lereng Kabut Dingin, Pondok Nini Embun (aman),
// Gua Es Bernyanyi (puzzle seluncur & gamelan es, bos Yaksa Es), Puncak Salju Abadi
// (puzzle memori, bos Macan Putih), Kelir Beku (puzzle wayang, bos Dalang Sepi).
// =====================================================================
"use strict";

// sungai berkelok: petak jalan yang dilewati sungai menjadi jembatan
function sungaiKelok(r, x0, y0, y1, lebar) {
  let x = x0;
  for (let y = y0; y <= y1; y++) {
    if (r() < 0.3) x += r() < 0.5 ? -1 : 1;
    for (let i = 0; i < lebar; i++) setT(x + i, y, tileAt(x + i, y) === PATH ? BRIDGE : WATER);
  }
}

Object.assign(AREAS, {
  rumahPanjang: {
    dunia: 6, nama: "Kampung Rumah Panjang", sub: "Satu rumah panjang untuk satu kampung — zona aman · Lv 64+", namaEn: "Longhouse Village", subEn: "One long house for a whole village — safe zone · Lv 64+",
    lagu: "rimba", tepi: TREE, w: 44, h: 30, aman: true, rimba: true,
    zona: { kampung: { x0: 6, y0: 3, x1: 41, y1: 26 } },
    gerbang: [
      { x0: 1, y0: 14, x1: 2, y1: 16, ke: "lembahTugu", masuk: { x: 48.5, y: 19.5 }, label: "← Rakit ke Lembah", labelEn: "← Raft to the Valley" },
      { x0: 43, y0: 14, x1: 43, y1: 16, ke: "rimba", masuk: { x: 2.5, y: 20.5 }, label: "Rimba →", labelEn: "Jungle →" },
    ],
    teleport: { id: "rumahPanjang", x: 36.5, y: 12.5 },
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (y < 2 || y >= MH - 2 || x >= MW - 1) setT(x, y, TREE);
        else if (x < 5) setT(x, y, WATER);
        else { const v = r(); setT(x, y, v < 0.04 ? FLOWER : v < 0.07 ? TREE : G); }
      }
      fillRect(1, 14, 5, 16, BRIDGE);                  // dermaga kecil + petak rakit di x1-2 (99zr-rupa-gerbang.js)
      fillRect(6, 14, MW - 1, 16, PATH);
      fillRect(9, 8, 31, 11, PATH);                    // halaman depan rumah panjang
      fillRect(20, 11, 21, 26, PATH);
      for (let i = 0; i < 7; i++) { houses.push({ x: 10 + i * 3, y: 5, panjang: true }); fillRect(10 + i * 3, 5, 12 + i * 3, 6, HOUSE); }   // rumah panjang
      for (const [hx, hy] of [[8, 20], [31, 20], [36, 4]]) { houses.push({ x: hx, y: hy }); fillRect(hx, hy, hx + 2, hy + 1, HOUSE); }
      bersihkan([[17, 9], [30, 13], [9, 19], [24, 19], [36, 12], [13, 22], [27, 22], [25, 22], [6, 15], [41, 15]], G);
    },
  },
  rimba: {
    dunia: 6, nama: "Rimba Raya", sub: "Pohon setinggi menara, akar sebesar perahu · Lv 64+", namaEn: "Great Rainforest", subEn: "Trees as tall as towers, roots as big as boats · Lv 64+",
    lagu: "luar", tepi: TREE, w: 56, h: 48, rimba: true,
    zona: {
      rimbaSelatan: { x0: 4, y0: 28, x1: 50, y1: 44 },
      rimbaUtara: { x0: 4, y0: 4, x1: 25, y1: 24 },
      rimbaTimur: { x0: 34, y0: 4, x1: 50, y1: 24 },
    },
    gerbang: [
      { x0: 0, y0: 19, x1: 0, y1: 21, ke: "rumahPanjang", masuk: { x: 41.5, y: 15.5 }, label: "← Kampung", labelEn: "← Village" },
      { x0: 27, y0: 0, x1: 29, y1: 0, ke: "beringin", masuk: { x: 24.5, y: 37.5 }, label: "Beringin Tua", labelEn: "Old Banyan" },
      { x0: 55, y0: 8, x1: 55, y1: 10, ke: "lereng", masuk: { x: 2.5, y: 45.5 }, label: "Lereng →", labelEn: "Slopes →", kunci: "lereng" },
    ],
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (y < 2 || y >= MH - 2 || x >= MW - 1 || x < 1) setT(x, y, TREE);
        else { const v = r(); setT(x, y, v < 0.19 ? TREE : v < 0.23 ? FLOWER : G); }
      }
      jalanKelok(r, 1, 20, 27, 2, 2, PATH);
      jalanKelok(r, 27, 9, 53, 9, 2, PATH);
      jalanKelok(r, 12, 21, 40, 38, 2, PATH);          // jalan setapak ke selatan (perburuan)
      fillRect(0, 19, 2, 21, PATH); fillRect(27, 0, 29, 3, PATH); fillRect(53, 8, MW - 1, 10, PATH);
      sungaiKelok(r, 31, 2, MH - 3, 3);
      bersihkan([[2, 20], [28, 2], [53, 9], [20, 30], [40, 38]], G);
    },
  },
  beringin: {
    dunia: 6, nama: "Beringin Tua", sub: "Pohon beringin raksasa yang tak pernah tersentuh cahaya · Lv 67+", namaEn: "The Old Banyan", subEn: "A giant banyan never touched by light · Lv 67+",
    lagu: "gua", tepi: TREE, w: 48, h: 40, rimba: true, gelap: true,
    zona: { beringinSelatan: { x0: 20, y0: 29, x1: 44, y1: 37 }, beringinTengah: { x0: 31, y0: 17, x1: 45, y1: 25 } },
    gerbang: [{ x0: 23, y0: 39, x1: 25, y1: 39, ke: "rimba", masuk: { x: 28.5, y: 2.5 }, label: "↓ Rimba", labelEn: "↓ Jungle" }],
    bos: { x: 24, y: 10.5, monster: "weweGombel" },
    objek: [
      // cahaya beringin (cermin, 11×9 di x6-16, y29-37; dicek pemecah: 2 solusi, 8 cermin terpakai)
      { kind: "sumberCahaya", id: "cahayaBeringin", x: 6.5, y: 34.5, arah: 0 },
      { kind: "targetCahaya", id: "cahayaBeringin", x: 15.5, y: 35.5 },
      { kind: "kristalCahaya", id: "cahayaBeringin", x: 12.5, y: 33.5 },
      ...[[8, 31], [12, 31], [7, 32], [10, 32], [12, 34], [15, 34], [7, 35], [8, 35], [10, 35]].map(([x, y], i) => ({ kind: "cerminCahaya", id: "cahayaBeringin", i, x: x + 0.5, y: y + 0.5, awal: "101011010"[i] === "1" ? 1 : 0 })),
      // jamur bercahaya (lantai 4×4)
      { kind: "lantai", id: "jamurBeringin", x: 34, y: 19, n: 4, gaya: "jamur" },
      { kind: "pilarLantai", id: "jamurBeringin", x: 32.5, y: 18.6, gaya: "jamur" },
    ],
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (y < 2 || y >= MH - 1 || x < 1 || x >= MW - 1) setT(x, y, TREE);
        else setT(x, y, r() < 0.1 ? TREE : r() < 0.05 ? FLOWER : G);
      }
      fillRect(23, 28, 25, MH - 1, PATH); fillRect(22, 28, 26, 29, PATH);
      // tiga bagian dipisah dinding pohon: selatan (cermin) | tengah (jamur) | utara (beringin & bos)
      fillRect(1, 27, MW - 2, 27, TREE); if (tekaBeres("cahayaBeringin")) fillRect(22, 27, 26, 27, PATH);
      fillRect(1, 15, MW - 2, 15, TREE); if (tekaBeres("jamurBeringin")) fillRect(22, 15, 26, 15, PATH);
      fillRect(22, 16, 26, 26, PATH);
      // ruang cermin
      const peta = [
        "###########",
        "#......#.##",
        "#.........#",
        "#.........#",
        "#........##",
        "S......##.#",
        "#.........#",
        "#........##",
        "####..#####"];
      peta.forEach((baris, ly) => [...baris].forEach((c, lx) => setT(6 + lx, 29 + ly, c === "#" ? ROCK : G)));
      fillRect(10, 38, 11, 38, G); fillRect(12, 38, 22, 38, PATH);
      // ruang jamur & pelataran bos
      fillRect(33, 18, 39, 24, G);
      fillRect(4, 3, MW - 5, 13, G);
      for (let y = 2; y <= 6; y++) for (let x = 19; x <= 29; x++) if ((x - 24) ** 2 / 25 + (y - 3) ** 2 / 9 < 1) setT(x, y, TREE);   // batang & akar beringin
      bersihkan([[24, 38], [8, 33], [33, 18], [24, 10]], G);
    },
  },
  lereng: {
    dunia: 6, nama: "Lereng Kabut Dingin", sub: "Hutan berganti salju, angin menggigit · Lv 69+", namaEn: "Cold Mist Slopes", subEn: "Forest gives way to snow, the wind bites · Lv 69+",
    lagu: "luar", tepi: ROCK, w: 40, h: 52, rimba: true, saljuMulai: 27, badai: true,
    zona: { lerengBawah: { x0: 3, y0: 31, x1: 36, y1: 48 }, lerengAtas: { x0: 3, y0: 4, x1: 36, y1: 24 } },
    gerbang: [
      { x0: 0, y0: 44, x1: 0, y1: 46, ke: "rimba", masuk: { x: 53.5, y: 9.5 }, label: "← Rimba", labelEn: "← Jungle" },
      { x0: 19, y0: 0, x1: 21, y1: 0, ke: "pondok", masuk: { x: 16.5, y: 23.5 }, label: "Pondok ↑", labelEn: "Lodge ↑" },
    ],
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (y < 1 || y >= MH - 1 || x < 1 || x >= MW - 1) setT(x, y, ROCK);
        else if (y >= 30) { const v = r(); setT(x, y, v < 0.15 ? TREE : v < 0.2 ? FLOWER : G); }
        else if (y >= 24) { const v = r(); setT(x, y, v < 0.1 ? TREE : v < 0.5 ? SALJU : G); }
        else { const v = r(); setT(x, y, v < 0.08 ? TREE : v < 0.12 ? ROCK : SALJU); }
      }
      jalanKelok(r, 1, 45, 30, 30, 2, PATH);
      jalanKelok(r, 30, 30, 8, 14, 2, PATH);
      jalanKelok(r, 8, 14, 20, 1, 2, PATH);
      fillRect(0, 44, 2, 46, PATH); fillRect(19, 0, 21, 2, PATH);
      for (let y = 0; y < 27; y++) for (let x = 0; x < MW; x++) if (tileAt(x, y) === PATH) setT(x, y, SALJU);   // jalan tertutup salju
      bersihkan([[2, 45], [20, 2], [30, 30], [8, 14]], SALJU);
    },
  },
  pondok: {
    dunia: 6, nama: "Pondok Nini Embun", sub: "Api unggun di tengah salju — zona aman · Lv 69+", namaEn: "Nini Embun's Lodge", subEn: "A campfire amid the snow — safe zone · Lv 69+",
    lagu: "salju", tepi: ROCK, w: 32, h: 26, aman: true, salju: true,
    zona: { pondok: { x0: 3, y0: 3, x1: 28, y1: 22 } },
    gerbang: [
      { x0: 15, y0: 25, x1: 17, y1: 25, ke: "lereng", masuk: { x: 20.5, y: 2.5 }, label: "↓ Lereng", labelEn: "↓ Slopes" },
      { x0: 31, y0: 11, x1: 31, y1: 13, ke: "guaEs", masuk: { x: 2.5, y: 31.5 }, label: "Gua Es →", labelEn: "Ice Cave →", kunci: "guaEs" },
      { x0: 15, y0: 0, x1: 17, y1: 0, ke: "puncak", masuk: { x: 24.5, y: 41.5 }, label: "Puncak ↑", labelEn: "Summit ↑", kunci: "puncak" },
    ],
    teleport: { id: "pondok", x: 8.5, y: 13.5 },
    objek: [{ kind: "unggun", x: 15.5, y: 13, diam: true }],
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (y < 2 || y >= MH - 2 || x < 2 || x >= MW - 2) setT(x, y, r() < 0.5 ? TREE : ROCK);
        else setT(x, y, r() < 0.04 ? TREE : SALJU);
      }
      fillRect(15, 0, 17, MH - 1, PATH); fillRect(17, 11, MW - 1, 13, PATH);
      fillRect(12, 10, 19, 16, SALJU);
      for (const [hx, hy] of [[5, 4], [22, 4], [5, 18], [23, 17]]) { houses.push({ x: hx, y: hy, salju: true }); fillRect(hx, hy, hx + 2, hy + 1, HOUSE); }
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) if (tileAt(x, y) === PATH) setT(x, y, SALJU);
      bersihkan([[13, 10], [20, 16], [8, 13], [24, 10], [8, 21], [9, 21], [16, 24], [30, 12], [16, 1]], SALJU);
    },
  },
  guaEs: {
    dunia: 6, nama: "Gua Es Bernyanyi", sub: "Es yang berdenting setiap angin lewat · Lv 71+", namaEn: "Singing Ice Cave", subEn: "Ice that chimes whenever the wind passes · Lv 71+",
    lagu: "gua", tepi: WALL, w: 48, h: 54, salju: true, gelap: true,
    zona: { guaDepan: { x0: 2, y0: 27, x1: 13, y1: 37 } },
    gerbang: [{ x0: 0, y0: 30, x1: 0, y1: 32, ke: "pondok", masuk: { x: 29.5, y: 12.5 }, label: "← Pondok", labelEn: "← Lodge" }],
    bos: { x: 24, y: 6.5, monster: "yaksaEs" },
    objek: [
      { kind: "tujuanEs", id: "esSeluncur", x: 21, y: 24 },
      { kind: "prasastiTeka", id: "esSeluncur", x: 18.5, y: 37.6 },
      // gamelan es: 6 bilah + prasasti notasi + es bernyanyi
      ...["1", "2", "3", "5", "6", "1'"].map((nada, i) => ({ kind: "bilah", id: "gamelanEs", nada, x: 17.5 + i * 2.5, y: 17.6, gaya: "es" })),
      { kind: "prasastiTeka", id: "gamelanEs", x: 10.5, y: 16.6 },
      { kind: "esBernyanyi", id: "gamelanEs", x: 38.5, y: 16.6 },
      // es dalam (opsional, sulit)
      { kind: "tujuanEs", id: "esDalam", x: 40, y: 38 },
      { kind: "prasastiTeka", id: "esDalam", x: 33.5, y: 52.6 },
    ],
    build(r) {
      fillRect(0, 0, MW - 1, MH - 1, WALL);
      fillRect(1, 1, MW - 2, 12, SALJU);                     // ruang bos
      if (tekaBeres("gamelanEs")) fillRect(22, 13, 26, 13, SALJU);
      fillRect(1, 14, MW - 2, 20, SALJU);                    // aula gamelan
      fillRect(20, 21, 22, 23, SALJU);                       // lorong dari tujuan seluncur
      const es1 = [
        "#####G#######",
        "##..#..#....#",
        "#.......##..#",
        "#.....#..#.##",
        "#.....###...#",
        "##..........#",
        "#....#......#",
        "#.....#....##",
        "#..#.#......#",
        "#...........#",
        "######S######"];
      const es2 = [
        "###########G#####",
        "##..#....##..#..#",
        "#...#....##.....#",
        "#.#..#.........##",
        "#...............#",
        "#.##....#.......#",
        "##...........#..#",
        "#.......#.......#",
        "#...#..#........#",
        "#...##..#..##...#",
        "#........#...#..#",
        "#.....#..#.#....#",
        "########S########"];
      const pasang = (peta, ox, oy) => peta.forEach((baris, ly) => [...baris].forEach((c, lx) => setT(ox + lx, oy + ly, c === "#" ? ROCK : c === "." ? ES : SALJU)));
      pasang(es1, 16, 24);                                   // dicek pemecah: minimal 11 luncuran
      fillRect(22, 35, 22, 36, SALJU); fillRect(14, 36, 22, 37, SALJU);
      fillRect(1, 26, 14, 38, SALJU);                        // aula depan
      fillRect(0, 30, 0, 32, SALJU);
      pasang(es2, 29, 38);                                   // dicek pemecah: minimal 19 luncuran
      fillRect(8, 39, 9, 52, SALJU); fillRect(8, 51, 37, 52, SALJU);
      fillRect(39, 37, 41, 37, SALJU);                       // ceruk kecil di atas tujuan es dalam
      for (const [x, y] of [[6, 4], [41, 4], [6, 10], [41, 10], [5, 29], [11, 35]]) setT(x, y, ROCK);
    },
  },
  puncak: {
    dunia: 6, nama: "Puncak Salju Abadi", sub: "Atap dunia, tempat angin tidur · Lv 74+", namaEn: "Everlasting Snow Peak", subEn: "The roof of the world, where the wind sleeps · Lv 74+",
    lagu: "kawah", tepi: ROCK, w: 48, h: 44, salju: true, badai: true,
    zona: { puncakBawah: { x0: 3, y0: 30, x1: 34, y1: 40 }, puncakTengah: { x0: 3, y0: 16, x1: 16, y1: 25 } },
    gerbang: [
      { x0: 23, y0: 43, x1: 25, y1: 43, ke: "pondok", masuk: { x: 16.5, y: 2.5 }, label: "↓ Pondok", labelEn: "↓ Lodge" },
      { x0: 23, y0: 0, x1: 25, y1: 0, ke: "kelir", masuk: { x: 24.5, y: 33.5 }, label: "Kelir Beku", labelEn: "Frozen Screen", kunci: "kelir" },
    ],
    bos: { x: 24, y: 7.5, monster: "macanPutih" },
    objek: [
      { kind: "batuMemori", id: "tuguAngin", x: 24.5, y: 19.6 },
      ...[19, 21, 23, 25, 27, 29].map((x, i) => ({ kind: "lempengMemori", id: "tuguAngin", i, x, y: 23 })),
      { kind: "lantai", id: "lantaiPuncak", x: 38, y: 30, n: 5, gaya: "es" },
      { kind: "pilarLantai", id: "lantaiPuncak", x: 40.5, y: 28.6, gaya: "es" },
    ],
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (y < 1 || y >= MH - 1 || x < 2 || x >= MW - 2) setT(x, y, ROCK);
        else setT(x, y, r() < 0.06 ? ROCK : SALJU);
      }
      fillRect(23, 26, 25, MH - 1, SALJU);
      fillRect(3, 2, MW - 4, 13, SALJU);                     // pelataran Macan Putih
      fillRect(2, 14, MW - 3, 14, ROCK); if (tekaBeres("tuguAngin")) fillRect(22, 14, 26, 14, SALJU);
      fillRect(17, 17, 31, 25, SALJU);                       // lingkaran tugu angin
      fillRect(23, 0, 25, 1, S && S.bos && S.bos.macanPutih ? SALJU : ROCK);
      fillRect(36, 27, 45, 37, ROCK); fillRect(37, 28, 44, 36, SALJU); fillRect(36, 33, 36, 34, SALJU);   // ceruk lantai opsional
      for (const [x, y] of [[8, 4], [40, 4], [8, 11], [40, 11]]) setT(x, y, ROCK);
    },
  },
  kelir: {
    dunia: 6, nama: "Kelir Beku", sub: "Layar wayang raksasa dari es · Lv 78+", namaEn: "The Frozen Screen", subEn: "A giant shadow-puppet screen of ice · Lv 78+",
    lagu: "kawah", tepi: WALL, w: 48, h: 36, salju: true,
    zona: { kelirBawah: { x0: 3, y0: 26, x1: 44, y1: 32 } },
    gerbang: [{ x0: 23, y0: 35, x1: 25, y1: 35, ke: "puncak", masuk: { x: 24.5, y: 2.5 }, label: "↓ Puncak", labelEn: "↓ Summit" }],
    bos: { x: 24, y: 9.5, monster: "dalangSepi" },
    objek: [
      { kind: "prasastiTeka", id: "kelirWayang", x: 9.5, y: 22.6 },
      ...[15, 19.5, 24, 28.5, 33].map((x, i) => ({ kind: "arcaPutar", id: "kelirWayang", i, x: x + 0.5, y: 22.6, gaya: "wayang" })),
    ],
    build() {
      fillRect(0, 0, MW - 1, MH - 1, WALL);
      fillRect(1, 1, MW - 2, MH - 2, SALJU);
      fillRect(23, 35, 25, 35, SALJU);
      fillRect(2, 19, MW - 3, 19, WALL); if (tekaBeres("kelirWayang")) fillRect(22, 19, 26, 19, SALJU);
      fillRect(4, 1, MW - 5, 2, WALL);                       // tiang kelir
      for (const [x, y] of [[4, 6], [43, 6], [4, 15], [43, 15], [8, 28], [39, 28]]) setT(x, y, WALL);
    },
  },
});
