// =====================================================================
// MAP TAMBAHAN DI DUNIA LAMA ("gema", bab 12) & GERBANG KE DUNIA BARU
// Dalang Sepi mencuri gema (sisa jiwa) bos-bos lama. Jejaknya tertinggal di empat
// tempat baru yang terbuka sesuai cerita:
//   Sumur Tua Candi (dunia 1, dari Candi Wingit, kunci "gemaCandi")  · puzzle gamelan
//   Mercusuar Tua (dunia 2, dermaga Bandar Segara, kunci "gemaMercu") · puzzle cermin
//   Taman Gantung (dunia 3, dari Istana Awan, kunci "gemaTaman")      · puzzle putar arca
//   Pustaka Kala (dunia 4, dari Kota Mati, kunci "gemaPustaka")       · puzzle sandi
// Juga: dermaga Bandar Segara → Kota Labuhan Lama (kunci "timur").
// =====================================================================
"use strict";

Object.assign(AREAS, {
  sumurCandi: {
    dunia: 1, nama: "Sumur Tua Candi", sub: "Sumur kering di bawah Candi Wingit · Lv 52+", namaEn: "Old Temple Well", subEn: "A dry well beneath Wingit Temple · Lv 52+",
    lagu: "gua", tepi: WALL, w: 36, h: 28, gelap: true,
    zona: { sumurZona: { x0: 3, y0: 9, x1: 31, y1: 24 } },
    gerbang: [{ x0: 35, y0: 12, x1: 35, y1: 14, ke: "candi", masuk: { x: 2.5, y: 21.5 }, label: "Candi →", labelEn: "Temple →" }],
    objek: [
      ...["1", "2", "3", "5", "6"].map((nada, i) => ({ kind: "bilah", id: "gamelanSumur", nada, x: 12.5 + i * 3, y: 20.6 })),
      { kind: "prasastiTeka", id: "gamelanSumur", i: 0, x: 8.5, y: 9.6 },
      { kind: "prasastiTeka", id: "gamelanSumur", i: 1, x: 28.5, y: 9.6 },
    ],
    build() {
      fillRect(0, 0, MW - 1, MH - 1, WALL);
      fillRect(1, 1, MW - 2, MH - 2, CAVE);
      fillRect(MW - 1, 12, MW - 1, 14, CAVE);
      for (let y = 10; y <= 16; y++) for (let x = 14; x <= 22; x++) if ((x - 18) ** 2 / 12 + (y - 13) ** 2 / 8 < 1) setT(x, y, WALL);   // bibir sumur
      fillRect(1, 7, MW - 2, 7, WALL); if (tekaBeres("gamelanSumur")) fillRect(16, 7, 20, 7, CAVE);   // ruang gema di utara
      for (const [x, y] of [[5, 3], [30, 3], [5, 24], [30, 24], [10, 12], [26, 12]]) setT(x, y, WALL);
    },
  },
  mercusuar: {
    dunia: 2, nama: "Mercusuar Tua", sub: "Mercusuar padam di pulau karang · Lv 53+", namaEn: "Old Lighthouse", subEn: "A dark lighthouse on a rocky isle · Lv 53+",
    lagu: "pesisir", tepi: WATER, w: 30, h: 40,
    zona: { mercuZona: { x0: 4, y0: 27, x1: 25, y1: 34 } },
    gerbang: [{ x0: 14, y0: 39, x1: 16, y1: 39, ke: "bandar", masuk: { x: 25.5, y: 27.5 }, label: "↓ Bandar", labelEn: "↓ Harbor" }],
    // ruang cermin: rancangan 9×7 (dicek pemecah: 2 solusi, 5 dari 6 cermin terpakai) dibuat 2× lebih lega:
    // tiap kotak rancangan = 2×2 petak (x6-23, y10-23); cermin/sumber/target di petak kiri-atas kotaknya,
    // jadi jalur sinar & jawabannya sama persis dengan rancangan aslinya.
    objek: [
      { kind: "sumberCahaya", id: "cerminMercu", x: 6.5, y: 14.5, arah: 0 },
      { kind: "targetCahaya", id: "cerminMercu", x: 20.5, y: 20.5 },
      ...[[3, 1], [3, 2], [4, 2], [7, 2], [3, 4], [4, 4]].map(([lx, ly], i) => ({ kind: "cerminCahaya", id: "cerminMercu", i, x: 6 + lx * 2 + 0.5, y: 10 + ly * 2 + 0.5, awal: "101001"[i] === "1" ? 1 : 0 })),
    ],
    build(r) {
      for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) {
        if (x < 2 || x >= MW - 2 || y < 2) setT(x, y, WATER);
        else if (x < 4 || x >= MW - 4 || y < 4) setT(x, y, r() < 0.4 ? ROCK : SAND);
        else { const v = r(); setT(x, y, v < 0.06 ? ROCK : v < 0.3 ? SAND : G); }
      }
      fillRect(14, 24, 16, MH - 1, PATH); fillRect(14, MH - 2, 16, MH - 1, BRIDGE);
      fillRect(11, 2, 18, 7, WALL); fillRect(13, 3, 16, 6, STONE);   // menara
      if (tekaBeres("cerminMercu")) fillRect(14, 7, 15, 7, STONE);
      fillRect(5, 8, 24, 9, SAND);                                   // pelataran depan menara
      const peta = [
        "#########",
        "##.....##",
        "S.......#",
        "##......#",
        "##......#",
        "#.......#",
        "###..####"];
      peta.forEach((baris, ly) => [...baris].forEach((c, lx) => fillRect(6 + lx * 2, 10 + ly * 2, 7 + lx * 2, 11 + ly * 2, c === "#" ? WALL : STONE)));
      fillRect(4, 14, 5, 15, SAND);                                  // tempat berdiri di samping pelita
      bersihkan([[15, 37], [15, 25], [14, 8], [4, 14]], SAND);
    },
  },
  tamanGantung: {
    dunia: 3, nama: "Taman Gantung", sub: "Taman istana yang melayang di awan · Lv 54+", namaEn: "Hanging Garden", subEn: "The palace garden floating in the clouds · Lv 54+",
    lagu: "luar", tepi: CLOUD, w: 44, h: 34,
    zona: { tamanZona: { x0: 4, y0: 22, x1: 38, y1: 30 } },
    gerbang: [{ x0: 43, y0: 15, x1: 43, y1: 17, ke: "istanaAwan", masuk: { x: 2.5, y: 27.5 }, label: "Istana →", labelEn: "Palace →" }],
    objek: [
      { kind: "prasastiTeka", id: "arcaTaman", x: 10.5, y: 13.6 },
      { kind: "arcaPutar", id: "arcaTaman", i: 0, x: 21.5, y: 11.6 }, { kind: "arcaPutar", id: "arcaTaman", i: 1, x: 25.5, y: 15.6 },
      { kind: "arcaPutar", id: "arcaTaman", i: 2, x: 21.5, y: 19.6 }, { kind: "arcaPutar", id: "arcaTaman", i: 3, x: 17.5, y: 15.6 },
    ],
    build(r) {
      fillRect(0, 0, MW - 1, MH - 1, CLOUD);
      for (let y = 2; y < MH - 2; y++) for (let x = 2; x < MW - 2; x++) { const v = r(); setT(x, y, v < 0.08 ? FLOWER : v < 0.11 ? TREE : G); }
      fillRect(4, 9, 39, 21, STONE);                    // pelataran arca
      fillRect(20, 14, 22, 16, WATER);                  // kolam
      fillRect(2, 8, MW - 3, 8, WALL); if (tekaBeres("arcaTaman")) fillRect(19, 8, 23, 8, STONE);   // gazebo gema di utara
      fillRect(39, 15, MW - 1, 17, STONE);
      bersihkan([[41, 16], [21, 23]], G);
    },
  },
  pustakaKala: {
    dunia: 4, nama: "Pustaka Kala", sub: "Perpustakaan bawah tanah Kalamurka · Lv 55+", namaEn: "Kala Library", subEn: "Kalamurka's underground library · Lv 55+",
    lagu: "gua", tepi: WALL, w: 40, h: 32, bayang: true, gelap: true, alasBatu: "#2e2a38",
    zona: { pustakaZona: { x0: 3, y0: 4, x1: 36, y1: 17 } },
    gerbang: [{ x0: 19, y0: 0, x1: 21, y1: 0, ke: "kotaMati", masuk: { x: 23.5, y: 37.5 }, label: "↑ Kota Mati", labelEn: "↑ Dead City" }],
    objek: [
      { kind: "batuTanya", id: "sandiPustaka", x: 20.5, y: 20.6 },
      { kind: "prasastiTeka", id: "sandiPustaka", i: 0, x: 6.5, y: 10.6 },
      { kind: "prasastiTeka", id: "sandiPustaka", i: 1, x: 33.5, y: 10.6 },
    ],
    build() {
      fillRect(0, 0, MW - 1, MH - 1, WALL);
      fillRect(1, 1, MW - 2, MH - 2, STONE);
      fillRect(19, 0, 21, 0, STONE);
      // rak-rak buku (deretan tembok pendek)
      for (let y = 4; y <= 16; y += 4) for (const x0 of [3, 11, 25, 31]) fillRect(x0, y, x0 + 5, y, WALL);
      fillRect(1, 22, MW - 2, 22, WALL); if (tekaBeres("sandiPustaka")) fillRect(19, 22, 21, 22, STONE);   // ruang arsip di selatan
    },
  },
});

