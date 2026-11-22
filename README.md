# Laga Nusantara

Action RPG top-down. Kabut merah turun dari Gunung Geni dan makhluk hutan menjadi beringas. Pilih jagoan, ikuti cerita 4 bab, kumpulkan tiga mustika, pecahkan teka-teki, dan kalahkan Raja Banaspati. Di sela cerita ada misi sampingan dari Ki Lurah dan warga lain.
Bisa dimainkan di HP (joystick + tombol sentuh, mode lanskap) dan desktop (keyboard), serta bisa diinstal sebagai aplikasi (PWA). Progres tersimpan otomatis di perangkat, termasuk area & posisi terakhir: keluar aplikasi atau refresh, lalu "Lanjutkan" membawamu kembali ke tempat tadi.

## Fitur

- **Sistem tarung lanjutan**:
  - **4 jurus per kelas** (terbuka di Lv 1, 8, 18, 30), dua dipasang sekaligus (`S` & `F`). Contoh: Badai Golok, Gelombang Angin, Langkah Bayang, Panah Jerat, Hujan Panah, Panah Tembus, Benteng, Lompatan Palu, Raungan, Perisai Api, Tapak Es, Meteor
  - **Jurus pamungkas** (`R`, mulai Lv 5) saat bar **Tenaga Dalam** (garis emas di bawah nyawa) penuh: Seribu Tebasan, Panah Garuda, Palu Bumi, Hujan Meteor
  - **Cutscene**: prolog di awal permainan baru (dunia, ancaman kabut merah, tujuan pemain) & kemunculan dramatis tiap bos (kamera menyorot, nama & julukan besar, kalimat khas). Bisa dilewati (Lewati / Esc / tahan ketuk)
  - **Hero jarak dekat diperkuat**: Pendekar & Pendobrak 3 lapis hindar; pasif pengurang damage (Pendekar -10%, Pendobrak -20%); Tebasan Kilat kebal 1 detik; jurus baru Tebas Balik (ganti Badai Golok) & Dobrakan Perisai (ganti Raungan); Pendobrak punya Kulit Baja (-20% damage) & Benteng berupa perisai penyerap sejak Lv 1. Poin jurus lama dikembalikan otomatis
  - **Siap beta (v0.9.0-beta)**: pilihan kesulitan Santai / Normal / Sulit, Kode Save untuk cadangan & pindah perangkat, mode grafis ringan, nomor versi & tombol Kirim Masukan
  - **Koin lebih sulit**: monster kecil hanya kadang menjatuhkan koin (40%) dan jumlahnya ×0,7 (`ATURAN.monster.koinPeluang` / `koinKali`); bos tetap seperti biasa
  - **Warung & Tukang Pahat** di setiap desa: warung menjual jamu, ramuan & jimat; Tukang Pahat menaikkan tingkat senjata & menempa jimat. Pedagang lama (Mbok Darmi, Mak Inah, Mbak Sari, Empu Gora, Pak Sanip, Lintang) kini NPC obrolan. Misi panduan baru "Belanja di Warung" & "Senjata Lebih Tajam"
  - **Misi panduan diutamakan**: Latihan Dasar → Belanja di Warung → Senjata Lebih Tajam → Ramuan Penawar tampil & dilacak lebih dulu daripada cerita utama
  - **Warga keliling**: 15 warga (bocah, ibu, petani, nelayan, pedagang, pelaut, dll.) berjalan-jalan di 6 desa, bergumam, dan bisa diajak ngobrol; NPC cerita tetap diam
  - **Hiasan desa**: warung, gerobak, perahu, jemuran, lampion, pot bunga, dll. di 6 desa; kucing berkeliaran & mengeong saat didekati, ayam mematuk & kabur
  - **Level maksimal 80** dan EXP naik level ±1,5–2× lebih lambat (`ATURAN.level`)
  - **Koleksi Jimat**: daftar semua jimat (terkumpul x / 29) di Menu › Gameplay, jimat yang belum didapat tampil redup dengan petunjuk cara mendapatkannya
  - **Status Karakter**: halaman kekuatan, bonus jimat/pasif & catatan petualangan; tombol pintas Status, Jurus (lencana poin sisa) & Jimat di kiri koin; menu Gameplay kini langsung di menu jeda (di atas Pengaturan)
  - **Jeda jamu**: setelah minum jamu harus menunggu 10 detik; desktop punya kotak Jamu (tombol `W` atau klik)
  - **Teleport ke Cermin Gaib**: setiap cermin yang sudah muncul tampil (ikon ungu) di peta; ketuk untuk pindah ke depan cermin itu
  - **Arena bos lapang**: ruang bos di Candi, Rawa (pulau), Kawah, Gua Genderuwo, Hutan Larangan, Kuil, Hutan Batu, Makam, Gua Laut, Istana Awan & Menara Kala diperluas (mis. Kuil 16×8 → 36×9 petak, Rawa 9×7 → 18×10), dan bos mengejar lebih jauh sebelum pulang
  - **Hindar 2 lapis**: berguling atau tangkis bisa 2 kali beruntun (keduanya memakai lapis yang sama), tiap lapis terisi lagi 5 detik (di HP angka ×2 di bawah tulisan Hindar, berubah jadi hitung mundur detik saat habis; `ATURAN.hindar.lapis` & `isiUlang`)
  - **Hindar sempurna**: berguling tepat sebelum kena → waktu melambat, pukulan berikutnya pasti kritis
  - **Tangkis**: Hindar tanpa arah → serangan ditahan, penyerang lumpuh, kamu membalas
  - **Poin jurus**: 1 poin tiap naik level untuk rank jurus (kemampuan baru di rank 3 & 5) dan 5 pasif. Bisa diatur ulang dengan koin
