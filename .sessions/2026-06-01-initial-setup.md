# Session: 2026-06-01 — Initial setup, onboarding, and handoff system

## Status: IN PROGRESS

## Context / Starting Point

- Operator (Anson Cordeiro) cloned a Nate-Herk-style AIOS kit. Repo had only `AGENTS.md` (persona scaffold with `{{placeholders}}`), an empty `README.md`, placeholder `context/` and `references/voice.md`, and `.sessions/` from the original-clone session note.
- Most kit-referenced files were missing: `aios-intake.md`, `connections.md`, `decisions/log.md`, `EXPANSIONS.md`, `archives/`, `.claude/skills/`, `references/3ms-framework.md`.
- Operator confirmed scope: software-engineering focus, exploratory ambition (could become productized), keep the 3Ms / Four-Cs editorial layer permanently.

## Goals

- [x] Phase 1: fix the kit's scaffold so its own skills can run.
- [x] Option 1: fill `aios-intake.md` from intake + resume, then run `/onboard` to personalize files.
- [x] Option 2: build Phase 2 code skills (`/review-diff`, `/pr-desc`, `/commit-msg`, `/scaffold-next`).
- [x] Final cleanup: rebuild `AGENTS.md` as a project handoff, separate persona into `CLAUDE.md`, add a session template, run verification.

## Decisions

- Decision: Keep the 3Ms framework and Four-Cs audit layer permanently.
  - Rationale: Operator explicitly chose to keep them.
  - Alternatives considered: Strip the trademarked layer for a neutral structure (rejected).
  - Reversibility: easy.

- Decision: Wrote `references/3ms-framework.md` as a neutral interpretation with Nate Herk attribution. Wrote the Four-Cs as Context / Connections / Customization / Cadence in the `/audit` skill.
  - Rationale: Didn't want to fabricate Nate Herk's exact phrasing. Files are functional, clearly marked for verification against source content.
  - Alternatives considered: Leave the file empty (rejected — blocks `/level-up` and `/audit` machinery).
  - Reversibility: easy (swap in canonical content later).

- Decision: Mirror persona and skills across both Claude Code (`CLAUDE.md`, `.claude/skills/`) and Codex (`AGENTS.md`, `.agents/skills/`).
  - Rationale: Operator uses both tools. Duplicates are friendlier to Git than symlinks.
  - Alternatives considered: Symlinks, single-tool support.
  - Reversibility: easy.

