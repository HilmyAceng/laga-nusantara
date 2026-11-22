// =====================================================================
// HERO: TABIB (pendukung) — ahli jamu & jampi: bertahan lama, melemahkan musuh
//  Serangan dasar : bola ramuan; tiap kena memulihkan sedikit nyawa.
//  Jurus          : Ramuan Sembuh (pulih + debuff hilang), Jimat Penghalang (lingkaran:
//                   musuh lambat & terluka, kau lebih tahan), Kutukan (musuh rentan & beracun),
//                   Tebar Kembang (aura: pulih terus & musuh sekitar terluka).
//  Pamungkas      : Ruwatan — pulih penuh, kebal 4 detik, gelombang suci melukai musuh.
//  Hindar diam    : Sembur Jamu — kuda-kuda; saat diserang, serangan ditahan & nyawa pulih.
// =====================================================================
"use strict";

daftarkanHero("tabib", {
  kelas: {
    name: "Tabib", role: "Pendukung", color: "#4e8f5a", accent: "#e9d3a9", weapon: "labu", hair: "#e8e2d0",
    hp: 110, atk: 8, speed: 195,
    desc: "Ahli jamu & jampi. Serangannya memulihkan nyawa, jurusnya menyembuhkan dan melemahkan musuh. Paling awet di pertarungan panjang.",
    attack: { type: "proj", proj: "ramuan", speed: 480, range: 360, cd: 0.42 },
    skill: { name: "Ramuan Sembuh", type: "sembuh", cd: 9 },
  },
  jurus: [
    { id: "ramuanSembuh", name: "Ramuan Sembuh", type: "sembuh", buka: 1, cd: 9, pulih: 0.25,
      desc: "Memulihkan 25% nyawa maksimal & menghapus semua debuff.", naik3: "Pulih 35%.", naik5: "Kebal 1,5 detik setelah minum.",
      en: { name: "Healing Brew", desc: "Restore 25% max health & clear all debuffs.", naik3: "Restore 35%.", naik5: "Invulnerable for 1.5s after drinking." } },
    { id: "jimatPenghalang", name: "Jimat Penghalang", type: "penghalang", buka: 8, cd: 12, mult: 0.35, r: 130, lama: 6,
      desc: "Menanam lingkaran jimat 6 detik: musuh di dalamnya lambat & terluka terus, kau menerima damage -30% di dalamnya.", naik3: "Lingkaran lebih luas.", naik5: "Musuh di dalamnya juga lemah.",
      en: { name: "Warding Talisman", desc: "Plant a talisman circle for 6s: enemies inside are slowed & keep taking damage; you take -30% damage inside.", naik3: "Wider circle.", naik5: "Enemies inside are also weakened." } },
    { id: "kutukan", name: "Kutukan", type: "kutuk", buka: 18, cd: 9, mult: 1.2, r: 120, lama: 6,
      desc: "Mengutuk musuh di sekitar: menerima damage +30% & keracunan 6 detik.", naik3: "Area lebih luas.", naik5: "Kutukan menular saat musuh dikalahkan.",
      en: { name: "Curse", desc: "Curse nearby enemies: they take +30% damage & are poisoned for 6s.", naik3: "Wider area.", naik5: "The curse spreads when a cursed enemy dies." } },
    { id: "tebarKembang", name: "Tebar Kembang", type: "aura", buka: 30, cd: 14, mult: 0.55, r: 140, lama: 6,
      desc: "Kelopak bunga berputar 6 detik: pulih 2% nyawa tiap 0,5 detik & musuh sekitar terluka.", naik3: "Bertahan 8 detik.", naik5: "Pulih 3% & musuh sekitar melambat.",
      en: { name: "Petal Storm", desc: "Petals swirl for 6s: heal 2% health every 0.5s & nearby enemies take damage.", naik3: "Lasts 8s.", naik5: "Heal 3% & nearby enemies are slowed." } },
  ],
  pamungkas: { name: "Ruwatan", type: "ruwatan", mult: 3, dur: 0.8, desc: "Upacara suci: nyawa pulih penuh, kebal 4 detik, gelombang cahaya melukai semua musuh di sekitar.",
    en: { name: "Ruwatan Rite", desc: "A sacred rite: full heal, invulnerable for 4s, and a wave of light hurts every enemy around." } },
  suara: { f: 190, vk: VOKAL.e },
  en: { name: "Healer", role: "Support", skill: "Healing Brew",
    desc: "Master of jamu & charms. Attacks restore health; skills heal and weaken enemies. The most durable in long fights." },
});

