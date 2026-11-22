// =====================================================================
// HERO: JAWARA (pembunuh senyap) — kerambit, gerak cepat, serangan dari bayangan
//  Serangan dasar : tiga sabetan kerambit sangat cepat. Pasif: peluang kritis +12%.
//  Jurus          : Tusukan Bayang (muncul di belakang musuh, tusukan pasti kritis),
//                   Asap Hilang (menghilang: musuh biasa kehilangan jejakmu, pukulan
//                   berikutnya kritis ×2), Kerambit Berantai (berputar menyabet sekeliling),
//                   Racun Kerambit (8 detik: tiap pukulan meracuni & membuat berdarah).
//  Pamungkas      : Bayang Seribu — waktu seolah berhenti, semua musuh dekat disabet berkali-kali.
//  Hindar diam    : Lebur Bayang (87-hindar-diam.js) — muncul di belakang musuh terdekat,
//                   pukulan berikutnya pasti kritis.
// Jawara termasuk hero jarak dekat: 3 lapis hindar (ATURAN.melee.kelas).
// =====================================================================
"use strict";

daftarkanHero("jawara", {
  kelas: {
    name: "Jawara", role: "Pembunuh senyap", color: "#2b2633", accent: "#b03a2e", weapon: "kerambit", hair: "#1f1a24",
    hp: 100, atk: 11, speed: 215,
    desc: "Kerambit tercepat di desa. Gerak lincah, peluang kritis +12%, muncul dari bayangan untuk menusuk dari belakang. Rapuh bila terkepung.",
    attack: { type: "melee", range: 56, arc: 1.25, cd: 0.22, combo: [1, 1.1, 1.9] },
    skill: { name: "Tusukan Bayang", type: "tusuk", cd: 6 },
  },
  jurus: [
    { id: "tusukanBayang", name: "Tusukan Bayang", type: "tusuk", buka: 1, cd: 6, mult: 2.6, jarak: 280,
      desc: "Muncul di belakang musuh terdekat & menusuk — pasti kritis.", naik3: "Langsung melompat ke musuh berikutnya & menusuk lagi.", naik5: "Musuh yang ditusuk berdarah & lumpuh sesaat.",
      en: { name: "Shadow Stab", desc: "Appear behind the nearest enemy & stab — a guaranteed critical.", naik3: "Leap to the next enemy & stab again.", naik5: "Stabbed enemies bleed & are briefly stunned." } },
    { id: "asapHilang", name: "Asap Hilang", type: "asap", buka: 8, cd: 12, lama: 3,
      desc: "Bom asap: menghilang 3 detik, musuh biasa kehilangan jejakmu, pukulan berikutnya kritis ×2.", naik3: "Menghilang 4,5 detik.", naik5: "Asapnya membuat musuh di sekitar bingung (lambat & lemah).",
      en: { name: "Vanishing Smoke", desc: "Smoke bomb: vanish for 3s, normal enemies lose track of you, your next hit is a ×2 critical.", naik3: "Vanish for 4.5s.", naik5: "The smoke slows & weakens nearby enemies." } },
    { id: "kerambitBerantai", name: "Kerambit Berantai", type: "spin", buka: 18, cd: 7, mult: 0.85, r: 95, hits: 6,
      desc: "Berputar menyabet semua musuh di sekeliling (6 kali).", naik3: "Jangkauan putaran +30%.", naik5: "Menarik musuh mendekat & membuat berdarah.",
      en: { name: "Chain Kerambit", desc: "Spin and slash every enemy around you (6 hits).", naik3: "Spin range +30%.", naik5: "Pulls enemies in and makes them bleed." } },
    { id: "racunKerambit", name: "Racun Kerambit", type: "lumuri", buka: 30, cd: 15, lama: 8,
      desc: "Melumuri kerambit dengan racun 8 detik: tiap pukulan meracuni & membuat berdarah.", naik3: "Bertahan 12 detik.", naik5: "Pukulan ke musuh beracun +20% damage.",
      en: { name: "Venom Blade", desc: "Coat your kerambit in venom for 8s: every hit poisons & causes bleeding.", naik3: "Lasts 12s.", naik5: "+20% damage against poisoned enemies." } },
  ],
  pamungkas: { name: "Bayang Seribu", type: "seribu", mult: 0.85, r: 300, desc: "Jawara lenyap menjadi bayangan: semua musuh dekat disabet 10 kali.",
    en: { name: "Thousand Shadows", desc: "The Jawara dissolves into shadow: every nearby enemy is slashed 10 times." } },
  suara: { f: 160, vk: VOKAL.i },
  en: { name: "Shadow Fighter", role: "Assassin", skill: "Shadow Stab",
    desc: "The fastest kerambit in the village. Agile, +12% crit chance, strikes from the shadows from behind. Fragile when surrounded." },
});

// pasif kelas: peluang kritis +12%
{
  const bonusAsli = bonusStat;
  bonusStat = function (k) { const n = bonusAsli(k); return k === "kritis" && S && S.cls === "jawara" ? n + 0.12 : n; };
}

