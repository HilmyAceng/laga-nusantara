// =====================================================================
// CARA BERMAIN
//  - Ki Sabda (guru silat di Desa Wanasari) memberi misi sampingan "Latihan Dasar":
//    langkah demi langkah (LATIHAN di config.js) mengajari 4 dasar: gerak, serang, jurus,
//    dan berguling. Mekanik lain diajarkan saat dibutuhkan lewat kiat (99h-kiat.js).
//  - Boneka Latihan di desa: tidak bisa kalah, sesekali memukul pelan dengan tanda
//    yang jelas → tempat aman untuk berlatih hindar sempurna & tangkis kapan saja.
//  - Halaman Menu › Pengaturan › Gameplay › Cara Bermain: panduan lengkap.
// =====================================================================
"use strict";

NPC_DATA.push({ id: "sabda", name: "Ki Sabda", area: "desa", x: 14.5 * T, y: 19.6 * T, color: "#8a2b2b", accent: "#f4b942", hat: "#1f1a24", hair: "#d9d4cc", face: 0,
  obrolan: ["Bonekaku tidak pernah mengeluh dipukul. Pakailah sesukamu.", "Musuh yang kuat selalu memberi tanda sebelum menyerang. Bacalah!", "Tangkisan yang tepat lebih berharga dari seribu pukulan."],
  obrolanEn: ["My dummy never complains about being hit. Use it as much as you like.", "Strong foes always give a sign before attacking. Read it!", "One well-timed parry is worth a thousand blows."] });
const BONEKA_TITIK = { x: 17.5 * T, y: 20.3 * T };
SAAT_MASUK_AREA.push((id) => {
  if (id !== "desa" || !S) return;
  monsters.push(makeMonster("boneka", { ...BONEKA_TITIK }));
  if (sideState(SAMPINGAN[0]).status === "none" && S.lv <= 3 && !sapaSabda) { sapaSabda = true; setTimeout(() => toast(t("latihan.ajak"), false), 2500); }
});
let sapaSabda = false;

// ---------- Boneka latihan ----------
AI_BOS.boneka = function (m, dt, dp, toP) {
  m.hp = m.d.hp;
  if (m.state !== "ancang") {
    m.state = "idle"; m.cd -= dt;
    if (!P.dead && dp < 150 && m.cd <= 0) { m.state = "ancang"; m.serang = "sapu"; m.st = 1; m.ang = toP; sfx.click(); }
    return;
  }
  m.st -= dt;
  if (m.st > 0) return;
  effects.push({ kind: "claw", x: m.x, y: m.y - 30, ang: m.ang, r: m.d.range + m.d.r, t: 0, dur: 0.15 }); sfx.claw();
  if (dp <= m.d.range + m.d.r + P.r + 10 && angDiff(toP, m.ang) < 1.3) hurtPlayer(0, m.ang, null, { dari: m, latihan: true });
  m.state = "idle"; m.cd = m.d.cd;
};
GAMBAR_MONSTER.boneka = function (m, time, w) {
  const ayun = m.state === "ancang" ? (1 - m.st) * 1.2 : 0;
  ctx.fillStyle = putih(w, "#6b4a2a"); ctx.fillRect(-3, -50, 6, 50);                        // tiang
  ctx.fillStyle = putih(w, "#d9b46a"); ctx.beginPath(); ctx.ellipse(0, -32, 13, 16, 0, 0, 6.28); ctx.fill();   // badan jerami
  ctx.strokeStyle = putih(w, "#a8843f"); ctx.lineWidth = 1.5; for (const y of [-40, -32, -24]) { ctx.beginPath(); ctx.moveTo(-11, y); ctx.lineTo(11, y + 2); ctx.stroke(); }
  ctx.fillStyle = putih(w, "#e8d6a5"); ctx.beginPath(); ctx.arc(0, -54, 9, 0, 6.28); ctx.fill();           // kepala
  ctx.strokeStyle = "#8a2b2b"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-4, -56); ctx.lineTo(-1, -53); ctx.moveTo(-1, -56); ctx.lineTo(-4, -53); ctx.moveTo(2, -56); ctx.lineTo(5, -53); ctx.moveTo(5, -56); ctx.lineTo(2, -53); ctx.stroke();
  ctx.save(); ctx.translate(0, -38); ctx.rotate(-0.3 - ayun);                               // lengan kayu
  ctx.fillStyle = putih(w, "#6b4a2a"); ctx.fillRect(0, -3, 30, 6); ctx.restore();
};

