// =====================================================================
// CUTSCENE CERITA (data di cerita/adegan.js)
// Memperluas sutradara cutscene (78-sutradara.js) dengan:
//  - tokoh (aktor) yang muncul di dekat hero dengan wujud NPC aslinya,
//  - berjalan (animasi kaki), menghadap, gelembung emosi (! ? … ♥),
//  - dialog bernama, narasi, judul, kamera ke tokoh.
// Pemicu:
//  - akhir bab   → sebelum pengumuman "Tamat · Bab n" (40-ganti-bab.js)
//  - setelah langkah cerita tertentu (kunci "b<n>e<m>:<tipe>"), setelah narasinya.
// Tiap cutscene diputar sekali per save (S.adeganLihat). Bisa dilewati seperti biasa.
// Juga dipakai fitur lain: putarNaskah(naskah, selesai) (mis. kisah NPC, 99z).
// =====================================================================
"use strict";

// ---------- Aktor ----------
let aktorAdegan = [], tweenAdegan = [], emosiAdegan = [], posAwalAdegan = { x: 0, y: 0 };
function titikRelatif([dx, dy]) {
  let x = posAwalAdegan.x + dx * T, y = posAwalAdegan.y + dy * T;
  if (solidAt(x, y)) for (let r = 1; r < 6; r++) {      // cari petak kosong terdekat
    const c = [[r, 0], [-r, 0], [0, r], [0, -r], [r, r], [-r, -r], [r, -r], [-r, r]].map(([a, b]) => [x + a * T * 0.5, y + b * T * 0.5]).find(([a, b]) => !solidAt(a, b));
    if (c) { [x, y] = c; break; }
  }
  return { x, y };
}
function munculkanAktor(id, di) {
  const asal = npcById(id) || NPC_DATA.find((n) => n.id === id) || {};
  const p = titikRelatif(di || [2, 0]);
  const a = { id: "aktor-" + id, aslinya: id, aktor: true, name: asal.name || namaPembicara(id), color: asal.color || "#6b5a8a", accent: asal.accent || "#f4b942", hat: asal.hat, hair: asal.hair,
    x: p.x, y: p.y, face: Math.atan2(P.y - p.y, P.x - p.x), moving: false, run: 0 };
  aktorAdegan = aktorAdegan.filter((x) => x.aslinya !== id); NPCS.push(a); aktorAdegan.push(a);
  for (let i = 0; i < 10; i++) parts.push({ x: a.x + rand(-12, 12), y: a.y, z: rand(0, 30), vz: rand(20, 50), vx: 0, vy: 0, life: 0.5, max: 0.5, color: "#e9e2d0", s: 4, float: true });
  return a;
}
const tokohId = (id) => (id === "pemain" || id === "hero" ? P : aktorAdegan.find((a) => a.aslinya === id) || NPCS.find((n) => n.id === id));
function hapusAktor(id) {
  const a = aktorAdegan.find((x) => x.aslinya === id); if (!a) return;
  aktorAdegan = aktorAdegan.filter((x) => x !== a);
  const i = NPCS.indexOf(a); if (i >= 0) NPCS.splice(i, 1);
}
function bersihkanAktor() { for (const a of [...aktorAdegan]) hapusAktor(a.aslinya); tweenAdegan = []; emosiAdegan = []; if (P) P.moving = false; }
function jalankanTokoh(ent, ke, lama) {
  if (!ent) return;
  tweenAdegan = tweenAdegan.filter((w) => w.ent !== ent);
  tweenAdegan.push({ ent, dari: { x: ent.x, y: ent.y }, ke, t: 0, lama: Math.max(0.2, lama || 1) });
}
// tween berjalan di luar update() (saat adegan, update() berhenti)
let lalutween = 0;
function detakTween(now) {
  const dt = Math.min(0.05, (now - (lalutween || now)) / 1000); lalutween = now;
  for (const w of tweenAdegan) {
    w.t += dt; const k = Math.min(1, w.t / w.lama), e = w.ent;
    e.x = w.dari.x + (w.ke.x - w.dari.x) * k; e.y = w.dari.y + (w.ke.y - w.dari.y) * k;
    e.face = Math.atan2(w.ke.y - w.dari.y, w.ke.x - w.dari.x); e.moving = k < 1; e.run = (e.run || 0) + dt * 10;
  }
  tweenAdegan = tweenAdegan.filter((w) => { if (w.t >= w.lama) { w.ent.moving = false; return false; } return true; });
  for (const m of emosiAdegan) m.t += dt;
  emosiAdegan = emosiAdegan.filter((m) => m.t < 1.6);
  requestAnimationFrame(detakTween);
}
requestAnimationFrame(detakTween);
GAMBAR_ATAS.push(function (time) {
  for (const m of emosiAdegan) {
    const e = m.ent; if (!e) continue;
    const muncul = Math.min(1, m.t * 6), y = e.y - 84 - Math.sin(Math.min(1, m.t * 4) * Math.PI) * 6;
    ctx.save(); ctx.globalAlpha = m.t > 1.3 ? (1.6 - m.t) / 0.3 : 1;
    ctx.translate(e.x, y); ctx.scale(muncul, muncul);
    ctx.fillStyle = "#fff"; ctx.strokeStyle = "#2b2238"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(0, 0, 13, 11, 0, 0, 6.28); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-4, 9); ctx.lineTo(0, 16); ctx.lineTo(3, 9); ctx.fill();
    ctx.fillStyle = m.ikon === "♥" ? "#e5484d" : m.ikon === "!" ? "#e5484d" : "#2b2238";
    ctx.font = "900 15px Nunito, sans-serif"; ctx.textAlign = "center"; ctx.fillText(m.ikon, 0, 5);
    ctx.restore();
  }
});
// aktor tidak bisa diajak bicara & tanpa tanda
{
  const bisaAsli = bisaBicara;
  bisaBicara = function (n) { if (n.aktor) return false; return bisaAsli(n); };
  const tandaAsli = tandaNpc;
  tandaNpc = function (n) { if (n.aktor) return null; return tandaAsli(n); };
}

