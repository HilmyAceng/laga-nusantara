// =====================================================================
// KOSMETIK & GELAR (hanya tampilan, tidak menambah kekuatan)
// Menu › Gameplay › Kosmetik: pratinjau hero, 4 jenis kosmetik + gelar.
//  - Baju (warna badan), Ikat (ikat kepala & sabuk), Topi, Aura (efek di sekitar hero).
//  - Gelar tampil di atas nama hero.
// Cara mendapatkan:
//  - beli dengan koin (harga di katalog);
//  - pencapaian tertentu (syarat), tantangan mingguan & absen harian (99t-harian.js);
//  - Kode Pendukung dari Saweria (99s-kode-hadiah.js) → set "Pendukung".
// Semua hadiah kosmetik bisa dikirim lewat Kotak Pesan (99r-kotak-pesan.js).
// Simpanan: S.gaya = { punya: {id:1}, pakai: {baju, ikat, topi, aura}, gelar, gelarPunya: {id:1}, pendukung }
// =====================================================================
"use strict";

const JENIS_GAYA = { baju: ["Baju", "Outfit"], ikat: ["Ikat", "Headband"], topi: ["Topi", "Hat"], aura: ["Aura", "Aura"] };
const sudahCapai = (id) => () => capaiTercapai(id);
// sumber: "koin" (harga), "capai" (syarat), "mingguan", "absen", "pendukung"
const KOSMETIK = {
  // baju
  merahSaga: { jenis: "baju", nama: ["Merah Saga", "Saga Red"], warna: "#b8323a", koin: 300 },
  biruLaut: { jenis: "baju", nama: ["Biru Laut", "Ocean Blue"], warna: "#2d6a96", koin: 300 },
  hijauAlas: { jenis: "baju", nama: ["Hijau Alas", "Forest Green"], warna: "#3d7a34", koin: 300 },
  unguSenja: { jenis: "baju", nama: ["Ungu Senja", "Dusk Violet"], warna: "#6b3fa0", sumber: "mingguan" },
  hitamWayang: { jenis: "baju", nama: ["Hitam Wayang", "Wayang Black"], warna: "#2b2238", syarat: sudahCapai("bosSemua"), ket: ["Kalahkan semua bos", "Defeat every boss"] },
  putihSuci: { jenis: "baju", nama: ["Putih Suci", "Sacred White"], warna: "#e9e2d0", syarat: sudahCapai("tamat"), ket: ["Tamatkan cerita", "Finish the story"] },
  emasKeraton: { jenis: "baju", nama: ["Emas Keraton", "Palace Gold"], warna: "#d9a43a", sumber: "pendukung" },
  // ikat kepala & sabuk
  merahPutih: { jenis: "ikat", nama: ["Merah Putih", "Red & White"], warna: "#e5484d", koin: 200 },
  batikEmas: { jenis: "ikat", nama: ["Batik Emas", "Golden Batik"], warna: "#c9932f", koin: 250 },
  hijauDaun: { jenis: "ikat", nama: ["Hijau Daun", "Leaf Green"], warna: "#5ad17a", syarat: sudahCapai("ikan50"), ket: ["Tangkap 50 ikan", "Catch 50 fish"] },
  biruArwana: { jenis: "ikat", nama: ["Biru Arwana", "Arowana Blue"], warna: "#8fd3ff", syarat: sudahCapai("ikanLegenda"), ket: ["Tangkap ikan legenda", "Catch a legendary fish"] },
  unguAbsen: { jenis: "ikat", nama: ["Ungu Setia", "Loyal Violet"], warna: "#9a6bd6", sumber: "absen" },
  ikatPendukung: { jenis: "ikat", nama: ["Ikat Pendukung", "Supporter Band"], warna: "#ff7b5c", sumber: "pendukung" },
  // topi
  caping: { jenis: "topi", nama: ["Caping", "Rice Hat"], warna: "#c9a25a", koin: 400 },
  blangkon: { jenis: "topi", nama: ["Blangkon", "Blangkon"], warna: "#5b3a24", koin: 400 },
  pecis: { jenis: "topi", nama: ["Pecis Juara", "Champion's Cap"], warna: "#2b2238", syarat: sudahCapai("caturJago"), ket: ["Menang Catur Laga tingkat Jago", "Win Battle Chess on Expert"] },
  mahkota: { jenis: "topi", nama: ["Mahkota Pendukung", "Supporter Crown"], warna: "#f4b942", sumber: "pendukung" },
  // aura
  kunang: { jenis: "aura", nama: ["Kunang-kunang", "Fireflies"], syarat: sudahCapai("jelajahSemua"), ket: ["Jelajahi semua area", "Explore every area"] },
  daun: { jenis: "aura", nama: ["Daun Gugur", "Falling Leaves"], koin: 800 },
  api: { jenis: "aura", nama: ["Api Banaspati", "Banaspati Flame"], syarat: sudahCapai("cermin7"), ket: ["Tantang 7 bos di Cermin Gaib", "Rematch 7 bosses in the Mirror"] },
  kabut: { jenis: "aura", nama: ["Kabut Bayang", "Shadow Mist"], sumber: "mingguan" },
  bintang: { jenis: "aura", nama: ["Cahaya Pendukung", "Supporter Glow"], sumber: "pendukung" },
};
// gelar: dari pencapaian, mingguan/absen, mode bertahan, sulit+, pendukung
const GELAR = {
  pemula: { nama: ["Pemula Wanasari", "Wanasari Rookie"], syarat: sudahCapai("bab1"), ket: ["Tamatkan Bab 1", "Clear Chapter 1"] },
  pemburuBos: { nama: ["Pemburu Bos", "Boss Hunter"], syarat: sudahCapai("bos1"), ket: ["Kalahkan bos pertama", "Defeat your first boss"] },
  pemburuHarta: { nama: ["Pemburu Harta", "Treasure Hunter"], syarat: sudahCapai("hartaPertama"), ket: ["Buka peti harta pertama", "Open your first treasure chest"] },
  pemancing: { nama: ["Pemancing Sabar", "Patient Angler"], syarat: sudahCapai("ikan50"), ket: ["Tangkap 50 ikan", "Catch 50 fish"] },
  bayanganKilat: { nama: ["Bayangan Kilat", "Lightning Shadow"], syarat: sudahCapai("sempurna50"), ket: ["50 kali Hindar Sempurna", "50 Perfect Dodges"] },
  grandmaster: { nama: ["Grandmaster Wanasari", "Wanasari Grandmaster"], syarat: sudahCapai("caturJago"), ket: ["Menang Catur Laga tingkat Jago", "Win Battle Chess on Expert"] },
  kolektor: { nama: ["Kolektor Pusaka", "Heirloom Collector"], syarat: sudahCapai("jimatLegenda"), ket: ["Dapatkan jimat legenda", "Get a legendary charm"] },
  pembasmi: { nama: ["Pembasmi Seribu", "Slayer of Thousands"], syarat: sudahCapai("kalah1000"), ket: ["Kalahkan 1000 musuh", "Defeat 1000 enemies"] },
  penakluk: { nama: ["Penakluk Nusantara", "Conqueror of Nusantara"], syarat: sudahCapai("bosSemua"), ket: ["Kalahkan semua bos", "Defeat every boss"] },
  pahlawan: { nama: ["Pahlawan Nusantara", "Hero of Nusantara"], syarat: sudahCapai("tamat"), ket: ["Tamatkan cerita", "Finish the story"] },
  rajin: { nama: ["Rajin Berlatih", "Diligent"], sumber: "absen" },
  setia: { nama: ["Pendekar Setia", "Loyal Warrior"], sumber: "absen" },
  juaraArena: { nama: ["Juara Arena", "Arena Champion"], sumber: "bertahan" },
  pendekarSejati: { nama: ["Pendekar Sejati", "True Warrior"], sumber: "sulit" },
  pendukung: { nama: ["Pendukung", "Supporter"], sumber: "pendukung" },
};

