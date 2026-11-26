// =====================================================================
// RUPA GERBANG: benda yang sesuai dengan cara berpindah area
//   kapal         perahu layar tertambat (berlayar antar-pulau/negeri)
//   sampan        perahu kecil bercadik (Desa Apung, Mercusuar, Gua Laut, Kuil Samudra)
//   rakit         rakit bambu di sungai (Lembah Tugu ↔ Kampung Rumah Panjang)
//   tangga        anak tangga batu (naik ke istana/menara/puncak, turun ke sumur/pustaka)
//   tanggaSalju   anak tangga berselimut salju (Lereng → Pondok → Puncak → Kelir)
//   tanggaPelangi Tangga Pelangi (Kuil Samudra ↔ Kampung Awan)
//   pintu         pintu kayu berbingkai (gudang, Menara Kala)
//   gapura        gapura bata terbelah (candi bentar) untuk taman, makam, candi
//   gerbangBayang gerbang bayang berpendar ungu (Makam Kuno ↔ Negeri Bayang)
//   mulutGua      mulut gua (keluar dari gua, masuk gua es)
// Jalan biasa (hutan, padang, desa) tetap jalan setapak tanpa benda.
// Perahu & rakit hanya tampak setelah gerbangnya terbuka (mis. kapal Pak Jala di bab 2).
// =====================================================================
"use strict";

const RUPA_GERBANG = {
  "pesisir>bandar": "kapal", "bandar>pesisir": "kapal", "bandar>labuhan": "kapal", "labuhan>bandar": "kapal",
  "bandar>mercusuar": "sampan", "mercusuar>bandar": "sampan", "bandar>desaApung": "sampan", "desaApung>bandar": "sampan",
  "desaApung>goaLaut": "sampan", "goaLaut>desaApung": "sampan", "bakau>kuil": "sampan", "kuil>bakau": "sampan",
  "lembahTugu>rumahPanjang": "rakit", "rumahPanjang>lembahTugu": "rakit",
  "kuil>awan": "tanggaPelangi", "awan>kuil": "tanggaPelangi",
  "lembahAngin>istanaAwan": "tangga", "istanaAwan>lembahAngin": "tangga", "hutanBatu>puncakNaga": "tangga", "puncakNaga>hutanBatu": "tangga",
  "menaraKala>singgasana": "tangga", "singgasana>menaraKala": "tangga", "kotaMati>pustakaKala": "tangga", "pustakaKala>kotaMati": "tangga",
  "candi>sumurCandi": "tangga", "sumurCandi>candi": "tangga", "lembahTugu>tuguAgung": "tangga", "tuguAgung>lembahTugu": "tangga",
  "candi>kawah": "tangga", "kawah>candi": "tangga",
  "lereng>pondok": "tanggaSalju", "pondok>lereng": "tanggaSalju", "pondok>puncak": "tanggaSalju", "puncak>pondok": "tanggaSalju",
  "puncak>kelir": "tanggaSalju", "kelir>puncak": "tanggaSalju",
  "gangLabuhan>gudang": "pintu", "gudang>gangLabuhan": "pintu", "kotaMati>menaraKala": "pintu", "menaraKala>kotaMati": "pintu",
  "istanaAwan>tamanGantung": "gapura", "tamanGantung>istanaAwan": "gapura", "sawah>makam": "gapura", "makam>sawah": "gapura",
  "candi>alam": "gapura", "alam>candi": "gapura", "labuhan>gangLabuhan": "gapura",
  "makam>perkemahan": "gerbangBayang", "perkemahan>makam": "gerbangBayang",
  "gua>alam": "mulutGua", "pondok>guaEs": "mulutGua", "guaEs>pondok": "mulutGua",
};
const BERAIR = new Set(["kapal", "sampan", "rakit"]);

// sisi gerbang: arah keluar dari area (N/S/W/E). Gerbang di tengah peta (rakit) memakai arah terdekat ke tepi.
function sisiGerbang(g) {
  if (g.y0 === 0) return "N"; if (g.y1 === MH - 1) return "S"; if (g.x0 === 0) return "W"; if (g.x1 === MW - 1) return "E";
  return g.x0 > MW / 2 ? "E" : "W";
}

