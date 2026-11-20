# Laga Nusantara

Action RPG top-down. Desa Wanasari diganggu makhluk hutan. Pilih jagoan, jelajahi peta, naikkan level, selesaikan misi dari Ki Lurah, lalu kalahkan Genderuwo di gua timur.
Bisa dimainkan di HP (joystick + tombol sentuh, mode lanskap) dan desktop (keyboard), serta bisa diinstal sebagai aplikasi (PWA). Progres tersimpan otomatis di perangkat, termasuk area & posisi terakhir: keluar aplikasi atau refresh, lalu "Lanjutkan" membawamu kembali ke tempat tadi.

## Fitur

- **Empat peta terpisah** dengan layar transisi (gelap + nama area) saat pindah:
  - **Desa Wanasari**: aman, ada Ki Lurah, Mbok Darmi & Pak Wowo (belum bisa diajak bicara). Keluar lewat jembatan di timur
  - **Hutan & Padang**: hutan, padang utara & selatan, semua monster biasa. Mulut gua di timur, jalan ke candi di utara
  - **Gua Genderuwo**: dungeon gelap tempat bos. Pingsan di luar desa = pulang ke desa. Setelah misi utama selesai, muncul **Cermin Gaib** melayang: sentuh untuk memanggil Genderuwo lagi (hadiah 10 koin, bisa diulang tiap 30 detik)
  - **Candi Wingit**: dungeon reruntuhan di utara hutan, berisi kelelawar & babi hutan. Ada **Mesin Teleport** dekat pintu masuk: berdiri di dekatnya untuk memulihkan nyawa (energi 1000, terisi 1 tiap 5 menit), dan klik ikonnya di peta besar untuk pindah ke sana
- **4 kelas hero**: Pendekar, Pemanah, Pendobrak, Penyihir. Masing-masing punya serangan dan jurus sendiri
- **Monster**: Kera Liar (Lv1), Kelelawar (Lv3, terbang), Babi Hutan (Lv4, menyeruduk), Genderuwo (bos Lv8)
- **Progres**: EXP & naik level (nyawa dan serangan bertambah), koin, jamu, tingkat senjata
- **Misi berantai** dari Ki Lurah dan **toko** Mbok Darmi
- **Musik gamelan & efek suara** yang dibuat oleh kode (tanpa file audio). Lima lagu dengan suasana berbeda: riang (desa), tegang (hutan), seram (gua & candi), paling tegang (bos), dan musik kemenangan. Lagu punya lapisan melodi, isian, bas, kendang & kecrek, dengan tangga nada slendro atau pelog
- **Peta mini**, serangan auto-bidik, guling menghindar (kebal sesaat), tanda merah sebelum musuh menyerang

## Kontrol

- HP: joystick kiri untuk gerak. Tombol Serang (tahan), Jurus, Hindar, Jamu, dan Bicara (muncul di dekat NPC)
- Keyboard: tombol panah untuk gerak, `D` serang (tahan), `S` jurus, `A` hindar, `W` jamu, `E` bicara, `M` buka peta besar (atau klik peta mini), `Esc` jeda, `N` musik nyala/mati

## Menu jeda

Semua menu memakai tombol. `Esc` = kembali satu halaman.

- **Lanjut**
- **Pengaturan**
  - **Volume**: musik dan efek suara, tombol `−` / `+` (10% per tekan) dan Nyala/Mati. Pilihan tersimpan
  - **Layar**: Full Screen nyala/mati (pilihan tersimpan; setelah halaman dibuka ulang, layar penuh aktif lagi pada sentuhan pertama). Di iPhone Safari belum didukung browser: pasang lewat "Tambahkan ke Layar Utama"
  - **Kontrol**: panduan tombol keyboard dan HP (dibaca otomatis dari `KONTROL` di `config.js`)
- **Menu utama**
- **Keluar Permainan** (khusus HP): simpan progres lalu keluar. Kalau browser tidak mengizinkan halaman menutup sendiri, muncul layar "Progres tersimpan" dan aplikasi tinggal ditutup dari HP

## Struktur file

- `src/config.js`: **semua angka & teks yang boleh diubah**. Mulai dari sini.
- `src/game.html`: tampilan (HTML + CSS) dan daftar file JS yang dimuat.
- `src/js/`: kode game, **satu fitur satu file**. Nomor di depan nama = urutan dimuat (penting: file bawah boleh memakai isi file atas).

