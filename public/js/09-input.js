// =====================================================================
// INPUT
// Keyboard (tombol dari KONTROL di config.js), joystick & tombol sentuh di HP.
// =====================================================================
"use strict";

const keys = { up: false, down: false, left: false, right: false, attack: false };
const press = { skill: false, skill2: false, ult: false, roll: false, potion: false, talk: false };
const stick = { x: 0, y: 0 };
let touchAttack = false;
// Tombol dibaca dari KONTROL di config.js → peta "tombol → aksi".
const ACTION_OF = {};
for (const [act, list] of Object.entries(KONTROL)) for (const k of list) ACTION_OF[k.length === 1 ? k.toLowerCase() : k] = act;
const HOLD = { atas: "up", bawah: "down", kiri: "left", kanan: "right", serang: "attack" };
const keyName = (e) => (e.key.length === 1 ? e.key.toLowerCase() : e.key);
addEventListener("keydown", (e) => {
  const act = ACTION_OF[keyName(e)];
  if (!act) return;
  if (HOLD[act]) { keys[HOLD[act]] = true; e.preventDefault(); }
  if (e.repeat) return;
  if (act === "jurus") press.skill = true;
  if (act === "hindar") press.roll = true;
  if (act === "jamu") press.potion = true;
  if (act === "bicara") { if (mode === "dialog") closeDialog(); else press.talk = true; }
  if (act === "jeda") {
    if (mode === "dialog") closeDialog();
    else if (mode === "map") closeMap();
    else if (mode === "misi") tutupMisi();
    else if (mode === "tantang") tutupTantangan();
    else if (mode === "pause" && PAUSE_BACK[pauseView]) showPauseView(PAUSE_BACK[pauseView]);
    else togglePause();
  }
  if (act === "peta") toggleMap();
  if (act === "misi") toggleMisi();
  if (act === "musik") { setAudio("musik", !audioOn.musik); if (mode !== "select") toast(t("toast.musik", { status: t(audioOn.musik ? "toast.nyala" : "toast.mati") }), false); }
});
addEventListener("keyup", (e) => { const act = ACTION_OF[keyName(e)]; if (HOLD[act]) keys[HOLD[act]] = false; });

// Teks petunjuk tombol di layar judul juga dibuat dari KONTROL.
const KEY_LABEL = { ArrowUp: "↑", ArrowDown: "↓", ArrowLeft: "←", ArrowRight: "→", Escape: "Esc", " ": "Spasi" };
const kb = (act) => KONTROL[act].map((k) => `<kbd>${KEY_LABEL[k] || (k.length === 1 ? k.toUpperCase() : k)}</kbd>`).join("/");
function buildKeysHint() {
  $("keysHint").innerHTML = t("judul.keys", { gerak: kb("kiri") + kb("atas") + kb("kanan") + kb("bawah"), serang: kb("serang"), jurus: kb("jurus"),
    hindar: kb("hindar"), jamu: kb("jamu"), bicara: kb("bicara"), peta: kb("peta"), misi: kb("misi"), jeda: kb("jeda"), musik: kb("musik") });
}
buildKeysHint();

const stickEl = $("stick"), knob = $("knob");
let stickId = null;
function stickMove(e) {
  const r = stickEl.getBoundingClientRect();
  let dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
  const len = Math.hypot(dx, dy), max = 46;
  if (len > max) { dx = dx / len * max; dy = dy / len * max; }
  knob.style.transform = `translate(${dx}px, ${dy}px)`;
  const l = Math.hypot(dx, dy) / max;
  stick.x = l > 0.2 ? dx / max : 0; stick.y = l > 0.2 ? dy / max : 0;
}
stickEl.addEventListener("pointerdown", (e) => { stickId = e.pointerId; stickEl.setPointerCapture(e.pointerId); stickMove(e); });
stickEl.addEventListener("pointermove", (e) => { if (e.pointerId === stickId) stickMove(e); });
const stickEnd = (e) => { if (e.pointerId !== stickId) return; stickId = null; stick.x = stick.y = 0; knob.style.transform = ""; };
stickEl.addEventListener("pointerup", stickEnd); stickEl.addEventListener("pointercancel", stickEnd);

function bindBtn(id, down, up) {
  const el = $(id);
  el.addEventListener("pointerdown", (e) => { e.preventDefault(); el.setPointerCapture(e.pointerId); el.classList.add("pressed"); down(); });
  const end = () => { el.classList.remove("pressed"); up && up(); };
  el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
  el.addEventListener("contextmenu", (e) => e.preventDefault());
}
bindBtn("bAtk", () => (touchAttack = true), () => (touchAttack = false));
bindBtn("bSkill", () => (press.skill = true));
bindBtn("bRoll", () => (press.roll = true));
bindBtn("bPot", () => (press.potion = true));
// Bicara baru jalan saat jari DIANGKAT di atas tombol (bukan saat baru menyentuh),
// supaya sentuhan yang sama tidak "tembus" ke popup yang langsung muncul.
(() => {
  const el = $("bTalk");
  el.addEventListener("pointerdown", (e) => { e.preventDefault(); el.setPointerCapture(e.pointerId); el.classList.add("pressed"); });
  el.addEventListener("pointerup", (e) => {
    el.classList.remove("pressed");
    const r = el.getBoundingClientRect();
    if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) press.talk = true;
  });
  el.addEventListener("pointercancel", () => el.classList.remove("pressed"));
  el.addEventListener("contextmenu", (e) => e.preventDefault());
})();
// Popup yang baru terbuka mengabaikan klik selama sebentar (cegah sentuhan tembus di HP)
let popupDibuka = 0;
const popupBaruBuka = () => performance.now() - popupDibuka < 450;

const isTouch = ("ontouchstart" in window) || matchMedia("(pointer: coarse)").matches;
if (isTouch) $("keysHint").hidden = true;

function readInput() {
  let mx = (keys.right ? 1 : 0) - (keys.left ? 1 : 0), my = (keys.down ? 1 : 0) - (keys.up ? 1 : 0);
  if (!mx && !my) { mx = stick.x; my = stick.y; }
  const l = Math.hypot(mx, my);
  if (l > 1) { mx /= l; my /= l; }
  const inp = { mx, my, attack: keys.attack || touchAttack, ...press };
  for (const k in press) press[k] = false;
  return inp;
}
