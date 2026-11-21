// =====================================================================
// WARUNG & TUKANG PAHAT (di setiap desa)
//  - Warung (hiasan di 68-hiasan.js) kini dijaga penjual: beli jamu, ramuan, & jimat.
//  - Tukang Pahat + bengkel pahatnya: tingkatkan senjata & tempa jimat.
//    (Asah senjata dipindah dari pedagang ke sini.)
//  - Misi panduan "Belanja di Warung" & "Senjata Lebih Tajam" (SAMPINGAN di config.js,
//    tipe "aksi") diberikan penjaga warung & tukang pahat di Desa Wanasari.
//  - Misi panduan (panduan: true) diutamakan di daftar misi: tampil & dilacak lebih dulu
//    daripada cerita utama, termasuk saran "bicara dengan ..." untuk yang belum diambil.
// =====================================================================
"use strict";

// ---------- Letak per desa ----------
// warung = titik warung (petak, bawah-tengah); penjual berdiri di belakang meja.
// bengkel = titik bengkel pahat; pahat = tempat Tukang Pahat berdiri.
const WARUNG_PAHAT = {
  desa:       { warung: [9, 4],      bengkel: [20, 3],     pahat: [18.5, 3.6], penjual: "Mbok Sum",  tukang: "Pak Karta" },
  pesisir:    { warung: [12, 9],     bengkel: [5, 8],      pahat: [6.6, 8.5],  penjual: "Mak Ijah",  tukang: "Pak Dirja" },
  bandar:     { warung: [28, 12],    bengkel: [11, 22],    pahat: [12.6, 22.5], penjual: "Cik Lian", tukang: "Bang Tegar" },
  desaApung:  { warung: [24, 12.95], bengkel: [26, 20.95], pahat: [23, 20.5],  penjual: "Bu Rara",   tukang: "Pak Lambo" },
  awan:       { warung: [12, 9],     bengkel: [29, 15],    pahat: [30.6, 15.5], penjual: "Nini Kabut", tukang: "Ki Wira" },
  perkemahan: { warung: [10, 8],     bengkel: [29, 8],     pahat: [27.4, 8.5], penjual: "Mbok Ratri", tukang: "Pak Sena" },
};

// warung yang belum ada di HIASAN (68-hiasan.js) ditambahkan, bengkel pahat di semua desa
for (const [id, d] of Object.entries(WARUNG_PAHAT)) {
  const list = (HIASAN[id] = HIASAN[id] || []);
  if (!list.some((h) => h.k === "warung")) list.push({ k: "warung", x: d.warung[0], y: d.warung[1] });
  list.push({ k: "bengkel", x: d.bengkel[0], y: d.bengkel[1] });
}
PADAT_HIASAN.bengkel = [[-1, 0], [0, 0]];

// penjual & tukang pahat sebagai NPC (nama: "Mbok Sum · Warung")
for (const [id, d] of Object.entries(WARUNG_PAHAT)) {
  NPC_DATA.push({
    id: "warung-" + id, nama: d.penjual, peran: "warung.peran", area: id, warung: true,
    x: d.warung[0] * T, y: (d.warung[1] - 0.7) * T, color: "#c0563a", accent: "#f4d58a", hair: "#2a201b", face: Math.PI / 2,
    get name() { return this.nama + " · " + t(this.peran); },
  });
  NPC_DATA.push({
    id: "pahat-" + id, nama: d.tukang, peran: "pahat.peran", area: id, pahat: true,
    x: d.pahat[0] * T, y: d.pahat[1] * T, color: "#6b4a2e", accent: "#c9a26b", hat: "#8b5e3c", hair: "#1f1a24", face: Math.PI,
    get name() { return this.nama + " · " + t(this.peran); },
  });
}

