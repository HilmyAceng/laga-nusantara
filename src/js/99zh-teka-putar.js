// =====================================================================
// PUZZLE PUTAR: periksa `arcaPutar` untuk memutarnya searah jarum jam
//  - Arca/tugu: 4 arah (0 utara, 1 timur, 2 selatan, 3 barat); tanda panah di kakinya.
//  - Wayang (TEKA_BARU[id].wayang): 4 tokoh bergantian (0 Gunungan, 1 Putri, 2 Prabu, 3 Raksasa).
//  - Semua cocok dengan TEKA_BARU[id].target → selesai. Petunjuknya di `prasastiTeka`.
// =====================================================================
"use strict";

let arahPutar = {};   // "id:i" → 0..3
const TOKOH_WAYANG = [["Gunungan", "Gunungan"], ["Sang Putri", "the Princess"], ["Sang Prabu", "the King"], ["Raksasa", "a Giant"]];

SAAT_MASUK_AREA.push((id) => {
  arahPutar = {};
  for (const o of AREAS[id].objek || []) if (o.kind === "arcaPutar") arahPutar[o.id + ":" + o.i] = tekaSelesai(o.id) ? TEKA_BARU[o.id].target[o.i] : 0;
});
TEKA_BICARA.arcaPutar = function (n) {
  const id = n.tekaId, P0 = TEKA_BARU[id], k = id + ":" + n.i;
  if (tekaSelesai(id)) return openDialog(n.name, t("tk.sudah"), [{ label: t("dlg.tutup"), primary: true, run: closeDialog }]);
  arahPutar[k] = ((arahPutar[k] || 0) + 1) % 4;
  sfx.slam ? sfx.slam() : sfx.click(); shake = Math.max(shake, 0.05);
  const keadaan = P0.wayang ? Lx(TOKOH_WAYANG[arahPutar[k]]) : Lx(["menghadap ", "facing "]) + Lx(ARAH_NAMA[arahPutar[k]]);
  efekTeksMelayang(n.x, n.y - 60, keadaan, "#ffe7a8");
  const benar = P0.target.every((a, i) => arahPutar[id + ":" + i] === a);
  if (benar) setTimeout(() => selesaiTeka(id), 350);
};

GAMBAR_OBJEK.arcaPutar = function (n, time) {
  const x = n.x, y = n.y, P0 = TEKA_BARU[n.tekaId], a = arahPutar[n.tekaId + ":" + n.i] || 0, selesai = tekaSelesai(n.tekaId);
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 18, 6, 0, 0, 6.28); ctx.fill();
  if (P0.wayang) {
    // tiang & tokoh wayang kulit sesuai keadaan
    ctx.fillStyle = "#5b3a24"; ctx.fillRect(x - 2, y - 12, 4, 12); ctx.fillRect(x - 12, y - 4, 24, 4);
    ctx.fillStyle = selesai ? "#ffe066" : "#c9a24a";
    ctx.save(); ctx.translate(x, y - 12);
    if (a === 0) { ctx.beginPath(); ctx.moveTo(0, -56); ctx.quadraticCurveTo(18, -30, 14, 0); ctx.lineTo(-14, 0); ctx.quadraticCurveTo(-18, -30, 0, -56); ctx.fill(); ctx.fillStyle = "#5a3a8a"; ctx.beginPath(); ctx.arc(0, -24, 5, 0, 6.28); ctx.fill(); }
    else if (a === 1) { ctx.beginPath(); ctx.moveTo(-6, 0); ctx.lineTo(-4, -30); ctx.quadraticCurveTo(4, -48, 10, -40); ctx.lineTo(6, -28); ctx.lineTo(8, 0); ctx.fill(); ctx.fillStyle = "#ff9fbf"; ctx.fillRect(-2, -44, 6, 3); }
    else if (a === 2) { ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(-6, -34); ctx.lineTo(-2, -52); ctx.lineTo(6, -56); ctx.lineTo(8, -34); ctx.lineTo(10, 0); ctx.fill(); ctx.fillStyle = "#f4b942"; ctx.fillRect(-4, -60, 10, 5); }
    else { ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(-12, -30); ctx.quadraticCurveTo(0, -60, 14, -40); ctx.lineTo(14, 0); ctx.fill(); ctx.fillStyle = "#c0392b"; ctx.fillRect(4, -42, 4, 4); }
    ctx.restore();
  } else {
    const tugu = n.tekaId.startsWith("tugu");
    ctx.fillStyle = tugu ? "#8a7a5a" : "#9a96a6"; ctx.fillRect(x - 13, y - 10, 26, 10);   // alas
    if (tugu) { ctx.fillStyle = "#a8936a"; ctx.beginPath(); ctx.moveTo(x - 10, y - 10); ctx.lineTo(x - 7, y - 54); ctx.lineTo(x + 7, y - 58); ctx.lineTo(x + 10, y - 10); ctx.closePath(); ctx.fill(); }
    else { ctx.fillStyle = "#bdb8c8"; roundRect(ctx, x - 9, y - 44, 18, 34, 6); ctx.fill(); ctx.beginPath(); ctx.arc(x, y - 50, 9, 0, 6.28); ctx.fill(); }
    // wajah/arah hadap: panah emas di alas + "mata" di sisi yang dihadap
    const [dx, dy] = [[0, -1], [1, 0], [0, 1], [-1, 0]][a];
    ctx.fillStyle = selesai ? "#ffe066" : "#f4b942";
    ctx.beginPath(); ctx.moveTo(x + dx * 22, y - 4 + dy * 10); ctx.lineTo(x + dx * 12 - dy * 7, y - 4 + dy * 4 + dx * 4); ctx.lineTo(x + dx * 12 + dy * 7, y - 4 + dy * 4 - dx * 4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#3a2618"; if (dy <= 0) { const mx = x + dx * 5; ctx.fillRect(mx - 4, tugu ? y - 44 : y - 52, 2.5, 2.5); ctx.fillRect(mx + 2, tugu ? y - 44 : y - 52, 2.5, 2.5); }
  }
  labelObjek(n, "#ffe7a8", 72);
};
