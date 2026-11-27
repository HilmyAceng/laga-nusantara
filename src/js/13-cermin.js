// =====================================================================
// CERMIN GAIB
// Cermin oval melayang di sarang bos. Muncul setelah bos itu pernah dikalahkan
// (Genderuwo: setelah semua misi Ki Lurah selesai). Disentuh → pilih tingkat
// kesulitan (34-tantangan-bos.js) → efek pemanggilan (cahaya, kabut, kilat)
// → bos muncul untuk dilawan lagi. Hadiah & jeda ada di ATURAN.cermin (config.js).
// =====================================================================
"use strict";

// Jeda cermin disimpan sebagai jam selesai (S.cerminSampai[bos], milidetik) supaya
// tidak ter-reset walau game ditutup lalu dibuka lagi.
const sisaJeda = (jenis = area && area.bos ? area.bos.monster : "") => (S && S.cerminSampai ? Math.max(0, ((S.cerminSampai[jenis] || 0) - Date.now()) / 1000) : 0);
let summon = null;         // pemanggilan yang sedang berjalan
let kilat = 0;             // kilatan putih satu layar (0..1)
const SUMMON_MUNCUL = 1.3; // detik dari mulai pemanggilan sampai bos muncul

// Area ini punya cermin? (area dengan bos, dan bos itu pernah kalah)
function cerminAktif() {
  if (!area.bos || !S || !S.bos[area.bos.monster]) return false;
  // Genderuwo: setelah misi Ki Lurah selesai. Bos cerita: langsung setelah dikalahkan.
  return area.bos.monster === "genderuwo" ? S.q.idx >= QUESTS.length : true;
}
// Cermin dipasang di titik bos.
function makeCermin() {
  return { id: "cermin", kind: "cermin", name: t("cermin.nama"), x: area.bos.x * T, y: area.bos.y * T, face: 0 };
}
const bosCermin = () => area.bos.monster || "genderuwo";
const bosHidup = () => monsters.some((m) => m.d.boss && !m.dead);

function talkCermin(npc) {
  const nama = MONSTERS[bosCermin()].name;
  if (sisaJeda() > 0) {
    return openDialog(npc.name, t("cermin.redup", { detik: Math.ceil(sisaJeda()) }), [{ label: t("dlg.tutup"), run: closeDialog, primary: true }]);
  }
  if (bosHidup()) return;
  bukaTantangan(npc);   // pilih tingkat kesulitan (34-tantangan-bos.js)
}

// Bos muncul di sisi cermin yang menjauhi pemain (supaya tidak muncul di atas pemain).
function startSummon(npc, tingkat = 1) {
  const a = Math.atan2(npc.y - P.y, npc.x - P.x);
  let x = npc.x + Math.cos(a) * 1.6 * T, y = npc.y + Math.sin(a) * 1.6 * T;
  if (solidAt(x, y)) { x = npc.x; y = npc.y + 0.6 * T; }
  summon = { t: 0, x, y, done: false, tingkat };
  effects.push({ kind: "summon", x: summon.x, y: summon.y, t: 0, dur: SUMMON_MUNCUL + 0.6 });
  sfx.summon();
}

