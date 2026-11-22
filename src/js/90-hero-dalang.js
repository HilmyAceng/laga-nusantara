// =====================================================================
// HERO: DALANG (pemanggil) — memainkan wayang kulit yang hidup & bertarung untuknya
//  Serangan dasar : melempar wayang bayangan yang berputar.
//  Jurus          : Panggil Arjuna (pemanah), Panggil Bima (petarung), Kelir Bayang
//                   (layar bayangan: musuh lemah & lambat), Panggil Gatotkaca (menukik dari langit).
//  Pamungkas      : Bharatayuddha — ketiga ksatria dipanggil sekaligus & lebih kuat.
//  Hindar diam    : Lindungan Wayang — kuda-kuda; saat diserang, serangan ditahan
//                   & Arjuna muncul membalas.
// Sekutu tidak bisa diserang musuh; mereka hilang saat waktunya habis atau pindah area.
// =====================================================================
"use strict";

daftarkanHero("dalang", {
  kelas: {
    name: "Dalang", role: "Pemanggil", color: "#6b3a7a", accent: "#f4b942", weapon: "wayang", hat: "#2b1d3a",
    hp: 95, atk: 9, speed: 195,
    desc: "Memanggil wayang kulit yang bertarung untuknya: Arjuna, Bima, dan Gatotkaca. Kuat bila sekutunya banyak, rapuh bila sendirian.",
    attack: { type: "proj", proj: "wayang", speed: 520, range: 380, cd: 0.45 },
    skill: { name: "Panggil Arjuna", type: "panggil", cd: 9 },
  },
  jurus: [
    { id: "panggilArjuna", name: "Panggil Arjuna", type: "panggil", sekutu: "arjuna", buka: 1, cd: 9, mult: 0.75, lama: 9,
      desc: "Arjuna muncul di sisimu 9 detik, memanah musuh terdekat.", naik3: "Bertahan 13 detik.", naik5: "Panahnya membuat musuh berdarah.",
      en: { name: "Summon Arjuna", desc: "Arjuna appears beside you for 9s, shooting the nearest enemy.", naik3: "Lasts 13s.", naik5: "His arrows cause bleeding." } },
    { id: "panggilBima", name: "Panggil Bima", type: "panggil", sekutu: "bima", buka: 8, cd: 11, mult: 1.2, lama: 9,
      desc: "Bima menerjang musuh terdekat dan menghantam dengan kuku Pancanaka 9 detik.", naik3: "Bertahan 13 detik.", naik5: "Hantamannya melumpuhkan musuh biasa.",
      en: { name: "Summon Bima", desc: "Bima charges the nearest enemy and strikes with his Pancanaka claws for 9s.", naik3: "Lasts 13s.", naik5: "His strikes stun normal enemies." } },
    { id: "kelirBayang", name: "Kelir Bayang", type: "kelir", buka: 18, cd: 10, mult: 0.8, r: 170, lama: 5,
      desc: "Membentang layar bayangan: musuh di sekitar lemah & lambat 5 detik.", naik3: "Area lebih luas.", naik5: "Musuh di dalamnya menerima damage +25%.",
      en: { name: "Shadow Screen", desc: "Spread a shadow screen: nearby enemies are weakened & slowed for 5s.", naik3: "Wider area.", naik5: "Enemies inside take +25% damage." } },
    { id: "panggilGatot", name: "Panggil Gatotkaca", type: "panggil", sekutu: "gatot", buka: 30, cd: 14, mult: 1.6, lama: 10,
      desc: "Gatotkaca terbang dan menukik ke musuh berulang kali selama 10 detik.", naik3: "Bertahan 14 detik.", naik5: "Tukikannya lebih luas & melumpuhkan.",
      en: { name: "Summon Gatotkaca", desc: "Gatotkaca flies and dives at enemies repeatedly for 10s.", naik3: "Lasts 14s.", naik5: "Wider dives that stun." } },
  ],
  pamungkas: { name: "Bharatayuddha", type: "bharata", mult: 1.5, dur: 0.6, desc: "Arjuna, Bima, dan Gatotkaca turun bersamaan 12 detik dengan kekuatan berlipat.",
    en: { name: "Bharatayuddha", desc: "Arjuna, Bima, and Gatotkaca descend together for 12s with doubled power." } },
  suara: { f: 150, vk: VOKAL.o },
  en: { name: "Puppeteer", role: "Summoner", skill: "Summon Arjuna",
    desc: "Summons living shadow puppets to fight: Arjuna, Bima, and Gatotkaca. Strong with many allies, fragile alone." },
});

