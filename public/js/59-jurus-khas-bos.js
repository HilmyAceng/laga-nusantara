// =====================================================================
// JURUS KHAS BOS
// Setiap bos (selain Naga Kencana yang sudah punya 3 fase sendiri, 36-naga.js)
// punya 1-2 jurus khas yang dipakai bergantian tiap beberapa detik. Selama
// jurus khas berjalan, pola biasa bos berhenti. Semua jurus diberi tanda yang
// jelas — kalah sekali, pelajari polanya, lalu coba lagi.
//   Genderuwo       : Lempar Batu (3 batu mengejar posisimu)
//   Dwarapala       : Gada Berputar (cincin hantaman makin lebar — menjauh!)
//   Buaya Putih     : Gulungan Maut (menyelam, menyembul di bawahmu 2 kali)
//   Raja Banaspati  : Pusaran Api (bola api berputar — cari celahnya)
//   Siluman Ular    : Kolam Racun · Tatapan Batu (BALIKKAN BADAN, jangan menatapnya!)
//   Panglima Karang : Ombak Pasang (gelombang menyapu arena, lewat celahnya)
//   Kelabang        : Terowongan (menggali, muncul di bawahmu 3 kali, berdarah)
//   Raja Jerangkong : Tombak Tulang (8 garis tulang memancar, lalu berputar)
//   Gurita Raksasa  : Tinta Pekat (pandangan gelap) · Tentakel (sabetan dari tepi)
//   Rajawali Petir  : Badai Petir (6 sambaran mengejar) · Sambar (menukik lurus)
//   Penjaga Menara  : Lonceng Kala (satu dari empat penjuru aman — lihat yang hijau)
//   Prabu Kalamurka : Cermin Bayang (3 bayangan menerjang bergantian)
// Jeda antar-jurus di KHAS_JEDA; di Cermin Gaib tingkat 5+ lebih sering.
// =====================================================================
"use strict";

WARNA_BAHAYA.tulang = "#e9e2c8";
WARNA_BAHAYA.tinta = "#3a2a55";

// ---------- Bahaya tambahan: kolam beracun & gelombang bergerak ----------
let kolam = [];      // { x, y, r, t, dur, tick, dmg, deb }
let ombak = [];      // { x, y, dx, dy, panjang, celah, lebarCelah, speed, life, hit, dmg }

function updateBahayaKhas(dt) {
  for (const k of kolam) {
    k.t += dt; k.tick -= dt;
    if (k.tick <= 0) { k.tick = 0.5; if (!P.dead && Math.hypot(P.x - k.x, (P.y - k.y) / 0.62) < k.r) hurtPlayer(k.dmg, 0, k.deb, { dari: k.dari }); }
  }
  kolam = kolam.filter((k) => k.t < k.dur);
  for (const o of ombak) {
    o.x += o.dx * o.speed * dt; o.y += o.dy * o.speed * dt; o.life -= dt;
    if (o.hit || P.dead) continue;
    // jarak pemain ke garis ombak (tegak lurus arah gerak) & posisi sepanjang garis
    const rx = P.x - o.x, ry = P.y - o.y, maju = rx * o.dx + ry * o.dy, samping = -rx * o.dy + ry * o.dx;
    if (Math.abs(maju) < 22 && Math.abs(samping) < o.panjang / 2 && Math.abs(samping - o.celah) > o.lebarCelah / 2) {
      o.hit = true; hurtPlayer(o.dmg, Math.atan2(o.dy, o.dx), o.deb, { dari: o.dari });
    }
  }
  ombak = ombak.filter((o) => o.life > 0);
}
UPDATE_TAMBAHAN.push(updateBahayaKhas);
SAAT_MASUK_AREA.push(() => { kolam = []; ombak = []; bayanganKhas = []; });

// garis bahaya lurus: n titik dari (x, y) ke arah a
function garisBahaya(x, y, a, n, jarak, r, delay, langkah, dmg, jenis) {
  for (let i = 0; i < n; i++) tandaBahaya(x + Math.cos(a) * (i + 1) * jarak, y + Math.sin(a) * (i + 1) * jarak, r, delay + i * langkah, dmg, jenis);
}
const umumkanKhas = (m, id) => { toast(t("khas.umum", { bos: m.d.name, jurus: t("khas." + id) }), true); sfx.growl(); };

