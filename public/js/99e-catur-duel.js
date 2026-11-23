// =====================================================================
// CATUR LAGA — DUEL 20 DETIK
// Dipicu setiap kali bidak memakan (99d-catur-papan.js). Pemain selalu mengendalikan
// bidak PUTIH miliknya (sebagai penyerang atau yang bertahan), komputer mengendalikan lawan.
// Kontrol sama seperti petualangan: gerak, Serang (tahan), Jurus, Hindar.
// - Kekuatan mengikuti nilai bidak (Menteri jauh lebih kuat dari Pion) & kelas hero.
// - Jurus khas per kelas: terjang (jarak dekat), panah tiga, bola api, wayang penolong, ramuan pulih.
// - Waktu habis: persen nyawa lebih banyak yang menang; seri = yang bertahan menang.
// - Tingkat kesulitan mengatur kelincahan, refleks, & kekuatan lawan.
// Duel digambar di kanvas utama (mode "duel"); tombol sentuh petualangan ikut tampil di HP.
// =====================================================================
"use strict";

const NILAI_DUEL = { p: 1, n: 1.6, b: 1.6, r: 2.0, q: 2.8, k: 2.4 };
const AI_DUEL = {
  santai: { reaksi: 0.5, hindar: 0.12, gerak: 0.8, dmg: 0.7, hp: 0.85, dmgPemain: 1.25 },
  sedang: { reaksi: 0.28, hindar: 0.32, gerak: 0.95, dmg: 0.95, hp: 1, dmgPemain: 1.05 },
  jago:   { reaksi: 0.12, hindar: 0.55, gerak: 1.08, dmg: 1.15, hp: 1.12, dmgPemain: 0.9 },
};
const ARENA = { w: 640, h: 280, waktu: 20 };
let duel = null;

function buatPetarung(sisi, cls, tp, putih, pemain, tingkat) {
  const C = CLASSES[cls], v = NILAI_DUEL[tp], A = AI_DUEL[tingkat] || AI_DUEL.sedang;
  const hp = Math.round(110 * Math.pow(v, 0.85) * Math.sqrt(C.hp / 110) * (pemain ? 1 : A.hp));
  return {
    sisi, cls, tp, putih, pemain, C, look: lookHeroCatur(cls, putih),
    x: sisi === "kiri" ? 150 : ARENA.w - 150, y: ARENA.h / 2, face: sisi === "kiri" ? 0 : Math.PI,
    hp, maxHp: hp, atk: 9 * Math.sqrt(v) * (C.atk / 10) * (pemain ? A.dmgPemain : A.dmg), cepat: 175 * (C.speed / 190) * (pemain ? 1 : A.gerak),
    jarakDekat: C.attack.type === "melee", jangkau: C.attack.type === "melee" ? (C.attack.range || 60) + 18 : 380,
    cdSerang: 0, cdJurus: 1.5, cdHindar: 0, roll: 0, rdx: 0, rdy: 0, dash: 0, dashKena: false, inv: 0, flash: 0,
    swing: 0, swingDur: 0.2, run: 0, moving: false, pikir: 0, sekutu: 0, sekutuT: 0,
  };
}

// opsi = { penyerang: {cls, t, putih}, bertahan: {...}, tingkat, takhta, tutor }; selesai(penyerangMenang)
function mulaiDuelCatur(opsi, selesai) {
  const pemainMenyerang = opsi.penyerang.putih;
  const pB = pemainMenyerang ? opsi.penyerang : opsi.bertahan, kB = pemainMenyerang ? opsi.bertahan : opsi.penyerang;
  duel = {
    opsi, selesai, pemainMenyerang, tingkat: opsi.tingkat,
    p: buatPetarung("kiri", pB.cls, pB.t, true, true, opsi.tingkat),
    k: buatPetarung("kanan", kB.cls, kB.t, false, false, opsi.tingkat),
    peluru: [], efek: [], waktu: ARENA.waktu, fase: "intro", faseT: opsi.tutor ? 3.2 : 1.4, hasil: null,
  };
  $("caturBox").hidden = true;
  mode = "duel"; showUI(); $("hud").hidden = true;
  sfx.charge ? sfx.charge() : sfx.click();
}
// HP: tombol sentuh tampil selama duel
{
  const tampilAsli = showUI;
  showUI = function () {
    tampilAsli();
    const aktif = mode === "duel";
    ui.touch.classList.toggle("mode-duel", aktif);   // CSS: sembunyikan Jamu, Jurus 2, Pamungkas
    if (aktif) {
      ui.touch.hidden = !isTouch; ui.skills.hidden = true;
      $("bSkill").firstElementChild.textContent = pilihBahasa(["Jurus", "Skill"]);
    }
    delete last.bn0; delete last.hj0; delete last.rc;   // kembali ke game biasa: label & jeda asli ditulis ulang oleh HUD
  };
}

