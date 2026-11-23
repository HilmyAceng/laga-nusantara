// =====================================================================
// IKON DI DALAM TEKS
// Teks notif & panduan menyebut tombol pintas dengan lambang ⚔ (Jurus), 💎 (Jimat), 👤 (Status).
// Lambang itu diganti otomatis dengan ikon yang PERSIS sama dengan tombolnya di HUD
// (salinan SVG dari #btnJurusHud / #btnJimatHud / #btnStatus), supaya tidak ada
// emoji yang tampil berbeda-beda di tiap HP. Berlaku untuk semua teks yang muncul di
// halaman (toast, notif barang, dialog, menu, panduan), termasuk yang ditambahkan nanti.
// =====================================================================
"use strict";

const IKON_TEKS = { "⚔": "btnJurusHud", "💎": "btnJimatHud", "👤": "btnStatus" };
const POLA_IKON = /[⚔💎👤]️?/u;

function buatIkonTeks(lambang) {
  const svg = document.querySelector(`#${IKON_TEKS[lambang]} svg`);
  if (!svg) return document.createTextNode(lambang);
  const s = document.createElement("span"); s.className = "ikon-teks"; s.setAttribute("aria-label", lambang);
  s.appendChild(svg.cloneNode(true));
  return s;
}
// ganti lambang di satu node teks
function gantiIkonDi(node) {
  const teks = node.nodeValue;
  if (!POLA_IKON.test(teks)) return;
  const p = node.parentNode;
  if (!p || p.closest && p.closest("script, style, textarea, .ikon-teks, #btnJurusHud, #btnJimatHud, #btnStatus")) return;
  const frag = document.createDocumentFragment();
  for (const bagian of teks.split(/([⚔💎👤])️?/u)) {
    if (!bagian) continue;
    frag.appendChild(IKON_TEKS[bagian] ? buatIkonTeks(bagian) : document.createTextNode(bagian));
  }
  p.replaceChild(frag, node);
}
function gantiIkonSemua(akar) {
  const w = document.createTreeWalker(akar, NodeFilter.SHOW_TEXT);
  const daftar = []; while (w.nextNode()) if (POLA_IKON.test(w.currentNode.nodeValue)) daftar.push(w.currentNode);
  daftar.forEach(gantiIkonDi);
}
new MutationObserver((ubah) => {
  for (const u of ubah) {
    if (u.type === "characterData") gantiIkonDi(u.target);
    else for (const n of u.addedNodes) n.nodeType === 3 ? gantiIkonDi(n) : n.nodeType === 1 && gantiIkonSemua(n);
  }
}).observe(document.body, { childList: true, subtree: true, characterData: true });
gantiIkonSemua(document.body);
