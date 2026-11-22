// =====================================================================
// PROLOG (diputar sekali saat memulai permainan baru)
// Memberi tahu pemain game ini tentang apa: dunia, ancaman kabut merah, siapa
// dirinya, dan apa yang harus dilakukan (jelajah, tolong warga, kalahkan bos,
// kumpulkan jimat, latihan dulu bersama Ki Sabda). Kamera menyapu Desa Wanasari.
// Bisa dilewati (tombol Lewati / Esc / tahan ketuk). Teks: ID & EN di sini.
// =====================================================================
"use strict";

const TEKS_PROLOG = [
  ["Dahulu kala, tanah Nusantara hidup damai di bawah lindungan para penjaga alam.",
    "Long ago, the lands of Nusantara lived in peace under the protection of nature's guardians."],
  ["Tiga malam lalu, kabut merah turun dari puncak Gunung Geni.",
    "Three nights ago, a red mist descended from the peak of Mount Geni."],
  ["Hewan hutan menjadi beringas. Makhluk-makhluk gaib terbangun dan para penjaga berubah menjadi musuh.",
    "Forest beasts turned savage. Spirits awoke, and the guardians themselves became foes."],
  ["Kau adalah {kelas} muda dari Desa Wanasari, satu-satunya yang berani melawan.",
    "You are a young {kelas} from Wanasari Village, the only one brave enough to fight back."],
  ["Jelajahi empat negeri, tolong para warga, dan kalahkan bos-bos penjaga untuk mengungkap asal kabut.",
    "Explore four realms, help the villagers, and defeat the guardian bosses to uncover the source of the mist."],
  ["Kumpulkan jimat, tingkatkan senjata di Tukang Pahat, dan pelajari jurus baru setiap kali naik level.",
    "Collect charms, upgrade your weapon at the Carver, and learn new skills every time you level up."],
  ["Mulailah dengan berlatih bersama Ki Sabda di selatan desa. Semoga berhasil, pendekar!",
    "Begin by training with Ki Sabda in the south of the village. Good luck, hero!"],
];
const teksProlog = (i) => pilihBahasa(TEKS_PROLOG[i]).replace("{kelas}", CLASSES[S.cls].name);

function mainkanProlog() {
  if (!S || S.prologSelesai) return;
  const W0 = MW * T, H0 = MH * T;
  mainkanAdegan([
    { gelap: 1, lama: 0.01 },
    { judul: "Laga Nusantara", sub: pilihBahasa(["Sebuah kisah dari Tanah Wanasari", "A tale from the Land of Wanasari"]), lama: 2.6 },
    { kamera: { x: W0 * 0.2, y: H0 * 0.3 }, lama: 0.01 },
    { gelap: 0, lama: 1 },
    { teks: teksProlog(0), lama: 4 },
    { kamera: { x: W0 * 0.8, y: H0 * 0.15 }, lama: 0.6 },
    { kilat: true }, { guncang: 0.5 },
    { teks: teksProlog(1), lama: 3.6 },
    { teks: teksProlog(2), lama: 4.6 },
    { kamera: "pemain", lama: 0.8 },
    { teks: teksProlog(3), lama: 3.8 },
    { teks: teksProlog(4), lama: 4.6 },
    { teks: teksProlog(5), lama: 4.4 },
    { teks: teksProlog(6), lama: 4 },
    { lakukan: () => { S.prologSelesai = true; saveSoon(); } },
  ]);
}
// permainan baru → prolog diputar setelah layar game siap
{
  const startAsli = startGame;
  startGame = function (fresh) {
    startAsli(fresh);
    if (fresh) setTimeout(mainkanProlog, 600);
    else if (S) S.prologSelesai = S.prologSelesai || S.lv > 1 || S.cerita && S.cerita.idx > 0;   // save lama: tidak perlu prolog
  };
}
