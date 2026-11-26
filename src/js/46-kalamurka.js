// =====================================================================
// PRABU KALAMURKA (bos terakhir, Singgasana Bayang)
// Pola serangan berputar:
//   gelombang : cincin bayangan meledak di sekelilingnya (menjauh!)
//   tombak    : deretan tombak bayangan menancap ke arah pemain
//   sembur    : bola-bola bayangan menyebar (fase 2: juga melingkar)
//   kedip     : menghilang lalu muncul di belakang pemain dan menghantam
//   kembar    : memanggil 2 bayangan
// < 50% nyawa: marah (lebih cepat). < 20%: putus asa, serangan beruntun.
// =====================================================================
"use strict";

const POLA_KALA = ["sembur", "tombak", "kedip", "gelombang", "sembur", "kembar"];

AI_BOS.kalamurka = function (m, dt, dp, toP) {
  if (m.state !== "hilang" && bosUmum(m, dt, dp, toP)) return;
  const d = m.d;
  if (!m.fase3 && m.hp < d.hp * 0.2) { m.fase3 = true; shake = 0.8; sfx.growl(); toast(t("kala.putusAsa"), true); }
  const cepat = m.fase3 ? 1.5 : m.fase2 ? 1.25 : 1;
  m.cd -= dt;
  if (Math.random() < 0.4) parts.push({ x: m.x + rand(-30, 30), y: m.y, z: rand(10, 110), vz: rand(20, 60), vx: 0, vy: 0, life: 0.7, max: 0.7, color: Math.random() < 0.5 ? "#2b1a40" : "#b88cff", s: 6, float: true });

  if (m.state === "kejar") {
    kejar(m, dt, toP, 170, cepat);
    if (m.cd > 0) return;
    m.urut = ((m.urut ?? -1) + 1) % POLA_KALA.length;
    const s = POLA_KALA[m.urut];
    if (s === "tombak") {
      // garis tombak dari dirinya ke arah pemain (dan lebih jauh)
      const n = m.fase2 ? 9 : 7;
      for (let i = 1; i <= n; i++) tandaBahaya(m.x + Math.cos(toP) * i * 48, m.y + Math.sin(toP) * i * 48, 30, 0.6 + i * 0.07, d.atk * 0.8, "bayang");
      if (m.fase3) for (let i = 1; i <= n; i++) tandaBahaya(m.x + Math.cos(toP + 0.5) * i * 48, m.y + Math.sin(toP + 0.5) * i * 48, 30, 0.8 + i * 0.07, d.atk * 0.8, "bayang");
      sfx.growl(); m.cd = 1.6 / cepat; return;
    }
    if (s === "gelombang") { m.state = "ancang"; m.serang = "hantam"; m.st = 1; sfx.growl(); return; }
    if (s === "kembar") {
      panggilAnakBos(m, d.anak, 2, 100, "#b88cff");   // paling banyak 3 bayangan sekaligus
      sfx.summon(); m.cd = 1.2 / cepat; return;
    }
    if (s === "kedip") { m.state = "hilang"; m.st = 0.7; m.kebal = true; spark(m.x, m.y - 50, "#b88cff", 20); sfx.roll(); return; }
    m.state = "ancang"; m.serang = "sembur"; m.st = 0.6; m.ang = toP;
  } else if (m.state === "hilang") {
    m.st -= dt;
    if (m.st <= 0) {
      // muncul di belakang pemain
      const a = P.face + Math.PI, x = P.x + Math.cos(a) * 90, y = P.y + Math.sin(a) * 90;
      if (!solidAt(x, y)) { m.x = x; m.y = y; }
      m.kebal = false; spark(m.x, m.y - 50, "#b88cff", 20);
      m.state = "ancang"; m.serang = "hantam"; m.st = 0.55; sfx.growl();
    }
  } else if (m.state === "ancang") {
    m.st -= dt * cepat;
    if (m.serang === "sembur") m.ang = toP;
    if (m.st > 0) return;
    if (m.serang === "hantam") {
      shake = 0.6; sfx.slam(); effects.push({ kind: "ring", x: m.x, y: m.y, r: 150, t: 0, dur: 0.5, red: true });
      if (dp < 150 + P.r) hurtPlayer(d.atk * 1.3, toP);
    } else {
      const n = m.fase2 ? 9 : 6, lebar = 1.2;
      for (let i = 0; i < n; i++) tembak(m, m.ang - lebar / 2 + (lebar * i) / (n - 1), 270, d.atk * 0.6, 11);
      if (m.fase2) for (let i = 0; i < 12; i++) tembak(m, (i / 12) * 6.28, 190, d.atk * 0.5, 9);
      sfx.fire();
    }
    m.state = "kejar"; m.cd = d.cd / cepat;
  }
};
WARNA_BAHAYA.bayang = "#8a5ad0";

GAMBAR_MONSTER.kalamurka = function (m, time, w) {
  if (m.state === "hilang") return;
  const b = Math.sin(m.run * 0.4) * 3, marah = m.fase2;
  // aura
  const g = ctx.createRadialGradient(0, -60, 10, 0, -60, 90);
  g.addColorStop(0, marah ? "rgba(200,60,120,0.35)" : "rgba(120,60,200,0.35)"); g.addColorStop(1, "rgba(40,10,70,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -60, 90, 0, 6.28); ctx.fill();
  // jubah berkibar
  ctx.fillStyle = putih(w, "#140d22");
  ctx.beginPath(); ctx.moveTo(-18, -96 - b);
  ctx.quadraticCurveTo(-46, -50, -40 + Math.sin(time * 3) * 6, 0); ctx.lineTo(40 + Math.sin(time * 3 + 1) * 6, 0); ctx.quadraticCurveTo(46, -50, 18, -96 - b);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = putih(w, "#3a2050"); ctx.fillRect(-16, -96 - b, 32, 52);             // badan
  ctx.fillStyle = "#c9a24a"; ctx.fillRect(-16, -62 - b, 32, 5);                         // sabuk emas
  // kepala & mahkota
  ctx.fillStyle = putih(w, "#7a6a8a"); ctx.beginPath(); ctx.arc(0, -110 - b, 14, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#c9a24a"; ctx.beginPath(); ctx.moveTo(-15, -118 - b);
  for (let i = 0; i <= 6; i++) ctx.lineTo(-15 + i * 5, -118 - b - (i % 2 ? 14 : 6));
  ctx.lineTo(15, -118 - b); ctx.closePath(); ctx.fill();
  ctx.fillStyle = marah ? "#ff3b6b" : "#c9a6ff"; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 14;
  ctx.fillRect(-7, -113 - b, 5, 3); ctx.fillRect(3, -113 - b, 5, 3); ctx.shadowBlur = 0;
  // tongkat
  ctx.save(); ctx.translate(26, -70 - b); ctx.rotate(m.state === "ancang" ? -0.9 : -0.2);
  ctx.fillStyle = "#2b1a40"; ctx.fillRect(-2.5, -60, 5, 90);
  ctx.fillStyle = "#b88cff"; ctx.shadowColor = "#b88cff"; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(0, -66, 8 + Math.sin(time * 6) * 2, 0, 6.28); ctx.fill(); ctx.shadowBlur = 0;
  ctx.restore();
};
