// =====================================================================
// TEMAN SEPERJALANAN
// Ajak satu tokoh cerita ikut bertualang. Bicara dengan tokohnya di rumahnya →
// "Ajak bertualang". Teman mengikuti ke semua area, ikut bertarung, dan
// sesekali berbicara (komentar area, peringatan bos, nyawa sekarat, obrolan).
//  - Pak Joko  (Desa Wanasari, setelah "Peringatan Pak Joko", Bab 1): tabib.
//      Memulihkan nyawamu & melempar kantong ramuan yang melemahkan musuh.
//  - Bayu      (Bandar Segara, setelah "Anak Nelayan", Bab 3): tongkat bambu.
//      Menerjang musuh, pukulannya mementalkan.
//  - Kirana    (Kampung Awan, setelah "Kirana si Pemburu", Bab 5): pemburu.
//      Memanah dari jarak jauh, kadang kritis.
// Teman tidak bisa dikalahkan (seperti sekutu Dalang). Bicara dengan teman → obrolan / pulang.
// Simpanan: S.teman = id teman yang ikut (atau null)
// =====================================================================
"use strict";

// syarat: seluruh episode (bab, ep) cerita utama sudah lewat (nomor dipakai, bukan judul, supaya aman di kedua bahasa)
const sudahLewat = (bab, ep) => () => { let akhir = -1; CERITA.forEach((l, i) => { if (angkaBab(l.bab) === bab && l.ep === ep) akhir = i; }); return akhir >= 0 && S.cerita.idx > akhir; };
const TEMAN = {
  joko: {
    gaya: "tabib", jarak: 220, jeda: 2.4, kali: 0.3, syarat: sudahLewat(1, 5),
    ajak: ["Ikut bertualang? Hmm... Pasienku sudah sembuh semua. Baiklah! Aku bawa tas ramuanku.", "Join your adventure? Hmm... My patients are all well. Alright! I'll bring my potion bag."],
    pulang: ["Aku pulang dulu, ya. Panggil saja kalau butuh tabib.", "I'll head home then. Call me if you need a healer."],
    obrolan: [
      ["Tahukah kau? Daun sirih bisa menghentikan darah. Tapi jangan dikunyah sambil bertarung.", "Did you know betel leaves stop bleeding? But don't chew them mid-fight."],
      ["Guruku bilang, tabib yang baik tahu kapan harus mundur. Kau juga, ya.", "My teacher said a good healer knows when to retreat. You too, alright?"],
      ["Kakiku pegal. Ini pertama kalinya aku jalan sejauh ini sejak muda.", "My legs ache. First time I've walked this far since I was young."],
      ["Kalau pulang nanti, aku mau menulis buku ramuan. Judulnya: Ramuan untuk Pendekar Ceroboh.", "When we get back, I'll write a potion book. Title: Remedies for Reckless Warriors."],
    ],
  },
  bayu: {
    gaya: "tongkat", jarak: 170, jeda: 1.0, kali: 0.5, syarat: sudahLewat(3, 3),
    ajak: ["BENERAN?! Aku boleh ikut?! Tunggu, aku ambil tongkat bambuku! Nenek, aku jadi pendekar!", "REALLY?! I can come?! Wait, let me grab my bamboo staff! Grandma, I'm a warrior now!"],
    pulang: ["Yaaah... Ya sudah. Tapi lain kali ajak aku lagi, ya, Kak!", "Awww... Fine. But take me again next time, okay?"],
    obrolan: [
      ["Kak, kalau aku sudah besar, aku mau punya jurus sendiri. Namanya Tendangan Ombak Seribu!", "When I grow up I want my own move. It's called the Thousand Wave Kick!"],
      ["Tadi aku lihat Kakak berguling. Keren! Ajari aku, dong!", "I saw you roll earlier. So cool! Teach me!"],
      ["Aku lapar... Kakak bawa ikan bakar? Tidak? Ya sudah, aku kuat kok.", "I'm hungry... Got any grilled fish? No? That's fine, I'm tough."],
      ["Bapakku pasti bangga kalau tahu aku ikut pendekar sungguhan.", "My dad would be proud to know I'm traveling with a real warrior."],
    ],
  },
  kirana: {
    gaya: "panah", jarak: 300, jeda: 1.2, kali: 0.45, syarat: sudahLewat(5, 3),
    ajak: ["Berburu bersama? Tantangan diterima, orang bawah. Kita lihat siapa yang panahnya lebih tepat.", "Hunt together? Challenge accepted, ground-dweller. Let's see whose arrows fly truer."],
    pulang: ["Aku kembali ke kampung. Hitung buruanmu, nanti kita bandingkan.", "I'm heading back to the village. Count your kills, we'll compare later."],
    obrolan: [
      ["Ayahku mengajariku: jangan memanah yang lari. Panahlah yang menyerang.", "My father taught me: don't shoot what flees. Shoot what attacks."],
      ["Angin di bawah sini berat. Panahku jadi malas.", "The wind down here is heavy. My arrows feel lazy."],
      ["Skor sejauh ini: aku unggul. Mungkin. Aku tidak menghitung yang kau curi.", "Score so far: I'm ahead. Probably. I'm not counting the ones you stole."],
      ["Kau tahu kenapa aku tidak pernah meleset? Karena aku tidak pernah ragu.", "Know why I never miss? Because I never hesitate."],
    ],
  },
};
const KOMENTAR_AREA = {
  desa: ["Rumah... selalu enak kembali ke sini.", "Home... always nice to come back here."],
  rawa: ["Ugh, lumpurnya bau. Jangan injak yang berbuih.", "Ugh, the mud stinks. Don't step on the bubbly bits."],
  candi: ["Candi ini membuat bulu kudukku berdiri.", "This temple gives me goosebumps."],
  bandar: ["Pasar ikan! Bau laut! Aku suka tempat ini.", "Fish market! Sea smell! I love this place."],
  awan: ["Kakiku di atas awan... sungguhan!", "My feet are on clouds... for real!"],
  makam: ["Sst... jangan berisik. Tempat orang tidur panjang.", "Shh... quiet. This is where people sleep forever."],
  padangBayang: ["Dingin sekali di sini. Tetap dekat, ya.", "It's so cold here. Stay close, okay?"],
};
const dataTeman = () => S && S.teman && TEMAN[S.teman] ? S.teman : null;
let teman = null;   // entitas di NPCS: { id: "teman", ... }
let gelembungTeman = null;   // { teks, t }

