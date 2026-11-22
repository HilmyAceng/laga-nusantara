// =====================================================================
// ENSIKLOPEDIA MUSUH (Menu › Gameplay › Ensiklopedia Musuh)
// Kumpulan semua musuh & bos. Pencatatan di S.bestiari[jenis] = { lihat: true, kalah: n }:
//  - "lihat" saat musuh itu pernah berada dekat pemain (terlihat di layar)
//  - "kalah" bertambah tiap musuh itu dikalahkan (termasuk bos Cermin Gaib)
// Daftar: kartu potret. Belum pernah ditemui = bayangan hitam + "???".
// Ketuk kartu → detail: kisah singkat, statistik, tempat, debuff, sifat, dan untuk
// bos: julukan, jumlah fase, jurus khas, jimat legenda.
// Potret digambar dengan drawMonster() yang sama seperti di game (lalu disalin).
// =====================================================================
"use strict";

// kisah singkat tiap musuh [Indonesia, English]
const KISAH_MUSUH = {
  kera: ["Kera hutan yang biasanya cuma mencuri pisang. Sejak kabut merah turun, mereka melempari orang dengan batu.", "Forest monkeys that used to only steal bananas. Since the red mist fell, they pelt people with stones."],
  kelelawar: ["Berkelompok di candi dan gua, menukik cepat dari kegelapan.", "They swarm temples and caves, diving swiftly out of the dark."],
  babi: ["Babi hutan bertaring yang menyeruduk tanpa pikir panjang. Tandukannya bisa membuat lumpuh sesaat.", "Tusked boars that charge without a second thought. Their ram can briefly stun."],
  hantuKabut: ["Arwah yang lahir dari kabut rawa. Sentuhannya membuat kepala pening.", "Spirits born of the swamp mist. Their touch leaves you dizzy."],
  buaya: ["Buaya rawa yang menunggu di air hitam, lalu menerjang tiba-tiba.", "Swamp crocodiles lurking in black water, lunging without warning."],
  tuyul: ["Makhluk kecil yang gemar mencuri koin. Kalahkan dia untuk merebut kembali kantongmu.", "Tiny imps that love stealing coins. Defeat them to win your purse back."],
  kepiting: ["Kepiting karang bercangkang keras yang merusak jaring nelayan.", "Hard-shelled reef crabs that wreck the fishermen's nets."],
  banaspati: ["Bola api hidup dari kawah Gunung Geni. Membakar apa pun yang disentuhnya.", "Living fireballs from Mount Geni's crater. They burn whatever they touch."],
  ularWelang: ["Ular belang berbisa yang bersembunyi di semak Hutan Larangan.", "Banded venomous snakes hiding in the Forbidden Forest's brush."],
  uburUbur: ["Ubur-ubur yang tubuhnya menyala seperti bara di air dangkal.", "Jellyfish whose bodies glow like embers in the shallows."],
  harimauKumbang: ["Harimau hitam pemburu senyap. Terkamannya cepat dan mematikan.", "A silent black tiger. Its pounce is swift and deadly."],
  hantuBajak: ["Arwah bajak laut yang masih mencari harta karunnya.", "Ghosts of pirates still searching for their treasure."],
  arcaHidup: ["Arca batu yang bangkit karena kabut. Keras, lambat, tapi pukulannya berat.", "Stone statues woken by the mist. Tough and slow, but they hit hard."],
  elangBatu: ["Elang berbulu sekeras batu yang menyambar dari langit Negeri Awan.", "Eagles with stone-hard feathers diving from the Cloud Realm skies."],
  anakNaga: ["Anak-anak Naga Kencana. Kecil, tapi napas apinya sudah panas.", "Hatchlings of the Golden Dragon. Small, but their fire breath is already hot."],
  tikusSawah: ["Tikus raksasa pemakan padi yang membuat petani menangis.", "Giant rice-eating rats that bring farmers to tears."],
  bayangan: ["Bayangan tanpa wujud yang membuat langkahmu terasa berat.", "Formless shadows that make your steps feel heavy."],
  jerangkong: ["Kerangka prajurit kuno yang terbangun dari makam.", "Skeletons of ancient soldiers risen from the tomb."],
  belutListrik: ["Belut gua laut yang menyetrum siapa pun yang mendekat.", "Sea-cave eels that shock anyone who comes close."],
  rohAngin: ["Roh angin yang lincah dan sulit dikejar.", "Nimble wind spirits that are hard to catch."],
  prajuritBayang: ["Pasukan Prabu Kalamurka, setia sampai mati, bahkan setelah mati.", "King Kalamurka's soldiers, loyal unto death, and beyond."],
  lelembut: ["Makhluk halus Negeri Bayang yang membisikkan ketakutan.", "Wraiths of the Shadow Realm that whisper fear."],
  genderuwo: ["Raksasa berbulu penunggu gua di tepi hutan. Bos pertama yang menguji keberanianmu.", "A hairy giant guarding the cave by the forest. The first boss to test your courage."],
  dwarapala: ["Arca penjaga gerbang candi yang hidup kembali. Gadanya mampu meremukkan batu.", "The temple's gate-guardian statue come to life. Its club can crush stone."],
  buayaPutih: ["Buaya putih tua penguasa Rawa Kabut, konon berumur ratusan tahun.", "The ancient white crocodile ruling the Misty Swamp, said to be centuries old."],
  rajaBanaspati: ["Raja segala banaspati, sumber api dari kabut merah Gunung Geni.", "King of all banaspati, the fire at the heart of Mount Geni's red mist."],
  silumanUlar: ["Siluman berwujud separuh ular yang menguasai Hutan Larangan.", "A half-serpent spirit ruling the Forbidden Forest."],
  panglimaKarang: ["Panglima raksasa dari karang yang menjaga Kuil Samudra.", "A giant coral warlord guarding the Sea Temple."],
  kelabang: ["Kelabang raksasa yang bersarang di lapangan Hutan Batu.", "A giant centipede nesting in the Stone Forest clearing."],
  naga: ["Naga emas penguasa puncak gunung, makhluk terkuat di Negeri Awan.", "The golden dragon of the mountain peak, mightiest creature of the Cloud Realm."],
  rajaJerangkong: ["Raja tua yang menolak beristirahat dan memimpin pasukan tulang.", "An old king who refuses to rest and commands an army of bones."],
  guritaRaksasa: ["Gurita raksasa yang menyembunyikan diri dengan tinta pekat.", "A giant octopus that hides in clouds of thick ink."],
  rajawaliPetir: ["Burung raksasa penguasa Istana Awan yang memanggil badai petir.", "The giant bird lord of the Cloud Palace who summons thunderstorms."],
  penjagaMenara: ["Penjaga Menara Kala yang menguasai waktu dengan loncengnya.", "Warden of Kala Tower, who bends time with its bell."],
  kalamurka: ["Raja Negeri Bayang, sumber kabut merah. Di balik amarahnya tersimpan duka yang dalam.", "King of the Shadow Realm and source of the red mist. Behind his rage lies a deep grief."],
};

