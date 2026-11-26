// =====================================================================
// MONSTER, BOS & JIMAT ARC 2 "Benang Sepi" (data; gambarnya di 47-gambar-dunia-baru.js,
// efek unik jimat legenda baru di 99zn-jimat-legenda-baru.js)
// Level dinaikkan: batas level pemain 80 → 100, karena musuh arc 2 berlevel 48-80.
// =====================================================================
"use strict";

ATURAN.level.maks = 100;

Object.assign(MONSTERS, {
  // ---- Dunia 5 · Sabana Timur ----
  begalTopeng:   { name: "Begal Bertopeng",   nameEn: "Masked Bandit",     lv: 48, hp: 720,  atk: 64,  speed: 120, r: 16, h: 52, exp: 520,  gold: [42, 74],  range: 150, wind: 0.6,  cd: 1.5, aggro: 260, charge: true, debuff: { jenis: "lemah", peluang: 0.3, lama: 4 } },
  kucingGarong:  { name: "Kucing Garong",     nameEn: "Alley Tomcat",      lv: 49, hp: 560,  atk: 62,  speed: 185, r: 13, h: 24, exp: 500,  gold: [40, 70],  range: 24,  wind: 0.3,  cd: 0.85, aggro: 260, debuff: { jenis: "berdarah", peluang: 0.3, lama: 4 } },
  wayangHidup:   { name: "Wayang Hidup",      nameEn: "Living Puppet",     lv: 52, hp: 820,  atk: 70,  speed: 115, r: 14, h: 56, exp: 600,  gold: [46, 80],  range: 26,  wind: 0.45, cd: 1.1, aggro: 300, kedip: 4.5, debuff: { jenis: "bingung", peluang: 0.25, lama: 3 } },
  kalajengking:  { name: "Kalajengking Sabana", nameEn: "Savanna Scorpion", lv: 56, hp: 960, atk: 76,  speed: 105, r: 16, h: 22, exp: 740,  gold: [50, 88],  range: 30,  wind: 0.5,  cd: 1.2, aggro: 230, debuff: { jenis: "racun", peluang: 0.45, lama: 6 } },
  kerbauAmuk:    { name: "Kerbau Amuk",       nameEn: "Raging Buffalo",    lv: 57, hp: 1400, atk: 82,  speed: 90,  r: 22, h: 40, exp: 800,  gold: [54, 92],  range: 170, wind: 0.7,  cd: 1.8, aggro: 220, charge: true, debuff: { jenis: "lumpuh", peluang: 0.25, lama: 1 } },
  kudaLiar:      { name: "Kuda Liar",         nameEn: "Wild Horse",        lv: 58, hp: 1050, atk: 80,  speed: 175, r: 20, h: 46, exp: 820,  gold: [55, 94],  range: 160, wind: 0.45, cd: 1.3, aggro: 280, charge: true, debuff: { jenis: "lemah", peluang: 0.3, lama: 5 } },
  arwahTugu:     { name: "Arwah Tugu",        nameEn: "Pillar Spirit",     lv: 60, hp: 1150, atk: 84,  speed: 80,  r: 16, h: 56, exp: 900,  gold: [58, 100], range: 26,  wind: 0.5,  cd: 1.4, aggro: 300, fly: true, tembak: { cd: 2.2, speed: 300, jarak: 340, warna: "#d9b36a" }, debuff: { jenis: "lambat", peluang: 0.3, lama: 3 } },
  // ---- Dunia 6 · Rimba Raya & Puncak Salju ----
  harimauDahan:  { name: "Harimau Dahan",     nameEn: "Clouded Leopard",   lv: 64, hp: 1300, atk: 92,  speed: 175, r: 18, h: 34, exp: 1080, gold: [62, 108], range: 30,  wind: 0.32, cd: 0.95, aggro: 280, debuff: { jenis: "berdarah", peluang: 0.35, lama: 4 } },
  labaHutan:     { name: "Laba-laba Hutan",   nameEn: "Jungle Spider",     lv: 65, hp: 1250, atk: 88,  speed: 120, r: 17, h: 26, exp: 1100, gold: [64, 110], range: 28,  wind: 0.4,  cd: 1.1, aggro: 240, tembak: { cd: 2.6, speed: 240, jarak: 300, warna: "#e8e2f0" }, debuff: { jenis: "lambat", peluang: 0.45, lama: 3 } },
  kalongRaksasa: { name: "Kalong Raksasa",    nameEn: "Giant Fruit Bat",   lv: 66, hp: 1150, atk: 90,  speed: 190, r: 15, h: 54, exp: 1120, gold: [64, 112], range: 24,  wind: 0.3,  cd: 0.9, aggro: 320, fly: true, debuff: { jenis: "berdarah", peluang: 0.25, lama: 3 } },
  kambingGunung: { name: "Kambing Gunung",    nameEn: "Mountain Goat",     lv: 69, hp: 1700, atk: 98,  speed: 120, r: 19, h: 40, exp: 1350, gold: [70, 120], range: 170, wind: 0.55, cd: 1.5, aggro: 240, charge: true, debuff: { jenis: "lumpuh", peluang: 0.3, lama: 1 } },
  rohSalju:      { name: "Roh Salju",         nameEn: "Snow Spirit",       lv: 70, hp: 1400, atk: 96,  speed: 150, r: 15, h: 52, exp: 1400, gold: [70, 122], range: 26,  wind: 0.35, cd: 1.0, aggro: 300, fly: true, kedip: 4, debuff: { jenis: "lambat", peluang: 0.45, lama: 3 } },
  arcaEs:        { name: "Arca Es",           nameEn: "Ice Statue",        lv: 71, hp: 2200, atk: 104, speed: 70,  r: 20, h: 58, exp: 1500, gold: [74, 128], range: 150, wind: 0.7,  cd: 1.8, aggro: 220, charge: true, debuff: { jenis: "lambat", peluang: 0.5, lama: 3 } },

  // ---- Bos arc 2 (pola serangan "umum", 35-monster-dunia-baru.js; sama seperti bos bab 6-10) ----
  juraganTopeng: { name: "Juragan Topeng",    nameEn: "The Mask Smuggler", lv: 52, hp: 46000,  atk: 80,  speed: 100, r: 30, h: 92,  exp: 18000, gold: [3200, 3800], range: 60, wind: 0.75, cd: 1.1, aggro: 420, boss: true, ai: "umum",
    pola: ["terjang", "sembur", "hantam", "hujan"], anak: "begalTopeng", jenisHujan: "batu", warnaPeluru: "#e9c46a", debuff: { jenis: "lemah", peluang: 0.4, lama: 5 } },
  kudaSembrani:  { name: "Kuda Sembrani Hitam", nameEn: "Black Sembrani",  lv: 60, hp: 60000,  atk: 90,  speed: 140, r: 36, h: 112, exp: 22000, gold: [3600, 4200], range: 64, wind: 0.7,  cd: 1.1, aggro: 440, boss: true, ai: "umum", fly: true,
    pola: ["terjang", "hujan", "terjang", "sembur"], anak: "kudaLiar", jenisHujan: "pasir", warnaPeluru: "#d9b36a", debuff: { jenis: "lumpuh", peluang: 0.25, lama: 1 } },
  watuGede:      { name: "Watu Gede",         nameEn: "The Stone Colossus", lv: 64, hp: 72000, atk: 95,  speed: 70,  r: 42, h: 132, exp: 25000, gold: [3800, 4500], range: 72, wind: 0.85, cd: 1.2, aggro: 420, boss: true, ai: "umum",
    pola: ["hantam", "hujan", "hantam", "terjang"], anak: "arwahTugu", jenisHujan: "batu", warnaPeluru: "#a8936a", debuff: { jenis: "lumpuh", peluang: 0.3, lama: 1.2 } },
  weweGombel:    { name: "Wewe Gombel",       nameEn: "Wewe Gombel",       lv: 68, hp: 82000,  atk: 100, speed: 110, r: 34, h: 122, exp: 28000, gold: [4000, 4800], range: 64, wind: 0.75, cd: 1.1, aggro: 440, boss: true, ai: "umum", fly: true,
    pola: ["sembur", "terjang", "hujan", "sembur"], anak: "kalongRaksasa", jenisHujan: "racun", warnaPeluru: "#9b7bd6", debuff: { jenis: "bingung", peluang: 0.35, lama: 3 } },
  yaksaEs:       { name: "Yaksa Es",          nameEn: "Ice Yaksa",         lv: 73, hp: 96000,  atk: 108, speed: 85,  r: 40, h: 132, exp: 32000, gold: [4400, 5200], range: 70, wind: 0.8,  cd: 1.15, aggro: 440, boss: true, ai: "umum",
    pola: ["hantam", "sembur", "hujan", "terjang"], anak: "rohSalju", jenisHujan: "es", warnaPeluru: "#bfe8ff", debuff: { jenis: "lambat", peluang: 0.5, lama: 3 } },
  macanPutih:    { name: "Macan Putih",       nameEn: "White Tiger",       lv: 76, hp: 108000, atk: 112, speed: 150, r: 36, h: 72,  exp: 36000, gold: [4800, 5600], range: 62, wind: 0.6,  cd: 1.0, aggro: 460, boss: true, ai: "umum",
    pola: ["terjang", "hantam", "terjang", "hujan"], anak: "rohSalju", jenisHujan: "es", warnaPeluru: "#f2f6ff", debuff: { jenis: "berdarah", peluang: 0.4, lama: 4 } },
  dalangSepi:    { name: "Dalang Sepi",       nameEn: "The Silent Puppeteer", lv: 80, hp: 140000, atk: 120, speed: 100, r: 34, h: 126, exp: 50000, gold: [6000, 7000], range: 66, wind: 0.75, cd: 1.0, aggro: 560, boss: true, ai: "umum", jarakPulang: 900,
    pola: ["sembur", "hujan", "terjang", "hantam"], anak: "wayangHidup", jenisHujan: "sepi", warnaPeluru: "#3a2a55", debuff: [{ jenis: "bingung", peluang: 0.3, lama: 3 }, { jenis: "lemah", peluang: 0.3, lama: 5 }] },
});