// ---------- Gerbang baru di area lama (+ jalan menuju gerbang itu) ----------
AREAS.candi.gerbang.push({ x0: 0, y0: 20, x1: 0, y1: 22, ke: "sumurCandi", masuk: { x: 33.5, y: 13.5 }, label: "← Sumur Tua", labelEn: "← Old Well", kunci: "gemaCandi" });
AREAS.bandar.gerbang.push(
  { x0: 13, y0: 29, x1: 14, y1: 29, ke: "labuhan", masuk: { x: 2.5, y: 15.5 }, label: "Berlayar ke Timur ↓", labelEn: "Sail East ↓", kunci: "timur" },
  { x0: 25, y0: 29, x1: 26, y1: 29, ke: "mercusuar", masuk: { x: 15.5, y: 37.5 }, label: "Mercusuar ↓", labelEn: "Lighthouse ↓", kunci: "gemaMercu" },
);
AREAS.istanaAwan.gerbang.push({ x0: 0, y0: 26, x1: 0, y1: 28, ke: "tamanGantung", masuk: { x: 41.5, y: 16.5 }, label: "← Taman Gantung", labelEn: "← Hanging Garden", kunci: "gemaTaman" });
AREAS.kotaMati.gerbang.push({ x0: 22, y0: 39, x1: 24, y1: 39, ke: "pustakaKala", masuk: { x: 20.5, y: 2.5 }, label: "↓ Pustaka Kala", labelEn: "↓ Kala Library", kunci: "gemaPustaka" });
const bukaGema = (k) => !!(S && S.buka && S.buka[k]);
for (const [id, buat] of [
  ["candi", () => { if (bukaGema("gemaCandi")) fillRect(0, 20, 1, 22, CAVE); }],
  ["bandar", () => { if (bukaGema("timur")) fillRect(13, 25, 14, 29, BRIDGE); if (bukaGema("gemaMercu")) fillRect(25, 25, 26, 29, BRIDGE); }],
  ["istanaAwan", () => { if (bukaGema("gemaTaman")) fillRect(0, 26, 2, 28, STONE); }],
  ["kotaMati", () => { if (bukaGema("gemaPustaka")) fillRect(22, 36, 24, 39, STONE); }],
]) { const lama = AREAS[id].build; AREAS[id].build = function (r) { lama.call(this, r); buat(); }; }
