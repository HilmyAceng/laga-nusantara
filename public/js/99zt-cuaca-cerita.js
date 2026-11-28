// =====================================================================
// CUACA MENGIKUTI CERITA
// Cuaca tidak acak: hanya berubah sesuai langkah cerita yang sedang berjalan.
//  - CUACA_CERITA: dari [bab, ep] sampai [bab, ep] (termasuk), di area mana, cuaca apa.
//    Tambahan opsional:
//      sampaiTipe: "bos" → di ep terakhir, cuaca berhenti SETELAH langkah bertipe itu
//                          selesai (mis. badai reda begitu bos dikalahkan).
//      kilat: "#warna"   → warna kilat (bawaan putih kebiruan).
//  - Jenis:
//      "gerimis"    rintik tipis
//      "hujan"      hujan deras, langit gelap, kilat lembut sesekali
//      "hujanPetir" hujan deras + sambaran petir bercabang + gelegar
//      "badai"      hujan miring diterpa angin kencang, daun beterbangan, petir sering
//      "salju"      butiran salju pelan
//      "badaiSalju" butiran salju kencang & kabut putih
//  - Di luar daftar: cuaca acak dari 99zu-cuaca-acak.js (berganti tiap beberapa menit);
//    gua (area.gelap) tidak pernah kehujanan/kesaljuan.
//  - Pergantian cuaca memudar halus (keluar ±1,5 dtk, masuk ±2 dtk); saat pindah area langsung.
//  - Suara hujan/angin dibuat dari desis WebAudio (ikut volume efek suara). Suaranya diatur
//    pengatur waktu sendiri (bukan saat menggambar), jadi tetap terdengar saat jeda, peta,
//    menu, dialog, atau cutscene; baru hilang kalau cuacanya memang reda (atau pindah ke gua).
// =====================================================================
"use strict";

const CUACA_CERITA = [
  // Bab 8 "Istana Angin": badai berkilat ungu menutup Lembah Angin sampai Rajawali Petir sadar
  { dari: [8, 2], sampai: [8, 9], sampaiTipe: "bos", area: ["lembahAngin"], cuaca: "badai", kilat: "#c9a8ff" },
  { dari: [8, 6], sampai: [8, 9], sampaiTipe: "bos", area: ["istanaAwan"], cuaca: "hujanPetir", kilat: "#c9a8ff" },
  // Bab 13 ep 10 "Gerimis Pertama": Sembrani bebas, hujan pertama setelah empat puluh hari
  { dari: [13, 10], sampai: [13, 10], area: ["sabana", "kampungBatu"], cuaca: "hujan" },
  // Bab 17 "Jalan ke Atap Dunia": badai salju di lereng sampai Pelita Salju dinyalakan
  { dari: [17, 1], sampai: [17, 6], area: ["lereng"], cuaca: "badaiSalju" },
  // Bab 18-19: badai salju menutup Puncak Salju Abadi sampai Macan Putih mengaum lagi (ep 9)
  { dari: [18, 1], sampai: [19, 9], area: ["puncak"], cuaca: "badaiSalju" },
];