const pulihkan = (bagian, warna = "#5ad17a") => {
  if (!P || P.dead) return 0;
  const h = Math.round(maxHp() * bagian); if (h <= 0) return 0;
  P.hp = Math.min(maxHp(), P.hp + h);
  numbers.push({ x: P.x + rand(-8, 8), y: P.y - 60, v: "+" + h, life: 0.8, color: warna, size: 18 });
  return h;
};

// serangan dasar memulihkan sedikit nyawa (paling sering 3× per detik)
let ramuanT = 0;
{
  const damageAsli = damageMonster;
  damageMonster = function (m, amount, ang, kb, opts = {}) {
    const hidup = !m.dead, hasil = damageAsli(m, amount, ang, kb, opts);
    if (hidup && opts.proj === "ramuan" && ramuanT <= 0) { ramuanT = 0.33; pulihkan(0.012); }
    // kutukan menular (rank 5) saat musuh terkutuk mati
    if (hidup && m.dead && m.kutukMenular) for (const x of musuhDekat(140, m)) { x.rentan = Math.max(x.rentan || 0, 4); beriDotMonster(x, "racun"); }
    return hasil;
  };
}

// ---------- Jurus ----------
jurusKhusus("sembuh", (j, r) => {
  pulihkan(r >= 3 ? 0.35 : j.pulih);
  if (typeof adaDebuff === "function" && adaDebuff()) P.debuff = {};
  if (r >= 5) P.inv = Math.max(P.inv, 1.5);
  for (let i = 0; i < 14; i++) parts.push({ x: P.x + rand(-16, 16), y: P.y, z: rand(0, 20), vz: rand(50, 110), vx: 0, vy: 0, life: 0.8, max: 0.8, color: "#7dffa8", s: 4, float: true });
  sfx.drink();
});
let penghalang = [];
jurusKhusus("penghalang", (j, r, dmg) => {
  penghalang.push({ x: P.x, y: P.y, r: j.r * (r >= 3 ? 1.35 : 1), t: 0, dur: j.lama, tick: 0, dmg, lemah: r >= 5 });
  sfx.summon ? sfx.summon() : sfx.charge();
});
jurusKhusus("kutuk", (j, r, dmg) => {
  const rr = j.r * (r >= 3 ? 1.35 : 1);
  for (const m of musuhDekat(rr)) {
    m.rentan = Math.max(m.rentan || 0, j.lama); beriDotMonster(m, "racun", j.lama);
    if (r >= 5) m.kutukMenular = true;
    damageMonster(m, dmg, Math.atan2(m.y - P.y, m.x - P.x), 40, { tanpaTenaga: true });
    spark(m.x, m.y - 30, "#9b59d0", 8);
  }
  effects.push({ kind: "ring", x: P.x, y: P.y, r: rr, t: 0, dur: 0.35 }); sfx.growl();
});
jurusKhusus("aura", (j, r, dmg) => {
  P.aura = { t: 0, dur: r >= 3 ? 8 : j.lama, tick: 0, r: j.r, dmg, pulih: r >= 5 ? 0.03 : 0.02, lambat: r >= 5 };
  sfx.charge();
});
UPDATE_TAMBAHAN.push((dt) => {
  ramuanT = Math.max(0, ramuanT - dt);
  for (const w of penghalang) {
    w.t += dt; w.tick -= dt;
    if (w.tick <= 0) { w.tick = 0.5; for (const m of monsters) if (!m.dead && Math.hypot(m.x - w.x, m.y - w.y) < w.r + m.r) { lambatkanMonster(m, 0.6); if (w.lemah) lemahkanMonster(m, 0.6); damageMonster(m, w.dmg, 0, 0, { dot: "penghalang", tanpaTenaga: true }); } }
  }
  penghalang = penghalang.filter((w) => w.t < w.dur);
  if (P && P.aura) {
    const A = P.aura; A.t += dt; A.tick -= dt;
    if (A.tick <= 0) { A.tick = 0.5; pulihkan(A.pulih); for (const m of musuhDekat(A.r)) { damageMonster(m, A.dmg, 0, 0, { dot: "aura", tanpaTenaga: true }); if (A.lambat) lambatkanMonster(m, 0.6); } }
    if (A.t >= A.dur) P.aura = null;
  }
});
SAAT_MASUK_AREA.push(() => { penghalang = []; });
// di dalam lingkaran penghalang: damage diterima -30%
{
  const bonusAsli = bonusStat;
  bonusStat = function (k) {
    let n = bonusAsli(k);
    if (k === "tahan" && P && penghalang.some((w) => Math.hypot(P.x - w.x, P.y - w.y) < w.r)) n += 0.3;
    return n;
  };
}

