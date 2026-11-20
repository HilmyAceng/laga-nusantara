// =====================================================================
// RUMUS
// Rumus level, nyawa, dan serangan. Angkanya dari ATURAN.level di config.js.
// =====================================================================
"use strict";

const L = ATURAN.level;
const expNeed = (lv) => Math.round(L.expDasar * Math.pow(lv, L.expPangkat));
const maxHp = () => CLASSES[S.cls].hp + (S.lv - 1) * L.nyawaPerLevel;
const atkPower = () => CLASSES[S.cls].atk + (S.lv - 1) * L.seranganPerLevel + S.weapon * L.seranganPerSenjata;
