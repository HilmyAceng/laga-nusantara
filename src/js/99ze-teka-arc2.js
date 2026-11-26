// =====================================================================
// PUZZLE ARC 2 "Benang Sepi": data, prasasti petunjuk, hadiah puzzle opsional
// Mesin jenis baru: nada (99zf), cermin (99zg), putar (99zh), lantai (99zi), seluncur (99zj).
// Jenis lama yang dipakai lagi: dorong (petiGudang), tebak (sandiPustaka), memori (tuguAngin).
//  - `prasasti`: teks petunjuk [ID, EN] untuk benda `prasastiTeka` (pakai `i` untuk prasasti ke-2 dst.)
//  - `opsional: true` + `hadiah` = puzzle tersembunyi yang tidak menghalangi cerita.
//    hadiah = { gold, serpih, jimat } (jimat legenda dari 04i-monster-arc2.js)
//  - `pulangKe: [tx, ty]` = setelah selesai, pemain dibawa kembali ke titik itu (puzzle es dalam).
// Semua rancangan dicek dengan pemecah otomatis (dorong 15 dorongan, seluncur 11 & 19 luncuran,
// cermin 2 solusi); petunjuk putar menghasilkan tepat satu jawaban.
// =====================================================================
"use strict";

const ARAH_NAMA = [["utara", "north"], ["timur", "east"], ["selatan", "south"], ["barat", "west"]];

