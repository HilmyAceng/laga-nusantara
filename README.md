# Laga Nusantara

Action RPG top-down. Kabut merah turun dari Gunung Geni dan makhluk hutan menjadi beringas. Pilih jagoan, ikuti cerita 4 bab, kumpulkan tiga mustika, pecahkan teka-teki, dan kalahkan Raja Banaspati. Di sela cerita ada misi sampingan dari Ki Lurah dan warga lain.
Bisa dimainkan di HP (joystick + tombol sentuh, mode lanskap) dan desktop (keyboard), serta bisa diinstal sebagai aplikasi (PWA). Progres tersimpan otomatis di perangkat, termasuk area & posisi terakhir: keluar aplikasi atau refresh, lalu "Lanjutkan" membawamu kembali ke tempat tadi.

## Fitur

- **Cerita utama "Kabut dari Gunung Geni"** (4 bab, 18 langkah) dengan percakapan, hadiah, dan layar TAMAT. Diberi oleh Resi Wening
- **Tujuh peta terpisah** dengan layar transisi (gelap + nama area) saat pindah:
  - **Desa Wanasari**: aman. Ki Lurah (misi sampingan), Mbok Darmi (toko), Resi Wening (cerita), Pak Wowo (belum bisa diajak bicara), Mesin Teleport
  - **Hutan & Padang**: monster biasa. Jalan ke Gua (timur), Candi (utara), Rawa (selatan)
  - **Gua Genderuwo**: sarang bos Genderuwo (misi Ki Lurah)
  - **Candi Wingit**: teka-teki 4 obor, bos **Dwarapala**, lorong ke Kawah
  - **Rawa Kabut** (baru): berkabut, Hantu Kabut & Buaya Rawa, Mbah Tirto, teka-teki Batu Pitutur, bos **Buaya Putih**
  - **Kampung Nelayan** (baru): kampung tepi laut, Pak Jala, Mak Inah (toko), Bang Kardi, Tuyul & Kepiting Karang
  - **Kawah Geni** (baru): lava & Banaspati, altar tiga mustika, bos terakhir **Raja Banaspati**
- **Teka-teki**: nyalakan obor sesuai petunjuk prasasti, jawab 3 teka-teki Batu Pitutur (salah = hantu muncul), letakkan 3 mustika di altar
- **Mesin Teleport** di Desa, Candi, Rawa, Kampung & Kawah: pulihkan nyawa (energi 1000, terisi 1 tiap 5 menit), dan pindah cepat lewat peta besar (aktif setelah areanya didatangi)
- **Cermin Gaib** di sarang tiap bos (Genderuwo: setelah misi Ki Lurah selesai; bos lain: setelah cerita tamat): panggil bosnya lagi, hadiah 10 koin, jeda 30 detik
- **Navigasi nyaman**: panah emas di tepi layar menuju tujuan cerita (lengkap dengan jarak & nama area berikutnya), bintang tujuan di peta mini & peta besar, jalur emas di peta dunia, area yang belum didatangi tertutup kabut "???", tanda **!** / **?** di atas NPC (emas = cerita, biru = misi sampingan)
- **4 kelas hero**: Pendekar, Pemanah, Pendobrak, Penyihir. Masing-masing punya serangan dan jurus sendiri
- **Monster**: Kera Liar, Kelelawar (terbang), Babi Hutan (menyeruduk), Hantu Kabut (berteleportasi), Buaya Rawa (menerjang), Tuyul (mencopet koin lalu kabur), Kepiting Karang (keras), Banaspati (menembak bola api)
- **Bos**: Genderuwo, Dwarapala (hujan batu), Buaya Putih (terjangan & memanggil anak buaya), Raja Banaspati (semburan api, hujan api). Bos marah di bawah 50% nyawa
- **Progres**: EXP & naik level (nyawa dan serangan bertambah), koin, jamu, tingkat senjata
- **Misi sampingan**: rantai misi Ki Lurah, Bang Kardi (Kepiting Nakal), Mbah Tirto (Sisik Buaya: hadiah naik tingkat senjata). **Toko** Mbok Darmi & Mak Inah
- **Musik gamelan & efek suara** yang dibuat oleh kode (tanpa file audio). Lima lagu dengan suasana berbeda: riang (desa), tegang (hutan), seram (gua & candi), paling tegang (bos), dan musik kemenangan. Lagu punya lapisan melodi, isian, bas, kendang & kecrek, dengan tangga nada slendro atau pelog
- **Peta mini**, serangan auto-bidik, guling menghindar (kebal sesaat), tanda merah sebelum musuh menyerang

## Kontrol

