// =====================================================================
// GARIS TEPI TEKS
// Semua tulisan di kanvas permainan (nama monster, nama warga, penanda, angka
// damage, label objek, dst.) otomatis diberi garis tepi gelap supaya terbaca
// di atas latar apa pun: rumput, salju, air, malam.
// Caranya: ctx.fillText dibungkus. Sebelum huruf diisi, garis tepinya digambar dulu.
//  - Tulisan berwarna gelap (mis. "!" di lencana emas, teks di gelembung putih,
//    bayangan teks) tidak diberi garis, karena garis gelap justru membuatnya tebal.
//  - Tulisan yang baru saja diberi strokeText sendiri tidak digaris dua kali.
// Matikan sementara: garisTeks.aktif = false.
// =====================================================================
"use strict";

const garisTeks = { aktif: true, warna: "rgba(10,6,20,0.85)" };
{
  const isiAsli = ctx.fillText.bind(ctx), garisAsli = ctx.strokeText.bind(ctx);
  let terakhir = null;   // strokeText terakhir: [teks, x, y]
  const terang = new Map();   // warna → apakah cukup terang untuk diberi garis gelap
  function warnaTerang(w) {
    if (typeof w !== "string") return true;   // gradien / pola: anggap terang
    if (terang.has(w)) return terang.get(w);
    let r = 255, g = 255, b = 255, a = 1, m;
    if ((m = w.match(/^#([0-9a-f]{3,8})$/i))) {
      let h = m[1]; if (h.length <= 4) h = h.split("").map((c) => c + c).join("");
      r = parseInt(h.slice(0, 2), 16); g = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16);
      if (h.length === 8) a = parseInt(h.slice(6, 8), 16) / 255;
    } else if ((m = w.match(/rgba?\(([^)]+)\)/i))) {
      const p = m[1].split(",").map(parseFloat); [r, g, b] = p; if (p.length > 3) a = p[3];
    }
    const hasil = a > 0.35 && (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.38;
    terang.set(w, hasil); return hasil;
  }
  ctx.strokeText = function (t, x, y, maks) { terakhir = [t, x, y]; return maks == null ? garisAsli(t, x, y) : garisAsli(t, x, y, maks); };
  ctx.fillText = function (t, x, y, maks) {
    const sudah = terakhir && terakhir[0] === t && terakhir[1] === x && terakhir[2] === y;
    terakhir = null;
    if (garisTeks.aktif && !sudah && warnaTerang(ctx.fillStyle)) {
      const px = parseFloat((ctx.font.match(/(\d+(?:\.\d+)?)px/) || [0, 14])[1]);
      const lw = ctx.lineWidth, ss = ctx.strokeStyle, lj = ctx.lineJoin, ml = ctx.miterLimit;
      ctx.lineWidth = Math.max(2.5, Math.min(6, px * 0.2)); ctx.strokeStyle = garisTeks.warna; ctx.lineJoin = "round"; ctx.miterLimit = 2;
      if (maks == null) garisAsli(t, x, y); else garisAsli(t, x, y, maks);
      ctx.lineWidth = lw; ctx.strokeStyle = ss; ctx.lineJoin = lj; ctx.miterLimit = ml;
    }
    return maks == null ? isiAsli(t, x, y) : isiAsli(t, x, y, maks);
  };
}