function buatTeman() {
  const id = dataTeman(); hapusTemanDariArea();
  if (!id || !P) return;
  const asal = npcById(id);
  teman = { id: "teman", temanDari: id, name: asal.name, color: asal.color, accent: asal.accent, hat: asal.hat, hair: asal.hair,
    x: P.x - 40, y: P.y + 16, face: 0, moving: false, run: 0, cd: 1, sembuh: 6, ngobrol: rand(30, 50) };
  NPCS.push(teman);
}
function hapusTemanDariArea() { if (teman) { const i = NPCS.indexOf(teman); if (i >= 0) NPCS.splice(i, 1); } teman = null; }
function bicaraTeman(teks) { gelembungTeman = { teks: Lx(teks), t: 0 }; }
function ajakTeman(id) {
  S.teman = id; saveSoon();
  const n = NPCS.find((x) => x.id === id); if (n) NPCS.splice(NPCS.indexOf(n), 1);
  buatTeman(); if (n) { teman.x = n.x; teman.y = n.y; }
  toast(Lx([`${npcById(id).name} ikut bertualang!`, `${npcById(id).name} joins your adventure!`]), true); sfx.quest();
}
function pulangkanTeman() {
  const id = dataTeman(); if (!id) return;
  S.teman = null; hapusTemanDariArea(); saveSoon();
  toast(Lx([`${npcById(id).name} pulang ke rumahnya.`, `${npcById(id).name} heads home.`]), false);
  if (areaId === npcById(id).area) { const d = npcById(id); NPCS.push({ ...d }); }
}