- HP: joystick kiri untuk gerak. Tombol Serang (tahan), Jurus, Hindar, Jamu, dan Bicara (muncul di dekat NPC)
- Keyboard: tombol panah untuk gerak, `D` serang (tahan), `S` jurus, `A` hindar, `W` jamu, `E` bicara, `M` buka peta besar (atau klik peta mini), `Esc` jeda, `N` musik nyala/mati

## Menu jeda

Semua menu memakai tombol. `Esc` = kembali satu halaman.

- **Lanjut**
- **Pengaturan**
  - **Bahasa**: Indonesia (bawaan) atau English. Semua teks ikut berganti: menu, dialog, misi, nama area, monster & kelas hero. Pilihan tersimpan
  - **Kontrol**: panduan tombol keyboard dan HP (dibaca otomatis dari `KONTROL` di `config.js`)
  - **Volume**: musik dan efek suara, tombol `−` / `+` (10% per tekan) dan Nyala/Mati. Pilihan tersimpan
  - **Layar**: Full Screen nyala/mati (pilihan tersimpan; setelah halaman dibuka ulang, layar penuh aktif lagi pada sentuhan pertama). Di iPhone Safari belum didukung browser: pasang lewat "Tambahkan ke Layar Utama"
- **Credit**: siapa yang membuat game ini, dan dari mana grafis, musik & huruf berasal
- **Menu utama**
- **Keluar Permainan** (khusus HP): simpan progres lalu keluar. Kalau browser tidak mengizinkan halaman menutup sendiri, muncul layar "Progres tersimpan" dan aplikasi tinggal ditutup dari HP

## Struktur file

- `src/config.js`: **semua angka & teks yang boleh diubah**. Mulai dari sini.
- `src/game.html`: tampilan (HTML + CSS) dan daftar file JS yang dimuat.
- `src/js/`: kode game, **satu fitur satu file**. Nomor di depan nama = urutan dimuat (penting: file bawah boleh memakai isi file atas).

| File | Fitur |
|---|---|
| `00-galat.js` | Layar galat: kalau game gagal dimuat/error, tampilkan pesan + tombol "Perbaiki & muat ulang" (dimuat paling awal) |
| `01-alat.js` | Fungsi bantu kecil (`$`, `clamp`, `rand`, `store` untuk simpanan) |
| `02-bahasa.js` | Bahasa Indonesia / English: kamus teks (`TEKS`), terjemahan data game (`DATA_EN`), fungsi `t()` |
| `03-rumus.js` | Rumus EXP, nyawa, serangan |
| `04-peta.js` | Jenis petak dan bentuk 4 area (`AREAS`: Desa, Hutan & Padang, Gua, Candi) |
| `05-status.js` | Variabel utama (progres `S`, pemain `P`, monster), NPC desa, simpan |
| `06-area.js` | Pindah area + layar gelap (fade) + gerbang |
| `07-audio.js` | Mesin suara, volume, resep efek suara (`sfx`) |
| `08-musik.js` | Mesin musik gamelan (alat musik, gendang, tangga nada), pilih lagu sesuai area, musik kemenangan |
| `09-input.js` | Keyboard, joystick & tombol sentuh HP |
| `10-tarung.js` | Serangan, jurus tiap kelas, damage |
| `11-progres.js` | EXP, naik level, misi, layar menang |
| `12-dialog.js` | Dialog NPC: misi Ki Lurah, toko Mbok Darmi |
| `13-cermin.js` | Cermin Gaib di gua: panggil ulang bos (efek cahaya, kabut, kilat), hadiah koin & jeda |
| `14-teleport.js` | Mesin Teleport (tiang bendera): pulihkan nyawa dari energi mesin, teleport lewat peta besar |
| `15-update.js` | Logika tiap frame: gerak pemain, AI monster, peluru |
| `16-gambar.js` | Menggambar dunia, karakter, monster, efek |
| `17-peta-mini.js` | Peta mini |
| `18-peta-besar.js` | Peta besar (tombol `M` / klik peta mini): tab "Area ini" dan "Peta dunia" (semua area + tujuan misi), game berhenti selama dibuka |
| `19-hud.js` | Kotak misi, koin & jamu, cooldown, toast, layar mana yang tampil |
| `20-menu-jeda.js` | Menu jeda, volume, panduan kontrol |
| `21-layar-penuh.js` | Pengaturan › Layar: Full Screen nyala/mati (tersimpan) |
| `22-layar-judul.js` | Layar pilih hero & mulai permainan |
| `23-cerita.js` | Cerita utama: langkah, percakapan, hadiah, tanda NPC, titik tujuan |
| `24-sampingan.js` | Misi sampingan dari NPC lain (Bang Kardi, Mbah Tirto) |
| `25-teka-teki.js` | Teka-teki: obor candi, Batu Pitutur, altar mustika |
| `26-monster-baru.js` | Perilaku monster baru, pola serangan 3 bos baru, bola api & zona bahaya, gambar makhluk baru |
| `27-navigasi.js` | Panah tujuan, bintang di peta, jalur antar-area |
| `28-main.js` | Loop utama (dimuat paling akhir) |

