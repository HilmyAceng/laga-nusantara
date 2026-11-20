// =====================================================================
// TANTANGAN BOS (CERMIN GAIB)
// Sentuh cermin di sarang bos → popup daftar tingkat kesulitan 1-7:
//   - level karakter yang disarankan
//   - hadiah (koin, EXP, jamu)
//   - tingkat N terkunci sampai tingkat N-1 dimenangkan
// Semakin tinggi tingkat: nyawa, serangan, dan kecepatan bos naik.
// Angka-angkanya di ATURAN.cermin (config.js).
// Progres: S.cermin[jenis bos] = tingkat tertinggi yang sudah dimenangkan.
// =====================================================================
"use strict";

let tantangNpc = null;   // cermin yang sedang dipakai

const tingkatMenang = (jenis) => (S.cermin && S.cermin[jenis]) || 0;
const levelSaran = (jenis, n) => MONSTERS[jenis].lv + ATURAN.cermin.levelTambah * (n - 1);
// Data bos untuk tingkat n (salinan MONSTERS[jenis] yang diperkuat)
function statTingkat(jenis, n) {
  const d = MONSTERS[jenis], A = ATURAN.cermin, k = n - 1;
  return { ...d, hp: Math.round(d.hp * (1 + A.nyawaTambah * k)), atk: Math.round(d.atk * (1 + A.seranganTambah * k)),
    speed: d.speed * (1 + A.cepatTambah * k), lv: levelSaran(jenis, n), name: d.name + " · " + t("tantang.tk", { n }) };
}
function hadiahTingkat(jenis, n) {
  const d = MONSTERS[jenis], A = ATURAN.cermin;
  return { gold: Math.round(d.gold[0] * A.koin * n), exp: Math.round(d.exp * A.exp * n), potion: n >= A.jamuMulai ? n - A.jamuMulai + 1 : 0 };
}

// ---------- Popup ----------
function bukaTantangan(npc) {
  if (mode !== "dialog" && mode !== "play") return;
  tantangNpc = npc;
  mode = "tantang"; popupDibuka = performance.now();
  isiTantangan();
  showUI();
}
function tutupTantangan() { if (mode !== "tantang") return; mode = "play"; showUI(); }
function isiTantangan() {
  const jenis = bosCermin(), menang = tingkatMenang(jenis), d = MONSTERS[jenis];
  $("tantangNama").textContent = d.name;
  const rows = [];
  for (let n = 1; n <= ATURAN.cermin.tingkat; n++) {
    const kunci = n > menang + 1, sudah = n <= menang, saran = levelSaran(jenis, n), h = hadiahTingkat(jenis, n);
    const titik = Array.from({ length: ATURAN.cermin.tingkat }, (_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("");
    rows.push(`
      <button type="button" class="tk-card${kunci ? " kunci" : ""}${sudah ? " menang" : ""}" data-tk="${n}" ${kunci ? 'aria-disabled="true"' : ""}>
        <span class="tk-head"><b>${t("tantang.tk", { n })}</b><span class="tk-titik">${titik}</span></span>
        <span class="tk-saran${S.lv < saran ? " kurang" : ""}">${t("tantang.saran", { lv: saran })}</span>
        <span class="tk-hadiah"><i class="coin"></i>${t("misi.hadiah")}: ${teksHadiah(h)}</span>
        <span class="tk-status">${t(kunci ? "tantang.terkunci" : sudah ? "tantang.menang" : "tantang.mulai", { n: n - 1 })}</span>
      </button>`);
  }
  $("tantangList").innerHTML = rows.join("");
}
$("tantangList").addEventListener("click", (e) => {
  const b = e.target.closest("[data-tk]");
  if (!b || popupBaruBuka()) return;
  const n = +b.dataset.tk, jenis = bosCermin();
  if (n > tingkatMenang(jenis) + 1) { sfx.hurt(); toast(t("tantang.kunciToast", { n: n - 1 }), false); return; }
  sfx.click();
  const npc = tantangNpc;
  tutupTantangan();
  startSummon(npc, n);
});
$("btnTantangClose").addEventListener("click", tutupTantangan);
$("tantangBox").addEventListener("click", (e) => { if (e.target === e.currentTarget && !popupBaruBuka()) tutupTantangan(); });
