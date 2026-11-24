// =====================================================================
// EVENT
// Kegiatan sampingan yang terbuka setelah bagian cerita tertentu selesai.
// - Ikon Event (bintang) muncul di kiri tombol Jurus begitu event pertama terbuka;
//   berdenyut + lencana "!" selama ada event yang belum dilihat.
// - Ketuk ikon → popup: daftar event (kiri), cuplikan bergerak & penjelasan (kanan),
//   pelacak "Temui ..." di bawah. Tombol pelacak → tanya teleport → langsung ke NPC-nya.
// Event pertama: CATUR bersama Pak Wowo (Desa Wanasari), terbuka setelah cerita
// Dunia 1 selesai (langkah "Bersiap Melaut", akhir Bab 2). Permainannya: 99c-99e.
// Simpanan: S.event = { terbuka: {id: true}, lihat: {id: true}, catur: {...} }.
// =====================================================================
"use strict";

const Lx = (pasangan) => pilihBahasa(pasangan);   // teks [Indonesia, English]
const EVENTS = [
  {
    id: "catur", npc: "wowo", area: "desa", titik: { x: 16.5, y: 15.7 },
    judul: ["Catur Laga", "Battle Chess"],
    sub: ["Bersama Pak Wowo · Dunia 1", "With Pak Wowo · World 1"],
    ringkas: ["Catur biasa — tapi setiap memakan bidak, terjadi DUEL antar-hero!", "Regular chess — but every capture becomes a hero DUEL!"],
    isi: [
      "Pak Wowo, juara catur Desa Wanasari, menantangmu bermain Catur Laga. Pilih hero untuk setiap jenis bidakmu. Saat bidak saling memakan, kedua hero bertarung 20 detik: menang = bidak termakan, kalah = penyerang yang hilang. Tiga tingkat kesulitan, hadiah untuk kemenangan pertama di tiap tingkat.",
      "Pak Wowo, Wanasari's chess champion, challenges you to Battle Chess. Pick a hero for each type of piece. When a piece captures, both heroes fight for 20 seconds: win = the capture succeeds, lose = the attacker is removed. Three difficulty levels, with rewards for your first win at each.",
    ],
    syarat: () => { const i = CERITA.findIndex((l) => l.buka === "kapal"); return S.cerita.idx > i; },
    syaratTeks: ["Selesaikan cerita Dunia 1 (Bab 2)", "Finish the World 1 story (Chapter 2)"],
    // daftar hadiah di popup (HTML <li>), cuplikan bergerak, dan pembuka percakapan
    hadiah: () => { const C = dataEvent().catur || {}; return ["santai", "sedang", "jago"].map((k) => `<li class="${(C.menang || {})[k] ? "dapat" : ""}">${(C.menang || {})[k] ? "✓ " : ""}<b>${t("catur.t." + k)}</b> — ${teksHadiahCatur(k)}</li>`).join(""); },
    trailer: (c, tm) => trailerCatur(c, tm),
    mulai: (npc) => bicaraWowo(npc),
  },
];
// Event lain mendaftar lewat daftarkanEvent({...}) dari file-nya sendiri (mis. 99k-memancing.js)
function daftarkanEvent(e) { if (!EVENTS.some((x) => x.id === e.id)) EVENTS.push(e); }
const dataEvent = () => (S.event = S.event || { terbuka: {}, lihat: {}, catur: {} });
const eventTerbuka = (id) => !!(S && dataEvent().terbuka[id]);
const adaEventBaru = () => EVENTS.some((e) => eventTerbuka(e.id) && !dataEvent().lihat[e.id]);

// ---------- Terbuka ----------
let cekEventT = 0;
UPDATE_TAMBAHAN.push((dt) => {
  cekEventT -= dt; if (cekEventT > 0 || !S) return; cekEventT = 1;
  for (const e of EVENTS) if (!eventTerbuka(e.id) && e.syarat()) {
    dataEvent().terbuka[e.id] = true; saveSoon();
    toast(t("event.baru", { nama: Lx(e.judul) }), true); sfx.quest();
  }
  hudEvent();
});
function hudEvent() {
  const b = $("btnEventHud"); if (!b || !S) return;
  const ada = EVENTS.some((e) => eventTerbuka(e.id));
  if (b.hidden !== !ada) b.hidden = !ada;
  b.classList.toggle("baru", adaEventBaru());
}

