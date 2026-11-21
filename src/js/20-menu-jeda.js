// =====================================================================
// MENU JEDA
// Menu jeda bertingkat: Lanjut / Pengaturan (Bahasa, Kontrol, Volume, Layar) / Credit / Menu utama / Keluar Permainan (HP).
// =====================================================================
"use strict";

function isiStatJeda() {
  $("pauseStats").textContent = t("jeda.stats", { kelas: CLASSES[S.cls].name, lv: S.lv, kills: S.kills, atk: atkPower(), senjata: S.weapon }) + (poinSisa() ? " · " + t("jeda.poin", { n: poinSisa() }) : "");
}
function togglePause() {
  if (mode === "play") {
    mode = "pause";
    isiStatJeda();
    showPauseView("main", true);
  } else if (mode === "pause") mode = "play";
  else return;
  showUI();
  if (mode === "pause") $("btnResume").focus({ preventScroll: true });
}

// Panduan kontrol di menu jeda. Tombol keyboard dibaca dari KONTROL (config.js),
// jadi kalau tombolnya diganti, panduan ini ikut berubah.
let ctlTab = isTouch ? "touch" : "key";
function buildControls() {
  const C = CLASSES[S.cls], pulih = Math.round(ATURAN.jamuPulih * 100);
  const keys = (...acts) => acts.flatMap((a) => KONTROL[a]).map((k) => `<kbd>${KEY_LABEL[k] || (k.length === 1 ? k.toUpperCase() : k)}</kbd>`).join("");
  const rows = [
    [keys("kiri", "atas", "kanan", "bawah"), t("ctl.gerak")],
    [keys("serang"), t("ctl.serang")],
    [keys("jurus"), t("ctl.jurusSlot", { n: 1, nama: jurusSlot(0) ? namaJurus(jurusSlot(0)) : t("jurus.kosong") })],
    [keys("jurus2"), t("ctl.jurusSlot", { n: 2, nama: jurusSlot(1) ? namaJurus(jurusSlot(1)) : t("jurus.kosong") })],
    [keys("pamungkas"), t("ctl.pamungkas", { nama: teksPam("name"), lv: ATURAN.tenaga.bukaLevel })],
    [keys("hindar"), t("ctl.hindar2")],
    [keys("menuJurus"), t("ctl.menuJurus")],
    [keys("menuJimat"), t("ctl.menuJimat")],
    [keys("menuStatus"), t("ctl.menuStatus")],
    [keys("jamu"), t("ctl.jamu", { pulih })],
    [keys("bicara"), t("ctl.bicara")],
    [keys("peta"), t("ctl.peta")],
    [keys("misi"), t("ctl.misi")],
    [keys("jeda"), t("ctl.jeda")],
    [keys("musik"), t("ctl.musik")],
  ];
  $("ctlKey").innerHTML = rows.map(([k, d]) => `<span class="k">${k}</span><span>${d}</span>`).join("");
  $("ctlTouchList").innerHTML = [
    t("ctlT.stick"),
    t("ctlT.serang"),
    t("ctlT.jurus2"),
    t("ctlT.pamungkas", { nama: teksPam("name"), lv: ATURAN.tenaga.bukaLevel }),
    t("ctlT.hindar2"),
    t("ctlT.jamu", { pulih }),
    t("ctlT.bicara"),
    t("ctlT.peta"),
    t("ctlT.misi"),
    t("ctlT.jeda"),
  ].map((t) => `<li>${t}</li>`).join("");
  showCtlTab(ctlTab);
}
function showCtlTab(which) {
  ctlTab = which;
  $("tabKey").setAttribute("aria-selected", String(which === "key"));
  $("tabTouch").setAttribute("aria-selected", String(which === "touch"));
  $("ctlKey").hidden = which !== "key";
  $("ctlTouch").hidden = which !== "touch";
}
$("tabKey").addEventListener("click", () => showCtlTab("key"));