// daftar musuh (tanpa boneka latihan): monster biasa urut level, lalu bos urut level
const daftarMusuh = () => {
  const semua = Object.keys(MONSTERS).filter((k) => !MONSTERS[k].latihan);
  const urut = (a, b) => MONSTERS[a].lv - MONSTERS[b].lv;
  return [...semua.filter((k) => !MONSTERS[k].boss).sort(urut), ...semua.filter((k) => MONSTERS[k].boss).sort(urut)];
};
const catatan = (k) => (S.bestiari = S.bestiari || {})[k] || null;
function catatLihat(k) { const b = (S.bestiari = S.bestiari || {}); if (!b[k]) { b[k] = { lihat: true, kalah: 0 }; saveSoon(); } }
function catatKalah(k) { catatLihat(k); S.bestiari[k].kalah++; }

// save lama: bos yang pernah dikalahkan langsung tercatat
{
  const lengkapiAsli = lengkapiSave;
  lengkapiSave = function () {
    lengkapiAsli();
    if (!S) return;
    for (const k of Object.keys(S.bos || {})) if (MONSTERS[k] && !catatan(k)) S.bestiari[k] = { lihat: true, kalah: 1 };
  };
}
// musuh yang dekat dengan pemain = sudah ditemui (dicek 4× per detik)
let lihatT = 0;
UPDATE_TAMBAHAN.push((dt) => {
  lihatT -= dt; if (lihatT > 0 || !S || !P) return; lihatT = 0.25;
  for (const m of monsters) if (!m.dead && !m.d.latihan && !catatan(m.type) && dist(P, m) < 340) catatLihat(m.type);
});
// musuh dikalahkan (killMonster bisa berhenti di tengah: bos naik fase, boneka latihan)
{
  const killAsli = killMonster;
  killMonster = function (m) { const sudah = m.dead; killAsli(m); if (!sudah && m.dead && !m.d.latihan) catatKalah(m.type); };
}

