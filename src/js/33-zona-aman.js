// =====================================================================
// ZONA AMAN
// Tempat beristirahat: seluruh area yang ditandai `aman` (desa, kota) dan
// lingkaran di sekitar setiap mesin teleport (ATURAN.zonaAman.radius).
// Di zona aman:
//   - monster tidak bisa masuk dan berhenti mengejar
//   - peluru & serangan area musuh tidak berbahaya
//   - semua debuff hilang, nyawa pulih pelan
// =====================================================================
"use strict";

let pAman = false;   // pemain sedang di zona aman?

const radiusAman = () => ATURAN.zonaAman.radius * T;
function diZonaAman(x, y) {
  if (!area) return false;
  if (area.aman) return true;
  for (const n of NPCS) if (n.kind === "teleport" && Math.hypot(n.x - x, n.y - y) < radiusAman()) return true;
  return false;
}

// Dipanggil tiap frame dari update()
function updateZonaAman(dt) {
  const tadi = pAman;
  pAman = !!P && !P.dead && diZonaAman(P.x, P.y);
  if (!pAman) return;
  if (!tadi && !area.aman) toast(t("aman.masuk"), false);
  if (adaDebuff()) sembuhkanDebuff("aman");
  const mh = maxHp();
  if (P.hp < mh) P.hp = Math.min(mh, P.hp + mh * ATURAN.zonaAman.pulihPerDetik * dt);
}
// Monster yang masuk lingkaran zona aman didorong keluar
function jagaZonaAman(m) {
  if (area.aman) return;
  for (const n of NPCS) {
    if (n.kind !== "teleport") continue;
    const d = Math.hypot(m.x - n.x, m.y - n.y), batas = radiusAman() + m.r;
    if (d < batas) {
      const a = d > 0.1 ? Math.atan2(m.y - n.y, m.x - n.x) : rand(0, 6.28);
      m.x = n.x + Math.cos(a) * batas; m.y = n.y + Math.sin(a) * batas;
      if (m.state === "chase" || m.state === "windup" || m.state === "charge") { m.state = "return"; }
    }
  }
}

// Lingkaran zona aman di tanah (di sekitar mesin teleport)
function drawZonaAman(time) {
  if (area.aman) return;
  for (const n of NPCS) {
    if (n.kind !== "teleport") continue;
    const r = radiusAman(), p = 0.5 + 0.5 * Math.sin(time * 2);
    ctx.save();
    ctx.fillStyle = "rgba(125,255,168,0.07)"; ctx.beginPath(); ctx.ellipse(n.x, n.y, r, r * 0.62, 0, 0, 6.28); ctx.fill();
    ctx.setLineDash([10, 8]); ctx.lineDashOffset = -time * 12;
    ctx.strokeStyle = `rgba(125,255,168,${0.35 + 0.25 * p})`; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.ellipse(n.x, n.y, r, r * 0.62, 0, 0, 6.28); ctx.stroke();
    ctx.restore();
  }
}

// ---------- Bendera penanda zona aman ----------
// Hanya dipasang di zona aman: melingkari mesin teleport, dan di kiri-kanan
// setiap pintu masuk area aman (desa, kota). Dihitung ulang saat pindah area.
let benderaAman = [];
function pasangBenderaAman() {
  benderaAman = [];
  if (!area) return;
  if (area.aman) {
    for (const g of area.gerbang) {
      const dx = g.x0 === 0 ? 1 : g.x1 === MW - 1 ? -1 : 0, dy = g.y0 === 0 ? 1 : g.y1 === MH - 1 ? -1 : 0;
      const ax = dx ? (dx > 0 ? 1.5 : MW - 1.5) : null, ay = dy ? (dy > 0 ? 1.8 : MH - 1.2) : null;
      if (dx) for (const y of [g.y0 - 0.3, g.y1 + 1.3]) benderaAman.push({ x: ax * T, y: y * T });
      else for (const x of [g.x0 - 0.4, g.x1 + 1.4]) benderaAman.push({ x: x * T, y: ay * T });
    }
    return;
  }
  for (const n of NPCS) if (n.kind === "teleport")
    for (let i = 0; i < 6; i++) { const a = (i / 6) * 6.28 + 0.5; benderaAman.push({ x: n.x + Math.cos(a) * radiusAman(), y: n.y + Math.sin(a) * radiusAman() * 0.62 }); }
}
function drawBenderaAman(b, time) {
  const x = b.x, y = b.y, top = y - 38;
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 6, 2.5, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#e8e2d0"; ctx.fillRect(x - 1.5, top, 3, y - top);
  ctx.beginPath(); ctx.moveTo(x + 1.5, top + 1);
  const g = Math.sin(time * 5 + x * 0.05) * 3;
  ctx.quadraticCurveTo(x + 10, top + 3 + g, x + 18, top + 7 + g); ctx.quadraticCurveTo(x + 10, top + 10 + g, x + 1.5, top + 14);
  ctx.closePath(); ctx.fillStyle = "#3ccf7a"; ctx.fill();
  ctx.fillStyle = "#f4b942"; ctx.beginPath(); ctx.arc(x, top - 1, 2.5, 0, 6.28); ctx.fill();
}

// Api unggun Perkemahan Cahaya (hiasan, tidak bisa diajak bicara)
GAMBAR_OBJEK.unggun = function (n, time) {
  const x = n.x, y = n.y;
  const g = ctx.createRadialGradient(x, y - 10, 4, x, y - 10, 120);
  g.addColorStop(0, "rgba(255,190,90,0.45)"); g.addColorStop(1, "rgba(255,190,90,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y - 10, 120, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#5b3a24"; ctx.save(); ctx.translate(x, y); for (const a of [-0.5, 0.5]) { ctx.save(); ctx.rotate(a); ctx.fillRect(-16, -3, 32, 6); ctx.restore(); } ctx.restore();
  for (const [c, s] of [["#ff7b39", 1], ["#ffd166", 0.6]]) { const f = Math.sin(time * 12) * 3; ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x - 12 * s, y - 2); ctx.quadraticCurveTo(x + f, y - 40 * s, x + 12 * s, y - 2); ctx.closePath(); ctx.fill(); }
};
