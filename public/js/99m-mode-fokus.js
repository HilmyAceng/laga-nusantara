// =====================================================================
// MODE FOKUS: CATUR & MEMANCING
//  - Selama main catur (papan di tanah) atau memancing, HUD biasa (misi, peta mini,
//    koin, tombol pintas, joystick, bar jurus) & panah misi disembunyikan.
//    Yang tersisa hanya HUD milik mini game itu sendiri (#ctHud / #mcHud).
//  - Memancing: kamera diperbesar & menyorot hero + pelampung (seperti papan catur),
//    lalu ikut bergeser bersama hero.
// =====================================================================
"use strict";

const modeFokus = () => mode === "catur" || mode === "mancing";

// ---------- HUD ----------
{
  const showUIAsli = showUI;
  showUI = function () {
    showUIAsli();
    if (modeFokus()) { ui.hud.hidden = true; ui.touch.hidden = true; ui.skills.hidden = true; ui.boss.hidden = true; }
  };
  const panahAsli = drawPanahTujuan;
  drawPanahTujuan = function (toScreen, time) { if (modeFokus()) return; return panahAsli(toScreen, time); };
}

// ---------- Kamera memancing ----------
// zoom: hero + pelampung + sedikit ruang mengisi ±60% tinggi layar
function zoomMancing() {
  if (!mc) return 1;
  const dasar = clamp(Math.min(W / 720, H / 420), 0.75, 2.2);
  const lebar = Math.abs(mc.bx - P.x) + 160, tinggi = Math.abs(mc.by - P.y) + 150;
  return clamp(Math.min(W * 0.7 / lebar, H * 0.62 / tinggi) / dasar, 1.2, 2.2);
}
{
  const kameraAsli = targetKamera;
  targetKamera = function () {
    if (mode === "mancing" && mc && P) {
      zoomTuju = zoomMancing();
      // titik tengah hero–pelampung, sedikit diturunkan supaya pesan di atas tidak menutupi
      return { x: (P.x + mc.bx) / 2, y: (P.y + mc.by) / 2 - 14 };
    }
    return kameraAsli();
  };
  const tutupAsli = tutupMancing;
  tutupMancing = function () { zoomTuju = 1; tutupAsli(); };
}
