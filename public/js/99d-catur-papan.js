// =====================================================================
// CATUR LAGA — PAPAN, PILIH HERO BIDAK, ALUR PERMAINAN, TUTORIAL, HADIAH
// Pemain memilih putih atau hitam (bidaknya selalu di bawah; papan dibalik kalau hitam). Aturan: 99c-catur-aturan.js.
// Pilihan sebelum main: tingkat, warna, waktu (jam catur), duel hero on/off.
// Setiap memakan bidak → duel 20 detik antar-hero (99e-catur-duel.js):
//   penyerang menang = bidak termakan; penyerang kalah = penyerang hilang, yang diserang tetap.
// Sebelum main: pilih tingkat & hero untuk tiap jenis bidak (tersimpan).
// Keluar di tengah = partai selesai & harus diulang dari awal (tanpa hadiah).
// Hadiah: kemenangan PERTAMA di tiap tingkat (koin, Serpih Pusaka, jimat di tingkat Jago).
// =====================================================================
"use strict";

const JENIS_BIDAK = ["k", "q", "r", "b", "n", "p"];
const NAMA_BIDAK = { k: ["Raja", "King"], q: ["Menteri", "Queen"], r: ["Benteng", "Rook"], b: ["Gajah", "Bishop"], n: ["Kuda", "Knight"], p: ["Pion", "Pawn"] };
const SETUP_AWAL = { k: "pendobrak", q: "penyihir", r: "pemanah", b: "tabib", n: "jawara", p: "pendekar" };
const SETUP_WOWO = { k: "pendobrak", q: "penyihir", r: "pemanah", b: "dalang", n: "jawara", p: "pendekar" };
const HADIAH_CATUR = { santai: { gold: 150, serpih: 3 }, sedang: { gold: 300, serpih: 6 }, jago: { gold: 500, serpih: 10, jimat: "bidakEmas" } };
const namaBidak = (t) => Lx(NAMA_BIDAK[t]);
const WAKTU_CATUR = [180, 300, 600, 1200, 7200, 0];   // detik tiap pemain; 0 = tanpa waktu
const teksWaktuCatur = (d) => (!d ? t("catur.tanpaWaktu") : d >= 3600 ? t("catur.jam2") : t("catur.menit", { n: d / 60 }));
const giliranPemain = () => catur && catur.s.putih === catur.pemainPutih;

// jimat hadiah tingkat Jago
JIMAT.bidakEmas = { name: "Bidak Emas Pak Wowo", rarity: "langka", efek: { kritis: 0.06, cd: 0.08 }, sumber: "catur.sumberJimat", en: { name: "Pak Wowo's Golden Pawn" } };
function teksHadiahCatur(k) {
  const h = HADIAH_CATUR[k];
  return [t("cerita.hKoin", { n: h.gold }), t("catur.serpih", { n: h.serpih }), h.jimat && namaJimat(h.jimat)].filter(Boolean).join(" · ");
}
const dataCatur = () => { const D = dataEvent(); D.catur = Object.assign({ setup: { ...SETUP_AWAL }, menang: {}, tutor: false, main: 0, tingkat: "santai", warna: "putih", waktu: 0, duel: true }, D.catur || {}); return D.catur; };

// ---------- Gambar bidak (SVG untuk papan, kanvas untuk cuplikan) ----------
const JALUR_BIDAK = {
  p: "M37 30 A13 13 0 1 1 63 30 A13 13 0 1 1 37 30 Z M37 47 Q50 39 63 47 L67 78 H33 Z M24 90 H76 V79 H24 Z",
  r: "M28 16 H38 V25 H45 V16 H55 V25 H62 V16 H72 V36 L65 42 V77 H35 V42 L28 36 Z M22 90 H78 V78 H22 Z",
  n: "M32 78 C30 60 40 53 47 47 C40 48 33 52 29 47 C26 41 35 30 45 24 L50 12 L56 23 C69 28 74 46 70 78 Z M22 90 H78 V78 H22 Z",
  b: "M44 13 A6 6 0 1 1 56 13 A6 6 0 1 1 44 13 Z M50 20 C65 32 65 50 57 58 H43 C35 50 35 32 50 20 Z M40 60 H60 L64 77 H36 Z M24 90 H76 V78 H24 Z",
  q: "M18 28 L32 56 L37 22 L50 50 L63 22 L68 56 L82 28 L73 76 H27 Z M24 90 H76 V78 H24 Z",
  k: "M46 6 H54 V15 H62 V22 H54 V30 H46 V22 H38 V15 H46 Z M50 30 C69 30 75 47 66 59 L68 76 H32 L34 59 C25 47 31 30 50 30 Z M24 90 H76 V78 H24 Z",
};
const svgBidak = (t, putih) => `<svg viewBox="0 0 100 100" class="bidak ${putih ? "putih" : "hitam"}" aria-hidden="true"><path d="${JALUR_BIDAK[t]}"/></svg>`;
function gambarBidakKanvas(c, t, putih, x, y, uk) {
  c.save(); c.translate(x - uk / 2, y - uk / 2); c.scale(uk / 100, uk / 100);
  const p = new Path2D(JALUR_BIDAK[t]);
  c.fillStyle = putih ? "#f5efe2" : "#2b2238"; c.fill(p);
  c.lineWidth = 4; c.strokeStyle = putih ? "#2b2238" : "#e9d3a9"; c.stroke(p);
  c.restore();
}

