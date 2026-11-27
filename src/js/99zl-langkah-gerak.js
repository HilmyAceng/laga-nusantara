// =====================================================================
// LANGKAH CERITA BERGERAK (arc 2): NPC yang ikut bergerak bersama cerita
//   pandu   : NPC memimpin jalan dari titik ke titik; berhenti untuk bercerita (`baris`) atau
//             menunggu sergapan musuh (`sergap`) dibereskan; menunggu kalau kau tertinggal.
//   kawal   : antar NPC yang berjalan pelan ke `ke`. NPC punya nyawa; musuh di dekatnya
//             melukainya. Nyawanya habis → `gagal`, ulang dari awal.
//   buntuti : ikuti sosok mencurigakan dari jauh. Sesekali ia menoleh ke belakang: kalau kau
//             terlalu dekat & terlihat → `ketahuan`, ulang. Terlalu jauh terlalu lama → `hilang`, ulang.
//   kejar   : orang itu kabur lebih cepat darimu tapi cepat lelah. Sentuh untuk menangkapnya
//             sebelum `waktu` habis (kalau tidak → `lolos`, ulang).
//   jejak   : jejak kaki muncul satu per satu; ikuti sampai ujungnya.
// Teks tambahan memakai pasangan [ID, EN]. Data langkahnya ada di cerita/bab-11.js dst.
// =====================================================================
"use strict";

const TIPE_GERAK = new Set(["pandu", "kawal", "buntuti", "kejar", "jejak"]);
let gerakCerita = null;   // keadaan langkah bergerak yang sedang berjalan di area ini
const barisKe = (baris) => (baris || []).map(([who, teks]) => [who, Array.isArray(teks) ? Lx(teks) : teks]);
const pusatPetak = ([x, y]) => ({ x: (x + 0.5) * T, y: (y + 0.6) * T });

// ---------- Aktor (salinan NPC / sosok sementara) ----------
function buatAktorGerak(l, di) {
  const p = pusatPetak(di);
  const asli = l.npc ? npcById(l.npc) : null;
  const look = asli || { color: "#2b2238", accent: "#c9a24a", hat: l.aktor && l.aktor.id === "pedagangTopeng" ? "#1f1a24" : null, hair: "#1f1a2a" };
  const nama = asli ? asli.name : Lx(l.aktor.nama);
  return { id: "gerak-" + (l.npc || l.aktor.id), aktorGerak: true, aslinya: l.npc || l.aktor.id, name: nama, x: p.x, y: p.y, face: Math.PI / 2,
    color: look.color, accent: look.accent, hat: look.hat, hair: look.hair, topeng: l.aktor && /Topeng|Sepi|wewe/i.test(l.aktor.id) };
}
function pasangAktor(ent) { NPCS = NPCS.filter((n) => n.id !== ent.id); NPCS.push(ent); return ent; }
function hapusAktorGerak() { NPCS = NPCS.filter((n) => !n.aktorGerak); }
function jalanKe(ent, tujuan, laju, dt) {
  // ent.jalur: daftar titik piksel menuju tujuan (dicari ulang kalau tujuan berubah)
  const kunci = tujuan.join(",");
  if (ent.kunciJalur !== kunci) { ent.jalur = cariJalur(ent, tujuan); ent.ji = 0; ent.kunciJalur = kunci; }
  const t = ent.jalur[ent.ji] || pusatPetak(tujuan);
  const dx = t.x - ent.x, dy = t.y - ent.y, d = Math.hypot(dx, dy), v = laju * dt;
  ent.moving = true; ent.run = (ent.run || 0) + dt * (laju / 8);
  if (d <= v) { ent.x = t.x; ent.y = t.y; if (ent.ji < ent.jalur.length) ent.ji++; else { ent.moving = false; return true; } }
  else { ent.x += (dx / d) * v; ent.y += (dy / d) * v; ent.face = Math.atan2(dy, dx); }
  return false;
}
function munculkanSergap(sg, dekat) {
  const daftar = [];
  for (let i = 0; i < sg.jumlah; i++) {
    for (let c = 0; c < 12; c++) {
      const a = rand(0, 6.28), r = rand(3, 5) * T, x = dekat.x + Math.cos(a) * r, y = dekat.y + Math.sin(a) * r;
      if (solidAt(x, y)) continue;
      const m = makeMonster(sg.monster, { x, y }); m.aggro = true; m.seen = 4; m.sergapCerita = true; monsters.push(m); daftar.push(m);
      effects.push({ kind: "summon", x, y, t: 0, dur: 0.6 }); break;
    }
  }
  sfx.growl && sfx.growl(); shake = Math.max(shake, 0.2);
  return daftar;
}