// Dipanggil tiap frame dari update()
function updateCermin(dt) {
  if (kilat > 0) kilat = Math.max(0, kilat - dt * 2.5);
  if (!summon) return;
  summon.t += dt;
  const s = summon;
  // kabut ungu berputar naik dari tanah
  for (let i = 0; i < 3; i++) {
    const a = rand(0, 6.28), r = rand(20, 90);
    parts.push({ x: s.x + Math.cos(a) * r, y: s.y + Math.sin(a) * r * 0.5, z: rand(0, 10), vz: rand(20, 60), vx: -Math.sin(a) * 40, vy: Math.cos(a) * 20,
      life: 1.1, max: 1.1, color: Math.random() < 0.5 ? "#8a6bd0" : "#4e3878", s: rand(10, 22), float: true });
  }
  // kilat kecil menyambar sebelum bos muncul
  if (s.t > 0.45 && !s.k1) { s.k1 = true; petir(s.x + rand(-60, 60), s.y + rand(-20, 20), 0.35); }
  if (s.t > 0.85 && !s.k2) { s.k2 = true; petir(s.x + rand(-60, 60), s.y + rand(-20, 20), 0.35); }
  if (s.t >= SUMMON_MUNCUL && !s.done) {
    s.done = true;
    monsters = monsters.filter((m) => !(m.d.boss && m.dead));     // buang bos lama yang sudah kalah
    const b = makeMonster(bosCermin(), { x: s.x, y: s.y });
    b.ulang = true;       // tanda bos tantangan ulang: hadiahnya beda (lihat killMonster)
    b.tingkat = s.tingkat; b.d = statTingkat(b.type, s.tingkat); b.hp = b.d.hp;   // diperkuat sesuai tingkat
    monsters.push(b);
    petir(s.x, s.y, 1); kilat = 1; shake = 0.8;
    P.inv = Math.max(P.inv, 1);   // pemain kebal sebentar saat bos muncul
    effects.push({ kind: "ring", x: s.x, y: s.y, r: 170, t: 0, dur: 0.6 });
    spark(s.x, s.y - 40, "#d9c8ff", 30);
    sfx.thunder(); sfx.growl();
    toast(t("toast.bosMuncul", { nama: b.d.name }), true);
  }
  if (s.t >= SUMMON_MUNCUL + 0.6) summon = null;
}
// sambaran petir: garis zig-zag dari langit ke titik (x, y)
function petir(x, y, kuat) {
  const pts = [];
  let px = x + rand(-30, 30);
  for (let h = 420; h > 0; h -= rand(30, 55)) { pts.push([px, y - h]); px += rand(-22, 22); }
  pts.push([x, y]);
  effects.push({ kind: "petir", pts, t: 0, dur: 0.18 + 0.12 * kuat, kuat });
  if (kuat < 1) sfx.zap();
}

// Bos tantangan dikalahkan: hadiah sesuai tingkat, tingkat berikutnya terbuka,
// lalu cermin redup selama ATURAN.cermin.jeda
function bosUlangKalah(m) {
  m.dead = true; sfx.die();
  spark(m.x, m.y - m.d.h * 0.5, "#d9c8ff", 24);
  const n = m.tingkat || 1, h = hadiahTingkat(m.type, n), baru = n > tingkatMenang(m.type);
  S.cermin[m.type] = Math.max(tingkatMenang(m.type), n);
  S.gold += h.gold;
  S.cerminSampai = S.cerminSampai || {};
  S.cerminSampai[m.type] = Date.now() + ATURAN.cermin.jeda * 1000;
  shake = 0.6;
  toast(t("toast.bosUlang", { nama: m.d.name, hadiah: teksHadiah(h) }), true);
  if (baru && n < ATURAN.cermin.tingkat) setTimeout(() => toast(t("tantang.terbuka", { n: n + 1 }), false), 900);
  gainExp(h.exp);
  dropCermin(m, n);                       // jimat legenda & langka (53-drop-langka.js)
  victory(); saveSoon();
}

