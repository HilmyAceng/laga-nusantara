// =====================================================================
// SPOT MEMANCING DI PETA BESAR
// Setelah event memancing terbuka (akhir Bab 2), tiap spot memancing (SPOT_MANCING,
// desa-desa di Dunia 1–6) ditandai ikon ikan biru:
//   - peta area  : ikon + nama spot di tepi air
//   - peta dunia : ikon di area yang sudah pernah didatangi
// Spot Pak Udin (npc) ditandai di samping Pak Udin.
// Posisi papan dihitung dengan petakSpot() (99kb-spot-mancing.js), jadi sama persis
// dengan papan di dunia. Dipanggil dari 18-peta-besar.js.
// =====================================================================
"use strict";

// posisi spot (dalam petak) per tempat, diisi saat peta dunia dibangun
const POS_SPOT = {};
function posisiSpot(tempat, sp) {
  if (sp.npc) { const d = NPC_DATA.find((n) => n.id === sp.npc); return d ? { x: d.x / T + 0.7, y: d.y / T - 0.5 } : null; }
  const p = petakSpot(sp); return p ? { x: p[0] + 0.5, y: p[1] + 0.6 } : null;
}
// dipanggil buildWorld() saat petak area `id` sedang terpasang
function catatSpotArea(id) {
  for (const [tempat, sp] of Object.entries(SPOT_MANCING)) if (sp.area === id && spotBerlaku(sp)) POS_SPOT[tempat] = posisiSpot(tempat, sp);
}

// ikon: lingkaran biru dengan ikan kecil (dx, dy = titik di kanvas peta, u = ukuran 1 piksel layar)
function drawSpotIcon(c, dx, dy, u, time) {
  c.fillStyle = `rgba(79,195,232,${0.2 + 0.12 * Math.sin(time * 3)})`;
  c.beginPath(); c.arc(dx, dy, 11 * u, 0, 6.28); c.fill();
  c.fillStyle = "#14394a"; c.strokeStyle = "#4fc3e8"; c.lineWidth = 1.6 * u;
  c.beginPath(); c.arc(dx, dy, 7.5 * u, 0, 6.28); c.fill(); c.stroke();
  c.fillStyle = "#bfeeff";
  c.beginPath(); c.ellipse(dx - 1 * u, dy, 3.6 * u, 2.2 * u, 0, 0, 6.28); c.fill();           // badan
  c.beginPath(); c.moveTo(dx + 2 * u, dy); c.lineTo(dx + 5 * u, dy - 2.6 * u); c.lineTo(dx + 5 * u, dy + 2.6 * u); c.fill();   // ekor
}

const spotAktif = () => S && eventTerbuka("mancing");

// peta area (dipanggil dari drawAreaMap)
function spotDiPetaArea(c, X, Y, time, label) {
  if (!spotAktif()) return;
  for (const n of NPCS) if (KIND_SPOT.includes(n.kind)) {
    drawSpotIcon(c, X(n.x), Y(n.y), DPR, time);
    label(n.name, X(n.x), Y(n.y) - 14 * DPR, "#8fe0ff");
  }
  // spot yang dilayani NPC (Pak Udin): ikon kecil di sampingnya, tanpa nama (nama NPC sudah ada)
  for (const sp of Object.values(SPOT_MANCING)) {
    if (!sp.npc || sp.area !== areaId) continue;
    const n = NPCS.find((m) => m.id === sp.npc); if (n) drawSpotIcon(c, X(n.x) + 14 * DPR, Y(n.y), DPR * 0.8, time);
  }
}

// peta dunia (dipanggil dari drawWorldMap, setelah ikon cermin)
function spotDiPetaDunia(c, X, Y, fs, time) {
  if (!spotAktif()) return;
  for (const [tempat, sp] of Object.entries(SPOT_MANCING)) {
    const p = world.parts[sp.area], pos = POS_SPOT[tempat];
    if (!p || !pos || !dikunjungi(sp.area)) continue;
    drawSpotIcon(c, X(p.x + pos.x), Y(p.y + pos.y), DPR * fs * 0.85, time);
  }
}
