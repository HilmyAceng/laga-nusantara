// =====================================================================
// TANDA INTERAKSI (desktop & HP)
//  - Benda/NPC terdekat yang bisa diajak berinteraksi (nearNpc) diberi label di bawahnya:
//      desktop: "[E] Bicara" · "[E] Periksa" · "[E] Sentuh cermin" · "[E] Teleport" …
//      HP     : "👆 Bicara" dst. (ketuk tombol Bicara)
//    Dulu label ini hanya muncul di desktop dan ditulis di tiga tempat (16-gambar, 13-cermin, 25-teka-teki).
//  - Benda teka-teki & benda lain yang bisa diperiksa dalam jarak 5 petak diberi lingkaran
//    emas berdenyut di kakinya, supaya jelas mana yang bisa disentuh.
// Disembunyikan selama percakapan & cutscene (sama seperti bar di atas kepala).
// =====================================================================
"use strict";

function kataInteraksi(n) {
  if (n.kind === "cermin") return ["Sentuh cermin", "Touch the mirror"];
  if (n.kind === "teleport") return ["Teleport", "Teleport"];
  if (n.kind === "peti") return ["Buka peti", "Open chest"];
  if (n.warung || n.pahat) return ["Belanja", "Shop"];
  if (!n.kind || n.kind === "warga" || n.aktor || n.aktorGerak || n.id === "teman") return ["Bicara", "Talk"];
  return ["Periksa", "Inspect"];
}
const tombolInteraksi = () => (KONTROL.bicara && KONTROL.bicara[0] ? KONTROL.bicara[0].toUpperCase() : "E");
// benda (bukan orang) yang bisa diperiksa
const bendaInteraktif = (n) => n.kind && n.kind !== "warga" && n.kind !== "teleport" && !n.diam && bisaBicara(n);

// lingkaran penanda di kaki benda (di bawah semua makhluk)
GAMBAR_TANAH.push(function (time) {
  if (!P || mode === "select" || sembunyikanBarKepala()) return;
  for (const n of NPCS) {
    if (!bendaInteraktif(n) || Math.hypot(P.x - n.x, P.y - n.y) > 5 * T) continue;
    const dekat = n === nearNpc, k = 0.5 + 0.5 * Math.sin(time * 4 + n.x * 0.01);
    ctx.strokeStyle = dekat ? `rgba(255,231,168,${0.75 + 0.25 * k})` : `rgba(244,185,66,${0.25 + 0.3 * k})`;
    ctx.lineWidth = dekat ? 3 : 2;
    ctx.beginPath(); ctx.ellipse(n.x, n.y + 2, 18 + k * 3, 7 + k, 0, 0, 6.28); ctx.stroke();
  }
});
// label di bawah benda/NPC terdekat
GAMBAR_ATAS.push(function (time) {
  const n = nearNpc;
  if (!n || mode !== "play" || sembunyikanBarKepala() || !NPCS.includes(n)) return;
  const teks = (isTouch ? "👆 " : `[${tombolInteraksi()}] `) + Lx(kataInteraksi(n));
  ctx.font = "800 11px Nunito, sans-serif"; ctx.textAlign = "center";
  const w = ctx.measureText(teks).width + 14, x = n.x, y = n.y + 14 + Math.sin(time * 4) * 1.2;
  ctx.fillStyle = "rgba(20,14,34,0.82)"; roundRect(ctx, x - w / 2, y, w, 18, 9); ctx.fill();
  ctx.strokeStyle = "rgba(244,185,66,0.7)"; ctx.lineWidth = 1; ctx.stroke();
  ctx.fillStyle = "#f7efe3"; ctx.fillText(teks, x, y + 13);
});
