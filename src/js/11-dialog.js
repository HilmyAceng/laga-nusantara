// =====================================================================
// DIALOG NPC
// Kotak dialog, percakapan Ki Lurah (misi) dan Mbok Darmi (toko).
// =====================================================================
"use strict";

const dlg = { box: $("dialog"), name: $("dlgName"), text: $("dlgText"), actions: $("dlgActions") };
function openDialog(name, text, actions) {
  dlg.name.textContent = name; dlg.text.textContent = text; dlg.actions.innerHTML = "";
  for (const a of actions) {
    const b = document.createElement("button"); b.type = "button"; b.textContent = a.label;
    if (a.primary) b.className = "primary";
    if (a.disabled) b.disabled = true;
    b.addEventListener("click", a.run);
    dlg.actions.appendChild(b);
  }
  mode = "dialog"; showUI(); sfx.talk();
  const first = dlg.actions.querySelector("button:not(:disabled)"); first && first.focus({ preventScroll: true });
}
function closeDialog() { if (mode === "dialog") { mode = "play"; showUI(); } }

// Bisa diajak bicara? (NPC "diam" belum bisa; cermin tidak bisa disentuh saat bos sedang ada)
function bisaBicara(n) {
  if (n.diam) return false;
  if (n.id === "cermin") return !summon && !bosHidup();
  return true;
}
function talk(npc) {
  if (npc.id === "cermin") return talkCermin(npc);
  if (npc.id === "lurah") {
    const q = QUESTS[S.q.idx];
    if (!q) return openDialog(npc.name, "Berkat kamu, Wanasari kembali tenang. Hutan masih luas, silakan terus berlatih.", [{ label: "Tutup", run: closeDialog, primary: true }]);
    if (S.q.status === "none") {
      return openDialog(npc.name, q.offer + ` (Hadiah: ${q.reward.gold} koin, ${q.reward.exp} EXP)`, [
        { label: "Nanti dulu", run: closeDialog },
        { label: "Terima misi", primary: true, run: () => { S.q.status = "active"; S.q.prog = q.type === "collect" ? Math.min(q.need, S.items[q.item] || 0) : 0; if (S.q.prog >= q.need) S.q.status = "done"; ensureBoss(); saveSoon(); refreshHud(true); sfx.quest(); closeDialog(); } },
      ]);
    }
    if (S.q.status === "active") return openDialog(npc.name, `${q.title}: ${S.q.prog} dari ${q.need}. Hati-hati di luar sana.`, [{ label: "Siap", run: closeDialog, primary: true }]);
    if (S.q.status === "done") {
      return openDialog(npc.name, "Luar biasa! Terimalah hadiah ini dari warga desa.", [{ label: "Terima hadiah", primary: true, run: () => {
        if (q.type === "collect") S.items[q.item] = Math.max(0, (S.items[q.item] || 0) - q.need);
        S.gold += q.reward.gold; S.potions += q.reward.potion || 0;
        S.q = { idx: S.q.idx + 1, prog: 0, status: "none" };
        closeDialog(); gainExp(q.reward.exp); sfx.quest();
        toast(`+${q.reward.gold} koin · +${q.reward.exp} EXP`, false);
        refreshHud(true); saveSoon();
        if (S.q.idx >= QUESTS.length) showWin();
      } }]);
    }
  } else if (npc.id === "dagang") {
    const T0 = ATURAN.toko, wCost = T0.hargaAsah * (S.weapon + 1);
    openDialog(npc.name, `Mau beli apa, Nak? Koinmu ${S.gold}. Jamu memulihkan ${Math.round(ATURAN.jamuPulih * 100)}% nyawa. Senjatamu sekarang tingkat ${S.weapon}.`, [
      { label: `Beli jamu (${T0.hargaJamu})`, disabled: S.gold < T0.hargaJamu, run: () => { S.gold -= T0.hargaJamu; S.potions++; sfx.coin(); saveSoon(); talk(npc); } },
      { label: `Asah senjata +${L.seranganPerSenjata} serangan (${wCost})`, disabled: S.gold < wCost, run: () => { S.gold -= wCost; S.weapon++; sfx.level(); toast(`Senjata tingkat ${S.weapon}`, false); saveSoon(); talk(npc); } },
      { label: "Tutup", primary: true, run: closeDialog },
    ]);
  }
}
