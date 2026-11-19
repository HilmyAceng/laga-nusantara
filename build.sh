#!/usr/bin/env bash
# Gabungkan src/game.html menjadi public/index.html (PWA) dan salin src/config.js ke public/.
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
  echo '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);box-sizing:border-box;height:100%}[hidden]{display:none!important}</style>'
  echo '</head><body>'
  cat src/game.html
  echo '<script>if("serviceWorker" in navigator){addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}));}</script>'
  echo '</body></html>'
} > public/index.html
cp src/config.js public/config.js
echo "OK -> public/index.html + public/config.js"