// ---------- Jurus ----------
function tusukDari(m, dmg, r) {
  const a = Math.atan2(m.y - P.y, m.x - P.x), x1 = m.x + Math.cos(a) * (m.r + 28), y1 = m.y + Math.sin(a) * (m.r + 28);
  if (typeof kedipFx !== "undefined") kedipFx.push({ x0: P.x, y0: P.y, x1, y1, t: 0, dur: 0.3, emas: true });
  if (!solidAt(x1, y1)) { P.x = x1; P.y = y1; }
  P.face = a + Math.PI; P.swing = P.swingDur = 0.18;
  damageMonster(m, dmg, a, 160, { kritis: true });
  if (r >= 5) { beriDotMonster(m, "berdarah"); lumpuhkanMonster(m, m.d.boss ? 0.3 : 0.8); }
  effects.push({ kind: "slash", x: m.x, y: m.y - 24, ang: a, r: 50, arc: 0.8, t: 0, dur: 0.14, big: true });
  sfx.swing(); sfx.dash();
}
jurusKhusus("tusuk", (j, r, dmg) => {
  const m = musuhDekat(j.jarak)[0];
  if (!m) { P.cd[P.slotAktif] = 0.5; toast(t("jurus.takAdaMusuh"), false); return; }
  P.inv = Math.max(P.inv, 0.35);
  tusukDari(m, dmg, r);
  if (r >= 3) setTimeout(() => { const n = musuhDekat(j.jarak).find((x) => x !== m); if (n && P && !P.dead && mode === "play") tusukDari(n, dmg * 0.8, r); }, 220);
});
jurusKhusus("asap", (j, r) => {
  P.halimun = r >= 3 ? 4.5 : j.lama; P.kritisGanda = true; P.kritisSiap = true;
  for (const m of monsters) if (!m.dead && dist(m, P) < 360 && !m.d.boss) { m.aggro = false; if ("state" in m) m.state = m.d.ai ? "idle" : "idle"; m.seen = 0; }
  if (r >= 5) for (const m of musuhDekat(140)) { lambatkanMonster(m, 3); lemahkanMonster(m, 3); }
  for (let i = 0; i < 26; i++) { const a = rand(0, 6.28), s = rand(20, 90); parts.push({ x: P.x + Math.cos(a) * 10, y: P.y + Math.sin(a) * 6, z: rand(0, 20), vz: rand(10, 40), vx: Math.cos(a) * s, vy: Math.sin(a) * s * 0.5, life: 1.2, max: 1.2, color: "#8d8894", s: rand(12, 22), float: true }); }
  sfx.roll();
});
jurusKhusus("lumuri", (j, r) => { P.lumur = r >= 3 ? 12 : j.lama; P.lumurKuat = r >= 5; sfx.drink(); });

// racun kerambit & kritis ganda (Asap Hilang)
{
  const damageAsli = damageMonster;
  damageMonster = function (m, amount, ang, kb, opts = {}) {
    if (S && S.cls === "jawara" && !opts.dot && !opts.sekutu) {
      if (P.lumurKuat && P.lumur > 0 && m.dots && m.dots.racun) amount *= 1.2;
      if (P.kritisGanda && P.kritisSiap) { amount *= 2; P.kritisGanda = false; }
    }
    const hasil = damageAsli(m, amount, ang, kb, opts);
    if (S && S.cls === "jawara" && P.lumur > 0 && !opts.dot && !m.dead) { beriDotMonster(m, "racun"); beriDotMonster(m, "berdarah"); }
    return hasil;
  };
}
// selama menghilang: musuh biasa tidak mengejar (diatur ulang tiap frame)
UPDATE_TAMBAHAN.push((dt) => {
  if (!P) return;
  if (P.lumur > 0) P.lumur -= dt;
  if (P.halimun > 0) {
    P.halimun -= dt;
    for (const m of monsters) if (!m.dead && !m.d.boss && dist(m, P) < 400) { m.aggro = false; m.seen = 0; if (m.state === "chase" || m.state === "kejar") m.state = "idle"; }
  }
});
// menyerang = keluar dari persembunyian
{
  const serangAsli = playerAttack;
  playerAttack = function () { serangAsli(); if (P.halimun > 0) P.halimun = Math.min(P.halimun, 0.2); };
}
// gambar: hero tampak samar saat menghilang, kerambit berkilau hijau saat beracun
GAMBAR_TANAH.push(function (time) {
  if (!P || S.cls !== "jawara") return;
  if (P.lumur > 0 && Math.random() < 0.35) parts.push({ x: P.x + rand(-10, 10), y: P.y - rand(10, 30), z: 0, vz: 0, vx: 0, vy: -20, life: 0.4, max: 0.4, color: "#7dd35a", s: 3 });
  if (P.halimun > 0) { ctx.fillStyle = `rgba(141,136,148,${0.25 + 0.1 * Math.sin(time * 6)})`; ctx.beginPath(); ctx.ellipse(P.x, P.y - 24, 26, 34, 0, 0, 6.28); ctx.fill(); }
});
// pemain samar (transparan) saat Asap Hilang aktif
{
  const orangAsli = drawPerson;
  drawPerson = function (c, e, look, time, opts) {
    if (e === P && P.halimun > 0) { c.save(); c.globalAlpha = 0.35; orangAsli(c, e, look, time, opts); c.restore(); return; }
    return orangAsli(c, e, look, time, opts);
  };
}
