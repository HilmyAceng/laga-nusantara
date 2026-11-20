// =====================================================================
// TEKA-TEKI
// Benda di peta yang bisa diperiksa (tombol Bicara):
//   prasasti + 4 obor (Candi Wingit) : nyalakan obor sesuai urutan petunjuk
//   batu pitutur (Rawa Kabut)        : jawab 3 teka-teki → jembatan muncul
//   altar (Kawah Geni)               : letakkan 3 mustika → jembatan lava
// Letak benda: `objek` di tiap area (04-peta.js). Yang sudah selesai: S.teka.
// =====================================================================
"use strict";

const URUTAN_OBOR = ["fajar", "siang", "senja", "malam"];   // perjalanan matahari, lalu bulan
let oborNyala = [];                                          // obor yang sudah menyala (belum selesai)

// Teka-teki Batu Pitutur: kunci teks ada di 02-bahasa.js. benar = nomor pilihan yang benar.
const TEKA_PITUTUR = [
  { q: "teka.r1", a: ["teka.r1a", "teka.r1b", "teka.r1c"], benar: 0 },
  { q: "teka.r2", a: ["teka.r2a", "teka.r2b", "teka.r2c"], benar: 0 },
  { q: "teka.r3", a: ["teka.r3a", "teka.r3b", "teka.r3c"], benar: 0 },
];
const MUSTIKA = ["mustikaBumi", "mustikaTirta", "mustikaBayu"];

// Benda teka-teki untuk area `id` (ikut daftar NPCS supaya digambar & bisa diperiksa)
// Benda yang BUKAN "NPC" (tidak diajak bicara; diurus file puzzle sendiri): batu dorong, lempeng
const OBJEK_LANTAI = new Set(["batuDorong", "lempeng", "lempengMemori"]);
const NAMA_OBJEK = { prasasti: "teka.nPrasasti", obor: "teka.nObor", pitutur: "teka.nPitutur", altar: "teka.nAltar",
  saklar: "tk.nSaklar", petunjuk: "tk.nPetunjuk", tuas: "tk.nTuas", batuMemori: "tk.nMemori", batuTanya: "tk.nTanya", unggun: "tk.nUnggun" };
function objekTeka(id) {
  oborNyala = [];
  return (AREAS[id].objek || []).filter((o) => !OBJEK_LANTAI.has(o.kind)).map((o, i) => {
    const namaKey = o.kind === "saklar" ? "tk.n_" + TEKA_BARU[o.id].gaya : NAMA_OBJEK[o.kind];
    return { ...o, id: "teka-" + (o.id || "") + (o.simbol || i), tekaId: o.id, x: o.x * T, y: o.y * T, face: 0, namaKey, name: t(namaKey, { warna: o.simbol ? t("warna." + o.simbol) : "" }) };
  });
}
const tekaSelesai = (id) => !!(S && S.teka[id]);

// ---------- Interaksi ----------
const TEKA_BICARA = {
  prasasti(n) {
    openDialog(n.name, t(tekaSelesai("obor") ? "teka.prasastiSelesai" : "teka.prasasti"), [{ label: t("dlg.tutup"), primary: true, run: closeDialog }]);
  },
  obor(n) {
    if (tekaSelesai("obor") || oborNyala.includes(n.simbol)) return;
    if (n.simbol === URUTAN_OBOR[oborNyala.length]) {
      oborNyala.push(n.simbol); sfx.fire(); spark(n.x, n.y - 46, "#ffb347", 12);
      if (oborNyala.length === URUTAN_OBOR.length) selesaiTeka("obor");
      else toast(t("teka.oborNyala", { n: oborNyala.length, max: URUTAN_OBOR.length }), false);
    } else {
      // salah urutan: semua padam
      for (const o of NPCS) if (o.kind === "obor") spark(o.x, o.y - 46, "#8d8894", 8);
      oborNyala = []; sfx.hurt(); toast(t("teka.oborSalah"), false);
    }
  },
  pitutur(n) {
    if (tekaSelesai("pitutur")) return openDialog(n.name, t("teka.pituturSelesai"), [{ label: t("dlg.tutup"), primary: true, run: closeDialog }]);
    const iLangkah = CERITA.findIndex((s) => s.tipe === "teka" && s.id === "pitutur");
    if (S.cerita.idx < iLangkah) return openDialog(n.name, t("teka.pituturKabut"), [{ label: t("dlg.tutup"), primary: true, run: closeDialog }]);
    tanyaPitutur(n, 0);
  },
  altar(n) {
    if (tekaSelesai("altar")) return openDialog(n.name, t("teka.altarSelesai"), [{ label: t("dlg.tutup"), primary: true, run: closeDialog }]);
    const punya = MUSTIKA.filter((m) => S.items[m]);
    if (punya.length < MUSTIKA.length) {
      return openDialog(n.name, t("teka.altarKurang", { n: punya.length, max: MUSTIKA.length, daftar: punya.map((m) => t("item." + m)).join(", ") || "-" }), [{ label: t("dlg.tutup"), primary: true, run: closeDialog }]);
    }
    openDialog(n.name, t("teka.altarTanya"), [
      { label: t("dlg.nanti"), run: closeDialog },
      { label: t("teka.altarTaruh"), primary: true, run: () => { closeDialog(); selesaiTeka("altar"); } },
    ]);
  },
};

