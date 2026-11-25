// =====================================================================
// KISAH NPC (lore sebagai misi sampingan berantai; data di cerita/kisah.js)
// Tokoh cerita utama menceritakan asal-usul monster & bos setelah bos itu kalah.
//  - Tanda ungu di atas NPC: "!" = ada kisah baru, "?" = lanjutkan kisah.
//  - Langkah: bicara · pandu (NPC berjalan memimpin, menunggu kalau kau tertinggal)
//    · kalahkan monster · temukan & baca prasasti.
//  - Kisah yang sedang berjalan masuk Daftar Misi (bisa dilacak: panah emas & peta).
//  - Kisah selesai → hadiah + ringkasan kisah di Ensiklopedia Musuh (bagian 📜 Kisah).
// Simpanan: S.kisah = { id: { i: langkah ke-, prog, selesai } }
// =====================================================================
"use strict";

const WARNA_KISAH = "#c9a6ff";
const dataKisah = () => (S.kisah = S.kisah || {});
const kisahById = (id) => KISAH.find((k) => k.id === id);
const kisahTersedia = (k) => { try { return !dataKisah()[k.id] && !!k.syarat(); } catch (e) { return false; } };
const kisahAktif = () => KISAH.filter((k) => dataKisah()[k.id] && !dataKisah()[k.id].selesai);
const langkahKisah = (k) => { const s = dataKisah()[k.id]; return s && !s.selesai ? k.langkah[s.i] : null; };
const nyawaNpc = (id) => NPCS.find((n) => n.id === id && !n.aktor);
const ceritaPerluNpc = (id) => { const l = langkahCerita(); return !!(l && l.tipe === "bicara" && l.npc === id); };

function majuKisah(k) {
  const s = dataKisah()[k.id];
  s.i++; s.prog = 0;
  if (s.i >= k.langkah.length) return selesaiKisah(k);
  const L = k.langkah[s.i];
  toast("📜 " + Lx(L.tujuan), false); sfx.quest();
  if (L.tipe === "prasasti") pasangPrasasti();
  saveSoon(); refreshHud(true);
}
function selesaiKisah(k) {
  const s = dataKisah()[k.id], h = k.hadiah || {};
  s.selesai = Date.now();
  if (h.gold) S.gold += h.gold;
  if (h.serpih) S.jimat.serpih += h.serpih;
  toast(Lx([`📜 Kisah selesai: ${k.judul[0]}`, `📜 Tale complete: ${k.judul[1]}`]), true);
  setTimeout(() => notifItem([h.gold && `+${h.gold} ${Lx(["koin", "coins"])}`, h.serpih && `+${h.serpih} ${Lx(["Serpih Pusaka", "Heirloom Shards"])}`].filter(Boolean).join(" · ")), 500);
  setTimeout(() => toast(Lx(["Kisahnya kini tercatat di Ensiklopedia Musuh.", "The tale is now recorded in the Enemy Encyclopedia."]), false), 1800);
  if (h.exp) gainExp(h.exp);
  tambahStat("kisah"); sfx.level ? sfx.level() : sfx.quest();
  refreshHud(true); saveSoon();
}

