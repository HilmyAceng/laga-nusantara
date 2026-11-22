// =====================================================================
// TINGKAT KESULITAN (Santai / Normal / Sulit)
// Disimpan di save (S.kesulitan). Dipilih di layar judul (untuk permainan baru)
// atau kapan saja di Menu › Pengaturan › Kesulitan.
// Angkanya di ATURAN.kesulitan (config.js):
//   keMusuh  = pengali damage pemain ke musuh (santai > 1 = musuh terasa lebih tipis)
//   dariMusuh= pengali damage musuh ke pemain
//   exp/koin = pengali EXP & koin dari monster
// Dipakai di 10-tarung.js (damageMonster, hurtPlayer, killMonster).
// =====================================================================
"use strict";

const PILIHAN_KESULITAN = ["santai", "normal", "sulit"];
let kesulitanBaru = store.get("laga.kesulitanBaru", "normal");   // pilihan untuk permainan baru (layar judul)

const kesulitanNow = () => (S && ATURAN.kesulitan[S.kesulitan] ? S.kesulitan : "normal");
const kaliKesulitan = (k) => ATURAN.kesulitan[kesulitanNow()][k];

// tombol pilihan (dipakai di layar judul & halaman pengaturan)
function tombolKesulitan(aktif, attr) {
  return PILIHAN_KESULITAN.map((id) => `<button type="button" class="kes-btn kes-${id}" ${attr}="${id}" aria-pressed="${id === aktif}">
    <b>${t("kes." + id)}</b><small>${t("kes." + id + ".desc")}</small></button>`).join("");
}
// layar judul: pilihan untuk permainan baru
function isiKesulitanJudul() {
  $("kesJudul").innerHTML = `<span class="kes-label">${t("kes.judul")}</span>${tombolKesulitan(kesulitanBaru, "data-kesbaru")}`;
}
$("kesJudul").addEventListener("click", (e) => {
  const b = e.target.closest("[data-kesbaru]"); if (!b) return;
  kesulitanBaru = b.dataset.kesbaru; store.set("laga.kesulitanBaru", kesulitanBaru); sfx.click(); isiKesulitanJudul();
});
// halaman Pengaturan › Kesulitan: ganti kapan saja
function isiHalamanKesulitan() {
  $("kesIsi").innerHTML = `<p class="set-note">${t("kes.info")}</p><div class="kes-list">${tombolKesulitan(kesulitanNow(), "data-kes")}</div>`;
}
$("kesIsi").addEventListener("click", (e) => {
  const b = e.target.closest("[data-kes]"); if (!b || !S) return;
  S.kesulitan = b.dataset.kes; sfx.click(); saveSoon(); isiHalamanKesulitan();
  toast(t("kes.diganti", { nama: t("kes." + S.kesulitan) }), false);
});

// permainan baru memakai pilihan di layar judul; save lama tanpa kesulitan = normal
{
  const startAsli = startGame;
  startGame = function (fresh) {
    startAsli(fresh);
    if (fresh) { S.kesulitan = kesulitanBaru; save(); toast(t("kes.mulai", { nama: t("kes." + kesulitanBaru) }), false); }
    else if (!S.kesulitan) S.kesulitan = "normal";
  };
  const buildAsli = buildSelect;
  buildSelect = function () { buildAsli(); isiKesulitanJudul(); };
}