// ---------- Langkah latihan ----------
const latihanQ = () => SAMPINGAN.find((q) => q.id === "latihan");
function teksLangkah(id) {
  const L = (a) => { const k = KONTROL[a][0]; return KEY_LABEL[k] || (k.length === 1 ? k.toUpperCase() : k); };
  return t("latihan." + id + (isTouch ? "T" : ""), { serang: L("serang"), jurus: L("jurus"), hindar: L("hindar"), jamu: L("jamu"), peta: L("peta"), misi: L("misi"), jeda: L("jeda") });
}
function latihanAksi(jenis) {
  if (!S || !S.side) return;
  const q = latihanQ(), st = sideState(q);
  if (st.status !== "active") return;
  const L = LATIHAN[st.prog];
  if (!L || L.id !== jenis) return;
  st.sub = (st.sub || 0) + 1;
  if (st.sub < L.jumlah) { refreshHud(true); return; }
  st.sub = 0; st.prog++;
  sfx.quest();
  if (st.prog >= q.need) { st.status = "done"; toast(t("toast.misiSelesai2", { judul: q.title, npc: npcById(q.npc).name }), true); }
  else toast(t("latihan.bagus") + " " + teksLangkah(LATIHAN[st.prog].id), false);
  refreshHud(true); saveSoon();
}
// perintah untuk daftar misi & kotak misi (30-daftar-misi.js)
function perintahLatihan(q, prog, selesai) {
  if (selesai) return { perintah: t("misi.lapor", { npc: npcById(q.npc).name }), target: () => tempatNpc(q.npc) };
  const L = LATIHAN[prog], st = sideState(q);
  const hit = L.jumlah > 1 ? ` (${st.sub || 0}/${L.jumlah})` : "";
  return { perintah: `${prog + 1}/${q.need} · ${teksLangkah(L.id)}${hit}`, target: () => ({ area: "desa", x: BONEKA_TITIK.x, y: BONEKA_TITIK.y }) };
}
// langkah "gerak": hitung jarak berjalan; umumkan langkah pertama saat misi diterima
let latihanJalan = 0, latihanUmum = false;
UPDATE_TAMBAHAN.push(function (dt) {
  const st = sideState(latihanQ());
  if (st.status !== "active") return;
  if (!latihanUmum) { latihanUmum = true; if (st.prog === 0) toast(teksLangkah("gerak"), false); }
  if (LATIHAN[st.prog] && LATIHAN[st.prog].id === "gerak" && P.moving) { latihanJalan += dt; if (latihanJalan > 1.2) { latihanJalan = 0; latihanAksi("gerak"); } }
});
// peta, daftar misi & menu gameplay dibuka
const showUIAsli = showUI;
showUI = function () { showUIAsli(); if (mode === "map") latihanAksi("peta"); if (mode === "misi") latihanAksi("misi"); };
const showPauseViewAsli = showPauseView;
showPauseView = function (view, silent) { showPauseViewAsli(view, silent); if (view === "gameplay" || view === "cara") latihanAksi("menu"); };

// ---------- Halaman panduan ----------
function isiCaraBermain() {
  const k = (a) => (isTouch ? "" : kb(a));
  const bagian = ["dasar", "jurus", "pamungkas", "hindar", "tangkis", "jimat", "koin", "musuh", "bos", "debuff"];
  $("caraIsi").innerHTML = bagian.map((b) => `
    <section class="cara">
      <h3>${t("cara." + b + ".judul")}</h3>
      <p>${t("cara." + b + (isTouch ? ".sentuh" : ".isi"), { serang: k("serang"), jurus: k("jurus"), jurus2: k("jurus2"), hindar: k("hindar"), jamu: k("jamu"), pamungkas: k("pamungkas"), peta: k("peta"), misi: k("misi"), mjurus: k("menuJurus"), mjimat: k("menuJimat"), lv: ATURAN.tenaga.bukaLevel, slot: ATURAN.jimat.slotTambah, slot4: ATURAN.jimat.slotTambah2 })}</p>
    </section>`).join("");
}
