// =====================================================================
// MUSIK LATAR
// Memainkan LAGU dari config.js dan memilih lagu sesuai area.
// Tiap lagu bisa punya beberapa lapisan yang berjalan bersamaan:
//   melodi (+ suara), isian (+ suaraIsian), bas (+ suaraBas),
//   kendang & perkusi (pola gendang), gong.
// Lagu dengan ulang: false dimainkan sekali (musik kemenangan), lihat playJingle().
//
// Supaya tidak kaku:
//   - tiap nada punya kekuatan berbeda (ketukan kuat/lemah) & sedikit meleset seperti dimainkan manusia
//   - ayun (swing): ketukan ganjil sedikit terlambat
//   - struktur gamelan: kenong & kempul menandai frasa, gong di awal frasa
//   - frasa A / B bergantian: di frasa B muncul imbal (peking memecah melodi 2× lebih rapat),
//     kendang lebih rapat, dan ada isian kendang (rol) di akhir tiap frasa
//   - musik bereaksi: ada monster mengejar → lapisan tarung (bas berdenyut, kecrek);
//     nyawa bos makin sedikit → tempo makin cepat & semua lapisan menyala
//   - gema ruang (echo) supaya terdengar lebih luas
// `semangat` (0-1), `ayun`, `frasa` di LAGU (config.js) mengatur seberapa ramai lagu itu.
// =====================================================================
"use strict";

// ---------- Tangga nada ----------
// Slendro = 5 nada per oktaf, jaraknya hampir sama (cerah, riang).
// Pelog   = 7 nada, jaraknya tidak sama, ada yang sangat rapat (gelap, tegang, seram).
// Angka = sen (1 oktaf = 1200 sen). Nada dasar "1" = D4.
const TANGGA = {
  slendro: { 1: 0, 2: 240, 3: 480, 5: 720, 6: 960 },
  pelog: { 1: 0, 2: 120, 3: 270, 4: 540, 5: 670, 6: 785, 7: 950 },
};
const NADA_DASAR = 293.66;
function parseNote(tok, tangga = "slendro") {
  const sen = TANGGA[tangga][tok[0]];
  if (sen === undefined) return null;               // "." atau tanda lain = diam
  let oct = 0;
  for (const ch of tok.slice(1)) oct += ch === "'" ? 1 : ch === "," ? -1 : 0;
  return NADA_DASAR * Math.pow(2, oct + sen / 1200);
}
const line = (txt, tg) => (txt ? txt.trim().split(/\s+/).map((t) => parseNote(t, tg)) : []);
const beat = (txt) => (txt || "").replace(/\s+/g, "");
const SONGS = {};
for (const [id, s] of Object.entries(LAGU)) {
  const tg = s.tangga || "slendro";
  SONGS[id] = {
    ...s, notes: line(s.melodi, tg), fill: line(s.isian, tg), bass: line(s.bas, tg),
    drums: beat(s.kendang), perc: beat(s.perkusi), once: s.ulang === false,
  };
}
const music = { cur: null, gain: null, step: 0, next: 0 };

// Ganti lagu dengan crossfade: lagu lama memudar, lagu baru masuk pelan.
// Lagu sekali-main (kemenangan) langsung keras tanpa menunggu.
function playMusic(id) {
  if (music.cur === id || !audio()) return;
  const t = actx.currentTime, s = SONGS[id];
  if (music.gain) { const old = music.gain; old.gain.setTargetAtTime(0.0001, t, s && s.once ? 0.12 : 0.4); setTimeout(() => old.disconnect(), 3000); }
  music.cur = id; music.gain = null;
  if (!id || !s) return;
  const g = actx.createGain(); g.connect(musicBus); g.connect(ruangMusik());
  const vol = s.keras || 1;    // pengali volume per lagu (config.js)
  if (s.once) { g.gain.setValueAtTime(vol, t); music.next = t + 0.08; }
  else { g.gain.setValueAtTime(0.0001, t); g.gain.setTargetAtTime(vol, t + 0.3, 0.5); music.next = t + 0.3; }
  music.gain = g; music.step = 0; music.basTerakhir = null;
}
function note(type, f, t, vol, attack, decay, out, lowpass) {
  const o = actx.createOscillator(), g = actx.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  let src = o;
  if (lowpass) { const fl = actx.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = lowpass; o.connect(fl); src = fl; }
  src.connect(g).connect(out); o.start(t); o.stop(t + attack + decay + 0.05);
  return o;
}