// ---------- Percakapan Pak Wowo ----------
function bicaraWowo(npc) {
  const C = dataCatur();
  const baris = !C.sapa ? [
    ["wowo", ["Hoo, pendekar muda yang mengusir kabut dari Wanasari! Akhirnya kau mampir juga.", "Ho, the young hero who drove the mist from Wanasari! You finally stopped by."]],
    ["wowo", ["Sejak desa aman, aku bosan. Tak ada yang berani melawanku main catur.", "Since the village became safe, I've been bored. Nobody dares play chess with me."]],
    ["hero", ["Catur? Aku lebih terbiasa memegang senjata, Pak.", "Chess? I'm more used to holding a weapon, sir."]],
    ["wowo", ["Justru itu! Ini Catur Laga: setiap bidak dijaga seorang hero. Kalau mau memakan, harus menang bertarung dulu!", "Exactly! This is Battle Chess: every piece is guarded by a hero. To capture, you must win a fight first!"]],
    ["wowo", ["Kalah bertarung, bidakmu sendiri yang tumbang. Jadi pikirkan langkahmu baik-baik.", "Lose the fight, and your own piece falls. So think your moves through."]],
    ["wowo", ["Ayo, pilih pasukanmu. Jangan khawatir, kuajari dulu caranya.", "Come, choose your army. Don't worry, I'll teach you first."]],
  ] : [
    ["wowo", C.main > 0 && Object.keys(C.menang).length ? ["Mau balas dendam, atau mau kukalahkan lagi? Hahaha!", "Want a rematch, or shall I beat you again? Hahaha!"] : ["Papan sudah siap. Ayo kita mulai!", "The board is ready. Let's begin!"]],
  ];
  closeDialog && mode === "dialog" && closeDialog();
  narasi(baris.map(([w, p]) => [w, Lx(p)]), () => { C.sapa = true; saveSoon(); bukaCatur(); });
}

// ---------- Layar catur ----------
let catur = null;   // { s, tingkat, pilih, langkahPilih, terakhir, sibuk, selesai, log }
function bukaCatur() {
  const C = dataCatur();
  mode = "catur"; showUI(); $("hud").hidden = true;
  $("caturBox").hidden = false;
  tampilLayarCatur(C.tutor ? "setup" : "tutor");
  if (!C.tutor) { tutorHal = 0; isiTutor(); }
  isiSetup();
}
function tutupCatur() {
  catur = null;
  $("caturBox").hidden = true;
  mode = "play"; showUI(); $("hud").hidden = false; refreshHud(true); save();
}
function tampilLayarCatur(nama) {
  for (const el of document.querySelectorAll("#caturBox .ct-layar")) el.hidden = el.dataset.layar !== nama;
  $("caturBox").dataset.layar = nama;
}

