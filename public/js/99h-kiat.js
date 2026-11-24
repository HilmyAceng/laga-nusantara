// =====================================================================
// KIAT BERTAHAP (tutorial sambil bermain)
// Pemain baru tidak dijejali semua sistem di awal. Latihan Ki Sabda hanya 4 dasar
// (LATIHAN di config.js); mekanik lain diajarkan TEPAT saat pertama dibutuhkan:
//  - kartu kiat kecil muncul, game berhenti sebentar, tombol terkait berkedip emas;
//  - tiap kiat hanya muncul sekali (S.kiat = { id: true }), khusus progres BARU
//    (simpanan lama tidak punya S.kiat → tidak diganggu kiat);
//  - tidak muncul saat cutscene, kartu kontrol keyboard, atau dekat bos.
// HUD juga dibuka bertahap: ikon Jimat setelah punya jimat, ikon Jurus setelah
// dapat poin jurus pertama (Lv 2), tombol Jurus 2 setelah slotnya terisi.
// Semua kiat yang sudah ditemui bisa dibaca ulang di Menu › Gameplay › Cara Bermain.
// =====================================================================
"use strict";

// tombol keyboard (desktop) dalam bentuk <kbd>
const kiatK = (act) => KONTROL[act].slice(0, 1).map((k) => `<kbd>${KEY_LABEL[k] || (k.length === 1 ? k.toUpperCase() : k)}</kbd>`).join("");
const dekatBos = () => monsters.some((m) => m.d.boss && !m.dead && P && dist(m, P) < 900);

