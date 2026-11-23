// =====================================================================
// KOMPATIBILITAS BROWSER LAMA
// Dimuat tepat setelah 00-galat.js. Menambal fitur browser baru yang belum ada
// di HP lama (mis. Chrome < 99, Safari iOS < 16), supaya game tidak error.
//  - ctx.roundRect(x, y, w, h, r): kotak bersudut bulat di kanvas (juga di Path2D).
//    Tanpa tambalan ini, HP lama error saat menggambar balon obrolan warga
//    dan layar tertahan hitam.
// =====================================================================
"use strict";

(() => {
  function roundRectTambal(x, y, w, h, r) {
    let rr = Array.isArray(r) ? r[0] : r;
    rr = Math.max(0, Math.min(+rr || 0, Math.abs(w) / 2, Math.abs(h) / 2));
    this.moveTo(x + rr, y);
    this.arcTo(x + w, y, x + w, y + h, rr);
    this.arcTo(x + w, y + h, x, y + h, rr);
    this.arcTo(x, y + h, x, y, rr);
    this.arcTo(x, y, x + w, y, rr);
    this.closePath();
  }
  if (window.CanvasRenderingContext2D && !CanvasRenderingContext2D.prototype.roundRect) CanvasRenderingContext2D.prototype.roundRect = roundRectTambal;
  if (window.Path2D && !Path2D.prototype.roundRect) Path2D.prototype.roundRect = roundRectTambal;
})();