// ---------- Bicara dengan NPC ----------
function mulaiKisah(k) {
  dataKisah()[k.id] = { i: 0, prog: 0, selesai: false };
  const L = k.langkah[0];
  percakapan(L.baris, () => majuKisah(k), L.tanya, "kisah-" + k.id + "-0");
}
function kisahBicara(npc, lanjutAsli) {
  if (npc.kind || npc.aktor || ceritaPerluNpc(npc.id) || !S) return false;
  // lanjutan kisah yang sedang berjalan
  for (const k of kisahAktif()) {
    const L = langkahKisah(k);
    if (!L || L.npc !== npc.id) continue;
    if (L.tipe === "bicara") { percakapan(L.baris, () => majuKisah(k), L.tanya, "kisah-" + k.id + "-" + dataKisah()[k.id].i); return true; }
    if (L.tipe === "pandu") {
      if (areaId !== L.area) return false;
      openDialog(npc.name, Lx(L.ajak), [{ label: Lx(["Ayo!", "Let's go!"]), primary: true, run: () => { closeDialog(); mulaiPandu(k, L, npc); } }]);
      return true;
    }
  }
  // kisah baru
  const baru = KISAH.find((k) => k.npc === npc.id && kisahTersedia(k));
  if (baru) {
    openDialog(npc.name, Lx(["Nak, ada kisah lama yang ingin kuceritakan. Kau punya waktu?", "Child, there's an old tale I'd like to tell you. Do you have time?"]), [
      { label: "📜 " + Lx(["Dengarkan kisahnya", "Hear the tale"]), primary: true, run: () => { closeDialog(); mulaiKisah(baru); } },
      { label: Lx(["Urusan lain", "Something else"]), run: () => { closeDialog(); lanjutAsli(); } },
    ]);
    return true;
  }
  return false;
}
{
  const asli = talk;
  talk = function (npc, lewat) { if (kisahBicara(npc, () => asli(npc, lewat))) return; return asli(npc, lewat); };
  const tandaAsli = tandaNpc;
  tandaNpc = function (n) {
    const a = tandaAsli(n); if (a || !S || n.kind || n.aktor) return a;
    if (kisahAktif().some((k) => { const L = langkahKisah(k); return L && L.npc === n.id && (L.tipe === "bicara" || (L.tipe === "pandu" && areaId === L.area && !pandu)); })) return { mark: "?", warna: WARNA_KISAH };
    if (KISAH.some((k) => k.npc === n.id && kisahTersedia(k))) return { mark: "!", warna: WARNA_KISAH };
    return null;
  };
}

// ---------- NPC pemandu ----------
let pandu = null;   // { k, L, npc, jalur:[{x,y}], i, tunggu }
const bisaDilewati = (tx, ty) => tx > 0 && ty > 0 && tx < MW - 1 && ty < MH - 1 && !SOLID.has(tileAt(tx, ty)) && !padatTambahan(tx, ty);
function cariJalur(dari, ke) {
  const sx = Math.floor(dari.x / T), sy = Math.floor(dari.y / T), asal = new Map(), antre = [[sx, sy]];
  asal.set(sx + "," + sy, null);
  let terbaik = [sx, sy], jarakTerbaik = Math.hypot(sx - ke[0], sy - ke[1]);
  while (antre.length) {
    const [x, y] = antre.shift();
    const d = Math.hypot(x - ke[0], y - ke[1]); if (d < jarakTerbaik) { jarakTerbaik = d; terbaik = [x, y]; }
    if (d < 0.5) break;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, kunci = nx + "," + ny;
      if (asal.has(kunci) || !bisaDilewati(nx, ny)) continue;
      asal.set(kunci, x + "," + y); antre.push([nx, ny]);
    }
  }
  const jalur = []; let c = terbaik[0] + "," + terbaik[1];
  while (c) { const [x, y] = c.split(",").map(Number); jalur.unshift({ x: (x + 0.5) * T, y: (y + 0.6) * T }); c = asal.get(c); }
  return jalur;
}
function mulaiPandu(k, L, npc) {
  pandu = { k, L, npc, jalur: cariJalur(npc, L.ke), i: 0, tunggu: 0, bicaraT: 0 };
  sfx.quest();
}
function akhiriPandu() { if (pandu && pandu.npc) pandu.npc.moving = false; pandu = null; }
UPDATE_TAMBAHAN.push((dt) => {
  if (!pandu) return;
  const p = pandu, n = p.npc;
  if (areaId !== p.L.area || !NPCS.includes(n)) return akhiriPandu();
  const jauh = dist(P, n) > 4.5 * T;
  if (jauh) {   // tunggu pemain
    n.moving = false; n.face = Math.atan2(P.y - n.y, P.x - n.x);
    p.tunggu += dt;
    if (p.tunggu > 3) { p.tunggu = 0; emosiAdegan.push({ ent: n, ikon: "…", t: 0 }); toast(Lx([`${n.name}: "Ke sini, Nak!"`, `${n.name}: "Over here, child!"`]), false); }
    return;
  }
  p.tunggu = 0;
  const tuju = p.jalur[p.i];
  if (!tuju) {   // sampai
    n.moving = false; n.face = Math.atan2(P.y - n.y, P.x - n.x);
    const { k, L } = p; akhiriPandu();
    percakapan(L.baris, () => majuKisah(k), L.tanya, "kisah-" + k.id + "-pandu");
    return;
  }
  const dx = tuju.x - n.x, dy = tuju.y - n.y, d = Math.hypot(dx, dy), v = 78 * dt;
  if (d <= v) { n.x = tuju.x; n.y = tuju.y; p.i++; }
  else { n.x += (dx / d) * v; n.y += (dy / d) * v; n.face = Math.atan2(dy, dx); }
  n.moving = true; n.run = (n.run || 0) + dt * 10;
});
SAAT_MASUK_AREA.push(() => { akhiriPandu(); pasangPrasasti(); });

