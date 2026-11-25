// =====================================================================
// LAYAR MUAT (sebelum layar judul / pilih hero)
// Kerangka layar (#muat) & penghitung script ada langsung di game.html, supaya tampil
// seketika sebelum script game selesai dimuat. File ini (dimuat hampir terakhir) mengisi
// kiat bergilir & versi, lalu setelah semuanya siap menampilkan "Ketuk untuk mulai".
// Ketukan itu sekaligus membuka izin suara browser (audio() di 07-audio.js).
// =====================================================================
"use strict";

const KIAT_MUAT = [
  ["Tekan Hindar tepat saat musuh menyerang untuk hindar sempurna: waktu melambat sesaat.", "Dodge right as an enemy strikes for a perfect dodge: time slows for a moment."],
  ["Setiap bos punya kelemahan. Temukan lewat pertarungan, lalu cek di Ensiklopedia.", "Every boss has a weakness. Discover it in battle, then check the Encyclopedia."],
  ["Jamu memulihkan nyawa. Beli di warung desa sebelum menjelajah jauh.", "Jamu restores health. Buy some at the village stall before travelling far."],
  ["Tugu Teleport yang sudah disentuh bisa dipakai untuk kembali dengan cepat.", "Teleport Beacons you've touched let you travel back quickly."],
  ["Absen setiap hari di Kotak untuk hadiah kecil. Tidak ada hukuman kalau terlewat.", "Check in daily in the Mailbox for small rewards. No penalty if you miss a day."],
  ["Senjatamu bisa ditempa di Tukang Pahat supaya makin kuat.", "Your weapon can be forged at the Carver to grow stronger."],
  ["Bicara dengan warga: banyak yang punya kisah dan misi sampingan.", "Talk to villagers: many have stories and side quests."],
  ["Kemajuanmu tersimpan otomatis di perangkat ini. Pakai Kode Save untuk pindah perangkat.", "Progress saves automatically on this device. Use a Save Code to move devices."],
];

{
  const box = $("muat");
  if (box) {
    let i = Math.floor(Math.random() * KIAT_MUAT.length);
    const tampilKiat = () => {
      const p = $("muatKiat"); if (!p) return;
      p.classList.remove("muncul"); void p.offsetWidth;   // ulang animasi masuk
      p.textContent = "💡 " + Lx(KIAT_MUAT[i]); p.classList.add("muncul");
      i = (i + 1) % KIAT_MUAT.length;
    };
    tampilKiat();
    const giliran = setInterval(tampilKiat, 4200);
    $("muatVersi").textContent = "v" + ATURAN.versi;

    // semua script sudah jalan; tunggu 100-main.js & aset (font) selesai, lalu tampilkan tombol mulai
    const siap = () => {
      if (typeof window.muatSelesai === "function") window.muatSelesai();
      $("muatLabel").textContent = Lx(["Ketuk untuk mulai", "Tap to start"]);
      box.classList.add("siap");
      box.setAttribute("aria-label", Lx(["Ketuk untuk mulai", "Tap to start"]));
    };
    if (document.readyState === "complete") setTimeout(siap, 300);
    else addEventListener("load", () => setTimeout(siap, 300), { once: true });

    const mulai = (e) => {
      if (!box.classList.contains("siap") || box.classList.contains("pergi")) return;
      if (e) e.preventDefault();
      try { audio(); if (actx && actx.state === "suspended") actx.resume(); sfx.click(); } catch (er) {}
      clearInterval(giliran);
      box.classList.add("pergi");
      setTimeout(() => box.remove(), 650);
      removeEventListener("keydown", tombol, true);
    };
    const tombol = (e) => {
      if (e.key === "Enter" || e.key === " ") { e.stopImmediatePropagation(); mulai(e); }
      else if (!box.classList.contains("pergi")) e.stopImmediatePropagation();   // jangan sampai tombol lain tembus ke layar judul
    };
    box.addEventListener("pointerup", mulai);
    addEventListener("keydown", tombol, true);
  }
}
