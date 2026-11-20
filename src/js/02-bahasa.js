// =====================================================================
// BAHASA
// Pengaturan › Bahasa: Indonesia (bawaan) atau English. Pilihan tersimpan.
//
// Cara kerja:
//  - Teks di HTML diberi tanda data-t="kunci" (teks biasa), data-th="kunci"
//    (boleh berisi <span>), atau data-ta="kunci" (aria-label).
//    Teks Indonesianya tetap ditulis di HTML; teks Inggrisnya ada di TEKS.en.
//  - Teks dari kode memakai t("kunci", { nilai }) → TEKS.id / TEKS.en.
//    {nama} di dalam teks diganti dengan nilai yang dikirim.
//  - Nama & keterangan dari data game (kelas, monster, misi, area) diterjemahkan
//    dengan DATA_EN. Teks Indonesianya tetap di config.js / 04-peta.js.
// Menambah teks baru? Tambahkan kuncinya di TEKS.id DAN TEKS.en.
// =====================================================================
"use strict";

const BAHASA_KEY = "laga.bahasa";
let bahasa = store.get(BAHASA_KEY, "id");
if (bahasa !== "id" && bahasa !== "en") bahasa = "id";

const TEKS = {
  id: {
    // HUD & misi
    "hud.bebas": "<b>Bebas bertualang</b>Semua misi selesai",
    "hud.misiBaru": "<b>Misi baru</b>Temui Ki Lurah (tanda !)",
    "hud.kalahkan": "Kalahkan", "hud.kumpulkan": "Kumpulkan",
    "hud.lapor": "Selesai! Lapor ke Ki Lurah",
    // toast
    "toast.naikLevel": "Naik level! Lv {lv}",
    "toast.misiSelesai": "Misi selesai: {judul}. Lapor ke Ki Lurah",
    "toast.jamuHabis": "Jamu habis. Beli di Mbok Darmi",
    "toast.dapatJamu": "Dapat jamu", "toast.dapatTaring": "Dapat taring babi",
    "toast.musik": "Musik {status}", "toast.nyala": "nyala", "toast.mati": "mati",
    "toast.pingsan": "Kamu pingsan... dibawa pulang ke desa (−{koin} koin)",
    "toast.bosTumbang": "{nama} tumbang!",
    "toast.hadiah": "+{koin} koin · +{exp} EXP",
    "toast.senjata": "Senjata tingkat {lv}",
    "toast.mulai": "Temui Resi Wening di dekat alun-alun desa",
    "toast.lanjut": "Melanjutkan di {area}",
    "toast.pulihPenuh": "Nyawa pulih penuh",
    "toast.bosMuncul": "{nama} muncul dari cermin!",
    "toast.bosUlang": "{nama} tumbang! +{koin} koin",
    // dialog NPC
    "dlg.tutup": "Tutup", "dlg.nanti": "Nanti dulu", "dlg.terima": "Terima misi", "dlg.siap": "Siap",
    "dlg.terimaHadiah": "Terima hadiah",
    "dlg.lurahSelesai": "Berkat kamu, Wanasari kembali tenang. Hutan masih luas, silakan terus berlatih.",
    "dlg.hadiah": " (Hadiah: {koin} koin, {exp} EXP)",
    "dlg.progres": "{judul}: {prog} dari {need}. Hati-hati di luar sana.",
    "dlg.lurahHadiah": "Luar biasa! Terimalah hadiah ini dari warga desa.",
    "dlg.toko": "Mau beli apa, Nak? Koinmu {koin}. Jamu memulihkan {pulih}% nyawa. Senjatamu sekarang tingkat {lv}.",
    "dlg.beliJamu": "Beli jamu ({harga})",
    "dlg.asah": "Asah senjata +{atk} serangan ({harga})",
    "cermin.nama": "Cermin Gaib",
    "cermin.redup": "Permukaan cermin masih redup dan berkabut. Bisa dipakai lagi dalam {detik} detik.",
    "cermin.tanya": "Bayangan gelap bergerak di dalam cermin... Munculkan {nama}?",
    "cermin.jangan": "Jangan", "cermin.munculkan": "Munculkan {nama}",
    "cermin.detik": "{detik} detik", "cermin.sentuh": "[E] Sentuh cermin",
    "npc.bicara": "[E] Bicara",
    // teleport
    "tele.nama": "Mesin Teleport", "tele.energi": "Energi {poin} / {maks}", "tele.tanya": "Pindah ke {area}?",
    // peta besar
    "peta.dunia": "Peta <span>Dunia</span>", "peta.kamuDi": "Peta · Kamu di {area}", "peta.sub": "Peta · {sub}",
    "peta.hintSentuh": "Ketuk ✕ atau di luar peta untuk menutup.",
    "peta.hintKey": "Tab = ganti tab · {k} atau Esc = tutup.",
    "peta.kamu": "Kamu", "peta.kamuDiSini": "Kamu di sini",
    // layar judul
    "judul.nyawa": "Nyawa", "judul.lanjutkan": "Lanjutkan ({kelas} Lv {lv}{area})",
    "judul.mulaiBaru": "Mulai baru (progres lama terhapus)", "judul.mulai": "Mulai petualangan",
    "judul.keys": "{gerak} gerak · {serang} serang (tahan) · {jurus} jurus · {hindar} hindar · {jamu} minum jamu · {bicara} bicara · {peta} peta · {jeda} jeda · {musik} musik",
    // menu jeda
    "jeda.stats": "{kelas} Lv {lv} · {kills} monster dikalahkan · serangan {atk} · senjata tingkat {senjata}. Progres tersimpan otomatis.",
    "menang.stats": "{kelas} Lv {lv} menuntaskan kisah ini dan mengalahkan {kills} makhluk. Kabut merah sirna, dan Nusantara kembali tenang.",
    "ctl.gerak": "Gerak",
    "ctl.serang": "Serang <small>— tahan untuk serang terus, otomatis membidik musuh terdekat</small>",
    "ctl.jurus": "Jurus: {nama} <small>— lalu tunggu jeda {cd} detik</small>",
    "ctl.hindar": "Hindar <small>— guling cepat, kebal sesaat</small>",
    "ctl.jamu": "Minum jamu <small>— pulihkan {pulih}% nyawa</small>",
    "ctl.bicara": "Bicara <small>— saat dekat NPC, juga menutup dialog</small>",
    "ctl.peta": "Buka / tutup peta besar <small>— bisa juga klik peta mini</small>",
    "ctl.jeda": "Jeda / lanjut", "ctl.musik": "Musik nyala / mati",
    "ctlT.stick": "<b>Joystick kiri</b> — geser ke arah mana pun untuk berjalan",
    "ctlT.serang": "<b>Serang</b> — tahan untuk serang terus, otomatis membidik",
    "ctlT.jurus": "<b>Jurus</b> — {nama}. Lingkaran gelap = sedang diisi ulang",
    "ctlT.hindar": "<b>Hindar</b> — guling ke arah joystick, kebal sesaat",
    "ctlT.jamu": "<b>Jamu</b> — pulihkan {pulih}% nyawa",
    "ctlT.bicara": "<b>Bicara</b> — hanya muncul saat dekat NPC",
    "ctlT.peta": "<b>Peta mini</b> kanan atas — ketuk untuk buka peta besar",
    "ctlT.jeda": "<b>❚❚</b> kanan atas — jeda. <small>Putar HP ke mode lanskap biar leluasa.</small>",
    // pengaturan
    "set.nyala": "Nyala", "set.mati": "Mati",
    "vol.aria": "{jenis} {status}", "vol.musik": "Musik", "vol.sfx": "Efek suara",
    "vol.ariaNyala": "nyala, tekan untuk mematikan", "vol.ariaMati": "mati, tekan untuk menyalakan",
    "fs.aplikasi": "Game dibuka sebagai aplikasi terpasang, jadi sudah tampil layar penuh.",
    "fs.tidakBisa": "Browser ini belum mendukung layar penuh. Di iPhone, pasang game lewat Bagikan › Tambahkan ke Layar Utama agar tampil penuh.",
    "fs.ketuk": "Ketuk layar sekali untuk masuk layar penuh lagi.",
    // cerita utama, misi sampingan, teka-teki
    "cerita.narator": "Cerita",
    "cerita.lanjut": "Lanjut ›",
    "cerita.hKoin": "+{n} koin",
    "cerita.hJamu": "+{n} jamu",
    "cerita.tujuanBaru": "Tujuan baru: {tujuan}",
    "cerita.hudTamat": "<b>Tamat</b>Kabut sudah sirna. Bebas bertualang!",
    "item.mustikaBumi": "Mustika Bumi",
    "item.mustikaTirta": "Mustika Tirta",
    "item.mustikaBayu": "Mustika Bayu",
    "item.kantong": "Kantong curian",
    "item.sisik": "Sisik buaya",
    "side.hSenjata": "senjata +1 tingkat",
    "side.hadiah": "Hadiah",
    "side.lapor": "lapor ke {npc}",
    "toast.misiSelesai2": "Misi selesai: {judul}. Lapor ke {npc}",
    "toast.dicopet": "Dicopet tuyul! −{n} koin",
    "toast.bosMarah": "{nama} mengamuk!",
    "toast.lurahTamat": "Semua misi Ki Lurah selesai! Cermin Gaib terbangun di Gua Genderuwo.",
    "teka.nPrasasti": "Prasasti",
    "teka.nObor": "Obor",
    "teka.nPitutur": "Batu Pitutur",
    "teka.nAltar": "Altar Mustika",
    "teka.periksa": "[E] Periksa",
    "teka.prasasti": "Empat api penjaga menunggu dinyalakan. Ikuti perjalanan sang surya: saat ia lahir, saat ia tegak di atas kepala, saat ia tenggelam. Lalu sambutlah sang rembulan.",
    "teka.prasastiSelesai": "Keempat api menyala tenang. Jalan ke ruang dalam sudah terbuka.",
    "teka.oborNyala": "Api menyala ({n}/{max})",
    "teka.oborSalah": "Salah urutan... semua api padam. Baca lagi prasastinya.",
    "teka.pituturSelesai": "Batu itu kini diam. Jembatan ke pulau sudah muncul.",
    "teka.pituturKabut": "Tulisan di batu tertutup kabut tebal, belum bisa dibaca. Mungkin Mbah Tirto tahu sesuatu.",
    "teka.pituturSalah": "Jawaban salah! Kabut bergolak dan hantu-hantu muncul...",
    "teka.altarSelesai": "Ketiga mustika bersinar di altar. Jembatan batu membentang di atas lava.",
    "teka.altarKurang": "Tiga cekungan berbentuk mustika: hijau, biru, dan putih. Mustika yang kamu bawa: {n}/{max} ({daftar}).",
    "teka.altarTanya": "Ketiga mustika di tasmu bergetar, seperti ingin pulang. Letakkan di altar?",
    "teka.altarTaruh": "Letakkan mustika",
    "teka.r1": "Aku selalu datang, tapi tak pernah tiba hari ini. Siapakah aku?",
    "teka.r1a": "Besok",
    "teka.r1b": "Kemarin",
    "teka.r1c": "Malam",
    "teka.r2": "Semakin banyak kau ambil dariku, semakin besar aku jadinya. Apakah aku?",
    "teka.r2a": "Lubang",
    "teka.r2b": "Batu",
    "teka.r2c": "Bayangan",
    "teka.r3": "Aku punya banyak gigi, tapi tak pernah menggigit. Apakah aku?",
    "teka.r3a": "Sisir",
    "teka.r3b": "Buaya",
    "teka.r3c": "Kepiting",
    "peta.tujuan": "Tujuan",
  },
  en: {
    "hud.bebas": "<b>Free roam</b>All quests complete",
    "hud.misiBaru": "<b>New quest</b>Talk to Ki Lurah (! mark)",
    "hud.kalahkan": "Defeat", "hud.kumpulkan": "Collect",
    "hud.lapor": "Done! Report to Ki Lurah",
    "toast.naikLevel": "Level up! Lv {lv}",
    "toast.misiSelesai": "Quest complete: {judul}. Report to Ki Lurah",
    "toast.jamuHabis": "Out of jamu. Buy more from Mbok Darmi",
    "toast.dapatJamu": "Got a jamu", "toast.dapatTaring": "Got a boar tusk",
    "toast.musik": "Music {status}", "toast.nyala": "on", "toast.mati": "off",
    "toast.pingsan": "You fainted... carried back to the village (−{koin} coins)",
    "toast.bosTumbang": "{nama} defeated!",
    "toast.hadiah": "+{koin} coins · +{exp} EXP",
    "toast.senjata": "Weapon level {lv}",

    "toast.lanjut": "Continuing in {area}",
    "toast.pulihPenuh": "Fully healed",
    "toast.bosMuncul": "{nama} emerges from the mirror!",
    "toast.bosUlang": "{nama} defeated! +{koin} coins",
    "dlg.tutup": "Close", "dlg.nanti": "Maybe later", "dlg.terima": "Accept quest", "dlg.siap": "Got it",
    "dlg.terimaHadiah": "Take reward",
    "dlg.lurahSelesai": "Thanks to you, Wanasari is peaceful again. The forest is still vast, keep training.",
    "dlg.hadiah": " (Reward: {koin} coins, {exp} EXP)",
    "dlg.progres": "{judul}: {prog} of {need}. Be careful out there.",
    "dlg.lurahHadiah": "Wonderful! Please accept this gift from the villagers.",
    "dlg.toko": "What would you like, dear? You have {koin} coins. Jamu restores {pulih}% health. Your weapon is level {lv}.",
    "dlg.beliJamu": "Buy jamu ({harga})",
    "dlg.asah": "Sharpen weapon +{atk} attack ({harga})",
    "cermin.nama": "Mystic Mirror",
    "cermin.redup": "The mirror is still dim and misty. It can be used again in {detik} seconds.",
    "cermin.tanya": "A dark shadow moves inside the mirror... Summon {nama}?",
    "cermin.jangan": "Don't", "cermin.munculkan": "Summon {nama}",
    "cermin.detik": "{detik} s", "cermin.sentuh": "[E] Touch the mirror",
    "npc.bicara": "[E] Talk",
    "tele.nama": "Teleport Beacon", "tele.energi": "Energy {poin} / {maks}", "tele.tanya": "Travel to {area}?",
    "peta.dunia": "World <span>Map</span>", "peta.kamuDi": "Map · You are in {area}", "peta.sub": "Map · {sub}",
    "peta.hintSentuh": "Tap ✕ or outside the map to close.",
    "peta.hintKey": "Tab = switch tab · {k} or Esc = close.",
    "peta.kamu": "You", "peta.kamuDiSini": "You are here",
    "judul.nyawa": "HP", "judul.lanjutkan": "Continue ({kelas} Lv {lv}{area})",
    "judul.mulaiBaru": "New game (old progress is erased)", "judul.mulai": "Start adventure",
    "judul.keys": "{gerak} move · {serang} attack (hold) · {jurus} skill · {hindar} dodge · {jamu} drink jamu · {bicara} talk · {peta} map · {jeda} pause · {musik} music",
    "jeda.stats": "{kelas} Lv {lv} · {kills} monsters defeated · attack {atk} · weapon level {senjata}. Progress is saved automatically.",
    "menang.stats": "{kelas} Lv {lv} finished the tale and defeated {kills} creatures. The red mist is gone and the land is calm again.",
    "ctl.gerak": "Move",
    "ctl.serang": "Attack <small>— hold to keep attacking, auto-aims at the nearest enemy</small>",
    "ctl.jurus": "Skill: {nama} <small>— then wait {cd} seconds</small>",
    "ctl.hindar": "Dodge <small>— quick roll, briefly invincible</small>",
    "ctl.jamu": "Drink jamu <small>— restores {pulih}% health</small>",
    "ctl.bicara": "Talk <small>— near an NPC, also closes dialogs</small>",
    "ctl.peta": "Open / close the big map <small>— or click the mini map</small>",
    "ctl.jeda": "Pause / resume", "ctl.musik": "Music on / off",
    "ctlT.stick": "<b>Left joystick</b> — drag in any direction to walk",
    "ctlT.serang": "<b>Attack</b> — hold to keep attacking, auto-aims",
    "ctlT.jurus": "<b>Skill</b> — {nama}. Dark circle = recharging",
    "ctlT.hindar": "<b>Dodge</b> — roll toward the joystick, briefly invincible",
    "ctlT.jamu": "<b>Jamu</b> — restores {pulih}% health",
    "ctlT.bicara": "<b>Talk</b> — only appears near an NPC",
    "ctlT.peta": "<b>Mini map</b> top right — tap to open the big map",
    "ctlT.jeda": "<b>❚❚</b> top right — pause. <small>Turn your phone sideways for more room.</small>",
    "set.nyala": "On", "set.mati": "Off",
    "vol.aria": "{jenis} {status}", "vol.musik": "Music", "vol.sfx": "Sound effects",
    "vol.ariaNyala": "on, press to turn off", "vol.ariaMati": "off, press to turn on",
    "fs.aplikasi": "The game is running as an installed app, so it is already full screen.",
    "fs.tidakBisa": "This browser does not support full screen yet. On iPhone, install the game via Share › Add to Home Screen to play full screen.",
    "fs.ketuk": "Tap the screen once to go full screen again.",
    "cerita.narator": "Story",
    "cerita.lanjut": "Next ›",
    "cerita.hKoin": "+{n} coins",
    "cerita.hJamu": "+{n} jamu",
    "cerita.tujuanBaru": "New goal: {tujuan}",
    "cerita.hudTamat": "<b>The End</b>The mist is gone. Free roam!",
    "item.mustikaBumi": "Earth Gem",
    "item.mustikaTirta": "Water Gem",
    "item.mustikaBayu": "Wind Gem",
    "item.kantong": "Stolen pouch",
    "item.sisik": "Crocodile scale",
    "side.hSenjata": "weapon +1 level",
    "side.hadiah": "Reward",
    "side.lapor": "report to {npc}",
    "toast.misiSelesai2": "Quest complete: {judul}. Report to {npc}",
    "toast.dicopet": "Pickpocketed by a tuyul! −{n} coins",
    "toast.bosMarah": "{nama} is enraged!",
    "toast.lurahTamat": "All of Ki Lurah's quests are done! A Mystic Mirror awakens in Genderuwo Cave.",
    "teka.nPrasasti": "Inscription",
    "teka.nObor": "Torch",
    "teka.nPitutur": "Pitutur Stone",
    "teka.nAltar": "Gem Altar",
    "teka.periksa": "[E] Inspect",
    "teka.prasasti": "Four guardian flames wait to be lit. Follow the journey of the sun: when it is born, when it stands overhead, when it sinks. Then welcome the moon.",
    "teka.prasastiSelesai": "All four flames burn calmly. The way to the inner chamber is open.",
    "teka.oborNyala": "Flame lit ({n}/{max})",
    "teka.oborSalah": "Wrong order... every flame goes out. Read the inscription again.",
    "teka.pituturSelesai": "The stone is silent now. The bridge to the island has risen.",
    "teka.pituturKabut": "Thick mist covers the writing on the stone. Maybe Mbah Tirto knows something.",
    "teka.pituturSalah": "Wrong answer! The mist churns and ghosts appear...",
    "teka.altarSelesai": "The three gems shine on the altar. A stone bridge stretches across the lava.",
    "teka.altarKurang": "Three gem-shaped hollows: green, blue and white. Gems you carry: {n}/{max} ({daftar}).",
    "teka.altarTanya": "The three gems in your bag tremble, as if they want to go home. Place them on the altar?",
    "teka.altarTaruh": "Place the gems",
    "teka.r1": "I am always coming, but I never arrive today. What am I?",
    "teka.r1a": "Tomorrow",
    "teka.r1b": "Yesterday",
    "teka.r1c": "Night",
    "teka.r2": "The more you take from me, the bigger I become. What am I?",
    "teka.r2a": "A hole",
    "teka.r2b": "A stone",
    "teka.r2c": "A shadow",
    "teka.r3": "I have many teeth, but I never bite. What am I?",
    "teka.r3a": "A comb",
    "teka.r3b": "A crocodile",
    "teka.r3c": "A crab",
    "peta.tujuan": "Goal",
    "h.panah": "Goal arrow",
    "h.panahNote": "A gold arrow at the screen edge pointing to your story goal.",
    "toast.mulai": "Meet Resi Wening by the village square",


    // ---- teks HTML (Indonesianya ada langsung di game.html) ----
    "h.petaPetualangan": "Laga Nusantara adventure map",
    "h.koin": "Coins", "h.jamu": "Jamu", "h.jeda": "Pause", "h.petaMini": "Mini map — click to open the big map",
    "h.putar": "Turn your phone sideways for more room",
    "h.bicara": "Talk", "h.hindar": "Dodge", "h.jamuBtn": "Jamu", "h.jurus": "Skill", "h.serang": "Attack",
    "h.memasuki": "Entering",
    "h.eyebrowJudul": "Action adventure",
    "h.lead": "A red mist pours from Mount Geni and the creatures of the forest grow wild. Choose your hero, gather the three gems, and face the Banaspati King.",
    "h.jedaEyebrow": "Paused", "h.jedaJudul": "Take a <span>breather</span>",
    "h.lanjut": "Resume", "h.pengaturan": "Settings", "h.credit": "Credits", "h.menuUtama": "Main menu", "h.keluar": "Quit Game",
    "h.setEyebrow": "Paused › Settings", "h.setJudul": "Set<span>tings</span>",
    "h.bahasa": "Language", "h.kontrol": "Controls", "h.volume": "Volume", "h.layar": "Display", "h.kembali": "← Back",
    "h.bhsEyebrow": "Settings › Language", "h.bhsJudul": "Lang<span>uage</span>",
    "h.volEyebrow": "Settings › Volume", "h.volJudul": "Vol<span>ume</span>",
    "h.musik": "Music", "h.sfx": "Sound effects",
    "h.musKecil": "Lower music", "h.musBesar": "Raise music", "h.sfxKecil": "Lower sound effects", "h.sfxBesar": "Raise sound effects",
    "h.keluarEyebrow": "Paused › Quit", "h.keluarJudul": "Quit <span>game?</span>",
    "h.keluarLead": "Your progress is saved. Choose \"Continue\" later to come back here.",
    "h.keluarYa": "Yes, quit", "h.batal": "Cancel",
    "h.layarEyebrow": "Settings › Display", "h.layarJudul": "Dis<span>play</span>",
    "h.ctlEyebrow": "Settings › Controls", "h.ctlJudul": "Con<span>trols</span>", "h.ctlSentuh": "Phone / touch screen",
    "h.creditEyebrow": "Paused › Credits", "h.creditJudul": "Cre<span>dits</span>",
    "h.cr1": "Idea, design & development", "h.cr2": "Coding assistant",
    "h.cr3": "Graphics", "h.cr3v": "Drawn entirely with code (Canvas 2D), no image files",
    "h.cr4": "Music & sound", "h.cr4v": "Original gamelan tunes in slendro & pelog scales, played with Web Audio",
    "h.cr5": "Fonts", "h.cr6": "Inspiration", "h.cr6v": "Folk tales and culture of the Nusantara archipelago",
    "h.crTerima": "Thank you for playing!",
    "h.petaEyebrow": "Map", "h.tutupPeta": "Close map", "h.areaIni": "This area", "h.petaDunia": "World map", "h.peta": "Map",
    "h.teleport": "Teleport",
    "h.lgKamu": "You", "h.lgWarga": "Villagers", "h.lgKeluar": "Exits", "h.lgMonster": "Monsters", "h.lgBos": "Boss",
    "h.lgTele": "Teleport beacon (click)", "h.lgJalan": "Paths between areas", "h.lgMisi": "Quest goal",
    "h.byeEyebrow": "See you", "h.byeJudul": "Progress <span>saved</span>",
    "h.byeLead": "Close the app from your phone: swipe up / Home button, or close this browser tab.",
    "h.mainLagi": "Play again",
    "h.winEyebrow": "The End · Mist of Mount Geni", "h.winJudul": "Mist <span>lifted</span>", "h.lanjutTualang": "Keep adventuring",
  },
};