function tanyaPitutur(n, i) {
  const r = TEKA_PITUTUR[i];
  // urutan pilihan diacak supaya tidak bisa dihafal posisinya
  const pilihan = r.a.map((k, j) => ({ k, benar: j === r.benar })).sort(() => Math.random() - 0.5);
  openDialog(`${n.name} (${i + 1}/${TEKA_PITUTUR.length})`, t(r.q), pilihan.map((p) => ({
    label: t(p.k),
    run: () => {
      if (!p.benar) {
        closeDialog(); sfx.growl(); toast(t("teka.pituturSalah"), true);
        // hukuman: dua hantu kabut muncul di dekat pemain
        for (let k = 0; k < 2; k++) {
          const a = rand(0, 6.28), spot = { x: P.x + Math.cos(a) * 110, y: P.y + Math.sin(a) * 110 };
          if (!solidAt(spot.x, spot.y)) { const h = makeMonster("hantuKabut", spot); h.aggro = true; h.state = "chase"; monsters.push(h); }
        }
        return;
      }
      sfx.coin();
      if (i + 1 < TEKA_PITUTUR.length) tanyaPitutur(n, i + 1);
      else { closeDialog(); selesaiTeka("pitutur"); }
    },
  })));
}

// Teka-teki selesai: simpan, ubah peta (pintu/jembatan), lanjutkan cerita
function selesaiTeka(id) {
  S.teka[id] = true;
  if (id === "obor" && areaId === "candi") fillRect(13, 9, 17, 9, CAVE);
  if (id === "pitutur" && areaId === "rawa") fillRect(21, 19, 22, 22, BRIDGE);
  if (id === "altar" && areaId === "kawah") fillRect(16, 13, 18, 15, ASH);
  buildMiniBase(); resetPetaDunia();
  if ((area.objek || []).some((o) => o.id === id) && TEKA_BARU[id]) { bangunUlangArea(); toast(t("toast.jalanTerbuka"), false); }   // puzzle baru: pintu terbuka
  shake = 0.5; sfx.level(); saveSoon();
  ceritaTeka(id);
}
// Bos kalah → buka jalan berikutnya (lorong candi ke kawah)
function setelahBosKalah(jenis) {
  if (jenis === "dwarapala" && areaId === "candi") { fillRect(14, 0, 16, 0, CAVE); buildMiniBase(); }
  // gerbang yang terbuka karena bos ini kalah (mis. Hutan Batu → Puncak Naga)
  if (area.gerbang.some((g) => g.kunci === "bos:" + jenis)) { bangunUlangArea(); toast(t("toast.jalanTerbuka"), false); }
}

