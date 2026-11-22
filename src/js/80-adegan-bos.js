// =====================================================================
// CUTSCENE KEMUNCULAN BOS
// Saat pemain pertama kali mendekati bos cerita: kamera menyorot bos, layar
// bergetar, nama & julukannya tampil besar, bos mengucapkan satu kalimat khas,
// lalu kamera kembali ke pemain dan pertarungan dimulai (±8-10 detik).
//  - Hanya sekali per bos (S.adeganBos[jenis]); bos Cermin Gaib (m.ulang) tidak memutarnya.
//  - Bisa dilewati (tombol Lewati / Esc / tahan ketuk).
// Julukan & kalimat tiap bos: ID & EN di ADEGAN_BOS.
// =====================================================================
"use strict";

const ADEGAN_BOS = {
  genderuwo: { sub: ["Penunggu Gua", "Keeper of the Cave"], kata: ["Siapa berani mengusik tidurku?! Akan kuremukkan tulangmu!", "Who dares disturb my slumber?! I'll crush your bones!"] },
  dwarapala: { sub: ["Penjaga Gerbang Candi", "Guardian of the Temple Gate"], kata: ["Tak seorang pun melewati gerbang ini. Pergi, atau hancur.", "None shall pass this gate. Leave, or be broken."] },
  buayaPutih: { sub: ["Raja Rawa Kabut", "King of the Misty Swamp"], kata: ["Rawa ini milikku sejak sebelum desamu berdiri, bocah.", "This swamp was mine before your village ever stood, child."] },
  rajaBanaspati: { sub: ["Api dari Gunung Geni", "Fire of Mount Geni"], kata: ["Kabut merah adalah napasku! Terbakarlah bersama hutanmu!", "The red mist is my breath! Burn with your forest!"] },
  silumanUlar: { sub: ["Ratu Hutan Larangan", "Queen of the Forbidden Forest"], kata: ["Sssst... manusia lancang. Racunku sudah lama haus.", "Hssss... insolent human. My venom has thirsted long."] },
  panglimaKarang: { sub: ["Panglima Laut Segara", "Warlord of the Segara Sea"], kata: ["Kuil ini dijaga ombak dan karang. Tenggelamlah!", "Waves and coral guard this temple. Drown!"] },
  kelabang: { sub: ["Penguasa Hutan Batu", "Ruler of the Stone Forest"], kata: ["Kriik... kriik... seribu kakiku akan menginjakmu!", "Skrr... skrr... my thousand legs will trample you!"] },
  naga: { sub: ["Sang Naga Kencana", "The Golden Dragon"], kata: ["Makhluk kecil... kau datang ke puncak para naga untuk mati?", "Little creature... have you climbed the peak of dragons to die?"] },
  rajaJerangkong: { sub: ["Raja Makam Kuno", "King of the Ancient Tomb"], kata: ["Raja-raja lama tidak beristirahat. Bergabunglah dengan pasukanku!", "The old kings never rest. Join my army!"] },
  guritaRaksasa: { sub: ["Penghuni Gua Laut", "Dweller of the Sea Cave"], kata: ["Blub... delapan lenganku akan menyeretmu ke dasar laut!", "Blub... my eight arms will drag you to the seabed!"] },
  rajawaliPetir: { sub: ["Penguasa Istana Awan", "Lord of the Cloud Palace"], kata: ["Langit adalah wilayahku. Rasakan amukan petir!", "The sky is my domain. Feel the fury of thunder!"] },
  penjagaMenara: { sub: ["Penjaga Menara Kala", "Warden of Kala Tower"], kata: ["Waktu berhenti di menara ini. Begitu pula hidupmu.", "Time stands still in this tower. So will your life."] },
  kalamurka: { sub: ["Raja Negeri Bayang", "King of the Shadow Realm"], kata: ["Akhirnya kau datang. Kabut ini... adalah duka yang tak pernah kau pahami.", "At last you've come. This mist... is a grief you could never understand."] },
};

function mainkanAdeganBos(m) {
  const D = ADEGAN_BOS[m.type]; if (!D) return;
  S.adeganBos = S.adeganBos || {};
  const tandai = () => { S.adeganBos[m.type] = true; saveSoon(); };
  mainkanAdegan([
    { kamera: "bos", lama: 1.1 },
    { lakukan: () => { sfx.growl(); if (typeof suaraMonster === "function") try { suaraMonster(m, "ancang"); } catch (e) {} } },
    { guncang: 0.7 }, { kilat: true },
    { judul: m.d.name, sub: pilihBahasa(D.sub), lama: 2.4 },
    { teks: pilihBahasa(D.kata), nama: m.d.name, lama: 3.2 },
    { kamera: "pemain", lama: 0.7 },
    { lakukan: tandai },
  ], null, { bos: m });
}
// pemicu: bos cerita hidup, belum pernah dikenalkan, dan pemain cukup dekat
UPDATE_TAMBAHAN.push(() => {
  if (!S || !P || P.dead || adegan) return;
  for (const m of monsters) {
    if (m.dead || !m.d.boss || m.ulang || m.d.latihan || !ADEGAN_BOS[m.type]) continue;
    if (S.adeganBos && S.adeganBos[m.type]) continue;
    if (S.bos[m.type]) { (S.adeganBos = S.adeganBos || {})[m.type] = true; continue; }   // sudah pernah dikalahkan (save lama)
    if (dist(P, m) < Math.max(320, (m.d.aggro || 300) + 40)) { mainkanAdeganBos(m); return; }
  }
});