// ---------- Siapkan langkah saat berada di areanya ----------
function siapkanGerak() {
  const l = langkahCerita();
  if (gerakCerita && gerakCerita.l === l && l && l.area === areaId) return;
  gerakCerita = null; hapusAktorGerak();
  if (!S || !l || !TIPE_GERAK.has(l.tipe) || l.area !== areaId) return;
  const g = { l, tipe: l.tipe, mulai: false, i: 0, t: 0 };
  if (l.tipe === "pandu") {
    const asliDiSini = !l.mulai && NPCS.find((n) => n.id === l.npc && !n.kind);
    g.npc = asliDiSini || pasangAktor(buatAktorGerak(l, l.mulai || [Math.floor(npcById(l.npc).x / T), Math.floor(npcById(l.npc).y / T)]));
  } else if (l.tipe === "kawal") {
    g.npc = pasangAktor(buatAktorGerak(l, l.mulai)); g.nyawa = 100; g.sergapDone = [];
  } else if (l.tipe === "buntuti") {
    g.npc = pasangAktor(buatAktorGerak(l, l.jalur[0])); g.jauhT = 0; g.lihatT = 0; g.jedaLihat = 6.5; g.t = 1.2;   // tolehan pertama setelah ia agak jauh di depan
    toast("👁 " + l.tujuan, true);
  } else if (l.tipe === "kejar") {
    g.npc = pasangAktor(buatAktorGerak(l, l.mulai)); g.sisa = l.waktu || 45; g.tenaga = 3.5; g.istirahat = 0;
  }
  gerakCerita = g;
}
SAAT_MASUK_AREA.push(() => { gerakCerita = null; siapkanGerak(); });
function ulangGerak(pesan) {
  const l = gerakCerita && gerakCerita.l;
  monsters = monsters.filter((m) => !m.sergapCerita);
  gerakCerita = null; hapusAktorGerak();
  if (pesan) toast(pesan, true);
  if (l) setTimeout(siapkanGerak, 600);
}
function selesaiGerak() {
  const g = gerakCerita; if (!g) return;
  gerakCerita = null;
  if (g.npc) { g.npc.moving = false; g.npc.face = Math.atan2(P.y - g.npc.y, P.x - g.npc.x); }
  selesaiLangkah();
  setTimeout(() => { if (!gerakCerita) NPCS = NPCS.filter((n) => !n.aktorGerak || (gerakCerita && gerakCerita.npc === n)); }, 400);
}
// langkah cerita berganti (mis. setelah percakapan) → siapkan langkah berikutnya
{
  const asli = selesaiLangkah;
  selesaiLangkah = function (putar) { asli(putar); setTimeout(() => { if (mode === "play" || mode === "dialog") siapkanGerak(); }, 50); };
}

// ---------- Bicara untuk memulai (pandu & kawal) ----------
{
  const asli = ceritaBicara;
  ceritaBicara = function (npc) {
    const g = gerakCerita;
    if (g && !g.mulai && (g.tipe === "pandu" || g.tipe === "kawal") && npc === g.npc) {
      openDialog(npc.name, Lx(g.l.ajak || ["Ayo, ikuti aku.", "Come, follow me."]), [{ label: Lx(["Ayo!", "Let's go!"]), primary: true, run: () => { closeDialog(); g.mulai = true; sfx.quest(); } }]);
      return true;
    }
    return asli(npc);
  };
  const tanda = tandaNpc;
  tandaNpc = function (n) {
    const g = gerakCerita;
    if (g && n === g.npc && (g.tipe === "pandu" || g.tipe === "kawal") && !g.mulai) return { mark: "!", warna: "#f4b942" };
    if (g && n === g.npc) return null;
    return tanda(n);
  };
}

