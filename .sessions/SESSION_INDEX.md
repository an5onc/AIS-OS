# Session Index

Newest first. Each entry: dated filename, status, one-line summary.

## Sessions

- **[2026-06-01-initial-setup.md](2026-06-01-initial-setup.md)** — CLOSED — Full build day: AIOS scaffold, `/onboard` personalization, Phase 2 code skills, AGENTS.md project-handoff split, `/scaffold-next` dry-run (5 gaps fixed), Phase 3 hooks (Bash guard + skill check + session continuity), repo `.gitignore`. Pushed v0.1/v0.2; post-v0.2 work uncommitted at close. Operator: Anson Cordeiro.

## Conventions

- Filename: `YYYY-MM-DD-<short-slug>.md`. One file per day; overwrite as the session progresses.
- Status: include `## Status: IN PROGRESS` while the session is live; remove the line when the operator says "let's close today".
- Template: copy [TEMPLATE.md](TEMPLATE.md) at the start of a new session.

## How a new agent uses this file

1. Open this index. Read the top entry's filename.
2. Open that session file. Read `Status`, `Files Changed`, `Issues / Risks`, `TODO / Next Session`.
3. Read [`../AGENTS.md`](../AGENTS.md) for the project handoff (stack, source-of-truth files, working rules, end-of-session protocol, active hooks).
4. Read [`../CLAUDE.md`](../CLAUDE.md) only if the task is acting *for* Anson (voice, persona, priorities), not just *on* the repo.
5. Run `git status --short` to reconcile the file state.
