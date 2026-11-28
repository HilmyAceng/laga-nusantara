// =====================================================================
// GAMBAR DUNIA BARU (arc 2): petak salju/es/rumput kering, warna tanah sabana/rimba/salju,
// pohon akasia/rimba/cemara bersalju, rumah panjang & rumah bersalju,
// beringin raksasa & kelir es, serta gambar semua monster & bos arc 2.
// Monster digambar menghadap ke kanan (dibalik otomatis oleh drawMonster, 16-gambar.js).
// =====================================================================
"use strict";

WARNA_BAHAYA.pasir = "#d9b36a"; WARNA_BAHAYA.es = "#bfe8ff"; WARNA_BAHAYA.sepi = "#5a3a8a";
Object.assign(TILE_COLOR, { [SALJU]: "#eef3fb", [ES]: "#a9dcf5", [RUMPUT_KERING]: "#b59a4e" });

const saljuDi = (ty) => area.salju || (area.saljuMulai != null && ty < area.saljuMulai);
// ---------- Petak ----------
{
  const asli = drawGround;
  drawGround = function (tx, ty, time) {
    const t = tileAt(tx, ty), x = tx * T, y = ty * T, h = hash(tx, ty);
    if (t === SALJU) {
      ctx.fillStyle = h % 5 === 0 ? "#e6edf7" : "#eef3fb"; ctx.fillRect(x, y, T, T);
      ctx.fillStyle = "rgba(150,175,210,0.35)"; if (h % 3 === 0) { ctx.beginPath(); ctx.ellipse(x + 10 + (h % 20), y + 12 + (h % 16), 7, 3, 0, 0, 6.28); ctx.fill(); }
      ctx.fillStyle = "#ffffff"; if (h % 4 === 0) ctx.fillRect(x + (h % 33), y + (h % 31), 2, 2);
      return;
    }
    if (t === ES) {
      ctx.fillStyle = h % 4 === 0 ? "#9fd3ef" : "#a9dcf5"; ctx.fillRect(x, y, T, T);
      ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1.5; ctx.beginPath();
      ctx.moveTo(x + 4 + (h % 10), y + 6); ctx.lineTo(x + 16 + (h % 12), y + 18); ctx.moveTo(x + 24, y + 26 + (h % 8)); ctx.lineTo(x + 34, y + 30); ctx.stroke();
      const kilau = 0.25 + 0.25 * Math.sin(time * 2 + tx + ty * 0.7);
      ctx.fillStyle = `rgba(255,255,255,${kilau})`; ctx.fillRect(x + 6, y + 6, 6, 2);
      ctx.strokeStyle = "rgba(60,110,150,0.25)"; ctx.strokeRect(x + 0.5, y + 0.5, T - 1, T - 1);
      return;
    }
    if (t === RUMPUT_KERING) {
      ctx.fillStyle = h % 5 === 0 ? "#b09447" : "#b8a052"; ctx.fillRect(x, y, T, T);
      if (h % 3 === 0) {
        ctx.strokeStyle = "rgba(120,90,40,0.6)"; ctx.lineWidth = 1.5; ctx.beginPath();
        const sw = Math.sin(time * 1.4 + tx * 0.6) * 1.5;
        for (let i = 0; i < 3; i++) { const bx = x + 8 + i * 6 + (h % 10); ctx.moveTo(bx, y + 30); ctx.lineTo(bx + sw + (i - 1) * 2, y + 18 + (i % 2) * 3); }
        ctx.stroke();
      }
      return;
    }
    // rumput hijau di dunia baru: lebih tua di rimba, kekuningan di sabana, putih di salju
    if ((t === G || t === FLOWER || (t === ROCK && !area.alasBatu)) && (area.sabana || area.rimba || saljuDi(ty))) {
      const salju = saljuDi(ty) && t !== G ? true : area.salju;
      ctx.fillStyle = salju ? (h % 5 === 0 ? "#e6edf7" : "#eef3fb") : area.rimba ? (h % 5 === 0 ? "#2f5f2c" : "#336833") : (h % 5 === 0 ? "#7f8a3c" : "#879342");
      ctx.fillRect(x, y, T, T);
      if (t === FLOWER) for (let i = 0; i < 3; i++) { ctx.fillStyle = area.rimba ? ["#ff7bb0", "#ffd166", "#b88cff"][(h + i) % 3] : ["#ffd166", "#f7efe3", "#ef8a4f"][(h + i) % 3]; ctx.beginPath(); ctx.arc(x + 8 + ((h >> (i * 3)) % 24), y + 8 + ((h >> (i * 4)) % 24), 2.5, 0, 6.28); ctx.fill(); }
      else if (t === ROCK) {
        ctx.fillStyle = salju ? "#8d95a3" : "#6f6a75"; ctx.beginPath(); ctx.ellipse(x + T / 2, y + T / 2 + 4, 16, 12, 0, 0, 6.28); ctx.fill();
        ctx.fillStyle = salju ? "#f7faff" : "#8d8894"; ctx.beginPath(); ctx.ellipse(x + T / 2 - 3, y + T / 2 - (salju ? 3 : 0), 10, 7, 0, 0, 6.28); ctx.fill();
      } else if (h % 7 === 0 && !salju) { ctx.strokeStyle = "rgba(20,50,20,0.45)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 12, y + 26); ctx.lineTo(x + 14, y + 19); ctx.moveTo(x + 16, y + 26); ctx.lineTo(x + 18, y + 18); ctx.stroke(); }
      return;
    }
    asli(tx, ty, time);
  };
}
// ---------- Pohon ----------
{
  const asli = drawTree;
  drawTree = function (tx, ty, time) {
    if (!area || !(area.sabana || area.rimba || area.salju || area.saljuMulai != null)) return asli(tx, ty, time);
    const x = tx * T + T / 2, y = ty * T + T, h = hash(tx, ty), sway = Math.sin(time * 1.5 + tx) * 1.5;
    ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.beginPath(); ctx.ellipse(x, y - 4, 18, 6, 0, 0, 6.28); ctx.fill();
    if (saljuDi(ty)) {   // cemara bersalju
      ctx.fillStyle = "#4a3324"; ctx.fillRect(x - 3, y - 14, 6, 12);
      for (let i = 0; i < 3; i++) {
        const lebar = 20 - i * 5, atas = y - 22 - i * 13;
        ctx.fillStyle = i % 2 ? "#24513a" : "#2b5e43"; ctx.beginPath(); ctx.moveTo(x - lebar + sway * 0.3, atas + 14); ctx.lineTo(x + sway, atas - 6); ctx.lineTo(x + lebar + sway * 0.3, atas + 14); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#f4f8ff"; ctx.beginPath(); ctx.moveTo(x - lebar * 0.6 + sway * 0.3, atas + 6); ctx.lineTo(x + sway, atas - 6); ctx.lineTo(x + lebar * 0.6 + sway * 0.3, atas + 6); ctx.closePath(); ctx.fill();
      }
      return;
    }
    if (area.sabana) {   // akasia: batang miring, tajuk payung lebar
      ctx.strokeStyle = "#5b3a24"; ctx.lineWidth = 5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x, y - 2); ctx.quadraticCurveTo(x + 3, y - 22, x - 2 + (h % 7) - 3, y - 36); ctx.stroke();
      ctx.fillStyle = h % 2 ? "#5f7a2e" : "#6b8636";
      ctx.beginPath(); ctx.ellipse(x + sway, y - 42, 26, 8, 0, 0, 6.28); ctx.fill();
      ctx.fillStyle = "rgba(255,240,180,0.18)"; ctx.beginPath(); ctx.ellipse(x - 6 + sway, y - 45, 14, 4, 0, 0, 6.28); ctx.fill();
      return;
    }
    // rimba: pohon tinggi berakar papan, tajuk gelap, sulur
    ctx.fillStyle = "#4a3020"; ctx.fillRect(x - 5, y - 30, 10, 28);
    ctx.beginPath(); ctx.moveTo(x - 12, y - 2); ctx.lineTo(x - 4, y - 16); ctx.lineTo(x - 4, y - 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + 12, y - 2); ctx.lineTo(x + 4, y - 16); ctx.lineTo(x + 4, y - 2); ctx.fill();
    ctx.fillStyle = h % 2 ? "#1f4a25" : "#235328"; ctx.beginPath(); ctx.arc(x + sway, y - 44, 22, 0, 6.28); ctx.fill();
    ctx.fillStyle = h % 2 ? "#2c6332" : "#2a5d2f"; ctx.beginPath(); ctx.arc(x - 8 + sway, y - 52, 13, 0, 6.28); ctx.arc(x + 10 + sway, y - 48, 11, 0, 6.28); ctx.fill();
    if (h % 3 === 0) { ctx.strokeStyle = "#3d7a3a"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 12 + sway, y - 34); ctx.quadraticCurveTo(x + 16, y - 20, x + 13 + Math.sin(time * 2 + tx) * 2, y - 10); ctx.stroke(); }
  };
}
// ---------- Rumah ----------
{
  const asli = drawHouse;
  drawHouse = function (hs) {
    if (hs.panjang) {   // rumah panjang: panggung kayu, atap pelana memanjang
      const x = hs.x * T, y = hs.y * T, w = 3 * T;
      ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(x, y + 2 * T - 6, w, 8);
      ctx.fillStyle = "#5b3a24"; for (let i = 0; i < 4; i++) ctx.fillRect(x + 6 + i * 34, y + 48, 5, 30);
      ctx.fillStyle = "#a9794a"; ctx.fillRect(x, y + 20, w, 30);
      ctx.fillStyle = "rgba(0,0,0,0.15)"; for (let i = 0; i < 6; i++) ctx.fillRect(x + i * 20, y + 20, 2, 30);
      ctx.fillStyle = "#3a2a1a"; ctx.fillRect(x + w / 2 - 8, y + 28, 16, 22);
      ctx.fillStyle = "#6b4a2a"; ctx.beginPath(); ctx.moveTo(x - 2, y + 22); ctx.lineTo(x + w + 2, y + 22); ctx.lineTo(x + w + 2, y - 2); ctx.lineTo(x - 2, y - 2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#8a6038"; ctx.fillRect(x - 2, y - 6, w + 4, 8);
      return;
    }
    if (area && area.sabana && !hs.salju) {   // rumah berkolong beratap menara ilalang
      const x = hs.x * T, y = hs.y * T, w = 3 * T;
      ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(x + 4, y + 2 * T - 6, w, 8);
      ctx.fillStyle = "#5b3a24"; for (const px of [10, 56, 102]) ctx.fillRect(x + px, y + 50, 6, 28);
      ctx.fillStyle = "#c9a26b"; ctx.fillRect(x + 6, y + 28, w - 12, 24);
      ctx.fillStyle = "#3a2a1a"; ctx.fillRect(x + w / 2 - 8, y + 32, 16, 20);
      ctx.fillStyle = "#a8873e"; ctx.beginPath(); ctx.moveTo(x - 4, y + 30); ctx.lineTo(x + w + 4, y + 30); ctx.lineTo(x + w / 2 + 14, y - 4); ctx.lineTo(x + w / 2 + 6, y - 40); ctx.lineTo(x + w / 2 - 6, y - 40); ctx.lineTo(x + w / 2 - 14, y - 4); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "rgba(90,60,20,0.4)"; ctx.lineWidth = 1.5; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(x + 10 + i * 24, y + 28); ctx.lineTo(x + w / 2, y - 30); ctx.stroke(); }
      return;
    }
    asli(hs);
    if (hs.salju || (area && area.salju)) {   // salju di atap
      const x = hs.x * T, y = hs.y * T, w = 3 * T;
      ctx.fillStyle = "#f4f8ff"; ctx.beginPath(); ctx.moveTo(x + 20, y - 4); ctx.lineTo(x + w - 20, y - 4); ctx.lineTo(x + w - 40, y - 30); ctx.lineTo(x + 40, y - 30); ctx.closePath(); ctx.fill();
      ctx.fillRect(x - 6, y + 18, w + 12, 5);
    }
  };
}