Object.assign(TEKA_BARU, {
  petiGudang: { jenis: "dorong" },
  gamelanSumur: { jenis: "nada", urutan: ["3", "5", "6", "5", "3", "2"], hukuman: "wayangHidup", prasasti: [
    ["Pahatan di bibir sumur: \"KIDUNG PEMBUKA SUMUR — lu · ma · nem · ma · lu · ro. Siapa yang menabuhnya dengan benar, sumur akan mengembalikan gemanya.\"",
      "Carving on the well's rim: \"OPENING SONG OF THE WELL — lu · ma · nem · ma · lu · ro. Whoever strikes it truly, the well shall return its echo.\""],
    ["Catatan seorang penabuh, hampir terhapus: \"Nama nada para penabuh: ji = 1, ro = 2, lu = 3, pat = 4, ma = 5, nem = 6, pi = 7. Bilah di sumur ini hanya lima: 1 · 2 · 3 · 5 · 6.\"",
      "A drummer's note, nearly worn away: \"The players' names for notes: ji = 1, ro = 2, lu = 3, pat = 4, ma = 5, nem = 6, pi = 7. This well has only five keys: 1 · 2 · 3 · 5 · 6.\""],
  ] },
  gamelanEs: { jenis: "nada", urutan: ["6", "5", "3", "5", "2", "1", "2", "3"], hukuman: "rohSalju", prasasti: [
    ["Tulisan beku di dinding: \"KIDUNG ES — nem · ma · ▒ · ma · ▒ · ji · ▒ · lu\". Bagian yang tertutup es tak terbaca. Di bawahnya: \"Dengarkan es yang bernyanyi; ia ingat semuanya.\"",
      "Frozen writing on the wall: \"ICE SONG — nem · ma · ▒ · ma · ▒ · ji · ▒ · lu\". The ice-covered parts can't be read. Below: \"Listen to the singing ice; it remembers everything.\""],
  ] },
  cerminMercu: { jenis: "cermin" },
  cahayaBeringin: { jenis: "cermin" },
  arcaTaman: { jenis: "putar", target: [1, 3, 2, 2], nama: [["Arca Naga", "Dragon Statue"], ["Arca Rajawali", "Hawk Statue"], ["Arca Kelabang", "Centipede Statue"], ["Arca Penjaga", "Guardian Statue"]], prasasti: [
    ["Prasasti taman: \"Naga di utara menyambut matahari terbit. Rajawali di timur menatap air kolam. Kelabang di selatan memunggungi kolam. Penjaga di barat memandang ke arah yang sama dengan Kelabang.\"",
      "Garden inscription: \"The Dragon in the north greets the rising sun. The Hawk in the east gazes at the pond. The Centipede in the south turns its back on the pond. The Guardian in the west looks the same way as the Centipede.\""],
  ] },
  sandiPustaka: { jenis: "tebak", hukuman: "wayangHidup", soal: [
    { q: "tk.sp1", a: ["tk.sp1a", "tk.sp1b", "tk.sp1c"], benar: 0 },
    { q: "tk.sp2", a: ["tk.sp2a", "tk.sp2b", "tk.sp2c"], benar: 0 },
    { q: "tk.sp3", a: ["tk.sp3a", "tk.sp3b", "tk.sp3c"], benar: 0 },
    { q: "tk.sp4", a: ["tk.sp4a", "tk.sp4b", "tk.sp4c"], benar: 0 } ], prasasti: [
    ["Kamus Aksara Kala (lembar pertama): ☽ = A · ✶ = U · ✕ = R · ⌒ = L · ◯ = I", "Kala Script Dictionary (first page): ☽ = A · ✶ = U · ✕ = R · ⌒ = L · ◯ = I"],
    ["Kamus Aksara Kala (lembar kedua): ▲ = S · ♢ = E · ∴ = P · ≈ = K · ⊓ = H", "Kala Script Dictionary (second page): ▲ = S · ♢ = E · ∴ = P · ≈ = K · ⊓ = H"],
  ] },
  tuguMatahari: { jenis: "putar", target: [2, 1, 2, 3], nama: [["Tugu Utara", "North Pillar"], ["Tugu Timur", "East Pillar"], ["Tugu Selatan", "South Pillar"], ["Tugu Barat", "West Pillar"]], prasasti: [
    ["Ukiran batu tua: \"Tugu Utara memandang batu tengah. Tugu Selatan memunggungi batu tengah. Tugu Timur menatap fajar. Tugu Barat menatap ke arah jatuhnya bayangan pagi.\"",
      "Old stone carving: \"The North Pillar gazes at the center stone. The South Pillar turns its back on the center stone. The East Pillar faces the dawn. The West Pillar faces where the morning shadow falls.\""],
  ] },
  lantaiTugu: { jenis: "lantai", tekan: [[0, 0], [2, 1], [1, 3], [3, 2], [2, 2]] },
  tuguRahasia: { jenis: "putar", opsional: true, target: [1, 0, 3, 3, 2, 1], hadiah: { jimat: "tuguLeluhur", gold: 2000 },
    nama: [["Tugu Kiri Atas", "Top-Left Pillar"], ["Tugu Tengah Atas", "Top-Middle Pillar"], ["Tugu Kanan Atas", "Top-Right Pillar"], ["Tugu Kiri Bawah", "Bottom-Left Pillar"], ["Tugu Tengah Bawah", "Bottom-Middle Pillar"], ["Tugu Kanan Bawah", "Bottom-Right Pillar"]], prasasti: [
    ["Tenunan teka-teki para leluhur:\n1. Tak ada dua tugu bertetangga (kiri-kanan atau atas-bawah) yang memandang ke arah yang sama.\n2. Tugu tengah atas memandang ke utara, ke arah leluhur.\n3. Tugu tengah bawah memunggungi tugu di atasnya.\n4. Tugu kiri atas memandang ke dalam, ke arah tengah.\n5. Tugu kanan atas memandang ke arah tugu kiri atas.\n6. Tak satu pun tugu bawah memandang ke utara.",
      "The ancestors' woven riddle:\n1. No two neighbouring pillars (left-right or up-down) face the same way.\n2. The top-middle pillar faces north, toward the ancestors.\n3. The bottom-middle pillar turns its back on the pillar above it.\n4. The top-left pillar looks inward, toward the middle.\n5. The top-right pillar looks toward the top-left pillar.\n6. None of the bottom pillars faces north."],
  ] },
  rahasiaSabana: { jenis: "lantai", opsional: true, tekan: [[0, 0], [1, 2], [2, 4], [3, 1], [4, 3], [2, 2], [0, 4], [4, 0], [3, 3]], hadiah: { gold: 3000, serpih: 6 } },
  jamurBeringin: { jenis: "lantai", tekan: [[1, 0], [3, 1], [0, 2], [2, 3], [1, 2], [3, 3]] },
  esSeluncur: { jenis: "seluncur", mulai: [22, 35], prasasti: [
    ["Papan kayu beku: \"Lantai es ini licin. Sekali melangkah, kau meluncur sampai menabrak batu atau sampai di salju. Capai salju di seberang utara.\"",
      "A frozen wooden sign: \"This ice is slippery. Take one step and you slide until you hit a rock or reach snow. Reach the snow on the far north side.\""],
  ] },
  esDalam: { jenis: "seluncur", opsional: true, mulai: [37, 51], pulangKe: [8, 40], hadiah: { jimat: "kalungSalju", gold: 2500 }, prasasti: [
    ["Ukiran samar: \"Hanya yang sabar sampai di ceruk utara. Hadiah Yaksa menanti di sana.\" (Teka-teki ini tidak wajib, dan sangat sulit.)",
      "A faint carving: \"Only the patient reach the northern nook. The Yaksa's gift awaits there.\" (This puzzle is optional, and very hard.)"],
  ] },
  tuguAngin: { jenis: "memori", mulai: 4, sampai: 8, hukuman: "rohSalju" },
  lantaiPuncak: { jenis: "lantai", opsional: true, tekan: [[0, 1], [1, 3], [2, 0], [3, 2], [4, 4], [1, 1], [3, 4], [0, 3], [4, 1], [2, 2], [2, 4]], hadiah: { gold: 5000, serpih: 8 } },
  kelirWayang: { jenis: "putar", target: [3, 1, 0, 2, 3], wayang: true, prasasti: [
    ["Lakon pembuka di kelir, menurut catatan Ki Lirih: \"Gunungan berdiri di tengah. Sang Putri di samping kirinya, Sang Prabu di samping kanannya. Dua Raksasa mengapit mereka di kedua ujung.\"",
      "The opening scene on the screen, from Ki Lirih's notes: \"The Gunungan stands in the middle. The Princess at its left, the King at its right. Two Giants flank them at both ends.\""],
  ] },
});
// teks tanya sandi Pustaka Kala (mesin tebak memakai kunci teks)
Object.assign(TEKS.id, {
  "tk.sp1": "Tulisan di sampul buku tua: ▲ ✶ ☽ ✕ ☽ — apa bacaannya?", "tk.sp1a": "SUARA", "tk.sp1b": "SURAU", "tk.sp1c": "SAURA",
  "tk.sp2": "Nama penulis di halaman pertama: ⌒ ◯ ✕ ◯ ⊓ — siapa?", "tk.sp2a": "LIRIH", "tk.sp2b": "LIRIK", "tk.sp2c": "KIRIH",
  "tk.sp3": "Kata yang digarisbawahi tiga kali: ≈ ♢ ⌒ ◯ ✕ — apa itu?", "tk.sp3a": "KELIR", "tk.sp3b": "KELUR", "tk.sp3c": "LEKIR",
  "tk.sp4": "Di halaman terakhir: \"Dunia tanpa ▲ ♢ ∴ ◯ adalah dunia yang ...\" Pilih LAWAN dari kata bersandi itu.", "tk.sp4a": "RAMAI", "tk.sp4b": "SUNYI", "tk.sp4c": "SEPI",
  "tk.nPrasastiTeka": "Prasasti", "tk.nBilah": "Bilah {nada}", "tk.nEsBernyanyi": "Es Bernyanyi", "tk.nCermin": "Cermin", "tk.nSumber": "Pelita", "tk.nTarget": "Kristal Tujuan",
  "tk.nKristal": "Kristal", "tk.nPilarLantai": "Pilar Lantai",
});
Object.assign(TEKS.en, {
  "tk.sp1": "Writing on an old book's cover: ▲ ✶ ☽ ✕ ☽ — how does it read?", "tk.sp1a": "SUARA (voice)", "tk.sp1b": "SURAU", "tk.sp1c": "SAURA",
  "tk.sp2": "The author's name on the first page: ⌒ ◯ ✕ ◯ ⊓ — who?", "tk.sp2a": "LIRIH", "tk.sp2b": "LIRIK", "tk.sp2c": "KIRIH",
  "tk.sp3": "A word underlined three times: ≈ ♢ ⌒ ◯ ✕ — what is it?", "tk.sp3a": "KELIR (puppet screen)", "tk.sp3b": "KELUR", "tk.sp3c": "LEKIR",
  "tk.sp4": "On the last page: \"A world without ▲ ♢ ∴ ◯ is a world that is ...\" Choose the OPPOSITE of the coded word (SEPI = silent).", "tk.sp4a": "RAMAI (lively)", "tk.sp4b": "SUNYI (quiet)", "tk.sp4c": "SEPI (silent)",
  "tk.nPrasastiTeka": "Inscription", "tk.nBilah": "Key {nada}", "tk.nEsBernyanyi": "Singing Ice", "tk.nCermin": "Mirror", "tk.nSumber": "Lamp", "tk.nTarget": "Goal Crystal",
  "tk.nKristal": "Crystal", "tk.nPilarLantai": "Floor Pillar",
});
Object.assign(NAMA_OBJEK, {
  prasastiTeka: "tk.nPrasastiTeka", bilah: "tk.nBilah", esBernyanyi: "tk.nEsBernyanyi", cerminCahaya: "tk.nCermin", sumberCahaya: "tk.nSumber",
  targetCahaya: "tk.nTarget", kristalCahaya: "tk.nKristal", pilarLantai: "tk.nPilarLantai", arcaPutar: "tk.nPrasastiTeka",
});
OBJEK_LANTAI.add("lantai"); OBJEK_LANTAI.add("tujuanEs");

