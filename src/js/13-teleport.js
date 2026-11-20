// =====================================================================
// MESIN TELEPORT
// Tiang bendera ajaib. Dua kegunaan:
//   1. Berdiri di dekatnya → nyawa pulih, memakai "energi" mesin.
//      Energi maksimal & kecepatan isi ulangnya di ATURAN.teleport (config.js).
//      Energi terus terisi walau game ditutup (dihitung dari jam).
//   2. Di peta besar (tombol M), klik/ketuk ikon mesin → "Pindah ke ...?" → teleport.
// Letak mesin: `teleport` di tiap area (js/03-peta.js).
// =====================================================================
"use strict";

// Semua mesin di dunia: [{ id, areaId, x, y }] (x, y dalam petak)
const TELEPORTS = Object.entries(AREAS).filter(([, a]) => a.teleport).map(([id, a]) => ({ ...a.teleport, areaId: id }));

// ---------- Energi ----------
// Disimpan di S.tele[id] = { poin, t } (t = jam terakhir dihitung, milidetik).
function teleEnergi(id) {
  const A = ATURAN.teleport, now = Date.now();
  S.tele = S.tele || {};
  const st = S.tele[id] || (S.tele[id] = { poin: A.energiMaks, t: now });
  const tiap = A.isiUlangDetik * 1000;
  if (st.poin >= A.energiMaks) { st.poin = A.energiMaks; st.t = now; }
  else {
    const n = Math.floor((now - st.t) / tiap);
    if (n > 0) { st.poin = Math.min(A.energiMaks, st.poin + n * A.isiUlangPoin); st.t += n * tiap; }
  }
  return st;
}
// detik sampai poin berikutnya terisi
function teleIsiBerikut(id) {
  const st = teleEnergi(id);
  if (st.poin >= ATURAN.teleport.energiMaks) return 0;
  return Math.ceil((ATURAN.teleport.isiUlangDetik * 1000 - (Date.now() - st.t)) / 1000);
}

// Mesin ditaruh di daftar NPCS area (supaya ikut digambar & tampil di peta),
// tapi "diam" = tidak ada tombol Bicara. Interaksinya lewat peta besar.
function makeTeleport(tp) {
  return { id: "tele-" + tp.id, kind: "teleport", tele: tp, name: "Mesin Teleport", x: tp.x * T, y: tp.y * T, face: 0, diam: true };
}
let teleNyala = 0;   // 0..1, efek cahaya saat sedang mengisi nyawa

// Dipanggil tiap frame dari update(): isi nyawa pemain yang berdiri di dekat mesin.
function updateTeleport(dt) {
  teleNyala = Math.max(0, teleNyala - dt * 2);
  if (!P || P.dead) return;
  for (const n of NPCS) {
    if (n.kind !== "teleport" || dist(P, n) > ATURAN.teleport.jarak) continue;
    const mh = maxHp();
    if (P.hp >= mh) continue;
    const st = teleEnergi(n.tele.id);
    if (st.poin < 1) continue;
    const isi = Math.min(ATURAN.teleport.pulihPerDetik * dt, mh - P.hp, st.poin);
    P.hp += isi; st.poin -= isi;
    teleNyala = 1;
    if (Math.random() < 0.5) parts.push({ x: P.x + rand(-14, 14), y: P.y + rand(-4, 4), z: rand(0, 20), vz: rand(40, 90), vx: 0, vy: 0, life: 0.6, max: 0.6, color: "#7dffa8", s: 4, float: true });
    if (P.hp >= mh - 0.01) { P.hp = mh; sfx.drink(); toast("Nyawa pulih penuh", false); }
    saveSoon();
  }
}

// ---------- Pindah lewat peta ----------
let teleTujuan = null;
function tanyaTeleport(tp) {
  if (!P || P.dead) return;
  teleTujuan = tp;
  $("teleText").textContent = `Pindah ke ${AREAS[tp.areaId].nama}?`;
  $("teleAsk").hidden = false;
  $("btnTeleGo").focus({ preventScroll: true });
}
function batalTeleport() { teleTujuan = null; $("teleAsk").hidden = true; }
function jalankanTeleport() {
  const tp = teleTujuan;
  batalTeleport();
  if (!tp) return;
  closeMap();
  sfx.summon();
  goArea(tp.areaId, { x: tp.x, y: tp.y + 1 });   // muncul tepat di bawah tiang
}
$("btnTeleGo").addEventListener("click", jalankanTeleport);
$("btnTeleNo").addEventListener("click", batalTeleport);

