#!/bin/sh

MANIFEST="./configs/manifest.json"
INITCONFIG="./configs/init.conf"
PASSWD="./configs/passwd"

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
