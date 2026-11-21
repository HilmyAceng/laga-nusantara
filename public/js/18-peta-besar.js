// =====================================================================
// PETA BESAR
// Buka dengan tombol peta (KONTROL.peta di config.js, awalnya M) atau klik
// peta mini. Permainan berhenti sementara selama peta dibuka.
// Dua tab:
//   Area ini   = area tempatmu berada: posisi kamu, warga, monster, bos, jalan keluar.
//   Peta dunia = semua area berdampingan, disambung lewat gerbangnya, plus tujuan misi.
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
  if (tab === "world") {
    const dn = DUNIA.find((x) => x.id === duniaPeta);
    const kata = dn.nama.split(" "), akhir = kata.pop();
    $("mapName").innerHTML = `${kata.join(" ")} <span>${akhir}</span>`;
    $("mapSub").textContent = t("peta.duniaSub", { area: area.nama });
  } else {
    const words = area.nama.split(" "), last = words.pop();
    $("mapName").innerHTML = `${words.join(" ")} <span>${last}</span>`;
    $("mapSub").textContent = t("peta.sub", { sub: area.sub });
  }
  isiTabDunia();
  refreshZoomBtn();
  if (mode === "map") drawBigMap(performance.now() / 1000);
}

function openMap() {
  if (mode !== "play") return;
  mode = "map";
  const k = KONTROL.peta[0];
  $("mapHint").textContent = isTouch ? t("peta.hintSentuh") : t("peta.hintKey", { k: k.length === 1 ? k.toUpperCase() : k });
  showUI();
  duniaPeta = area.dunia || 1;      // peta dunia: mulai dari dunia tempat pemain berada
  resetIkutPeta();
  showMapTab(mapTab);
}
function closeMap() {
  if (mode !== "map") return;
  if (!$("teleAsk").hidden) return batalTeleport();   // Esc/M saat ditanya teleport = batal dulu
  mode = "play";
  showUI();
}
function toggleMap() { if (mode === "map") closeMap(); else openMap(); }

// Digambar tiap frame selama peta terbuka (supaya titik "kamu" berdenyut).
// mapHits = titik yang bisa diklik di kanvas (mesin teleport), diisi saat menggambar.
let mapHits = [];
function drawBigMap(time) { mapHits = []; if (mapTab === "world") drawWorldMap(time); else drawAreaMap(time); }

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
  const k0 = Math.min((cw - pad * 2) / MW, (ch - pad * 2) / MH), ox0 = (cw - MW * k0) / 2, oy0 = (ch - MH * k0) / 2;
  // zoom (29-zoom-peta.js): tampilan berpusat di pemain, atau di tempat yang digeser
  const v = tampilanPeta(cw, ch, ox0 + P.x / T * k0, oy0 + P.y / T * k0);
  const k = k0 * v.z, ox = ox0 * v.z + v.ax, oy = oy0 * v.z + v.ay;
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
    label(g.label, lx, g.y0 === 0 ? Y(gy) + 20 * DPR : Y(gy) - 10 * DPR, "#8fd3ff");
  }
  // monster & bos
  for (const m of monsters) {
    if (m.dead) continue;
    if (m.d.boss) { dot(X(m.x), Y(m.y), "#ff3b3b", 7); label(m.d.name, X(m.x), Y(m.y) - 12 * DPR, "#ff8080"); }
    else dot(X(m.x), Y(m.y), "#e98a7a", 3);
  }
  // warga
  for (const n of NPCS) {
    if (n.kind === "teleport") {
      drawTeleportIcon(c, X(n.x), Y(n.y), DPR, time); label(n.name, X(n.x), Y(n.y) - 16 * DPR, "#7dffa8");
      mapHits.push({ x: X(n.x), y: Y(n.y), r: 20 * DPR, tele: n.tele });
      continue;
    }
    if (n.kind === "cermin") { cerminDiPetaArea(c, X(n.x), Y(n.y), time, label); continue; }   // 64-cermin-peta.js
    dot(X(n.x), Y(n.y), "#f4b942", 5); label(n.name, X(n.x), Y(n.y) - 9 * DPR, "#f4b942");
  }
  // tujuan cerita di area ini (atau gerbang menuju tujuan)
  const tj = tujuanDiArea();
  if (tj) {
    bintang(c, X(tj.x), Y(tj.y), DPR * 1.3, time);
    const ly = Y(tj.y) > ch - 40 * DPR ? Y(tj.y) - 16 * DPR : Y(tj.y) + 22 * DPR;   // dekat tepi bawah → label di atas
    label(tj.ke ? "→ " + AREAS[tj.ke].nama : t("peta.tujuan"), X(tj.x), ly, "#f4b942");
  }
  // kamu: titik putih berdenyut + panah arah hadap
  const px = X(P.x), py = Y(P.y), pulse = 0.5 + 0.5 * Math.sin(time * 5);
  c.strokeStyle = `rgba(255,255,255,${0.25 + 0.5 * pulse})`; c.lineWidth = 2 * DPR;
  c.beginPath(); c.arc(px, py, (9 + 4 * pulse) * DPR, 0, 6.28); c.stroke();
  c.save(); c.translate(px, py); c.rotate(P.face || 0);
  c.fillStyle = "#fff"; c.strokeStyle = "#1b1208"; c.lineWidth = 1.5 * DPR;
  c.beginPath(); c.moveTo(9 * DPR, 0); c.lineTo(-6 * DPR, -6 * DPR); c.lineTo(-3 * DPR, 0); c.lineTo(-6 * DPR, 6 * DPR); c.closePath(); c.fill(); c.stroke();
  c.restore();
  label(t("peta.kamu"), px, py + 22 * DPR, "#ffffff");
}

