// =====================================================================
// JURUS PAMUNGKAS & TENAGA DALAM
// Bar Tenaga Dalam (garis emas di bawah nyawa) terisi saat memukul, dipukul,
// mengalahkan musuh, hindar sempurna, dan menangkis (ATURAN.tenaga).
// Penuh → tekan R (KONTROL.pamungkas) / tombol "Pamungkas" untuk jurus pamungkas
// kelasmu (PAMUNGKAS di config.js). Terbuka mulai level ATURAN.tenaga.bukaLevel.
// =====================================================================
"use strict";

const pamungkasTerbuka = () => S && S.lv >= ATURAN.tenaga.bukaLevel;
const tenagaPenuh = () => P && P.tenaga >= ATURAN.tenaga.maks;
const teksPam = (k) => { const u = PAMUNGKAS[S.cls]; return (bahasa === "en" && u.en && u.en[k]) || u[k]; };
let tenagaFrame = 0;   // batas tenaga dari pukulan per frame (supaya jurus banyak-pukul tidak langsung memenuhi bar)

// paksa = tidak dibatasi per frame
function tambahTenaga(n, paksa) {
  if (!P || P.dead || !pamungkasTerbuka() || P.ult) return;
  n *= 1 + bonusStat("tenaga") + pasifNilai("batin");
  if (!paksa) { n = Math.min(n, 5 - tenagaFrame); tenagaFrame += n; if (n <= 0) return; }
  const sebelum = P.tenaga;
  P.tenaga = Math.min(ATURAN.tenaga.maks, P.tenaga + n);
  if (sebelum < ATURAN.tenaga.maks && P.tenaga >= ATURAN.tenaga.maks) {
    sfx.level(); numbers.push({ x: P.x, y: P.y - 90, v: t("pam.siap"), life: 1.2, color: "#f4b942", size: 22 });
  }
}
const kaliPamungkas = () => 1 + bonusStat("pamungkas") + pasifNilai("pamungkas");

function pakaiPamungkas() {
  if (!pamungkasTerbuka()) { toast(t("pam.terkunci", { lv: ATURAN.tenaga.bukaLevel }), false); return; }
  if (!tenagaPenuh()) { toast(t("pam.belum"), false); return; }
  P.tenaga = 0;
  const U = PAMUNGKAS[S.cls], dmg = atkPower() * U.mult * kaliPamungkas();
  P.inv = Math.max(P.inv, 1);
  kilatPamungkas = 1; shake = 0.6;
  toast(teksPam("name") + "!", true);
  latihanAksi("pamungkas");
  if (U.type === "seribu") {
    const list = musuhDekat(U.r);
    P.ult = { type: "seribu", t: 0, dur: 1.4, list, hit: 0, hits: 10, dmg };
    P.inv = Math.max(P.inv, 1.6); sfx.dash();
  } else if (U.type === "garuda") {
    const ang = aimAngle(700); P.face = ang;
    P.ult = { type: "garuda", t: 0, dur: 0.7, ang, done: false, dmg };
    sfx.charge();
  } else if (U.type === "palu") {
    P.ult = { type: "palu", t: 0, dur: 1.1, step: 0, dmg }; sfx.growl();
  } else if (U.type === "hujanMeteor") {
    P.ult = { type: "hujanMeteor", t: 0, dur: 2.2, step: 0, dmg }; sfx.charge();
  }
}
let kilatPamungkas = 0;