// ---------- Suara (alat musik) ----------
// Semua dibuat dari gelombang sederhana. Nama dipakai di config.js.
const SUARA = {
  // logam nyaring (saron)
  saron: (f, t, len, out) => { note("triangle", f, t, 0.08, 0.004, len * 2.2, out); note("sine", f * 2.76, t, 0.015, 0.002, len * 0.5, out); },
  // gong kecil lembut (bonang)
  bonang: (f, t, len, out) => { note("sine", f, t, 0.1, 0.01, len * 3, out); note("sine", f * 2, t, 0.02, 0.01, len * 1.2, out); },
  // logam kecil tinggi & pendek (peking), cocok untuk isian cepat
  peking: (f, t, len, out) => { note("triangle", f * 2, t, 0.045, 0.003, len * 1.1, out); note("sine", f * 5.4, t, 0.008, 0.002, len * 0.3, out); },
  // seruling bambu: nada lembut yang bergetar
  suling: (f, t, len, out) => {
    const o = note("sine", f, t, 0.06, 0.04, len * 1.9, out);
    const lfo = actx.createOscillator(), d = actx.createGain();
    lfo.frequency.value = 5.5; d.gain.value = f * 0.012; lfo.connect(d).connect(o.frequency);
    lfo.start(t); lfo.stop(t + len * 2 + 0.1);
  },
  // dengung rendah yang berat
  gelap: (f, t, len, out) => { note("sawtooth", f, t, 0.05, 0.08, len * 4, out, 420); note("sine", f / 2, t, 0.05, 0.1, len * 4, out); },
  // bisikan: dua nada tinggi yang sedikit sumbang, muncul pelan & lama hilangnya
  bisik: (f, t, len, out) => { note("sine", f, t, 0.022, 0.5, len * 7, out); note("sine", f * 1.013, t, 0.016, 0.6, len * 7, out); },
  // bas pendek yang menghentak
  bas: (f, t, len, out) => { note("triangle", f, t, 0.13, 0.005, len * 1.5, out); note("square", f, t, 0.02, 0.005, len * 0.8, out, 500); },
  // bas dengung panjang (latar seram)
  dengung: (f, t, len, out) => { note("sawtooth", f, t, 0.035, 0.6, len * 10, out, 260); note("sine", f * 1.005, t, 0.06, 0.6, len * 10, out); },
};

// ---------- Gendang & perkusi ----------
//   D = dhung (gendang rendah)   t = tak (gendang tinggi)   k = ketuk kayu
//   x = kecrek (logam gemerincing)   B = dentum besar   G = gong   . = diam
function hit(ch, t, out) {
  const wait = t - actx.currentTime;
  if (ch === "D") tone(140, 0.28, "sine", 0.16, 0.42, wait, out);
  else if (ch === "t") hiss(0.06, 0.05, "bandpass", 2200, 1800, wait, out, 1.5);
  else if (ch === "k") { tone(1250, 0.05, "square", 0.018, 0.9, wait, out); hiss(0.03, 0.03, "highpass", 4500, 4500, wait, out); }
  else if (ch === "x") hiss(0.13, 0.04, "highpass", 6500, 5000, wait, out, 0.7);
  else if (ch === "B") { tone(75, 1.1, "sine", 0.22, 0.45, wait, out); hiss(0.6, 0.05, "lowpass", 300, 80, wait, out); }
  else if (ch === "G") gong(t, out);
}
// gong: dua nada rendah yang sedikit beda → bunyi "berombak"
function gong(t, out) {
  note("sine", NADA_DASAR / 4, t, 0.16, 0.02, 3.5, out);
  note("sine", NADA_DASAR / 4 * 1.006, t, 0.1, 0.02, 3.5, out);
}
const at = (arr, i) => (arr.length ? arr[i % arr.length] : null);

