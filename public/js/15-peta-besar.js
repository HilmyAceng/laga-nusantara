// =====================================================================
// PETA BESAR
// Buka dengan tombol peta (KONTROL.peta di config.js, awalnya M) atau klik
// peta mini. Permainan berhenti sementara selama peta dibuka.
// Dua tab:
//   Area ini   = area tempatmu berada: posisi kamu, warga, monster, bos, jalan keluar.
//   Peta dunia = ketiga area berjajar, disambung lewat gerbangnya, plus tujuan misi.
// =====================================================================
"use strict";

const bigMap = $("bigMap"), bctx = bigMap.getContext("2d");
let mapTab = "area";
function showMapTab(tab) {
  mapTab = tab;
  $("tabArea").setAttribute("aria-selected", String(tab === "area"));
  $("tabWorld").setAttribute("aria-selected", String(tab === "world"));
  $("legendArea").hidden = tab !== "area";
  $("legendWorld").hidden = tab !== "world";
  // judul: nama area sekarang, atau "Peta Dunia"
  if (tab === "world") { $("mapName").innerHTML = "Peta <span>Dunia</span>"; $("mapSub").textContent = "Peta · Kamu di " + area.nama; }
  else {
    const words = area.nama.split(" "), last = words.pop();
    $("mapName").innerHTML = `${words.join(" ")} <span>${last}</span>`;
    $("mapSub").textContent = "Peta · " + area.sub;
  }
  if (mode === "map") drawBigMap(performance.now() / 1000);
}

function openMap() {
  if (mode !== "play") return;
  mode = "map";
  const k = KONTROL.peta[0];
  $("mapHint").textContent = isTouch ? "Ketuk ✕ atau di luar peta untuk menutup." : `Tab = ganti tab · ${k.length === 1 ? k.toUpperCase() : k} atau Esc = tutup.`;
  showUI();
  showMapTab(mapTab);
}
function closeMap() {
  if (mode !== "map") return;
  mode = "play";
  showUI();
}
function toggleMap() { if (mode === "map") closeMap(); else openMap(); }

// Digambar tiap frame selama peta terbuka (supaya titik "kamu" berdenyut).
function drawBigMap(time) { if (mapTab === "world") drawWorldMap(time); else drawAreaMap(time); }

function drawAreaMap(time) {
  // kanvas mengikuti ukuran tampilnya, dikali DPR supaya tajam
  const cw = Math.round(bigMap.clientWidth * DPR), ch = Math.round(bigMap.clientHeight * DPR);
  if (!cw || !ch) return;
  if (bigMap.width !== cw || bigMap.height !== ch) { bigMap.width = cw; bigMap.height = ch; }
  const c = bctx;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = area.tepi === WALL ? "#120d18" : "#1d3b1b"; c.fillRect(0, 0, cw, ch);
  // ukuran 1 petak di layar, perbandingan peta dijaga
  const pad = 14 * DPR;
  const k = Math.min((cw - pad * 2) / MW, (ch - pad * 2) / MH), ox = (cw - MW * k) / 2, oy = (ch - MH * k) / 2;
  c.imageSmoothingEnabled = false;
  c.drawImage(miniBase, ox, oy, MW * k, MH * k);
  c.strokeStyle = "rgba(255,255,255,0.15)"; c.lineWidth = DPR; c.strokeRect(ox, oy, MW * k, MH * k);
  const X = (wx) => ox + wx / T * k, Y = (wy) => oy + wy / T * k;
  const dot = (x, y, col, r) => { c.fillStyle = col; c.beginPath(); c.arc(x, y, r * DPR, 0, 6.28); c.fill(); };
  const label = (text, x, y, col) => {
    c.font = `800 ${12 * DPR}px Nunito, sans-serif`; c.textAlign = "center";
    c.lineWidth = 3 * DPR; c.strokeStyle = "rgba(10,6,20,0.85)"; c.strokeText(text, x, y); c.fillStyle = col; c.fillText(text, x, y);
  };
  // jalan keluar
  for (const g of area.gerbang) {
    const gx = (g.x0 + g.x1 + 1) / 2 * T, gy = (g.y0 + g.y1 + 1) / 2 * T;
    dot(X(gx), Y(gy), "#8fd3ff", 6);
    const lx = clamp(X(gx), ox + 40 * DPR, ox + MW * k - 40 * DPR);
    label(g.label, lx, Y(gy) - 10 * DPR, "#8fd3ff");
  }
  // monster & bos
  for (const m of monsters) {
    if (m.dead) continue;
    if (m.d.boss) { dot(X(m.x), Y(m.y), "#ff3b3b", 7); label(m.d.name, X(m.x), Y(m.y) - 12 * DPR, "#ff8080"); }
    else dot(X(m.x), Y(m.y), "#e98a7a", 3);
  }
  // warga
  for (const n of NPCS) { dot(X(n.x), Y(n.y), "#f4b942", 5); label(n.name, X(n.x), Y(n.y) - 9 * DPR, "#f4b942"); }
  // kamu: titik putih berdenyut + panah arah hadap
  const px = X(P.x), py = Y(P.y), pulse = 0.5 + 0.5 * Math.sin(time * 5);
  c.strokeStyle = `rgba(255,255,255,${0.25 + 0.5 * pulse})`; c.lineWidth = 2 * DPR;
  c.beginPath(); c.arc(px, py, (9 + 4 * pulse) * DPR, 0, 6.28); c.stroke();
  c.save(); c.translate(px, py); c.rotate(P.face || 0);
  c.fillStyle = "#fff"; c.strokeStyle = "#1b1208"; c.lineWidth = 1.5 * DPR;
  c.beginPath(); c.moveTo(9 * DPR, 0); c.lineTo(-6 * DPR, -6 * DPR); c.lineTo(-3 * DPR, 0); c.lineTo(-6 * DPR, 6 * DPR); c.closePath(); c.fill(); c.stroke();
  c.restore();
  label("Kamu", px, py + 22 * DPR, "#ffffff");
}

