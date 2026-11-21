// =====================================================================
// DIALOG NPC
// Kotak dialog, percakapan Ki Lurah (misi) dan Mbok Darmi (toko).
// =====================================================================
"use strict";

let tokoNpc = null;   // toko yang terakhir dibuka
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
  if (n.kind === "obor") return !tekaSelesai("obor") && !oborNyala.includes(n.simbol);
  return true;
}
// lewatInfo = true → langsung ke urusan misi/toko/obrolan (lewati menu tanya-jawab NPC)
function talk(npc, lewatInfo) {
  if (npc.id === "cermin") return talkCermin(npc);
  if (npc.kind && cekBelumSaatnya(npc)) return;                                // belum waktunya (60-belum-saatnya.js)
  if (npc.kind && TEKA_BICARA[npc.kind]) return TEKA_BICARA[npc.kind](npc);   // 25-teka-teki.js
  if (ceritaBicara(npc)) return;                                               // 23-cerita.js
  if (!lewatInfo && NPC_INFO[npc.id]) return NPC_INFO[npc.id](npc);           // tanya-jawab (mis. Pak Joko: 38-panduan-debuff.js)
  if (npc.id === "lurah") {
    const q = QUESTS[S.q.idx];
    if (!q) return openDialog(npc.name, t("dlg.lurahSelesai"), [{ label: t("dlg.tutup"), run: closeDialog, primary: true }]);
    if (S.q.status === "none") {
      return openDialog(npc.name, q.offer + t("dlg.hadiah", { koin: q.reward.gold, exp: q.reward.exp }), [
        { label: t("dlg.nanti"), run: closeDialog },
        { label: t("dlg.terima"), primary: true, run: () => { S.q.status = "active"; S.q.prog = q.type === "collect" ? Math.min(q.need, S.items[q.item] || 0) : 0; if (S.q.prog >= q.need) S.q.status = "done"; ensureBoss(); saveSoon(); refreshHud(true); sfx.quest(); closeDialog(); } },
      ]);
    }
    if (S.q.status === "active") return openDialog(npc.name, t("dlg.progres", { judul: q.title, prog: S.q.prog, need: q.need }), [{ label: t("dlg.siap"), run: closeDialog, primary: true }]);
    if (S.q.status === "done") {
      return openDialog(npc.name, t("dlg.lurahHadiah"), [{ label: t("dlg.terimaHadiah"), primary: true, run: () => {
        if (q.type === "collect") S.items[q.item] = Math.max(0, (S.items[q.item] || 0) - q.need);
        S.gold += q.reward.gold; S.potions += q.reward.potion || 0;
        S.q = { idx: S.q.idx + 1, prog: 0, status: "none" };
        closeDialog(); gainExp(q.reward.exp); sfx.quest();
        toast(t("toast.hadiah", { koin: q.reward.gold, exp: q.reward.exp }), false);
        refreshHud(true); saveSoon();
        if (S.q.idx >= QUESTS.length) toast(t("toast.lurahTamat"), true);
      } }]);
    }
  } else if (sampinganBicara(npc)) {                                          // 24-sampingan.js
  } else if (npc.toko) {
    tokoNpc = npc;
    const T0 = ATURAN.toko, wCost = T0.hargaAsah * (S.weapon + 1);
    openDialog(npc.name, t("dlg.toko", { koin: S.gold, pulih: Math.round(ATURAN.jamuPulih * 100), lv: S.weapon }), [
      { label: t("dlg.beliJamu", { harga: T0.hargaJamu }), disabled: S.gold < T0.hargaJamu, run: () => { S.gold -= T0.hargaJamu; S.potions++; sfx.coin(); saveSoon(); talk(npc); } },
      { label: t("dlg.asah", { atk: L.seranganPerSenjata, harga: wCost }), disabled: S.gold < wCost, run: () => { S.gold -= wCost; S.weapon++; sfx.level(); toast(t("toast.senjata", { lv: S.weapon }), false); saveSoon(); talk(npc); } },
      { label: t("dlg.ramuan"), run: () => tokoRamuan(npc) },          // 52-jimat.js
      { label: t("dlg.jimat"), run: () => bukaJimatToko() },
      { label: t("dlg.tutup"), primary: true, run: closeDialog },
    ]);
  }
  else if (npc.obrolan) openDialog(npc.name, npc.obrolan[Math.floor(Math.random() * npc.obrolan.length)], [{ label: t("dlg.tutup"), primary: true, run: closeDialog }]);
}
