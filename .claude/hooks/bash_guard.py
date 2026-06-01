#!/usr/bin/env python3
"""PreToolUse hook (matcher: Bash) for AIS-OS.

Blocks clearly destructive shell commands so an agent can't nuke the scaffold or
clobber the remote without the operator explicitly running it. Exit code 2 blocks
the tool call and feeds stderr back to Claude; exit 0 allows it.

Conservative by design: only blocks a short list of high-blast-radius patterns.
If it blocks something legitimate, the operator runs it manually in a terminal.
"""

import json
import re
import sys

# Each tuple: (compiled regex, human reason). Keep this list tight — false
# positives train the operator to ignore the guard, which defeats it.
RULES = [
    (re.compile(r"\brm\s+(-\w*\s+)*-\w*[rf]\w*(\s+-\w+)*\s+/(\s|$)"),
     "rm -rf targeting / (filesystem root)"),
    (re.compile(r"\brm\s+(-\w*\s+)*-\w*r\w*f|\brm\s+(-\w*\s+)*-\w*f\w*r"),
     "rm -rf (recursive force delete)"),
    (re.compile(r"\bgit\s+reset\s+--hard\b"),
     "git reset --hard (discards uncommitted work)"),
    (re.compile(r"\bgit\s+push\b.*(--force(?!-with-lease)\b|\s-f\b)"),
     "git push --force (use --force-with-lease, or push manually)"),
    (re.compile(r"\bgit\s+clean\s+(-\w*\s+)*-\w*f"),
     "git clean -f (deletes untracked files)"),
    (re.compile(r"\bgit\s+checkout\s+--\s+\."),
     "git checkout -- . (discards all unstaged changes)"),
    (re.compile(r">\s*/dev/sd[a-z]"),
     "writing directly to a block device"),
    (re.compile(r"\bchmod\s+(-\w+\s+)*777\b"),
     "chmod 777 (world-writable)"),
]


def main() -> int:
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        # If we can't parse input, don't block — fail open.
        return 0

    command = (data.get("tool_input") or {}).get("command", "")
    if not command:
        return 0

    for pattern, reason in RULES:
        if pattern.search(command):
            sys.stderr.write(
                f"[bash_guard] Blocked: {reason}.\n"
                f"Command: {command}\n"
                "If this is intentional, run it yourself in a terminal — "
                "the AIOS guard does not auto-approve destructive commands.\n"
            )
            return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
