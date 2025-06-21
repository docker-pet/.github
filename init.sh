#!/bin/sh

for script in ./apps/*/init.sh; do
  if [ -f "$script" ]; then
    dir=$(dirname "$script")
    (cd "$dir" && sh ./init.sh)
  fi
done

if [ ! -f ./docker-compose.yaml ]; then
  cp ./docker-compose.prod.yaml ./docker-compose.yaml
fi

if [ ! -f ./.env ]; then
  cp ./.env.example ./.env
fi