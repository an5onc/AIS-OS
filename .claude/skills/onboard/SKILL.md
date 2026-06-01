---
name: onboard
description: Run or re-run intake. Reads aios-intake.md Q1-Q7 and rewrites the persona, context, voice, and connection stubs from the answers. Use on Day 1 or whenever the intake file is edited.
---

# /onboard

You are running the intake-to-personalization pipeline. Your job is to convert the operator's raw answers in `aios-intake.md` into populated files across the AIOS.

## Pre-flight

1. Read `aios-intake.md`. If any of Q1-Q7 still say "Pending answer" or are obviously empty, stop and tell the operator which questions are unfilled. Do not proceed with placeholders.
2. Read the current state of every file you're about to rewrite — at minimum: `AGENTS.md`, `CLAUDE.md`, `context/about-me.md`, `context/about-business.md`, `context/priorities.md`, `references/voice.md`, `connections.md`.
3. Read `references/3ms-framework.md` once to ground your tone.

## What to write

### `context/about-me.md`
From Q1 + Q7. Operator identity, role, what they actually do day-to-day, and the top weekly drag (Q7) called out plainly.

### `context/about-business.md`
From Q1 + Q4. The offer, ideal customer, revenue model, and where success is measured. If the operator isn't running a business, mark this file as "n/a — IC operator" and skip the offer/customer sections.

### `context/priorities.md`
From Q3. Two or three priorities, each with a one-line "why this matters" and a deadline if given.

### `references/voice.md`
From Q2. Paste each writing sample verbatim under its own heading. Then add a short "Voice notes" section: sentence length, formality, em-dash use, bullets-vs-paragraphs, signature phrases. Be specific — these notes are how future drafts get matched.

### `CLAUDE.md` (operator persona only)
- Replace `{{Your Name}}` everywhere with the operator's name from Q1.
- Replace `{{stated priority}}` with the top-ranked Q3 priority.
- Fill the **Knowledge Base** section with a 3-5 line summary built from Q1 + Q3 (what they do, who they serve, what matters this quarter).
- Fill the **Connections** section with one bullet per tool mentioned in Q5-Q7, each with current status (`aware`, `partial`, `connected`).

### `AGENTS.md` (project handoff — do NOT rewrite as persona)

`AGENTS.md` is the project handoff for agents working *on* this repo (stack, source-of-truth files, working rules, end-of-session protocol). It is **not** a mirror of `CLAUDE.md` anymore. Do not populate persona content here. If `AGENTS.md` needs updating because the project itself changed (new skills added, conventions shifted, files moved), update the relevant sections — but never the Knowledge Base / Connections style persona blocks (those don't exist in `AGENTS.md` and shouldn't be re-added).

### `connections.md`
For every tool mentioned in Q5-Q7, add an entry using the template at the top of that file. Default status is `aware` unless the operator said the tool is already wired in. Leave the `Reach`, `Last verified`, and `Notes` fields blank if the operator didn't volunteer them — don't fabricate.

### `decisions/log.md`
Append a new entry:

```
## YYYY-MM-DD — /onboard run

- Decision: Personalized the AIOS from aios-intake.md.
- Why: First /onboard run (or re-run after intake edits).
- Alternatives considered: n/a.
- Reversibility: easy. Prior versions are in git.
- Follow-up: Operator reviews populated files. Then schedule first /audit.
```

## Output

After writing, summarize back to the operator:

- One-sentence read of who they are based on Q1.
- The 2-3 priorities you locked into `context/priorities.md`.
- Number of tools added to `connections.md` and their statuses.
- The top weekly drag from Q7 and a one-line suggestion for which `/level-up` should target first.

## Rules

- Never invent answers. If the operator left something vague, write "needs clarification" and ask in the summary.
- Never overwrite content the operator clearly wrote themselves (look for distinct voice, dates, or specific claims). Merge instead.
- Always preserve any existing entries in `connections.md` and `decisions/log.md` — these are append-only by convention.
