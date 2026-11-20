// =====================================================================
// PUZZLE MEMORI (lempeng yang berkedip)
// Sentuh `batuMemori` untuk mulai. Lempeng (`lempengMemori`) berkedip satu per
// satu; setelah itu injak lempeng dengan urutan yang sama. Tiap ronde urutannya
// bertambah satu, dari TEKA_BARU[id].mulai sampai .sampai. Salah injak →
// kena setrum kecil, monster hukuman muncul, dan ronde diulang.
// =====================================================================
"use strict";

let lempengMem = [];   // { teka, i, tx, ty }
let memori = null;     // { teka, urutan, fase: "tunjuk" | "injak", k, t, nyala, ronde }
let injakTadi = null;

SAAT_MASUK_AREA.push((id) => {
  memori = null; injakTadi = null;
  lempengMem = (AREAS[id].objek || []).filter((o) => o.kind === "lempengMemori").map((o) => ({ teka: o.id, i: o.i, tx: Math.floor(o.x), ty: Math.floor(o.y) }));
});
const lempengTeka = (id) => lempengMem.filter((l) => l.teka === id);

TEKA_BICARA.batuMemori = function (n) {
  const id = n.tekaId;
  if (tekaSelesai(id)) return openDialog(n.name, t("tk.sudah"), [{ label: t("dlg.tutup"), primary: true, run: closeDialog }]);
  openDialog(n.name, t("tk.memoriTanya"), [
    { label: t("dlg.nanti"), run: closeDialog },
    { label: t("tk.memoriMulai"), primary: true, run: () => { closeDialog(); mulaiRonde(id, TEKA_BARU[id].mulai); } },
  ]);
};
function mulaiRonde(id, ronde) {
  const lp = lempengTeka(id), urutan = [];
  for (let i = 0; i < ronde; i++) { let k; do k = Math.floor(Math.random() * lp.length); while (k === urutan[i - 1]); urutan.push(k); }
  memori = { teka: id, urutan, fase: "tunjuk", k: 0, t: -0.8, nyala: -1, ronde };
  toast(t("tk.memoriRonde", { n: ronde - TEKA_BARU[id].mulai + 1, max: TEKA_BARU[id].sampai - TEKA_BARU[id].mulai + 1 }), false);
}
UPDATE_TAMBAHAN.push((dt) => {
  if (!memori) return;
  const lp = lempengTeka(memori.teka);
  if (memori.fase === "tunjuk") {
    memori.t += dt;
    const langkah = 0.75;
    const k = Math.floor(memori.t / langkah);
    memori.nyala = memori.t >= 0 && memori.t % langkah < 0.5 && k < memori.urutan.length ? memori.urutan[k] : -1;
    if (memori.t >= 0 && memori.t % langkah < dt && k < memori.urutan.length) sfx.coin();
    if (k >= memori.urutan.length) { memori.fase = "injak"; memori.k = 0; memori.nyala = -1; notifItem(t("tk.memoriGiliran")); }
    return;
  }
  // giliran pemain: injak lempeng
  const tx = Math.floor(P.x / T), ty = Math.floor(P.y / T);
  const l = lp.find((x) => x.tx === tx && x.ty === ty);
  const kode = l ? l.i : null;
  if (kode === injakTadi) return;
  injakTadi = kode;
  if (kode === null) return;
  const iPad = lp.indexOf(l);
  memori.nyala = iPad; memori.nyalaT = 0.3;
  if (memori.urutan[memori.k] !== iPad) {
    sfx.zap(); hurtPlayer(maxHp() * 0.08, 0, null); toast(t("tk.memoriSalah"), false);
    const P0 = TEKA_BARU[memori.teka];
    if (P0.hukuman) { const m = makeMonster(P0.hukuman, { x: P.x + 120, y: P.y }); if (!solidAt(m.x, m.y)) { m.aggro = true; m.state = "chase"; monsters.push(m); } }
    mulaiRonde(memori.teka, memori.ronde);
    return;
  }
  sfx.click(); memori.k++;
  if (memori.k >= memori.urutan.length) {
    const P0 = TEKA_BARU[memori.teka];
    if (memori.ronde >= P0.sampai) { const id = memori.teka; memori = null; selesaiTeka(id); }
    else { sfx.quest(); mulaiRonde(memori.teka, memori.ronde + 1); }
  }
});
GAMBAR_TANAH.push((time) => {
  const warna = ["#ff5a4a", "#4aa8ff", "#5ad17a", "#f4c542", "#b88cff", "#7fe3ff"];
  for (const l of lempengMem) {
    const x = l.tx * T, y = l.ty * T, lp = lempengTeka(l.teka), i = lp.indexOf(l);
    const nyala = tekaSelesai(l.teka) || (memori && memori.teka === l.teka && memori.nyala === i);
    ctx.fillStyle = "rgba(10,6,20,0.55)"; ctx.fillRect(x + 3, y + 3, T - 6, T - 6);
    ctx.fillStyle = nyala ? warna[i % warna.length] : warna[i % warna.length] + "44";
    ctx.fillRect(x + 7, y + 7, T - 14, T - 14);
    if (nyala) { ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.fillRect(x + 12, y + 12, T - 24, T - 24); }
  }
});
GAMBAR_OBJEK.batuMemori = function (n, time) {
  const x = n.x, y = n.y, aktif = memori && memori.teka === n.tekaId;
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 16, 5, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#5d5868"; ctx.beginPath(); ctx.moveTo(x - 14, y); ctx.lineTo(x - 9, y - 34); ctx.lineTo(x + 9, y - 34); ctx.lineTo(x + 14, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = aktif || tekaSelesai(n.tekaId) ? "#7fe3ff" : `rgba(127,227,255,${0.4 + 0.3 * Math.sin(time * 3)})`;
  ctx.beginPath(); ctx.arc(x, y - 22, 6, 0, 6.28); ctx.fill();
  labelObjek(n, "#7fe3ff", 46);
};