- **Jimat** (Biasa / Langka / Legenda) di 2-3 slot. Biasa dijual di toko, Langka dari bos, Legenda khas tiap bos dari Cermin Gaib. Jimat bisa ditempa sampai ★5 dengan koin + Serpih Pusaka
- **Kegunaan koin**: jamu, asah senjata, jimat, tempa jimat, ramuan 2 menit (Kuat, Baja, Penangkal, Gesit), atur ulang poin jurus
- **Monster menguat sesuai level pemain** (sampai 12 level di atas aslinya; nyawa +16% & serangan +10% per level). Bos menguat lebih cepat (nyawa +15%, serangan +10%, gerak dasar ×1,4 lalu +3,5% per level, kecepatan serang +2,5% per level — paling cepat ×1,5 — ditambah pengali level asli), termasuk bos Cermin Gaib (kecepatan serang +4% tiap tingkat). Monster dunia berikutnya otomatis lebih tebal & lebih sakit. Selisih level berpengaruh, dan monster dunia 2+ belajar trik (lebih cepat, kadang memukul dua kali)
- **Bos tangguh** bertingkat dari mudah ke sulit: tipuan, amukan (lari ke lingkaran hijau, lalu bos kelelahan), kuda-kuda (pecahkan dengan tangkisan), kombo. **Naga Kencana dirombak** jadi 3 fase: kombo cakar, terbang & lajur api & cincin api, lalu amukan Nafas Matahari
- **Fase bos**: semua bos (cerita & Cermin Gaib) punya 2-3 fase. Nyawa habis → bangkit lagi dengan nyawa penuh: Fase 2 · Murka (lebih kuat & cepat, memanggil anak buah), Fase 3 · Amarah Terakhir (lebih kuat lagi, kebal sebagian damage, jurus khas lebih sering). Bar nyawa menulis "Fase n/m" (`FASE_BOS` di config)
- **Jurus khas tiap bos**: Genderuwo (Lempar Batu), Dwarapala (Gada Berputar), Buaya Putih (Gulungan Maut — menyelam lalu menyembul), Raja Banaspati (Pusaran Api), Siluman Ular (Kolam Racun, Tatapan Batu — balikkan badan!), Panglima Karang (Ombak Pasang), Kelabang (Terowongan), Raja Jerangkong (Tombak Tulang), Gurita Raksasa (Tinta Pekat, Sabetan Tentakel), Rajawali Petir (Badai Petir, Sambaran Kilat), Penjaga Menara (Lonceng Kala — cari penjuru hijau), Prabu Kalamurka (Cermin Bayang)
- **Debuff baru**: lumpuh (stun) dan berdarah (damage over time yang bertumpuk). Monster juga bisa lumpuh, beku, terjerat, melemah, dan terkena racun/terbakar/berdarah dari jurus & jimatmu
- **Latihan Dasar** bersama **Ki Sabda** di desa (misi sampingan cara bermain, 10 langkah) dan **Boneka Latihan** untuk berlatih hindar sempurna & tangkis kapan saja
- **Cerita utama "Kabut dari Gunung Geni"**: 10 bab × 10 episode (232 langkah) di `src/cerita/`, dengan percakapan panjang, hadiah, pengumuman "Tamat Bab / Mulai Bab", dan layar TAMAT. Simpanan versi lama otomatis dipindahkan ke langkah yang sama
- **Puzzle di cerita** (bab 6-10): urutan gong/lonceng/lentera sesuai pahatan, dorong batu ke lempeng (ada tuas reset), lempeng ingatan yang berkedip, dan batu/patung bertanya
- **Empat dunia**, peta dunia punya dropdown pilih dunia:
  - **Negeri Bayang** (lewat Gerbang Bayang di Makam Kuno): Perkemahan Cahaya (aman), Padang Bayang, Kota Mati, Menara Kala, Singgasana Bayang (bos terakhir **Prabu Kalamurka**)
  - Area tambahan: Sawah Terasering & Makam Kuno (dunia 1), Desa Apung & Gua Laut (dunia 2), Lembah Angin & Istana Awan (dunia 3)
  - **Tanah Wanasari** (7 area di bawah)
  - **Kepulauan Segara** (naik perahu Pak Jala): Bandar Segara (kota aman), Hutan Bakau, Hutan Larangan (bos **Siluman Ular**), Kuil Samudra (bos **Panglima Karang**)
  - **Negeri Awan** (lewat Tangga Pelangi): Kampung Awan (aman), Hutan Batu (bos **Kelabang Raksasa**), Puncak Naga (peta 60×60, bos terakhir **Naga Kencana** yang besar: semburan api, hujan meteor, kibasan ekor, terbang lalu menukik)