// ---------- Benda besar khas area: beringin raksasa & kelir es ----------
BENDA_TINGGI.push(function (time) {
  if (areaId === "beringin") return [{ y: 7 * T, f: () => gambarBeringin(time) }];
  if (areaId === "kelir") return [{ y: 3 * T, f: () => gambarKelir(time) }];
  if (areaId === "tuguAgung") return [{ y: 4 * T, f: () => gambarTuguAgung(time) }];
  return [];
});
function gambarBeringin(time) {
  const x = 24.5 * T, y = 6.5 * T;
  ctx.fillStyle = "#3a2618"; ctx.fillRect(x - 40, y - 120, 80, 120);
  for (let i = 0; i < 9; i++) { const ax = x - 70 + i * 18, sw = Math.sin(time * 0.8 + i) * 3; ctx.strokeStyle = "#4a3020"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ax, y - 150); ctx.quadraticCurveTo(ax + sw, y - 70, ax + sw * 2, y - 10); ctx.stroke(); }
  ctx.fillStyle = "#14321a"; ctx.beginPath(); ctx.ellipse(x, y - 170, 190, 80, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#1b4022"; ctx.beginPath(); ctx.ellipse(x - 60, y - 190, 90, 45, 0, 0, 6.28); ctx.ellipse(x + 70, y - 180, 95, 48, 0, 0, 6.28); ctx.fill();
  for (let i = 0; i < 14; i++) { const k = Math.sin(time * 1.5 + i * 1.7); ctx.fillStyle = `rgba(190,255,170,${0.25 + 0.25 * k})`; ctx.beginPath(); ctx.arc(x - 150 + (i * 23) % 300, y - 200 + (i * 37) % 80, 2, 0, 6.28); ctx.fill(); }
}
function gambarKelir(time) {
  const x0 = 4 * T, x1 = 44 * T, y0 = 0.4 * T, y1 = 3 * T;
  ctx.fillStyle = "#5b3a24"; ctx.fillRect(x0 - 8, y0 - 6, 10, y1 - y0 + 10); ctx.fillRect(x1 - 2, y0 - 6, 10, y1 - y0 + 10);
  const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, "#e9f6ff"); g.addColorStop(1, "#bfe8ff");
  ctx.fillStyle = g; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  ctx.strokeStyle = "rgba(120,170,210,0.6)"; ctx.lineWidth = 2; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(x0 + i * 140 + 20, y0 + 10); ctx.lineTo(x0 + i * 140 + 60, y1 - 12); ctx.stroke(); }
  // bayang-bayang wayang di balik kelir
  ctx.fillStyle = "rgba(40,30,60,0.35)";
  for (let i = 0; i < 6; i++) { const bx = x0 + 120 + i * 260 + Math.sin(time * 0.6 + i) * 20, by = y1 - 10; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + 14, by - 60); ctx.lineTo(bx + 34, by - 70); ctx.lineTo(bx + 30, by - 40); ctx.lineTo(bx + 44, by); ctx.closePath(); ctx.fill(); }
  // blencong (lampu minyak)
  const bx = 24.5 * T, by = 4.4 * T, nyala = 0.6 + 0.4 * Math.sin(time * 9);
  ctx.fillStyle = "#8a6a2a"; ctx.fillRect(bx - 10, by - 6, 20, 8);
  ctx.fillStyle = `rgba(255,190,90,${nyala})`; ctx.beginPath(); ctx.ellipse(bx, by - 14, 6, 10, 0, 0, 6.28); ctx.fill();
}
function gambarTuguAgung(time) {
  const x = 22.5 * T, y = 3.6 * T;
  ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 60, 16, 0, 0, 6.28); ctx.fill();
  ctx.fillStyle = "#8a7a5a"; ctx.beginPath(); ctx.moveTo(x - 40, y); ctx.lineTo(x - 26, y - 230); ctx.lineTo(x + 26, y - 240); ctx.lineTo(x + 40, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#a8936a"; ctx.beginPath(); ctx.moveTo(x - 30, y); ctx.lineTo(x - 18, y - 226); ctx.lineTo(x, y - 236); ctx.lineTo(x - 6, y); ctx.closePath(); ctx.fill();
  const k = 0.3 + 0.3 * Math.sin(time * 2);
  ctx.fillStyle = `rgba(255,220,140,${k})`; for (let i = 0; i < 5; i++) ctx.fillRect(x - 12, y - 40 - i * 40, 24, 3);
}

