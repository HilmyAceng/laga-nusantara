// =====================================================================
// CERITA UTAMA: "Kabut dari Gunung Geni" (bab 1-10) + "Benang Sepi" (bab 11-20)
// Tiap bab ada di file sendiri (bab-1.js ... bab-10.js). File ini menggabungkannya.
//
// Bentuk satu langkah:
//   bab, ep (episode 1-10), judul (judul episode)
//   tipe:
//     "bicara" : bicara dengan NPC `npc` (teks = percakapannya)
//     "datang" : masuk ke area `area`
//     "kill"   : kalahkan `need` monster `target`
//     "collect": kumpulkan `need` barang `item`, jatuh dari monster `dari` (peluang 0-1)
//     "teka"   : selesaikan teka-teki `id` ("obor", "pitutur", "altar")
//     "bos"    : kalahkan bos `monster` (bos muncul saat langkah ini aktif)
//   tujuan = tulisan di kotak misi. teks = [pembicara, kalimat], diputar saat langkah
//   selesai. Pembicara: id NPC, "narasi", "hero" (pemain), atau id monster.
//   hadiah = { gold, exp, potion, item }. buka = kunci gerbang yang dibuka (kapal, kuil, pelangi).
//   en = terjemahan Inggris { bab, judul, tujuan, teks: [kalimat saja] }.
//   lama = nomor langkah di versi cerita lama (untuk memindahkan simpanan lama).
// Langkah terakhir selesai = layar TAMAT.
// =====================================================================
"use strict";

const CERITA = [...CERITA_BAB1, ...CERITA_BAB2, ...CERITA_BAB3, ...CERITA_BAB4, ...CERITA_BAB5,
  ...CERITA_BAB6, ...CERITA_BAB7, ...CERITA_BAB8, ...CERITA_BAB9, ...CERITA_BAB10,
  // arc 2 "Benang Sepi" (bab 11-20); simpanan yang sudah tamat bab 10 langsung lanjut ke bab 11
  ...CERITA_BAB11, ...CERITA_BAB12, ...CERITA_BAB13, ...CERITA_BAB14, ...CERITA_BAB15,
  ...CERITA_BAB16, ...CERITA_BAB17, ...CERITA_BAB18, ...CERITA_BAB19, ...CERITA_BAB20];
// langkah pertama arc 2 = akhir cerita pertama ("Kabut dari Gunung Geni")
const AKHIR_ARC1 = CERITA.findIndex((l) => l.bab.startsWith("Bab 11"));
