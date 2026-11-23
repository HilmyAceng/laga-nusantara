// =====================================================================
// INFO & CATATAN PEMBARUAN
// Ikon (i) di HUD, di kiri ikon Event. Membuka popup: kiri = daftar versi,
// kanan = apa yang BARU, apa yang BERUBAH, dan PERBAIKAN di versi itu.
// Ikon berdenyut + "!" kalau ada versi yang belum dibaca (disimpan di laga.infoDibaca).
// Menambah catatan: taruh entri baru PALING ATAS di CATATAN_RILIS (teks [id, en]).
// =====================================================================
"use strict";

const CATATAN_RILIS = [
  {
    versi: "0.9.1-beta", tanggal: ["23 November 2026", "November 23, 2026"],
    judul: ["Event & Catur Laga", "Events & Battle Chess"],
    baru: [
      ["Ikon Event di HUD (muncul setelah Bab 2): daftar event, trailer, dan pelacak ke NPC dengan teleport.", "Event icon on the HUD (appears after Chapter 2): event list, trailer, and an NPC tracker with teleport."],
      ["Event Catur Laga bersama Pak Wowo di Desa Wanasari, lengkap dengan tutorial.", "Battle Chess event with Pak Wowo in Wanasari Village, with a tutorial."],
      ["Memakan bidak = duel 20 detik antar-hero. Menang memakan, kalah = bidak penyerang hilang.", "Capturing = a 20-second hero duel. Win to capture; lose and the attacker is removed."],
      ["Opsi catur: pilih hero tiap bidak, 3 tingkat, warna putih/hitam, jam catur (3 menit – 2 jam, atau tanpa waktu), dan catur biasa tanpa duel.", "Chess options: a hero per piece, 3 difficulty levels, white/black, a chess clock (3 minutes – 2 hours, or none), and classic chess without duels."],
      ["Hadiah menang pertama tiap tingkat, termasuk jimat langka Bidak Emas Pak Wowo.", "First-win rewards for each level, including the rare Pak Wowo's Golden Pawn charm."],
      ["Ikon Info ini: catatan semua pembaruan game.", "This Info icon: notes on every game update."],
      ["Panduan kontrol keyboard saat pertama main di komputer.", "A keyboard controls guide the first time you play on a computer."],
    ],
    ubah: [
      ["Level monster tidak lagi ikut naik jauh: paling banyak 3 level di atas aslinya (Kera Liar tetap Lv 1–4). Terima kasih atas masukannya!", "Monster levels no longer climb far: at most 3 levels above their own (Wild Monkeys stay Lv 1–4). Thanks for the feedback!"],
      ["EXP dari monster yang jauh lebih lemah berkurang, dan warna label level menunjukkan kekuatan musuh (abu-abu / putih / jingga / merah).", "Much weaker monsters give less EXP, and level label colors show enemy strength (grey / white / orange / red)."],
      ["Kotak misi sedikit lebih besar di HP dan komputer.", "The quest box is a bit larger on phones and computers."],
      ["Game otomatis memperbarui diri ke versi terbaru.", "The game now updates itself to the latest version automatically."],
      ["Di HP, game langsung layar penuh dan mendatar.", "On phones, the game opens fullscreen and in landscape."],
      ["Notifikasi di HP pindah ke atas dan tidak menutupi layar.", "Notifications on phones moved to the top so they don't cover the screen."],
      ["Pilih bahasa di layar awal; bahasa awal untuk pemain baru adalah Inggris.", "Pick a language on the start screen; new players start in English."],
      ["Kirim masukan sekarang lewat email.", "Feedback is now sent by email."],
    ],
    baik: [
      ["Panah petunjuk arah tidak lagi kadang dekat kadang jauh.", "The guide arrow no longer jumps between near and far."],
      ["Ikon di teks notifikasi sekarang sama dengan ikon tombol HUD.", "Icons in notification text now match the HUD buttons."],
      ["Teks judul menu di HP tidak lagi keluar kotak.", "Menu titles on phones no longer overflow their box."],
    ],
  },
  {
    versi: "0.9.0-beta", tanggal: ["22 November 2026", "November 22, 2026"],
    judul: ["Beta pertama", "First beta"],
    baru: [
      ["Cerita utama 10 bab di 4 dunia, lengkap dengan prolog dan cutscene.", "A 10-chapter main story across 4 worlds, with a prologue and cutscenes."],
      ["7 hero: Pendekar, Pemanah, Pendobrak, Penyihir, Dalang, Tabib, Jawara.", "7 heroes: Pendekar, Pemanah, Pendobrak, Penyihir, Dalang, Tabib, Jawara."],
      ["Jurus, jurus pamungkas, poin jurus, serta hindar/tangkis khas tiap hero.", "Skills, ultimate skills, skill points, and a dodge/parry unique to each hero."],
      ["Jimat (termasuk pasif unik jimat legenda), koleksi jimat, dan ensiklopedia musuh.", "Charms (legendary ones with unique passives), a charm collection, and an enemy encyclopedia."],
      ["Warung (jamu & jimat), Tukang Pahat (senjata), dan misi sampingan panduan.", "Shops (jamu & charms), the Stone Carver (weapons), and guide side quests."],
      ["Cermin Gaib untuk melawan bos lagi, dan teleport antar-cermin lewat peta.", "Magic Mirrors to rematch bosses, and teleporting between mirrors on the map."],
      ["Penduduk desa yang bergerak, kucing, dan hiasan desa.", "Moving villagers, cats, and village decorations."],
      ["Pengaturan ukuran peta mini, kotak misi, dan ikon.", "Size settings for the minimap, quest box, and icons."],
    ],
    ubah: [
      ["Level maksimal 80, EXP naik lebih pelan.", "Max level 80, with slower EXP gain."],
      ["Koin tidak berkurang saat pingsan.", "Coins are no longer lost when you faint."],
      ["Arena bos lebih luas, dan monster kecil tidak ikut campur.", "Boss arenas are larger, and small monsters stay out."],
      ["Jamu punya jeda 10 detik.", "Jamu has a 10-second cooldown."],
    ],
    baik: [],
  },
];

