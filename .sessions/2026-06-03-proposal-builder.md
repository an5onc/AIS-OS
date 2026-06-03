# Session: 2026-06-03 — Proposal builder

## Status: IN PROGRESS

## Context / Starting Point

- Operator identified a repeated NexGen Studio drag: writing website/digital outreach proposals, researching local competitors, comparing pricing/add-ons, and explaining why a client should choose NexGen.
- Repo was clean before this work.
- Latest prior session was `2026-06-01-initial-setup.md`.

## Goals

- [x] Add a first-version NexGen Studio proposal workflow.
- [x] Add reusable proposal template and offer notes.
- [x] Add Northern Colorado web design competitor research baseline.
- [x] Mirror the new skill across `.claude/skills/` and `.agents/skills/`.
- [x] Update project docs, decisions log, and session handoff.

## Decisions

- Decision: Ship `/proposal-builder` as a Markdown skill first, not a full app.
  - Rationale: A skill can remove the immediate proposal/research drag now and is easy to verify. PDF export, scheduled competitor refresh, and CRM/email integrations can come later.
  - Alternatives considered: Static template only, full proposal web app, scheduled research agent first.
  - Reversibility: easy.

## Work Completed

- [x] Added `/proposal-builder` skill in both Claude and Codex skill trees.
- [x] Added `templates/proposal.md`.
- [x] Added `references/nexgen-offer.md`.
- [x] Added `references/competitors/noco-web-design.md` with live public-source research from 2026-06-03.
- [x] Added `proposals/.gitkeep` as the future proposal output folder.
- [x] Updated `CLAUDE.md`, `AGENTS.md`, `EXPANSIONS.md`, and `decisions/log.md`.

## Files Changed

- `.claude/skills/proposal-builder/SKILL.md` (new)
- `.agents/skills/proposal-builder/SKILL.md` (new)
- `templates/proposal.md` (new)
- `references/nexgen-offer.md` (new)
- `references/competitors/noco-web-design.md` (new)
- `proposals/.gitkeep` (new)
- `CLAUDE.md` (modified)
- `AGENTS.md` (modified)
- `EXPANSIONS.md` (modified)
- `decisions/log.md` (modified)
- `.sessions/SESSION_INDEX.md` (modified)
- `.sessions/2026-06-03-proposal-builder.md` (new)

## How to Run / Verify

- `git status --short`
- `diff <(ls .claude/skills) <(ls .agents/skills)`
- `for f in .claude/skills/*/SKILL.md .agents/skills/*/SKILL.md; do head -1 "$f" | grep -q '^---$' || echo "MISSING FRONTMATTER: $f"; done`
- `for f in .claude/skills/*/SKILL.md .agents/skills/*/SKILL.md; do dir=$(basename "$(dirname "$f")"); name=$(awk -F': ' '/^name:/{print $2; exit}' "$f"); desc=$(awk -F': ' '/^description:/{print $2; exit}' "$f"); [ "$name" = "$dir" ] || echo "NAME MISMATCH: $f ($name != $dir)"; [ -n "$desc" ] || echo "MISSING DESCRIPTION: $f"; done`
- Use `/proposal-builder` with a real or fake lead and confirm it writes `proposals/YYYY-MM-DD-<client-slug>.md`.

Verification run this session:

- Skill directory parity: passed.
- Frontmatter first-line check: passed.
- `proposal-builder` mirror content: passed.
- Skill `name` matches directory and `description` present: passed.

## Issues / Risks

- Competitor pricing/services are public-source snapshots from 2026-06-03 and must be re-browsed before sending a live proposal with specific price claims.
- NexGen Studio final pricing is not documented yet. Proposal drafts should use option placeholders or ask Anson to confirm investment ranges.
- PDF export is not built yet.
- Gmail/CRM integrations are not wired. This skill drafts only and does not send anything.

## TODO / Next Session

- [ ] Run `/proposal-builder` against the next real NexGen Studio lead.
- [ ] Decide NexGen Studio default proposal pricing ranges for Website Refresh, Custom Business Website, and Website + Operations Workflow.
- [ ] Consider adding `/competitor-refresh` if competitor research becomes a weekly/monthly recurring task.
- [ ] Consider adding PDF export once the Markdown draft format feels right.

## Notes

- This directly supports Priority 2: build and grow NexGen Studio.
- Use source links in proposals when making competitor comparisons.
