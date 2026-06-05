# Decisions Log

Append-only record of decisions the operator and I make. Never edit past entries. Add a follow-up entry if a prior decision is reversed.

Why this matters: a single sentence of *why* now is worth an hour of archaeology in six months. Future-you (and future-AI) reads this before re-litigating settled questions.

## Format

```
## YYYY-MM-DD — {{short title}}

- Decision: what was decided, in one sentence.
- Why: the reason, including constraints, deadlines, or stakeholders.
- Alternatives considered: what was rejected and why.
- Reversibility: easy / medium / hard.
- Follow-up: any work this commits us to.
```

---

## 2026-06-01 — Initial scaffold completed

- Decision: Build the AIOS on the cloned Nate Herk kit. Keep the 3Ms framework and Four-Cs audit layer as the editorial spine.
- Why: Operator wants a personal AIOS for software-engineering productivity, eventually templateable for other businesses. Starting from a structured kit beats reinventing the folder shape.
- Alternatives considered: Strip the 3Ms layer for a neutral structure (rejected — operator chose to keep it permanently). Skip the scaffold and jump straight to skills (rejected — kit machinery needs the missing files to function).
- Reversibility: easy. Files are markdown and can be re-written or removed.
- Follow-up: Operator fills `aios-intake.md` Q1-Q7, then runs `/onboard`. Then Phase 2 (code-focused skills like `/review`, `/pr-desc`, `/commit-msg`).

## 2026-06-01 — /onboard run

- Decision: Personalized the AIOS from `aios-intake.md` Q1-Q7 (with resume + chat as supplements).
- Why: First `/onboard` run. Operator is Anson Cordeiro, full-stack SWE, running NexGen Studio + InterlockGo NOCO simultaneously. Quarter priorities: grow InterlockGo to #1 in Greeley, build NexGen Studio via shipped projects.
- Alternatives considered: Defer until intake was 100% complete (rejected — Q4/Q5/Q6 details were minor and could be filled later without blocking value).
- Reversibility: easy. Prior file versions are in git.
- Follow-up: Operator reviews populated files. Then Phase 2 code skills. Q4/Q5/Q6 gaps marked in `connections.md` under "Pending confirmation" — fill when convenient.

## 2026-06-01 — Phase 3 hooks shipped (3 of 4 planned)

- Decision: Built three project-local Claude Code hooks in `.claude/hooks/`, wired in `.claude/settings.json`: (1) `bash_guard.py` PreToolUse/Bash blocks destructive commands; (2) `skill_check.py` PostToolUse/Edit|Write validates SKILL.md frontmatter + mirror parity; (3) `session_context.py` SessionStart injects latest session Status + TODO. All three pipe-tested and proven firing in-session.
- Why: Phase 3 from EXPANSIONS. The Bash guard protects the repo + remote; the skill check directly prevents the two bugs we hit this session (name/dir mismatch, mirror drift); session-continuity makes agent handoffs warm. Chose project-local (`.claude/settings.json`) over global to contain blast radius and keep it reversible.
- Alternatives considered: (a) Generic PostToolUse typecheck/lint — rejected, this is a Markdown repo with nothing to type-check; documented as belonging in Anson's actual TS projects. (b) Stop→auto-append decision to this log — rejected, a Stop hook can't reliably detect/summarize a material decision and wrong append-only entries are worse than none. (c) UserPromptSubmit for continuity — rejected in favor of SessionStart to avoid per-prompt token cost. (d) Global `~/.claude/settings.json` install — deferred; promote `bash_guard.py` to global once proven.
- Reversibility: easy. Hooks are off if `.claude/settings.json` is removed or `disableAllHooks` is set; scripts are self-contained.
- Follow-up: Known limitation — `bash_guard.py` matches command text, so `echo`/comments containing blocked patterns get false-blocked (acceptable: costs one manual re-run). Consider promoting the Bash guard to global settings. Per-project typecheck hooks for the real code repos remain open.

## 2026-06-01 — /scaffold-next dry-run found 5 spec gaps

- Decision: Ran `/scaffold-next` against throwaway `~/dev/ai-os`. Skill produced a working scaffold (tsc, lint, build all green) but only after fixing 5 issues:
  1. **Prisma 7 broke datasource.url + PrismaClient import.** Pinned to `@prisma/client@^6` + `prisma@^6`. Skill updated to require ^6 pin until a separate Prisma-7-aware path lands.
  2. **`create-next-app` now generates `AGENTS.md` + `CLAUDE.md`.** Skill updated to acknowledge this and document the `--no-agents-md` opt-out.
  3. **`create-next-app` already runs `git init` + initial commit.** Skill said to `git init` again — would no-op or error. Updated to add a follow-up commit instead.
  4. **`.gitignore` ignores `.env*` so `.env.example` is invisible.** Skill updated to add `!.env.example` exception.
  5. **No verification step was specified.** Skill updated to require `npx prisma generate && npx tsc --noEmit && npm run lint && npm run build` to all pass before declaring success.