// ---------- Bicara: ajak / obrolan / pulang ----------
{
  const asli = talk;
  talk = function (npc, lewat) {
    if (npc === teman) {
      const T0 = TEMAN[teman.temanDari];
      return openDialog(teman.name, Lx(T0.obrolan[Math.floor(Math.random() * T0.obrolan.length)]), [
        { label: Lx(["Lanjut jalan", "Keep going"]), primary: true, run: closeDialog },
        { label: Lx(["Pulang dulu", "Head home"]), run: () => { openDialog(teman.name, Lx(T0.pulang), [{ label: t("dlg.tutup"), primary: true, run: () => { closeDialog(); pulangkanTeman(); } }]); } },
      ]);
    }
    const T0 = TEMAN[npc.id];
    if (T0 && !npc.kind && S && T0.syarat() && dataTeman() !== npc.id && !ceritaPerluNpc(npc.id)) {
      return openDialog(npc.name, Lx(["Ada yang bisa kubantu?", "Anything I can help with?"]), [
        { label: "🤝 " + Lx(["Ajak bertualang", "Invite to adventure"]), primary: true, run: () => {
          openDialog(npc.name, Lx(T0.ajak) + (dataTeman() ? Lx([` (${npcById(dataTeman()).name} akan pulang.)`, ` (${npcById(dataTeman()).name} will head home.)`]) : ""), [
            { label: Lx(["Ayo berangkat!", "Let's go!"]), primary: true, run: () => { closeDialog(); if (dataTeman()) pulangkanTeman(); ajakTeman(npc.id); } },
            { label: t("dlg.nanti"), run: closeDialog },
          ]);
        } },
        { label: Lx(["Urusan lain", "Something else"]), run: () => { closeDialog(); asli(npc, lewat); } },
      ]);
    }
    return asli(npc, lewat);
  };
  const tandaAsli = tandaNpc;
  tandaNpc = function (n) { if (n === teman) return null; return tandaAsli(n); };
}
// NPC aslinya tidak ada di rumah selama ikut bertualang; teman ikut pindah area
SAAT_MASUK_AREA.push((id) => {
  teman = null;
  const t0 = dataTeman(); if (!t0) return;
  const i = NPCS.findIndex((n) => n.id === t0); if (i >= 0) NPCS.splice(i, 1);
  buatTeman();
  const k = KOMENTAR_AREA[id]; if (k && Math.random() < 0.7) setTimeout(() => bicaraTeman(k), 1500);
});