// ---------- Popup ----------
let eventDipilih = "catur", eventModeLama = "play", trailerRaf = 0;
function bukaEvent() {
  if (!S || (mode !== "play" && mode !== "pause")) return;
  eventModeLama = mode === "pause" ? "play" : mode;
  if (mode === "pause") togglePause();
  mode = "event"; showUI();
  $("eventBox").hidden = false; sfx.click();
  isiEvent();
}
function tutupEvent() {
  $("eventBox").hidden = true; $("eventTanya").hidden = true; cancelAnimationFrame(trailerRaf);
  if (mode === "event") { mode = "play"; showUI(); }
}
function isiEvent() {
  const D = dataEvent();
  $("eventDaftar").innerHTML = EVENTS.map((e) => {
    const buka = eventTerbuka(e.id);
    return `<button type="button" class="ev-item ${e.id === eventDipilih ? "pilih" : ""} ${buka ? "" : "kunci"}" data-ev="${e.id}">
      <b>${buka ? "" : "🔒 "}${Lx(e.judul)}</b><small>${buka ? Lx(e.sub) : Lx(e.syaratTeks)}</small>${buka && !D.lihat[e.id] ? '<i class="ev-baru">!</i>' : ""}</button>`;
  }).join("") + `<div class="ev-item kunci segera"><b>🔒 ${t("event.segera")}</b><small>${t("event.segeraSub")}</small></div>`;
  const e = EVENTS.find((x) => x.id === eventDipilih), buka = eventTerbuka(e.id);
  if (buka) { D.lihat[e.id] = true; saveSoon(); hudEvent(); }
  const npc = npcById(e.npc), hadiah = e.hadiah ? e.hadiah() : "";
  $("eventDetail").innerHTML = `
    <canvas id="eventTrailer" width="480" height="240"></canvas>
    <h3>${Lx(e.judul)}</h3>
    <p class="ev-ringkas">${Lx(e.ringkas)}</p>
    <p>${Lx(e.isi)}</p>
    ${hadiah ? `<h4>${e.judulHadiah ? Lx(e.judulHadiah) : t("event.hadiah")}</h4><ul class="ev-hadiah">${hadiah}</ul>` : ""}`;
  $("eventLacak").innerHTML = buka
    ? `<span>📍 ${t("event.temui", { npc: npc.name, area: AREAS[e.area].nama })}</span><button type="button" class="go kecil" id="btnEventPergi">${t("event.pergi")}</button>`
    : `<span>🔒 ${Lx(e.syaratTeks)}</span>`;
  const p = $("btnEventPergi"); if (p) p.addEventListener("click", () => tanyaTeleportEvent(e));
  mulaiTrailer(e);
}
$("eventDaftar").addEventListener("click", (ev) => { const b = ev.target.closest("[data-ev]"); if (b) { eventDipilih = b.dataset.ev; sfx.click(); isiEvent(); } });
$("btnEventHud").addEventListener("click", bukaEvent);
$("btnEventTutup").addEventListener("click", tutupEvent);

// tanya teleport → pindah ke NPC → percakapan dimulai otomatis
function tanyaTeleportEvent(e) {
  const npc = npcById(e.npc);
  $("eventTanyaTeks").textContent = t("event.tanyaTele", { npc: npc.name, area: AREAS[e.area].nama });
  $("eventTanya").hidden = false;
  $("btnEventYa").onclick = () => {
    tutupEvent();
    const lanjut = () => setTimeout(() => { const n = NPCS.find((x) => x.id === e.npc); if (n && mode === "play") mulaiEventNpc(e, n); }, 200);
    if (areaId === e.area && dist(P, { x: e.titik.x * T, y: e.titik.y * T }) < 3 * T) return lanjut();
    sfx.summon(); goArea(e.area, e.titik);
    const tunggu = setInterval(() => { if (mode === "play") { clearInterval(tunggu); lanjut(); } }, 150);
  };
  $("btnEventBatal").onclick = () => { $("eventTanya").hidden = true; sfx.click(); };
}
// percakapan pembuka event (sekarang: catur Pak Wowo, 99d-catur-papan.js)
function mulaiEventNpc(e, npc) { if (e.mulai) e.mulai(npc); }

// Pak Wowo bisa diajak bicara setelah event catur terbuka
{
  const bisaAsli = bisaBicara;
  bisaBicara = function (n) { if (n.id === "wowo" && eventTerbuka("catur")) return true; return bisaAsli(n); };
  const talkAsli = talk;
  talk = function (npc, lewat) { if (npc.id === "wowo" && eventTerbuka("catur")) return bicaraWowo(npc); return talkAsli(npc, lewat); };
}
// tanda "!" di atas Pak Wowo selama event belum pernah dimainkan
{
  const tandaAsli = tandaNpc;
  tandaNpc = function (n) { if (n.id === "wowo" && eventTerbuka("catur") && !(dataEvent().catur.main > 0)) return { mark: "!", warna: "#f4b942" }; return tandaAsli(n); };
}

