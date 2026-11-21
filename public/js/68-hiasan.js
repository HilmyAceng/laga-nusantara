// =====================================================================
// HIASAN DESA
// Benda & hewan penghias di desa-desa (tidak ada kaitannya dengan cerita):
//   warung, gerobak, perahu, jemuran, jemuran ikan, gentong, pot bunga, bangku,
//   lampion, tumpukan kayu, serta hewan yang bergerak sendiri: kucing & ayam.
// - Letaknya di HIASAN[areaId] (x, y = petak; titik bawah-tengah benda).
// - Benda `padat` tidak bisa ditembus (lewat padatTambahan di 04-peta.js).
// - Kucing berkeliaran / duduk / tidur, mengeong kalau didekati.
//   Ayam mematuk-matuk dan lari kecil kalau pemain terlalu dekat.
// Digambar ikut urutan kedalaman (BENDA_TINGGI di 16-gambar.js).
// =====================================================================
"use strict";

const HIASAN = {
  desa: [
    { k: "warung", x: 9, y: 4 }, { k: "kayu", x: 3.5, y: 4 }, { k: "gentong", x: 4.4, y: 7.7 },
    { k: "bangku", x: 14.5, y: 8.6 }, { k: "pot", x: 18.4, y: 7.7 }, { k: "pot", x: 14, y: 7.7 },
    { k: "jemuran", x: 6.5, y: 15.2 }, { k: "kucing", x: 4, y: 8.5, warna: "oranye" }, { k: "kucing", x: 19.5, y: 8, warna: "abu" },
    { k: "ayam", x: 3.5, y: 14.6 }, { k: "ayam", x: 4.6, y: 15.3, warna: "coklat" },
  ],
  pesisir: [
    { k: "warung", x: 12, y: 9, jual: "ikan" }, { k: "perahu", x: 10, y: 23.6 }, { k: "perahu", x: 26, y: 23.2 },
    { k: "jemuranIkan", x: 5, y: 23 }, { k: "gentong", x: 26, y: 5.7 }, { k: "kucing", x: 31.5, y: 9.6, warna: "belang" },
    { k: "ayam", x: 4.5, y: 19.5 }, { k: "ayam", x: 6, y: 20.2, warna: "coklat" }, { k: "pot", x: 11, y: 5.7 },
  ],
  bandar: [
    { k: "warung", x: 28, y: 12 }, { k: "gerobak", x: 15.5, y: 11 }, { k: "perahu", x: 9, y: 25.7 }, { k: "perahu", x: 30, y: 25.5 },
    { k: "gentong", x: 23.4, y: 7.7 }, { k: "pot", x: 16.5, y: 7.7 }, { k: "bangku", x: 34, y: 11.6 },
    { k: "kucing", x: 10, y: 22.6, warna: "hitam" }, { k: "kucing", x: 33.5, y: 8, warna: "oranye" },
  ],
  desaApung: [
    { k: "perahu", x: 3.5, y: 10.4 }, { k: "perahu", x: 33, y: 18.4 }, { k: "jemuranIkan", x: 10, y: 19.6 },
    { k: "gentong", x: 24, y: 19.7 }, { k: "pot", x: 22, y: 11.7 }, { k: "kucing", x: 10.5, y: 12.6, warna: "belang" }, { k: "kucing", x: 23, y: 4.6, warna: "abu" },
  ],
  awan: [
    { k: "warung", x: 12, y: 9 }, { k: "lampion", x: 15, y: 4.7 }, { k: "lampion", x: 19, y: 4.7 }, { k: "bangku", x: 22, y: 9.7 },
    { k: "pot", x: 5.5, y: 15.7 }, { k: "pot", x: 27.5, y: 17.7 }, { k: "kucing", x: 6, y: 10, warna: "abu" }, { k: "kucing", x: 29, y: 8, warna: "oranye" },
  ],
  perkemahan: [
    { k: "lampion", x: 13.5, y: 4.7 }, { k: "lampion", x: 18.5, y: 4.7 }, { k: "lampion", x: 13.5, y: 20.7 }, { k: "lampion", x: 19.5, y: 20.7 },
    { k: "gerobak", x: 27.5, y: 12 }, { k: "kayu", x: 5, y: 11.6 }, { k: "gentong", x: 8.5, y: 19.7 }, { k: "kucing", x: 8, y: 9.6, warna: "hitam" },
  ],
};
// benda padat: petak yang ditutupi, relatif terhadap petak titik (floor(x), floor(y - 0.01))
const PADAT_HIASAN = { warung: [[-1, 0], [0, 0]], gerobak: [[0, 0]], kayu: [[0, 0]] };
const HEWAN = new Set(["kucing", "ayam"]);
const WARNA_KUCING = { oranye: ["#e8913a", "#f6c17a"], abu: ["#8d8a94", "#c9c6cf"], hitam: ["#2b2633", "#4a4354"], belang: ["#f2ece2", "#e8913a"] };
const WARNA_AYAM = { putih: ["#f5f1e8", "#d94a3a"], coklat: ["#a9643a", "#d94a3a"] };

