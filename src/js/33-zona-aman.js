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