- **Debuff** dari monster tertentu & bos: racun, terbakar, lambat, lemah, bingung (ikon di atas kepala). Sembuh sendiri, di zona aman, atau dengan jamu setelah misi **Pak Joko** (Ramuan Penawar)
- **Zona aman**: kota/desa dan lingkaran di sekitar tiap mesin teleport. Monster tak bisa masuk, debuff hilang, nyawa pulih pelan
- **Hadiah equipment Cermin Gaib** (pasti tiap menang, tampil di popup tingkat): tingkat 1-2 jimat Biasa, 3-5 Biasa + Langka, 6-7 Langka + Legenda khas bos itu (`ATURAN.cermin.jimat`). Hadiah jamu dihapus
- **Tantangan bos** di Cermin Gaib: tingkat kesulitan 1-7 (tiap tingkat: nyawa +85%, serangan +32%, gerak +8%, kecepatan serang +6%, level saran +4), level karakter yang disarankan, hadiah per tingkat; tingkat berikutnya terbuka setelah tingkat sebelumnya dimenangkan
- **Peta Tanah Wanasari** dengan layar transisi (gelap + nama area) saat pindah:
  - **Desa Wanasari**: aman. Ki Lurah (misi sampingan), Mbok Darmi (toko), Resi Wening (cerita), Pak Wowo (belum bisa diajak bicara), Mesin Teleport
  - **Hutan & Padang**: monster biasa. Jalan ke Gua (timur), Candi (utara), Rawa (selatan)
  - **Gua Genderuwo**: sarang bos Genderuwo (misi Ki Lurah)
  - **Candi Wingit**: teka-teki 4 obor, bos **Dwarapala**, lorong ke Kawah
  - **Rawa Kabut** (baru): berkabut, Hantu Kabut & Buaya Rawa, Mbah Tirto, teka-teki Batu Pitutur, bos **Buaya Putih**
  - **Kampung Nelayan** (baru): kampung tepi laut, Pak Jala, Mak Inah (toko), Bang Kardi, Tuyul & Kepiting Karang
  - **Kawah Geni** (baru): lava & Banaspati, altar tiga mustika, bos terakhir **Raja Banaspati**