const dataGaya = () => (S.gaya = S.gaya || { punya: {}, pakai: {}, gelar: null, gelarPunya: {}, pendukung: "" });
const punyaKosmetik = (id) => { const k = KOSMETIK[id]; return !!(k && (dataGaya().punya[id] || (k.syarat && k.syarat()))); };
const punyaGelar = (id) => { const g = GELAR[id]; return !!(g && (dataGaya().gelarPunya[id] || (g.syarat && g.syarat()))); };
function beriKosmetik(id) { if (KOSMETIK[id]) dataGaya().punya[id] = 1; }
function beriGelar(id) { if (GELAR[id]) dataGaya().gelarPunya[id] = 1; }
function gelarAktif() {
  if (!S) return "";
  const id = dataGaya().gelar;
  if (!id || !punyaGelar(id)) return "";
  const nama = Lx(GELAR[id].nama);
  return id === "pendukung" && S.gaya.pendukung ? `${nama} · ${S.gaya.pendukung}` : nama;
}
const ketSumber = (x) => x.koin ? Lx([`${x.koin} koin`, `${x.koin} coins`])
  : x.ket ? Lx(x.ket)
  : Lx({ mingguan: ["Hadiah tantangan mingguan", "Weekly challenge reward"], absen: ["Hadiah absen harian", "Daily check-in reward"], pendukung: ["Kode Pendukung (Saweria)", "Supporter Code (Saweria)"], bertahan: ["Capai gelombang 10 di Mode Bertahan", "Reach wave 10 in Survival"], sulit: ["Kalahkan bos terakhir di Sulit+", "Beat the final boss on Hard+"] }[x.sumber] || ["", ""]);

