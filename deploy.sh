#!/usr/bin/env bash
set -euo pipefail

git pull

# Load env files for build-time NEXT_PUBLIC_* variables.
set -a
[ -f ./.env ] && . ./.env
[ -f ./.env.local ] && . ./.env.local
[ -f ./.env.production ] && . ./.env.production
[ -f ./.env.production.local ] && . ./.env.production.local
set +a

yarn run build
pm2 delete "stackfood-next-js" || true
pm2 start npm --name "stackfood-next-js" -- start