- **Notif "Dukung Kami"** kecil di atas tengah setiap bab cerita selesai, hilang sendiri setelah 10 detik (`ATURAN.dukung.lamaNotif`). Notif tengah lain sekarang di bagian atas layar supaya tidak menutupi karakter
- **Notif "belum saatnya"**: benda teka-teki & batu dorong yang disentuh sebelum waktunya memberi tahu di bab/episode mana ia dipakai; gerbang tertutup menyebut alasannya; sarang bos yang masih sepi memberi tanda
- **Teka-teki**: nyalakan obor sesuai petunjuk prasasti, jawab 3 teka-teki Batu Pitutur (salah = hantu muncul), letakkan 3 mustika di altar
- **Mesin Teleport** hanya di desa & kota (Desa Wanasari, Kampung Nelayan, Bandar Segara, Desa Apung, Kampung Awan, Perkemahan Cahaya; atur di `ATURAN.teleport.area`): pulihkan nyawa (energi 1000, terisi 1 tiap 5 menit), dan pindah cepat lewat peta besar (aktif setelah areanya didatangi)
- **Cermin Gaib** di sarang tiap bos (Genderuwo: setelah misi Ki Lurah selesai; bos lain: setelah bos itu dikalahkan): tantang lagi dengan tingkat 1-7, jeda 30 detik
- **Navigasi nyaman**: panah emas di tepi layar menuju tujuan cerita (lengkap dengan jarak & nama area berikutnya), bintang tujuan di peta mini & peta besar, jalur emas di peta dunia, area yang belum didatangi tertutup kabut "???", tanda **!** / **?** di atas NPC (emas = cerita, biru = misi sampingan)
- **4 kelas hero**: Pendekar, Pemanah, Pendobrak, Penyihir. Masing-masing punya serangan dan jurus sendiri
- **Monster**: Kera Liar, Kelelawar (terbang), Babi Hutan (menyeruduk), Hantu Kabut (berteleportasi), Buaya Rawa (menerjang), Tuyul (mencopet koin lalu kabur), Kepiting Karang (keras), Banaspati (menembak bola api)
- **Bos**: Genderuwo, Dwarapala (hujan batu), Buaya Putih (terjangan & memanggil anak buaya), Raja Banaspati (semburan api, hujan api). Bos marah di bawah 50% nyawa
- **Progres**: EXP & naik level (nyawa dan serangan bertambah), koin, jamu, tingkat senjata
- **Misi sampingan**: rantai misi Ki Lurah, Bang Kardi, Mbah Tirto, Pak Joko (resep penawar debuff), Bayu, Pak Rimba, Nyi Laras, Kirana, Empu Gora (naik tingkat senjata), Ki Angon. **Toko** Mbok Darmi, Mak Inah, Mbak Sari, Empu Gora
- **Suara makhluk** (sintetis, tanpa file): tiap monster punya suara khas saat melihatmu, saat ancang-ancang (tanda serangan), dan saat mati; bos meraung saat mengejar, ganti fase, jurus khas & amukan; hero bersuara saat menyerang, berjurus, berguling, menangkis, terluka, dan pamungkas (nada beda tiap kelas); NPC "mengoceh" saat bicara dengan nada khas. Volume sendiri di Pengaturan › Volume › Suara makhluk
- **Musik gamelan yang hidup**: nada berkekuatan beda & sedikit meleset seperti dimainkan manusia, ayunan, kenong & kempul penanda frasa, frasa A/B bergantian dengan imbal peking dan isian kendang, saron rangkap oktaf, bas berdenyut, kendang ciblon (2× rapat), rol kendang yang naik menjelang akhir frasa, gema ruang, lapisan tarung saat dikejar monster, dan tempo bos makin cepat saat nyawanya menipis (`semangat`, `ayun`, `frasa` di `LAGU`)
- **Musik gamelan & efek suara** yang dibuat oleh kode (tanpa file audio). Lima lagu dengan suasana berbeda: riang (desa), tegang (hutan), seram (gua & candi), paling tegang (bos), dan musik kemenangan. Lagu punya lapisan melodi, isian, bas, kendang & kecrek, dengan tangga nada slendro atau pelog
- **Peta mini**, serangan auto-bidik, guling menghindar (kebal sesaat), tanda merah sebelum musuh menyerang