// ---------- Jalannya tiap jenis langkah ----------
UPDATE_TAMBAHAN.push((dt) => {
  const g = gerakCerita;
  if (!g || !P || P.dead) return;
  if (langkahCerita() !== g.l) { gerakCerita = null; return; }
  const l = g.l, n = g.npc, jarak = n ? Math.hypot(P.x - n.x, P.y - n.y) : 0;
  if (g.tipe === "pandu" && g.mulai) {
    if (g.tunggu) {   // menunggu sergapan dibereskan
      if (g.tunggu.some((m) => !m.dead && monsters.includes(m))) { n.moving = false; return; }
      const titik = l.titik[g.i]; g.tunggu = null;
      if (titik.baris) { g.bicara = true; narasi(barisKe(titik.baris), () => { g.bicara = false; g.i++; }); } else g.i++;
      return;
    }
    if (g.bicara) return;
    if (jarak > 4.5 * T) { n.moving = false; n.face = Math.atan2(P.y - n.y, P.x - n.x); g.t += dt; if (g.t > 3.5) { g.t = 0; toast(Lx([`${n.name}: "Ke sini!"`, `${n.name}: "Over here!"`]), false); } return; }
    g.t = 0;
    const titik = l.titik[g.i];
    if (!titik) return selesaiGerak();
    if (jalanKe(n, titik.di, 80, dt)) {
      n.face = Math.atan2(P.y - n.y, P.x - n.x);
      if (titik.sergap) { g.tunggu = munculkanSergap(titik.sergap, n); toast(Lx(["Sergapan! Lindungi diri kalian!", "Ambush! Defend yourselves!"]), true); return; }
      if (g.i === l.titik.length - 1) { if (titik.baris) { g.bicara = true; narasi(barisKe(titik.baris), () => { g.bicara = false; selesaiGerak(); }); } else selesaiGerak(); return; }
      if (titik.baris) { g.bicara = true; narasi(barisKe(titik.baris), () => { g.bicara = false; g.i++; }); } else g.i++;
    }
  } else if (g.tipe === "kawal" && g.mulai) {
    // musuh di dekat NPC melukainya
    const dekat = monsters.filter((m) => !m.dead && m.aggro && Math.hypot(m.x - n.x, m.y - n.y) < 64);
    if (dekat.length) { g.nyawa -= dt * 6 * Math.min(3, dekat.length); n.flash = 0.1; for (const m of dekat) { m.aggro = true; } }
    else g.nyawa = Math.min(100, g.nyawa + dt * 3);   // pulih pelan saat aman
    if (g.nyawa <= 0) return ulangGerak(`${n.name}: "${Lx(l.gagal || ["Aku tak kuat lagi... kita ulangi dari awal.", "I can't go on... let's start over."])}"`);
    for (const [i, sg] of (l.sergap || []).entries()) if (!g.sergapDone.includes(i) && Math.hypot(n.x - pusatPetak(sg.di).x, n.y - pusatPetak(sg.di).y) < 2.5 * T) { g.sergapDone.push(i); munculkanSergap(sg, n); toast(Lx([`Lindungi ${n.name}!`, `Protect ${n.name}!`]), true); }
    if (dekat.length || jarak > 5 * T) { n.moving = false; n.face = Math.atan2(P.y - n.y, P.x - n.x); return; }
    if (jalanKe(n, l.ke, 55, dt)) selesaiGerak();
  } else if (g.tipe === "buntuti") {
    if (g.t > 0) { g.t -= dt; return; }
    if (g.lihat > 0) {   // menoleh ke belakang
      g.lihat -= dt;
      const hadap = n.face, keP = Math.atan2(P.y - n.y, P.x - n.x), selisih = Math.abs(Math.atan2(Math.sin(keP - hadap), Math.cos(keP - hadap)));
      if (jarak < 4.2 * T && selisih < 1.2) return ulangGerak("❗ " + Lx(l.ketahuan || ["Kau ketahuan! Ulangi dari awal.", "You were spotted! Start over."]));
      return;
    }
    g.jauhT = jarak > 9 * T ? g.jauhT + dt : 0;
    if (g.jauhT > 4) return ulangGerak("❔ " + Lx(l.hilang || ["Kau kehilangan jejaknya. Ulangi dari awal.", "You lost track. Start over."]));
    if (jarak < 2.6 * T) { g.dekatT = (g.dekatT || 0) - dt; if (g.dekatT <= 0) { g.dekatT = 3; toast(Lx(["Terlalu dekat! Jaga jarak.", "Too close! Keep your distance."]), false); } }
    g.jedaLihat -= dt;
    if (g.jedaLihat <= 0) { g.jedaLihat = rand(3.5, 6); g.lihat = 1.7; n.moving = false; n.face = n.face + Math.PI; emosiAdegan.push({ ent: n, ikon: "?", t: 0 }); return; }
    const tujuan = l.jalur[g.i + 1];
    if (!tujuan) return selesaiGerak();
    if (jalanKe(n, tujuan, 70, dt)) g.i++;
  } else if (g.tipe === "kejar") {
    if (!g.mulai) { if (jarak < 5 * T) { g.mulai = true; emosiAdegan.push({ ent: n, ikon: "!", t: 0 }); toast("🏃 " + l.tujuan, true); } else return; }
    if (jarak < 0.9 * T) { n.moving = false; return selesaiGerak(); }
    g.sisa -= dt;
    if (Math.floor(g.sisa) % 10 === 0 && Math.floor(g.sisa) !== g.terakhir && g.sisa > 1) { g.terakhir = Math.floor(g.sisa); notifItem(`⏱ ${Math.ceil(g.sisa)}`); }
    if (g.sisa <= 0) return ulangGerak("💨 " + Lx(l.lolos || ["Ia lolos! Coba lagi.", "They got away! Try again."]));
    if (!g.tuju || Math.hypot(n.x - pusatPetak(g.tuju).x, n.y - pusatPetak(g.tuju).y) < T || Math.hypot(P.x - pusatPetak(g.tuju).x, P.y - pusatPetak(g.tuju).y) < 3 * T) {
      g.tuju = [...l.titik].sort((a, b) => Math.hypot(P.x - pusatPetak(b).x, P.y - pusatPetak(b).y) - Math.hypot(P.x - pusatPetak(a).x, P.y - pusatPetak(a).y))[Math.floor(Math.random() * 2)];
    }
    let laju = 45;
    if (g.istirahat > 0) g.istirahat -= dt;
    else if (g.tenaga > 0) { laju = 175; g.tenaga -= dt; if (g.tenaga <= 0) { g.istirahat = 1.6; emosiAdegan.push({ ent: n, ikon: "…", t: 0 }); } }
    else g.tenaga = 3.5;
    jalanKe(n, g.tuju, laju, dt);
  } else if (g.tipe === "jejak") {
    const titik = l.titik[g.i];
    if (!titik) return;
    const p = pusatPetak(titik);
    if (Math.hypot(P.x - p.x, P.y - p.y) < 1.6 * T) {
      g.i++; sfx.coin(); spark(p.x, p.y, "#f4b942", 8);
      if (g.i >= l.titik.length) selesaiGerak(); else notifItem(`👣 ${g.i} / ${l.titik.length}`);
    }
  }
});
// jejak: siapkan juga saat langkah jejak aktif (tidak ada aktor)
{
  const asli = siapkanGerak;
  siapkanGerak = function () {
    asli();
    const l = langkahCerita();
    if (!gerakCerita && S && l && l.tipe === "jejak" && l.area === areaId) gerakCerita = { l, tipe: "jejak", i: 0, t: 0 };
  };
}

