// =====================================================================
// KODE SAVE (ekspor / impor progres)
// Progres hanya tersimpan di browser (localStorage). Supaya tidak hilang & bisa
// pindah perangkat, pemain bisa menyalin "kode save" lalu menempelkannya lagi.
//  - Buka dari layar judul (tombol "Kode Save") atau Menu › Pengaturan › Kode Save.
//  - Kode = "LN2." + base64url(deflate(JSON save)) + "." + checksum pendek (lihat di bawah).
//  - Memuat kode menimpa save di perangkat ini, lalu halaman dimuat ulang.
// =====================================================================
"use strict";

// Format kode:
//  - "LN2." + base64url(deflate(JSON save)) + "." + checksum  ← dipakai sekarang (3–5× lebih pendek)
//  - "LN1." + base64(JSON save) + "." + checksum             ← format lama, tetap bisa dimuat
// Kode tetap memuat SELURUH progres; tanpa server isinya tidak bisa dipadatkan jauh lebih pendek lagi.
const AWALAN_KODE = "LN1.", AWALAN_KODE2 = "LN2.";
const cekSum = (s) => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h.toString(36); };
const bisaKompres = typeof CompressionStream === "function" && typeof DecompressionStream === "function";
// byte ↔ base64url (tanpa + / =, aman disalin lewat chat)
const keB64url = (u8) => { let t = ""; for (let i = 0; i < u8.length; i += 0x8000) t += String.fromCharCode(...u8.subarray(i, i + 0x8000)); return btoa(t).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); };
const dariB64url = (s) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
async function aliranBytes(bytes, stream) { return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer()); }

async function buatKodeSave() {
  if (S && mode !== "select") save();            // simpan dulu supaya kodenya paling baru
  const data = store.get(SAVE_KEY, null);
  if (!data) return "";
  const json = JSON.stringify(data);
  if (bisaKompres) {
    const isi = keB64url(await aliranBytes(new TextEncoder().encode(json), new CompressionStream("deflate-raw")));
    return AWALAN_KODE2 + isi + "." + cekSum(isi);
  }
  const isi = btoa(unescape(encodeURIComponent(json)));
  return AWALAN_KODE + isi + "." + cekSum(isi);
}
async function bacaKodeSave(kode) {
  kode = (kode || "").replace(/\s+/g, "");
  const baru = kode.startsWith(AWALAN_KODE2);
  if (!baru && !kode.startsWith(AWALAN_KODE)) return null;
  const [isi, sum] = kode.slice(4).split(".");
  if (!isi || cekSum(isi) !== sum) return null;
  try {
    const json = baru
      ? new TextDecoder().decode(await aliranBytes(dariB64url(isi), new DecompressionStream("deflate-raw")))
      : decodeURIComponent(escape(atob(isi)));
    const data = JSON.parse(json);
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
async function bukaKodeSave() {
  kodeDariJeda = mode === "pause";
  const kode = await buatKodeSave();
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
$("btnKodeMuat").addEventListener("click", async () => {
  const data = await bacaKodeSave($("kodeImpor").value);
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
