// =====================================================================
// GABUNGAN ARC 2 "Benang Sepi": cutscene & pertanyaan tambahan bab 11-20,
// serta kisah bos lama (Raja Banaspati … Prabu Kalamurka) dan bos baru.
// Data tiap bab ada di bab-11.js … bab-20.js; kisah di kisah-bos-lama.js & kisah-bos-baru.js.
// =====================================================================
"use strict";

Object.assign(ADEGAN_CERITA, ADEGAN_BAB11, ADEGAN_BAB12, ADEGAN_BAB13, ADEGAN_BAB14, ADEGAN_BAB15,
  ADEGAN_BAB16, ADEGAN_BAB17, ADEGAN_BAB18, ADEGAN_BAB19, ADEGAN_BAB20);
Object.assign(TANYA_CERITA, TANYA_BAB11, TANYA_BAB12, TANYA_BAB13, TANYA_BAB14, TANYA_BAB15,
  TANYA_BAB16, TANYA_BAB17, TANYA_BAB18, TANYA_BAB19, TANYA_BAB20);
KISAH.push(...KISAH_BOS_LAMA, ...KISAH_BOS_BARU);
