// =====================================================================
// RUMUS
// Rumus level, nyawa, dan serangan. Angkanya dari ATURAN.level di config.js.
// =====================================================================
"use strict";

const L = ATURAN.level;
const expNeed = (lv) => Math.round(L.expDasar * Math.pow(lv, L.expPangkat));
// jimat/ramuan (52-jimat.js) & pasif poin jurus (51-poin-jurus.js) ikut dihitung
const maxHp = () => Math.round((CLASSES[S.cls].hp + (S.lv - 1) * L.nyawaPerLevel) * (1 + bonusStat("hp") + pasifNilai("nyawa")));
// serangan dasar; dikali debuff "lemah" (32-debuff.js) saat bertarung
const atkDasar = () => CLASSES[S.cls].atk + (S.lv - 1) * L.seranganPerLevel + S.weapon * L.seranganPerSenjata;
const atkPower = () => Math.round(atkDasar() * (P ? kaliSerang() : 1) * (1 + bonusStat("atk") + pasifNilai("kuat")));