// ---------- Tampilan hero ----------
{
  const asli = lookPemain;
  lookPemain = function () {
    const L = asli(); if (!S) return L;
    const p = dataGaya().pakai, ambil = (j) => p[j] && punyaKosmetik(p[j]) ? KOSMETIK[p[j]] : null;
    const b = ambil("baju"), i = ambil("ikat"), tp = ambil("topi"), a = ambil("aura");
    if (b) L.color = b.warna;
    if (i) L.accent = i.warna;
    // caping memakai topi lebar bawaan drawPerson; topi lain digambar dengan bentuknya sendiri (gambarTopi)
    if (tp) { L.topi = p.topi; if (p.topi === "caping") L.hat = tp.warna; }
    if (a) L.aura = p.aura;
    return L;
  };
}
// aura digambar di belakang hero (berlaku juga untuk pratinjau & kartu bagikan)
{
  const asli = drawPerson;
  drawPerson = function (c, e, look, time, opts = {}) {
    if (look && look.aura) gambarAura(c, e, look.aura, time, false);
    asli(c, e, look, time, opts);
    if (look && look.topi && look.topi !== "caping") gambarTopi(c, e, look.topi);
    if (look && look.aura) gambarAura(c, e, look.aura, time, true);
  };
}
// Topi berbentuk khusus, digambar di atas kepala (menutupi ikat kepala). Ikut naik-turun saat berjalan.
function gambarTopi(c, e, jenis) {
  const bob = e.moving ? Math.abs(Math.sin(e.run)) * 2 : 0, arah = Math.cos(e.face) < -0.05 ? -1 : 1;
  c.save(); c.translate(e.x, e.y - (e.lompat || 0) - bob); c.scale(arah, 1);
  if (jenis === "pecis") {
    // peci hitam beludru dengan pinggir emas (juara catur)
    c.fillStyle = "#1c1626"; roundRect(c, -12.5, -57, 25, 12, 3); c.fill();
    c.fillStyle = "#3a2f55"; c.fillRect(-12.5, -57, 25, 3);
    c.fillStyle = "#f4b942"; c.fillRect(-12.5, -47.5, 25, 2.5);
  } else if (jenis === "blangkon") {
    // blangkon batik cokelat dengan mondolan (tonjolan) di belakang
    c.fillStyle = "#5b3a24"; c.beginPath(); c.ellipse(0, -48, 13.5, 9, 0, Math.PI, Math.PI * 2); c.fill();
    c.fillRect(-13.5, -48, 27, 4);
    c.beginPath(); c.ellipse(-12, -47, 5.5, 5, 0, 0, 6.28); c.fill();
    c.strokeStyle = "#c9932f"; c.lineWidth = 1.2;
    for (let i = -8; i <= 8; i += 5) { c.beginPath(); c.moveTo(i, -55); c.lineTo(i + 3, -45); c.stroke(); }
  } else if (jenis === "mahkota") {
    c.fillStyle = "#f4b942"; c.strokeStyle = "#8a5a12"; c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(-12, -46); c.lineTo(-12, -58); c.lineTo(-6, -52); c.lineTo(0, -62); c.lineTo(6, -52); c.lineTo(12, -58); c.lineTo(12, -46); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = "#e5484d"; c.beginPath(); c.arc(0, -51, 2, 0, 6.28); c.fill();
    c.fillStyle = "#8fd3ff"; c.beginPath(); c.arc(-7, -49, 1.4, 0, 6.28); c.arc(7, -49, 1.4, 0, 6.28); c.fill();
  }
  c.restore();
}
// depan = false → lapisan belakang, true → lapisan depan (partikel di depan badan)
function gambarAura(c, e, jenis, time, depan) {
  c.save(); c.translate(e.x, e.y - (e.lompat || 0));
  const t0 = time + (e.x || 0) * 0.01;
  if (jenis === "kunang") {
    for (let i = 0; i < 6; i++) {
      const a = t0 * 0.9 + i * 1.05, r = 18 + (i % 3) * 5, y = -30 + Math.sin(t0 * 1.7 + i) * 16;
      if ((Math.sin(a) > 0) !== depan) continue;
      c.fillStyle = `rgba(250,240,140,${0.5 + 0.5 * Math.sin(t0 * 4 + i * 2)})`; c.shadowColor = "#f9f08a"; c.shadowBlur = 8;
      c.beginPath(); c.arc(Math.cos(a) * r, y, 1.8, 0, 6.28); c.fill();
    }
  } else if (jenis === "api" && !depan) {
    for (let i = 0; i < 7; i++) {
      const x = -14 + i * 4.7, h = 10 + Math.abs(Math.sin(t0 * 7 + i * 1.3)) * 12;
      const g = c.createLinearGradient(0, 0, 0, -h); g.addColorStop(0, "rgba(255,120,40,0.7)"); g.addColorStop(1, "rgba(255,220,90,0)");
      c.fillStyle = g; c.beginPath(); c.moveTo(x - 3, 0); c.quadraticCurveTo(x, -h * 1.2, x + 3, 0); c.fill();
    }
  } else if (jenis === "kabut" && !depan) {
    for (let i = 0; i < 4; i++) {
      c.fillStyle = `rgba(120,80,170,${0.16 + 0.06 * Math.sin(t0 * 2 + i)})`;
      c.beginPath(); c.ellipse(Math.sin(t0 * 0.8 + i * 1.6) * 10, -4 - i * 9, 20 - i * 2, 7, 0, 0, 6.28); c.fill();
    }
  } else if (jenis === "daun" && depan) {
    for (let i = 0; i < 4; i++) {
      const k = (t0 * 0.35 + i * 0.25) % 1, x = Math.sin(k * 9 + i * 2) * 16 + (i - 1.5) * 6, y = -64 + k * 64;
      c.save(); c.translate(x, y); c.rotate(k * 9 + i); c.globalAlpha = 1 - k * 0.6;
      c.fillStyle = i % 2 ? "#d9822b" : "#c9a23a"; c.beginPath(); c.ellipse(0, 0, 3.4, 1.7, 0, 0, 6.28); c.fill(); c.restore();
    }
  } else if (jenis === "bintang") {
    if (!depan) { c.strokeStyle = `rgba(244,185,66,${0.35 + 0.2 * Math.sin(t0 * 3)})`; c.lineWidth = 2; c.beginPath(); c.ellipse(0, 0, 20, 6, 0, 0, 6.28); c.stroke(); }
    else for (let i = 0; i < 4; i++) {
      const k = (t0 * 0.6 + i * 0.25) % 1, x = Math.cos(i * 1.7 + t0) * 16, y = -8 - k * 52, s = 2.4 * (1 - k);
      c.fillStyle = `rgba(255,230,150,${1 - k})`; c.beginPath(); c.moveTo(x, y - s * 2); c.lineTo(x + s * 0.6, y - s * 0.6); c.lineTo(x + s * 2, y); c.lineTo(x + s * 0.6, y + s * 0.6); c.lineTo(x, y + s * 2); c.lineTo(x - s * 0.6, y + s * 0.6); c.lineTo(x - s * 2, y); c.lineTo(x - s * 0.6, y - s * 0.6); c.fill();
    }
  }
  c.restore();
}
// gelar di atas nama hero
{
  const asli = drawPlayerTag;
  drawPlayerTag = function (px, py) {
    asli(px, py);
    const g = gelarAktif(); if (!g) return;
    ctx.font = "800 11px Nunito, sans-serif"; ctx.textAlign = "center"; ctx.lineWidth = 3; ctx.lineJoin = "round";
    ctx.strokeStyle = "rgba(10,6,20,0.85)"; ctx.strokeText(`« ${g} »`, px, py - 40);
    ctx.fillStyle = dataGaya().gelar === "pendukung" ? "#ffb38a" : "#f4d58a"; ctx.fillText(`« ${g} »`, px, py - 40);
  };
}