// ---------- Daftar jurus khas ----------
// mulai(m) dipanggil sekali; jalan(m, dt) tiap frame, kembalikan true selama jurus masih berjalan.
const KHAS = {
  genderuwo: [{
    id: "lemparBatu",
    mulai(m) { m.kh = { t: 0, n: 0 }; umumkanKhas(m, this.id); },
    jalan(m, dt) {
      const K = m.kh; K.t += dt;
      if (K.n < 3 && K.t >= K.n * 0.6) { K.n++; tandaBahaya(P.x, P.y, 50, 0.95, m.d.atk * 0.9, "batu"); sfx.heavy(); }
      return K.t < 2.6;
    },
  }],
  dwarapala: [{
    id: "gadaBerputar",
    mulai(m) { m.kh = { t: 0 }; umumkanKhas(m, this.id);
      [[90, 0.8], [150, 1.3], [210, 1.8]].forEach(([r, d]) => { const n = Math.round(r / 26); for (let i = 0; i < n; i++) { const a = (i / n) * 6.28; tandaBahaya(m.x + Math.cos(a) * r, m.y + Math.sin(a) * r * 0.7, 32, d, m.d.atk, "batu"); } }); },
    jalan(m, dt) { m.kh.t += dt; m.putar = m.kh.t; if (Math.random() < 0.4) spark(m.x, m.y - 40, "#c9a26b", 3); return m.kh.t < 2.1; },
  }],
  buayaPutih: [{
    id: "gulungan",
    mulai(m) { m.kh = { t: 0, n: 0, fase: "selam" }; m.sembunyi = true; m.kebal = true; umumkanKhas(m, this.id); sfx.roll(); },
    jalan(m, dt) {
      const K = m.kh; K.t += dt;
      if (K.fase === "selam") {
        const a = Math.atan2(P.y - m.y, P.x - m.x); moveEnt(m, Math.cos(a) * 260 * dt, Math.sin(a) * 260 * dt, true);
        if (Math.random() < 0.5) parts.push({ x: m.x + rand(-20, 20), y: m.y, z: 0, vz: rand(60, 120), vx: 0, vy: 0, life: 0.4, max: 0.4, color: "#bfe4ff" });
        if (K.t > 1.2) { K.fase = "sembul"; K.t = 0; tandaBahaya(m.x, m.y, 95, 0.7, m.d.atk * 1.3, "air"); }
      } else if (K.t > 0.7) {
        K.n++; m.sembunyi = false; m.kebal = false; shake = 0.4; sfx.slam();
        if (K.n >= 2) return false;
        K.fase = "selam"; K.t = 0; m.sembunyi = true; m.kebal = true;
      }
      return true;
    },
    selesai(m) { m.sembunyi = false; m.kebal = false; },
  }],
  rajaBanaspati: [{
    id: "pusaranApi",
    mulai(m) { m.kh = { t: 0, a: rand(0, 6.28), tembakT: 0 }; umumkanKhas(m, this.id); },
    jalan(m, dt) {
      const K = m.kh; K.t += dt; K.tembakT -= dt;
      if (K.t > 0.5 && K.tembakT <= 0) { K.tembakT = 0.09; K.a += 0.33; for (const o of [0, 2.09, 4.19]) tembak(m, K.a + o, 210, m.d.atk * 0.55, 10); }
      return K.t < 2.8;
    },
  }],
  silumanUlar: [{
    id: "kolamRacun",
    mulai(m) { m.kh = { t: 0 }; umumkanKhas(m, this.id);
      for (let i = 0; i < 5; i++) { const a = rand(0, 6.28), r = i === 0 ? 0 : rand(80, 220); kolam.push({ x: P.x + Math.cos(a) * r, y: P.y + Math.sin(a) * r, r: 70, t: -0.8, dur: 7, tick: 0.8, dmg: m.d.atk * 0.25, deb: { jenis: "racun", peluang: 0.6, lama: 4 }, dari: m }); } },
    jalan(m, dt) { m.kh.t += dt; return m.kh.t < 1; },
  }, {
    id: "tatapanBatu",
    mulai(m) { m.kh = { t: 0 }; umumkanKhas(m, this.id); if (!infoKhas.tatap) { infoKhas.tatap = true; setTimeout(() => toast(t("khas.tatapInfo"), false), 600); } },
    jalan(m, dt) {
      m.kh.t += dt; m.tatap = m.kh.t / 2;
      if (m.kh.t < 2) return true;
      m.tatap = 0;
      const keBos = Math.atan2(m.y - P.y, m.x - P.x);
      if (!P.dead && angDiff(P.face, keBos) < 1.2 && dist(m, P) < 600) {
        numbers.push({ x: P.x, y: P.y - 80, v: t("khas.membatu"), life: 1.2, color: "#c9e27a", size: 24 });
        P.debuff = P.debuff || {}; P.kebalLumpuh = 0;
        beriDebuff({ jenis: "lumpuh", peluang: 1, lama: 1.6 });
        hurtPlayer(m.d.atk * 0.8, keBos + Math.PI, null, { mutlak: true, dari: m });
      } else if (!P.dead) numbers.push({ x: P.x, y: P.y - 80, v: t("bos.selamat"), life: 1, color: "#7dffa8", size: 22 });
      kilat = 0.5; sfx.zap();
      return false;
    },
    selesai(m) { m.tatap = 0; },
  }],
  panglimaKarang: [{
    id: "ombakPasang",
    mulai(m) { m.kh = { t: 0, n: 0 }; umumkanKhas(m, this.id); },
    jalan(m, dt) {
      const K = m.kh; K.t += dt;
      if (K.n < 3 && K.t >= 0.4 + K.n * 1.1) {
        K.n++;
        const a = rand(0, 6.28), dx = Math.cos(a), dy = Math.sin(a), mundur = 420;
        ombak.push({ x: P.x - dx * mundur, y: P.y - dy * mundur, dx, dy, panjang: 900, celah: rand(-160, 160), lebarCelah: 110, speed: 330, life: 2.8, hit: false, dmg: m.d.atk * 1.1, deb: m.d.debuff, dari: m });
        sfx.roll();
      }
      return K.t < 3.6;
    },
  }],
  kelabang: [{
    id: "terowongan",
    mulai(m) { m.kh = { t: 0, n: 0, fase: "gali" }; m.sembunyi = true; m.kebal = true; umumkanKhas(m, this.id); sfx.roll(); },
    jalan(m, dt) {
      const K = m.kh; K.t += dt;
      if (K.fase === "gali") {
        const a = Math.atan2(P.y - m.y, P.x - m.x); moveEnt(m, Math.cos(a) * 300 * dt, Math.sin(a) * 300 * dt, true);
        if (Math.random() < 0.6) parts.push({ x: m.x + rand(-16, 16), y: m.y, z: 0, vz: rand(80, 160), vx: 0, vy: 0, life: 0.4, max: 0.4, color: "#8a6a4a" });
        if (K.t > 0.9) { K.fase = "muncul"; K.t = 0; tandaBahaya(P.x, P.y, 80, 0.75, m.d.atk * 1.2, "batu"); m.tx = P.x; m.ty = P.y; }
      } else if (K.t > 0.75) {
        m.x = m.tx; m.y = m.ty; K.n++; shake = 0.4; sfx.slam(); spark(m.x, m.y, "#8a6a4a", 16);
        if (dist(m, P) < 90) beriDebuff({ jenis: "berdarah", peluang: 0.7, lama: 6 });
        if (K.n >= 3) return false;
        K.fase = "gali"; K.t = 0;
      }
      return true;
    },
    selesai(m) { m.sembunyi = false; m.kebal = false; if (solidAt(m.x, m.y)) { m.x = m.home.x; m.y = m.home.y; } },
  }],
  rajaJerangkong: [{
    id: "tombakTulang",
    mulai(m) { m.kh = { t: 0 }; umumkanKhas(m, this.id);
      for (const [off, d] of [[0, 0.8], [0.39, 1.7]]) for (let i = 0; i < 8; i++) garisBahaya(m.x, m.y, off + (i / 8) * 6.28, 7, 44, 26, d, 0.05, m.d.atk * 0.9, "tulang"); },
    jalan(m, dt) { m.kh.t += dt; return m.kh.t < 2.4; },
  }],
  guritaRaksasa: [{
    id: "tintaPekat",
    mulai(m) { m.kh = { t: 0 }; umumkanKhas(m, this.id); tintaT = 7; for (let i = 0; i < 6; i++) { const a = rand(0, 6.28); tembak(m, a, 160, m.d.atk * 0.5, 14); } },
    jalan(m, dt) { m.kh.t += dt; return m.kh.t < 0.8; },
  }, {
    id: "tentakel",
    mulai(m) { m.kh = { t: 0, n: 0 }; umumkanKhas(m, this.id); },
    jalan(m, dt) {
      const K = m.kh; K.t += dt;
      if (K.n < 5 && K.t >= K.n * 0.45) { K.n++; const a = rand(0, 6.28), sx = P.x + Math.cos(a) * 340, sy = P.y + Math.sin(a) * 340; garisBahaya(sx, sy, a + Math.PI, 12, 50, 30, 1, 0.02, m.d.atk, "tinta"); sfx.claw(); }
      return K.t < 3.2;
    },
  }],
  rajawaliPetir: [{
    id: "badaiPetir",
    mulai(m) { m.kh = { t: 0, n: 0 }; umumkanKhas(m, this.id); },
    jalan(m, dt) {
      const K = m.kh; K.t += dt;
      if (K.n < 6 && K.t >= K.n * 0.45) { K.n++; const x = P.x + rand(-20, 20), y = P.y + rand(-14, 14); tandaBahaya(x, y, 55, 0.7, m.d.atk * 0.9, "petir"); setTimeout(() => petir(x, y, 0.6), 700); }
      return K.t < 3.4;
    },
  }, {
    id: "sambar",
    mulai(m) { m.kh = { t: 0, n: 0, fase: "bidik" }; umumkanKhas(m, this.id); },
    jalan(m, dt) {
      const K = m.kh; K.t += dt;
      if (K.fase === "bidik" && K.t >= 0.85) { K.fase = "tukik"; K.t = 0; K.hit = false; }
      if (K.fase === "bidik") { K.a = Math.atan2(P.y - m.y, P.x - m.x); m.garisSambar = K.a; return true; }
      moveEnt(m, Math.cos(K.a) * 760 * dt, Math.sin(K.a) * 760 * dt, true);
      if (!K.hit && dist(m, P) < m.r + P.r + 10) { K.hit = true; hurtPlayer(m.d.atk * 1.4, K.a, null, { dari: m }); }
      if (K.t > 0.65) { K.n++; m.garisSambar = null; if (K.n >= 2) return false; K.fase = "bidik"; K.t = 0; }
      return true;
    },
    selesai(m) { m.garisSambar = null; },
  }],
  penjagaMenara: [{
    id: "loncengKala",
    mulai(m) { m.kh = { t: 0, n: 0 }; umumkanKhas(m, this.id); },
    jalan(m, dt) {
      const K = m.kh; K.t += dt;
      if (!K.kuadran) { K.kuadran = { x: P.x, y: P.y, aman: Math.floor(rand(0, 4)), rot: K.n * Math.PI / 4, t: 0 }; sfx.door(); }
      K.kuadran.t += dt; penjuruKala = K.kuadran;
      if (K.kuadran.t >= 2.2) {
        const Q = K.kuadran, a = Math.atan2(P.y - Q.y, P.x - Q.x) - Q.rot, idx = ((Math.floor(((a % 6.28) + 6.28) % 6.28 / 1.5708)) % 4);
        kilat = 0.4; sfx.slam(); shake = 0.6;
        if (!P.dead && idx !== Q.aman && Math.hypot(P.x - Q.x, P.y - Q.y) < 420) hurtPlayer(m.d.atk * 1.4, a, null, { dari: m, mutlak: true });
        K.n++; K.kuadran = null; penjuruKala = null;
        if (K.n >= 2) return false;
      }
      return true;
    },
    selesai() { penjuruKala = null; },
  }],
  kalamurka: [{
    id: "cerminBayang",
    mulai(m) {
      m.kh = { t: 0 }; umumkanKhas(m, this.id); m.sembunyi = true; m.kebal = true; spark(m.x, m.y - 50, "#b88cff", 20);
      bayanganKhas = [0, 1, 2].map((i) => { const a = rand(0, 6.28) + i * 2.09, x = P.x + Math.cos(a) * 230, y = P.y + Math.sin(a) * 230; return { x, y, mulai: 0.9 + i * 0.55, a: 0, jalan: false, selesai: false, hit: false }; });
    },
    jalan(m, dt) {
      const K = m.kh; K.t += dt;
      for (const b of bayanganKhas) {
        if (!b.jalan && K.t < b.mulai) b.a = Math.atan2(P.y - b.y, P.x - b.x);       // membidik pemain sampai saat menerjang
        if (!b.jalan && K.t >= b.mulai) { b.jalan = true; b.sisa = 0.45; sfx.dash(); }
        if (b.jalan && !b.selesai) {
          b.x += Math.cos(b.a) * 1000 * dt; b.y += Math.sin(b.a) * 1000 * dt; b.sisa -= dt;
          if (!b.hit && Math.hypot(P.x - b.x, P.y - b.y) < 34) { b.hit = true; hurtPlayer(m.d.atk * 1.1, b.a, null, { dari: m }); }
          if (b.sisa <= 0) b.selesai = true;
        }
      }
      if (bayanganKhas.every((b) => b.selesai)) {
        const last = bayanganKhas[bayanganKhas.length - 1];
        if (!solidAt(last.x, last.y)) { m.x = last.x; m.y = last.y; }
        return false;
      }
      return true;
    },
    selesai(m) { m.sembunyi = false; m.kebal = false; bayanganKhas = []; },
  }],
};
const KHAS_JEDA = { genderuwo: 16, dwarapala: 15, buayaPutih: 15, rajaBanaspati: 14, silumanUlar: 13, panglimaKarang: 13, kelabang: 13, rajaJerangkong: 12, guritaRaksasa: 12, rajawaliPetir: 11, penjagaMenara: 11, kalamurka: 10 };
const infoKhas = {};
let tintaT = 0, penjuruKala = null, bayanganKhas = [];

