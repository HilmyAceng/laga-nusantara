// =====================================================================
// NPC ARC 2 "Benang Sepi" (dunia 5 & 6)
// Posisi dalam petak (dikali T di bawah). `pindah` = tempat NPC berubah sesuai
// kemajuan cerita: [{ sejak: [bab, ep], area, x, y }, ...] — dipakai 99zk-npc-hidup.js.
// `jadwal` = tempat NPC di tiap waktu hari (pagi/siang/sore/malam), juga 99zk-npc-hidup.js.
// =====================================================================
"use strict";

const NPC_ARC2 = [
  // ---- Kota Labuhan Lama ----
  { id: "kadir", name: "Syahbandar Kadir", area: "labuhan", x: 7.5, y: 13.4, color: "#1f3a5f", accent: "#f4b942", hat: "#1b1208", hair: "#d9d4cc", face: 0,
    jadwal: { pagi: [7.5, 13.4], siang: [7.5, 13.4], sore: [12.5, 17.4], malam: [10.5, 21.4] },
    obrolan: ["Setiap kapal harus punya surat. Setiap surat harus punya cap. Setiap cap... ah, kau mengerti.", "Dulu pelabuhan ini riuh oleh nyanyian kuli angkut. Sekarang sunyi seperti kuburan.", "Kalau kau melihat orang bertopeng, jangan kejar sendirian. Panggil aku. ...Atau jangan panggil aku. Aku sudah tua."],
    obrolanEn: ["Every ship must have papers. Every paper must have a stamp. Every stamp... ah, you understand.", "This harbor used to ring with the porters' songs. Now it's silent as a graveyard.", "If you see someone masked, don't chase them alone. Call me. ...Or don't call me. I'm old."] },
  { id: "mei", name: "Nyonya Mei", area: "labuhan", x: 16.5, y: 12.4, color: "#a3243b", accent: "#f4d58a", hair: "#1f1a2a", face: Math.PI / 2,
    jadwal: { pagi: [16.5, 12.4], siang: [18.5, 17.4], sore: [16.5, 12.4], malam: [26.5, 6.4] },
    obrolan: ["Kabar itu dagangan paling mahal, Nak. Tapi untukmu, diskon.", "Harga garam naik, harga kabar turun. Dunia aneh.", "Aku bisa menawar dengan setan. Tapi aku tak bisa menawar dengan sunyi."],
    obrolanEn: ["News is the priciest merchandise, child. But for you, a discount.", "Salt prices up, news prices down. Strange world.", "I can haggle with demons. But I can't haggle with silence."] },
  { id: "galang", name: "Galang", area: "labuhan", x: 24.5, y: 19.4, color: "#8a5a2a", accent: "#e9d3a9", hair: "#2a1a10", face: Math.PI,
    jadwal: { pagi: [24.5, 19.4], siang: [10.5, 26.4], sore: [29.5, 26.4], malam: [24.5, 19.4] },
    pindah: [{ sejak: [11, 8], area: "gudang", x: 10.5, y: 20.4 }, { sejak: [11, 10], area: "labuhan", x: 24.5, y: 19.4 }],
    obrolan: ["Aku tidak mencopet lagi! ...Hari ini.", "Atap paling enak buat tidur? Atap gudang kain. Hangat.", "Kak, ajari aku jurus yang bikin musuh pusing!"],
    obrolanEn: ["I don't pickpocket anymore! ...Today.", "Best roof to sleep on? The cloth warehouse. It's warm.", "Teach me the move that makes enemies dizzy!"] },
  { id: "merdu", name: "Nyi Merdu", area: "labuhan", x: 27.5, y: 13.4, color: "#6b2f6b", accent: "#f4b942", hair: "#1f1a2a", face: Math.PI,
    jadwal: { pagi: [27.5, 13.4], siang: [22.5, 12.4], sore: [27.5, 13.4], malam: [33.5, 17.4] },
    obrolan: ["(Nyi Merdu tersenyum dan menulis di batu tulisnya: \"Terima kasih sudah mampir.\")", "(Ia menunjuk tenggorokannya, lalu langit. \"Suatu hari,\" tulisnya.)"],
    obrolanEn: ["(Nyi Merdu smiles and writes on her slate: \"Thank you for stopping by.\")", "(She points at her throat, then at the sky. \"Someday,\" she writes.)"] },
  // ---- Kampung Megalit ----
  { id: "inaSeli", name: "Ina Seli", area: "kampungBatu", x: 14.5, y: 10.4, color: "#7a2f2a", accent: "#e9c46a", hair: "#e8e2e0", face: 0,
    jadwal: { pagi: [14.5, 10.4], siang: [10.5, 8.4], sore: [14.5, 10.4], malam: [11.5, 7.4] },
    obrolan: ["Benang yang kusut jangan ditarik keras. Urai pelan-pelan, seperti hati orang.", "Setiap motif kain ini menyimpan satu cerita leluhur.", "Tugu-tugu itu dulu bernyanyi saat hujan datang."],
    obrolanEn: ["Don't yank a tangled thread. Loosen it gently, like a person's heart.", "Every motif in this cloth holds an ancestral story.", "Those pillars used to sing when the rain came."] },
  { id: "amaDoko", name: "Ama Doko", area: "kampungBatu", x: 26.5, y: 18.4, color: "#5a3a1a", accent: "#c9a26b", hat: "#3a2c1a", hair: "#2a201b", face: Math.PI,
    jadwal: { pagi: [30.5, 24.4], siang: [26.5, 18.4], sore: [26.5, 18.4], malam: [27.5, 23.4] },
    obrolan: ["Kerbau itu bukan harta. Mereka keluarga.", "Lewa terlalu nekat. Persis ibunya.", "Kemarau ini terlalu panjang. Rumput pun lupa caranya hijau."],
    obrolanEn: ["Buffalo aren't wealth. They're family.", "Lewa's too reckless. Just like her mother.", "This drought's too long. Even the grass forgot how to be green."] },
  { id: "lewa", name: "Lewa", area: "kampungBatu", x: 22.5, y: 10.4, color: "#c0563a", accent: "#2a9d8f", hair: "#1f1a2a", face: Math.PI,
    pindah: [{ sejak: [13, 5], area: "sabana", x: 55.5, y: 38.4 }, { sejak: [13, 7], area: "kampungBatu", x: 22.5, y: 10.4 }, { sejak: [14, 2], area: "lembahTugu", x: 6.5, y: 22.4 }, { sejak: [15, 1], area: "kampungBatu", x: 22.5, y: 10.4 }],
    obrolan: ["Kudaku namanya Angin. Dia lebih cepat dari gosip.", "Jangan bilang Ayah aku ke bukit lagi, ya!", "Kalau jatuh dari kuda, naik lagi. Itu saja aturannya."],
    obrolanEn: ["My horse is named Wind. She's faster than gossip.", "Don't tell Father I went to the hill again!", "If you fall off a horse, get back on. That's the only rule."] },
  // ---- Kampung Rumah Panjang ----
  { id: "rangkai", name: "Tetua Rangkai", area: "rumahPanjang", x: 17.5, y: 9.4, color: "#3a4a2a", accent: "#e9c46a", hair: "#d9d4cc", face: Math.PI / 2,
    jadwal: { pagi: [17.5, 9.4], siang: [24.5, 9.4], sore: [17.5, 9.4], malam: [14.5, 8.4] },
    obrolan: ["Rimba tidak jahat. Rimba hanya jujur.", "Tato di tanganku ini peta. Tiap garis satu perjalanan.", "Anak-anak kami adalah akar. Kalau akar hilang, pohon tumbang."],
    obrolanEn: ["The jungle isn't cruel. It's only honest.", "These tattoos on my hands are a map. Each line, one journey.", "Our children are roots. Lose the roots, and the tree falls."] },
  { id: "saka", name: "Saka", area: "rumahPanjang", x: 30.5, y: 13.4, color: "#2f5a3a", accent: "#c9a26b", hair: "#1f1a24", face: Math.PI,
    jadwal: { pagi: [38.5, 15.4], siang: [30.5, 13.4], sore: [30.5, 13.4], malam: [27.5, 9.4] },
    pindah: [{ sejak: [16, 1], area: "beringin", x: 24.5, y: 36.4 }, { sejak: [17, 1], area: "rumahPanjang", x: 30.5, y: 13.4 }],
    obrolan: ["...", "Jejak tidak pernah bohong.", "Sumpit ini warisan kakek. Belum pernah meleset. Kecuali sekali. Jangan tanya."],
    obrolanEn: ["...", "Tracks never lie.", "This blowpipe was my grandfather's. Never missed. Except once. Don't ask."] },
  { id: "inai", name: "Bu Inai", area: "rumahPanjang", x: 9.5, y: 19.4, color: "#8f3a5a", accent: "#e9d3a9", hair: "#2a1a1a", face: 0,
    jadwal: { pagi: [9.5, 19.4], siang: [9.5, 19.4], sore: [13.5, 12.4], malam: [9.5, 19.4] },
    obrolan: ["Daun ini untuk demam, yang itu untuk luka. Yang ungu? Jangan dimakan!", "Kalau kau terluka karena ceroboh, aku obati sambil kumarahi.", "Rimba ini apotek terbesar di dunia."],
    obrolanEn: ["This leaf is for fever, that one for wounds. The purple one? Don't eat it!", "If you get hurt being careless, I'll treat you while scolding you.", "This jungle is the biggest apothecary in the world."] },
  { id: "upik", name: "Upik", area: "rumahPanjang", x: 24.5, y: 19.4, color: "#e0a03a", accent: "#f7efe3", hair: "#1f1a2a", face: 0, muncul: [15, 10],
    obrolan: ["Kak, kenapa langit biru? Kenapa daun hijau? Kenapa Kakak kuat?", "Nenek tinggi itu baik, lho. Dia cuma kesepian."],
    obrolanEn: ["Why is the sky blue? Why are leaves green? Why are you so strong?", "That tall granny was nice, you know. She was just lonely."] },
  // ---- Pondok Nini Embun ----
  { id: "embun", name: "Nini Embun", area: "pondok", x: 13.5, y: 10.4, color: "#dfe8f5", accent: "#6fb7ff", hair: "#ffffff", face: 0,
    jadwal: { pagi: [13.5, 10.4], siang: [13.5, 10.4], sore: [16.5, 11.4], malam: [7.5, 6.4] },
    pindah: [{ sejak: [18, 5], area: "guaEs", x: 8.5, y: 30.4 }, { sejak: [19, 2], area: "puncak", x: 22.5, y: 38.4 }, { sejak: [20, 7], area: "pondok", x: 13.5, y: 10.4 }],
    obrolan: ["Hihihi, dingin? Ini baru sejuk, Nak.", "Salju itu hujan yang sabar.", "Aku sudah tinggal di sini sejak... hmm, sejak gunung ini masih kecil."],
    obrolanEn: ["Heehee, cold? This is merely cool, child.", "Snow is just patient rain.", "I've lived here since... hmm, since this mountain was little."] },
  { id: "tenggo", name: "Pak Tenggo", area: "pondok", x: 20.5, y: 16.4, color: "#8f5a2a", accent: "#e9d3a9", hat: "#5a3a1a", hair: "#2a201b", face: Math.PI,
    jadwal: { pagi: [20.5, 16.4], siang: [24.5, 12.4], sore: [20.5, 16.4], malam: [23.5, 20.4] },
    pindah: [{ sejak: [18, 4], area: "guaEs", x: 5.5, y: 33.4 }, { sejak: [19, 1], area: "pondok", x: 20.5, y: 16.4 }],
    obrolan: ["Beban seratus kati? Ringan! Hantu satu ekor? ...Berat.", "Jangan bersiul di gunung. Nanti yang menjawab bukan manusia.", "Bekal paling penting di gunung: kopi dan keberanian. Aku punya kopi."],
    obrolanEn: ["A hundred-catty load? Light! One ghost? ...Heavy.", "Don't whistle on the mountain. What answers might not be human.", "Most important mountain supplies: coffee and courage. I've got coffee."] },
  // ---- Setelah lakon usai ----
  { id: "lirih", name: "Ki Lirih", area: "kelir", x: 24.5, y: 12.4, color: "#2b2238", accent: "#c9a24a", hair: "#e8e2e0", face: Math.PI / 2, muncul: [20, 6],
    obrolan: ["...(Ki Lirih memandangi kelir es itu lama sekali, lalu tersenyum tipis.)", "Kata-kata memang bisa melukai. Tapi hanya kata-kata pula yang bisa meminta maaf."],
    obrolanEn: ["...(Ki Lirih gazes at the ice screen for a long time, then smiles faintly.)", "Words can wound, yes. But only words can ask forgiveness."] },
];
for (const n of NPC_ARC2) { n.x *= T; n.y *= T; NPC_DATA.push(n); }