// ---------- Sekutu wayang ----------
let sekutu = [];
const DATA_SEKUTU = {
  arjuna: { warna: "#d9a441", warna2: "#7a4b2a", jarak: 380, jeda: 0.85 },
  bima:   { warna: "#3d6b8f", warna2: "#c9a24a", jarak: 320, jeda: 1.0, cepat: 190 },
  gatot:  { warna: "#b03a2e", warna2: "#f4b942", jarak: 400, jeda: 1.5 },
};
function panggilSekutu(jenis, lama, dmg, opsi = {}) {
  const ada = sekutu.find((s) => s.jenis === jenis);
  const a = rand(0, 6.28), s = ada || { jenis, x: P.x + Math.cos(a) * 50, y: P.y + Math.sin(a) * 30, t: 0, cd: 0.4, sudut: a };
  s.sisa = Math.max(s.sisa || 0, lama); s.dmg = dmg; s.kuat = opsi.kuat || 1; s.naik5 = !!opsi.naik5; s.muncul = 0.4;
  if (!ada) sekutu.push(s);
  spark(s.x, s.y - 30, DATA_SEKUTU[jenis].warna, 16); sfx.summon ? sfx.summon() : sfx.charge();
  return s;
}
SAAT_MASUK_AREA.push(() => { sekutu = []; });

function detakSekutu(s, dt) {
  const D = DATA_SEKUTU[s.jenis];
  s.t += dt; s.sisa -= dt; s.cd -= dt; s.muncul = Math.max(0, s.muncul - dt);
  const m = musuhDekat(D.jarak, s)[0] || musuhDekat(D.jarak)[0];
  const dmg = s.dmg * s.kuat;
  if (s.jenis === "arjuna") {
    // melayang di samping pemain, memanah
    s.sudut += dt * 0.8; const tx = P.x + Math.cos(s.sudut) * 55, ty = P.y - 6 + Math.sin(s.sudut) * 24;
    s.x += (tx - s.x) * Math.min(1, dt * 6); s.y += (ty - s.y) * Math.min(1, dt * 6);
    if (m && s.cd <= 0) {
      s.cd = D.jeda; const ang = Math.atan2(m.y - s.y, m.x - s.x);
      projs.push({ kind: "arrow", x: s.x, y: s.y, vx: Math.cos(ang) * 620, vy: Math.sin(ang) * 620, life: D.jarak / 620, dmg, splash: 0, sekutu: true });
      if (s.naik5) beriDotMonster(m, "berdarah");
      sfx.arrow();
    }
  } else if (s.jenis === "bima") {
    // berjalan ke musuh & menghantam
    if (m) {
      const d = dist(s, m);
      if (d > m.r + 30) { const a = Math.atan2(m.y - s.y, m.x - s.x); const nx = s.x + Math.cos(a) * D.cepat * dt, ny = s.y + Math.sin(a) * D.cepat * dt; if (!solidAt(nx, ny)) { s.x = nx; s.y = ny; } s.arah = Math.cos(a) < 0 ? -1 : 1; }
      else if (s.cd <= 0) {
        s.cd = D.jeda; s.pukul = 0.2;
        for (const x of musuhDekat(70, s)) { damageMonster(x, dmg, Math.atan2(x.y - s.y, x.x - s.x), 260, { tanpaTenaga: true }); if (s.naik5 && !x.d.boss) lumpuhkanMonster(x, 0.6); }
        spark(m.x, m.y - 20, "#c9a24a", 10); sfx.heavy();
      }
    } else { const tx = P.x - 50, ty = P.y + 10; if (dist(s, { x: tx, y: ty }) > 30) { const a = Math.atan2(ty - s.y, tx - s.x); s.x += Math.cos(a) * D.cepat * dt; s.y += Math.sin(a) * D.cepat * dt; } }
    if (s.pukul > 0) s.pukul -= dt;
  } else if (s.jenis === "gatot") {
    // terbang berputar di atas pemain, lalu menukik ke musuh
    if (s.tukik) {
      s.tukik.t += dt; const k = Math.min(1, s.tukik.t / 0.35);
      s.x = lerp(s.tukik.x0, s.tukik.x1, k); s.y = lerp(s.tukik.y0, s.tukik.y1, k); s.tinggi = 60 * (1 - k);
      if (k >= 1) {
        const r = s.naik5 ? 110 : 80;
        for (const x of monsters) if (!x.dead && Math.hypot(x.x - s.x, x.y - s.y) < r + x.r) { damageMonster(x, dmg, Math.atan2(x.y - s.y, x.x - s.x), 200, { tanpaTenaga: true }); if (s.naik5) lumpuhkanMonster(x, x.d.boss ? 0.3 : 0.8); }
        effects.push({ kind: "ring", x: s.x, y: s.y, r, t: 0, dur: 0.3 }); shake = Math.max(shake, 0.2); sfx.slam ? sfx.slam() : sfx.heavy();
        s.tukik = null;
      }
    } else {
      s.sudut += dt * 1.6; s.tinggi = 60;
      const tx = P.x + Math.cos(s.sudut) * 80, ty = P.y - 10 + Math.sin(s.sudut) * 40;
      s.x += (tx - s.x) * Math.min(1, dt * 4); s.y += (ty - s.y) * Math.min(1, dt * 4);
      if (m && s.cd <= 0) { s.cd = D.jeda; s.tukik = { t: 0, x0: s.x, y0: s.y, x1: m.x, y1: m.y }; }
    }
  }
}
UPDATE_TAMBAHAN.push((dt) => {
  if (!P) return;
  for (const s of sekutu) detakSekutu(s, dt);
  sekutu = sekutu.filter((s) => s.sisa > 0);
});

