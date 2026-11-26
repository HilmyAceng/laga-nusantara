// =====================================================================
// NPC HIDUP
//  - WAKTU HARI: pagi → siang → sore → malam, satu putaran 16 menit (jam perangkat).
//    Ikon waktu tampil di nama area; sore & malam memberi warna langit tipis di luar ruangan.
//  - JADWAL: NPC dengan `jadwal` (05a-npc-arc2.js & di bawah) berjalan sendiri ke tempatnya
//    saat waktu berganti. Masuk area → langsung berdiri di tempat waktu sekarang.
//  - POSISI MENGIKUTI CERITA: `pindah: [{ sejak: [bab, ep], area, x, y }]` → NPC pindah tempat
//    setelah langkah cerita itu tercapai. `muncul: [bab, ep]` → NPC baru ada sejak langkah itu.
//  - BAHASA TUBUH: NPC menoleh ke pemain yang mendekat, berhenti berjalan, dan menyapa singkat
//    (sekali per kunjungan area), sesuai waktu hari.
// =====================================================================
"use strict";

const FASE_HARI = ["pagi", "siang", "sore", "malam"];
const IKON_FASE = { pagi: "🌅", siang: "☀️", sore: "🌇", malam: "🌙" };
const faseHari = () => FASE_HARI[Math.floor((Date.now() / 60000) % 16 / 4)];

// tempat NPC lama yang ikut bergerak di arc 2
Object.assign(npcById("sekar"), { pindah: [{ sejak: [19, 5], area: "puncak", x: 30.5, y: 20.4 }, { sejak: [20, 1], area: "kelir", x: 12.5, y: 24.4 }] });
Object.assign(npcById("lurah"), { jadwal: { pagi: [12.5, 8.5], siang: [12.5, 8.5], sore: [14.5, 13.5], malam: [11.5, 7.5] } });
Object.assign(npcById("dagang"), { jadwal: { pagi: [9.5, 14.5], siang: [9.5, 6.5], sore: [9.5, 14.5], malam: [9.5, 19.5] } });
Object.assign(npcById("jala"), { jadwal: { pagi: [33.5, 12.6], siang: [30.5, 12.6], sore: [30.5, 12.6], malam: [24.5, 9.5] } });
Object.assign(npcById("bahar"), { jadwal: { pagi: [11.5, 12.4], siang: [11.5, 12.4], sore: [6.5, 14.4], malam: [11.5, 12.4] } });

// warga keliling di desa-desa baru (69-warga-keliling.js)
Object.assign(WARGA, {
  labuhan: [{ jenis: "pedagang", x: 18, y: 18, jangkau: 4 }, { jenis: "pelaut", x: 9, y: 23, jangkau: 4 }, { jenis: "bocah", x: 28, y: 9, jangkau: 3 }, { jenis: "ibu", x: 6, y: 9, jangkau: 3 }],
  kampungBatu: [{ jenis: "tani", x: 12, y: 16, jangkau: 4 }, { jenis: "bocah", x: 25, y: 12, jangkau: 3.5 }, { jenis: "ibu", x: 30, y: 17, jangkau: 3 }],
  rumahPanjang: [{ jenis: "bocah", x: 15, y: 12, jangkau: 4 }, { jenis: "ibu", x: 26, y: 12, jangkau: 3 }, { jenis: "tani", x: 34, y: 18, jangkau: 3 }],
  pondok: [{ jenis: "pengungsi", x: 10, y: 15, jangkau: 3 }],
});