// ---------- Bicara ----------
{
  const talkAsli = talk;
  talk = function (npc, lewatInfo) {
    if (!npc.warung && !npc.pahat) return talkAsli(npc, lewatInfo);
    if (ceritaBicara(npc)) return;
    // misi panduan: tawarkan (belum diambil) atau terima laporan (selesai);
    // saat misinya sedang berjalan langsung buka toko supaya pemain bisa mengerjakannya
    const q = sideUntuk(npc.id);
    if (q && sideState(q).status !== "active" && sampinganBicara(npc)) return;
    return npc.warung ? tokoWarung(npc) : tokoPahat(npc);
  };
}
// Warung: jamu, ramuan, jimat
function tokoWarung(npc) {
  tokoNpc = npc;
  const harga = ATURAN.toko.hargaJamu;
  openDialog(npc.name, t("warung.sapa", { koin: S.gold, jamu: S.potions, pulih: Math.round(ATURAN.jamuPulih * 100) }), [
    { label: t("dlg.beliJamu", { harga }), disabled: S.gold < harga, run: () => { S.gold -= harga; S.potions++; sfx.coin(); aksiPanduan("belanja"); saveSoon(); talk(npc); } },
    { label: t("dlg.ramuan"), run: () => tokoRamuan(npc) },     // 52-jimat.js
    { label: t("dlg.jimat"), run: () => bukaJimatToko() },
    { label: t("dlg.tutup"), primary: true, run: closeDialog },
  ]);
}
// Tukang Pahat: tingkatkan senjata, tempa jimat
const hargaPahat = () => ATURAN.toko.hargaAsah * (S.weapon + 1);
function tokoPahat(npc) {
  tokoNpc = npc;
  const harga = hargaPahat();
  openDialog(npc.name, t("pahat.sapa", { koin: S.gold, lv: S.weapon, atk: atkPower() }), [
    { label: t("pahat.tingkat", { atk: ATURAN.level.seranganPerSenjata, harga, lv: S.weapon + 1 }), disabled: S.gold < harga, run: () => {
      S.gold -= harga; S.weapon++; sfx.level(); toast(t("toast.senjata", { lv: S.weapon }), false);
      pahatBunyi = 1.2; spark(npc.x - 30, npc.y - 30, "#ffd166", 18);
      aksiPanduan("pahat"); saveSoon(); refreshHud(true); talk(npc);
    } },
    { label: t("pahat.tempa"), run: () => { bukaJimatToko(); jimatTab = "koleksi"; isiHalamanJimat(); } },
    { label: t("dlg.tutup"), primary: true, run: closeDialog },
  ]);
}

// ---------- Misi panduan ----------
// aksi pemain untuk misi tipe "aksi" yang sedang aktif
function aksiPanduan(jenis) {
  for (const q of SAMPINGAN) if (q.type === "aksi" && q.aksi === jenis && sideState(q).status === "active") majuSampingan(q, sideState(q).prog + 1);
}
// Urutan daftar misi: misi panduan dulu, lalu yang lain (cerita utama, Ki Lurah, sampingan).
// Kalau belum ada misi panduan yang berjalan, misi panduan pertama yang belum diambil
// disarankan paling atas ("Bicara dengan ...").
function urutkanPanduan(out) {
  const panduan = (m) => { const q = m.id.startsWith("side:") && SAMPINGAN.find((x) => "side:" + x.id === m.id); return !!(q && q.panduan); };
  const depan = out.filter(panduan), lain = out.filter((m) => !panduan(m));
  if (!depan.length) {
    const q = SAMPINGAN.find((x) => x.panduan && sideState(x).status === "none" && npcById(x.npc));
    if (q) {
      const n = npcById(q.npc);
      depan.push({ id: "saran:" + q.id, jenis: t("misi.jPanduan"), judul: q.title, hadiah: teksHadiah(q.reward),
        perintah: t("misi.saran", { npc: n.name, area: AREAS[n.area].nama }), target: () => tempatNpc(q.npc) });
    }
  }
  return [...depan, ...lain];
}