// Butiran salju & badai salju digambar oleh 99zt-cuaca-cerita.js (cuaca mengikuti cerita).

// ---------- Monster ----------
function gambarKaki4(warna, b, panjang = 10) {
  ctx.fillStyle = warna; for (const kx of [-12, -5, 6, 13]) ctx.fillRect(kx, -panjang + (kx % 2 ? b : -b) * 0.5, 4, panjang);
}
Object.assign(GAMBAR_MONSTER, {
  begalTopeng(m, time, w) {
    const b = m.state === "charge" ? Math.abs(Math.sin(m.run * 3)) * 3 : Math.abs(Math.sin(m.run)) * 1.5;
    ctx.fillStyle = putih(w, "#2b2238"); ctx.fillRect(-8, -14, 6, 14); ctx.fillRect(2, -14, 6, 14);
    ctx.fillStyle = putih(w, "#5a2a2a"); roundRect(ctx, -11, -38 - b, 22, 26, 6); ctx.fill();
    ctx.fillStyle = putih(w, "#1f1a24"); ctx.fillRect(-11, -18 - b, 22, 4);
    ctx.fillStyle = putih(w, "#e3ae7f"); ctx.beginPath(); ctx.arc(0, -46 - b, 10, 0, 6.28); ctx.fill();
    ctx.fillStyle = putih(w, "#f2ead8"); ctx.beginPath(); ctx.ellipse(3, -46 - b, 9, 10, 0, 0, 6.28); ctx.fill();   // topeng putih
    ctx.fillStyle = "#1f1a24"; ctx.fillRect(1, -49 - b, 3, 3); ctx.fillRect(7, -49 - b, 3, 3); ctx.fillStyle = "#c0392b"; ctx.fillRect(2, -42 - b, 7, 2);
    ctx.fillStyle = "#1f1a24"; ctx.fillRect(-11, -56 - b, 22, 5);
    ctx.strokeStyle = putih(w, "#c9d6e3"); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(12, -30 - b); ctx.lineTo(24, -44 - b); ctx.stroke();   // golok
  },
  kucingGarong(m, time, w) {
    const b = Math.abs(Math.sin(m.run * 1.8)) * 2;
    ctx.strokeStyle = putih(w, "#3a3240"); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-12, -10); ctx.quadraticCurveTo(-24, -14, -20, -26 + Math.sin(time * 6) * 3); ctx.stroke();
    gambarKaki4(putih(w, "#3a3240"), b, 8);
    ctx.fillStyle = putih(w, "#4a4250"); ctx.beginPath(); ctx.ellipse(0, -12 - b, 15, 7, 0, 0, 6.28); ctx.fill();
    ctx.beginPath(); ctx.arc(14, -18 - b, 7, 0, 6.28); ctx.fill();
    ctx.beginPath(); ctx.moveTo(10, -23 - b); ctx.lineTo(12, -30 - b); ctx.lineTo(15, -24 - b); ctx.moveTo(16, -24 - b); ctx.lineTo(19, -30 - b); ctx.lineTo(20, -22 - b); ctx.fill();
    ctx.fillStyle = "#ffe066"; ctx.fillRect(15, -20 - b, 2, 2); ctx.fillRect(18, -20 - b, 2, 2);
    ctx.strokeStyle = "#f2ead8"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(7, -22 - b); ctx.lineTo(12, -15 - b); ctx.stroke();   // bekas luka
  },
  wayangHidup(m, time, w) {
    const b = Math.sin(m.run * 0.8) * 4, kedut = Math.sin(time * 14 + m.x) * 0.15;
    ctx.strokeStyle = "rgba(30,20,40,0.5)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, -70 - b); ctx.lineTo(0, -140); ctx.moveTo(14, -40 - b); ctx.lineTo(18, -140); ctx.stroke();   // benang dalang
    ctx.save(); ctx.rotate(kedut);
    ctx.fillStyle = putih(w, "#7a3a1a"); ctx.beginPath(); ctx.moveTo(-6, -4 - b); ctx.lineTo(-10, -30 - b); ctx.lineTo(10, -30 - b); ctx.lineTo(6, -4 - b); ctx.closePath(); ctx.fill();   // kain
    ctx.fillStyle = putih(w, "#c9a24a"); ctx.beginPath(); ctx.moveTo(-8, -30 - b); ctx.lineTo(8, -30 - b); ctx.lineTo(5, -50 - b); ctx.lineTo(-5, -50 - b); ctx.closePath(); ctx.fill();   // badan berukir
    ctx.fillStyle = putih(w, "#2b2238"); ctx.beginPath(); ctx.ellipse(4, -58 - b, 6, 9, 0.3, 0, 6.28); ctx.fill();   // kepala profil
    ctx.beginPath(); ctx.moveTo(8, -60 - b); ctx.lineTo(16, -56 - b); ctx.lineTo(8, -54 - b); ctx.fill();   // hidung panjang
    ctx.fillStyle = "#c9a24a"; ctx.beginPath(); ctx.moveTo(-2, -66 - b); ctx.lineTo(4, -76 - b); ctx.lineTo(8, -66 - b); ctx.fill();   // mahkota
    ctx.strokeStyle = putih(w, "#2b2238"); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(6, -46 - b); ctx.lineTo(14, -40 - b); ctx.lineTo(20, -46 - b + Math.sin(time * 6) * 4); ctx.stroke();   // tangan tuding
    ctx.restore();
    ctx.fillStyle = "#b88cff"; ctx.fillRect(5, -60 - b, 2, 2);
  },
  kalajengking(m, time, w) {
    const b = Math.abs(Math.sin(m.run * 1.4)) * 1.5, ekor = m.state === "windup" ? -0.6 : Math.sin(time * 3) * 0.1;
    ctx.strokeStyle = putih(w, "#6b3a1a"); ctx.lineWidth = 2.5; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-8 + i * 5, -8); ctx.lineTo(-12 + i * 5, -2 + (i % 2 ? b : -b)); ctx.lineTo(-14 + i * 5, 0); ctx.stroke(); }
    ctx.fillStyle = putih(w, "#8a4a20"); ctx.beginPath(); ctx.ellipse(0, -10 - b, 16, 7, 0, 0, 6.28); ctx.fill();
    ctx.save(); ctx.translate(-14, -12 - b); ctx.rotate(ekor);
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-4 - i * 3, -6 - i * 6, 4.5 - i * 0.5, 0, 6.28); ctx.fill(); }
    ctx.fillStyle = "#3a1a0a"; ctx.beginPath(); ctx.moveTo(-14, -28); ctx.lineTo(-6, -34); ctx.lineTo(-10, -26); ctx.fill();
    ctx.restore();
    ctx.fillStyle = putih(w, "#8a4a20"); ctx.beginPath(); ctx.ellipse(20, -14 - b, 6, 4, -0.4, 0, 6.28); ctx.ellipse(20, -6 - b, 6, 4, 0.4, 0, 6.28); ctx.fill();   // capit
    ctx.fillStyle = "#1a0a00"; ctx.fillRect(12, -13 - b, 2, 2);
  },
  kerbauAmuk(m, time, w) {
    const b = m.state === "charge" ? Math.abs(Math.sin(m.run * 3)) * 3 : Math.abs(Math.sin(m.run)) * 1.5;
    gambarKaki4(putih(w, "#2b2420"), b, 12);
    ctx.fillStyle = putih(w, "#3d3530"); ctx.beginPath(); ctx.ellipse(-2, -22 - b, 22, 14, 0, 0, 6.28); ctx.fill();
    ctx.beginPath(); ctx.ellipse(20, -24 - b, 9, 9, 0, 0, 6.28); ctx.fill();
    ctx.strokeStyle = putih(w, "#d9cdb8"); ctx.lineWidth = 4; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(16, -30 - b); ctx.quadraticCurveTo(6, -44 - b, -6, -38 - b); ctx.moveTo(24, -30 - b); ctx.quadraticCurveTo(34, -44 - b, 30, -50 - b); ctx.stroke();   // tanduk melengkung
    ctx.fillStyle = "#ff5c5c"; ctx.fillRect(22, -27 - b, 3, 3);
    if (m.state === "charge") { ctx.fillStyle = "rgba(200,170,110,0.5)"; ctx.beginPath(); ctx.arc(-26, -4, 8 + Math.sin(time * 20) * 2, 0, 6.28); ctx.fill(); }
  },
  kudaLiar(m, time, w) {
    const b = m.state === "charge" ? Math.abs(Math.sin(m.run * 3)) * 4 : Math.abs(Math.sin(m.run * 1.4)) * 2;
    gambarKaki4(putih(w, "#5a3a20"), b, 16);
    ctx.fillStyle = putih(w, "#8a5a30"); ctx.beginPath(); ctx.ellipse(-2, -26 - b, 20, 10, 0, 0, 6.28); ctx.fill();
    ctx.save(); ctx.translate(14, -30 - b); ctx.rotate(-0.7);
    ctx.fillRect(-4, -18, 9, 20); ctx.beginPath(); ctx.ellipse(4, -22, 6, 10, 1.1, 0, 6.28); ctx.fill(); ctx.restore();
    ctx.fillStyle = putih(w, "#2b1a10"); ctx.beginPath(); ctx.moveTo(8, -34 - b); ctx.quadraticCurveTo(14, -50 - b, 20, -46 - b); ctx.lineTo(16, -36 - b); ctx.fill();   // surai
    ctx.strokeStyle = putih(w, "#2b1a10"); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-20, -28 - b); ctx.quadraticCurveTo(-30, -20, -28 + Math.sin(time * 8) * 3, -10); ctx.stroke();
    ctx.fillStyle = "#1a0a00"; ctx.fillRect(26, -46 - b, 2, 2);
  },
  arwahTugu(m, time, w) {
    const hover = -34 + Math.sin(m.run * 0.5) * 4;
    ctx.fillStyle = putih(w, "#8a7a5a"); ctx.beginPath(); ctx.moveTo(-10, hover + 16); ctx.lineTo(-7, hover - 20); ctx.lineTo(7, hover - 24); ctx.lineTo(10, hover + 16); ctx.closePath(); ctx.fill();
    ctx.fillStyle = putih(w, "#a8936a"); ctx.fillRect(-6, hover - 14, 6, 26);
    ctx.fillStyle = "#ffd27a"; ctx.shadowColor = "#ffd27a"; ctx.shadowBlur = 8; ctx.fillRect(-4, hover - 8, 3, 3); ctx.fillRect(2, hover - 8, 3, 3); ctx.shadowBlur = 0;
    for (let i = 0; i < 3; i++) { const a = time * 2 + i * 2.1; ctx.fillStyle = "rgba(255,220,140,0.6)"; ctx.beginPath(); ctx.arc(Math.cos(a) * 16, hover + Math.sin(a) * 8, 3, 0, 6.28); ctx.fill(); }
  },
  harimauDahan(m, time, w) {
    const b = Math.abs(Math.sin(m.run * 1.6)) * 2;
    ctx.strokeStyle = putih(w, "#8a7a5a"); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-16, -14); ctx.quadraticCurveTo(-34, -10, -34, -26 + Math.sin(time * 4) * 3); ctx.stroke();
    gambarKaki4(putih(w, "#6b5a3a"), b, 10);
    ctx.fillStyle = putih(w, "#a8936a"); ctx.beginPath(); ctx.ellipse(0, -18 - b, 20, 9, 0, 0, 6.28); ctx.fill();
    ctx.beginPath(); ctx.arc(18, -22 - b, 8, 0, 6.28); ctx.fill();
    ctx.fillStyle = putih(w, "#3a3020"); for (const [cx, cy] of [[-10, -20], [-2, -24], [6, -18], [-12, -14], [2, -14]]) { ctx.beginPath(); ctx.ellipse(cx, cy - b, 4, 2.5, 0.4, 0, 6.28); ctx.fill(); }   // corak awan
    ctx.fillStyle = "#e9f5c8"; ctx.fillRect(20, -25 - b, 2.5, 2.5);
    ctx.fillStyle = "#f2ead8"; ctx.fillRect(22, -18 - b, 2, 5);   // taring panjang
  },
  labaHutan(m, time, w) {
    const b = Math.abs(Math.sin(m.run * 2)) * 2;
    ctx.strokeStyle = putih(w, "#2a2030"); ctx.lineWidth = 2.5;
    for (let i = 0; i < 4; i++) for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(i * 4 - 6, -12 - b); ctx.lineTo(i * 4 - 6 + s * 12, -22 + (i % 2 ? b : -b) * 2); ctx.lineTo(i * 4 - 6 + s * 16, -2); ctx.stroke(); }
    ctx.fillStyle = putih(w, "#3a2a40"); ctx.beginPath(); ctx.ellipse(-6, -14 - b, 11, 9, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = putih(w, "#e05a3a"); ctx.beginPath(); ctx.ellipse(-8, -16 - b, 5, 3, 0, 0, 6.28); ctx.fill();   // tanda merah
    ctx.fillStyle = putih(w, "#2a2030"); ctx.beginPath(); ctx.arc(8, -13 - b, 6, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#ff5c5c"; for (const [ex, ey] of [[9, -15], [12, -14], [10, -12]]) ctx.fillRect(ex, ey - b, 1.6, 1.6);
  },
  kalongRaksasa(m, time, w) {
    const hover = -40 + Math.sin(m.run * 0.6) * 5, flap = Math.sin(m.run * 2.4) * 14;
    ctx.fillStyle = putih(w, "#4a2a1a");
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, hover); ctx.lineTo(s * 36, hover - 10 - flap); ctx.lineTo(s * 30, hover + 4); ctx.lineTo(s * 20, hover - 2); ctx.lineTo(s * 12, hover + 8); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = putih(w, "#8a4a20"); ctx.beginPath(); ctx.ellipse(0, hover + 2, 9, 12, 0, 0, 6.28); ctx.fill();
    ctx.beginPath(); ctx.ellipse(4, hover - 12, 7, 6, 0, 0, 6.28); ctx.fill();   // kepala rubah
    ctx.beginPath(); ctx.moveTo(0, hover - 16); ctx.lineTo(1, hover - 22); ctx.lineTo(4, hover - 17); ctx.moveTo(6, hover - 17); ctx.lineTo(9, hover - 22); ctx.lineTo(10, hover - 15); ctx.fill();
    ctx.fillStyle = "#ffd27a"; ctx.fillRect(5, hover - 13, 2, 2); ctx.fillRect(9, hover - 13, 2, 2);
  },
  kambingGunung(m, time, w) {
    const b = m.state === "charge" ? Math.abs(Math.sin(m.run * 3)) * 3 : Math.abs(Math.sin(m.run * 1.2)) * 1.5;
    gambarKaki4(putih(w, "#5a5048"), b, 12);
    ctx.fillStyle = putih(w, "#e8e2d8"); ctx.beginPath(); ctx.ellipse(-2, -22 - b, 18, 11, 0, 0, 6.28); ctx.fill();   // bulu tebal putih
    for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-14 + i * 6, -14 - b, 4, 0, 6.28); ctx.fill(); }
    ctx.fillStyle = putih(w, "#d0c8bc"); ctx.beginPath(); ctx.ellipse(17, -28 - b, 7, 8, 0.3, 0, 6.28); ctx.fill();
    ctx.strokeStyle = putih(w, "#5a4a3a"); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(12, -36 - b, 8, Math.PI * 1.1, Math.PI * 2.1); ctx.stroke();   // tanduk melingkar
    ctx.fillStyle = "#1a1010"; ctx.fillRect(20, -30 - b, 2, 2);
    ctx.fillStyle = putih(w, "#e8e2d8"); ctx.fillRect(18, -22 - b, 3, 6);   // janggut
  },
  rohSalju(m, time, w) {
    const hover = -36 + Math.sin(m.run * 0.6) * 6;
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = putih(w, "#f4f8ff"); ctx.beginPath(); ctx.moveTo(-12, hover + 10); ctx.quadraticCurveTo(-14, hover - 24, 0, hover - 26); ctx.quadraticCurveTo(14, hover - 24, 12, hover + 10);
    for (let i = 0; i <= 4; i++) ctx.lineTo(12 - i * 6, hover + 18 + Math.sin(time * 6 + i) * 3 * (i % 2 ? 1 : -1));
    ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
    ctx.fillStyle = "#6fb7ff"; ctx.shadowColor = "#6fb7ff"; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(-4, hover - 12, 2.5, 0, 6.28); ctx.arc(5, hover - 12, 2.5, 0, 6.28); ctx.fill(); ctx.shadowBlur = 0;
    for (let i = 0; i < 4; i++) { const a = time * 3 + i * 1.57; ctx.fillStyle = "rgba(220,240,255,0.8)"; ctx.fillRect(Math.cos(a) * 18 - 1, hover + Math.sin(a) * 10 - 1, 3, 3); }
  },
  arcaEs(m, time, w) {
    const b = m.state === "charge" ? Math.abs(Math.sin(m.run * 3)) * 2 : 0;
    ctx.fillStyle = putih(w, "#7fb8d8"); ctx.fillRect(-12, -18, 9, 18); ctx.fillRect(3, -18, 9, 18);
    ctx.fillStyle = putih(w, "#a9dcf5"); ctx.beginPath(); ctx.moveTo(-16, -18 - b); ctx.lineTo(16, -18 - b); ctx.lineTo(12, -46 - b); ctx.lineTo(-12, -46 - b); ctx.closePath(); ctx.fill();
    ctx.fillStyle = putih(w, "#d8f0ff"); ctx.fillRect(-8, -44 - b, 6, 24);
    ctx.fillStyle = putih(w, "#a9dcf5"); ctx.beginPath(); ctx.arc(0, -54 - b, 10, 0, 6.28); ctx.fill();
    ctx.fillStyle = putih(w, "#7fb8d8"); ctx.beginPath(); ctx.moveTo(-10, -60 - b); ctx.lineTo(-4, -70 - b); ctx.lineTo(0, -62 - b); ctx.lineTo(4, -72 - b); ctx.lineTo(10, -60 - b); ctx.fill();   // mahkota es
    ctx.fillStyle = "#2a6a9a"; ctx.fillRect(1, -56 - b, 3, 3); ctx.fillRect(6, -56 - b, 3, 3);
    ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-10, -40 - b); ctx.lineTo(-2, -30 - b); ctx.lineTo(6, -38 - b); ctx.stroke();
  },

  // ---------- BOS ----------
  juraganTopeng(m, time, w) {
    const b = Math.sin(m.run * 0.5) * 2, angkat = m.state === "ancang" ? clamp(1 - m.st, 0, 1) : 0;
    ctx.fillStyle = putih(w, "#1f1a24"); ctx.fillRect(-16, -28, 12, 28); ctx.fillRect(4, -28, 12, 28);
    ctx.fillStyle = putih(w, "#5a1a2a"); ctx.beginPath(); ctx.moveTo(-28, -28); ctx.lineTo(28, -28); ctx.lineTo(22, -74 - b); ctx.lineTo(-22, -74 - b); ctx.closePath(); ctx.fill();   // jubah
    ctx.fillStyle = putih(w, "#c9a24a"); ctx.fillRect(-22, -50 - b, 44, 5);   // sabuk emas
    ctx.fillStyle = putih(w, "#2b2238"); ctx.beginPath(); ctx.ellipse(-30, -70 - b, 9, 16, 0.4, 0, 6.28); ctx.fill();   // lengan jubah
    // topeng-topeng di pinggang
    for (let i = 0; i < 4; i++) { ctx.fillStyle = ["#f2ead8", "#c0392b", "#2a6a9a", "#f4b942"][i]; ctx.beginPath(); ctx.ellipse(-16 + i * 11, -40 - b, 4.5, 6, 0, 0, 6.28); ctx.fill(); }
    // kepala & topeng besar
    ctx.fillStyle = putih(w, "#e3ae7f"); ctx.beginPath(); ctx.arc(0, -86 - b, 15, 0, 6.28); ctx.fill();
    const wajah = ["#f2ead8", "#c0392b", "#2a6a9a"][Math.floor(time / 2) % 3];   // topengnya berganti-ganti
    ctx.fillStyle = putih(w, wajah); ctx.beginPath(); ctx.ellipse(4, -86 - b, 14, 16, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#1f1a24"; ctx.beginPath(); ctx.ellipse(-1, -90 - b, 3, 2, 0, 0, 6.28); ctx.ellipse(10, -90 - b, 3, 2, 0, 0, 6.28); ctx.fill();
    ctx.strokeStyle = "#1f1a24"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(5, -80 - b, 6, 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.fillStyle = putih(w, "#1f1a24"); ctx.fillRect(-16, -106 - b, 34, 7); ctx.fillRect(-8, -116 - b, 18, 10);   // blangkon tinggi
    ctx.save(); ctx.translate(30, -64 - b); ctx.rotate(-0.4 - angkat * 1.2);
    ctx.strokeStyle = putih(w, "#c9d6e3"); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(10, -30, 4, -54); ctx.stroke();   // keris besar berlekuk
    ctx.restore();
  },
  kudaSembrani(m, time, w) {
    const hover = -40 + Math.sin(m.run * 0.5) * 6, kepak = Math.sin(m.run * 1.3) * 22;
    const hitam = putih(w, m.fase > 1 ? "#1a0f24" : "#231a2b");
    for (const s of [1, -1]) {   // sayap
      ctx.fillStyle = s > 0 ? putih(w, "#3a2a4a") : putih(w, "#2b2238");
      ctx.beginPath(); ctx.moveTo(-4, hover - 30); ctx.quadraticCurveTo(-30, hover - 80 - kepak, -70, hover - 70 - kepak * s * 0.4); ctx.lineTo(-50, hover - 40); ctx.lineTo(-60, hover - 30 - kepak * 0.3); ctx.lineTo(-20, hover - 18); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = hitam; for (const kx of [-22, -10, 10, 22]) ctx.fillRect(kx, hover - 14 + Math.sin(m.run * 2 + kx) * 3, 6, 22);
    ctx.beginPath(); ctx.ellipse(0, hover - 26, 32, 16, 0, 0, 6.28); ctx.fill();
    ctx.save(); ctx.translate(26, hover - 34); ctx.rotate(-0.8); ctx.fillRect(-7, -32, 14, 34); ctx.beginPath(); ctx.ellipse(6, -36, 9, 16, 1.1, 0, 6.28); ctx.fill(); ctx.restore();
    ctx.fillStyle = putih(w, "#5a3a8a"); ctx.beginPath(); ctx.moveTo(20, -40 + hover); ctx.quadraticCurveTo(28, -80 + hover, 40, -70 + hover); ctx.lineTo(32, -44 + hover); ctx.fill();   // surai ungu
    ctx.fillStyle = "#ff5c8a"; ctx.shadowColor = "#ff5c8a"; ctx.shadowBlur = 10; ctx.fillRect(44, hover - 70, 4, 4); ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(30,20,40,0.55)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, hover - 40); ctx.lineTo(-10, hover - 200); ctx.moveTo(30, hover - 60); ctx.lineTo(40, hover - 200); ctx.stroke();   // benang sepi
    ctx.strokeStyle = putih(w, "#3a2a4a"); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-30, hover - 26); ctx.quadraticCurveTo(-50, hover - 10, -46 + Math.sin(time * 6) * 4, hover + 8); ctx.stroke();
  },
  watuGede(m, time, w) {
    const b = Math.sin(m.run * 0.3) * 2, angkat = m.state === "ancang" ? clamp(1 - m.st, 0, 1) : 0;
    const batu = putih(w, m.fase > 1 ? "#7a6a4a" : "#8a7a5a"), terang = putih(w, "#a8936a");
    ctx.fillStyle = batu; ctx.fillRect(-30, -40, 22, 40); ctx.fillRect(8, -40, 22, 40);
    ctx.beginPath(); ctx.moveTo(-42, -40); ctx.lineTo(42, -40); ctx.lineTo(34, -110 - b); ctx.lineTo(-34, -110 - b); ctx.closePath(); ctx.fill();
    ctx.fillStyle = terang; ctx.fillRect(-30, -104 - b, 16, 56);
    ctx.fillStyle = batu; ctx.fillRect(-20, -138 - b, 40, 30);   // kepala balok
    ctx.fillStyle = "#ffd27a"; ctx.shadowColor = "#ffd27a"; ctx.shadowBlur = 14; ctx.fillRect(-10, -128 - b, 7, 5); ctx.fillRect(5, -128 - b, 7, 5); ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,210,122,0.7)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-20, -90 - b); ctx.lineTo(-6, -70 - b); ctx.lineTo(10, -86 - b); ctx.lineTo(24, -60 - b); ctx.stroke();   // retak bercahaya
    ctx.save(); ctx.translate(44, -96 - b); ctx.rotate(-0.2 - angkat * 1.4);
    ctx.fillStyle = batu; ctx.fillRect(-10, -6, 20, 50); ctx.fillStyle = terang; ctx.fillRect(-14, 38, 28, 22); ctx.restore();   // lengan & kepalan
    ctx.fillStyle = batu; ctx.fillRect(-56, -96 - b, 16, 40);
  },
  weweGombel(m, time, w) {
    const hover = -10 + Math.sin(m.run * 0.4) * 4;
    ctx.fillStyle = putih(w, "#2b2238"); ctx.beginPath(); ctx.moveTo(-26, hover); ctx.quadraticCurveTo(-30, hover - 80, -10, hover - 110); ctx.lineTo(10, hover - 110); ctx.quadraticCurveTo(30, hover - 80, 26, hover);
    for (let i = 0; i <= 5; i++) ctx.lineTo(26 - i * 10.4, hover + 8 + Math.sin(time * 5 + i) * 4 * (i % 2 ? 1 : -1));
    ctx.closePath(); ctx.fill();   // kain panjang
    ctx.fillStyle = putih(w, "#8a6a9a"); ctx.beginPath(); ctx.ellipse(0, hover - 70, 16, 22, 0, 0, 6.28); ctx.fill();   // selendang
    ctx.fillStyle = putih(w, "#d8c8a8"); ctx.beginPath(); ctx.arc(4, hover - 118, 13, 0, 6.28); ctx.fill();
    ctx.fillStyle = putih(w, "#1a1420"); ctx.beginPath(); ctx.moveTo(-14, hover - 120); ctx.quadraticCurveTo(-22, hover - 60, -10, hover - 20); ctx.lineTo(-4, hover - 100); ctx.quadraticCurveTo(4, hover - 136, 18, hover - 120); ctx.quadraticCurveTo(10, hover - 132, -14, hover - 120); ctx.fill();   // rambut panjang terurai
    ctx.fillStyle = m.fase > 1 ? "#ff5c5c" : "#b88cff"; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 10; ctx.fillRect(4, hover - 121, 3, 3); ctx.fillRect(11, hover - 121, 3, 3); ctx.shadowBlur = 0;
    ctx.strokeStyle = putih(w, "#d8c8a8"); ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(14, hover - 86); ctx.quadraticCurveTo(36, hover - 70, 34 + Math.sin(time * 3) * 4, hover - 50); ctx.stroke();   // lengan panjang
    ctx.strokeStyle = "rgba(30,20,40,0.5)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, hover - 110); ctx.lineTo(4, hover - 240); ctx.stroke();
  },
  yaksaEs(m, time, w) {
    const b = Math.sin(m.run * 0.4) * 2, angkat = m.state === "ancang" ? clamp(1 - m.st, 0, 1) : 0;
    const es = putih(w, m.fase > 1 ? "#6fa8d8" : "#8fc8ea"), gelap = putih(w, "#3a6a9a");
    ctx.fillStyle = gelap; ctx.fillRect(-26, -36, 18, 36); ctx.fillRect(8, -36, 18, 36);
    ctx.fillStyle = es; ctx.beginPath(); ctx.moveTo(-40, -36); ctx.lineTo(40, -36); ctx.lineTo(32, -104 - b); ctx.lineTo(-32, -104 - b); ctx.closePath(); ctx.fill();
    ctx.fillStyle = putih(w, "#d8f0ff"); ctx.fillRect(-26, -96 - b, 52, 10); ctx.fillStyle = putih(w, "#c9a24a"); ctx.fillRect(-28, -60 - b, 56, 6);   // kalung & sabuk
    ctx.fillStyle = es; ctx.beginPath(); ctx.arc(0, -120 - b, 20, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#1a3a5a"; ctx.beginPath(); ctx.arc(-7, -124 - b, 4, 0, 6.28); ctx.arc(9, -124 - b, 4, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#f4f8ff"; ctx.beginPath(); ctx.moveTo(-8, -110 - b); ctx.lineTo(-5, -100 - b); ctx.lineTo(-2, -110 - b); ctx.moveTo(4, -110 - b); ctx.lineTo(7, -100 - b); ctx.lineTo(10, -110 - b); ctx.fill();   // taring
    ctx.fillStyle = putih(w, "#c9a24a"); ctx.beginPath(); ctx.moveTo(-18, -136 - b); ctx.lineTo(-10, -156 - b); ctx.lineTo(0, -140 - b); ctx.lineTo(10, -158 - b); ctx.lineTo(18, -136 - b); ctx.closePath(); ctx.fill();   // mahkota
    ctx.save(); ctx.translate(40, -90 - b); ctx.rotate(-0.3 - angkat * 1.3);
    ctx.fillStyle = gelap; ctx.fillRect(-4, -70, 8, 100); ctx.fillStyle = putih(w, "#d8f0ff"); ctx.beginPath(); ctx.arc(0, -76, 16, 0, 6.28); ctx.fill();   // gada es
    ctx.restore();
  },
  macanPutih(m, time, w) {
    const b = m.state === "terjang" || m.state === "charge" ? Math.abs(Math.sin(m.run * 3)) * 4 : Math.abs(Math.sin(m.run * 1.2)) * 2;
    const bulu = putih(w, "#f2f6ff"), loreng = putih(w, m.fase > 1 ? "#5a3a8a" : "#2b2238");
    ctx.strokeStyle = bulu; ctx.lineWidth = 9; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(-40, -36); ctx.quadraticCurveTo(-70, -30, -66, -60 + Math.sin(time * 3) * 5); ctx.stroke();
    ctx.fillStyle = bulu; for (const kx of [-30, -16, 14, 28]) ctx.fillRect(kx, -26 + (kx % 4 ? b : -b), 10, 26);
    ctx.beginPath(); ctx.ellipse(0, -40 - b, 44, 20, 0, 0, 6.28); ctx.fill();
    ctx.beginPath(); ctx.arc(42, -50 - b, 18, 0, 6.28); ctx.fill();
    ctx.fillStyle = loreng; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-30 + i * 11, -58 - b); ctx.lineTo(-24 + i * 11, -42 - b); ctx.lineTo(-28 + i * 11, -26 - b); ctx.lineTo(-32 + i * 11, -42 - b); ctx.closePath(); ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(36, -66 - b); ctx.lineTo(40, -58 - b); ctx.lineTo(44, -66 - b); ctx.fill();
    ctx.fillStyle = bulu; ctx.beginPath(); ctx.arc(34, -66 - b, 6, 0, 6.28); ctx.arc(50, -66 - b, 6, 0, 6.28); ctx.fill();   // telinga
    ctx.fillStyle = "#6fb7ff"; ctx.shadowColor = "#6fb7ff"; ctx.shadowBlur = 10; ctx.fillRect(44, -54 - b, 4, 3); ctx.fillRect(52, -54 - b, 4, 3); ctx.shadowBlur = 0;
    ctx.fillStyle = "#ff8fa8"; ctx.beginPath(); ctx.arc(58, -46 - b, 3, 0, 6.28); ctx.fill();
  },
  dalangSepi(m, time, w) {
    const b = Math.sin(m.run * 0.4) * 2, angkat = m.state === "ancang" ? clamp(1 - m.st, 0, 1) : 0;
    // benang-benang ke wayang di kiri-kanan
    ctx.strokeStyle = "rgba(20,10,30,0.6)"; ctx.lineWidth = 1.2;
    for (let i = 0; i < 6; i++) { const a = time * 0.8 + i; ctx.beginPath(); ctx.moveTo(14, -96 - b); ctx.lineTo(Math.cos(a) * 90, -60 + Math.sin(a * 1.3) * 30); ctx.stroke(); }
    ctx.fillStyle = putih(w, "#1a1424"); ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.lineTo(22, -96 - b); ctx.lineTo(-22, -96 - b); ctx.closePath(); ctx.fill();   // jubah hitam
    ctx.fillStyle = putih(w, "#3a2a55"); ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(-10, 0); ctx.lineTo(-8, -90 - b); ctx.lineTo(-20, -90 - b); ctx.closePath(); ctx.fill();
    ctx.fillStyle = putih(w, "#c9a24a"); ctx.fillRect(-22, -60 - b, 44, 4);
    ctx.fillStyle = putih(w, "#f2ead8"); ctx.beginPath(); ctx.ellipse(2, -110 - b, 15, 18, 0, 0, 6.28); ctx.fill();   // topeng tanpa wajah
    ctx.strokeStyle = "rgba(30,20,40,0.35)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-6, -112 - b); ctx.lineTo(10, -112 - b); ctx.stroke();
    ctx.fillStyle = putih(w, "#1a1424"); ctx.beginPath(); ctx.moveTo(-16, -120 - b); ctx.quadraticCurveTo(2, -148 - b, 20, -120 - b); ctx.lineTo(18, -126 - b); ctx.quadraticCurveTo(2, -138 - b, -14, -126 - b); ctx.closePath(); ctx.fill();   // tudung
    ctx.save(); ctx.translate(26, -80 - b); ctx.rotate(-0.4 - angkat * 1.1);
    ctx.fillStyle = putih(w, "#c9a24a"); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-8, -40); ctx.lineTo(0, -60); ctx.lineTo(8, -40); ctx.closePath(); ctx.fill();   // gunungan kecil di tangan
    ctx.fillStyle = "#5a3a8a"; ctx.beginPath(); ctx.arc(0, -36, 5, 0, 6.28); ctx.fill();
    ctx.restore();
    // wayang kecil melayang (gema bos lama)
    for (let i = 0; i < 2; i++) { const a = time * 1.2 + i * Math.PI, wx = Math.cos(a) * 70, wy = -70 + Math.sin(a) * 18; ctx.fillStyle = "rgba(201,162,74,0.85)"; ctx.beginPath(); ctx.moveTo(wx, wy); ctx.lineTo(wx - 6, wy - 26); ctx.lineTo(wx + 4, wy - 36); ctx.lineTo(wx + 8, wy - 22); ctx.lineTo(wx + 6, wy); ctx.closePath(); ctx.fill(); }
  },
});
