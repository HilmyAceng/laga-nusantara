// =====================================================================
// CATUR — ATURAN & LAWAN KOMPUTER (tanpa tampilan; tampilannya di 99d-catur-papan.js)
// Papan = 64 kotak (indeks baris*8+kolom, baris 0 = sisi hitam/atas, baris 7 = putih/bawah).
// Bidak = { t: "p"|"n"|"b"|"r"|"q"|"k", w: true (putih/pemain) | false (hitam/Pak Wowo) }.
// Aturan lengkap: langkah tiap bidak, rokade, en passant, promosi (otomatis menteri),
// skak, skakmat, remis (tanpa langkah / batas langkah). Khusus Laga Nusantara: karena
// penyerang bisa kalah duel & hilang, raja kadang tetap terancam di giliran lawan —
// lawan boleh menyerang raja itu ("Duel Takhta"); menang = permainan selesai.
// Lawan komputer: negamax + alpha-beta; kedalaman & keacakan sesuai tingkat kesulitan.
// =====================================================================
"use strict";

const CATUR_NILAI = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
const ARAH_KUDA = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
const ARAH_LURUS = [[-1, 0], [1, 0], [0, -1], [0, 1]], ARAH_SERONG = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
const dalamPapan = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

function caturAwal() {
  const b = Array(64).fill(null), baris = ["r", "n", "b", "q", "k", "b", "n", "r"];
  for (let c = 0; c < 8; c++) {
    b[c] = { t: baris[c], w: false }; b[8 + c] = { t: "p", w: false };
    b[48 + c] = { t: "p", w: true }; b[56 + c] = { t: baris[c], w: true };
  }
  return { b, putih: true, rokade: { wK: true, wQ: true, bK: true, bQ: true }, ep: -1, langkah: 0 };
}
const salinPapan = (s) => ({ b: s.b.map((x) => (x ? { ...x } : null)), putih: s.putih, rokade: { ...s.rokade }, ep: s.ep, langkah: s.langkah });

// kotak `i` diserang oleh sisi `olehPutih`?
function diserang(s, i, olehPutih) {
  const r = i >> 3, c = i & 7, b = s.b;
  const ada = (rr, cc, t) => { if (!dalamPapan(rr, cc)) return false; const x = b[rr * 8 + cc]; return x && x.w === olehPutih && t.includes(x.t); };
  const dp = olehPutih ? 1 : -1;   // pion putih menyerang ke atas (dari baris r+1)
  if (ada(r + dp, c - 1, "p") || ada(r + dp, c + 1, "p")) return true;
  for (const [dr, dc] of ARAH_KUDA) if (ada(r + dr, c + dc, "n")) return true;
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) if ((dr || dc) && ada(r + dr, c + dc, "k")) return true;
  const sinar = (arah, t) => { for (const [dr, dc] of arah) { let rr = r + dr, cc = c + dc; while (dalamPapan(rr, cc)) { const x = b[rr * 8 + cc]; if (x) { if (x.w === olehPutih && t.includes(x.t)) return true; break; } rr += dr; cc += dc; } } return false; };
  return sinar(ARAH_LURUS, "rq") || sinar(ARAH_SERONG, "bq");
}
const posisiRaja = (s, putih) => s.b.findIndex((x) => x && x.t === "k" && x.w === putih);
const kenaSkak = (s, putih) => { const k = posisiRaja(s, putih); return k >= 0 && diserang(s, k, !putih); };

