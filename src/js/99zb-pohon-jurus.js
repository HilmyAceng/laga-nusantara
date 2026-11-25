// =====================================================================
// POHON JURUS: "JALAN PENDEKAR"
// Mulai Lv 10, tiap hero memilih satu dari dua jalan (cabang). Tiap jalan punya
// 4 simpul yang terbuka otomatis di Lv 10 / 20 / 30 / 45 dan memberi bonus pasif.
//  - Cabang A: gaya menyerang. Cabang B: gaya bertahan / lincah.
//  - Pilihan pertama gratis. Ganti jalan bayar koin (sama dengan biaya atur ulang poin jurus).
// Bonus masuk lewat bonusStat() (52-jimat.js), jadi tampil juga di halaman Status.
// Halaman: Menu › Gameplay › Jalan Pendekar. Simpanan: S.jalan = { [kelas]: "a" | "b" }
// =====================================================================
"use strict";

const LV_SIMPUL = [10, 20, 30, 45];
const NAMA_EFEK = {
  atk: ["Serangan", "Attack"], hp: ["Nyawa maks", "Max HP"], tahan: ["Tahan damage", "Damage reduction"], kritis: ["Peluang kritis", "Crit chance"],
  kritisKali: ["Damage kritis", "Crit damage"], gerak: ["Kecepatan gerak", "Move speed"], cd: ["Jeda jurus", "Skill cooldown"], hindarCd: ["Isi ulang hindar", "Dodge recharge"],
  tenaga: ["Tenaga pamungkas", "Ultimate energy"], hisap: ["Hisap nyawa", "Lifesteal"], duri: ["Pantulan damage", "Thorns"], lumpuh: ["Peluang melumpuhkan", "Stun chance"],
};
const J = (a, b) => ({ a, b });   // dua cabang: a (menyerang) & b (bertahan/lincah)
const JALAN = {
  pendekar: J(
    { nama: ["Jalan Harimau", "Tiger's Path"], desc: ["Golok yang haus darah: kritis & serangan.", "A hungry blade: crits & attack."], simpul: [{ atk: 0.06 }, { kritis: 0.05 }, { kritisKali: 0.25 }, { atk: 0.08, hisap: 0.03 }] },
    { nama: ["Jalan Banteng", "Bull's Path"], desc: ["Berdiri teguh di garis depan.", "Stand firm at the front line."], simpul: [{ hp: 0.08 }, { tahan: 0.06 }, { duri: 0.15 }, { hp: 0.1, tahan: 0.06 }] }),
  pemanah: J(
    { nama: ["Mata Elang", "Eagle Eye"], desc: ["Setiap anak panah mencari titik lemah.", "Every arrow seeks a weak spot."], simpul: [{ kritis: 0.06 }, { atk: 0.05 }, { kritisKali: 0.3 }, { kritis: 0.06, atk: 0.06 }] },
    { nama: ["Langkah Angin", "Wind Step"], desc: ["Lincah, cepat, tak tersentuh.", "Nimble, quick, untouchable."], simpul: [{ gerak: 0.06 }, { hindarCd: 0.1 }, { cd: 0.06 }, { gerak: 0.06, hindarCd: 0.1 }] }),
  pendobrak: J(
    { nama: ["Palu Gunung", "Mountain Hammer"], desc: ["Hantaman yang meremukkan dan melumpuhkan.", "Crushing, stunning blows."], simpul: [{ atk: 0.07 }, { lumpuh: 0.04 }, { atk: 0.07 }, { kritisKali: 0.3 }] },
    { nama: ["Benteng Hidup", "Living Fortress"], desc: ["Musuh lelah sebelum kau goyah.", "Foes tire before you waver."], simpul: [{ hp: 0.1 }, { tahan: 0.06 }, { duri: 0.2 }, { hp: 0.1, tahan: 0.06 }] }),
  penyihir: J(
    { nama: ["Api Purba", "Primal Fire"], desc: ["Sihir yang lebih panas dan lebih sering.", "Hotter, more frequent magic."], simpul: [{ atk: 0.06 }, { cd: 0.06 }, { atk: 0.08 }, { kritis: 0.06, cd: 0.06 }] },
    { nama: ["Batin Tenang", "Calm Mind"], desc: ["Tenaga pamungkas cepat penuh.", "Ultimate energy fills quickly."], simpul: [{ tenaga: 0.1 }, { hp: 0.06 }, { cd: 0.08 }, { tenaga: 0.15, tahan: 0.05 }] }),
  dalang: J(
    { nama: ["Lakon Perang", "War Play"], desc: ["Wayang lebih ganas, lebih sering dipanggil.", "Fiercer puppets, summoned more often."], simpul: [{ atk: 0.07 }, { cd: 0.06 }, { atk: 0.07 }, { tenaga: 0.15 }] },
    { nama: ["Kelir Pelindung", "Guarding Screen"], desc: ["Sang dalang yang sulit dijatuhkan.", "A puppeteer hard to bring down."], simpul: [{ hp: 0.08 }, { tahan: 0.05 }, { hindarCd: 0.1 }, { hp: 0.1, duri: 0.15 }] }),
  tabib: J(
    { nama: ["Racun Sirih", "Betel Venom"], desc: ["Pengetahuan ramuan untuk melukai.", "Herb lore turned to harm."], simpul: [{ atk: 0.07 }, { kritis: 0.05 }, { atk: 0.07 }, { hisap: 0.04 }] },
    { nama: ["Tangan Penyembuh", "Healing Hands"], desc: ["Setiap pukulan memulihkan diri.", "Every blow mends you."], simpul: [{ hp: 0.08 }, { hisap: 0.03 }, { tahan: 0.05 }, { hp: 0.1, hisap: 0.03 }] }),
  jawara: J(
    { nama: ["Bayang Belati", "Shadow Blade"], desc: ["Serangan mematikan dari balik bayangan.", "Lethal strikes from the shadows."], simpul: [{ kritis: 0.06 }, { gerak: 0.05 }, { kritisKali: 0.3 }, { kritis: 0.06, atk: 0.06 }] },
    { nama: ["Kulit Malam", "Night Skin"], desc: ["Licin, tangguh, tak mudah tumbang.", "Slippery, tough, hard to fell."], simpul: [{ hindarCd: 0.1 }, { hp: 0.07 }, { tahan: 0.05 }, { hisap: 0.04, hp: 0.08 }] }),
};
const jalanPilihan = () => (S && S.jalan && S.jalan[S.cls]) || null;
const jalanTerbuka = () => S && S.lv >= LV_SIMPUL[0];
function bonusJalan(k) {
  const pil = jalanPilihan(); if (!pil || !JALAN[S.cls]) return 0;
  let n = 0;
  JALAN[S.cls][pil].simpul.forEach((e, i) => { if (S.lv >= LV_SIMPUL[i] && e[k]) n += e[k]; });
  return n;
}
{
  const asli = bonusStat;
  bonusStat = function (k) {
    const n = asli(k) + bonusJalan(k);
    return BATAS_BONUS[k] ? Math.min(BATAS_BONUS[k], n) : n;
  };
}
const teksEfekJalan = (e) => Object.entries(e).map(([k, v]) => `${Lx(NAMA_EFEK[k] || [k, k])} ${k === "cd" ? "−" : "+"}${Math.round(v * 100)}%`).join(" · ");

