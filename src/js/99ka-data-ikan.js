// =====================================================================
// DATA IKAN & SPOT MEMANCING
// 85 ikan: 50 biasa, 25 langka, 10 legenda, tersebar di 10 spot memancing (desa-desa di Dunia 1–6).
// Tiap spot: 5 ikan biasa, 2-3 langka, 1 legenda.
//
// Tambah ikan: panggil ikan(id, spot, kelangkaan, [namaID, namaEN], harga, [beratMin, beratMax], rupa, syarat)
//  - rupa  : { w: warna badan, w2: warna corak/sirip, b: bentuk, k: corak }
//            bentuk: "oval" (bawaan), "ramping", "pipih", "bulat", "belut", "lele"
//            corak : "" (polos), "garis", "totol", "sirip", "pelangi"
//  - syarat: { waktu: "malam" | "pagi" }  dan/atau  { cuaca: "hujan" | "salju" }
//            "hujan" = gerimis/hujan/hujan petir/badai; "salju" = salju/badai salju.
// ID lama (wader, nila, ..., ikanDewa) jangan diganti: sudah tersimpan di save pemain.
// =====================================================================
"use strict";

// Spot memancing (urutan = urutan di koleksi). Semuanya di desa / kampung / kota aman.
// npc  : spot ini dilayani NPC (tanpa papan).
// kolam: desa tanpa air → kolam buatan di tanah lapang, pelampung dijatuhkan ke kolam.
//        "es" (lubang es), "awan", "batu", "cahaya" = gaya gambarnya.
const SPOT_MANCING = {
  sungai:      { area: "desa", nama: ["Sungai Wanasari", "Wanasari River"], npc: "udin" },               // Dunia 1 · Desa Wanasari
  laut:        { area: "pesisir", nama: ["Dermaga Kampung Nelayan", "Fishermen's Pier"] },               // Dunia 1 · Kampung Nelayan
  bandar:      { area: "bandar", nama: ["Dermaga Bandar Segara", "Segara Harbor Pier"] },                // Dunia 2 · Bandar Segara
  teluk:       { area: "desaApung", nama: ["Teluk Desa Apung", "Floating Village Bay"] },                // Dunia 2 · Desa Apung
  kolamAwan:   { area: "awan", nama: ["Kolam Awan", "Cloud Pond"], kolam: "awan" },                      // Dunia 3 · Kampung Awan
  mataAir:     { area: "perkemahan", nama: ["Mata Air Perkemahan", "Camp Spring"], kolam: "cahaya" },    // Dunia 4 · Perkemahan Cahaya
  labuhan:     { area: "labuhan", nama: ["Dermaga Labuhan Tua", "Old Harbor Pier"] },                    // Dunia 5 · Kota Labuhan Lama
  kolamBatu:   { area: "kampungBatu", nama: ["Kolam Batu Megalit", "Megalith Stone Pool"], kolam: "batu" }, // Dunia 5 · Kampung Megalit
  sungaiRimba: { area: "rumahPanjang", nama: ["Sungai Rumah Panjang", "Longhouse River"] },              // Dunia 6 · Kampung Rumah Panjang
  danauEs:     { area: "pondok", nama: ["Lubang Es Danau Beku", "Frozen Lake Ice Hole"], kolam: "es" },  // Dunia 6 · Pondok Nini Embun
};
// Spot hanya di desa/kampung Dunia 1–6 (spot di dunia lain diabaikan oleh 99kb-spot-mancing.js).
const DUNIA_MANCING_MAKS = 6;

const IKAN = {};
function ikan(id, tempat, rar, nama, harga, berat, rupa, syarat) {
  IKAN[id] = { tempat, rar, nama, harga, berat, rupa: rupa || {}, syarat: syarat || null };
}
const MALAM = { waktu: "malam" }, PAGI = { waktu: "pagi" }, HUJAN = { cuaca: "hujan" }, SALJU_T = { cuaca: "salju" };