// ---------- Pilih tingkat & hero bidak ----------
const DAFTAR_HERO = () => Object.keys(CLASSES);
function isiSetup() {
  const C = dataCatur();
  $("ctTingkat").innerHTML = ["santai", "sedang", "jago"].map((k) => `<button type="button" class="kes-btn kes-${k === "santai" ? "santai" : k === "sedang" ? "normal" : "sulit"}" data-ct-tingkat="${k}" aria-pressed="${C.tingkat === k}"><b>${t("catur.t." + k)}${C.menang[k] ? " ✓" : ""}</b><small>${teksHadiahCatur(k)}</small></button>`).join("");
  const chip = (attr, nilai, aktif, isi) => `<button type="button" class="ct-chip" data-${attr}="${nilai}" aria-pressed="${aktif}">${isi}</button>`;
  $("ctWarna").innerHTML = ["putih", "hitam"].map((w) => chip("ct-warna", w, C.warna === w, `${svgBidak("k", w === "putih")}<span>${t("catur." + w)}</span>`)).join("");
  $("ctWaktu").innerHTML = WAKTU_CATUR.map((d) => chip("ct-waktu", d, C.waktu === d, teksWaktuCatur(d))).join("");
  $("ctDuel").innerHTML = [[true, "duelYa"], [false, "duelTidak"]].map(([v, k]) => chip("ct-duel", v ? 1 : 0, C.duel === v, `<span>${t("catur." + k)}<small>${t("catur." + k + "Ket")}</small></span>`)).join("");
  $("ctPasukan").classList.toggle("mati", !C.duel);
  $("ctPasukanMati").hidden = C.duel; $("ctPasukanMati").textContent = t("catur.pasukanMati");
  const putihku = C.warna !== "hitam";
  $("ctPasukan").innerHTML = JENIS_BIDAK.map((tp) => {
    const cls = C.setup[tp];
    return `<div class="ct-baris"><span class="ct-ikon">${svgBidak(tp, putihku)}</span><b>${namaBidak(tp)}</b>
      <button type="button" class="vbtn" data-ct-ganti="${tp}:-1" aria-label="◀">◀</button>
      <canvas class="ct-potret" data-cls="${cls}" width="64" height="72"></canvas>
      <span class="ct-hero">${CLASSES[cls].name}<small>${CLASSES[cls].role}</small></span>
      <button type="button" class="vbtn" data-ct-ganti="${tp}:1" aria-label="▶">▶</button></div>`;
  }).join("");
  for (const cv of document.querySelectorAll("#ctPasukan .ct-potret")) gambarPotretHero(cv, cv.dataset.cls, true);
}
function gambarPotretHero(cv, cls, putih) {
  const c = cv.getContext("2d"), C = CLASSES[cls];
  c.clearRect(0, 0, cv.width, cv.height);
  c.save(); c.translate(cv.width / 2, cv.height - 6); c.scale(1.05, 1.05);
  drawPerson(c, { x: 0, y: 0, face: 0.3, run: 0, moving: false, swing: 0, inv: 0, flash: 0 }, lookHeroCatur(cls, putih), 1, { preview: true });
  c.restore();
}
// rupa hero di catur: putih = warna asli; hitam (Pak Wowo) = baju gelap & ikat merah
const lookHeroCatur = (cls, putih) => { const C = CLASSES[cls]; return putih ? { color: C.color, accent: C.accent, weapon: C.weapon, hair: C.hair, hat: C.hat } : { color: "#2b2238", accent: "#b03a2e", weapon: C.weapon, hair: "#120d18", hat: C.hat ? "#120d18" : undefined }; };
$("ctTingkat").addEventListener("click", (e) => { const b = e.target.closest("[data-ct-tingkat]"); if (!b) return; dataCatur().tingkat = b.dataset.ctTingkat; saveSoon(); sfx.click(); isiSetup(); });
$("ctWarna").parentElement.addEventListener("click", (e) => {
  const C = dataCatur(), w = e.target.closest("[data-ct-warna]"), d = e.target.closest("[data-ct-waktu]"), u = e.target.closest("[data-ct-duel]");
  if (w) C.warna = w.dataset.ctWarna; else if (d) C.waktu = +d.dataset.ctWaktu; else if (u) C.duel = u.dataset.ctDuel === "1"; else return;
  saveSoon(); sfx.click(); isiSetup();
});
$("ctPasukan").addEventListener("click", (e) => {
  const b = e.target.closest("[data-ct-ganti]"); if (!b) return;
  const [tp, arah] = b.dataset.ctGanti.split(":"), L = DAFTAR_HERO(), C = dataCatur();
  C.setup[tp] = L[(L.indexOf(C.setup[tp]) + +arah + L.length) % L.length]; saveSoon(); sfx.click(); isiSetup();
});
$("btnCtMulai").addEventListener("click", () => mulaiPartai());
$("btnCtBatal").addEventListener("click", () => { sfx.click(); tutupCatur(); });