// nama arca putar: nama khusus tiap arca (bukan nama umum)
{
  const asli = objekTeka;
  objekTeka = function (id) {
    return asli(id).map((n) => {
      if (n.kind === "arcaPutar") { const P0 = TEKA_BARU[n.tekaId]; n.name = Lx(P0.nama ? P0.nama[n.i] : ["Arca", "Statue"]); }
      if (n.kind === "bilah") n.name = t("tk.nBilah", { nada: n.nada });
      return n;
    });
  };
}

// ---------- Prasasti petunjuk ----------
TEKA_BICARA.prasastiTeka = function (n) {
  const P0 = TEKA_BARU[n.tekaId], teks = P0 && P0.prasasti ? P0.prasasti[n.i || 0] : null;
  if (!teks) return;
  const pilihan = [{ label: t("dlg.tutup"), primary: true, run: closeDialog }];
  if (P0.jenis === "seluncur" && !tekaSelesai(n.tekaId)) pilihan.unshift({ label: Lx(["Kembali ke awal es", "Back to the ice start"]), run: () => { closeDialog(); ulangSeluncur(n.tekaId); } });
  openDialog(n.name, Lx(teks), pilihan);
};
GAMBAR_OBJEK.prasastiTeka = function (n, time) {
  const x = n.x, y = n.y, dingin = area.salju;
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 17, 6, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = dingin ? "#9fb8cf" : "#6f6a75"; roundRect(ctx, x - 14, y - 40, 28, 40, 6); ctx.fill();
  ctx.fillStyle = dingin ? "#c9e0f2" : "#8d8894"; roundRect(ctx, x - 11, y - 37, 22, 30, 4); ctx.fill();
  for (let i = 0; i < 4; i++) { ctx.fillStyle = `rgba(30,20,40,${0.35 + 0.2 * Math.sin(time * 2 + i)})`; ctx.fillRect(x - 7, y - 32 + i * 6, 14 - (i % 2) * 5, 2); }
  labelObjek(n, "#ffe7a8", 50);
};

