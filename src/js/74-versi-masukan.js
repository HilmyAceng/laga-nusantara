// =====================================================================
// NOMOR VERSI & KIRIM MASUKAN
//  - Versi game (ATURAN.versi di config.js) tampil di layar judul & menu jeda,
//    supaya penguji tahu versi mana yang dimainkan.
//  - Tombol "Kirim Masukan" di menu jeda membuka aplikasi email pemain (mailto: ke
//    ATURAN.masukan.email) dengan subjek & isi yang sudah terisi: versi, kelas, level, area, perangkat.
//    (Tidak ada data pribadi yang dikirim otomatis; pemain sendiri yang menekan kirim.)
// =====================================================================
"use strict";

function isiVersi() {
  for (const el of document.querySelectorAll(".versi-game")) el.textContent = t("versi.label", { v: ATURAN.versi });
}
function bukaMasukan() {
  const info = [
    t("masukan.versi", { v: ATURAN.versi }),
    S ? t("masukan.hero", { kelas: CLASSES[S.cls].name, lv: S.lv, area: area ? area.nama : "-", kes: typeof kesulitanNow === "function" ? t("kes." + kesulitanNow()) : "-" }) : "",
    t("masukan.alat", { alat: isTouch ? "HP / tablet" : "PC", layar: `${innerWidth}×${innerHeight}` }),
  ].filter(Boolean).join("\n");
  const isi = `${t("masukan.templat")}\n\n---\n${info}`;
  const url = `mailto:${ATURAN.masukan.email}?subject=${encodeURIComponent(t("masukan.judul", { v: ATURAN.versi }).trim())}&body=${encodeURIComponent(isi)}`;
  location.href = url;   // membuka aplikasi email (Gmail, Mail, dll.)
  setTimeout(() => toast(t("masukan.info", { email: ATURAN.masukan.email }), false), 400);
  sfx.click();
}
$("btnMasukan").addEventListener("click", bukaMasukan);
isiVersi();
{ const terapkanAsli = terapkanSemua; terapkanSemua = function () { terapkanAsli(); isiVersi(); }; }