## Kontrol

- HP: joystick kiri untuk gerak. Di kanan: Serang (tahan), Jurus 1 & Jurus 2 di samping Serang, Pamungkas di atas Serang, Jamu di atas Pamungkas, Hindar di kiri bawah, dan Bicara (muncul di dekat NPC)
- Keyboard: tombol panah untuk gerak, `D` serang (tahan), `S` jurus 1, `F` jurus 2, `R` pamungkas, `A` hindar (+ arah = berguling, tanpa arah = tangkis), `W` jamu, `E` bicara, `M` buka peta besar (atau klik peta mini), `J` daftar misi, `K` halaman jurus, `I` halaman jimat, `Tab` / `C` status karakter, `Esc` jeda, `N` musik nyala/mati
- HP: tombol tambahan Jurus 2 dan Pamungkas (muncul mulai Lv 5)

## Menu jeda

Semua menu memakai tombol. `Esc` = kembali satu halaman.

- **Lanjut**
- **Pengaturan**
  - **Bahasa**: Indonesia (bawaan) atau English. Semua teks ikut berganti: menu, dialog, misi, nama area, monster & kelas hero. Pilihan tersimpan
  - **Kontrol**: panduan tombol keyboard dan HP (dibaca otomatis dari `KONTROL` di `config.js`)
  - **Volume**: musik, efek suara, dan suara makhluk, tombol `−` / `+` (10% per tekan) dan Nyala/Mati. Pilihan tersimpan
  - **Gameplay**: Cara Bermain (panduan lengkap), Jurus & Poin Jurus, Jimat, Debuff
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
| `02a-teks-tempur.js` | Teks ID/EN untuk jurus, jimat, bos tangguh, debuff baru, cara bermain |
| `03-rumus.js` | Rumus EXP, nyawa, serangan |
| `04-peta.js` | Jenis petak, daftar `DUNIA`, area dunia 1 (`AREAS`), gerbang berkunci |
| `04a-dunia-segara.js` | Area dunia 2: Bandar Segara, Hutan Bakau, Hutan Larangan, Kuil Samudra |
| `04b-dunia-awan.js` | Area dunia 3: Kampung Awan, Hutan Batu, Puncak Naga |
| `04c-area-tambahan.js` | Area tambahan dunia 1-3: Sawah, Makam Kuno, Desa Apung, Gua Laut, Lembah Angin, Istana Awan |
| `04d-dunia-bayang.js` | Dunia 4 Negeri Bayang: Perkemahan Cahaya, Padang Bayang, Kota Mati, Menara Kala, Singgasana |
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
| `28-dukung.js` | Tombol "Dukung Kami" di halaman Credit (link di `ATURAN.dukung.tautan`) |
| `29-zoom-peta.js` | Zoom in / out & geser peta besar (tombol +/-, roda mouse, cubit di HP) |
| `30-daftar-misi.js` | Popup daftar misi (judul, perintah, hadiah) & pilih misi yang dilacak |
| `32-debuff.js` | Debuff dari serangan monster (racun, terbakar, lambat, lemah, bingung) & ikonnya |
| `33-zona-aman.js` | Zona aman di kota & sekitar mesin teleport |
| `34-tantangan-bos.js` | Popup tingkat kesulitan 1-7 di Cermin Gaib |
| `35-monster-dunia-baru.js` | Pola serangan bos "umum" & gambar monster dunia 2 dan 3 |
| `36-naga.js` | Pola serangan & gambar Naga Kencana |
| `38-panduan-debuff.js` | Tanya debuff ke Pak Joko & halaman Menu › Pengaturan › Gameplay › Debuff |
| `39-notif-item.js` | Notifikasi kecil dapat barang di kiri bawah |
| `40-ganti-bab.js` | Pengumuman "Tamat Bab ... / Mulai Bab ..." |
| `41-teka-urutan.js` | Puzzle urutan (gong, lonceng, lentera) |
| `42-teka-dorong.js` | Puzzle dorong batu ke lempeng |
| `43-teka-memori.js` | Puzzle lempeng ingatan (ikuti urutan kedipan) |
| `44-teka-tebak.js` | Puzzle tebak-tebakan (Batu Bertanya) |
| `45-monster-bayang.js` | Gambar monster & bos bab 6-10 |
| `46-kalamurka.js` | Pola serangan & gambar Prabu Kalamurka |
| `48-jurus.js` | 4 jurus tiap kelas, slot jurus 1 & 2, efek & peluru jurus |
| `49-pamungkas.js` | Bar Tenaga Dalam & jurus pamungkas |
| `50-hindar-tangkis.js` | Hindar sempurna (waktu melambat) & tangkis |
| `51-poin-jurus.js` | Poin jurus, pasif, halaman Jurus (tombol K) |
| `52-jimat.js` | Jimat, tempa, ramuan, bonus stat, halaman Jimat (tombol I) |
| `53-drop-langka.js` | Drop jimat & serpih dari bos, hadiah equipment Cermin Gaib per tingkat, monster |
| `54-skala-monster.js` | Monster menguat sesuai level, selisih level, trik serang ganda |
| `55-debuff-baru.js` | Debuff lumpuh & berdarah, status monster (lumpuh/beku/lambat/lemah/DoT) |
| `56-cara-bermain.js` | Ki Sabda, Boneka Latihan, misi Latihan Dasar, halaman Cara Bermain |
| `57-bos-tangguh.js` | Trik semua bos: tipuan, amukan, kuda-kuda, kombo |
| `59-jurus-khas-bos.js` | Jurus khas 12 bos (selain naga), kolam racun, ombak, tinta, penjuru kala |
| `60-belum-saatnya.js` | Notif "belum saatnya" untuk benda teka-teki, batu dorong, gerbang tertutup, sarang bos sepi |
| `61-suara-makhluk.js` | Suara sintetis monster, bos, hero & ocehan NPC; batas suara bersamaan & jarak |
| `62-fase-bos.js` | Fase bos 2-3: bangkit dengan nyawa penuh, kekuatan tambahan tiap fase |
| `63-area-bos.js` | Area bos: jarak bos mengejar sebelum menyerah & pulang (`ATURAN.areaBos`) |
| `64-cermin-peta.js` | Cermin Gaib yang sudah muncul tampil di peta mini, peta area & peta dunia; ketuk ikonnya untuk teleport ke depan cermin |
| `65-jamu-jeda.js` | Jeda jamu 10 detik (`ATURAN.jamuJeda`), kotak Jamu di desktop (W / klik) & lencana jumlah di tombol HP |
| `66-status-karakter.js` | Halaman Status Karakter (tombol 👤 / `Tab` / `C`, tidak lagi di menu) & tombol pintas ⚔ 💎 👤 di kiri koin (halaman Jurus & Jimat tidak lagi di menu Gameplay) |
| `67-koleksi-jimat.js` | Menu › Gameplay › Koleksi Jimat: semua jimat per rarity, yang sudah & belum didapat beserta cara mendapatkannya |
| `68-hiasan.js` | Hiasan desa: warung, gerobak, perahu, jemuran, lampion, dll. + kucing & ayam yang bergerak sendiri (`HIASAN`) |
| `69-warga-keliling.js` | Warga keliling di desa: berjalan sendiri, bergumam, bisa diajak ngobrol (`WARGA`, `JENIS_WARGA`) |
| `70-warung-pahat.js` | Warung (jamu, ramuan, jimat) & Tukang Pahat + bengkel (tingkatkan senjata, tempa jimat) di 6 desa; misi panduan tipe `aksi`; misi panduan diutamakan di daftar misi |
| `71-kesulitan.js` | Tingkat kesulitan Santai / Normal / Sulit (`ATURAN.kesulitan`), dipilih di layar judul atau Menu › Pengaturan |
| `72-kode-save.js` | Kode Save: ekspor (salin / unduh) & impor progres antar perangkat |
| `73-grafis-ringan.js` | Mode grafis ringan (resolusi 1×, partikel dikurangi) di Menu › Pengaturan › Layar |
| `74-versi-masukan.js` | Nomor versi (`ATURAN.versi`) di layar judul & menu jeda, tombol Kirim Masukan (`ATURAN.masukan.url`) |
| `76-melee.js` | Hero jarak dekat: 3 lapis hindar, kebal Tebasan Kilat, Tebas Balik, Kulit Baja, Benteng berperisai, Dobrakan Perisai (`ATURAN.melee`) |
| `78-sutradara.js` | Sistem cutscene: kamera, teks, judul, gelap/terang, guncang, kilat, pita film, tombol Lewati (`mainkanAdegan`) |
| `79-prolog.js` | Prolog saat permainan baru: cerita dunia & apa yang harus dilakukan pemain |
| `80-adegan-bos.js` | Cutscene kemunculan 13 bos (sekali per bos; tidak untuk Cermin Gaib), julukan & kalimat khas (`ADEGAN_BOS`) |
| `81-main.js` | Loop utama (dimuat paling akhir) |

