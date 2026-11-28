// =====================================================================
// EVENT MEMANCING (mini game)
//  - Pak Udin, pemancing di tepi sungai Desa Wanasari, meminjamkan joran (ikan sungai).
//  - Spot memancing lain (papan pancing / lubang es) di 10 tempat: 99kb-spot-mancing.js.
//  - Data 85 ikan & spot: 99ka-data-ikan.js. Koleksi ikan: Menu › Gameplay (99kc-koleksi-ikan.js).
//  - Terbuka bersama event catur (akhir Bab 2) dan tampil di popup Event.
// Memancing langsung di dunia game (hero di tepi air, pelampung di petak air sungguhan).
// Cara main (mode "mancing"):
//  1. Lempar kail → tunggu pelampung bergoyang (beberapa detik).
//  2. "Ada yang menggigit!" → tekan TARIK secepatnya (kurang dari 1 detik).
//  3. Tarik-ulur: TAHAN tombol untuk menaikkan kotak hijau, lepas untuk turun.
//     Jaga ikan tetap di dalam kotak hijau sampai bar tangkapan penuh.
//     Ikan langka & legenda bergerak lebih liar, kotaknya lebih kecil.
// Beberapa ikan hanya muncul pada waktu/cuaca tertentu (IKAN[id].syarat).
// Ikan disimpan di tas (dijual ke Pak Udin / spot mana pun) dan tercatat di koleksi.
// Simpanan: S.ikan = { tas: { id: jumlah }, koleksi: { id: { n, berat } }, total }
// =====================================================================
"use strict";

const dataIkan = () => (S.ikan = S.ikan || { tas: {}, koleksi: {}, total: 0 });
const namaIkan = (id) => Lx(IKAN[id].nama);
const isiTas = () => Object.entries(dataIkan().tas).filter(([, n]) => n > 0);
const nilaiTas = () => isiTas().reduce((a, [id, n]) => a + IKAN[id].harga * n, 0);

// ---------- NPC & dermaga ----------
NPC_DATA.push({ id: "udin", name: "Pak Udin", area: "desa", x: 20.2 * T, y: 17.2 * T, color: "#3f7a8c", accent: "#e9d3a9", hat: "#c9a25a", hair: "#2b2238", face: 0,
  obrolan: ["Sungai ini dulu penuh ikan. Sejak kabut merah, ikannya bersembunyi.", "Sabar itu kunci memancing, Nak. Sama seperti bertarung."],
  obrolanEn: ["This river used to be full of fish. Since the red mist, they've been hiding.", "Patience is the key to fishing, kid. Same as fighting."] });
