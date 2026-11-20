// =====================================================================
// AUDIO & EFEK SUARA
// Semua suara dibuat dengan WebAudio, tanpa file audio.
// Jalur suara: efek → sfxBus ┐
//              musik → musicBus ┴→ penguat → pembatas → speaker
// =====================================================================
"use strict";

const AUDIO_KEY = "laga.audio";
// Pilihan pemain (tersimpan): nyala/mati + volume. Volume awal dari ATURAN.audio.
const audioOn = Object.assign({ musik: true, sfx: true, volMusik: ATURAN.audio.musik, volSfx: ATURAN.audio.sfx }, store.get(AUDIO_KEY, {}));
let actx = null, sfxBus = null, musicBus = null, noiseBuf = null;

// Browser baru mengizinkan suara setelah pemain menyentuh/menekan sesuatu.
function audio() {
  if (actx) return actx;
  try {
    actx = new (window.AudioContext || window.webkitAudioContext)();
    // Pembatas (limiter): hanya menahan puncak yang terlalu keras supaya tidak pecah.
    const comp = actx.createDynamicsCompressor();
    comp.threshold.value = -6; comp.knee.value = 4; comp.ratio.value = 8;
    comp.attack.value = 0.003; comp.release.value = 0.15;
    comp.connect(actx.destination);
    // Penguat keseluruhan (ATURAN.audio.penguat), sebelum pembatas.
    const master = actx.createGain(); master.gain.value = ATURAN.audio.penguat;
    master.connect(comp);
    sfxBus = actx.createGain(); sfxBus.connect(master);
    musicBus = actx.createGain(); musicBus.connect(master);
    sfxBus.gain.value = musicBus.gain.value = 0;
    applyVolume();
    // 1 detik desis acak: bahan untuk ayunan, ledakan, gendang
    noiseBuf = actx.createBuffer(1, actx.sampleRate, actx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  } catch (e) { actx = null; }
  return actx;
}
function applyVolume() {
  if (!actx) return;
  const t = actx.currentTime;
  sfxBus.gain.setTargetAtTime(audioOn.sfx ? audioOn.volSfx : 0, t, 0.05);
  musicBus.gain.setTargetAtTime(audioOn.musik ? audioOn.volMusik : 0, t, 0.2);
}
function setAudio(kind, on) {
  audioOn[kind] = on;
  const key = kind === "musik" ? "volMusik" : "volSfx";
  if (on && audioOn[key] <= 0) audioOn[key] = kind === "musik" ? ATURAN.audio.musik : ATURAN.audio.sfx;
  store.set(AUDIO_KEY, audioOn);
  audio(); applyVolume(); refreshAudioButtons();
}
// Tombol − / + mengubah volume 10% sekali tekan.
function changeVolume(kind, delta) {
  const key = kind === "musik" ? "volMusik" : "volSfx";
  audioOn[key] = clamp(Math.round((audioOn[key] + delta) * 10) / 10, 0, 1);
  audioOn[kind] = audioOn[key] > 0;
  store.set(AUDIO_KEY, audioOn);
  audio(); applyVolume(); refreshAudioButtons();
  if (kind === "sfx") sfx.coin();       // contoh bunyi supaya terdengar besar-kecilnya
}
function refreshAudioButtons() {
  for (const [kind, key, p] of [["musik", "volMusik", "mus"], ["sfx", "volSfx", "sfx"]]) {
    const v = audioOn[key], on = audioOn[kind], lvl = Math.round(v * 10);
    $(p + "Bar").innerHTML = Array.from({ length: 10 }, (_, i) => `<i class="${i < lvl ? "on" : ""}"></i>`).join("");
    $(p + "Bar").classList.toggle("off", !on);
    $(p + "Val").textContent = on ? `${lvl * 10}%` : t("set.mati");
    $(p + "Down").disabled = lvl <= 0;
    $(p + "Up").disabled = lvl >= 10;
    const btn = kind === "musik" ? $("btnMusic") : $("btnSfx");
    btn.textContent = t(on ? "set.nyala" : "set.mati");
    btn.setAttribute("aria-pressed", String(on));
    btn.setAttribute("aria-label", t("vol.aria", { jenis: t(kind === "musik" ? "vol.musik" : "vol.sfx"), status: t(on ? "vol.ariaNyala" : "vol.ariaMati") }));
  }
}

// Nada: osilator dengan amplop (cepat naik, pelan turun).
// slide = nada meluncur (0.5 = turun satu oktaf), delay = mulai berapa detik lagi.
function tone(freq, dur, type = "sine", vol = 0.05, slide = 1, delay = 0, bus = null) {
  if (!audio()) return;
  try {
    const t = actx.currentTime + Math.max(0, delay), o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide !== 1) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(bus || sfxBus); o.start(t); o.stop(t + dur + 0.02);
  } catch (e) {}
}
// Desis yang disaring: lowpass = berat/gemuruh, highpass = tajam, bandpass = "wus".
function hiss(dur, vol, filter = "lowpass", freq = 1200, freqEnd = freq, delay = 0, bus = null, q = 1) {
  if (!audio()) return;
  try {
    const t = actx.currentTime + Math.max(0, delay), s = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
    s.buffer = noiseBuf;
    f.type = filter; f.Q.value = q; f.frequency.setValueAtTime(freq, t);
    if (freqEnd !== freq) f.frequency.exponentialRampToValueAtTime(freqEnd, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f).connect(g).connect(bus || sfxBus); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.02);
  } catch (e) {}
}

