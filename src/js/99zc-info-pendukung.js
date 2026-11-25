// =====================================================================
// INFO KODE PENDUKUNG (sebelum membuka Saweria)
// Tombol "Dukung Kami" (halaman Credit & notif akhir bab, 28-dukung.js) kini
// membuka penjelasan singkat dulu: cara mendapat Kode Pendukung (kosmetik + gelar),
// lalu tombol "Buka Saweria". Kode dibuat pengembang dengan alat di luar repo
// (~/BikinGame/alat-laga-nusantara/kode-pendukung.html) & ditukar di 99s-kode-hadiah.js.
// =====================================================================
"use strict";

{
  const el = document.createElement("div");
  el.className = "overlay"; el.id = "dkBox"; el.hidden = true;
  el.innerHTML = `<div class="panel dk-panel"><h1 id="dkJudul"></h1><p id="dkLead"></p><ol class="dk-langkah" id="dkLangkah"></ol>
    <div class="dk-hadiah" id="dkHadiah"></div><p class="set-note" id="dkCatatan"></p>
    <div class="row"><button type="button" class="go alt kecil" id="dkTutup"></button><button type="button" class="go dukung" id="dkBuka"></button></div></div>`;
  document.querySelector(".stage").appendChild(el);
}
let dkModeLama = null;
const bukaSaweria = bukaDukung;
bukaDukung = function () {
  sfx.click();
  $("dkJudul").innerHTML = Lx(["Dukung <span>Laga Nusantara</span> 💛", "Support <span>Laga Nusantara</span> 💛"]);
  $("dkLead").textContent = Lx(["Game ini gratis dan dibuat sendirian. Setiap dukungan membantu cerita, monster, dan area baru terus bertambah.", "This game is free and made by one person. Every bit of support helps add new stories, monsters, and areas."]);
  $("dkLangkah").innerHTML = [
    ["Donasi lewat Saweria, berapa pun nominalnya.", "Donate through Saweria, any amount."],
    ["Di kolom pesan donasi, tulis <b>nama untuk gelar</b> (huruf & angka, maks. 12) dan <b>email atau IG</b>-mu.", "In the donation message, write the <b>name for your title</b> (letters & numbers, max 12) and your <b>email or IG</b>."],
    ["Kami kirim <b>Kode Pendukung</b> pribadimu, biasanya dalam 1–3 hari.", "We'll send your personal <b>Supporter Code</b>, usually within 1–3 days."],
    ["Di game, buka ikon <b>Kotak</b> (amplop) › Pesan › <b>Punya kode hadiah?</b> › Tukar.", "In the game, open the <b>Mailbox</b> (envelope) icon › Mail › <b>Have a gift code?</b> › Redeem."],
  ].map((x) => `<li>${Lx(x)}</li>`).join("");
  $("dkHadiah").innerHTML = `<b>${Lx(["Hadiah Pendukung", "Supporter rewards"])}</b><span>👕 ${Lx(KOSMETIK.emasKeraton.nama)} · 🎗 ${Lx(KOSMETIK.ikatPendukung.nama)} · 👑 ${Lx(KOSMETIK.mahkota.nama)} · ✨ ${Lx(KOSMETIK.bintang.nama)}</span><span>🎖 ${Lx(["Gelar", "Title"])} «${Lx(GELAR.pendukung.nama)} · ${Lx(["Namamu", "YourName"])}»</span>`;
  $("dkCatatan").textContent = Lx(["Hadiahnya hanya tampilan, tidak menambah kekuatan, jadi game tetap adil untuk semua.", "Rewards are cosmetic only, no extra power, so the game stays fair for everyone."]);
  $("dkTutup").textContent = t("dlg.tutup");
  $("dkBuka").textContent = Lx(["Buka Saweria", "Open Saweria"]);
  if (mode === "play") { dkModeLama = mode; mode = "dukung"; }   // game berhenti selama layar ini terbuka
  $("dkBox").hidden = false;
};
function tutupInfoDukung() {
  $("dkBox").hidden = true;
  if (dkModeLama && mode === "dukung") mode = dkModeLama;
  dkModeLama = null;
}
$("dkTutup").addEventListener("click", () => { sfx.click(); tutupInfoDukung(); });
$("dkBuka").addEventListener("click", () => { tutupInfoDukung(); bukaSaweria(); });
addEventListener("keydown", (e) => { if (!$("dkBox").hidden && e.key === "Escape") { e.stopImmediatePropagation(); tutupInfoDukung(); } }, true);
// tombol di halaman Credit terikat langsung ke fungsi lama (28-dukung.js) → alihkan ke layar info ini
$("btnDukung").addEventListener("click", (e) => { e.stopImmediatePropagation(); bukaDukung(); }, true);
