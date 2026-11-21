// =====================================================================
// SUARA MAKHLUK
// Suara sintetis (tanpa file rekaman) untuk:
//   - monster: saat melihatmu (siaga), saat ancang-ancang (tanda serangan!), saat mati
//   - bos: raungan saat mengejar, ganti fase, memulai jurus khas & amukan
//   - hero: hentakan saat menyerang/berjurus/berguling/menangkis, erangan saat terluka,
//           teriakan pamungkas — nadanya beda tiap kelas
//   - NPC: "ocehan" suku kata acak saat bicara, nada khas tiap NPC
// Volume sendiri: Pengaturan › Volume › Suara makhluk (jalur suaraBus di 07-audio.js).
// Supaya tidak berisik: paling banyak beberapa suara sekaligus, makin jauh makin pelan,
// dan nadanya sedikit diacak tiap kali.
// =====================================================================
"use strict";

// ---------- Bahan dasar ----------
const VOKAL = { a: [800, 1250], e: [500, 1800], i: [320, 2300], o: [520, 900], u: [350, 700] };
// suara mirip vokal: gelombang kasar disaring dua "formant" (warna vokal) + getaran
// langsung = sebagian suara asli ikut lewat tanpa saringan vokal (supaya nada rendah tetap jelas terdengar)
function vokal({ f, f2 = f, dur = 0.2, vol = 0.1, formant = VOKAL.a, type = "sawtooth", vib = 0, delay = 0, napas = 0, langsung = 0 }) {
  if (!audio() || !suaraBus) return;
  try {
    const t = actx.currentTime + delay, o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.setValueAtTime(f * rand(0.96, 1.04), t);
    o.frequency.exponentialRampToValueAtTime(Math.max(30, f2 * rand(0.96, 1.04)), t + dur);
    if (vib) { const l = actx.createOscillator(), lg = actx.createGain(); l.frequency.value = rand(5, 7); lg.gain.value = f * vib; l.connect(lg).connect(o.frequency); l.start(t); l.stop(t + dur + 0.05); }
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.03, dur * 0.25)); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    for (const [fr, k] of [[formant[0], 1], [formant[1], 0.6]]) {
      const bp = actx.createBiquadFilter(), bg = actx.createGain();
      bp.type = "bandpass"; bp.frequency.value = fr; bp.Q.value = 5; bg.gain.value = k * 2.2;
      o.connect(bp).connect(bg).connect(g);
    }
    if (langsung) { const lp = actx.createBiquadFilter(), lg = actx.createGain(); lp.type = "lowpass"; lp.frequency.value = 2600; lg.gain.value = langsung; o.connect(lp).connect(lg).connect(g); }
    g.connect(suaraBus); o.start(t); o.stop(t + dur + 0.05);
    if (napas) hiss(dur, vol * napas, "bandpass", formant[1], formant[0], delay, suaraBus, 1.5);
  } catch (e) {}
}
const ciut = (f, f2, dur, vol, delay = 0) => tone(f * rand(0.95, 1.05), dur, "sine", vol, f2 / f, delay, suaraBus);
const desis = (dur, vol, fr = 4000, delay = 0) => hiss(dur, vol, "highpass", fr, fr * 1.3, delay, suaraBus, 0.8);
const gemeretak = (n, vol, fr = 1800, jeda = 0.045) => { for (let i = 0; i < n; i++) tone(fr * rand(0.8, 1.2), 0.03, "square", vol, 0.7, i * jeda * rand(0.8, 1.2), suaraBus); };
const gemuruh = (f, dur, vol, delay = 0) => { tone(f, dur, "sawtooth", vol * 0.5, 0.75, delay, suaraBus); hiss(dur, vol * 0.6, "lowpass", 400, 120, delay, suaraBus); };
const gelembung = (n, vol) => { for (let i = 0; i < n; i++) tone(rand(180, 520), 0.07, "sine", vol, 1.8, i * rand(0.05, 0.11), suaraBus); };

