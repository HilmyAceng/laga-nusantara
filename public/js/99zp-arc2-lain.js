// =====================================================================
// ARC 2 "Benang Sepi": pelengkap
//  - nama barang cerita baru, toko & hiasan di desa-desa baru
//  - catatan Ensiklopedia untuk monster baru, kelemahan bos baru
//  - pencapaian & gelar baru; "tamat" (cerita pertama) kini = selesai bab 10
//  - catatan rilis 0.10.0-beta
// =====================================================================
"use strict";

// ---------- Peta dunia (18-peta-besar.js): area baru ikut disusun; area pertama tiap dunia = pusat ----------
WORLD_ORDER.push("sumurCandi", "mercusuar", "tamanGantung", "pustakaKala",
  "labuhan", "gangLabuhan", "gudang", "sabana", "kampungBatu", "lembahTugu", "tuguAgung",
  "rumahPanjang", "rimba", "beringin", "lereng", "pondok", "guaEs", "puncak", "kelir");

// ---------- Barang cerita ----------
const BARANG_ARC2 = {
  kendiSuara: ["Kendi suara", "Voice jar"], simpulCandi: ["Simpul benang candi", "Temple thread knot"], simpulMercu: ["Simpul benang mercusuar", "Lighthouse thread knot"],
  simpulTaman: ["Simpul benang taman", "Garden thread knot"], simpulPustaka: ["Simpul benang pustaka", "Library thread knot"], suraiKuda: ["Surai kuda", "Horse mane"],
  pecahanTugu: ["Pecahan tugu", "Pillar shard"], benangPutus: ["Benang putus", "Severed thread"], suteraLaba: ["Sutera laba-laba", "Spider silk"],
  sayapKalong: ["Selaput sayap kalong", "Bat wing membrane"], kristalEs: ["Kristal es", "Ice crystal"], tanduKambing: ["Tanduk kambing gunung", "Mountain goat horn"], serpihKelir: ["Serpih kelir", "Screen shard"],
};
for (const [k, [id, en]] of Object.entries(BARANG_ARC2)) { TEKS.id["item." + k] = id; TEKS.en["item." + k] = en; }

// ---------- Toko & hiasan di desa baru (sama seperti 68-hiasan.js & 70-warung-pahat.js) ----------
const WARUNG_ARC2 = {
  labuhan:      { warung: [17, 9],  bengkel: [33, 22], pahat: [31.4, 22.5], penjual: "Cik Ayu",     tukang: "Bang Jabal" },
  kampungBatu:  { warung: [14, 23], bengkel: [30, 9],  pahat: [28.4, 9.5],  penjual: "Ina Lede",    tukang: "Ama Rato" },
  rumahPanjang: { warung: [13, 22], bengkel: [27, 22], pahat: [25.4, 22.5], penjual: "Indai Sari",  tukang: "Apai Lungun" },
  pondok:       { warung: [24, 10], bengkel: [8, 21],  pahat: [9.6, 21.5],  penjual: "Mbok Kabut",  tukang: "Pak Beku" },
};
Object.assign(HIASAN, {
  labuhan: [{ k: "gerobak", x: 22.5, y: 13 }, { k: "perahu", x: 13, y: 27.6 }, { k: "perahu", x: 25, y: 27.4 }, { k: "gentong", x: 7.5, y: 7.7 }, { k: "pot", x: 26.4, y: 7.7 }, { k: "kucing", x: 18.5, y: 21.5, warna: "belang" }, { k: "jemuranIkan", x: 33, y: 25 }],
  kampungBatu: [{ k: "kayu", x: 7.5, y: 8 }, { k: "gentong", x: 25.4, y: 8.7 }, { k: "jemuran", x: 30.5, y: 25.2 }, { k: "ayam", x: 12.5, y: 17.6 }, { k: "ayam", x: 13.6, y: 18.3, warna: "coklat" }],
  rumahPanjang: [{ k: "kayu", x: 33.5, y: 9 }, { k: "gentong", x: 9.4, y: 11.7 }, { k: "perahu", x: 2.5, y: 22.5 }, { k: "ayam", x: 28.5, y: 18.6 }, { k: "kucing", x: 16.5, y: 12.5, warna: "abu" }],
  pondok: [{ k: "kayu", x: 11.5, y: 8 }, { k: "kayu", x: 20.5, y: 9 }, { k: "gentong", x: 26.4, y: 15.7 }],
});
for (const [id, d] of Object.entries(WARUNG_ARC2)) {
  HIASAN[id].push({ k: "warung", x: d.warung[0], y: d.warung[1] }, { k: "bengkel", x: d.bengkel[0], y: d.bengkel[1] });
  NPC_DATA.push({ id: "warung-" + id, nama: d.penjual, peran: "warung.peran", area: id, warung: true, x: d.warung[0] * T, y: (d.warung[1] - 0.7) * T,
    color: "#c0563a", accent: "#f4d58a", hair: "#2a201b", face: Math.PI / 2, get name() { return this.nama + " · " + t(this.peran); } });
  NPC_DATA.push({ id: "pahat-" + id, nama: d.tukang, peran: "pahat.peran", area: id, pahat: true, x: d.pahat[0] * T, y: d.pahat[1] * T,
    color: "#6b4a2e", accent: "#c9a26b", hat: "#8b5e3c", hair: "#1f1a24", face: Math.PI, get name() { return this.nama + " · " + t(this.peran); } });
}

