// =====================================================================
// TOMBOL BAGIKAN + KARTU GAMBAR
// Di momen membanggakan (bos tumbang, bab tamat, ikan langka/legenda, pencapaian
// rahasia, rekor Mode Bertahan) muncul tombol "📤 Bagikan" selama beberapa detik.
// Juga ada di Menu jeda › Bagikan (kartu umum: hero, level, bab).
// Kartu: gambar 1080×1080 (hero, momen, level, tautan game) dibuat dengan kanvas.
//  - HP: menu bagikan bawaan (WhatsApp, IG, dll.) lewat navigator.share + file gambar.
//  - Komputer / browser yang tidak mendukung: gambar diunduh + teks & tautan disalin.
// Pemanggilan dari fitur lain: momenBagikan({ judul: [id, en], sub: [id, en], warna })
// =====================================================================
"use strict";

const URL_GAME = "https://hilmyaceng.github.io/laga-nusantara/";
let momenTerakhir = null, momenT = 0;

// ---------- Tombol mengambang ----------
const tombolBagikan = document.createElement("button");
tombolBagikan.id = "btnBagikanMomen"; tombolBagikan.type = "button"; tombolBagikan.hidden = true;
document.body.appendChild(tombolBagikan);
tombolBagikan.addEventListener("click", () => { sfx.click(); bagikanKartu(momenTerakhir); tombolBagikan.hidden = true; momenT = 0; });

function momenBagikan(m) {
  if (!S) return;
  momenTerakhir = m; momenT = 9;
  tombolBagikan.textContent = "📤 " + Lx(["Bagikan momen ini", "Share this moment"]);
  tombolBagikan.hidden = false;
  tombolBagikan.classList.remove("muncul"); void tombolBagikan.offsetWidth; tombolBagikan.classList.add("muncul");
}
UPDATE_TAMBAHAN.push((dt) => {
  if (momenT <= 0) return;
  if (mode === "play" || mode === "dialog" || mode === "mancing") momenT -= dt;
  tombolBagikan.hidden = momenT <= 0 || !(mode === "play" || mode === "mancing" || mode === "win");
});

