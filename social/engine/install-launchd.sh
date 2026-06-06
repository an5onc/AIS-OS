#!/bin/bash
# Installs two launchd agents (macOS):
#   com.aios.social.review -> keeps the review dashboard running (restarts at login)
#   com.aios.social.daily  -> generates new drafts every morning at 8:00 AM
#
# Usage:
#   ./install-launchd.sh            install/refresh both agents
#   ./install-launchd.sh uninstall  remove both agents
set -euo pipefail
cd "$(dirname "$0")"

DIR="$(pwd)"
NODE="$(command -v node || echo /opt/homebrew/bin/node)"
# launchd runs with a bare PATH; include the dirs node and claude live in.
PATH_LINE="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$HOME/.local/bin"
LA="$HOME/Library/LaunchAgents"
REVIEW_PLIST="$LA/com.aios.social.review.plist"
DAILY_PLIST="$LA/com.aios.social.daily.plist"
GUI="gui/$(id -u)"

if [ "${1:-}" = "uninstall" ]; then
  launchctl bootout "$GUI/com.aios.social.review" 2>/dev/null || true
  launchctl bootout "$GUI/com.aios.social.daily" 2>/dev/null || true
  rm -f "$REVIEW_PLIST" "$DAILY_PLIST"
  echo "Uninstalled AIS-OS social agents."
  exit 0
fi

mkdir -p "$LA" logs

cat > "$REVIEW_PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>com.aios.social.review</string>
  <key>ProgramArguments</key><array>
    <string>$NODE</string><string>$DIR/review.js</string>
  </array>
  <key>WorkingDirectory</key><string>$DIR</string>
  <key>EnvironmentVariables</key><dict><key>PATH</key><string>$PATH_LINE</string></dict>
  <key>RunAtLoad</key><true/>
  <key>KeepAlive</key><true/>
  <key>StandardOutPath</key><string>$DIR/logs/review.out.log</string>
  <key>StandardErrorPath</key><string>$DIR/logs/review.err.log</string>
</dict></plist>
EOF

cat > "$DAILY_PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>Label</key><string>com.aios.social.daily</string>
  <key>ProgramArguments</key><array>
    <string>/bin/bash</string><string>$DIR/daily.sh</string>
  </array>
  <key>WorkingDirectory</key><string>$DIR</string>
  <key>EnvironmentVariables</key><dict><key>PATH</key><string>$PATH_LINE</string></dict>
  <key>StartCalendarInterval</key><dict>
    <key>Hour</key><integer>8</integer><key>Minute</key><integer>0</integer>
  </dict>
  <key>StandardOutPath</key><string>$DIR/logs/daily.out.log</string>
  <key>StandardErrorPath</key><string>$DIR/logs/daily.err.log</string>
</dict></plist>
EOF

launchctl bootout "$GUI/com.aios.social.review" 2>/dev/null || true
launchctl bootout "$GUI/com.aios.social.daily" 2>/dev/null || true
launchctl bootstrap "$GUI" "$REVIEW_PLIST"
launchctl bootstrap "$GUI" "$DAILY_PLIST"

PORT=$(grep -E '^REVIEW_PORT=' secrets.env 2>/dev/null | cut -d= -f2 || true)
PORT=${PORT:-4500}

echo "Installed."
echo "  Review dashboard: http://localhost:${PORT}  (starts now, restarts at login)"
echo "  Daily drafts:     every day at 8:00 AM (both brands)"
echo "Uninstall with: ./install-launchd.sh uninstall"
