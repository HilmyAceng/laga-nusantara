// =====================================================================
// PASIF UNIK JIMAT LEGENDA
// Tiap jimat legenda (khas bos) punya satu kemampuan unik (ditandai ✦), selain
// bonus angkanya. Kunci efeknya ada di JIMAT[...].efek (config.js); aktif selama
// jimatnya dipasang. Angka-angkanya di LEGENDA di bawah.
//   jejakApi    Mahkota Banaspati  berguling meninggalkan jejak api (50-hindar-tangkis.js)
//   bangkit     Sisik Naga         bangkit sekali saat pingsan (10-tarung.js)
//   amuk        Bulu Genderuwo     nyawa < 30%: serangan +35% & damage diterima -15%
//   hantam5     Gada Dwarapala     tiap pukulan ke-5 menghantam tanah (area, lumpuh)
//   pulihDiam   Sisik Buaya Putih  4 detik tak terkena pukulan → pulih 2% nyawa/detik
//   racunPeka   Mustika Ular       musuh beracun menerima damage +25% darimu
//   karangHidup Perisai Karang     tiap 12 detik dapat perisai 10% nyawa maksimal
//   pulihBunuh  Taring Kelabang    tiap mengalahkan musuh pulih 4% nyawa maksimal
//   tumpukTulang Tulang Raja       tiap mengalahkan musuh +3% serangan (maks 10 tumpuk, hilang saat pindah area)
//   tintaGuling Tinta Gurita       berguling meninggalkan awan tinta: musuh di dalamnya lambat & lemah
//   petirGuling Bulu Rajawali      berguling memanggil petir ke musuh terdekat (lumpuh sesaat)
//   hentiWaktu  Kunci Menara Kala  memakai pamungkas menghentikan waktu: musuh sekitar lumpuh
//   gemaBayang  Mahkota Kalamurka  25% pukulanmu disusul tebasan bayangan (50% damage)
// =====================================================================
"use strict";

const EFEK_UNIK = new Set(["jejakApi", "bangkit", "amuk", "hantam5", "pulihDiam", "racunPeka", "karangHidup", "pulihBunuh", "tumpukTulang", "tintaGuling", "petirGuling", "hentiWaktu", "gemaBayang"]);
const LEGENDA = {
  amukBatas: 0.3, amukAtk: 0.35, amukTahan: 0.15,
  hantamR: 95, hantamKali: 1.5, hantamLumpuh: 0.6,
  diamTunggu: 4, diamPulih: 0.02,
  racunKali: 1.25,
  karangJeda: 12, karangPerisai: 0.1,
  bunuhPulih: 0.04,
  tulangPer: 0.03, tulangMaks: 10,
  tintaR: 80, tintaLama: 2.5,
  petirJarak: 280, petirKali: 1.2, petirLumpuh: 0.4,
  hentiR: 340, hentiLumpuh: 2, hentiLumpuhBos: 0.8,
  gemaPeluang: 0.25, gemaKali: 0.5,
};
const punyaUnik = (k) => !!(S && S.jimat && S.jimat.pakai.some((id) => JIMAT[id] && JIMAT[id].efek[k]));
// status page: tampilkan pasif unik yang aktif di daftar bonus (66-status-karakter.js)
for (const k of EFEK_UNIK) if (!EFEK_STATUS.includes(k)) EFEK_STATUS.push(k);

// ---------- Bonus angka dinamis (amuk, tumpuk tulang) ----------
{
  const bonusAsli = bonusStat;
  bonusStat = function (k) {
    let n = bonusAsli(k);
    if (EFEK_UNIK.has(k)) return n;
    if (P && S && (k === "atk" || k === "tahan") && punyaUnik("amuk") && P.hp < maxHpTanpaAmuk() * LEGENDA.amukBatas) n += k === "atk" ? LEGENDA.amukAtk : LEGENDA.amukTahan;
    if (P && k === "atk" && P.tulang > 0) n += P.tulang * LEGENDA.tulangPer;
    return n;
  };
}
// nyawa maksimal tanpa memanggil bonusStat("hp") berulang (menghindari putaran tak berujung)
const maxHpTanpaAmuk = () => maxHp();

