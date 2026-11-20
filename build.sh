#!/usr/bin/env bash
# Gabungkan src/game.html menjadi public/index.html (PWA), salin src/config.js dan folder src/js/
# ke public/, lalu perbarui daftar file offline di public/sw.js.
set -euo pipefail
cd "$(dirname "$0")"
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
  echo '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);box-sizing:border-box;height:100%}[hidden]{display:none!important}</style>'
  echo '</head><body>'
  cat src/game.html
  echo '<script>if("serviceWorker" in navigator){addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));}</script>'
  echo '</body></html>'
} > public/index.html
cp src/config.js public/config.js
rm -rf public/js && cp -r src/js public/js

# Daftar file yang disimpan untuk main offline (baris FILES di sw.js dibuat ulang otomatis)
files='"./", "./index.html", "./config.js", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png"'
for f in src/js/*.js; do files="$files, \"./js/$(basename "$f")\""; done
sed -i "s|^const FILES = .*|const FILES = [$files];|" public/sw.js

echo "OK -> public/index.html, public/config.js, public/js/ ($(ls src/js | wc -l) file), sw.js"