// ---------------------------------------------------------------------
// PETA DUNIA
// Urutan area dari kiri ke kanan. Tinggi tiap area diatur supaya gerbang
// yang tersambung sejajar. Tambah area baru? Masukkan id-nya ke sini.
// ---------------------------------------------------------------------
const WORLD_ORDER = ["desa", "alam", "gua"];
const WORLD_GAP = 7; // jarak antar-area (dalam petak)
let world = null;
// Bangun petak semua area sekali saja (petanya selalu sama karena pakai seed).
function buildWorld() {
  const keep = { MW, MH, map, houses, ZONES, area, areaId };
  const parts = {};
  let x = 0;
  for (const id of WORLD_ORDER) {
    buildArea(id);
    const cv = document.createElement("canvas");
    paintTiles(cv, MW, MH, map);
    parts[id] = { id, a: AREAS[id], cv, w: MW, h: MH, x, y: 0 };
    x += MW + WORLD_GAP;
  }
  ({ MW, MH, map, houses, ZONES, area, areaId } = keep); // kembalikan area yang aktif
  const gateMid = (g) => ({ x: (g.x0 + g.x1 + 1) / 2, y: (g.y0 + g.y1 + 1) / 2 });
  // sejajarkan: area ke-i digeser naik/turun mengikuti gerbang dari area sebelumnya
  for (let i = 1; i < WORLD_ORDER.length; i++) {
    const prev = parts[WORLD_ORDER[i - 1]], cur = parts[WORLD_ORDER[i]];
    const out = prev.a.gerbang.find((g) => g.ke === cur.id), back = cur.a.gerbang.find((g) => g.ke === prev.id);
    if (out && back) cur.y = prev.y + gateMid(out).y - gateMid(back).y;
  }
  // garis jalan antar-area (sekali per pasangan)
  const links = [];
  for (const id of WORLD_ORDER) for (const g of parts[id].a.gerbang) {
    const to = parts[g.ke]; if (!to || WORLD_ORDER.indexOf(g.ke) < WORLD_ORDER.indexOf(id)) continue;
    const back = to.a.gerbang.find((b) => b.ke === id); if (!back) continue;
    const p = gateMid(g), q = gateMid(back);
    links.push({ x1: parts[id].x + p.x, y1: parts[id].y + p.y, x2: to.x + q.x, y2: to.y + q.y });
  }
  const top = Math.min(...Object.values(parts).map((p) => p.y));
  const bottom = Math.max(...Object.values(parts).map((p) => p.y + p.h));
  world = { parts, links, top, bottom, width: x - WORLD_GAP };
}

// Area tujuan misi yang sedang berjalan (null = tidak ada misi).
function questArea() {
  const q = QUESTS[S.q.idx];
  if (!q) return null;
  if (S.q.status !== "active") return "desa"; // ambil / lapor misi ke Ki Lurah
  const mon = q.type === "kill" ? q.target : q.item === "taring" ? "babi" : null;
  if (!mon) return null;
  if (MONSTERS[mon].boss) return WORLD_ORDER.find((id) => AREAS[id].bos) || null;
  const sp = SPAWN.find((s) => s.monster === mon);
  return sp ? WORLD_ORDER.find((id) => AREAS[id].zona && AREAS[id].zona[sp.zona]) || null : null;
}