// ---------------------------------------------------------------------
// PETA DUNIA
// Semua area digambar berdampingan. Letaknya dihitung otomatis dari gerbang:
// kalau gerbang balik di area B ada di tepi kiri, B ditaruh di kanan A;
// tepi bawah → B di atas A; dst. Gerbang yang tersambung dibuat sejajar.
// Ada 3 dunia (DUNIA di 04-peta.js); tiap dunia digambar terpisah, pilih lewat
// tombol dunia di atas peta. Gerbang ke dunia lain ditandai panah ungu.
// Tambah area baru? Masukkan id-nya ke WORLD_ORDER (area pertama tiap dunia = pusat).
// ---------------------------------------------------------------------
const WORLD_ORDER = ["desa", "alam", "gua", "candi", "rawa", "pesisir", "kawah", "sawah", "makam",
  "bandar", "bakau", "larangan", "kuil", "desaApung", "goaLaut",
  "awan", "hutanBatu", "puncakNaga", "lembahAngin", "istanaAwan",
  "perkemahan", "padangBayang", "kotaMati", "menaraKala", "singgasana"];
const WORLD_GAP = 10; // jarak antar-area (dalam petak)
let worlds = {}, world = null, duniaPeta = 1;
function resetPetaDunia() { worlds = {}; world = null; }
const gateMid = (g) => ({ x: (g.x0 + g.x1 + 1) / 2, y: (g.y0 + g.y1 + 1) / 2 });
// Area di peta dunia tidak boleh saling timpa. Kalau tempat B bertabrakan
// dengan area yang sudah dipasang, B digeser sedikit demi sedikit: menjauh
// searah gerbangnya, atau menyamping. Yang pergeserannya paling kecil dipakai.
// Jarak antar-kotak minimal WORLD_GAP (cukup untuk nama area di atas kotak).
function tabrakArea(B, x, y, lain) {
  return lain.some((o) => x < o.x + o.w + WORLD_GAP && x + B.w + WORLD_GAP > o.x && y < o.y + o.h + WORLD_GAP && y + B.h + WORLD_GAP > o.y);
}
function cariTempatKosong(B, dx, dy, lain) {
  const x0 = B.x, y0 = B.y, sx = dy, sy = dx;   // (sx, sy) = arah menyamping
  for (let d = 0; d < 400; d++) {
    for (const [mx, my] of [[dx * d, dy * d], [sx * d, sy * d], [-sx * d, -sy * d]]) {
      if (!tabrakArea(B, x0 + mx, y0 + my, lain)) { B.x = x0 + mx; B.y = y0 + my; return; }
    }
  }
}
// Bangun petak semua area satu dunia (petanya selalu sama karena pakai seed; dibangun ulang kalau ada gerbang terbuka).
function buildWorld(dunia) {
  const keep = { MW, MH, map, houses, ZONES, area, areaId };
  const parts = {};
  const ids = WORLD_ORDER.filter((id) => AREAS[id].dunia === dunia);
  for (const id of ids) {
    buildArea(id);
    const cv = document.createElement("canvas");
    paintTiles(cv, MW, MH, map);
    parts[id] = { id, a: AREAS[id], cv, w: MW, h: MH, x: 0, y: 0 };
  }
  ({ MW, MH, map, houses, ZONES, area, areaId } = keep); // kembalikan area yang aktif
  // susun mulai dari area pertama, menyebar lewat gerbang
  const placed = new Set([ids[0]]), queue = [ids[0]], links = [], keluar = [];
  while (queue.length) {
    const A = parts[queue.shift()];
    for (const g of A.a.gerbang) {
      const B = parts[g.ke];
      if (!B) { keluar.push({ a: A.id, ke: g.ke, ...gateMid(g), g }); continue; }   // gerbang ke dunia lain
      const back = B.a.gerbang.find((b) => b.ke === A.id); if (!back) continue;
      const p = gateMid(g), q = gateMid(back);
      if (!placed.has(B.id)) {
        let dx = 0, dy = 0;
        if (back.x0 === 0) { B.x = A.x + A.w + WORLD_GAP; B.y = A.y + p.y - q.y; dx = 1; }             // B di kanan
        else if (back.x1 === B.w - 1) { B.x = A.x - B.w - WORLD_GAP; B.y = A.y + p.y - q.y; dx = -1; } // B di kiri
        else if (back.y1 === B.h - 1) { B.y = A.y - B.h - WORLD_GAP; B.x = A.x + p.x - q.x; dy = -1; } // B di atas
        else { B.y = A.y + A.h + WORLD_GAP; B.x = A.x + p.x - q.x; dy = 1; }                           // B di bawah
        cariTempatKosong(B, dx, dy, [...placed].map((id) => parts[id]));
        placed.add(B.id); queue.push(B.id);
        links.push({ a: A.id, b: B.id, x1: A.x + p.x, y1: A.y + p.y, x2: B.x + q.x, y2: B.y + q.y });
      }
    }
  }
  const all = Object.values(parts).filter((p) => placed.has(p.id));
  worlds[dunia] = {
    parts, links, keluar, list: all.map((p) => p.id),
    left: Math.min(...all.map((p) => p.x)), right: Math.max(...all.map((p) => p.x + p.w)),
    top: Math.min(...all.map((p) => p.y)), bottom: Math.max(...all.map((p) => p.y + p.h)),
  };
}

