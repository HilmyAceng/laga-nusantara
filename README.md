# Laga Nusantara

Action RPG top-down. Desa Wanasari diganggu makhluk hutan. Pilih jagoan, jelajahi peta, naikkan level, selesaikan misi dari Ki Lurah, lalu kalahkan Genderuwo di gua timur.
Bisa dimainkan di HP (joystick + tombol sentuh, mode lanskap) dan desktop (keyboard), serta bisa diinstal sebagai aplikasi (PWA). Progres tersimpan otomatis di perangkat.

## Fitur

- **Peta 64×44 petak**: desa, sungai & jembatan, hutan timur, padang utara dan selatan, serta gua bos
- **4 kelas hero**: Pendekar, Pemanah, Pendobrak, Penyihir. Masing-masing punya serangan dan jurus sendiri
- **Monster**: Kera Liar (Lv1), Kelelawar (Lv3, terbang), Babi Hutan (Lv4, menyeruduk), Genderuwo (bos Lv8)
- **Progres**: EXP & naik level (nyawa dan serangan bertambah), koin, jamu, tingkat senjata
- **Misi berantai** dari Ki Lurah dan **toko** Mbok Darmi
- **Musik gamelan & efek suara** yang dibuat oleh kode (tanpa file audio). Musik berganti sesuai tempat: desa, luar, gua, bos
- **Peta mini**, serangan auto-bidik, guling menghindar (kebal sesaat), tanda merah sebelum musuh menyerang

## Kontrol

- HP: joystick kiri untuk gerak. Tombol Serang (tahan), Jurus, Hindar, Jamu, dan Bicara (muncul di dekat NPC)
- Keyboard: tombol panah untuk gerak, `D` serang (tahan), `S` jurus, `A` hindar, `W` jamu, `E` bicara, `Esc` jeda, `M` musik nyala/mati
- Lupa tombolnya? Buka **menu jeda**: ada panduan kontrol untuk keyboard dan HP

## Struktur file

- `src/config.js`: **semua angka & teks yang boleh diubah**. Mulai dari sini.
- `src/game.html`: mesin game (gerak, gambar, AI monster, HUD). Tidak perlu disentuh untuk menyeimbangkan game.

## Di mana mengubah apa (`src/config.js`)

| Bagian | Isi |
|---|---|
| `KONTROL` | Tombol keyboard untuk tiap aksi |
| `ATURAN` | Modal awal, rumus level, harga toko, jamu, hindar, kritis, pingsan, drop, seed peta |
| `CLASSES` | Stat hero: `hp`, `atk`, `speed`, serangan, jurus |
| `MONSTERS` | Stat monster: `hp`, `atk`, `exp`, `gold`, `aggro` (jarak mulai mengejar), `wind` (lama ancang-ancang) |
| `SPAWN` | Berapa banyak monster di tiap zona |
| `QUESTS` | Daftar misi: tipe `kill` / `collect`, jumlah, teks, hadiah |
| `LAGU` | Musik latar tiap tempat: melodi (notasi slendro `1 2 3 5 6`), tempo, suara, pola kendang, gong |
| `ATURAN.audio` | Volume musik dan efek suara |

Yang masih di `src/game.html`: bentuk peta (`buildMap()`), dialog NPC (`talk()`), cara kerja tiap jurus, dan resep efek suara (`sfx`).

## Build & jalankan

```bash
./build.sh
python3 -m http.server 8766 --directory public
```

Setiap kali ada update untuk pemain, naikkan versi `CACHE` di `public/sw.js` (misal `laga-v7`).

## Ide pengembangan berikutnya

- Inventaris dan perlengkapan (armor, aksesoris)
- Dungeon tambahan dan misi sampingan
- Sprite gambar sendiri atau aset dari Kenney.nl
- Multiplayer co-op online (butuh server WebSocket)
