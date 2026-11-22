// =====================================================================
// STATUS KARAKTER & PINTASAN HUD
//  - Halaman Status Karakter: tombol 👤 di HUD, atau tombol Tab / C (buka & tutup):
//    kelas, level, EXP, kekuatan (nyawa, serangan, kritis, gerak, pertahanan, hindar, jamu),
//    total bonus dari jimat + ramuan + pasif, dan catatan petualangan.
//  - Tombol pintasan di kiri koin: ⚔ Jurus (lencana = poin jurus sisa) · 💎 Jimat · 👤 Status.
//    Halaman Jurus & Jimat hanya dibuka dari sini (atau K / I); tombol Kembali = lanjut main.
// =====================================================================
"use strict";

const persen = (v) => Math.round(v * 100) + "%";
// kotak kecil: judul, angka besar, keterangan hijau (opsional)
const kotakStat = (judul, nilai, ket) => `<div class="st-box"><small>${judul}</small><b>${nilai}</b>${ket ? `<em>${ket}</em>` : ""}</div>`;

// bonus jimat/ramuan yang ditampilkan di daftar (kunci efek dengan angka persen)
const EFEK_STATUS = ["atk", "hp", "tahan", "bos", "cd", "koin", "exp", "gerak", "jamu", "tenaga", "pamungkas", "hindarCd", "kritis", "kritisKali", "hisap", "duri", "lumpuh"];

function isiHalamanStatus() {
  const C = CLASSES[S.cls], need = expNeed(S.lv);
  const kritis = ATURAN.kritis.peluang + bonusStat("kritis"), kritisKali = ATURAN.kritis.kali + bonusStat("kritisKali");
  const gerak = Math.round(C.speed * (1 + bonusStat("gerak"))), tahan = bonusStat("tahan");
  const atkB = atkPower(), atkD = atkDasar();
  const bosKalah = Object.keys(S.bos || {}).filter((k) => MONSTERS[k] && MONSTERS[k].boss).length;
  const totalBos = Object.values(MONSTERS).filter((d) => d.boss).length;

  // daftar bonus: jimat & ramuan (bonusStat) + pasif yang punya rank
  const bonus = EFEK_STATUS.filter((k) => bonusStat(k) > 0).map((k) => t("efek." + k, { n: Math.round(bonusStat(k) * 100) }));
  for (const p of PASIF) if (rankPasif(p.id) > 0) bonus.push(`${bahasa === "en" && p.en ? p.en.name : p.name} Rank ${rankPasif(p.id)}`);

  $("statusIsi").innerHTML = `
    <div class="st-box"><b>${t("st.kelas", { kelas: C.name, lv: S.lv })}</b>
      <div class="st-bar"><i style="width:${levelMaks() ? 100 : Math.min(100, (100 * S.exp) / need)}%"></i></div>
      <small>${levelMaks() ? t("st.expMaks") : t("st.exp", { a: S.exp, b: need })}</small></div>
    <h3>${t("st.utama")}</h3>
    <div class="st-grid">
      ${kotakStat(t("st.nyawa"), `${Math.ceil(P.hp)} / ${maxHp()}`)}
      ${kotakStat(t("st.serang"), atkB, atkB !== atkD ? t("st.dasar", { n: atkD }) : "")}
      ${kotakStat(t("st.senjata"), "+" + S.weapon)}
      ${kotakStat(t("st.kritis"), persen(kritis))}
      ${kotakStat(t("st.kritisKali"), "×" + kritisKali.toFixed(2))}
      ${kotakStat(t("st.gerak"), gerak, gerak !== C.speed ? t("st.dasar", { n: C.speed }) : "")}
      ${kotakStat(t("st.tahan"), tahan > 0 ? "-" + persen(tahan) : "100%")}
      ${kotakStat(t("st.hindar"), `${P.lapis} / ${lapisMaks()}`, t("st.hindarIsi", { n: isiUlangHindar().toFixed(1) }))}
      ${kotakStat(t("st.jamuPulih"), persen(ATURAN.jamuPulih * (1 + bonusStat("jamu"))))}
    </div>
    <h3>${t("st.bonus")}</h3>
    ${bonus.length ? `<ul class="st-list">${bonus.map((b) => `<li>${b}</li>`).join("")}</ul>` : `<p class="st-list">${t("st.tidakAda")}</p>`}
    <h3>${t("st.lain")}</h3>
    <div class="st-grid">
      ${kotakStat(t("st.kills"), S.kills)}
      ${kotakStat(t("st.bos"), `${bosKalah} / ${totalBos}`)}
      ${kotakStat(t("st.koin"), S.gold)}
      ${kotakStat(t("st.jamu"), S.potions)}
      ${kotakStat(t("st.poin"), poinSisa())}
      ${kotakStat(t("st.jimat"), `${S.jimat.pakai.length} / ${slotJimat()}`)}
    </div>`;
}

// ---------- Pintasan di HUD ----------
$("btnStatus").addEventListener("click", () => bukaHalamanMenu("status"));
$("btnJurusHud").addEventListener("click", () => bukaHalamanMenu("jurus"));
$("btnJimatHud").addEventListener("click", () => bukaHalamanMenu("jimat"));
$("btnJurusBack").addEventListener("click", () => { togglePause(); showUI(); });
$("btnStatusBack").addEventListener("click", () => { togglePause(); showUI(); });
addEventListener("keydown", (e) => {
  if (e.repeat) return;
  if (ACTION_OF[keyName(e)] !== "menuStatus") return;
  if (e.key === "Tab" && (mode === "play" || mode === "pause")) e.preventDefault();   // jangan pindah fokus tombol
  bukaHalamanMenu("status");
});
// lencana poin jurus sisa di tombol ⚔ (dipanggil dari refreshHud)
function hudPintasan() {
  const n = S && S.jurus ? poinSisa() : 0, el = $("poinHud");
  setText(el, "poinHud", String(n));
  if (el.hidden !== !(n > 0)) el.hidden = !(n > 0);
}