// ---------- Partai ----------
function mulaiPartai() {
  const C = dataCatur();
  catur = {
    s: caturAwal(), tingkat: C.tingkat, pemainPutih: C.warna !== "hitam", pakaiDuel: C.duel !== false,
    jam: C.waktu ? { w: C.waktu, b: C.waktu } : null,
    pilih: -1, langkahPilih: [], terakhir: null, sibuk: false, selesai: false, log: [], dimakan: { putih: [], hitam: [] },
  };
  C.main = (C.main || 0) + 1; saveSoon();
  tampilLayarCatur("papan"); jamT = performance.now(); tampilJam();
  if (!C.tipLangkah) { C.tipLangkah = true; tipCatur(t("catur.tipLangkah")); }
  setelahLangkah();   // pemain hitam → Pak Wowo (putih) jalan duluan
}
function gambarPapan() {
  if (!catur) return;
  const s = catur.s, skak = kenaSkak(s, s.putih) ? posisiRaja(s, s.putih) : -1;
  const tujuan = new Map(catur.langkahPilih.map((m) => [m.ke, m]));
  let html = "";
  for (let v = 0; v < 64; v++) {
    const i = catur.pemainPutih ? v : 63 - v;   // bidak pemain selalu di bawah
    const r = i >> 3, c = i & 7, x = s.b[i], gelap = (r + c) % 2 === 1;
    const kls = ["ct-kotak", gelap ? "gelap" : "terang", i === catur.pilih ? "pilih" : "", catur.terakhir && (i === catur.terakhir.dari || i === catur.terakhir.ke) ? "akhir" : "", i === skak ? "skak" : "", tujuan.has(i) ? (tujuan.get(i).makan ? "bisa-makan" : "bisa") : ""].join(" ");
    html += `<button type="button" class="${kls}" data-ct="${i}">${x ? svgBidak(x.t, x.w) : ""}</button>`;
  }
  $("ctPapan").innerHTML = html;
  const atas = catur.pemainPutih ? "hitam" : "putih", bawah = catur.pemainPutih ? "putih" : "hitam";
  $("ctInfo").innerHTML = `<b>${t("catur.t." + catur.tingkat)}</b> · ${t("catur.langkahKe", { n: Math.floor(s.langkah / 2) + 1 })}
    <div class="ct-dimakan">${catur.dimakan[atas].map((tp) => svgBidak(tp, atas === "putih")).join("")}</div>
    <div class="ct-dimakan">${catur.dimakan[bawah].map((tp) => svgBidak(tp, bawah === "putih")).join("")}</div>
    <div class="ct-log">${catur.log.slice(-4).map((l) => `<div>${l}</div>`).join("")}</div>`;
}
const pesanCatur = (teks) => { $("ctPesan").textContent = teks; };

// ---------- Jam catur ----------
// berjalan untuk sisi yang sedang melangkah; berhenti saat duel, tutorial, atau konfirmasi keluar
let jamT = 0;
const formatJam = (d) => { d = Math.ceil(Math.max(0, d)); const j = Math.floor(d / 3600), m = Math.floor((d % 3600) / 60), dt = String(d % 60).padStart(2, "0"); return j ? `${j}:${String(m).padStart(2, "0")}:${dt}` : `${m}:${dt}`; };
function tampilJam() {
  const el = $("ctJam");
  el.hidden = !catur || !catur.jam; if (el.hidden) return;
  const baris = (putih, nama) => {
    const sisa = catur.jam[putih ? "w" : "b"], aktif = !catur.selesai && catur.s.putih === putih;
    return `<div class="${aktif ? "aktif" : ""} ${sisa < 30 ? "tipis" : ""}"><span>${putih ? "⚪" : "⚫"} ${nama}</span><b>${formatJam(sisa)}</b></div>`;
  };
  el.innerHTML = baris(!catur.pemainPutih, "Pak Wowo") + baris(catur.pemainPutih, t("catur.kamu"));
}
setInterval(() => {
  const now = performance.now(), dt = Math.min(1, (now - jamT) / 1000); jamT = now;
  if (!catur || !catur.jam || catur.selesai || mode !== "catur" || $("caturBox").dataset.layar !== "papan" || !$("ctKonfirm").hidden) return;
  const sisi = catur.s.putih ? "w" : "b";
  catur.jam[sisi] -= dt;
  if (catur.jam[sisi] <= 0) { catur.jam[sisi] = 0; tampilJam(); return akhirPartai((sisi === "w") === catur.pemainPutih ? "kalah" : "menang", t("catur.waktuHabis")); }
  tampilJam();
}, 200);
let tipT = 0;
function tipCatur(teks) { const el = $("ctTip"); el.textContent = teks; el.hidden = false; clearTimeout(tipT); tipT = setTimeout(() => { el.hidden = true; }, 6000); }

