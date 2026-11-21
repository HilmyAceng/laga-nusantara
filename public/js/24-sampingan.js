// =====================================================================
// MISI SAMPINGAN
// Misi dari NPC selain Ki Lurah (SAMPINGAN di config.js), plus tanda biru
// di atas kepala NPC & baris kecil di kotak misi.
// Progres: S.side[id] = { status: "none" | "active" | "done" | "selesai", prog }.
// Misi Ki Lurah (QUESTS) tetap memakai S.q di 12-dialog.js.
// =====================================================================
"use strict";

const sideState = (q) => (S.side[q.id] = S.side[q.id] || { status: "none", prog: 0 });
const sideUntuk = (npcId) => SAMPINGAN.find((q) => q.npc === npcId && sideState(q).status !== "selesai");

function sampinganBicara(npc) {
  const q = sideUntuk(npc.id);
  if (!q) return false;
  const st = sideState(q), r = q.reward;
  if (st.status === "none") {
    const hadiah = [r.gold && t("cerita.hKoin", { n: r.gold }), r.exp && r.exp + " EXP", r.potion && t("cerita.hJamu", { n: r.potion }), r.weapon && t("side.hSenjata"), r.penawar && t("side.hPenawar"), r.jimat && namaJimat(r.jimat)].filter(Boolean).join(", ");
    openDialog(npc.name, `${q.offer} (${t("side.hadiah")}: ${hadiah})`, [
      { label: t("dlg.nanti"), run: closeDialog },
      { label: t("dlg.terima"), primary: true, run: () => {
        st.status = "active";
        st.prog = q.type === "collect" ? Math.min(q.need, S.items[q.item] || 0) : 0; st.sub = 0;
        if (st.prog >= q.need) st.status = "done";
        sfx.quest(); saveSoon(); refreshHud(true); closeDialog();
      } },
    ]);
  } else if (st.status === "active") {
    openDialog(npc.name, t("dlg.progres", { judul: q.title, prog: st.prog, need: q.need }), [{ label: t("dlg.siap"), primary: true, run: closeDialog }]);
  } else {
    openDialog(npc.name, q.done, [{ label: t("dlg.terimaHadiah"), primary: true, run: () => {
      if (q.type === "collect") S.items[q.item] = Math.max(0, (S.items[q.item] || 0) - q.need);
      st.status = "selesai";
      S.gold += r.gold || 0; S.potions += r.potion || 0; S.weapon += r.weapon || 0;
      if (r.penawar) { S.penawar = true; setTimeout(() => toast(t("toast.penawar"), true), 600); }
      if (r.jimat) setTimeout(() => beriJimat(r.jimat), 900);      // 52-jimat.js
      closeDialog(); if (r.exp) gainExp(r.exp); sfx.quest();
      toast(t("toast.hadiah", { koin: r.gold || 0, exp: r.exp || 0 }) + (r.weapon ? " · " + t("toast.senjata", { lv: S.weapon }) : ""), false);
      refreshHud(true); saveSoon();
    } }]);
  }
  return true;
}

function majuSampingan(q, n) {
  const st = sideState(q);
  st.prog = Math.min(q.need, n);
  if (st.prog >= q.need) { st.status = "done"; toast(t("toast.misiSelesai2", { judul: q.title, npc: npcById(q.npc).name }), false); sfx.quest(); }
  else if (q.type === "collect") notifItem(`${t("item." + q.item)} ${st.prog} / ${q.need}`);   // barang: notif kiri bawah
  else toast(`${q.title}: ${st.prog} / ${q.need}`, false);
  refreshHud(true); saveSoon();
}
function sampinganKill(m) {
  for (const q of SAMPINGAN) if (q.type === "kill" && q.target === m.type && sideState(q).status === "active") majuSampingan(q, sideState(q).prog + 1);
}
function sampinganItem(item) {
  for (const q of SAMPINGAN) if (q.type === "collect" && q.item === item && sideState(q).status === "active") majuSampingan(q, S.items[item] || 0);
}
// barang misi (collect) hanya jatuh dari monster `dari` saat misinya aktif
function sampinganDrop(m) {
  for (const q of SAMPINGAN) {
    if (q.type !== "collect" || !q.dari || sideState(q).status !== "active") continue;
    if (![].concat(q.dari).includes(m.type)) continue;
    const peluang = q.item === "sisik" ? ATURAN.monster.dropSisik : q.peluang != null ? q.peluang : 0.5;
    if (Math.random() < peluang) pickups.push({ kind: q.item, x: m.x - 8, y: m.y, t: 0 });
  }
}

// Tanda biru: "!" ada misi baru, "?" misi selesai & tinggal lapor
function tandaSampingan(n) {
  if (n.id === "lurah" && QUESTS[S.q.idx]) {
    if (S.q.status === "none") return { mark: "!", warna: "#8fd3ff" };
    if (S.q.status === "done") return { mark: "?", warna: "#8fd3ff" };
    return null;
  }
  const q = sideUntuk(n.id);
  if (!q) return null;
  const st = sideState(q).status;
  return st === "none" ? { mark: "!", warna: "#8fd3ff" } : st === "done" ? { mark: "?", warna: "#8fd3ff" } : null;
}

// Baris kecil di kotak misi: misi sampingan yang sedang berjalan
function teksMisiSampingan() {
  const out = [];
  const q = QUESTS[S.q.idx];
  if (q && S.q.status === "active") out.push(`${q.title} ${S.q.prog}/${q.need}`);
  if (q && S.q.status === "done") out.push(`${q.title}: ${t("hud.lapor")}`);
  for (const x of SAMPINGAN) {
    const st = sideState(x);
    if (st.status === "active") out.push(`${x.title} ${st.prog}/${x.need}`);
    if (st.status === "done") out.push(`${x.title}: ${t("side.lapor", { npc: npcById(x.npc).name })}`);
  }
  return out.slice(0, 2).join(" · ");
}
