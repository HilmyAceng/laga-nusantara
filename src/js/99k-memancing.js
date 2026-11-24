// =====================================================================
// EVENT MEMANCING (mini game)
//  - Pak Udin, pemancing di tepi sungai Desa Wanasari, meminjamkan joran (ikan sungai).
//  - Dermaga di Kampung Nelayan (pesisir) untuk ikan laut.
//  - Terbuka bersama event catur (akhir Bab 2) dan tampil di popup Event.
// Cara main (mode "mancing"):
//  1. Lempar kail → tunggu pelampung bergoyang (beberapa detik).
//  2. "Ada yang menggigit!" → tekan TARIK secepatnya (kurang dari 1 detik).
//  3. Tarik-ulur: TAHAN tombol untuk menaikkan kotak hijau, lepas untuk turun.
//     Jaga ikan tetap di dalam kotak hijau sampai bar tangkapan penuh.
//     Ikan langka & legenda bergerak lebih liar, kotaknya lebih kecil.
// Ikan disimpan di tas (dijual ke Pak Udin / dermaga) dan tercatat di koleksi.
// Simpanan: S.ikan = { tas: { id: jumlah }, koleksi: { id: { n, berat } }, total }
// =====================================================================
"use strict";

const IKAN = {
  // sungai (Desa Wanasari)
  wader: { tempat: "sungai", rar: "biasa", nama: ["Ikan Wader", "Wader Fish"], harga: 12, berat: [0.05, 0.2] },
  nila: { tempat: "sungai", rar: "biasa", nama: ["Ikan Nila", "Tilapia"], harga: 20, berat: [0.2, 0.8] },
  lele: { tempat: "sungai", rar: "biasa", nama: ["Ikan Lele", "Catfish"], harga: 25, berat: [0.3, 1.2] },
  gurame: { tempat: "sungai", rar: "langka", nama: ["Ikan Gurame", "Giant Gourami"], harga: 70, berat: [1, 3.5] },
  arwana: { tempat: "sungai", rar: "legenda", nama: ["Arwana Emas", "Golden Arowana"], harga: 300, berat: [2, 6] },
  // laut (Kampung Nelayan)
  kembung: { tempat: "laut", rar: "biasa", nama: ["Ikan Kembung", "Mackerel"], harga: 22, berat: [0.2, 0.6] },
  tongkol: { tempat: "laut", rar: "biasa", nama: ["Ikan Tongkol", "Little Tuna"], harga: 30, berat: [0.5, 2] },
  kakap: { tempat: "laut", rar: "langka", nama: ["Kakap Merah", "Red Snapper"], harga: 90, berat: [1, 5] },
  kerapu: { tempat: "laut", rar: "langka", nama: ["Ikan Kerapu", "Grouper"], harga: 110, berat: [2, 8] },
  ikanDewa: { tempat: "laut", rar: "legenda", nama: ["Ikan Dewa", "Sacred Mahseer"], harga: 450, berat: [3, 12] },
};
// peluang tiap kelangkaan & kesulitan tarik-ulur
const RAR_IKAN = {
  biasa: { bobot: 70, zona: 0.3, cepat: 0.55, liar: 0.9, warna: "#d9d4cc" },
  langka: { bobot: 25, zona: 0.27, cepat: 0.65, liar: 0.75, warna: "#8fd3ff" },
  legenda: { bobot: 5, zona: 0.22, cepat: 0.8, liar: 0.6, warna: "#f4b942" },   // diuji simulasi: biasa ±95%, langka ±90%, legenda ±33% tertangkap
};
const dataIkan = () => (S.ikan = S.ikan || { tas: {}, koleksi: {}, total: 0 });
const namaIkan = (id) => Lx(IKAN[id].nama);
const isiTas = () => Object.entries(dataIkan().tas).filter(([, n]) => n > 0);
const nilaiTas = () => isiTas().reduce((a, [id, n]) => a + IKAN[id].harga * n, 0);

// ---------- NPC & dermaga ----------
NPC_DATA.push({ id: "udin", name: "Pak Udin", area: "desa", x: 20.2 * T, y: 17.2 * T, color: "#3f7a8c", accent: "#e9d3a9", hat: "#c9a25a", hair: "#2b2238", face: 0,
  obrolan: ["Sungai ini dulu penuh ikan. Sejak kabut merah, ikannya bersembunyi.", "Sabar itu kunci memancing, Nak. Sama seperti bertarung."],
  obrolanEn: ["This river used to be full of fish. Since the red mist, they've been hiding.", "Patience is the key to fishing, kid. Same as fighting."] });