// ---------- Kotak misi, panah tujuan, area langkah ----------
{
  const asli = teksMisiUtama;
  teksMisiUtama = function () {
    const s = asli(), g = gerakCerita;
    if (!g) return s;
    if (g.tipe === "kawal" && g.mulai) return s + ` <small>❤ ${Math.max(0, Math.ceil(g.nyawa))}%</small>`;
    if (g.tipe === "kejar" && g.mulai) return s + ` <small>⏱ ${Math.ceil(g.sisa)}</small>`;
    if (g.tipe === "jejak") return s + ` (${g.i}/${g.l.titik.length})`;
    return s;
  };
  const tgtAsli = ceritaTarget;
  ceritaTarget = function () {
    const l = langkahCerita();
    if (!l || !TIPE_GERAK.has(l.tipe)) return tgtAsli();
    const g = gerakCerita;
    if (g && g.l === l && areaId === l.area) {
      if (g.tipe === "jejak") { const t = l.titik[g.i]; return t ? { area: l.area, ...pusatPetak(t) } : { area: l.area }; }
      if (g.npc) return { area: l.area, x: g.npc.x, y: g.npc.y, npc: g.tipe !== "buntuti" && g.tipe !== "kejar" };
    }
    const awal = l.mulai || (l.jalur && l.jalur[0]) || (l.titik && (Array.isArray(l.titik[0]) ? l.titik[0] : l.titik[0].di));
    return awal ? { area: l.area, ...pusatPetak(awal) } : { area: l.area };
  };
  const areaAsli = areaLangkah;
  areaLangkah = function (l) { return l && TIPE_GERAK.has(l.tipe) ? l.area : areaAsli(l); };
}

