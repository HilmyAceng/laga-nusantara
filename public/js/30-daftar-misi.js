// =====================================================================
// DAFTAR MISI
// Popup berisi semua misi yang sudah diterima: cerita utama, misi Ki Lurah,
// dan misi sampingan. Tiap misi menampilkan judul, perintah, dan hadiah.
// Pemain memilih satu misi untuk "dilacak": misi itu tampil di kotak misi
// (pojok kiri atas) dan diikuti panah emas serta bintang di peta.
// Buka: ketuk/klik kotak misi, atau tombol KONTROL.misi (awalnya J).
// Misi yang dilacak disimpan di S.lacak ("utama" | "lurah" | "side:<id>").
// =====================================================================
"use strict";

// Teks hadiah: { gold, exp, potion, weapon, item } → "+30 koin · +40 EXP · ..."
function teksHadiah(h) {
  if (!h) return "";
  return [
    h.gold && t("cerita.hKoin", { n: h.gold }),
    h.exp && "+" + h.exp + " EXP",
    h.potion && t("cerita.hJamu", { n: h.potion }),
    h.weapon && t("side.hSenjata"),
    h.penawar && t("side.hPenawar"),
    h.item && t("item." + h.item),
  ].filter(Boolean).join(" · ");
}
// Tempat monster jenis ini: bos → tempat bosnya; monster biasa → zonanya
function tempatMonster(jenis) {
  if (MONSTERS[jenis] && MONSTERS[jenis].boss)
    for (const [id, a] of Object.entries(AREAS)) if (a.bos && a.bos.monster === jenis) return { area: id, x: a.bos.x * T, y: a.bos.y * T };
  return zonaMonster(jenis);
}
const tempatNpc = (id) => { const n = npcById(id); return n && { area: n.area, x: n.x, y: n.y, npc: true }; };
// Perintah & tujuan untuk misi Ki Lurah / sampingan (bentuknya sama: kill / collect)
function perintahMisi(q, prog, selesai, npcId) {
  const nama = npcById(npcId).name;
  if (selesai) return { perintah: t("misi.lapor", { npc: nama }), target: () => tempatNpc(npcId) };
  if (q.type === "kill") return {
    perintah: t("misi.kalahkan", { n: q.need, nama: MONSTERS[q.target].name }) + ` (${prog}/${q.need})`,
    target: () => tempatMonster(q.target),
  };
  return {
    perintah: t("misi.kumpulkan", { n: q.need, nama: t("item." + q.item) }) + ` (${prog}/${q.need})`,
    target: () => tempatMonster([].concat(q.dari || SUMBER_BARANG[q.item])[0]),
  };
}

// Semua misi yang sedang berjalan, cerita utama paling atas.
function daftarMisi() {
  if (!S) return [];
  const out = [];
  if (!ceritaTamat()) {
    const l = langkahCerita();
    let prog = "";
    if (l.tipe === "kill") prog = ` (${S.cerita.prog}/${l.need})`;
    if (l.tipe === "collect") prog = ` (${S.items[l.item] || 0}/${l.need})`;
    out.push({ id: "utama", jenis: t("misi.jUtama") + " · " + l.bab, judul: judulEpisode(l), perintah: l.tujuan + prog, hadiah: teksHadiah(l.hadiah), target: ceritaTarget });
  }
  const q = QUESTS[S.q.idx];
  if (q && (S.q.status === "active" || S.q.status === "done")) {
    const p = perintahMisi(q, S.q.prog, S.q.status === "done", "lurah");
    out.push({ id: "lurah", jenis: t("misi.jDari", { npc: npcById("lurah").name }), judul: q.title, hadiah: teksHadiah(q.reward), selesai: S.q.status === "done", ...p });
  }
  for (const x of SAMPINGAN) {
    const st = sideState(x);
    if (st.status !== "active" && st.status !== "done") continue;
    const p = perintahMisi(x, st.prog, st.status === "done", x.npc);
    out.push({ id: "side:" + x.id, jenis: t("misi.jDari", { npc: npcById(x.npc).name }), judul: x.title, hadiah: teksHadiah(x.reward), selesai: st.status === "done", ...p });
  }
  return out;
}
// Misi yang dilacak. Kalau misi pilihan sudah selesai, kembali ke misi pertama.
function misiLacak() {
  const d = daftarMisi();
  return d.find((m) => m.id === S.lacak) || d[0] || null;
}
// Titik tujuan misi yang dilacak (dipakai panah, peta mini & peta besar)
function targetLacak() { const m = misiLacak(); return m ? m.target() : null; }

// Isi kotak misi di pojok kiri atas
function teksKotakMisi() {
  const m = misiLacak();
  if (!m) return teksMisiUtama();   // tidak ada misi: "cerita tamat"
  const lain = daftarMisi().length - 1;
  const bawah = (lain > 0 ? t("misi.lain", { n: lain }) + " · " : "") + t(isTouch ? "misi.ketuk" : "misi.tekan", { k: kb("misi") });
  return `<b>${m.judul}</b>${m.perintah}<small class="side">${bawah}</small>`;
}

// ---------- Popup ----------
function bukaMisi() {
  if (mode !== "play") return;
  mode = "misi"; popupDibuka = performance.now();
  isiMisi();
  showUI();
}
function tutupMisi() { if (mode !== "misi") return; mode = "play"; showUI(); }
function toggleMisi() { if (mode === "misi") tutupMisi(); else bukaMisi(); }
function isiMisi() {
  const d = daftarMisi(), now = misiLacak();
  $("misiList").innerHTML = d.length ? d.map((m) => `
    <button type="button" class="misi-card${m.id === "utama" ? " utama" : ""}" data-misi="${m.id}" aria-pressed="${now && now.id === m.id}">
      <span class="misi-jenis">${m.jenis}</span>
      <b class="misi-judul">${m.judul}</b>
      <span class="misi-perintah">${m.perintah}</span>
      ${m.hadiah ? `<span class="misi-hadiah"><i class="coin"></i>${t("misi.hadiah")}: ${m.hadiah}</span>` : ""}
      <span class="misi-lacak">${t(now && now.id === m.id ? "misi.dilacak" : "misi.lacak")}</span>
    </button>`).join("") : `<p class="misi-kosong">${t("misi.kosong")}</p>`;
}
$("misiList").addEventListener("click", (e) => {
  const b = e.target.closest("[data-misi]");
  if (!b || popupBaruBuka()) return;
  const m = daftarMisi().find((x) => x.id === b.dataset.misi);
  if (!m) return;
  S.lacak = m.id; saveSoon(); sfx.click();
  refreshHud(true);
  toast(t("misi.melacak", { judul: m.judul }), false);
  tutupMisi();
});
$("questBox").closest(".me").addEventListener("click", bukaMisi);
$("btnMisiClose").addEventListener("click", tutupMisi);
$("misiBox").addEventListener("click", (e) => { if (e.target === e.currentTarget) tutupMisi(); });
