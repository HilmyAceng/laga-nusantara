// =====================================================================
// NASKAH CUTSCENE CERITA (dimainkan oleh js/99x-adegan-cerita.js)
// Kunci:
//   "akhir<n>"           → setelah bab n tamat, sebelum pengumuman "Tamat · Bab n"
//   "b<n>e<m>:<tipe>"    → setelah langkah cerita bab n, episode m, bertipe <tipe> selesai
//                          (setelah narasinya), mis. "b1e9:bicara", "b2e9:bos"
// Bab baru cukup menambah naskah di sini (tanpa kode baru).
// Langkah (posisi [dx, dy] dalam petak, relatif terhadap posisi hero saat adegan mulai):
//   { aktor: "resi", di: [2, 0] }            munculkan tokoh (wujud NPC itu) di dekat hero
//   { jalan: "resi" | "pemain", ke: [1, 0], lama: 1.5, bareng: true }   berjalan (bareng = tidak ditunggu)
//   { hadap: "resi", ke: "pemain" }          menghadap tokoh lain
//   { emosi: "pemain", ikon: "!" }           gelembung ! ? … ♥ di atas kepala
//   { kata: "resi", teks: [id, en] }         dialog (pembicara: id NPC / "hero" / id monster)
//   { narasi: [id, en] }                     teks narasi
//   { judul: [id, en], sub: [id, en] }       judul besar
//   { kamera: "pemain" | "resi" | [dx, dy], lama }   geser kamera
//   { gelap: 0..1, lama }  { guncang: 0.5 }  { kilat: true }  { tunggu: 1 }  { suara: "thunder" }  { hapus: "resi" }
// =====================================================================
"use strict";

