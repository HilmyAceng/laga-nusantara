// =====================================================================
// DROP LANGKA
//  - Bos cerita (pertama kali kalah): pasti menjatuhkan 1 jimat Langka + Serpih Pusaka.
//  - Bos Cermin Gaib tingkat N: peluang jimat Legenda khas bos itu naik tiap tingkat,
//    plus peluang jimat Langka. Pengaman nasib sial (pity): setelah sekian kali gagal,
//    Legenda berikutnya dijamin keluar (ATURAN.jimat.dropCermin).
//  - Monster biasa: peluang kecil Serpih Pusaka / jimat Biasa / Langka.
// Barang jatuh di tanah dengan cahaya sesuai rarity, dipungut seperti koin.
// =====================================================================
"use strict";

const jimatRarity = (r) => Object.keys(JIMAT).filter((id) => JIMAT[id].rarity === r);
// pilih jimat acak, utamakan yang belum dimiliki
function acakJimat(r) {
  const semua = jimatRarity(r), belum = semua.filter((id) => !bintangJimat(id));
  const pool = belum.length && Math.random() < 0.8 ? belum : semua;
  return pool[Math.floor(Math.random() * pool.length)];
}
const legendaBos = (jenis) => Object.keys(JIMAT).find((id) => JIMAT[id].bos === jenis);
function jatuhkanJimat(id, x, y) { pickups.push({ kind: "jimat", id, x: x + rand(-20, 20), y: y + rand(-10, 10), t: -0.4 }); }
function jatuhkanSerpih(n, x, y) { pickups.push({ kind: "serpih", v: n, x: x + rand(-20, 20), y: y + rand(-10, 10), t: 0 }); }

// monster biasa / bos cerita (dipanggil dari killMonster)
function dropMonster(m) {
  if (m.d.latihan) return;
  const D = ATURAN.jimat.dropMonster;
  if (m.d.boss) {
    if (!S.bos[m.type]) { jatuhkanJimat(acakJimat("langka"), m.x, m.y); jatuhkanSerpih(5, m.x, m.y); }
    else jatuhkanSerpih(2, m.x, m.y);
    return;
  }
  if (Math.random() < D.serpih) jatuhkanSerpih(1, m.x, m.y);
  if (Math.random() < D.biasa) jatuhkanJimat(acakJimat("biasa"), m.x, m.y);
  if (m.d.lv >= 13 && Math.random() < D.langka) jatuhkanJimat(acakJimat("langka"), m.x, m.y);
}
// bos Cermin Gaib tingkat n (dipanggil dari bosUlangKalah)
function dropCermin(m, n) {
  const D = ATURAN.jimat.dropCermin, leg = legendaBos(m.type);
  S.jimat.pity[m.type] = (S.jimat.pity[m.type] || 0) + 1;
  const peluang = D.legendaDasar + D.legendaPerTingkat * (n - 1);
  if (leg && (Math.random() < peluang || S.jimat.pity[m.type] >= D.pity)) {
    S.jimat.pity[m.type] = 0;
    jatuhkanJimat(leg, m.x, m.y);
    setTimeout(() => toast(t("drop.legenda"), true), 400);
  } else if (leg && S.jimat.pity[m.type] >= D.pity - 3) {
    setTimeout(() => toast(t("drop.hampir", { n: D.pity - S.jimat.pity[m.type] }), false), 1200);
  }
  if (Math.random() < D.langkaDasar + D.langkaPerTingkat * n) jatuhkanJimat(acakJimat("langka"), m.x, m.y);
  jatuhkanSerpih(n * 2, m.x, m.y);
}

// dipanggil dari pungut barang (15-update.js). true = barang ini milik drop langka
function ambilKhusus(k) {
  if (k.kind === "jimat") { beriJimat(k.id); spark(P.x, P.y - 30, WARNA_RARITY[JIMAT[k.id].rarity], 20); return true; }
  if (k.kind === "serpih") { beriSerpih(k.v); sfx.coin(); return true; }
  return false;
}

// gambar: jimat dengan berkas cahaya warna rarity, serpih = kristal ungu kecil
const GAMBAR_PICKUP = {
  jimat(k, time) {
    const c = WARNA_RARITY[JIMAT[k.id].rarity], b = Math.sin(time * 4 + k.x) * 3, leg = JIMAT[k.id].rarity === "legenda";
    ctx.save();
    const g = ctx.createLinearGradient(0, k.y - (leg ? 220 : 140), 0, k.y);
    g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(1, c + "aa");
    ctx.fillStyle = g; ctx.fillRect(k.x - (leg ? 10 : 6), k.y - (leg ? 220 : 140), leg ? 20 : 12, leg ? 220 : 140);
    ctx.shadowColor = c; ctx.shadowBlur = 16;
    ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(k.x, k.y - 22 + b); ctx.lineTo(k.x + 9, k.y - 12 + b); ctx.lineTo(k.x, k.y - 2 + b); ctx.lineTo(k.x - 9, k.y - 12 + b); ctx.closePath(); ctx.fill();
    ctx.restore();
  },
  serpih(k, time) {
    const b = Math.sin(time * 5 + k.x) * 2;
    ctx.fillStyle = "#b88cff"; ctx.beginPath(); ctx.moveTo(k.x, k.y - 14 + b); ctx.lineTo(k.x + 5, k.y - 7 + b); ctx.lineTo(k.x, k.y + b); ctx.lineTo(k.x - 5, k.y - 7 + b); ctx.closePath(); ctx.fill();
  },
};