// ---------- Posisi mengikuti cerita ----------
const indeksLangkah = {};
function langkahKe(bab, ep) {
  const k = bab + ":" + ep;
  if (!(k in indeksLangkah)) indeksLangkah[k] = CERITA.findIndex((l) => angkaBab(l.bab) === bab && l.ep === ep);
  return indeksLangkah[k];
}
const sudahSampai = ([bab, ep]) => { const i = langkahKe(bab, ep); return !!S && i >= 0 && S.cerita.idx >= i; };
function terapkanPosisiCerita() {
  for (const n of NPC_DATA) {
    if (!n.asal) n.asal = { area: n.area, x: n.x, y: n.y };
    let tempat = n.asal;
    if (n.muncul && !sudahSampai(n.muncul)) tempat = { area: "_belum", x: n.asal.x, y: n.asal.y };
    for (const p of n.pindah || []) if (sudahSampai(p.sejak)) tempat = { area: p.area, x: p.x * T, y: p.y * T, pindahan: true };
    n.area = tempat.area;
    if (n.area !== n.areaLama || tempat.pindahan !== n.pindahan) { n.x = tempat.x; n.y = tempat.y; n.areaLama = n.area; n.pindahan = tempat.pindahan; }
  }
}
{
  const asli = loadArea;
  loadArea = function (id) {
    if (S) terapkanPosisiCerita();
    asli(id);
    // berdiri di tempat jadwal waktu sekarang
    const f = faseHari();
    for (const n of NPCS) if (n.jadwal && !n.pindahan && n.jadwal[f] && bisaDilewati(Math.floor(n.jadwal[f][0]), Math.floor(n.jadwal[f][1]))) { n.x = n.jadwal[f][0] * T; n.y = n.jadwal[f][1] * T; n.jalan = null; }
    faseTerakhir = f; sapaanArea = new Set();
    segarkanNamaArea();
  };
}
// cerita maju (bisa memindahkan NPC) → terapkan lagi tanpa pindah area
{
  const asli = selesaiLangkah;
  selesaiLangkah = function (putar) {
    asli(putar);
    if (!S || !area) return;
    const sebelum = NPC_DATA.map((n) => n.area).join("|");
    terapkanPosisiCerita();
    if (NPC_DATA.map((n) => n.area).join("|") !== sebelum) {
      const tetap = NPCS.filter((n) => !NPC_DATA.includes(n));
      NPCS = [...npcDi(areaId), ...tetap];
    }
  };
}

// ---------- Waktu hari ----------
let faseTerakhir = "", sapaanArea = new Set();
function segarkanNamaArea() {
  if (!area) return;
  const teks = `${IKON_FASE[faseHari()]} ${area.nama}`;
  if ($("areaName").textContent !== teks) $("areaName").textContent = teks;
}
{
  const asli = terapkanSemua;
  terapkanSemua = function () { asli(); segarkanNamaArea(); };
}
const diLuarRuangan = () => area && !area.gelap && area.tepi !== WALL;
GAMBAR_ATAS.push(function () {
  if (!area || mode === "select" || !diLuarRuangan() || store.get("laga.grafisRingan", false)) return;
  const f = faseHari();
  if (f !== "sore" && f !== "malam") return;
  ctx.fillStyle = f === "malam" ? "rgba(20,24,70,0.22)" : "rgba(255,140,60,0.08)";
  ctx.fillRect(cam.x - W, cam.y - H, W * 2, H * 2);
});

