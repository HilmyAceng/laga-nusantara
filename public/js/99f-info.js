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
    versi: "0.9.3-beta", tanggal: ["25 November 2026", "November 25, 2026"],
    judul: ["Kisah, Teman & Kotak Hadiah", "Tales, Companions & Rewards"],
    baru: [
      ["Cutscene cerita: setiap akhir bab dan beberapa momen penting kini punya adegan dengan tokoh yang berjalan, berbicara, dan bereaksi.", "Story cutscenes: every chapter ending and several key moments now have scenes where characters walk, talk, and react."],
      ["Percakapan lebih dalam: setelah dialog penting Bab 1–3, kamu bisa mengajukan pertanyaan tambahan (opsional).", "Deeper conversations: after key dialogues in Chapters 1–3, you can ask optional follow-up questions."],
      ["Kisah NPC: Ki Lurah, Resi Wening, dan Mbah Tirto menceritakan asal-usul Genderuwo, Dwarapala, dan Buaya Putih. Ada NPC yang memandu jalan, prasasti kuno, dan catatan kisah di Ensiklopedia.", "NPC tales: Ki Lurah, Resi Wening, and Mbah Tirto reveal the origins of the Genderuwo, Dwarapala, and White Crocodile. Includes guiding NPCs, ancient inscriptions, and tale entries in the Bestiary."],
      ["Teman seperjalanan: ajak Pak Joko, Bayu, atau Kirana ikut bertarung dan mengobrol di perjalanan.", "Companions: invite Pak Joko, Bayu, or Kirana to fight alongside you and chat on the road."],
      ["Kotak (ikon surat): pesan berhadiah, kode hadiah, absen harian 7 hari, serta tantangan harian & mingguan.", "Mailbox (envelope icon): reward mail, gift codes, a 7-day check-in, and daily & weekly challenges."],
      ["Kosmetik & gelar (Menu › Gameplay): baju, ikat kepala, topi, aura, dan gelar di atas nama hero. Hanya tampilan.", "Cosmetics & titles (Menu › Gameplay): outfits, headbands, hats, auras, and a title above your hero's name. Looks only."],
      ["Jalan Pendekar (pohon jurus): mulai Lv 10, pilih satu dari dua jalan per hero dengan bonus pasif bertingkat.", "Warrior's Path (skill tree): from Lv 10, choose one of two paths per hero with tiered passive bonuses."],
      ["Kelemahan & kekebalan bos: tiap bos lemah/kebal terhadap satu status. Temukan sendiri, lalu lihat di Ensiklopedia.", "Boss weaknesses & immunities: each boss is weak/immune to one status. Discover them yourself, then check the Bestiary."],
      ["Mode Bertahan di Cermin Gaib: lawan gelombang musuh tanpa henti dan kejar rekor.", "Survival Mode at the Mystic Mirror: fight endless enemy waves and chase your record."],
      ["Sulit+ (Pendekar Sejati) setelah Bab 10 selesai: tanpa tanda serangan, musuh lebih cepat & sakit.", "Hard+ (True Warrior) after finishing Chapter 10: no attack warnings, faster and deadlier enemies."],
      ["Tombol Bagikan: kartu gambar untuk momen membanggakan (bos tumbang, ikan langka, bab tamat) & di Menu jeda.", "Share button: an image card for proud moments (boss down, rare fish, chapter cleared) & in the pause menu."],
    ],
    ubah: [
      ["Rasa bertarung: angka damage meletup, tulisan KRITIS!, getar HP, tepi layar merah saat terluka. Guncangan & getar bisa dimatikan di Pengaturan › Layar.", "Combat feel: popping damage numbers, CRITICAL! text, phone vibration, red screen edges when hurt. Shake & vibration can be turned off in Settings › Display."],
      ["Memancing: kamera diperbesar dan mengikuti hero & pelampung, seperti catur.", "Fishing: the camera zooms in and follows your hero & float, like chess."],
      ["Saat main catur atau memancing, HUD lain disembunyikan; hanya tombol yang dibutuhkan yang tampil.", "While playing chess or fishing, the rest of the HUD hides; only the buttons you need remain."],
    ],
    baik: [
      ["Memuat Kode Save dari Menu kini benar-benar mengganti progres (sebelumnya tertimpa simpan otomatis).", "Loading a Save Code from the Menu now really replaces your progress (it used to be overwritten by autosave)."],
      ["Kartu tips tidak lagi muncul di tengah catur atau memancing.", "Tip cards no longer pop up during chess or fishing."],
    ],
  },
  {
    versi: "0.9.2-beta", tanggal: ["24 November 2026", "November 24, 2026"],
    judul: ["Pencapaian, Harta & Memancing", "Achievements, Treasure & Fishing"],
    baru: [
      ["Pencapaian: lebih dari 45 target (petualangan, pertarungan, koleksi, catur, rahasia) dengan hadiah koin & serpih. Lihat di Menu › Gameplay › Pencapaian.", "Achievements: 45+ goals (adventure, combat, collection, chess, secret) with coin & shard rewards. See Menu › Gameplay › Achievements."],
      ["Harta karun di semua dunia: 2–3 peti tersembunyi tiap area, ada yang di dalam batu retak (pukul 3×) dan ada yang terkunci sampai bos area dikalahkan. Hitungannya tampil di peta besar.", "Treasure in every world: 2–3 hidden chests per area, some inside cracked rocks (hit 3×) and some sealed until the area's boss falls. The count shows on the big map."],
      ["Event Memancing bersama Pak Udin: 10 jenis ikan di sungai desa dan dermaga Kampung Nelayan, jual tangkapan & lengkapi koleksi.", "Fishing event with Pak Udin: 10 kinds of fish in the village river and Fishermen's Village pier; sell your catch & complete the collection."],
    ],
    ubah: [
      ["Memancing langsung di dunia game: hero berdiri di tepi air dan pelampung tampil di sungai/laut, tanpa kotak popup. Hasil tangkapan tetap terlihat walau tombol ditekan beruntun, dan menarik terlalu cepat membuat ikan kabur.", "Fishing happens right in the game world: your hero stands at the water's edge and the float appears in the river/sea, no popup box. Your catch stays visible even if you spam the button, and pulling too early scares the fish."],
      ["Catur Laga dimainkan di papan yang digelar di tanah Desa Wanasari: hero & Pak Wowo berdiri di samping papan, kamera menyorot papan, dan petak diketuk langsung di layar game.", "Battle Chess is played on a board laid out on the ground in Wanasari Village: your hero and Pak Wowo stand beside it, the camera focuses on it, and you tap squares right in the game view."],
      ["Slot jimat ke-4 terbuka di level 50.", "A 4th charm slot unlocks at level 50."],
      ["Tulisan di komputer lebih besar, termasuk percakapan, notifikasi, dan tulisan panah misi.", "Larger text on computers, including dialogue, notifications, and the quest arrow label."],
      ["Notifikasi barang pindah ke tengah kiri layar; joystick HP sedikit ke kanan.", "Item notifications moved to the middle-left; the phone joystick moved slightly right."],
      ["Kartu hero di layar pilih karakter lebih rapi, dan deskripsinya tampil di HP.", "Hero cards on the character screen are tidier, with descriptions shown on phones."],
    ],
    baik: [
      ["Ikon jeda di komputer kini tepat di tengah tombolnya.", "The pause icon on computers is now centered in its button."],
    ],
  },
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
      ["Tutorial bertahap: latihan Ki Sabda kini hanya 4 dasar, dan mekanik lain (jamu, hindar sempurna, peta, poin jurus, jimat, pamungkas, debuff, teleport, cermin) diajarkan lewat kiat saat pertama kali dibutuhkan.", "Step-by-step tutorial: Ki Sabda's training now covers just 4 basics, and other mechanics (jamu, perfect dodge, map, skill points, charms, ultimate, ailments, teleport, mirrors) are taught through tips the first time you need them."],
      ["Ikon Jimat, Jurus, dan tombol Jurus 2 muncul setelah kamu membutuhkannya, jadi layar awal lebih lega.", "The Charms and Skills icons and the Skill 2 button appear once you need them, so the opening screen is less cluttered."],
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
      ["HP dengan browser lama: game tidak lagi error lalu layar hitam saat masuk. Terima kasih atas laporannya!", "Phones with older browsers: the game no longer errors and goes black on entry. Thanks for the report!"],
      ["Kalau terjadi error, game tetap berjalan (tidak membeku).", "If an error happens, the game keeps running instead of freezing."],
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