// Terjemahan data game (bahasa Inggris). Bahasa Indonesia = isi asli di config.js & 04-peta.js.
const DATA_EN = {
  kelas: {
    pendekar: { name: "Warrior", role: "Melee", skill: "Lightning Slash",
      desc: "Three-hit machete combo. Lightning Slash dashes straight through enemies." },
    pemanah: { name: "Archer", role: "Ranged", skill: "Triple Shot",
      desc: "Shoots arrows from afar, auto-aims at the nearest enemy. Triple Shot fires a spread." },
    pendobrak: { name: "Breaker", role: "Tank", skill: "Earthquake",
      desc: "Thick health, heavy hammer blows. Earthquake slams every enemy nearby." },
    penyihir: { name: "Mage", role: "Area magic", skill: "Fire Pillar",
      desc: "Fireballs that explode and hit several enemies. Fire Pillar bursts from the ground." },
  },
  monster: { kera: "Wild Monkey", kelelawar: "Bat", babi: "Wild Boar", genderuwo: "Genderuwo",
    hantuKabut: "Mist Ghost", buaya: "Swamp Crocodile", tuyul: "Tuyul", kepiting: "Reef Crab", banaspati: "Banaspati",
    dwarapala: "Dwarapala", buayaPutih: "White Crocodile", rajaBanaspati: "Banaspati King" },
  misi: [
    { title: "Drive Off the Monkeys", offer: "Wild monkeys are wrecking the gardens in the east forest, across the bridge. Please drive off five of them." },
    { title: "Boar Tusks", offer: "Mbok Darmi needs boar tusks for a potion. Wild boars roam the southern meadow. Bring back three tusks." },
    { title: "Guardian of the Cave", offer: "It is time. The Genderuwo in the far east cave is what unsettles every creature in the forest. Defeat it, my child." },
  ],
  area: {
    desa: { nama: "Wanasari Village", sub: "Safe place — no monsters", gerbang: ["Forest →"] },
    alam: { nama: "Forest & Meadow", sub: "Careful, lots of monsters", gerbang: ["← Village", "Cave →", "To Temple", "To Swamp"] },
    gua: { nama: "Genderuwo Cave", sub: "Lair of the forest guardian", gerbang: ["← Exit"] },
    candi: { nama: "Wingit Temple", sub: "Haunted ruins north of the forest · Lv 5+", gerbang: ["To Forest", "To Crater"] },
    rawa: { nama: "Misty Swamp", sub: "Black water & faint whispers · Lv 7+", gerbang: ["To Forest", "Village →"] },
    pesisir: { nama: "Fishing Village", sub: "A village by the sea · Lv 7+", gerbang: ["← Swamp"] },
    kawah: { nama: "Geni Crater", sub: "Summit of the volcano · Lv 11+", gerbang: ["To Temple"] },
  },
  // Cerita utama (urutan sama dengan CERITA di config.js). teks: hanya kalimatnya, pembicaranya tetap.
  cerita: [
    { bab: "Chapter 1 · The First Mist", tujuan: "Meet Resi Wening by the village square", teks: [
      "At last you've come, child. I am Resi Wening, a hermit from the slopes of Mount Geni.",
      "Three nights ago the mountain spewed a red mist. Since then the forest creatures have turned savage, and old spirits have woken.",
      "In Wingit Temple, north of the forest, lies the Earth Gem, one of the three guardian gems. I fear it is in danger.",
      "Go there and see. Follow the gold arrow on your screen if you lose your way."] },
    { bab: "Chapter 1 · The First Mist", tujuan: "Go to Wingit Temple (north of Forest & Meadow)", teks: [
      "The air in Wingit Temple is cold and smells of old incense. A stone wall seals the way to the inner chamber.",
      "An inscription stands in the entrance hall. Perhaps it holds a clue."] },
    { bab: "Chapter 1 · The First Mist", tujuan: "Light the four torches in the middle hall as the inscription says", teks: [
      "The fourth flame catches. The stone wall to the north rumbles and slides open.",
      "From the darkness of the inner chamber, a pair of stone eyes glows red..."] },
    { bab: "Chapter 1 · The First Mist", tujuan: "Defeat Dwarapala, the stone guardian of Wingit Temple", teks: [
      "The guardian statue crumbles to pieces. Among the rubble, a green stone pulses softly.",
      "You got the Earth Gem! Behind the chamber, a passage to the summit is now open."] },
    { bab: "Chapter 1 · The First Mist", tujuan: "Bring the Earth Gem to Resi Wening in the village", teks: [
      "The Earth Gem... thank goodness. But look at this crack. Someone tried to steal it.",
      "Dwarapala never attacks ordinary visitors. It was controlled by that red mist.",
      "Long ago, the Banaspati King, fire spirit of the crater, was sealed by our ancestors with three gems: Earth, Water and Wind. Now the seal is weakening.",
      "The Water Gem is kept in the Misty Swamp, south of the forest. Go before the mist swallows it. Take this jamu."] },
    { bab: "Chapter 2 · Misty Swamp", tujuan: "Go to the Misty Swamp (south of Forest & Meadow)", teks: [
      "Thick mist hangs over black water. Faint voices seem to call your name.",
      "Near the entrance stands an old hut. Thin smoke drifts from its kitchen."] },
    { bab: "Chapter 2 · Misty Swamp", tujuan: "Meet Mbah Tirto at the hut by the swamp", teks: [
      "Heh heh... not many dare to come in here, young one.",
      "The Water Gem lies on the island in the middle of the swamp, guarded by the White Crocodile, centuries old. But now its eyes are red, as if possessed.",
      "Our ancestors sank the bridge to that island. Only one who answers the riddles of the Pitutur Stone can raise it again.",
      "But mist ghosts roam the northern swamp. Drive off five of them first, so you can think in peace at that stone."] },
    { bab: "Chapter 2 · Misty Swamp", tujuan: "Drive off the Mist Ghosts in the northern swamp", teks: [
      "The mist thins a little. The Pitutur Stone by the water is clear now, its writing glowing."] },
    { bab: "Chapter 2 · Misty Swamp", tujuan: "Answer the three riddles of the Pitutur Stone", teks: [
      "The swamp water churns. A stone bridge slowly rises from the mud toward the island in the middle."] },
    { bab: "Chapter 2 · Misty Swamp", tujuan: "Defeat the White Crocodile on the swamp island", teks: [
      "The White Crocodile slumps, then its eyes clear again. It gazes at you a moment, then dives away.",
      "A cold blue stone is left on the shore. You got the Water Gem!",
      "The smell of the sea drifts in from east of the swamp. Perhaps the Wind Gem is there."] },
    { bab: "Chapter 3 · Fishing Village", tujuan: "Follow the path east of the swamp to the Fishing Village", teks: [
      "The sea breeze greets you. But the village is quiet, every door shut tight.",
      "A man in a woven hat waves from the pier."] },
    { bab: "Chapter 3 · Fishing Village", tujuan: "Meet Pak Jala, head of the Fishing Village", teks: [
      "You carry the gems? Resi Wening sent word by bird.",
      "Our family has guarded the Wind Gem for generations... but last night a gang of tuyul sneaked in and stole it!",
      "They run around the village. Catch them and take back the stolen pouches.",
      "Careful, tuyul love to pick careless pockets. Beat them to get your coins back."] },
    { bab: "Chapter 3 · Fishing Village", tujuan: "Take the stolen pouches back from the Tuyul", teks: [
      "The third pouch feels heavy. Something inside breathes cold, like the wind."] },
    { bab: "Chapter 3 · Fishing Village", tujuan: "Return the stolen pouches to Pak Jala", teks: [
      "Here it is! The Wind Gem, unharmed! Our ancestors must be smiling.",
      "Take it, child. Bring all three gems to Geni Crater, at the mountain's peak, through the deepest passage of Wingit Temple.",
      "The teleport beacon in this village is lit now. Open the map if you want a quick trip home."] },
    { bab: "Chapter 4 · Geni Crater", tujuan: "Climb to Geni Crater through the north passage of Wingit Temple", teks: [
      "The heat stings your skin. A river of lava splits the crater, and beyond it a giant ember beats like a heart.",
      "By the lava stands an altar with three hollows."] },
    { bab: "Chapter 4 · Geni Crater", tujuan: "Place the three gems on the altar", teks: [
      "The three gems shine: green, blue and white. The lava before you hisses, then hardens into a stone bridge.",
      "Who dares set foot in my crater? Come, child of man. I shall turn you to ash!"] },
    { bab: "Chapter 4 · Geni Crater", tujuan: "Defeat the Banaspati King", teks: [
      "Impossible... beaten... by a child of man...",
      "The giant flame dims to a small ember, then goes out. The red mist in the sky slowly fades.",
      "Return to Resi Wening in Wanasari Village."] },
    { bab: "Chapter 4 · Geni Crater", tujuan: "Return to Resi Wening in Wanasari Village", teks: [
      "The mist is gone. Listen, the birds are singing again.",
      "I have restored the seal with the three gems. All of Nusantara owes you, child.",
      "But remember: fire never truly dies. Keep training. Mystic mirrors have woken in the guardians' lairs, should you wish to test yourself again."] },
  ],
  sampingan: {
    kepiting: { title: "Naughty Crabs", offer: "Reef crabs are wrecking our nets on the south beach. Could you drive off six of them?", done: "The beach is safe again! Here's a reward from the fishermen." },
    sisik: { title: "Crocodile Scales", offer: "Bring me three swamp crocodile scales and I'll reforge your weapon. The crocodiles live in the southern swamp.", done: "Fine scales. Let me reforge your weapon a moment... there, sharper!" },
  },
  obrolan: {
    resi: ["That mist comes from Mount Geni. I can feel it.", "Keep training, child. The enemies ahead will grow stronger.", "Mbok Darmi sells good jamu. Don't leave without supplies."],
    tirto: ["This swamp used to be clear, young one. The fish were huge.", "Don't go too near deep water. Swamp crocodiles love to lunge.", "Mist ghosts fear light. Sadly I'm too old to carry a torch."],
    jala: ["The sea is calm. Hope tomorrow's catch is good.", "If you're tired, stop by Mak Inah's stall.", "Watch out for tuyul. Your purse can suddenly feel light!"],
    kardi: ["Today's waves are perfect for sailing.", "Reef crabs have hard shells. Keep hitting, no mercy!"],
  },
};