// ---------- Halaman Menu › Gameplay › Kosmetik ----------
let tabGaya = "baju";
{
  const v = document.createElement("div");
  v.className = "pview"; v.dataset.view = "gaya"; v.hidden = true;
  v.innerHTML = `<p class="eyebrow" id="gayaEyebrow"></p><h1 id="gayaJudul"></h1>
    <div class="gaya-atas"><canvas id="gayaPratinjau" width="200" height="200"></canvas>
      <div class="gaya-info"><p id="gayaKet"></p><div class="gaya-tab" id="gayaTab"></div></div></div>
    <div class="gaya-grid" id="gayaGrid"></div>
    <div class="menu"><button class="go alt back go-dinamis" type="button" data-go="gameplay" id="gayaKembali"></button></div>`;
  document.querySelector('#pausePanel .pview[data-view="capai"]').after(v);
  const b = document.createElement("button");
  b.className = "go alt go-dinamis"; b.type = "button"; b.dataset.go = "gaya"; b.id = "btnGayaMenu";
  document.querySelector('#pausePanel .pview[data-view="gameplay"] [data-go="debuff"]').before(b);
  PAUSE_BACK.gaya = "gameplay";
}
let gayaRaf = 0;
function isiGaya() {
  const G = dataGaya();
  $("btnGayaMenu").textContent = Lx(["Kosmetik & Gelar", "Cosmetics & Titles"]);
  $("gayaEyebrow").textContent = Lx(["Gameplay › Kosmetik", "Gameplay › Cosmetics"]);
  $("gayaJudul").innerHTML = Lx(["Kos<span>metik</span>", "Cosme<span>tics</span>"]);
  $("gayaKembali").textContent = t("h.kembali");
  $("gayaKet").innerHTML = Lx(["Hanya tampilan, tidak menambah kekuatan. Koinmu: ", "Looks only, no extra power. Your coins: "]) + `<b>${S.gold}</b>`;
  $("gayaTab").innerHTML = [...Object.entries(JENIS_GAYA), ["gelar", ["Gelar", "Title"]]].map(([k, n]) => `<button type="button" class="${k === tabGaya ? "pilih" : ""}" data-tab-gaya="${k}">${Lx(n)}</button>`).join("");
  let html = "";
  if (tabGaya === "gelar") {
    html += kartuGaya("", Lx(["Tanpa gelar", "No title"]), "", !G.gelar, true, "");
    for (const [id, g] of Object.entries(GELAR)) html += kartuGaya(id, Lx(g.nama), "", G.gelar === id, punyaGelar(id), ketSumber(g), null, "gelar");
  } else {
    html += kartuGaya("", Lx(["Bawaan hero", "Hero default"]), "", !G.pakai[tabGaya], true, "");
    for (const [id, k] of Object.entries(KOSMETIK)) if (k.jenis === tabGaya) html += kartuGaya(id, Lx(k.nama), k.warna, G.pakai[tabGaya] === id, punyaKosmetik(id), ketSumber(k), k.koin);
  }
  $("gayaGrid").innerHTML = html;
  $("pausePanel").classList.add("wide");
  cancelAnimationFrame(gayaRaf);
  const c = $("gayaPratinjau"), g = c.getContext("2d");
  const putar = (now) => {
    if (pauseView !== "gaya" || mode !== "pause") return;
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, 200, 200);
    g.fillStyle = "rgba(61,122,52,0.55)"; g.beginPath(); g.ellipse(100, 182, 60, 14, 0, 0, 6.28); g.fill();
    g.setTransform(2.1, 0, 0, 2.1, 100, 182);
    drawPerson(g, { x: 0, y: 0, face: Math.sin(now / 1400) * 0.6, run: now / 160, moving: false, swing: 0, inv: 0, flash: 0 }, lookPemain(), now / 1000, { preview: true });
    g.setTransform(1, 0, 0, 1, 0, 0);
    const gl = gelarAktif();
    if (gl) { g.font = "800 13px Nunito, sans-serif"; g.textAlign = "center"; g.fillStyle = "#f4d58a"; g.fillText(`« ${gl} »`, 100, 16); }
    gayaRaf = requestAnimationFrame(putar);
  };
  gayaRaf = requestAnimationFrame(putar);
}
function kartuGaya(id, nama, warna, dipakai, punya, ket, harga, jenis) {
  const bisaBeli = !punya && harga, cukup = bisaBeli && S.gold >= harga;
  const aksi = dipakai ? `<span class="gaya-status pakai">✓ ${Lx(["Dipakai", "Equipped"])}</span>`
    : punya ? `<button type="button" class="go kecil" data-pakai-gaya="${id}" data-jenis="${jenis || tabGaya}">${Lx(["Pakai", "Equip"])}</button>`
    : bisaBeli ? `<button type="button" class="go kecil ${cukup ? "" : "alt"}" data-beli-gaya="${id}" ${cukup ? "" : "disabled"}>🪙 ${harga}</button>`
    : `<span class="gaya-status kunci">🔒</span>`;
  const contoh = jenis === "gelar" ? `<span class="gaya-contoh gelar">«»</span>` : warna ? `<span class="gaya-contoh" style="background:${warna}"></span>` : id ? `<span class="gaya-contoh aura">✦</span>` : `<span class="gaya-contoh kosong">–</span>`;
  return `<div class="gaya-kartu${dipakai ? " dipakai" : ""}${punya ? "" : " terkunci"}">${contoh}<div><b>${nama}</b>${ket ? `<small>${ket}</small>` : ""}</div>${aksi}</div>`;
}
{
  const asli = showPauseView;
  showPauseView = function (view, silent) { asli(view, silent); if (view === "gaya") isiGaya(); if (view === "gameplay") $("btnGayaMenu").textContent = Lx(["Kosmetik & Gelar", "Cosmetics & Titles"]); };
}
$("pausePanel").addEventListener("click", (e) => {
  const tab = e.target.closest("[data-tab-gaya]");
  if (tab) { tabGaya = tab.dataset.tabGaya; sfx.click(); return isiGaya(); }
  const pakai = e.target.closest("[data-pakai-gaya]");
  if (pakai) {
    const id = pakai.dataset.pakaiGaya, G = dataGaya();
    if (pakai.dataset.jenis === "gelar") G.gelar = id || null; else G.pakai[pakai.dataset.jenis] = id || null;
    sfx.click(); saveSoon(); return isiGaya();
  }
  const beli = e.target.closest("[data-beli-gaya]");
  if (beli) {
    const id = beli.dataset.beliGaya, k = KOSMETIK[id];
    if (!k || S.gold < k.koin) return;
    S.gold -= k.koin; beriKosmetik(id); dataGaya().pakai[k.jenis] = id;
    sfx.coin(); toast(Lx([`${k.nama[0]} dibeli & dipakai!`, `${k.nama[1]} bought & equipped!`]), false);
    refreshHud(true); saveSoon(); isiGaya();
  }
});