// langkah semu (belum dicek meninggalkan raja dalam skak). m = { dari, ke, makan, ep, rokade, promosi }
function langkahSemu(s, putih) {
  const out = [], b = s.b;
  for (let i = 0; i < 64; i++) {
    const x = b[i]; if (!x || x.w !== putih) continue;
    const r = i >> 3, c = i & 7;
    const tambah = (ke, ext = {}) => { const t = b[ke]; out.push({ dari: i, ke, makan: !!t || !!ext.ep, ...ext, promosi: x.t === "p" && ((ke >> 3) === 0 || (ke >> 3) === 7) }); };
    if (x.t === "p") {
      const d = putih ? -1 : 1, mulai = putih ? 6 : 1;
      if (dalamPapan(r + d, c) && !b[(r + d) * 8 + c]) {
        tambah((r + d) * 8 + c);
        if (r === mulai && !b[(r + 2 * d) * 8 + c]) tambah((r + 2 * d) * 8 + c, { dobel: true });
      }
      for (const dc of [-1, 1]) {
        if (!dalamPapan(r + d, c + dc)) continue;
        const ke = (r + d) * 8 + c + dc, t = b[ke];
        if (t && t.w !== putih) tambah(ke);
        else if (ke === s.ep) tambah(ke, { ep: true });
      }
    } else if (x.t === "n" || x.t === "k") {
      const arah = x.t === "n" ? ARAH_KUDA : [...ARAH_LURUS, ...ARAH_SERONG];
      for (const [dr, dc] of arah) { if (!dalamPapan(r + dr, c + dc)) continue; const ke = (r + dr) * 8 + c + dc, t = b[ke]; if (!t || t.w !== putih) tambah(ke); }
      // rokade
      if (x.t === "k" && i === (putih ? 60 : 4) && !kenaSkak(s, putih)) {
        const k = putih ? "w" : "b", baris = putih ? 56 : 0;
        if (s.rokade[k + "K"] && !b[baris + 5] && !b[baris + 6] && b[baris + 7] && b[baris + 7].t === "r" && !diserang(s, baris + 5, !putih) && !diserang(s, baris + 6, !putih)) tambah(baris + 6, { rokade: "K" });
        if (s.rokade[k + "Q"] && !b[baris + 1] && !b[baris + 2] && !b[baris + 3] && b[baris] && b[baris].t === "r" && !diserang(s, baris + 3, !putih) && !diserang(s, baris + 2, !putih)) tambah(baris + 2, { rokade: "Q" });
      }
    } else {
      const arah = x.t === "r" ? ARAH_LURUS : x.t === "b" ? ARAH_SERONG : [...ARAH_LURUS, ...ARAH_SERONG];
      for (const [dr, dc] of arah) { let rr = r + dr, cc = c + dc; while (dalamPapan(rr, cc)) { const ke = rr * 8 + cc, t = b[ke]; if (!t) tambah(ke); else { if (t.w !== putih) tambah(ke); break; } rr += dr; cc += dc; } }
    }
  }
  return out;
}
// jalankan langkah pada salinan papan (langkah dianggap berhasil / tanpa duel)
function jalankanLangkah(s, m) {
  const n = salinPapan(s), b = n.b, x = b[m.dari];
  if (m.ep) b[m.ke + (x.w ? 8 : -8)] = null;
  b[m.ke] = m.promosi ? { t: "q", w: x.w } : x; b[m.dari] = null;
  if (m.rokade) { const baris = x.w ? 56 : 0; if (m.rokade === "K") { b[baris + 5] = b[baris + 7]; b[baris + 7] = null; } else { b[baris + 3] = b[baris]; b[baris] = null; } }
  // hak rokade hilang bila raja/benteng bergerak atau benteng dimakan
  const hapus = (i) => { if (i === 60) { n.rokade.wK = n.rokade.wQ = false; } if (i === 4) { n.rokade.bK = n.rokade.bQ = false; } if (i === 63) n.rokade.wK = false; if (i === 56) n.rokade.wQ = false; if (i === 7) n.rokade.bK = false; if (i === 0) n.rokade.bQ = false; };
  hapus(m.dari); hapus(m.ke);
  n.ep = m.dobel ? (m.dari + m.ke) / 2 : -1;
  n.putih = !s.putih; n.langkah = s.langkah + 1;
  return n;
}
// penyerang kalah duel: penyerang hilang, yang diserang tetap, giliran pindah
function langkahGagal(s, m) {
  const n = salinPapan(s);
  n.b[m.dari] = null;
  if (m.dari === 63) n.rokade.wK = false; if (m.dari === 56) n.rokade.wQ = false; if (m.dari === 7) n.rokade.bK = false; if (m.dari === 0) n.rokade.bQ = false;
  if (n.b[m.dari] === null && s.b[m.dari] && s.b[m.dari].t === "k") { /* raja penyerang kalah: ditangani pemanggil (kalah) */ }
  n.ep = -1; n.putih = !s.putih; n.langkah = s.langkah + 1;
  return n;
}
function langkahSah(s, putih = s.putih) {
  return langkahSemu(s, putih).filter((m) => !kenaSkak(jalankanLangkah(s, m), putih));
}
// keadaan permainan untuk sisi yang melangkah: "main" | "skakmat" | "remis"
function keadaanCatur(s) {
  if (posisiRaja(s, s.putih) < 0) return "skakmat";
  if (s.langkah >= 300) return "remis";
  if (langkahSah(s).length) return "main";
  return kenaSkak(s, s.putih) ? "skakmat" : "remis";
}