function drawWorldMap(time) {
  if (!world) buildWorld();
  const cw = Math.round(bigMap.clientWidth * DPR), ch = Math.round(bigMap.clientHeight * DPR);
  if (!cw || !ch) return;
  if (bigMap.width !== cw || bigMap.height !== ch) { bigMap.width = cw; bigMap.height = ch; }
  const c = bctx;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = "#15111f"; c.fillRect(0, 0, cw, ch);
  // ruang untuk nama area di atas & bawah
  const padX = 16 * DPR, padTop = 40 * DPR, padBot = 30 * DPR;
  const ww = world.width, wh = world.bottom - world.top;
  const k = Math.min((cw - padX * 2) / ww, (ch - padTop - padBot) / wh);
  const ox = (cw - ww * k) / 2, oy = padTop + (ch - padTop - padBot - wh * k) / 2 - world.top * k;
  const X = (tx) => ox + tx * k, Y = (ty) => oy + ty * k;
  // layar sempit (HP tegak) → tulisan lebih kecil; tulisan tidak boleh keluar kotak
  const fs = clamp(cw / DPR / 600, 0.62, 1);
  const text = (t, x, y, col, size, weight = 800) => {
    c.font = `${weight} ${size * fs * DPR}px Nunito, sans-serif`; c.textAlign = "center";
    const half = c.measureText(t).width / 2 + 4 * DPR;
    x = clamp(x, half, cw - half);
    c.lineWidth = 3 * DPR; c.strokeStyle = "rgba(10,6,20,0.9)"; c.strokeText(t, x, y); c.fillStyle = col; c.fillText(t, x, y);
  };
  // jalan antar-area: garis putus-putus
  c.setLineDash([6 * DPR, 5 * DPR]); c.lineWidth = 3 * DPR; c.strokeStyle = "#8fd3ff";
  for (const l of world.links) { c.beginPath(); c.moveTo(X(l.x1), Y(l.y1)); c.lineTo(X(l.x2), Y(l.y2)); c.stroke(); }
  c.setLineDash([]);
  const goal = questArea();
  for (const id of WORLD_ORDER) {
    const p = world.parts[id], here = id === areaId;
    const x = X(p.x), y = Y(p.y), w = p.w * k, h = p.h * k;
    c.imageSmoothingEnabled = false;
    c.globalAlpha = here ? 1 : 0.75;
    c.drawImage(p.cv, x, y, w, h);
    c.globalAlpha = 1;
    c.lineWidth = (here ? 3 : 1.5) * DPR; c.strokeStyle = here ? "#f4b942" : "rgba(255,255,255,0.25)";
    c.strokeRect(x, y, w, h);
    text(p.a.nama, x + w / 2, y - 10 * DPR, here ? "#f4b942" : "#f7efe3", 15, 900);
    if (here) text("Kamu di sini", x + w / 2, y + h + 18 * DPR, "#f4b942", 11);
    // tujuan misi: tanda ! emas memantul di pojok kanan atas area
    if (id === goal) {
      const bx = x + w - 12 * DPR, by = y + 14 * DPR + Math.sin(time * 4) * 3 * DPR;
      c.fillStyle = "#f4b942"; c.beginPath(); c.arc(bx, by, 11 * DPR, 0, 6.28); c.fill();
      c.fillStyle = "#1b1208"; c.font = `900 ${15 * DPR}px Nunito, sans-serif`; c.textAlign = "center"; c.fillText("!", bx, by + 5 * DPR);
    }
  }
  // gerbang
  for (const l of world.links) for (const [gx, gy] of [[l.x1, l.y1], [l.x2, l.y2]]) {
    c.fillStyle = "#8fd3ff"; c.beginPath(); c.arc(X(gx), Y(gy), 4 * DPR, 0, 6.28); c.fill();
  }
  // posisi kamu di area sekarang
  const p = world.parts[areaId];
  if (p) {
    const px = X(p.x + P.x / T), py = Y(p.y + P.y / T), pulse = 0.5 + 0.5 * Math.sin(time * 5);
    c.strokeStyle = `rgba(255,255,255,${0.25 + 0.5 * pulse})`; c.lineWidth = 2 * DPR;
    c.beginPath(); c.arc(px, py, (7 + 3 * pulse) * DPR, 0, 6.28); c.stroke();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(px, py, 4 * DPR, 0, 6.28); c.fill();
  }
}

$("tabArea").addEventListener("click", () => showMapTab("area"));
// tombol Tab di keyboard: ganti antara "Area ini" dan "Peta dunia"
addEventListener("keydown", (e) => {
  if (mode === "map" && e.key === "Tab") { e.preventDefault(); showMapTab(mapTab === "area" ? "world" : "area"); }
});
$("tabWorld").addEventListener("click", () => showMapTab("world"));
$("mini").addEventListener("click", openMap);
$("btnMapClose").addEventListener("click", closeMap);
// klik di luar kotak peta = tutup
$("mapBox").addEventListener("click", (e) => { if (e.target === e.currentTarget) closeMap(); });