GAMBAR_TANAH.push(function (time) {
  if (!area) return;
  for (const g of area.gerbang) {
    const jenis = RUPA_GERBANG[areaId + ">" + g.ke];
    if (!jenis) continue;
    const buka = typeof gerbangAsli === "function" ? gerbangAsli(g) : gerbangTerbuka(g);   // kunci asli gerbang (perahu ada begitu pelayarannya dibuka)
    if (BERAIR.has(jenis) && !buka) continue;
    const x0 = g.x0 * T, y0 = g.y0 * T, w = (g.x1 - g.x0 + 1) * T, h = (g.y1 - g.y0 + 1) * T, sisi = sisiGerbang(g);
    ctx.save();
    if (BERAIR.has(jenis)) gambarPerahuGerbang(jenis, x0, y0, w, h, sisi, time);
    else if (jenis.startsWith("tangga")) gambarTanggaGerbang(jenis, x0, y0, w, h, sisi, time);
    else if (jenis === "pintu") gambarPintuGerbang(x0, y0, w, h, sisi, buka);
    else if (jenis === "gapura") gambarGapura(x0, y0, w, h, sisi);
    else if (jenis === "gerbangBayang") gambarGerbangBayang(x0, y0, w, h, sisi, time);
    else if (jenis === "mulutGua") gambarMulutGua(x0, y0, w, h, sisi);
    ctx.restore();
  }
});

// ---------- Perahu & rakit ----------
function gambarPerahuGerbang(jenis, x0, y0, w, h, sisi, time) {
  // air di bawah (menutup papan dermaga di petak gerbang)
  ctx.fillStyle = area.kabut ? "#28403f" : "#2d6a96"; ctx.fillRect(x0, y0, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.18)"; ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) { const o = Math.sin(time * 2 + i) * 5; ctx.beginPath(); ctx.moveTo(x0 + 6 + o, y0 + 10 + i * (h / 3)); ctx.lineTo(x0 + 22 + o, y0 + 10 + i * (h / 3)); ctx.stroke(); }
  const cx = x0 + w / 2, cy = y0 + h / 2, mendatar = sisi === "E" || sisi === "W";
  const ayun = Math.sin(time * 1.6) * 2.5;
  ctx.translate(cx, cy + ayun); if (!mendatar) ctx.rotate(Math.PI / 2);
  if (sisi === "W" || sisi === "N") ctx.scale(-1, 1);   // haluan menghadap ke luar peta
  if (jenis === "rakit") {
    ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(-34, -22, 72, 48);
    for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? "#c9a66b" : "#b8935a"; roundRect(ctx, -36, -24 + i * 8, 72, 7, 3); ctx.fill(); }
    ctx.fillStyle = "#6b4a2a"; ctx.fillRect(-26, -26, 4, 52); ctx.fillRect(22, -26, 4, 52);   // pengikat
    ctx.strokeStyle = "#5b3a24"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(30, -18); ctx.lineTo(50, -40); ctx.stroke();      // galah
    return;
  }
  const L = jenis === "kapal" ? 46 : 34, B = jenis === "kapal" ? 13 : 9;
  ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.beginPath(); ctx.ellipse(2, 6, L, B + 4, 0, 0, 6.28); ctx.fill();
  // cadik (penyeimbang) kiri-kanan
  ctx.strokeStyle = "#6b4a2a"; ctx.lineWidth = 2.5;
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-10, s * (B + 14)); ctx.moveTo(10, 0); ctx.lineTo(10, s * (B + 14)); ctx.stroke(); ctx.fillStyle = "#8b5e3c"; roundRect(ctx, -26, s * (B + 14) - 3, 52, 6, 3); ctx.fill(); }
  // lambung
  ctx.fillStyle = "#8b5e3c"; ctx.beginPath(); ctx.moveTo(-L, 0); ctx.quadraticCurveTo(-L * 0.6, -B, 0, -B); ctx.quadraticCurveTo(L * 0.7, -B, L, -2); ctx.quadraticCurveTo(L * 0.7, B, 0, B); ctx.quadraticCurveTo(-L * 0.6, B, -L, 0); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#b5462a"; ctx.fillRect(-L * 0.6, -B + 3, L * 1.3, 3); ctx.fillStyle = "#f4b942"; ctx.fillRect(-L * 0.6, B - 6, L * 1.3, 2);
  ctx.fillStyle = "#5b3a24"; ctx.beginPath(); ctx.ellipse(0, 0, L * 0.7, B * 0.55, 0, 0, 6.28); ctx.fill();   // dalam perahu
  if (jenis === "kapal") {   // tiang & layar segitiga
    ctx.fillStyle = "#3a2618"; ctx.fillRect(-2, -2, 4, 4);
    ctx.fillStyle = "#f2e6c9"; ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(30 + Math.sin(time * 2) * 2, -36); ctx.lineTo(-24, -30); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(90,60,30,0.6)"; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.fillStyle = "#e5484d"; ctx.beginPath(); ctx.moveTo(-24, -30); ctx.lineTo(-30, -36); ctx.lineTo(-20, -34); ctx.fill();   // umbul-umbul
  } else { ctx.strokeStyle = "#3a2618"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-6, -4); ctx.lineTo(18, 12); ctx.stroke(); }   // dayung
}