// ---------- Potret ----------
// drawMonster menggambar ke kanvas utama; gambar sebentar di pojok, salin, lalu frame
// berikutnya menimpanya lagi. Hasilnya disimpan sebagai gambar (dataURL).
const potretMusuh = {};
function buatPotret(k) {
  if (potretMusuh[k]) return potretMusuh[k];
  const d = MONSTERS[k], uk = 120;
  const skala = Math.min(1.6, (uk * 0.62) / Math.max(d.h || 40, (d.r || 16) * 2.2));
  const m = makeMonster(k, { x: 0, y: 0 });
  m.state = "idle"; m.wx = 1; m.flash = 0; m.aggro = false; m.seen = 0; m.hp = m.d.hp;
  const px = DPR, off = document.createElement("canvas"); off.width = off.height = uk * px;
  try {
    ctx.save(); ctx.setTransform(px, 0, 0, px, 0, 0); ctx.clearRect(0, 0, uk, uk);
    ctx.translate(uk / 2, uk * 0.86); ctx.scale(skala, skala); ctx.translate(-m.x, -m.y);
    const simpanP = { x: P.x, y: P.y }; P.x = m.x + 100; P.y = m.y;   // menghadap ke kanan
    drawMonster(m, 1.2);
    P.x = simpanP.x; P.y = simpanP.y;
    ctx.restore();
    off.getContext("2d").drawImage(cv, 0, 0, uk * px, uk * px, 0, 0, uk * px, uk * px);
    potretMusuh[k] = off.toDataURL();
  } catch (e) { ctx.restore(); potretMusuh[k] = ""; }
  return potretMusuh[k];
}

// ---------- Teks detail ----------
const namaDebuff = (j) => t("debuff." + j);
function debuffMusuh(k) {
  const d = MONSTERS[k], out = new Set();
  for (const x of [].concat(d.debuff || [])) if (x && x.jenis) out.add(x.jenis);
  if (DEBUFF_TAMBAHAN[k]) out.add(DEBUFF_TAMBAHAN[k].jenis);
  return [...out].map(namaDebuff);
}
function sifatMusuh(k) {
  const d = MONSTERS[k], s = [];
  s.push(t((d.range || 0) > 120 || d.tembak || d.proj ? "ens.sJauh" : "ens.sDekat"));
  if (d.fly) s.push(t("ens.sTerbang"));
  if (d.charge) s.push(t("ens.sTerjang"));
  if (d.tembak) s.push(t("ens.sTembak"));
  if (d.copet) s.push(t("ens.sCopet"));
  if (d.speed >= 110) s.push(t("ens.sCepat")); else if (d.speed <= 60) s.push(t("ens.sLambat"));
  return s;
}
function tempatMusuhTeks(k) {
  const tp = typeof tempatMonster === "function" ? tempatMonster(k) : null;
  return tp && AREAS[tp.area] ? AREAS[tp.area].nama : "?";
}

