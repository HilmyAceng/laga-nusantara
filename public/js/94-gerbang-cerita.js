// =====================================================================
// GERBANG MENGIKUTI CERITA
// Pemain baru tidak bisa keluar ke area yang belum dibutuhkan cerita utama.
// Area yang boleh dimasuki:
//   - Desa Wanasari & semua area yang pernah dikunjungi (save lama tidak terkunci)
//   - area tujuan setiap langkah cerita sampai langkah yang sedang berjalan, misi Ki Lurah
//     yang sudah/sedang dikerjakan, & misi sampingan yang sedang diambil — beserta area
//     yang dilewati untuk sampai ke sana
//   - semua area setelah cerita tamat
// Gerbang ke area lain dipalang (garis merah) & memberi tahu "lanjutkan cerita dulu".
// =====================================================================
"use strict";

// area tujuan sebuah langkah cerita (sama seperti ceritaTarget di 23-cerita.js)
function areaLangkah(l) {
  if (!l) return null;
  if (l.tipe === "bicara") { const n = npcById(l.npc); return n && n.area; }
  if (l.tipe === "datang") return l.area;
  const tp = l.tipe === "collect" ? tempatMonster(l.dari || SUMBER_BARANG[l.item]) : l.tipe === "kill" ? tempatMonster(l.target) : null;
  if (tp) return tp.area;
  if (l.tipe === "teka") for (const [id, a] of Object.entries(AREAS)) for (const o of a.objek || []) if (o.id === l.id) return id;
  if (l.tipe === "bos") for (const [id, a] of Object.entries(AREAS)) if (a.bos && a.bos.monster === l.monster) return id;
  return null;
}

let areaBoleh = null, areaBolehKunci = "";
const gerbangAsli = gerbangTerbuka;
// jalur lewat gerbang yang terbuka secara asli (tanpa aturan cerita)
function jalurAsli(dari, ke) {
  if (dari === ke) return [dari];
  const prev = { [dari]: null }, antre = [dari];
  while (antre.length) {
    const a = antre.shift();
    for (const g of AREAS[a].gerbang) {
      if (g.ke in prev || !gerbangAsli(g)) continue;
      prev[g.ke] = a;
      if (g.ke === ke) { const j = [ke]; let x = a; while (x) { j.unshift(x); x = prev[x]; } return j; }
      antre.push(g.ke);
    }
  }
  return null;
}
function hitungAreaBoleh() {
  const kunci = S ? `${S.cerita.idx}|${S.q.idx}${S.q.status}|${JSON.stringify(S.side || {}).length}|${Object.keys(S.dikunjungi || {}).length}|${Object.keys(S.buka || {}).length}|${Object.keys(S.bos || {}).length}` : "";
  if (areaBoleh && kunci === areaBolehKunci) return areaBoleh;
  areaBolehKunci = kunci;
  const boleh = new Set(["desa", ...Object.keys((S && S.dikunjungi) || {})]);
  const tambah = (a) => { if (a && AREAS[a]) for (const x of jalurAsli("desa", a) || [a]) boleh.add(x); };
  // misi biasa (Ki Lurah / sampingan): tempat monster atau barangnya
  const areaMisi = (q) => { const tp = q.type === "kill" ? tempatMonster(q.target) : q.type === "collect" ? tempatMonster([].concat(q.dari || SUMBER_BARANG[q.item])[0]) : null; return tp && tp.area; };
  if (S) {
    for (let i = 0; i <= Math.min(S.cerita.idx, CERITA.length - 1); i++) tambah(areaLangkah(CERITA[i]));
    // misi Ki Lurah yang sudah/sedang dikerjakan (Genderuwo di gua, dst.)
    for (let i = 0; i < Math.min(QUESTS.length, S.q.idx + (S.q.status === "none" ? 0 : 1)); i++) tambah(areaMisi(QUESTS[i]));
    // misi sampingan yang sedang diambil
    for (const q of SAMPINGAN) { const st = S.side && S.side[q.id]; if (st && (st.status === "active" || st.status === "done")) tambah(areaMisi(q)); }
  }
  return (areaBoleh = boleh);
}
const areaTerbukaCerita = (id) => !S || ceritaTamat() || hitungAreaBoleh().has(id);

// gerbang terbuka = kunci aslinya terbuka DAN area tujuannya sudah dibutuhkan cerita
gerbangTerbuka = function (g) { return gerbangAsli(g) && areaTerbukaCerita(g.ke); };
const dipalangCerita = (g) => gerbangAsli(g) && !areaTerbukaCerita(g.ke);

// pemberitahuan saat mendekati gerbang yang dipalang
UPDATE_TAMBAHAN.push(() => {
  if (!P || P.dead || !area) return;
  const tx = P.x / T, ty = P.y / T;
  for (const g of area.gerbang) {
    if (!dipalangCerita(g)) continue;
    const dx = Math.max(g.x0 - tx, 0, tx - (g.x1 + 1)), dy = Math.max(g.y0 - ty, 0, ty - (g.y1 + 1));
    if (Math.hypot(dx, dy) < 1.6) notifBelum("cerita:" + g.ke, `${g.label}: ${t("belum.gerbangCerita")}`);
  }
});
// palang merah-putih di mulut gerbang yang belum boleh dilewati
GAMBAR_TANAH.push(function (time) {
  if (!area || !S) return;
  for (const g of area.gerbang) {
    if (!dipalangCerita(g)) continue;
    const x0 = g.x0 * T, x1 = (g.x1 + 1) * T, y0 = g.y0 * T, y1 = (g.y1 + 1) * T, datar = g.x1 - g.x0 >= g.y1 - g.y0;
    ctx.save();
    ctx.lineWidth = 6; ctx.setLineDash([12, 10]); ctx.lineDashOffset = -time * 10;
    ctx.strokeStyle = "rgba(229,72,77,0.9)"; ctx.beginPath();
    if (datar) { const y = (y0 + y1) / 2; ctx.moveTo(x0, y); ctx.lineTo(x1, y); } else { const x = (x0 + x1) / 2; ctx.moveTo(x, y0); ctx.lineTo(x, y1); }
    ctx.stroke(); ctx.lineDashOffset = -time * 10 + 12; ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.stroke();
    ctx.restore();
  }
});