Cerita utama ada di folder `src/cerita/`: `bab-1.js` ... `bab-5.js` (satu file per bab), digabung di `semua.js`.

Kalau menambah file JS baru: taruh di `src/js/` dengan nomor urut, tambahkan `<script src="js/...">` di `src/game.html`, lalu jalankan `./build.sh` (daftar file offline di `sw.js` ikut diperbarui otomatis).

## Di mana mengubah apa (`src/config.js`)

| Bagian | Isi |
|---|---|
| `KONTROL` | Tombol keyboard untuk tiap aksi |
| `ATURAN` | Modal awal, rumus level, harga toko, jamu, hindar, kritis, pingsan, drop, seed peta, tingkat & hadiah tantangan bos (`ATURAN.cermin`), debuff (`ATURAN.debuff`), zona aman (`ATURAN.zonaAman`), energi Mesin Teleport (`ATURAN.teleport`) |
| `CLASSES` | Stat hero: `hp`, `atk`, `speed`, serangan, jurus |
| `MONSTERS` | Stat monster: `hp`, `atk`, `exp`, `gold`, `aggro` (jarak mulai mengejar), `wind` (lama ancang-ancang) |
| `SPAWN` | Berapa banyak monster di tiap zona |
| `QUESTS` | Misi sampingan Ki Lurah: tipe `kill` / `collect`, jumlah, teks, hadiah |
| (`src/cerita/`) | Cerita utama per bab: tipe `bicara` / `datang` / `kill` / `collect` / `teka` / `bos`, episode, tujuan, percakapan, hadiah, terjemahan `en` |
| `SAMPINGAN` | Misi sampingan dari NPC lain |
| `ATURAN.areaBos` | Jarak kejar bos dari sarang: `max(dasar × kali, minimal)` piksel |
| `ATURAN.tenaga` / `hindarSempurna` / `tangkis` / `poinJurus` / `jimat` / `skalaMonster` | Angka-angka sistem tarung baru |
| `JURUS` / `PAMUNGKAS` / `PASIF` | Jurus tiap kelas (level buka, jeda, damage, kemampuan rank 3 & 5), pamungkas, pasif |
| `JIMAT` / `RAMUAN` | Semua jimat (rarity, efek, harga) dan ramuan toko |
| `BOS_TANGGUH` / `DEBUFF_TAMBAHAN` | Tier & trik tiap bos; monster pemberi lumpuh/berdarah |
| `LATIHAN` | Langkah misi Latihan Dasar (Ki Sabda) |
| `LAGU` | Musik latar tiap tempat: melodi (notasi slendro `1 2 3 5 6`), tempo, suara, pola kendang, gong |
| `ATURAN.audio` | Volume awal musik dan efek suara (pemain bisa mengubahnya di Pengaturan › Volume) |