const INFO_KEY = "laga.infoDibaca";
let infoPilih = 0;
const adaInfoBaru = () => store.get(INFO_KEY, "") !== CATATAN_RILIS[0].versi;

function hudInfo() {
  const b = $("btnInfoHud"); if (!b) return;
  b.classList.toggle("baru", adaInfoBaru());
}
function bukaInfo() {
  if (!S || (mode !== "play" && mode !== "pause")) return;
  if (mode === "pause") togglePause();
  mode = "info"; showUI();
  infoPilih = 0;
  $("infoBox").hidden = false; sfx.click();
  isiInfo();
  store.set(INFO_KEY, CATATAN_RILIS[0].versi); hudInfo();
}
function tutupInfo() {
  $("infoBox").hidden = true;
  if (mode === "info") { mode = "play"; showUI(); }
}
function isiInfo() {
  $("infoDaftar").innerHTML = CATATAN_RILIS.map((c, i) => `<button type="button" class="ev-item ${i === infoPilih ? "pilih" : ""}" data-info="${i}">
    <b>v${c.versi}</b><small>${Lx(c.judul)}</small></button>`).join("");
  const c = CATATAN_RILIS[infoPilih];
  const bagian = (kunci, kelas, label) => c[kunci] && c[kunci].length
    ? `<h4><span class="info-label ${kelas}">${Lx(label)}</span></h4><ul>${c[kunci].map((x) => `<li>${Lx(x)}</li>`).join("")}</ul>` : "";
  $("infoDetail").innerHTML = `<h3>v${c.versi} · ${Lx(c.judul)}</h3><p class="info-tgl">${Lx(c.tanggal)}</p>
    ${bagian("baru", "baru", ["Baru", "New"])}${bagian("ubah", "ubah", ["Perubahan", "Changes"])}${bagian("baik", "baik", ["Perbaikan", "Fixes"])}`;
  $("infoDetail").scrollTop = 0;
  $("infoKaki").innerHTML = `<span>${Lx(["Punya saran atau menemukan masalah? Kirim lewat menu (Esc) › Kirim Masukan.", "Have an idea or found a bug? Send it via the menu (Esc) › Send Feedback."])}</span>`;
}
$("btnInfoHud").addEventListener("click", bukaInfo);
$("btnInfoTutup").addEventListener("click", () => { sfx.click(); tutupInfo(); });
$("infoDaftar").addEventListener("click", (e) => { const b = e.target.closest("[data-info]"); if (!b) return; infoPilih = +b.dataset.info; sfx.click(); isiInfo(); });
addEventListener("keydown", (e) => { if (mode === "info" && e.key === "Escape") { e.stopImmediatePropagation(); tutupInfo(); } }, true);
hudInfo();
