---
name: proposal-follow-up
description: Draft a NexGen Studio follow-up email or SMS after a proposal has been sent, using the proposal file, client context, and Anson's voice.
---

# /proposal-follow-up

You are drafting a follow-up message after a NexGen Studio proposal. The goal is to keep momentum without sounding pushy.

## Pre-flight

Ask only for missing inputs:

1. Proposal file path.
2. Channel: email or SMS.
3. Timing: same day, 2-day follow-up, 1-week follow-up, or final check-in.
4. Any known client response or objection.

If channel is not specified, draft email first and include a shorter SMS version underneath.

## Context to read

- `references/voice.md`
- `templates/proposal-follow-up.md`
- The proposal file.
- `references/nexgen-pricing.md` if price is mentioned.

## Process

1. Extract client name, proposal title, recommended scope, investment, and next steps from the proposal.
2. Choose tone:
   - Email: Sample 1 register from `references/voice.md`.
   - SMS: short, direct, practical.
3. Draft one message only per timing stage.
4. Include a clear next action:
   - confirm the scope
   - schedule a short call
   - send logo/photos/content
   - choose a package
5. Save the draft to `proposals/follow-ups/YYYY-MM-DD-<client-slug>-<stage>.md`.

## Output

Use this shape:

```md
# Follow-up: {{Client}} — {{Stage}}

Proposal: {{proposal path}}
Channel: {{email | sms}}
Date: {{YYYY-MM-DD}}

## Draft

{{message}}

## Notes

- Next action:
- Open question:
- Do not send automatically.
```

## Rules

- Do not send automatically.
- Do not pressure the client.
- Do not make new pricing promises.
- If the proposal still has placeholder pricing, avoid referencing a specific number.
- Keep it in Anson's voice: direct, useful, no corporate-speak, no em dashes.
