// =====================================================================
// SPOT MEMANCING
// Papan pancing di tepi air untuk tiap spot di SPOT_MANCING (99ka-data-ikan.js).
//  - Muncul setelah event memancing terbuka (akhir Bab 2).
//  - Papan diletakkan otomatis di petak darat tepi air terdekat ke tengah area
//    (atau ke titik `dekat: [x, y]` kalau diisi di SPOT_MANCING).
//  - Spot dengan `kolam` (desa tanpa air: Kampung Awan, Perkemahan, Kampung Megalit,
//    Pondok Nini Embun) memakai kolam buatan / lubang es: pelampung dijatuhkan ke kolam.
//  - Spot dengan `npc` (Sungai Wanasari → Pak Udin) tidak memakai papan.
//  - Hanya spot di Dunia 1–6 yang dipasang (DUNIA_MANCING_MAKS di 99ka-data-ikan.js).
//  - Penanda di peta besar: 99kd-spot-peta.js.
// =====================================================================
"use strict";

function petakTepiAir(dekat) {
  let terbaik = null, jarak = 1e9;
  const [cx, cy] = dekat || [MW / 2, MH / 2];
  for (let y = 2; y < MH - 2; y++) for (let x = 2; x < MW - 2; x++) {
    if (SOLID.has(tileAt(x, y)) || tileAt(x, y) === BRIDGE) continue;
    if (![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => tileAt(x + dx, y + dy) === WATER)) continue;
    const d = Math.hypot(x - cx, y - cy); if (d < jarak) { jarak = d; terbaik = [x, y]; }
  }
  return terbaik;
}
// kolam / lubang es: petak lapang (3×3 bisa dilewati) terdekat ke tengah area
function petakLapang(dekat) {
  let terbaik = null, jarak = 1e9;
  const [cx, cy] = dekat || [MW / 2, MH / 2];
  for (let y = 3; y < MH - 3; y++) for (let x = 3; x < MW - 3; x++) {
    let lapang = true;
    for (let dy = -1; dy <= 1 && lapang; dy++) for (let dx = -1; dx <= 1; dx++) if (SOLID.has(tileAt(x + dx, y + dy))) { lapang = false; break; }
    if (!lapang || NPCS.some((n) => Math.hypot(n.x / T - x - 0.5, n.y / T - y - 0.5) < 2.5)) continue;
    const tp = area.teleport; if (tp && Math.hypot(tp.x - x - 0.5, tp.y - y - 0.5) < 3.5) continue;   // jauhi mesin teleport
    const d = Math.hypot(x - cx, y - cy); if (d < jarak) { jarak = d; terbaik = [x, y]; }
  }
  return terbaik;
}

// Spot yang berlaku: hanya di Dunia 1–6 (DUNIA_MANCING_MAKS)
const spotBerlaku = (sp) => AREAS[sp.area] && (AREAS[sp.area].dunia || 1) <= DUNIA_MANCING_MAKS;
// Petak papan / kolam untuk spot `sp` di area yang sedang dimuat (dipakai juga peta dunia, 99kd-spot-peta.js)
const petakSpot = (sp) => (sp.kolam ? petakLapang(sp.dekat) : petakTepiAir(sp.dekat));
// Jenis objek spot di NPCS (dipakai peta besar & pelampung)
const KIND_SPOT = ["spotMancing", "kolamMancing"];

SAAT_MASUK_AREA.push((id) => {
  if (!S || !eventTerbuka("mancing")) return;
  for (const [tempat, sp] of Object.entries(SPOT_MANCING)) {
    if (sp.area !== id || sp.npc || !spotBerlaku(sp)) continue;
    const p = petakSpot(sp); if (!p) continue;
    NPCS.push({ id: "spot_" + tempat, kind: sp.kolam ? "kolamMancing" : "spotMancing", gaya: sp.kolam, tempat, name: Lx(sp.nama),
      x: (p[0] + 0.5) * T, y: (p[1] + (sp.kolam ? 0.5 : 0.6)) * T, face: 0 });
  }
});

// ---------- Gambar ----------
GAMBAR_OBJEK.spotMancing = function (n, time) {
  const x = n.x, y = n.y;
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 16, 5, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#7a4a26"; ctx.fillRect(x - 2, y - 34, 4, 34);                       // tiang
  ctx.fillStyle = "#c9932f"; ctx.fillRect(x - 14, y - 36, 28, 12);                      // papan
  ctx.fillStyle = "#3f7a8c"; ctx.beginPath(); ctx.ellipse(x, y - 30, 6, 3, 0, 0, 6.28); ctx.fill();   // gambar ikan
  ctx.beginPath(); ctx.moveTo(x + 5, y - 30); ctx.lineTo(x + 9, y - 33); ctx.lineTo(x + 9, y - 27); ctx.fill();
  // joran bersandar di tiang
  ctx.strokeStyle = "#5a3a1e"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 4, y); ctx.lineTo(x + 16, y - 40); ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + 16, y - 40); ctx.quadraticCurveTo(x + 22, y - 20, x + 19, y - 8 + Math.sin(time * 2) * 2); ctx.stroke();
  labelObjek(n, "#8fd3ff", 44);
};