let hiasan = [], petakHiasan = new Set();

// siapkan hiasan area baru (dipanggil saat masuk area)
function siapkanHiasan() {
  hiasan = (HIASAN[areaId] || []).map((h) => ({ ...h, hx: h.x * T, hy: h.y * T, px: h.x * T, py: h.y * T, t: Math.random() * 5, keadaan: "diam", jeda: rand(1, 4), arah: 1, ngeong: 0, hati: 0 }));
  petakHiasan = new Set();
  for (const h of hiasan) for (const [dx, dy] of PADAT_HIASAN[h.k] || []) petakHiasan.add((Math.floor(h.x) + dx) + "," + (Math.floor(h.y - 0.01) + dy));
}
SAAT_MASUK_AREA.push(siapkanHiasan);
{ const lama = padatTambahan; padatTambahan = (tx, ty) => lama(tx, ty) || petakHiasan.has(tx + "," + ty); }

// ---------- Gerak hewan ----------
function kucingMeong(h) {
  if (typeof vokal !== "function") return;
  vokal({ f: rand(620, 760), f2: rand(420, 520), dur: 0.38, vol: 0.07, formant: VOKAL.e, type: "triangle", vib: 0.02, langsung: 0.5 });
}
function gerakHewan(h, dt) {
  h.t += dt; h.jeda -= dt; h.ngeong = Math.max(0, h.ngeong - dt); h.hati = Math.max(0, h.hati - dt);
  const dp = P && !P.dead ? Math.hypot(P.x - h.px, P.y - h.py) : 999;
  if (h.k === "kucing") {
    // didekati: mengeong + hati kecil, lalu duduk menatap pemain
    if (dp < 60 && h.ngeong <= 0) { h.ngeong = 7; h.hati = 1.2; h.keadaan = "diam"; h.jeda = 3; h.arah = P.x < h.px ? -1 : 1; kucingMeong(h); }
    if (h.jeda <= 0) {
      const r = Math.random();
      if (r < 0.45) { const a = rand(0, 6.28), d = rand(0.6, 1.8) * T; h.tx = h.hx + Math.cos(a) * d; h.ty = h.hy + Math.sin(a) * d * 0.6; h.keadaan = "jalan"; h.jeda = 6; }
      else if (r < 0.75) { h.keadaan = "diam"; h.jeda = rand(3, 6); }
      else { h.keadaan = "tidur"; h.jeda = rand(6, 12); }
    }
    if (h.keadaan === "jalan") langkahHewan(h, 34, dt);
  } else {
    // ayam: lari kecil menjauh kalau pemain terlalu dekat
    if (dp < 45 && h.keadaan !== "kabur") { const a = Math.atan2(h.py - P.y, h.px - P.x); h.tx = h.px + Math.cos(a) * 60; h.ty = h.py + Math.sin(a) * 40; h.keadaan = "kabur"; h.jeda = 1.2; }
    if (h.jeda <= 0) {
      if (Math.random() < 0.5) { const a = rand(0, 6.28), d = rand(0.4, 1.4) * T; h.tx = h.hx + Math.cos(a) * d; h.ty = h.hy + Math.sin(a) * d * 0.6; h.keadaan = "jalan"; h.jeda = 3; }
      else { h.keadaan = "patuk"; h.jeda = rand(1.5, 3.5); }
    }
    if (h.keadaan === "jalan" || h.keadaan === "kabur") langkahHewan(h, h.keadaan === "kabur" ? 110 : 45, dt);
  }
}
// melangkah menuju (tx, ty); berhenti kalau sampai, menabrak, atau terlalu jauh dari rumahnya
function langkahHewan(h, cepat, dt) {
  const dx = h.tx - h.px, dy = h.ty - h.py, d = Math.hypot(dx, dy);
  if (d < 3) { h.keadaan = h.k === "kucing" ? "diam" : "patuk"; h.jeda = rand(2, 5); return; }
  const nx = h.px + (dx / d) * cepat * dt, ny = h.py + (dy / d) * cepat * dt;
  if (Math.abs(dx) > 1) h.arah = dx < 0 ? -1 : 1;
  if (solidAt(nx, ny) || Math.hypot(nx - h.hx, ny - h.hy) > 2.4 * T) { h.keadaan = "diam"; h.jeda = rand(1, 3); return; }
  h.px = nx; h.py = ny;
}
UPDATE_TAMBAHAN.push((dt) => { for (const h of hiasan) if (HEWAN.has(h.k)) gerakHewan(h, dt); });

