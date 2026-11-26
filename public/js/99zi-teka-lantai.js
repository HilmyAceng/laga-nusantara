// =====================================================================
// PUZZLE LANTAI NYALA: menginjak satu petak membalik nyala petak itu & 4 tetangganya.
// Nyalakan semua petak. Objek `lantai` { id, x, y (pojok kiri atas), n (ukuran), gaya }.
//  - Keadaan awal dibuat dari "semua menyala" lalu ditekan di TEKA_BARU[id].tekan,
//    jadi selalu bisa dipecahkan (cukup tekan petak-petak yang sama).
//  - `pilarLantai`: penjelasan + tombol ulang ke keadaan awal.
//  gaya: (biasa) lempeng batu emas · "jamur" jamur bercahaya · "es" kristal es
// =====================================================================
"use strict";

let lantaiNyala = {};   // id → array nyala (baris demi baris)
let lantaiTerakhir = null;   // "id:x,y" petak yang sedang diinjak

function keadaanAwalLantai(id, n) {
  const g = new Array(n * n).fill(true);
  for (const [x, y] of TEKA_BARU[id].tekan) balikLantai(g, n, x, y);
  return g;
}
function balikLantai(g, n, x, y) {
  for (const [dx, dy] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < n && ny < n) g[ny * n + nx] = !g[ny * n + nx]; }
}
const objekLantai = () => (area.objek || []).filter((o) => o.kind === "lantai");
SAAT_MASUK_AREA.push(() => {
  lantaiNyala = {}; lantaiTerakhir = null;
  for (const o of objekLantai()) lantaiNyala[o.id] = tekaSelesai(o.id) ? new Array(o.n * o.n).fill(true) : keadaanAwalLantai(o.id, o.n);
});
UPDATE_TAMBAHAN.push(() => {
  if (!P || P.dead) return;
  const tx = Math.floor(P.x / T), ty = Math.floor(P.y / T);
  let kini = null;
  for (const o of objekLantai()) {
    const lx = tx - o.x, ly = ty - o.y;
    if (lx < 0 || ly < 0 || lx >= o.n || ly >= o.n) continue;
    kini = o.id + ":" + lx + "," + ly;
    if (kini === lantaiTerakhir || tekaSelesai(o.id)) break;
    if (tekaBelumSaatnya(o.id)) { notifBelum("lantai:" + o.id, t("belum.benda") + " " + teksNanti(langkahTeka(o.id).l)); break; }
    balikLantai(lantaiNyala[o.id], o.n, lx, ly);
    sfx.coin(); spark((tx + 0.5) * T, (ty + 0.5) * T, o.gaya === "jamur" ? "#9fffb0" : o.gaya === "es" ? "#bfe8ff" : "#ffe066", 6);
    const nyala = lantaiNyala[o.id].filter(Boolean).length;
    if (nyala === o.n * o.n) selesaiTeka(o.id);
    else notifItem(`✦ ${nyala} / ${o.n * o.n}`);
    break;
  }
  lantaiTerakhir = kini;
});
TEKA_BICARA.pilarLantai = function (n) {
  const id = n.tekaId, o = objekLantai().find((x) => x.id === id);
  if (tekaSelesai(id)) return openDialog(n.name, t("tk.sudah"), [{ label: t("dlg.tutup"), primary: true, run: closeDialog }]);
  openDialog(n.name, Lx([`Lantai ${o.n}×${o.n} di dekat pilar ini. Setiap kali kau menginjak sebuah petak, petak itu dan petak di atas, bawah, kiri, dan kanannya berganti: yang padam menyala, yang menyala padam. Nyalakan SEMUA petak.${TEKA_BARU[id].opsional ? " (Teka-teki tersembunyi: tidak wajib.)" : ""}`,
    `A ${o.n}×${o.n} floor beside this pillar. Each time you step on a tile, that tile and the tiles above, below, left and right of it flip: dark ones light up, lit ones go dark. Light up ALL the tiles.${TEKA_BARU[id].opsional ? " (Hidden puzzle: optional.)" : ""}`]), [
    { label: Lx(["Ulang dari awal", "Reset"]), run: () => { closeDialog(); lantaiNyala[id] = keadaanAwalLantai(id, o.n); sfx.click(); } },
    { label: t("dlg.tutup"), primary: true, run: closeDialog },
  ]);
};

// ---------- Gambar ----------
GAMBAR_TANAH.push(function (time) {
  for (const o of objekLantai()) {
    const g = lantaiNyala[o.id]; if (!g) continue;
    for (let ly = 0; ly < o.n; ly++) for (let lx = 0; lx < o.n; lx++) {
      const x = (o.x + lx) * T, y = (o.y + ly) * T, on = g[ly * o.n + lx];
      ctx.fillStyle = o.gaya === "jamur" ? "#1e3322" : o.gaya === "es" ? "#6f9ab8" : "#5d5868"; ctx.fillRect(x + 3, y + 3, T - 6, T - 6);
      if (o.gaya === "jamur") {
        ctx.fillStyle = on ? `rgba(160,255,180,${0.75 + 0.2 * Math.sin(time * 3 + lx + ly)})` : "#3a5a3a";
        ctx.beginPath(); ctx.ellipse(x + T / 2, y + T / 2 - 4, 11, 7, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(x + T / 2 - 3, y + T / 2 - 4, 6, 9);
      } else {
        ctx.fillStyle = on ? (o.gaya === "es" ? "#e6f6ff" : "#ffe066") : (o.gaya === "es" ? "#3a5a7a" : "#2b2238");
        ctx.fillRect(x + 7, y + 7, T - 14, T - 14);
        if (on) { ctx.fillStyle = `rgba(255,255,255,${0.25 + 0.2 * Math.sin(time * 4 + lx * 2 + ly)})`; ctx.fillRect(x + 9, y + 9, 8, 3); }
      }
    }
  }
});
GAMBAR_OBJEK.pilarLantai = function (n, time) {
  const x = n.x, y = n.y, warna = n.gaya === "jamur" ? "#9fffb0" : n.gaya === "es" ? "#bfe8ff" : "#ffe066";
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 12, 4, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = n.gaya === "es" ? "#9fb8cf" : "#6f6a75"; ctx.fillRect(x - 7, y - 42, 14, 42);
  ctx.fillStyle = warna; ctx.globalAlpha = 0.6 + 0.3 * Math.sin(time * 3); ctx.beginPath(); ctx.arc(x, y - 46, 6, 0, 6.28); ctx.fill(); ctx.globalAlpha = 1;
  labelObjek(n, warna, 58);
};