// ---------- Menentukan cuaca sekarang ----------
// Rentang tiap entri diubah jadi rentang indeks langkah CERITA (dihitung sekali).
function babLangkah(l) { const m = /(\d+)/.exec((l && l.bab) || ""); return m ? +m[1] : -1; }
let rentangCuaca = null;
function hitungRentangCuaca() {
  rentangCuaca = CUACA_CERITA.map((c) => {
    let a = -1, b = -1;
    CERITA.forEach((l, i) => {
      const k = babLangkah(l) * 100 + (l.ep || 0);
      if (a < 0 && k >= c.dari[0] * 100 + c.dari[1]) a = i;
      if (k <= c.sampai[0] * 100 + c.sampai[1]) b = i;
    });
    if (c.sampaiTipe) {   // berhenti sesudah langkah bertipe sampaiTipe pertama di ep terakhir
      const i = CERITA.findIndex((l) => babLangkah(l) === c.sampai[0] && l.ep === c.sampai[1] && l.tipe === c.sampaiTipe);
      if (i >= 0) b = i;
    }
    return [a, b];
  });
}
function entriCuacaKini() {
  if (!area || !P || mode === "select" || area.gelap || !S || !S.cerita) return null;
  if (!rentangCuaca) hitungRentangCuaca();
  const idx = S.cerita.idx;
  for (let n = 0; n < CUACA_CERITA.length; n++) {
    const c = CUACA_CERITA[n], r = rentangCuaca[n];
    if (c.area.includes(areaId) && r[0] >= 0 && idx >= r[0] && idx <= r[1]) return c;
  }
  const acak = typeof cuacaAcak === "function" ? cuacaAcak() : null;
  return acak ? { cuaca: acak, acak: true } : null;
}
function cuacaKini() { const c = entriCuacaKini(); return c ? c.cuaca : null; }

// ---------- Suara hujan & angin ----------
// Dua desis yang terus berputar: "hujan" (bandpass tinggi) & "angin" (lowpass yang naik-turun).
// Volumenya diatur tiap frame sesuai cuaca; tanpa cuaca keduanya diam.
let suaraCuaca = null;
function siapkanSuaraCuaca() {
  if (suaraCuaca || !actx || !noiseBuf) return suaraCuaca;
  try {
    const buat = (tipe, freq, q) => {
      const s = actx.createBufferSource(), f = actx.createBiquadFilter(), g = actx.createGain();
      s.buffer = noiseBuf; s.loop = true; f.type = tipe; f.frequency.value = freq; f.Q.value = q; g.gain.value = 0;
      s.connect(f).connect(g).connect(sfxBus); s.start();
      return { f, g };
    };
    suaraCuaca = { hujan: buat("bandpass", 2600, 0.6), angin: buat("lowpass", 500, 1.5) };
  } catch (e) { suaraCuaca = null; }
  return suaraCuaca;
}
const VOLUME_CUACA = {   // [hujan, angin]
  gerimis: [0.025, 0], hujan: [0.07, 0.01], hujanPetir: [0.09, 0.02], badai: [0.1, 0.07],
  salju: [0, 0.006], badaiSalju: [0, 0.08],
};
function aturSuaraCuaca(c, time) {
  if (!siapkanSuaraCuaca()) return;
  const v = VOLUME_CUACA[c] || [0, 0], t = actx.currentTime;
  suaraCuaca.hujan.g.gain.setTargetAtTime(v[0], t, 0.6);
  // angin bertiup naik-turun: hembusan tiap beberapa detik
  const hembus = 0.6 + 0.4 * Math.sin(time * 0.7) * Math.sin(time * 0.23 + 1);
  suaraCuaca.angin.g.gain.setTargetAtTime(v[1] * hembus, t, 0.4);
  suaraCuaca.angin.f.frequency.setTargetAtTime(350 + 500 * hembus, t, 0.4);
}

// Diperbarui 4× per detik, apa pun yang sedang terbuka di layar.
setInterval(() => { try { if (actx) aturSuaraCuaca(cuacaKini(), performance.now() / 1000); } catch (e) {} }, 250);

// ---------- Gambar ----------
let kilatCuaca = 0, kilatCuacaNanti = 6, waktuCuaca = 0, petirCuaca = null;
// Yang sedang tampil di layar (bisa beda dengan target saat memudar) & kekuatannya 0..1
let cuacaTampil = null, kuatCuaca = 0, areaCuaca = null;
function warnaKilat(hex, a) {
  const n = parseInt((hex || "#e6f0ff").slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}
// Sambaran petir bercabang dari atas layar ke satu titik di tanah.
function buatPetir() {
  const x0 = rand(W * 0.15, W * 0.85), y1 = rand(H * 0.35, H * 0.8), titik = [[x0, -10]];
  let x = x0, y = -10; const cabang = [];
  while (y < y1) {
    y += rand(18, 34); x += rand(-26, 26); titik.push([x, y]);
    if (Math.random() < 0.18) {   // cabang kecil
      const c = [[x, y]]; let cx = x, cy = y; const arah = Math.random() < 0.5 ? -1 : 1;
      for (let k = 0; k < 4; k++) { cy += rand(12, 24); cx += arah * rand(6, 22); c.push([cx, cy]); }
      cabang.push(c);
    }
  }
  return { titik, cabang, umur: 0.35 };
}
function garisPetir(ax, ay, pts) { ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo : ctx.moveTo).call(ctx, ax + p[0], ay + p[1])); ctx.stroke(); }