// Kolam buatan untuk desa tanpa air. Gaya: bibir kolam, air, riak, hiasan.
const GAYA_KOLAM = {
  es:     { bibir: "rgba(200,225,245,0.92)", air: "#1d4a6e", riak: "160,210,240", hias: "es" },
  awan:   { bibir: "rgba(245,248,255,0.95)", air: "#5f9fd8", riak: "230,245,255", hias: "awan" },
  batu:   { bibir: "#8f8270",                air: "#2f6a6a", riak: "170,220,210", hias: "batu" },
  cahaya: { bibir: "#6a5a7e",                air: "#2c4f6e", riak: "255,226,150", hias: "cahaya" },
};
GAMBAR_OBJEK.kolamMancing = function (n, time) {
  const x = n.x, y = n.y, g = GAYA_KOLAM[n.gaya] || GAYA_KOLAM.batu;
  ctx.fillStyle = g.bibir; ctx.beginPath(); ctx.ellipse(x, y, 24, 12, 0, 0, 6.28); ctx.fill();              // bibir kolam
  ctx.fillStyle = g.air; ctx.beginPath(); ctx.ellipse(x, y, 17, 8, 0, 0, 6.28); ctx.fill();                  // air
  ctx.strokeStyle = `rgba(${g.riak},${0.4 + 0.3 * Math.sin(time * 2)})`; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.ellipse(x, y, 8 + (time * 6) % 7, 3, 0, 0, 6.28); ctx.stroke();                         // riak
  if (g.hias === "es") {                       // pecahan es + ember
    ctx.fillStyle = "#eef7ff";
    for (const [dx, dy] of [[-26, -2], [24, 3], [-10, 11], [14, -10]]) ctx.fillRect(x + dx - 3, y + dy - 2, 6, 4);
    ctx.fillStyle = "#7a4a26"; ctx.fillRect(x + 28, y - 10, 10, 10); ctx.fillStyle = "#5a3a1e"; ctx.fillRect(x + 28, y - 12, 10, 3);
  } else if (g.hias === "awan") {              // gumpalan awan di tepi
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    for (const [dx, dy, r] of [[-24, 4, 7], [-18, -6, 6], [22, -3, 7], [27, 6, 5]]) { ctx.beginPath(); ctx.arc(x + dx, y + dy + Math.sin(time + dx) * 1.2, r, 0, 6.28); ctx.fill(); }
  } else if (g.hias === "batu") {              // batu tegak kecil (megalit)
    ctx.fillStyle = "#6e6354";
    for (const [dx, h] of [[-27, 18], [27, 14]]) { ctx.fillRect(x + dx - 4, y - h, 8, h + 2); ctx.fillStyle = "#857866"; ctx.fillRect(x + dx - 4, y - h, 3, h + 2); ctx.fillStyle = "#6e6354"; }
  } else if (g.hias === "cahaya") {            // lentera kecil di tepi
    for (const dx of [-27, 27]) {
      ctx.fillStyle = "#5a3a1e"; ctx.fillRect(x + dx - 1, y - 16, 2, 16);
      ctx.fillStyle = `rgba(255,214,120,${0.75 + 0.25 * Math.sin(time * 4 + dx)})`; ctx.beginPath(); ctx.arc(x + dx, y - 18, 3.5, 0, 6.28); ctx.fill();
    }
  }
  labelObjek(n, g.hias === "es" ? "#bfe6ff" : "#8fd3ff", 26);
};
TEKA_BICARA.spotMancing = (n) => menuMancing(n, n.tempat);
TEKA_BICARA.kolamMancing = (n) => menuMancing(n, n.tempat);

// Kolam / lubang es: pelampung jatuh ke kolam terdekat (bukan ke petak air)
{
  const titikAsli = titikPelampung;
  titikPelampung = function () {
    const l = NPCS.find((n) => n.kind === "kolamMancing" && Math.hypot(n.x - P.x, n.y - P.y) < 4 * T);
    if (l) return { x: l.x, y: l.y + 2 };
    return titikAsli();
  };
}