// ---------- Suara tiap keluarga makhluk ----------
// tiap keluarga: { siaga, ancang, mati } — fungsi(v = kekerasan, p = pengali nada)
const KELUARGA = {
  raksasa: {
    siaga: (v, p) => vokal({ f: 95 * p, f2: 70 * p, dur: 0.7, vol: 0.28 * v, formant: VOKAL.o, napas: 0.5 }),
    ancang: (v, p) => vokal({ f: 120 * p, f2: 80 * p, dur: 0.45, vol: 0.3 * v, formant: VOKAL.a, napas: 0.6 }),
    mati: (v, p) => vokal({ f: 120 * p, f2: 40 * p, dur: 1.1, vol: 0.3 * v, formant: VOKAL.u, napas: 0.4 }),
  },
  kera: {
    siaga: (v, p) => { for (let i = 0; i < 3; i++) vokal({ f: 600 * p, f2: 900 * p, dur: 0.07, vol: 0.12 * v, formant: VOKAL.i, type: "square", delay: i * 0.09 }); },
    ancang: (v, p) => vokal({ f: 700 * p, f2: 1150 * p, dur: 0.16, vol: 0.15 * v, formant: VOKAL.a, type: "square" }),
    mati: (v, p) => vokal({ f: 900 * p, f2: 380 * p, dur: 0.3, vol: 0.13 * v, formant: VOKAL.u, type: "square" }),
  },
  babi: {
    siaga: (v, p) => { for (let i = 0; i < 2; i++) vokal({ f: 160 * p, f2: 125 * p, dur: 0.14, vol: 0.18 * v, formant: VOKAL.o, napas: 0.8, delay: i * 0.18 }); },
    ancang: (v, p) => { hiss(0.2, 0.12 * v, "bandpass", 900, 600, 0, suaraBus, 2); vokal({ f: 210 * p, f2: 150 * p, dur: 0.2, vol: 0.18 * v, formant: VOKAL.o, delay: 0.12 }); },
    mati: (v, p) => vokal({ f: 820 * p, f2: 480 * p, dur: 0.35, vol: 0.14 * v, formant: VOKAL.i }),
  },
  kelelawar: {
    siaga: (v, p) => { ciut(2600 * p, 3500 * p, 0.06, 0.05 * v); ciut(2800 * p, 3700 * p, 0.06, 0.05 * v, 0.1); },
    ancang: (v, p) => ciut(3000 * p, 4300 * p, 0.12, 0.07 * v),
    mati: (v, p) => ciut(3300 * p, 1700 * p, 0.22, 0.06 * v),
  },
  hantu: {
    siaga: (v, p) => vokal({ f: 400 * p, f2: 620 * p, dur: 1, vol: 0.07 * v, formant: VOKAL.u, type: "sine", vib: 0.04 }),
    ancang: (v, p) => vokal({ f: 520 * p, f2: 900 * p, dur: 0.5, vol: 0.09 * v, formant: VOKAL.o, type: "triangle", vib: 0.05 }),
    mati: (v, p) => vokal({ f: 700 * p, f2: 180 * p, dur: 1.2, vol: 0.08 * v, formant: VOKAL.u, type: "sine", vib: 0.06 }),
  },
  buaya: {
    siaga: (v, p) => { desis(0.5, 0.08 * v, 3000); gemuruh(80 * p, 0.4, 0.12 * v, 0.2); },
    ancang: (v, p) => { desis(0.3, 0.12 * v, 2500); gemeretak(1, 0.1 * v, 600); },
    mati: (v, p) => gemuruh(90 * p, 0.6, 0.15 * v),
  },
  tuyul: {
    siaga: (v, p) => [520, 680, 540, 720].forEach((f, i) => vokal({ f: f * p, dur: 0.07, vol: 0.09 * v, formant: VOKAL.i, type: "triangle", delay: i * 0.08 })),
    ancang: (v, p) => [600, 780, 640, 820, 700].forEach((f, i) => vokal({ f: f * p, dur: 0.05, vol: 0.09 * v, formant: VOKAL.e, type: "triangle", delay: i * 0.05 })),
    mati: (v, p) => vokal({ f: 620 * p, f2: 200 * p, dur: 0.35, vol: 0.1 * v, formant: VOKAL.u, type: "triangle" }),
  },
  kepiting: {
    siaga: (v) => gemeretak(4, 0.05 * v),
    ancang: (v) => gemeretak(6, 0.07 * v, 2200, 0.03),
    mati: (v) => gemeretak(3, 0.05 * v, 1200, 0.08),
  },
  api: {
    siaga: (v) => { hiss(0.5, 0.1 * v, "bandpass", 500, 2500, 0, suaraBus, 1); gemeretak(3, 0.03 * v, 3000, 0.07); },
    ancang: (v) => hiss(0.35, 0.14 * v, "bandpass", 700, 3500, 0, suaraBus, 1.2),
    mati: (v) => hiss(0.3, 0.12 * v, "lowpass", 2000, 200, 0, suaraBus),
  },
  ular: {
    siaga: (v) => desis(0.6, 0.08 * v, 4500),
    ancang: (v) => desis(0.25, 0.13 * v, 3800),
    mati: (v) => hiss(0.5, 0.08 * v, "highpass", 4000, 1500, 0, suaraBus),
  },
  kucing: {
    siaga: (v, p) => vokal({ f: 220 * p, f2: 180 * p, dur: 0.45, vol: 0.15 * v, formant: VOKAL.a, napas: 0.9 }),
    ancang: (v, p) => vokal({ f: 270 * p, f2: 150 * p, dur: 0.3, vol: 0.2 * v, formant: VOKAL.a, napas: 1 }),
    mati: (v, p) => vokal({ f: 300 * p, f2: 110 * p, dur: 0.5, vol: 0.15 * v, formant: VOKAL.o }),
  },
  bajak: {
    siaga: (v, p) => [0, 0.16, 0.32].forEach((d) => vokal({ f: 170 * p, f2: 150 * p, dur: 0.12, vol: 0.12 * v, formant: VOKAL.a, delay: d, vib: 0.02 })),
    ancang: (v, p) => vokal({ f: 140 * p, f2: 100 * p, dur: 0.35, vol: 0.15 * v, formant: VOKAL.o, napas: 0.5 }),
    mati: (v, p) => vokal({ f: 400 * p, f2: 150 * p, dur: 0.9, vol: 0.1 * v, formant: VOKAL.u, type: "triangle", vib: 0.05 }),
  },
  batu: {
    siaga: (v, p) => gemuruh(60 * p, 0.6, 0.18 * v),
    ancang: (v, p) => { gemuruh(70 * p, 0.45, 0.22 * v); hiss(0.4, 0.08 * v, "bandpass", 300, 900, 0, suaraBus, 2); },
    mati: (v, p) => { gemuruh(55 * p, 1, 0.2 * v); gemeretak(6, 0.05 * v, 500, 0.09); },
  },
  burung: {
    siaga: (v, p) => vokal({ f: 1200 * p, f2: 1600 * p, dur: 0.25, vol: 0.1 * v, formant: VOKAL.i, type: "square" }),
    ancang: (v, p) => vokal({ f: 1500 * p, f2: 2300 * p, dur: 0.3, vol: 0.12 * v, formant: VOKAL.e, type: "square" }),
    mati: (v, p) => vokal({ f: 1400 * p, f2: 550 * p, dur: 0.4, vol: 0.1 * v, formant: VOKAL.u, type: "square" }),
  },
  naga: {
    siaga: (v, p) => vokal({ f: 75 * p, f2: 55 * p, dur: 1.3, vol: 0.32 * v, formant: VOKAL.o, napas: 1 }),
    ancang: (v, p) => vokal({ f: 95 * p, f2: 60 * p, dur: 0.6, vol: 0.3 * v, formant: VOKAL.a, napas: 1 }),
    mati: (v, p) => vokal({ f: 110 * p, f2: 30 * p, dur: 2, vol: 0.32 * v, formant: VOKAL.u, napas: 0.7 }),
  },
  tikus: {
    siaga: (v, p) => ciut(1800 * p, 2300 * p, 0.08, 0.06 * v),
    ancang: (v, p) => { ciut(2000 * p, 2700 * p, 0.07, 0.07 * v); ciut(2100 * p, 2800 * p, 0.07, 0.07 * v, 0.09); },
    mati: (v, p) => ciut(2200 * p, 900 * p, 0.25, 0.06 * v),
  },
  bayang: {
    siaga: (v, p) => { hiss(0.8, 0.06 * v, "bandpass", 1200, 800, 0, suaraBus, 3); vokal({ f: 100 * p, f2: 90 * p, dur: 0.8, vol: 0.1 * v, formant: VOKAL.u, napas: 1.2 }); },
    ancang: (v, p) => vokal({ f: 130 * p, f2: 85 * p, dur: 0.4, vol: 0.16 * v, formant: VOKAL.o, napas: 1 }),
    mati: (v) => hiss(1, 0.07 * v, "bandpass", 1500, 300, 0, suaraBus, 3),
  },
  tulang: {
    siaga: (v, p) => { gemeretak(5, 0.05 * v, 900, 0.06); vokal({ f: 150 * p, dur: 0.4, vol: 0.08 * v, formant: [300, 600], delay: 0.2 }); },
    ancang: (v) => gemeretak(7, 0.07 * v, 1100, 0.035),
    mati: (v) => gemeretak(10, 0.06 * v, 700, 0.05),
  },
  belut: {
    siaga: (v) => { tone(120, 0.4, "square", 0.04 * v, 1.1, 0, suaraBus); hiss(0.15, 0.06 * v, "highpass", 5000, 5000, 0.2, suaraBus); },
    ancang: (v) => { tone(110, 0.3, "square", 0.06 * v, 2.5, 0, suaraBus); hiss(0.2, 0.08 * v, "highpass", 4500, 6000, 0.2, suaraBus); },
    mati: (v) => tone(200, 0.4, "square", 0.05 * v, 0.2, 0, suaraBus),
  },
  angin: {
    siaga: (v) => hiss(0.9, 0.11 * v, "bandpass", 500, 1400, 0, suaraBus, 6),
    ancang: (v) => hiss(0.4, 0.12 * v, "bandpass", 700, 2600, 0, suaraBus, 6),
    mati: (v) => hiss(0.8, 0.08 * v, "bandpass", 1400, 300, 0, suaraBus, 6),
  },
  lelembut: {
    siaga: (v, p) => vokal({ f: 780 * p, f2: 700 * p, dur: 0.9, vol: 0.12 * v, formant: VOKAL.i, type: "sine", vib: 0.05 }),
    ancang: (v, p) => vokal({ f: 820 * p, f2: 1100 * p, dur: 0.4, vol: 0.08 * v, formant: VOKAL.e, type: "triangle", vib: 0.06 }),
    mati: (v, p) => [0, 0.25].forEach((d) => vokal({ f: 700 * p, f2: 500 * p, dur: 0.3, vol: 0.06 * v, formant: VOKAL.u, type: "sine", delay: d })),
  },
  gurita: {
    siaga: (v) => gelembung(5, 0.07 * v),
    ancang: (v, p) => { vokal({ f: 90 * p, f2: 70 * p, dur: 0.5, vol: 0.2 * v, formant: VOKAL.u, napas: 0.5 }); gelembung(4, 0.06 * v); },
    mati: (v) => gelembung(9, 0.07 * v),
  },
  kelabang: {
    siaga: (v) => { gemeretak(8, 0.05 * v, 2600, 0.025); desis(0.3, 0.05 * v, 3500); },
    ancang: (v) => gemeretak(12, 0.06 * v, 2800, 0.02),
    mati: (v) => gemeretak(6, 0.05 * v, 1500, 0.07),
  },
  siluman: {
    siaga: (v, p) => { desis(0.6, 0.08 * v, 4000); vokal({ f: 300 * p, f2: 260 * p, dur: 0.6, vol: 0.1 * v, formant: VOKAL.a, type: "triangle", vib: 0.03, delay: 0.3 }); },
    ancang: (v, p) => { desis(0.25, 0.12 * v, 3600); vokal({ f: 360 * p, f2: 240 * p, dur: 0.3, vol: 0.12 * v, formant: VOKAL.e, type: "triangle" }); },
    mati: (v, p) => vokal({ f: 380 * p, f2: 120 * p, dur: 1.2, vol: 0.12 * v, formant: VOKAL.a, type: "triangle", vib: 0.05 }),
  },
};
// jenis monster → [keluarga, pengali nada]
const SUARA_MONSTER = {
  kera: ["kera", 1], kelelawar: ["kelelawar", 1], babi: ["babi", 1], genderuwo: ["raksasa", 1], hantuKabut: ["hantu", 1], buaya: ["buaya", 1],
  tuyul: ["tuyul", 1], kepiting: ["kepiting", 1], banaspati: ["api", 1], dwarapala: ["batu", 0.9], buayaPutih: ["buaya", 0.8], rajaBanaspati: ["api", 0.8],
  ularWelang: ["ular", 1], uburUbur: ["api", 1.2], harimauKumbang: ["kucing", 1], hantuBajak: ["bajak", 1], silumanUlar: ["siluman", 1], panglimaKarang: ["raksasa", 1.25],
  arcaHidup: ["batu", 1.1], elangBatu: ["burung", 1], anakNaga: ["naga", 2.2], kelabang: ["kelabang", 1], naga: ["naga", 1], tikusSawah: ["tikus", 1],
  bayangan: ["bayang", 1.1], jerangkong: ["tulang", 1], belutListrik: ["belut", 1], rohAngin: ["angin", 1], prajuritBayang: ["bayang", 0.9], lelembut: ["lelembut", 1],
  rajaJerangkong: ["tulang", 0.8], guritaRaksasa: ["gurita", 1], rajawaliPetir: ["burung", 0.75], penjagaMenara: ["batu", 0.8], kalamurka: ["bayang", 0.75],
};

