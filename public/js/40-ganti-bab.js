// =====================================================================
// GANTI BAB
// Saat bab cerita selesai: pengumuman besar "Tamat · Bab 1 ..." lalu
// "Mulai · Bab 2 ...", lalu notif kecil "Dukung Kami". Dipanggil dari selesaiLangkah() (23-cerita.js).
// =====================================================================
"use strict";

function umumkanBab(lama, baru, after) {
  const el = $("babBanner"), atas = $("babAtas"), bawah = $("babBawah"), kecil = $("babKecil");
  const tampil = (a, b, k, ms, lanjut) => {
    atas.textContent = a; bawah.textContent = b; kecil.textContent = k;
    el.hidden = false; el.classList.remove("on"); void el.offsetWidth; el.classList.add("on");
    setTimeout(() => { el.classList.remove("on"); setTimeout(lanjut, 450); }, ms);
  };
  sfx.level();
  const [bl, jl] = lama.split(" · ");
  tampil(t("bab.tamat"), bl, jl || "", 2400, () => {
    if (!baru) { el.hidden = true; tampilNotifDukung(); after && after(); return; }
    const [bb, jb] = baru.split(" · ");
    sfx.quest();
    tampil(t("bab.mulai"), bb, jb || "", 2400, () => { el.hidden = true; tampilNotifDukung(); after && after(); });   // ajakan dukung (28-dukung.js)
  });
}