function menuMancing(npc, tempat) {
  const n = isiTas().reduce((a, [, k]) => a + k, 0);
  openDialog(npc.name, Lx(tempat === "laut"
    ? ["Ombaknya tenang hari ini. Mau memancing ikan laut?", "The waves are calm today. Want to catch some sea fish?"]
    : tempat !== "sungai" ? ["Tempat yang bagus untuk memancing. Mau melempar kail?", "A fine spot for fishing. Want to cast a line?"]
    : ["Mau memancing lagi, Nak? Joranku selalu siap.", "Fishing again, kid? My rod is always ready."]) + infoSpotIkan(tempat), [
    { label: Lx(["Memancing", "Go fishing"]), primary: true, run: () => { closeDialog(); bukaMancing(tempat); } },
    { label: Lx([`Jual ikan (${n} ekor · ${nilaiTas()} koin)`, `Sell fish (${n} · ${nilaiTas()} coins)`]), disabled: !n, run: () => { jualIkan(); menuMancing(npc, tempat); } },
    { label: t("dlg.tutup"), run: closeDialog },
  ]);
}
// "Ikan di sini: 3 / 8 ditemukan" + ikan yang sedang bisa muncul (waktu/cuaca)
function infoSpotIkan(tempat) {
  const ids = Object.keys(IKAN).filter((id) => IKAN[id].tempat === tempat), K = dataIkan().koleksi;
  return " " + Lx([`Ikan di ${Lx(SPOT_MANCING[tempat].nama)}: ${ids.filter((id) => K[id]).length} / ${ids.length} ditemukan.`,
    `Fish at ${Lx(SPOT_MANCING[tempat].nama)}: ${ids.filter((id) => K[id]).length} / ${ids.length} found.`]);
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
      ["udin", Lx(["Tiap tempat punya ikannya sendiri. Hampir tiap desa punya tempat memancing: dermaga, teluk, kolam di Kampung Awan, sampai lubang es di Pondok Nini Embun. Lihat ikon ikan biru di peta. Ada yang cuma muncul pagi, malam hari, waktu hujan, atau waktu salju turun.", "Every place has its own fish. Nearly every village has a fishing spot: piers, a bay, a pond in the Cloud Village, even an ice hole at Nini Embun's Lodge. Check the blue fish icons on the map. Some only show up in the morning, at night, in the rain, or when it snows."])],
      ["udin", Lx(["Semua ikan yang pernah kau tangkap tercatat di Menu › Gameplay › Koleksi Ikan. Selamat mencoba!", "Every fish you catch is recorded in Menu › Gameplay › Fish Collection. Good luck!"])],
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

// ---------- Mini game (langsung di dunia game, bukan kotak popup) ----------
// Hero berdiri di tepi air, kail dilempar ke petak air sungguhan di depannya.
// HUD memancing: pesan di atas, kartu hasil, meter tarik-ulur di kanan, tombol aksi besar.
let mc = null;   // { tempat, fase, t, kunci, ikan, zonaY, zonaV, ikanY, ikanTuju, ikanT, progres, tahan, goyang, bx, by, hasil, terbang }
function titikPelampung() {
  const px = P.x / T, py = P.y / T;
  let terbaik = null, nilai = 1e9;
  for (let y = Math.floor(py) - 6; y <= Math.floor(py) + 6; y++) for (let x = Math.floor(px) - 6; x <= Math.floor(px) + 6; x++) {
    if (tileAt(x, y) !== WATER) continue;
    const d = Math.hypot(x + 0.5 - px, y + 0.5 - py), v = Math.abs(d - 2.6);   // paling enak ±2,6 petak dari hero
    if (d >= 1.1 && v < nilai) { nilai = v; terbaik = { x: (x + 0.5) * T, y: (y + 0.5) * T }; }
  }
  return terbaik;
}
function bukaMancing(tempat) {
  const titik = titikPelampung();
  if (!titik) { toast(Lx(["Tidak ada air di dekat sini.", "There's no water nearby."]), false); return; }
  mc = { tempat, fase: "siap", t: 0, kunci: 0, progres: 0, tahan: false, zonaY: 0.5, zonaV: 0, ikanY: 0.5, ikanTuju: 0.5, ikanT: 0, goyang: 0, hasil: null, terbang: 0, bx: titik.x, by: titik.y };
  P.face = Math.atan2(titik.y - P.y, titik.x - P.x); P.moving = false;
  mode = "mancing"; showUI();
  $("mcHud").hidden = false; $("mcHasil").hidden = true;
  aturTombolMc(); pesanMc(Lx(["Tekan tombol untuk melempar kail.", "Press the button to cast your line."]) + (isTouch ? "" : " " + Lx(["(Spasi)", "(Space)"])));
  let lalu = performance.now();
  const loop = (now) => {
    if (!mc) return;
    const dt = Math.min(0.05, (now - lalu) / 1000); lalu = now;
    detakMancing(dt); gambarMeter(now / 1000);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
function tutupMancing() {
  mc = null; $("mcHud").hidden = true;
  if (mode === "mancing") { mode = "play"; showUI(); }
  refreshHud(true); saveSoon();
}
const pesanMc = (teks) => { $("mcPesan").textContent = teks; };
function aturTombolMc() {
  const b = $("btnMcAksi"), f = mc.fase;
  b.textContent = Lx(f === "siap" ? ["Lempar", "Cast"] : f === "hasil" ? ["Lempar lagi", "Cast again"]
    : f === "tunggu" ? ["Tunggu...", "Wait..."] : f === "gigit" ? ["TARIK!", "PULL!"] : ["TAHAN", "HOLD"]);
  b.classList.toggle("mc-gigit", f === "gigit");
  b.classList.toggle("mc-tunggu", f === "tunggu" || mc.kunci > 0);
  $("mcMeter").hidden = f !== "tarik";
}
// syarat waktu/cuaca terpenuhi sekarang?
function syaratIkanOk(id) {
  const q = IKAN[id].syarat; if (!q) return true;
  if (q.waktu && faseHari() !== q.waktu) return false;
  if (q.cuaca) {
    const c = typeof cuacaKini === "function" ? cuacaKini() : null;
    if (q.cuaca === "hujan" && !["gerimis", "hujan", "hujanPetir", "badai"].includes(c)) return false;
    if (q.cuaca === "salju" && !["salju", "badaiSalju"].includes(c)) return false;
  }
  return true;
}
function pilihIkan(tempat) {
  const daftar = Object.keys(IKAN).filter((id) => IKAN[id].tempat === tempat && syaratIkanOk(id));
  const bobot = (id) => RAR_IKAN[IKAN[id].rar].bobot / daftar.filter((x) => IKAN[x].rar === IKAN[id].rar).length;
  let r = Math.random() * daftar.reduce((a, id) => a + bobot(id), 0);
  for (const id of daftar) { r -= bobot(id); if (r <= 0) return id; }
  return daftar[0];
}
// tombol aksi ditekan / dilepas
function tekanMc(turun) {
  if (!mc) return;
  if (!turun) { mc.tahan = false; return; }
  if (mc.kunci > 0) return;   // jeda singkat setelah dapat/lepas ikan: tekanan beruntun (spam) diabaikan
  if (mc.fase === "siap" || mc.fase === "hasil") {
    mc.fase = "tunggu"; mc.t = 1.8 + Math.random() * 3.6; mc.goyang = 0; mc.hasil = null; $("mcHasil").hidden = true; sfx.roll();
    pesanMc(Lx(["Kail dilempar... tunggu sampai ada yang menggigit. Jangan ditarik dulu!", "Line cast... wait for a bite. Don't pull yet!"]));
  } else if (mc.fase === "tunggu") {   // menarik terlalu cepat: ikan kaget & kabur (supaya tidak asal tekan)
    mc.fase = "siap"; mc.kunci = 0.8; sfx.click();
    pesanMc(Lx(["Terlalu cepat! Ikannya kaget dan kabur. Tunggu sampai ada tanda “!”.", "Too soon! The fish got spooked. Wait for the “!” sign."]));
  } else if (mc.fase === "gigit") {
    mc.fase = "tarik"; mc.ikan = pilihIkan(mc.tempat); mc.progres = 0.3; mc.zonaY = 0.5; mc.zonaV = 0; mc.ikanY = 0.5; mc.ikanTuju = 0.5; mc.ikanT = 0; mc.tahan = true;
    sfx.hit ? sfx.hit() : sfx.click();
    pesanMc(Lx(["Ikannya melawan! TAHAN untuk menaikkan kotak hijau, lepas untuk turun.", "It's fighting back! HOLD to raise the green box, release to lower it."]));
  } else if (mc.fase === "tarik") mc.tahan = true;
  aturTombolMc();
}
function detakMancing(dt) {
  const m = mc;
  if (m.kunci > 0) { m.kunci -= dt; if (m.kunci <= 0) aturTombolMc(); }
  if (m.terbang > 0) m.terbang = Math.max(0, m.terbang - dt);
  if (m.fase === "tunggu") {
    m.t -= dt; m.goyang = Math.max(0, m.goyang - dt);
    if (Math.random() < dt * 0.6) m.goyang = 0.25;   // gigitan kecil (pengecoh)
    if (m.t <= 0) { m.fase = "gigit"; m.t = 0.95; sfx.zap ? sfx.zap() : sfx.click(); pesanMc(Lx(["Ada yang menggigit! TARIK sekarang!", "Something's biting! PULL now!"])); aturTombolMc(); }
  } else if (m.fase === "gigit") {
    m.t -= dt;
    if (m.t <= 0) { m.fase = "siap"; m.kunci = 0.6; pesanMc(Lx(["Terlambat... ikannya kabur. Coba lagi!", "Too slow... it got away. Try again!"])); aturTombolMc(); }
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
    else if (m.progres <= 0) { m.fase = "siap"; m.kunci = 0.6; m.tahan = false; sfx.click(); pesanMc(Lx(["Talinya mengendur... ikannya lepas. Coba lagi!", "The line went slack... it escaped. Try again!"])); aturTombolMc(); }
  }
}
function dapatIkan(id) {
  const F = IKAN[id], D = dataIkan(), berat = +(F.berat[0] + Math.random() * (F.berat[1] - F.berat[0])).toFixed(2);
  D.tas[id] = (D.tas[id] || 0) + 1; D.total = (D.total || 0) + 1;
  const k = D.koleksi[id] = D.koleksi[id] || { n: 0, berat: 0 };
  const baru = k.n === 0, rekor = !baru && berat > k.berat;
  k.n++; if (berat > k.berat) k.berat = berat;
  mc.fase = "hasil"; mc.hasil = { id, berat }; mc.kunci = 1.4; mc.tahan = false; mc.terbang = 0.8;
  // kartu hasil: tetap tampil sampai melempar lagi (tidak hilang walau tombol ditekan beruntun)
  const R = RAR_IKAN[F.rar], label = F.rar === "biasa" ? ["Biasa", "Common"] : F.rar === "langka" ? ["Langka", "Rare"] : ["Legenda", "Legendary"];
  $("mcHasil").innerHTML = `<small>${Lx(["Kamu mendapat", "You caught"])}</small><b style="color:${R.warna}">${namaIkan(id)}</b>
    <span>${berat} kg · ${Lx(label)} · ${Lx(["harga", "value"])} ${F.harga}</span>${baru ? `<i>${Lx(["IKAN BARU!", "NEW FISH!"])}</i>` : rekor ? `<i>${Lx(["REKOR BARU!", "NEW RECORD!"])}</i>` : ""}`;
  $("mcHasil").hidden = false;
  pesanMc(Lx([`Tas ikan: ${isiTas().reduce((a, [, n]) => a + n, 0)} ekor · jual ke Pak Udin atau di spot memancing mana pun.`, `Fish bag: ${isiTas().reduce((a, [, n]) => a + n, 0)} · sell to Pak Udin or at any fishing spot.`]));
  if (F.rar !== "biasa") toast(`${F.rar === "legenda" ? "✦ " : ""}${namaIkan(id)}!`, true);
  sfx.level ? sfx.level() : sfx.coin(); tambahStat("ikan"); aturTombolMc(); saveSoon();
}

// ---------- Gambar di dunia: joran, tali, pelampung, ikan yang terangkat ----------
GAMBAR_ATAS.push(function (time) {
  if (!mc || !P) return;
  const m = mc, f = P.face, ujung = { x: P.x + Math.cos(f) * 34, y: P.y - 46 + Math.sin(f) * 12 };
  ctx.strokeStyle = "#7a4a26"; ctx.lineWidth = 3; ctx.lineCap = "round";
  ctx.beginPath(); ctx.moveTo(P.x + Math.cos(f) * 8, P.y - 26); ctx.lineTo(ujung.x, ujung.y); ctx.stroke();
  if (m.fase === "tunggu" || m.fase === "gigit" || m.fase === "tarik") {
    const gigit = m.fase === "gigit", tarik = m.fase === "tarik";
    const goy = m.fase === "tunggu" ? Math.sin(time * 4) * 1.5 + (m.goyang > 0 ? Math.sin(time * 40) * 3 : 0) : gigit ? Math.sin(time * 50) * 5 + 4 : Math.sin(time * 9) * 4;
    const bx = m.bx + (tarik ? Math.sin(time * 3) * 10 : 0), by = m.by + goy;
    ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(ujung.x, ujung.y); ctx.quadraticCurveTo((ujung.x + bx) / 2, Math.max(ujung.y, by) + (tarik ? -4 : 14), bx, by - 4); ctx.stroke();
    ctx.strokeStyle = `rgba(255,255,255,${gigit || m.goyang > 0 ? 0.7 : 0.3})`; ctx.beginPath(); ctx.ellipse(bx, by + 2, 10 + (time * 24) % 10, 4, 0, 0, 6.28); ctx.stroke();
    ctx.fillStyle = "#e5484d"; ctx.beginPath(); ctx.arc(bx, by - 4, 5, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "#f7efe3"; ctx.beginPath(); ctx.arc(bx, by - 4, 5, 0, Math.PI); ctx.fill();
    if (gigit) { ctx.fillStyle = "#f4b942"; ctx.strokeStyle = "#1b1208"; ctx.lineWidth = 3; ctx.font = "700 34px Teko, sans-serif"; ctx.textAlign = "center"; ctx.strokeText("!", bx, by - 16); ctx.fillText("!", bx, by - 16); }
  }
  // ikan terangkat dari air ke tangan hero
  if (m.terbang > 0 && m.hasil) {
    const k = 1 - m.terbang / 0.8, x = m.bx + (P.x - m.bx) * k, y = m.by + (P.y - 50 - m.by) * k - Math.sin(k * Math.PI) * 60;
    gambarIkan(ctx, x, y, 1.1, m.hasil.id, time);
  }
});
// meter tarik-ulur (HUD, kanvas kecil di kanan layar)
function gambarMeter(time) {
  const m = mc, cv = $("mcMeter"); if (cv.hidden || m.fase !== "tarik") return;
  const c = cv.getContext("2d"), w = cv.width, h = cv.height, my = 8, mh = h - 16, mx = 8;
  c.clearRect(0, 0, w, h);
  c.fillStyle = "rgba(10,6,20,0.8)"; c.fillRect(0, 0, w, h);
  c.fillStyle = "#1b2a3a"; c.fillRect(mx, my, 26, mh);
  const R = RAR_IKAN[IKAN[m.ikan].rar], zy = my + (1 - m.zonaY) * mh, zh = R.zona * mh;
  const masuk = Math.abs(m.ikanY - m.zonaY) < R.zona / 2;
  c.fillStyle = masuk ? "rgba(90,209,122,0.9)" : "rgba(90,209,122,0.5)"; c.fillRect(mx, zy - zh / 2, 26, zh);
  gambarIkan(c, mx + 13, my + (1 - m.ikanY) * mh, 0.75, m.ikan, time);
  c.fillStyle = "#2b2238"; c.fillRect(mx + 34, my, 10, mh);
  c.fillStyle = m.progres > 0.66 ? "#5ad17a" : m.progres > 0.33 ? "#f4b942" : "#e5484d"; c.fillRect(mx + 34, my + mh * (1 - m.progres), 10, mh * m.progres);
}
// id ikan → digambar sesuai rupanya (99kc-koleksi-ikan.js); "biasa"/"langka"/"legenda" → ikan umum
function gambarIkan(c, x, y, s, rar, time) {
  if (IKAN[rar] && typeof gambarRupaIkan === "function") return gambarRupaIkan(c, x, y, s, rar, time);
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(Math.sin(time * 6) * 0.12);
  c.fillStyle = rar === "legenda" ? "#f4b942" : rar === "langka" ? "#e86a5a" : "#9fb4c8";
  c.beginPath(); c.ellipse(0, 0, 14, 7, 0, 0, 6.28); c.fill();
  c.beginPath(); c.moveTo(12, 0); c.lineTo(22, -8); c.lineTo(22, 8); c.closePath(); c.fill();
  c.fillStyle = "#1b1208"; c.beginPath(); c.arc(-8, -2, 1.8, 0, 6.28); c.fill();
  if (rar === "legenda") { c.strokeStyle = "rgba(255,240,180,0.8)"; c.lineWidth = 1.5; c.beginPath(); c.arc(0, 0, 18 + Math.sin(time * 5) * 2, 0, 6.28); c.stroke(); }
  c.restore();
}
// selama memancing: HUD biasa tetap tampil, tombol sentuh & bar jurus disembunyikan
{
  const showUIAsli = showUI;
  showUI = function () { showUIAsli(); if (mode === "mancing") { ui.touch.hidden = true; ui.skills.hidden = true; } };
}

// ---------- Kontrol: tombol (tahan), Spasi/Enter/serang (tahan), Esc = selesai ----------
{
  const b = $("btnMcAksi");
  b.addEventListener("pointerdown", (e) => { e.preventDefault(); tekanMc(true); });
  for (const ev of ["pointerup", "pointerleave", "pointercancel"]) b.addEventListener(ev, () => tekanMc(false));
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
  judul: ["Memancing", "Fishing"], sub: ["Bersama Pak Udin · 10 spot memancing", "With Pak Udin · 10 fishing spots"],
  ringkas: ["Lempar kail, tunggu gigitan, lalu menangkan tarik-ulur!", "Cast, wait for a bite, then win the tug-of-war!"],
  isi: [
    "Pak Udin, pemancing Desa Wanasari, meminjamkan jorannya. Ada 85 jenis ikan (50 biasa, 25 langka, 10 legenda) di 10 spot memancing, tersebar di desa-desa Dunia 1–6, dari sungai Wanasari sampai lubang es di Pondok Nini Embun (ditandai ikon ikan biru di peta). Sebagian hanya muncul pagi, malam hari, saat hujan, atau saat salju turun. Jual tangkapanmu untuk koin dan lengkapi koleksimu di Menu › Gameplay › Koleksi Ikan.",
    "Pak Udin, Wanasari's fisherman, lends you his rod. There are 85 kinds of fish (50 common, 25 rare, 10 legendary) across 10 fishing spots, spread across the villages of Worlds 1–6, from the Wanasari river to an ice hole at Nini Embun's Lodge (marked with blue fish icons on the map). Some only appear in the morning, at night, in the rain, or when it snows. Sell your catch for coins and complete your collection in Menu › Gameplay › Fish Collection.",
  ],
  syarat: () => { const i = CERITA.findIndex((l) => l.buka === "kapal"); return S.cerita.idx > i; },
  syaratTeks: ["Selesaikan cerita Dunia 1 (Bab 2)", "Finish the World 1 story (Chapter 2)"],
  judulHadiah: ["Koleksi ikan", "Fish collection"],
  hadiah: () => {   // daftar lengkap ada di Menu › Gameplay › Koleksi Ikan (99kc)
    const K = (S.ikan && S.ikan.koleksi) || {}, ids = Object.keys(IKAN);
    const baris = ["biasa", "langka", "legenda"].map((r) => { const d = ids.filter((id) => IKAN[id].rar === r); return `<li class="${d.every((id) => K[id]) ? "dapat" : ""}">${t("rarity." + r)}: <b>${d.filter((id) => K[id]).length} / ${d.length}</b></li>`; });
    return baris.join("") + `<li>${Lx(["Lihat semua ikan di Menu › Gameplay › Koleksi Ikan.", "See every fish in Menu › Gameplay › Fish Collection."])}</li>`;
  },
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
daftarkanCapai({ id: "ikanLengkap", kat: "koleksi", judul: ["Ensiklopedia Ikan", "Fish Encyclopedia"], desc: ["Tangkap semua 85 jenis ikan.", "Catch all 85 kinds of fish."], hadiah: HDH(600, 6), progres: () => [jumlahJenisIkan(), Object.keys(IKAN).length] });
daftarkanCapai({ id: "ikanLegenda", kat: "rahasia", rahasia: true, judul: ["Penakluk Legenda Air", "Legend of the Waters"], desc: ["Tangkap seekor ikan legenda.", "Catch a legendary fish."], hadiah: HDH(300, 5), syarat: () => Object.keys(IKAN).some((id) => IKAN[id].rar === "legenda" && S.ikan && S.ikan.koleksi[id]) });
