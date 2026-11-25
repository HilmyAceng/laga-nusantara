// =====================================================================
// POPUP UMUM (gaya sama dengan Info & Event)
// Dipakai fitur baru (Kotak Pesan & Harian, Mode Bertahan, Kisah, dll.) supaya
// tampilannya seragam: kepala (eyebrow + judul + ✕), daftar kiri, detail kanan, kaki.
//   const p = buatPopup("kotak", "kotak");   // id elemen, nama mode selama terbuka
//   p.judul(["Kotak", "Box"], ["Pes", "an"]); p.daftar.innerHTML = ...; p.buka();
// Saat terbuka: mode = nama mode (game berhenti), Esc / ✕ menutup → kembali "play".
// =====================================================================
"use strict";

function buatPopup(id, namaMode) {
  const el = document.createElement("div");
  el.className = "overlay pn-box"; el.id = id + "Box"; el.hidden = true;
  el.innerHTML = `<div class="panel ev-panel">
    <div class="ev-kepala"><div><p class="eyebrow"></p><h1></h1></div><button class="icon-btn pn-tutup" type="button" aria-label="✕">✕</button></div>
    <div class="ev-isi"><div class="ev-daftar"></div><div class="ev-detail"></div></div>
    <div class="ev-lacak pn-kaki"></div></div>`;
  $("eventBox").after(el);
  const p = {
    el, daftar: el.querySelector(".ev-daftar"), detail: el.querySelector(".ev-detail"), kaki: el.querySelector(".pn-kaki"),
    saatTutup: null, terbuka: () => !el.hidden,
    judul(eyebrow, [a, b]) { el.querySelector(".eyebrow").textContent = Lx(eyebrow); el.querySelector("h1").innerHTML = `${a}<span>${b}</span>`; },
    buka() {
      if (!S || (mode !== "play" && mode !== "pause" && mode !== namaMode)) return false;
      if (mode === "pause") togglePause();
      mode = namaMode; showUI(); el.hidden = false; sfx.click();
      return true;
    },
    tutup() {
      el.hidden = true;
      if (mode === namaMode) { mode = "play"; showUI(); }
      if (p.saatTutup) p.saatTutup();
    },
  };
  el.querySelector(".pn-tutup").addEventListener("click", () => { sfx.click(); p.tutup(); });
  addEventListener("keydown", (e) => { if (mode === namaMode && !el.hidden && e.key === "Escape") { e.stopImmediatePropagation(); p.tutup(); } }, true);
  return p;
}

// Tombol ikon baru di HUD (kanan atas), ditaruh di kiri tombol Info.
function tombolHud(id, svg, label) {
  const b = document.createElement("button");
  b.className = "icon-btn pintas ev-hud"; b.id = id; b.type = "button"; b.setAttribute("aria-label", label);
  b.innerHTML = svg + `<b class="pintas-poin ev-tanda">!</b>`;
  $("btnInfoHud").before(b);
  return b;
}

// Tombol menu jeda yang dibuat belakangan (mis. Kosmetik, Jalan Pendekar) diberi kelas "go-dinamis":
// pendengar [data-go] di 20-menu-jeda.js hanya terpasang pada tombol yang sudah ada saat game dimuat.
$("pauseBox").addEventListener("click", (e) => {
  const b = e.target.closest(".go-dinamis[data-go]");
  if (b) showPauseView(b.dataset.go);
});
