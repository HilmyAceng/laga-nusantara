// =====================================================================
// MONSTER MENGUAT SESUAI LEVEL
//  - Level monster = level pemain, tapi tidak di bawah level aslinya dan tidak
//    lebih dari ATURAN.skalaMonster.batasAtas level di atasnya. Nyawa, serangan,
//    dan hadiahnya ikut naik. (Di area awal kamu tetap terasa kuat.)
//  - Selisih level: musuh yang levelnya di atasmu lebih sulit dilukai dan
//    pukulannya lebih sakit.
//  - Trik baru: monster dunia 2 ke atas, atau yang sudah menguat beberapa level,
//    ancang-ancangnya lebih cepat dan kadang memukul dua kali beruntun.
// Bos dari Cermin Gaib memakai kekuatan tingkatnya sendiri (34-tantangan-bos.js).
// =====================================================================
"use strict";

const SK = ATURAN.skalaMonster;
const makeMonsterAsli = makeMonster;
makeMonster = function (type, spot) {
  const m = makeMonsterAsli(type, spot);
  const d = MONSTERS[type];
  if (d.latihan || !S) return m;
  const ef = clamp(S.lv, d.lv, d.lv + SK.batasAtas), k = ef - d.lv;
  const nd = { ...d, lv: ef,
    hp: Math.round(d.hp * SK.kaliNyawa * (1 + SK.nyawaPerLv * k)),
    atk: Math.round(d.atk * SK.kaliSerang * (1 + SK.seranganPerLv * k)),
    exp: Math.round(d.exp * (1 + SK.hadiahPerLv * k)),
    gold: d.gold.map((g) => Math.round(g * (1 + SK.hadiahPerLv * k))) };
  if (!d.boss && !d.ai && (d.lv >= SK.trikLevel || k >= SK.trikSelisih)) {
    nd.wind = d.wind * 0.8; nd.speed = d.speed * 1.1; nd.serangGanda = SK.serangGanda; nd.ganas = true;
  }
  m.d = nd; m.hp = nd.hp;
  return m;
};

// selisih level (positif = musuh lebih tinggi dari pemain)
const selisihLv = (m) => (m && m.d ? clamp(m.d.lv - S.lv, 0, SK.selisihMaks) : 0);
const kaliKeMusuh = (m) => Math.max(0.5, 1 - SK.kurangiPerLv * selisihLv(m));   // damage pemain ke musuh
const kaliDariMusuh = (m) => 1 + SK.tambahPerLv * selisihLv(m);                  // damage musuh ke pemain

// Dipanggil dari updateMonster setelah serangan biasa selesai: kadang langsung memukul lagi
function selesaiSerang(m, toP) {
  if (m.d.serangGanda && !m.ganda && Math.random() < m.d.serangGanda) {
    m.ganda = true; m.state = "windup"; m.st = 0.28; m.ang = toP;
    return;
  }
  m.ganda = false;
  m.state = "recover"; m.st = 0.35; m.cd = m.d.cd;
}

// monster "ganas" (sudah belajar trik): mata menyala merah kecil di atas kepala
GAMBAR_ATAS.push(function (time) {
  for (const m of monsters) {
    if (m.dead || !m.d.ganas || m.d.boss) continue;
    const y = m.y - m.d.h - 26 + Math.sin(time * 4 + m.x) * 1.5;
    ctx.fillStyle = "rgba(255,70,70,0.85)"; ctx.beginPath(); ctx.moveTo(m.x - 4, y); ctx.lineTo(m.x, y - 6); ctx.lineTo(m.x + 4, y); ctx.lineTo(m.x, y + 3); ctx.closePath(); ctx.fill();
  }
});