// ---------- Jurus ----------
jurusKhusus("panggil", (j, r, dmg) => {
  const lama = (r >= 3 ? j.lama + 4 : j.lama) * (P.bharata ? 1 : 1);
  panggilSekutu(j.sekutu, lama, dmg, { naik5: r >= 5 });
  P.swing = P.swingDur = 0.25;
});
let kelirFx = [];
jurusKhusus("kelir", (j, r, dmg) => {
  const rr = j.r * (r >= 3 ? 1.3 : 1);
  for (const m of musuhDekat(rr)) { lemahkanMonster(m, j.lama); lambatkanMonster(m, j.lama); if (r >= 5) m.rentan = Math.max(m.rentan || 0, j.lama); damageMonster(m, dmg, Math.atan2(m.y - P.y, m.x - P.x), 60, { tanpaTenaga: true }); }
  kelirFx.push({ x: P.x, y: P.y, r: rr, t: 0, dur: j.lama });
  sfx.summon ? sfx.summon() : sfx.charge();
});
UPDATE_TAMBAHAN.push((dt) => { for (const k of kelirFx) k.t += dt; kelirFx = kelirFx.filter((k) => k.t < k.dur); });

// ---------- Pamungkas ----------
PAMUNGKAS_KHUSUS.bharata = {
  mulai(U, dmg) {
    for (const j of ["arjuna", "bima", "gatot"]) panggilSekutu(j, 12, dmg * 0.6, { kuat: 2, naik5: true });
    effects.push({ kind: "ring", x: P.x, y: P.y, r: 220, t: 0, dur: 0.5 }); sfx.charge();
  },
};

// ---------- Hindar diam: Lindungan Wayang ----------
{
  const cekLama = cekHindarTangkis;
  cekHindarTangkis = function (amount, ang, opts) {
    if (!(P && P.tangkis > 0 && P.jenisDiam === "wayang" && !opts.mutlak && !P.dead)) return cekLama(amount, ang, opts);
    const dari = opts.dari || musuhAktif;
    P.tangkis = 0; P.jenisDiam = null; P.rollCd = 0;
    numbers.push({ x: P.x, y: P.y - 80, v: t("hd.wayang"), life: 1, color: "#f4b942", size: 24 });
    freeze = Math.max(freeze, 0.06); sfx.crit();
    tambahTenaga(ATURAN.tenaga.tangkis, true);
    if (dari && !dari.dead && dist(dari, P) < 320) { if (!(typeof pecahkanKudaKuda === "function" && pecahkanKudaKuda(dari))) lumpuhkanMonster(dari, dari.d.boss ? 0.3 : 0.9); }
    panggilSekutu("arjuna", 4, atkPower() * 0.75);
    latihanAksi("tangkis");
    return true;
  };
}

