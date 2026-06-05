# Session: 2026-06-05 — Social posts

## Status: IN PROGRESS

## Context / Starting Point

- Operator provided `BUILD-PROMPT-social-posts.md` and asked to review it, turn it into a new skill, and build what it described without interruptions.
- Repo already had uncommitted work from the README/handoff update:
  - `README.md`
  - `decisions/log.md`
  - `.sessions/2026-06-03-proposal-builder.md`
- AIS-OS is still Markdown-first; no app runtime or deployment exists.

## Goals

- [x] Review the social-post build prompt.
- [x] Create brand context for KieferBuilt and InterlockGo.
- [x] Create the `social/` inbox/template/output structure.
- [x] Add mirrored `/social-posts` skill files for Claude Code and Codex.
- [x] Dry-run the skill for 2026-06-05.
- [x] Update docs, decisions log, and session handoff.

## Decisions

- Decision: Build `/social-posts` as a manual-review drafting skill, not an automated publisher.
  - Rationale: The prompt's strongest rule was no publishing and no Meta API calls. Markdown drafts let Anson review, edit, approve, and manually schedule posts.
  - Alternatives considered: scheduled generation now, Meta API publishing, one-off prompt only.
  - Reversibility: easy.

## Work Completed

- [x] Added KieferBuilt brand, voice, content pillars, and image strategy.
- [x] Added InterlockGo brand, voice, content pillars, and image strategy.
- [x] Added `social/_inbox/README.md`.
- [x] Added `social/_templates/daily-posts-template.md`.
- [x] Added mirrored `/social-posts` skill files.
- [x] Generated `social/2026-06-05/posts.md` with four draft posts and no remaining placeholders.
- [x] Updated `AGENTS.md`, `EXPANSIONS.md`, `README.md`, `decisions/log.md`, and `.sessions/SESSION_INDEX.md`.

## Files Changed

- `.claude/skills/social-posts/SKILL.md` (new)
- `.agents/skills/social-posts/SKILL.md` (new)
- `context/brands/kiefer-built/brand.md` (new)
- `context/brands/kiefer-built/voice.md` (new)
- `context/brands/kiefer-built/content-pillars.md` (new)
- `context/brands/kiefer-built/image-strategy.md` (new)
- `context/brands/interlockgo/brand.md` (new)
- `context/brands/interlockgo/voice.md` (new)
- `context/brands/interlockgo/content-pillars.md` (new)
- `context/brands/interlockgo/image-strategy.md` (new)
- `social/_inbox/README.md` (new)
- `social/_templates/daily-posts-template.md` (new)
- `social/.gitkeep` (new)
- `social/2026-06-05/posts.md` (new)
- `AGENTS.md` (modified)
- `README.md` (modified)
- `EXPANSIONS.md` (modified)
- `decisions/log.md` (modified)
- `.sessions/SESSION_INDEX.md` (modified)
- `.sessions/2026-06-05-social-posts.md` (new)

## How to Run / Verify

- `test -f context/brands/kiefer-built/brand.md && test -f context/brands/interlockgo/brand.md && test -f social/_inbox/README.md && test -f social/_templates/daily-posts-template.md && test -f .claude/skills/social-posts/SKILL.md && test -f .agents/skills/social-posts/SKILL.md && test -f social/2026-06-05/posts.md`
- `cmp -s .claude/skills/social-posts/SKILL.md .agents/skills/social-posts/SKILL.md`
- `for f in .claude/skills/social-posts/SKILL.md .agents/skills/social-posts/SKILL.md; do head -1 "$f" | grep -q '^---$' && grep -q '^name: social-posts$' "$f" && grep -q '^description: ' "$f"; done`
- `! rg '\{\{' social/2026-06-05/posts.md`
- Brand separation checks with `rg` for KieferBuilt and InterlockGo phone/link values.
- Image rule checks with `rg` against the generated posts.

Verification run this session:

- File tree exists: passed.
- Mirror match: passed.
- Frontmatter valid: passed.
- Dry run generated: passed; `social/2026-06-05/posts.md` exists with no `{{placeholders}}`.
- Brand separation: passed; KieferBuilt uses `970-515-5059` / `kbuiltco.com`, InterlockGo uses `970-515-5740` / `interlockgo.io`.
- Image rules: passed; KieferBuilt uses real-photo plans only, InterlockGo generated image plans include aspect ratios and avoid shame/police/alcohol imagery.
- InterlockGo sensitivity: passed; no judgment, jokes, or legal promises in captions.
- No publish/API calls: no network or Meta API calls were made.
- Skill directory parity: passed.
- All skill frontmatter first-line check: passed.
- `git diff --check`: passed.

## Issues / Risks

- The source prompt says the setup phase should not create dated output files, but its required verification says to dry-run and generate today's `social/{TODAY}/posts.md`. This session followed the verification requirement.
- KieferBuilt image URLs were copied from the prompt and not live-verified in this session.
- `/social-posts` does not publish or schedule anything. Meta Business Suite scheduling remains manual.

## TODO / Next Session

- [ ] Use `/social-posts` again tomorrow or for the next desired date.
- [ ] If the manual workflow proves useful, decide whether to add a scheduled daily generation/reminder.
- [ ] Add real KieferBuilt project photos under an approved asset location if Anson wants local image references.

## Notes

- This directly supports repeatable business content without introducing social API risk.