{ // selama duel, HUD jurus biasa jangan menimpa label & jeda tombol duel
  const hudJurusAsli = hudJurus;
  hudJurus = function () { if (mode !== "duel") hudJurusAsli(); };
}

// ---------- Aksi ----------
const sudutKe = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);
function pukul(dari, ke, mult, kb = 120) {
  if (ke.inv > 0 || duel.fase !== "tarung") return;
  const dmg = dari.atk * mult * rand(0.9, 1.1);
  ke.hp = Math.max(0, ke.hp - dmg); ke.flash = 0.12; ke.inv = 0.18;
  const a = sudutKe(dari, ke); ke.x += Math.cos(a) * kb * 0.12; ke.y += Math.sin(a) * kb * 0.12;
  duel.efek.push({ jenis: "angka", x: ke.x, y: ke.y - 60, v: Math.round(dmg), t: 0, warna: ke.pemain ? "#ff8b8e" : "#ffe08a" });
  sfx.hit ? sfx.hit() : sfx.swing();
}
function serang(f, lawan) {
  if (f.cdSerang > 0 || f.roll > 0 || f.dash > 0) return;
  f.face = sudutKe(f, lawan); f.swing = f.swingDur = 0.18;
  f.cdSerang = Math.max(0.32, (f.C.attack.cd || 0.4) * 1.35);
  if (f.jarakDekat) {
    duel.efek.push({ jenis: "tebas", x: f.x, y: f.y - 18, a: f.face, r: f.jangkau, t: 0 });
    if (Math.hypot(lawan.x - f.x, lawan.y - f.y) <= f.jangkau + 16) pukul(f, lawan, 1);
    sfx.swing();
  } else {
    const jenis = f.C.attack.proj || "fire";
    duel.peluru.push({ x: f.x, y: f.y, vx: Math.cos(f.face) * 520, vy: Math.sin(f.face) * 520, life: 0.8, dmg: 1, dari: f, jenis, r: 12 });
    jenis === "fire" ? sfx.fire() : sfx.arrow();
  }
}
function jurus(f, lawan) {
  if (f.cdJurus > 0 || f.roll > 0 || f.dash > 0) return;
  f.cdJurus = 5; f.face = sudutKe(f, lawan);
  const cls = f.cls;
  if (["pendekar", "pendobrak", "jawara"].includes(cls)) { f.dash = 0.26; f.dashKena = false; f.rdx = Math.cos(f.face); f.rdy = Math.sin(f.face); f.inv = 0.3; sfx.dash(); }
  else if (cls === "pemanah") { for (const d of [-0.22, 0, 0.22]) duel.peluru.push({ x: f.x, y: f.y, vx: Math.cos(f.face + d) * 600, vy: Math.sin(f.face + d) * 600, life: 0.75, dmg: 1.4, dari: f, jenis: "arrow", r: 12 }); sfx.volley ? sfx.volley() : sfx.arrow(); }
  else if (cls === "penyihir") { duel.peluru.push({ x: f.x, y: f.y, vx: Math.cos(f.face) * 380, vy: Math.sin(f.face) * 380, life: 1.1, dmg: 2.6, dari: f, jenis: "fire", r: 22, besar: true }); sfx.fire(); }
  else if (cls === "dalang") { f.sekutu = 4.5; f.sekutuT = 0.3; sfx.summon ? sfx.summon() : sfx.charge(); }
  else if (cls === "tabib") {
    const h = f.maxHp * 0.22; f.hp = Math.min(f.maxHp, f.hp + h);
    duel.efek.push({ jenis: "angka", x: f.x, y: f.y - 66, v: "+" + Math.round(h), t: 0, warna: "#5ad17a" });
    if (Math.hypot(lawan.x - f.x, lawan.y - f.y) < 100) pukul(f, lawan, 1);
    duel.efek.push({ jenis: "cincin", x: f.x, y: f.y, r: 100, t: 0 }); sfx.drink();
  }
  f.swing = f.swingDur = 0.22;
}
function hindar(f, mx, my, lawan) {
  if (f.cdHindar > 0 || f.roll > 0) return;
  let a = mx || my ? Math.atan2(my, mx) : sudutKe(lawan, f);
  f.rdx = Math.cos(a); f.rdy = Math.sin(a); f.roll = 0.22; f.inv = 0.32; f.cdHindar = 1.1; sfx.roll();
}