// ---------- Kartu gambar ----------
function buatKartu(m) {
  const c = document.createElement("canvas"); c.width = c.height = 1080;
  const g = c.getContext("2d"), C = CLASSES[S.cls], warna = (m && m.warna) || "#f4b942";
  // latar: langit malam ungu + kabut merah + tanah
  const bg = g.createLinearGradient(0, 0, 0, 1080);
  bg.addColorStop(0, "#1a1030"); bg.addColorStop(0.55, "#3a1a3a"); bg.addColorStop(1, "#140d24");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1080);
  const kabut = g.createRadialGradient(540, 640, 40, 540, 640, 620);
  kabut.addColorStop(0, warna + "55"); kabut.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = kabut; g.fillRect(0, 0, 1080, 1080);
  for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(255,240,220,${0.15 + (i % 5) * 0.08})`; g.fillRect((i * 389) % 1080, (i * 211) % 520, 3, 3); }
  g.fillStyle = "#2f5a2a"; g.beginPath(); g.ellipse(540, 900, 520, 120, 0, 0, 6.28); g.fill();
  g.fillStyle = "#3d7a34"; g.beginPath(); g.ellipse(540, 890, 420, 90, 0, 0, 6.28); g.fill();
  // hero (digambar besar dengan fungsi yang sama seperti di dalam game)
  g.save(); g.translate(540, 890); g.scale(6, 6);
  drawPerson(g, { x: 0, y: 0, face: 0.2, run: 0, moving: false, swing: 0, inv: 0, flash: 0 }, typeof lookPemain === "function" ? lookPemain() : { color: C.color, accent: C.accent, weapon: C.weapon }, 0, { preview: true });
  g.restore();
  // judul game
  g.textAlign = "center";
  g.font = "700 120px Teko, sans-serif"; g.textAlign = "right"; g.fillStyle = "#f7efe3"; g.fillText("Laga", 430, 150);
  g.textAlign = "left"; g.fillStyle = "#f4b942"; g.fillText("Nusantara", 452, 150); g.textAlign = "center";
  g.font = "800 30px Nunito, sans-serif"; g.fillStyle = "rgba(247,239,227,0.75)";
  g.fillText(Lx(["Petualangan aksi bertema Nusantara", "An Indonesian-folklore action adventure"]), 540, 200);
  // momen
  const judul = m ? Lx(m.judul) : Lx(["Petualanganku", "My adventure"]);
  const sub = m && m.sub ? Lx(m.sub) : (langkahCerita() ? langkahCerita().bab : "");
  g.fillStyle = "rgba(10,6,20,0.65)"; roundRect(g, 90, 270, 900, 190, 30); g.fill();
  g.strokeStyle = warna; g.lineWidth = 4; roundRect(g, 90, 270, 900, 190, 30); g.stroke();
  g.font = "700 78px Teko, sans-serif"; g.fillStyle = warna; g.fillText(judul.slice(0, 34), 540, 360);
  g.font = "800 34px Nunito, sans-serif"; g.fillStyle = "#f7efe3"; g.fillText(sub.slice(0, 48), 540, 420);
  // identitas hero
  const gelar = typeof gelarAktif === "function" && gelarAktif() ? " · " + gelarAktif() : "";
  g.font = "800 38px Nunito, sans-serif"; g.fillStyle = "#f7efe3";
  g.fillText(`${C.name} · Lv ${S.lv}${gelar}`, 540, 975);
  // ajakan + tautan
  g.fillStyle = "#e5484d"; roundRect(g, 250, 1000, 580, 56, 28); g.fill();
  g.font = "800 28px Nunito, sans-serif"; g.fillStyle = "#fff";
  g.fillText(Lx(["Main gratis: ", "Play free: "]) + "hilmyaceng.github.io/laga-nusantara", 540, 1038);
  return c;
}

async function bagikanKartu(m) {
  const kanvas = buatKartu(m);
  const teks = (m ? Lx(m.judul) + " — " : "") + Lx(["Ayo main Laga Nusantara, gratis di browser & HP!", "Play Laga Nusantara, free in your browser & phone!"]) + " " + URL_GAME;
  const blob = await new Promise((r) => kanvas.toBlob(r, "image/png"));
  const file = blob && new File([blob], "laga-nusantara.png", { type: "image/png" });
  tambahStat && tambahStat("bagikan");
  try {
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], text: teks, title: "Laga Nusantara" });
      return;
    }
  } catch (e) { if (e && e.name === "AbortError") return; }
  // cadangan: unduh gambar + salin teks
  if (blob) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "laga-nusantara.png"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  try { await navigator.clipboard.writeText(teks); } catch (e) {}
  toast(Lx(["Gambar diunduh & tautan disalin. Tempel di medsosmu!", "Image downloaded & link copied. Paste it on social media!"]), true);
}

// ---------- Momen otomatis ----------
{
  const asli = killMonster;
  killMonster = function (m) {
    const hidup = !m.dead; asli(m);
    if (hidup && m.dead && m.d.boss && !m.ulang) momenBagikan({ judul: [`${m.d.name} tumbang!`, `${m.d.name} defeated!`], sub: [`Dikalahkan oleh ${CLASSES[S.cls].name} Lv ${S.lv}`, `Beaten by a Lv ${S.lv} ${CLASSES[S.cls].name}`], warna: "#ff7b5c" });
  };
}
{
  const asli = dapatIkan;
  dapatIkan = function (id) {
    const r = asli(id), d = IKAN[id];
    if (d && d.rar !== "biasa") {
      const k = S.ikan.koleksi[id];
      momenBagikan({ judul: [`Dapat ${d.nama[0]}!`, `Caught a ${d.nama[1]}!`], sub: [`Ikan ${d.rar === "legenda" ? "legenda" : "langka"} · ${k ? k.berat : "?"} kg`, `${d.rar === "legenda" ? "Legendary" : "Rare"} fish · ${k ? k.berat : "?"} kg`], warna: RAR_IKAN[d.rar].warna });
    }
    return r;
  };
}
{
  const asli = umumkanBab;
  umumkanBab = function (lama, baru, after) {
    asli(lama, baru, () => { momenBagikan({ judul: [`Tamat: ${lama.split(" · ")[0]}`, `Cleared: ${lama.split(" · ")[0]}`], sub: [lama.split(" · ")[1] || "", lama.split(" · ")[1] || ""], warna: "#f4b942" }); after && after(); });
  };
}
{
  const asli = bukaCapai;
  bukaCapai = function (c, diam) {
    asli(c, diam);
    if (!diam && (c.rahasia || (c.hadiah && c.hadiah.serpih >= 5))) momenBagikan({ judul: ["🏆 " + c.judul[0], "🏆 " + c.judul[1]], sub: c.desc, warna: "#f4b942" });
  };
}

// ---------- Menu jeda › Bagikan ----------
{
  const b = document.createElement("button");
  b.className = "go alt"; b.type = "button"; b.id = "btnBagikanJeda";
  const sebelum = $("btnMasukan");
  sebelum.parentElement.insertBefore(b, sebelum);
  const teks = () => { b.textContent = "📤 " + Lx(["Bagikan", "Share"]); };
  teks();
  for (const x of document.querySelectorAll("[data-bahasa]")) x.addEventListener("click", () => setTimeout(teks, 0));
  b.addEventListener("click", () => { sfx.click(); bagikanKartu(null); });
}
// kembali ke layar judul → tombol momen disembunyikan (update() tidak berjalan di luar mode bermain)
{
  const asli = showUI;
  showUI = function () { asli(); if (mode === "select") { momenT = 0; tombolBagikan.hidden = true; } };
}