// ---------- Puzzle opsional: hadiah & bawa pulang ----------
const tekaOpsionalTersedia = (id) => TEKA_BARU[id] && TEKA_BARU[id].opsional;
{
  const asli = tekaBelumSaatnya;
  tekaBelumSaatnya = function (id) { return tekaOpsionalTersedia(id) ? false : asli(id); };
  const selesaiAsli = selesaiTeka;
  selesaiTeka = function (id) {
    const sudah = !!(S && S.teka[id]);
    selesaiAsli(id);
    const P0 = TEKA_BARU[id];
    if (!P0 || sudah) return;
    if (P0.hadiah) {
      const h = P0.hadiah, bagian = [];
      if (h.gold) { S.gold += h.gold; bagian.push(`+${h.gold} ${Lx(["koin", "coins"])}`); }
      if (h.serpih) { S.jimat.serpih += h.serpih; bagian.push(`+${h.serpih} ${Lx(["Serpih Pusaka", "Heirloom Shards"])}`); }
      if (h.jimat && JIMAT[h.jimat]) { beriJimat(h.jimat); bagian.push("✦ " + namaJimat(h.jimat)); }
      setTimeout(() => { toast(Lx(["🧩 Teka-teki tersembunyi terpecahkan!", "🧩 Hidden puzzle solved!"]), true); notifItem(bagian.join(" · ")); }, 400);
      tambahStat("tekaRahasia");
      if (h.jimat && typeof momenBagikan === "function") momenBagikan({ judul: [`Jimat legenda: ${namaJimat(h.jimat)}`, `Legendary charm: ${namaJimat(h.jimat)}`], sub: ["Teka-teki tersembunyi · Laga Nusantara", "Hidden puzzle · Laga Nusantara"], warna: "#f4b942" });
    }
    if (P0.pulangKe) setTimeout(() => { if (!S || mode !== "play") return; P.x = (P0.pulangKe[0] + 0.5) * T; P.y = (P0.pulangKe[1] + 0.5) * T; cam.x = P.x; cam.y = P.y; spark(P.x, P.y - 20, "#bfe8ff", 16); }, 1600);
    saveSoon();
  };
}
