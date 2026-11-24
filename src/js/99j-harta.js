// =====================================================================
// HARTA KARUN & BATU RETAK (semua dunia)
//  - Tiap area punya 2–3 peti (area besar 3). Letaknya dipilih otomatis di "ceruk"
//    (petak yang dikelilingi pohon/batu/dinding) yang bisa dicapai dari gerbang,
//    jauh dari gerbang & jalan. Posisi disimpan di S.harta.titik supaya tetap.
//  - Peti ke-2 tersembunyi di dalam BATU RETAK: pukul batunya 3× (berdiri di dekatnya)
//    sampai pecah, baru petinya kelihatan.
//  - Di area sarang bos, peti terakhir TERKUNCI sampai bos area itu dikalahkan.
//  - Isi makin bagus di dunia yang lebih jauh (koin, serpih, jamu, kadang jimat).
//  - Peti tidak tampil di peta mini / peta besar (rahasia!), tapi peta besar
//    menampilkan hitungan "Harta x/y" untuk area itu.
//  - Pencapaian: Pemburu Harta per dunia + Pemecah Batu (lewat daftarkanCapai, 99i).
// Simpanan: S.harta = { titik: { area: [[tx,ty],...] }, buka: { "area:i": waktu }, pecah: { "area:i": true } }
// =====================================================================
"use strict";

const HARTA = { kecil: 1500, pukulBatu: 3, jarakGerbang: 5, jarakAntar: 8 };
const dataHarta = () => (S.harta = S.harta || { titik: {}, buka: {}, pecah: {} });
const kunciHarta = (a, i) => a + ":" + i;
const jumlahPetiArea = (id) => (AREAS[id].w * AREAS[id].h >= HARTA.kecil ? 3 : 2);
const petiTerkunci = (id, i) => { const b = AREAS[id].bos; return !!b && i === jumlahPetiArea(id) - 1 && !(S.bos && S.bos[b.monster]); };

// ---------- Memilih tempat peti ----------
function cariTitikHarta(id) {
  const lewat = (x, y) => x > 0 && y > 0 && x < MW - 1 && y < MH - 1 && !SOLID.has(tileAt(x, y));
  // petak yang bisa dicapai: BFS dari semua petak gerbang
  const dicapai = new Uint8Array(MW * MH), antre = [];
  for (const g of area.gerbang) for (let y = g.y0; y <= g.y1; y++) for (let x = g.x0; x <= g.x1; x++) {
    const tx = clamp(x, 1, MW - 2), ty = clamp(y, 1, MH - 2);
    if (lewat(tx, ty) && !dicapai[ty * MW + tx]) { dicapai[ty * MW + tx] = 1; antre.push([tx, ty]); }
  }
  if (!antre.length) for (let y = 1; y < MH - 1 && !antre.length; y++) for (let x = 1; x < MW - 1; x++) if (lewat(x, y)) { dicapai[y * MW + x] = 1; antre.push([x, y]); break; }
  while (antre.length) {
    const [x, y] = antre.pop();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (lewat(nx, ny) && !dicapai[ny * MW + nx]) { dicapai[ny * MW + nx] = 1; antre.push([nx, ny]); }
    }
  }
  // kandidat: ceruk (≥ 4 dari 8 tetangga padat), bukan jalan/jembatan, jauh dari gerbang & benda lain
  const gerbangTitik = area.gerbang.map((g) => [(g.x0 + g.x1) / 2, (g.y0 + g.y1) / 2]);
  const bendaTitik = NPCS.map((n) => [n.x / T, n.y / T]);
  const kand = [];
  for (let y = 2; y < MH - 2; y++) for (let x = 2; x < MW - 2; x++) {
    if (!dicapai[y * MW + x]) continue;
    const tile = tileAt(x, y);
    if (tile === PATH || tile === BRIDGE) continue;
    let padat = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && SOLID.has(tileAt(x + dx, y + dy))) padat++;
    if (padat > 6) continue;   // > 6 = terlalu sempit (bisa menutup jalan)
    if (gerbangTitik.some(([gx, gy]) => Math.hypot(gx - x, gy - y) < HARTA.jarakGerbang)) continue;
    if (bendaTitik.some(([bx, by]) => Math.hypot(bx - x, by - y) < 3)) continue;
    kand.push([x, y, padat]);
  }
  // pilih acak (tetap per area) dengan jarak antar-peti cukup jauh
  const acak = seeded(ATURAN.petaSeed * 31 + id.length * 977 + id.charCodeAt(0) * 13);
  for (let i = kand.length - 1; i > 0; i--) { const j = Math.floor(acak() * (i + 1)); [kand[i], kand[j]] = [kand[j], kand[i]]; }
  kand.sort((a, b) => b[2] - a[2]);   // ceruk yang lebih "tersembunyi" lebih dulu
  // longgarkan bertahap: ceruk (≥4 tetangga padat) → ≥3 → ≥2 → petak biasa; jarak antar-peti juga
  const hasil = [];
  for (const minPadat of [4, 3, 2, 0])
    for (let jarak = HARTA.jarakAntar; jarak >= 3 && hasil.length < jumlahPetiArea(id); jarak -= 2)
      for (const [x, y, p] of kand) {
        if (hasil.length >= jumlahPetiArea(id)) break;
        if (p >= minPadat && hasil.every(([hx, hy]) => Math.hypot(hx - x, hy - y) >= jarak)) hasil.push([x, y]);
      }
  return hasil;
}