function updatePamungkas(dt) {
  tenagaFrame = 0;
  kilatPamungkas = Math.max(0, kilatPamungkas - dt * 2);
  if (!P || !P.ult) return;
  const U = P.ult; U.t += dt;
  if (U.type === "seribu") {
    while (U.hit < U.hits && U.t >= (U.hit * U.dur) / U.hits) {
      U.hit++;
      for (const m of U.list) if (!m.dead) {
        const a = rand(0, 6.28);
        effects.push({ kind: "slash", x: m.x + rand(-10, 10), y: m.y - 24 + rand(-10, 10), ang: a, r: 60, arc: 1.2, t: 0, dur: 0.12, big: true });
        damageMonster(m, U.dmg, a, 0, { dot: false, tanpaTenaga: true });
      }
      sfx.swing();
    }
  } else if (U.type === "garuda" && !U.done && U.t >= 0.25) {
    U.done = true; shake = 0.7; sfx.boom();
    const cx = Math.cos(U.ang), cy = Math.sin(U.ang);
    for (const m of monsters) {
      if (m.dead) continue;
      const dx = m.x - P.x, dy = m.y - P.y, sepanjang = dx * cx + dy * cy, samping = Math.abs(-dx * cy + dy * cx);
      if (sepanjang > -20 && sepanjang < 760 && samping < 50 + m.r) { damageMonster(m, U.dmg, U.ang, 300, { tanpaTenaga: true }); beriDotMonster(m, "berdarah"); }
    }
  } else if (U.type === "palu") {
    const radius = [180, 250, 320];
    while (U.step < 3 && U.t >= U.step * 0.35) { gempaDi(P.x, P.y, radius[U.step], U.dmg, 1.2, 0.5); U.step++; sfx.quake(); }
  } else if (U.type === "hujanMeteor") {
    while (U.step < 10 && U.t >= U.step * 0.2) {
      U.step++;
      const m = musuhDekat(320)[Math.floor(rand(0, 4))];
      const x = m && Math.random() < 0.7 ? m.x + rand(-30, 30) : P.x + rand(-300, 300), y = m && Math.random() < 0.7 ? m.y + rand(-20, 20) : P.y + rand(-200, 200);
      jatuhkanMeteor(x, y, 70, U.dmg, 0.55, false);
    }
  }
  if (U.t >= U.dur) P.ult = null;
}
UPDATE_TAMBAHAN.push(updatePamungkas);

// berkas cahaya panah garuda & kilatan layar
GAMBAR_ATAS.push(function (time) {
  if (!P || !P.ult || P.ult.type !== "garuda") return;
  const U = P.ult, k = U.t / U.dur;
  ctx.save(); ctx.translate(P.x, P.y - 20); ctx.rotate(U.ang);
  const lebar = U.t < 0.25 ? 6 + 20 * (U.t / 0.25) : 50 * (1 - Math.max(0, k - 0.5) * 2);
  const g = ctx.createLinearGradient(0, -lebar, 0, lebar);
  g.addColorStop(0, "rgba(255,224,138,0)"); g.addColorStop(0.5, U.t < 0.25 ? "rgba(255,224,138,0.5)" : "rgba(255,250,220,0.95)"); g.addColorStop(1, "rgba(255,224,138,0)");
  ctx.fillStyle = g; ctx.fillRect(0, -lebar, 760, lebar * 2);
  ctx.restore();
});

// ---------- HUD ----------
function hudPamungkas(key) {
  const buka = pamungkasTerbuka(), isi = buka ? P.tenaga / ATURAN.tenaga.maks : 0, penuh = buka && isi >= 1;
  const c = Math.round((1 - isi) * 40) / 40;
  const b = $("bUlt");
  b.hidden = !buka;
  if (last.ult !== c) { last.ult = c; b.style.setProperty("--cd", c); $("sUlt").style.setProperty("--cd", c); }
  b.classList.toggle("penuh", penuh);
  if (!isTouch) {
    const el = $("sUlt");
    el.hidden = !buka;
    el.classList.toggle("ready", penuh);
    setText($("sUltKey"), "uk", key);
    setText($("sUltName"), "un", teksPam("name"));
    setText($("sUltSec"), "us", penuh ? "" : Math.floor(isi * 100) + "%");
  }
}
// garis Tenaga Dalam di bawah bar nyawa (koordinat layar, dipanggil dari render)
function drawTenaga(px, py) {
  if (!pamungkasTerbuka() || !P) return;
  const w = 104, x = Math.round(px - w / 2), y = Math.round(py) + 1, isi = P.tenaga / ATURAN.tenaga.maks;
  ctx.fillStyle = "rgba(10,6,20,0.8)"; ctx.fillRect(x - 2, y, w + 4, 6);
  ctx.fillStyle = isi >= 1 ? `hsl(${42 + Math.sin(performance.now() / 120) * 8},95%,60%)` : "#c9a24a";
  ctx.fillRect(x, y + 1.5, w * isi, 3);
  if (kilatPamungkas > 0) { ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.fillStyle = `rgba(255,240,200,${0.5 * kilatPamungkas})`; ctx.fillRect(0, 0, W, H); }
}
