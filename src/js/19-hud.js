// =====================================================================
// HUD
// Kotak misi, koin & jamu, kotak cooldown, pesan singkat (toast),
// serta showUI() yang mengatur layar mana yang tampil.
// =====================================================================
"use strict";

const ui = {
  hud: $("hud"), touch: $("touch"), select: $("select"), pause: $("pauseBox"), win: $("win"),
  quest: $("questBox"), gold: $("gold"), pots: $("pots"), boss: $("bossBar"), bossFill: $("bossFill"), bossName: $("bossName"),
  bSkill: $("bSkill"), bRoll: $("bRoll"), bTalk: $("bTalk"),
  skills: $("skills"), sSkill: $("sSkill"), sRoll: $("sRoll"), sSkillSec: $("sSkillSec"), sRollSec: $("sRollSec"),
};
// Kotak cooldown (PC): gelap berputar = masih menunggu, angka = sisa detik, bingkai emas = siap.
function setSlot(el, secEl, key, left, total) {
  const cd = Math.round(left / total * 40) / 40, sec = left > 0 ? Math.ceil(left * 10) / 10 : 0;
  if (last[key] === cd) return;
  const wasReady = last[key] === 0;
  last[key] = cd;
  el.style.setProperty("--cd", cd);
  secEl.textContent = sec > 0 ? (sec < 1 ? sec.toFixed(1) : String(Math.ceil(sec))) : "";
  el.classList.toggle("ready", cd === 0);
  if (cd === 0 && wasReady === false && last[key + "Seen"]) { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
  last[key + "Seen"] = true;
}
const last = {};
function setText(el, key, v) { if (last[key] !== v) { last[key] = v; el.textContent = v; } }
function refreshHud(force) {
  if (!S || !P) return;
  if (force) for (const k in last) delete last[k];
  // Nama, level, nyawa & EXP hero digambar di atas kepalanya: lihat drawPlayerTag() di 16-gambar.js
  setText(ui.gold, "gold", String(S.gold));
  setText(ui.pots, "pots", String(S.potions));
  // misi yang sedang dilacak + jumlah misi lain (30-daftar-misi.js)
  const qh = teksKotakMisi();
  if (last.q !== qh) { last.q = qh; ui.quest.innerHTML = qh; }
  const boss = monsters.find((m) => m.d.boss && !m.dead && m.aggro);
  ui.boss.hidden = !boss || mode === "select";
  if (boss) { ui.bossFill.style.width = (100 * boss.hp / boss.d.hp) + "%"; setText(ui.bossName, "bossName", hudFaseBos(boss)); }   // "Fase n/m" (62-fase-bos.js)
  hudJurus();                       // jurus slot 1 & 2, pamungkas (48-jurus.js, 49-pamungkas.js)
  hudHindar();                      // lapis hindar (50-hindar-tangkis.js)
  hudJamu();                        // jumlah & jeda jamu (65-jamu-jeda.js)
  hudPintasan();                    // lencana poin jurus di tombol ⚔ (66-status-karakter.js)
  if (!isTouch) {
    if (last.sn !== S.cls) {
      last.sn = S.cls;
      const lbl = (act) => { const k = KONTROL[act][0]; return KEY_LABEL[k] || (k.length === 1 ? k.toUpperCase() : k); };
      $("sRollKey").textContent = lbl("hindar");
    }
  }
  const talkable = !!nearNpc && mode === "play";
  if (last.talk !== talkable) { last.talk = talkable; ui.bTalk.hidden = !talkable; }
}
function toast(text, big) {
  const el = document.createElement("div"); el.className = "toast" + (big ? " big" : ""); el.textContent = text;
  const box = $("toasts"); box.appendChild(el);
  while (box.children.length > 3) box.firstChild.remove();
  setTimeout(() => el.remove(), big ? 2200 : 3200);
}
function showUI() {
  ui.select.hidden = mode !== "select";
  ui.pause.hidden = mode !== "pause";
  $("mapBox").hidden = mode !== "map";
  $("misiBox").hidden = mode !== "misi";
  $("tantangBox").hidden = mode !== "tantang";
  ui.win.hidden = mode !== "win";
  dlg.box.hidden = mode !== "dialog";
  ui.hud.hidden = mode === "select";
  ui.touch.hidden = !(isTouch && mode === "play");
  ui.skills.hidden = isTouch || mode !== "play";
  if (mode === "select") ui.boss.hidden = true;
  resize();
}
