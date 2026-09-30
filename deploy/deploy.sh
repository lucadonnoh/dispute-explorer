#!/usr/bin/env bash
# Deploys the current working tree to eth-node and rebuilds the containers.
# One-time host setup (Caddy site, ufw rule, tunnel ingress, Prometheus) is
# described in the README.
set -euo pipefail

HOST="${DEPLOY_HOST:-eth-node}"
DIR="${DEPLOY_DIR:-dispute-explorer}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Excluded paths are also protected from --delete, so the host's deploy/.env
# survives.
rsync -az --delete \
  --exclude .git --exclude .claude --exclude node_modules \
  --exclude .next --exclude .ponder --exclude '.env*' \
  "$ROOT/" "$HOST:$DIR/"

ssh "$HOST" "cd $DIR/deploy && docker compose up -d --build --remove-orphans && docker compose ps"
