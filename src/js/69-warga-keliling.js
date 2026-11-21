// =====================================================================
// WARGA KELILING
// Warga biasa yang berjalan-jalan di desa supaya desa terasa hidup.
// Tidak ada kaitannya dengan cerita: tidak memberi misi, tidak ada tanda "!".
//  - Berjalan pelan ke titik acak di sekitar rumahnya, berhenti, lalu jalan lagi.
//  - Berhenti & menoleh kalau pemain mendekat, supaya mudah diajak bicara.
//  - Bicara → satu kalimat obrolan acak. Sesekali bergumam (gelembung kata).
// Warga ditaruh di DEPAN daftar NPCS supaya NPC cerita tetap diutamakan saat
// berdekatan (tombol Bicara memilih NPC terakhir yang dekat, 15-update.js).
// =====================================================================
"use strict";

// x, y = rumah (petak); jangkau = seberapa jauh boleh berjalan (petak)
const WARGA = {
  desa: [
    { jenis: "bocah", x: 10.5, y: 17.5, jangkau: 3.5 },
    { jenis: "ibu", x: 15, y: 3.5, jangkau: 3 },
    { jenis: "tani", x: 4, y: 12, jangkau: 2.5 },
  ],
  pesisir: [
    { jenis: "nelayan", x: 28, y: 22.5, jangkau: 4 },
    { jenis: "bocah", x: 10, y: 13.5, jangkau: 4 },
    { jenis: "ibu", x: 21, y: 19.5, jangkau: 3 },
  ],
  bandar: [
    { jenis: "pedagang", x: 12, y: 15, jangkau: 5 },
    { jenis: "pelaut", x: 26, y: 23, jangkau: 4 },
    { jenis: "bocah", x: 33, y: 16.5, jangkau: 3 },
  ],
  desaApung: [
    { jenis: "nelayan", x: 14, y: 6, jangkau: 4 },
    { jenis: "bocah", x: 25, y: 22, jangkau: 4 },
  ],
  awan: [
    { jenis: "pemudaAwan", x: 9, y: 20, jangkau: 4 },
    { jenis: "ibu", x: 27, y: 12.5, jangkau: 3 },
  ],
  perkemahan: [
    { jenis: "pengungsi", x: 8, y: 12, jangkau: 3.5 },
    { jenis: "prajurit", x: 28, y: 15.5, jangkau: 3 },
  ],
};
// rupa & obrolan tiap jenis warga (Indonesia / English)
const JENIS_WARGA = {
  bocah: { color: "#e86a5a", accent: "#ffd166", hair: "#2a201b", cepat: 62, nama: ["Bocah", "Kid"],
    kata: [["Kak, Kakak pendekar ya? Keren!", "Hey, are you a warrior? So cool!"], ["Aku lagi main petak umpet. Jangan bilang-bilang!", "I'm playing hide and seek. Don't tell anyone!"],
      ["Kata ibu, jangan main ke hutan sendirian.", "Mom says not to go into the forest alone."], ["Kucingnya lucu, ya? Dia suka dielus.", "Isn't the cat cute? It likes being petted."]] },
  ibu: { color: "#a0436b", accent: "#f4d58a", hair: "#1f1a24", cepat: 38, nama: ["Ibu Warga", "Villager"],
    kata: [["Hari ini panas sekali, ya.", "It's so hot today."], ["Mau ke pasar, persediaan beras menipis.", "Off to the market, we're running low on rice."],
      ["Hati-hati di jalan, Nak.", "Take care out there, dear."], ["Jamu di warung Mbok Sum itu manjur, lho.", "The jamu at Mbok Sum's stall really works, you know."]] },
  tani: { color: "#6b8f3d", accent: "#e9d3a9", hat: "#c9a26b", cepat: 34, nama: ["Pak Tani", "Farmer"],
    kata: [["Padi tahun ini semoga melimpah.", "Hope the rice harvest is plentiful this year."], ["Babi hutan sering merusak ladang.", "Wild boars keep wrecking the fields."],
      ["Istirahat dulu, pegal juga mencangkul.", "Taking a break, hoeing is tiring."]] },
  nelayan: { color: "#2d6a96", accent: "#e9d3a9", hat: "#c9a26b", cepat: 40, nama: ["Nelayan", "Fisherman"],
    kata: [["Angin bagus, waktunya melaut.", "Good wind, time to sail."], ["Kemarin dapat ikan kakap sebesar lengan!", "Caught a snapper as big as my arm yesterday!"],
      ["Jaringku robek lagi digigit kepiting.", "Crabs tore my net again."]] },
  pedagang: { color: "#c97d3a", accent: "#f2ece2", hat: "#8b5e3c", cepat: 42, nama: ["Pedagang", "Merchant"],
    kata: [["Kain, rempah, gerabah! Murah meriah!", "Cloth, spices, pottery! Cheap and cheerful!"], ["Kapal dari seberang belum datang juga.", "The ship from across the sea still hasn't come."],
      ["Bandar ini makin ramai saja.", "This harbor gets busier every day."]] },
  pelaut: { color: "#3d5a8f", accent: "#f2ece2", hair: "#1f1a24", cepat: 44, nama: ["Pelaut", "Sailor"],
    kata: [["Badai kemarin hampir menenggelamkan kapal kami.", "Yesterday's storm nearly sank our ship."], ["Pernah dengar soal gurita raksasa di gua laut?", "Ever heard of the giant octopus in the sea cave?"],
      ["Tali ini harus diikat kuat-kuat.", "This rope has to be tied tight."]] },
  pemudaAwan: { color: "#8fb8de", accent: "#f2ece2", hair: "#f2f2f2", cepat: 46, nama: ["Pemuda Awan", "Cloud Youth"],
    kata: [["Dari sini kita bisa melihat seluruh dunia di bawah.", "From up here you can see the whole world below."], ["Jangan terlalu dekat tepi awan, nanti jatuh!", "Don't get too close to the cloud's edge, you'll fall!"],
      ["Rajawali petir itu menakutkan sekali.", "That thunder eagle is terrifying."]] },
  pengungsi: { color: "#6b5a7a", accent: "#c9b48a", hair: "#3b2a22", cepat: 30, nama: ["Pengungsi", "Refugee"],
    kata: [["Rumahku ditelan kabut bayang...", "My home was swallowed by the shadow mist..."], ["Terima kasih sudah melindungi perkemahan ini.", "Thank you for protecting this camp."],
      ["Semoga kita bisa pulang suatu hari nanti.", "I hope we can go home someday."]] },
  prajurit: { color: "#5a4a3a", accent: "#c9a24a", hat: "#3a2a1a", cepat: 36, nama: ["Prajurit", "Soldier"],
    kata: [["Berjaga terus, mata jangan lengah.", "Stay on guard, never let your eyes wander."], ["Menara Kala itu tempat yang terkutuk.", "Kala Tower is a cursed place."],
      ["Kalau butuh istirahat, api unggun selalu menyala.", "If you need rest, the campfire is always lit."]] },
};
const pilihBahasa = (pasangan) => pasangan[bahasa === "en" ? 1 : 0];

