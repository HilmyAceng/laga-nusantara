// =====================================================================
// KOLEKSI IKAN (Menu › Gameplay › Koleksi Ikan)
// Semua 85 ikan tampil sebagai kotak bernomor (#01-#85), dikelompokkan per kelangkaan
// (biasa #01-50, langka #51-75, legenda #76-85; di dalamnya urut sesuai spot).
//  - sudah ditangkap : gambar ikan berwarna, nama, jumlah tangkapan
//  - belum ditangkap : siluet samar & "???"
// Ketuk kotak → panel detail di atas: tempat, kapan muncul, harga, jumlah, rekor berat.
// Tempat & waktu muncul tetap terlihat untuk ikan yang belum ditangkap (sebagai petunjuk).
// Gambar tiap ikan dibuat dari IKAN[id].rupa (99ka-data-ikan.js) oleh gambarRupaIkan().
// =====================================================================
"use strict";

// ---------- Gambar ikan sesuai rupanya ----------
// Kepala menghadap kiri. siluet = true → semua warna jadi gelap (ikan belum ditemukan).
function gambarRupaIkan(c, x, y, s, id, time, siluet) {
  const F = IKAN[id], R = F.rupa || {}, b = R.b || "oval", k = R.k || "";
  const gelap = "rgba(190,180,225,0.2)";
  const w = siluet ? gelap : R.w || "#9fb4c8", w2 = siluet ? gelap : R.w2 || "#5a6e80";
  const ukuran = { oval: [14, 7], ramping: [17, 5], pipih: [12, 10], bulat: [12, 11], lele: [15, 6], belut: [18, 4] }[b];
  const [rx, ry] = ukuran;
  c.save(); c.translate(x, y); c.scale(s, s); c.rotate(time ? Math.sin(time * 6) * 0.1 : 0);
  // cahaya ikan legenda
  if (F.rar === "legenda" && !siluet) {
    const g = c.createRadialGradient(0, 0, 4, 0, 0, 30);
    g.addColorStop(0, "rgba(255,230,150,0.45)"); g.addColorStop(1, "rgba(255,230,150,0)");
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, 30, 0, 6.28); c.fill();
  }
  // ekor
  c.fillStyle = k === "sirip" || k === "pelangi" ? w2 : w;
  if (b === "belut") { c.beginPath(); c.moveTo(rx + 8, 0); c.lineTo(rx + 16, -4); c.lineTo(rx + 16, 4); c.closePath(); c.fill(); }
  else { const e = b === "bulat" ? 6 : b === "pipih" ? 9 : 8; c.beginPath(); c.moveTo(rx - 2, 0); c.lineTo(rx + 9, -e); c.quadraticCurveTo(rx + 5, 0, rx + 9, e); c.closePath(); c.fill(); }
  // sirip punggung & perut
  c.fillStyle = k === "sirip" || k === "pelangi" ? w2 : w;
  if (b !== "belut") {
    c.beginPath(); c.moveTo(-rx * 0.35, -ry + 1); c.quadraticCurveTo(0, -ry - (b === "pipih" ? 7 : 5), rx * 0.5, -ry + 2); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(-rx * 0.1, ry - 1); c.lineTo(rx * 0.35, ry + 4); c.lineTo(rx * 0.45, ry - 1); c.closePath(); c.fill();
  }
  // badan
  c.beginPath();
  if (b === "belut") {   // badan panjang meliuk
    c.moveTo(-rx, 0);
    for (let i = 0; i <= 12; i++) { const px = -rx + (i / 12) * (2 * rx + 8), py = Math.sin(i * 0.9 + (time || 0) * 5) * 2.5; c.lineTo(px, py - ry * (1 - i / 16)); }
    for (let i = 12; i >= 0; i--) { const px = -rx + (i / 12) * (2 * rx + 8), py = Math.sin(i * 0.9 + (time || 0) * 5) * 2.5; c.lineTo(px, py + ry * (1 - i / 16)); }
    c.closePath();
  } else c.ellipse(0, 0, rx, ry, 0, 0, 6.28);
  if (k === "pelangi" && !siluet) {
    const g = c.createLinearGradient(-rx, 0, rx, 0);
    g.addColorStop(0, w); g.addColorStop(0.55, w2); g.addColorStop(1, w);
    c.fillStyle = g;
  } else c.fillStyle = w;
  c.fill();
  // corak (dipotong mengikuti badan)
  if (!siluet && (k === "garis" || k === "totol" || k === "pelangi")) {
    c.save(); c.clip(); c.fillStyle = w2;
    if (k === "garis") for (let i = -1; i <= 2; i++) c.fillRect(i * rx * 0.45 - 1.5, -ry, 3, ry * 2);
    if (k === "totol") for (const [px, py] of [[-4, -2], [2, 1], [7, -3], [-1, 3], [5, 3], [10, 0]]) { c.beginPath(); c.arc(px * rx / 14, py * ry / 7, 1.4, 0, 6.28); c.fill(); }
    if (k === "pelangi") { c.fillStyle = "rgba(255,255,255,0.35)"; c.fillRect(-rx, -ry * 0.25, rx * 2, ry * 0.25); }
    c.restore();
  }
  // perut terang
  if (!siluet && b !== "belut") { c.fillStyle = "rgba(255,255,255,0.18)"; c.beginPath(); c.ellipse(-1, ry * 0.45, rx * 0.7, ry * 0.35, 0, 0, 6.28); c.fill(); }
  // kumis (lele)
  if (b === "lele") { c.strokeStyle = siluet ? gelap : w2; c.lineWidth = 1; c.beginPath(); c.moveTo(-rx + 2, 1); c.quadraticCurveTo(-rx - 5, 4, -rx - 8, 8); c.moveTo(-rx + 2, 0); c.quadraticCurveTo(-rx - 6, -1, -rx - 9, 2); c.stroke(); }
  // mata
  if (!siluet) {
    c.fillStyle = "#fff"; c.beginPath(); c.arc(-rx + 5, -ry * 0.25, 2.2, 0, 6.28); c.fill();
    c.fillStyle = "#1b1208"; c.beginPath(); c.arc(-rx + 4.6, -ry * 0.25, 1.3, 0, 6.28); c.fill();
  }
  c.restore();
}

