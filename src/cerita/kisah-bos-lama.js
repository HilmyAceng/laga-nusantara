// =====================================================================
// KISAH BOS LAMA: asal-usul sepuluh bos cerita utama (Raja Banaspati sampai
// Prabu Kalamurka), diceritakan sebagai misi sampingan berantai.
// Bentuk data sama persis dengan cerita/kisah.js (mesin: js/99z-kisah-npc.js):
//   { tipe: "bicara",   npc, tujuan, baris, tanya? }
//   { tipe: "pandu",    npc, area, ke: [tx, ty], tujuan, ajak, baris }
//   { tipe: "kalahkan", monster, need, area?, tujuan, baris? }
//   { tipe: "prasasti", area, dekat: "bos" | [tx, ty], tujuan, baris }
// Titik `ke` tiap langkah pandu sudah dicek pada peta hasil build() area itu
// (petak jalan/rumput/titian, bukan pohon/batu/air/awan/rumah, tidak di tepi peta).
// =====================================================================
"use strict";

const KISAH_BOS_LAMA = [
  // ===================== RAJA BANASPATI =====================
  {
    id: "rajaBanaspati", npc: "joko", monster: "rajaBanaspati",
    judul: ["Bara yang Tersesat", "The Stray Ember"],
    syarat: () => S.bos && S.bos.rajaBanaspati,
    hadiah: { gold: 350, exp: 600, serpih: 3 },
    ringkas: ["Raja Banaspati lahir dari setetes api jantung Naga Kencana yang jatuh ke kawah Gunung Geni pada malam Prabu Kalamurka menikam sang naga. Leluhur membangun altar tiga mustika untuk menidurkannya, dan percikan kecilnya justru menuntun orang yang tersesat di lereng, termasuk Pak Joko muda. Saat sakit sang naga memuncak, bara itu terbangun dan menyebut rasa sakit itu sebagai 'tuan'.", "The Banaspati King was born from a drop of Naga Kencana's heart-fire that fell into Mount Geni's crater on the night King Kalamurka stabbed the dragon. The ancestors built the altar of three gems to lull it to sleep, and its small sparks guided lost travelers on the slopes, young Pak Joko among them. When the dragon's pain peaked, the ember awoke and called that pain its 'master'."],
    langkah: [
      { tipe: "bicara", npc: "joko", tujuan: ["Dengarkan cerita Pak Joko tentang Banaspati", "Hear Pak Joko's tale of the Banaspati"], baris: [
        ["joko", ["Nak, duduk sebentar. Sejak Raja Banaspati padam, ada yang mengganjal di dadaku. Aku ingin bercerita, sebagai tabib dan sebagai anak gunung.", "Child, sit a moment. Since the Banaspati King went out, something has been weighing on my chest. I want to tell you a story, as a healer and as a child of the mountain."]],
        ["joko", ["Menurut cerita rakyat Jawa, banaspati adalah makhluk halus berwujud bola api. Konon ia melayang di tempat sepi pada malam hari, dan orang tua dulu melarang anak-anak keluar sendirian selepas senja karenanya.", "In Javanese folklore, the banaspati is a spirit in the form of a ball of fire. It's said to drift through lonely places at night, and parents of old forbade children from going out alone after dusk because of it."]],
        ["joko", ["Cerita itu dikenal di banyak desa, dan tiap daerah punya versinya sendiri. Tapi banaspati Gunung Geni punya kisah lain lagi. Kisah yang tidak ditulis di mana pun.", "That tale is known in many villages, and every region tells it a little differently. But the banaspati of Mount Geni have a story of their own. One that isn't written down anywhere."]],
        ["joko", ["Waktu muda aku mencari pegagan dan kulit pulai di lereng Geni. Suatu malam aku tersesat. Kabut turun, oborku padam. Kupikir habislah aku.", "When I was young I gathered pegagan leaves and pulai bark on Geni's slopes. One night I got lost. Fog rolled in, my torch went out. I thought that was the end of me."]],
        ["joko", ["Lalu muncul tiga bola api kecil, sebesar kepalan. Mereka tidak membakarku. Mereka melayang pelan di depanku, berhenti kalau aku tertinggal... sampai aku tiba di jalan desa.", "Then three small balls of fire appeared, no bigger than a fist. They didn't burn me. They floated slowly ahead of me, stopping whenever I fell behind... until I reached the village road."]],
        ["hero", ["Banaspati... menuntun Bapak pulang?", "The banaspati... guided you home?"]],
        ["joko", ["Itulah yang tak pernah dipercaya orang. Ayo, ikut aku. Ada sesuatu di ujung jalan selatan yang ingin kutunjukkan.", "That's the part nobody ever believed. Come, follow me. There's something at the end of the south road I want to show you."]],
      ], tanya: [
        { tanya: ["Kenapa Bapak tidak cerita waktu saya mau ke kawah?", "Why didn't you tell me before I went to the crater?"], jawab: [
          ["joko", ["Karena waktu itu mata mereka sudah merah, Nak. Aku tidak mau kau ragu di depan api. Ragu di depan api itu berbahaya, lebih berbahaya dari apinya sendiri.", "Because by then their eyes had turned red, child. I didn't want you hesitating in front of fire. Hesitating before a flame is dangerous, more dangerous than the flame itself."]],
        ] },
      ] },
      // ke [12, 20]: petak PATH jalan utara-selatan desa (x = 12), 6 petak dari Pak Joko (6, 19)
      { tipe: "pandu", npc: "joko", area: "desa", ke: [12, 20], tujuan: ["Ikuti Pak Joko ke ujung jalan selatan", "Follow Pak Joko to the end of the south road"],
        ajak: ["Ikut aku ke ujung jalan selatan. Pelan saja, encokku sedang kambuh.", "Follow me to the end of the south road. Slowly, my rheumatism is acting up."], baris: [
        ["joko", ["Di sini. Lihat batu hitam yang terbenam di pinggir jalan ini? Ini batu dari kawah. Aku sendiri yang membawanya turun, empat puluh tahun lalu.", "Here. See that black stone sunk into the roadside? It's from the crater. I carried it down myself, forty years ago."]],
        ["joko", ["Malam itu, bola-bola api itu berhenti tepat di sini, lalu kembali ke gunung. Esoknya aku naik lagi dan menemukan batu ini di tempat mereka biasa berkumpul. Hangat, padahal sudah semalaman di luar.", "That night the fireballs stopped right here, then went back up the mountain. The next day I climbed again and found this stone where they used to gather. Warm, even after a whole night in the open."]],
        ["joko", ["Batu ini tak pernah dingin, Nak. Empat puluh tahun. Sampai tiga malam sebelum kabut merah datang. Malam itu ia mendadak panas sekali, seperti sedang marah.", "This stone has never gone cold, child. Forty years. Until three nights before the red mist came. That night it suddenly turned scorching hot, as if it were angry."]],
        ["hero", ["Seperti ada yang membangunkan apinya.", "As if something woke its fire."]],
        ["joko", ["Resi Wening pernah bilang, altar di kawah itu lebih tua dari desa kita. Kalau ada jawaban, pasti di sana. Tapi banaspati yang tersisa masih liar. Padamkan dulu beberapa, supaya kau bisa membaca dengan tenang.", "Resi Wening once said the altar in that crater is older than our village. If there's an answer, it's there. But the remaining banaspati are still wild. Put out a few first, so you can read in peace."]],
      ] },
      { tipe: "kalahkan", monster: "banaspati", need: 6, area: "kawah", tujuan: ["Padamkan 6 Banaspati yang masih berkeliaran di Kawah Geni", "Put out 6 Banaspati still roaming Geni Crater"], baris: [
        ["narasi", ["Banaspati terakhir meredup. Sesaat sebelum padam, nyalanya berubah dari merah menjadi kuning lembut, seperti pelita di jendela rumah.", "The last Banaspati dims. A moment before it dies, its flame turns from red to a soft yellow, like a lamp in a house window."]],
        ["hero", ["(Warna itu... mungkin begitulah mereka dulu, sebelum kabut datang.)", "(That color... maybe that's how they used to be, before the mist came.)"]],
      ] },
      { tipe: "prasasti", area: "kawah", dekat: "bos", tujuan: ["Cari tulisan tua di dekat arena Raja Banaspati", "Find the old writing near the Banaspati King's arena"], baris: [
        ["narasi", ["Di batu hitam dekat bekas sarang Raja Banaspati, tertutup jelaga, terpahat tulisan kuno. Kau mengusapnya sampai hurufnya terbaca.", "On a black stone near the Banaspati King's old lair, covered in soot, an ancient inscription is carved. You wipe it until the letters can be read."]],
        ["narasi", ["'Pada malam raja dari bawah menikam sang naga di atas awan, setetes api jantungnya jatuh dari langit dan tertanam di kawah ini.'", "'On the night the king from below stabbed the dragon above the clouds, a drop of its heart-fire fell from the sky and lodged in this crater.'"]],
        ["narasi", ["'Api itu tidak jahat, tetapi ia mengingat rasa sakit pemiliknya. Maka kami membangun altar tiga cekung, agar Mustika Bumi, Tirta, dan Bayu menidurkannya.'", "'That fire is not evil, but it remembers its owner's pain. So we built an altar of three hollows, so that the Earth, Water and Wind Gems might lull it to sleep.'"]],
        ["narasi", ["'Biarlah percikan kecilnya menjaga lereng dan menuntun yang tersesat. Tetapi bila sang naga menjerit lagi, bara ini akan bangun dan menyebut rasa sakit itu tuannya.'", "'Let its small sparks guard the slopes and guide the lost. But should the dragon cry out again, this ember will wake and call that pain its master.'"]],
        ["hero", ["Jadi itu maksud 'tuanku'... Raja Banaspati tidak benar-benar mengabdi pada naga. Ia hanya gema dari luka sang naga.", "So that's what 'my master' meant... The Banaspati King didn't truly serve the dragon. It was only an echo of the dragon's wound."]],
        ["narasi", ["Di bawah tulisan itu, sebutir bara kecil berkedip kuning di celah batu. Tenang. Tidak membakar.", "Beneath the writing, a tiny ember flickers yellow in a crack of the stone. Calm. Not burning."]],
      ] },
      { tipe: "bicara", npc: "joko", tujuan: ["Ceritakan isi prasasti kepada Pak Joko", "Tell Pak Joko what the inscription said"], baris: [
        ["hero", ["Pak, banaspati Gunung Geni lahir dari setetes api jantung Naga Kencana. Jatuh waktu Prabu Kalamurka menikamnya.", "Pak, the banaspati of Mount Geni were born from a drop of Naga Kencana's heart-fire. It fell when King Kalamurka stabbed it."]],
        ["joko", ["Api jantung naga... Pantas mereka hangat tanpa membakar. Mereka membawa sisa kebaikan sang naga, dan juga sisa sakitnya.", "The dragon's heart-fire... No wonder they were warm without burning. They carried what was left of the dragon's kindness, and what was left of its pain."]],
        ["joko", ["Jadi waktu jantung naga itu retak makin parah, bara yang tidur ikut terbangun. Bukan karena jahat. Sakit itu menular, Nak, seperti demam.", "So when the dragon's heart cracked worse, the sleeping ember woke with it. Not out of evil. Pain spreads, child, like a fever."]],
        ["hero", ["Dan sekarang naga itu sudah sembuh.", "And now the dragon has healed."]],
        ["joko", ["Ya. Batu di jalan selatan sudah hangat lagi. Hangat yang ramah, seperti dulu. Mungkin suatu malam nanti, ada anak tersesat yang dituntun pulang lagi.", "Yes. The stone on the south road is warm again. A friendly warmth, like before. Maybe some night, a lost child will be guided home again."]],
        ["joko", ["Terimalah ini. Ramuan dan sedikit uang, dari tabib tua yang akhirnya punya saksi untuk ceritanya sendiri.", "Take this. Some medicine and a little money, from an old healer who finally has a witness to his own story."]],
      ] },
    ],
  },
  // ===================== SILUMAN ULAR =====================
  {
    id: "silumanUlar", npc: "rimba", monster: "silumanUlar",
    judul: ["Nyanyian di Jantung Hutan", "The Song at the Forest's Heart"],
    syarat: () => S.bos && S.bos.silumanUlar,
    hadiah: { gold: 400, exp: 800, serpih: 3 },
    ringkas: ["Siluman Ular dahulu Nyai Welas, tabib perempuan yang bertapa di jantung Hutan Larangan mencari obat wabah, lalu memilih tinggal dan berjanji tak ada lagi yang mati tersesat di sana. Ular-ular hutan menerimanya sebagai keluarga, dan nyanyiannya menuntun banyak anak hilang pulang, termasuk Pak Rimba kecil. Saat kabut merah datang, kehangatan Sisik Naga memanggilnya, dan ia mencurinya dari Kuil Samudra.", "The Serpent Spirit was once Nyai Welas, a healer who meditated in the heart of the Forbidden Forest seeking a cure for a plague, then chose to stay, vowing no one would die lost there again. The forest serpents took her in as family, and her song led many lost children home, young Pak Rimba among them. When the red mist came, the Dragon Scale's warmth called to her, and she stole it from the Temple of the Sea."],
    langkah: [
      { tipe: "bicara", npc: "rimba", tujuan: ["Dengarkan cerita Pak Rimba tentang Siluman Ular", "Hear Pak Rimba's tale of the Serpent Spirit"], baris: [
        ["rimba", ["Duduk, Le. Aku tak suka mengulang, jadi dengarkan baik-baik. Ini soal siluman yang kau kalahkan.", "Sit, lad. I don't like repeating myself, so listen well. This is about the spirit you defeated."]],
        ["rimba", ["Di banyak cerita rakyat Nusantara, siluman ular digambarkan sebagai penunggu hutan, gua, atau mata air. Kadang berwujud manusia, kadang ular. Ada yang menolong, ada yang menguji, ada yang menghukum orang serakah.", "In many folk tales across the archipelago, serpent spirits are said to dwell in forests, caves or springs. Sometimes in human form, sometimes as snakes. Some help, some test, some punish the greedy."]],
        ["rimba", ["Orang Segara juga punya cerita semacam itu. Tapi siluman Hutan Larangan bukan dongeng buatku. Aku pernah bertemu dengannya. Umurku tujuh tahun waktu itu.", "The Segara folk have such tales too. But the spirit of the Forbidden Forest is no fairy tale to me. I met her once. I was seven years old."]],
        ["rimba", ["Aku mengejar kancil sampai jauh ke dalam hutan. Waktu sadar, matahari sudah hilang, dan semua pohon tampak sama. Aku menangis sampai suaraku habis.", "I chased a mouse-deer deep into the forest. By the time I noticed, the sun was gone and every tree looked the same. I cried until I had no voice left."]],
        ["rimba", ["Lalu terdengar nyanyian perempuan. Pelan, seperti ibu menidurkan anak. Kuikuti suara itu, dan tahu-tahu aku sudah di tepi hutan. Di belakangku, ada sisik hijau berkilau di tanah.", "Then I heard a woman singing. Softly, like a mother lulling a child. I followed the voice, and suddenly I was at the forest's edge. Behind me, a green scale glittered on the ground."]],
        ["hero", ["Suara yang sama dengan yang Bapak dengar sebelum aku melawannya?", "The same voice you heard before I fought her?"]],
        ["rimba", ["Sama. Tapi waktu itu nadanya sudah berubah jadi marah. Ikut aku ke tepi hutan. Kutunjukkan tempat aku keluar dulu.", "The same. But by then its tune had turned angry. Come with me to the forest's edge. I'll show you where I came out, back then."]],
      ] },
      // ke [19, 2]: petak PATH jalan keluar utara bandar (x 18-20) menuju Hutan Larangan, 3 petak dari Pak Rimba (22, 3)
      { tipe: "pandu", npc: "rimba", area: "bandar", ke: [19, 2], tujuan: ["Ikuti Pak Rimba ke jalan utara menuju hutan", "Follow Pak Rimba to the north road toward the forest"],
        ajak: ["Ikuti aku ke jalan utara. Langkahmu terlalu berisik, Le, tapi tak apa.", "Follow me to the north road. Your steps are too loud, lad, but never mind."], baris: [
        ["rimba", ["Di sinilah aku keluar dari hutan, lebih dari empat puluh tahun lalu. Dulu belum ada jalan batu ini, cuma semak dan akar.", "This is where I came out of the forest, more than forty years ago. There was no stone road then, only brush and roots."]],
        ["rimba", ["Kakekku juga pawang. Waktu kuceritakan soal nyanyian itu, ia tidak tertawa. Ia bilang: 'Itu Nyai Welas. Berterima kasihlah padanya.'", "My grandfather was a forest warden too. When I told him about the singing, he didn't laugh. He said: 'That was Nyai Welas. Be grateful to her.'"]],
        ["rimba", ["Kata kakek, dulu ada tabib perempuan bernama Nyai Welas. Ia bertapa di jantung hutan untuk mencari obat wabah yang melanda Segara.", "Grandfather said there was once a healer named Nyai Welas. She went into seclusion at the forest's heart to find a cure for a plague that struck Segara."]],
        ["rimba", ["Obatnya ketemu, wabahnya reda. Tapi ia tidak mau pulang. Ia berjanji pada hutan: selama ia hidup, tak boleh ada lagi yang tersesat dan mati di dalamnya.", "She found the cure, and the plague passed. But she wouldn't come home. She made a vow to the forest: as long as she lived, no one would get lost and die in it again."]],
        ["rimba", ["Kata kakek, ular-ular hutan menerimanya sebagai bagian dari mereka. Entah itu benar atau kiasan. Harimau di dalam sana masih gelisah mencium bekas siluman. Tenangkan mereka dulu, baru cari tempat ia bertapa.", "Grandfather said the forest serpents took her in as one of their own. Whether that's true or just a figure of speech, I can't say. The tigers in there are still restless from the spirit's scent. Calm them first, then find where she meditated."]],
      ] },
      { tipe: "kalahkan", monster: "harimauKumbang", need: 5, area: "larangan", tujuan: ["Tenangkan 5 Harimau Kumbang yang gelisah di Hutan Larangan", "Calm 5 restless Black Tigers in the Forbidden Forest"], baris: [
        ["narasi", ["Harimau terakhir mundur ke semak, lalu berbaring. Matanya hitam bening, tidak lagi merah.", "The last tiger backs into the brush, then lies down. Its eyes are clear black, no longer red."]],
        ["narasi", ["Di kejauhan, burung-burung mulai berkicau lagi. Hutan seperti menarik napas lega.", "In the distance, birds begin to sing again. The forest seems to breathe a sigh of relief."]],
      ] },
      { tipe: "prasasti", area: "larangan", dekat: "bos", tujuan: ["Cari batu tapa di sarang Siluman Ular", "Find the meditation stone in the Serpent Spirit's lair"], baris: [
        ["narasi", ["Di bekas sarang siluman, di antara akar yang melilit, ada batu datar tempat orang bertapa. Permukaannya licin, dan tulisannya ditoreh dengan ujung sisik.", "In the spirit's old lair, among twisting roots, lies a flat stone where someone once meditated. Its surface is smooth, and the writing was scratched with the tip of a scale."]],
        ["narasi", ["'Aku Welas. Obat sudah kutemukan, tetapi hutan ini menelan lebih banyak anak hilang daripada wabah mana pun. Maka aku tinggal.'", "'I am Welas. I have found the cure, but this forest swallows more lost children than any plague. So I stay.'"]],
        ["narasi", ["'Bertahun-tahun aku bernyanyi untuk mereka yang tersesat. Tubuhku makin dingin, kulitku makin bersisik. Aku tidak keberatan. Ular-ular ini keluargaku sekarang.'", "'For years I have sung for those who lose their way. My body grows colder, my skin more scaled. I do not mind. These serpents are my family now.'"]],
        ["narasi", ["Di bawahnya, goresan baru, kasar dan tergesa: 'Ada yang hangat di timur. Sisik emas. Ia memanggilku seperti matahari memanggil ular yang kedinginan. Maafkan aku.'", "Beneath it, a newer scratch, rough and hurried: 'Something warm in the east. A golden scale. It calls to me as the sun calls a cold snake. Forgive me.'"]],
        ["hero", ["Ia tidak mencuri karena rakus. Ia kedinginan... dan sisik itu satu-satunya kehangatan yang bisa ia rasakan menembus kabut.", "She didn't steal out of greed. She was cold... and that scale was the only warmth she could feel through the mist."]],
      ] },
      { tipe: "bicara", npc: "rimba", tujuan: ["Ceritakan tulisan Nyai Welas kepada Pak Rimba", "Tell Pak Rimba what Nyai Welas wrote"], baris: [
        ["hero", ["Pak, namanya memang Nyai Welas. Ia menulis semuanya di batu tapanya. Termasuk permintaan maaf.", "Pak, her name really was Nyai Welas. She wrote everything on her meditation stone. Including an apology."]],
        ["rimba", ["...Jadi kakekku benar. Dan bocah tujuh tahun yang menangis di hutan itu diantar pulang oleh seorang tabib yang memilih tidak pulang.", "...So my grandfather was right. And the seven-year-old crying in the forest was walked home by a healer who chose never to go home herself."]],
        ["rimba", ["Kau tahu yang paling menyakitkan, Le? Empat puluh tahun aku jadi pawang, dan aku tak pernah sekali pun kembali ke sana untuk berterima kasih.", "You know what hurts most, lad? Forty years a forest warden, and not once did I go back to say thank you."]],
        ["rimba", ["Waktu kau mengalahkannya, ia pecah jadi ribuan ular kecil yang tenang. Mungkin begitulah ia beristirahat: tersebar di seluruh hutan yang ia jaga.", "When you defeated her, she broke into thousands of calm little snakes. Maybe that's how she rests: scattered across the whole forest she guarded."]],
        ["rimba", ["Besok aku akan membersihkan batu tapanya dari akar dan lumut. Ucapan terima kasih yang terlambat empat puluh tahun.", "Tomorrow I'll clear the roots and moss from her stone. A thank-you forty years late."]],
        ["rimba", ["Ambil ini. Dan kalau suatu hari kau tersesat di hutan mana pun, dengarkan baik-baik. Siapa tahu masih ada yang bernyanyi.", "Take this. And if someday you're lost in any forest, listen carefully. Who knows, someone may still be singing."]],
      ] },
    ],
  },
  // ===================== PANGLIMA KARANG =====================
  {
    id: "panglimaKarang", npc: "bahar", monster: "panglimaKarang",
    judul: ["Halaman yang Disobek", "The Torn Page"],
    syarat: () => S.bos && S.bos.panglimaKarang,
    hadiah: { gold: 450, exp: 1000, serpih: 4 },
    ringkas: ["Panglima Karang dulunya Arung, pemuda nelayan Segara yang paling pandai membaca angin. Pada tahun paceklik, adiknya Mirah meninggal kelaparan sementara gudang beras para saudagar terkunci. Ia bersumpah tak akan tak berdaya lagi, menjadi bajak laut, lalu mengejar mustika naga demi mengakhiri lapar, sampai niat itu berubah menjadi rakus. Badai tanpa angin mengutuknya, dan karang tumbuh menutupi tubuhnya selama seratus tahun.", "The Coral Warlord was once Arung, the young Segara fisherman who could read the wind best. In a famine year his little sister Mirah starved while the merchants' rice stores stayed locked. He swore never to be powerless again, became a pirate, and chased the dragon's gem to end hunger, until that wish turned to greed. A windless storm cursed him, and coral grew over his body for a hundred years."],
    langkah: [
      { tipe: "bicara", npc: "bahar", tujuan: ["Dengarkan Datuk Bahar tentang buku pelabuhan", "Hear Datuk Bahar out about the harbor ledger"], baris: [
        ["bahar", ["Kisanak. Sejak awak Lancang Merah pulang, aku membaca ulang buku pelabuhan tahun itu. Halaman demi halaman.", "Traveler. Since the crew of the Lancang Merah went home, I've been rereading the harbor ledger from that year. Page by page."]],
        ["bahar", ["Ada satu halaman yang disobek. Selama ini kukira dimakan rayap. Ternyata kakekku yang menyobeknya, lalu menyimpannya di bawah papan lantai kantor ini.", "One page was torn out. I always assumed termites. Turns out my grandfather tore it out and hid it under the floorboards of this very office."]],
        ["bahar", ["Isinya bukan catatan kapal. Itu catatan tentang seseorang. Namanya Arung. Pemuda nelayan, umur dua puluh, pembaca angin terbaik di Segara.", "It isn't a ship record. It's a record of a person. His name was Arung. A young fisherman, twenty years old, the best wind-reader in Segara."]],
        ["hero", ["Arung... Panglima Karang?", "Arung... the Coral Warlord?"]],
        ["bahar", ["Sebelum ia jadi panglima apa pun. Kakekku menulis: 'Arung sahabatku. Tahun ini paceklik. Adiknya, si Mirah, meninggal karena lapar, sementara gudang beras saudagar di dermaga terkunci rapat.'", "Before he was any kind of warlord. My grandfather wrote: 'Arung is my friend. This is a famine year. His little sister Mirah died of hunger, while the merchants' rice stores on the pier stayed locked tight.'"]],
        ["bahar", ["Ikut aku ke dermaga selatan, Kisanak. Kata kakek, di sanalah ia terakhir kali melihat Arung sebagai manusia.", "Come with me to the south pier, traveler. Grandfather said that's where he last saw Arung as a man."]],
      ], tanya: [
        { tanya: ["Kenapa kakek Datuk menyobek halaman itu?", "Why did your grandfather tear out that page?"], jawab: [
          ["bahar", ["Karena orang Segara ingin mengingat Panglima Karang sebagai iblis. Lebih mudah begitu.", "Because the Segara folk wanted to remember the Coral Warlord as a devil. It's easier that way."]],
          ["bahar", ["Kalau ia iblis, kita tak perlu bertanya siapa yang mengunci gudang beras itu. Kakekku tidak sanggup menanggung pertanyaan itu, jadi ia menyimpannya di bawah lantai.", "If he's a devil, we never have to ask who locked those rice stores. My grandfather couldn't bear that question, so he hid it under the floor."]],
        ] },
      ] },
      // ke [18, 24]: ujung titian/dermaga BRIDGE selatan bandar (x 18-20, y 24-29), jalan lurus lewat jalan utama
      { tipe: "pandu", npc: "bahar", area: "bandar", ke: [18, 24], tujuan: ["Ikuti Datuk Bahar ke dermaga selatan", "Follow Datuk Bahar to the south pier"],
        ajak: ["Ikuti aku ke dermaga selatan. Pelan saja, syahbandar tua tak boleh terlihat ngos-ngosan di depan anak buahnya.", "Follow me to the south pier. Not too fast, an old harbormaster mustn't be seen panting in front of his men."], baris: [
        ["bahar", ["Di sini. Dulu dermaganya kayu, bukan batu. Malam itu Arung berdiri di ujungnya, memandangi gudang-gudang saudagar.", "Here. The pier was wood back then, not stone. That night Arung stood at its end, staring at the merchants' warehouses."]],
        ["bahar", ["Kakekku menulis, Arung berkata: 'Aku tak mau lagi menunggu belas kasihan orang kenyang. Aku akan mengambil sendiri, sampai tak ada orang Segara yang lapar lagi.'", "My grandfather wrote that Arung said: 'I'm done waiting for pity from the well-fed. I'll take it myself, until no one in Segara goes hungry again.'"]],
        ["bahar", ["Awalnya ia membagi hasil rampokannya ke kampung-kampung miskin. Orang menyebutnya pahlawan. Lalu ia mendengar dongeng tentang mustika di jantung naga, yang konon mengabulkan apa saja.", "At first he shared his plunder with the poor villages. People called him a hero. Then he heard the tale of the gem in the dragon's heart, said to grant anything."]],
        ["bahar", ["Ia bilang pada kakekku: 'Dengan mustika itu, takkan ada paceklik lagi.' Tapi kakek melihat matanya, dan yang ia lihat bukan lagi lapar. Itu rakus. Kakek menolak naik kapal.", "He told my grandfather: 'With that gem, there'll never be famine again.' But grandfather looked into his eyes, and what he saw wasn't hunger anymore. It was greed. Grandfather refused to board."]],
        ["hero", ["Niat baik yang perlahan berubah jadi keserakahan...", "Good intentions that slowly turned into greed..."]],
        ["bahar", ["Ubur-ubur api masih berkerumun di aula kuil, mengerubungi sisa kutukannya. Usir mereka, lalu cari tulisan di Ruang Karang. Kata kakek, Arung selalu mengukir sesuatu di setiap tempat ia singgah.", "Fire jellyfish still swarm the temple hall, clinging to what's left of the curse. Drive them off, then look for writing in the Coral Chamber. Grandfather said Arung always carved something wherever he stopped."]],
      ] },
      { tipe: "kalahkan", monster: "uburUbur", need: 6, area: "kuil", tujuan: ["Usir 6 Ubur-ubur Api dari aula Kuil Samudra", "Drive 6 Fire Jellyfish from the Temple of the Sea's hall"], baris: [
        ["narasi", ["Ubur-ubur terakhir meletup menjadi gelembung garam. Aula kuil hening, hanya ombak yang berbisik di sela tiang.", "The last jellyfish pops into a bubble of salt. The temple hall falls silent, only the waves whispering between the pillars."]],
      ] },
      { tipe: "prasasti", area: "kuil", dekat: "bos", tujuan: ["Cari ukiran Arung di Ruang Karang", "Find Arung's carving in the Coral Chamber"], baris: [
        ["narasi", ["Di dinding Ruang Karang, di bawah lapisan kerang dan lumut, ada ukiran pisau yang dalam. Hurufnya miring, seperti ditulis tangan yang gemetar.", "On the wall of the Coral Chamber, under a crust of shells and moss, is a deep knife carving. The letters slant, as if written by a trembling hand."]],
        ["narasi", ["'Aku Arung dari Segara. Malam ini badai datang tanpa angin. Karang mulai tumbuh di kulitku. Awakku menjerit. Ini salahku.'", "'I am Arung of Segara. Tonight a storm came without wind. Coral is growing on my skin. My crew is screaming. This is my fault.'"]],
        ["narasi", ["'Aku datang untuk mengakhiri lapar. Tetapi di depan tangga pelangi aku lupa mengapa aku datang. Aku hanya ingin memiliki.'", "'I came to end hunger. But before the rainbow stairs I forgot why I came. I only wanted to possess.'"]],
        ["narasi", ["'Mirah, maafkan kakakmu. Siapa pun yang membaca ini, katakan pada orang Segara: jangan kunci gudang berasmu, dan jangan ikuti orang yang menjanjikan emas.'", "'Mirah, forgive your brother. Whoever reads this, tell the Segara folk: don't lock your rice stores, and don't follow anyone who promises gold.'"]],
        ["hero", ["Ia menyesal sejak malam pertama. Dan ia harus menunggu seratus tahun untuk bisa pulang.", "He regretted it from the very first night. And he had to wait a hundred years to go home."]],
      ] },
      { tipe: "bicara", npc: "bahar", tujuan: ["Sampaikan pesan Arung kepada Datuk Bahar", "Bring Arung's message to Datuk Bahar"], baris: [
        ["hero", ["Datuk, Arung meninggalkan pesan di Ruang Karang. Ia menyesal sejak malam kutukan itu turun. Dan ia menyebut nama adiknya, Mirah.", "Datuk, Arung left a message in the Coral Chamber. He regretted it from the night the curse fell. And he named his sister, Mirah."]],
        ["bahar", ["...Mirah. Kakekku juga menulis nama itu tiga kali di halaman yang disobek. Seolah takut lupa.", "...Mirah. My grandfather wrote that name three times on the torn page too. As if afraid he'd forget."]],
        ["bahar", ["'Jangan kunci gudang berasmu.' Hm. Seratus tahun kemudian, pesan terakhir bajak laut paling rakus di Segara ternyata nasihat untuk para saudagar.", "'Don't lock your rice stores.' Hm. A hundred years on, the last words of the greediest pirate in Segara turn out to be advice for merchants."]],
        ["bahar", ["Mulai musim ini, setiap gudang di bandar wajib menyisihkan beras untuk tahun paceklik. Akan kunamai Lumbung Mirah. Para saudagar pasti mengomel. Biar saja.", "Starting this season, every warehouse in the harbor must set aside rice for famine years. I'll call it Mirah's Granary. The merchants will grumble. Let them."]],
        ["bahar", ["Dan halaman ini akan kukembalikan ke buku pelabuhan. Orang Segara berhak tahu bahwa iblis mereka dulu seorang kakak yang kehilangan adiknya.", "And this page goes back into the harbor ledger. The people of Segara deserve to know their devil was once a brother who lost his little sister."]],
        ["bahar", ["Terimalah, Kisanak. Bukan bea, bukan upah. Anggap ini dari Arung, lewat tanganku.", "Take this, traveler. Not a toll, not a wage. Think of it as from Arung, through my hands."]],
      ] },
    ],
  },
  // ===================== KELABANG RAKSASA =====================
  {
    id: "kelabang", npc: "kirana", monster: "kelabang",
    judul: ["Peluit Tulang", "The Bone Whistle"],
    syarat: () => S.bos && S.bos.kelabang,
    hadiah: { gold: 500, exp: 1200, serpih: 4 },
    ringkas: ["Kelabang Raksasa adalah Lipan Jaga, penjaga celah Puncak Naga yang dibesarkan leluhur Kampung Awan setelah seorang raja dari bawah menyelinap lewat celah itu dan menikam sang naga. Ia hanya membiarkan lewat pemburu yang meniup peluit tulang. Ketika kabut merah datang, ia tak lagi mengenali peluit itu. Ayah Kirana, Ki Arsa, pergi untuk menenangkannya, bukan membunuhnya, dan gugur di sana setelah sempat dikenali sekejap.", "The Giant Centipede is the Gate Centipede, guardian of the pass to Dragon Peak, raised by the Cloud Village ancestors after a king from below slipped through and stabbed the dragon. It let pass only hunters who blew the bone whistle. When the red mist came, it no longer knew the whistle. Kirana's father, Ki Arsa, went to calm it, not kill it, and fell there after being recognized for a single moment."],
    langkah: [
      { tipe: "bicara", npc: "kirana", tujuan: ["Dengarkan Kirana tentang kelabang dan ayahnya", "Hear Kirana out about the centipede and her father"], baris: [
        ["kirana", ["Orang bawah. Kau ada waktu? ...Bukan, bukan tantangan berburu. Ini soal kelabang itu. Dan soal Ayah.", "Lowlander. Got a moment? ...No, not a hunting challenge. This is about that centipede. And about Father."]],
        ["kirana", ["Sejak kau mengembalikan pisaunya, aku membongkar peti Ayah. Di dasarnya ada catatan berburu, dan sebuah peluit dari tulang. Kecil sekali.", "Since you brought back his knife, I went through Father's chest. At the bottom were his hunting notes, and a whistle made of bone. Tiny."]],
        ["kirana", ["Kata Eyang Sukma, kelabang itu bukan monster liar. Namanya Lipan Jaga. Leluhur kami membesarkannya untuk menjaga celah ke Puncak Naga.", "Eyang Sukma says that centipede was no wild monster. Its name was the Gate Centipede. Our ancestors raised it to guard the pass to Dragon Peak."]],
        ["hero", ["Menjaga dari siapa?", "Guard it from whom?"]],
        ["kirana", ["Dari orang bawah. Dulu seorang raja dari bawah menyelinap lewat celah itu dan menikam sang naga. Sejak itu leluhur bersumpah: tak boleh ada lagi yang lewat tanpa izin.", "From lowlanders. Long ago a king from below sneaked through that pass and stabbed the dragon. Since then our ancestors swore: no one passes without leave."]],
        ["kirana", ["Hanya pemburu Kampung Awan yang boleh lewat, dengan meniup peluit tulang ini. Ayah pemegang peluit terakhir. Ikut aku ke gerbang utara. Ada yang mau kutunjukkan.", "Only Cloud Village hunters could pass, by blowing this bone whistle. Father was its last keeper. Come with me to the north gate. There's something I want to show you."]],
      ], tanya: [
        { tanya: ["Jadi kau juga menganggapku orang bawah yang berbahaya?", "So you think I'm a dangerous lowlander too?"], jawab: [
          ["kirana", ["Dulu, ya. Sekarang... kau orang bawah yang menyembuhkan naga. Itu golongan lain. Golongan yang menyebalkan, tapi lain.", "I used to. Now... you're the lowlander who healed the dragon. That's a different category. An annoying one, but different."]],
        ] },
      ] },
      // ke [17, 4]: petak PATH jalan keluar utara Kampung Awan (x 16-18) menuju Hutan Batu, tempat pisau ayah Kirana digantung
      { tipe: "pandu", npc: "kirana", area: "awan", ke: [17, 4], tujuan: ["Ikuti Kirana ke gerbang utara Kampung Awan", "Follow Kirana to Cloud Village's north gate"],
        ajak: ["Ikuti aku ke gerbang utara. Jangan tertinggal, orang bawah. Aku tidak akan menunggu. ...Baik, aku menunggu sedikit.", "Follow me to the north gate. Don't fall behind, lowlander. I won't wait. ...Fine, I'll wait a little."], baris: [
        ["kirana", ["Ini gerbang utara. Pisau Ayah tergantung di tiang itu, menghadap Hutan Batu. Supaya ia selalu ingat jalan pulang, seperti katanya dulu.", "This is the north gate. Father's knife hangs on that post, facing the Stone Forest. So he'll always remember the way home, like he used to say."]],
        ["kirana", ["Catatan terakhir Ayah ditulis di sini, sebelum ia berangkat. Dengar: 'Lipan Jaga tidak lagi mengenal peluit. Ia menyerang kambing Angon, ia turun ke tepi hutan. Kabut membuatnya kesakitan.'", "Father wrote his last note right here, before he left. Listen: 'The Gate Centipede no longer knows the whistle. It attacks Angon's goats, it comes down to the forest edge. The mist is hurting it.'"]],
        ["kirana", ["'Para tetua bilang ia harus dibunuh sebelum sampai ke kampung. Tapi ia menjaga kita ratusan tahun. Aku akan mencoba menenangkannya dulu. Kalau aku tidak kembali, jangan biarkan Kirana membenci kelabang itu.'", "'The elders say it must be killed before it reaches the village. But it has guarded us for centuries. I'll try to calm it first. If I don't return, don't let Kirana hate that centipede.'"]],
        ["hero", ["Ayahmu pergi untuk menolongnya. Bukan untuk membunuhnya.", "Your father went to help it. Not to kill it."]],
        ["kirana", ["Dan aku sepuluh tahun membencinya. Persis yang Ayah larang. ...Elang Batu masih berputar-putar di atas sarangnya. Usir mereka, lalu periksa sarang itu. Ayah selalu meninggalkan tanda.", "And I hated it for ten years. Exactly what Father told me not to do. ...Stone Hawks still circle over its lair. Drive them off, then search the nest. Father always left a mark."]],
      ] },
      { tipe: "kalahkan", monster: "elangBatu", need: 6, area: "hutanBatu", tujuan: ["Usir 6 Elang Batu yang berputar di Hutan Batu", "Drive off 6 Stone Hawks circling the Stone Forest"], baris: [
        ["narasi", ["Elang terakhir jatuh berdebam. Di langit Hutan Batu tak ada lagi bayangan sayap yang berputar.", "The last hawk crashes down. No more wing-shadows circle the Stone Forest sky."]],
      ] },
      { tipe: "prasasti", area: "hutanBatu", dekat: "bos", tujuan: ["Cari tanda Ki Arsa di sarang Kelabang Raksasa", "Find Ki Arsa's mark at the Giant Centipede's lair"], baris: [
        ["narasi", ["Di dinding batu dekat sarang, tersembunyi di balik kulit kelabang yang mengelupas, ada dua ukiran. Yang satu tua dan dalam, yang lain lebih baru.", "On the rock wall near the lair, hidden behind shed centipede skin, are two carvings. One old and deep, the other newer."]],
        ["narasi", ["Ukiran tua: 'Lipan Jaga, anak Hutan Batu. Lewatkan yang meniup peluit, tahan yang datang membawa tombak. Jagalah tidur sang naga.'", "The old carving: 'Gate Centipede, child of the Stone Forest. Let pass those who blow the whistle, hold back those who come bearing spears. Guard the dragon's sleep.'"]],
        ["narasi", ["Ukiran baru, goresan pisau: 'Aku Arsa, pemburu Kampung Awan. Ia mengenaliku sebentar, waktu kutiup peluit untuk ketiga kalinya. Matanya jernih sekejap. Lalu kabut menang lagi.'", "The new one, scratched with a knife: 'I am Arsa, hunter of Cloud Village. It knew me for a moment, when I blew the whistle a third time. Its eyes cleared for an instant. Then the mist won again.'"]],
        ["narasi", ["'Ia tidak jahat. Ia hanya terlalu setia pada tugas yang sudah tak bisa ia pahami. Kirana, anakku, kalau kau membaca ini: maafkan dia, dan maafkan aku.'", "'It isn't evil. It's only too loyal to a duty it can no longer understand. Kirana, my child, if you read this: forgive it, and forgive me.'"]],
        ["hero", ["Ia sempat mengenali ayahmu, Kirana. Walau hanya sekejap.", "It did recognize your father, Kirana. Even if only for a moment."]],
      ] },
      { tipe: "bicara", npc: "kirana", tujuan: ["Sampaikan pesan Ki Arsa kepada Kirana", "Bring Ki Arsa's message to Kirana"], baris: [
        ["hero", ["Kirana, ayahmu meninggalkan tulisan di sarang. Lipan Jaga sempat mengenalinya waktu ia meniup peluit. Sekejap, sebelum kabut menang.", "Kirana, your father left writing at the lair. The Gate Centipede knew him when he blew the whistle. For a moment, before the mist won."]],
        ["kirana", ["Sekejap... Jadi Ayah tidak mati sia-sia. Ia sempat menyentuh sesuatu yang masih baik di dalam makhluk itu.", "A moment... So Father didn't die for nothing. He reached something still good inside that creature."]],
        ["kirana", ["Dan ia minta aku memaafkan. Kelabang itu, dan dirinya sendiri. Ayah memang selalu begitu. Pergi dulu, minta maaf belakangan.", "And he asked me to forgive. The centipede, and himself. That was always Father. Leave first, apologize later."]],
        ["kirana", ["...Jangan lihat aku. Debu batu lagi.", "...Don't look at me. Stone dust again."]],
        ["kirana", ["Peluit ini akan kugantung di samping pisaunya. Kalau suatu hari Hutan Batu melahirkan Lipan Jaga baru, aku ingin jadi pemburu yang meniup peluit, bukan yang membawa tombak.", "I'll hang this whistle next to his knife. If the Stone Forest ever births a new Gate Centipede, I want to be the hunter who blows the whistle, not the one who brings a spear."]],
        ["kirana", ["Ini. Ambil. Hadiah dari pemburu terbaik Kampung Awan. Setelah Ayah, tentu saja. ...Dan setelah kau. Sedikit. Jangan besar kepala.", "Here. Take it. A gift from Cloud Village's best hunter. After Father, of course. ...And after you. Barely. Don't let it go to your head."]],
      ] },
    ],
  },
  // ===================== NAGA KENCANA =====================
  {
    id: "naga", npc: "sukma", monster: "naga",
    judul: ["Hujan Pertama di Atas Awan", "The First Rain Above the Clouds"],
    syarat: () => S.bos && S.bos.naga,
    hadiah: { gold: 600, exp: 1500, serpih: 4 },
    ringkas: ["Seribu tahun lalu, hujan pertama Negeri Awan jatuh ke kawah puncak yang membara, dan dari uapnya lahir Naga Kencana. Ia belajar menuntun hujan ke dunia bawah, memberikan sisiknya sebagai tanda janji kepada leluhur Nyi Laras, dan menitipkan tiga percik cahaya jantungnya sebagai Mustika Bumi, Tirta, dan Bayu. Lalu seorang raja dari bawah menikamnya saat tidur. Anak-anaknya mengukir seluruh kisah itu di dinding kawah, sampai hari ia disembuhkan.", "A thousand years ago, the first rain of the Cloud Highlands fell into the glowing summit crater, and from its steam Naga Kencana was born. It learned to guide rain to the lands below, gave its scale as a pledge to Nyi Laras's ancestors, and entrusted three sparks of its heart as the Earth, Water and Wind Gems. Then a king from below stabbed it in its sleep. Its young carved the whole tale on the crater wall, up to the day it was healed."],
    langkah: [
      { tipe: "bicara", npc: "sukma", tujuan: ["Dengarkan dongeng Eyang Sukma tentang Naga Kencana", "Hear Eyang Sukma's tale of Naga Kencana"], baris: [
        ["sukma", ["Duduklah, cucu Wening. Kau sudah menyembuhkan naga itu, tapi kau belum tahu siapa sebenarnya dia. Itu tidak adil, kan? Hohoho.", "Sit down, Wening's grandchild. You healed that dragon, yet you don't really know who it is. Hardly fair, is it? Hohoho."]],
        ["sukma", ["Kau tentu pernah dengar cerita naga di bawah sana. Menurut cerita rakyat Jawa dan kisah-kisah Hindu-Buddha, naga adalah ular agung yang menjaga air, bumi, dan benda-benda suci.", "Surely you've heard dragon tales down below. In Javanese folklore and in Hindu-Buddhist stories, the naga is a great serpent that guards water, earth and sacred things."]],
        ["sukma", ["Dalam pewayangan Jawa, misalnya, dikenal Sang Hyang Antaboga, raja naga yang bersemayam di dasar bumi. Naga juga sering dipahat sebagai penjaga di candi-candi. Orang bawah sudah lama menghormati makhluk ini.", "In Javanese wayang, for instance, there's Sang Hyang Antaboga, the naga king who dwells deep beneath the earth. Nagas are often carved as guardians on old temples too. Your people have honored these creatures for a long time."]],
        ["sukma", ["Naga Kencana kita bukan Antaboga, Nak. Ia naga negeri awan, dengan dongengnya sendiri. Dan dongeng itu dimulai dengan hujan.", "Our Naga Kencana is not Antaboga, child. It's a dragon of the cloud lands, with its own tale. And that tale begins with rain."]],
        ["sukma", ["Seribu tahun lalu, Negeri Awan belum pernah mengenal hujan. Lalu hujan pertama jatuh, tepat ke kawah puncak yang masih membara. Dari uapnya lahir seekor naga kecil, sebesar lenganku.", "A thousand years ago, the Cloud Highlands had never known rain. Then the first rain fell, right into the summit crater that was still glowing. From its steam a little dragon was born, no bigger than my arm."]],
        ["hero", ["Naga itu lahir dari hujan dan api?", "The dragon was born of rain and fire?"]],
        ["sukma", ["Itulah sebabnya napasnya hangat dan sisiknya menuntun hujan. Ayo, jalan sedikit dengan nenek tua ini. Dari ujung utara kampung, puncaknya kelihatan jelas.", "That's why its breath is warm and its scales guide the rain. Come, take a little walk with this old woman. From the north end of the village, the peak is plain to see."]],
      ], tanya: [
        { tanya: ["Eyang, apakah Antaboga benar-benar ada?", "Eyang, is Antaboga real?"], jawab: [
          ["sukma", ["Itu tokoh dalam cerita dan pewayangan yang dihormati banyak orang, Nak. Bagaimana orang memaknainya, biarlah jadi urusan masing-masing. Nenek ini cuma pencerita. Hohoho.", "He's a figure from stories and wayang that many people honor, child. How each person understands him is their own affair. This old woman is only a storyteller. Hohoho."]],
        ] },
      ] },
      // ke [20, 3]: petak rumput terbuka di ujung utara Kampung Awan (baris 3, x 19-21 kosong), 6-7 petak dari Eyang Sukma (17, 9)
      { tipe: "pandu", npc: "sukma", area: "awan", ke: [20, 3], tujuan: ["Ikuti Eyang Sukma ke ujung utara kampung", "Follow Eyang Sukma to the north end of the village"],
        ajak: ["Pelan-pelan, Nak. Lututku sudah lebih tua dari separuh awan di sini.", "Slowly, child. My knees are older than half the clouds up here."], baris: [
        ["sukma", ["Lihat puncak itu. Dulu ibuku bercerita, naga kecil itu bermain di sana seratus tahun lamanya, sampai tubuhnya sepanjang sungai.", "Look at that peak. My mother used to say the little dragon played up there for a hundred years, until it grew as long as a river."]],
        ["sukma", ["Lalu ia melihat ke bawah, ke dunia kalian, dan melihat sawah-sawah yang retak karena kemarau. Ia belajar menuntun awan turun dan meneteskan hujan di tempat yang tepat.", "Then it looked down at your world and saw rice fields cracked by drought. It learned to lead the clouds down and let rain fall in the right places."]],
        ["sukma", ["Kepada leluhur Laras di Segara, ia memberi sisiknya sebagai tanda janji. Kepada tanah Wanasari, ia menitipkan tiga percik cahaya jantungnya: Mustika Bumi, Tirta, dan Bayu. Supaya bumi, air, dan angin di bawah tetap seimbang.", "To Laras's ancestors in Segara, it gave its scale as a pledge. To the Wanasari lands, it entrusted three sparks of its heart's light: the Earth, Water and Wind Gems. So the earth, water and wind below would stay in balance."]],
        ["hero", ["Ia memberi begitu banyak... dan dibalas dengan keris.", "It gave so much... and was repaid with a kris."]],
        ["sukma", ["Begitulah kadang kebaikan dibalas, Nak. Raja itu menyelinap saat ia tidur. Sejak itu, setiap kali naga bermimpi, yang ia impikan hanya rasa sakit.", "That's how kindness is sometimes repaid, child. That king crept in while it slept. Ever since, whenever the dragon dreamed, it dreamed only of pain."]],
        ["sukma", ["Pergilah ke kawahnya. Kudengar anak-anaknya mengukir sesuatu di dinding sana. Dengan cakar dan api. Jangan tanya bagaimana, nenek juga belum pernah melihatnya. Hohoho.", "Go to its crater. I hear its young carved something on the wall there. With claws and fire. Don't ask me how, I've never seen it either. Hohoho."]],
      ] },
      { tipe: "prasasti", area: "puncakNaga", dekat: "bos", tujuan: ["Cari ukiran di kawah Naga Kencana", "Find the carvings in Naga Kencana's crater"], baris: [
        ["narasi", ["Di dinding kawah, tak jauh dari tempat Naga Kencana tidur, ada goresan-goresan cakar yang membentuk gambar. Bukan huruf, tapi kau bisa membaca maknanya.", "On the crater wall, not far from where Naga Kencana sleeps, claw marks form pictures. Not letters, but you can read their meaning."]],
        ["narasi", ["Gambar pertama: setetes hujan jatuh ke dalam api, dan seekor naga kecil muncul dari uapnya.", "The first picture: a raindrop falls into fire, and a little dragon rises from the steam."]],
        ["narasi", ["Gambar kedua: naga itu meneteskan hujan ke sawah-sawah di bawah awan. Manusia-manusia kecil menengadah dan menari.", "The second: the dragon lets rain fall on the rice fields below the clouds. Tiny people look up and dance."]],
        ["narasi", ["Gambar ketiga digores berulang-ulang, begitu dalam sampai batunya retak: seorang manusia bermahkota menikam dada naga yang sedang tidur.", "The third has been scratched again and again, so deep the stone has cracked: a crowned man stabbing the chest of a sleeping dragon."]],
        ["narasi", ["Gambar terakhir masih baru, bekas cakarnya belum tertutup debu: seorang manusia kecil mengangkat tiga cahaya, dan naga itu memejamkan mata dengan tenang.", "The last is fresh, its claw marks not yet dusted over: a small person raising three lights, and the dragon closing its eyes in peace."]],
        ["hero", ["...Itu aku. Anak-anaknya mengukir aku di sini.", "...That's me. Its young carved me here."]],
        ["narasi", ["Di dekat ukiran itu, seekor anak naga meringkuk tidur. Ia membuka sebelah mata, menatapmu, lalu kembali tidur sambil mendengkur kecil.", "Near the carving, a young dragon lies curled asleep. It opens one eye, looks at you, then goes back to sleep with a tiny snore."]],
      ] },
      { tipe: "bicara", npc: "sukma", tujuan: ["Ceritakan ukiran di kawah kepada Eyang Sukma", "Tell Eyang Sukma about the crater carvings"], baris: [
        ["hero", ["Eyang, anak-anak naga mengukir kisah induknya di dinding kawah. Dari hujan pertama sampai... sampai hari aku datang.", "Eyang, the young dragons carved their parent's story on the crater wall. From the first rain all the way to... to the day I came."]],
        ["sukma", ["Mereka mengukirmu? Hohoho! Kau masuk dongeng, Nak. Hati-hati, nanti cucu-cucu di sini minta kau bercerita setiap malam.", "They carved you? Hohoho! You're in the legend now, child. Careful, or the little ones here will want a story from you every night."]],
        ["sukma", ["Tapi perhatikan gambar ketiga itu, yang digores berulang-ulang. Itu tanda luka yang tidak boleh dilupakan.", "But mind that third picture, the one scratched over and over. That's the mark of a wound that must not be forgotten."]],
        ["sukma", ["Sembuh bukan berarti lupa, Nak. Naga itu sudah sembuh, tapi ia ingat. Dan selama ada yang ingat, semoga tak ada lagi tangan yang berani menikam.", "Healing isn't forgetting, child. The dragon is healed, but it remembers. And as long as someone remembers, may no hand ever dare to strike again."]],
        ["sukma", ["Pagi tadi gerimis turun di Kampung Awan. Lembut sekali, hangat pula. Kurasa itu caranya berterima kasih.", "This morning a drizzle fell on Cloud Village. So gentle, and warm too. I think that's its way of saying thank you."]],
        ["sukma", ["Bawalah ini. Dan kalau kau bertemu Wening, bilang: Sukma menceritakan dongeng naga dengan sangat bagus. Lebih bagus dari dia.", "Take this. And when you see Wening, tell him: Sukma told the dragon tale beautifully. Better than he ever could."]],
      ] },
    ],
  },
  // ===================== RAJA JERANGKONG =====================
  {
    id: "rajaJerangkong", npc: "juru", monster: "rajaJerangkong",
    judul: ["Sumpah Tulang", "The Oath of Bones"],
    syarat: () => S.bos && S.bos.rajaJerangkong,
    hadiah: { gold: 1500, exp: 6000, serpih: 5 },
    ringkas: ["Raja Jerangkong adalah Prabu Wirabumi, raja negeri sawah yang bersahabat dengan Kalamurka sejak kecil. Ia memohon sahabatnya agar tak mendaki ke Negeri Awan, lalu menghadangnya di pematang sesudah sang naga ditikam. Merasa gagal, ia bersumpah menjaga Pecahan Segel Bumi dengan tulangnya sendiri, dan prajuritnya memilih dimakamkan bersamanya. Prajurit termudanya, Santika, disuruh hidup memegang kunci: leluhur keluarga juru kunci.", "The Skeleton King is King Wirabumi, ruler of the rice-field kingdom and Kalamurka's friend since childhood. He begged his friend not to climb to the Cloud Highlands, then stood against him in the paddies after the dragon was stabbed. Feeling he had failed, he swore to guard the Earth Seal Shard with his own bones, and his soldiers chose to be buried with him. His youngest soldier, Santika, was ordered to live and keep the key: ancestor of the tomb-keeper family."],
    langkah: [
      { tipe: "bicara", npc: "juru", tujuan: ["Dengarkan Mbah Juru tentang Prabu Wirabumi", "Hear Mbah Juru's tale of King Wirabumi"], baris: [
        ["juru", ["Le, sini. Duduk. Mbah mau cerita soal Prabu Wirabumi, mumpung tenggorokan ini belum kering.", "Lad, come here. Sit. I want to tell you about King Wirabumi, while this throat of mine is still wet."]],
        ["juru", ["Orang mengenalnya sebagai raja yang mengalahkan Kalamurka. Tapi tak banyak yang tahu: dulu mereka bersahabat. Sejak kecil. Satu guru, satu piring, satu kenakalan.", "People know him as the king who defeated Kalamurka. But few know they were once friends. Since childhood. One teacher, one plate, one mischief."]],
        ["juru", ["Wirabumi putra raja negeri sawah, negeri yang kini jadi Wanasari dan sekitarnya. Kalamurka putra raja kota di seberang bukit. Yang satu kaya padi, yang lain kaya emas.", "Wirabumi was the son of the rice-field kingdom, the land that's now Wanasari and its surroundings. Kalamurka was the son of the city beyond the hills. One rich in rice, the other rich in gold."]],
        ["juru", ["Waktu Kalamurka mulai bicara soal mustika naga, Wirabumi orang pertama yang menentangnya. Ia datang sendirian ke istana sahabatnya, memohon semalam suntuk.", "When Kalamurka began talking about the dragon's gem, Wirabumi was the first to oppose him. He came alone to his friend's palace and pleaded all night long."]],
        ["hero", ["Dan Kalamurka tidak mendengar.", "And Kalamurka wouldn't listen."]],
        ["juru", ["Kalamurka mengusirnya. Sebulan kemudian, langit murka. Ikut Mbah sebentar ke pematang. Ada yang mau Mbah tunjukkan, dan kaki tua ini perlu digerakkan.", "Kalamurka sent him away. A month later, the sky raged. Come with me to the paddy dikes a moment. There's something I want to show you, and these old legs need moving."]],
      ], tanya: [
        { tanya: ["Mbah, kenapa keluarga Mbah yang menjaga makam?", "Mbah, why is it your family that keeps the tomb?"], jawab: [
          ["juru", ["Leluhur Mbah namanya Santika. Prajurit paling muda Prabu Wirabumi, umurnya baru lima belas. Sang Prabu tidak mengizinkannya ikut dimakamkan.", "My ancestor was named Santika. King Wirabumi's youngest soldier, only fifteen. The king forbade him to be buried with the rest."]],
          ["juru", ["Kata beliau: 'Kau hidup. Pegang kuncinya. Turunkan pada anakmu, dan pada anak dari anakmu.' Jadi begitulah, Le. Kami ini prajurit yang disuruh hidup.", "He said: 'You live. Hold the key. Pass it to your child, and to your child's child.' So there it is, lad. We're the soldiers who were ordered to live."]],
        ] },
      ] },
      // ke [28, 12]: petak rumput pematang (baris 12 jalur kering sawah), 6 petak dari Mbah Juru (34, 13)
      { tipe: "pandu", npc: "juru", area: "sawah", ke: [28, 12], tujuan: ["Ikuti Mbah Juru ke pematang sawah", "Follow Mbah Juru to the paddy dike"],
        ajak: ["Ayo, ikut Mbah ke pematang. Hati-hati, lumpurnya suka menelan kaki orang kota.", "Come, follow me to the dike. Careful, the mud loves swallowing city folk's feet."], baris: [
        ["juru", ["Lihat petak-petak ini. Lima ratus tahun lalu, sawah ini milik Prabu Wirabumi. Konon beliau sendiri ikut mencangkul tiap musim tanam.", "Look at these terraces. Five hundred years ago these fields belonged to King Wirabumi. They say he hoed alongside his people every planting season."]],
        ["juru", ["Waktu Kalamurka kembali dari Negeri Awan dengan keris berlumur darah naga, pasukannya menyerbu ke sini, memburu para resi yang hendak mengutuknya. Wirabumi menghadang di pematang ini.", "When Kalamurka returned from the Cloud Highlands with a kris stained in dragon's blood, his army stormed through here, hunting the sages who meant to curse him. Wirabumi stood in their way, on this very dike."]],
        ["juru", ["Beliau menang. Tapi waktu sahabatnya jatuh, beliau berlutut dan menangis. Para resi lalu menyegel Kalamurka dan memecah segelnya jadi tiga.", "He won. But when his friend fell, he knelt and wept. Then the sages sealed Kalamurka away and split the seal in three."]],
        ["juru", ["Wirabumi meminta pecahan bumi. 'Biar aku yang menjaganya,' katanya, 'karena akulah yang gagal menghentikannya sejak awal.' Lalu beliau bersumpah menjaga segel itu dengan tulangnya sendiri.", "Wirabumi asked for the earth shard. 'Let me guard it,' he said, 'for I'm the one who failed to stop him from the start.' And he swore to guard that seal with his own bones."]],
        ["hero", ["Ia menghukum dirinya sendiri...", "He punished himself..."]],
        ["juru", ["Di makam, sebagian prajuritnya belum juga tenang. Baringkan mereka, Le. Lalu cari sumpah sang Prabu. Terukir di singgasananya, kata kakekku dulu.", "In the tomb, some of his soldiers still aren't at peace. Lay them to rest, lad. Then find the king's oath. Carved on his throne, my grandfather used to say."]],
      ] },
      { tipe: "kalahkan", monster: "jerangkong", need: 6, area: "makam", tujuan: ["Tenangkan 6 Jerangkong yang masih gelisah di Makam Kuno", "Lay 6 restless Skeletons to rest in the Ancient Tomb"], baris: [
        ["narasi", ["Jerangkong terakhir runtuh dengan pelan, seperti orang tua yang akhirnya boleh duduk. Lambang matahari di perisainya berkilau sebentar.", "The last skeleton settles down slowly, like an old man finally allowed to sit. The sun emblem on its shield glints for a moment."]],
      ] },
      { tipe: "prasasti", area: "makam", dekat: "bos", tujuan: ["Baca sumpah Prabu Wirabumi di dekat singgasananya", "Read King Wirabumi's oath near his throne"], baris: [
        ["narasi", ["Di sandaran singgasana batu yang kini kosong, terpahat tulisan dengan aksara yang indah dan tegas.", "On the back of the now-empty stone throne, words are carved in a fine, firm script."]],
        ["narasi", ["'Aku Wirabumi, raja negeri sawah. Aku gagal menahan sahabatku sendiri, dan seekor naga menanggung lukanya. Biarlah tulangku menebus kegagalan itu.'", "'I am Wirabumi, king of the rice fields. I failed to hold back my own friend, and a dragon bore the wound. Let my bones atone for that failure.'"]],
        ["narasi", ["'Selama tulangku utuh, pecahan bumi takkan jatuh ke tangannya. Prajuritku memilih tinggal bersamaku. Aku melarang, mereka tetap tinggal. Begitulah orang sawah: keras kepala dan setia.'", "'While my bones endure, the earth shard shall not fall to him. My soldiers chose to stay with me. I forbade it, and still they stayed. Such are the people of the fields: stubborn and loyal.'"]],
        ["narasi", ["'Murka, sahabatku. Kalau suatu hari kau bebas dan membaca ini: aku tidak pernah membencimu. Aku hanya terlambat menyayangimu dengan cara yang benar.'", "'Murka, my friend. If one day you are free and read this: I never hated you. I was only too late in caring for you the right way.'"]],
        ["hero", ["'Murka'... ia memanggil Kalamurka dengan nama kecilnya. Bahkan setelah semua itu.", "'Murka'... he called Kalamurka by his childhood name. Even after all of that."]],
      ] },
      { tipe: "bicara", npc: "juru", tujuan: ["Ceritakan sumpah Prabu Wirabumi kepada Mbah Juru", "Tell Mbah Juru about King Wirabumi's oath"], baris: [
        ["hero", ["Mbah, sumpah Prabu Wirabumi masih utuh di singgasananya. Di akhir tulisannya, ia menulis untuk Kalamurka. Ia bilang tidak pernah membencinya.", "Mbah, King Wirabumi's oath is still whole on his throne. At the end, he wrote to Kalamurka. He said he never hated him."]],
        ["juru", ["...Begitu. Tujuh turunan kami menjaga makam itu, dan tak satu pun berani membaca sandaran singgasananya. Kami pikir itu bukan bagian kami.", "...I see. Seven generations of us kept that tomb, and not one of us dared read the back of his throne. We thought it wasn't ours to read."]],
        ["juru", ["Waktu kau melawannya, beliau berteriak 'semua manusia serakah'. Itu bisikan bayangan, Le. Bayangan memakai luka terdalam beliau: rasa bersalah karena gagal menyelamatkan sahabatnya.", "When you fought him, he shouted 'all humans are greedy'. That was the shadow's whisper, lad. The shadow used his deepest wound: the guilt of failing to save his friend."]],
        ["juru", ["Ratusan tahun mendengar bisikan itu setiap malam... pantas kalau akhirnya beliau buta.", "Centuries of hearing that whisper every night... no wonder he went blind in the end."]],
        ["juru", ["Tapi kau melawannya tanpa benci, dan beliau jernih kembali. Mungkin itu yang beliau tunggu selama ini: bukti bahwa tidak semua manusia seperti sahabatnya dulu.", "But you fought him without hatred, and he came clear again. Maybe that's what he'd been waiting for all along: proof that not every human is like his friend once was."]],
        ["juru", ["Terimalah ini dari keluarga juru kunci. Santika pasti senang. Prajurit yang disuruh hidup akhirnya punya cerita yang pantas dibawa pulang.", "Take this, from the tomb-keeper family. Santika would be pleased. The soldier ordered to live finally has a story worth bringing home."]],
      ] },
    ],
  },
  // ===================== GURITA RAKSASA =====================
  {
    id: "guritaRaksasa", npc: "wulan", monster: "guritaRaksasa",
    judul: ["Lagu Para Penyanyi Gua", "Song of the Cave Singers"],
    syarat: () => S.bos && S.bos.guritaRaksasa,
    hadiah: { gold: 1800, exp: 8000, serpih: 5 },
    ringkas: ["Datu Gurita dipilih leluhur Nyi Laras untuk memeluk Pecahan Segel Segara karena delapan lengannya tak pernah lepas menggenggam. Agar sang penjaga tidak kesepian, satu keluarga penyelam di Desa Apung bernyanyi untuknya turun-temurun, dari ibu ke anak perempuan. Ibu Wulan, Kenanga, adalah penyanyi terakhir. Sepeninggalnya gua menjadi sunyi, dan bisikan Kalamurka mengisi kesunyian itu.", "Datu Gurita was chosen by Nyi Laras's ancestors to hold the Sea Seal Shard because its eight arms never loosen their grip. So the guardian would not be lonely, a family of divers in the Floating Village sang to it, mother to daughter, through the generations. Wulan's mother, Kenanga, was the last singer. After she died the cave fell silent, and Kalamurka's whispers filled that silence."],
    langkah: [
      { tipe: "bicara", npc: "wulan", tujuan: ["Dengarkan temuan Wulan tentang ibunya", "Hear what Wulan found about her mother"], baris: [
        ["wulan", ["Hei, orang darat. Kau sibuk? Aku menemukan sesuatu di rumah. Sesuatu tentang Ibu dan Datu Gurita.", "Hey, landlubber. Busy? I found something at home. Something about Mother and Datu Gurita."]],
        ["wulan", ["Aku membongkar peti Ibu untuk mencari tali jaring. Di bawah kain-kainnya ada lembaran lontar yang diikat benang merah. Isinya lagu. Puluhan lagu.", "I was digging through Mother's chest for net rope. Under her cloths was a bundle of palm-leaf pages tied with red thread. Songs. Dozens of songs."]],
        ["wulan", ["Di lembar pertama tertulis: 'Untuk penjaga di dalam gua. Dinyanyikan keluarga kami, dari ibu ke anak perempuannya, selama laut masih asin.'", "The first page says: 'For the guardian in the cave. Sung by our family, from mother to daughter, for as long as the sea stays salty.'"]],
        ["hero", ["Jadi bernyanyi untuk Datu Gurita bukan cuma kebiasaan ibumu. Itu tugas keluarga kalian.", "So singing to Datu Gurita wasn't just your mother's habit. It was your family's duty."]],
        ["wulan", ["Dan Ibu tak pernah memberitahuku. Ia cuma bilang itu dongeng pengantar tidur. Mungkin ia menunggu aku cukup besar. Lalu ia sakit, tiga musim lalu, dan... tidak sempat.", "And Mother never told me. She said it was just a bedtime story. Maybe she was waiting until I was old enough. Then she fell ill, three seasons ago, and... never got the chance."]],
        ["wulan", ["Ikut aku ke dermaga selatan. Ibu selalu bernyanyi dari ujungnya setiap bulan purnama. Aku dulu duduk di sampingnya, mengira ia bernyanyi untuk ikan.", "Come with me to the south pier. Mother sang from its end every full moon. I used to sit beside her, thinking she was singing to the fish."]],
      ], tanya: [
        { tanya: ["Kau tidak marah ibumu merahasiakannya?", "Aren't you angry she kept it secret?"], jawab: [
          ["wulan", ["Sedikit. Lalu aku ingat suaranya waktu bernyanyi. Orang yang bernyanyi seindah itu untuk makhluk yang kesepian tidak mungkin berniat buruk pada anaknya sendiri.", "A little. Then I remember her voice when she sang. Someone who sang that beautifully for a lonely creature could never mean harm to her own child."]],
        ] },
      ] },
      // ke [18, 23]: titian BRIDGE dermaga selatan Desa Apung (x 17-19, y 21-24), 10-11 petak dari Wulan (12, 14) lewat titian
      { tipe: "pandu", npc: "wulan", area: "desaApung", ke: [18, 23], tujuan: ["Ikuti Wulan ke ujung dermaga selatan", "Follow Wulan to the end of the south pier"],
        ajak: ["Ayo. Titiannya licin, jangan sampai kau jatuh. Aku malas menyelam untuk menolong orang darat.", "Come on. The boardwalk's slippery, don't fall in. I can't be bothered diving to rescue a landlubber."], baris: [
        ["wulan", ["Di sini. Ujung dermaga selatan. Kalau air tenang, suara dari sini bisa terbawa jauh sampai ke mulut gua.", "Here. The end of the south pier. When the water's calm, a voice from here carries all the way to the cave mouth."]],
        ["wulan", ["Lontar Ibu bercerita: ratusan tahun lalu, leluhur Nyi Laras memilih seekor gurita tua untuk memeluk pecahan segel. Delapan lengannya tak pernah lepas menggenggam, dan otaknya cerdik menolak bujukan.", "Mother's pages tell it: centuries ago, Nyi Laras's ancestors chose an old octopus to hold the seal shard. Its eight arms never let go, and its clever mind could refuse any temptation."]],
        ["wulan", ["Tapi penjaga yang baik tetap bisa kesepian. Jadi leluhurku, seorang penyelam perempuan, berjanji menyanyikan lagu untuknya. Supaya ia ingat, di atas air ada yang peduli.", "But even a good guardian can be lonely. So my ancestor, a woman diver, promised to sing to it. So it would remember that someone above the water cared."]],
        ["wulan", ["Ibu penyanyi terakhir. Sejak Ibu pergi, tak ada lagi yang bernyanyi. Gua itu jadi sunyi. Dan kata Nyi Laras, bayangan paling suka tempat yang sunyi.", "Mother was the last singer. Since she passed, no one has sung. The cave went silent. And Nyi Laras says shadows love silent places most."]],
        ["hero", ["Bisikan Kalamurka mengisi kesunyian yang ditinggalkan ibumu.", "Kalamurka's whispers filled the silence your mother left behind."]],
        ["wulan", ["Belut listrik masih berkeliaran di lorong gua. Usir mereka, lalu cari dinding di dekat kolam Datu. Kata lontar ini, para penyanyi mengukir nama mereka di sana.", "Electric eels still roam the cave tunnels. Drive them off, then look for the wall by Datu's pool. These pages say the singers carved their names there."]],
      ] },
      { tipe: "kalahkan", monster: "belutListrik", need: 5, area: "goaLaut", tujuan: ["Usir 5 Belut Listrik dari lorong Gua Laut", "Drive 5 Electric Eels from the Sea Cave tunnels"], baris: [
        ["narasi", ["Belut terakhir melesat pergi. Air gua berpendar biru lembut, lalu tenang. Dari kedalaman terdengar dengkur panjang Datu Gurita yang sedang tidur.", "The last eel darts away. The cave water glows soft blue, then stills. From the depths comes the long snore of a sleeping Datu Gurita."]],
      ] },
      { tipe: "prasasti", area: "goaLaut", dekat: "bos", tujuan: ["Cari ukiran nama para penyanyi di dekat kolam Datu Gurita", "Find the singers' names carved near Datu Gurita's pool"], baris: [
        ["narasi", ["Di dinding karang dekat kolam hitam, ada deretan nama yang diukir dengan ujung kerang. Yang paling atas sudah hampir hilang dimakan air.", "On the coral wall by the black pool is a column of names carved with the edge of a shell. The topmost are nearly worn away by the water."]],
        ["narasi", ["Nama-nama perempuan, satu di bawah yang lain. Di samping tiap nama ada gambar kecil: ikan, bulan, bintang laut, sekuntum bunga.", "Women's names, one beneath another. Beside each is a little drawing: a fish, a moon, a starfish, a flower."]],
        ["narasi", ["Nama terakhir goresannya masih tajam: 'Kenanga.' Di sampingnya, gambar seorang anak perempuan kecil yang sedang berenang.", "The last name is still sharply cut: 'Kenanga.' Beside it, a drawing of a little girl swimming."]],
        ["narasi", ["Di bawah nama itu ada ruang kosong, seolah sengaja disisakan. Di dasarnya, satu baris tulisan: 'Untuk Wulan, kalau ia mau.'", "Below that name is an empty space, as if left on purpose. At its foot, a single line: 'For Wulan, if she wishes.'"]],
        ["hero", ["Ibumu menyisakan tempat untukmu, Wulan. Tapi ia membiarkanmu memilih.", "Your mother saved a place for you, Wulan. But she left the choice to you."]],
      ] },
      { tipe: "bicara", npc: "wulan", tujuan: ["Ceritakan ukiran nama itu kepada Wulan", "Tell Wulan about the carved names"], baris: [
        ["hero", ["Wulan, nama ibumu terukir di dinding gua. Kenanga. Di sampingnya ada gambar anak kecil berenang. Dan di bawahnya ada ruang kosong, 'untuk Wulan, kalau ia mau.'", "Wulan, your mother's name is carved on the cave wall. Kenanga. Next to it, a drawing of a child swimming. And beneath it an empty space, 'for Wulan, if she wishes.'"]],
        ["wulan", ["...Kalau aku mau. Ibu memang begitu. Tidak pernah menyuruh. Cuma menyisakan tempat, lalu menunggu.", "...If I wish. That was Mother. She never ordered. She just saved a place, and waited."]],
        ["wulan", ["Aku sudah bernyanyi di mulut gua sejak kau pulang dari sana. Lagunya sumbang. Datu Gurita tidak protes, jadi kurasa aku sudah setengah jadi penyanyi gua.", "I've been singing at the cave mouth since you came back from there. Off-key. Datu Gurita hasn't complained, so I guess I'm half a cave singer already."]],
        ["sanip", ["Wulan bernyanyi tiap senja sekarang, Kisanak. Ikan-ikan kembali ke dekat desa. Entah karena lagunya merdu, atau karena mereka penasaran dengan suara sumbang itu.", "Wulan sings every dusk now, traveler. The fish have come back near the village. Whether it's because the song is sweet, or because they're curious about that off-key voice, who knows."]],
        ["wulan", ["Pak Sanip! ...Besok aku akan menyelam ke sana dan mengukir namaku di bawah nama Ibu. Gambarnya... mungkin pelita mutiara. Yang kubuat untukmu.", "Pak Sanip! ...Tomorrow I'll dive down and carve my name beneath Mother's. The drawing... maybe a pearl lamp. The one I made for you."]],
        ["wulan", ["Ini dari Desa Apung. Pak Sanip yang mengumpulkan, jadi jangan heran kalau ada mutiara yang ternyata kancing baju.", "This is from the Floating Village. Pak Sanip collected it, so don't be surprised if one of the pearls turns out to be a button."]],
      ] },
    ],
  },
  // ===================== RAJAWALI PETIR =====================
  {
    id: "rajawaliPetir", npc: "bujang", monster: "rajawaliPetir",
    judul: ["Telur yang Disambar Petir", "The Lightning-Struck Egg"],
    syarat: () => S.bos && S.bos.rajawaliPetir,
    hadiah: { gold: 2200, exp: 10000, serpih: 6 },
    ringkas: ["Rajawali Petir menetas dari telur emas yang disambar petir di awan tertinggi. Ratu Angin menemukannya dan membesarkannya sebagai pelindung Negeri Awan. Ketika bayangan Kalamurka merembes dari Pecahan Segel Awan yang dititipkan para resi, sang ratu mengikatnya dengan seluruh anginnya sendiri. Istana pun miring, dan ia menjadi angin biasa yang hingga kini masih mengangkat layang-layang di Lembah Angin. Rajawali menjaga pusaka itu sendirian sampai bayangan menutup matanya.", "The Thunder Hawk hatched from a golden egg struck by lightning on the highest cloud. The Wind Queen found it and raised it as protector of the Cloud Highlands. When Kalamurka's shadow seeped from the Sky Seal Shard the sages entrusted to her, the queen bound it with all of her own wind. The palace tilted, and she became an ordinary wind, one that still lifts the kites of the Wind Valley. The hawk guarded the heirloom alone until the shadow clouded its eyes."],
    langkah: [
      { tipe: "bicara", npc: "bujang", tujuan: ["Dengarkan kisah keluarga Bujang tentang Rajawali Petir", "Hear Bujang's family tale of the Thunder Hawk"], baris: [
        ["bujang", ["Hei, hei! Penakluk badai! Kau punya waktu? Aku mau cerita soal Rajawali Petir. Ini warisan keluarga, lho. Satu-satunya warisan selain gulungan benang.", "Hey, hey! Storm-tamer! Got a minute? I want to tell you about the Thunder Hawk. It's a family heirloom, you know. Our only heirloom besides spools of string."]],
        ["bujang", ["Kau tahu kenapa layang-layangku berbentuk rajawali? Karena nenek dari nenekku melihatnya dengan mata kepalanya sendiri, waktu istana masih berdiri tegak.", "Know why my kites are shaped like a hawk? Because my grandmother's grandmother saw it with her own eyes, back when the palace still stood straight."]],
        ["bujang", ["Katanya, suatu malam badai besar mengamuk di atas lembah. Petir menyambar awan tertinggi, dan di sana ada sebutir telur emas sebesar kendi. Telur itu tidak hancur. Telur itu menetas.", "She said one night a great storm raged over the valley. Lightning struck the highest cloud, where a golden egg the size of a water jug sat. The egg didn't shatter. It hatched."]],
        ["hero", ["Rajawali Petir lahir dari sambaran petir?", "The Thunder Hawk was born from a lightning strike?"]],
        ["bujang", ["Dari petir dan telur yang keras kepala! Gusti Ratu Angin sendiri yang menemukannya, masih basah dan berkilat-kilat. Beliau membesarkannya di istana seperti anak sendiri.", "From lightning and one stubborn egg! The Wind Queen herself found it, still wet and crackling. She raised it in the palace like her own child."]],
        ["bujang", ["Ayo ikut aku ke bukit utara! Dari sana istana kelihatan jelas. Ceritanya lebih seru kalau sambil melihat tempatnya.", "Come with me to the north hill! You can see the palace clearly from there. Stories are better when you can see where they happened."]],
      ] },
      // ke [36, 3]: petak rumput terbuka di bukit utara Lembah Angin (baris 2-4 di x 36 kosong), 9 petak dari Bujang (30, 10)
      { tipe: "pandu", npc: "bujang", area: "lembahAngin", ke: [36, 3], tujuan: ["Ikuti Bujang ke bukit utara Lembah Angin", "Follow Bujang to the Wind Valley's north hill"],
        ajak: ["Ke bukit utara! Pegang topimu... oh, kau tidak pakai topi. Pegang rambutmu, kalau begitu!", "To the north hill! Hold onto your hat... oh, you're not wearing one. Hold onto your hair, then!"], baris: [
        ["bujang", ["Nah, lihat! Istana Awan. Sekarang disinari matahari, tidak lagi dikurung badai. Rajawalinya kadang berputar di atas menara. Lihat, itu dia!", "There, look! The Cloud Palace. Sunlit now, not trapped in a storm anymore. The hawk circles its towers sometimes. Look, there it is!"]],
        ["bujang", ["Nenek dari nenekku bilang, dulu tiap pagi rajawali itu terbang mengelilingi lembah sambil bernyanyi. Suaranya seperti lonceng angin. Petani menandai pagi dengan nyanyiannya.", "Grandmother's grandmother said that every morning the hawk flew around the valley singing. Its voice was like wind chimes. Farmers marked the morning by its song."]],
        ["bujang", ["Lalu suatu hari datang para resi dari bawah, membawa sebuah pusaka. Gusti Ratu menerimanya. Tak lama kemudian, angin mulai berbau aneh. Dingin. Seperti dari gua yang sangat dalam.", "Then one day sages came up from below, carrying an heirloom. The queen accepted it. Not long after, the wind began to smell strange. Cold. Like air from a very deep cave."]],
        ["bujang", ["Lalu istananya miring, badai datang, dan tak ada yang pernah melihat Gusti Ratu lagi. Itu yang kami tahu. Sisanya selalu jadi pertanyaan di keluargaku.", "Then the palace tilted, the storm came, and no one ever saw the queen again. That's all we know. The rest has always been a question in my family."]],
        ["hero", ["Mungkin jawabannya ada di balairung, tempat rajawali itu menjaga pusaka.", "Maybe the answer is in the throne hall, where the hawk guarded the heirloom."]],
        ["bujang", ["Itu yang mau kuminta! Tapi roh angin masih liar di lembah, layanganku putus terus. Tolong tenangkan beberapa dulu, ya? Lalu periksa balairung itu.", "That's just what I wanted to ask! But the wind spirits are still wild in the valley, and my kites keep snapping. Calm a few for me first? Then check that throne hall."]],
      ] },
      { tipe: "kalahkan", monster: "rohAngin", need: 6, area: "lembahAngin", tujuan: ["Tenangkan 6 Roh Angin di Lembah Angin", "Calm 6 Wind Spirits in the Wind Valley"], baris: [
        ["narasi", ["Roh angin terakhir buyar menjadi semilir sejuk. Di belakangmu, layang-layang rajawali Bujang naik tinggi tanpa tersendat.", "The last wind spirit scatters into a cool breeze. Behind you, Bujang's hawk kite climbs high without a stutter."]],
      ] },
      { tipe: "prasasti", area: "istanaAwan", dekat: "bos", tujuan: ["Cari tulisan Ratu Angin di balairung Istana Awan", "Find the Wind Queen's writing in the Cloud Palace throne hall"], baris: [
        ["narasi", ["Di lantai balairung, di bawah tempat Rajawali Petir biasa bertengger, ada lempeng marmer yang tertutup bulu rontok. Tulisannya halus, seperti ditiup, bukan dipahat.", "On the throne hall floor, beneath the Thunder Hawk's perch, is a marble slab covered in shed feathers. The writing is delicate, as if blown rather than carved."]],
        ["narasi", ["'Aku Ratu Angin. Para resi menitipkan pecahan segel padaku, dan aku menerimanya dengan bangga. Aku tidak tahu bayangan raja itu bisa merembes keluar walau terkunci.'", "'I am the Wind Queen. The sages entrusted a seal shard to me, and I accepted it with pride. I did not know that king's shadow could seep out even while locked away.'"]],
        ["narasi", ["'Ia membisiki rajawaliku. Ia membisiki dayang-dayangku. Maka kuikat bayangan itu dengan seluruh anginku. Istana ini akan miring, dan aku akan menjadi angin biasa.'", "'It whispers to my hawk. It whispers to my handmaidens. So I bind that shadow with all my wind. This palace will tilt, and I will become an ordinary wind.'"]],
        ["narasi", ["'Rajawaliku, anakku yang lahir dari petir: jagalah pusaka ini sampai orang yang tepat datang. Bila kau lupa siapa dirimu, semoga ada yang cukup sabar untuk mengingatkanmu.'", "'My hawk, my child born of lightning: guard this heirloom until the right one comes. Should you forget who you are, may someone be patient enough to remind you.'"]],
        ["hero", ["Ratu Angin tidak menghilang begitu saja. Ia mengorbankan dirinya menjadi angin, untuk mengikat bayangan Kalamurka.", "The Wind Queen didn't simply vanish. She sacrificed herself to become the wind, to bind Kalamurka's shadow."]],
        ["narasi", ["Sehelai bulu putih keemasan melayang turun dari langit-langit, berputar pelan, lalu jatuh tepat di telapak tanganmu.", "A white-gold feather drifts down from the ceiling, turning slowly, and lands right in your palm."]],
      ] },
      { tipe: "bicara", npc: "bujang", tujuan: ["Ceritakan pesan Ratu Angin kepada Bujang", "Tell Bujang the Wind Queen's message"], baris: [
        ["hero", ["Bujang, Gusti Ratu Angin meninggalkan pesan. Ia memakai seluruh anginnya untuk mengikat bayangan dari pusaka itu. Istananya miring karena itu. Ia sendiri menjadi angin biasa.", "Bujang, the Wind Queen left a message. She used all her wind to bind the shadow in that heirloom. That's why the palace tilted. She herself became an ordinary wind."]],
        ["bujang", ["Menjadi angin... Jadi selama ini, setiap kali aku menerbangkan layangan...", "Became the wind... So all this time, whenever I flew a kite..."]],
        ["bujang", ["...beliau yang mengangkatnya. Wah. Wah! Aku harus duduk sebentar.", "...she was the one lifting it. Wow. Wow! I need to sit down for a second."]],
        ["bujang", ["Keluargaku selalu bilang angin di lembah ini aneh. Kencang, tapi tidak pernah menjatuhkan anak kecil ke jurang. Kukira itu cuma keberuntungan.", "My family always said the wind in this valley was odd. Strong, but it never blew a child off a cliff. I thought it was just luck."]],
        ["hero", ["Bulu ini jatuh di balairung. Kurasa lebih pantas jadi milikmu.", "This feather fell in the throne hall. I think it belongs with you."]],
        ["bujang", ["Bulu rajawali asli?! Akan kupasang di kepala layanganku yang paling besar. Biar Gusti Ratu tahu, ada yang masih ingat. Ini, ambil hadiahku! Jangan ditolak, nanti anginnya tersinggung.", "A real hawk feather?! I'll put it on the head of my biggest kite. So the queen knows someone still remembers. Here, take my gift! Don't refuse it, or the wind will be offended."]],
      ] },
    ],
  },
  // ===================== PENJAGA MENARA =====================
  {
    id: "penjagaMenara", npc: "lintang", monster: "penjagaMenara",
    judul: ["Tombak yang Menunjuk Api", "The Spear That Pointed to the Fire"],
    syarat: () => S.bos && S.bos.penjagaMenara,
    hadiah: { gold: 2800, exp: 14000, serpih: 7 },
    ringkas: ["Penjaga Menara adalah Arya Seta, panglima paling setia Prabu Kalamurka dan pengasuh Putri Sekar. Sebelum kutukan turun, ia diam-diam memerintahkan pasukannya menjaga sang putri apa pun perintah Prabu, satu-satunya pembangkangannya. Terikat sumpah untuk tidak membiarkan siapa pun naik menara, ia tetap menemukan celah untuk berbelas kasihan: ia menunjukkan jalan ke api unggun kepada kakek Lintang yang tersesat.", "The Tower Warden is Arya Seta, King Kalamurka's most loyal commander and Princess Sekar's guardian. Before the curse fell, he secretly ordered his troops to protect the princess whatever the king commanded, his one act of defiance. Bound by oath to let no one climb the tower, he still found a gap for mercy: he pointed Lintang's lost grandfather to the campfire."],
    langkah: [
      { tipe: "bicara", npc: "lintang", tujuan: ["Dengarkan cerita Lintang tentang kakeknya", "Hear Lintang's story about her grandfather"], baris: [
        ["lintang", ["Kak! Kak! Sini dulu. Aku tidak jualan kali ini. Sungguh. Ini soal kakekku dan Penjaga Menara.", "Hey! Hey! Over here. I'm not selling anything this time. Really. This is about my grandpa and the Tower Warden."]],
        ["lintang", ["Kau ingat aku bilang kakekku tersesat ke sini waktu mencari kayu bakar? Ada bagian yang tidak pernah kuceritakan, karena tak ada yang percaya.", "Remember I said my grandpa got lost here looking for firewood? There's a part I never told, because nobody believed it."]],
        ["lintang", ["Waktu Kakek pertama sampai di Negeri Bayang, ia tidak muncul di perkemahan. Ia muncul di kaki Menara Kala, di tengah prajurit bayang.", "When Grandpa first arrived in the Shadow Realm, he didn't show up at the camp. He showed up at the foot of the Kala Tower, right among the shadow soldiers."]],
        ["lintang", ["Kakek bilang, sesosok raksasa berzirah hitam turun dari menara. Kakek pikir habislah dia. Tapi raksasa itu cuma mengangkat tombaknya dan menunjuk ke selatan, ke arah sebuah cahaya kecil.", "Grandpa said a giant in black armor came down from the tower. He thought he was done for. But the giant just raised its spear and pointed south, toward a tiny light."]],
        ["hero", ["Ke api unggun Ki Cahya.", "To Ki Cahya's campfire."]],
        ["lintang", ["Persis! Lalu raksasa itu naik lagi dan tidak menoleh. Kakek menyimpan sesuatu dari malam itu. Ikut aku ke jalan utara, kutunjukkan tempat Kakek pertama kali melihat api.", "Exactly! Then the giant went back up without looking back. Grandpa kept something from that night. Come with me to the north road, I'll show you where Grandpa first saw the fire."]],
      ], tanya: [
        { tanya: ["Kenapa tidak ada yang percaya?", "Why didn't anyone believe it?"], jawab: [
          ["lintang", ["Karena semua orang di sini tahu Penjaga Menara tidak pernah membiarkan siapa pun lewat. Dan karena Kakek juga mengaku pernah melihat ikan terbang. Itu tidak membantu.", "Because everyone here knows the Tower Warden never let anyone through. And because Grandpa also claimed he once saw a flying fish. That didn't help."]],
        ] },
      ] },
      // ke [16, 7]: petak PATH jalan utara perkemahan (x 15-17, y 0-9) menuju Padang Bayang, 9 petak dari Lintang (21, 15)
      { tipe: "pandu", npc: "lintang", area: "perkemahan", ke: [16, 7], tujuan: ["Ikuti Lintang ke jalan utara perkemahan", "Follow Lintang to the camp's north road"],
        ajak: ["Ayo! Lewat sini, hati-hati jangan sampai menginjak dagangan... eh, maksudku, abu.", "Come on! This way, careful not to step on the merchandise... er, I mean, the ash."], baris: [
        ["lintang", ["Di sinilah. Kakek bilang, ia jatuh berlutut di sini dan melihat api Ki Cahya untuk pertama kalinya. Ia menangis. Katanya karena asap. Semua orang di keluargaku bilang begitu kalau menangis.", "Right here. Grandpa said he fell to his knees here and saw Ki Cahya's fire for the first time. He cried. Said it was the smoke. Everyone in my family says that when they cry."]],
        ["lintang", ["Ini yang Kakek simpan. Rumbai putih dari ujung tombak. Tersangkut di bajunya waktu raksasa itu menunjuk. Kakek menyimpannya sampai akhir hayatnya.", "This is what Grandpa kept. A white tassel from a spear tip. It snagged on his shirt when the giant pointed. He kept it until the day he died."]],
        ["lintang", ["Waktu Kakak membawa pulang Tombak Cahaya, aku melihat ujungnya. Ada bekas ikatan rumbai yang sudah lama putus. Warnanya sama, Kak.", "When you brought the Spear of Light back, I looked at its tip. There's the mark of a tassel tie that snapped long ago. Same color."]],
        ["hero", ["Jadi raksasa yang menolong kakekmu... adalah Arya Seta. Penjaga Menara.", "So the giant who saved your grandpa... was Arya Seta. The Tower Warden."]],
        ["lintang", ["Panglima Kalamurka yang paling setia, menolong orang asing? Aku tidak mengerti. Prajurit bayang masih berkeliaran di kaki menara. Bisakah Kakak naik dan mencari tahu? Pasti ada jawabannya di tempat ia berjaga.", "Kalamurka's most loyal commander, helping a stranger? I don't get it. Shadow soldiers still roam the foot of the tower. Could you go up and find out? The answer must be where he stood guard."]],
      ] },
      { tipe: "kalahkan", monster: "prajuritBayang", need: 5, area: "menaraKala", tujuan: ["Kalahkan 5 Prajurit Bayang di kaki Menara Kala", "Defeat 5 Shadow Soldiers at the foot of the Kala Tower"], baris: [
        ["narasi", ["Prajurit terakhir runtuh. Zirah kosongnya berdenting, dan di lencananya kau melihat ukiran kecil: 'Jaga Putri Sekar, apa pun perintah Prabu.' Sama seperti lencana yang dulu kau temukan.", "The last soldier collapses. Its empty armor clatters, and on its badge you see a small engraving: 'Protect Princess Sekar, whatever the king commands.' Just like the badge you found before."]],
      ] },
      { tipe: "prasasti", area: "menaraKala", dekat: "bos", tujuan: ["Cari tanda Arya Seta di lantai atas Menara Kala", "Find Arya Seta's mark on the Kala Tower's top floor"], baris: [
        ["narasi", ["Di dekat pintu perunggu yang dulu dijaga Penjaga Menara, berdiri sebuah tiang batu. Ribuan goresan kecil memenuhinya, berjajar rapi seperti hitungan hari.", "Near the bronze door the Tower Warden once guarded stands a stone pillar. Thousands of small scratches cover it, in neat rows like a count of days."]],
        ["narasi", ["Di bagian bawah tiang, tulisan tangan seorang prajurit: 'Aku Arya Seta. Gusti Prabu memerintahkanku menjaga pintu ini dan tidak membiarkan siapa pun naik. Aku bersumpah.'", "At the base of the pillar, a soldier's handwriting: 'I am Arya Seta. My lord the king ordered me to guard this door and let no one climb. I swore it.'"]],
        ["narasi", ["'Tetapi sebelum kutukan turun, aku memerintahkan pasukanku sendiri: jaga Putri Sekar, apa pun perintah Prabu. Itu satu-satunya kali aku membangkang.'", "'But before the curse fell, I gave my own troops an order: protect Princess Sekar, whatever the king commands. It was the only time I ever disobeyed.'"]],
        ["narasi", ["Tulisan yang lebih baru, lebih goyah: 'Malam ini seorang lelaki tua tersesat di kaki menara. Sumpahku: jangan biarkan siapa pun naik. Ia tidak naik. Jadi aku boleh menunjukkan jalan turun. Semoga Gusti Putri tidak tahu aku mencari celah dalam sumpahku.'", "A newer line, shakier: 'Tonight an old man wandered lost at the tower's foot. My oath: let no one climb. He did not climb. So I may show him the way down. May the princess never learn I searched for a gap in my oath.'"]],
        ["hero", ["Ia mencari celah dalam sumpahnya sendiri... supaya bisa menolong.", "He looked for a gap in his own oath... so he could help."]],
      ] },
      { tipe: "bicara", npc: "lintang", tujuan: ["Ceritakan tulisan Arya Seta kepada Lintang", "Tell Lintang what Arya Seta wrote"], baris: [
        ["hero", ["Lintang, Arya Seta menulis tentang kakekmu di tiang menara. Ia bersumpah tak membiarkan siapa pun naik. Kakekmu tidak naik, jadi ia merasa boleh menunjukkan jalan turun.", "Lintang, Arya Seta wrote about your grandpa on the tower pillar. He'd sworn to let no one climb. Your grandpa didn't climb, so he felt free to show him the way down."]],
        ["lintang", ["Hah! Panglima paling setia, mencari celah dalam sumpahnya sendiri? Kak, itu... itu cara berpikir pedagang!", "Hah! The most loyal commander, finding a loophole in his own oath? That's... that's how a merchant thinks!"]],
        ["lintang", ["Maaf. Maksudku... itu indah. Ia tidak bisa berhenti setia, tapi ia juga tidak bisa berhenti baik. Jadi ia mencari jalan di tengah-tengahnya.", "Sorry. I mean... that's beautiful. He couldn't stop being loyal, but he couldn't stop being kind either. So he found a path in between."]],
        ["lintang", ["Kalau tidak ada dia, Kakek tidak sampai ke api. Ayahku tidak lahir di sini. Aku tidak lahir. Tidak ada pedagang paling berbakat di Negeri Bayang.", "Without him, Grandpa never reaches the fire. My father isn't born here. I'm not born. No most-talented merchant in the Shadow Realm."]],
        ["lintang", ["Rumbai ini akan kuikatkan lagi di ujung Tombak Cahaya, kalau Kakak izinkan. Biar Paman Arya Seta tahu, utangnya sudah lunas. Dan utang kami juga.", "I'll tie this tassel back on the Spear of Light's tip, if you'll let me. So Uncle Arya Seta knows his debt is paid. And ours too."]],
        ["lintang", ["Ini hadiahnya. Gratis! ...Jangan pasang wajah kaget begitu, Kak. Sekali-sekali aku juga bisa tidak berdagang.", "Here's your reward. Free! ...Don't look so shocked. Once in a while even I can stop trading."]],
      ] },
    ],
  },
  // ===================== PRABU KALAMURKA =====================
  {
    id: "kalamurka", npc: "cahya", monster: "kalamurka",
    judul: ["Taman Melati", "The Jasmine Garden"],
    syarat: () => S.bos && S.bos.kalamurka,
    hadiah: { gold: 4000, exp: 20000, serpih: 8 },
    ringkas: ["Prabu Kalamurka dulunya pangeran yang menyaksikan kotanya hampir jatuh dikepung musuh, dan ayahnya gugur di tembok kota. Ia bersumpah tak ada yang boleh merebut apa pun darinya lagi. Ia raja yang dicintai dan ayah yang menanam taman melati untuk putrinya, tempat yang kini menjadi Perkemahan Cahaya. Rasa takut kehilangan membuatnya menikam Naga Kencana demi mustika. Di batu segel, ia akhirnya meminta maaf kepada sang naga dan kepada sahabatnya Wirabumi, dan kini tidur bersama Sekar.", "King Kalamurka was once a prince who watched his city nearly fall to siege, his father killed on the walls. He swore no one would ever take anything from him again. He was a beloved king and a father who planted a jasmine garden for his daughter, the place that is now the Camp of Light. Fear of loss drove him to stab Naga Kencana for its gem. On the seal stone he finally apologized to the dragon and to his friend Wirabumi, and now sleeps beside Sekar."],
    langkah: [
      { tipe: "bicara", npc: "cahya", tujuan: ["Dengarkan Ki Cahya tentang Prabu Kalamurka", "Hear Ki Cahya's tale of King Kalamurka"], baris: [
        ["cahya", ["Duduklah dekat api, Nak. Malam ini aku ingin bercerita tentang Prabu Kalamurka. Bukan raja yang kau lawan. Yang sebelum itu.", "Sit by the fire, child. Tonight I want to tell you about King Kalamurka. Not the king you fought. The one who came before."]],
        ["cahya", ["Selama ratusan tahun, Sekar sering duduk di sini bersamaku. Kadang ia diam semalaman. Kadang ia bercerita tentang ayahnya. Aku mendengar semuanya, dan menyimpannya.", "For centuries, Sekar often sat here with me. Some nights she said nothing at all. Some nights she spoke of her father. I listened to all of it, and kept it."]],
        ["cahya", ["Waktu Kalamurka masih kecil, kotanya hampir jatuh. Musuh mengepung, lumbung kosong, dan ayahnya, raja yang lama, gugur di tembok kota. Pangeran kecil itu melihat semuanya.", "When Kalamurka was a boy, his city nearly fell. Enemies laid siege, the granaries were empty, and his father, the old king, died on the city walls. The little prince saw it all."]],
        ["cahya", ["Kota itu selamat, tapi anak itu tidak pernah benar-benar keluar dari pengepungan. Ia bersumpah: tak ada yang boleh merebut apa pun darinya lagi. Tidak kotanya, tidak rakyatnya, tidak keluarganya.", "The city survived, but the boy never truly left that siege. He swore no one would ever take anything from him again. Not his city, not his people, not his family."]],
        ["hero", ["Sekar bilang, ayahnya menikam naga karena takut. Bukan karena benci.", "Sekar said her father stabbed the dragon out of fear. Not hatred."]],
        ["cahya", ["Ya. Dan sebelum rasa takut itu menelannya, ia raja yang baik. Ikut aku. Ada yang ingin kutunjukkan, di samping api ini.", "Yes. And before that fear swallowed him, he was a good king. Come. There's something I want to show you, beside this fire."]],
      ], tanya: [
        { tanya: ["Ki, siapa sebenarnya Ki Cahya?", "Ki, who are you really?"], jawab: [
          ["cahya", ["Hanya orang tua yang dulu tersesat dan diberi sebutir bara oleh seorang gadis tanpa bayangan. Sisanya tidak penting, Nak. Api ini lebih penting daripada namaku.", "Just an old man who once got lost and was handed an ember by a girl with no shadow. The rest doesn't matter, child. This fire matters more than my name."]],
        ] },
      ] },
      // ke [18, 14]: petak abu/rumput terbuka di sisi timur api unggun (unggun di 16.5, 13), 5-6 petak dari Ki Cahya (14, 10)
      { tipe: "pandu", npc: "cahya", area: "perkemahan", ke: [18, 14], tujuan: ["Ikuti Ki Cahya ke sisi api unggun", "Follow Ki Cahya to the side of the campfire"],
        ajak: ["Hanya beberapa langkah. Tapi langkah orang tua itu mahal, jadi jangan dibuang-buang.", "Just a few steps. But an old man's steps are precious, so don't waste them."], baris: [
        ["cahya", ["Lihat melati ini. Tumbuh pagi setelah fajar pertama. Kau tahu, tempat perkemahan ini dulu apa?", "Look at this jasmine. It sprouted the morning after the first dawn. Do you know what this camp used to be?"]],
        ["cahya", ["Taman melati istana. Kalamurka sendiri yang menanamnya waktu Sekar lahir. Setiap pagi ia memetik sekuntum dan menyelipkannya di rambut putrinya, sebelum menghadap para menteri.", "The palace jasmine garden. Kalamurka planted it himself when Sekar was born. Every morning he picked one blossom and tucked it into his daughter's hair, before facing his ministers."]],
        ["cahya", ["Sekar bilang, itu satu-satunya saat ayahnya tertawa lepas. Seorang raja yang takut kehilangan segalanya, tertawa karena sekuntum bunga.", "Sekar said it was the only time her father laughed freely. A king afraid of losing everything, laughing over a single flower."]],
        ["hero", ["Mbah Juru juga pernah bilang begitu. Iblis itu dulu pernah tertawa karena melati.", "Mbah Juru said something like that too. That demon once laughed because of a jasmine flower."]],
        ["cahya", ["Lalu datang kabar tentang mustika di jantung naga. Mustika yang konon membuat pemiliknya tak terkalahkan. Bagi orang yang ketakutan, itu bukan godaan, Nak. Itu janji keselamatan.", "Then came word of the gem in the dragon's heart. A gem said to make its owner invincible. To a frightened man, that's not temptation, child. It's a promise of safety."]],
        ["cahya", ["Kota Mati masih menyimpan abdi istana yang belum pulang. Bebaskan mereka. Lalu pergilah ke Singgasana Bayang dan sentuh batu segel itu. Dulu Sekar pernah bilang, ia akan meninggalkan sesuatu untukmu di sana.", "The Dead City still holds palace servants who never went home. Free them. Then go to the Shadow Throne and touch the seal stone. Sekar once told me she would leave something there for you."]],
      ] },
      { tipe: "kalahkan", monster: "lelembut", need: 6, area: "kotaMati", tujuan: ["Bebaskan 6 Lelembut yang masih tertinggal di Kota Mati", "Free 6 Wraiths still lingering in the Dead City"], baris: [
        ["narasi", ["Lelembut terakhir memudar, bukan sambil menjerit, tapi sambil menghela napas panjang. Seperti abdi yang akhirnya boleh pulang setelah tugas yang sangat panjang.", "The last wraith fades, not with a scream but with a long sigh. Like a servant finally allowed home after a very long day's duty."]],
      ] },
      { tipe: "prasasti", area: "singgasana", dekat: "bos", tujuan: ["Sentuh batu segel di Singgasana Bayang", "Touch the seal stone at the Shadow Throne"], baris: [
        ["narasi", ["Batu putih di tengah balairung terasa hangat, seperti tungku yang baru padam. Di permukaannya ada dua tulisan yang tidak ada sebelumnya, seolah terukir dari dalam batu.", "The white stone at the center of the hall is warm, like a hearth just gone out. On its surface are two inscriptions that weren't there before, as if written from inside the stone."]],
        ["narasi", ["Yang pertama, goresannya tegas dan berat: 'Aku Kalamurka. Aku menikam naga yang tidak bersalah karena aku takut. Tidak ada mahkota yang pantas untuk ketakutan semacam itu.'", "The first, in heavy, firm strokes: 'I am Kalamurka. I stabbed an innocent dragon because I was afraid. No crown is worthy of such fear.'"]],
        ["narasi", ["'Bila ada yang membaca ini di dunia terang, sampaikan pada naga di atas awan: maafkan aku. Dan pada sahabatku Wirabumi, di mana pun ia beristirahat: kau benar.'", "'If anyone reads this in the world of light, tell the dragon above the clouds: forgive me. And tell my friend Wirabumi, wherever he rests: you were right.'"]],
        ["narasi", ["Yang kedua, goresannya halus, dengan sekuntum melati kecil di ujungnya: 'Ayah tidur nyenyak sekarang. Aku juga. Jangan khawatir, Kawan. Bilang pada Lintang, mataharinya sudah kau bawakan.'", "The second, in fine strokes, with a tiny jasmine flower at the end: 'Father sleeps soundly now. So do I. Don't worry, friend. Tell Lintang you brought her the sun after all.'"]],
        ["hero", ["Sekar...", "Sekar..."]],
        ["narasi", ["Tak ada jawaban. Hanya keheningan yang tenang, seperti rumah yang semua penghuninya sudah tertidur pulas.", "No answer. Only a peaceful stillness, like a house where everyone has fallen fast asleep."]],
      ] },
      { tipe: "bicara", npc: "cahya", tujuan: ["Kembali ke Ki Cahya di Perkemahan Cahaya", "Return to Ki Cahya at the Camp of Light"], baris: [
        ["hero", ["Ki, di batu segel ada dua tulisan. Kalamurka meminta maaf pada sang naga dan pada Prabu Wirabumi. Dan Sekar... Sekar bilang ia tidur nyenyak bersama ayahnya.", "Ki, there were two inscriptions on the seal stone. Kalamurka apologized to the dragon and to King Wirabumi. And Sekar... Sekar said she sleeps soundly beside her father."]],
        ["cahya", ["Kalamurka meminta maaf? Lima ratus tahun Sekar menunggu kata itu keluar dari mulut ayahnya. Ternyata yang ia perlukan bukan tombak, melainkan pelukan putrinya sendiri.", "Kalamurka apologized? Five hundred years Sekar waited for that word from her father. In the end it wasn't a spear he needed, but his own daughter's embrace."]],
        ["cahya", ["Dan Sekar tidur nyenyak. Hah... Mata tuaku kena asap lagi, Nak. Api ini memang nakal.", "And Sekar sleeps soundly. Hah... The smoke's in my old eyes again, child. This fire is a mischievous one."]],
        ["cahya", ["Kau tahu pelajaran terbesar dari Kalamurka? Rasa takut yang digenggam terlalu erat akan menghancurkan apa yang ingin dilindunginya. Sekar melepaskan genggamannya. Itulah sebabnya ia menang.", "Do you know the greatest lesson of Kalamurka? Fear held too tightly destroys the very thing it means to protect. Sekar let go of her grip. That's why she won."]],
        ["lintang", ["Ki! Kak! Melatinya berbunga dua kuntum pagi ini! Boleh aku jual satu? ...Bercanda! Bercanda. Aku akan menyiramnya setiap hari.", "Ki! Hey! The jasmine has two blossoms this morning! Can I sell one? ...Kidding! Kidding. I'll water it every day."]],
        ["cahya", ["Terimalah ini, Nak. Dari api yang tak pernah padam, dan dari gadis yang membawa bara pertamanya. Pulanglah kapan pun kau mau. Melati ini akan selalu menunggumu.", "Take this, child. From the fire that never dies, and from the girl who brought its first ember. Come back whenever you like. This jasmine will always be waiting for you."]],
      ] },
    ],
  },
];
