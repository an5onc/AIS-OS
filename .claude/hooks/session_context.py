#!/usr/bin/env python3
"""SessionStart hook for AIS-OS.

Injects continuity context at the start of each session so a fresh agent starts
warm: the latest session file's Status line and its "TODO / Next Session"
section. stdout from a SessionStart hook is added to the model's context.

Stays quiet (no output) if there is no session file yet. Never errors out.
"""

import os
import re
import sys


def repo_root() -> str:
    # Hook runs with cwd at the project root; fall back to script location.
    here = os.getcwd()
    if os.path.isdir(os.path.join(here, ".sessions")):
        return here
    return os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def latest_session_file(sessions_dir: str):
    if not os.path.isdir(sessions_dir):
        return None
    candidates = [
        f for f in os.listdir(sessions_dir)
        if re.match(r"^\d{4}-\d{2}-\d{2}.*\.md$", f)
        and f not in ("SESSION_INDEX.md", "TEMPLATE.md")
    ]
    if not candidates:
        return None
    candidates.sort(reverse=True)
    return os.path.join(sessions_dir, candidates[0])


def extract_section(text: str, header: str) -> str:
    """Return the body under a `## header` until the next `## ` or EOF."""
    lines = text.splitlines()
    out = []
    capturing = False
    for line in lines:
        if line.strip().lower() == f"## {header}".lower():
            capturing = True
            continue
        if capturing and line.startswith("## "):
            break
        if capturing:
            out.append(line)
    return "\n".join(out).strip()


def main() -> int:
    root = repo_root()
    path = latest_session_file(os.path.join(root, ".sessions"))
    if not path:
        return 0

    with open(path, "r", encoding="utf-8") as fh:
        text = fh.read()

    fname = os.path.basename(path)
    status_match = re.search(r"^## Status:\s*(.+)$", text, re.MULTILINE)
    status = status_match.group(1).strip() if status_match else "closed"
    todos = extract_section(text, "TODO / Next Session")

    parts = [
        f"AIS-OS session continuity (from .sessions/{fname}):",
        f"- Status: {status}",
    ]
    if todos:
        parts.append("- Open TODOs / next steps:")
        parts.append(todos)
    parts.append(
        "Read AGENTS.md and the full session file before acting on the above."
    )
    sys.stdout.write("\n".join(parts) + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