// ---------- Objek peti di area ----------
function namaPeti() { return Lx(["Peti Harta", "Treasure Chest"]); }
function pasangHarta(id) {
  if (!S || !AREAS[id]) return;
  const D = dataHarta();
  let titik = D.titik[id];
  if (!titik || titik.some(([x, y]) => SOLID.has(tileAt(x, y)))) { titik = D.titik[id] = cariTitikHarta(id); saveSoon(); }
  NPCS = NPCS.filter((n) => n.kind !== "peti");
  titik.forEach(([tx, ty], i) => NPCS.push({ id: "peti-" + i, kind: "peti", i, name: namaPeti(), x: (tx + 0.5) * T, y: (ty + 0.7) * T, face: 0 }));
}
SAAT_MASUK_AREA.push(pasangHarta);
const batuUtuh = (n) => n.i === 1 && !dataHarta().pecah[kunciHarta(areaId, 1)];
const petiTerbuka = (n) => !!dataHarta().buka[kunciHarta(areaId, n.i)];

// batu retak = padat (tidak bisa dilewati) selama belum pecah
{
  const padatAsli = padatTambahan;
  padatTambahan = (tx, ty) => padatAsli(tx, ty) || (!!S && NPCS.some((n) => n.kind === "peti" && batuUtuh(n) && Math.floor(n.x / T) === tx && Math.floor(n.y / T) === ty));
}
// peti terbuka / masih di dalam batu → tidak bisa "diajak bicara"
{
  const bisaAsli = bisaBicara;
  bisaBicara = function (n) { if (n.kind === "peti") return !petiTerbuka(n) && !batuUtuh(n); return bisaAsli(n); };
}