// ---------- Gambar ----------
function drawTeleport(n, time) {
  const st = teleEnergi(n.tele.id), A = ATURAN.teleport;
  const dekat = dist(P, n) <= A.jarak, isi = st.poin / A.energiMaks;
  const x = n.x, y = n.y, top = y - 92;
  // lingkaran rune di tanah (menyala saat mengisi nyawa)
  const glow = 0.25 + 0.2 * Math.sin(time * 3) + teleNyala * (dekat ? 0.4 : 0);
  ctx.strokeStyle = `rgba(125,255,168,${glow})`; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.ellipse(x, y, A.jarak * 0.8, A.jarak * 0.42, 0, 0, 6.28); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x, y, A.jarak * 0.55, A.jarak * 0.28, 0, time, time + 4); ctx.stroke();
  // alas batu
  ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.beginPath(); ctx.ellipse(x, y + 2, 20, 7, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#5d5868"; ctx.fillRect(x - 15, y - 12, 30, 12);
  ctx.fillStyle = "#7a7488"; ctx.fillRect(x - 11, y - 18, 22, 7);
  ctx.fillStyle = `rgba(125,255,168,${0.5 + 0.4 * Math.sin(time * 4)})`; ctx.fillRect(x - 3, y - 9, 6, 5);   // batu permata
  // tiang
  ctx.fillStyle = "#b9b2c6"; ctx.fillRect(x - 2.5, top, 5, y - 18 - top);
  ctx.fillStyle = "#e8e2f0"; ctx.fillRect(x - 2.5, top, 1.5, y - 18 - top);
  // bendera berkibar (kain dibagi beberapa potong mengikuti gelombang)
  const fw = 34, fh = 20, seg = 8;
  ctx.beginPath(); ctx.moveTo(x + 2.5, top + 4);
  for (let i = 0; i <= seg; i++) { const px = x + 2.5 + (fw * i) / seg; ctx.lineTo(px, top + 4 + Math.sin(time * 6 - i * 0.7) * 3 * (i / seg)); }
  for (let i = seg; i >= 0; i--) { const px = x + 2.5 + (fw * i) / seg; ctx.lineTo(px, top + 4 + fh + Math.sin(time * 6 - i * 0.7) * 3 * (i / seg)); }
  ctx.closePath(); ctx.fillStyle = "#2a9d8f"; ctx.fill();
  ctx.strokeStyle = "#f4b942"; ctx.lineWidth = 1.5; ctx.stroke();
  // lambang di bendera
  ctx.fillStyle = "#f4b942"; ctx.beginPath(); ctx.arc(x + 19, top + 14 + Math.sin(time * 6 - 4) * 1.5, 4, 0, 6.28); ctx.fill();
  // bola cahaya di puncak
  ctx.fillStyle = `rgba(125,255,168,${0.3 + 0.2 * Math.sin(time * 5)})`; ctx.beginPath(); ctx.arc(x, top - 3, 9, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#c8ffd9"; ctx.beginPath(); ctx.arc(x, top - 3, 4, 0, 6.28); ctx.fill();
  // nama + bar energi
  ctx.font = "800 11px Nunito, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = "#7dffa8";
  ctx.fillText(n.name, x, top - 18);
  ctx.fillStyle = "rgba(10,6,20,0.75)"; ctx.fillRect(x - 25, top - 14, 50, 6);
  ctx.fillStyle = "#7dffa8"; ctx.fillRect(x - 24, top - 13, 48 * isi, 4);
  if (dekat) {
    ctx.font = "700 14px Teko, sans-serif"; ctx.fillStyle = "#e8fff0";
    ctx.fillText(`Energi ${Math.floor(st.poin)} / ${A.energiMaks}`, x, y + 20);
  }
}
// ikon kecil untuk peta besar (dx, dy = titik di kanvas peta, u = ukuran 1 piksel layar)
function drawTeleportIcon(c, dx, dy, u, time) {
  c.fillStyle = `rgba(125,255,168,${0.25 + 0.15 * Math.sin(time * 4)})`; c.beginPath(); c.arc(dx, dy, 13 * u, 0, 6.28); c.fill();
  c.strokeStyle = "#e8e2f0"; c.lineWidth = 2 * u; c.beginPath(); c.moveTo(dx - 3 * u, dy + 8 * u); c.lineTo(dx - 3 * u, dy - 9 * u); c.stroke();
  c.fillStyle = "#2a9d8f"; c.strokeStyle = "#f4b942"; c.lineWidth = 1.2 * u;
  c.beginPath(); c.moveTo(dx - 2 * u, dy - 9 * u); c.lineTo(dx + 9 * u, dy - 5 * u); c.lineTo(dx - 2 * u, dy - 1 * u); c.closePath(); c.fill(); c.stroke();
}