// gema ruang: tunda + umpan balik, disaring supaya lembut (dibuat sekali)
let gema = null;
function ruangMusik() {
  if (gema) return gema;
  const inp = actx.createGain(), d = actx.createDelay(1), fb = actx.createGain(), lp = actx.createBiquadFilter(), wet = actx.createGain();
  d.delayTime.value = 0.27; fb.gain.value = 0.32; lp.type = "lowpass"; lp.frequency.value = 2400; wet.gain.value = 0.22;
  inp.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(wet); wet.connect(musicBus);
  return (gema = inp);
}
// kenong (gong sedang, nada tengah) & kempul (gong gantung kecil)
function kenong(f, t, out, v) { note("sine", f, t, 0.07 * v, 0.01, 1.4, out); note("triangle", f * 2, t, 0.012 * v, 0.005, 0.5, out); }
function kempul(f, t, out, v) { note("sine", f, t, 0.09 * v, 0.015, 1.8, out); note("sine", f * 1.01, t, 0.05 * v, 0.015, 1.8, out); }
// tiap nada lewat pengatur kekuatan sendiri
function keras(out, v) { const g = actx.createGain(); g.gain.value = v; g.connect(out); setTimeout(() => g.disconnect(), 6000); return g; }

// Seberapa tegang suasana sekarang (0 = santai, 1 = bertarung, 2 = bos hampir kalah)
let tegang = 0;
function hitungTegang() {
  if (!P || mode === "select") return 0;
  const bos = monsters.find((m) => m.d.boss && !m.dead && m.aggro);
  if (bos) return 1 + (1 - bos.hp / bos.d.hp);
  return monsters.some((m) => !m.dead && m.aggro && !m.d.latihan && dist(m, P) < 420) ? 1 : 0;
}

