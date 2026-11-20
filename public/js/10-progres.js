// =====================================================================
// PROGRES
// EXP, naik level, misi, dan layar menang.
// =====================================================================
"use strict";

function gainExp(v) {
  S.exp += v;
  while (S.exp >= expNeed(S.lv)) {
    S.exp -= expNeed(S.lv); S.lv++;
    P.hp = maxHp();
    toast(`Naik level! Lv ${S.lv}`, true); sfx.level();
    for (let i = 0; i < 26; i++) { const a = rand(0, 6.28); parts.push({ x: P.x + Math.cos(a) * 20, y: P.y + Math.sin(a) * 10, z: 0, vz: rand(120, 300), vx: 0, vy: 0, life: 0.8, max: 0.8, color: "#ffd166" }); }
  }
  saveSoon();
}
function progressQuest(n) {
  const q = QUESTS[S.q.idx];
  S.q.prog = Math.min(q.need, S.q.prog + n);
  if (S.q.prog >= q.need) { S.q.status = "done"; toast(`Misi selesai: ${q.title}. Lapor ke Ki Lurah`, false); sfx.quest(); }
  saveSoon();
}
// Musik kemenangan (kalau musik dimatikan, cukup bunyi efek singkat)
function victory() { if (audioOn.musik && audioOn.volMusik > 0) playJingle("menang"); else sfx.win(); }
function saveSoon() { saveTimer = 0.6; }

function showWin() {
  mode = "win";
  $("winStats").textContent = `${CLASSES[S.cls].name} mencapai Lv ${S.lv} dan mengalahkan ${S.kills} makhluk. Warga Wanasari berterima kasih padamu.`;
  showUI(); save(); victory();
}
$("btnWin").addEventListener("click", () => { mode = "play"; showUI(); });
