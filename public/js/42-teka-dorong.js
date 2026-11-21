// =====================================================================
// PUZZLE DORONG BATU
// Batu besar (`batuDorong`) didorong dengan berjalan menabraknya. Batu
// bergeser satu petak bila petak di depannya kosong. Semua lempeng
// (`lempeng`) tertutup batu → puzzle selesai. `tuas` = kembalikan batu
// ke posisi awal (kalau batu terjepit di pojok).
// =====================================================================
"use strict";

let batuAktif = [];   // { teka, tx, ty, ax, ay (posisi awal), gx, gy (posisi gambar) }
let lempengAktif = [];
let dorongT = 0;      // lama mendorong ke satu arah

function siapkanBatu(id) {
  batuAktif = []; lempengAktif = [];
  const obj = AREAS[id].objek || [];
  const lempeng = obj.filter((o) => o.kind === "lempeng");
  lempengAktif = lempeng.map((o) => ({ teka: o.id, tx: Math.floor(o.x), ty: Math.floor(o.y) }));
  obj.filter((o) => o.kind === "batuDorong").forEach((o, i) => {
    let tx = Math.floor(o.x), ty = Math.floor(o.y);
    // sudah selesai: batu sudah di atas lempeng
    if (tekaSelesai(o.id)) { const l = lempengAktif.filter((p) => p.teka === o.id)[obj.filter((b) => b.kind === "batuDorong" && b.id === o.id).indexOf(o)]; if (l) { tx = l.tx; ty = l.ty; } }
    batuAktif.push({ teka: o.id, tx, ty, ax: Math.floor(o.x), ay: Math.floor(o.y), gx: tx, gy: ty });
  });
}
SAAT_MASUK_AREA.push(siapkanBatu);
const batuDi = (tx, ty) => batuAktif.find((b) => b.tx === tx && b.ty === ty);
padatTambahan = (tx, ty) => !!batuDi(tx, ty);

UPDATE_TAMBAHAN.push((dt) => {
  for (const b of batuAktif) { b.gx += (b.tx - b.gx) * Math.min(1, dt * 14); b.gy += (b.ty - b.gy) * Math.min(1, dt * 14); }
  if (!batuAktif.length || P.dead || !P.moving) { dorongT = 0; return; }
  // arah dorong: 4 arah dari arah hadap
  const a = P.face, dx = Math.abs(Math.cos(a)) > 0.7 ? Math.sign(Math.cos(a)) : 0, dy = dx ? 0 : Math.sign(Math.sin(a));
  const tx = Math.floor((P.x + dx * (P.r + 6)) / T), ty = Math.floor((P.y + dy * (P.r + 6)) / T);
  const b = batuDi(tx, ty);
  if (!b || tekaSelesai(b.teka)) { dorongT = 0; return; }
  if (tekaBelumSaatnya(b.teka)) { dorongT = 0; notifBelum("batu:" + b.teka, t("belum.batu") + " " + teksNanti(langkahTeka(b.teka).l)); return; }   // 60-belum-saatnya.js
  dorongT += dt;
  if (dorongT < 0.22) return;
  dorongT = 0;
  const nx = b.tx + dx, ny = b.ty + dy;
  if (SOLID.has(tileAt(nx, ny)) || batuDi(nx, ny) || NPCS.some((n) => Math.floor(n.x / T) === nx && Math.floor(n.y / T) === ny)) { sfx.hurt(); return; }
  b.tx = nx; b.ty = ny; sfx.slam(); shake = Math.max(shake, 0.1);
  cekLempeng(b.teka);
});
function cekLempeng(id) {
  const lp = lempengAktif.filter((l) => l.teka === id);
  const kena = lp.filter((l) => batuDi(l.tx, l.ty)).length;
  if (kena && kena < lp.length) notifItem(t("tk.lempeng", { n: kena, max: lp.length }));
  if (lp.length && kena === lp.length) selesaiTeka(id);
}
// tuas: kembalikan semua batu puzzle ini ke tempat awal
TEKA_BICARA.tuas = function (n) {
  if (tekaSelesai(n.tekaId)) return openDialog(n.name, t("tk.sudah"), [{ label: t("dlg.tutup"), primary: true, run: closeDialog }]);
  openDialog(n.name, t("tk.tuasTanya"), [
    { label: t("dlg.nanti"), run: closeDialog },
    { label: t("tk.tuasYa"), primary: true, run: () => {
      closeDialog();
      for (const b of batuAktif) if (b.teka === n.tekaId && !(Math.floor(P.x / T) === b.ax && Math.floor(P.y / T) === b.ay)) { b.tx = b.ax; b.ty = b.ay; }
      sfx.door();
    } },
  ]);
};

// ---------- Gambar ----------
GAMBAR_TANAH.push((time) => {
  for (const l of lempengAktif) {
    const x = l.tx * T, y = l.ty * T, kena = !!batuDi(l.tx, l.ty);
    ctx.fillStyle = kena ? "rgba(125,255,168,0.35)" : "rgba(10,6,20,0.45)"; ctx.fillRect(x + 4, y + 4, T - 8, T - 8);
    ctx.strokeStyle = kena ? "#7dffa8" : `rgba(244,185,66,${0.5 + 0.3 * Math.sin(time * 3)})`; ctx.lineWidth = 2.5; ctx.strokeRect(x + 5, y + 5, T - 10, T - 10);
  }
});
BENDA_TINGGI.push(() => batuAktif.map((b) => ({ y: (b.gy + 1) * T - 4, f: () => {
  const x = b.gx * T + T / 2, y = (b.gy + 1) * T - 4;
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 18, 6, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#6f6a75"; roundRect(ctx, x - 18, y - 32, 36, 32, 8); ctx.fill();
  ctx.fillStyle = "#8d8894"; roundRect(ctx, x - 14, y - 30, 22, 14, 5); ctx.fill();
  ctx.strokeStyle = "rgba(30,20,40,0.5)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x + 6, y - 22); ctx.lineTo(x + 2, y - 12); ctx.lineTo(x + 8, y - 6); ctx.stroke();
} })));
GAMBAR_OBJEK.tuas = function (n, time) {
  const x = n.x, y = n.y, ayun = Math.sin(time * 2) * 0.1;
  ctx.fillStyle = "#4e4258"; ctx.fillRect(x - 12, y - 10, 24, 10);
  ctx.save(); ctx.translate(x, y - 8); ctx.rotate(-0.5 + ayun);
  ctx.fillStyle = "#8d8894"; ctx.fillRect(-2, -24, 4, 24); ctx.fillStyle = "#e5484d"; ctx.beginPath(); ctx.arc(0, -26, 5, 0, 6.28); ctx.fill();
  ctx.restore();
  labelObjek(n, "#ffffff", 42);
};