GAMBAR_ATAS.push(function (time) {
  const target = entriCuacaKini(), dt = Math.min(0.1, Math.max(0, time - waktuCuaca)); waktuCuaca = time;
  // memudar: cuaca lama surut dulu sampai habis, baru cuaca baru tumbuh
  if (areaCuaca !== areaId) { areaCuaca = areaId; cuacaTampil = target; kuatCuaca = 1; }
  else if ((cuacaTampil && cuacaTampil.cuaca) !== (target && target.cuaca)) {
    kuatCuaca -= dt / 1.5;
    if (kuatCuaca <= 0 || !cuacaTampil) { cuacaTampil = target; kuatCuaca = 0; }
  } else { cuacaTampil = target; kuatCuaca = Math.min(1, kuatCuaca + dt / 2); }
  const e = cuacaTampil, c = e && e.cuaca;
  if (!c || kuatCuaca <= 0) { petirCuaca = null; kilatCuaca = 0; return; }
  const ax = cam.x - W / 2, ay = cam.y - H / 2, kuat = kuatCuaca;
  ctx.save(); ctx.globalAlpha = kuat;
  gambarCuaca(e, c, time, dt, ax, ay, kuat);
  ctx.restore();
});
function gambarCuaca(e, c, time, dt, ax, ay, kuat) {
  if (c === "hujan" || c === "gerimis" || c === "hujanPetir" || c === "badai") {
    const deras = c !== "gerimis", badai = c === "badai", petir = c === "hujanPetir" || badai;
    const n = badai ? 230 : petir ? 190 : deras ? 160 : 55;
    const miring = badai ? 0.75 + 0.25 * Math.sin(time * 0.5) : 0.25;   // angin badai mendorong hujan ke samping
    ctx.fillStyle = badai ? "rgba(20,25,50,0.4)" : petir ? "rgba(22,28,58,0.36)" : deras ? "rgba(30,40,70,0.28)" : "rgba(40,50,80,0.12)";
    ctx.fillRect(ax, ay, W, H);   // langit mendung
    ctx.strokeStyle = deras ? "rgba(190,215,255,0.55)" : "rgba(200,220,255,0.4)"; ctx.lineWidth = deras ? 1.6 : 1.2;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const cepat = (deras ? 900 : 520) * (0.8 + (i % 4) * 0.1), pj = badai ? 26 : deras ? 22 : 12;
      const sx = ((i * 73.31 + time * cepat * (badai ? 0.75 : 0.22)) % (W + 120)) - 60, sy = ((i * 41.9 + time * cepat) % (H + 60)) - 30;
      ctx.moveTo(ax + sx, ay + sy); ctx.lineTo(ax + sx - pj * miring, ay + sy + pj);
    }
    ctx.stroke();
    // percikan di tanah
    ctx.strokeStyle = "rgba(210,230,255,0.45)"; ctx.lineWidth = 1;
    for (let i = 0; i < (deras ? 26 : 8); i++) {
      const fase = (time * 2.2 + i * 0.37) % 1, sx = (i * 131.7 + Math.floor(time * 2.2 + i * 0.37) * 211) % W, sy = (i * 89.3 + Math.floor(time * 2.2 + i * 0.37) * 157) % H;
      ctx.beginPath(); ctx.ellipse(ax + sx, ay + sy, 2 + fase * 7, 1 + fase * 2.5, 0, 0, 6.28); ctx.globalAlpha = kuat * (1 - fase); ctx.stroke();
    }
    ctx.globalAlpha = kuat;
    // badai: daun & ranting beterbangan, garis angin
    if (badai) {
      for (let i = 0; i < 14; i++) {
        const sx = ((i * 157.3 + time * (380 + (i % 3) * 90)) % (W + 80)) - 40, sy = ((i * 61.7 + Math.sin(time * 2 + i) * 30 + time * 40) % (H + 40)) - 20;
        ctx.save(); ctx.translate(ax + sx, ay + sy); ctx.rotate(time * (3 + (i % 4)) + i);
        ctx.fillStyle = i % 3 ? "rgba(90,130,60,0.8)" : "rgba(150,110,60,0.8)"; ctx.fillRect(-3, -1.5, 6, 3); ctx.restore();
      }
      ctx.strokeStyle = "rgba(220,230,255,0.18)"; ctx.lineWidth = 1.2; ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const sx = ((i * 211 + time * 700) % (W + 300)) - 150, sy = (i * 97.3) % H;
        ctx.moveTo(ax + sx, ay + sy); ctx.quadraticCurveTo(ax + sx + 60, ay + sy - 8, ax + sx + 130, ay + sy);
      }
      ctx.stroke();
    }
    // kilat: hujan deras = cahaya lembut sesekali; hujan petir & badai = sambaran + gelegar
    if (deras && kuat > 0.7) {
      kilatCuacaNanti -= dt;
      if (kilatCuacaNanti <= 0) {
        kilatCuaca = 1;
        if (petir) {
          petirCuaca = buatPetir(); kilatCuacaNanti = badai ? 3 + Math.random() * 5 : 4 + Math.random() * 6;
          if (typeof sfx !== "undefined" && sfx.thunder) setTimeout(() => sfx.thunder(), 150 + Math.random() * 500);
        } else kilatCuacaNanti = 7 + Math.random() * 9;
      }
      if (kilatCuaca > 0) { ctx.fillStyle = warnaKilat(e.kilat, (petir ? 0.32 : 0.22) * kilatCuaca); ctx.fillRect(ax, ay, W, H); kilatCuaca = Math.max(0, kilatCuaca - dt * 3.5); }
      if (petirCuaca) {
        const a = Math.min(1, petirCuaca.umur / 0.2), kedip = petirCuaca.umur > 0.2 || Math.sin(time * 90) > -0.3;
        if (kedip) {
          ctx.lineJoin = "round";
          ctx.strokeStyle = warnaKilat(e.kilat, 0.35 * a); ctx.lineWidth = 7; garisPetir(ax, ay, petirCuaca.titik);
          ctx.strokeStyle = `rgba(255,255,255,${0.95 * a})`; ctx.lineWidth = 2.2; garisPetir(ax, ay, petirCuaca.titik);
          ctx.lineWidth = 1.2; petirCuaca.cabang.forEach((cb) => garisPetir(ax, ay, cb));
        }
        petirCuaca.umur -= dt; if (petirCuaca.umur <= 0) petirCuaca = null;
      }
    }
    return;
  }
  // salju & badai salju
  const badai = c === "badaiSalju", n = badai ? 90 : 34;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  for (let i = 0; i < n; i++) {
    const sx = ((i * 97.13 + time * (badai ? 170 : 22) * (0.6 + (i % 5) * 0.15)) % (W + 40)) - 20;
    const sy = ((i * 53.7 + time * (badai ? 95 : 48) * (0.7 + (i % 3) * 0.2)) % (H + 40)) - 20;
    const goyang = badai ? 0 : Math.sin(time * 1.3 + i) * 8, r = badai ? 2.6 : 1.6 + (i % 3) * 0.5;
    ctx.fillRect(ax + sx + goyang, ay + sy, r, r);
  }
  if (badai) { ctx.fillStyle = "rgba(225,235,250,0.2)"; ctx.fillRect(ax, ay, W, H); }
}
