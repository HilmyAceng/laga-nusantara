// =====================================================================
// PUZZLE CERMIN CAHAYA: arahkan sinar `sumberCahaya` ke `targetCahaya`
//  - Sinar berjalan lurus per petak (arah: 0 kanan, 1 bawah, 2 kiri, 3 atas) dan berhenti
//    di petak padat. Melewati `cermin` → dipantulkan: posisi 0 = "/", posisi 1 = "\".
//  - Periksa cermin untuk memutarnya. Kalau ada `kristalCahaya`, sinar harus melewati
//    SEMUA kristal sebelum mengenai target.
//  - Posisi awal cermin = `awal` pada objek (rancangan dicek pemecah otomatis).
// =====================================================================
"use strict";

let posisiCermin = {};   // "id:i" → 0 / 1
let sinarCermin = {};    // id → { titik: [[x,y], ...], kena, kristal: Set }
const ARAH_SINAR = [[1, 0], [0, 1], [-1, 0], [0, -1]];

function siapkanCermin(areaBaru) {
  posisiCermin = {}; sinarCermin = {};
  for (const o of AREAS[areaBaru].objek || []) if (o.kind === "cerminCahaya") posisiCermin[o.id + ":" + o.i] = tekaSelesai(o.id) ? null : o.awal || 0;
  // puzzle selesai: pakai posisi jawaban (dicari ulang dari keadaan sekarang)
  for (const o of AREAS[areaBaru].objek || []) if (o.kind === "sumberCahaya" && tekaSelesai(o.id)) cariJawabanCermin(o.id);
}
SAAT_MASUK_AREA.push(siapkanCermin);

function hitungSinar(id) {
  const obj = (area.objek || []).filter((o) => o.id === id);
  const src = obj.find((o) => o.kind === "sumberCahaya"), tgt = obj.find((o) => o.kind === "targetCahaya");
  if (!src || !tgt) return null;
  const cermin = {}; obj.filter((o) => o.kind === "cerminCahaya").forEach((o) => { cermin[Math.floor(o.x) + "," + Math.floor(o.y)] = posisiCermin[id + ":" + o.i] || 0; });
  const kristal = new Set(obj.filter((o) => o.kind === "kristalCahaya").map((o) => Math.floor(o.x) + "," + Math.floor(o.y)));
  const lewat = new Set(), titik = [];
  let x = Math.floor(src.x), y = Math.floor(src.y), [dx, dy] = ARAH_SINAR[src.arah || 0], kena = false;
  titik.push([x, y]);
  for (let i = 0; i < 300; i++) {
    x += dx; y += dy;
    if (x < 0 || y < 0 || x >= MW || y >= MH || SOLID.has(tileAt(x, y))) { titik.push([x - dx * 0.5, y - dy * 0.5]); break; }
    const k = x + "," + y;
    if (kristal.has(k)) lewat.add(k);
    if (x === Math.floor(tgt.x) && y === Math.floor(tgt.y)) { kena = true; titik.push([x, y]); break; }
    if (k in cermin) { titik.push([x, y]); if (cermin[k] === 0) [dx, dy] = [-dy, -dx]; else [dx, dy] = [dy, dx]; }
  }
  return { titik, kena: kena && lewat.size === kristal.size, sampai: kena, kristal: lewat };
}
// keadaan "selesai" saat masuk area: coba semua kombinasi (paling banyak 2^9) untuk menggambar sinar yang benar
function cariJawabanCermin(id) {
  const cm = (AREAS[areaId].objek || []).filter((o) => o.id === id && o.kind === "cerminCahaya");
  for (let m = 0; m < 1 << cm.length; m++) {
    cm.forEach((o, i) => { posisiCermin[id + ":" + o.i] = (m >> i) & 1; });
    const s = hitungSinar(id); if (s && s.kena) return;
  }
}

TEKA_BICARA.cerminCahaya = function (n) {
  const id = n.tekaId;
  if (tekaSelesai(id)) return openDialog(n.name, t("tk.sudah"), [{ label: t("dlg.tutup"), primary: true, run: closeDialog }]);
  const k = id + ":" + n.i;
  posisiCermin[k] = posisiCermin[k] ? 0 : 1;
  sfx.click(); spark(n.x, n.y - 24, "#fff4c8", 6);
};
TEKA_BICARA.sumberCahaya = function (n) {
  openDialog(n.name, Lx(["Pelita ini memancarkan sinar lurus. Periksa cermin-cermin untuk memutarnya (/ atau \\). Arahkan sinarnya ke kristal tujuan" + (((area.objek || []).some((o) => o.id === n.tekaId && o.kind === "kristalCahaya")) ? ", dan pastikan sinar melewati kristal kecil lebih dulu." : "."),
    "This lamp casts a straight beam. Examine the mirrors to turn them (/ or \\). Guide the beam to the goal crystal" + (((area.objek || []).some((o) => o.id === n.tekaId && o.kind === "kristalCahaya")) ? ", and make sure it passes through the small crystal first." : ".")]),
    [{ label: t("dlg.tutup"), primary: true, run: closeDialog }]);
};
TEKA_BICARA.targetCahaya = TEKA_BICARA.kristalCahaya = TEKA_BICARA.sumberCahaya;