// ---------- 1. Sungai Wanasari (Dunia 1 · Desa Wanasari) ----------
ikan("wader", "sungai", "biasa", ["Ikan Wader", "Wader Fish"], 12, [0.05, 0.2], { w: "#c9d3dc", w2: "#7d93a8", b: "ramping" });
ikan("nila", "sungai", "biasa", ["Ikan Nila", "Tilapia"], 20, [0.2, 0.8], { w: "#7f8f86", w2: "#4d5c55", k: "garis" });
ikan("lele", "sungai", "biasa", ["Ikan Lele", "Catfish"], 25, [0.3, 1.2], { w: "#5b5348", w2: "#3a342c", b: "lele" });
ikan("mujair", "sungai", "biasa", ["Ikan Mujair", "Mozambique Tilapia"], 18, [0.15, 0.6], { w: "#6f6a5a", w2: "#c9533f", k: "sirip" });
ikan("tawes", "sungai", "biasa", ["Ikan Tawes", "Silver Barb"], 16, [0.1, 0.5], { w: "#d8d4c4", w2: "#e2b04a", b: "pipih", k: "sirip" });
ikan("gurame", "sungai", "langka", ["Ikan Gurame", "Giant Gourami"], 70, [1, 3.5], { w: "#a89770", w2: "#5a4c33", b: "pipih", k: "garis" });
ikan("hampala", "sungai", "langka", ["Ikan Hampala", "Hampala Barb"], 85, [0.8, 3], { w: "#c7ccc0", w2: "#d64a3a", k: "sirip" }, PAGI);
ikan("arwana", "sungai", "legenda", ["Arwana Emas", "Golden Arowana"], 300, [2, 6], { w: "#f2c14e", w2: "#d4862a", b: "ramping", k: "sirip" });

// ---------- 2. Dermaga Kampung Nelayan (Dunia 1 · Kampung Nelayan) ----------
ikan("kembung", "laut", "biasa", ["Ikan Kembung", "Mackerel"], 22, [0.2, 0.6], { w: "#6f93b0", w2: "#2f4e6b", k: "totol" });
ikan("tongkol", "laut", "biasa", ["Ikan Tongkol", "Little Tuna"], 30, [0.5, 2], { w: "#3e5f86", w2: "#c4d3e0", b: "ramping", k: "garis" });
ikan("selar", "laut", "biasa", ["Ikan Selar", "Yellowstripe Scad"], 20, [0.1, 0.4], { w: "#b9c7d0", w2: "#e8c547", k: "garis" });
ikan("layang", "laut", "biasa", ["Ikan Layang", "Round Scad"], 18, [0.1, 0.35], { w: "#7b98ad", w2: "#c9d7e0", b: "ramping" });
ikan("baronang", "laut", "biasa", ["Ikan Baronang", "Rabbitfish"], 28, [0.3, 1], { w: "#a49a6e", w2: "#e6dfb8", b: "pipih", k: "totol" });
ikan("kakap", "laut", "langka", ["Kakap Merah", "Red Snapper"], 90, [1, 5], { w: "#d4574a", w2: "#f2b0a2", k: "sirip" });
ikan("kerapu", "laut", "langka", ["Ikan Kerapu", "Grouper"], 110, [2, 8], { w: "#7a6a52", w2: "#d6a25a", b: "bulat", k: "totol" });
ikan("tenggiri", "laut", "langka", ["Ikan Tenggiri", "Spanish Mackerel"], 100, [2, 7], { w: "#8aa3b8", w2: "#3c5468", b: "ramping", k: "totol" }, PAGI);
ikan("ikanDewa", "laut", "legenda", ["Ikan Dewa", "Sacred Mahseer"], 450, [3, 12], { w: "#d9e4ea", w2: "#7fb7d6", k: "pelangi" });