Kalau menambah file JS baru: taruh di `src/js/` dengan nomor urut, tambahkan `<script src="js/...">` di `src/game.html`, lalu jalankan `./build.sh` (daftar file offline di `sw.js` ikut diperbarui otomatis).

## Di mana mengubah apa (`src/config.js`)

| Bagian | Isi |
|---|---|
| `KONTROL` | Tombol keyboard untuk tiap aksi |
| `ATURAN` | Modal awal, rumus level, harga toko, jamu, hindar, kritis, pingsan, drop, seed peta, hadiah & jeda Cermin Gaib (`ATURAN.cermin`), energi Mesin Teleport (`ATURAN.teleport`) |
| `CLASSES` | Stat hero: `hp`, `atk`, `speed`, serangan, jurus |
| `MONSTERS` | Stat monster: `hp`, `atk`, `exp`, `gold`, `aggro` (jarak mulai mengejar), `wind` (lama ancang-ancang) |
| `SPAWN` | Berapa banyak monster di tiap zona |
| `QUESTS` | Misi sampingan Ki Lurah: tipe `kill` / `collect`, jumlah, teks, hadiah |
| `CERITA` | Cerita utama langkah demi langkah: tipe `bicara` / `datang` / `kill` / `collect` / `teka` / `bos`, tujuan, percakapan, hadiah |
| `SAMPINGAN` | Misi sampingan dari NPC lain |
| `LAGU` | Musik latar tiap tempat: melodi (notasi slendro `1 2 3 5 6`), tempo, suara, pola kendang, gong |
| `ATURAN.audio` | Volume awal musik dan efek suara (pemain bisa mengubahnya di Pengaturan › Volume) |

Yang ada di `src/js/` (bukan config): bentuk semua peta, letak bos/teleport/teka-teki (`AREAS` di `04-peta.js`), daftar NPC & obrolannya (`NPC_DATA` di `05-status.js`), terjemahan Inggris (`02-bahasa.js`), dialog NPC (`talk()` di `12-dialog.js`), cara kerja tiap jurus (`10-tarung.js`), dan resep efek suara (`sfx` di `07-audio.js`).

## Nama sementara (silakan diganti)

Semua nama di bawah ini dibuat sementara. Ganti di tempat yang disebut, lalu jalankan `./build.sh`. Versi Inggrisnya ada di `src/js/02-bahasa.js` (`DATA_EN`).

| Apa | Nama sekarang | Diubah di |
|---|---|---|
| Judul cerita | Kabut dari Gunung Geni | `game.html` (layar tamat), `CERITA[].bab` |
| Bab | Kabut Pertama · Rawa Kabut · Kampung Nelayan · Kawah Geni | `CERITA[].bab` di `config.js` |
| NPC cerita | Resi Wening, Mbah Tirto, Pak Jala, Mak Inah, Bang Kardi | `NPC_DATA` di `05-status.js` |
| Area baru | Rawa Kabut, Kampung Nelayan, Kawah Geni | `AREAS` di `04-peta.js` |
| Monster baru | Hantu Kabut, Buaya Rawa, Tuyul, Kepiting Karang, Banaspati | `MONSTERS` di `config.js` |
| Bos baru | Dwarapala, Buaya Putih, Raja Banaspati | `MONSTERS` di `config.js` |
| Benda cerita | Mustika Bumi / Tirta / Bayu, kantong curian, sisik buaya | `TEKS` (`item.*`) di `02-bahasa.js` |
| Teka-teki | Prasasti & obor, Batu Pitutur, Altar Mustika | `TEKS` (`teka.*`) di `02-bahasa.js` |
| Gunung | Gunung Geni | teks di `CERITA` |

## Build & jalankan

```bash
./build.sh
python3 -m http.server 8766 --directory public
```

Setiap kali ada update untuk pemain, naikkan versi `CACHE` di `public/sw.js` (misal `laga-v8`).

## Ide pengembangan berikutnya

- Inventaris dan perlengkapan (armor, aksesoris)
- Sprite gambar sendiri atau aset dari Kenney.nl
- Multiplayer co-op online (butuh server WebSocket)
