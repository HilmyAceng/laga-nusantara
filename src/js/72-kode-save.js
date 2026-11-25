// =====================================================================
// KODE SAVE (ekspor / impor progres)
// Progres hanya tersimpan di browser (localStorage). Supaya tidak hilang & bisa
// pindah perangkat, pemain bisa menyalin "kode save" lalu menempelkannya lagi.
//  - Buka dari layar judul (tombol "Kode Save") atau Menu › Pengaturan › Kode Save.
//  - Kode = "LN1." + base64(JSON save) + "." + checksum pendek.
//  - Memuat kode menimpa save di perangkat ini, lalu halaman dimuat ulang.
// =====================================================================
"use strict";

const AWALAN_KODE = "LN1.";
const cekSum = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h.toString(36); };
function buatKodeSave() {
  if (S && mode !== "select") save();            // simpan dulu supaya kodenya paling baru
  const data = store.get(SAVE_KEY, null);
  if (!data) return "";
  const isi = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  return AWALAN_KODE + isi + "." + cekSum(isi);
}
function bacaKodeSave(kode) {
  kode = (kode || "").replace(/\s+/g, "");
  if (!kode.startsWith(AWALAN_KODE)) return null;
  const [isi, sum] = kode.slice(AWALAN_KODE.length).split(".");
  if (!isi || cekSum(isi) !== sum) return null;
  try {
    const data = JSON.parse(decodeURIComponent(escape(atob(isi))));
    return data && CLASSES[data.cls] && typeof data.lv === "number" ? data : null;
  } catch (e) { return null; }
}

// Setelah kode dimuat, simpan-otomatis dimatikan sampai halaman dimuat ulang.
// Tanpa ini, memuat kode dari Menu (saat game berjalan) tidak berpengaruh: autosave,
// saveSoon, atau "pagehide" saat reload menimpa save baru dengan progres yang sedang dimainkan.
let kodeBaruDimuat = false;
{
  const saveAsli = save;
  save = function () { if (!kodeBaruDimuat) saveAsli(); };
}

let kodeDariJeda = false;
function bukaKodeSave() {
  kodeDariJeda = mode === "pause";
  const kode = buatKodeSave();
  $("kodeEkspor").value = kode;
  $("kodeEkspor").placeholder = t("kode.kosong");
  $("btnKodeSalin").disabled = $("btnKodeUnduh").disabled = !kode;
  $("kodeImpor").value = ""; $("kodeImpor").placeholder = t("kode.tempel"); $("kodePesan").textContent = "";
  $("kodeBox").hidden = false; sfx.click();
}
function tutupKodeSave() { $("kodeBox").hidden = true; sfx.click(); }
function pesanKode(teks, bagus) { const el = $("kodePesan"); el.textContent = teks; el.className = "kode-pesan " + (bagus ? "bagus" : "gagal"); }

$("btnKodeSalin").addEventListener("click", async () => {
  const el = $("kodeEkspor");
  try { await navigator.clipboard.writeText(el.value); } catch (e) { el.select(); document.execCommand && document.execCommand("copy"); }
  pesanKode(t("kode.tersalin"), true);
});
$("btnKodeUnduh").addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([$("kodeEkspor").value], { type: "text/plain" }));
  a.download = "laga-nusantara-save.txt"; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  pesanKode(t("kode.terunduh"), true);
});
$("btnKodeMuat").addEventListener("click", () => {
  const data = bacaKodeSave($("kodeImpor").value);
  if (!data) return pesanKode(t("kode.salah"), false);
  if (!confirm(t("kode.yakin", { kelas: CLASSES[data.cls].name, lv: data.lv }))) return;
  kodeBaruDimuat = true;
  store.set(SAVE_KEY, data);
  pesanKode(t("kode.berhasil"), true);
  setTimeout(() => location.reload(), 700);
});
$("btnKodeTutup").addEventListener("click", tutupKodeSave);
$("btnKodeJudul").addEventListener("click", bukaKodeSave);
$("btnKodeJeda").addEventListener("click", bukaKodeSave);
