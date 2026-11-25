// =====================================================================
// KISAH NPC: asal-usul monster & bos, diceritakan sebagai misi sampingan
// berantai oleh tokoh-tokoh cerita utama (mesin: js/99z-kisah-npc.js).
// Satu kisah = beberapa langkah:
//   { tipe: "bicara",   npc, tujuan, baris, tanya? }          bicara dengan NPC
//   { tipe: "pandu",    npc, area, ke: [tx, ty], tujuan, ajak, baris }
//        NPC berjalan memandu ke titik itu (menunggu kalau kau tertinggal), lalu bercerita
//   { tipe: "kalahkan", monster, need, area?, tujuan, baris? }
//   { tipe: "prasasti", area, dekat: "bos" | [tx, ty], tujuan, baris }   temukan & baca prasasti
// baris = [[pembicara, [id, en]], ...]; tanya = pertanyaan opsional (seperti cerita/tanya.js)
// syarat = kapan kisah tersedia; hadiah = { gold, exp, serpih }; ringkas = isi kisah di Ensiklopedia.
// =====================================================================
"use strict";

const KISAH = [
  // ===================== GENDERUWO =====================
  {
    id: "genderuwo", npc: "lurah", monster: "genderuwo",
    judul: ["Tunggul Beringin", "The Banyan Stump"],
    syarat: () => S.bos && S.bos.genderuwo,
    hadiah: { gold: 250, exp: 200, serpih: 3 },
    ringkas: ["Genderuwo dulunya Kerta, penebang kayu yang dituduh mencuri madu desa. Ia lari ke gua membawa rasa malu, dan kabut tua mengubah kesedihannya menjadi wujud raksasa berbulu. Pencuri sebenarnya adalah kakek buyut Ki Lurah.", "The Genderuwo was once Kerta, a woodcutter accused of stealing the village honey. He fled into the cave carrying his shame, and the old mist twisted his grief into a hairy giant. The real thief was Ki Lurah's great-grandfather."],
    langkah: [
      { tipe: "bicara", npc: "lurah", tujuan: ["Dengarkan kisah Ki Lurah tentang Genderuwo", "Hear Ki Lurah's tale of the Genderuwo"], baris: [
        ["lurah", ["Nak, sejak kau mengalahkan Genderuwo itu, aku tidak bisa tidur. Ada cerita yang selama ini kusimpan sendiri.", "Child, since you defeated that Genderuwo, I haven't been able to sleep. There's a story I've kept to myself all these years."]],
        ["lurah", ["Dulu, di tepi desa, berdiri pohon beringin raksasa. Di bawahnya tinggal penebang kayu bernama Kerta. Orangnya pendiam, tapi baik hati.", "Long ago, at the village edge, stood a giant banyan. Beneath it lived a woodcutter named Kerta. A quiet man, but kind."]],
        ["lurah", ["Suatu musim, madu persediaan desa hilang. Semua orang menuduh Kerta, karena dia yang paling miskin dan paling sering ke hutan.", "One season, the village's honey stores vanished. Everyone blamed Kerta, because he was the poorest and went to the forest most."]],
        ["lurah", ["Kerta tidak membela diri. Malam itu juga dia pergi ke gua di utara. Dan dia tidak pernah kembali.", "Kerta didn't defend himself. That very night he went to the cave in the north. And he never returned."]],
        ["hero", ["Jadi Genderuwo itu...", "So the Genderuwo..."]],
        ["lurah", ["Aku tidak tahu pasti. Tapi ikutlah denganku. Akan kutunjukkan tempat beringin itu dulu berdiri.", "I don't know for sure. But come with me. I'll show you where that banyan once stood."]],
      ], tanya: [
        { tanya: ["Kenapa Ki baru cerita sekarang?", "Why tell me only now, Ki?"], jawab: [
          ["lurah", ["Karena aku malu, Nak. Dan karena selama ini kupikir itu cuma dongeng untuk menakuti anak-anak.", "Because I was ashamed, child. And because I always thought it was just a tale to scare children."]],
        ] },
      ] },
      { tipe: "pandu", npc: "lurah", area: "desa", ke: [3, 13], tujuan: ["Ikuti Ki Lurah ke tunggul beringin tua", "Follow Ki Lurah to the old banyan stump"],
        ajak: ["Ayo, ikuti aku. Jangan jauh-jauh, mataku sudah rabun.", "Come, follow me. Don't wander off, my eyes are getting weak."], baris: [
        ["lurah", ["Di sinilah. Lihat tanah yang sedikit menggunung itu? Dulu ada tunggul sebesar pondok di sini.", "Here. See that slight mound of earth? There used to be a stump as big as a hut here."]],
        ["lurah", ["Waktu kecil aku menemukan ukiran di kulit akarnya. Hanya satu kata: 'Kerta'. Dan di bawahnya, gambar sebuah gua.", "As a boy I found a carving in its root bark. Just one word: 'Kerta'. And beneath it, a drawing of a cave."]],
        ["lurah", ["Kalau Kerta meninggalkan pesan, pasti ada di gua itu. Pergilah ke Gua Genderuwo, Nak. Cari tulisannya di dinding.", "If Kerta left a message, it must be in that cave. Go to the Genderuwo Cave, child. Look for writing on the walls."]],
      ] },
      { tipe: "prasasti", area: "gua", dekat: "bos", tujuan: ["Cari tulisan Kerta di Gua Genderuwo", "Find Kerta's writing in the Genderuwo Cave"], baris: [
        ["narasi", ["Di dinding gua, tergores dalam dengan batu tajam, berbaris tulisan tangan yang gemetar.", "On the cave wall, scratched deep with a sharp stone, run rows of trembling handwriting."]],
        ["narasi", ["'Aku tidak mencuri. Madu itu kuambil dari sarang liar di hutan, untuk anakku yang demam. Bukan dari lumbung desa.'", "'I did not steal. I took that honey from a wild hive in the forest, for my feverish child. Not from the village store.'"]],
        ["narasi", ["'Anakku meninggal di musim itu. Tak ada yang mau mendengarku. Jadi aku pergi, supaya marahku tidak melukai siapa pun.'", "'My child died that season. No one would listen. So I left, so my anger would hurt no one.'"]],
        ["narasi", ["'Tapi kabut di gua ini berbisik setiap malam. Ia bilang marahku pantas. Ia bilang aku harus tumbuh besar dan kuat. Aku mulai percaya.'", "'But the mist in this cave whispers every night. It says my anger is just. It says I must grow big and strong. I begin to believe it.'"]],
        ["hero", ["Kerta... kau tidak jahat. Kau hanya ditinggalkan sendirian dengan kesedihanmu.", "Kerta... you weren't evil. You were just left alone with your grief."]],
      ] },
      { tipe: "bicara", npc: "lurah", tujuan: ["Ceritakan pesan Kerta kepada Ki Lurah", "Tell Ki Lurah about Kerta's message"], baris: [
        ["hero", ["Ki, Kerta tidak mencuri. Madu itu dari hutan, untuk anaknya yang sakit.", "Ki, Kerta didn't steal. The honey was from the forest, for his sick child."]],
        ["lurah", ["...Aku sudah menduganya. Nak, ada satu hal lagi. Sebelum meninggal, kakek buyutku mengaku sesuatu pada ayahku.", "...I suspected as much. Child, there's one more thing. Before he died, my great-grandfather confessed something to my father."]],
        ["lurah", ["Dialah yang mengambil madu lumbung, untuk dijual di kota. Dan dialah yang pertama kali menunjuk Kerta.", "He was the one who took the honey from the store, to sell in town. And he was the first to point at Kerta."]],
        ["lurah", ["Keluargaku menyimpan rahasia ini empat generasi. Dan selama itu, seorang ayah yang berduka menjadi monster di dalam gua.", "My family kept this secret for four generations. And all that time, a grieving father became a monster in a cave."]],
        ["lurah", ["Besok aku akan menanam beringin baru di tempat itu, dan memahat nama Kerta di batu penanda. Biar semua orang tahu kebenarannya.", "Tomorrow I'll plant a new banyan in that spot, and carve Kerta's name on a marker stone. So everyone knows the truth."]],
        ["lurah", ["Terimalah ini. Bukan bayaran, tapi terima kasih. Kau membuat seorang lurah tua berani jujur.", "Take this. Not payment, but thanks. You made an old village head brave enough to be honest."]],
      ] },
    ],
  },
  // ===================== DWARAPALA =====================
  {
    id: "dwarapala", npc: "resi", monster: "dwarapala",
    judul: ["Penjaga yang Kesepian", "The Lonely Guardian"],
    syarat: () => S.bos && S.bos.dwarapala,
    hadiah: { gold: 300, exp: 300, serpih: 4 },
    ringkas: ["Dwarapala Candi Wingit dahulu sepasang: Rangga dan Rengga, dipahat dari satu batu dan diberi sebagian jiwa para pemahatnya. Lima ratus tahun lalu seorang raja bermahkota hitam membawa Rengga pergi. Rangga menjaga sendirian sampai kesepiannya, diperkuat kabut, menjadi amarah.", "Wingit Temple's Dwarapala were once a pair: Rangga and Rengga, carved from one stone and given part of their carvers' souls. Five hundred years ago a black-crowned king carried Rengga away. Rangga guarded alone until his loneliness, fed by the mist, became rage."],
    langkah: [
      { tipe: "bicara", npc: "resi", tujuan: ["Tanyakan Resi Wening tentang Dwarapala", "Ask Resi Wening about the Dwarapala"], baris: [
        ["resi", ["Kau masih memikirkan arca raksasa itu, Nak? Aku juga. Kau tahu, dulu mereka berdua.", "Still thinking about that giant statue, child? So am I. You know, there used to be two of them."]],
        ["resi", ["Rangga dan Rengga. Dipahat dari satu bongkah batu yang sama, oleh dua pemahat bersaudara. Mereka menjaga gerbang candi berdampingan.", "Rangga and Rengga. Carved from the same block of stone, by two brother carvers. They guarded the temple gate side by side."]],
        ["resi", ["Para pemahat menitipkan sebagian jiwa mereka ke dalam batu. Karena itu arca-arca itu bisa bergerak, dan bisa... merasa.", "The carvers entrusted part of their souls to the stone. That's why the statues could move, and could... feel."]],
        ["hero", ["Lalu ke mana yang satunya?", "Then where did the other one go?"]],
        ["resi", ["Ada sesuatu yang ingin kutunjukkan padamu. Ikutlah. Ke batu tua di timur desa.", "There's something I want to show you. Come along. To the old stone east of the village."]],
      ] },
      { tipe: "pandu", npc: "resi", area: "desa", ke: [22, 9], tujuan: ["Ikuti Resi Wening ke batu tua", "Follow Resi Wening to the old stone"],
        ajak: ["Pelan-pelan saja. Lutut tua ini tidak secepat pedangmu.", "Slowly now. These old knees aren't as fast as your blade."], baris: [
        ["resi", ["Lihat batu berlumut ini. Petani menemukannya di sawah dua puluh tahun lalu dan memakainya untuk menumbuk padi.", "Look at this mossy stone. A farmer found it in the paddies twenty years ago and used it to pound rice."]],
        ["resi", ["Perhatikan lekuknya. Ini mata. Ini hidung. Ini kepala Rengga, Nak. Atau yang tersisa darinya.", "See its curves. These are eyes. This is a nose. This is Rengga's head, child. Or what remains of it."]],
        ["resi", ["Menurut lontar candi, lima ratus tahun lalu seorang raja datang dan membawa Rengga untuk menjaga istananya sendiri. Raja bermahkota hitam.", "According to the temple scrolls, five hundred years ago a king came and took Rengga to guard his own palace. A king with a black crown."]],
        ["resi", ["Pergilah ke Candi Wingit. Di sana ada prasasti yang menceritakan sisanya. Tapi kera-kera hutan sering mengganggu siapa pun yang mendekat.", "Go to Wingit Temple. There's an inscription that tells the rest. But the forest monkeys often harass anyone who comes near."]],
      ] },
      { tipe: "kalahkan", monster: "kera", need: 6, tujuan: ["Usir 6 Kera Liar yang mengganggu jalan ke candi", "Drive off 6 Wild Monkeys harassing the temple road"] },
      { tipe: "prasasti", area: "candi", dekat: "bos", tujuan: ["Baca prasasti di Candi Wingit", "Read the inscription at Wingit Temple"], baris: [
        ["narasi", ["Prasasti batu itu setengah terkubur. Hurufnya kuno, tapi entah bagaimana kau bisa membacanya.", "The stone inscription is half-buried. The letters are ancient, yet somehow you can read them."]],
        ["narasi", ["'Dua bersaudara menjaga satu pintu. Bila satu pergi, yang lain menunggu, sampai batu menjadi debu.'", "'Two brothers guard one door. If one departs, the other waits, until stone becomes dust.'"]],
        ["narasi", ["Di bawahnya, goresan yang lebih baru dan kasar, seperti dibuat dengan jari batu raksasa: 'Rengga. Pulang.'", "Beneath it, a newer, rougher scratch, as if made by a giant stone finger: 'Rengga. Come home.'"]],
        ["hero", ["Lima ratus tahun... dia menunggu saudaranya pulang selama lima ratus tahun.", "Five hundred years... he waited for his brother to come home for five hundred years."]],
      ] },
      { tipe: "bicara", npc: "resi", tujuan: ["Kembali ke Resi Wening", "Return to Resi Wening"], baris: [
        ["hero", ["'Rengga, pulang.' Itu yang dia tulis, Resi.", "'Rengga, come home.' That's what he wrote, Resi."]],
        ["resi", ["...Kesepian adalah luka yang paling disukai kabut. Ia masuk lewat celah itu, dan membesarkannya menjadi amarah.", "...Loneliness is the wound the mist loves most. It slips in through that crack, and swells it into rage."]],
        ["resi", ["Aku akan meminta Ki Lurah mengirim gerobak. Kepala Rengga harus kembali ke samping saudaranya. Mungkin dengan begitu, Rangga bisa beristirahat.", "I'll ask Ki Lurah to send a cart. Rengga's head must return to his brother's side. Perhaps then Rangga can rest."]],
        ["resi", ["Dan raja bermahkota hitam itu... ingat ciri-cirinya, Nak. Perasaanku mengatakan, kita belum selesai dengannya.", "And that black-crowned king... remember him, child. Something tells me we're not done with him."]],
      ] },
    ],
  },
  // ===================== BUAYA PUTIH =====================
  {
    id: "buayaPutih", npc: "tirto", monster: "buayaPutih",
    judul: ["Kyai Putih dari Danau Bening", "Kyai Putih of the Clear Lake"],
    syarat: () => S.bos && S.bos.buayaPutih,
    hadiah: { gold: 350, exp: 400, serpih: 4 },
    ringkas: ["Buaya Putih dahulu dihormati sebagai Kyai Putih, penjaga danau bening yang kini menjadi Rawa Kabut. Ketika hutan di hulu ditebang dan sampah dibuang ke airnya, danau itu mati pelan-pelan. Rasa dikhianati, ditambah kabut, mengubah sang penjaga menjadi pemangsa.", "The White Crocodile was once revered as Kyai Putih, guardian of the clear lake that is now the Misty Swamp. When the upstream forest was cut and waste dumped into its waters, the lake slowly died. Betrayal, fed by the mist, turned the guardian into a predator."],
    langkah: [
      { tipe: "bicara", npc: "tirto", tujuan: ["Dengarkan cerita Mbah Tirto", "Listen to Mbah Tirto's story"], baris: [
        ["tirto", ["Kau mengalahkan Buaya Putih, Nak. Aku senang kau selamat. Tapi jujur, hatiku juga sedih.", "You beat the White Crocodile, child. I'm glad you're safe. But honestly, my heart is sad too."]],
        ["tirto", ["Waktu aku kecil, kami memanggilnya Kyai Putih. Setiap panen, kami menghanyutkan bunga dan nasi kuning untuknya.", "When I was little, we called him Kyai Putih. Every harvest we floated flowers and yellow rice for him."]],
        ["tirto", ["Dia tidak pernah memangsa orang. Malah, anak-anak yang tenggelam sering ditemukan di tepi, selamat, dengan bekas gigi lembut di bajunya.", "He never preyed on people. In fact, drowning children were often found safe on the shore, with gentle tooth marks on their clothes."]],
        ["hero", ["Lalu apa yang berubah?", "Then what changed?"]],
        ["tirto", ["Kami yang berubah. Ayo, ikut aku ke dermaga tua. Akan kutunjukkan.", "We changed. Come, follow me to the old pier. I'll show you."]],
      ] },
      { tipe: "pandu", npc: "tirto", area: "rawa", ke: [12, 12], tujuan: ["Ikuti Mbah Tirto ke dermaga tua", "Follow Mbah Tirto to the old pier"],
        ajak: ["Ikuti jejakku. Lumpur di sini suka menelan sandal.", "Follow my steps. The mud here loves to swallow sandals."], baris: [
        ["tirto", ["Di sinilah dulu dermaga desa. Airnya sebening kaca. Kami bisa melihat Kyai Putih berenang di dasar, putih seperti bulan.", "This was the village pier. The water was clear as glass. We could see Kyai Putih swimming at the bottom, white as the moon."]],
        ["tirto", ["Lalu juragan kayu datang dan menebang hutan di hulu. Tanahnya longsor ke danau. Pabrik nila membuang sisa pewarnanya ke sini.", "Then the timber merchants came and cut the forest upstream. The soil slid into the lake. The indigo works dumped their leftover dye here."]],
        ["tirto", ["Danau berubah keruh, ikan-ikan mati. Kyai Putih menghilang. Bertahun-tahun kemudian, dia muncul lagi... dan tidak lagi mengenali kami.", "The lake turned murky, the fish died. Kyai Putih vanished. Years later he came back... and no longer knew us."]],
        ["tirto", ["Hantu kabut berkumpul di sini sejak dia kalah. Mereka memakan sisa amarahnya. Usirlah mereka, Nak, biar air ini bisa tenang.", "Mist ghosts have gathered here since he fell. They feed on the remains of his rage. Drive them off, child, so these waters can rest."]],
      ] },
      { tipe: "kalahkan", monster: "hantuKabut", need: 5, tujuan: ["Usir 5 Hantu Kabut dari Rawa Kabut", "Drive 5 Mist Ghosts from the Misty Swamp"] },
      { tipe: "prasasti", area: "rawa", dekat: "bos", tujuan: ["Cari batu sesaji di sarang Buaya Putih", "Find the offering stone at the White Crocodile's lair"], baris: [
        ["narasi", ["Di antara akar bakau, sebuah batu sesaji tua tertutup lumut. Tulisannya masih terbaca.", "Among the mangrove roots, an old offering stone lies covered in moss. Its writing is still legible."]],
        ["narasi", ["'Jaga airnya, maka air menjagamu. Ini janji antara warga danau dan Kyai Putih, disaksikan bulan purnama.'", "'Guard the water, and the water guards you. This is the pact between the lake folk and Kyai Putih, witnessed by the full moon.'"]],
        ["narasi", ["Di atas batu, tergeletak sisik putih sebesar telapak tangan. Masih hangat.", "On the stone lies a white scale the size of a palm. Still warm."]],
      ] },
      { tipe: "bicara", npc: "tirto", tujuan: ["Bawa sisik putih kepada Mbah Tirto", "Bring the white scale to Mbah Tirto"], baris: [
        ["tirto", ["Sisik Kyai Putih... dan batu janji itu masih ada. Kami yang lupa, bukan dia.", "Kyai Putih's scale... and the pact stone still stands. We were the ones who forgot, not him."]],
        ["tirto", ["Mulai musim depan, aku akan menanam pohon di hulu. Satu pohon tiap minggu, sampai lututku menyerah. Mungkin seratus tahun lagi danau ini bening kembali.", "Starting next season, I'll plant trees upstream. One tree each week, until my knees give out. Maybe in a hundred years this lake will be clear again."]],
        ["tirto", ["Simpan sisik itu, atau biarkan aku menghanyutkannya bersama bunga, seperti dulu. Ya, biar aku saja. Kyai Putih pantas pulang ke air.", "Keep the scale, or let me float it away with flowers, like before. Yes, let me. Kyai Putih deserves to return to the water."]],
        ["tirto", ["Terima kasih, Nak. Kau mengalahkannya, tapi kau juga mengembalikan namanya.", "Thank you, child. You defeated him, but you also gave him back his name."]],
      ] },
    ],
  },
];