// ---------- Kalibrasi kekerasan ----------
// Puncak suara tiap keluarga (diukur di browser dengan v = 1). Dipakai untuk menyamakan
// kekerasan semua makhluk ke TARGET_SUARA, supaya tidak ada yang terlalu pelan/keras.
// Kalau menambah keluarga baru tanpa angka di sini, dianggap sudah pas (pengali 1).
const UKUR_SUARA = {
  raksasa: [0.184, 0.209, 0.234], kera: [0.037, 0.263, 0.095], babi: [0.129, 0.103, 0.034], kelelawar: [0.04, 0.055, 0.048],
  hantu: [0.053, 0.123, 0.087], buaya: [0.092, 0.176, 0.057], tuyul: [0.025, 0.048, 0.021], kepiting: [0.038, 0.055, 0.039],
  api: [0.028, 0.035, 0.053], ular: [0.094, 0.136, 0.092], kucing: [0.111, 0.165, 0.099], bajak: [0.079, 0.093, 0.079],
  batu: [0.073, 0.087, 0.1], burung: [0.014, 0.071, 0.03], naga: [0.227, 0.241, 0.252], tikus: [0.047, 0.056, 0.048],
  bayang: [0.067, 0.09, 0.016], tulang: [0.054, 0.054, 0.046], belut: [0.058, 0.085, 0.038], angin: [0.006, 0.011, 0.011],
  lelembut: [0.005, 0.012, 0.066], gurita: [0.054, 0.125, 0.056], kelabang: [0.066, 0.056, 0.039], siluman: [0.09, 0.139, 0.034],
};
const TARGET_SUARA = { siaga: 0.13, ancang: 0.17, mati: 0.13 };   // ancang-ancang paling jelas: itu tanda serangan
function kalibrasi(fam, ev) {
  const u = UKUR_SUARA[fam]; if (!u) return 1;
  const pk = u[["siaga", "ancang", "mati"].indexOf(ev)];
  return pk ? clamp(TARGET_SUARA[ev] / pk, 0.5, 14) : 1;
}

