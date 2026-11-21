// =====================================================================
// JEDA JAMU & TOMBOL JAMU
//  - Setelah minum jamu ada jeda ATURAN.jamuJeda detik (config.js) sebelum bisa minum lagi.
//    Pengecekannya di 15-update.js (P.jamuCd); di sini hitung mundurnya.
//  - Desktop: kotak "Jamu" di deret jurus (tombol W, bisa juga diklik) berisi jumlah jamu
//    dan putaran gelap selama jeda.
//  - HP: tombol Jamu diberi lencana jumlah (×3) atau hitung mundur (7s) + putaran gelap.
// =====================================================================
"use strict";

UPDATE_TAMBAHAN.push((dt) => { if (P && P.jamuCd > 0) P.jamuCd = Math.max(0, P.jamuCd - dt); });

// klik kotak Jamu di desktop = minum jamu
$("sPot").addEventListener("click", () => { if (mode === "play") press.potion = true; });

function hudJamu() {
  const cd = P.jamuCd > 0 ? P.jamuCd : 0, n = S.potions;
  const c = Math.round((cd / ATURAN.jamuJeda) * 60) / 60;
  const b = $("bPot");
  if (last.jc !== c) { last.jc = c; b.style.setProperty("--cd", c); $("sPot").style.setProperty("--cd", c); }
  const lbl = cd > 0 ? Math.ceil(cd) + "s" : "×" + n;
  if (b.dataset.jamu !== lbl) b.dataset.jamu = lbl;
  b.classList.toggle("kosong", n <= 0);
  if (!isTouch) {
    const el = $("sPot");
    el.classList.toggle("ready", cd <= 0 && n > 0);
    el.classList.toggle("habis", n <= 0);
    const k = KONTROL.jamu[0];
    setText($("sPotKey"), "jk", KEY_LABEL[k] || (k.length === 1 ? k.toUpperCase() : k));
    setText($("sPotName"), "jn", t("jamu.slot") + " ×" + n);
    setText($("sPotSec"), "js", cd > 0 ? String(Math.ceil(cd)) : "");
  }
}