// ---------- Berjalan sesuai jadwal & menoleh ke pemain ----------
const bolehBergerak = (n) => n.jadwal && !n.kind && !n.aktor && !n.pindahan && (typeof pandu === "undefined" || !pandu || pandu.npc !== n) && !(typeof gerakCerita !== "undefined" && gerakCerita && gerakCerita.npc === n);
UPDATE_TAMBAHAN.push((dt) => {
  if (!P || !area) return;
  const f = faseHari();
  if (f !== faseTerakhir) {
    faseTerakhir = f; segarkanNamaArea();
    for (const n of NPCS) if (bolehBergerak(n) && n.jadwal[f] && bisaDilewati(Math.floor(n.jadwal[f][0]), Math.floor(n.jadwal[f][1]))) { n.jalan = cariJalur(n, [Math.floor(n.jadwal[f][0]), Math.floor(n.jadwal[f][1])]); n.jalanI = 0; n.jalanAkhir = { x: n.jadwal[f][0] * T, y: n.jadwal[f][1] * T }; }
  }
  for (const n of NPCS) {
    if (n.kind || n.aktor || n.id === "teman") continue;
    const dekat = Math.hypot(P.x - n.x, P.y - n.y);
    // menoleh & berhenti kalau pemain dekat
    if (dekat < 2.6 * T) {
      if (!n.moving || n.jalan) { n.face = Math.atan2(P.y - n.y, P.x - n.x); if (n.jalan) n.moving = false; }
      if (!sapaanArea.has(n.id) && n.obrolan && !n.warga && !n.warung && !n.pahat && dekat < 2.2 * T && mode === "play") { sapaanArea.add(n.id); sapaNpc(n); }
      if (n.jalan) continue;
    }
    if (!n.jalan || !bolehBergerak(n)) continue;
    const tuju = n.jalan[n.jalanI] || n.jalanAkhir;
    const dx = tuju.x - n.x, dy = tuju.y - n.y, d = Math.hypot(dx, dy), v = 60 * dt;
    if (d <= v) { n.x = tuju.x; n.y = tuju.y; if (n.jalanI < n.jalan.length) n.jalanI++; else { n.jalan = null; n.moving = false; } }
    else { n.x += (dx / d) * v; n.y += (dy / d) * v; n.face = Math.atan2(dy, dx); n.moving = true; n.run = (n.run || 0) + dt * 9; }
  }
});

// ---------- Sapaan singkat ----------
let sapaan = [];   // { n, teks, t }
const SAPA = {
  pagi: [["Pagi, Nak!", "Morning!"], ["Selamat pagi!", "Good morning!"], ["Sudah sarapan?", "Had breakfast yet?"]],
  siang: [["Panas sekali hari ini.", "Hot one today."], ["Halo!", "Hello!"], ["Mau ke mana, Nak?", "Where are you off to?"]],
  sore: [["Sore yang indah, ya.", "Lovely evening, isn't it?"], ["Mampir sebentar?", "Stopping by?"], ["Hati-hati, sebentar lagi gelap.", "Careful, it'll be dark soon."]],
  malam: [["Malam-malam begini masih berkelana?", "Still roaming at this hour?"], ["Jangan jauh-jauh dari api, Nak.", "Don't stray far from the fire."], ["Selamat malam.", "Good evening."]],
};
function sapaNpc(n) {
  const l = langkahCerita(), perluBicara = l && l.tipe === "bicara" && l.npc === n.id;
  const teks = perluBicara ? Lx(["Ah, kau datang! Ada yang ingin kubicarakan.", "Ah, you're here! There's something I need to tell you."]) : Lx(SAPA[faseHari()][Math.floor(Math.random() * 3)]);
  sapaan = sapaan.filter((s) => s.n !== n); sapaan.push({ n, teks, t: 0 });
}
UPDATE_TAMBAHAN.push((dt) => { for (const s of sapaan) s.t += dt; sapaan = sapaan.filter((s) => s.t < 2.8 && NPCS.includes(s.n)); });
GAMBAR_ATAS.push(function () {
  for (const s of sapaan) {
    const a = Math.min(1, (2.8 - s.t) * 2, s.t * 6);
    ctx.globalAlpha = a; ctx.font = "700 12px Nunito, sans-serif"; ctx.textAlign = "center";
    const w = ctx.measureText(s.teks).width + 16, x = s.n.x, y = s.n.y - 86;
    ctx.fillStyle = "rgba(20,14,34,0.88)"; roundRect(ctx, x - w / 2, y - 14, w, 22, 8); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - 5, y + 8); ctx.lineTo(x, y + 14); ctx.lineTo(x + 5, y + 8); ctx.fill();
    ctx.fillStyle = "#f7efe3"; ctx.fillText(s.teks, x, y + 1);
    ctx.globalAlpha = 1;
  }
});
