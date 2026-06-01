# Expansions

What to add to this AIOS as it grows. Not a roadmap — a menu. Pull from it when `/level-up` finds you have time to invest in the foundation.

## Tier 1 — make the kit actually work

- [x] Fill `aios-intake.md` Q1-Q7. *(Q1-Q3, Q7 done. Q4-Q6 have inferred defaults flagged for confirmation.)*
- [x] Run `/onboard` to regenerate persona, context, voice, and connection stubs. *(2026-06-01.)*
- [ ] Operator confirms Q4 (success metrics), Q5 (other comms tools), Q6 (IDE / task tracker / notes app).
- [ ] Verify the 3Ms framework reference matches Nate Herk's source (currently a neutral interpretation).
- [ ] Verify the Four-Cs audit rubric matches Nate Herk's source.

## Tier 2 — code-work skills (you are a software engineer)

Highest-leverage additions for SWE pain.

- [x] `/review-diff` — house-rules review tuned to Anson's TS/Next.js/Prisma stack. *(Shipped 2026-06-01.)*
- [x] `/pr-desc` — generate PR descriptions from the diff + commit messages. *(Shipped 2026-06-01.)*
- [x] `/commit-msg` — generate Conventional Commit messages from staged changes. *(Shipped 2026-06-01.)*
- [x] `/scaffold-next` — Next.js project shell matching NexGen Studio conventions. **Direct hit on Q7 pain #1.** *(Shipped 2026-06-01.)*
- [ ] `/debug-loop` — structured hypothesis-test-narrow ritual for bugs.
- [ ] `/repo-intake` — point at a fresh repo, generate its `CLAUDE.md`.
- [ ] `/metrics-weekly` — pull a weekly snapshot from GitHub commits + OpenPhone + email for the NexGen / InterlockGo dashboards (depends on Tier 4 MCPs).
- [ ] `/lead-reply` — draft InterlockGo SMS reply from a transcribed voicemail (depends on Tier 4 OpenPhone MCP).

## Tier 3 — hooks (behavior, not prompts)

Hooks change what the harness *does*, not just what the model *says*.

- [ ] `PostToolUse` on `Edit`/`Write` → run typecheck/lint, surface failures.
- [ ] `PreToolUse` on `Bash` → block destructive commands (`rm -rf`, `git reset --hard`, force push) without explicit confirm.
- [ ] `Stop` → if anything material was decided, append a one-line entry to `decisions/log.md`.
- [ ] `UserPromptSubmit` → inject the current session's TODO list from `.sessions/`.

## Tier 4 — MCP integrations

Each one extends what the AIOS can actually *do*, not just discuss.

- [ ] **OpenPhone MCP — voicemail → transcript → SMS draft.** Direct hit on Q7 pain #2. Voicemail comes in → transcribed → categorized (new lead vs. existing client vs. spam) → draft SMS reply ready for one-tap send. OpenPhone API already wired in InterlockGo Admin Dashboard production code, so this is "expose existing integration as MCP" rather than "build from scratch."
- [ ] Gmail MCP → daily inbox triage skill.
- [ ] GitHub MCP → PR babysitter, issue triage.
- [ ] Calendar MCP → meeting prep + post-meeting note capture.
- [ ] Linear / Jira MCP → task sync (only if Anson adopts a task tracker; currently none confirmed).
- [ ] Custom MCPs for InterlockGo Admin Dashboard endpoints (scheduling, provider sync status, etc.).

## Tier 5 — recurring agents (cron)

Scheduled runs that don't need you in the loop.

- [ ] Weekly `/audit` — Four-Cs gap report.
- [ ] Weekly `/level-up` — find one automation, scope it.
- [ ] Weekly digest — what shipped (across all repos), what's stuck, what's next.
- [ ] Daily Gmail triage (depends on Gmail MCP).
- [ ] Daily PR babysitter (depends on GitHub MCP).
- [ ] Daily InterlockGo voicemail sweep (depends on OpenPhone MCP).

## Tier 6 — productization (optional)

If the patterns prove out for you, they're templateable for others.

- [ ] Strip personal content into a clean template repo.
- [ ] Profile-specific variants (SWE, founder, PM, consultant, trades-business owner, etc.).
- [ ] Connector library — pre-wired MCP configs for common tools.
- [ ] Setup wizard — a single command that runs intake + onboard + first audit.
- [ ] "NexGen Studio AIOS-as-a-Service" — productize for client engagements: each new client gets a customized AIOS scaffold as part of their build.

## Tier 7 — archived ideas

Things considered and parked. Move entries here instead of deleting so future-you knows why something didn't make it.

- (none yet)
