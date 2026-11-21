// =====================================================================
// BELUM SAATNYA
// Benda & tempat yang berkaitan dengan misi memberi tahu pemain kalau
// belum waktunya disentuh, daripada diam saja:
//   - benda teka-teki (prasasti, obor, saklar, lonceng, batu bertanya, altar, ...)
//     sebelum cerita sampai di langkah teka-teki itu → "Belum saatnya..." + bab/episodenya
//   - batu dorong yang didorong terlalu awal
//   - gerbang yang masih tertutup → alasannya (cerita, bos, atau teka-teki)
//   - sarang bos yang bosnya belum muncul
// =====================================================================
"use strict";

// langkah cerita "teka" untuk teka-teki id (null = tidak terkait cerita)
const langkahTeka = (id) => { const i = CERITA.findIndex((s) => s.tipe === "teka" && s.id === id); return i < 0 ? null : { i, l: CERITA[i] }; };
function tekaBelumSaatnya(id) {
  if (!id || !S || tekaSelesai(id) || ceritaTamat()) return false;
  const L = langkahTeka(id);
  return !!L && S.cerita.idx < L.i;
}
const idTekaBenda = (n) => n.tekaId || (n.kind === "obor" ? "obor" : null);
const teksNanti = (l) => t("belum.nanti", { bab: l.bab, ep: l.ep });

// dipanggil dari talk() (12-dialog.js). true = sudah ditangani (benda belum boleh disentuh)
function cekBelumSaatnya(n) {
  const id = idTekaBenda(n);
  if (!tekaBelumSaatnya(id)) return false;
  const L = langkahTeka(id);
  openDialog(n.name, t("belum.benda") + " " + teksNanti(L.l), [{ label: t("dlg.tutup"), primary: true, run: closeDialog }]);
  sfx.click();
  return true;
}

// notif singkat yang tidak berulang terus-menerus
let belumT = 0, belumTerakhir = "";
function notifBelum(kunci, teks) {
  if (belumT > 0 && belumTerakhir === kunci) return;
  belumT = 4; belumTerakhir = kunci;
  toast(teks, false);
}

// gerbang tertutup: alasan sesuai jenis kuncinya
function alasanGerbang(g) {
  const k = g.kunci;
  if (k.startsWith("bos:")) return t("belum.gerbangBos", { nama: MONSTERS[k.slice(4)].name });
  if (k.startsWith("teka:")) return t("belum.gerbangTeka");
  return t("belum.gerbangCerita");
}
UPDATE_TAMBAHAN.push(function (dt) {
  if (belumT > 0) belumT -= dt;
  if (!P || P.dead) return;
  const tx = P.x / T, ty = P.y / T;
  for (const g of area.gerbang) {
    if (!g.kunci || gerbangTerbuka(g)) continue;
    const dx = Math.max(g.x0 - tx, 0, tx - (g.x1 + 1)), dy = Math.max(g.y0 - ty, 0, ty - (g.y1 + 1));
    if (Math.hypot(dx, dy) < 1.4) notifBelum("gerbang:" + g.ke, `${g.label}: ${alasanGerbang(g)}`);
  }
});

// sarang bos yang masih sepi (bos belum dipanggil cerita & belum pernah kalah)
SAAT_MASUK_AREA.push((id) => {
  const a = AREAS[id];
  if (!S || !a.bos || S.bos[a.bos.monster] || bosPerluMuncul()) return;
  setTimeout(() => { if (areaId === id) notifBelum("sarang:" + id, t("belum.sarang", { nama: MONSTERS[a.bos.monster].name })); }, 1400);
});
