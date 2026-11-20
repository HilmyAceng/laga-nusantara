// =====================================================================
// MENU JEDA
// Menu jeda bertingkat: Lanjut / Pengaturan (Volume, Kontrol) / Menu utama.
// =====================================================================
"use strict";

function togglePause() {
  if (mode === "play") {
    mode = "pause";
    $("pauseStats").textContent = `${CLASSES[S.cls].name} Lv ${S.lv} · ${S.kills} monster dikalahkan · serangan ${atkPower()} · senjata tingkat ${S.weapon}. Progres tersimpan otomatis.`;
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
    [keys("kiri", "atas", "kanan", "bawah"), "Gerak"],
    [keys("serang"), `Serang <small>— tahan untuk serang terus, otomatis membidik musuh terdekat</small>`],
    [keys("jurus"), `Jurus: ${C.skill.name} <small>— lalu tunggu jeda ${C.skill.cd} detik</small>`],
    [keys("hindar"), `Hindar <small>— guling cepat, kebal sesaat</small>`],
    [keys("jamu"), `Minum jamu <small>— pulihkan ${pulih}% nyawa</small>`],
    [keys("bicara"), `Bicara <small>— saat dekat NPC, juga menutup dialog</small>`],
    [keys("jeda"), "Jeda / lanjut"],
    [keys("musik"), "Musik nyala / mati"],
  ];
  $("ctlKey").innerHTML = rows.map(([k, d]) => `<span class="k">${k}</span><span>${d}</span>`).join("");
  $("ctlTouchList").innerHTML = [
    `<b>Joystick kiri</b> — geser ke arah mana pun untuk berjalan`,
    `<b>Serang</b> — tahan untuk serang terus, otomatis membidik`,
    `<b>Jurus</b> — ${C.skill.name}. Lingkaran gelap = sedang diisi ulang`,
    `<b>Hindar</b> — guling ke arah joystick, kebal sesaat`,
    `<b>Jamu</b> — pulihkan ${pulih}% nyawa`,
    `<b>Bicara</b> — hanya muncul saat dekat NPC`,
    `<b>❚❚</b> kanan atas — jeda. <small>Putar HP ke mode lanskap biar leluasa.</small>`,
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

// Pindah halaman di menu jeda: main → settings → volume / control.
const PAUSE_BACK = { main: null, settings: "main", volume: "settings", control: "settings" };
let pauseView = "main";
function showPauseView(view, silent) {
  pauseView = view;
  document.querySelectorAll("#pauseBox .pview").forEach((el) => { el.hidden = el.dataset.view !== view; });
  $("pausePanel").classList.toggle("wide", view === "volume" || view === "control");
  if (view === "volume") refreshAudioButtons();
  if (view === "control") buildControls();
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

// Tombol di halaman Volume
$("btnMusic").addEventListener("click", () => setAudio("musik", !audioOn.musik));
$("btnSfx").addEventListener("click", () => setAudio("sfx", !audioOn.sfx));
$("musDown").addEventListener("click", () => changeVolume("musik", -0.1));
$("musUp").addEventListener("click", () => changeVolume("musik", 0.1));
$("sfxDown").addEventListener("click", () => changeVolume("sfx", -0.1));
$("sfxUp").addEventListener("click", () => changeVolume("sfx", 0.1));
refreshAudioButtons();