function t(key, v) {
  const s = (TEKS[bahasa] && TEKS[bahasa][key]) ?? TEKS.id[key] ?? key;
  return v ? s.replace(/\{(\w+)\}/g, (_, k) => (v[k] ?? "")) : s;
}

// ---------- Teks di HTML ----------
// Teks Indonesia dibaca langsung dari HTML (sekali, saat pertama dimuat).
for (const el of document.querySelectorAll("[data-t]")) TEKS.id[el.dataset.t] ??= el.textContent;
for (const el of document.querySelectorAll("[data-th]")) TEKS.id[el.dataset.th] ??= el.innerHTML;
for (const el of document.querySelectorAll("[data-ta]")) TEKS.id[el.dataset.ta] ??= el.getAttribute("aria-label");
function terapkanHTML() {
  document.documentElement.lang = bahasa;
  for (const el of document.querySelectorAll("[data-t]")) el.textContent = t(el.dataset.t);
  for (const el of document.querySelectorAll("[data-th]")) el.innerHTML = t(el.dataset.th);
  for (const el of document.querySelectorAll("[data-ta]")) el.setAttribute("aria-label", t(el.dataset.ta));
}

// ---------- Data game ----------
// Isi asli (Indonesia) disalin sekali, lalu nama/keterangan diganti sesuai bahasa.
let dataAsli = null;
function terapkanData() {
  if (!dataAsli) {
    dataAsli = {
      kelas: Object.fromEntries(Object.entries(CLASSES).map(([k, c]) => [k, { name: c.name, role: c.role, desc: c.desc, skill: c.skill.name }])),
      monster: Object.fromEntries(Object.entries(MONSTERS).map(([k, m]) => [k, m.name])),
      misi: QUESTS.map((q) => ({ title: q.title, offer: q.offer })),
      area: Object.fromEntries(Object.entries(AREAS).map(([k, a]) => [k, { nama: a.nama, sub: a.sub, gerbang: a.gerbang.map((g) => g.label) }])),
      cerita: CERITA.map((c) => ({ bab: c.bab, tujuan: c.tujuan, teks: (c.teks || []).map((x) => x[1]) })),
      sampingan: Object.fromEntries(SAMPINGAN.map((q) => [q.id, { title: q.title, offer: q.offer, done: q.done }])),
      obrolan: Object.fromEntries(NPC_DATA.filter((n) => n.obrolan).map((n) => [n.id, [...n.obrolan]])),
    };
  }
  const en = bahasa === "en";
  for (const [k, c] of Object.entries(CLASSES)) {
    const s = (en && DATA_EN.kelas[k]) || dataAsli.kelas[k];
    c.name = s.name; c.role = s.role; c.desc = s.desc; c.skill.name = s.skill;
  }
  for (const [k, m] of Object.entries(MONSTERS)) m.name = (en && DATA_EN.monster[k]) || dataAsli.monster[k];
  QUESTS.forEach((q, i) => { const s = (en && DATA_EN.misi[i]) || dataAsli.misi[i]; q.title = s.title; q.offer = s.offer; });
  for (const [k, a] of Object.entries(AREAS)) {
    const s = (en && DATA_EN.area[k]) || dataAsli.area[k];
    a.nama = s.nama; a.sub = s.sub;
    a.gerbang.forEach((g, i) => { g.label = (s.gerbang && s.gerbang[i]) || dataAsli.area[k].gerbang[i]; });
  }
  CERITA.forEach((c, i) => {
    const s = (en && DATA_EN.cerita[i]) || dataAsli.cerita[i];
    c.bab = s.bab; c.tujuan = s.tujuan;
    (c.teks || []).forEach((x, j) => { x[1] = (s.teks && s.teks[j]) || dataAsli.cerita[i].teks[j]; });
  });
  for (const q of SAMPINGAN) { const s = (en && DATA_EN.sampingan[q.id]) || dataAsli.sampingan[q.id]; q.title = s.title; q.offer = s.offer; q.done = s.done; }
  for (const n of NPC_DATA) if (n.obrolan) n.obrolan = (en && DATA_EN.obrolan[n.id]) || dataAsli.obrolan[n.id];
}

