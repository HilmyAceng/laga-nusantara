// =====================================================================
// CERITA UTAMA
// Menjalankan CERITA (config.js) langkah demi langkah: percakapan, hadiah,
// tujuan di kotak misi, dan titik tujuan untuk panah penunjuk (27-navigasi.js).
// Progres: S.cerita = { idx: langkah ke-, prog: hitungan kill }.
// =====================================================================
"use strict";

const langkahCerita = () => (S ? CERITA[S.cerita.idx] : null);
const ceritaTamat = () => !!S && S.cerita.idx >= CERITA.length;
// Bos ini perlu muncul karena cerita? (dipakai ensureBoss di 05-status.js)
function ceritaButuhBos(jenis) {
  const l = langkahCerita();
  return !!l && l.tipe === "bos" && l.monster === jenis && !S.bos[jenis];
}

// ---------- Percakapan bertahap ----------
// baris = [[pembicara, kalimat], ...]. Pembicara: id NPC, "narasi", atau "raja".
function namaPembicara(who) {
  if (who === "narasi") return t("cerita.narator");
  if (who === "raja") return MONSTERS.rajaBanaspati.name;
  if (who === "hero") return CLASSES[S.cls].name;
  if (MONSTERS[who]) return MONSTERS[who].name;
  const n = npcById(who);
  return n ? n.name : who;
}
function narasi(baris, after) {
  let i = 0;
  const next = () => {
    if (i >= baris.length) { closeDialog(); if (after) after(); return; }
    const [who, teks] = baris[i++];
    openDialog(namaPembicara(who), teks, [{ label: i < baris.length ? t("cerita.lanjut") : t("dlg.tutup"), primary: true, run: next }]);
  };
  next();
}

// ---------- Selesaikan langkah ----------
function beriHadiah(h) {
  if (!h) return;
  const bagian = [];
  if (h.gold) { S.gold += h.gold; bagian.push(t("cerita.hKoin", { n: h.gold })); }
  if (h.potion) { S.potions += h.potion; bagian.push(t("cerita.hJamu", { n: h.potion })); }
  if (h.item) { S.items[h.item] = 1; bagian.push(t("item." + h.item)); }
  if (h.exp) { bagian.push("+" + h.exp + " EXP"); gainExp(h.exp); }
  if (bagian.length) toast(bagian.join(" · "), false);
}
// putarTeks = false kalau teksnya sudah ditampilkan (langkah "bicara")
function selesaiLangkah(putarTeks = true) {
  const l = langkahCerita();
  if (!l) return;
  S.cerita.idx++; S.cerita.prog = 0;
  beriHadiah(l.hadiah);
  if (l.buka) bukaKunci(l.buka);        // gerbang baru terbuka (kapal, kuil, pelangi)
  sfx.quest(); saveSoon();
  const lanjut = () => {
    refreshHud(true); ensureBoss();
    const baru = langkahCerita();
    const akhir = () => {
      if (ceritaTamat()) { showWin(); return; }
      toast(t("cerita.tujuanBaru", { tujuan: langkahCerita().tujuan }), true);
      cekOtomatis();
    };
    // bab selesai → pengumuman "Tamat bab ... / Mulai bab ..." (40-ganti-bab.js)
    if (!baru || baru.bab !== l.bab) umumkanBab(l.bab, baru && baru.bab, akhir); else akhir();
  };
  if (putarTeks && l.teks && l.teks.length) narasi(l.teks, lanjut); else lanjut();
}
// Langkah baru yang syaratnya sudah terpenuhi (misalnya teka-teki sudah dipecahkan duluan)
function cekOtomatis() {
  const l = langkahCerita();
  if (!l) return;
  if (l.tipe === "teka" && S.teka[l.id]) selesaiLangkah();
  else if (l.tipe === "datang" && l.area === areaId && mode === "play") selesaiLangkah();
  else if (l.tipe === "collect" && (S.items[l.item] || 0) >= l.need) { S.items[l.item] -= l.need; selesaiLangkah(); }
  else if (l.tipe === "bos" && S.bos[l.monster]) selesaiLangkah();
}