$("ctPapan").addEventListener("click", (e) => {
  const b = e.target.closest("[data-ct]"); if (!b || !catur || catur.sibuk || catur.selesai || !giliranPemain()) return;
  const i = +b.dataset.ct, s = catur.s, x = s.b[i];
  const m = catur.langkahPilih.find((l) => l.ke === i);
  if (m) { catur.pilih = -1; catur.langkahPilih = []; return lakukanLangkah(m); }
  if (x && x.w === catur.pemainPutih) {
    catur.pilih = i; catur.langkahPilih = langkahSah(s).filter((l) => l.dari === i);
    if (!catur.langkahPilih.length) pesanCatur(t("catur.takBisa"));
    sfx.click();
  } else { catur.pilih = -1; catur.langkahPilih = []; }
  gambarPapan();
});

// menjalankan satu langkah (pemain atau komputer); memakan → duel
function lakukanLangkah(m) {
  const s = catur.s, penyerang = s.b[m.dari], putih = penyerang.w;
  catur.terakhir = m;
  if (!m.makan) {
    catur.s = jalankanLangkah(s, m); catur.log.push(`${putih ? "⚪" : "⚫"} ${namaBidak(penyerang.t)} → ${kotakNama(m.ke)}`);
    sfx.click(); return setelahLangkah();
  }
  const iKorban = m.ep ? m.ke + (putih ? 8 : -8) : m.ke, korban = s.b[iKorban];
  if (!catur.pakaiDuel) {   // catur biasa: langsung memakan
    catur.s = jalankanLangkah(s, m);
    (korban.w ? catur.dimakan.putih : catur.dimakan.hitam).push(korban.t);
    catur.log.push(`${putih ? "⚪" : "⚫"} ${namaBidak(penyerang.t)} ${t("catur.memakan")} ${namaBidak(korban.t)}`);
    sfx.hit ? sfx.hit() : sfx.click(); return setelahLangkah();
  }
  catur.sibuk = true; gambarPapan();
  const C = dataCatur();
  const pp = catur.pemainPutih, milikPemain = (p) => p.w === pp;
  const cls = (p) => (milikPemain(p) ? C.setup : SETUP_WOWO)[p.t];
  if (!C.tipDuel) { C.tipDuel = true; saveSoon(); }
  // di duel, "putih" = dikendalikan pemain; warnaPutih = warna bidak sebenarnya
  setTimeout(() => { if (!catur || catur.selesai) return; mulaiDuelCatur({
    penyerang: { cls: cls(penyerang), t: penyerang.t, putih: milikPemain(penyerang) }, bertahan: { cls: cls(korban), t: korban.t, putih: milikPemain(korban) },
    tingkat: catur.tingkat, takhta: korban.t === "k", tutor: !C.tipDuelKontrol, pemainPutih: pp,
  }, (penyerangMenang) => {
    C.tipDuelKontrol = true;
    if (!catur || catur.selesai) return;
    const ikon = putih ? "⚪" : "⚫";
    if (penyerangMenang) {
      catur.s = jalankanLangkah(catur.s, m);
      (korban.w ? catur.dimakan.putih : catur.dimakan.hitam).push(korban.t);
      catur.log.push(`${ikon} ${namaBidak(penyerang.t)} ${t("catur.memakan")} ${namaBidak(korban.t)}`);
      if (korban.t === "k") return akhirPartai(putih === pp ? "menang" : "kalah", t("catur.takhtaJatuh"));
    } else {
      catur.s = langkahGagal(catur.s, m);
      (penyerang.w ? catur.dimakan.putih : catur.dimakan.hitam).push(penyerang.t);
      catur.log.push(`${ikon} ${namaBidak(penyerang.t)} ${t("catur.gagal")} ${namaBidak(korban.t)}`);
      if (penyerang.t === "k") return akhirPartai(putih === pp ? "kalah" : "menang", t("catur.rajaTumbang"));
    }
    catur.sibuk = false; setelahLangkah();
  }); }, 350);
}
const kotakNama = (i) => "abcdefgh"[i & 7] + (8 - (i >> 3));
function setelahLangkah() {
  if (!catur || catur.selesai) return;
  const s = catur.s, k = keadaanCatur(s);
  const giliranku = giliranPemain();
  if (k === "skakmat") return akhirPartai(giliranku ? "kalah" : "menang", t("catur.skakmat"));
  if (k === "remis") return akhirPartai("remis", t("catur.remisTeks"));
  if (kenaSkak(s, s.putih)) { pesanCatur(giliranku ? t("catur.kamuSkak") : t("catur.wowoSkak")); sfx.zap ? sfx.zap() : sfx.click(); if (!dataCatur().tipSkak) { dataCatur().tipSkak = true; tipCatur(t("catur.tipSkak")); } }
  else pesanCatur(giliranku ? t("catur.giliranmu") : t("catur.wowoBerpikir"));
  gambarPapan(); tampilJam();
  if (!giliranku) {
    catur.sibuk = true;
    setTimeout(() => {
      if (!catur || catur.selesai) return;
      const m = langkahKomputer(catur.s, catur.tingkat);
      catur.sibuk = false;
      if (!m) return setelahLangkah();
      catur.pilih = m.dari; gambarPapan();
      setTimeout(() => { if (catur) { catur.pilih = -1; lakukanLangkah(m); } }, 450);
    }, 500);
  }
}
function akhirPartai(hasil, alasan) {
  if (!catur || catur.selesai) return;
  catur.selesai = true; gambarPapan(); tampilJam();
  const C = dataCatur(), tg = catur.tingkat;
  let hadiahTeks = "";
  if (hasil === "menang" && !C.menang[tg]) {
    C.menang[tg] = true;
    const h = HADIAH_CATUR[tg];
    S.gold += h.gold; if (typeof beriSerpih === "function") beriSerpih(h.serpih); else S.jimat.serpih += h.serpih;
    if (h.jimat && typeof beriJimat === "function") setTimeout(() => beriJimat(h.jimat), 400);
    hadiahTeks = t("catur.hadiahDapat", { hadiah: teksHadiahCatur(tg) });
    sfx.quest();
  } else if (hasil === "menang") { hadiahTeks = t("catur.sudahPernah"); sfx.level(); }
  else sfx.click();
  saveSoon();
  $("ctHasilJudul").textContent = t("catur.hasil." + hasil);
  $("ctHasilTeks").textContent = `${alasan} ${hadiahTeks}`.trim();
  $("ctHasilWowo").textContent = Lx(hasil === "menang" ? ["Pak Wowo: \"Wah, kau memang berbakat! Lain kali aku tidak akan mengalah.\"", "Pak Wowo: \"Wow, you've got talent! Next time I won't go easy.\""] : hasil === "kalah" ? ["Pak Wowo: \"Hahaha! Latihan lagi, Nak. Aku menunggumu.\"", "Pak Wowo: \"Hahaha! Practice more, kid. I'll be waiting.\""] : ["Pak Wowo: \"Seri! Pertarungan yang sengit.\"", "Pak Wowo: \"A draw! What a fierce battle.\""]);
  setTimeout(() => tampilLayarCatur("hasil"), 700);
}
$("btnCtLagi").addEventListener("click", () => { sfx.click(); tampilLayarCatur("setup"); isiSetup(); });
$("btnCtSelesai").addEventListener("click", () => { sfx.click(); tutupCatur(); });