// ---------- Ensiklopedia: catatan monster & kelemahan bos ----------
Object.assign(KISAH_MUSUH, {
  begalTopeng: ["Begal bertopeng putih anak buah Juragan Topeng. Mereka mencuri suara orang dan menyimpannya di kendi.", "White-masked bandits serving the Mask Smuggler. They steal people's voices and keep them in jars."],
  kucingGarong: ["Kucing jalanan gemuk berbekas luka yang menjaga gudang. Cakarnya membuat berdarah.", "Fat, scarred street cats guarding the warehouse. Their claws draw blood."],
  wayangHidup: ["Wayang kulit yang digerakkan benang sepi Dalang Sepi. Gerakannya patah-patah, dan sentuhannya membingungkan.", "Leather puppets moved by the Silent Puppeteer's threads. They twitch and jerk, and their touch confuses."],
  kalajengking: ["Kalajengking sabana sebesar anjing. Sengatnya beracun.", "Savanna scorpions the size of dogs. Their sting is venomous."],
  kerbauAmuk: ["Kerbau yang terjerat benang dan mengamuk. Tandukannya bisa melumpuhkan sesaat.", "Buffalo caught in the threads and gone wild. Their ram can briefly stun."],
  kudaLiar: ["Kuda liar sabana yang kehilangan pelindungnya. Cepat dan suka menerjang.", "Wild savanna horses that lost their protector. Fast, and fond of charging."],
  arwahTugu: ["Roh penunggu batu tegak yang terbangun marah. Melemparkan pecahan batu bercahaya.", "Spirits of the standing stones, woken in anger. They hurl glowing shards of stone."],
  harimauDahan: ["Macan dahan berbulu bercorak awan. Diam di dahan, lalu menerkam.", "Clouded leopards with cloud-patterned fur. Silent on the branch, then they pounce."],
  labaHutan: ["Laba-laba rimba yang menembakkan jaring lengket. Terkena jaringnya membuatmu lambat.", "Jungle spiders that shoot sticky webs. Getting caught slows you down."],
  kalongRaksasa: ["Kalong sebesar anak kambing yang terbang menukik dari kanopi.", "Fruit bats as big as young goats, diving out of the canopy."],
  kambingGunung: ["Kambing gunung berbulu tebal yang menyeruduk siapa pun di jalan setapak.", "Thick-coated mountain goats that ram anyone on the trail."],
  rohSalju: ["Roh dingin yang melayang di badai salju. Menghilang lalu muncul di dekatmu.", "Cold spirits drifting in the blizzard. They vanish and reappear right next to you."],
  arcaEs: ["Arca es yang hidup oleh benang sepi. Lambat, keras, dan menerjang.", "Ice statues animated by the silent threads. Slow, tough, and charging."],
  juraganTopeng: ["Pemimpin penyelundup Labuhan Lama. Topengnya berganti-ganti, dan ia bekerja untuk Ki Dalang.", "Leader of the Old Harbor smugglers. His masks keep changing, and he works for the Puppeteer."],
  kudaSembrani: ["Kuda bersayap pelindung kawanan sabana, dihitamkan oleh benang sepi.", "The winged protector of the savanna herds, blackened by the silent threads."],
  watuGede: ["Raksasa batu yang bangkit dari kaki Tugu Agung.", "A stone colossus risen from the foot of the Great Pillar."],
  weweGombel: ["Sosok tinggi berambut panjang dari cerita rakyat, penyembunyi anak-anak yang diabaikan.", "A tall, long-haired figure from folklore who hides neglected children."],
  yaksaEs: ["Raksasa penjaga Gua Es Bernyanyi, kini terikat benang sepi.", "The giant guardian of the Singing Ice Cave, now bound by silent threads."],
  macanPutih: ["Macan putih penjaga Puncak Salju Abadi.", "The white tiger guarding the Everlasting Snow Peak."],
  dalangSepi: ["Dalang bertopeng tanpa wajah yang ingin memainkan Lakon Sunyi di Kelir Beku.", "A faceless masked puppeteer who seeks to perform the Silent Play on the Frozen Screen."],
});
Object.assign(KELEMAHAN_BOS, {
  juraganTopeng: { lemah: "lumpuh", kebal: "bingung" },
  kudaSembrani: { lemah: "lambat", kebal: "lumpuh" },
  watuGede: { lemah: "racun", kebal: "berdarah" },
  weweGombel: { lemah: "terbakar", kebal: "bingung" },
  yaksaEs: { lemah: "terbakar", kebal: "lambat" },
  macanPutih: { lemah: "lemah", kebal: "berdarah" },
  dalangSepi: { lemah: "terbakar", kebal: "lumpuh" },
});

