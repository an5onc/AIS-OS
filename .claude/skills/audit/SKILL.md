---
name: audit
description: Four-Cs gap report. Reads the AIOS state, scores each connection and skill on four dimensions, and outputs a ranked list of what to fix. Run on Day 7 and then weekly.
---

# /audit

You are producing the Four-Cs gap report for this AIOS. Output is a markdown report the operator scans in under two minutes.

> **Note on the rubric:** the Four-Cs below are this scaffold's working interpretation of Nate Herk's framework. If the operator has the canonical definition, they should replace the rubric in this file. Until then, audit against the four dimensions documented here so scores remain comparable week over week.

## Four-Cs rubric

### 1. Context
Does the AIOS know enough about the operator and their work to give grounded answers?

- `context/about-me.md`, `about-business.md`, `priorities.md`, `references/voice.md` — are they filled? Stale? Contradicting recent decisions in `decisions/log.md`?
- 1 = empty placeholders. 5 = recently updated, specific, voice-matched.

### 2. Connections
Are the tools the operator actually uses reachable by the AIOS?

- Read `connections.md`. Count entries by status (`aware`, `partial`, `connected`, `archived`).
- 1 = mostly `aware` (the AIOS knows about tools it cannot use). 5 = the operator's core daily tools are `connected` and verified within the last 30 days.

### 3. Customization
Has the operator built skills/hooks tailored to *their* work, or is this still a stock kit?

- Count files under `.claude/skills/` and `.agents/skills/`. Note which are stock (`onboard`, `audit`, `level-up`) vs. operator-authored.
- Check `settings.json` (or `.claude/settings.json`) for hooks.
- 1 = stock kit only. 5 = the operator has shipped at least one custom skill and one hook in the last 30 days.

### 4. Cadence
Are the rituals running, or is the kit drifting?

- Check `.sessions/SESSION_INDEX.md` — how recent is the latest entry?
- Check `decisions/log.md` — is there at least one entry per week the operator has been active?
- Has `/audit` itself been run on schedule? Has `/level-up` produced an automation in the last 30 days?
- 1 = silent for weeks. 5 = weekly cadence holding, decisions logged, automations shipping.

## Run-book

1. Read all four target areas. Don't skim — open the files.
2. Score each C on a 1-5 scale. Write one sentence of evidence per score.
3. Compute a Four-Cs total out of 20. Track it over time (append to `.sessions/AUDIT_HISTORY.md`, creating that file if it doesn't exist; one line per audit: `YYYY-MM-DD: Context X / Connections X / Customization X / Cadence X / Total XX / 20`).
4. Identify the lowest-scoring C. Propose one concrete action that would move it up at least one point.
5. Surface the top 3 stalest items across all Cs — files not touched in 30+ days, tools that are still `aware` after a month, skills mentioned in `EXPANSIONS.md` but never built.

## Output format

```
# AIOS Audit — YYYY-MM-DD

## Score: XX / 20
- Context: X — {{one-sentence evidence}}
- Connections: X — {{one-sentence evidence}}
- Customization: X — {{one-sentence evidence}}
- Cadence: X — {{one-sentence evidence}}

## Trend
{{Compare to last audit if AUDIT_HISTORY.md exists. Up / down / flat per C.}}

## Top fix this week
{{The single action with the highest score-leverage. Specific. Doable in one session.}}

## Stale items (3)
1. {{file or connection}} — {{why it's stale, how to refresh}}
2. ...
3. ...

## Notes
{{Anything the operator should know. Optional.}}
```

## Rules

- Be honest. Inflated scores defeat the point.
- Never propose more than one "top fix" — focus is the feature.
- Never edit `connections.md`, `context/*`, or `decisions/log.md` during audit. Read-only.
- If `AUDIT_HISTORY.md` doesn't exist, create it with this audit as the first line.