function buatWarga(w, i) {
  const J = JENIS_WARGA[w.jenis];
  return { id: "warga-" + i, kind: "warga", jenis: w.jenis, name: pilihBahasa(J.nama), color: J.color, accent: J.accent, hat: J.hat, hair: J.hair,
    x: w.x * T, y: w.y * T, hx: w.x * T, hy: w.y * T, jangkau: w.jangkau * T, cepat: J.cepat, face: 0, run: 0, jalan: false,
    jeda: rand(0.5, 3), gumam: rand(8, 20), gelembung: null };
}
SAAT_MASUK_AREA.push((id) => { NPCS = [...(WARGA[id] || []).map(buatWarga), ...NPCS]; });

// ---------- Gerak ----------
// titik tujuan acak di sekitar rumah, tidak di petak padat & tidak terlalu dekat NPC lain
function tujuanWarga(w) {
  for (let i = 0; i < 8; i++) {
    const a = rand(0, 6.28), d = rand(0.3, 1) * w.jangkau, x = w.hx + Math.cos(a) * d, y = w.hy + Math.sin(a) * d;
    if (solidAt(x, y)) continue;
    if (NPCS.some((n) => n !== w && n.kind !== "warga" && Math.hypot(n.x - x, n.y - y) < 1.6 * T)) continue;
    return { x, y };
  }
  return null;
}
function gerakWarga(w, dt) {
  w.gumam -= dt;
  if (w.gelembung) { w.gelembung.t -= dt; if (w.gelembung.t <= 0) w.gelembung = null; }
  const dp = P && !P.dead ? dist(P, w) : 999;
  // sesekali bergumam kalau pemain cukup dekat untuk melihatnya
  if (w.gumam <= 0) { w.gumam = rand(14, 28); if (dp < 320) w.gelembung = { teks: pilihBahasa(JENIS_WARGA[w.jenis].kata[Math.floor(Math.random() * JENIS_WARGA[w.jenis].kata.length)]), t: 3.2 }; }
  // pemain mendekat (atau sedang bicara dengannya): berhenti
  if (dp < 70 || (mode === "dialog" && nearNpc === w)) { w.jalan = false; w.jeda = Math.max(w.jeda, 1.5); return; }
  if (!w.jalan) {
    w.jeda -= dt;
    if (w.jeda <= 0) { const tj = tujuanWarga(w); if (tj) { w.tx = tj.x; w.ty = tj.y; w.jalan = true; } else w.jeda = 1; }
    return;
  }
  const dx = w.tx - w.x, dy = w.ty - w.y, d = Math.hypot(dx, dy);
  if (d < 4) { w.jalan = false; w.jeda = rand(2, 6); return; }
  const nx = w.x + (dx / d) * w.cepat * dt, ny = w.y + (dy / d) * w.cepat * dt;
  if (solidAt(nx, ny)) { w.jalan = false; w.jeda = rand(0.5, 2); return; }
  w.x = nx; w.y = ny; w.face = Math.atan2(dy, dx); w.run += dt * 9;
}
UPDATE_TAMBAHAN.push((dt) => { for (const n of NPCS) if (n.kind === "warga") gerakWarga(n, dt); });