Yang ada di `src/js/` (bukan config): bentuk semua peta, letak bos/teleport/teka-teki (`AREAS` di `04-peta.js`), daftar NPC & obrolannya (`NPC_DATA` di `05-status.js`), terjemahan Inggris (`02-bahasa.js`), dialog NPC (`talk()` di `12-dialog.js`), cara kerja tiap jurus (`48-jurus.js`), dan resep efek suara (`sfx` di `07-audio.js`).

## Nama sementara (silakan diganti)

Semua nama di bawah ini dibuat sementara. Ganti di tempat yang disebut, lalu jalankan `./build.sh`. Versi Inggrisnya ada di `src/js/02-bahasa.js` (`DATA_EN`).

| Apa | Nama sekarang | Diubah di |
|---|---|---|
| Judul cerita | Kabut dari Gunung Geni | `game.html` (layar tamat), `CERITA[].bab` |
| Bab | Kabut Pertama · Tiga Mustika · Layar ke Segara · Kuil Samudra · Naga Kencana | `bab` di `src/cerita/bab-N.js` |
| Dunia | Tanah Wanasari · Kepulauan Segara · Negeri Awan · Negeri Bayang | `DUNIA` di `04-peta.js` & `04d-dunia-bayang.js` |
| Bab 6-10 | Bayang di Kampung Halaman · Gua Laut · Istana Angin · Negeri Bayang · Prabu Kalamurka | `bab` di `src/cerita/bab-N.js` |
| NPC bab 6-10 | Pak Parmin, Mbah Juru, Wulan, Pak Sanip, Bujang Angin, Nyai Ratri, Ki Cahya, Lintang, Sekar | `NPC_DATA` di `05-status.js` |
| Monster bab 6-10 | Tikus Sawah Raksasa, Bayangan, Jerangkong, Belut Listrik, Roh Angin, Prajurit Bayang, Lelembut | `MONSTERS` di `config.js` |
| Bos bab 6-10 | Raja Jerangkong, Gurita Raksasa, Rajawali Petir, Penjaga Menara, Prabu Kalamurka | `MONSTERS` di `config.js` |
| Puzzle | urutan warna, petunjuk pahatan, teka-teki | `TEKA_BARU` di `config.js`, teks `tk.*` di `02-bahasa.js` |
| NPC dunia 2 & 3 | Pak Joko, Datuk Bahar, Nyi Laras, Bayu, Mbak Sari, Pak Rimba, Eyang Sukma, Kirana, Empu Gora, Ki Angon | `NPC_DATA` di `05-status.js` |
| Area dunia 2 & 3 | Bandar Segara, Hutan Bakau, Hutan Larangan, Kuil Samudra, Kampung Awan, Hutan Batu, Puncak Naga | `04a-dunia-segara.js`, `04b-dunia-awan.js` |
| Monster dunia 2 & 3 | Ular Welang, Ubur-ubur Api, Harimau Kumbang, Hantu Bajak Laut, Arca Hidup, Elang Batu, Anak Naga | `MONSTERS` di `config.js` |
| Bos dunia 2 & 3 | Siluman Ular, Panglima Karang, Kelabang Raksasa, Naga Kencana | `MONSTERS` di `config.js` |
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

- Fase khusus (seperti Naga) untuk bos lain
- Armor & kosmetik (warna baju, aura)
- Sprite gambar sendiri atau aset dari Kenney.nl
- Multiplayer co-op online (butuh server WebSocket)