// ---------- Anak tangga ----------
function gambarTanggaGerbang(jenis, x0, y0, w, h, sisi, time) {
  const vertikal = sisi === "N" || sisi === "S", n = 5;
  // tangga memanjang 2 petak ke dalam area dari tepi
  let gx = x0, gy = y0, gw = w, gh = h;
  if (sisi === "N") gh = 2 * T; else if (sisi === "S") { gy = y0 + h - 2 * T; gh = 2 * T; } else if (sisi === "W") gw = 2 * T; else { gx = x0 + w - 2 * T; gw = 2 * T; }
  const PELANGI = ["#ff6b6b", "#ffb347", "#ffe066", "#5ad17a", "#4aa8ff", "#b88cff"];
  for (let i = 0; i < n; i++) {
    // i = 0 anak tangga paling dekat tepi (paling tinggi/dalam)
    const k = i / n;
    const warna = jenis === "tanggaPelangi" ? PELANGI[i % PELANGI.length] : jenis === "tanggaSalju" ? (i % 2 ? "#dfe8f5" : "#eef3fb") : (i % 2 ? "#8d8894" : "#9a96a6");
    const gelap = jenis === "tanggaSalju" ? "rgba(120,150,190,0.45)" : "rgba(30,20,40,0.45)";
    ctx.fillStyle = warna;
    if (vertikal) {
      const ty = sisi === "N" ? gy + k * gh : gy + gh - (k + 1 / n) * gh;
      ctx.fillRect(gx - 6, ty, gw + 12, gh / n); ctx.fillStyle = gelap; ctx.fillRect(gx - 6, sisi === "N" ? ty + gh / n - 3 : ty, gw + 12, 3);
    } else {
      const tx = sisi === "W" ? gx + k * gw : gx + gw - (k + 1 / n) * gw;
      ctx.fillRect(tx, gy - 6, gw / n, gh + 12); ctx.fillStyle = gelap; ctx.fillRect(sisi === "W" ? tx + gw / n - 3 : tx, gy - 6, 3, gh + 12);
    }
  }
  // pagar batu di kedua sisi
  ctx.fillStyle = jenis === "tanggaSalju" ? "#c9d6ea" : jenis === "tanggaPelangi" ? "rgba(255,255,255,0.85)" : "#6f6a75";
  if (vertikal) { ctx.fillRect(gx - 12, gy, 6, gh); ctx.fillRect(gx + gw + 6, gy, 6, gh); }
  else { ctx.fillRect(gx, gy - 12, gw, 6); ctx.fillRect(gx, gy + gh + 6, gw, 6); }
  if (jenis === "tanggaPelangi") { ctx.fillStyle = `rgba(255,255,255,${0.2 + 0.15 * Math.sin(time * 3)})`; ctx.fillRect(gx, gy, gw, gh); }
}

