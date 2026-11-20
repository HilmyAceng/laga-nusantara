// =====================================================================
// PUZZLE URUTAN (gong, lonceng, lentera)
// Benda `saklar` berwarna disentuh sesuai urutan di TEKA_BARU[id].urutan.
// Benda `petunjuk` (prasasti/pahatan) membacakan petunjuknya.
// Salah urutan → semua padam dan muncul monster hukuman.
// =====================================================================
"use strict";

let urutanNyala = {};   // id puzzle → warna yang sudah dibunyikan/dinyalakan

TEKA_BICARA.petunjuk = function (n) {
  openDialog(n.name, t(TEKA_BARU[n.tekaId].petunjuk), [{ label: t("dlg.tutup"), primary: true, run: closeDialog }]);
};
TEKA_BICARA.saklar = function (n) {
  const id = n.tekaId, P0 = TEKA_BARU[id];
  if (tekaSelesai(id)) return openDialog(n.name, t("tk.sudah"), [{ label: t("dlg.tutup"), primary: true, run: closeDialog }]);
  const nyala = (urutanNyala[id] = urutanNyala[id] || []);
  if (nyala.includes(n.simbol)) return;
  nyala.push(n.simbol);
  spark(n.x, n.y - 40, WARNA_SIMBOL[n.simbol], 12);
  P0.gaya === "lentera" ? sfx.fire() : sfx.coin();
  if (P0.urutan[nyala.length - 1] !== n.simbol) {
    // salah: padam semua, monster hukuman muncul
    urutanNyala[id] = [];
    sfx.hurt(); shake = 0.3; toast(t("tk.salahUrutan"), false);
    if (P0.hukuman) { const a = rand(0, 6.28), m = makeMonster(P0.hukuman, { x: P.x + Math.cos(a) * 110, y: P.y + Math.sin(a) * 110 }); if (!solidAt(m.x, m.y)) { m.aggro = true; m.state = "chase"; monsters.push(m); } }
    return;
  }
  if (nyala.length === P0.urutan.length) selesaiTeka(id);
};
SAAT_MASUK_AREA.push(() => { urutanNyala = {}; });

// ---------- Gambar ----------
function gambarSaklar(n, time) {
  const x = n.x, y = n.y, id = n.tekaId, w = WARNA_SIMBOL[n.simbol];
  const aktif = tekaSelesai(id) || (urutanNyala[id] || []).includes(n.simbol), gaya = TEKA_BARU[id].gaya;
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 16, 5, 0, 0, 6.28); ctx.fill();
  if (aktif) {
    const g = ctx.createRadialGradient(x, y - 30, 4, x, y - 30, 60);
    g.addColorStop(0, w + "88"); g.addColorStop(1, w + "00");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y - 30, 60, 0, 6.28); ctx.fill();
  }
  if (gaya === "gong") {
    ctx.fillStyle = "#5b3a24"; ctx.fillRect(x - 18, y - 46, 4, 46); ctx.fillRect(x + 14, y - 46, 4, 46); ctx.fillRect(x - 20, y - 48, 40, 5);
    const goyang = aktif ? Math.sin(time * 20) * 1.5 : 0;
    ctx.fillStyle = "#c9a24a"; ctx.beginPath(); ctx.arc(x + goyang, y - 26, 13, 0, 6.28); ctx.fill();
    ctx.fillStyle = w; ctx.beginPath(); ctx.arc(x + goyang, y - 26, 6, 0, 6.28); ctx.fill();
  } else if (gaya === "lonceng") {
    ctx.fillStyle = "#8d8894"; ctx.fillRect(x - 2, y - 52, 4, 52);
    const ayun = Math.sin(time * (aktif ? 8 : 2) + x) * (aktif ? 0.4 : 0.1);
    ctx.save(); ctx.translate(x, y - 50); ctx.rotate(ayun);
    ctx.fillStyle = w; ctx.beginPath(); ctx.moveTo(-9, 18); ctx.quadraticCurveTo(-9, 0, 0, 0); ctx.quadraticCurveTo(9, 0, 9, 18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#1b1208"; ctx.beginPath(); ctx.arc(0, 20, 2.5, 0, 6.28); ctx.fill();
    ctx.restore();
  } else {
    ctx.fillStyle = "#3a3142"; ctx.fillRect(x - 2.5, y - 34, 5, 34);
    ctx.fillStyle = "#5d5868"; ctx.fillRect(x - 9, y - 50, 18, 18);
    ctx.fillStyle = aktif ? w : "#231c2b"; ctx.fillRect(x - 6, y - 47, 12, 12);
    if (aktif) { ctx.fillStyle = "#fff8"; ctx.beginPath(); ctx.arc(x, y - 41, 3 + Math.sin(time * 12) * 1, 0, 6.28); ctx.fill(); }
  }
  // warna di bawah nama (supaya jelas meski sedang padam)
  ctx.fillStyle = w; ctx.beginPath(); ctx.arc(x, y - 64, 5, 0, 6.28); ctx.fill();
  labelObjek(n, "#ffffff", 74);
}
GAMBAR_OBJEK.saklar = gambarSaklar;
GAMBAR_OBJEK.petunjuk = function (n, time) {
  const x = n.x, y = n.y;
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 18, 6, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#5d5868"; roundRect(ctx, x - 15, y - 40, 30, 40, 4); ctx.fill();
  ctx.fillStyle = "#77718a"; roundRect(ctx, x - 12, y - 37, 24, 32, 3); ctx.fill();
  const ur = TEKA_BARU[n.tekaId].urutan;
  ur.forEach((c, i) => { ctx.fillStyle = `rgba(255,255,255,${0.35 + 0.25 * Math.sin(time * 2 + i)})`; ctx.fillRect(x - 8, y - 33 + i * 6, 16 - (i % 2) * 5, 2); });
  labelObjek(n, "#c9b6ff", 50);
};