// ---------- Detak ----------
function geser(f, dx, dy) { f.x = clamp(f.x + dx, 24, ARENA.w - 24); f.y = clamp(f.y + dy, 30, ARENA.h - 10); }
function detakPetarung(f, lawan, dt) {
  f.cdSerang -= dt; f.cdJurus -= dt; f.cdHindar -= dt; f.inv -= dt; f.flash -= dt; f.swing = Math.max(0, f.swing - dt);
  if (f.roll > 0) { f.roll -= dt; geser(f, f.rdx * 520 * dt, f.rdy * 520 * dt); f.run += dt * 20; return true; }
  if (f.dash > 0) {
    f.dash -= dt; geser(f, f.rdx * 720 * dt, f.rdy * 720 * dt);
    if (!f.dashKena && Math.hypot(lawan.x - f.x, lawan.y - f.y) < 42) { f.dashKena = true; pukul(f, lawan, 2.2, 260); }
    return true;
  }
  if (f.sekutu > 0) {   // wayang penolong Dalang: menembak tiap 0,8 detik
    f.sekutu -= dt; f.sekutuT -= dt;
    if (f.sekutuT <= 0) { f.sekutuT = 0.8; const sx = f.x - 30, sy = f.y - 40, a = Math.atan2(lawan.y - sy, lawan.x - sx); duel.peluru.push({ x: sx, y: sy + 30, vx: Math.cos(a) * 560, vy: Math.sin(a) * 560, life: 0.8, dmg: 0.8, dari: f, jenis: "arrow", r: 10 }); }
  }
  return false;
}
function detakDuel(dt) {
  const D = duel; if (!D) return;
  D.faseT -= dt;
  for (const e of D.efek) e.t += dt;
  D.efek = D.efek.filter((e) => e.t < 0.8);
  if (D.fase === "intro") { if (D.faseT <= 0) { D.fase = "tarung"; sfx.slam ? sfx.slam() : sfx.heavy(); } return; }
  if (D.fase === "akhir") { if (D.faseT <= 0) akhiriDuel(); return; }
  const p = D.p, k = D.k, inp = readInput();
  if (isTouch) {   // jeda jurus & hindar duel tampil di tombol sentuh
    $("bSkill").style.setProperty("--cd", Math.max(0, p.cdJurus / 5).toFixed(2));
    $("bRoll").style.setProperty("--cd", Math.max(0, p.cdHindar / 1.1).toFixed(2));
  }
  // pemain
  if (!detakPetarung(p, k, dt)) {
    if (inp.roll) hindar(p, inp.mx, inp.my, k);
    else if (inp.skill) jurus(p, k);
    else {
      p.moving = !!(inp.mx || inp.my);
      if (p.moving) { geser(p, inp.mx * p.cepat * dt, inp.my * p.cepat * dt); p.run += dt * 10; p.face = Math.atan2(inp.my, inp.mx); }
      if (inp.attack) serang(p, k);
    }
  }
  // komputer
  const A = AI_DUEL[D.tingkat] || AI_DUEL.sedang;
  if (!detakPetarung(k, p, dt)) {
    const d = Math.hypot(p.x - k.x, p.y - k.y), ingin = k.jarakDekat ? 34 : 220;
    // menghindar dari peluru / tebasan pemain
    const ancam = D.peluru.some((b) => b.dari === p && Math.hypot(b.x - k.x, b.y - k.y) < 90) || (p.swing > 0.12 && p.jarakDekat && d < p.jangkau + 20) || (p.dash > 0 && d < 160);
    if (ancam && k.cdHindar <= 0 && Math.random() < A.hindar * dt * 12) hindar(k, -(p.y - k.y), p.x - k.x, p);
    else {
      k.pikir -= dt;
      const a = sudutKe(k, p), arah = d > ingin + 20 ? 1 : d < ingin - 40 ? -1 : 0;
      const samping = Math.sin(D.waktu * 1.7 + (k.cls.length)) * 0.6;
      const mx = Math.cos(a) * arah - Math.sin(a) * samping * (arah === 0 ? 1 : 0.4), my = Math.sin(a) * arah + Math.cos(a) * samping * (arah === 0 ? 1 : 0.4);
      k.moving = Math.abs(mx) + Math.abs(my) > 0.1;
      if (k.moving) { geser(k, mx * k.cepat * dt, my * k.cepat * dt); k.run += dt * 10; }
      k.face = a;
      if (k.pikir <= 0) {
        if (k.cdJurus <= 0 && d < (k.jarakDekat ? 200 : 360) && Math.random() < 0.5) { jurus(k, p); k.pikir = A.reaksi; }
        else if (d <= k.jangkau + (k.jarakDekat ? 10 : 0)) { serang(k, p); k.pikir = A.reaksi; }
      }
    }
  }
  // peluru
  for (const b of D.peluru) {
    b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt;
    const sasaran = b.dari === p ? k : p;
    if (b.life > 0 && Math.hypot(sasaran.x - b.x, sasaran.y - 30 - b.y + 30) < b.r + 18) { pukul(b.dari, sasaran, b.dmg, b.besar ? 220 : 100); b.life = 0; if (b.besar) D.efek.push({ jenis: "cincin", x: b.x, y: b.y, r: 50, t: 0 }); }
    if (b.x < 0 || b.x > ARENA.w || b.y < 0 || b.y > ARENA.h + 40) b.life = 0;
  }
  D.peluru = D.peluru.filter((b) => b.life > 0);
  // waktu & penentuan
  D.waktu -= dt;
  if (p.hp <= 0 || k.hp <= 0 || D.waktu <= 0) {
    // penyerang menang bila yang bertahan tumbang, atau saat waktu habis persen nyawanya LEBIH banyak (seri = bertahan menang)
    const att = D.pemainMenyerang ? p : k, def = D.pemainMenyerang ? k : p;
    const penyerangMenang = att.hp <= 0 ? false : def.hp <= 0 ? true : att.hp / att.maxHp > def.hp / def.maxHp;
    D.hasil = { penyerangMenang };
    D.hasil.pemainMenang = D.hasil.penyerangMenang === D.pemainMenyerang;
    D.fase = "akhir"; D.faseT = 1.4;
    D.hasil.pemainMenang ? sfx.level() : sfx.hurt();
  }
}
function akhiriDuel() {
  const D = duel; duel = null;
  mode = "catur"; showUI(); $("hud").hidden = true; $("caturBox").hidden = false;
  D.selesai(D.hasil.penyerangMenang);
}
{
  const updAsli = update;
  update = function (dt) { if (mode === "duel") return detakDuel(dt); return updAsli(dt); };
  const renderAsli = render;
  render = function (now) { if (mode === "duel" && duel) return gambarDuel(now / 1000); return renderAsli(now); };
}

