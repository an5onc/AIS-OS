#!/bin/bash
# Daily content generation for all brands. Run by launchd (see install-launchd.sh) or manually.
set -euo pipefail
cd "$(dirname "$0")"

PORT=$(grep -E '^REVIEW_PORT=' secrets.env 2>/dev/null | cut -d= -f2 || true)
PORT=${PORT:-4500}

if node generate.js >> logs/agent.log 2>&1; then
  osascript -e "display notification \"New social posts are ready to review.\" with title \"AIS-OS Social\" sound name \"Glass\"" || true
  open "http://localhost:${PORT}/" || true
else
  osascript -e "display notification \"Post generation failed — check logs/agent.log\" with title \"AIS-OS Social\"" || true
fi
