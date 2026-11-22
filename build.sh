#!/usr/bin/env bash
# Gabungkan src/game.html menjadi public/index.html (PWA), salin src/config.js dan folder src/js/
# ke public/, lalu perbarui daftar file offline di public/sw.js.
set -euo pipefail
cd "$(dirname "$0")"
# Nomor build unik (waktu build). Dipakai untuk: nama cache service worker, versi.json,
# dan window.LAGA_BUILD di halaman → game tahu kalau ada versi yang lebih baru (99-pembaruan.js).
BUILD_ID="$(date +%Y%m%d%H%M%S)"
{
  echo '<!doctype html>'
  echo '<html lang="id"><head>'
  echo '<meta charset="utf-8">'
  echo '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
  echo '<meta name="theme-color" content="#140d24">'
  echo '<link rel="manifest" href="manifest.webmanifest">'
  echo '<link rel="icon" href="icons/icon-192.png">'
  echo '<link rel="apple-touch-icon" href="icons/icon-192.png">'
  echo '<meta name="apple-mobile-web-app-capable" content="yes">'
  echo '<meta name="mobile-web-app-capable" content="yes">'
  echo '<meta name="apple-mobile-web-app-title" content="Laga Nusantara">'
  echo '<meta name="application-name" content="Laga Nusantara">'
  # pratinjau link (WhatsApp, Instagram, Discord, Facebook, X) & deskripsi mesin pencari
  echo '<meta name="description" content="RPG aksi bertema Nusantara: 7 hero, 13 bos, 4 negeri. Main gratis di browser & HP, bisa offline. An original Indonesian-folklore action RPG.">'
  echo '<meta property="og:type" content="website">'
  echo '<meta property="og:site_name" content="Laga Nusantara">'
  echo '<meta property="og:title" content="Laga Nusantara — RPG aksi bertema Nusantara">'
  echo '<meta property="og:description" content="7 hero, 13 bos, 4 negeri, cerita 10 bab. Main gratis langsung di browser atau pasang di HP. Versi beta — ayo coba &amp; kirim masukanmu!">'
  echo '<meta property="og:url" content="https://hilmyaceng.github.io/laga-nusantara/">'
  echo '<meta property="og:image" content="https://hilmyaceng.github.io/laga-nusantara/icons/og.jpg">'
  echo '<meta property="og:image:width" content="1200">'
  echo '<meta property="og:image:height" content="630">'
  echo '<meta property="og:image:alt" content="Tujuh hero Laga Nusantara: Pendekar, Pemanah, Pendobrak, Penyihir, Dalang, Tabib, Jawara">'
  echo '<meta name="twitter:card" content="summary_large_image">'
  echo '<meta name="twitter:image" content="https://hilmyaceng.github.io/laga-nusantara/icons/og.jpg">'
  echo '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);box-sizing:border-box;height:100%}[hidden]{display:none!important}</style>'
  echo "<script>window.LAGA_BUILD=\"$BUILD_ID\";</script>"
  echo '</head><body>'
  cat src/game.html
  echo '<script>if("serviceWorker" in navigator){addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));}</script>'
  echo '</body></html>'
} > public/index.html
cp src/config.js public/config.js
rm -rf public/js && cp -r src/js public/js
rm -rf public/cerita && cp -r src/cerita public/cerita

# Daftar file yang disimpan untuk main offline (baris FILES di sw.js dibuat ulang otomatis)
files='"./", "./index.html", "./config.js", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png"'
for f in src/cerita/*.js; do files="$files, \"./cerita/$(basename "$f")\""; done
for f in src/js/*.js; do files="$files, \"./js/$(basename "$f")\""; done
sed -i "s|^const FILES = .*|const FILES = [$files];|" public/sw.js
# cache service worker ikut berganti tiap build (tidak perlu dinaikkan manual lagi)
sed -i "s|^const CACHE = .*|const CACHE = \"laga-$BUILD_ID\";|" public/sw.js
echo "{\"build\": \"$BUILD_ID\"}" > public/versi.json

echo "OK -> public/index.html, public/config.js, public/js/ ($(ls src/js | wc -l) file), sw.js, versi.json (build $BUILD_ID)"
