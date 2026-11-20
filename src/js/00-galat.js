// =====================================================================
// LAYAR GALAT
// Dimuat paling awal. Kalau ada error (misalnya file game tidak lengkap atau
// versinya tercampur setelah update), tampilkan pesan + tombol
// "Perbaiki & muat ulang" yang membersihkan simpanan offline lalu memuat ulang.
// Progres permainan (localStorage) TIDAK dihapus.
// =====================================================================
"use strict";

(() => {
  let box = null;
  // bahasa dibaca langsung dari simpanan (file bahasa belum dimuat saat ini)
  let en = false;
  try { en = JSON.parse(localStorage.getItem("laga.bahasa")) === "en"; } catch (e) {}
  const T = en
    ? { judul: "Oops, something went wrong", isi: "Usually the game files are incomplete after an update. Your progress is safe.", fix: "Fix &amp; reload", tutup: "Close", gagal: "Failed to load " }
    : { judul: "Ups, game bermasalah", isi: "Biasanya karena file game belum lengkap setelah update. Progresmu aman.", fix: "Perbaiki &amp; muat ulang", tutup: "Tutup", gagal: "Gagal memuat " };
  async function perbaiki() {
    try {
      if ("serviceWorker" in navigator) for (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister();
      if (window.caches) for (const k of await caches.keys()) await caches.delete(k);
    } catch (e) {}
    location.reload();
  }
  function tampil(pesan) {
    if (!document.body) { addEventListener("DOMContentLoaded", () => tampil(pesan)); return; }
    if (!box) {
      box = document.createElement("div");
      box.setAttribute("role", "alert");
      box.style.cssText = "position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:99;width:min(420px,calc(100% - 32px));box-sizing:border-box;padding:14px 16px;border-radius:14px;background:#2a1220;border:1px solid #e5484d;color:#f7efe3;font:600 14px/1.4 Nunito,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.6)";
      box.innerHTML = '<b style="display:block;font-size:16px;margin-bottom:4px">' + T.judul + '</b>' +
        '<span>' + T.isi + '</span>' +
        '<small id="galatPesan" style="display:block;margin-top:6px;opacity:.6;word-break:break-word"></small>' +
        '<div style="display:flex;gap:8px;margin-top:10px">' +
        '<button type="button" id="galatFix" style="flex:1;padding:10px;border:0;border-radius:10px;background:#e5484d;color:#fff;font:800 14px Nunito,sans-serif">' + T.fix + '</button>' +
        '<button type="button" id="galatTutup" style="padding:10px 14px;border:1px solid rgba(255,255,255,.2);border-radius:10px;background:transparent;color:#f7efe3;font:700 14px Nunito,sans-serif">' + T.tutup + '</button></div>';
      document.body.appendChild(box);
      box.querySelector("#galatFix").addEventListener("click", perbaiki);
      box.querySelector("#galatTutup").addEventListener("click", () => { box.remove(); box = null; });
    }
    box.querySelector("#galatPesan").textContent = pesan;
  }
  addEventListener("error", (e) => {
    // file .js gagal dimuat (404 / offline) juga ditangkap di sini
    const t = e.target;
    if (t && t.tagName === "SCRIPT") tampil(T.gagal + (t.src || "").split("/").pop());
    else tampil((e.message || "Error") + (e.filename ? " (" + e.filename.split("/").pop() + ":" + e.lineno + ")" : ""));
  }, true);
  addEventListener("unhandledrejection", (e) => tampil("Error: " + (e.reason && e.reason.message || e.reason)));
})();
