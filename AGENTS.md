# AGENTS.md — AIS-OS project handoff

This file is the entry point for any AI agent (Claude Code, Codex, or another) opening this repo. Read it first. It tells you what the project is, what's true *now*, where the source of truth lives, what to do, and how to leave a clean handoff for the next agent.

> **Persona vs. project.** This file is the *project* handoff — stack, commands, file map, working rules. The *operator persona* (who Anson is, his voice, his priorities, how to talk to him) lives in [CLAUDE.md](CLAUDE.md). They are intentionally separate:
> - Read **AGENTS.md** when you're working *on* this repo (editing files, adding skills, refactoring).
> - Read **CLAUDE.md** when you're working *for* Anson (drafting on his behalf, deciding what fits his priorities, matching his voice).
> - You usually want both. Read this one first; it's shorter.

---

## What this project is

AIS-OS is **Anson Cordeiro's personal AI Operating System (AIOS)** — a Markdown-based scaffold that gives Claude Code and Codex a persistent, structured context to work from. It's a personal-productivity system, not a deployable application.

Forked from a Nate Herk-style AIOS kit (3Ms framework, Four-Cs audit, three core ritual skills). Personalized to Anson on 2026-06-01 and extended with code-focused skills for his TS/Next.js work across NexGen Studio and InterlockGo NOCO.

The repo's value is the *patterns*: persona file + intake-derived context + tool registry + append-only decisions log + skills + session handoffs. The skills are Markdown prompts; the hooks are not yet built; integrations are not yet wired. See [EXPANSIONS.md](EXPANSIONS.md) for the planned growth path.

## Stack / runtime truth

- **Language:** Markdown. No code to compile, no runtime.
- **Required tooling:** Claude Code (≥ skills-supporting version) and/or Codex. Optional: `gh` CLI for GitHub ops, standard Unix tools (`find`, `git`).
- **No** `package.json`, `tsconfig.json`, `Makefile`, `requirements.txt`, or build manifest. If you find one, it was added after this handoff — update this file.
- **Skill convention:** Claude Code reads [`.claude/skills/<name>/SKILL.md`](.claude/skills/). Codex reads [`.agents/skills/<name>/SKILL.md`](.agents/skills/). The two trees are mirrored — when you add or edit a skill in one, mirror it in the other.
- **Persona convention:** Claude Code reads [`CLAUDE.md`](CLAUDE.md) at repo root. Codex reads [`AGENTS.md`](AGENTS.md) at repo root. Historically these mirrored. **This file no longer mirrors CLAUDE.md** — it is now the project handoff, and CLAUDE.md is the persona. If you regenerate the persona via `/onboard`, write to CLAUDE.md only.

## Source-of-truth files

Read in this order when joining the project cold:

| File | What it is | When to read |
|---|---|---|
| [AGENTS.md](AGENTS.md) (this file) | Project handoff for agents | Always, first |
| [.sessions/SESSION_INDEX.md](.sessions/SESSION_INDEX.md) | Newest-first session log | Always, second |
| Latest file in `.sessions/` | The most recent session's state | Always, third |
| [CLAUDE.md](CLAUDE.md) | AIOS operator persona for Anson | Before doing anything *for* Anson (drafting, deciding) |
| [context/about-me.md](context/about-me.md) | Operator profile | When the task needs personal context |
| [context/about-business.md](context/about-business.md) | NexGen Studio + InterlockGo NOCO summaries | When the task touches a business |
| [context/priorities.md](context/priorities.md) | Current-quarter priorities | Before suggesting work direction |
| [references/voice.md](references/voice.md) | Voice samples + register notes | Before drafting external content |
| [references/3ms-framework.md](references/3ms-framework.md) | Mindset / Method / Machine framework | Before `/level-up` |
| [connections.md](connections.md) | Registry of tools the AIOS can reach | Before assuming an integration exists |
| [decisions/log.md](decisions/log.md) | Append-only decisions log | Before re-litigating any settled question |
| [aios-intake.md](aios-intake.md) | Raw Q1-Q7 intake | When persona/context seems wrong |
| [EXPANSIONS.md](EXPANSIONS.md) | Planned growth menu (tiered) | When deciding what to build next |
| [context/brands/](context/brands/) | Brand-specific social/content references | Before drafting daily posts or brand content |

