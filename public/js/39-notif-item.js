// =====================================================================
// NOTIFIKASI BARANG
// Pesan kecil putih di pojok kiri bawah setiap mendapat barang (jamu, taring,
// barang misi). Pesan lain tetap memakai toast() di tengah atas (19-hud.js).
// =====================================================================
"use strict";

function notifItem(text) {
  const box = $("itemNotif");
  const el = document.createElement("div"); el.className = "item-notif"; el.textContent = text;
  box.appendChild(el);
  while (box.children.length > 4) box.firstChild.remove();
  setTimeout(() => el.classList.add("pergi"), 2600);
  setTimeout(() => el.remove(), 3100);
}
// Nama barang + jumlah yang dimiliki: "Taring ular ×3"
const notifDapat = (item) => notifItem(t("item.dapat", { nama: t("item." + item), n: S.items[item] || 0 }));
if (isTouch) document.body.classList.add("touch-on");   // HP: naikkan supaya tidak tertutup joystick