// ---------- Batas & jarak ----------
let jejakSuara = [];
function bolehBersuara(penting) {
  const now = performance.now();
  jejakSuara = jejakSuara.filter((x) => now - x < 350);
  if (!penting && jejakSuara.length >= 3) return false;
  jejakSuara.push(now);
  return true;
}
const kerasJarak = (m) => { const d = P ? dist(m, P) : 0; return d < 250 ? 1 : Math.max(0, 1 - (d - 250) / 550); };

function suaraMonster(m, kejadian) {
  const pr = SUARA_MONSTER[m.type];
  if (!pr || !audioOn.suara) return;
  const v = kerasJarak(m) * (m.d.boss ? 1.25 : 1);
  if (v < 0.08) return;
  const now = performance.now();
  if (!m.d.boss && m._suaraT && now - m._suaraT < 600) return;
  if (!bolehBersuara(m.d.boss)) return;
  m._suaraT = now;
  const fn = KELUARGA[pr[0]][kejadian] || KELUARGA[pr[0]].siaga;
  fn(kejadian === "raung" ? v : v * kalibrasi(pr[0], kejadian), pr[1] * (m.d.boss && kejadian === "raung" ? 0.85 : 1));
}

// Pantau perubahan keadaan monster tiap frame (siaga, ancang-ancang, mati, momen bos)
UPDATE_TAMBAHAN.push(function () {
  for (const m of monsters) {
    if (m.d.latihan) { if (m.state === "ancang" && m._svState !== "ancang") gemeretak(1, 0.06 * kerasJarak(m), 900); m._svState = m.state; continue; }
    const sv = m._sv || (m._sv = { state: m.state, aggro: m.aggro, dead: m.dead, khas: null, amuk: null, f2: false, f3: false });
    if (m.dead && !sv.dead) suaraMonster(m, "mati");
    else if (!m.dead) {
      if (m.aggro && !sv.aggro && (m.d.boss || Math.random() < 0.6)) suaraMonster(m, m.d.boss ? "raung" : "siaga");
      if ((m.state === "windup" || m.state === "ancang") && sv.state !== m.state) suaraMonster(m, "ancang");
      if (m.d.boss) {
        if ((m.khas && !sv.khas) || (m.amuk && !sv.amuk) || ((m.fase2 || m.f2) && !sv.f2) || (m.fase3 && !sv.f3)) suaraMonster(m, "raung");
      }
    }
    Object.assign(sv, { state: m.state, aggro: m.aggro, dead: m.dead, khas: m.khas, amuk: m.amuk, f2: !!(m.fase2 || m.f2), f3: !!m.fase3 });
  }
});
// "raung" bos = suara siaga yang lebih panjang & keras
for (const [nama, k] of Object.entries(KELUARGA)) if (!k.raung) k.raung = (v, p) => { k.siaga(v * 1.2 * kalibrasi(nama, "siaga"), p); setTimeout(() => k.ancang(v * kalibrasi(nama, "ancang"), p * 0.9), 350); };

