// =====================================================================
// PETA MINI
// Peta kecil di pojok kanan atas, dibuat ulang setiap pindah area.
// =====================================================================
"use strict";

// peta mini: digambar sekali, lalu titik pemain/NPC/bos di atasnya
// peta mini: dibuat ulang setiap pindah area
const miniBase = document.createElement("canvas");
const TILE_COLOR = { [G]: "#3f7d3a", [FLOWER]: "#3f7d3a", [PATH]: "#c8a46e", [WATER]: "#2d6a96", [BRIDGE]: "#8b5e3c", [TREE]: "#24502a", [ROCK]: "#6f6a75", [HOUSE]: "#7a3b2e", [CAVE]: "#3a3142", [WALL]: "#1a1420",
  [SAND]: "#e2c891", [LAVA]: "#d2461f", [ASH]: "#4a4040", [MUD]: "#434d34", [REED]: "#5e6b33",
  [CLOUD]: "#dfe8f5", [STONE]: "#7d7a86", [CORAL]: "#e0708a" };
// Gambar petak peta (1 petak = 1 piksel) ke sebuah kanvas. Dipakai juga oleh peta dunia.
function paintTiles(cv, w, h, tiles) {
  cv.width = w; cv.height = h;
  const c = cv.getContext("2d");
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { c.fillStyle = TILE_COLOR[tiles[y * w + x]]; c.fillRect(x, y, 1, 1); }
}
function buildMiniBase() { paintTiles(miniBase, MW, MH, map); }
const mini = $("mini"), mctx = mini.getContext("2d");
function drawMini() {
  // perbandingan lebar-tinggi peta dijaga, sisanya hitam
  const k = Math.min(mini.width / MW, mini.height / MH), ox = (mini.width - MW * k) / 2, oy = (mini.height - MH * k) / 2;
  mctx.fillStyle = area.tepi === WALL ? "#120d18" : "#1d3b1b"; mctx.fillRect(0, 0, mini.width, mini.height);
  mctx.imageSmoothingEnabled = false;
  mctx.drawImage(miniBase, ox, oy, MW * k, MH * k);
  const dot = (x, y, c, r) => { mctx.fillStyle = c; mctx.beginPath(); mctx.arc(ox + x / T * k, oy + y / T * k, r, 0, 6.28); mctx.fill(); };
  for (const g of area.gerbang) dot((g.x0 + g.x1 + 1) / 2 * T, (g.y0 + g.y1 + 1) / 2 * T, "#8fd3ff", 3.5);
  for (const n of NPCS) dot(n.x, n.y, n.kind === "teleport" ? "#7dffa8" : n.kind === "cermin" ? "#c9a6ff" : n.kind === "warga" ? "#b9b2c6" : "#f4b942", n.kind === "cermin" ? 4.5 : n.kind === "warga" ? 2.5 : 3.5);
  for (const m of monsters) if (m.d.boss && !m.dead) dot(m.x, m.y, "#ff3b3b", 4.5);
  dot(P.x, P.y, "#ffffff", 4);
  const tj = tujuanDiArea();      // tujuan cerita (27-navigasi.js)
  if (tj) bintang(mctx, ox + tj.x / T * k, oy + tj.y / T * k, 0.85, performance.now() / 1000);
}