// ---------- Naskah → langkah sutradara ----------
function susunNaskah(naskah) {
  const out = [];
  for (const L of naskah) {
    if (L.aktor) out.push({ lakukan: () => munculkanAktor(L.aktor, L.di) }, { tunggu: 0.35 });
    else if (L.jalan) {
      out.push({ lakukan: () => { const e = tokohId(L.jalan); if (e) jalankanTokoh(e, titikRelatif(L.ke), L.lama); } });
      if (!L.bareng) out.push({ tunggu: L.lama || 1 });
    }
    else if (L.hadap) out.push({ lakukan: () => { const a = tokohId(L.hadap), b = tokohId(L.ke); if (a && b) a.face = Math.atan2(b.y - a.y, b.x - a.x); } });
    else if (L.emosi) out.push({ lakukan: () => { const e = tokohId(L.emosi); if (e) emosiAdegan.push({ ent: e, ikon: L.ikon || "!", t: 0 }); sfx.click(); } }, { tunggu: 0.7 });
    else if (L.kata) out.push({ teks: Lx(L.teks), nama: namaPembicara(L.kata), lama: L.lama });
    else if (L.narasi) out.push({ teks: Lx(L.narasi), lama: L.lama });
    else if (L.judul) out.push({ judul: Lx(L.judul), sub: L.sub ? Lx(L.sub) : "", lama: L.lama });
    else if (L.kamera) {
      out.push({ lakukan: (A) => {
        const e = typeof L.kamera === "string" ? tokohId(L.kamera) : null;
        A.kamera = e ? { x: e.x, y: e.y - 30 } : Array.isArray(L.kamera) ? { x: posAwalAdegan.x + L.kamera[0] * T, y: posAwalAdegan.y + L.kamera[1] * T } : null;
      } }, { tunggu: L.lama || 1 });
    }
    else if (L.hapus) out.push({ lakukan: () => hapusAktor(L.hapus) });
    else if (L.suara) out.push({ lakukan: () => { const f = sfx[L.suara]; if (f) f(); } });
    else out.push(L);   // gelap, guncang, kilat, tunggu: langsung dipakai sutradara
  }
  return out;
}
function putarNaskah(naskah, selesai) {
  if (!naskah || adegan || !P) { if (selesai) selesai(); return; }
  posAwalAdegan = { x: P.x, y: P.y };
  mainkanAdegan(susunNaskah(naskah), () => { bersihkanAktor(); if (selesai) selesai(); });
}
const sudahLihatAdegan = (k) => !!(S.adeganLihat && S.adeganLihat[k]);
function tandaiAdegan(k) { S.adeganLihat = S.adeganLihat || {}; S.adeganLihat[k] = Date.now(); saveSoon(); }

// ---------- Pemicu: akhir bab ----------
const angkaBab = (teks) => { const m = /\d+/.exec(teks || ""); return m ? +m[0] : 0; };
{
  const asli = umumkanBab;
  umumkanBab = function (lama, baru, after) {
    const k = "akhir" + angkaBab(lama);
    if (!ADEGAN_CERITA[k] || sudahLihatAdegan(k)) return asli(lama, baru, after);
    tandaiAdegan(k);
    putarNaskah(ADEGAN_CERITA[k], () => asli(lama, baru, after));
  };
}
// ---------- Pemicu: setelah langkah cerita tertentu ----------
let adeganTertunda = null;
const kunciLangkah = (l) => `b${angkaBab(l.bab)}e${l.ep}:${l.tipe}`;
{
  const asli = selesaiLangkah;
  selesaiLangkah = function (putarTeks = true) {
    const l = langkahCerita();
    const k = l && kunciLangkah(l);
    if (!k || !ADEGAN_CERITA[k] || sudahLihatAdegan(k)) return asli(putarTeks);
    tandaiAdegan(k);
    if (putarTeks && l.teks && l.teks.length) { adeganTertunda = k; return asli(putarTeks); }   // diputar setelah narasi (lihat narasi di bawah)
    putarNaskah(ADEGAN_CERITA[k], () => asli(putarTeks));
  };
  const narasiAsli = narasi;
  narasi = function (baris, after) {
    if (!adeganTertunda) return narasiAsli(baris, after);
    const k = adeganTertunda; adeganTertunda = null;
    narasiAsli(baris, () => putarNaskah(ADEGAN_CERITA[k], after));
  };
}