function playStep(s, i, t, len) {
  const out = music.gain, sem = s.semangat ?? 0.5, F = s.frasa || 32, pos = i % F, frasaB = Math.floor(i / F) % 2 === 1 && sem >= 0.3;
  const kuat = pos % 8 === 0 ? 1.2 : pos % 4 === 0 ? 1.08 : pos % 2 === 0 ? 0.95 : 0.8;
  const v = () => kuat * rand(0.86, 1.06);
  const jt = () => t + rand(-0.006, 0.006) + (i % 2 ? (s.ayun || 0) * len : 0);   // meleset sedikit + ayun
  const f = at(s.notes, i), fi = at(s.fill, i), fb = at(s.bass, i);
  if (f) (SUARA[s.suara] || SUARA.saron)(f, jt(), len, keras(out, v()));
  if (fi) (SUARA[s.suaraIsian] || SUARA.peking)(fi, jt(), len, keras(out, v() * (frasaB ? 1.15 : 1)));
  if (fb) (SUARA[s.suaraBas] || SUARA.bas)(fb, jt(), len, keras(out, v()));
  // saron rangkap: melodi digandakan satu oktaf di ketukan kuat (lagu bersemangat)
  if (sem >= 0.8 && f && pos % 2 === 0) SUARA.peking(f, jt(), len, keras(out, 0.35 * v()));
  // bas berdenyut: nada bas terakhir diulang cepat di sela ketukan, mendorong lagu terus maju
  if (fb) music.basTerakhir = fb;
  if (sem >= 0.7 && !fb && music.basTerakhir && !s.once) SUARA.bas(music.basTerakhir, jt(), len * 0.5, keras(out, 0.3 + 0.15 * (sem - 0.7)));
  // imbal: peking memecah melodi (nada ini & nada berikutnya, satu oktaf lebih tinggi)
  if ((frasaB || sem >= 0.85 || tegang >= 1.4) && sem >= 0.4 && f) {
    const nx = at(s.notes, i + 1) || f;
    SUARA.peking(f * 2, jt(), len * 0.5, keras(out, 0.55 * v()));
    SUARA.peking(nx * 2, t + len * 0.5 + rand(-0.004, 0.004), len * 0.5, keras(out, 0.4 * v()));
  }
  // kendang: frasa B lebih rapat; 4 ketukan terakhir frasa = isian (rol)
  let d = at(s.drums, i);
  if (sem >= 0.3 && pos >= F - 4) d = ["t", "D", "t", "D"][pos - (F - 4)];
  else if (frasaB && !d && i % 2 === 1) d = "t";
  const p = at(s.perc, i);
  if (d) hit(d, jt(), keras(out, v()));
  // kendang ciblon: frasa B lagu bersemangat dimainkan dua kali lebih rapat
  if (frasaB && sem >= 0.8 && pos % 2 === 0) hit("t", t + len * 0.5 + rand(-0.004, 0.004), keras(out, 0.45 * v()));
  // naik menjelang akhir frasa: rol kendang makin keras di 8 ketukan terakhir
  if (sem >= 0.6 && pos >= F - 8) { const naik = (pos - (F - 8)) / 8; hit("t", t + len * 0.5, keras(out, 0.3 + 0.6 * naik)); if (pos >= F - 2) hit("x", jt(), keras(out, 0.8)); }
  if (p) hit(p, jt(), keras(out, 0.9 * v()));
  // struktur gamelan
  if (s.gong && i % s.gong === 0) gong(t, out);
  if (sem >= 0.3 && pos % 8 === 4) kempul(NADA_DASAR / 2 * (s.tangga === "pelog" ? 1.06 : 1.12), t, out, kuat);
  if (sem >= 0.3 && pos % 8 === 0 && pos) kenong(NADA_DASAR * (s.tangga === "pelog" ? 0.94 : 1), t, out, kuat);
  if (pos === 0 && i && sem >= 0.6) hit("B", t, out);
  // lapisan tarung: bas berdenyut & kecrek saat dikejar monster / melawan bos
  if (tegang >= 1 && !s.once) {
    if (i % 2 === 0 && fb !== undefined) SUARA.bas((fb || NADA_DASAR / 4), jt(), len * 0.6, keras(out, 0.45 + 0.25 * (tegang - 1)));
    if (i % 2 === 1) hit("x", jt(), keras(out, 0.6));
    if (tegang >= 1.5 && i % 4 === 2) hit("D", jt(), keras(out, 0.8));
  }
}
// Penjadwal: setiap 50 ms, siapkan nada untuk 0.2 detik ke depan agar ritme stabil.
function musicTick() {
  const s = SONGS[music.cur];
  if (!actx || !music.gain || !s || actx.state !== "running") return;
  tegang = s.once ? 0 : hitungTegang();
  const len = 60 / (s.tempo * (tegang > 1 ? 1 + 0.15 * (tegang - 1) : 1));   // bos makin lemah = makin cepat
  if (music.next < actx.currentTime - 0.5) music.next = actx.currentTime + 0.05;
  while (music.next < actx.currentTime + 0.2) {
    if (s.once && music.step >= s.notes.length) return;   // lagu sekali-main sudah habis
    playStep(s, music.step, music.next, len); music.next += len; music.step++;
  }
}
setInterval(musicTick, 50);

// ---------- Musik kemenangan ----------
// Memutar lagu sekali-main di atas segalanya, lalu kembali ke lagu tempat.
let jingle = null;
function playJingle(id) {
  const s = SONGS[id];
  if (!s) return;
  jingle = { id, until: performance.now() + (s.notes.length * 60 / s.tempo + 2.5) * 1000 };
  if (music.cur === id) music.cur = null;   // supaya lagu yang sama bisa diputar ulang
}

// Lagu mana yang cocok untuk tempat pemain sekarang?
function pickMusic() {
  if (!audioOn.musik || audioOn.volMusik <= 0) return null;
  if (jingle) { if (performance.now() < jingle.until) return jingle.id; jingle = null; }
  if (mode === "select" || !P) return "desa";
  if (monsters.some((m) => m.d.boss && !m.dead && m.aggro)) return "bos";
  return area.lagu;
}
const unlockAudio = () => { if (audio() && actx.state === "suspended" && !document.hidden) actx.resume(); };
addEventListener("pointerdown", unlockAudio);
addEventListener("keydown", unlockAudio);