// ---------- Lawan komputer ----------
// tabel posisi sederhana (dari sisi putih; hitam dicerminkan)
const PST = {
  p: [0, 0, 0, 0, 0, 0, 0, 0, 50, 50, 50, 50, 50, 50, 50, 50, 10, 10, 20, 30, 30, 20, 10, 10, 5, 5, 10, 25, 25, 10, 5, 5, 0, 0, 0, 20, 20, 0, 0, 0, 5, -5, -10, 0, 0, -10, -5, 5, 5, 10, 10, -20, -20, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0],
  n: [-50, -40, -30, -30, -30, -30, -40, -50, -40, -20, 0, 0, 0, 0, -20, -40, -30, 0, 10, 15, 15, 10, 0, -30, -30, 5, 15, 20, 20, 15, 5, -30, -30, 0, 15, 20, 20, 15, 0, -30, -30, 5, 10, 15, 15, 10, 5, -30, -40, -20, 0, 5, 5, 0, -20, -40, -50, -40, -30, -30, -30, -30, -40, -50],
  b: [-20, -10, -10, -10, -10, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 10, 10, 5, 0, -10, -10, 5, 5, 10, 10, 5, 5, -10, -10, 0, 10, 10, 10, 10, 0, -10, -10, 10, 10, 10, 10, 10, 10, -10, -10, 5, 0, 0, 0, 0, 5, -10, -20, -10, -10, -10, -10, -10, -10, -20],
  r: [0, 0, 0, 0, 0, 0, 0, 0, 5, 10, 10, 10, 10, 10, 10, 5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, -5, 0, 0, 0, 0, 0, 0, -5, 0, 0, 0, 5, 5, 0, 0, 0],
  q: [-20, -10, -10, -5, -5, -10, -10, -20, -10, 0, 0, 0, 0, 0, 0, -10, -10, 0, 5, 5, 5, 5, 0, -10, -5, 0, 5, 5, 5, 5, 0, -5, 0, 0, 5, 5, 5, 5, 0, -5, -10, 5, 5, 5, 5, 5, 0, -10, -10, 0, 5, 0, 0, 0, 0, -10, -20, -10, -10, -5, -5, -10, -10, -20],
  k: [-30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -30, -40, -40, -50, -50, -40, -40, -30, -20, -30, -30, -40, -40, -30, -30, -20, -10, -20, -20, -20, -20, -20, -20, -10, 20, 20, 0, 0, 0, 0, 20, 20, 20, 30, 10, 0, 0, 10, 30, 20],
};
function nilaiPapan(s) {   // positif = baik untuk sisi yang melangkah
  let v = 0;
  for (let i = 0; i < 64; i++) { const x = s.b[i]; if (!x) continue; const p = CATUR_NILAI[x.t] + PST[x.t][x.w ? i : 63 - i]; v += x.w ? p : -p; }
  return s.putih ? v : -v;
}
function negamax(s, d, a, b) {
  const daftar = langkahSah(s);
  if (!daftar.length) return kenaSkak(s, s.putih) ? -100000 - d : 0;
  if (d === 0) return nilaiPapan(s);
  daftar.sort((x, y) => (y.makan ? CATUR_NILAI[(s.b[y.ke] || { t: "p" }).t] : 0) - (x.makan ? CATUR_NILAI[(s.b[x.ke] || { t: "p" }).t] : 0));
  let terbaik = -Infinity;
  for (const m of daftar) {
    const v = -negamax(jalankanLangkah(s, m), d - 1, -b, -a);
    if (v > terbaik) terbaik = v;
    if (v > a) a = v;
    if (a >= b) break;
  }
  return terbaik;
}
// pilih langkah komputer. tingkat: "santai" | "sedang" | "jago"
function langkahKomputer(s, tingkat) {
  const daftar = langkahSah(s); if (!daftar.length) return null;
  // raja lawan bisa diserang (Duel Takhta) → langsung serang
  const takhta = daftar.find((m) => s.b[m.ke] && s.b[m.ke].t === "k"); if (takhta) return takhta;
  const kedalaman = { santai: 1, sedang: 2, jago: 3 }[tingkat] || 2, acak = { santai: 140, sedang: 35, jago: 6 }[tingkat] || 30;
  let terbaik = null, nilaiTerbaik = -Infinity;
  for (const m of daftar) {
    const v = -negamax(jalankanLangkah(s, m), kedalaman - 1, -Infinity, Infinity) + Math.random() * acak;
    if (v > nilaiTerbaik) { nilaiTerbaik = v; terbaik = m; }
  }
  return terbaik;
}
