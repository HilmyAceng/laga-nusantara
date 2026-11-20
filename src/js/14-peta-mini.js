// =====================================================================
// PETA MINI
// Peta kecil di pojok kanan atas, dibuat ulang setiap pindah area.
// =====================================================================
"use strict";

// peta mini: digambar sekali, lalu titik pemain/NPC/bos di atasnya
// peta mini: dibuat ulang setiap pindah area
const miniBase = document.createElement("canvas");
function buildMiniBase() {
  miniBase.width = MW; miniBase.height = MH;
  const c = miniBase.getContext("2d");
  const col = { [G]: "#3f7d3a", [FLOWER]: "#3f7d3a", [PATH]: "#c8a46e", [WATER]: "#2d6a96", [BRIDGE]: "#8b5e3c", [TREE]: "#24502a", [ROCK]: "#6f6a75", [HOUSE]: "#7a3b2e", [CAVE]: "#3a3142", [WALL]: "#1a1420" };
  for (let y = 0; y < MH; y++) for (let x = 0; x < MW; x++) { c.fillStyle = col[map[y * MW + x]]; c.fillRect(x, y, 1, 1); }
}
const mini = $("mini"), mctx = mini.getContext("2d");
function drawMini() {
  // perbandingan lebar-tinggi peta dijaga, sisanya hitam
  const k = Math.min(mini.width / MW, mini.height / MH), ox = (mini.width - MW * k) / 2, oy = (mini.height - MH * k) / 2;
  mctx.fillStyle = area.tepi === WALL ? "#120d18" : "#1d3b1b"; mctx.fillRect(0, 0, mini.width, mini.height);
  mctx.imageSmoothingEnabled = false;
  mctx.drawImage(miniBase, ox, oy, MW * k, MH * k);
  const dot = (x, y, c, r) => { mctx.fillStyle = c; mctx.beginPath(); mctx.arc(ox + x / T * k, oy + y / T * k, r, 0, 6.28); mctx.fill(); };
  for (const g of area.gerbang) dot((g.x0 + g.x1 + 1) / 2 * T, (g.y0 + g.y1 + 1) / 2 * T, "#8fd3ff", 3.5);
  for (const n of NPCS) dot(n.x, n.y, "#f4b942", 3.5);
  for (const m of monsters) if (m.d.boss && !m.dead) dot(m.x, m.y, "#ff3b3b", 4.5);
  dot(P.x, P.y, "#ffffff", 4);
}