SAAT_MASUK_AREA.push((id) => {
  if (id !== "pesisir" || !S || !eventTerbuka("mancing")) return;
  // dermaga: petak darat di tepi air yang paling dekat ke tengah area
  let terbaik = null, jarak = 1e9;
  for (let y = 2; y < MH - 2; y++) for (let x = 2; x < MW - 2; x++) {
    if (SOLID.has(tileAt(x, y)) || tileAt(x, y) === BRIDGE) continue;
    if (![[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => tileAt(x + dx, y + dy) === WATER)) continue;
    const d = Math.hypot(x - MW / 2, y - MH / 2); if (d < jarak) { jarak = d; terbaik = [x, y]; }
  }
  if (terbaik) NPCS.push({ id: "dermaga", kind: "dermaga", name: Lx(["Dermaga Pancing", "Fishing Pier"]), x: (terbaik[0] + 0.5) * T, y: (terbaik[1] + 0.6) * T, face: 0 });
});
GAMBAR_OBJEK.dermaga = function (n, time) {
  const x = n.x, y = n.y;
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 16, 5, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#7a4a26"; ctx.fillRect(x - 2, y - 34, 4, 34);                       // tiang
  ctx.fillStyle = "#c9932f"; ctx.fillRect(x - 14, y - 36, 28, 12);                      // papan
  ctx.fillStyle = "#3f7a8c"; ctx.beginPath(); ctx.ellipse(x, y - 30, 6, 3, 0, 0, 6.28); ctx.fill();   // gambar ikan
  ctx.beginPath(); ctx.moveTo(x + 5, y - 30); ctx.lineTo(x + 9, y - 33); ctx.lineTo(x + 9, y - 27); ctx.fill();
  labelObjek(n, "#8fd3ff", 44);
};
TEKA_BICARA.dermaga = (n) => menuMancing(n, "laut");

function menuMancing(npc, tempat) {
  const n = isiTas().reduce((a, [, k]) => a + k, 0);
  openDialog(npc.name, Lx(tempat === "laut"
    ? ["Ombaknya tenang hari ini. Mau memancing ikan laut?", "The waves are calm today. Want to catch some sea fish?"]
    : ["Mau memancing lagi, Nak? Joranku selalu siap.", "Fishing again, kid? My rod is always ready."]), [
    { label: Lx(["Memancing", "Go fishing"]), primary: true, run: () => { closeDialog(); bukaMancing(tempat); } },
    { label: Lx([`Jual ikan (${n} ekor · ${nilaiTas()} koin)`, `Sell fish (${n} · ${nilaiTas()} coins)`]), disabled: !n, run: () => { jualIkan(); menuMancing(npc, tempat); } },
    { label: t("dlg.tutup"), run: closeDialog },
  ]);
}
function jualIkan() {
  const koin = nilaiTas(); if (!koin) return;
  S.gold += koin; dataIkan().tas = {}; sfx.coin();
  toast(Lx([`Ikan terjual: +${koin} koin`, `Fish sold: +${koin} coins`]), false); refreshHud(true); saveSoon();
}
function bicaraUdin(npc) {
  const D = dataIkan();
  if (!D.sapa) {
    narasi([
      ["udin", Lx(["Hei, pendekar! Kau yang mengusir kabut dari desa, kan? Terima kasih, ikan-ikan mulai berani muncul lagi.", "Hey, hero! You're the one who drove the mist away, right? Thanks to you, the fish are coming back."])],
      ["udin", Lx(["Mau coba memancing? Caranya gampang: lempar kail, tunggu pelampung bergoyang, lalu TARIK!", "Want to try fishing? It's easy: cast, wait for the float to bob, then PULL!"])],
      ["udin", Lx(["Waktu ikannya melawan, TAHAN tombol supaya kotak hijau naik, lepas supaya turun. Jaga ikannya tetap di kotak hijau.", "When the fish fights back, HOLD the button to raise the green box, release to let it fall. Keep the fish inside the green box."])],
      ["udin", Lx(["Kalau di laut Kampung Nelayan, ikannya lebih besar. Ada dermaga di sana. Selamat mencoba!", "Out at sea by Fishermen's Village the fish are bigger. There's a pier there. Good luck!"])],
    ], () => { D.sapa = true; saveSoon(); bukaMancing("sungai"); });
    return;
  }
  menuMancing(npc, "sungai");
}
{
  const bisaAsli = bisaBicara;
  bisaBicara = function (n) { if (n.id === "udin" && eventTerbuka("mancing")) return true; return bisaAsli(n); };
  const talkAsli = talk;
  talk = function (npc, lewat) { if (npc.id === "udin" && eventTerbuka("mancing")) return bicaraUdin(npc); return talkAsli(npc, lewat); };
  const tandaAsli = tandaNpc;
  tandaNpc = function (n) { if (n.id === "udin" && eventTerbuka("mancing") && !(S.ikan && S.ikan.total > 0)) return { mark: "!", warna: "#f4b942" }; return tandaAsli(n); };
}

// ---------- Mini game ----------
let mc = null;   // { tempat, fase, t, ikan, berat, zonaY, zonaV, ikanY, ikanTuju, ikanT, progres, tahan, goyang }
function bukaMancing(tempat) {
  mc = { tempat, fase: "siap", t: 0, progres: 0, tahan: false, zonaY: 0.5, zonaV: 0, ikanY: 0.5, ikanTuju: 0.5, ikanT: 0, goyang: 0, hasil: null };
  mode = "mancing"; showUI(); $("hud").hidden = true;
  $("mancingBox").hidden = false;
  $("mcJudul").textContent = Lx(tempat === "laut" ? ["Memancing di Laut", "Sea Fishing"] : ["Memancing di Sungai", "River Fishing"]);
  aturTombolMc(); pesanMc(Lx(["Tekan tombol untuk melempar kail.", "Press the button to cast your line."]));
  let lalu = performance.now();
  const loop = (now) => {
    if (!mc) return;
    const dt = Math.min(0.05, (now - lalu) / 1000); lalu = now;
    detakMancing(dt); gambarMancing(now / 1000);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
function tutupMancing() {
  mc = null; $("mancingBox").hidden = true;
  mode = "play"; showUI(); $("hud").hidden = false; refreshHud(true); saveSoon();
}
const pesanMc = (teks) => { $("mcPesan").textContent = teks; };
function aturTombolMc() {
  const b = $("btnMcAksi"), f = mc.fase;
  b.textContent = Lx(f === "siap" || f === "hasil" ? [f === "hasil" ? "Lempar lagi" : "Lempar kail", f === "hasil" ? "Cast again" : "Cast line"]
    : f === "tunggu" ? ["Menunggu...", "Waiting..."] : f === "gigit" ? ["TARIK!", "PULL!"] : ["TAHAN untuk menarik", "HOLD to reel"]);
  b.classList.toggle("mc-gigit", f === "gigit");
  b.disabled = f === "tunggu";
}
function pilihIkan(tempat) {
  const daftar = Object.keys(IKAN).filter((id) => IKAN[id].tempat === tempat);
  const total = daftar.reduce((a, id) => a + RAR_IKAN[IKAN[id].rar].bobot / daftar.filter((x) => IKAN[x].rar === IKAN[id].rar).length, 0);
  let r = Math.random() * total;
  for (const id of daftar) { r -= RAR_IKAN[IKAN[id].rar].bobot / daftar.filter((x) => IKAN[x].rar === IKAN[id].rar).length; if (r <= 0) return id; }
  return daftar[0];
}
// tombol aksi ditekan / dilepas
function tekanMc(turun) {
  if (!mc) return;
  if (!turun) { mc.tahan = false; return; }
  if (mc.fase === "siap" || mc.fase === "hasil") {
    mc.fase = "tunggu"; mc.t = 1.8 + Math.random() * 3.6; mc.goyang = 0; mc.hasil = null; sfx.roll();
    pesanMc(Lx(["Kail dilempar... tunggu pelampungnya bergoyang.", "Line cast... wait for the float to bob."]));
  } else if (mc.fase === "gigit") {
    mc.fase = "tarik"; mc.ikan = pilihIkan(mc.tempat); mc.progres = 0.3; mc.zonaY = 0.5; mc.zonaV = 0; mc.ikanY = 0.5; mc.ikanTuju = 0.5; mc.ikanT = 0; mc.tahan = true;
    sfx.hit ? sfx.hit() : sfx.click();
    pesanMc(Lx(["Ikannya melawan! TAHAN untuk menaikkan kotak hijau, lepas untuk turun.", "It's fighting back! HOLD to raise the green box, release to lower it."]));
  } else if (mc.fase === "tarik") mc.tahan = true;
  aturTombolMc();
}
function detakMancing(dt) {
  const m = mc;
  if (m.fase === "tunggu") {
    m.t -= dt; m.goyang = Math.max(0, m.goyang - dt);
    if (Math.random() < dt * 0.6) m.goyang = 0.25;   // gigitan kecil (pengecoh)
    if (m.t <= 0) { m.fase = "gigit"; m.t = 0.95; sfx.zap ? sfx.zap() : sfx.click(); pesanMc(Lx(["Ada yang menggigit! TARIK sekarang!", "Something's biting! PULL now!"])); aturTombolMc(); }
  } else if (m.fase === "gigit") {
    m.t -= dt;
    if (m.t <= 0) { m.fase = "siap"; pesanMc(Lx(["Terlambat... ikannya kabur. Coba lagi!", "Too slow... it got away. Try again!"])); aturTombolMc(); }
  } else if (m.fase === "tarik") {
    const R = RAR_IKAN[IKAN[m.ikan].rar], tinggi = R.zona;
    // kotak hijau: naik saat ditahan, jatuh saat dilepas
    m.zonaV += (m.tahan ? 2.6 : -2.2) * dt; m.zonaV *= Math.pow(0.25, dt);
    m.zonaY = clamp(m.zonaY + m.zonaV * dt, tinggi / 2, 1 - tinggi / 2);
    if (m.zonaY <= tinggi / 2 || m.zonaY >= 1 - tinggi / 2) m.zonaV *= -0.3;
    // ikan: pindah ke titik acak, makin langka makin cepat & sering
    m.ikanT -= dt;
    if (m.ikanT <= 0) { m.ikanT = R.liar * (0.5 + Math.random()); m.ikanTuju = 0.08 + Math.random() * 0.84; }
    m.ikanY += clamp(m.ikanTuju - m.ikanY, -1, 1) * Math.min(1, R.cepat * 3 * dt);
    const masuk = Math.abs(m.ikanY - m.zonaY) < tinggi / 2;
    m.progres = clamp(m.progres + (masuk ? 0.32 : -0.24) * dt, 0, 1);
    if (m.progres >= 1) dapatIkan(m.ikan);
    else if (m.progres <= 0) { m.fase = "siap"; sfx.click(); pesanMc(Lx(["Talinya mengendur... ikannya lepas. Coba lagi!", "The line went slack... it escaped. Try again!"])); aturTombolMc(); }
  }
}
function dapatIkan(id) {
  const F = IKAN[id], D = dataIkan(), berat = +(F.berat[0] + Math.random() * (F.berat[1] - F.berat[0])).toFixed(2);
  D.tas[id] = (D.tas[id] || 0) + 1; D.total = (D.total || 0) + 1;
  const k = D.koleksi[id] = D.koleksi[id] || { n: 0, berat: 0 };
  const baru = k.n === 0, rekor = berat > k.berat;
  k.n++; if (rekor) k.berat = berat;
  mc.fase = "hasil"; mc.hasil = { id, berat };
  pesanMc(`${Lx(["Dapat", "Caught"])}: ${namaIkan(id)} (${berat} kg)${baru ? " · " + Lx(["BARU!", "NEW!"]) : rekor ? " · " + Lx(["Rekor!", "Record!"]) : ""}`);
  if (F.rar !== "biasa") toast(`${F.rar === "legenda" ? "✦ " : ""}${namaIkan(id)}!`, true);
  sfx.level ? sfx.level() : sfx.coin(); tambahStat("ikan"); aturTombolMc(); saveSoon();
}

// ---------- Gambar ----------
function gambarMancing(time) {
  const cv = $("mcKanvas"), c = cv.getContext("2d"), W2 = cv.width, H2 = cv.height, m = mc;
  const laut = m.tempat === "laut";
  // pemandangan: langit, air, tepi
  const g = c.createLinearGradient(0, 0, 0, H2);
  g.addColorStop(0, laut ? "#8fd3ff" : "#9fd6a8"); g.addColorStop(0.35, laut ? "#cfe9ff" : "#d8efd0"); g.addColorStop(0.36, laut ? "#2d6a96" : "#3d7a6c"); g.addColorStop(1, laut ? "#123a5c" : "#1f4a40");
  c.fillStyle = g; c.fillRect(0, 0, W2, H2);
  c.strokeStyle = "rgba(255,255,255,0.18)"; c.lineWidth = 2;
  for (let i = 0; i < 6; i++) { const y = 130 + i * 28, o = Math.sin(time * 1.5 + i) * 20; c.beginPath(); c.moveTo(20 + o, y); c.lineTo(160 + o, y); c.moveTo(260 - o, y + 12); c.lineTo(400 - o, y + 12); c.stroke(); }
  c.fillStyle = laut ? "#c9a96e" : "#5a8f3c"; c.fillRect(0, H2 - 40, 140, 40);
  // pemancing (hero) di tepi kiri bawah
  c.save(); c.translate(70, H2 - 34); c.scale(1.3, 1.3);
  const Cls = CLASSES[S.cls];
  drawPerson(c, { x: 0, y: 0, face: -0.6, run: 0, moving: false, swing: 0, inv: 0, flash: 0 }, { color: Cls.color, accent: Cls.accent, hair: Cls.hair, hat: Cls.hat }, time, { preview: true });
  c.restore();
  // joran & tali ke pelampung
  const px = 320, dasar = 150, gigit = m.fase === "gigit", goy = m.fase === "tunggu" ? Math.sin(time * 4) * 2 + (m.goyang > 0 ? Math.sin(time * 40) * 4 : 0) : gigit ? Math.sin(time * 50) * 7 + 6 : 0;
  const tarik = m.fase === "tarik";
  c.strokeStyle = "#7a4a26"; c.lineWidth = 4; c.beginPath(); c.moveTo(86, H2 - 70); c.lineTo(150, H2 - 170); c.stroke();
  if (m.fase !== "siap" && m.fase !== "hasil") {
    const py = dasar + goy + (tarik ? Math.sin(time * 9) * 6 : 0);
    c.strokeStyle = "rgba(255,255,255,0.7)"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(150, H2 - 170); c.quadraticCurveTo(240, tarik ? 80 : 120, px, py - 6); c.stroke();
    c.fillStyle = "#e5484d"; c.beginPath(); c.arc(px, py - 6, 6, Math.PI, 0); c.fill();
    c.fillStyle = "#f7efe3"; c.beginPath(); c.arc(px, py - 6, 6, 0, Math.PI); c.fill();
    if (gigit || m.goyang > 0) { c.strokeStyle = "rgba(255,255,255,0.6)"; c.beginPath(); c.ellipse(px, py, 16 + (time * 30) % 12, 5, 0, 0, 6.28); c.stroke(); }
    if (gigit) { c.fillStyle = "#f4b942"; c.font = "700 38px Teko, sans-serif"; c.textAlign = "center"; c.fillText("!", px, py - 22); }
  }
  // hasil tangkapan
  if (m.fase === "hasil" && m.hasil) {
    const F = IKAN[m.hasil.id], R = RAR_IKAN[F.rar];
    c.fillStyle = "rgba(10,6,20,0.7)"; c.fillRect(170, 40, 260, 110);
    gambarIkan(c, 300, 80, 1.6, F.rar, time);
    c.textAlign = "center"; c.fillStyle = R.warna; c.font = "700 26px Teko, sans-serif"; c.fillText(namaIkan(m.hasil.id), 300, 125);
    c.fillStyle = "#f7efe3"; c.font = "700 13px Nunito, sans-serif"; c.fillText(`${m.hasil.berat} kg · ${Lx(["harga", "value"])} ${F.harga}`, 300, 143);
  }
  // meter tarik-ulur (kanan)
  const mx = W2 - 70, my = 18, mh = H2 - 36;
  c.fillStyle = "rgba(10,6,20,0.75)"; c.fillRect(mx - 6, my - 6, 46, mh + 12);
  c.fillStyle = "#1b2a3a"; c.fillRect(mx, my, 22, mh);
  if (tarik) {
    const R = RAR_IKAN[IKAN[m.ikan].rar], zy = my + (1 - m.zonaY) * mh, zh = R.zona * mh;
    const masuk = Math.abs(m.ikanY - m.zonaY) < R.zona / 2;
    c.fillStyle = masuk ? "rgba(90,209,122,0.85)" : "rgba(90,209,122,0.5)"; c.fillRect(mx, zy - zh / 2, 22, zh);
    gambarIkan(c, mx + 11, my + (1 - m.ikanY) * mh, 0.7, IKAN[m.ikan].rar, time);
    c.fillStyle = "#2b2238"; c.fillRect(mx + 28, my, 8, mh);
    c.fillStyle = m.progres > 0.66 ? "#5ad17a" : m.progres > 0.33 ? "#f4b942" : "#e5484d"; c.fillRect(mx + 28, my + mh * (1 - m.progres), 8, mh * m.progres);
  } else { c.fillStyle = "rgba(247,239,227,0.35)"; c.font = "700 12px Nunito, sans-serif"; c.textAlign = "center"; c.save(); c.translate(mx + 17, my + mh / 2); c.rotate(-Math.PI / 2); c.fillText(Lx(["TARIK-ULUR", "REEL METER"]), 0, 4); c.restore(); }
}
function gambarIkan(c, x, y, s, rar, time) {
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(Math.sin(time * 6) * 0.12);
  c.fillStyle = rar === "legenda" ? "#f4b942" : rar === "langka" ? "#e86a5a" : "#9fb4c8";
  c.beginPath(); c.ellipse(0, 0, 14, 7, 0, 0, 6.28); c.fill();
  c.beginPath(); c.moveTo(12, 0); c.lineTo(22, -8); c.lineTo(22, 8); c.closePath(); c.fill();
  c.fillStyle = "#1b1208"; c.beginPath(); c.arc(-8, -2, 1.8, 0, 6.28); c.fill();
  if (rar === "legenda") { c.strokeStyle = "rgba(255,240,180,0.8)"; c.lineWidth = 1.5; c.beginPath(); c.arc(0, 0, 18 + Math.sin(time * 5) * 2, 0, 6.28); c.stroke(); }
  c.restore();
}

// ---------- Kontrol: tombol (tahan), kanvas (tahan), Spasi/Enter (tahan), Esc ----------
{
  const b = $("btnMcAksi"), cv = $("mcKanvas");
  for (const el of [b, cv]) {
    el.addEventListener("pointerdown", (e) => { e.preventDefault(); tekanMc(true); });
    el.addEventListener("pointerup", () => tekanMc(false));
    el.addEventListener("pointerleave", () => tekanMc(false));
    el.addEventListener("pointercancel", () => tekanMc(false));
  }
  $("btnMcTutup").addEventListener("click", () => { sfx.click(); tutupMancing(); });
  addEventListener("keydown", (e) => {
    if (mode !== "mancing") return;
    e.stopImmediatePropagation();
    if (e.key === "Escape") return tutupMancing();
    if ((e.key === " " || e.key === "Enter" || ACTION_OF[keyName(e)] === "serang") && !e.repeat) { e.preventDefault(); tekanMc(true); }
  }, true);
  addEventListener("keyup", (e) => { if (mode === "mancing" && (e.key === " " || e.key === "Enter" || ACTION_OF[keyName(e)] === "serang")) tekanMc(false); }, true);
}

// ---------- Event & pencapaian ----------
daftarkanEvent({
  id: "mancing", npc: "udin", area: "desa", titik: { x: 19.2, y: 17.4 },
  judul: ["Memancing", "Fishing"], sub: ["Bersama Pak Udin · Sungai & Laut", "With Pak Udin · River & Sea"],
  ringkas: ["Lempar kail, tunggu gigitan, lalu menangkan tarik-ulur!", "Cast, wait for a bite, then win the tug-of-war!"],
  isi: [
    "Pak Udin, pemancing Desa Wanasari, meminjamkan jorannya. Tangkap 10 jenis ikan di sungai desa dan di dermaga Kampung Nelayan, dari Wader sampai Ikan Dewa yang legendaris. Jual tangkapanmu untuk koin dan lengkapi koleksimu.",
    "Pak Udin, Wanasari's fisherman, lends you his rod. Catch 10 kinds of fish in the village river and at the Fishermen's Village pier, from Wader to the legendary Sacred Mahseer. Sell your catch for coins and complete your collection.",
  ],
  syarat: () => { const i = CERITA.findIndex((l) => l.buka === "kapal"); return S.cerita.idx > i; },
  syaratTeks: ["Selesaikan cerita Dunia 1 (Bab 2)", "Finish the World 1 story (Chapter 2)"],
  judulHadiah: ["Koleksi ikan", "Fish collection"],
  hadiah: () => { const K = (S.ikan && S.ikan.koleksi) || {}; return Object.keys(IKAN).map((id) => { const k = K[id]; return `<li class="${k ? "dapat" : ""}">${k ? `✓ <b>${namaIkan(id)}</b> — ${Lx(["rekor", "record"])} ${k.berat} kg` : `??? <small>(${Lx(IKAN[id].tempat === "laut" ? ["laut", "sea"] : ["sungai", "river"])} · ${Lx(IKAN[id].rar === "biasa" ? ["biasa", "common"] : IKAN[id].rar === "langka" ? ["langka", "rare"] : ["legenda", "legendary"])})</small>`}</li>`; }).join(""); },
  trailer: (c, tm) => {
    const W2 = 480, H2 = 240, g = c.createLinearGradient(0, 0, 0, H2);
    g.addColorStop(0, "#8fd3ff"); g.addColorStop(0.4, "#cfe9ff"); g.addColorStop(0.41, "#2d6a96"); g.addColorStop(1, "#123a5c");
    c.fillStyle = g; c.fillRect(0, 0, W2, H2);
    const s = tm % 5, py = 140 + (s > 2 && s < 3 ? Math.sin(tm * 40) * 6 : Math.sin(tm * 3) * 2);
    c.strokeStyle = "#7a4a26"; c.lineWidth = 4; c.beginPath(); c.moveTo(60, 230); c.lineTo(120, 70); c.stroke();
    c.strokeStyle = "rgba(255,255,255,0.7)"; c.lineWidth = 1.2; c.beginPath(); c.moveTo(120, 70); c.quadraticCurveTo(220, 90, 300, py - 6); c.stroke();
    c.fillStyle = "#e5484d"; c.beginPath(); c.arc(300, py - 6, 6, Math.PI, 0); c.fill(); c.fillStyle = "#f7efe3"; c.beginPath(); c.arc(300, py - 6, 6, 0, Math.PI); c.fill();
    if (s > 3) { const k = (s - 3) / 2, fx = 300 + k * 60, fy = 150 - Math.sin(k * Math.PI) * 90; gambarIkan(c, fx, fy, 2, k > 0.5 ? "legenda" : "langka", tm); }
    if (s > 2 && s < 3) { c.fillStyle = "#f4b942"; c.font = "700 40px Teko, sans-serif"; c.textAlign = "center"; c.fillText("!", 300, py - 24); }
  },
  mulai: (npc) => bicaraUdin(npc),
});
const jumlahJenisIkan = () => Object.keys((S.ikan && S.ikan.koleksi) || {}).length;
daftarkanCapai({ id: "ikanPertama", kat: "koleksi", judul: ["Strike!", "Strike!"], desc: ["Tangkap ikan pertamamu.", "Catch your first fish."], hadiah: HDH(50), progres: () => [(S.ikan && S.ikan.total) || 0, 1] });
daftarkanCapai({ id: "ikan50", kat: "koleksi", judul: ["Pemancing Sabar", "Patient Angler"], desc: ["Tangkap 50 ikan.", "Catch 50 fish."], hadiah: HDH(250, 3), progres: () => [(S.ikan && S.ikan.total) || 0, 50] });
daftarkanCapai({ id: "ikanLengkap", kat: "koleksi", judul: ["Ensiklopedia Ikan", "Fish Encyclopedia"], desc: ["Tangkap semua 10 jenis ikan.", "Catch all 10 kinds of fish."], hadiah: HDH(600, 6), progres: () => [jumlahJenisIkan(), Object.keys(IKAN).length] });
daftarkanCapai({ id: "ikanLegenda", kat: "rahasia", rahasia: true, judul: ["Penakluk Legenda Air", "Legend of the Waters"], desc: ["Tangkap ikan legenda (Arwana Emas atau Ikan Dewa).", "Catch a legendary fish (Golden Arowana or Sacred Mahseer)."], hadiah: HDH(300, 5), syarat: () => ["arwana", "ikanDewa"].some((id) => S.ikan && S.ikan.koleksi[id]) });
