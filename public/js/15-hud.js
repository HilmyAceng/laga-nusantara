// =====================================================================
// HUD
// Panel status, koin & jamu, kotak cooldown, pesan singkat (toast),
// serta showUI() yang mengatur layar mana yang tampil.
// =====================================================================
"use strict";

const ui = {
  hud: $("hud"), touch: $("touch"), select: $("select"), pause: $("pauseBox"), win: $("win"),
  hpFill: $("hpFill"), hpText: $("hpText"), hpBar: $("hpBar"), xpFill: $("xpFill"), lv: $("hLv"), name: $("hName"),
  quest: $("questBox"), gold: $("gold"), pots: $("pots"), boss: $("bossBar"), bossFill: $("bossFill"),
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
  const mh = maxHp(), hp = Math.max(0, Math.ceil(P.hp));
  if (last.hp !== hp || last.mh !== mh) {
    last.hp = hp; last.mh = mh;
    ui.hpFill.style.width = (100 * hp / mh) + "%"; ui.hpText.textContent = `${hp} / ${mh}`;
    ui.hpBar.classList.toggle("low", hp < mh * 0.3);
  }
  const xp = Math.round(100 * S.exp / expNeed(S.lv));
  if (last.xp !== xp) { last.xp = xp; ui.xpFill.style.width = xp + "%"; }
  setText(ui.lv, "lv", "Lv " + S.lv);
  setText(ui.name, "name", CLASSES[S.cls].name);
  setText(ui.gold, "gold", String(S.gold));
  setText(ui.pots, "pots", String(S.potions));
  const q = QUESTS[S.q.idx];
  let qh = "";
  if (!q) qh = "<b>Bebas bertualang</b>Semua misi selesai";
  else if (S.q.status === "none") qh = "<b>Misi baru</b>Temui Ki Lurah (tanda !)";
  else if (S.q.status === "active") qh = `<b>${q.title}</b>${q.type === "kill" ? "Kalahkan" : "Kumpulkan"} ${S.q.prog} / ${q.need}`;
  else qh = `<b>${q.title}</b>Selesai! Lapor ke Ki Lurah`;
  if (last.q !== qh) { last.q = qh; ui.quest.innerHTML = qh; }
  const boss = monsters.find((m) => m.d.boss && !m.dead && m.aggro);
  ui.boss.hidden = !boss || mode === "select";
  if (boss) ui.bossFill.style.width = (100 * boss.hp / boss.d.hp) + "%";
  const sc = Math.round(P.skillCd / CLASSES[S.cls].skill.cd * 40) / 40;
  if (last.sc !== sc) { last.sc = sc; ui.bSkill.style.setProperty("--cd", sc); }
  const rc = Math.round(P.rollCd / ATURAN.hindar.jeda * 20) / 20;
  if (last.rc !== rc) { last.rc = rc; ui.bRoll.style.setProperty("--cd", rc); }
  if (!isTouch) {
    setSlot(ui.sSkill, ui.sSkillSec, "ss", P.skillCd, CLASSES[S.cls].skill.cd);
    setSlot(ui.sRoll, ui.sRollSec, "sr", P.rollCd, ATURAN.hindar.jeda);
    if (last.sn !== S.cls) {
      last.sn = S.cls;
      const lbl = (act) => { const k = KONTROL[act][0]; return KEY_LABEL[k] || (k.length === 1 ? k.toUpperCase() : k); };
      $("sSkillName").textContent = CLASSES[S.cls].skill.name;
      $("sSkillKey").textContent = lbl("jurus"); $("sRollKey").textContent = lbl("hindar");
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
  ui.win.hidden = mode !== "win";
  dlg.box.hidden = mode !== "dialog";
  ui.hud.hidden = mode === "select";
  ui.touch.hidden = !(isTouch && mode === "play");
  ui.skills.hidden = isTouch || mode !== "play";
  if (mode === "select") ui.boss.hidden = true;
  resize();
}