Folders without single-file sources:

- [`.claude/skills/`](.claude/skills/) — Claude Code skills. Each is `<name>/SKILL.md` with YAML frontmatter (`name`, `description`).
- [`.agents/skills/`](.agents/skills/) — Codex mirrors. Must stay in sync with `.claude/skills/`.
- [`.claude/hooks/`](.claude/hooks/) — project-local hook scripts, wired in [`.claude/settings.json`](.claude/settings.json). See [`.claude/hooks/README.md`](.claude/hooks/README.md).
- [`social/`](social/) — daily social post drafts, inbox notes, and reusable post templates. Drafts are for manual review and scheduling only.
- [`archives/`](archives/) — long-term storage. Move files here instead of deleting.

## Required environment variables

**None for the repo itself.** Everything is Markdown. No secrets to inject, no `.env` files to populate.

When future skills (Phase 4 in [EXPANSIONS.md](EXPANSIONS.md)) wire MCP integrations, document any required env vars in this section and in [connections.md](connections.md) under the relevant entry's `Notes`.

## Common commands

There is no build, test, or dev server.

The operations available are skill invocations and file edits:

| Command | What it does | When to use |
|---|---|---|
| `/onboard` | Re-runs intake → regenerates persona files | After editing [aios-intake.md](aios-intake.md) |
| `/audit` | Four-Cs gap report | Weekly health check |
| `/level-up` | Weekly 3Ms interview | Pick the next automation to build |
| `/review-diff` | House-rules code review (Anson's TS/Next.js stack) | After writing code in his projects |
| `/pr-desc` | Draft a PR description | Before opening a PR |
| `/commit-msg` | Generate a Conventional Commit message | Before committing non-trivial changes |
| `/scaffold-next` | New Next.js project shell with Anson's defaults | Start of any NexGen Studio client project |
| `/lead-intake` | Convert rough NexGen lead notes into a structured brief | Before proposal-builder when details are messy |
| `/proposal-builder` | Draft NexGen Studio website/software proposals with local competitor context | When a prospective client needs a proposal |
| `/proposal-finalizer` | Render a proposal Markdown file into a branded NexGen PDF | After proposal-builder draft approval |
| `/competitor-refresh` | Refresh competitor pricing/services/add-ons with live sources | Before proposals that rely on current market claims |
| `/proposal-follow-up` | Draft follow-up email/SMS after a proposal has been sent | After a proposal is delivered |
| `/social-posts` | Draft daily Facebook and Instagram posts for KieferBuilt and InterlockGo | When creating daily posts for manual Meta Business Suite scheduling |

These are *skills*, invoked by name. They are NOT shell commands.

### Verification commands an agent CAN run on this repo

| Goal | Command | Notes |
|---|---|---|
| Confirm clean working tree | `git status --short` | Should be empty before saying "done" |
| List every tracked + untracked file | `find . -type f -not -path './.git/*' \| sort` | Use to verify expected files exist |
| Validate every skill has YAML frontmatter | `for f in .claude/skills/*/SKILL.md .agents/skills/*/SKILL.md; do head -1 "$f" \| grep -q '^---$' \|\| echo "MISSING FRONTMATTER: $f"; done` | Empty output = pass |
| Check `.claude/` ↔ `.agents/` skill parity | `diff <(ls .claude/skills) <(ls .agents/skills)` | Empty output = pass |

There is no `npm test`, no `make`, no CI pipeline.

## Deployment notes

**Not deployed.** This is a personal-context repo that lives on the operator's local machine and (optionally) a private GitHub backup. There is no production environment.

If you ever push this repo to a public remote, audit first: the `decisions/log.md`, `context/`, and `connections.md` may contain personal or business-sensitive info.

## Working rules for future agents

These are the conventions earlier agents have either established or learned the hard way. Follow them unless the operator overrides.

1. **Mirror skills.** Every `.claude/skills/<name>/SKILL.md` must have a matching `.agents/skills/<name>/SKILL.md`. Edit both. They are content-identical.
2. **Append-only on `decisions/log.md` and `connections.md`.** Never silently rewrite a past entry. To reverse a decision, append a new entry that supersedes it.
3. **Don't auto-commit.** The operator commits manually. Show diffs; let him approve.
4. **No `mkdir` for existing dirs.** The system reminder at session start lists existing infrastructure. Don't recreate.
5. **Source-of-truth check before suggesting.** If a memory or earlier statement claims a file/function exists, verify it exists *now* before recommending action on it.
6. **YAML frontmatter on every SKILL.md.** Format: `name` (matches directory) and `description` (single sentence used by Claude Code's skill picker). The first 3 lines of every SKILL.md must be exactly `---\nname: <kebab>\ndescription: ...\n---`.
7. **Skill names must not collide with built-ins.** Anson's `/review` was renamed to `/review-diff` because `/review` is built into Claude Code. Before naming a new skill, check the active skill list in the session reminder.
8. **Persona vs. project separation.** Don't write project handoff content into [CLAUDE.md](CLAUDE.md). Don't write Anson's persona content into this file. Cross-link instead.
9. **Trademark attribution.** The 3Ms framework is trademarked to Nate Herk. Preserve the attribution in [references/3ms-framework.md](references/3ms-framework.md). If swapping in canonical wording, keep the citation line.
10. **`{{placeholders}}` mean "operator action required."** Don't fabricate values. If `aios-intake.md` has `Pending` markers in answers, surface them in summary; don't invent answers.
11. **`/dev/CLAUDE.md` is the parent.** This repo lives inside `/Users/ansoncordeiro/dev/`. That directory has its own [CLAUDE.md](../CLAUDE.md) with session save/close protocols ("save session", "let's close today"). When the operator uses those phrases, the parent rules apply.
12. **Hooks are active in this repo.** [`.claude/settings.json`](.claude/settings.json) wires three project-local hooks (destructive-Bash guard, SKILL.md integrity check, session-continuity injection). If a Bash command is blocked unexpectedly, it likely tripped the text-based `bash_guard.py` — run it manually or see [`.claude/hooks/README.md`](.claude/hooks/README.md). Don't disable hooks to work around a block; fix the command or run it yourself.

## End-of-session handoff protocol

When you finish a chunk of work in this repo, leave the next agent (or future-you) a clean exit. Do this **before** you stop responding:

1. **Verify state.** Run `git status --short` and confirm it matches what you intended to leave behind.
2. **Update or create today's session file** in `.sessions/`:
   - Filename: `YYYY-MM-DD-<short-slug>.md` (e.g., `2026-06-01-initial-setup.md`). If a session file already exists for today, **overwrite** it with the latest state — do not create a new dated file mid-day.
   - Use [.sessions/TEMPLATE.md](.sessions/TEMPLATE.md) as the structure.
   - Mark `## Status: IN PROGRESS` if the operator is still working; remove the status line when the operator says "let's close today" (per [/dev/CLAUDE.md](../CLAUDE.md)).
3. **Update [.sessions/SESSION_INDEX.md](.sessions/SESSION_INDEX.md)**. Newest entry at top.
4. **Append to [decisions/log.md](decisions/log.md)** if any non-trivial decision was made. One entry per decision, even if you made three this session.
5. **Mention any blocked checks** in the session file's "Issues / Risks" section (e.g., "Phase 4 OpenPhone MCP requires API token Anson hasn't placed in env yet").
6. **Do not commit** unless the operator explicitly asked.

### Starting a new session as a fresh agent

If you are reading this file for the first time:

1. Read this file (AGENTS.md) end to end.
2. Open [.sessions/SESSION_INDEX.md](.sessions/SESSION_INDEX.md). Read the top entry.
3. Open the file that entry points to. Read its `Status`, `Files Changed`, `Issues / Risks`, and `TODO / Next Session` sections.
4. Run `git status --short`. Reconcile what you read against what's actually in the working tree.
5. If the latest session shows `## Status: IN PROGRESS`, the prior agent left work mid-stream. Continue from the TODO list, or ask the operator what to do.
6. If [CLAUDE.md](CLAUDE.md) is relevant (i.e., you'll be acting *for* Anson, not just *on* the repo), read that too.
7. Summarize back to the operator in 5-10 bullets: what state the repo is in, what changed last, what verification is known, what is blocked.

---

*This file last updated: 2026-06-05. If today's date is meaningfully later and you see drift between the contents above and the repo state, update this file before continuing.*
