// =====================================================================
// DUKUNG KAMI
// Tombol di halaman Credit (menu jeda) yang membuka link donasi
// (Trakteer / Saweria / dll.) di tab baru. Link diatur di config.js:
// ATURAN.dukung.tautan
// Juga: notif kecil "Dukung Kami" di atas tengah layar setiap bab cerita selesai
// (dipanggil dari 40-ganti-bab.js). Hilang sendiri setelah ATURAN.dukung.lamaNotif detik.
// =====================================================================
"use strict";

function bukaDukung() {
  sfx.click();
  const url = (ATURAN.dukung && ATURAN.dukung.tautan || "").trim();
  if (!/^https:\/\//.test(url)) { toast(t("toast.dukungKosong")); return; }
  // noopener: halaman donasi tidak bisa mengutak-atik tab game
  const w = window.open(url, "_blank", "noopener");
  if (!w) location.href = url; // aplikasi terpasang kadang menolak tab baru
}
$("btnDukung").addEventListener("click", bukaDukung);

// ---------- Notif tiap bab selesai ----------
let dukungTimer = 0;
function tutupNotifDukung() { clearTimeout(dukungTimer); $("dukungNotif").hidden = true; $("dukungNotif").parentElement.classList.remove("dn-on"); }
function tampilNotifDukung() {
  const el = $("dukungNotif"), detik = ATURAN.dukung.lamaNotif || 10;
  el.hidden = false; el.classList.remove("jalan"); el.parentElement.classList.add("dn-on");
  el.querySelector(".dn-sisa").style.transitionDuration = detik + "s";
  void el.offsetWidth; el.classList.add("jalan");   // garis emas menyusut = sisa waktu
  clearTimeout(dukungTimer);
  dukungTimer = setTimeout(tutupNotifDukung, detik * 1000);
}
$("dnDukung").addEventListener("click", () => { bukaDukung(); tutupNotifDukung(); });
$("dnTutup").addEventListener("click", () => { sfx.click(); tutupNotifDukung(); });