// Ganti bahasa & segarkan semua yang sedang tampil
function setBahasa(b) {
  bahasa = b === "en" ? "en" : "id";
  store.set(BAHASA_KEY, bahasa);
  terapkanSemua();
}
function terapkanSemua() {
  terapkanData();
  terapkanHTML();
  buildKeysHint();
  for (const n of NPCS) {
    if (n.kind === "cermin") n.name = t("cermin.nama");
    if (n.kind === "teleport") n.name = t("tele.nama");
    if (n.tekaId !== undefined || n.simbol) n.name = t({ prasasti: "teka.nPrasasti", obor: "teka.nObor", pitutur: "teka.nPitutur", altar: "teka.nAltar" }[n.kind]);
  }
  if (area) $("areaName").textContent = area.nama;
  if (mode === "select") buildSelect();
  if (S && P) refreshHud(true);
  refreshAudioButtons(); refreshLayar(); refreshBahasa(); refreshPanah();
  if (pauseView === "control") buildControls();
  if (S) isiStatJeda();
  if (world) world = null;   // peta dunia dibuat ulang (nama area)
}
// Tombol di halaman Bahasa
function refreshBahasa() {
  for (const b of document.querySelectorAll("[data-bahasa]")) b.setAttribute("aria-pressed", String(b.dataset.bahasa === bahasa));
}
for (const b of document.querySelectorAll("[data-bahasa]")) b.addEventListener("click", () => setBahasa(b.dataset.bahasa));
terapkanHTML();
