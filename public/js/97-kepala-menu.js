// =====================================================================
// KEPALA MENU JEDA DI HP
// Di layar sempit, label kecil (eyebrow) ada di kiri & judul besar di tengah panel
// (CSS di game.html). Lebar label berbeda-beda per halaman & bahasa, jadi jarak kiri-kanan
// judul diatur dari lebar label yang sebenarnya: judul tetap tepat di tengah dan tidak
// pernah menimpa label, label juga tidak pernah keluar dari kotaknya.
// =====================================================================
"use strict";

const layarSempit = matchMedia("(max-width: 760px), (max-height: 560px)");
function aturKepalaMenu() {
  for (const v of document.querySelectorAll("#pauseBox .pview")) {
    const e = v.querySelector(":scope > .eyebrow"), h = v.querySelector(":scope > h1");
    if (!e || !h) continue;
    if (!layarSempit.matches || v.hidden) { if (!layarSempit.matches) { h.style.paddingInline = ""; h.style.fontSize = ""; } continue; }
    // label pecah di "›": "GAMEPLAY ›" / "ENSIKLOPEDIA" (lebar label = kata terpanjang)
    if (e.textContent.includes(" › ")) e.textContent = e.textContent.replace(/ › /g, "\u00a0› ");
    const pad = Math.ceil(e.getBoundingClientRect().width + 8);
    h.style.paddingInline = pad + "px";
    // judul terlalu lebar untuk ruang tengah → hurufnya dikecilkan sampai muat (diukur dari teks sebenarnya)
    h.style.fontSize = "";
    const ruang = h.clientWidth - pad * 2, lebarTeks = () => { const r = document.createRange(); r.selectNodeContents(h); return r.getBoundingClientRect().width; };
    let uk = parseFloat(getComputedStyle(h).fontSize);
    while (lebarTeks() > ruang + 1 && uk > 14) { uk -= 1; h.style.fontSize = uk + "px"; }
  }
}
{
  const tampilAsli = showPauseView;
  showPauseView = function (view, silent) { tampilAsli(view, silent); requestAnimationFrame(aturKepalaMenu); };
  const terapkanAsli = terapkanSemua;
  terapkanSemua = function () { terapkanAsli(); requestAnimationFrame(aturKepalaMenu); };   // ganti bahasa
}
addEventListener("resize", () => requestAnimationFrame(aturKepalaMenu));
