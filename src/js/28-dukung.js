// =====================================================================
// DUKUNG KAMI
// Tombol di halaman Credit (menu jeda) yang membuka link donasi
// (Trakteer / Saweria / dll.) di tab baru. Link diatur di config.js:
// ATURAN.dukung.tautan
// =====================================================================
"use strict";

$("btnDukung").addEventListener("click", () => {
  sfx.click();
  const url = (ATURAN.dukung && ATURAN.dukung.tautan || "").trim();
  if (!/^https:\/\//.test(url)) { toast(t("toast.dukungKosong")); return; }
  // noopener: halaman donasi tidak bisa mengutak-atik tab game
  const w = window.open(url, "_blank", "noopener");
  if (!w) location.href = url; // aplikasi terpasang kadang menolak tab baru
});