// ---------- Suara hero (per kelas) ----------
const SUARA_HERO = {
  pendekar: { f: 170, vk: VOKAL.a }, pemanah: { f: 235, vk: VOKAL.e },
  pendobrak: { f: 112, vk: VOKAL.o }, penyihir: { f: 200, vk: VOKAL.a },
};
function suaraHero(jenis) {
  if (!S || !audioOn.suara || !bolehBersuara(true)) return;
  const h = SUARA_HERO[S.cls], f = h.f;
  const vokalH = (o) => vokal({ ...o, vol: o.vol * 1.35, langsung: 0.45 });
  if (jenis === "serang") vokalH({ f: f * 1.1, f2: f * 0.9, dur: 0.1, vol: 0.12, formant: h.vk, napas: 0.6 });
  else if (jenis === "jurus") { vokalH({ f: f * 1.15, dur: 0.07, vol: 0.13, formant: VOKAL.i, napas: 0.4 }); vokalH({ f: f * 1.3, f2: f, dur: 0.18, vol: 0.15, formant: h.vk, delay: 0.08, napas: 0.4 }); }
  else if (jenis === "guling") vokalH({ f: f * 1.2, f2: f * 1.05, dur: 0.08, vol: 0.09, formant: VOKAL.u, napas: 0.8 });
  else if (jenis === "tangkis") vokalH({ f: f, f2: f * 1.15, dur: 0.1, vol: 0.12, formant: VOKAL.e, napas: 0.5 });
  else if (jenis === "sakit") vokalH({ f: f * 1.25, f2: f * 0.8, dur: 0.2, vol: 0.14, formant: VOKAL.u, napas: 0.7 });
  else if (jenis === "pingsan") vokalH({ f: f * 1.2, f2: f * 0.5, dur: 0.9, vol: 0.15, formant: VOKAL.o, napas: 0.5 });
  else if (jenis === "pamungkas") [[1, 0.09, VOKAL.e], [1.2, 0.09, VOKAL.a], [1.45, 0.4, VOKAL.a]].forEach(([k, d], i, arr) =>
    vokalH({ f: f * k, f2: f * k * (i === 2 ? 0.85 : 1), dur: d, vol: 0.16, formant: arr[i][2], delay: i * 0.11, napas: 0.5, vib: i === 2 ? 0.03 : 0 }));
}
function contohSuara() { if (S) suaraHero("jurus"); else vokal({ f: 170, dur: 0.2, vol: 0.13 }); }

