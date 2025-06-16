#!/bin/sh

MANIFEST="./volumes/lampa/configs/manifest.json"
INITCONFIG="./volumes/lampa/configs/init.conf"
PASSWD="./volumes/lampa/configs/passwd"

if [ ! -f "$MANIFEST" ]; then
  mkdir -p "$(dirname "$MANIFEST")"
  echo "[]" > "$MANIFEST"
fi

if [ ! -f "$INITCONFIG" ]; then
  mkdir -p "$(dirname "$INITCONFIG")"
  echo "{}" > "$INITCONFIG"
fi

if [ ! -f "$PASSWD" ]; then
  mkdir -p "$(dirname "$PASSWD")"
  tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 32 > "$PASSWD"
fi