const ADEGAN_CERITA = {
  // ===================== BAB 1 =====================
  "b1e9:bicara": [
    { gelap: 0.55, lama: 0.8 },
    { narasi: ["Malam itu Resi Wening tidak tidur. Ia memandangi Mustika Bumi di tangannya, dan retakan halus yang membelah cahayanya.", "That night Resi Wening did not sleep. He stared at the Earth Gem in his hands, at the thin crack splitting its light."] },
    { gelap: 0, lama: 0.8 },
    { aktor: "resi", di: [2.5, -0.5] },
    { emosi: "resi", ikon: "…" },
    { kata: "resi", teks: ["Retakan sekecil ini... Nak, kemarilah sebentar. Ada yang perlu kau dengar sebelum berangkat.", "A crack this small... Child, come here a moment. There's something you must hear before you go."] },
    { jalan: "pemain", ke: [1.2, 0], lama: 1 },
    { kata: "resi", teks: ["Dahulu ada tiga mustika: Bumi, Tirta, dan Bayu. Bersama-sama mereka mengikat sesuatu yang lapar di bawah Gunung Geni.", "Long ago there were three gems: Earth, Water, and Wind. Together they bound something hungry beneath Mount Geni."] },
    { kata: "resi", teks: ["Satu retak, dua lainnya akan ikut goyah. Seperti tiga tiang rumah: kalau satu lapuk, atapnya miring.", "If one cracks, the other two will waver. Like three pillars of a house: when one rots, the roof tilts."] },
    { kata: "hero", teks: ["Kalau begitu aku harus memeriksa yang lain sebelum terlambat.", "Then I must check the others before it's too late."] },
    { kata: "resi", teks: ["Ya. Dan ingat, Nak: kabut itu memakan rasa takut. Semakin kau takut, semakin tebal ia di sekitarmu.", "Yes. And remember, child: the mist feeds on fear. The more you fear, the thicker it grows around you."] },
    { emosi: "pemain", ikon: "!" },
    { hapus: "resi" },
  ],
  akhir1: [
    { kamera: [0, -4], lama: 1.6 },
    { narasi: ["Dari padang selatan, puncak Gunung Geni masih terlihat. Kabut merahnya berdenyut pelan, seperti jantung yang marah.", "From the southern meadow, Mount Geni's peak is still visible. Its red mist pulses slowly, like an angry heart."] },
    { kamera: "pemain", lama: 1 },
    { aktor: "lurah", di: [-3, 1] },
    { jalan: "lurah", ke: [-1.2, 0.4], lama: 1.6 },
    { emosi: "lurah", ikon: "!" },
    { kata: "lurah", teks: ["Hah... hah... Untung masih sempat. Kakiku ini sudah tidak muda, Nak!", "Huff... huff... Glad I caught you. These legs aren't young anymore, child!"] },
    { kata: "lurah", teks: ["Warga mengumpulkan ini untukmu. Nasi bungkus, ikan asin, dan surat dari anak-anak desa. Bacanya nanti saja, tulisannya jelek-jelek.", "The villagers gathered this for you. Rice parcels, salted fish, and letters from the village kids. Read them later, their handwriting is awful."] },
    { kata: "hero", teks: ["Terima kasih, Ki. Sampaikan pada mereka, aku akan pulang.", "Thank you, Ki. Tell them I'll come home."] },
    { kata: "lurah", teks: ["Harus pulang! Aku sudah menyiapkan pidato penyambutan. Panjangnya... ya, lumayan.", "You'd better! I've already prepared a welcome speech. It's... fairly long."] },
    { hapus: "lurah" },
    { gelap: 1, lama: 1 },
    { judul: ["Sementara itu...", "Meanwhile..."], sub: ["Kawah Gunung Geni", "Mount Geni's Crater"], lama: 2 },
    { suara: "thunder" }, { kilat: true }, { guncang: 0.5 },
    { kata: "rajaBanaspati", teks: ["Arca batu itu tumbang? Hm. Bocah itu lebih keras kepala dari dugaanku.", "The stone statue fell? Hm. That brat is more stubborn than I thought."] },
    { kata: "rajaBanaspati", teks: ["Tidak apa. Biarkan ia datang. Bara yang dihembus angin hanya akan menyala lebih besar.", "No matter. Let him come. An ember fanned by the wind only burns brighter."] },
    { gelap: 0, lama: 1 },
  ],
  // ===================== BAB 2 =====================
  "b2e9:bos": [
    { gelap: 0.7, lama: 0.8 },
    { narasi: ["Saat bara Raja Banaspati padam, tanah kawah bergetar sekali. Jauh sekali, di seberang lautan, sesuatu menggeliat dalam tidurnya.", "As the Banaspati King's ember dies, the crater floor shakes once. Far away, across the sea, something stirs in its sleep."] },
    { guncang: 0.3 }, { tunggu: 0.6 }, { guncang: 0.5 }, { tunggu: 0.6 }, { guncang: 0.8 },
    { narasi: ["Dum. Dum. Dum. Seperti detak jantung raksasa yang terluka.", "Thud. Thud. Thud. Like the heartbeat of a wounded giant."] },
    { gelap: 0, lama: 0.8 },
    { emosi: "pemain", ikon: "?" },
    { kata: "hero", teks: ["Detak itu... dari timur. Apa itu yang dimaksud Banaspati dengan 'tuan'-nya?", "That beat... from the east. Is that what Banaspati meant by his 'master'?"] },
  ],
  akhir2: [
    { kamera: [4, 0], lama: 1.6 },
    { narasi: ["Laut berkilau di bawah matahari sore. Perahu Pak Jala sudah siap, layarnya ditambal di tiga tempat.", "The sea glitters under the afternoon sun. Pak Jala's boat is ready, its sail patched in three places."] },
    { kamera: "pemain", lama: 1 },
    { aktor: "jala", di: [2.5, 0] },
    { kata: "jala", teks: ["Jangan lihat tambalannya, lihat semangatnya! Perahu ini sudah menyeberang dua puluh tahun tanpa tenggelam. Hampir.", "Don't look at the patches, look at the spirit! This boat has crossed for twenty years without sinking. Almost."] },
    { kata: "hero", teks: ["Hampir?", "Almost?"] },
    { kata: "jala", teks: ["Sekali. Dua kali. Tapi dia selalu mengapung lagi! Seperti aku. Hehe.", "Once. Twice. But she always floats again! Like me. Heh."] },
    { kata: "jala", teks: ["Mak Inah menitipkan rendang. Katanya, pemuda yang mau menyelamatkan dunia tidak boleh kurus.", "Mak Inah sent some rendang. She says a youngster saving the world can't be skinny."] },
    { jalan: "jala", ke: [4, 0], lama: 1.4, bareng: true },
    { jalan: "pemain", ke: [3, 0], lama: 1.6 },
    { hapus: "jala" },
    { gelap: 1, lama: 1 },
    { judul: ["Sementara itu...", "Meanwhile..."], sub: ["Di atas awan, Puncak Naga", "Above the clouds, Dragon Peak"], lama: 2 },
    { guncang: 0.4 },
    { narasi: ["Seekor naga emas meringkuk di antara awan. Dari retakan di dadanya, kabut merah mengalir pelan seperti air mata.", "A golden dragon lies curled among the clouds. From the crack in its chest, red mist seeps slowly, like tears."] },
    { kata: "naga", teks: ["...Sakit... Siapa... siapa yang menusukku... dalam tidurku...?", "...It hurts... Who... who stabbed me... in my sleep...?"] },
    { gelap: 0, lama: 1 },
  ],
  // ===================== BAB 3 =====================
  akhir3: [
    { gelap: 0.6, lama: 0.8 },
    { narasi: ["Malam di Bandar Segara. Sisik Naga di tasmu berdenyut hangat, seirama dengan ombak.", "Night at Segara Harbor. The Dragon Scale in your bag pulses warmly, in time with the waves."] },
    { gelap: 0, lama: 0.8 },
    { emosi: "pemain", ikon: "…" },
    { kata: "hero", teks: ["Naga yang kesakitan, kuil yang dikutuk... dan seseorang yang sengaja membuat semua ini terjadi.", "A dragon in pain, a cursed temple... and someone who made all of this happen on purpose."] },
    { kamera: [5, -3], lama: 1.8 },
    { narasi: ["Di timur, di atas karang, lampu-lampu hijau Kuil Samudra menyala sendiri. Tak ada yang menyalakannya.", "To the east, atop the reef, the green lamps of the Sea Temple light themselves. No one lit them."] },
    { kamera: "pemain", lama: 1 },
    { gelap: 1, lama: 1 },
    { judul: ["Sementara itu...", "Meanwhile..."], sub: ["Ruang Karang, Kuil Samudra", "Coral Hall, Sea Temple"], lama: 2 },
    { kata: "panglimaKarang", teks: ["Pewaris pemegang sisik datang. Seratus tahun kami menjaga gerbang ini tanpa tidur.", "The heir of the scale-keeper comes. A hundred years we have guarded this gate without sleep."] },
    { kata: "panglimaKarang", teks: ["Ia akan diuji. Jika ia tangan yang menusuk... laut akan menelannya.", "He will be tested. If he is the hand that stabs... the sea will swallow him."] },
    { gelap: 0, lama: 1 },
  ],
  // ===================== BAB 4 =====================
  akhir4: [
    { kamera: [0, -5], lama: 2 },
    { narasi: ["Tangga cahaya tujuh warna membentang dari puncak Kuil Samudra, menembus awan, menuju negeri yang belum pernah diinjak manusia biasa.", "A seven-colored stair of light stretches from the Sea Temple's peak, through the clouds, toward a land no ordinary human has walked."] },
    { kamera: "pemain", lama: 1.2 },
    { aktor: "bayu", di: [-3, 0.5] },
    { jalan: "bayu", ke: [-1.1, 0.3], lama: 1.2 },
    { kata: "bayu", teks: ["Kak! Tunggu! Aku cuma mau kasih ini. Gelang tali dari pelepah kelapa. Buatanku sendiri!", "Wait! I just want to give you this. A bracelet woven from coconut fronds. I made it myself!"] },
    { kata: "bayu", teks: ["Kata nenekku, gelang ini membuat orang selalu menemukan jalan pulang. ...Atau itu buat kambing? Lupa. Pokoknya pakai!", "Grandma says it helps people always find their way home. ...Or was that for goats? I forget. Just wear it!"] },
    { emosi: "pemain", ikon: "♥" },
    { kata: "hero", teks: ["Akan kupakai terus, Bayu. Sampai aku pulang.", "I'll wear it always, Bayu. Until I come home."] },
    { jalan: "bayu", ke: [-4, 0.5], lama: 1.2, bareng: true },
    { tunggu: 0.8 },
    { hapus: "bayu" },
    { judul: ["Menuju Negeri Awan", "To the Cloud Land"], sub: ["Naiki Tangga Pelangi", "Climb the Rainbow Stair"], lama: 2.4 },
  ],
  // ===================== BAB 5 =====================
  "b5e9:bos": [
    { gelap: 0.5, lama: 0.8 },
    { narasi: ["Naga Kencana roboh perlahan. Tapi ia tidak mati. Ia menatapmu, dan untuk pertama kalinya matanya jernih.", "Kencana the Dragon slowly collapses. But it does not die. It looks at you, and for the first time its eyes are clear."] },
    { gelap: 0, lama: 0.8 },
    { kata: "naga", teks: ["Kau... tidak menusukku. Kau memukul... untuk membangunkanku. Bukan untuk membunuh.", "You... did not stab me. You struck... to wake me. Not to kill."] },
    { kata: "naga", teks: ["Lima ratus tahun lalu... seorang raja datang saat aku tidur. Mahkotanya hitam. Tangannya dingin.", "Five hundred years ago... a king came while I slept. His crown was black. His hands were cold."] },
    { kata: "naga", teks: ["Ia mengambil sebagian jantungku... untuk hidup selamanya. Jangan... jangan biarkan ia kembali, anak manusia.", "He took part of my heart... to live forever. Don't... don't let him return, child of man."] },
    { emosi: "pemain", ikon: "!" },
  ],
  akhir5: [
    { gelap: 0.85, lama: 1.2 },
    { judul: ["Malam pesta di Wanasari", "Festival night in Wanasari"], sub: ["", ""], lama: 2 },
    { narasi: ["Gamelan berbunyi sampai larut. Ki Lurah berpidato empat puluh menit. Separuh warga tertidur, separuhnya lagi pura-pura tidak.", "The gamelan plays late into the night. Ki Lurah gives a forty-minute speech. Half the village falls asleep, the other half pretends not to."] },
    { gelap: 0.35, lama: 1 },
    { aktor: "resi", di: [3, -1] },
    { kamera: "resi", lama: 1.2 },
    { narasi: ["Hanya Resi Wening yang tidak ikut tertawa. Ia berdiri di tepi sawah, memandang ke arah makam tua.", "Only Resi Wening doesn't laugh along. He stands at the edge of the paddies, looking toward the old tomb."] },
    { emosi: "resi", ikon: "!" },
    { narasi: ["Sebuah bayangan hitam merayap pelan di pematang. Tidak ada orang yang memilikinya.", "A black shadow creeps slowly along the dike. No one is casting it."] },
    { kata: "resi", teks: ["...Tidak. Jangan sekarang. Jangan dia.", "...No. Not now. Not him."] },
    { gelap: 1, lama: 0.6 },
    { hapus: "resi" },
    { kilat: true }, { guncang: 0.6 },
    { kata: "kalamurka", teks: ["Naga itu sudah tenang? Bagus. Sekarang tak ada yang menjaga pintu.", "The dragon sleeps soundly? Good. Now no one guards the door."] },
    { gelap: 0, lama: 1 },
  ],
  // ===================== BAB 6 =====================
  akhir6: [
    { gelap: 0.6, lama: 0.8 },
    { narasi: ["Pecahan Segel Bumi terasa berat di tanganmu, seberat tanah tempat leluhur dikuburkan.", "The Earth Seal Shard feels heavy in your hand, as heavy as the soil where ancestors are buried."] },
    { gelap: 0, lama: 0.8 },
    { aktor: "juru", di: [2.2, 0.2] },
    { kata: "juru", teks: ["Le, dengarkan Mbah. Gusti Sekar dulu suka memetik melati di halaman makam ini. Ia selalu menyelipkan satu di telinga ayahnya.", "Listen, son. Lady Sekar used to pick jasmine in this tomb's courtyard. She'd always tuck one behind her father's ear."] },
    { kata: "juru", teks: ["Orang bilang Kalamurka iblis. Mungkin benar. Tapi iblis itu dulu pernah tertawa karena sekuntum melati.", "People call Kalamurka a demon. Perhaps. But that demon once laughed because of a single jasmine."] },
    { kata: "hero", teks: ["Mbah ingin aku mengasihaninya?", "You want me to pity him?"] },
    { kata: "juru", teks: ["Mbah ingin kau ingat, bahwa yang kau lawan dulunya manusia. Itu saja. Sisanya, hatimu yang memutuskan.", "I want you to remember that what you fight was once human. That's all. Your heart decides the rest."] },
    { hapus: "juru" },
    { gelap: 1, lama: 1 },
    { judul: ["Di balik Gerbang Bayang", "Beyond the Shadow Gate"], sub: ["", ""], lama: 2 },
    { kata: "sekar", teks: ["Ayah... ada yang datang. Dia membawa pecahan itu.", "Father... someone is coming. He carries the shard."] },
    { kata: "kalamurka", teks: ["Biarkan, Sekar. Biar dia kumpulkan semuanya untuk kita. Ayah sudah sangat lelah menunggu.", "Let him, Sekar. Let him gather them all for us. Father is so tired of waiting."] },
    { gelap: 0, lama: 1 },
  ],
  // ===================== BAB 7 =====================
  akhir7: [
    { kamera: [3, 2], lama: 1.6 },
    { narasi: ["Senja turun di Desa Apung. Suara Wulan terdengar dari mulut gua: sumbang, pelan, tapi tulus.", "Dusk falls over the Floating Village. Wulan's voice drifts from the cave mouth: off-key, soft, but sincere."] },
    { narasi: ["Dari dalam air, sebuah tentakel besar muncul sebentar, melambai, lalu tenggelam lagi.", "From the water, a huge tentacle rises for a moment, waves, then sinks again."] },
    { kamera: "pemain", lama: 1 },
    { emosi: "pemain", ikon: "♥" },
    { kata: "hero", teks: ["Datu Gurita tidak kesepian lagi. Satu luka lagi sembuh tanpa harus ada yang mati.", "Datu Gurita isn't lonely anymore. Another wound healed without anyone having to die."] },
    { gelap: 1, lama: 1 },
    { judul: ["Sementara itu...", "Meanwhile..."], sub: ["Singgasana Bayang", "The Shadow Throne"], lama: 2 },
    { guncang: 0.7 }, { kilat: true },
    { kata: "kalamurka", teks: ["Dua pecahan... DUA! Dan si bocah memberikannya pada gurita dan naga dengan senyum!", "Two shards... TWO! And the brat hands mercy to octopi and dragons with a smile!"] },
    { kata: "sekar", teks: ["Mungkin dia bukan musuh, Ayah. Mungkin dia...", "Maybe he isn't an enemy, Father. Maybe he..."] },
    { kata: "kalamurka", teks: ["DIAM. Semua yang datang dari cahaya adalah musuh.", "SILENCE. Everything that comes from the light is an enemy."] },
    { gelap: 0, lama: 1 },
  ],
  // ===================== BAB 8 =====================
  akhir8: [
    { guncang: 0.6 }, { kilat: true },
    { narasi: ["Pintu batu hitam terbelah. Angin dingin berembus keluar, membawa bau abu dan bunga yang layu.", "The black stone door splits open. Cold wind blows out, carrying the smell of ash and wilted flowers."] },
    { aktor: "resi", di: [-2, 0.3] },
    { aktor: "juru", di: [2, 0.3] },
    { kata: "resi", teks: ["Nak. Apa pun yang kau temui di sana, jangan lupa siapa dirimu. Kau datang dari Wanasari. Kau punya rumah.", "Child. Whatever you meet in there, don't forget who you are. You come from Wanasari. You have a home."] },
    { kata: "juru", teks: ["Dan bawalah ini. Kemenyan dari makam. Bayangan tak suka baunya. Mbah juga tidak, sebenarnya.", "And take this. Incense from the tomb. Shadows hate the smell. So do I, honestly."] },
    { kata: "hero", teks: ["Aku akan kembali. Bersama semua orang yang menunggu di sana.", "I'll come back. Together with everyone waiting in there."] },
    { jalan: "pemain", ke: [0, -2], lama: 1.6 },
    { hapus: "resi" }, { hapus: "juru" },
    { gelap: 1, lama: 1.2 },
    { judul: ["Gerbang Bayang terbuka", "The Shadow Gate opens"], sub: ["Negeri Bayang menanti", "The Shadow Land awaits"], lama: 2.4 },
    { gelap: 0, lama: 1 },
  ],
  // ===================== BAB 9 =====================
  akhir9: [
    { kamera: [0, -4], lama: 2 },
    { narasi: ["Menara Kala menjulang tanpa ujung. Setiap detak jam di dalamnya membuat lentera-lentera mati bergoyang.", "Kala Tower rises without end. Every tick of the clock inside makes the dead lanterns sway."] },
    { kamera: "pemain", lama: 1 },
    { aktor: "sekar", di: [1.5, 0.3] },
    { hadap: "sekar", ke: "pemain" },
    { kata: "sekar", teks: ["Kisanak. Kalau di puncak nanti Ayah memanggil namaku dengan lembut... itu bukan dia. Itu kabut di dalam dirinya.", "If at the top Father calls my name gently... that isn't him. That's the mist inside him."] },
    { kata: "sekar", teks: ["Ayahku yang asli tertawa keras sekali, sampai burung-burung terbang. Aku ingin mendengar tawa itu sekali lagi.", "My real father laughed so loud the birds flew off. I want to hear that laugh one more time."] },
    { kata: "hero", teks: ["Kita akan membawanya pulang, Sekar. Apa pun caranya.", "We'll bring him home, Sekar. Whatever it takes."] },
    { emosi: "sekar", ikon: "♥" },
    { hapus: "sekar" },
  ],
  // ===================== BAB 10 / ENDING =====================
  akhir10: [
    { gelap: 1, lama: 1.2 },
    { judul: ["Laga Nusantara", "Laga Nusantara"], sub: ["Epilog", "Epilogue"], lama: 2.4 },
    { narasi: ["Di Desa Wanasari, Ki Lurah membaca pidato tujuh halaman. Di halaman ketiga, hujan turun. Tak seorang pun pulang.", "In Wanasari Village, Ki Lurah reads his seven-page speech. On page three, it starts raining. No one leaves."] },
    { narasi: ["Di Kepulauan Segara, Bayu mengajar anak-anak bandar bertarung dengan tongkat bambu. Ia menyebut dirinya 'Pendekar Paling Hebat se-Segara'.", "In the Segara Isles, Bayu teaches the harbor kids to fight with bamboo sticks. He calls himself 'The Greatest Warrior in Segara'."] },
    { narasi: ["Di Negeri Awan, Naga Kencana terbang rendah di atas kampung setiap pagi, dan Kirana masih menunggu tantangan berburunya.", "In the Cloud Land, Kencana the Dragon flies low over the village every morning, and Kirana still waits for her hunting challenge."] },
    { narasi: ["Di Negeri Bayang, matahari terbit untuk pertama kalinya dalam lima ratus tahun. Lintang menanam singkong pertamanya.", "In the Shadow Land, the sun rises for the first time in five hundred years. Lintang plants his first cassava."] },
    { gelap: 0.4, lama: 1 },
    { aktor: "resi", di: [2, 0] },
    { kata: "resi", teks: ["Nak, petualanganmu selesai. Tapi Nusantara itu luas. Masih banyak kampung yang belum kau kunjungi, dan cermin-cermin yang menunggu.", "Child, your adventure is over. But Nusantara is vast. There are still villages you haven't visited, and mirrors waiting."] },
    { kata: "resi", teks: ["Kalau kau masih haus tantangan, cobalah jalan Pendekar Sejati. Tanpa tanda, tanpa ampun. Hohoho.", "If you still thirst for challenge, try the path of the True Warrior. No warnings, no mercy. Hohoho."] },
    { hapus: "resi" },
    { gelap: 1, lama: 1 },
    { judul: ["Terima kasih sudah bermain!", "Thank you for playing!"], sub: ["Sulit+ (Pendekar Sejati) kini terbuka", "Hard+ (True Warrior) is now unlocked"], lama: 3 },
    { gelap: 0, lama: 1 },
  ],
};