// ---------- Pencapaian & gelar ----------
{
  const tamat = CAPAI.find((c) => c.id === "tamat");
  if (tamat) { tamat.syarat = () => S.cerita.idx >= AKHIR_ARC1; tamat.desc = ["Tamatkan cerita pertama: Kabut dari Gunung Geni (Bab 1–10).", "Finish the first story: Mist from Mount Geni (Chapters 1–10)."]; }
}
const KISAH_ARC2 = ["rajaBanaspati", "silumanUlar", "panglimaKarang", "kelabang", "naga", "rajaJerangkong", "guritaRaksasa", "rajawaliPetir", "penjagaMenara", "kalamurka", "juraganTopeng", "kudaSembrani", "watuGede", "weweGombel", "yaksaEs", "macanPutih", "dalangSepi"];
const TEKA_RAHASIA = Object.keys(TEKA_BARU).filter((k) => TEKA_BARU[k].opsional);
daftarkanCapai({ id: "benangSepi", kat: "jalan", judul: ["Penenun Suara", "Weaver of Voices"], desc: ["Tamatkan cerita kedua: Benang Sepi (Bab 11–20).", "Finish the second story: The Silent Thread (Chapters 11–20)."], hadiah: HDH(3000, 15), syarat: () => S.cerita.idx >= CERITA.length });
daftarkanCapai({ id: "timur", kat: "jalan", judul: ["Angin dari Timur", "Wind from the East"], desc: ["Tiba di Kota Labuhan Lama.", "Arrive at the Old Harbor City."], hadiah: HDH(400, 2), syarat: () => !!(S.dikunjungi && S.dikunjungi.labuhan) });
daftarkanCapai({ id: "atapDunia", kat: "jalan", judul: ["Atap Dunia", "Roof of the World"], desc: ["Berdiri di Puncak Salju Abadi.", "Stand on the Everlasting Snow Peak."], hadiah: HDH(800, 4), syarat: () => !!(S.dikunjungi && S.dikunjungi.puncak) });
daftarkanCapai({ id: "tekaRahasia", kat: "jalan", judul: ["Pemecah Rahasia", "Secret Solver"], desc: ["Pecahkan semua teka-teki tersembunyi di Sabana & Rimba.", "Solve every hidden puzzle in the Savanna & Rainforest."], hadiah: HDH(2000, 10), progres: () => [TEKA_RAHASIA.filter((k) => S.teka[k]).length, TEKA_RAHASIA.length] });
daftarkanCapai({ id: "kisahSemua", kat: "jalan", judul: ["Penjaga Dongeng", "Keeper of Tales"], desc: ["Selesaikan kisah semua bos.", "Complete every boss's tale."], hadiah: HDH(3000, 12), progres: () => [KISAH.filter((k) => S.kisah && S.kisah[k.id] && S.kisah[k.id].selesai).length, KISAH.length] });
Object.assign(GELAR, {
  penenunSuara: { nama: ["Penenun Suara", "Weaver of Voices"], syarat: sudahCapai("benangSepi"), ket: ["Tamatkan Benang Sepi (Bab 20)", "Finish The Silent Thread (Chapter 20)"] },
  penjagaDongeng: { nama: ["Penjaga Dongeng", "Keeper of Tales"], syarat: sudahCapai("kisahSemua"), ket: ["Selesaikan kisah semua bos", "Complete every boss's tale"] },
});