// ---------- Prasasti ----------
function titikPrasasti(L) {
  const A = AREAS[L.area]; if (!A) return null;
  const [bx, by] = L.dekat === "bos" && A.bos ? [A.bos.x + 2.5, A.bos.y + 1.5] : L.dekat;
  // di area lain: perkiraan untuk panah/peta; di area ini: petak kosong terdekat
  if (areaId === L.area) for (let r = 0; r < 8; r++) for (let a = 0; a < 8; a++) {
    const x = Math.round(bx + Math.cos(a * 0.785) * r), y = Math.round(by + Math.sin(a * 0.785) * r);
    if (bisaDilewati(x, y)) return { area: L.area, x: (x + 0.5) * T, y: (y + 0.6) * T };
  }
  return { area: L.area, x: (bx + 0.5) * T, y: (by + 0.6) * T };
}
function pasangPrasasti() {
  if (!S) return;
  NPCS = NPCS.filter((n) => n.kind !== "prasastiKisah");
  for (const k of kisahAktif()) {
    const L = langkahKisah(k);
    if (!L || L.tipe !== "prasasti" || L.area !== areaId) continue;
    const p = titikPrasasti(L);
    NPCS.push({ id: "prasasti-" + k.id, kind: "prasastiKisah", kisah: k.id, name: Lx(["Prasasti Kuno", "Ancient Inscription"]), x: p.x, y: p.y, face: 0 });
  }
}
GAMBAR_OBJEK.prasastiKisah = function (n, time) {
  const x = n.x, y = n.y, nyala = 0.5 + 0.5 * Math.sin(time * 3);
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 18, 6, 0, 0, 6.28); ctx.fill();
  const g = ctx.createRadialGradient(x, y - 24, 4, x, y - 24, 46); g.addColorStop(0, `rgba(201,166,255,${0.25 + 0.2 * nyala})`); g.addColorStop(1, "rgba(201,166,255,0)");
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y - 24, 46, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#6e6a7a"; ctx.beginPath(); ctx.moveTo(x - 15, y); ctx.lineTo(x - 13, y - 40); ctx.quadraticCurveTo(x, y - 50, x + 13, y - 40); ctx.lineTo(x + 15, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#57536a"; ctx.fillRect(x - 15, y - 4, 30, 4);
  ctx.strokeStyle = `rgba(220,200,255,${0.6 + 0.4 * nyala})`; ctx.lineWidth = 1.6;
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - 8, y - 34 + i * 7); ctx.lineTo(x + 8 - (i % 2) * 4, y - 34 + i * 7); ctx.stroke(); }
  ctx.fillStyle = "#3d7a34"; ctx.beginPath(); ctx.ellipse(x - 10, y - 2, 6, 3, 0, 0, 6.28); ctx.fill();
  labelObjek(n, WARNA_KISAH, 56);
};
TEKA_BICARA.prasastiKisah = function (n) {
  const k = kisahById(n.kisah), L = k && langkahKisah(k);
  if (!L || L.tipe !== "prasasti") return;
  sfx.quest();
  percakapan(L.baris, () => { NPCS = NPCS.filter((x) => x !== n); majuKisah(k); }, L.tanya, "kisah-" + k.id + "-prasasti");
};