// ---------- Gambar ----------
// wayang kulit: siluet pipih menyamping, berukir, ditopang gapit (tongkat)
function gambarWayang(x, y, jenis, skala, arah, alpha, time, aksi) {
  const D = DATA_SEKUTU[jenis];
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.scale(arah * skala, skala);
  ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.beginPath(); ctx.ellipse(0, 0, 14, 4, 0, 0, 6.28); ctx.fill();
  const goyang = Math.sin(time * 4 + x) * 2;
  ctx.translate(0, -4 + goyang);
  ctx.strokeStyle = "#8b5e3c"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 4); ctx.lineTo(0, -60); ctx.stroke();   // gapit
  ctx.fillStyle = D.warna;
  // badan & kain
  ctx.beginPath(); ctx.moveTo(-6, -40); ctx.lineTo(7, -40); ctx.lineTo(10, -14); ctx.lineTo(14, 0); ctx.lineTo(-12, 0); ctx.lineTo(-8, -14); ctx.closePath(); ctx.fill();
  // kepala menyamping (hidung panjang khas wayang) + mahkota
  ctx.beginPath(); ctx.moveTo(-4, -42); ctx.lineTo(6, -46); ctx.lineTo(13, -50); ctx.lineTo(6, -53); ctx.lineTo(0, -60); ctx.lineTo(-6, -54); ctx.closePath(); ctx.fill();
  ctx.fillStyle = D.warna2; ctx.beginPath(); ctx.moveTo(-6, -54); ctx.lineTo(0, -66); ctx.lineTo(4, -58); ctx.lineTo(0, -54); ctx.closePath(); ctx.fill();
  // lengan panjang (bergerak saat menyerang)
  const ay = aksi ? -8 : 0;
  ctx.strokeStyle = D.warna; ctx.lineWidth = 3; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(5, -36); ctx.lineTo(18, -24 + ay); ctx.lineTo(24, -36 + ay); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-4, -36); ctx.lineTo(-12, -20); ctx.lineTo(-10, -8); ctx.stroke();
  // ukiran emas
  ctx.fillStyle = "#f4e3a1"; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(0, -34 + i * 8, 1.4, 0, 6.28); ctx.fill(); }
  if (jenis === "arjuna") { ctx.strokeStyle = "#7a4b2a"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(26, -34 + ay, 9, -1.3, 1.3); ctx.stroke(); }
  if (jenis === "bima") { ctx.fillStyle = "#f4e3a1"; ctx.beginPath(); ctx.moveTo(24, -36 + ay); ctx.lineTo(30, -40 + ay); ctx.lineTo(26, -32 + ay); ctx.fill(); }
  if (jenis === "gatot") { ctx.fillStyle = "rgba(244,185,66,0.6)"; ctx.beginPath(); ctx.moveTo(-4, -36); ctx.quadraticCurveTo(-28, -50 + Math.sin(time * 14) * 6, -30, -28); ctx.closePath(); ctx.fill(); }
  ctx.restore();
}
BENDA_TINGGI.push((time) => sekutu.map((s) => ({ y: s.y, f: () => {
  const alpha = Math.min(1, s.sisa * 1.5) * (1 - s.muncul * 1.5);
  const m = s.jenis === "bima" ? s.arah || 1 : (musuhDekat(400, s)[0] ? (musuhDekat(400, s)[0].x < s.x ? -1 : 1) : 1);
  gambarWayang(s.x, s.y - (s.tinggi || 0), s.jenis, s.jenis === "bima" ? 1.25 : 1, m, Math.max(0.15, alpha), time, s.pukul > 0 || (s.tukik && true));
} })));
GAMBAR_TANAH.push(function (time) {
  for (const k of kelirFx) {
    const a = Math.min(1, (k.dur - k.t) * 2) * 0.35;
    ctx.fillStyle = `rgba(40,20,60,${a})`; ctx.beginPath(); ctx.ellipse(k.x, k.y, k.r, k.r * 0.55, 0, 0, 6.28); ctx.fill();
    ctx.strokeStyle = `rgba(244,185,66,${a * 1.5})`; ctx.lineWidth = 2; ctx.setLineDash([8, 6]); ctx.lineDashOffset = -time * 20; ctx.stroke(); ctx.setLineDash([]);
  }
});
// peluru: wayang kecil berputar
GAMBAR_PELURU.wayang = function (p, time) {
  ctx.save(); ctx.translate(p.x, p.y - 18); ctx.rotate(time * 14);
  ctx.fillStyle = "rgba(244,185,66,0.3)"; ctx.beginPath(); ctx.arc(0, 0, 12, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#3a2a1a"; ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(6, 0); ctx.lineTo(0, 9); ctx.lineTo(-6, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#f4b942"; ctx.beginPath(); ctx.arc(0, 0, 2.2, 0, 6.28); ctx.fill();
  ctx.restore();
};