// ---------- Catatan rilis ----------
CATATAN_RILIS.unshift({
  versi: "0.10.0-beta", tanggal: ["26 November 2026", "November 26, 2026"],
  judul: ["Benang Sepi: Cerita Kedua", "The Silent Thread: The Second Story"],
  baru: [
    ["Cerita baru Bab 11–20 \"Benang Sepi\": suara-suara dunia dicuri seorang dalang bertopeng. Lanjut langsung setelah Bab 10.", "New story, Chapters 11–20 \"The Silent Thread\": the world's voices are stolen by a masked puppeteer. Continues right after Chapter 10."],
    ["Dua dunia baru: Sabana Timur (kota pelabuhan, padang sabana, lembah tugu) dan Rimba Raya (hutan hujan, beringin tua, gua es, puncak salju).", "Two new worlds: the Eastern Savanna (harbor city, savanna plains, pillar valley) and the Great Rainforest (rainforest, old banyan, ice cave, snow peak)."],
    ["Empat tempat baru di dunia lama: Sumur Tua Candi, Mercusuar Tua, Taman Gantung, dan Pustaka Kala.", "Four new places in the old worlds: the Old Temple Well, Old Lighthouse, Hanging Garden, and Kala Library."],
    ["Jenis teka-teki baru: gamelan, cermin cahaya, putar arca & tugu, lantai nyala, dan seluncur es. Ada juga teka-teki tersembunyi yang sulit dengan hadiah jimat legenda.", "New puzzle types: gamelan, light mirrors, rotating statues & pillars, lit floors, and ice sliding. There are also hard hidden puzzles that reward legendary charms."],
    ["NPC kini lebih hidup: berjalan sesuai waktu hari (pagi, siang, sore, malam), menoleh & menyapa, dan berpindah tempat mengikuti cerita.", "NPCs feel more alive: they move with the time of day (morning, noon, evening, night), turn to greet you, and relocate as the story progresses."],
    ["Misi bergerak baru: NPC memandu jalan dengan kejadian di tengah jalan, mengawal NPC, membuntuti sosok mencurigakan, mengejar pencopet, dan mengikuti jejak.", "New moving quests: NPCs lead the way with events along the route, escort missions, tailing suspicious figures, chasing a pickpocket, and following tracks."],
    ["Tokoh cerita kini ikut bertarung di beberapa pertarungan bos.", "Story characters now fight alongside you in some boss battles."],
    ["Kisah untuk semua bos (17 kisah baru), termasuk asal-usul bos dari cerita rakyat Nusantara.", "Tales for every boss (17 new tales), including the folklore origins of bosses from Indonesian legend."],
    ["13 monster baru, 7 bos baru, 9 jimat legenda baru. Batas level naik menjadi 100.", "13 new monsters, 7 new bosses, 9 new legendary charms. Level cap raised to 100."],
    ["Layar muat saat membuka game.", "A loading screen when opening the game."],
  ],
  baik: [
    ["Anak buah yang dipanggil bos tidak lagi hidup kembali setelah dikalahkan, paling banyak 3 sekaligus per bos, dan ikut hilang saat bos kembali ke sarangnya.", "Minions summoned by bosses no longer respawn after being defeated, there are at most 3 at a time per boss, and they vanish when the boss returns to its lair."],
    ["Notif tengah di HP tidak lagi menutupi area main saat melawan bos.", "Center notifications on phones no longer cover the play area during boss fights."],
    ["HUD Mode Bertahan pindah ke bawah kotak misi.", "Survival Mode HUD moved below the quest box."],
  ],
});

// tanda "!" di ikon Info dihitung saat 99f-info.js dimuat (sebelum catatan 0.10.0 ditambahkan) → hitung ulang
hudInfo();

// ---------- Layar tamat: kini di akhir Benang Sepi (bab 20) ----------
Object.assign(TEKS.id, {
  "h.winEyebrow": "Tamat · Benang Sepi",
  "menang.stats": "{kelas} Lv {lv} menuntaskan kisah ini dan mengalahkan {kills} makhluk. Kabut merah sirna, bayangan Kalamurka tersegel, benang sepi terurai, dan suara-suara kembali ke keenam negeri.",
  "cerita.hudTamat": "<b>Tamat</b>Keenam negeri bersuara lagi. Bebas bertualang!",
});
Object.assign(TEKS.en, {
  "h.winEyebrow": "The End · The Silent Thread",
  "menang.stats": "{kelas} Lv {lv} finished the tale and defeated {kills} creatures. The red mist is gone, Kalamurka's shadow is sealed, the silent threads are undone, and voices have returned to all six realms.",
  "cerita.hudTamat": "<b>The End</b>All six realms have their voices back. Free roam!",
});
