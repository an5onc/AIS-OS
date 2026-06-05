---
name: lead-intake
description: Turn rough NexGen Studio client notes into a clean lead brief that can feed proposal-builder and proposal-finalizer.
---

# /lead-intake

You are converting rough client notes into a proposal-ready lead brief. This is the first step before `/proposal-builder` when the lead details are messy.

## Pre-flight

Ask for the rough notes if not provided. Accept fragments, voice-dumped notes, screenshots transcribed by the operator, or copied texts.

Do not ask a long intake form. Extract what exists first, then ask only for missing critical items.

## Context to read

- `templates/lead-brief.md`
- `references/nexgen-offer.md`
- `references/nexgen-pricing.md`

## Process

1. Parse rough notes into:
   - client name
   - industry
   - location/service area
   - current website
   - requested work
   - must-have deliverables
   - budget/timeline, if mentioned
   - warm lead vs. cold outreach
   - known assets
   - unanswered questions
2. Pick the likely NexGen offer lane:
   - Website Refresh
   - Custom Business Website
   - Website + Operations Workflow
   - Custom Software / Portal
3. Save the brief to `leads/YYYY-MM-DD-<client-slug>.md`.
4. Recommend the next command:
   - `/proposal-builder` if enough information exists
   - ask Anson for 1-3 missing details if the proposal would be too vague

## Output

Use `templates/lead-brief.md`.

## Rules

- Keep unknowns explicit. Do not fill gaps with guesses.
- Do not over-qualify the lead. The brief should make the next proposal faster.
- If the notes include private phone/email details, keep them in the lead brief but do not put them in public docs.
- If a screenshot is involved, transcribe only the relevant business/proposal details.