// ---------- Membuka peti ----------
function isiPeti(dunia, kunci) {
  const d = dunia || 1, acak = Math.random(), h = { koin: Math.round((40 + 60 * d) * (kunci ? 2.5 : 1) * (0.8 + Math.random() * 0.4)), serpih: (kunci ? 3 : 1) * d, jamu: 0, jimat: null };
  if (acak < 0.35) h.jamu = 1 + (d >= 3 ? 1 : 0);
  const belum = (r) => Object.keys(JIMAT).filter((id) => JIMAT[id].rarity === r && !JIMAT[id].bos && !(S.jimat.punya[id] > 0));
  const peluangJimat = kunci ? 1 : 0.12 + 0.06 * d;
  if (Math.random() < peluangJimat) {
    const pil = (kunci || d >= 3) && belum("langka").length ? belum("langka") : belum("biasa");
    if (pil.length) h.jimat = pil[Math.floor(Math.random() * pil.length)];
  }
  return h;
}
TEKA_BICARA.peti = function (n) {
  if (petiTerkunci(areaId, n.i)) {
    const b = MONSTERS[area.bos.monster];
    openDialog(n.name, Lx([`Peti ini terkunci oleh kekuatan gaib. Mungkin terbuka setelah ${b.name} dikalahkan...`, `This chest is sealed by a strange power. Perhaps it opens once ${b.name} is defeated...`]), [{ label: t("dlg.tutup"), primary: true, run: closeDialog }]);
    sfx.click(); return;
  }
  const h = isiPeti(area.dunia, !!area.bos && n.i === jumlahPetiArea(areaId) - 1);
  dataHarta().buka[kunciHarta(areaId, n.i)] = Date.now();
  S.gold += h.koin; S.jimat.serpih += h.serpih; S.potions += h.jamu;
  const isi = [`+${h.koin} ${Lx(["koin", "coins"])}`, `+${h.serpih} ${Lx(["Serpih Pusaka", "Heirloom Shards"])}`, h.jamu && `+${h.jamu} ${Lx(["jamu", "jamu"])}`].filter(Boolean);
  toast(Lx(["Peti harta terbuka!", "Treasure chest opened!"]), true);
  isi.forEach((x, i) => setTimeout(() => notifItem(x), 250 + i * 200));
  if (h.jimat) setTimeout(() => beriJimat(h.jimat), 900);
  spark(n.x, n.y - 20, "#f4b942", 26); sfx.coin(); sfx.item && sfx.item();
  nearNpc = null; refreshHud(true); saveSoon();
};

// ---------- Batu retak: pukul 3× ----------
const pukulanBatu = {};
{
  const seranganAsli = playerAttack;
  playerAttack = function (...a) {
    const r = seranganAsli(...a);
    if (S && P) for (const n of NPCS) {
      if (n.kind !== "peti" || !batuUtuh(n) || dist(P, n) > 78) continue;
      const k = kunciHarta(areaId, n.i);
      pukulanBatu[k] = (pukulanBatu[k] || 0) + 1;
      shake = Math.max(shake, 0.12); spark(n.x, n.y - 18, "#b9b2c6", 8); sfx.hit ? sfx.hit() : sfx.click();
      if (pukulanBatu[k] >= HARTA.pukulBatu) {
        dataHarta().pecah[k] = true; tambahStat("batuPecah");
        spark(n.x, n.y - 18, "#d9d4cc", 30); shake = 0.3;
        toast(Lx(["Batu retak pecah! Ada sesuatu di dalamnya...", "The cracked rock shatters! Something is inside..."]), false);
        saveSoon();
      }
      break;
    }
    return r;
  };
}