// ---------- Gambar ----------
function drawCermin(n, time) {
  const jeda = sisaJeda(), siap = jeda <= 0 && !summon && !bosHidup();
  const bob = Math.sin(time * 2) * 5, cy = n.y - 46 + bob;
  ctx.save();
  if (bosHidup()) ctx.globalAlpha = 0.3;   // saat bos sedang bertarung, cermin memudar supaya bos terlihat
  // bayangan di tanah (mengecil saat cermin naik)
  ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.beginPath(); ctx.ellipse(n.x, n.y, 16 - bob * 0.6, 5, 0, 0, 6.28); ctx.fill();
  // cahaya di sekitar cermin
  const glow = siap ? 0.35 + 0.15 * Math.sin(time * 3) : 0.12;
  const g = ctx.createRadialGradient(n.x, cy, 10, n.x, cy, 70);
  g.addColorStop(0, `rgba(170,130,255,${glow})`); g.addColorStop(1, "rgba(170,130,255,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(n.x, cy, 70, 0, 6.28); ctx.fill();
  // kaca
  const glass = ctx.createLinearGradient(n.x - 18, cy - 30, n.x + 18, cy + 30);
  if (siap) { glass.addColorStop(0, "#c9d6ff"); glass.addColorStop(0.5, "#5b4a9c"); glass.addColorStop(1, "#1d1436"); }
  else { glass.addColorStop(0, "#6e6a7a"); glass.addColorStop(1, "#2a2733"); }
  ctx.fillStyle = glass; ctx.beginPath(); ctx.ellipse(n.x, cy, 17, 27, 0, 0, 6.28); ctx.fill();
  // kilau yang menyapu kaca
  if (siap) {
    ctx.save(); ctx.beginPath(); ctx.ellipse(n.x, cy, 17, 27, 0, 0, 6.28); ctx.clip();
    const sx = n.x - 30 + ((time * 30) % 80);
    ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.beginPath(); ctx.moveTo(sx, cy - 30); ctx.lineTo(sx + 8, cy - 30); ctx.lineTo(sx - 4, cy + 30); ctx.lineTo(sx - 12, cy + 30); ctx.fill();
    ctx.restore();
  }
  // bingkai emas berukir
  ctx.strokeStyle = "#c9a24a"; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(n.x, cy, 19, 29, 0, 0, 6.28); ctx.stroke();
  ctx.strokeStyle = "#f4d58a"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(n.x, cy, 21.5, 31.5, 0, 0, 6.28); ctx.stroke();
  ctx.fillStyle = "#f4b942";
  for (const [dx, dy] of [[0, -33], [0, 33], [-22, 0], [22, 0]]) { ctx.beginPath(); ctx.arc(n.x + dx, cy + dy, 3, 0, 6.28); ctx.fill(); }
  // nama & keterangan
  ctx.font = "800 11px Nunito, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#c9b6ff";
  ctx.fillText(n.name, n.x, cy - 42);
  if (jeda > 0) { ctx.font = "700 16px Teko, sans-serif"; ctx.fillStyle = "#c9bfd6"; ctx.fillText(t("cermin.detik", { detik: Math.ceil(jeda) }), n.x, cy - 56); }
  // tanda "[E] Bicara / Periksa" di bawah benda terdekat: 99zs-tanda-interaksi.js
  ctx.restore();
}
// efek pemanggilan & petir (dipanggil dari render)
function drawSummonGround(e, time) {
  const k = e.t / e.dur, grow = Math.min(1, e.t / 0.5), fade = 1 - Math.max(0, k - 0.75) / 0.25;
  ctx.save(); ctx.globalAlpha = fade;
  ctx.fillStyle = "rgba(120,70,220,0.35)"; ctx.beginPath(); ctx.ellipse(e.x, e.y, 90 * grow, 50 * grow, 0, 0, 6.28); ctx.fill();
  ctx.strokeStyle = "rgba(210,190,255,0.85)"; ctx.lineWidth = 3;
  for (let i = 0; i < 3; i++) { const a = time * (2 + i) + i * 2; ctx.beginPath(); ctx.ellipse(e.x, e.y, (40 + i * 22) * grow, (22 + i * 12) * grow, 0, a, a + 2.2); ctx.stroke(); }
  ctx.restore();
}
function drawSummonAir(e) {
  const k = e.t / e.dur, h = 320 * Math.min(1, e.t / 0.8), w = 26 + 16 * Math.sin(Math.min(1, k) * Math.PI);
  const g = ctx.createLinearGradient(0, e.y - h, 0, e.y);
  g.addColorStop(0, "rgba(220,200,255,0)"); g.addColorStop(0.6, "rgba(200,170,255,0.55)"); g.addColorStop(1, "rgba(255,255,255,0.85)");
  ctx.globalAlpha = 1 - Math.max(0, k - 0.7) / 0.3; ctx.fillStyle = g;
  ctx.fillRect(e.x - w / 2, e.y - h, w, h); ctx.globalAlpha = 1;
}
function drawPetir(e) {
  const a = 1 - e.t / e.dur;
  ctx.save(); ctx.lineJoin = "round"; ctx.lineCap = "round";
  ctx.shadowColor = "#b9a3ff"; ctx.shadowBlur = 18;
  ctx.strokeStyle = `rgba(190,170,255,${0.6 * a})`; ctx.lineWidth = 9 * e.kuat + 3;
  ctx.beginPath(); e.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
  ctx.shadowBlur = 0; ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.lineWidth = 3 * e.kuat + 1.5;
  ctx.beginPath(); e.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
  ctx.restore();
}