// ---------- 3. Dermaga Bandar Segara (Dunia 2 · Bandar Segara) ----------
ikan("belanak", "bandar", "biasa", ["Ikan Belanak", "Mullet"], 30, [0.3, 1], { w: "#a4aeb2", w2: "#5e6a70", b: "ramping", k: "garis" });
ikan("glodok", "bandar", "biasa", ["Ikan Glodok", "Mudskipper"], 26, [0.05, 0.2], { w: "#7a7058", w2: "#59c2e0", b: "lele", k: "totol" });
ikan("kiper", "bandar", "biasa", ["Ikan Kiper", "Spotted Scat"], 32, [0.2, 0.6], { w: "#9c8e5a", w2: "#3a3320", b: "pipih", k: "totol" });
ikan("bandeng", "bandar", "biasa", ["Ikan Bandeng", "Milkfish"], 36, [0.5, 2], { w: "#c4ccd2", w2: "#8597a3", b: "ramping" });
ikan("keting", "bandar", "biasa", ["Ikan Keting", "Mangrove Catfish"], 34, [0.3, 1.2], { w: "#8a8270", w2: "#4a4436", b: "lele" });
ikan("kakapPutih", "bandar", "langka", ["Kakap Putih", "Barramundi"], 130, [3, 12], { w: "#c7cdc8", w2: "#6d7a74", k: "sirip" });
ikan("sumpit", "bandar", "langka", ["Ikan Sumpit", "Archerfish"], 120, [0.1, 0.4], { w: "#e2e2c8", w2: "#2a2a2a", b: "pipih", k: "garis" });
ikan("kuweh", "bandar", "langka", ["Ikan Kuweh", "Giant Trevally"], 140, [3, 15], { w: "#9aa4ac", w2: "#e2c25a", b: "pipih", k: "sirip" }, HUJAN);
ikan("rajaBakau", "bandar", "legenda", ["Raja Bakau", "Mangrove King"], 520, [8, 20], { w: "#4f6b3a", w2: "#d9c46a", b: "bulat", k: "pelangi" }, HUJAN);

// ---------- 4. Teluk Desa Apung (Dunia 2 · Desa Apung) ----------
ikan("ekorKuning", "teluk", "biasa", ["Ikan Ekor Kuning", "Yellowtail Fusilier"], 34, [0.2, 0.8], { w: "#5f8fc4", w2: "#f2d24a", b: "ramping", k: "sirip" });
ikan("kuniran", "teluk", "biasa", ["Ikan Kuniran", "Goatfish"], 30, [0.1, 0.4], { w: "#e8c9a0", w2: "#e8a03a", k: "garis" });
ikan("bijiNangka", "teluk", "biasa", ["Ikan Biji Nangka", "Yellowfin Goatfish"], 32, [0.15, 0.5], { w: "#e6b8a0", w2: "#c45a3a", k: "garis" });
ikan("lencam", "teluk", "biasa", ["Ikan Lencam", "Emperor Fish"], 38, [0.4, 1.5], { w: "#a9a080", w2: "#d4453a", b: "pipih", k: "sirip" });
ikan("layur", "teluk", "biasa", ["Ikan Layur", "Hairtail"], 36, [0.3, 1.2], { w: "#d9e2e8", w2: "#9fb2c0", b: "belut" }, null);
ikan("kakatua", "teluk", "langka", ["Ikan Kakatua", "Parrotfish"], 150, [1, 5], { w: "#3fb8a0", w2: "#e86ab0", b: "pipih", k: "pelangi" });
ikan("bubara", "teluk", "langka", ["Ikan Bubara", "Bluefin Trevally"], 140, [1, 6], { w: "#7aa8c8", w2: "#2a5c8a", b: "pipih", k: "totol" });
ikan("badut", "teluk", "langka", ["Ikan Badut", "Clownfish"], 125, [0.05, 0.15], { w: "#f2843a", w2: "#ffffff", b: "bulat", k: "garis" }, PAGI);
ikan("bulanPurnama", "teluk", "legenda", ["Ikan Bulan Purnama", "Full Moon Fish"], 560, [5, 16], { w: "#f2ecd0", w2: "#c9d8ff", b: "bulat", k: "pelangi" }, MALAM);