// ---------- Bicara ----------
TEKA_BICARA.warga = function (w) {
  const K = JENIS_WARGA[w.jenis].kata;
  w.jalan = false; w.gelembung = null;
  openDialog(w.name, pilihBahasa(K[Math.floor(Math.random() * K.length)]), [{ label: t("dlg.tutup"), primary: true, run: closeDialog }]);
};

// ---------- Gambar ----------
GAMBAR_OBJEK.warga = function (w, time) {
  const dekat = dist(P, w) < 160;
  const face = dekat && !w.jalan ? Math.atan2(P.y - w.y, P.x - w.x) : w.face;
  drawPerson(ctx, { x: w.x, y: w.y, face, run: w.run, moving: w.jalan, swing: 0, inv: 0, flash: 0 }, { color: w.color, accent: w.accent, hat: w.hat, hair: w.hair || "#3b2a22" }, time);
  ctx.font = "800 10px Nunito, sans-serif"; ctx.textAlign = "center"; ctx.lineJoin = "round";
  ctx.lineWidth = 3; ctx.strokeStyle = "#000"; ctx.strokeText(w.name, w.x, w.y - 64);
  ctx.fillStyle = "#d9d4cc"; ctx.fillText(w.name, w.x, w.y - 64);
  if (nearNpc === w && !isTouch) { ctx.font = "800 11px Nunito, sans-serif"; ctx.fillStyle = "#f7efe3"; ctx.fillText(t("npc.bicara"), w.x, w.y + 18); }
  // gelembung gumaman
  if (w.gelembung) {
    const g = w.gelembung, a = Math.min(1, g.t * 2);
    ctx.font = "700 11px Nunito, sans-serif";
    const teks = g.teks.length > 30 ? g.teks.slice(0, 28) + "…" : g.teks;
    const lebar = ctx.measureText(teks).width + 16, by = w.y - 92;
    ctx.globalAlpha = a;
    ctx.fillStyle = "rgba(247,239,227,0.95)"; ctx.beginPath(); ctx.roundRect(w.x - lebar / 2, by - 14, lebar, 22, 8); ctx.fill();
    ctx.beginPath(); ctx.moveTo(w.x - 5, by + 8); ctx.lineTo(w.x + 5, by + 8); ctx.lineTo(w.x, by + 14); ctx.fill();
    ctx.fillStyle = "#1b1208"; ctx.fillText(teks, w.x, by + 1);
    ctx.globalAlpha = 1;
  }
};