// syarat() dicek tiap frame saat bermain; sorot = tombol yang dikedipkan; isi() = [id, en] (boleh HTML)
const KIAT = [
  {
    id: "jamu", sorot: ["#bPot", "#sPot"],
    syarat: () => !P.dead && P.hp < maxHp() * 0.5 && S.potions > 0,
    judul: ["Nyawamu tinggal separuh!", "Your health is at half!"],
    isi: () => isTouch
      ? ["Ketuk tombol <b>Jamu</b> untuk memulihkan nyawa. Setelah minum, ada jeda 10 detik. Jamu bisa dibeli di warung desa.", "Tap the <b>Jamu</b> button to restore health. After drinking there is a 10-second cooldown. Buy more jamu at village stalls."]
      : [`Tekan ${kiatK("jamu")} untuk minum <b>jamu</b> dan memulihkan nyawa. Setelah minum, ada jeda 10 detik. Jamu bisa dibeli di warung desa.`, `Press ${kiatK("jamu")} to drink <b>jamu</b> and restore health. After drinking there is a 10-second cooldown. Buy more jamu at village stalls.`],
  },
  {
    id: "bacaSerangan", sorot: ["#bRoll", "#sRoll"],
    syarat: () => monsters.some((m) => !m.dead && !m.d.latihan && !m.d.boss && m.state === "windup" && dist(m, P) < 240),
    judul: ["Musuh bersiap menyerang!", "An enemy is about to strike!"],
    isi: () => isTouch
      ? ["Lihat tanda merah di sekitarnya. Geser joystick lalu ketuk <b>Hindar</b> TEPAT saat serangan datang = <b>Hindar Sempurna</b>: waktu melambat dan kamu bisa membalas. Ketuk <b>Hindar</b> tanpa joystick = aksi khas hero-mu (misalnya tangkis).", "Watch the red warning around it. Hold the joystick and tap <b>Dodge</b> RIGHT as the attack lands = <b>Perfect Dodge</b>: time slows and you can strike back. Tap <b>Dodge</b> without the joystick = your hero's own move (e.g. a parry)."]
      : [`Lihat tanda merah di sekitarnya. Tekan ${kiatK("hindar")} + arah TEPAT saat serangan datang = <b>Hindar Sempurna</b>: waktu melambat dan kamu bisa membalas. ${kiatK("hindar")} tanpa arah = aksi khas hero-mu (misalnya tangkis).`, `Watch the red warning around it. Press ${kiatK("hindar")} + a direction RIGHT as the attack lands = <b>Perfect Dodge</b>: time slows and you can strike back. ${kiatK("hindar")} with no direction = your hero's own move (e.g. a parry).`],
  },
  {
    id: "jelajah", sorot: ["#mini", ".hud .me"],
    syarat: () => areaId !== "desa",
    judul: ["Keluar desa pertama kali", "Leaving the village"],
    isi: () => isTouch
      ? ["Ikuti <b>panah emas</b> menuju tujuan misi. Ketuk <b>peta mini</b> untuk peta besar, dan ketuk <b>kotak misi</b> di kiri atas untuk memilih misi yang dilacak.", "Follow the <b>golden arrow</b> to your quest goal. Tap the <b>minimap</b> for the big map, and tap the <b>quest box</b> at the top left to choose which quest to track."]
      : [`Ikuti <b>panah emas</b> menuju tujuan misi. ${kiatK("peta")} = peta besar, ${kiatK("misi")} = daftar misi (pilih misi yang dilacak).`, `Follow the <b>golden arrow</b> to your quest goal. ${kiatK("peta")} = big map, ${kiatK("misi")} = quest list (choose which quest to track).`],
  },
  {
    id: "poinJurus", sorot: ["#btnJurusHud"],
    syarat: () => poinSisa() > 0,
    judul: ["Kamu dapat Poin Jurus!", "You earned a Skill Point!"],
    isi: () => isTouch
      ? ["Tiap naik level dapat 1 poin. Ketuk ikon <b>Jurus</b> (pedang) di kanan atas untuk menguatkan jurus atau membuka jurus baru.", "Every level-up gives 1 point. Tap the <b>Skills</b> icon (sword) at the top right to power up a skill or unlock a new one."]
      : [`Tiap naik level dapat 1 poin. Tekan ${kiatK("menuJurus")} atau ikon <b>Jurus</b> (pedang) di kanan atas untuk menguatkan jurus atau membuka jurus baru.`, `Every level-up gives 1 point. Press ${kiatK("menuJurus")} or the <b>Skills</b> icon (sword) at the top right to power up a skill or unlock a new one.`],
  },
  {
    id: "jimat", sorot: ["#btnJimatHud"],
    syarat: () => Object.keys(S.jimat.punya).length > 0,
    judul: ["Kamu dapat Jimat!", "You got a Charm!"],
    isi: () => isTouch
      ? ["Jimat memberi kekuatan tambahan, tapi harus <b>dipasang</b> dulu. Ketuk ikon <b>Jimat</b> (permata) di kanan atas, lalu pasang di slot kosong.", "Charms give extra power, but must be <b>equipped</b> first. Tap the <b>Charms</b> icon (gem) at the top right, then put it in an empty slot."]
      : [`Jimat memberi kekuatan tambahan, tapi harus <b>dipasang</b> dulu. Tekan ${kiatK("menuJimat")} atau ikon <b>Jimat</b> (permata) di kanan atas, lalu pasang di slot kosong.`, `Charms give extra power, but must be <b>equipped</b> first. Press ${kiatK("menuJimat")} or the <b>Charms</b> icon (gem) at the top right, then put it in an empty slot.`],
  },
  {
    id: "pamungkas", sorot: ["#bUlt", "#sUlt"],
    syarat: () => S.lv >= ATURAN.tenaga.bukaLevel && tenagaPenuh(),
    judul: ["Tenaga Dalam penuh!", "Inner Power is full!"],
    isi: () => isTouch
      ? ["Bar tenaga terisi saat kamu bertarung. Saat penuh, ketuk tombol <b>Pamungkas</b> untuk jurus terkuat hero-mu. Simpan untuk musuh yang tangguh!", "The power bar fills as you fight. When it's full, tap <b>Ultimate</b> for your hero's strongest move. Save it for tough foes!"]
      : [`Bar tenaga terisi saat kamu bertarung. Saat penuh, tekan ${kiatK("pamungkas")} untuk <b>Pamungkas</b>, jurus terkuat hero-mu. Simpan untuk musuh yang tangguh!`, `The power bar fills as you fight. When it's full, press ${kiatK("pamungkas")} for your <b>Ultimate</b>, your hero's strongest move. Save it for tough foes!`],
  },
  {
    id: "debuff", sorot: [],
    syarat: () => adaDebuff(),
    judul: ["Kamu terkena efek buruk!", "You've been afflicted!"],
    isi: () => ["Ikon di atas kepalamu menunjukkan efeknya (racun, terbakar, lambat, dll.). Efek hilang sendiri setelah beberapa detik, dan langsung hilang di <b>zona aman</b> (desa). Pak Joko di desa bisa mengajarimu membuat penawar.", "The icon over your head shows the effect (poison, burn, slow, etc.). It wears off after a few seconds, and vanishes at once in a <b>safe zone</b> (village). Pak Joko in the village can teach you to make an antidote."],
  },
  {
    id: "teleport", sorot: [],
    syarat: () => nearNpc && nearNpc.kind === "teleport",
    judul: ["Mesin Teleport", "Teleport Beacon"],
    isi: () => ["Mesin ini memulihkan nyawamu dan bisa memindahkanmu cepat ke desa atau kota lain yang sudah pernah kamu datangi. " + (isTouch ? "Ketuk tombol <b>Bicara</b> di dekatnya." : `Tekan ${kiatK("bicara")} di dekatnya.`), "This beacon restores your health and can quickly move you to other villages or towns you've visited. " + (isTouch ? "Tap <b>Talk</b> next to it." : `Press ${kiatK("bicara")} next to it.`)],
  },
  {
    id: "cermin", sorot: [],
    syarat: () => nearNpc && nearNpc.kind === "cermin",
    judul: ["Cermin Gaib", "Mystic Mirror"],
    isi: () => ["Cermin ini memanggil kembali bos yang pernah kamu kalahkan, dengan tingkat kesulitan 1–7 pilihanmu. Makin tinggi tingkatnya, makin bagus hadiahnya (termasuk jimat langka). Cermin yang sudah muncul juga bisa dipakai untuk teleport lewat peta.", "This mirror summons a boss you've beaten, at a difficulty of 1–7 of your choice. Higher levels give better rewards (including rare charms). Mirrors you've found can also be used to teleport via the map."],
  },
];