UPDATE_TAMBAHAN.push(() => {
  for (const o of area.objek || []) {
    if (o.kind !== "sumberCahaya") continue;
    const s = hitungSinar(o.id); sinarCermin[o.id] = s;
    if (s && s.kena && !tekaSelesai(o.id)) {
      if (tekaBelumSaatnya(o.id)) { notifBelum("cermin:" + o.id, t("belum.benda") + " " + teksNanti(langkahTeka(o.id).l)); continue; }
      selesaiTeka(o.id);
    }
  }
});

// ---------- Gambar ----------
GAMBAR_TANAH.push(function (time) {
  for (const [id, s] of Object.entries(sinarCermin)) {
    if (!s || s.titik.length < 2) continue;
    const selesai = tekaSelesai(id);
    ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (const [lebar, warna] of [[9, selesai ? "rgba(255,230,140,0.25)" : "rgba(255,240,180,0.18)"], [3, selesai ? "#ffe066" : `rgba(255,244,200,${0.75 + 0.2 * Math.sin(time * 8)})`]]) {
      ctx.strokeStyle = warna; ctx.lineWidth = lebar; ctx.beginPath();
      s.titik.forEach(([x, y], i) => { const px = (x + 0.5) * T, py = (y + 0.5) * T; if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); });
      ctx.stroke();
    }
    ctx.restore();
  }
});
GAMBAR_OBJEK.cerminCahaya = function (n, time) {
  const x = n.x, y = n.y + T * 0.2, pos = posisiCermin[n.tekaId + ":" + n.i] || 0;
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 14, 5, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#5b3a24"; ctx.fillRect(x - 3, y - 10, 6, 10);
  ctx.save(); ctx.translate(x, y - 20); ctx.rotate(pos ? Math.PI / 4 : -Math.PI / 4);
  ctx.fillStyle = "#c9a24a"; ctx.fillRect(-17, -4, 34, 8);
  ctx.fillStyle = `rgba(220,240,255,${0.8 + 0.2 * Math.sin(time * 3 + n.i)})`; ctx.fillRect(-15, -2, 30, 4);
  ctx.restore();
  labelObjek(n, "#fff4c8", 40);
};
GAMBAR_OBJEK.sumberCahaya = function (n, time) {
  const x = n.x, y = n.y + T * 0.2;
  ctx.fillStyle = "#3a2618"; ctx.fillRect(x - 6, y - 26, 12, 26);
  const g = ctx.createRadialGradient(x, y - 32, 2, x, y - 32, 30); g.addColorStop(0, "rgba(255,230,140,0.9)"); g.addColorStop(1, "rgba(255,230,140,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y - 32, 30, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#fff4c8"; ctx.beginPath(); ctx.arc(x, y - 32, 7 + Math.sin(time * 10) * 1, 0, 6.28); ctx.fill();
  labelObjek(n, "#ffe066", 50);
};
GAMBAR_OBJEK.targetCahaya = function (n, time) {
  const x = n.x, y = n.y + T * 0.2, kena = tekaSelesai(n.tekaId) || (sinarCermin[n.tekaId] && sinarCermin[n.tekaId].sampai);
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 14, 5, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = kena ? "#ffe066" : "#8fd3ff"; ctx.beginPath(); ctx.moveTo(x, y - 40); ctx.lineTo(x + 12, y - 20); ctx.lineTo(x, y); ctx.lineTo(x - 12, y - 20); ctx.closePath(); ctx.fill();
  if (kena) { ctx.fillStyle = `rgba(255,240,180,${0.4 + 0.3 * Math.sin(time * 6)})`; ctx.beginPath(); ctx.arc(x, y - 20, 26, 0, 6.28); ctx.fill(); }
  labelObjek(n, "#8fd3ff", 50);
};
GAMBAR_OBJEK.kristalCahaya = function (n, time) {
  const x = n.x, y = n.y + T * 0.2, lewat = sinarCermin[n.tekaId] && sinarCermin[n.tekaId].kristal.has(Math.floor(n.x / T) + "," + Math.floor(n.y / T));
  ctx.fillStyle = lewat ? "#ffe066" : "#c9a6ff"; ctx.beginPath(); ctx.moveTo(x, y - 26); ctx.lineTo(x + 8, y - 13); ctx.lineTo(x, y); ctx.lineTo(x - 8, y - 13); ctx.closePath(); ctx.fill();
  labelObjek(n, "#c9a6ff", 34);
};
