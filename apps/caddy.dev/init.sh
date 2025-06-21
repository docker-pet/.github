#!/bin/sh

if [ ! -f ./Caddyfile ]; then
  cp ./Caddyfile.example ./Caddyfile
fi