// sambungkan ke aksi pemain (fungsi aslinya tetap dipanggil)
let hitungSerang = 0;
const playerAttackAsli = playerAttack;
playerAttack = function () { playerAttackAsli(); if (++hitungSerang % 3 === 0 || (P.combo === 2 && CLASSES[S.cls].attack.type === "melee")) suaraHero("serang"); };
const pakaiJurusAsli = pakaiJurus;
pakaiJurus = function (slot) { const cd = P.cd[slot]; pakaiJurusAsli(slot); if (cd <= 0 && P.cd[slot] > 0) suaraHero("jurus"); };
const pakaiPamungkasAsli = pakaiPamungkas;
pakaiPamungkas = function () { const isi = P.tenaga; pakaiPamungkasAsli(); if (isi >= ATURAN.tenaga.maks && P.tenaga === 0) suaraHero("pamungkas"); };
const hindarAsli = hindarAtauTangkis;
hindarAtauTangkis = function (inp) { const ok = hindarAsli(inp); if (ok) suaraHero(P.tangkis > 0 ? "tangkis" : "guling"); return ok; };
let hpLalu = null, sakitT = 0;
UPDATE_TAMBAHAN.push(function (dt) {
  if (!P) return;
  sakitT -= dt;
  if (hpLalu !== null && !P.dead && P.hp < hpLalu - Math.max(2, maxHp() * 0.03) && sakitT <= 0) { sakitT = 0.5; suaraHero("sakit"); }
  if (P.dead && !P._suaraMati) { P._suaraMati = true; suaraHero("pingsan"); }
  hpLalu = P.hp;
});