// ---------- Gambar ----------
function labelObjek(n, warna, dy) {
  ctx.font = "800 11px Nunito, sans-serif"; ctx.textAlign = "center"; ctx.fillStyle = warna;
  ctx.fillText(n.name, n.x, n.y - dy);
  if (nearNpc === n && !isTouch) { ctx.fillStyle = "#f7efe3"; ctx.fillText(t("teka.periksa"), n.x, n.y + 18); }
}
function ikonSimbol(simbol, x, y) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = "rgba(10,6,20,0.7)"; ctx.beginPath(); ctx.arc(0, 0, 11, 0, 6.28); ctx.fill();
  if (simbol === "malam") {
    ctx.fillStyle = "#dfe6ee"; ctx.beginPath(); ctx.arc(0, 0, 7, 0, 6.28); ctx.fill();
    ctx.fillStyle = "rgba(10,6,20,1)"; ctx.beginPath(); ctx.arc(3.5, -2, 6, 0, 6.28); ctx.fill();
  } else {
    const warna = { fajar: "#ffb347", siang: "#ffe066", senja: "#ff6b4a" }[simbol];
    const cy = simbol === "siang" ? 0 : simbol === "fajar" ? 2 : 4;
    ctx.fillStyle = warna; ctx.strokeStyle = warna; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, cy, 5, simbol === "siang" ? 0 : Math.PI, simbol === "siang" ? 6.28 : 0); ctx.fill();
    const rays = simbol === "senja" ? 0 : simbol === "fajar" ? 3 : 8;
    for (let i = 0; i < rays; i++) { const a = simbol === "siang" ? (i / 8) * 6.28 : -Math.PI / 2 + (i - 1) * 0.7; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 7, cy + Math.sin(a) * 7); ctx.lineTo(Math.cos(a) * 9.5, cy + Math.sin(a) * 9.5); ctx.stroke(); }
    if (simbol !== "siang") { ctx.strokeStyle = "#c9bfd6"; ctx.beginPath(); ctx.moveTo(-8, cy + 0.5); ctx.lineTo(8, cy + 0.5); ctx.stroke(); }
  }
  ctx.restore();
}
const GAMBAR_OBJEK = {
  prasasti(n, time) {
    const x = n.x, y = n.y;
    ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 18, 6, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#6f6a75"; roundRect(ctx, x - 14, y - 38, 28, 38, 6); ctx.fill();
    ctx.fillStyle = "#8d8894"; roundRect(ctx, x - 11, y - 35, 22, 30, 4); ctx.fill();
    ctx.strokeStyle = `rgba(201,182,255,${0.5 + 0.3 * Math.sin(time * 2)})`; ctx.lineWidth = 1.5;
    for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(x - 7, y - 29 + i * 6); ctx.lineTo(x + 7 - (i % 2) * 4, y - 29 + i * 6); ctx.stroke(); }
    labelObjek(n, "#c9b6ff", 48);
  },
  obor(n, time) {
    const x = n.x, y = n.y, nyala = tekaSelesai("obor") || oborNyala.includes(n.simbol);
    ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 12, 4, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#5d5868"; ctx.fillRect(x - 3, y - 36, 6, 36);
    ctx.fillStyle = "#3a3142"; ctx.beginPath(); ctx.moveTo(x - 12, y - 40); ctx.lineTo(x + 12, y - 40); ctx.lineTo(x + 7, y - 32); ctx.lineTo(x - 7, y - 32); ctx.closePath(); ctx.fill();
    if (nyala) {
      const g = ctx.createRadialGradient(x, y - 48, 4, x, y - 48, 70);
      g.addColorStop(0, "rgba(255,180,80,0.45)"); g.addColorStop(1, "rgba(255,180,80,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y - 48, 70, 0, 6.28); ctx.fill();
      for (const [c, s] of [["#ff7b39", 1], ["#ffd166", 0.6]]) {
        const f = Math.sin(time * 14 + x) * 2;
        ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x - 9 * s, y - 40); ctx.quadraticCurveTo(x + f, y - 40 - 26 * s, x + 9 * s, y - 40); ctx.closePath(); ctx.fill();
      }
    }
    ikonSimbol(n.simbol, x, y - 76);
    labelObjek(n, "#ffb347", 92);
  },
  pitutur(n, time) {
    const x = n.x, y = n.y, selesai = tekaSelesai("pitutur");
    ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.beginPath(); ctx.ellipse(x, y, 24, 7, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#5d5868"; ctx.beginPath(); ctx.ellipse(x, y - 20, 24, 22, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#77718a"; ctx.beginPath(); ctx.ellipse(x - 5, y - 26, 14, 10, 0, 0, 6.28); ctx.fill();
    ctx.strokeStyle = selesai ? "rgba(143,211,255,0.3)" : `rgba(143,211,255,${0.55 + 0.4 * Math.sin(time * 3)})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y - 20, 9, 0.3, 5.5); ctx.moveTo(x - 14, y - 10); ctx.lineTo(x + 14, y - 10); ctx.moveTo(x, y - 34); ctx.lineTo(x, y - 6); ctx.stroke();
    labelObjek(n, "#8fd3ff", 52);
  },
  altar(n, time) {
    const x = n.x, y = n.y, selesai = tekaSelesai("altar");
    ctx.fillStyle = "rgba(0,0,0,0.35)"; ctx.beginPath(); ctx.ellipse(x, y, 30, 8, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#4e4258"; ctx.fillRect(x - 26, y - 22, 52, 22);
    ctx.fillStyle = "#6f6a75"; ctx.fillRect(x - 30, y - 28, 60, 8);
    const warna = ["#5ad17a", "#4aa8ff", "#f2f2f2"];
    MUSTIKA.forEach((m, i) => {
      const gx = x - 18 + i * 18, gy = y - 33;
      ctx.fillStyle = "#231c2b"; ctx.beginPath(); ctx.arc(gx, gy, 6, 0, 6.28); ctx.fill();
      if (selesai) {
        ctx.fillStyle = warna[i]; ctx.shadowColor = warna[i]; ctx.shadowBlur = 12 + 6 * Math.sin(time * 4 + i);
        ctx.beginPath(); ctx.arc(gx, gy, 5, 0, 6.28); ctx.fill(); ctx.shadowBlur = 0;
      }
    });
    labelObjek(n, "#ffb347", 46);
  },
};
