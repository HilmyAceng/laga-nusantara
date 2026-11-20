// =====================================================================
// CERITA UTAMA: "Kabut dari Gunung Geni" — 5 bab × 10 episode
// Tiap bab ada di file sendiri (bab-1.js ... bab-5.js). File ini menggabungkannya.
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

const CERITA = [...CERITA_BAB1, ...CERITA_BAB2, ...CERITA_BAB3, ...CERITA_BAB4, ...CERITA_BAB5];