// ---------- Pintu, gapura, gerbang bayang, mulut gua ----------
// semua digambar sebagai lubang di tepi peta dengan bingkai di kiri-kanannya
function bingkai(x0, y0, w, h, sisi) {
  const vertikal = sisi === "N" || sisi === "S";
  return vertikal ? { a: [x0 - 10, y0, 10, h], b: [x0 + w, y0, 10, h], lintang: [x0 - 10, sisi === "N" ? y0 : y0 + h - 10, w + 20, 10] }
    : { a: [x0, y0 - 10, w, 10], b: [x0, y0 + h, w, 10], lintang: [sisi === "W" ? x0 : x0 + w - 10, y0 - 10, 10, h + 20] };
}
function gambarPintuGerbang(x0, y0, w, h, sisi, buka) {
  const f = bingkai(x0, y0, w, h, sisi);
  ctx.fillStyle = "#1a1208"; ctx.fillRect(x0, y0, w, h);
  if (!buka) { ctx.fillStyle = "#6b4a2a"; ctx.fillRect(x0 + 2, y0 + 2, w - 4, h - 4); ctx.fillStyle = "#c9a24a"; ctx.beginPath(); ctx.arc(x0 + w / 2, y0 + h / 2, 3, 0, 6.28); ctx.fill(); }
  ctx.fillStyle = "#5b3a24"; for (const r of [f.a, f.b, f.lintang]) ctx.fillRect(...r);
  ctx.fillStyle = "#8b5e3c"; for (const r of [f.a, f.b]) ctx.fillRect(r[0] + 2, r[1] + 2, r[2] - 4, r[3] - 4);
}
function gambarGapura(x0, y0, w, h, sisi) {
  const vertikal = sisi === "N" || sisi === "S";
  // dua pilar bata bertingkat di kiri & kanan lubang gerbang
  const pilar = (px, py, pw, ph) => {
    ctx.fillStyle = "#8a3a2a"; ctx.fillRect(px, py, pw, ph);
    ctx.fillStyle = "#a8503a"; ctx.fillRect(px + 3, py + 3, pw - 6, ph - 6);
    ctx.fillStyle = "rgba(0,0,0,0.25)"; for (let i = 6; i < Math.max(pw, ph); i += 8) vertikal ? ctx.fillRect(px, py + i, pw, 1.5) : ctx.fillRect(px + i, py, 1.5, ph);
  };
  if (vertikal) { pilar(x0 - 22, y0 - 6, 20, h + 12); pilar(x0 + w + 2, y0 - 6, 20, h + 12); }
  else { pilar(x0 - 6, y0 - 22, w + 12, 20); pilar(x0 - 6, y0 + h + 2, w + 12, 20); }
}
function gambarGerbangBayang(x0, y0, w, h, sisi, time) {
  const cx = x0 + w / 2, cy = y0 + h / 2;
  const g = ctx.createRadialGradient(cx, cy, 4, cx, cy, Math.max(w, h));
  g.addColorStop(0, `rgba(184,140,255,${0.55 + 0.2 * Math.sin(time * 3)})`); g.addColorStop(1, "rgba(40,20,70,0)");
  ctx.fillStyle = g; ctx.fillRect(x0 - T, y0 - T, w + 2 * T, h + 2 * T);
  ctx.strokeStyle = "rgba(184,140,255,0.8)"; ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(cx, cy, 10 + i * 9, time * 2 + i, time * 2 + i + 3.5); ctx.stroke(); }
  const f = bingkai(x0, y0, w, h, sisi); ctx.fillStyle = "#2b2238"; for (const r of [f.a, f.b]) ctx.fillRect(...r);
}
function gambarMulutGua(x0, y0, w, h, sisi) {
  const cx = x0 + w / 2, cy = y0 + h / 2, es = area.salju;
  ctx.fillStyle = es ? "rgba(30,60,90,0.75)" : "rgba(10,6,14,0.75)";
  ctx.beginPath(); ctx.ellipse(cx, cy, w / 2 + 8, h / 2 + 8, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = es ? "#bfe8ff" : "#6f6a75";
  const vertikal = sisi === "N" || sisi === "S";
  for (let i = 0; i < 5; i++) {   // batu-batu di bibir gua
    const t = i / 4, px = vertikal ? x0 - 12 + t * (w + 24) : (sisi === "W" ? x0 + w : x0), py = vertikal ? (sisi === "N" ? y0 + h : y0) : y0 - 12 + t * (h + 24);
    ctx.beginPath(); ctx.arc(px, py, 7 + (i % 2) * 3, 0, 6.28); ctx.fill();
  }
}