// ---------- Gambar: jejak kaki, nyawa kawal, mata pembuntutan ----------
GAMBAR_TANAH.push(function (time) {
  const g = gerakCerita;
  if (!g || g.tipe !== "jejak") return;
  const l = g.l, sampai = Math.min(g.i + 1, l.titik.length);
  for (let k = 0; k < sampai; k++) {
    const a = k === 0 ? pusatPetak(l.titik[0]) : pusatPetak(l.titik[k - 1]), b = pusatPetak(l.titik[k]);
    const d = Math.hypot(b.x - a.x, b.y - a.y), langkah = Math.max(1, Math.floor(d / 26)), sudut = Math.atan2(b.y - a.y, b.x - a.x);
    for (let s = 0; s <= langkah; s++) {
      const x = a.x + (b.x - a.x) * s / langkah, y = a.y + (b.y - a.y) * s / langkah, kiri = s % 2 ? 1 : -1;
      ctx.save(); ctx.translate(x - Math.sin(sudut) * 5 * kiri, y + Math.cos(sudut) * 5 * kiri); ctx.rotate(sudut);
      ctx.fillStyle = k === g.i ? `rgba(244,185,66,${0.5 + 0.3 * Math.sin(time * 5 - s)})` : "rgba(60,40,20,0.45)";
      ctx.beginPath(); ctx.ellipse(0, 0, 5, 3, 0, 0, 6.28); ctx.fill(); ctx.restore();
    }
  }
  const t = l.titik[g.i]; if (t) { const p = pusatPetak(t); ctx.strokeStyle = `rgba(244,185,66,${0.5 + 0.3 * Math.sin(time * 4)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p.x, p.y, 18 + Math.sin(time * 4) * 3, 0, 6.28); ctx.stroke(); }
});
GAMBAR_ATAS.push(function () {
  const g = gerakCerita;
  if (!g || !g.npc) return;
  const n = g.npc;
  if (g.tipe === "kawal" && g.mulai && !sembunyikanBarKepala()) {
    ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(n.x - 22, n.y - 82, 44, 6);
    ctx.fillStyle = g.nyawa > 40 ? "#5ad17a" : "#e5484d"; ctx.fillRect(n.x - 21, n.y - 81, 42 * Math.max(0, g.nyawa) / 100, 4);
  }
  if (g.tipe === "buntuti") {
    ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = g.lihat > 0 ? "#e5484d" : "#f4b942";
    ctx.beginPath(); ctx.moveTo(n.x, n.y - 20); ctx.arc(n.x, n.y - 20, 4.2 * T, n.face - 1.2, n.face + 1.2); ctx.closePath(); ctx.fill(); ctx.restore();
    if (g.lihat > 0) { ctx.font = "800 20px Nunito"; ctx.textAlign = "center"; ctx.fillStyle = "#e5484d"; ctx.fillText("👁", n.x, n.y - 80); }
  }
});
// sosok bertopeng: gambar topeng putih di wajah aktor
{
  const asli = drawNpc;
  drawNpc = function (n, time) {
    asli(n, time);
    if (n.topeng) { ctx.fillStyle = "#f2ead8"; ctx.beginPath(); ctx.ellipse(n.x + (Math.cos(n.face) < 0 ? -3 : 3), n.y - 41, 9, 10, 0, 0, 6.28); ctx.fill(); ctx.fillStyle = "#1f1a24"; ctx.fillRect(n.x - 4, n.y - 44, 3, 3); ctx.fillRect(n.x + 2, n.y - 44, 3, 3); }
  };
}

// ---------- Titik cerita selalu bisa diinjak ----------
// Peta dibuat acak (dengan seed); pohon/batu yang kebetulan tumbuh di titik langkah bergerak
// (mulai, ke, titik, jalur, sergap) dibersihkan saat area dibangun.
const TITIK_GERAK = {};
for (const l of CERITA) {
  if (!TIPE_GERAK.has(l.tipe)) continue;
  const daftar = (TITIK_GERAK[l.area] = TITIK_GERAK[l.area] || []);
  for (const p of [l.mulai, l.ke, ...(l.jalur || []), ...(l.titik || []).map((t) => (Array.isArray(t) ? t : t.di)), ...(l.sergap || []).map((s) => s.di)]) if (p) daftar.push(p);
}
{
  const asli = buildArea;
  buildArea = function (id) {
    asli(id);
    const lunak = new Set([TREE, ROCK, REED]);
    for (const [x, y] of TITIK_GERAK[id] || []) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (lunak.has(tileAt(x + dx, y + dy))) setT(x + dx, y + dy, area.salju ? SALJU : area.sabana ? RUMPUT_KERING : G);
  };
}
