---
name: level-up
description: Weekly 3Ms interview. Find one high-leverage automation, scope it tightly, and either ship it now or queue it as a concrete task. One per week. Run after /audit.
---

# /level-up

You are running the weekly leverage interview. The point is *one* shipped automation per week — not five planned ones.

Pull from `references/3ms-framework.md` for the lens. Walk the three Ms in order.

## Pre-flight

1. Read `context/priorities.md` to know what matters this quarter.
2. Read the most recent `/audit` output if available (latest line in `.sessions/AUDIT_HISTORY.md`).
3. Read `EXPANSIONS.md` — Tier 2 (skills) and Tier 3 (hooks) are usual hunting grounds.
4. Read the latest few session notes in `.sessions/` for context on what the operator has been doing.

## Phase M1 — Mindset (5 minutes)

Ask the operator:

- Where did you reach for the manual path this week when AI could have helped?
- Was there a moment you said "I'll just do it myself this once"? Did "this once" turn into three times?
- What's a belief about AI you held a month ago that you'd revise now?

The goal is to surface the Default Shift gap — places the mindset failed before the method or machine got a chance.

## Phase M2 — Method (10 minutes)

From the Mindset answers plus the operator's recent work, list candidate automations. For each:

- **Frequency:** rough estimate per week.
- **Pain:** 1-5 — how much it drains.
- **Determinism tolerance:** does this need a deterministic answer, or is a draft enough?
- **Reversibility:** if the AI does it wrong, what's the recovery cost?

Score = frequency × pain, filtered by "draft is good enough" and "reversible if wrong." The winner is the highest-score candidate that survives both filters.

Tell the operator the top three candidates with scores. Let them pick — they have context you don't.

## Phase M3 — Machine (15-30 minutes)

For the chosen automation, write a one-page implementation brief in this format:

```
# Level-Up: {{automation name}}

## Trigger
How the operator invokes it. Slash command? Hook on an event? Scheduled task?

## Inputs
What data does it need? From files, MCP, or the operator?

## Process
The steps the skill/hook will perform, in order. Keep it under 10 steps.

## Output
What artifact, message, or side effect does it produce?

## Files touched
List the files this will create or modify.

## Verification
How will the operator know it works? What's the smallest test?

## Stretch
Two-line note on how this could grow once the first version ships.
```

Then ask: **ship it now (this session) or queue it?**

- **Ship now:** implement directly. The operator stays in the loop and approves writes.
- **Queue it:** add a TODO entry to `EXPANSIONS.md` Tier 2 or 3, and create a new session-note TODO for next time.

## Logging

Append to `decisions/log.md`:

```
## YYYY-MM-DD — /level-up: {{automation name}}

- Decision: {{ship now | queue for {{when}}}}.
- Why: highest-score automation from this week's interview. Pain {{X}}, frequency {{Y}}.
- Alternatives considered: {{the other 2 candidates and why they lost}}.
- Reversibility: easy (skill files are markdown).
- Follow-up: {{verification step or queued task ref}}.
```

## Rules

- One automation per run. If the operator wants to ship two, queue the second for next week.
- Keep the interview tight. 30 minutes maximum total.
- Don't ship something you can't verify in the same session. If verification needs production data or third-party access, queue it.
- If the operator skips this week, that's information — note "skipped /level-up" in the next `/audit` Cadence score.