// ---------- Pukulan ke-5 (Gada Dwarapala) ----------
{
  const serangAsli = playerAttack;
  playerAttack = function () {
    serangAsli();
    if (!punyaUnik("hantam5")) return;
    P.hitungPukul = (P.hitungPukul || 0) + 1;
    if (P.hitungPukul % 5 === 0) {
      gempaDi(P.x, P.y, LEGENDA.hantamR, atkPower() * LEGENDA.hantamKali, LEGENDA.hantamLumpuh, 0);
      shake = Math.max(shake, 0.25); sfx.quake && sfx.quake();
    }
  };
}

// ---------- Damage ke musuh (racun peka, gema bayangan) ----------
{
  const damageAsli = damageMonster;
  damageMonster = function (m, amount, ang, kb, opts = {}) {
    if (punyaUnik("racunPeka") && m.dots && m.dots.racun && !opts.dot) amount *= LEGENDA.racunKali;
    const hasil = damageAsli(m, amount, ang, kb, opts);
    if (punyaUnik("gemaBayang") && !opts.dot && !opts.gema && !m.dead && Math.random() < LEGENDA.gemaPeluang) {
      bayangGema.push({ m, amount: amount * LEGENDA.gemaKali, ang, t: 0.15 });
    }
    return hasil;
  };
}
let bayangGema = [], awanTinta = [], petirFx = [];

// ---------- Musuh dikalahkan (pulih bunuh, tumpuk tulang) ----------
{
  const killAsli = killMonster;
  killMonster = function (m) {
    const sudah = m.dead; killAsli(m);
    if (sudah || !m.dead || m.d.latihan) return;
    if (punyaUnik("pulihBunuh") && !P.dead) { const h = Math.round(maxHp() * LEGENDA.bunuhPulih); P.hp = Math.min(maxHp(), P.hp + h); numbers.push({ x: P.x, y: P.y - 60, v: "+" + h, life: 0.7, color: "#5ad17a", size: 16 }); }
    if (punyaUnik("tumpukTulang")) P.tulang = Math.min(LEGENDA.tulangMaks, (P.tulang || 0) + 1);
  };
}
SAAT_MASUK_AREA.push(() => { if (P) P.tulang = 0; });

// ---------- Berguling (awan tinta, petir) ----------
{
  const hindarAsli = hindarAtauTangkis;
  hindarAtauTangkis = function (inp) {
    const ok = hindarAsli(inp);
    if (ok && P.roll > 0) {
      if (punyaUnik("tintaGuling")) awanTinta.push({ x: P.x, y: P.y, t: 0, dur: LEGENDA.tintaLama });
      if (punyaUnik("petirGuling")) {
        const m = musuhDekat(LEGENDA.petirJarak)[0];
        if (m) { damageMonster(m, atkPower() * LEGENDA.petirKali, -Math.PI / 2, 0, { tanpaTenaga: true }); lumpuhkanMonster(m, LEGENDA.petirLumpuh); petirFx.push({ x: m.x, y: m.y, t: 0, dur: 0.3 }); sfx.zap ? sfx.zap() : sfx.hit && sfx.hit(); }
      }
    }
    return ok;
  };
}

// ---------- Pamungkas menghentikan waktu (Kunci Menara Kala) ----------
{
  const pamAsli = pakaiPamungkas;
  pakaiPamungkas = function () {
    const sebelum = P.tenaga;
    pamAsli();
    if (punyaUnik("hentiWaktu") && P.tenaga < sebelum) {
      for (const m of musuhDekat(LEGENDA.hentiR)) lumpuhkanMonster(m, m.d.boss ? LEGENDA.hentiLumpuhBos : LEGENDA.hentiLumpuh);
      petirFx.push({ x: P.x, y: P.y, t: 0, dur: 0.6, henti: true });
    }
  };
}