// ---------- 5. Kolam Awan (Dunia 3 · Kampung Awan) ----------
ikan("ikanKabut", "kolamAwan", "biasa", ["Ikan Kabut", "Mist Fish"], 44, [0.2, 0.7], { w: "#d8dfe8", w2: "#a8b8cc", k: "totol" });
ikan("ikanEmbun", "kolamAwan", "biasa", ["Ikan Embun", "Dew Fish"], 40, [0.05, 0.3], { w: "#bfe6f2", w2: "#ffffff", b: "ramping", k: "totol" });
ikan("pelangiKecil", "kolamAwan", "biasa", ["Ikan Pelangi Kecil", "Little Rainbowfish"], 46, [0.05, 0.2], { w: "#7ab8e8", w2: "#f28a5a", b: "pipih", k: "pelangi" });
ikan("masAwan", "kolamAwan", "biasa", ["Ikan Mas Awan", "Cloud Carp"], 50, [0.5, 2], { w: "#f2f2f2", w2: "#f2a03a", k: "totol" });
ikan("ikanAngin", "kolamAwan", "biasa", ["Ikan Angin", "Wind Fish"], 42, [0.1, 0.5], { w: "#c8e8d8", w2: "#6ab89a", b: "ramping", k: "sirip" });
ikan("koiPetir", "kolamAwan", "langka", ["Koi Petir", "Thunder Koi"], 190, [1, 4], { w: "#f2f2f2", w2: "#b88cff", k: "totol" });
ikan("bintangJatuh", "kolamAwan", "langka", ["Ikan Bintang Jatuh", "Falling Star Fish"], 210, [0.5, 2], { w: "#2a3a6a", w2: "#f4e08a", b: "pipih", k: "totol" }, MALAM);
ikan("koiPelangi", "kolamAwan", "legenda", ["Koi Awan Pelangi", "Rainbow Cloud Koi"], 650, [4, 12], { w: "#ffffff", w2: "#ff8ad8", k: "pelangi" }, PAGI);

// ---------- 6. Mata Air Perkemahan (Dunia 4 · Perkemahan Cahaya) ----------
ikan("gabus", "mataAir", "biasa", ["Ikan Gabus", "Snakehead"], 24, [0.4, 1.5], { w: "#4e5a3e", w2: "#2b3322", b: "ramping", k: "totol" });
ikan("sepat", "mataAir", "biasa", ["Ikan Sepat", "Three-spot Gourami"], 14, [0.05, 0.25], { w: "#9aa8a0", w2: "#3c4a52", b: "pipih", k: "totol" });
ikan("betok", "mataAir", "biasa", ["Ikan Betok", "Climbing Perch"], 15, [0.1, 0.3], { w: "#7c7a52", w2: "#46452c", k: "garis" });
ikan("belut", "mataAir", "biasa", ["Belut Sawah", "Swamp Eel"], 22, [0.2, 0.7], { w: "#6b5a3a", w2: "#3f331f", b: "belut" });
ikan("seluang", "mataAir", "biasa", ["Ikan Seluang", "Rasbora"], 10, [0.02, 0.08], { w: "#d4c9a8", w2: "#2b2b2b", b: "ramping", k: "garis" });
ikan("toman", "mataAir", "langka", ["Ikan Toman", "Giant Snakehead"], 95, [2, 7], { w: "#3e4a46", w2: "#d0603a", b: "ramping", k: "totol" });
ikan("sidat", "mataAir", "langka", ["Ikan Sidat", "River Eel"], 110, [1, 4], { w: "#5a5f4a", w2: "#c9c39a", b: "belut" }, MALAM);
ikan("betutu", "mataAir", "langka", ["Ikan Betutu", "Marble Goby"], 90, [0.5, 2], { w: "#8a7a5a", w2: "#3a2e1e", b: "lele", k: "totol" });
ikan("belutSiluman", "mataAir", "legenda", ["Belut Siluman", "Phantom Eel"], 380, [3, 9], { w: "#9b8fd6", w2: "#e8e2ff", b: "belut", k: "pelangi" }, MALAM);

