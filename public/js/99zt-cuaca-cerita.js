// =====================================================================
// CUACA MENGIKUTI CERITA
// Cuaca tidak acak: hanya berubah sesuai langkah cerita yang sedang berjalan.
//  - CUACA_CERITA: dari [bab, ep] sampai [bab, ep] (termasuk), di area mana, cuaca apa.
//  - Jenis: "hujan" (deras, langit gelap, kilat lembut), "gerimis" (rintik tipis),
//           "salju" (butiran pelan), "badai" (badai salju: butiran kencang & kabut putih).
//  - Di luar daftar: area bersalju (area.salju / bagian atas area.saljuMulai) tetap
//    turun salju pelan; gua (area.gelap) tidak pernah kehujanan/kesaljuan.
// =====================================================================
"use strict";

const CUACA_CERITA = [
  // Bab 13 ep 10 "Gerimis Pertama": Sembrani bebas, hujan pertama setelah empat puluh hari
  { dari: [13, 10], sampai: [13, 10], area: ["sabana", "kampungBatu"], cuaca: "hujan" },
  // Bab 17 "Jalan ke Atap Dunia": badai di lereng sampai Pelita Salju dinyalakan
  { dari: [17, 1], sampai: [17, 6], area: ["lereng"], cuaca: "badai" },
  // Bab 18-19: badai menutup Puncak Salju Abadi sampai Macan Putih mengaum lagi (ep 9)
  { dari: [18, 1], sampai: [19, 9], area: ["puncak"], cuaca: "badai" },
];

// bab & ep langkah cerita sekarang → angka pembanding (bab 13 ep 10 = 1310)
function kodeLangkahCerita() {
  const l = langkahCerita(); if (!l) return -1;
  const m = /(\d+)/.exec(l.bab || ""); return m ? +m[1] * 100 + (l.ep || 0) : -1;
}
function cuacaKini() {
  if (!area || !P || mode === "select" || area.gelap) return null;
  const k = kodeLangkahCerita();
  for (const c of CUACA_CERITA)
    if (c.area.includes(areaId) && k >= c.dari[0] * 100 + c.dari[1] && k <= c.sampai[0] * 100 + c.sampai[1]) return c.cuaca;
  if (area.salju || (area.saljuMulai != null && P.y / T < area.saljuMulai)) return "salju";
  return null;
}

// ---------- Gambar ----------
let kilatCuaca = 0, kilatCuacaNanti = 6, waktuCuaca = 0;
GAMBAR_ATAS.push(function (time) {
  const c = cuacaKini(), dt = Math.min(0.1, Math.max(0, time - waktuCuaca)); waktuCuaca = time; if (!c) return;
  const ax = cam.x - W / 2, ay = cam.y - H / 2;
  if (c === "hujan" || c === "gerimis") {
    const deras = c === "hujan", n = deras ? 160 : 55;
    ctx.fillStyle = deras ? "rgba(30,40,70,0.28)" : "rgba(40,50,80,0.12)"; ctx.fillRect(ax, ay, W, H);   // langit mendung
    ctx.strokeStyle = deras ? "rgba(190,215,255,0.55)" : "rgba(200,220,255,0.4)"; ctx.lineWidth = deras ? 1.6 : 1.2;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const cepat = (deras ? 900 : 520) * (0.8 + (i % 4) * 0.1), pj = deras ? 22 : 12;
      const sx = ((i * 73.31 + time * cepat * 0.22) % (W + 60)) - 30, sy = ((i * 41.9 + time * cepat) % (H + 60)) - 30;
      ctx.moveTo(ax + sx, ay + sy); ctx.lineTo(ax + sx - pj * 0.25, ay + sy + pj);
    }
    ctx.stroke();
    // percikan di tanah
    ctx.strokeStyle = "rgba(210,230,255,0.45)"; ctx.lineWidth = 1;
    for (let i = 0; i < (deras ? 26 : 8); i++) {
      const fase = (time * 2.2 + i * 0.37) % 1, sx = (i * 131.7 + Math.floor(time * 2.2 + i * 0.37) * 211) % W, sy = (i * 89.3 + Math.floor(time * 2.2 + i * 0.37) * 157) % H;
      ctx.beginPath(); ctx.ellipse(ax + sx, ay + sy, 2 + fase * 7, 1 + fase * 2.5, 0, 0, 6.28); ctx.globalAlpha = 1 - fase; ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // kilat lembut sesekali (hujan deras saja)
    if (deras) {
      kilatCuacaNanti -= dt;
      if (kilatCuacaNanti <= 0) { kilatCuaca = 1; kilatCuacaNanti = 7 + Math.random() * 9; }
      if (kilatCuaca > 0) { ctx.fillStyle = `rgba(230,240,255,${0.22 * kilatCuaca})`; ctx.fillRect(ax, ay, W, H); kilatCuaca = Math.max(0, kilatCuaca - dt * 3.5); }
    }
    return;
  }
  // salju & badai salju
  const badai = c === "badai", n = badai ? 90 : 34;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  for (let i = 0; i < n; i++) {
    const sx = ((i * 97.13 + time * (badai ? 170 : 22) * (0.6 + (i % 5) * 0.15)) % (W + 40)) - 20;
    const sy = ((i * 53.7 + time * (badai ? 95 : 48) * (0.7 + (i % 3) * 0.2)) % (H + 40)) - 20;
    const goyang = badai ? 0 : Math.sin(time * 1.3 + i) * 8, r = badai ? 2.6 : 1.6 + (i % 3) * 0.5;
    ctx.fillRect(ax + sx + goyang, ay + sy, r, r);
  }
  if (badai) { ctx.fillStyle = "rgba(225,235,250,0.2)"; ctx.fillRect(ax, ay, W, H); }
});
