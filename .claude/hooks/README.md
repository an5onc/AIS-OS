# AIS-OS hooks

Project-local Claude Code hooks, wired in [`.claude/settings.json`](../settings.json).
These fire only when Claude Code runs with its working directory in this repo.

To review, edit, or disable any of them interactively, open `/hooks`. To disable
all hooks at once, set `"disableAllHooks": true` in `.claude/settings.local.json`.

## The three hooks

### 1. `bash_guard.py` — PreToolUse on `Bash`

Blocks high-blast-radius shell commands (exit code 2 = block). Patterns:
`rm -rf`, `git reset --hard`, `git push --force` (allows `--force-with-lease`),
`git clean -f`, `git checkout -- .`, writing to a block device, `chmod 777`.

**Known limitation — it matches command *text*, not intent.** A harmless
`echo "rm -rf ..."` or a comment containing a blocked pattern will also be
blocked. That's the deliberate conservative tradeoff: a false block costs you
one manual re-run in a terminal; a false allow could delete the repo. If a block
is a false positive, run the command yourself in a terminal.

### 2. `skill_check.py` — PostToolUse on `Edit|Write`

When a `SKILL.md` under `.claude/skills/` or `.agents/skills/` is written,
verifies: frontmatter present, `name:` matches the directory, `description:`
present, and the `.claude` ↔ `.agents` mirror exists and is identical. Silent on
success; flags problems via stderr (advisory — the write already happened, so it
doesn't block, it just tells the agent to fix). Catches the two bugs this repo
actually hit: a `name:`/directory mismatch and mirror drift.

### 3. `session_context.py` — SessionStart

Injects continuity at session start: the latest `.sessions/` file's Status line
and its "TODO / Next Session" section, added to the model's context so a fresh
agent starts warm. Silent if no session file exists.

## Deliberately NOT built (and why)

- **PostToolUse typecheck/lint on edit** (from EXPANSIONS Tier 3): this repo is
  Markdown-only, so there's nothing to type-check here. This hook belongs in
  Anson's actual code projects, not AIS-OS. Drop a per-project version into each
  TS repo's `.claude/settings.json` when wanted.
- **Stop → auto-append a decision to `decisions/log.md`**: a Stop hook runs a
  shell command and can't reliably judge whether a "material decision" was made
  or summarize it. Auto-appending wrong content to an append-only log is worse
  than nothing. Keep decision logging manual (or use `/level-up`'s logging step).

## Testing a hook after you change it

Pipe a synthetic payload to the script directly — no need to trigger a real tool:

```sh
echo '{"tool_name":"Bash","tool_input":{"command":"rm -rf x"}}' | python3 .claude/hooks/bash_guard.py; echo "exit=$?"
echo '{"tool_name":"Write","tool_input":{"file_path":"'$PWD'/.claude/skills/onboard/SKILL.md"}}' | python3 .claude/hooks/skill_check.py; echo "exit=$?"
echo '{}' | python3 .claude/hooks/session_context.py
```

If you edit `.claude/settings.json` mid-session, the hook may not reload until you
open `/hooks` once or restart Claude Code.
