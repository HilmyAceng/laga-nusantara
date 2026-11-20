// =====================================================================
// PINDAH AREA
// Memuat area, layar gelap saat pindah (fade), dan cek gerbang.
// =====================================================================
"use strict";

// Masuk ke area: bangun petanya, isi NPC & monster, bersihkan efek lama.
function loadArea(id) {
  buildArea(id);
  NPCS = id === "desa" ? NPC_DESA : [];
  summon = null;
  if (cerminAktif()) NPCS = [...NPCS, makeCermin()];   // cermin gaib (12-cermin.js)
  for (const tp of TELEPORTS) if (tp.areaId === id) NPCS = [...NPCS, makeTeleport(tp)];   // mesin teleport (13-teleport.js)
  projs = []; effects = []; parts = []; numbers = []; pickups = []; nearNpc = null;
  if (S) spawnMonsters();
  buildMiniBase();
  $("areaName").textContent = area.nama;
}

// Pindah area dengan layar gelap: fade-out → ganti peta → nama area → fade-in.
const FADE_MS = 450, HOLD_MS = 750;
function goArea(id, spot, after) {
  if (mode !== "play") return;
  mode = "transit"; showUI();
  const fade = $("fade");
  $("fadeName").textContent = AREAS[id].nama; $("fadeSub").textContent = AREAS[id].sub;
  fade.classList.add("on"); sfx.door();
  setTimeout(() => {
    loadArea(id);
    if (spot) { P.x = spot.x * T; P.y = spot.y * T; P.roll = 0; P.dash = 0; P.kbx = P.kby = 0; }
    if (after) after();
    cam.x = P.x; cam.y = P.y - 20;
    setTimeout(() => {
      fade.classList.remove("on");
      mode = "play"; showUI(); refreshHud(true); save();
    }, HOLD_MS);
  }, FADE_MS);
}
function checkGates() {
  const tx = Math.floor(P.x / T), ty = Math.floor(P.y / T);
  for (const g of area.gerbang) if (inZone(g, tx, ty)) { goArea(g.ke, g.masuk); return; }
}