// ---------- Gambar ----------
const bayangan = (x, y, rx, ry = rx * 0.35) => { ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 6.28); ctx.fill(); };

const GAMBAR_HIASAN = {
  warung(h, time) {
    const x = h.px, y = h.py;
    bayangan(x, y, 42, 8);
    // tiang & meja
    ctx.fillStyle = "#6b4426"; ctx.fillRect(x - 36, y - 58, 4, 58); ctx.fillRect(x + 32, y - 58, 4, 58);
    ctx.fillStyle = "#8b5e3c"; ctx.fillRect(x - 38, y - 26, 76, 26);
    ctx.fillStyle = "#a8734a"; ctx.fillRect(x - 38, y - 28, 76, 5);
    ctx.fillStyle = "#6b4426"; for (let i = -30; i < 38; i += 12) ctx.fillRect(x + i, y - 22, 2, 20);
    // dagangan di meja
    if (h.jual === "ikan") {
      for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? "#9fb7c9" : "#c9d6df"; ctx.beginPath(); ctx.ellipse(x - 24 + i * 15, y - 31, 7, 3, 0, 0, 6.28); ctx.fill(); }
    } else {
      ctx.fillStyle = "#e8c35a"; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(x - 26 + i * 6, y - 32, 3.5, 0, 6.28); ctx.fill(); }   // pisang
      ctx.fillStyle = "#c97d3a"; ctx.fillRect(x - 6, y - 40, 10, 12); ctx.fillStyle = "#f2ece2"; ctx.fillRect(x - 6, y - 41, 10, 3);  // toples kerupuk
      ctx.fillStyle = "#5ab08a"; ctx.fillRect(x + 12, y - 38, 7, 10); ctx.fillStyle = "#d9534f"; ctx.fillRect(x + 22, y - 37, 7, 9);   // botol
    }
    // atap kain belang yang sedikit berkibar
    const kib = Math.sin(time * 2 + h.x) * 1.5;
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 ? "#f2ece2" : "#d94a3a";
      ctx.beginPath(); ctx.moveTo(x - 42 + i * 10.5, y - 60); ctx.lineTo(x - 42 + (i + 1) * 10.5, y - 60);
      ctx.lineTo(x - 42 + (i + 1) * 10.5, y - 50 + kib); ctx.lineTo(x - 42 + i * 10.5, y - 50 + kib); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = "#b03a2e"; ctx.fillRect(x - 42, y - 63, 84, 4);
    // papan nama
    ctx.fillStyle = "#3a2a1a"; ctx.fillRect(x - 22, y - 78, 44, 14);
    ctx.font = "900 9px Nunito, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#f4b942";
    ctx.fillText(t(h.jual === "ikan" ? "hias.warungIkan" : "hias.warung"), x, y - 68);
  },
  gerobak(h, time) {
    const x = h.px, y = h.py;
    bayangan(x, y, 22, 6);
    ctx.fillStyle = "#8b5e3c"; ctx.fillRect(x - 18, y - 24, 36, 14);
    ctx.fillStyle = "#a8734a"; ctx.fillRect(x - 18, y - 26, 36, 4);
    ctx.strokeStyle = "#6b4426"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x + 18, y - 18); ctx.lineTo(x + 32, y - 10); ctx.stroke();
    ctx.fillStyle = "#e8c35a"; ctx.beginPath(); ctx.arc(x - 8, y - 28, 5, 0, 6.28); ctx.arc(x + 4, y - 29, 5, 0, 6.28); ctx.fill();   // muatan
    ctx.fillStyle = "#c97d3a"; ctx.beginPath(); ctx.arc(x + 12, y - 28, 4, 0, 6.28); ctx.fill();
    ctx.strokeStyle = "#3a2a1a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x - 6, y - 7, 7, 0, 6.28); ctx.stroke();
    ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x - 13, y - 7); ctx.lineTo(x + 1, y - 7); ctx.moveTo(x - 6, y - 14); ctx.lineTo(x - 6, y); ctx.stroke();
  },
  perahu(h, time) {
    const x = h.px, y = h.py + Math.sin(time * 1.5 + h.x) * 1.5;
    bayangan(x, h.py + 2, 30, 6);
    ctx.fillStyle = "#6b4426"; ctx.beginPath(); ctx.moveTo(x - 32, y - 14); ctx.quadraticCurveTo(x, y + 4, x + 32, y - 14); ctx.lineTo(x + 26, y - 18); ctx.lineTo(x - 26, y - 18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2a9d8f"; ctx.fillRect(x - 24, y - 18, 48, 3);
    ctx.fillStyle = "#f4b942"; ctx.beginPath(); ctx.arc(x - 18, y - 11, 2.5, 0, 6.28); ctx.fill();   // mata perahu
    // cadik (penyeimbang)
    ctx.strokeStyle = "#a8734a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 12, y - 16); ctx.lineTo(x - 16, y - 2); ctx.moveTo(x + 12, y - 16); ctx.lineTo(x + 16, y - 2); ctx.stroke();
    ctx.fillStyle = "#8b5e3c"; ctx.fillRect(x - 22, y - 3, 44, 3);
  },
  jemuran(h, time) {
    const x = h.px, y = h.py;
    ctx.fillStyle = "#6b4426"; ctx.fillRect(x - 30, y - 40, 3, 40); ctx.fillRect(x + 27, y - 40, 3, 40);
    ctx.strokeStyle = "#ddd"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 28, y - 38); ctx.quadraticCurveTo(x, y - 33, x + 28, y - 38); ctx.stroke();
    const kain = ["#3d8bfd", "#f4b942", "#d94a3a", "#5ab08a"];
    for (let i = 0; i < 4; i++) {
      const kx = x - 22 + i * 13, ky = y - 37 + (i === 1 || i === 2 ? 2 : 1), ay = Math.sin(time * 3 + i) * 2;
      ctx.fillStyle = kain[i]; ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(kx + 10, ky); ctx.lineTo(kx + 10 + ay, ky + 14); ctx.lineTo(kx + ay, ky + 14); ctx.closePath(); ctx.fill();
    }
  },
  jemuranIkan(h, time) {
    const x = h.px, y = h.py;
    ctx.fillStyle = "#8b5e3c"; ctx.fillRect(x - 26, y - 22, 3, 22); ctx.fillRect(x + 23, y - 22, 3, 22); ctx.fillRect(x - 28, y - 24, 56, 4);
    ctx.fillStyle = "#c9b48a"; ctx.fillRect(x - 24, y - 14, 48, 3);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = "#b9c4cc"; ctx.beginPath(); ctx.ellipse(x - 18 + i * 9, y - 18, 3, 6, 0, 0, 6.28); ctx.fill(); }
  },
  gentong(h) {
    const x = h.px, y = h.py;
    bayangan(x, y, 11);
    ctx.fillStyle = "#a0522d"; ctx.beginPath(); ctx.ellipse(x, y - 11, 11, 12, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#8b4513"; ctx.fillRect(x - 7, y - 25, 14, 4);
    ctx.fillStyle = "#2d6a96"; ctx.beginPath(); ctx.ellipse(x, y - 25, 6, 2, 0, 0, 6.28); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x - 3, y - 12, 7, 3.6, 4.6); ctx.stroke();
  },
  pot(h, time) {
    const x = h.px, y = h.py;
    bayangan(x, y, 8);
    ctx.fillStyle = "#c0603a"; ctx.beginPath(); ctx.moveTo(x - 8, y - 12); ctx.lineTo(x + 8, y - 12); ctx.lineTo(x + 6, y); ctx.lineTo(x - 6, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#3f7d3a"; for (const [dx, dy] of [[-4, -16], [3, -18], [0, -21]]) { ctx.beginPath(); ctx.ellipse(x + dx, y + dy, 4, 6, dx * 0.1, 0, 6.28); ctx.fill(); }
    const goyang = Math.sin(time * 2 + h.x) * 0.8;
    ctx.fillStyle = h.x % 2 < 1 ? "#ff7eb6" : "#ffd166"; for (const [dx, dy] of [[-4, -22], [4, -23], [0, -26]]) { ctx.beginPath(); ctx.arc(x + dx + goyang, y + dy, 2.5, 0, 6.28); ctx.fill(); }
  },
  bangku(h) {
    const x = h.px, y = h.py;
    bayangan(x, y, 22, 5);
    ctx.fillStyle = "#6b4426"; ctx.fillRect(x - 18, y - 12, 3, 12); ctx.fillRect(x + 15, y - 12, 3, 12);
    ctx.fillStyle = "#a8734a"; ctx.fillRect(x - 22, y - 15, 44, 5);
    ctx.fillStyle = "#8b5e3c"; ctx.fillRect(x - 22, y - 26, 44, 4); ctx.fillRect(x - 18, y - 26, 3, 12); ctx.fillRect(x + 15, y - 26, 3, 12);
  },
  lampion(h, time) {
    const x = h.px, y = h.py, kedip = 0.7 + 0.3 * Math.sin(time * 6 + h.x * 3);
    const g = ctx.createRadialGradient(x, y - 44, 2, x, y - 44, 46);
    g.addColorStop(0, `rgba(255,190,90,${0.35 * kedip})`); g.addColorStop(1, "rgba(255,190,90,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y - 44, 46, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#4a3a2a"; ctx.fillRect(x - 2, y - 50, 4, 50); ctx.fillRect(x - 2, y - 52, 12, 3);
    ctx.fillStyle = `rgba(232,72,58,${0.85 + 0.15 * kedip})`; ctx.beginPath(); ctx.ellipse(x + 9, y - 42, 6, 8, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#f4b942"; ctx.fillRect(x + 6, y - 51, 6, 2); ctx.fillRect(x + 6, y - 35, 6, 2);
  },
  kayu(h) {
    const x = h.px, y = h.py;
    bayangan(x, y, 18, 5);
    for (const [dx, dy] of [[-9, -6], [3, -6], [-3, -15]]) {
      ctx.fillStyle = "#8b5e3c"; ctx.fillRect(x + dx - 8, y + dy - 4, 16, 9);
      ctx.fillStyle = "#c9a06a"; ctx.beginPath(); ctx.ellipse(x + dx + 8, y + dy + 0.5, 3, 4.5, 0, 0, 6.28); ctx.fill();
      ctx.strokeStyle = "#8b5e3c"; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x + dx + 8, y + dy + 0.5, 1.6, 0, 6.28); ctx.stroke();
    }
  },
  kucing(h, time) {
    const x = h.px, y = h.py, [w1, w2] = WARNA_KUCING[h.warna] || WARNA_KUCING.oranye, s = h.arah;
    bayangan(x, y, 11, 3.5);
    ctx.save(); ctx.translate(x, y); ctx.scale(s, 1);
    if (h.keadaan === "tidur") {
      // meringkuk bulat, ekor melingkar
      ctx.fillStyle = w1; ctx.beginPath(); ctx.ellipse(0, -6, 11, 6.5, 0, 0, 6.28); ctx.fill();
      ctx.beginPath(); ctx.arc(8, -8, 5, 0, 6.28); ctx.fill();
      ctx.beginPath(); ctx.moveTo(6, -12); ctx.lineTo(7, -16); ctx.lineTo(10, -12); ctx.fill();
      ctx.strokeStyle = w2; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.beginPath(); ctx.arc(0, -4, 9, 0.3, 2.6); ctx.stroke();
      ctx.restore();
      ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.font = "800 9px Nunito, sans-serif"; ctx.textAlign = "center";
      ctx.fillText("z", x + s * 12 + Math.sin(time * 2) * 2, y - 18 - (time * 6) % 8);
      return;
    }
    const jalan = h.keadaan === "jalan", kaki = jalan ? Math.sin(time * 14) * 2.5 : 0;
    // ekor bergoyang
    ctx.strokeStyle = w1; ctx.lineWidth = 3; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-9, -9); ctx.quadraticCurveTo(-16, -14 + Math.sin(time * 3) * 3, -13 + Math.sin(time * 3) * 2, -22); ctx.stroke();
    // badan & kaki
    ctx.fillStyle = w1;
    ctx.fillRect(-7 + kaki, -4, 3, 4); ctx.fillRect(4 - kaki, -4, 3, 4);
    ctx.beginPath(); ctx.ellipse(0, jalan ? -8 : -9, 10, jalan ? 5.5 : 6.5, 0, 0, 6.28); ctx.fill();
    if (h.warna === "belang") { ctx.fillStyle = w2; ctx.beginPath(); ctx.ellipse(-3, -11, 4, 3, 0, 0, 6.28); ctx.fill(); }
    // kepala & telinga
    ctx.fillStyle = w1; ctx.beginPath(); ctx.arc(9, -15, 6, 0, 6.28); ctx.fill();
    ctx.beginPath(); ctx.moveTo(5, -19); ctx.lineTo(6, -25); ctx.lineTo(9, -20); ctx.fill();
    ctx.beginPath(); ctx.moveTo(10, -20); ctx.lineTo(13, -25); ctx.lineTo(14, -18); ctx.fill();
    // mata (berkedip sesekali)
    const kedip = (time + h.x) % 4 < 0.15;
    ctx.fillStyle = h.warna === "hitam" ? "#ffd166" : "#1b1208";
    if (kedip) ctx.fillRect(8, -16, 5, 1); else { ctx.fillRect(8.5, -17, 1.6, 2.2); ctx.fillRect(11.5, -17, 1.6, 2.2); }
    ctx.fillStyle = "#ff8fa3"; ctx.fillRect(14, -14.5, 1.5, 1.5);
    ctx.restore();
    if (h.hati > 0) { ctx.fillStyle = `rgba(255,110,150,${Math.min(1, h.hati)})`; ctx.font = "12px sans-serif"; ctx.textAlign = "center"; ctx.fillText("♥", x, y - 30 - (1.2 - h.hati) * 12); }
  },
  ayam(h, time) {
    const x = h.px, y = h.py, [w1, jengger] = WARNA_AYAM[h.warna] || WARNA_AYAM.putih, s = h.arah;
    bayangan(x, y, 8, 3);
    ctx.save(); ctx.translate(x, y); ctx.scale(s, 1);
    const patuk = h.keadaan === "patuk" && Math.sin(time * 9 + h.x) > 0.3;
    const lari = h.keadaan === "kabur" || h.keadaan === "jalan", kaki = lari ? Math.sin(time * 18) * 2 : 0;
    ctx.strokeStyle = "#e8a33a"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-2 + kaki, -5); ctx.lineTo(-2 + kaki, 0); ctx.moveTo(2 - kaki, -5); ctx.lineTo(2 - kaki, 0); ctx.stroke();
    ctx.fillStyle = w1; ctx.beginPath(); ctx.ellipse(0, -9, 7, 5.5, 0, 0, 6.28); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-6, -11); ctx.lineTo(-11, -16); ctx.lineTo(-7, -8); ctx.fill();   // ekor
    const kx = patuk ? 8 : 6, ky = patuk ? -6 : -15;
    ctx.beginPath(); ctx.arc(kx, ky, 3.6, 0, 6.28); ctx.fill();
    ctx.fillStyle = jengger; ctx.fillRect(kx - 1.5, ky - 6, 3, 3);
    ctx.fillStyle = "#e8a33a"; ctx.beginPath(); ctx.moveTo(kx + 3, ky - 1); ctx.lineTo(kx + 6.5, ky); ctx.lineTo(kx + 3, ky + 1.2); ctx.fill();
    ctx.fillStyle = "#1b1208"; ctx.fillRect(kx + 0.8, ky - 1.6, 1.4, 1.4);
    ctx.restore();
  },
};

BENDA_TINGGI.push((time) => hiasan.map((h) => ({ y: h.py, f: () => GAMBAR_HIASAN[h.k](h, time) })));
