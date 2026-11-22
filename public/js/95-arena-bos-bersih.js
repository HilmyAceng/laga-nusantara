// =====================================================================
// ARENA BOS BEBAS GANGGUAN
// Selama bertarung melawan bos (bos hidup & sedang mengejar), monster kecil dari zona
// (yang muncul bersama area) disingkirkan dari sekitar pertarungan supaya tidak ikut
// campur. Monster yang DIPANGGIL bos (anak buah, bayangan, dsb.) tetap ada.
// Monster yang disingkirkan muncul lagi seperti biasa setelah pertarungan
// (lewat jeda munculLagi di 15-update.js).
// =====================================================================
"use strict";

const ARENA_BOS = { jarakBos: 520, jarakPemain: 420, munculLagi: 10 };

// tandai monster bawaan zona (bukan panggilan bos / hukuman teka-teki)
{
  const spawnAsli = spawnMonsters;
  spawnMonsters = function () { spawnAsli(); for (const m of monsters) if (!m.d.boss) m.zona = true; };
}
UPDATE_TAMBAHAN.push(() => {
  if (!P) return;
  const bos = monsters.find((m) => m.d.boss && !m.dead && (m.aggro || m.ulang));
  if (!bos) return;
  for (const m of monsters) {
    if (!m.zona || m.dead || m.d.boss) continue;
    if (dist(m, bos) < ARENA_BOS.jarakBos || dist(m, P) < ARENA_BOS.jarakPemain) {
      m.dead = true; m.respawn = ARENA_BOS.munculLagi; m.aggro = false;
      for (let i = 0; i < 8; i++) parts.push({ x: m.x + rand(-12, 12), y: m.y - rand(0, 20), z: 0, vz: rand(20, 50), vx: rand(-20, 20), vy: 0, life: 0.6, max: 0.6, color: "#8d8894", s: rand(8, 14), float: true });
    }
  }
});