// ---------- Gambar bengkel pahat ----------
let pahatBunyi = 0;   // >0 = tukang pahat baru saja bekerja (serpihan lebih banyak)
UPDATE_TAMBAHAN.push((dt) => { pahatBunyi = Math.max(0, pahatBunyi - dt); });
GAMBAR_HIASAN.bengkel = function (h, time) {
  const x = h.px, y = h.py;
  bayangan(x, y, 44, 8);
  // atap ijuk miring di atas dua tiang
  ctx.fillStyle = "#5b3a24"; ctx.fillRect(x - 38, y - 56, 4, 56); ctx.fillRect(x + 34, y - 62, 4, 62);
  ctx.fillStyle = "#4a3a24"; ctx.beginPath(); ctx.moveTo(x - 46, y - 52); ctx.lineTo(x + 46, y - 66); ctx.lineTo(x + 46, y - 58); ctx.lineTo(x - 46, y - 44); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#6b5634"; ctx.lineWidth = 1; for (let i = -42; i < 46; i += 6) { ctx.beginPath(); ctx.moveTo(x + i, y - 51 - (i + 46) * 0.15); ctx.lineTo(x + i - 2, y - 43 - (i + 46) * 0.15); ctx.stroke(); }
  // rak senjata di kanan: keris & tombak bersandar
  ctx.fillStyle = "#6b4426"; ctx.fillRect(x + 18, y - 30, 16, 3);
  ctx.strokeStyle = "#c9c6cf"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 22, y - 2); ctx.lineTo(x + 26, y - 44); ctx.stroke();
  ctx.fillStyle = "#c9c6cf"; ctx.beginPath(); ctx.moveTo(x + 26, y - 44); ctx.lineTo(x + 24, y - 52); ctx.lineTo(x + 28, y - 44); ctx.fill();
  ctx.strokeStyle = "#d9b86a"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x + 30, y - 2); ctx.quadraticCurveTo(x + 34, y - 18, x + 30, y - 34); ctx.stroke();
  // meja kerja + arca kayu setengah jadi
  ctx.fillStyle = "#8b5e3c"; ctx.fillRect(x - 32, y - 20, 44, 20);
  ctx.fillStyle = "#a8734a"; ctx.fillRect(x - 34, y - 22, 48, 4);
  ctx.fillStyle = "#c9a06a"; ctx.fillRect(x - 24, y - 40, 12, 18);                          // badan arca
  ctx.beginPath(); ctx.arc(x - 18, y - 44, 6, 0, 6.28); ctx.fill();                          // kepala arca
  ctx.fillStyle = "#8b5e3c"; ctx.fillRect(x - 21, y - 45, 2, 2); ctx.fillRect(x - 17, y - 45, 2, 2); ctx.fillRect(x - 22, y - 34, 8, 1.5);
  // balok batu, palu kayu & pahat
  ctx.fillStyle = "#8d8894"; ctx.fillRect(x - 6, y - 32, 14, 10); ctx.fillStyle = "#a9a4b0"; ctx.fillRect(x - 6, y - 32, 14, 3);
  ctx.save(); ctx.translate(x + 2, y - 36); ctx.rotate(-0.5 + Math.sin(time * 6) * (pahatBunyi > 0 ? 0.35 : 0.05));
  ctx.fillStyle = "#6b4426"; ctx.fillRect(-1, -2, 3, 12); ctx.fillStyle = "#5b3a24"; ctx.fillRect(-4, -6, 9, 5); ctx.restore();
  ctx.fillStyle = "#c9c6cf"; ctx.fillRect(x - 12, y - 26, 8, 2);
  // serpihan kayu di tanah
  ctx.fillStyle = "#d9b886"; for (const [dx, dy] of [[-30, -2], [-12, 2], [4, -1], [-40, 3]]) ctx.fillRect(x + dx, y + dy, 3, 1.5);
  if (pahatBunyi > 0 || Math.sin(time * 1.3 + h.x) > 0.97) for (let i = 0; i < 2; i++) parts.push({ x: x + rand(-4, 8), y: y - 30, z: 0, vz: rand(30, 80), vx: rand(-40, 40), vy: rand(-10, 10), life: 0.5, max: 0.5, color: "#d9b886", s: 2 });
  // papan nama
  ctx.fillStyle = "#3a2a1a"; ctx.fillRect(x - 22, y - 80, 44, 13);
  ctx.font = "900 9px Nunito, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#f4b942"; ctx.fillText(t("pahat.papan"), x, y - 70);
};
