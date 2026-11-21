// =====================================================================
// CERMIN DI PETA & TELEPORT KE CERMIN
// Setiap Cermin Gaib yang sudah muncul (bosnya pernah dikalahkan) tampil di:
//   - peta mini   : titik ungu (17-peta-mini.js)
//   - peta area   : ikon cermin + nama bos, bisa diketuk (18-peta-besar.js)
//   - peta dunia  : ikon cermin di sarang bos, bisa diketuk (18-peta-besar.js)
// Ketuk ikonnya → "Pindah ke Cermin Gaib di ...?" → muncul tepat di depan cermin.
// Teleportnya memakai kotak tanya yang sama dengan Mesin Teleport (14-teleport.js).
// =====================================================================
"use strict";

// Cermin di area `id` sudah muncul? (aturannya sama dengan cerminAktif() di 13-cermin.js)
function cerminAktifDi(id) {
  const a = AREAS[id];
  if (!a || !a.bos || !S || !S.bos[a.bos.monster]) return false;
  return a.bos.monster === "genderuwo" ? S.q.idx >= QUESTS.length : true;
}
// Tujuan teleport ke cermin area `id`. Pemain muncul di (x, y + 1) → 2 petak di bawah cermin.
const tujuanCermin = (id) => ({ id: "cermin-" + id, areaId: id, x: AREAS[id].bos.x, y: AREAS[id].bos.y + 1, cermin: true });
// semua cermin yang sudah muncul di satu dunia
const cerminDunia = (dunia) => Object.keys(AREAS).filter((id) => AREAS[id].dunia === dunia && cerminAktifDi(id));

// ikon cermin oval ungu (dx, dy = titik di kanvas peta, u = ukuran 1 piksel layar)
function drawCerminIcon(c, dx, dy, u, time) {
  c.fillStyle = `rgba(201,166,255,${0.22 + 0.15 * Math.sin(time * 3.5)})`;
  c.beginPath(); c.arc(dx, dy, 13 * u, 0, 6.28); c.fill();
  c.fillStyle = "#3b2a5c"; c.strokeStyle = "#f4b942"; c.lineWidth = 2 * u;
  c.beginPath(); c.ellipse(dx, dy, 6 * u, 9 * u, 0, 0, 6.28); c.fill(); c.stroke();
  c.fillStyle = `rgba(201,166,255,${0.6 + 0.3 * Math.sin(time * 5)})`;
  c.beginPath(); c.ellipse(dx - 1.5 * u, dy - 2 * u, 2.2 * u, 4 * u, -0.3, 0, 6.28); c.fill();
}

// peta area (dipanggil dari loop warga di drawAreaMap)
function cerminDiPetaArea(c, x, y, time, label) {
  drawCerminIcon(c, x, y, DPR, time);
  label(t("cermin.peta", { bos: MONSTERS[area.bos.monster].name }), x, y - 16 * DPR, "#c9a6ff");
  mapHits.push({ x, y, r: 20 * DPR, tele: tujuanCermin(areaId) });
}

// peta dunia (dipanggil dari drawWorldMap, setelah ikon Mesin Teleport)
function cerminDiPetaDunia(c, X, Y, fs, time) {
  for (const id of cerminDunia(duniaPeta)) {
    const p = world.parts[id]; if (!p) continue;
    const b = AREAS[id].bos, x = X(p.x + b.x), y = Y(p.y + b.y);
    drawCerminIcon(c, x, y, DPR * fs, time);
    mapHits.push({ x, y, r: 20 * DPR, tele: tujuanCermin(id) });
  }
}
