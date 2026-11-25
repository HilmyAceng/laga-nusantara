// =====================================================================
// MODE BERTAHAN (gelombang musuh) — dari Cermin Gaib
// Sentuh Cermin Gaib di sarang bos mana pun → pilih "Mode Bertahan".
//  - Musuh datang bergelombang dari sekeliling cermin. Gelombang n: (2 + n) musuh,
//    makin tebal & keras. Tiap 5 gelombang ada musuh ELIT (nyawa ×3).
//  - Jeda 4 detik antar-gelombang (nyawa pulih 15%).
//  - Selesai kalau pingsan, keluar area, atau tekan "Keluar". Rekor gelombang tersimpan.
//  - Hadiah kecil tiap gelombang (koin), serpih tiap 5 gelombang;
//    gelombang 10 → gelar «Juara Arena». Tujuan utamanya adalah rekor.
// Simpanan: S.bertahan = { rekor, main }
// =====================================================================
"use strict";

const bertahanTerbuka = () => !!(S && S.bos && Object.keys(S.bos).some((k) => S.bos[k]));
const dataBertahan = () => (S.bertahan = S.bertahan || { rekor: 0, main: 0 });
let bt = null;   // { pusat:{x,y}, gelombang, jeda, sisa, area }

// ---------- Masuk lewat Cermin Gaib ----------
{
  const asli = talkCermin;
  talkCermin = function (npc) {
    if (bt || bosHidup()) return;
    const R = dataBertahan();
    openDialog(npc.name, Lx(["Cermin berpendar. Bayangan-bayangan menunggu di baliknya...", "The mirror glows. Shadows wait beyond it..."]), [
      { label: Lx(["Tantang bos lagi", "Rematch the boss"]), primary: true, run: () => { closeDialog(); asli(npc); } },
      { label: Lx([`Mode Bertahan (rekor: gelombang ${R.rekor})`, `Survival Mode (best: wave ${R.rekor})`]), run: () => { closeDialog(); tanyaBertahan(npc); } },
      { label: t("dlg.tutup"), run: closeDialog },
    ]);
  };
}
function tanyaBertahan(npc) {
  openDialog(Lx(["Mode Bertahan", "Survival Mode"]), Lx([
    "Musuh akan datang bergelombang tanpa henti. Bertahanlah selama mungkin! Ada jeda singkat antar-gelombang. Kalau pingsan, permainan selesai (tanpa kehilangan apa pun).",
    "Enemies will come in endless waves. Survive as long as you can! There's a short break between waves. If you faint, the run ends (you lose nothing).",
  ]), [
    { label: Lx(["Mulai!", "Start!"]), primary: true, run: () => { closeDialog(); mulaiBertahan(npc); } },
    { label: t("dlg.tutup"), run: closeDialog },
  ]);
}