- Decision: Renamed custom `/review` skill to `/review-diff` to avoid collision with Claude Code's built-in `/review` (PR review) and `/code-review` (generic diff).
  - Rationale: Built-in shadowed the custom skill in the registration list.
  - Alternatives considered: Removing the custom skill (rejected — it's stack-specific).
  - Reversibility: easy.

- Decision: Treat "scaffolding new Next.js apps from scratch" as Phase 2's primary target. Built `/scaffold-next` this session.
  - Rationale: Operator named it explicitly as top weekly pain. Frequency × pain × draft-is-good-enough × reversible = fits 3Ms Method filter.
  - Alternatives considered: Voicemail/SMS triage first (rejected — requires OpenPhone MCP which is Tier 4 work, not a skill).
  - Reversibility: easy.

- Decision: Split `AGENTS.md` (project handoff) from `CLAUDE.md` (operator persona). Previously the two were content-identical mirrors.
  - Rationale: Operator requested a clean agent-to-agent handoff system. Project handoff and operator persona are conceptually different — mixing them dilutes both. Codex still reads `AGENTS.md` first and finds an explicit pointer to `CLAUDE.md` for persona work.
  - Alternatives considered: Keep both files as mirrors and put project info in a separate `PROJECT.md` (rejected — convention is `AGENTS.md` at root for project handoff). Move persona to `PERSONA.md` (rejected — `CLAUDE.md` already exists and is the Claude Code convention).
  - Reversibility: medium (would require re-merging if reverted).

## Work Completed

- [x] Phase 1 scaffold: created `aios-intake.md`, `connections.md`, `decisions/log.md`, `EXPANSIONS.md`, `archives/.gitkeep`, `references/3ms-framework.md`, `.claude/skills/{onboard,audit,level-up}/SKILL.md`, `.agents/skills/{onboard,audit,level-up}/SKILL.md`, `CLAUDE.md` (mirror of `AGENTS.md`).
- [x] Phase 2 skills (built and mirrored): `.claude/skills/{review-diff,pr-desc,commit-msg,scaffold-next}/SKILL.md` + Codex mirrors.
- [x] `/onboard` executed: populated `context/about-me.md`, `context/about-business.md`, `context/priorities.md`, `references/voice.md`, `connections.md`, knowledge-base + connections sections in `AGENTS.md` and `CLAUDE.md`, plus two new `decisions/log.md` entries.
- [x] Voice samples Q2 entered by operator. Q1 covered by resume. Q3 + Q7 covered by operator messages. Q4/Q5/Q6 left as inferred-pending-confirmation, flagged in `connections.md` and `aios-intake.md`.
- [x] EXPANSIONS.md updated: Tier 2 skill rows marked `[x]`; added voicemail→SMS triage as a Tier 4 entry; added Tier 5 daily voicemail sweep.
- [x] `AGENTS.md` rewritten as project handoff (separated from persona).
- [x] `CLAUDE.md` retained as full AIOS operator persona.
- [x] `.sessions/TEMPLATE.md` created.
- [x] This session file updated to reflect end-state.
- [x] `.sessions/SESSION_INDEX.md` updated.
- [x] Verification run (see "How to Run / Verify" below).

## Files Changed

### New
- `aios-intake.md`
- `connections.md`
- `decisions/log.md` (with `decisions/` folder)
- `EXPANSIONS.md`
- `archives/.gitkeep`
- `references/3ms-framework.md`
- `.claude/skills/onboard/SKILL.md`
- `.claude/skills/audit/SKILL.md`
- `.claude/skills/level-up/SKILL.md`
- `.claude/skills/review-diff/SKILL.md`
- `.claude/skills/pr-desc/SKILL.md`
- `.claude/skills/commit-msg/SKILL.md`
- `.claude/skills/scaffold-next/SKILL.md`
- `.agents/skills/onboard/SKILL.md`
- `.agents/skills/audit/SKILL.md`
- `.agents/skills/level-up/SKILL.md`
- `.agents/skills/review-diff/SKILL.md`
- `.agents/skills/pr-desc/SKILL.md`
- `.agents/skills/commit-msg/SKILL.md`
- `.agents/skills/scaffold-next/SKILL.md`
- `CLAUDE.md`
- `.sessions/TEMPLATE.md`

### Modified
- `AGENTS.md` — rewritten as project handoff (was Codex persona mirror).
- `context/about-me.md` — populated from intake + resume.
- `context/about-business.md` — populated; covers both NexGen Studio and InterlockGo NOCO.
- `context/priorities.md` — populated from Q3.
- `references/voice.md` — populated with operator's two voice samples + register notes.
- `.sessions/SESSION_INDEX.md` — newest-first, points to this file + TEMPLATE.
- `.sessions/2026-06-01-initial-setup.md` (this file) — final state.

### Deleted
- None.

## How to Run / Verify

This is a Markdown-only repo. There is no build or test suite. The verification surface is:

### Clean working tree

```sh
git status --short
```

Expected: a list of new/modified files (working tree is intentionally dirty until the operator commits).

### File inventory

```sh
find . -type f -not -path './.git/*' | sort
```

Expected (28 files at session end):

- 7 new files at repo root: `AGENTS.md`, `CLAUDE.md`, `EXPANSIONS.md`, `README.md`, `aios-intake.md`, `connections.md`
- 7 skills × 2 mirrors = 14 SKILL.md files under `.claude/skills/` and `.agents/skills/`
- `.claude/settings.local.json` (Claude Code permission allowlist, project-local)
- 3 files in `context/`
- 1 file in `decisions/` (`log.md`)
- 2 files in `references/`
- 3 files in `.sessions/` (SESSION_INDEX, TEMPLATE, this file)
- `archives/.gitkeep`

### Skill YAML frontmatter check

```sh
for f in .claude/skills/*/SKILL.md .agents/skills/*/SKILL.md; do
  head -1 "$f" | grep -q '^---$' || echo "MISSING FRONTMATTER: $f"
done
```

Expected: empty output.

### Skill parity between Claude Code and Codex

```sh
diff <(ls .claude/skills) <(ls .agents/skills)
```

Expected: empty output.

### Cross-reference sanity (files mentioned in handoff actually exist)

Verified manually during this session. No broken links in `AGENTS.md` or `CLAUDE.md`.

## Issues / Risks

- **3Ms framework write-up is a neutral interpretation**, not Nate Herk's canonical phrasing. Flagged inside [references/3ms-framework.md](../references/3ms-framework.md). Verify against source content when operator has access.
- **Four-Cs rubric (Context / Connections / Customization / Cadence)** is also a working interpretation. Same caveat, flagged in [.claude/skills/audit/SKILL.md](../.claude/skills/audit/SKILL.md).
- **`aios-intake.md` Q4, Q5, Q6** still have inferred-pending-confirmation markers. Operator should confirm or correct revenue metrics, comms channels beyond Gmail/OpenPhone, and IDE / task tracker / notes-app preferences.
- **`README.md` is effectively empty** (`# AIS-OS` only). Not stale, just not yet written. Listed under "Stale items for review" below.
- **`.claude/settings.local.json` contains stale permission allow-list entries** that reference the pre-rename `.claude/skills/review/SKILL.md` and `.agents/skills/review/SKILL.md` paths (those folders are now `review-diff`). The permissions are harmless when stale (they just won't match), but worth cleaning up. Listed under "Stale items for review."
- **No actual integration is live yet.** Every "connected" tool in [connections.md](../connections.md) means "operator can reach it manually"; no MCP servers are wired. Don't claim the AIOS can do something an integration is required for until the integration ships.
- **All work is uncommitted.** Working tree is dirty. Operator did not authorize a commit this session.

## Blocked checks

Nothing is blocked. There is no test/build/lint suite to run. The verification commands above are the full surface.

If/when a skill becomes more than Markdown (e.g., a Node script invoked by a skill, or a hook with executable code), that scaffold will need its own verification — `package.json`, lint config, etc. None exists yet.

## TODO / Next Session

- [ ] Operator confirms or fills `aios-intake.md` Q4, Q5, Q6.
- [ ] Operator decides whether to commit this scaffold + onboarding state.
- [ ] Operator verifies the 3Ms framework + Four-Cs rubric against Nate Herk's canonical content.
- [ ] Decide Phase 3 direction: hooks (`PostToolUse` typecheck, `PreToolUse` destructive-Bash guard, `Stop` auto-log decisions) vs. Phase 4 MCP integrations (Gmail, GitHub, OpenPhone voicemail→SMS).
- [ ] Try `/scaffold-next` on a throwaway directory before using it for a real NexGen Studio client engagement.
- [ ] Decide whether to populate `README.md` (currently 9 bytes) — it could either describe the repo for public consumption or be deliberately left minimal.
- [ ] Clean stale permission entries in `.claude/settings.local.json` (post-rename).

## Notes

- Operator runs both NexGen Studio (digital studio for small businesses) and InterlockGo NOCO (ignition-interlock service) simultaneously. Bias every suggestion toward automation + leverage, not extra manual time.
- Voicemail-to-SMS triage is operator's #2 weekly drag and a strong Tier 4 candidate once OpenPhone MCP is built.
- Parent `/dev/CLAUDE.md` governs session save/close semantics. "save session" overwrites this file with current state. "let's close today" finalizes it (removes `## Status: IN PROGRESS` line).
