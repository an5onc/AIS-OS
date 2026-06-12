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

## Tier 2.5 — NexGen Studio sales skills

Skills that help turn leads into signed projects without adding manual proposal work.

- [x] `/proposal-builder` — draft branded NexGen Studio website/software proposals from client inputs, offer notes, and current local competitor research. **Direct hit on NexGen proposal/research drag.** *(Shipped 2026-06-03.)*
- [x] `/proposal-finalizer` — render proposal Markdown into a branded NexGen PDF using stored brand assets, pricing checks, and preview QA. *(Shipped 2026-06-03.)*
- [x] `/competitor-refresh` — scheduled or manual refresh of Northern Colorado web design competitor pricing, services, add-ons, and positioning. *(Shipped 2026-06-03.)*
- [x] `/proposal-follow-up` — draft follow-up email/SMS after a proposal has been sent, using the proposal file and lead context. *(Shipped 2026-06-03.)*
- [x] `/lead-intake` — turn rough client notes into a clean proposal-ready lead brief. *(Shipped 2026-06-03.)*

## Tier 2.6 — business content skills

Skills that produce review-ready marketing content with human approval before anything goes live.

- [x] `/social-posts` — generate daily Facebook drafts for KieferBuilt and InterlockGo, using separate brand context, voice rules, content pillars, and image rules. *(Shipped 2026-06-05.)*
- [x] `social/engine` — Node generate -> review dashboard -> approve/publish/delete loop for both Facebook Pages, with launchd scheduling and local-image upload. *(Live 2026-06-06.)*
- [ ] Instagram support — IG Business account per Page + image-hosting/upload pipeline + dashboard approval flow.

## Tier 3 — hooks (behavior, not prompts)

Hooks change what the harness *does*, not just what the model *says*. Built ones live in `.claude/hooks/` and are wired in `.claude/settings.json` — see `.claude/hooks/README.md`.

- [x] `PreToolUse` on `Bash` → block destructive commands (`rm -rf`, `git reset --hard`, force push, `git clean -f`, etc.). *(Shipped 2026-06-01 as `bash_guard.py`.)*
- [x] `PostToolUse` on `Edit`/`Write` → validate `SKILL.md` frontmatter + flag `.claude`↔`.agents` mirror drift. *(Shipped 2026-06-01 as `skill_check.py`. Replaces the generic typecheck idea, which doesn't fit a Markdown-only repo.)*
- [x] `SessionStart` → inject latest session Status + TODO for warm starts. *(Shipped 2026-06-01 as `session_context.py`. Chosen over `UserPromptSubmit` to avoid per-prompt token cost.)*
- [ ] ~~`PostToolUse` typecheck/lint~~ → not applicable here (Markdown repo). Belongs in Anson's actual TS code projects; drop a per-project hook into each.
- [ ] ~~`Stop` → auto-append decision to `decisions/log.md`~~ → deliberately skipped: a Stop hook can't reliably detect or summarize a "material decision," and wrong entries in an append-only log are worse than none. Keep decision logging manual.
- [ ] Promote `bash_guard.py` to `~/.claude/settings.json` (global) once proven, so it protects every repo, not just AIS-OS.

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
- [x] Daily `/social-posts` generation/review dashboard via launchd. *(Installed 2026-06-06; human approval still required before publishing.)*

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

## Social engine — next phases
- Instagram support (IG Business account per Page + image hosting + Content Publishing API).
- Wire `social/_inbox/` daily notes into the engine so Anson can steer a day's topic/photo.
- Optional: image generation for InterlockGo posts (hosted publicly so IG can use them).