// ---------- AI ----------
UPDATE_TAMBAHAN.push((dt) => {
  if (!teman || !P || P.dead) return;
  if (!NPCS.includes(teman)) NPCS.push(teman);
  const T0 = TEMAN[teman.temanDari], tm = teman;
  tm.cd -= dt; tm.sembuh -= dt; tm.ngobrol -= dt;
  const m = musuhDekat(T0.jarak, tm).find((x) => x.aggro || dist(P, x) < 260) || null;
  let tujuan;
  if (m && T0.gaya === "tongkat") tujuan = { x: m.x - Math.cos(Math.atan2(m.y - tm.y, m.x - tm.x)) * (m.r + 18), y: m.y };
  else if (m && T0.gaya === "panah") { const a = Math.atan2(tm.y - m.y, tm.x - m.x); tujuan = dist(tm, m) < 130 ? { x: tm.x + Math.cos(a) * 60, y: tm.y + Math.sin(a) * 60 } : null; }
  else { const a = (P.face || 0) + Math.PI; tujuan = { x: P.x + Math.cos(a) * 46, y: P.y + Math.sin(a) * 22 + 10 }; }
  if (dist(tm, P) > 9 * T) { tm.x = P.x - 30; tm.y = P.y + 12; }   // tertinggal jauh → menyusul
  if (tujuan && dist(tm, tujuan) > 10) {
    const a = Math.atan2(tujuan.y - tm.y, tujuan.x - tm.x), v = (dist(tm, P) > 140 ? 230 : 170) * dt;
    const nx = tm.x + Math.cos(a) * v, ny = tm.y + Math.sin(a) * v;
    if (!solidAt(nx, tm.y)) tm.x = nx; if (!solidAt(tm.x, ny)) tm.y = ny;
    tm.face = a; tm.moving = true; tm.run += dt * 10;
  } else { tm.moving = false; if (m) tm.face = Math.atan2(m.y - tm.y, m.x - tm.x); }
  // serangan
  const dmg = atkPower() * T0.kali;
  if (m && tm.cd <= 0) {
    if (T0.gaya === "panah") {
      tm.cd = T0.jeda; const ang = Math.atan2(m.y - tm.y, m.x - tm.x);
      projs.push({ kind: "arrow", x: tm.x, y: tm.y - 24, vx: Math.cos(ang) * 640, vy: Math.sin(ang) * 640, life: T0.jarak / 640, dmg: dmg * (Math.random() < 0.2 ? 2 : 1), splash: 0, sekutu: true });
      sfx.arrow();
    } else if (T0.gaya === "tongkat" && dist(tm, m) < m.r + 34) {
      tm.cd = T0.jeda; damageMonster(m, dmg, Math.atan2(m.y - tm.y, m.x - tm.x), 240, { tanpaTenaga: true });
      spark(m.x, m.y - 18, "#e9d3a9", 8); sfx.hit();
    } else if (T0.gaya === "tabib") {
      tm.cd = T0.jeda; damageMonster(m, dmg, Math.atan2(m.y - tm.y, m.x - tm.x), 60, { tanpaTenaga: true }); lemahkanMonster(m, 2.5);
      spark(m.x, m.y - 20, "#7bd64a", 10);
    }
  }
  if (T0.gaya === "tabib" && tm.sembuh <= 0 && P.hp < maxHp() * 0.9) {
    tm.sembuh = 7; P.hp = Math.min(maxHp(), P.hp + maxHp() * 0.06);
    numbers.push({ x: P.x, y: P.y - 60, v: "+" + Math.round(maxHp() * 0.06), life: 0.8, color: "#5ad17a", size: 18 }); spark(P.x, P.y - 30, "#5ad17a", 8);
  }
  // obrolan & peringatan
  if (tm.ngobrol <= 0 && !m && mode === "play") { tm.ngobrol = rand(45, 80); bicaraTeman(T0.obrolan[Math.floor(Math.random() * T0.obrolan.length)]); }
  if (P.hp < maxHp() * 0.25 && !tm.peringat) { tm.peringat = 12; bicaraTeman(["Nyawamu tipis! Minum jamu!", "You're nearly down! Drink some jamu!"]); }
  if (tm.peringat > 0) tm.peringat -= dt;
  const bos = monsters.find((x) => x.d.boss && !x.dead && x.aggro);
  if (bos && !tm.bosDilihat) { tm.bosDilihat = true; bicaraTeman(["Itu dia... yang besar. Kita hadapi bersama!", "There it is... the big one. We face it together!"]); }
  if (!bos) tm.bosDilihat = false;
  if (gelembungTeman) { gelembungTeman.t += dt; if (gelembungTeman.t > 4) gelembungTeman = null; }
});
// gelembung bicara teman
GAMBAR_ATAS.push(function () {
  if (!teman || !gelembungTeman) return;
  const g = gelembungTeman, x = teman.x, y = teman.y - 112;   // di atas nama & gelar
  ctx.save(); ctx.globalAlpha = g.t > 3.6 ? (4 - g.t) / 0.4 : Math.min(1, g.t * 5);
  ctx.font = "700 10px Nunito, sans-serif";
  const kata = g.teks.split(" "), baris = []; let b = "";
  for (const w of kata) { if (ctx.measureText(b + " " + w).width > 150 && b) { baris.push(b); b = w; } else b = b ? b + " " + w : w; }
  baris.push(b);
  const w = Math.max(...baris.map((s) => ctx.measureText(s).width)) + 16, h = baris.length * 13 + 10;
  ctx.fillStyle = "rgba(255,250,240,0.95)"; roundRect(ctx, x - w / 2, y - h, w, h, 8); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - 5, y); ctx.lineTo(x, y + 6); ctx.lineTo(x + 5, y); ctx.fill();
  ctx.fillStyle = "#2b2238"; ctx.textAlign = "center";
  baris.forEach((s, i) => ctx.fillText(s, x, y - h + 15 + i * 13));
  ctx.restore();
});
