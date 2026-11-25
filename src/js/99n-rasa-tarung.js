// =====================================================================
// RASA BERTARUNG (game feel / "juice")
// Lapisan efek di atas sistem tarung (10-tarung.js) tanpa mengubah angka damage:
//  - angka damage "meletup" (besar sesaat lalu mengecil);
//  - pukulan kritis: tulisan KRITIS!, guncangan kecil, getar singkat;
//  - musuh tumbang: hit-stop sedikit lebih lama + cincin debu; bos tumbang: gerak lambat + kilat;
//  - kena pukul: tepi layar berkedip merah (lebih tebal kalau nyawa tinggal sedikit);
//  - getar HP (Android; iPhone tidak mendukung).
// Pengaturan (Menu › Pengaturan › Layar), disimpan per perangkat:
//  - "Guncangan layar" (laga.guncang) · "Getar HP" (laga.getar)
// =====================================================================
"use strict";

const GUNCANG_KEY = "laga.guncang", GETAR_KEY = "laga.getar";
let guncangNyala = store.get(GUNCANG_KEY, true) !== false;
let getarNyala = store.get(GETAR_KEY, true) !== false;

// semua getar di game lewat sini, jadi pengaturan "Getar HP" berlaku di mana saja
const getar = (pola) => { if (!getarNyala || !navigator.vibrate) return; try { navigator.vibrate(pola); } catch (e) {} };
{
  const asli = navigator.vibrate && navigator.vibrate.bind(navigator);
  if (asli) try { navigator.vibrate = (p) => (getarNyala ? asli(p) : false); } catch (e) {}
}
UPDATE_TAMBAHAN.push(() => { if (!guncangNyala && mode !== "adegan") shake = 0; });

// ---------- Angka meletup ----------
UPDATE_TAMBAHAN.push(() => {
  for (const n of numbers) {
    if (n.awal == null) { n.awal = n.life; n.ukAsli = n.size; }
    const k = clamp((n.life - n.awal + 0.14) / 0.14, 0, 1);   // 1 → 0 dalam 0,14 detik pertama
    n.size = n.ukAsli * (1 + (n.letup || 0.45) * k);
  }
});

// ---------- Kritis & tumbang ----------
{
  const asli = damageMonster;
  damageMonster = function (m, amount, ang, kb, opts = {}) {
    const hidup = !m.dead, nAwal = numbers.length;
    asli(m, amount, ang, kb, opts);
    if (opts.dot || !hidup) return;
    const n = numbers[numbers.length - 1];
    const kritis = numbers.length > nAwal && n && n.color === "#ffd166" && n.size >= 30;
    if (kritis) {
      n.letup = 0.8;
      numbers.push({ x: m.x, y: m.y - m.d.h - 38, v: Lx(["KRITIS!", "CRITICAL!"]), life: 0.55, color: "#ffb347", size: 17, letup: 0.6 });
      shake = Math.max(shake, 0.14); getar(18); tambahStat("kritis");
    }
    if (m.dead) tumbangEfek(m);
  };
}
function tumbangEfek(m) {
  effects.push({ kind: "ring", x: m.x, y: m.y, r: m.d.boss ? 140 : 46, t: 0, dur: m.d.boss ? 0.7 : 0.3 });
  if (m.d.boss) {
    freeze = Math.max(freeze, 0.32); kilat = Math.max(kilat || 0, 0.7);
    getar([60, 40, 120]);
  } else {
    freeze = Math.max(freeze, 0.07); getar(12);
  }
}

// ---------- Kena pukul: tepi layar merah ----------
const vinyet = document.createElement("div");
vinyet.id = "vinyetLuka";
document.body.appendChild(vinyet);
{
  const asli = hurtPlayer;
  hurtPlayer = function (amount, ang, deb, opts = {}) {
    const hp0 = P && P.hp;
    asli(amount, ang, deb, opts);
    if (!P || !(P.hp < hp0)) return;
    const sisa = P.hp / maxHp();
    vinyet.style.setProperty("--kuat", String(sisa < 0.3 ? 1 : 0.65));
    vinyet.classList.remove("nyala"); void vinyet.offsetWidth; vinyet.classList.add("nyala");
  };
}
// nyawa kritis: tepi merah berdenyut pelan selama nyawa < 25%
UPDATE_TAMBAHAN.push(() => {
  const kritis = P && !P.dead && mode === "play" && P.hp / maxHp() < 0.25;
  vinyet.classList.toggle("sekarat", !!kritis);
});

// ---------- Pengaturan (Menu › Pengaturan › Layar) ----------
{
  const catatan = $("btnGrafis").closest(".set-row").nextElementSibling;   // keterangan "Grafis ringan"
  const baris = (id) => {
    const r = document.createElement("div"); r.className = "set-row";
    r.innerHTML = `<span class="vol-name" id="${id}Nama"></span><button class="vbtn mute" id="${id}" type="button"></button>`;
    return r;
  };
  const rG = baris("btnGuncang"), rV = baris("btnGetar"), ket = document.createElement("p");
  ket.className = "set-note"; ket.id = "rasaNote";
  catatan.after(rG, rV, ket);
  const segarkan = () => {
    $("btnGuncangNama").textContent = Lx(["Guncangan layar", "Screen shake"]);
    $("btnGetarNama").textContent = Lx(["Getar HP", "Vibration"]);
    ket.textContent = Lx(["Matikan guncangan kalau mudah pusing. Getar hanya berfungsi di HP Android.", "Turn off shake if it makes you dizzy. Vibration only works on Android phones."]);
    for (const [id, v] of [["btnGuncang", guncangNyala], ["btnGetar", getarNyala]]) {
      $(id).textContent = t(v ? "set.nyala" : "set.mati"); $(id).setAttribute("aria-pressed", String(v));
    }
  };
  $("btnGuncang").addEventListener("click", () => { guncangNyala = !guncangNyala; store.set(GUNCANG_KEY, guncangNyala); segarkan(); sfx.click(); if (guncangNyala) shake = 0.3; });
  $("btnGetar").addEventListener("click", () => { getarNyala = !getarNyala; store.set(GETAR_KEY, getarNyala); segarkan(); sfx.click(); getar(40); });
  segarkan();
  // ikut berganti bahasa & tiap kali menu dibuka
  for (const b of document.querySelectorAll("[data-bahasa]")) b.addEventListener("click", () => setTimeout(segarkan, 0));
  $("btnPause").addEventListener("click", () => setTimeout(segarkan, 0));
}