// keluar di tengah partai → dianggap selesai, harus mulai lagi dari awal
function tanyaKeluarCatur() { if (!catur || catur.selesai) return tutupCatur(); $("ctKonfirm").hidden = false; sfx.click(); }
$("btnCtKeluar").addEventListener("click", tanyaKeluarCatur);
$("btnCtKeluarYa").addEventListener("click", () => { $("ctKonfirm").hidden = true; catur.selesai = true; toast(t("catur.keluarToast"), false); tutupCatur(); });
$("btnCtKeluarTidak").addEventListener("click", () => { $("ctKonfirm").hidden = true; sfx.click(); });
addEventListener("keydown", (e) => {
  if (mode !== "catur" || e.key !== "Escape") return;
  e.stopImmediatePropagation();
  if (!$("ctKonfirm").hidden) $("ctKonfirm").hidden = true;
  else if ($("caturBox").dataset.layar === "papan") tanyaKeluarCatur();
  else if ($("caturBox").dataset.layar === "tutor") tutupTutor();
  else tutupCatur();
}, true);

// ---------- Tutorial ----------
let tutorHal = 0;
const TUTOR_CATUR = [
  { judul: ["Selamat datang di Catur Laga", "Welcome to Battle Chess"], isi: ["Aturannya seperti catur biasa: skakmat raja Pak Wowo untuk menang. Bedanya, setiap bidak dijaga seorang hero, dan setiap kali bidak memakan, kedua hero BERTARUNG.", "It plays like regular chess: checkmate Pak Wowo's king to win. The twist: every piece is guarded by a hero, and every capture becomes a FIGHT between them."], gambar: "papan" },
  { judul: ["1. Pilih pasukanmu", "1. Choose your army"], isi: ["Sebelum main, pilih hero untuk tiap jenis bidak dengan tombol ◀ ▶. Bidak bernilai tinggi (Menteri, Benteng) punya nyawa & serangan lebih besar saat bertarung. Kamu juga bisa memilih warna (putih jalan duluan), jam catur (3 menit sampai 2 jam, atau tanpa waktu; waktu habis = kalah), dan mematikan duel untuk catur biasa. Pilihanmu tersimpan.", "Before playing, pick a hero for each piece type with ◀ ▶. High-value pieces (Queen, Rook) have more health & attack in fights. You can also pick your color (white moves first), a chess clock (3 minutes to 2 hours, or none; running out = loss), and turn duels off for classic chess. Your choices are saved."], gambar: "pasukan" },
  { judul: ["2. Menggerakkan bidak", "2. Moving pieces"], isi: ["Ketuk bidakmu: kotak tujuan yang boleh akan bertanda titik, dan lingkaran merah berarti bisa memakan. Ketuk tujuannya untuk melangkah. Promosi pion otomatis menjadi Menteri.", "Tap one of your pieces: legal squares show a dot, and a red ring means you can capture. Tap the square to move. Pawns promote to a Queen automatically."], gambar: "langkah" },
  { judul: ["3. Memakan = DUEL", "3. Capturing = DUEL"], isi: ["Saat memakan, kedua hero bertarung 20 detik. Menang → bidak lawan termakan. KALAH → bidak penyerangmu yang hilang, bidak lawan tetap di tempat, lalu giliran berganti. Saat Pak Wowo memakan bidakmu, kamu bertarung mempertahankannya!", "When capturing, both heroes fight for 20 seconds. Win → the enemy piece is taken. LOSE → your attacking piece is removed, the enemy piece stays, and the turn passes. When Pak Wowo captures your piece, you fight to defend it!"], gambar: "duel" },
  { judul: ["4. Kontrol duel", "4. Duel controls"], isi: ["Sama seperti di petualangan: gerak (panah / joystick), Serang (D / tombol Serang), Jurus (S / tombol Jurus), Hindar (A / tombol Hindar). Kalau waktu habis, yang sisa nyawanya (persen) lebih banyak yang menang; seri = yang bertahan menang.", "Just like in the adventure: move (arrows / joystick), Attack (D / Attack button), Skill (S / Skill button), Dodge (A / Dodge button). If time runs out, whoever has more health left (percent) wins; a tie goes to the defender."], gambar: "kontrol" },
  { judul: ["5. Skak, skakmat & Duel Takhta", "5. Check, checkmate & Throne Duel"], isi: ["Raja yang diskak harus diselamatkan. Skakmat = menang. Karena penyerang bisa kalah duel, kadang raja tetap terancam: menyerang raja memicu DUEL TAKHTA — menangkan untuk langsung memenangkan permainan!", "A king in check must be saved. Checkmate = victory. Since attackers can lose duels, a king may stay exposed: attacking it triggers a THRONE DUEL — win it to win the game instantly!"], gambar: "raja" },
  { judul: ["6. Hadiah & keluar", "6. Rewards & quitting"], isi: ["Kemenangan pertama di tiap tingkat memberi hadiah (Jago: jimat Bidak Emas!). Keluar di tengah partai = partai selesai dan harus diulang dari awal. Siap? Pilih pasukanmu!", "Your first win at each level gives a reward (Hard: the Golden Pawn charm!). Quitting mid-game ends the match and you'll have to start over. Ready? Choose your army!"], gambar: "hadiah" },
];
function isiTutor() {
  const h = TUTOR_CATUR[tutorHal];
  $("ctTutorJudul").textContent = Lx(h.judul);
  $("ctTutorIsi").textContent = Lx(h.isi);
  $("ctTutorHal").textContent = `${tutorHal + 1} / ${TUTOR_CATUR.length}`;
  $("btnCtTutorMundur").disabled = tutorHal === 0;
  $("btnCtTutorMaju").textContent = tutorHal === TUTOR_CATUR.length - 1 ? t("catur.tutorSelesai") : t("catur.tutorLanjut");
  gambarTutor(h.gambar);
}
function gambarTutor(jenis) {
  const cv = $("ctTutorGambar"), c = cv.getContext("2d"); c.clearRect(0, 0, cv.width, cv.height);
  const uk = 30, ox = (cv.width - uk * 6) / 2, oy = 10;
  const papan = (n = 6) => { for (let r = 0; r < 4; r++) for (let k = 0; k < n; k++) { c.fillStyle = (r + k) % 2 ? "#8b5e3c" : "#e9d3a9"; c.fillRect(ox + k * uk, oy + r * uk, uk, uk); } };
  if (jenis === "papan" || jenis === "raja") { papan(); gambarBidakKanvas(c, "k", false, ox + 3.5 * uk, oy + 0.5 * uk, uk * 0.9); gambarBidakKanvas(c, "q", true, ox + 3.5 * uk, oy + 2.5 * uk, uk * 0.9); gambarBidakKanvas(c, "r", true, ox + 0.5 * uk, oy + 0.5 * uk, uk * 0.9); if (jenis === "raja") { c.strokeStyle = "#e5484d"; c.lineWidth = 3; c.strokeRect(ox + 3 * uk, oy, uk, uk); } }
  else if (jenis === "langkah") { papan(); gambarBidakKanvas(c, "n", true, ox + 1.5 * uk, oy + 3.5 * uk, uk * 0.9); for (const [k, r] of [[0, 1], [2, 1], [3, 2]]) { c.fillStyle = "rgba(43,34,56,0.45)"; c.beginPath(); c.arc(ox + (k + 0.5) * uk, oy + (r + 0.5) * uk, 5, 0, 6.28); c.fill(); } gambarBidakKanvas(c, "p", false, ox + 3.5 * uk, oy + 2.5 * uk, uk * 0.9); c.strokeStyle = "#e5484d"; c.lineWidth = 3; c.beginPath(); c.arc(ox + 3.5 * uk, oy + 2.5 * uk, uk * 0.45, 0, 6.28); c.stroke(); }
  else {
    const kiri = CLASSES[dataCatur().setup.n] ? dataCatur().setup.n : "jawara";
    const k1 = jenis === "pasukan" ? ["pendekar", "penyihir", "pendobrak"] : [kiri];
    k1.forEach((cls, i) => { const x = jenis === "pasukan" ? cv.width / 2 + (i - 1) * 70 : cv.width / 2 - 60; c.save(); c.translate(x, 112); c.scale(1.2, 1.2); drawPerson(c, { x: 0, y: 0, face: 0.2, run: 0, moving: false, swing: 0, inv: 0, flash: 0 }, lookHeroCatur(cls, true), 1, { preview: true }); c.restore(); });
    if (jenis !== "pasukan") { c.save(); c.translate(cv.width / 2 + 60, 112); c.scale(1.2, 1.2); drawPerson(c, { x: 0, y: 0, face: Math.PI - 0.2, run: 0, moving: false, swing: 0, inv: 0, flash: 0 }, lookHeroCatur("penyihir", false), 1, { preview: true }); c.restore();
      c.fillStyle = "#f4b942"; c.font = "700 28px Teko, sans-serif"; c.textAlign = "center"; c.fillText(jenis === "hadiah" ? "★" : "VS", cv.width / 2, 70); }
  }
}
$("btnCtTutorMaju").addEventListener("click", () => { sfx.click(); if (tutorHal < TUTOR_CATUR.length - 1) { tutorHal++; isiTutor(); } else tutupTutor(); });
$("btnCtTutorMundur").addEventListener("click", () => { sfx.click(); if (tutorHal > 0) { tutorHal--; isiTutor(); } });
$("btnCtTutorLewati").addEventListener("click", () => { sfx.click(); tutupTutor(); });
function tutupTutor() { const C = dataCatur(); C.tutor = true; saveSoon(); tampilLayarCatur(catur && !catur.selesai ? "papan" : "setup"); isiSetup(); }
function bukaTutorCatur() { tutorHal = 0; isiTutor(); tampilLayarCatur("tutor"); }
$("btnCtCara").addEventListener("click", () => { sfx.click(); bukaTutorCatur(); });
$("btnCtCara2").addEventListener("click", () => { sfx.click(); bukaTutorCatur(); });