// ---------- Kalahkan monster ----------
{
  const asli = killMonster;
  killMonster = function (m) {
    const hidup = !m.dead; asli(m);
    if (!hidup || !m.dead || !S) return;
    for (const k of kisahAktif()) {
      const L = langkahKisah(k);
      if (!L || L.tipe !== "kalahkan" || L.monster !== m.type || (L.area && L.area !== areaId)) continue;
      const s = dataKisah()[k.id]; s.prog++;
      if (s.prog >= L.need) { if (L.baris) percakapan(L.baris, () => majuKisah(k)); else majuKisah(k); }
      else refreshHud(true);
      saveSoon();
    }
  };
}

// ---------- Daftar misi (bisa dilacak) ----------
function targetKisah(k) {
  const L = langkahKisah(k); if (!L) return null;
  if (L.tipe === "prasasti") return titikPrasasti(L);
  if (L.tipe === "kalahkan") return tempatMonster(L.monster);
  if (pandu && pandu.k === k && areaId === L.area) return { area: areaId, x: pandu.npc.x, y: pandu.npc.y, npc: true };
  const n = nyawaNpc(L.npc);
  return n && areaId === tempatNpc(L.npc).area ? { area: areaId, x: n.x, y: n.y, npc: true } : tempatNpc(L.npc);
}
{
  const asli = daftarMisi;
  daftarMisi = function () {
    const out = asli(); if (!S) return out;
    for (const k of kisahAktif()) {
      const L = langkahKisah(k), s = dataKisah()[k.id];
      const prog = L.tipe === "kalahkan" ? ` (${s.prog}/${L.need})` : "";
      out.push({ id: "kisah:" + k.id, jenis: "📜 " + Lx(["Kisah", "Tale"]) + " · " + npcById(k.npc).name, judul: Lx(k.judul),
        perintah: Lx(L.tujuan) + prog, hadiah: teksHadiah(k.hadiah), target: () => targetKisah(k) });
    }
    return out;
  };
}

// ---------- Ensiklopedia: bagian Kisah ----------
{
  const asli = isiDetailMusuh;
  isiDetailMusuh = function (m) {
    asli(m);
    const k = KISAH.find((x) => x.monster === m);
    if (!k || !S) return;
    const s = dataKisah()[k.id], el = document.createElement("div");
    el.className = "kisah-ens";
    el.innerHTML = s && s.selesai
      ? `<h3>📜 ${Lx(["Kisah", "Tale"])}: ${Lx(k.judul)}</h3><p>${Lx(k.ringkas)}</p><small>${Lx(["Diceritakan oleh", "Told by"])} ${npcById(k.npc).name}</small>`
      : `<h3>📜 ${Lx(["Kisah", "Tale"])}: ???</h3><p>${Lx([`Mungkin ${npcById(k.npc).name} tahu sesuatu tentang makhluk ini...`, `Perhaps ${npcById(k.npc).name} knows something about this creature...`])}</p>`;
    const catatanAngka = $("ensIsi").querySelector(".set-note");
    catatanAngka ? catatanAngka.before(el) : $("ensIsi").appendChild(el);
  };
}
daftarkanCapai({ id: "kisah3", kat: "jalan", judul: ["Pendengar Setia", "Good Listener"], desc: ["Selesaikan 3 kisah NPC.", "Complete 3 NPC tales."], hadiah: HDH(300, 3), progres: () => [Object.values((S && S.kisah) || {}).filter((s) => s.selesai).length, 3] });