// ---------- Kait dari bagian lain ----------
function ceritaBicara(npc) {            // 12-dialog.js
  const l = langkahCerita();
  if (!l || l.tipe !== "bicara" || l.npc !== npc.id) return false;
  narasi(l.teks, () => selesaiLangkah(false));
  return true;
}
function ceritaTiba(id) {               // 06-area.js, setelah layar terang
  const l = langkahCerita();
  if (l && l.tipe === "datang" && l.area === id) selesaiLangkah();
}
function ceritaKill(m) {                // 10-tarung.js
  const l = langkahCerita();
  if (!l) return;
  if (l.tipe === "kill" && l.target === m.type) {
    S.cerita.prog++;
    if (S.cerita.prog >= l.need) selesaiLangkah();
    else toast(`${l.tujuan}: ${S.cerita.prog} / ${l.need}`, false);
  }
  if (l.tipe === "bos" && l.monster === m.type) selesaiLangkah();
}
function ceritaItem(item) {             // saat memungut barang
  const l = langkahCerita();
  if (!l || l.tipe !== "collect" || l.item !== item) return;
  const n = S.items[item] || 0;
  if (n >= l.need) { S.items[item] -= l.need; selesaiLangkah(); }
  else notifItem(`${t("item." + item)} ${n} / ${l.need}`);
}
function ceritaTeka(id) {               // 25-teka-teki.js
  const l = langkahCerita();
  if (l && l.tipe === "teka" && l.id === id) selesaiLangkah();
}
// Barang cerita yang dijatuhkan monster (hanya saat langkahnya aktif)
function ceritaDrop(m) {
  const l = langkahCerita();
  if (!l || l.tipe !== "collect" || (l.dari || SUMBER_BARANG[l.item]) !== m.type) return;
  const peluang = l.peluang != null ? l.peluang : l.item === "kantong" ? ATURAN.monster.dropKantong : 0.5;
  if (Math.random() < peluang) pickups.push({ kind: l.item, x: m.x + 8, y: m.y, t: 0 });
}
// Judul episode untuk kotak misi & daftar misi: "Ep 3 · Hutan yang Beringas"
const judulEpisode = (l) => (l.ep ? t("cerita.ep", { n: l.ep }) + (l.judul ? " · " + l.judul : "") : l.bab);

// Simpanan dari versi lama (cerita 18 langkah) → pindahkan ke langkah yang sama di cerita baru.
function migrasiCerita() {
  S.buka = S.buka || {}; S.cermin = S.cermin || {};
  if (S.ceritaV === 2) return;
  const lama = S.cerita.idx;
  const i = lama >= 18 ? CERITA.findIndex((c) => c.lama === 17) + 1 : CERITA.findIndex((c) => c.lama === lama);
  if (i >= 0) S.cerita.idx = i;
  S.ceritaV = 2;
}

// ---------- Kotak misi & tanda NPC ----------
function teksMisiUtama() {
  if (!S) return "";
  if (ceritaTamat()) return t("cerita.hudTamat");
  const l = langkahCerita();
  let prog = "";
  if (l.tipe === "kill") prog = ` (${S.cerita.prog}/${l.need})`;
  if (l.tipe === "collect") prog = ` (${S.items[l.item] || 0}/${l.need})`;
  return `<b>${judulEpisode(l)}</b>${l.tujuan}${prog}`;
}
// "!" emas = NPC ini bagian cerita sekarang. Kalau bukan, cek misi sampingan (biru).
function tandaNpc(n) {
  const l = langkahCerita();
  if (l && l.tipe === "bicara" && l.npc === n.id) {
    const pernah = CERITA.slice(0, S.cerita.idx).some((x) => x.tipe === "bicara" && x.npc === n.id);
    return { mark: pernah ? "?" : "!", warna: "#f4b942" };
  }
  return tandaSampingan(n);
}

// ---------- Titik tujuan (untuk panah & peta) ----------
// Hasil: { area, x, y } dalam piksel dunia. x/y kosong = cukup masuk ke area itu.
const SUMBER_BARANG = { kantong: "tuyul", sisik: "buaya", taring: "babi" };
function zonaMonster(jenis) {
  for (const sp of SPAWN) if (sp.monster === jenis)
    for (const [id, a] of Object.entries(AREAS)) if (a.zona[sp.zona]) { const z = a.zona[sp.zona]; return { area: id, x: (z.x0 + z.x1 + 1) / 2 * T, y: (z.y0 + z.y1 + 1) / 2 * T }; }
  return null;
}
function ceritaTarget() {
  const l = langkahCerita();
  if (!l) return null;
  if (l.tipe === "bicara") { const n = npcById(l.npc); return n && { area: n.area, x: n.x, y: n.y, npc: true }; }
  if (l.tipe === "datang") return { area: l.area };
  if (l.tipe === "collect") return tempatMonster(l.dari || SUMBER_BARANG[l.item]);
  if (l.tipe === "kill") return tempatMonster(l.target);
  if (l.tipe === "teka") {
    for (const [id, a] of Object.entries(AREAS)) for (const o of a.objek || []) if (o.id === l.id) return { area: id, x: o.x * T, y: o.y * T };
  }
  if (l.tipe === "bos") {
    for (const [id, a] of Object.entries(AREAS)) if (a.bos && a.bos.monster === l.monster) return { area: id, x: a.bos.x * T, y: a.bos.y * T };
  }
  return null;
}