// Resep efek suara: tiap efek = gabungan nada + desis.
const sfx = {
  swing:  () => { hiss(0.14, 0.12, "bandpass", 700, 2600, 0, null, 1.2); tone(300, 0.08, "triangle", 0.02, 0.6); },
  heavy:  () => { hiss(0.24, 0.16, "bandpass", 350, 1300); tone(140, 0.12, "triangle", 0.03, 0.6); },
  arrow:  () => { tone(620, 0.12, "triangle", 0.05, 0.55); hiss(0.08, 0.05, "highpass", 3000); },
  fire:   () => { hiss(0.3, 0.1, "lowpass", 400, 2400); tone(110, 0.25, "sawtooth", 0.025, 1.8); },
  boom:   () => { tone(90, 0.35, "sine", 0.16, 0.4); hiss(0.35, 0.12, "lowpass", 1200, 200); },
  hit:    () => { tone(160, 0.12, "sine", 0.16, 0.45); hiss(0.07, 0.1, "lowpass", 2500, 600); },
  crit:   () => { sfx.hit(); tone(1250, 0.18, "square", 0.035, 0.7); hiss(0.12, 0.07, "highpass", 2000, 5000); },
  hurt:   () => { tone(220, 0.22, "sawtooth", 0.06, 0.5); hiss(0.12, 0.1, "lowpass", 1800, 400); },
  dash:   () => { hiss(0.28, 0.14, "bandpass", 500, 3500, 0, null, 0.8); tone(240, 0.25, "sawtooth", 0.03, 2.2); },
  volley: () => { for (let i = 0; i < 3; i++) tone(640 + i * 40, 0.12, "triangle", 0.04, 0.55, i * 0.04); hiss(0.12, 0.06, "highpass", 3000); },
  quake:  () => { tone(60, 0.7, "sine", 0.25, 0.5); tone(45, 0.8, "triangle", 0.12, 0.7, 0.03); hiss(0.6, 0.2, "lowpass", 600, 80); },
  pillar: () => { hiss(0.7, 0.14, "lowpass", 300, 3000, 0.25); tone(80, 0.6, "sawtooth", 0.04, 3, 0.25); },
  roll:   () => hiss(0.18, 0.07, "bandpass", 900, 300, 0, null, 0.7),
  coin:   () => { tone(1320, 0.08, "triangle", 0.05); tone(1760, 0.16, "triangle", 0.05, 1, 0.06); },
  item:   () => [784, 988, 1175].forEach((f, i) => tone(f, 0.25, "triangle", 0.05, 1, i * 0.07)),
  level:  () => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.3, "triangle", 0.06, 1, i * 0.09)),
  quest:  () => [392, 523, 659].forEach((f, i) => tone(f, 0.3, "triangle", 0.06, 1, i * 0.11)),
  drink:  () => { for (let i = 0; i < 5; i++) tone(rand(350, 600), 0.07, "sine", 0.05, 1.6, i * 0.06); tone(520, 0.3, "sine", 0.04, 1.5, 0.32); },
  talk:   () => tone(880, 0.07, "sine", 0.04, 1.2),
  door:   () => { hiss(0.5, 0.05, "lowpass", 1400, 300); tone(196, 0.5, "sine", 0.05, 0.7); },
  click:  () => tone(660, 0.05, "triangle", 0.035),
  start:  () => { tone(392, 0.18, "triangle", 0.06); tone(587, 0.3, "triangle", 0.06, 1, 0.11); },
  charge: () => { tone(160, 0.25, "sawtooth", 0.05, 1.4); hiss(0.3, 0.08, "lowpass", 300, 900); },
  growl:  () => { tone(70, 0.7, "sawtooth", 0.06, 0.8); hiss(0.6, 0.08, "lowpass", 400, 150); },
  slam:   () => { tone(55, 0.8, "sine", 0.3, 0.5); hiss(0.6, 0.22, "lowpass", 900, 100); },
  claw:   () => hiss(0.12, 0.08, "bandpass", 1800, 900, 0, null, 2),
  die:    () => { hiss(0.3, 0.1, "lowpass", 1500, 200); tone(300, 0.25, "triangle", 0.04, 0.4); },
  faint:  () => [440, 392, 330, 262].forEach((f, i) => tone(f, 0.35, "triangle", 0.05, 1, i * 0.16)),
  // pemanggilan bos: desis naik + dengung rendah; petir: gelegar; zap: sambaran kecil
  summon: () => { hiss(1.3, 0.09, "bandpass", 250, 2600, 0, null, 2); tone(55, 1.5, "sawtooth", 0.05, 2.2); tone(110, 1.3, "sine", 0.05, 1.5, 0.2); },
  thunder: () => { hiss(0.08, 0.3, "highpass", 3000, 3000); hiss(1.2, 0.25, "lowpass", 2500, 120, 0.03); tone(55, 1.0, "sine", 0.2, 0.5); },
  zap:    () => hiss(0.15, 0.12, "highpass", 5000, 2000),
  win:    () => [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, 0.45, "triangle", 0.06, 1, i * 0.12)),
};