SPAWN.push(
  { monster: "begalTopeng", zona: "gangBarat", jumlah: 7 },
  { monster: "kucingGarong", zona: "gangTimur", jumlah: 7 },
  { monster: "begalTopeng", zona: "gudangDepan", jumlah: 4 },
  { monster: "kucingGarong", zona: "gudangDepan", jumlah: 4 },
  { monster: "wayangHidup", zona: "sumurZona", jumlah: 6 },
  { monster: "wayangHidup", zona: "mercuZona", jumlah: 6 },
  { monster: "wayangHidup", zona: "tamanZona", jumlah: 7 },
  { monster: "wayangHidup", zona: "pustakaZona", jumlah: 6 },
  { monster: "kalajengking", zona: "sabanaBarat", jumlah: 8 },
  { monster: "kerbauAmuk", zona: "sabanaTengah", jumlah: 5 },
  { monster: "kudaLiar", zona: "sabanaTimur", jumlah: 6 },
  { monster: "arwahTugu", zona: "sabanaUtara", jumlah: 4 },
  { monster: "arwahTugu", zona: "lembahSelatan", jumlah: 7 },
  { monster: "wayangHidup", zona: "lembahUtara", jumlah: 5 },
  { monster: "arwahTugu", zona: "tuguPinggir", jumlah: 7 },
  { monster: "harimauDahan", zona: "rimbaSelatan", jumlah: 7 },
  { monster: "labaHutan", zona: "rimbaUtara", jumlah: 7 },
  { monster: "kalongRaksasa", zona: "rimbaTimur", jumlah: 6 },
  { monster: "labaHutan", zona: "beringinSelatan", jumlah: 6 },
  { monster: "kalongRaksasa", zona: "beringinTengah", jumlah: 4 },
  { monster: "wayangHidup", zona: "beringinTengah", jumlah: 4 },
  { monster: "kambingGunung", zona: "lerengBawah", jumlah: 7 },
  { monster: "rohSalju", zona: "lerengAtas", jumlah: 7 },
  { monster: "arcaEs", zona: "guaDepan", jumlah: 5 },
  { monster: "rohSalju", zona: "guaDepan", jumlah: 3 },
  { monster: "kambingGunung", zona: "puncakBawah", jumlah: 5 },
  { monster: "rohSalju", zona: "puncakBawah", jumlah: 4 },
  { monster: "wayangHidup", zona: "puncakTengah", jumlah: 6 },
  { monster: "wayangHidup", zona: "kelirBawah", jumlah: 6 },
  { monster: "arcaEs", zona: "kelirBawah", jumlah: 3 },
);