// ---------- Cuplikan bergerak (trailer) ----------
function mulaiTrailer(e) {
  cancelAnimationFrame(trailerRaf);
  const cv = $("eventTrailer"); if (!cv || !e || !e.trailer) return;
  const c = cv.getContext("2d"), mulai = performance.now();
  const gambar = (now) => {
    if ($("eventBox").hidden || !cv.isConnected) return;
    c.clearRect(0, 0, 480, 240);
    e.trailer(c, (now - mulai) / 1000);
    trailerRaf = requestAnimationFrame(gambar);
  };
  trailerRaf = requestAnimationFrame(gambar);
}
function trailerCatur(c, tm) {
  {
    const siklus = tm % 6;
    if (siklus < 3) {   // papan catur mini: kuda putih maju memakan
      const uk = 26, ox = 136, oy = 16;
      for (let r = 0; r < 8; r++) for (let k = 0; k < 8; k++) { c.fillStyle = (r + k) % 2 ? "#8b5e3c" : "#e9d3a9"; c.fillRect(ox + k * uk, oy + r * uk, uk, uk); }
      const tTr = Math.min(1, Math.max(0, (siklus - 1) / 1.2));
      const awal = [5, 6], akhir = [3, 5];
      const pos = [awal[0] + (akhir[0] - awal[0]) * tTr, awal[1] + (akhir[1] - awal[1]) * tTr];
      gambarBidakKanvas(c, "q", false, ox + 5 * uk + uk / 2, oy + 3 * uk + uk / 2, uk * 0.9);
      gambarBidakKanvas(c, "k", false, ox + 4 * uk + uk / 2, oy + 0 * uk + uk / 2, uk * 0.9);
      gambarBidakKanvas(c, "r", true, ox + 0 * uk + uk / 2, oy + 7 * uk + uk / 2, uk * 0.9);
      gambarBidakKanvas(c, "n", true, ox + pos[1] * uk + uk / 2, oy + pos[0] * uk + uk / 2, uk * 0.9);
      if (siklus > 2.3) { c.fillStyle = `rgba(244,185,66,${(siklus - 2.3) / 0.7})`; c.font = "700 46px Teko, sans-serif"; c.textAlign = "center"; c.fillText("DUEL!", 240, 140); }
    } else {   // duel: hero putih vs hero hitam
      const k = siklus - 3;
      c.fillStyle = "#1f1a2e"; c.fillRect(0, 0, 480, 240);
      for (let i = 0; i < 12; i++) for (let j = 0; j < 4; j++) { c.fillStyle = (i + j) % 2 ? "#2b2440" : "#3a3150"; c.fillRect(i * 40, 140 + j * 25, 40, 25); }
      const C1 = CLASSES.jawara, C2 = CLASSES.penyihir, x1 = 150 + Math.sin(k * 5) * 30, x2 = 330;
      c.save(); c.translate(0, 0);
      drawPerson(c, { x: x1, y: 190, face: 0, run: k * 10, moving: true, swing: (k % 0.6) < 0.2 ? 0.15 : 0, swingDur: 0.2, inv: 0, flash: 0 }, { color: C1.color, accent: C1.accent, weapon: C1.weapon, hair: C1.hair }, k, { preview: true });
      drawPerson(c, { x: x2, y: 190, face: Math.PI, run: 0, moving: false, swing: 0, inv: 0, flash: (k % 0.6) < 0.1 ? 0.1 : 0 }, { color: "#3a2a4a", accent: "#b03a2e", weapon: C2.weapon }, k, { preview: true });
      c.restore();
      c.fillStyle = "#e5484d"; c.fillRect(300, 120, 60 * (1 - k / 4), 6); c.fillStyle = "#5ad17a"; c.fillRect(120, 120, 60, 6);
      c.fillStyle = "#f7efe3"; c.font = "800 14px Nunito, sans-serif"; c.textAlign = "center"; c.fillText("0:" + String(20 - Math.floor(k * 4)).padStart(2, "0"), 240, 30);
    }
  }
}
addEventListener("keydown", (e) => { if (mode === "event" && e.key === "Escape") { e.stopImmediatePropagation(); tutupEvent(); } }, true);
