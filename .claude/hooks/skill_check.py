#!/usr/bin/env python3
"""PostToolUse hook (matcher: Edit|Write) for AIS-OS.

When a SKILL.md under .claude/skills/ or .agents/skills/ is written, verify:
  1. YAML frontmatter is present and well-formed (--- ... ---).
  2. The `name:` field matches the parent directory name.
  3. `description:` is present and non-empty.
  4. The mirror counterpart (.claude <-> .agents) exists and is identical.

Catches the two real bugs this repo hit: a name/dir mismatch and mirror drift.
Stays silent (exit 0) for anything that isn't a skill file or that passes all
checks. Surfaces problems to Claude via stderr + exit 2 (advisory; the tool has
already run, so this does not block — it just flags).
"""

import json
import os
import re
import sys


def find_repo_root(start: str) -> str:
    cur = os.path.abspath(start)
    while cur != "/":
        if os.path.isdir(os.path.join(cur, ".git")):
            return cur
        cur = os.path.dirname(cur)
    return os.path.abspath(start)


def parse_frontmatter(text: str):
    """Return (dict, error). dict is None if frontmatter missing/malformed."""
    if not text.startswith("---\n"):
        return None, "missing YAML frontmatter (file must start with '---')"
    end = text.find("\n---", 4)
    if end == -1:
        return None, "frontmatter opening '---' has no closing '---'"
    block = text[4:end]
    fields = {}
    for line in block.splitlines():
        m = re.match(r"^([A-Za-z0-9_-]+):\s*(.*)$", line)
        if m:
            fields[m.group(1)] = m.group(2).strip()
    return fields, None


def main() -> int:
    try:
        data = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0

    tool_input = data.get("tool_input") or {}
    tool_response = data.get("tool_response") or {}
    path = (
        tool_response.get("filePath")
        or tool_input.get("file_path")
        or ""
    )
    if not path.endswith("SKILL.md"):
        return 0
    # Only care about skill trees.
    if (".claude/skills/" not in path) and (".agents/skills/" not in path):
        return 0

    if not os.path.isfile(path):
        return 0

    problems = []
    with open(path, "r", encoding="utf-8") as fh:
        text = fh.read()

    dir_name = os.path.basename(os.path.dirname(path))
    fields, err = parse_frontmatter(text)
    if err:
        problems.append(err)
    else:
        name = fields.get("name")
        if not name:
            problems.append("frontmatter missing `name:` field")
        elif name != dir_name:
            problems.append(
                f"`name: {name}` does not match directory `{dir_name}/` "
                "(skill name must equal its folder)"
            )
        if not fields.get("description"):
            problems.append("frontmatter missing or empty `description:` field")

    # Mirror parity check.
    if ".claude/skills/" in path:
        mirror = path.replace("/.claude/skills/", "/.agents/skills/")
        mirror_label = ".agents mirror"
    else:
        mirror = path.replace("/.agents/skills/", "/.claude/skills/")
        mirror_label = ".claude mirror"

    if not os.path.isfile(mirror):
        problems.append(
            f"{mirror_label} is missing: {mirror} "
            "(every skill must exist in both .claude/skills/ and .agents/skills/)"
        )
    else:
        with open(mirror, "r", encoding="utf-8") as fh:
            if fh.read() != text:
                problems.append(
                    f"{mirror_label} is out of sync: {mirror} "
                    "(copy this file over it to restore parity)"
                )

    if problems:
        sys.stderr.write(
            "[skill_check] Issues with "
            + os.path.relpath(path, find_repo_root(os.path.dirname(path)))
            + ":\n"
        )
        for p in problems:
            sys.stderr.write(f"  - {p}\n")
        return 2

    return 0


if __name__ == "__main__":
    sys.exit(main())
