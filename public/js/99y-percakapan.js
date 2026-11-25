// =====================================================================
// PERCAKAPAN LEBIH DALAM
//  - percakapan(baris, selesai, tanya): dialog beruntun bernama pembicara, lalu
//    (opsional) menu "Ada yang ingin kau tanyakan?" berisi pertanyaan tambahan.
//    Pertanyaan yang sudah ditanyakan diberi tanda ✓ (tetap bisa ditanya ulang).
//  - Dialog cerita utama: kalau langkahnya punya pertanyaan di cerita/tanya.js,
//    menu pertanyaan muncul setelah dialog selesai, sebelum cerita berlanjut.
//  Pertanyaan bersifat opsional, pemain bisa langsung pilih "Lanjut".
//  baris = [[pembicara, [id, en] | "teks"], ...]; pembicara: id NPC / "hero" / "narasi".
// Simpanan: S.ditanya = { "<kunci>#<n>": 1 }
// =====================================================================
"use strict";

const teksBaris = (x) => (Array.isArray(x) ? Lx(x) : x);
function percakapan(baris, selesai, tanya, kunci) {
  let i = 0;
  const maju = () => {
    if (i >= baris.length) { if (tanya && tanya.length) return menuTanya(tanya, kunci, baris, selesai); closeDialog(); if (selesai) selesai(); return; }
    const [who, isi] = baris[i++];
    const akhir = i >= baris.length && !(tanya && tanya.length);
    openDialog(namaPembicara(who), teksBaris(isi), [{ label: akhir ? t("dlg.tutup") : t("cerita.lanjut"), primary: true, run: maju }]);
  };
  maju();
}
function menuTanya(tanya, kunci, baris, selesai) {
  const D = (S.ditanya = S.ditanya || {});
  const pembicara = (baris.slice().reverse().find(([w]) => w !== "hero" && w !== "narasi") || ["narasi"])[0];
  const pilihan = tanya.map((q, n) => ({
    label: (D[kunci + "#" + n] ? "✓ " : "❓ ") + Lx(q.tanya),
    run: () => { D[kunci + "#" + n] = 1; saveSoon(); percakapan([["hero", q.tanya], ...q.jawab], () => menuTanya(tanya, kunci, baris, selesai)); },
  }));
  openDialog(namaPembicara(pembicara), Lx(["Ada lagi yang ingin kau tanyakan?", "Anything else you want to ask?"]), [
    ...pilihan,
    { label: Lx(["Lanjut ➜", "Continue ➜"]), primary: true, run: () => { closeDialog(); if (selesai) selesai(); } },
  ]);
}

// ---------- Dialog cerita utama + pertanyaan tambahan ----------
{
  const asli = narasi;
  narasi = function (baris, after) {
    const l = CERITA.find((c) => c.teks === baris);
    const kunci = l && l.tipe === "bicara" && `b${angkaBab(l.bab)}e${l.ep}:${l.npc}`;
    const tanya = kunci && TANYA_CERITA[kunci];
    if (!tanya) return asli(baris, after);
    asli(baris, () => menuTanya(tanya, kunci, baris.map(([w]) => [w]), after));
  };
}