// ---------- Halaman Menu › Gameplay › Jalan Pendekar ----------
{
  const v = document.createElement("div");
  v.className = "pview"; v.dataset.view = "jalan"; v.hidden = true;
  v.innerHTML = `<p class="eyebrow" id="jalanEyebrow"></p><h1 id="jalanJudul"></h1><p class="set-note" id="jalanKet"></p>
    <div class="jalan-grid" id="jalanIsi"></div>
    <div class="menu"><button class="go alt back go-dinamis" type="button" data-go="gameplay" id="jalanKembali"></button></div>`;
  document.querySelector('#pausePanel .pview[data-view="gaya"]').after(v);
  const b = document.createElement("button");
  b.className = "go alt go-dinamis"; b.type = "button"; b.dataset.go = "jalan"; b.id = "btnJalanMenu";
  $("btnGayaMenu").before(b);
  PAUSE_BACK.jalan = "gameplay";
}
function isiJalan() {
  const JC = JALAN[S.cls], pil = jalanPilihan();
  $("btnJalanMenu").textContent = Lx(["Jalan Pendekar", "Warrior's Path"]);
  $("jalanEyebrow").textContent = Lx(["Gameplay › Pohon Jurus", "Gameplay › Skill Tree"]);
  $("jalanJudul").innerHTML = Lx(["Jalan <span>Pendekar</span>", "Warrior's <span>Path</span>"]);
  $("jalanKembali").textContent = t("h.kembali");
  $("jalanKet").textContent = !jalanTerbuka()
    ? Lx([`Terbuka di Lv ${LV_SIMPUL[0]}. Pilih satu jalan untuk ${CLASSES[S.cls].name}: tiap jalan memberi bonus pasif yang makin kuat di Lv 10, 20, 30, dan 45.`, `Unlocks at Lv ${LV_SIMPUL[0]}. Choose one path for the ${CLASSES[S.cls].name}: each grants passive bonuses that grow at Lv 10, 20, 30, and 45.`])
    : pil ? Lx([`Ganti jalan kapan saja dengan ${hargaReset()} koin.`, `Switch paths anytime for ${hargaReset()} coins.`])
    : Lx(["Pilih jalanmu. Pilihan pertama gratis.", "Choose your path. The first choice is free."]);
  $("jalanIsi").innerHTML = ["a", "b"].map((c) => {
    const J0 = JC[c], aktif = pil === c;
    const simpul = J0.simpul.map((e, i) => {
      const buka = S.lv >= LV_SIMPUL[i];
      return `<li class="${aktif && buka ? "aktif" : buka ? "" : "kunci"}"><b>Lv ${LV_SIMPUL[i]}</b><span>${teksEfekJalan(e)}</span>${aktif && buka ? "✓" : buka ? "" : "🔒"}</li>`;
    }).join("");
    const tombol = !jalanTerbuka() ? "" : aktif ? `<span class="jalan-status">✓ ${Lx(["Jalan aktif", "Active path"])}</span>`
      : `<button type="button" class="go kecil" data-pilih-jalan="${c}" ${pil && S.gold < hargaReset() ? "disabled" : ""}>${pil ? `${Lx(["Ganti", "Switch"])} · 🪙 ${hargaReset()}` : Lx(["Pilih jalan ini", "Choose this path"])}</button>`;
    return `<div class="jalan-kartu${aktif ? " aktif" : ""}"><h3>${c === "a" ? "⚔️" : "🛡️"} ${Lx(J0.nama)}</h3><p>${Lx(J0.desc)}</p><ol>${simpul}</ol>${tombol}</div>`;
  }).join("");
  $("pausePanel").classList.add("wide");
}
{
  const asli = showPauseView;
  showPauseView = function (view, silent) { asli(view, silent); if (view === "jalan") isiJalan(); if (view === "gameplay") $("btnJalanMenu").textContent = Lx(["Jalan Pendekar", "Warrior's Path"]); };
}
$("pausePanel").addEventListener("click", (e) => {
  const b = e.target.closest("[data-pilih-jalan]"); if (!b || !S) return;
  const pil = jalanPilihan();
  if (pil) { if (S.gold < hargaReset()) return; S.gold -= hargaReset(); }
  S.jalan = S.jalan || {}; S.jalan[S.cls] = b.dataset.pilihJalan;
  sfx.quest ? sfx.quest() : sfx.click();
  toast(Lx([`Jalan dipilih: ${JALAN[S.cls][b.dataset.pilihJalan].nama[0]}`, `Path chosen: ${JALAN[S.cls][b.dataset.pilihJalan].nama[1]}`]), true);
  refreshHud(true); saveSoon(); isiJalan();
});
// pemberitahuan saat terbuka & tiap simpul baru
{
  const asli = setelahNaikLevel;
  setelahNaikLevel = function (lv) {
    asli(lv);
    if (lv === LV_SIMPUL[0] && !jalanPilihan()) setTimeout(() => toast(Lx(["🌳 Jalan Pendekar terbuka! Pilih di Menu › Gameplay.", "🌳 Warrior's Path unlocked! Choose it in Menu › Gameplay."]), true), 3200);
    else if (LV_SIMPUL.includes(lv) && jalanPilihan()) setTimeout(() => toast(Lx(["🌳 Simpul jalan baru terbuka!", "🌳 New path node unlocked!"]), false), 3200);
  };
}