// ---------- 7. Dermaga Labuhan Tua (Dunia 5 · Kota Labuhan Lama) ----------
ikan("kuro", "labuhan", "biasa", ["Ikan Kuro", "Threadfin"], 58, [0.5, 2], { w: "#c4b88a", w2: "#7a6e48", k: "sirip" });
ikan("gulamah", "labuhan", "biasa", ["Ikan Gulamah", "Croaker"], 54, [0.3, 1.2], { w: "#d2c8b0", w2: "#9a8a68" });
ikan("manyung", "labuhan", "biasa", ["Ikan Manyung", "Sea Catfish"], 62, [1, 4], { w: "#8a8e92", w2: "#4a4e52", b: "lele" });
ikan("bawalHitam", "labuhan", "biasa", ["Bawal Hitam", "Black Pomfret"], 66, [0.4, 1.5], { w: "#4a4a52", w2: "#8a8a96", b: "pipih" });
ikan("sebelah", "labuhan", "biasa", ["Ikan Sebelah", "Flounder"], 60, [0.3, 1.2], { w: "#a8946a", w2: "#5a4a32", b: "pipih", k: "totol" });
ikan("bawalPutih", "labuhan", "langka", ["Bawal Putih", "Silver Pomfret"], 240, [0.5, 2], { w: "#e8eef2", w2: "#b8c8d4", b: "pipih", k: "sirip" });
ikan("lemadang", "labuhan", "langka", ["Ikan Lemadang", "Mahi-mahi"], 260, [4, 15], { w: "#4ac0a0", w2: "#f2d23a", b: "ramping", k: "pelangi" }, HUJAN);
ikan("nagaLaut", "labuhan", "legenda", ["Ikan Naga Laut", "Sea Dragon Fish"], 820, [10, 30], { w: "#2a6a8a", w2: "#f2c14e", b: "belut", k: "pelangi" }, HUJAN);

// ---------- 8. Kolam Batu Megalit (Dunia 5 · Kampung Megalit) ----------
ikan("ikanLumpur", "kolamBatu", "biasa", ["Ikan Lumpur", "Mud Fish"], 50, [0.2, 0.8], { w: "#8a6e4a", w2: "#5a452c", b: "lele", k: "totol" });
ikan("julung", "kolamBatu", "biasa", ["Ikan Julung", "Halfbeak"], 48, [0.05, 0.2], { w: "#d4cca0", w2: "#4a6a3a", b: "ramping" });
ikan("waderPari", "kolamBatu", "biasa", ["Wader Pari", "Harlequin Rasbora"], 46, [0.02, 0.1], { w: "#e8a07a", w2: "#2a2a2a", b: "pipih", k: "garis" });
ikan("paray", "kolamBatu", "biasa", ["Ikan Paray", "Paray Barb"], 52, [0.1, 0.4], { w: "#c8c0a0", w2: "#d46a3a", k: "sirip" });
ikan("kepalaTimah", "kolamBatu", "biasa", ["Ikan Kepala Timah", "Whitespot Killifish"], 44, [0.02, 0.08], { w: "#a8b878", w2: "#e8eef2", b: "ramping", k: "totol" });
ikan("ikanKerbau", "kolamBatu", "langka", ["Ikan Kerbau", "Buffalo Fish"], 230, [2, 8], { w: "#4a4440", w2: "#c8b89a", b: "bulat", k: "sirip" });
ikan("debuEmas", "kolamBatu", "langka", ["Ikan Debu Emas", "Gold Dust Fish"], 250, [0.3, 1], { w: "#d8a84a", w2: "#fff2b8", k: "totol" }, PAGI);
ikan("hujanPertama", "kolamBatu", "legenda", ["Ikan Hujan Pertama", "First Rain Fish"], 780, [3, 9], { w: "#7ab8d8", w2: "#e8f6ff", k: "pelangi" }, HUJAN);