// ---------- Per frame (pulih diam, perisai karang, efek) ----------
let karangT = 0;
UPDATE_TAMBAHAN.push((dt) => {
  if (!P || P.dead) return;
  // Sisik Buaya Putih: pulih setelah tidak terkena pukulan
  if (P.hpLalu != null && P.hp < P.hpLalu) P.diamT = 0;
  P.diamT = (P.diamT || 0) + dt; P.hpLalu = P.hp;
  if (punyaUnik("pulihDiam") && P.diamT > LEGENDA.diamTunggu && P.hp < maxHp()) { P.hp = Math.min(maxHp(), P.hp + maxHp() * LEGENDA.diamPulih * dt); P.hpLalu = P.hp; }
  // Perisai Karang: perisai berkala
  if (punyaUnik("karangHidup")) { karangT -= dt; if (karangT <= 0) { karangT = LEGENDA.karangJeda; if (typeof beriPerisai === "function") beriPerisai(LEGENDA.karangPerisai, LEGENDA.karangJeda); } }
  // gema bayangan tertunda
  for (const g of bayangGema) { g.t -= dt; if (g.t <= 0 && !g.m.dead) { damageMonster(g.m, g.amount, g.ang, 60, { gema: true, tanpaTenaga: true }); spark(g.m.x, g.m.y - 20, "#b88cff", 8); } }
  bayangGema = bayangGema.filter((g) => g.t > 0);
  // awan tinta
  for (const a of awanTinta) { a.t += dt; for (const m of monsters) if (!m.dead && Math.hypot(m.x - a.x, m.y - a.y) < LEGENDA.tintaR + m.r) { lambatkanMonster(m, 0.5); if (typeof lemahkanMonster === "function") lemahkanMonster(m, 0.5); } }
  awanTinta = awanTinta.filter((a) => a.t < a.dur);
  for (const f of petirFx) f.t += dt;
  petirFx = petirFx.filter((f) => f.t < f.dur);
});

// ---------- Gambar ----------
GAMBAR_TANAH.push(function (time) {
  for (const a of awanTinta) {
    const k = 1 - a.t / a.dur;
    ctx.fillStyle = `rgba(30,20,50,${0.45 * k})`;
    for (let i = 0; i < 5; i++) { const s = i * 1.3 + time; ctx.beginPath(); ctx.arc(a.x + Math.cos(s) * 30, a.y + Math.sin(s) * 14, LEGENDA.tintaR * 0.55, 0, 6.28); ctx.fill(); }
  }
  if (P && P.tulang > 0) { ctx.fillStyle = "#e8e2d0"; ctx.font = "800 10px Nunito, sans-serif"; ctx.textAlign = "center"; ctx.fillText("☠".repeat(Math.min(5, Math.ceil(P.tulang / 2))), P.x, P.y + 20); }
  if (P && punyaUnik("amuk") && P.hp < maxHp() * LEGENDA.amukBatas) { ctx.strokeStyle = `rgba(229,72,77,${0.4 + 0.3 * Math.sin(time * 12)})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(P.x, P.y, 26, 10, 0, 0, 6.28); ctx.stroke(); }
});
GAMBAR_ATAS.push(function () {
  for (const f of petirFx) {
    const k = 1 - f.t / f.dur;
    if (f.henti) { ctx.strokeStyle = `rgba(180,160,255,${k})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(f.x, f.y - 20, LEGENDA.hentiR * (1 - k * 0.7), 0, 6.28); ctx.stroke(); continue; }
    ctx.strokeStyle = `rgba(200,230,255,${k})`; ctx.lineWidth = 3; ctx.beginPath();
    let x = f.x, y = f.y - 220; ctx.moveTo(x, y);
    for (let i = 0; i < 6; i++) { y += 36; x = f.x + rand(-14, 14); ctx.lineTo(x, y); }
    ctx.stroke();
  }
});