// Pindah halaman di menu jeda: main → settings → volume / layar / control.
const PAUSE_BACK = { main: null, settings: "main", bahasa: "settings", control: "settings", volume: "settings", layar: "settings", credit: "main", keluar: "main", gameplay: "main", debuff: "gameplay", jurus: null, jimat: null, cara: "gameplay", status: null, koleksi: "gameplay" };
let pauseView = "main";
function showPauseView(view, silent) {
  pauseView = view;
  document.querySelectorAll("#pauseBox .pview").forEach((el) => { el.hidden = el.dataset.view !== view; });
  $("pausePanel").classList.toggle("wide", ["volume", "control", "jurus", "jimat", "cara", "status", "koleksi"].includes(view));
  if (view !== "jimat") jimatDariToko = false;
  if (view === "volume") refreshAudioButtons();
  if (view === "layar") { refreshLayar(); refreshPanah(); }
  if (view === "bahasa") refreshBahasa();
  if (view === "main" && S) isiStatJeda();
  if (view === "control") buildControls();
  if (view === "debuff") isiPanduanDebuff();   // 38-panduan-debuff.js
  if (view === "jurus") isiHalamanJurus();     // 51-poin-jurus.js
  if (view === "jimat") isiHalamanJimat();     // 52-jimat.js
  if (view === "cara") isiCaraBermain();       // 56-cara-bermain.js
  if (view === "status") isiHalamanStatus();   // 66-status-karakter.js
  if (view === "koleksi") isiKoleksiJimat();   // 67-koleksi-jimat.js
  if (!silent) sfx.click();
  $("pauseBox").scrollTop = 0;
  const first = document.querySelector(`#pauseBox .pview[data-view="${view}"] button:not(:disabled)`);
  if (first) first.focus({ preventScroll: true });
}
document.querySelectorAll("#pauseBox [data-go]").forEach((b) => b.addEventListener("click", () => showPauseView(b.dataset.go)));
$("tabTouch").addEventListener("click", () => showCtlTab("touch"));

// Kembali ke layar judul (progres disimpan dulu)
function toMenu() { save(); mode = "select"; buildSelect(); showUI(); }

$("btnPause").addEventListener("click", togglePause);
$("btnResume").addEventListener("click", togglePause);
$("btnMenu").addEventListener("click", toMenu);

// Keluar Permainan (khusus HP). Halaman web tidak selalu boleh menutup dirinya sendiri,
// jadi: simpan → keluar layar penuh → coba tutup → kalau masih terbuka, tampilkan layar pamit.
$("btnExit").hidden = !isTouch;
function keluarPermainan() {
  save();
  toMenu();
  if (typeof keluarPenuh === "function") keluarPenuh();
  if (actx) actx.suspend();
  try { window.close(); } catch (e) {}
  setTimeout(() => { $("bye").hidden = false; $("btnByeBack").focus({ preventScroll: true }); }, 300);
}
$("btnExitYes").addEventListener("click", keluarPermainan);
$("btnByeBack").addEventListener("click", () => { $("bye").hidden = true; if (actx) actx.resume(); });

// Tombol di halaman Volume
$("btnMusic").addEventListener("click", () => setAudio("musik", !audioOn.musik));
$("btnSfx").addEventListener("click", () => setAudio("sfx", !audioOn.sfx));
$("musDown").addEventListener("click", () => changeVolume("musik", -0.1));
$("musUp").addEventListener("click", () => changeVolume("musik", 0.1));
$("sfxDown").addEventListener("click", () => changeVolume("sfx", -0.1));
$("sfxUp").addEventListener("click", () => changeVolume("sfx", 0.1));
$("btnSuara").addEventListener("click", () => setAudio("suara", !audioOn.suara));
$("suaDown").addEventListener("click", () => changeVolume("suara", -0.1));
$("suaUp").addEventListener("click", () => changeVolume("suara", 0.1));
refreshAudioButtons();