// ---------- Halaman ----------
let musuhDipilih = null;
function isiEnsiklopedia() {
  const list = daftarMusuh();
  const lihat = list.filter((k) => catatan(k)).length, kalah = list.filter((k) => catatan(k) && catatan(k).kalah > 0).length;
  if (musuhDipilih) return isiDetailMusuh(musuhDipilih);
  const kartu = (k) => {
    const c = catatan(k), d = MONSTERS[k];
    return `<button type="button" class="ens-kartu ${c ? "" : "ens-belum"} ${d.boss ? "ens-bos" : ""}" data-musuh="${k}">
      <img src="${buatPotret(k)}" alt="" draggable="false">
      <b>${c ? d.name : "???"}</b>
      <small>${c ? (c.kalah ? t("ens.kalahN", { n: c.kalah }) : t("ens.ditemui")) : "Lv " + d.lv}</small>
    </button>`;
  };
  const biasa = list.filter((k) => !MONSTERS[k].boss), bos = list.filter((k) => MONSTERS[k].boss);
  $("ensIsi").innerHTML = `
    <div class="st-box"><b>${t("ens.ringkas", { lihat, kalah, total: list.length })}</b>
      <div class="st-bar"><i style="width:${(100 * lihat) / list.length}%"></i></div>
      <small>${t("ens.info")}</small></div>
    <h3>${t("ens.biasa")} · ${biasa.filter((k) => catatan(k)).length} / ${biasa.length}</h3>
    <div class="ens-grid">${biasa.map(kartu).join("")}</div>
    <h3>${t("ens.bos")} · ${bos.filter((k) => catatan(k)).length} / ${bos.length}</h3>
    <div class="ens-grid">${bos.map(kartu).join("")}</div>`;
}
function isiDetailMusuh(k) {
  const d = MONSTERS[k], c = catatan(k);
  const kembali = `<button type="button" class="ens-kembali" data-ens="daftar">← ${t("ens.daftar")}</button>`;
  if (!c) {
    $("ensIsi").innerHTML = `${kembali}<div class="ens-detail ens-belum"><img src="${buatPotret(k)}" alt=""><div><h3>???</h3>
      <p>${t("ens.belumTeks", { lv: d.lv })}</p></div></div>`;
    return;
  }
  const bos = d.boss, A = bos && typeof ADEGAN_BOS !== "undefined" && ADEGAN_BOS[k];
  const baris = (judul, isi) => `<div class="st-box"><small>${judul}</small><b>${isi}</b></div>`;
  const deb = debuffMusuh(k), khas = bos && typeof KHAS !== "undefined" && KHAS[k] ? KHAS[k].map((x) => t("khas." + x.id)).join(", ") : "";
  const leg = bos && typeof legendaBos === "function" && legendaBos(k);
  const fase = bos && typeof faseMaksBos === "function" ? faseMaksBos({ type: k, tingkat: 0 }) : 0;
  $("ensIsi").innerHTML = `${kembali}
    <div class="ens-detail ${bos ? "ens-bos" : ""}">
      <img src="${buatPotret(k)}" alt="">
      <div>
        <h3>${d.name}</h3>
        ${A ? `<p class="ens-julukan">${pilihBahasa(A.sub)}</p>` : ""}
        <p>${pilihBahasa(KISAH_MUSUH[k] || ["", ""])}</p>
        ${A ? `<p class="ens-kutip">“${pilihBahasa(A.kata)}”</p>` : ""}
      </div>
    </div>
    <div class="st-grid">
      ${baris(t("ens.level"), "Lv " + d.lv)}
      ${baris(t("st.nyawa"), d.hp)}
      ${baris(t("st.serang"), d.atk)}
      ${baris(t("ens.kecepatan"), d.speed)}
      ${baris(t("ens.hadiah"), `${d.exp} EXP · ${d.gold[0]}-${d.gold[1]} ${t("ens.koin")}`)}
      ${baris(t("ens.tempat"), tempatMusuhTeks(k))}
      ${baris(t("ens.kalah"), c.kalah + "×")}
      ${bos ? baris(t("ens.fase"), fase) : ""}
    </div>
    <h3>${t("ens.sifat")}</h3>
    <ul class="st-list">${sifatMusuh(k).map((x) => `<li>${x}</li>`).join("")}
      ${deb.length ? `<li>${t("ens.debuff", { daftar: deb.join(", ") })}</li>` : ""}
      ${khas ? `<li>${t("ens.khas", { daftar: khas })}</li>` : ""}
      ${leg ? `<li>${t("ens.legenda", { nama: namaJimat(leg) })}</li>` : ""}
    </ul>
    <p class="set-note">${t("ens.catatanAngka")}</p>`;
}
$("ensIsi").addEventListener("click", (e) => {
  const b = e.target.closest("[data-musuh]");
  if (b) { musuhDipilih = b.dataset.musuh; sfx.click(); isiEnsiklopedia(); $("pauseBox").scrollTop = 0; $("ensIsi").scrollTop = 0; return; }
  if (e.target.closest("[data-ens='daftar']")) { musuhDipilih = null; sfx.click(); isiEnsiklopedia(); }
});