// ---------- Kartu kiat ----------
let kiatAktif = null, kiatJeda = 3, sorotT = 0;
function tampilKiat(k) {
  kiatAktif = k; S.kiat[k.id] = true; saveSoon();
  $("kiatJudul").textContent = Lx(k.judul);
  $("kiatIsi").innerHTML = Lx(k.isi());
  sorotKiat(k.sorot);
  mode = "kiat"; showUI();
  $("kiatBox").hidden = false; sfx.quest ? sfx.quest() : sfx.click();
}
function tutupKiat() {
  $("kiatBox").hidden = true; kiatAktif = null; kiatJeda = 4;
  if (mode === "kiat") { mode = "play"; showUI(); }
  sfx.click();
}
function sorotKiat(daftar) {
  for (const el of document.querySelectorAll(".kiat-sorot")) el.classList.remove("kiat-sorot");
  for (const sel of daftar) for (const el of document.querySelectorAll(sel)) el.classList.add("kiat-sorot");
  sorotT = 9;   // detik kedipan setelah kartu ditutup
}
$("btnKiatOke").addEventListener("click", tutupKiat);
addEventListener("keydown", (e) => {
  if (mode !== "kiat") return;
  if (e.key === "Enter" || e.key === "Escape" || e.key === " ") { e.preventDefault(); e.stopImmediatePropagation(); tutupKiat(); }
  else e.stopImmediatePropagation();
}, true);
// saat kartu kiat tampil, tombol sentuh / bar jurus tetap terlihat (supaya kedipannya kelihatan)
{
  const showUIAsli = showUI;
  showUI = function () { showUIAsli(); if (mode === "kiat") { ui.touch.hidden = !isTouch; ui.skills.hidden = isTouch; } };
}

// ---------- Pemicu ----------
SAAT_MASUK_AREA.push(() => { kiatJeda = Math.max(kiatJeda, 1.5); });
UPDATE_TAMBAHAN.push((dt) => {
  if (sorotT > 0) { sorotT -= dt; if (sorotT <= 0) { sorotKiat([]); sorotT = 0; } }
  if (!S || !S.kiat || !P) return;
  kiatJeda -= dt; if (kiatJeda > 0) return;
  if (adegan || (S.panduanKontrol === false && !isTouch) || dekatBos()) return;   // kartu kontrol keyboard hanya di komputer
  for (const k of KIAT) if (!S.kiat[k.id] && k.syarat()) { tampilKiat(k); return; }
});

// progres baru → kiat aktif (simpanan lama tidak punya S.kiat)
{
  const startAsli = startGame;
  startGame = function (fresh) {
    startAsli(fresh);
    if (fresh && S) { S.kiat = {}; kiatJeda = 3; saveSoon(); }
  };
}
// simpanan yang sedang di tengah latihan versi lama (10 langkah) → langkah > 4 dianggap selesai
{
  const lengkapiAsli = lengkapiSave;
  lengkapiSave = function () {
    lengkapiAsli();
    const q = SAMPINGAN.find((x) => x.id === "latihan"), st = q && S.side && S.side[q.id];
    if (st && st.status === "active" && st.prog >= q.need) { st.prog = q.need; st.sub = 0; st.status = "done"; }
  };
}

// ---------- HUD dibuka bertahap ----------
function hudBertahap() {
  if (!S || !P) return;
  const atur = (el, tampil) => { if (el && el.classList.contains("hud-tutup") === tampil) el.classList.toggle("hud-tutup", !tampil); };
  atur($("btnJimatHud"), Object.keys(S.jimat.punya).length > 0);
  atur($("btnJurusHud"), S.lv >= 2);
  const slot2 = !!jurusSlot(1);
  atur($("bSkill2"), slot2); atur($("sSkill2"), slot2);
}
{
  const refreshHudAsli = refreshHud;
  refreshHud = function (paksa) { refreshHudAsli(paksa); hudBertahap(); };
}

// ---------- Menu › Gameplay › Cara Bermain: kiat yang sudah ditemui ----------
{
  const isiCaraAsli = isiCaraBermain;
  isiCaraBermain = function () {
    isiCaraAsli();
    const sudah = KIAT.filter((k) => !S || !S.kiat || S.kiat[k.id]);   // simpanan lama: tampilkan semua
    if (!sudah.length) return;
    $("caraIsi").insertAdjacentHTML("afterbegin", `<section class="cara cara-kiat"><h3>${Lx(["Kiat yang sudah kamu temui", "Tips you've seen"])}</h3>
      ${sudah.map((k) => `<p><b>${Lx(k.judul)}</b><br>${Lx(k.isi())}</p>`).join("")}</section>`);
  };
}