// ---------- 9. Sungai Rumah Panjang (Dunia 6 · Kampung Rumah Panjang) ----------
ikan("semah", "sungaiRimba", "biasa", ["Ikan Semah", "Malaysian Mahseer"], 64, [0.5, 2.5], { w: "#b8a878", w2: "#d46a4a", k: "sirip" });
ikan("baung", "sungaiRimba", "biasa", ["Ikan Baung", "Asian Redtail Catfish"], 68, [0.5, 3], { w: "#7a7468", w2: "#d4503a", b: "lele", k: "sirip" });
ikan("patin", "sungaiRimba", "biasa", ["Ikan Patin", "Pangasius"], 70, [1, 5], { w: "#9aa0a8", w2: "#5a6068", b: "lele" });
ikan("lais", "sungaiRimba", "biasa", ["Ikan Lais", "Glass Catfish"], 60, [0.1, 0.5], { w: "#d8dccc", w2: "#a8ac9a", b: "ramping" });
ikan("tengadak", "sungaiRimba", "biasa", ["Ikan Tengadak", "Tinfoil Barb"], 66, [0.3, 1.5], { w: "#e2dcc0", w2: "#d4403a", b: "pipih", k: "sirip" });
ikan("kelahMerah", "sungaiRimba", "langka", ["Kelah Merah", "Red Mahseer"], 280, [3, 12], { w: "#c45a3a", w2: "#f2c08a", k: "sirip" });
ikan("tapah", "sungaiRimba", "langka", ["Ikan Tapah", "Giant Wallago"], 300, [5, 20], { w: "#6a6a5e", w2: "#2e2e28", b: "lele", k: "totol" }, MALAM);
ikan("botia", "sungaiRimba", "langka", ["Ikan Botia", "Clown Loach"], 260, [0.05, 0.2], { w: "#f2a03a", w2: "#1e1e1e", k: "garis" });
ikan("belidaPurba", "sungaiRimba", "legenda", ["Belida Purba", "Ancient Featherback"], 900, [8, 25], { w: "#b8b0a0", w2: "#3a3a32", b: "pipih", k: "pelangi" }, MALAM);

// ---------- 10. Lubang Es Danau Beku (Dunia 6 · Pondok Nini Embun) ----------
ikan("esKecil", "danauEs", "biasa", ["Ikan Es Kecil", "Little Ice Fish"], 72, [0.05, 0.2], { w: "#d8f0ff", w2: "#8ac8e8", b: "ramping" });
ikan("ikanSalju", "danauEs", "biasa", ["Ikan Salju", "Snow Fish"], 76, [0.2, 0.8], { w: "#ffffff", w2: "#b8d4e8", k: "totol" });
ikan("ikanKaca", "danauEs", "biasa", ["Ikan Kaca", "Glass Fish"], 80, [0.05, 0.3], { w: "#e8f6f8", w2: "#a8d8e0", b: "pipih" });
ikan("batuDingin", "danauEs", "biasa", ["Ikan Batu Dingin", "Cold Rock Fish"], 84, [0.5, 2], { w: "#8a98a8", w2: "#4a5868", b: "bulat", k: "totol" });
ikan("embunBeku", "danauEs", "biasa", ["Ikan Embun Beku", "Frost Dew Fish"], 78, [0.1, 0.5], { w: "#c8e0f8", w2: "#ffffff", b: "ramping", k: "sirip" });
ikan("cahayaUtara", "danauEs", "langka", ["Ikan Cahaya Utara", "Aurora Fish"], 320, [1, 4], { w: "#3a6a8a", w2: "#7af2c0", k: "pelangi" }, MALAM);
ikan("taringEs", "danauEs", "langka", ["Ikan Taring Es", "Icefang"], 340, [2, 8], { w: "#a8c8e0", w2: "#ffffff", b: "ramping", k: "garis" }, SALJU_T);
ikan("kristalAbadi", "danauEs", "legenda", ["Ikan Kristal Abadi", "Everlasting Crystal Fish"], 1000, [5, 15], { w: "#e8fbff", w2: "#9ae0ff", b: "pipih", k: "pelangi" }, SALJU_T);

// Kelangkaan & tingkat kesulitan tarik-ulur (dipakai 99k-memancing.js)
const RAR_IKAN = {
  biasa: { bobot: 70, zona: 0.3, cepat: 0.55, liar: 0.9, warna: "#d9d4cc" },
  langka: { bobot: 25, zona: 0.27, cepat: 0.65, liar: 0.75, warna: "#8fd3ff" },
  legenda: { bobot: 5, zona: 0.22, cepat: 0.8, liar: 0.6, warna: "#f4b942" },   // diuji simulasi: biasa ±95%, langka ±90%, legenda ±33% tertangkap
};