// Gambar ikan → gambar PNG kecil (disimpan supaya tidak digambar ulang tiap buka menu)
const ikonIkanCache = {};
function ikonIkan(id, siluet, besar) {
  const kunci = id + (siluet ? ":s" : "") + (besar ? ":b" : "");
  if (ikonIkanCache[kunci]) return ikonIkanCache[kunci];
  const cv = document.createElement("canvas"), sk = besar ? 2 : 1;
  cv.width = 84 * sk; cv.height = 56 * sk;
  const c = cv.getContext("2d"), b = IKAN[id].rupa.b, ukuran = b === "belut" ? 1.45 : 1.75;
  gambarRupaIkan(c, cv.width / 2 - 4 * sk, cv.height / 2, ukuran * sk, id, 0, siluet);
  return (ikonIkanCache[kunci] = cv.toDataURL());
}

// ---------- Teks bantu ----------
const urutIkan = () => {
  const spot = Object.keys(SPOT_MANCING);
  const rar = ["biasa", "langka", "legenda"];   // nomor: biasa #01-50, langka #51-75, legenda #76-85
  return Object.keys(IKAN).sort((a, b) => rar.indexOf(IKAN[a].rar) - rar.indexOf(IKAN[b].rar) || spot.indexOf(IKAN[a].tempat) - spot.indexOf(IKAN[b].tempat));
};
function teksSyaratIkan(id) {
  const q = IKAN[id].syarat;
  if (!q) return Lx(["Kapan saja", "Any time"]);
  const bagian = [];
  if (q.waktu === "malam") bagian.push(Lx(["🌙 Malam hari", "🌙 At night"]));
  if (q.waktu === "pagi") bagian.push(Lx(["🌅 Pagi hari", "🌅 In the morning"]));
  if (q.cuaca === "hujan") bagian.push(Lx(["🌧 Saat hujan", "🌧 When it rains"]));
  if (q.cuaca === "salju") bagian.push(Lx(["❄ Saat salju turun", "❄ When it snows"]));
  return bagian.join(" · ");
}
const ikonSyaratIkan = (id) => { const q = IKAN[id].syarat; return !q ? "" : q.waktu === "malam" ? "🌙" : q.waktu === "pagi" ? "🌅" : q.cuaca === "hujan" ? "🌧" : "❄"; };
function namaAreaSpot(tempat) { const a = AREAS[SPOT_MANCING[tempat].area]; return a ? Lx([a.nama, a.namaEn || a.nama]) : ""; }