// ---------- Ocehan NPC ----------
// nada dasar tiap NPC (Hz); yang tidak tercantum: dihitung dari id-nya
const NADA_NPC = { lurah: 110, dagang: 240, wowo: 120, resi: 140, tirto: 105, jala: 130, inah: 250, kardi: 150, joko: 125, bahar: 115, laras: 260,
  bayu: 330, sari: 270, rimba: 120, sukma: 230, kirana: 280, gora: 100, angon: 135, parmin: 140, juru: 100, wulan: 300, sanip: 130, bujang: 210,
  ratri: 250, cahya: 115, lintang: 220, sekar: 300, sabda: 120 };
const nadaNpc = (id) => NADA_NPC[id] || 150 + ([...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 120);
function ocehan(nada, teks, cepat = 1) {
  if (!audioOn.suara) return;
  const n = clamp(Math.round(teks.length / 9), 3, 9), vs = Object.values(VOKAL);
  for (let i = 0; i < n; i++) {
    const naik = i === n - 1 && /\?\s*$/.test(teks) ? 1.25 : 1;   // pertanyaan: suku kata terakhir naik
    // gelombang kasar + jalur langsung: nada rendah (Ki Lurah) tetap jelas; makin rendah sedikit lebih keras
    vokal({ f: nada * rand(0.9, 1.15) * naik, dur: 0.075 * rand(0.8, 1.3) / cepat, vol: 0.09 * clamp(200 / nada, 1.15, 1.6), formant: vs[Math.floor(Math.random() * vs.length)], type: "sawtooth", delay: (i * 0.09) / cepat, langsung: 0.55 });
  }
}
// siapa yang bicara? dicari dari nama di kotak dialog
const openDialogAsli = openDialog;
openDialog = function (name, text, actions) {
  openDialogAsli(name, text, actions);
  try {
    const npc = NPC_DATA.find((n) => n.name === name);
    if (npc) return ocehan(nadaNpc(npc.id), text);
    if (S && name === CLASSES[S.cls].name) return ocehan(SUARA_HERO[S.cls].f, text, 1.1);
    const mon = Object.entries(MONSTERS).find(([, d]) => d.name === name);
    if (mon && SUARA_MONSTER[mon[0]]) return ocehan(Math.max(70, 160 * SUARA_MONSTER[mon[0]][1] * (MONSTERS[mon[0]].boss ? 0.6 : 1)), text, 0.8);
  } catch (e) {}
};