// ---------- Pamungkas ----------
PAMUNGKAS_KHUSUS.ruwatan = {
  mulai(U, dmg) {
    P.hp = maxHp(); if (typeof adaDebuff === "function" && adaDebuff()) P.debuff = {};
    P.inv = Math.max(P.inv, 4);
    for (const m of musuhDekat(300)) damageMonster(m, dmg, Math.atan2(m.y - P.y, m.x - P.x), 300, { tanpaTenaga: true });
    effects.push({ kind: "ring", x: P.x, y: P.y, r: 300, t: 0, dur: 0.6 });
    numbers.push({ x: P.x, y: P.y - 70, v: t("tabib.ruwatan"), life: 1.2, color: "#fff3b0", size: 24 });
    sfx.level();
  },
};

// ---------- Hindar diam: Sembur Jamu ----------
{
  const cekLama = cekHindarTangkis;
  cekHindarTangkis = function (amount, ang, opts) {
    if (!(P && P.tangkis > 0 && P.jenisDiam === "sembur" && !opts.mutlak && !P.dead)) return cekLama(amount, ang, opts);
    const dari = opts.dari || musuhAktif;
    P.tangkis = 0; P.jenisDiam = null; P.rollCd = 0;
    numbers.push({ x: P.x, y: P.y - 80, v: t("hd.sembur"), life: 1, color: "#7dffa8", size: 24 });
    freeze = Math.max(freeze, 0.06); sfx.drink();
    tambahTenaga(ATURAN.tenaga.tangkis, true);
    pulihkan(0.1);
    if (dari && !dari.dead && dist(dari, P) < 320) {
      if (!(typeof pecahkanKudaKuda === "function" && pecahkanKudaKuda(dari))) lumpuhkanMonster(dari, dari.d.boss ? 0.3 : 0.9);
      damageMonster(dari, atkPower() * 0.8, Math.atan2(dari.y - P.y, dari.x - P.x), 300, { tanpaTenaga: true });
    }
    latihanAksi("tangkis");
    return true;
  };
}

// ---------- Gambar ----------
GAMBAR_TANAH.push(function (time) {
  for (const w of penghalang) {
    const a = Math.min(1, (w.dur - w.t) * 2);
    ctx.strokeStyle = `rgba(244,185,66,${0.7 * a})`; ctx.lineWidth = 2; ctx.setLineDash([10, 6]); ctx.lineDashOffset = -time * 25;
    ctx.beginPath(); ctx.ellipse(w.x, w.y, w.r, w.r * 0.55, 0, 0, 6.28); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = `rgba(90,209,122,${0.12 * a})`; ctx.fill();
    for (let i = 0; i < 4; i++) { const s = time * 1.2 + i * 1.57, x = w.x + Math.cos(s) * w.r * 0.85, y = w.y + Math.sin(s) * w.r * 0.47; ctx.fillStyle = `rgba(244,227,161,${a})`; ctx.fillRect(x - 3, y - 12, 6, 10); }
  }
  if (P && P.aura) {
    const A = P.aura;
    for (let i = 0; i < 10; i++) { const s = time * 2.4 + i * 0.628, x = P.x + Math.cos(s) * A.r * 0.8, y = P.y - 10 + Math.sin(s) * A.r * 0.4; ctx.fillStyle = i % 2 ? "#ff8fb6" : "#ffe08a"; ctx.beginPath(); ctx.ellipse(x, y, 4, 2.5, s, 0, 6.28); ctx.fill(); }
  }
});
GAMBAR_PELURU.ramuan = function (p, time) {
  ctx.fillStyle = "rgba(125,255,168,0.28)"; ctx.beginPath(); ctx.arc(p.x, p.y - 18, 12, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#5ad17a"; ctx.beginPath(); ctx.arc(p.x, p.y - 18, 6, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#e9ffe0"; ctx.beginPath(); ctx.arc(p.x - 2, p.y - 20, 2, 0, 6.28); ctx.fill();
  if (Math.random() < 0.3) parts.push({ x: p.x, y: p.y - 18, z: 0, vz: 0, vx: rand(-20, 20), vy: rand(-20, 20), life: 0.3, max: 0.3, color: "#7dffa8", s: 3 });
};