- Why: The whole point of the throwaway test was to surface gaps. Five real gaps, all fixed in the spec. Future runs should produce a green scaffold first try.
- Alternatives considered: Adopt Prisma 7 patterns immediately in the skill (rejected — Prisma 7 needs `prisma.config.ts` + adapter-based client, which warrants its own skill iteration). Delete the throwaway after the test (rejected — leave `~/dev/ai-os` in place as evidence; operator can `rm -rf` when ready).
- Reversibility: easy. Skill is a markdown file.
- Follow-up: Operator can run `/scaffold-next` again any time; should be green first try now. When Prisma 7 adoption is desired, plan a separate skill update.

## 2026-06-01 — Top weekly pain identified

- Decision: Treat "scaffolding new Next.js apps from scratch every time" as Phase 2's primary target. Build `/scaffold-next` skill this session.
- Why: Operator named it explicitly. High frequency (every NexGen client), high pain (boilerplate without leverage), and immediately solvable as a skill — fits the 3Ms Method filter (frequency × pain, draft is good enough, reversible).
- Alternatives considered: Build voicemail/SMS triage first (rejected — requires OpenPhone MCP integration which is Tier 4 work, not a skill). Defer all code skills and build hooks instead (rejected — skills have faster payoff for solo operator).
- Reversibility: easy.
- Follow-up: After `/scaffold-next` ships, run it on the next real NexGen project and capture lessons in `.sessions/`.

## 2026-06-03 — /level-up: NexGen proposal builder

- Decision: Ship `/proposal-builder` as the next NexGen Studio leverage skill, with reusable proposal template, offer notes, and Northern Colorado competitor research.
- Why: Proposal writing and local competitor research are repeated, research-heavy, draft-based, and directly tied to Priority 2: grow NexGen Studio through more signed projects.
- Alternatives considered: Build only a static proposal template (rejected because it would not remove the research/comparison drag). Build a full automated web app/PDF system now (rejected because a skill + templates can be verified immediately and expanded later).
- Reversibility: easy. Files are Markdown and can be edited or removed.
- Follow-up: Use `/proposal-builder` on the next real lead, then add PDF export or a `/competitor-refresh` skill if the workflow repeats.

## 2026-06-03 — Proposal workflow expanded

- Decision: Build the full NexGen proposal workflow stack: `/lead-intake`, `/proposal-builder`, `/proposal-finalizer`, `/competitor-refresh`, and `/proposal-follow-up`, backed by brand/pricing references, templates, and a tested PDF renderer.
- Why: The first real proposal showed the next bottleneck was not just writing the proposal, but reliably moving from rough lead notes to a branded final PDF and follow-up without hand-building each step.
- Alternatives considered: Keep manually generating PDFs from proposal drafts (rejected because the same layout issues would recur). Build a full web app now (rejected because skills plus a renderer solve the immediate workflow with less maintenance).
- Reversibility: easy. Skills/templates/references are Markdown; renderer is isolated in `scripts/render_proposal_pdf.py`.
- Follow-up: Use the workflow on the next lead and decide whether to add a UI or scheduled competitor refresh later.

## 2026-06-05 — README becomes human-facing overview

- Decision: Replace the placeholder `README.md` with a plain-English project overview, feature catalog, current gaps, and future roadmap.
- Why: The repo had strong agent handoffs and expansion notes, but no single human-readable file explaining the project simply and thoroughly.
- Alternatives considered: Create a separate `PROJECT_OVERVIEW.md` (rejected because `README.md` is the file people naturally open first).
- Reversibility: easy. Markdown-only documentation change.
- Follow-up: Keep `README.md` updated when major features ship.

## 2026-06-05 — Daily social post workflow added

- Decision: Add `/social-posts` as a manual-review drafting skill for KieferBuilt and InterlockGo Facebook/Instagram posts.
- Why: Daily social posts are repetitive but brand-sensitive. A skill with separate brand files, content pillars, and image rules gives Anson repeatable drafts without risking accidental publishing.
- Alternatives considered: Build an automated publisher immediately (rejected because Meta/API publishing and approval rules are not ready). Keep this as a one-off prompt only (rejected because the user asked to turn the build prompt into a reusable skill).
- Reversibility: easy. Markdown-only skill/context/template files plus generated draft output.
- Follow-up: Use `/social-posts` manually first; add scheduled generation only after the manual workflow proves useful.