Object.assign(BOS_TANGGUH, {
  juraganTopeng: { tier: 14, tipuan: 0.36, amukan: 15, kombo: 0.35, kudaKuda: 12 },
  kudaSembrani:  { tier: 15, tipuan: 0.37, amukan: 15, kombo: 0.36, kudaKuda: 12 },
  watuGede:      { tier: 16, tipuan: 0.38, amukan: 14, kombo: 0.37, kudaKuda: 11 },
  weweGombel:    { tier: 17, tipuan: 0.38, amukan: 14, kombo: 0.38, kudaKuda: 11 },
  yaksaEs:       { tier: 18, tipuan: 0.39, amukan: 13, kombo: 0.39, kudaKuda: 10 },
  macanPutih:    { tier: 19, tipuan: 0.4,  amukan: 13, kombo: 0.4,  kudaKuda: 10 },
  dalangSepi:    { tier: 20, tipuan: 0.42, amukan: 12, kombo: 0.42, kudaKuda: 9 },
});

Object.assign(JIMAT, {
  // legenda: khas tiap bos arc 2
  topengJuragan: { name: "Topeng Juragan", rarity: "legenda", bos: "juraganTopeng", efek: { koin: 0.3, kritis: 0.06, rampas: 1 }, en: { name: "Smuggler's Mask" } },
  tapalSembrani: { name: "Tapal Sembrani", rarity: "legenda", bos: "kudaSembrani", efek: { gerak: 0.15, hindarCd: 0.2, lariAngin: 1 }, en: { name: "Sembrani Horseshoe" } },
  intiWatu:      { name: "Inti Watu Gede", rarity: "legenda", bos: "watuGede", efek: { hp: 0.2, tahan: 0.1, kebal: ["lumpuh"], kulitBatu: 1 }, en: { name: "Colossus Core" } },
  selendangWewe: { name: "Selendang Wewe", rarity: "legenda", bos: "weweGombel", efek: { hisap: 0.05, kebal: ["bingung"], pelukWewe: 1 }, en: { name: "Wewe's Shawl" } },
  taringYaksa:   { name: "Taring Yaksa Es", rarity: "legenda", bos: "yaksaEs", efek: { atk: 0.14, lumpuh: 0.12, kebal: ["lambat"], esRetak: 1 }, en: { name: "Ice Yaksa Fang" } },
  kumisMacan:    { name: "Kumis Macan Putih", rarity: "legenda", bos: "macanPutih", efek: { kritis: 0.08, kritisKali: 0.35, aumanPutih: 1 }, en: { name: "White Tiger Whisker" } },
  wayangSepi:    { name: "Wayang Sepi", rarity: "legenda", bos: "dalangSepi", efek: { bos: 0.15, cd: 0.12, tenaga: 0.3, wayangBayangan: 1 }, en: { name: "Silent Puppet" } },
  // legenda dari puzzle opsional tersulit (tidak dijatuhkan bos)
  tuguLeluhur:   { name: "Tugu Mini Leluhur", rarity: "legenda", hadiahTeka: "tuguRahasia", efek: { exp: 0.2, hp: 0.1, tahan: 0.06, pulihDiam: 1 }, en: { name: "Ancestral Mini Pillar" } },
  kalungSalju:   { name: "Kalung Salju Abadi", rarity: "legenda", hadiahTeka: "esDalam", efek: { kebal: ["lambat", "lumpuh"], hindarCd: 0.25, gerak: 0.1, jejakEs: 1 }, en: { name: "Everlasting Snow Necklace" } },
});