// Area tujuan cerita sekarang (null = tidak ada / sudah tamat)
function questArea() { const tg = targetLacak(); return tg ? tg.area : null; }
const dikunjungi = (id) => !!(S && S.dikunjungi[id]);

function drawWorldMap(time) {
  if (!worlds[duniaPeta]) buildWorld(duniaPeta);
  world = worlds[duniaPeta];
  const cw = Math.round(bigMap.clientWidth * DPR), ch = Math.round(bigMap.clientHeight * DPR);
  if (!cw || !ch) return;
  if (bigMap.width !== cw || bigMap.height !== ch) { bigMap.width = cw; bigMap.height = ch; }
  const c = bctx;
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.fillStyle = "#15111f"; c.fillRect(0, 0, cw, ch);
  // ruang untuk nama area di atas & bawah
  const goalLain = questArea() && AREAS[questArea()].dunia !== duniaPeta;   // ada tulisan "tujuan di dunia lain" di bawah
  const padX = 16 * DPR, padTop = 40 * DPR, padBot = (goalLain ? 56 : 30) * DPR;
  const ww = world.right - world.left, wh = world.bottom - world.top;
  const k0 = Math.min((cw - padX * 2) / ww, (ch - padTop - padBot) / wh);
  const ox0 = (cw - ww * k0) / 2 - world.left * k0, oy0 = padTop + (ch - padTop - padBot - wh * k0) / 2 - world.top * k0;
  // zoom (29-zoom-peta.js): berpusat di posisi pemain di peta dunia
  const pp = world.parts[areaId] || { x: 0, y: 0 };
  const v = tampilanPeta(cw, ch, ox0 + (pp.x + P.x / T) * k0, oy0 + (pp.y + P.y / T) * k0);
  const k = k0 * v.z, ox = ox0 * v.z + v.ax, oy = oy0 * v.z + v.ay;
  const X = (tx) => ox + tx * k, Y = (ty) => oy + ty * k;
  // layar sempit (HP tegak) → tulisan lebih kecil; tulisan tidak boleh keluar kotak
  const fs = clamp(cw / DPR / 600, 0.62, 1);
  const text = (t, x, y, col, size, weight = 800) => {
    c.font = `${weight} ${size * fs * DPR}px Nunito, sans-serif`; c.textAlign = "center";
    const half = c.measureText(t).width / 2 + 4 * DPR;
    x = clamp(x, half, cw - half);
    c.lineWidth = 3 * DPR; c.strokeStyle = "rgba(10,6,20,0.9)"; c.strokeText(t, x, y); c.fillStyle = col; c.fillText(t, x, y);
  };
  // jalan antar-area: garis putus-putus (emas = jalur menuju tujuan cerita)
  const goal0 = questArea(), names = [];
  const goal = goal0 && AREAS[goal0].dunia === duniaPeta ? goal0 : null;
  const jalur = goal0 ? jalurArea(areaId, goal0) || [] : [];
  const diJalur = (l) => { const i = jalur.indexOf(l.a), j = jalur.indexOf(l.b); return i >= 0 && j >= 0 && Math.abs(i - j) === 1; };
  c.setLineDash([6 * DPR, 5 * DPR]);
  for (const l of world.links) {
    if (!dikunjungi(l.a) && !dikunjungi(l.b)) continue;
    c.lineWidth = (diJalur(l) ? 4 : 3) * DPR; c.strokeStyle = diJalur(l) ? "#f4b942" : "#8fd3ff";
    c.beginPath(); c.moveTo(X(l.x1), Y(l.y1)); c.lineTo(X(l.x2), Y(l.y2)); c.stroke();
  }
  c.setLineDash([]);
  for (const id of world.list) {
    const p = world.parts[id], here = id === areaId;
    const x = X(p.x), y = Y(p.y), w = p.w * k, h = p.h * k;
    const kenal = dikunjungi(id);
    c.imageSmoothingEnabled = false;
    if (kenal) {
      c.globalAlpha = here ? 1 : 0.75;
      c.drawImage(p.cv, x, y, w, h);
      c.globalAlpha = 1;
    } else {
      // belum pernah didatangi: tertutup kabut
      c.fillStyle = "#231c2b"; c.fillRect(x, y, w, h);
      c.fillStyle = "rgba(201,191,214,0.35)"; c.font = `900 ${Math.min(w, h) * 0.35}px Teko, sans-serif`; c.textAlign = "center";
      c.fillText("?", x + w / 2, y + h / 2 + Math.min(w, h) * 0.12);
    }
    c.lineWidth = (here ? 3 : jalur.includes(id) ? 2.5 : 1.5) * DPR;
    c.strokeStyle = here ? "#f4b942" : jalur.includes(id) ? "rgba(244,185,66,0.7)" : "rgba(255,255,255,0.25)";
    c.strokeRect(x, y, w, h);
    // nama area rata kiri di atas kotaknya; digambar paling akhir supaya di atas garis jalan
    // ukuran huruf dikecilkan kalau nama lebih lebar dari kotak + celah, supaya tidak menimpa nama area sebelah
    const nama = kenal ? p.a.nama : "???";
    let uk = 15;
    c.font = `900 ${uk * fs * DPR}px Nunito, sans-serif`;
    const muat = w + WORLD_GAP * k * 0.8, lebar = c.measureText(nama).width;
    if (lebar > muat) uk = Math.max(9, uk * muat / lebar);
    c.font = `900 ${uk * fs * DPR}px Nunito, sans-serif`;
    names.push([nama, x + c.measureText(nama).width / 2, y - 6 * DPR, here ? "#f4b942" : kenal ? "#f7efe3" : "#8d8894", uk]);
    // tujuan misi: tanda ! emas memantul di pojok kanan atas area
    if (id === goal) {
      const bx = x + w - 12 * DPR, by = y + 14 * DPR + Math.sin(time * 4) * 3 * DPR;
      c.fillStyle = "#f4b942"; c.beginPath(); c.arc(bx, by, 11 * DPR, 0, 6.28); c.fill();
      c.fillStyle = "#1b1208"; c.font = `900 ${15 * DPR}px Nunito, sans-serif`; c.textAlign = "center"; c.fillText("!", bx, by + 5 * DPR);
    }
  }
  // titik tujuan cerita (bintang)
  const tg = targetLacak();
  if (tg && tg.x != null && world.parts[tg.area] && dikunjungi(tg.area)) bintang(c, X(world.parts[tg.area].x + tg.x / T), Y(world.parts[tg.area].y + tg.y / T), DPR * fs, time);
  // gerbang
  for (const l of world.links) if (dikunjungi(l.a) || dikunjungi(l.b)) for (const [gx, gy] of [[l.x1, l.y1], [l.x2, l.y2]]) {
    c.fillStyle = "#8fd3ff"; c.beginPath(); c.arc(X(gx), Y(gy), 4 * DPR, 0, 6.28); c.fill();
  }
  // mesin teleport di semua area (bisa diklik)
  // gerbang ke dunia lain: panah ungu + nama dunia tujuan
  for (const k of world.keluar) {
    const p = world.parts[k.a]; if (!p || !dikunjungi(k.a) || !gerbangTerbuka(k.g)) continue;
    const gx = X(p.x + k.x), gy = Y(p.y + k.y), dn = DUNIA.find((x) => x.id === AREAS[k.ke].dunia);
    c.fillStyle = "#c9a6ff"; c.beginPath(); c.arc(gx, gy, 7 * DPR, 0, 6.28); c.fill();
    c.fillStyle = "#1b1208"; c.font = `900 ${10 * DPR}px Nunito, sans-serif`; c.textAlign = "center"; c.fillText("»", gx, gy + 3.5 * DPR);
    text("» " + dn.nama, gx, gy + 20 * DPR, "#c9a6ff", 11);
  }
  for (const tp of TELEPORTS) {
    const p = world.parts[tp.areaId]; if (!p || !dikunjungi(tp.areaId)) continue;   // teleport aktif setelah areanya didatangi
    const tx = X(p.x + tp.x), ty = Y(p.y + tp.y);
    drawTeleportIcon(c, tx, ty, DPR * fs, time);
    mapHits.push({ x: tx, y: ty, r: 20 * DPR, tele: tp });
  }
  cerminDiPetaDunia(c, X, Y, fs, time);   // cermin gaib yang sudah muncul (64-cermin-peta.js)
  for (const [t, x, y, col, uk] of names) text(t, x, y, col, uk, 900);
  // tujuan cerita ada di dunia lain
  if (goal0 && !goal) text(t("peta.tujuanDunia", { dunia: DUNIA.find((x) => x.id === AREAS[goal0].dunia).nama }), cw / 2, ch - 10 * DPR, "#f4b942", 13);
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
// dropdown pilih dunia: semua dunia tercantum, yang belum pernah didatangi = "???"
function isiTabDunia() {
  const sel = $("duniaPilih");
  $("duniaBox").hidden = mapTab !== "world";
  sel.innerHTML = DUNIA.map((dn) => {
    const kenal = WORLD_ORDER.some((id) => AREAS[id].dunia === dn.id && dikunjungi(id));
    return `<option value="${dn.id}" ${kenal ? "" : "disabled"} ${dn.id === duniaPeta ? "selected" : ""}>${t("peta.duniaKe", { n: dn.id })} · ${kenal ? dn.nama : "???"}</option>`;
  }).join("");
}
$("duniaPilih").addEventListener("change", (e) => {
  duniaPeta = +e.target.value; sfx.click(); resetIkutPeta(); showMapTab("world");
});
$("mini").addEventListener("click", openMap);
// klik/ketuk mesin teleport di peta → tanya "Pindah ke ...?"
const mapHitAt = (e) => {
  const r = bigMap.getBoundingClientRect(), x = (e.clientX - r.left) * DPR, y = (e.clientY - r.top) * DPR;
  return mapHits.find((h) => Math.hypot(h.x - x, h.y - y) <= h.r);
};
bigMap.addEventListener("click", (e) => { const h = mapHitAt(e); if (h && $("teleAsk").hidden) tanyaTeleport(h.tele); });
bigMap.addEventListener("pointermove", (e) => { bigMap.style.cursor = mapHitAt(e) ? "pointer" : ""; });
$("btnMapClose").addEventListener("click", closeMap);
// klik di luar kotak peta = tutup
$("mapBox").addEventListener("click", (e) => { if (e.target === e.currentTarget) closeMap(); });
