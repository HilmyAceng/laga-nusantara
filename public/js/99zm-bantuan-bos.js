// =====================================================================
// NPC CERITA IKUT BERTARUNG MELAWAN BOS
// Langkah cerita `bos` boleh punya `bantuan: "<id NPC>"` (cerita/bab-13.js dst.).
// Selama bos itu bertarung di arenanya, NPC tersebut muncul di sisimu: mengikuti dari dekat,
// melempar serangan ke musuh terdekat tiap ~1,6 detik (35% kekuatanmu), dan sesekali
// berseru (`serukan` di langkah itu). Hilang lagi setelah bos kalah atau kau pergi.
// =====================================================================
"use strict";

let bantuanBos = null;   // { ent, l, jeda, seruT, i }
let lontaran = [];       // { x, y, tx, ty, m, t, dur, amount, warna }
const WARNA_BANTUAN = { lewa: "#e9c46a", saka: "#9fffb0", sekar: "#ff9fbf", tenggo: "#c9a26b" };

function bosCeritaAktif() {
  const l = langkahCerita();
  if (!l || l.tipe !== "bos" || !l.bantuan) return null;
  const bos = monsters.find((m) => m.type === l.monster && !m.dead && m.aggro);
  return bos ? { l, bos } : null;
}
UPDATE_TAMBAHAN.push((dt) => {
  const aktif = P && !P.dead ? bosCeritaAktif() : null;
  if (!aktif) { if (bantuanBos) { NPCS = NPCS.filter((n) => n !== bantuanBos.ent); bantuanBos = null; } return; }
  if (!bantuanBos || bantuanBos.l !== aktif.l || !NPCS.includes(bantuanBos.ent)) {
    const a = npcById(aktif.l.bantuan);
    const ent = { id: "bantu-" + aktif.l.bantuan, aktor: true, bantuan: true, name: a.name, x: P.x - 50, y: P.y + 10, face: 0, color: a.color, accent: a.accent, hat: a.hat, hair: a.hair };
    NPCS.push(ent); spark(ent.x, ent.y - 20, "#ffe066", 14);
    bantuanBos = { ent, l: aktif.l, jeda: 1.2, seruT: 3, i: 0 };
    toast(Lx([`${a.name} ikut bertarung bersamamu!`, `${a.name} fights at your side!`]), true);
  }
  const b = bantuanBos, n = b.ent;
  // mengikuti pemain dari samping, menjaga jarak dari bos
  const sudut = Math.atan2(aktif.bos.y - P.y, aktif.bos.x - P.x) + Math.PI * 0.75;
  const tx = P.x + Math.cos(sudut) * 70, ty = P.y + Math.sin(sudut) * 70, d = Math.hypot(tx - n.x, ty - n.y);
  if (d > 12) { const v = Math.min(d, 210 * dt); const nx = n.x + (tx - n.x) / d * v, ny = n.y + (ty - n.y) / d * v; if (!solidAt(nx, ny)) { n.x = nx; n.y = ny; } n.moving = true; n.run = (n.run || 0) + dt * 12; }
  else n.moving = false;
  if (d > 6 * T) { n.x = P.x - 40; n.y = P.y; }
  // serangan
  b.jeda -= dt;
  if (b.jeda <= 0) {
    b.jeda = 1.6;
    let sasaran = null, dekat = 320;
    for (const m of monsters) { if (m.dead) continue; const j = Math.hypot(m.x - n.x, m.y - n.y); if (j < dekat) { dekat = j; sasaran = m; } }
    if (sasaran) {
      n.face = Math.atan2(sasaran.y - n.y, sasaran.x - n.x);
      lontaran.push({ x: n.x, y: n.y - 30, m: sasaran, t: 0, dur: 0.28, amount: atkPower() * 0.35, warna: WARNA_BANTUAN[b.l.bantuan] || "#ffe066" });
    }
  }
  // seruan
  b.seruT -= dt;
  if (b.seruT <= 0 && b.l.serukan && b.l.serukan.length) {
    b.seruT = rand(8, 12);
    const [who, teks] = b.l.serukan[b.i++ % b.l.serukan.length];
    const ent = who === b.l.bantuan ? n : NPCS.find((x) => x.id === who) || n;
    sapaan = sapaan.filter((s) => s.n !== ent); sapaan.push({ n: ent, teks: Array.isArray(teks) ? Lx(teks) : teks, t: 0 });
  }
});
UPDATE_TAMBAHAN.push((dt) => {
  for (const L of lontaran) {
    L.t += dt;
    if (L.t >= L.dur && !L.kena) { L.kena = true; if (!L.m.dead) { damageMonster(L.m, L.amount, Math.atan2(L.m.y - L.y, L.m.x - L.x), 40, { tanpaTenaga: true }); spark(L.m.x, L.m.y - 24, L.warna, 8); } }
  }
  lontaran = lontaran.filter((L) => L.t < L.dur + 0.05);
});
GAMBAR_ATAS.push(function () {
  for (const L of lontaran) {
    const k = Math.min(1, L.t / L.dur), x = L.x + (L.m.x - L.x) * k, y = L.y + (L.m.y - 24 - L.y) * k;
    ctx.strokeStyle = L.warna; ctx.lineWidth = 3; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(x - (L.m.x - L.x) * 0.08, y - (L.m.y - L.y) * 0.08); ctx.lineTo(x, y); ctx.stroke();
  }
});
SAAT_MASUK_AREA.push(() => { bantuanBos = null; lontaran = []; });
// NPC bantuan tidak diajak bicara panjang: cukup satu seruan
{
  const asli = talk;
  talk = function (npc, lewat) {
    if (npc && npc.bantuan) { sapaan = sapaan.filter((s) => s.n !== npc); sapaan.push({ n: npc, teks: Lx(["Fokus! Bosnya masih berdiri!", "Focus! The boss is still standing!"]), t: 0 }); return; }
    return asli(npc, lewat);
  };
}
