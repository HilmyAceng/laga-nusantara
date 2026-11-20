// =====================================================================
// MUSIK LATAR
// Memainkan LAGU dari config.js (notasi slendro) dan memilih lagu sesuai area.
// =====================================================================
"use strict";

// ---------- Musik latar ----------
// Notasi di LAGU (config.js) diubah jadi frekuensi. Slendro = 5 nada per oktaf
// dengan jarak kira-kira sama, jadi nada ke-n = dasar × 2^(n/5).
const SLENDRO = { 1: 0, 2: 1, 3: 2, 5: 3, 6: 4 }, NADA_DASAR = 293.66;
function parseNote(tok) {
  const deg = SLENDRO[tok[0]];
  if (deg === undefined) return null;               // "." atau tanda lain = diam
  let oct = 0;
  for (const ch of tok.slice(1)) oct += ch === "'" ? 1 : ch === "," ? -1 : 0;
  return NADA_DASAR * Math.pow(2, oct + deg / 5);
}
const SONGS = {};
for (const [id, s] of Object.entries(LAGU)) {
  SONGS[id] = { ...s, notes: s.melodi.trim().split(/\s+/).map(parseNote), drums: (s.kendang || "").replace(/\s+/g, "") };
}
const music = { cur: null, gain: null, step: 0, next: 0 };

// Ganti lagu dengan crossfade: lagu lama memudar, lagu baru masuk pelan.
function playMusic(id) {
  if (music.cur === id || !audio()) return;
  const t = actx.currentTime;
  if (music.gain) { const old = music.gain; old.gain.setTargetAtTime(0.0001, t, 0.4); setTimeout(() => old.disconnect(), 3000); }
  music.cur = id; music.gain = null;
  if (!id || !SONGS[id]) return;
  const g = actx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.setTargetAtTime(1, t + 0.3, 0.5); g.connect(musicBus);
  music.gain = g; music.step = 0; music.next = t + 0.3;
}
function note(type, f, t, vol, attack, decay, out, lowpass) {
  const o = actx.createOscillator(), g = actx.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  let src = o;
  if (lowpass) { const fl = actx.createBiquadFilter(); fl.type = "lowpass"; fl.frequency.value = lowpass; o.connect(fl); src = fl; }
  src.connect(g).connect(out); o.start(t); o.stop(t + attack + decay + 0.05);
}
function playStep(s, i, t, len) {
  const out = music.gain, f = s.notes[i % s.notes.length];
  if (f) {
    if (s.suara === "saron") { note("triangle", f, t, 0.08, 0.004, len * 2.2, out); note("sine", f * 2.76, t, 0.015, 0.002, len * 0.5, out); }
    else if (s.suara === "bonang") { note("sine", f, t, 0.1, 0.01, len * 3, out); note("sine", f * 2, t, 0.02, 0.01, len * 1.2, out); }
    else { note("sawtooth", f, t, 0.05, 0.08, len * 4, out, 420); note("sine", f / 2, t, 0.05, 0.1, len * 4, out); }
  }
  const d = s.drums.length ? s.drums[i % s.drums.length] : ".", wait = t - actx.currentTime;
  if (d === "D") tone(120, 0.25, "sine", 0.14, 0.45, wait, out);
  else if (d === "t") hiss(0.06, 0.05, "bandpass", 2200, 1800, wait, out, 1.5);
  if (s.gong && i % s.gong === 0) {   // gong: dua nada rendah yang sedikit beda → bunyi "berombak"
    note("sine", NADA_DASAR / 4, t, 0.16, 0.02, 3.5, out);
    note("sine", NADA_DASAR / 4 * 1.006, t, 0.1, 0.02, 3.5, out);
  }
}
// Penjadwal: setiap 50 ms, siapkan nada untuk 0.2 detik ke depan agar ritme stabil.
function musicTick() {
  if (!actx || !music.gain || actx.state !== "running") return;
  const s = SONGS[music.cur], len = 60 / s.tempo;
  if (music.next < actx.currentTime - 0.5) music.next = actx.currentTime + 0.05;
  while (music.next < actx.currentTime + 0.2) { playStep(s, music.step, music.next, len); music.next += len; music.step++; }
}
setInterval(musicTick, 50);

// Lagu mana yang cocok untuk tempat pemain sekarang?
function pickMusic() {
  if (!audioOn.musik || audioOn.volMusik <= 0) return null;
  if (mode === "select" || !P) return "desa";
  if (monsters.some((m) => m.d.boss && !m.dead && m.aggro)) return "bos";
  return area.lagu;
}
const unlockAudio = () => { if (audio() && actx.state === "suspended" && !document.hidden) actx.resume(); };
addEventListener("pointerdown", unlockAudio);
addEventListener("keydown", unlockAudio);
