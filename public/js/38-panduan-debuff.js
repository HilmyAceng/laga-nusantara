// =====================================================================
// PANDUAN DEBUFF
//  - Pak Joko bisa ditanya tentang semua debuff (menu "Tanya soal debuff")
//  - Halaman Menu › Pengaturan › Gameplay › Debuff berisi daftar debuff,
//    efeknya, monster yang memberinya, dan cara menyembuhkan.
// =====================================================================
"use strict";

// NPC yang punya menu tanya-jawab sebelum urusan misi/toko/obrolan
const NPC_INFO = {
  joko(npc) {
    openDialog(npc.name, t("joko.sapa"), [
      { label: t("joko.tanya"), primary: true, run: () => jelaskanDebuff(npc) },
      { label: t("joko.lain"), run: () => { closeDialog(); talk(npc, true); } },
    ]);
  },
};
// Monster yang memberi debuff jenis j (nama, dipisah koma)
function sumberDebuff(j) {
  return Object.values(MONSTERS).filter((m) => m.debuff && [].concat(m.debuff).some((d) => d.jenis === j)).map((m) => m.name).join(", ");
}
function jelaskanDebuff(npc) {
  const baris = [["joko", t("joko.pembuka")]];
  for (const j of JENIS_DEBUFF) baris.push(["joko", `${t("debuff." + j)}: ${t("debuff.efek." + j)} ${t("joko.dari", { daftar: sumberDebuff(j) })}`]);
  baris.push(["joko", t(S.penawar ? "joko.penutupPunya" : "joko.penutup")]);
  narasi(baris);
}

// ---------- Halaman menu ----------
function isiPanduanDebuff() {
  $("debuffList").innerHTML = JENIS_DEBUFF.map((j) => `
    <div class="db-item">
      <i class="db-ikon" style="background:${ATURAN.debuff[j].warna}"></i>
      <div>
        <b>${t("debuff." + j)}</b>
        <p>${t("debuff.efek." + j)}</p>
        <small>${t("debuff.dari", { daftar: sumberDebuff(j) })}</small>
      </div>
    </div>`).join("") + `<p class="db-obat">${t(S && S.penawar ? "debuff.obatPunya" : "debuff.obat")}</p>`;
}
