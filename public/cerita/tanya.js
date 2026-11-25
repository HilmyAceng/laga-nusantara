// =====================================================================
// PERTANYAAN TAMBAHAN DALAM PERCAKAPAN CERITA (dipakai js/99y-percakapan.js)
// Setelah dialog cerita selesai, pemain boleh bertanya lebih jauh sebelum lanjut.
// Pertanyaan bersifat opsional: pemain yang ingin langsung bertualang tinggal pilih "Lanjut".
// Kunci: "b<bab>e<episode>:<id NPC>" (sama seperti langkah cerita tipe "bicara").
// Bentuk: [{ tanya: [id, en], jawab: [[pembicara, [id, en]], ...] }, ...]
// =====================================================================
"use strict";

const TANYA_CERITA = {
  // ===================== BAB 1 =====================
  "b1e1:lurah": [
    { tanya: ["Desa ini... sudah berapa lama Ki memimpinnya?", "How long have you led this village, Ki?"], jawab: [
      ["lurah", ["Dua puluh tiga tahun, Nak. Dulu aku cuma tukang kayu. Lalu lurah lama jatuh dari pohon kelapa, dan semua orang menunjukku.", "Twenty-three years, child. I used to be a carpenter. Then the old head fell from a coconut tree, and everyone pointed at me."]],
      ["lurah", ["Katanya karena suaraku paling keras. Ternyata memimpin itu bukan soal suara keras, tapi soal telinga yang mau mendengar.", "They said it was because my voice was the loudest. Turns out leading isn't about a loud voice, but about ears willing to listen."]],
    ] },
    { tanya: ["Apa ada cerita lama tentang Gunung Geni?", "Are there old tales about Mount Geni?"], jawab: [
      ["lurah", ["Nenekku dulu bilang, gunung itu tidak boleh ditunjuk dengan jari. Nanti gunungnya tersinggung. Kami anak-anak menertawakannya.", "My grandmother said you must never point at that mountain. It'd be offended. We kids laughed at her."]],
      ["lurah", ["Sekarang aku tidak tertawa lagi. Resi Wening mungkin tahu lebih banyak. Dia sering memandangi gunung itu seperti membaca surat.", "Now I don't laugh anymore. Resi Wening might know more. He stares at that mountain like he's reading a letter."]],
    ] },
  ],
  "b1e1:dagang": [
    { tanya: ["Jamu apa yang paling Mbok banggakan?", "Which jamu are you proudest of, Mbok?"], jawab: [
      ["dagang", ["Beras kencur resep ibuku! Dulu waktu kemarau panjang, satu desa batuk semua. Ibuku menyembuhkan mereka satu per satu.", "My mother's rice-kencur recipe! During a long drought, the whole village was coughing. Mother cured them one by one."]],
      ["dagang", ["Rahasianya? Diaduk sambil bersenandung. Kau tertawa? Coba saja sendiri, rasanya beda!", "The secret? Stir it while humming. You laugh? Try it yourself, it tastes different!"]],
    ] },
    { tanya: ["Mbok kenal pertapa itu?", "Do you know that hermit?"], jawab: [
      ["dagang", ["Resi Wening? Semua orang kenal, tapi tak ada yang benar-benar tahu dia. Datang ke desa cuma kalau ada hal penting.", "Resi Wening? Everyone knows him, but nobody really knows him. He only comes to the village when something important happens."]],
      ["dagang", ["Terakhir kali dia turun gunung, aku masih gadis. Waktu itu... ah, sudahlah. Pokoknya kalau dia datang, berarti ada yang tidak beres.", "Last time he came down the mountain, I was still a girl. Back then... ah, never mind. When he shows up, something's wrong."]],
    ] },
  ],
  "b1e2:resi": [
    { tanya: ["Apa sebenarnya Mustika Bumi itu?", "What exactly is the Earth Gem?"], jawab: [
      ["resi", ["Batu yang lahir dari jantung gunung, Nak. Ia menyimpan ketenangan tanah: berat, sabar, tidak mudah goyah.", "A stone born from the mountain's heart, child. It holds the calm of the earth: heavy, patient, not easily shaken."]],
      ["resi", ["Leluhur kita menitipkannya di Candi Wingit bersama arca penjaga. Selama ia utuh, amarah di bawah gunung tetap tertidur.", "Our ancestors entrusted it to Wingit Temple with a guardian statue. While it stays whole, the rage beneath the mountain sleeps."]],
    ] },
    { tanya: ["Bagaimana Resi tahu kabut itu berbahaya?", "How do you know the mist is dangerous?"], jawab: [
      ["resi", ["Aku tinggal di lereng Geni empat puluh tahun. Aku tahu suara gunung itu saat tidur, saat batuk, dan saat marah.", "I've lived on Geni's slopes for forty years. I know its sound when it sleeps, when it coughs, and when it's angry."]],
      ["resi", ["Tiga malam lalu ia tidak marah. Ia menangis. Dan itu jauh lebih menakutkan.", "Three nights ago it wasn't angry. It was weeping. And that is far more frightening."]],
    ] },
    { tanya: ["Apa yang harus kulakukan kalau bertemu makhluk kuat?", "What should I do if I meet something strong?"], jawab: [
      ["resi", ["Perhatikan gerakannya sebelum menyerang. Setiap makhluk punya ancang-ancang. Tanah merah di bawah kakinya adalah peringatan.", "Watch its movements before it strikes. Every creature winds up first. Red ground beneath its feet is a warning."]],
      ["resi", ["Berguling tepat saat ia memukul, dan kau akan lebih cepat dari angin. Itulah Hindar Sempurna.", "Roll just as it strikes, and you'll be faster than the wind. That is the Perfect Dodge."]],
    ] },
  ],
  "b1e5:joko": [
    { tanya: ["Sejak kapan Pak Joko jadi tabib?", "How long have you been a healer?"], jawab: [
      ["joko", ["Sejak umur dua belas. Guruku seorang tabib kelana yang singgah karena kakinya patah. Dia tinggal tiga tahun, mengajariku semuanya.", "Since I was twelve. My teacher was a wandering healer who stopped here with a broken leg. He stayed three years and taught me everything."]],
      ["joko", ["Katanya, obat terbaik bukan ramuan, tapi orang yang mau duduk menemani si sakit. Ramuan cuma membantu.", "He said the best medicine isn't a potion, but someone willing to sit beside the sick. Potions just help."]],
    ] },
    { tanya: ["Kenapa kabut membuat hewan beringas?", "Why does the mist make animals vicious?"], jawab: [
      ["joko", ["Aku sudah memeriksa kera yang tertangkap. Matanya merah, napasnya panas, tapi tubuhnya sehat. Ini bukan penyakit biasa.", "I examined a captured monkey. Red eyes, hot breath, but a healthy body. This is no ordinary illness."]],
      ["joko", ["Seperti ada sesuatu yang membisikkan amarah ke telinganya. Kutukan, mungkin. Itu wilayah Resi Wening, bukan tabib desa.", "As if something whispered rage into its ear. A curse, maybe. That's Resi Wening's domain, not a village healer's."]],
    ] },
  ],
  "b1e6:resi": [
    { tanya: ["Siapa yang membangun Candi Wingit?", "Who built Wingit Temple?"], jawab: [
      ["resi", ["Para pemahat dari kerajaan tua yang namanya sudah hilang. Mereka membangunnya dalam satu malam, kata dongeng. Aku tidak percaya.", "Carvers from an old kingdom whose name is lost. They built it in a single night, says the tale. I don't believe it."]],
      ["resi", ["Tapi aku percaya mereka menaruh sebagian jiwanya di arca penjaga. Karena itu Dwarapala tidak pernah tidur.", "But I believe they put part of their souls into the guardian statues. That's why the Dwarapala never sleeps."]],
    ] },
    { tanya: ["Resi, apakah aku cukup kuat untuk ini?", "Resi, am I strong enough for this?"], jawab: [
      ["resi", ["Belum. Dan itu bagus. Orang yang merasa sudah cukup kuat berhenti belajar.", "Not yet. And that's good. Those who feel strong enough stop learning."]],
      ["resi", ["Setiap pertarungan akan mengajarimu sesuatu. Kumpulkan poin jurusmu, pilih jimat dengan bijak, dan jangan malu mundur untuk minum jamu.", "Every fight will teach you something. Gather your skill points, choose charms wisely, and don't be ashamed to step back and drink jamu."]],
    ] },
  ],
  "b1e9:resi": [
    { tanya: ["Bisakah retakan itu diperbaiki?", "Can the crack be repaired?"], jawab: [
      ["resi", ["Bukan diperbaiki, Nak. Dipulihkan. Mustika itu seperti persahabatan: retaknya tidak hilang, tapi bisa menjadi lebih kuat bila ketiganya bersatu.", "Not repaired, child. Restored. A gem is like friendship: the crack never vanishes, but it can grow stronger when all three unite."]],
    ] },
    { tanya: ["Siapa yang tega meretakkannya?", "Who would dare crack it?"], jawab: [
      ["resi", ["Arca penjaga itu tidak lengah. Yang meretakkannya pasti bukan pencuri biasa, melainkan sesuatu yang lebih tua dari candi itu sendiri.", "The guardian statue wasn't careless. Whoever cracked it was no ordinary thief, but something older than the temple itself."]],
      ["resi", ["Aku punya dugaan. Tapi dugaan tanpa bukti hanya akan menakutimu. Pergilah, dan perhatikan baik-baik apa yang kau temui.", "I have a suspicion. But a suspicion without proof would only frighten you. Go, and watch closely what you find."]],
    ] },
  ],
  // ===================== BAB 2 =====================
  "b2e1:tirto": [
    { tanya: ["Mbah sudah lama tinggal di rawa?", "Have you lived in the swamp long?"], jawab: [
      ["tirto", ["Sejak rawa ini masih danau, Nak. Airnya dulu bening sekali, ikan-ikannya bisa dihitung dari atas perahu.", "Since this swamp was still a lake, child. The water was so clear you could count the fish from your boat."]],
      ["tirto", ["Lalu orang-orang menebang hutan di hulu. Tanahnya terbawa air. Danaunya menjadi rawa. Alam selalu membalas, pelan tapi pasti.", "Then people cut the forest upstream. The soil washed down. The lake became a swamp. Nature always repays, slowly but surely."]],
    ] },
    { tanya: ["Apa itu Batu Pitutur?", "What is the Pitutur Stone?"], jawab: [
      ["tirto", ["Batu tua yang bisa bertanya. Kata orang, di dalamnya tersimpan nasihat para leluhur. Kalau jawabanmu tulus, ia membuka jalan.", "An old stone that asks questions. They say ancestors' advice is stored inside. If your answers are sincere, it opens the way."]],
      ["tirto", ["Aku pernah menjawabnya waktu muda. Pertanyaannya: 'Apa yang paling kau takutkan?' Aku jawab 'buaya'. Batu itu diam saja. Hehe.", "I answered it once when I was young. The question: 'What do you fear most?' I said 'crocodiles'. The stone stayed silent. Heh."]],
    ] },
  ],
  "b2e9:resi": [
    { tanya: ["Bagaimana kalau naga itu memang jahat?", "What if the dragon really is evil?"], jawab: [
      ["resi", ["Maka kau harus memutuskan sendiri, di hadapannya. Tapi ingat: makhluk yang kesakitan sering terlihat jahat bagi yang tidak mengerti.", "Then you must decide for yourself, before it. But remember: a creature in pain often looks evil to those who don't understand."]],
      ["resi", ["Lihat matanya, Nak. Mata tidak pandai berbohong, bahkan mata naga.", "Look into its eyes, child. Eyes are poor liars, even a dragon's."]],
    ] },
    { tanya: ["Resi pernah melihat Naga Kencana?", "Have you ever seen Kencana the Dragon?"], jawab: [
      ["resi", ["Sekali, waktu aku seusiamu. Aku dan seorang sahabat mendaki tangga yang seharusnya tidak kami daki.", "Once, when I was your age. A friend and I climbed a stair we were never meant to climb."]],
      ["resi", ["Kami melihatnya dari jauh, tidur di atas awan, emas seperti matahari pagi. Sahabatku... ah, ceritanya panjang. Dan memalukan. Ada jambu di dalamnya.", "We saw it from afar, asleep on the clouds, golden as morning sun. My friend... ah, it's a long story. And embarrassing. There were guavas involved."]],
    ] },
  ],
  // ===================== BAB 3 =====================
  "b3e1:bahar": [
    { tanya: ["Sudah lama Datuk jadi syahbandar?", "Have you been harbor master long?"], jawab: [
      ["bahar", ["Turun-temurun, Kisanak. Kakekku syahbandar, ayahku syahbandar. Kalau anakku tidak mau, ya sudah, aku jadi syahbandar sampai seratus tahun.", "It runs in the family. My grandfather was harbor master, my father too. If my son refuses, well, I'll keep the job till I'm a hundred."]],
      ["bahar", ["Bandar ini pernah jadi pelabuhan paling ramai di Segara. Kapal dari tiga kerajaan berlabuh di sini. Sebelum kabut datang.", "This harbor was once the busiest in Segara. Ships from three kingdoms docked here. Before the mist came."]],
    ] },
    { tanya: ["Ceritakan tentang Nyi Laras.", "Tell me about Nyi Laras."], jawab: [
      ["bahar", ["Penjaga Kuil Samudra, keturunan para pendeta laut. Dia bisa membaca ombak seperti kita membaca huruf.", "Keeper of the Sea Temple, descendant of the sea priests. She reads waves like we read letters."]],
      ["bahar", ["Sedikit menakutkan, terus terang. Dia pernah meramal kapal pamanku akan bocor. Seminggu kemudian, kapalnya bocor. Tepat di hari yang dia sebut.", "A bit scary, honestly. She once foretold my uncle's ship would leak. A week later it leaked. On the exact day she named."]],
    ] },
  ],
  "b3e2:laras": [
    { tanya: ["Apa hubungan kuil ini dengan naga?", "How is this temple tied to the dragon?"], jawab: [
      ["laras", ["Kuil Samudra dibangun di tempat sang naga pertama kali turun ke bumi, seribu tahun lalu, untuk minum dari laut.", "The Sea Temple was built where the dragon first came down to earth, a thousand years ago, to drink from the sea."]],
      ["laras", ["Leluhurku menyambutnya, bukan dengan tombak, tapi dengan lagu. Sejak itu kami dan sang naga terikat janji.", "My ancestors greeted it, not with spears, but with song. Since then we and the dragon have been bound by a promise."]],
    ] },
    { tanya: ["Kenapa kabut paling tebal di hutan bakau?", "Why is the mist thickest in the mangroves?"], jawab: [
      ["laras", ["Bakau adalah tempat laut dan darat bertemu. Kabut menyukai perbatasan, tempat segala sesuatu belum memutuskan menjadi apa.", "Mangroves are where sea and land meet. Mist loves borders, places where things haven't decided what to become."]],
    ] },
  ],
  "b3e3:bayu": [
    { tanya: ["Kenapa kamu ingin jadi pendekar?", "Why do you want to be a warrior?"], jawab: [
      ["bayu", ["Biar bisa melindungi Nenek! Bapakku melaut dan belum pulang sejak musim kabut. Jadi sekarang aku laki-laki di rumah.", "So I can protect Grandma! My dad went to sea and hasn't come back since the mist season. So now I'm the man of the house."]],
      ["bayu", ["...Tapi kadang malam-malam aku takut juga. Jangan bilang siapa-siapa, ya, Kak.", "...But sometimes at night I get scared too. Don't tell anyone, okay?"]],
    ] },
    { tanya: ["Apa yang kamu lihat di bakau?", "What did you see in the mangroves?"], jawab: [
      ["bayu", ["Ubur-ubur yang terbang, Kak! Sungguhan! Warnanya ungu, menyala, dan kalau tersentuh rasanya seperti disengat lebah seribu.", "Flying jellyfish! For real! Purple, glowing, and if you touch one it feels like a thousand bee stings."]],
      ["bayu", ["Lalu ada suara mendesis dari dalam hutan. Aku lari. Pendekar juga boleh lari kalau perlu, kan?", "Then there was hissing from deep in the forest. I ran. Warriors are allowed to run when needed, right?"]],
      ["hero", ["Boleh. Pendekar yang pintar tahu kapan harus lari.", "Yes. Smart warriors know when to run."]],
    ] },
  ],
};
