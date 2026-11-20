// =====================================================================
// RUMUS
// Rumus level, nyawa, dan serangan. Angkanya dari ATURAN.level di config.js.
// =====================================================================
"use strict";

const L = ATURAN.level;
const expNeed = (lv) => Math.round(L.expDasar * Math.pow(lv, L.expPangkat));
const maxHp = () => CLASSES[S.cls].hp + (S.lv - 1) * L.nyawaPerLevel;
// serangan dasar; dikali debuff "lemah" (32-debuff.js) saat bertarung
const atkDasar = () => CLASSES[S.cls].atk + (S.lv - 1) * L.seranganPerLevel + S.weapon * L.seranganPerSenjata;
const atkPower = () => atkDasar() * (P ? kaliSerang() : 1);
