// =====================================================================
// DUNIA BARU (arc 2 "Benang Sepi", bab 11-20): petak & daftar dunia
//  - Petak baru: SALJU (bisa dilewati), ES (licin: pemain meluncur, lihat
//    99zj-teka-seluncur.js), RUMPUT_KERING (rumput sabana, bisa dilewati).
//  - Dunia 5 Sabana Timur (04f-dunia-sabana.js), Dunia 6 Rimba Raya (04g-dunia-rimba.js),
//    map tambahan di dunia lama (04h-area-gema.js).
//  - Bendera area baru untuk warna tanah & pohon (47-gambar-dunia-baru.js):
//      sabana: true  → rumput kuning kering, pohon akasia
//      rimba: true   → rumput hijau tua, pohon raksasa berakar
//      salju: true   → tanah putih bersalju, pohon cemara bersalju
// =====================================================================
"use strict";

const SALJU = 18, ES = 19, RUMPUT_KERING = 20;

DUNIA.push(
  { id: 5, nama: "Sabana Timur", namaEn: "Eastern Savanna" },
  { id: 6, nama: "Rimba Raya", namaEn: "Great Rainforest" },
);

// mesin teleport di desa-desa baru (14-teleport.js membaca daftar ini saat dimuat)
ATURAN.teleport.area.push("labuhan", "kampungBatu", "rumahPanjang", "pondok");