// ---------- Gambar ----------
function gambarDuel(time) {
  const D = duel, s = Math.min(W / (ARENA.w + 60), H / (ARENA.h + 150));
  const ox = (W - ARENA.w * s) / 2, oy = (H - ARENA.h * s) / 2 + 20 * s;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#1a1230"); g.addColorStop(1, "#0b0716");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.setTransform(DPR * s, 0, 0, DPR * s, DPR * ox, DPR * oy);
  // lantai papan catur
  const kt = 40;
  for (let r = 0; r * kt < ARENA.h; r++) for (let c = 0; c * kt < ARENA.w; c++) { ctx.fillStyle = (r + c) % 2 ? "#3a3150" : "#4b4166"; ctx.fillRect(c * kt, r * kt, kt, kt); }
  ctx.strokeStyle = "#f4b942"; ctx.lineWidth = 3; ctx.strokeRect(0, 0, ARENA.w, ARENA.h);
  // efek tanah
  for (const e of D.efek) {
    const k = e.t / 0.8;
    if (e.jenis === "tebas") { ctx.strokeStyle = `rgba(255,240,200,${1 - k * 2})`; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(e.x, e.y, e.r * 0.8, e.a - 0.9, e.a + 0.9); ctx.stroke(); }
    if (e.jenis === "cincin") { ctx.strokeStyle = `rgba(125,255,168,${1 - k})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(e.x, e.y, e.r * (0.5 + k), e.r * 0.5 * (0.5 + k), 0, 0, 6.28); ctx.stroke(); }
  }
  // petarung (urut kedalaman)
  for (const f of [D.p, D.k].sort((a, b) => a.y - b.y)) {
    drawPerson(ctx, { x: f.x, y: f.y, face: f.face, run: f.run, moving: f.moving || f.roll > 0, swing: f.swing, swingDur: f.swingDur, inv: f.roll > 0 ? 0.1 : 0, flash: f.flash > 0 ? 0.1 : 0, lompat: f.roll > 0 ? 8 : 0 }, f.look, time);
    if (f.sekutu > 0) { ctx.fillStyle = "rgba(244,185,66,0.85)"; ctx.beginPath(); ctx.moveTo(f.x - 30, f.y - 62); ctx.lineTo(f.x - 22, f.y - 40); ctx.lineTo(f.x - 38, f.y - 40); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = f.pemain ? "#f5efe2" : "#2b2238"; ctx.strokeStyle = f.pemain ? "#2b2238" : "#e9d3a9"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(f.x, f.y + 14, 5, 0, 6.28); ctx.fill(); ctx.stroke();
  }
  for (const b of D.peluru) {
    if (b.jenis === "arrow") { ctx.save(); ctx.translate(b.x, b.y - 18); ctx.rotate(Math.atan2(b.vy, b.vx)); ctx.strokeStyle = "#e8d6b5"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(6, 0); ctx.stroke(); ctx.restore(); }
    else { ctx.fillStyle = "rgba(255,140,60,0.35)"; ctx.beginPath(); ctx.arc(b.x, b.y - 18, b.r, 0, 6.28); ctx.fill(); ctx.fillStyle = "#ff7b39"; ctx.beginPath(); ctx.arc(b.x, b.y - 18, b.r * 0.55, 0, 6.28); ctx.fill(); }
  }
  for (const e of D.efek) if (e.jenis === "angka") { ctx.font = "800 16px Nunito, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = e.warna; ctx.globalAlpha = 1 - e.t / 0.8; ctx.fillText(e.v, e.x, e.y - e.t * 30); ctx.globalAlpha = 1; }
  // HUD duel (ukuran layar)
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const bar = (f, x, kanan) => {
    const w = Math.min(260, W * 0.34), y = 14, nama = `${namaBidak(f.tp)} · ${f.C.name}`;
    ctx.fillStyle = "rgba(10,6,20,0.75)"; ctx.fillRect(kanan ? x - w : x, y + 18, w, 12);
    ctx.fillStyle = f.pemain ? "#5ad17a" : "#e5484d"; const isi = w * Math.max(0, f.hp / f.maxHp); ctx.fillRect(kanan ? x - isi : x, y + 19, isi, 10);
    ctx.font = "800 13px Nunito, sans-serif"; ctx.textAlign = kanan ? "right" : "left"; ctx.fillStyle = "#f7efe3";
    ctx.fillText((f.putih ? "⚪ " : "⚫ ") + nama, x, y + 12);
  };
  bar(D.p, 16, false); bar(D.k, W - 16, true);
  ctx.font = "700 30px Teko, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = D.waktu < 5 ? "#ff8b8e" : "#f4b942";
  ctx.fillText(Math.max(0, Math.ceil(D.waktu)), W / 2, 38);
  ctx.font = "700 12px Nunito, sans-serif"; ctx.fillStyle = "#c9bfd6";
  ctx.fillText(t(D.pemainMenyerang ? "duel.kamuMenyerang" : "duel.kamuBertahan"), W / 2, 54);
  if (!isTouch) ctx.fillText(t("duel.kontrol"), W / 2, H - 14);
  // intro & akhir
  if (D.fase !== "tarung") {
    ctx.fillStyle = "rgba(5,3,12,0.55)"; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = "center"; ctx.font = "700 64px Teko, sans-serif"; ctx.fillStyle = "#f4b942";
    if (D.fase === "intro") {
      ctx.fillText(D.opsi.takhta ? t("duel.takhta") : "DUEL!", W / 2, H / 2 - 10);
      ctx.font = "800 16px Nunito, sans-serif"; ctx.fillStyle = "#f7efe3";
      ctx.fillText(`${namaBidak(D.p.tp)} (${D.p.C.name})  vs  ${namaBidak(D.k.tp)} (${D.k.C.name})`, W / 2, H / 2 + 24);
      if (D.opsi.tutor) { ctx.font = "700 14px Nunito, sans-serif"; ctx.fillStyle = "#c9bfd6"; ctx.fillText(t(isTouch ? "duel.tutorSentuh" : "duel.tutorKey"), W / 2, H / 2 + 52); ctx.fillText(t("duel.tutorAturan"), W / 2, H / 2 + 72); }
    } else {
      ctx.fillStyle = D.hasil.pemainMenang ? "#5ad17a" : "#ff8b8e";
      ctx.fillText(t(D.hasil.pemainMenang ? "duel.menang" : "duel.kalah"), W / 2, H / 2);
      ctx.font = "800 15px Nunito, sans-serif"; ctx.fillStyle = "#f7efe3";
      ctx.fillText(t(D.hasil.penyerangMenang ? "duel.termakan" : "duel.gagalMakan"), W / 2, H / 2 + 30);
    }
  }
}