// Dipanggil dari bosTangguh (57-bos-tangguh.js). true = jurus khas sedang berjalan.
function jurusKhasBos(m, dt, siap) {
  const daftar = KHAS[m.type];
  if (!daftar) return false;
  if (m.khas) {
    if (P.dead || !m.khas.jalan(m, dt)) { if (m.khas.selesai) m.khas.selesai(m); m.khas = null; m.state = m.d.ai ? "kejar" : "chase"; m.cd = 0.6; }
    return true;
  }
  if (!siap) return false;
  const jeda = KHAS_JEDA[m.type] * ((m.tingkat || 0) >= 5 ? 0.75 : 1);
  m.khasT = (m.khasT ?? jeda * 0.5) - dt;
  if (m.khasT > 0) return false;
  m.khasT = jeda;
  m.khasI = ((m.khasI ?? -1) + 1) % daftar.length;
  m.khas = daftar[m.khasI];
  m.khas.mulai(m);
  return true;
}
function updateTinta(dt) { if (tintaT > 0) tintaT -= dt; }
UPDATE_TAMBAHAN.push(updateTinta);

// ---------- Gambar ----------
// bos yang menyelam/menggali: hanya gundukan bergerak yang terlihat
for (const jenis of ["buayaPutih", "kelabang", "kalamurka"]) {
  const asli = GAMBAR_MONSTER[jenis];
  GAMBAR_MONSTER[jenis] = function (m, time, w) {
    if (!m.sembunyi) return asli(m, time, w);
    if (jenis === "kalamurka") return;
    ctx.fillStyle = jenis === "buayaPutih" ? "rgba(191,228,255,0.55)" : "rgba(110,80,50,0.8)";
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(-i * 18 * Math.sin(time * 4 + i), -4, 22 - i * 5, 8 - i, 0, 0, 6.28); ctx.fill(); }
  };
}
GAMBAR_TANAH.push(function (time) {
  for (const k of kolam) {
    const muncul = Math.min(1, Math.max(0, (k.t + 0.8) / 0.8)), aktif = k.t >= 0;
    ctx.fillStyle = aktif ? `rgba(123,214,74,${0.32 + 0.06 * Math.sin(time * 5 + k.x)})` : `rgba(123,214,74,${0.15 * muncul})`;
    ctx.beginPath(); ctx.ellipse(k.x, k.y, k.r * muncul, k.r * 0.62 * muncul, 0, 0, 6.28); ctx.fill();
    if (aktif && Math.random() < 0.15) parts.push({ x: k.x + rand(-k.r, k.r) * 0.6, y: k.y + rand(-k.r, k.r) * 0.3, z: 0, vz: 40, vx: 0, vy: 0, life: 0.5, max: 0.5, color: "#7bd64a", s: 5, float: true });
  }
  // lonceng kala: empat penjuru, satu hijau (aman)
  if (penjuruKala) {
    const Q = penjuruKala, k = Q.t / 2.2;
    for (let i = 0; i < 4; i++) {
      const a0 = Q.rot + i * 1.5708;
      ctx.beginPath(); ctx.moveTo(Q.x, Q.y); ctx.ellipse(Q.x, Q.y, 420, 260, 0, a0, a0 + 1.5708); ctx.closePath();
      ctx.fillStyle = i === Q.aman ? `rgba(125,255,168,${0.22 + 0.1 * Math.sin(time * 8)})` : `rgba(220,30,30,${0.12 + 0.3 * k})`; ctx.fill();
    }
  }
});
GAMBAR_ATAS.push(function (time) {
  // ombak pasang
  for (const o of ombak) {
    ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(Math.atan2(o.dy, o.dx));
    const g = ctx.createLinearGradient(-30, 0, 20, 0); g.addColorStop(0, "rgba(111,211,255,0)"); g.addColorStop(1, "rgba(200,240,255,0.85)");
    ctx.fillStyle = g;
    ctx.fillRect(-30, -o.panjang / 2, 50, o.panjang / 2 + o.celah - o.lebarCelah / 2);
    ctx.fillRect(-30, o.celah + o.lebarCelah / 2, 50, o.panjang / 2 - o.celah - o.lebarCelah / 2);
    ctx.restore();
  }
  for (const m of monsters) {
    if (m.dead) continue;
    // tatapan batu: mata siluman makin terang
    if (m.tatap > 0) {
      const y = m.y - m.d.h - 16;
      ctx.save(); ctx.shadowColor = "#c9e27a"; ctx.shadowBlur = 20 + 30 * m.tatap;
      ctx.fillStyle = `rgba(201,226,122,${0.5 + 0.5 * m.tatap})`; ctx.beginPath(); ctx.ellipse(m.x, y, 16 + 10 * m.tatap, 8, 0, 0, 6.28); ctx.fill();
      ctx.fillStyle = "#1a1420"; ctx.beginPath(); ctx.ellipse(m.x, y, 3, 7, 0, 0, 6.28); ctx.fill(); ctx.restore();
    }
    // garis bidikan rajawali sebelum menukik
    if (m.garisSambar != null) {
      ctx.save(); ctx.translate(m.x, m.y); ctx.rotate(m.garisSambar);
      ctx.fillStyle = `rgba(255,224,102,${0.18 + 0.15 * Math.sin(time * 20)})`; ctx.fillRect(0, -m.r, 520, m.r * 2); ctx.restore();
    }
    // gada berputar dwarapala
    if (m.khas && m.type === "dwarapala") { ctx.save(); ctx.strokeStyle = "rgba(201,162,107,0.8)"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(m.x, m.y - 50, 70, m.putar * 9, m.putar * 9 + 2); ctx.stroke(); ctx.restore(); }
  }
  // bayangan kalamurka
  for (const b of bayanganKhas) {
    if (b.selesai) continue;
    if (!b.jalan) { ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.a); ctx.fillStyle = "rgba(184,140,255,0.22)"; ctx.fillRect(0, -26, 450, 52); ctx.restore(); }
    ctx.save(); ctx.globalAlpha = 0.75; ctx.translate(b.x, b.y);
    ctx.fillStyle = "#2b1a40"; ctx.beginPath(); ctx.ellipse(0, -50, 22, 50, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#c9a6ff"; ctx.fillRect(-7, -100, 5, 3); ctx.fillRect(3, -100, 5, 3); ctx.restore();
  }
  // tinta gurita: gelap kecuali di sekitar pemain
  if (tintaT > 0 && P) {
    const a = Math.min(1, tintaT, 0.9);
    const g = ctx.createRadialGradient(P.x, P.y - 20, 90, P.x, P.y - 20, 260);
    g.addColorStop(0, "rgba(15,8,30,0)"); g.addColorStop(1, `rgba(15,8,30,${0.93 * a})`);
    ctx.fillStyle = g; ctx.fillRect(P.x - 2000, P.y - 2000, 4000, 4000);
  }
});