// ---------- Halaman Menu › Gameplay › Koleksi Ikan ----------
let ikanDipilih = null;
{
  const v = document.createElement("div");
  v.className = "pview"; v.dataset.view = "ikan"; v.hidden = true;
  v.innerHTML = `<p class="eyebrow" id="ikanEyebrow"></p><h1 id="ikanJudul"></h1>
    <div class="gp-list"><div id="ikanRingkas"></div><div class="ik-detail" id="ikanDetail"></div><div id="ikanIsi"></div></div>
    <div class="menu"><button class="go alt back go-dinamis" type="button" data-go="gameplay" id="ikanKembali"></button></div>`;
  document.querySelector('#pausePanel .pview[data-view="koleksi"]').after(v);
  const b = document.createElement("button");
  b.className = "go alt go-dinamis"; b.type = "button"; b.dataset.go = "ikan"; b.id = "btnIkanMenu";
  document.querySelector('#pausePanel .pview[data-view="gameplay"] [data-go="koleksi"]').after(b);
  PAUSE_BACK.ikan = "gameplay";
  // ketuk kotak ikan → detail
  $("ikanIsi").addEventListener("click", (e) => {
    const k = e.target.closest("[data-ikan]"); if (!k) return;
    ikanDipilih = k.dataset.ikan; sfx.click(); isiDetailIkan();
    document.querySelectorAll("#ikanIsi .ik-kotak").forEach((el) => el.classList.toggle("dipilih", el === k));
    $("ikanDetail").scrollIntoView({ block: "nearest", behavior: "smooth" });
  });
  const isiTombol = () => { $("btnIkanMenu").textContent = Lx(["Koleksi Ikan", "Fish Collection"]); };
  isiTombol();
  const showAsli = showPauseView;
  showPauseView = function (view, silent) {
    showAsli(view, silent);
    if (view === "gameplay") isiTombol();
    if (view === "ikan") { $("pausePanel").classList.add("wide"); isiKoleksiIkan(); }
  };
}
function isiDetailIkan() {
  const id = ikanDipilih, el = $("ikanDetail");
  if (!id) { el.innerHTML = `<p class="ik-kosong">${Lx(["Ketuk kotak ikan untuk melihat detailnya.", "Tap a fish box to see its details."])}</p>`; return; }
  const F = IKAN[id], k = dataIkan().koleksi[id], R = RAR_IKAN[F.rar], no = urutIkan().indexOf(id) + 1;
  el.innerHTML = `<img src="${ikonIkan(id, !k, true)}" alt="">
    <div><small>#${String(no).padStart(2, "0")} · <span style="color:${R.warna}">${t("rarity." + F.rar)}</span></small>
      <b>${k ? namaIkan(id) : "???"}</b>
      <p>📍 ${Lx(SPOT_MANCING[F.tempat].nama)} <i>(${namaAreaSpot(F.tempat)})</i></p>
      <p>⏱ ${teksSyaratIkan(id)}</p>
      <p>${k ? Lx([`Ditangkap ${k.n}× · rekor ${k.berat} kg · harga ${F.harga} koin`, `Caught ${k.n}× · record ${k.berat} kg · worth ${F.harga} coins`])
              : Lx(["Belum pernah ditangkap.", "Not caught yet."])}</p></div>`;
}
function isiKoleksiIkan() {
  const K = dataIkan().koleksi, semua = urutIkan(), dapat = semua.filter((id) => K[id]).length;
  $("ikanEyebrow").textContent = Lx(["Gameplay › Koleksi Ikan", "Gameplay › Fish Collection"]);
  $("ikanJudul").innerHTML = Lx(["Koleksi <span>Ikan</span>", "Fish <span>Collection</span>"]);
  $("ikanKembali").textContent = t("h.kembali");
  const per = (r) => { const d = semua.filter((id) => IKAN[id].rar === r); return [d.filter((id) => K[id]).length, d.length]; };
  $("ikanRingkas").innerHTML = `<div class="st-box"><b>${Lx([`Ikan ditemukan: ${dapat} / ${semua.length}`, `Fish found: ${dapat} / ${semua.length}`])}</b>
    <div class="st-bar"><i style="width:${(100 * dapat) / semua.length}%"></i></div>
    <small>${["biasa", "langka", "legenda"].map((r) => `${t("rarity." + r)} ${per(r).join(" / ")}`).join(" · ")} · ${Lx(["total tangkapan", "total caught"])} ${dataIkan().total || 0}</small></div>`;
  $("ikanIsi").innerHTML = ["biasa", "langka", "legenda"].map((r) => {
    const ids = semua.filter((id) => IKAN[id].rar === r), [n, tot] = per(r);
    return `<h3 style="color:${RAR_IKAN[r].warna}">${t("rarity." + r)} · ${n} / ${tot}</h3>
      <div class="ik-grid">${ids.map((id) => {
        const k = K[id], no = semua.indexOf(id) + 1;
        return `<button type="button" class="ik-kotak ik-${r} ${k ? "" : "ik-belum"} ${id === ikanDipilih ? "dipilih" : ""}" data-ikan="${id}">
          <span class="ik-no">#${String(no).padStart(2, "0")}</span>${ikonSyaratIkan(id) ? `<span class="ik-syarat">${ikonSyaratIkan(id)}</span>` : ""}
          <img src="${ikonIkan(id, !k)}" alt="">
          <b>${k ? namaIkan(id) : "???"}</b>
          <small>${k ? `×${k.n}` : Lx(SPOT_MANCING[IKAN[id].tempat].nama)}</small></button>`;
      }).join("")}</div>`;
  }).join("");
  isiDetailIkan();
}