| File | Fitur |
|---|---|
| `01-alat.js` | Fungsi bantu kecil (`$`, `clamp`, `rand`, `store` untuk simpanan) |
| `02-rumus.js` | Rumus EXP, nyawa, serangan |
| `03-peta.js` | Jenis petak dan bentuk 4 area (`AREAS`: Desa, Hutan & Padang, Gua, Candi) |
| `04-status.js` | Variabel utama (progres `S`, pemain `P`, monster), NPC desa, simpan |
| `05-area.js` | Pindah area + layar gelap (fade) + gerbang |
| `06-audio.js` | Mesin suara, volume, resep efek suara (`sfx`) |
| `07-musik.js` | Mesin musik gamelan (alat musik, gendang, tangga nada), pilih lagu sesuai area, musik kemenangan |
| `08-input.js` | Keyboard, joystick & tombol sentuh HP |
| `09-tarung.js` | Serangan, jurus tiap kelas, damage |
| `10-progres.js` | EXP, naik level, misi, layar menang |
| `11-dialog.js` | Dialog NPC: misi Ki Lurah, toko Mbok Darmi |
| `12-cermin.js` | Cermin Gaib di gua: panggil ulang bos (efek cahaya, kabut, kilat), hadiah koin & jeda |
| `13-teleport.js` | Mesin Teleport (tiang bendera): pulihkan nyawa dari energi mesin, teleport lewat peta besar |
| `14-update.js` | Logika tiap frame: gerak pemain, AI monster, peluru |
| `15-gambar.js` | Menggambar dunia, karakter, monster, efek |
| `16-peta-mini.js` | Peta mini |
| `17-peta-besar.js` | Peta besar (tombol `M` / klik peta mini): tab "Area ini" dan "Peta dunia" (semua area + tujuan misi), game berhenti selama dibuka |
| `18-hud.js` | Kotak misi, koin & jamu, cooldown, toast, layar mana yang tampil |
| `19-menu-jeda.js` | Menu jeda, volume, panduan kontrol |
| `20-layar-penuh.js` | Pengaturan › Layar: Full Screen nyala/mati (tersimpan) |
| `21-layar-judul.js` | Layar pilih hero & mulai permainan |
| `22-main.js` | Loop utama (dimuat paling akhir) |

Kalau menambah file JS baru: taruh di `src/js/` dengan nomor urut, tambahkan `<script src="js/...">` di `src/game.html`, lalu jalankan `./build.sh` (daftar file offline di `sw.js` ikut diperbarui otomatis).

## Di mana mengubah apa (`src/config.js`)

| Bagian | Isi |
|---|---|
| `KONTROL` | Tombol keyboard untuk tiap aksi |
| `ATURAN` | Modal awal, rumus level, harga toko, jamu, hindar, kritis, pingsan, drop, seed peta, hadiah & jeda Cermin Gaib (`ATURAN.cermin`), energi Mesin Teleport (`ATURAN.teleport`) |
| `CLASSES` | Stat hero: `hp`, `atk`, `speed`, serangan, jurus |
| `MONSTERS` | Stat monster: `hp`, `atk`, `exp`, `gold`, `aggro` (jarak mulai mengejar), `wind` (lama ancang-ancang) |
| `SPAWN` | Berapa banyak monster di tiap zona |
| `QUESTS` | Daftar misi: tipe `kill` / `collect`, jumlah, teks, hadiah |
| `LAGU` | Musik latar tiap tempat: melodi (notasi slendro `1 2 3 5 6`), tempo, suara, pola kendang, gong |
| `ATURAN.audio` | Volume awal musik dan efek suara (pemain bisa mengubahnya di Pengaturan › Volume) |

Yang ada di `src/js/` (bukan config): bentuk semua peta (`AREAS` di `03-peta.js`), dialog NPC (`talk()` di `11-dialog.js`), cara kerja tiap jurus (`09-tarung.js`), dan resep efek suara (`sfx` di `06-audio.js`).

## Build & jalankan

```bash
./build.sh
python3 -m http.server 8766 --directory public
```

Setiap kali ada update untuk pemain, naikkan versi `CACHE` di `public/sw.js` (misal `laga-v8`).

## Ide pengembangan berikutnya

- Inventaris dan perlengkapan (armor, aksesoris)
- Dungeon tambahan dan misi sampingan
- Sprite gambar sendiri atau aset dari Kenney.nl
- Multiplayer co-op online (butuh server WebSocket)