// ---------- Gambar ----------
GAMBAR_OBJEK.peti = function (n, time) {
  const x = n.x, y = n.y;
  if (batuUtuh(n)) {   // batu retak (sedikit berbeda dari batu biasa: ada retakan & kilau samar)
    const k = pukulanBatu[kunciHarta(areaId, n.i)] || 0, gs = k ? Math.sin(time * 40) * 1.2 : 0;
    ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 20, 6, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#7d7686"; ctx.beginPath(); ctx.ellipse(x + gs, y - 16, 20, 18, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#958ea0"; ctx.beginPath(); ctx.ellipse(x - 5 + gs, y - 22, 10, 8, -0.4, 0, 6.28); ctx.fill();
    ctx.strokeStyle = "#4a4452"; ctx.lineWidth = 2; ctx.beginPath();
    ctx.moveTo(x - 4 + gs, y - 33); ctx.lineTo(x + 2 + gs, y - 22); ctx.lineTo(x - 3 + gs, y - 14); ctx.lineTo(x + 5 + gs, y - 4);
    ctx.moveTo(x + 2 + gs, y - 22); ctx.lineTo(x + 11 + gs, y - 19);
    if (k >= 1) { ctx.moveTo(x - 3 + gs, y - 14); ctx.lineTo(x - 13 + gs, y - 10); }
    if (k >= 2) { ctx.moveTo(x + 11 + gs, y - 19); ctx.lineTo(x + 15 + gs, y - 8); }
    ctx.stroke();
    ctx.fillStyle = `rgba(244,185,66,${0.25 + 0.2 * Math.sin(time * 3 + x)})`; ctx.fillRect(x + 1 + gs, y - 21, 2, 2);
    return;
  }
  const buka = petiTerbuka(n), kunci = petiTerkunci(areaId, n.i);
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 18, 5, 0, 0, 6.28); ctx.fill();
  if (!buka) {   // kilau
    const g = ctx.createRadialGradient(x, y - 14, 2, x, y - 14, 34);
    g.addColorStop(0, `rgba(244,185,66,${0.22 + 0.12 * Math.sin(time * 3)})`); g.addColorStop(1, "rgba(244,185,66,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y - 14, 34, 0, 6.28); ctx.fill();
  }
  ctx.fillStyle = "#7a4a26"; ctx.fillRect(x - 15, y - 18, 30, 16);                 // badan
  ctx.fillStyle = "#5b3a24"; ctx.fillRect(x - 15, y - 10, 30, 2);
  ctx.fillStyle = "#c9932f"; ctx.fillRect(x - 15, y - 18, 3, 16); ctx.fillRect(x + 12, y - 18, 3, 16);
  if (buka) {   // tutup terbuka ke belakang
    ctx.fillStyle = "#5b3a24"; ctx.fillRect(x - 15, y - 30, 30, 10);
    ctx.fillStyle = "#3a2416"; ctx.fillRect(x - 13, y - 20, 26, 3);
  } else {
    ctx.fillStyle = "#8a5530"; ctx.beginPath(); ctx.moveTo(x - 15, y - 18); ctx.quadraticCurveTo(x, y - 30, x + 15, y - 18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#c9932f"; ctx.fillRect(x - 15, y - 19, 30, 2);
    ctx.fillStyle = kunci ? "#8fd3ff" : "#f4d06f"; ctx.fillRect(x - 3, y - 19, 6, 7);   // gembok (biru = terkunci gaib)
    labelObjek(n, kunci ? "#8fd3ff" : "#f4b942", 40);
  }
};

// ---------- Hitungan di peta besar ----------
function hitungHarta(id) {
  const D = dataHarta(), n = (D.titik[id] || []).length || jumlahPetiArea(id);
  let buka = 0; for (let i = 0; i < n; i++) if (D.buka[kunciHarta(id, i)]) buka++;
  return [buka, n];
}
{
  const showMapTabAsli = showMapTab;
  showMapTab = function (tab) {
    showMapTabAsli(tab);
    if (tab !== "area" || !S || !area) return;
    const [b, n] = hitungHarta(areaId);
    $("mapSub").textContent += ` · ${Lx(["Harta", "Treasure"])} ${b}/${n}`;
  };
}

// ---------- Pencapaian ----------
const hartaDunia = (d) => { let b = 0, n = 0; for (const id of Object.keys(AREAS)) if (AREAS[id].dunia === d) { const [x, y] = hitungHarta(id); b += x; n += y; } return [b, n]; };
for (const dn of DUNIA) daftarkanCapai({
  id: "harta" + dn.id, kat: "koleksi", judul: [`Pemburu Harta ${dn.nama}`, `Treasure Hunter: ${dn.namaEn || dn.nama}`],
  desc: [`Buka semua peti harta di ${dn.nama}.`, `Open every treasure chest in ${dn.namaEn || dn.nama}.`], hadiah: HDH(300 + 200 * dn.id, 3 * dn.id),
  progres: () => hartaDunia(dn.id),
});
daftarkanCapai({ id: "hartaPertama", kat: "koleksi", judul: ["Mata Elang", "Eagle Eye"], desc: ["Temukan peti harta pertamamu.", "Find your first treasure chest."], hadiah: HDH(50), progres: () => [Object.keys(dataHarta().buka).length, 1] });
daftarkanCapai({ id: "batuPecah", kat: "rahasia", rahasia: true, judul: ["Pemecah Batu", "Rock Breaker"], desc: ["Pecahkan batu retak dan temukan harta di dalamnya.", "Break a cracked rock and find the treasure inside."], hadiah: HDH(80, 1), syarat: () => stat("batuPecah") > 0 });