// ---------- Jalannya pertarungan ----------
function mulaiBertahan(npc) {
  bt = { pusat: { x: npc.x, y: npc.y + T }, gelombang: 0, jeda: 2.5, area: areaId, koin: 0 };
  dataBertahan().main++;
  monsters = monsters.filter((m) => !m.dead);
  $("btHud").hidden = false; segarkanHudBertahan();
  toast(Lx(["Bersiaplah! Gelombang pertama datang...", "Get ready! The first wave is coming..."]), true);
  sfx.growl && sfx.growl(); saveSoon();
}
// musuh: dipilih dari monster biasa yang levelnya paling dekat dengan level pemain
function poolBertahan() {
  const semua = Object.entries(MONSTERS).filter(([k, d]) => !d.boss && !d.latihan && !d.copet && d.hp > 20 && d.atk > 0);
  semua.sort((a, b) => Math.abs(a[1].lv - S.lv) - Math.abs(b[1].lv - S.lv));
  return semua.slice(0, 7).map(([k]) => k);
}
function titikMuncul() {
  for (let i = 0; i < 20; i++) {
    const a = rand(0, 6.28), r = rand(4, 7) * T, x = bt.pusat.x + Math.cos(a) * r, y = bt.pusat.y + Math.sin(a) * r;
    if (!solidAt(x, y) && x > T && y > T && x < (MW - 1) * T && y < (MH - 1) * T) return { x, y };
  }
  return { x: bt.pusat.x + rand(-80, 80), y: bt.pusat.y + rand(-80, 80) };
}
function gelombangBaru() {
  const n = ++bt.gelombang, pool = poolBertahan(), jumlah = Math.min(2 + n, 12), kuat = 1 + 0.1 * (n - 1);
  for (let i = 0; i < jumlah; i++) {
    const elit = n % 5 === 0 && i === 0, sp = titikMuncul();
    const m = makeMonster(pool[Math.floor(Math.random() * pool.length)], sp);
    m.d = { ...m.d, hp: Math.round(m.d.hp * kuat * (elit ? 3 : 1)), atk: Math.round(m.d.atk * (1 + 0.06 * (n - 1)) * (elit ? 1.3 : 1)), name: (elit ? "★ " : "") + m.d.name, exp: Math.round(m.d.exp * 0.5), gold: m.d.gold.map((g) => Math.round(g * 0.4)) };
    m.hp = m.d.hp; m.bertahan = true; m.elit = elit; m.aggro = true; m.seen = 4; m.home = { ...bt.pusat };
    monsters.push(m);
    effects.push({ kind: "summon", x: sp.x, y: sp.y, t: 0, dur: 0.6 });
  }
  toast(Lx([`Gelombang ${n}!`, `Wave ${n}!`]) + (n % 5 === 0 ? Lx([" Ada musuh ELIT!", " An ELITE enemy appears!"]) : ""), true);
  sfx.summon && sfx.summon();
}
function selesaiGelombang() {
  const n = bt.gelombang, R = dataBertahan(), koin = 10 + 6 * n;
  S.gold += koin; bt.koin += koin; tambahStat("gelombang");
  S.statistik.gelombangTertinggi = Math.max(S.statistik.gelombangTertinggi || 0, n);
  if (n > R.rekor) R.rekor = n;
  notifItem(`+${koin} ${Lx(["koin", "coins"])}`);
  if (n % 5 === 0) { S.jimat.serpih += 1; setTimeout(() => notifItem(`+1 ${Lx(["Serpih Pusaka", "Heirloom Shard"])}`), 300); }
  if (n === 10 && !punyaGelar("juaraArena")) {
    beriGelar("juaraArena");
    toast(Lx(["🎖 Gelar baru: «Juara Arena»!", "🎖 New title: «Arena Champion»!"]), true);
  }
  P.hp = Math.min(maxHp(), P.hp + maxHp() * 0.15);
  bt.jeda = 4; refreshHud(true); saveSoon();
}
function akhiriBertahan(alasan) {
  if (!bt) return;
  const n = Math.max(0, bt.gelombang - (alasan === "menang" ? 0 : 1)), R = dataBertahan(), rekorBaru = n > 0 && n >= R.rekor;
  monsters = monsters.filter((m) => !m.bertahan);
  $("btHud").hidden = true;
  const koin = bt.koin; bt = null;
  toast(Lx([`Mode Bertahan selesai: ${n} gelombang tuntas · +${koin} koin`, `Survival over: ${n} waves cleared · +${koin} coins`]), true);
  if (rekorBaru && n >= 3 && typeof momenBagikan === "function") momenBagikan({ judul: [`Rekor bertahan: ${n} gelombang!`, `Survival record: ${n} waves!`], sub: ["Mode Bertahan · Cermin Gaib", "Survival Mode · Mystic Mirror"], warna: "#c9a6ff" });
  saveSoon();
}
UPDATE_TAMBAHAN.push((dt) => {
  if (!bt) return;
  if (!P || P.dead || areaId !== bt.area || mode === "select") return akhiriBertahan("kalah");
  if (mode !== "play") return;
  // buang musuh gelombang yang sudah kalah (tidak muncul lagi)
  monsters = monsters.filter((m) => !(m.bertahan && m.dead));
  const sisa = monsters.filter((m) => m.bertahan).length;
  if (bt.jeda > 0) { bt.jeda -= dt; if (bt.jeda <= 0) gelombangBaru(); }
  else if (sisa === 0) selesaiGelombang();
  // musuh gelombang selalu mengejar & tidak pulang
  for (const m of monsters) if (m.bertahan) { m.aggro = true; m.seen = 4; m.home = { x: P.x, y: P.y }; }
  segarkanHudBertahan(sisa);
});
SAAT_MASUK_AREA.push(() => { if (bt) akhiriBertahan("kalah"); });

// ---------- HUD ----------
{
  const h = document.createElement("div");
  h.id = "btHud"; h.hidden = true;
  h.innerHTML = `<span id="btInfo"></span><button type="button" id="btnBtKeluar"></button>`;
  document.querySelector(".stage").appendChild(h);
  $("btnBtKeluar").addEventListener("click", () => { sfx.click(); akhiriBertahan("menang"); });
}
function segarkanHudBertahan(sisa) {
  if (!bt) return;
  const R = dataBertahan();
  const teks = bt.jeda > 0
    ? Lx([`Gelombang ${bt.gelombang + 1} dalam ${Math.ceil(bt.jeda)}…`, `Wave ${bt.gelombang + 1} in ${Math.ceil(bt.jeda)}…`])
    : Lx([`Gelombang ${bt.gelombang} · Musuh ${sisa}`, `Wave ${bt.gelombang} · Enemies ${sisa}`]);
  const isi = `<b>${teks}</b><small>${Lx(["Rekor", "Best"])}: ${R.rekor}</small>`;
  if ($("btInfo").innerHTML !== isi) $("btInfo").innerHTML = isi;
  const k = Lx(["Keluar", "Leave"]); if ($("btnBtKeluar").textContent !== k) $("btnBtKeluar").textContent = k;
}

// ---------- Pencapaian ----------
daftarkanCapai({ id: "bertahan5", kat: "tarung", judul: ["Tak Tergoyahkan", "Unshakable"], desc: ["Tuntaskan 5 gelombang di Mode Bertahan.", "Clear 5 waves in Survival Mode."], hadiah: HDH(200, 2), progres: () => [(S.bertahan && S.bertahan.rekor) || 0, 5] });
daftarkanCapai({ id: "bertahan15", kat: "tarung", judul: ["Benteng Nusantara", "Fortress of Nusantara"], desc: ["Tuntaskan 15 gelombang di Mode Bertahan.", "Clear 15 waves in Survival Mode."], hadiah: HDH(600, 6), progres: () => [(S.bertahan && S.bertahan.rekor) || 0, 15] });
// kembali ke layar judul di tengah Mode Bertahan → selesai
{
  const asli = showUI;
  showUI = function () { asli(); if (mode === "select" && bt) akhiriBertahan("kalah"); };
}
