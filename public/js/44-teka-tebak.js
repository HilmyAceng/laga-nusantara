// =====================================================================
// PUZZLE TEBAK-TEBAKAN (Batu Bertanya, Patung Bertanya)
// Jawab semua teka-teki di TEKA_BARU[id].soal (teksnya di 02-bahasa.js).
// Pilihan jawaban diacak. Salah → muncul 2 monster hukuman, mulai lagi nanti.
// =====================================================================
"use strict";

TEKA_BICARA.batuTanya = function (n) {
  if (tekaSelesai(n.tekaId)) return openDialog(n.name, t("tk.tanyaSelesai"), [{ label: t("dlg.tutup"), primary: true, run: closeDialog }]);
  tanyaTebak(n, 0);
};
function tanyaTebak(n, i) {
  const P0 = TEKA_BARU[n.tekaId], r = P0.soal[i];
  const pilihan = r.a.map((k, j) => ({ k, benar: j === r.benar })).sort(() => Math.random() - 0.5);
  openDialog(`${n.name} (${i + 1}/${P0.soal.length})`, t(r.q), pilihan.map((p) => ({
    label: t(p.k),
    run: () => {
      if (!p.benar) {
        closeDialog(); sfx.hurt(); shake = 0.3; toast(t("tk.tanyaSalah"), false);
        for (let k = 0; k < 2; k++) { const a = rand(0, 6.28), m = makeMonster(P0.hukuman, { x: P.x + Math.cos(a) * 120, y: P.y + Math.sin(a) * 120 }); if (!solidAt(m.x, m.y)) { m.aggro = true; m.state = "chase"; monsters.push(m); } }
        return;
      }
      sfx.coin();
      if (i + 1 < P0.soal.length) tanyaTebak(n, i + 1);
      else { closeDialog(); selesaiTeka(n.tekaId); }
    },
  })));
}
GAMBAR_OBJEK.batuTanya = function (n, time) {
  const x = n.x, y = n.y, selesai = tekaSelesai(n.tekaId);
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 20, 6, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#5d5868"; ctx.fillRect(x - 12, y - 20, 24, 20);
  ctx.fillStyle = "#77718a"; ctx.beginPath(); ctx.arc(x, y - 34, 14, 0, 6.28); ctx.fill();
  ctx.fillStyle = selesai ? "#7dffa8" : `rgba(201,166,255,${0.6 + 0.4 * Math.sin(time * 3)})`;
  ctx.fillRect(x - 7, y - 37, 4, 3); ctx.fillRect(x + 3, y - 37, 4, 3);
  ctx.strokeStyle = "#231c2b"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y - 28, 5, 0.2, Math.PI - 0.2); ctx.stroke();
  labelObjek(n, "#c9a6ff", 58);
};
