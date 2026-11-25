// =====================================================================
// KELEMAHAN & KEKEBALAN BOS
// Tiap bos punya 1 kelemahan dan 1 kekebalan terhadap status dari jurus & jimatmu:
//   racun · terbakar · berdarah (damage berkala) · lambat · lemah · lumpuh
//  - LEMAH terhadap X: selama bos terkena X, semua seranganmu +35% dan status X
//    pada bos itu lebih sakit (dot ×1,5). Muncul tulisan "LEMAH!".
//  - KEBAL terhadap X: status X langsung hilang dari bos. Muncul tulisan "KEBAL".
// Rahasia ini baru tercatat setelah kamu menemukannya sendiri saat bertarung,
// lalu tampil di Ensiklopedia Musuh & di bar nyawa bos.
// Simpanan: S.kelemahan = { bos: { lemah: true, kebal: true } }
// =====================================================================
"use strict";

const KELEMAHAN_BOS = {
  genderuwo: { lemah: "terbakar", kebal: "lemah" },
  dwarapala: { lemah: "lumpuh", kebal: "berdarah" },
  buayaPutih: { lemah: "lambat", kebal: "racun" },
  rajaBanaspati: { lemah: "lambat", kebal: "terbakar" },
  silumanUlar: { lemah: "berdarah", kebal: "racun" },
  panglimaKarang: { lemah: "lumpuh", kebal: "berdarah" },
  kelabang: { lemah: "terbakar", kebal: "racun" },
  naga: { lemah: "lemah", kebal: "terbakar" },
  rajaJerangkong: { lemah: "lumpuh", kebal: "berdarah" },
  guritaRaksasa: { lemah: "terbakar", kebal: "lambat" },
  rajawaliPetir: { lemah: "lambat", kebal: "lumpuh" },
  penjagaMenara: { lemah: "racun", kebal: "lemah" },
  kalamurka: { lemah: "berdarah", kebal: "lumpuh" },
};
const NAMA_STATUS = {
  racun: ["Racun", "Poison"], terbakar: ["Terbakar", "Burn"], berdarah: ["Berdarah", "Bleed"],
  lambat: ["Lambat", "Slow"], lemah: ["Lemah", "Weaken"], lumpuh: ["Lumpuh", "Stun"],
};
const IKON_STATUS = { racun: "☠", terbakar: "🔥", berdarah: "🩸", lambat: "🐢", lemah: "💔", lumpuh: "⚡" };
const dataKelemahan = () => (S.kelemahan = S.kelemahan || {});
// status yang sedang menempel pada monster
function statusAktif(m, j) {
  if (j === "lambat") return m.lambat > 0;
  if (j === "lemah") return m.lemah > 0;
  if (j === "lumpuh") return m.stun > 0;
  return !!(m.dots && m.dots[j]);
}
function temukan(m, sisi) {
  const K = dataKelemahan(), k = (K[m.type] = K[m.type] || {});
  if (k[sisi]) return;
  k[sisi] = true; saveSoon();
  const j = KELEMAHAN_BOS[m.type][sisi];
  toast(Lx(sisi === "lemah" ? [`Rahasia terungkap: ${m.d.name} lemah terhadap ${NAMA_STATUS[j][0]}!`, `Secret found: ${m.d.name} is weak to ${NAMA_STATUS[j][1]}!`]
    : [`${m.d.name} kebal terhadap ${NAMA_STATUS[j][0]}.`, `${m.d.name} is immune to ${NAMA_STATUS[j][1]}.`]), true);
}

// ---------- Kelemahan: damage tambahan ----------
{
  const asli = damageMonster;
  damageMonster = function (m, amount, ang, kb, opts = {}) {
    const K = m && m.d && m.d.boss && KELEMAHAN_BOS[m.type];
    if (K && !m.dead && statusAktif(m, K.lemah)) {
      amount *= opts.dot === K.lemah ? 1.8 : 1.35;   // dot dari status kelemahannya: 1,35 × 1,8 ≈ ×1,5 lebih sakit dari biasa (setelah pengali lain)
      if (!m.lemahT || m.lemahT <= 0) { m.lemahT = 1.2; numbers.push({ x: m.x, y: m.y - m.d.h - 42, v: Lx(["LEMAH!", "WEAK!"]), life: 0.7, color: "#8ff0a8", size: 18, letup: 0.6 }); }
      temukan(m, "lemah");
    }
    return asli(m, amount, ang, kb, opts);
  };
}
// ---------- Kekebalan: status langsung hilang ----------
UPDATE_TAMBAHAN.push((dt) => {
  for (const m of monsters) {
    if (m.lemahT > 0) m.lemahT -= dt;
    if (m.dead || !m.d.boss) continue;
    const K = KELEMAHAN_BOS[m.type]; if (!K) continue;
    const j = K.kebal; if (!statusAktif(m, j)) continue;
    if (j === "lambat") m.lambat = 0; else if (j === "lemah") m.lemah = 0;
    else if (j === "lumpuh") { m.stun = 0; } else delete m.dots[j];
    if (!m.kebalT || m.kebalT <= 0) { m.kebalT = 1.5; numbers.push({ x: m.x, y: m.y - m.d.h - 42, v: Lx(["KEBAL", "IMMUNE"]), life: 0.7, color: "#c9bfd6", size: 16 }); }
    temukan(m, "kebal");
  }
  for (const m of monsters) if (m.kebalT > 0) m.kebalT -= dt;
});

// ---------- Tampilan: bar nyawa bos & Ensiklopedia ----------
function teksKelemahan(k, panjang) {
  const K = KELEMAHAN_BOS[k], c = S && S.kelemahan && S.kelemahan[k];
  if (!K) return "";
  const l = c && c.lemah ? `${IKON_STATUS[K.lemah]} ${Lx(NAMA_STATUS[K.lemah])}` : "???";
  const b = c && c.kebal ? `${IKON_STATUS[K.kebal]} ${Lx(NAMA_STATUS[K.kebal])}` : "???";
  return panjang ? Lx([`Lemah terhadap: ${l} · Kebal terhadap: ${b}`, `Weak to: ${l} · Immune to: ${b}`]) : `▲${l}  ✕${b}`;
}
{
  const asli = hudFaseBos;
  hudFaseBos = function (boss) {
    const s = asli(boss), c = S && S.kelemahan && S.kelemahan[boss.type];
    return c && (c.lemah || c.kebal) ? `${s}   ${teksKelemahan(boss.type, false)}` : s;
  };
}
{
  const asli = isiDetailMusuh;
  isiDetailMusuh = function (k) {
    asli(k);
    if (!KELEMAHAN_BOS[k] || !catatan(k)) return;
    const ul = $("ensIsi").querySelector(".st-list"); if (!ul) return;
    const li = document.createElement("li");
    li.innerHTML = `<b>${teksKelemahan(k, true)}</b><br><small>${Lx(["Kelemahan & kekebalan terungkap saat kamu memakai status itu dalam pertarungan (dari jurus atau jimat).", "Weaknesses & immunities are revealed when you use that status in battle (from skills or charms)."])}</small>`;
    ul.prepend(li);
  };
}
