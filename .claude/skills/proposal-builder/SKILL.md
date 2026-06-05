---
name: proposal-builder
description: Generate a NexGen Studio website or software proposal from client inputs, offer notes, and current local competitor research. Use for digital outreach and client proposal drafts.
---

# /proposal-builder

You are drafting a professional NexGen Studio proposal for a prospective small-business client. The goal is to remove the repeated manual work: local research, competitor comparison, scope framing, and branded proposal writing.

Use `/lead-intake` first if the client details are messy or scattered. Use `/proposal-finalizer` after this skill when Anson wants a branded PDF.

## Pre-flight

Ask Anson for only the missing inputs from this list:

1. **Client business name**
2. **Client industry and location**
3. **What they asked for**: new website, redesign, SEO, booking/contact flow, client portal, internal tool, ecommerce, or unsure.
4. **Known constraints**: budget, timeline, must-have pages/features, existing website URL, and whether this is a warm lead or cold outreach.

If he gives only a business name and what they need, proceed with reasonable assumptions and mark unknowns in the draft.

## Context to read

Read these files before drafting:

- `context/about-business.md`
- `context/priorities.md`
- `references/voice.md`
- `references/nexgen-offer.md`
- `references/nexgen-pricing.md`
- `references/competitors/noco-web-design.md`
- `templates/proposal.md`

If the request needs a specific client website audit or current competitor pricing, browse the web live and cite public sources. Pricing and competitor claims change. Do not rely only on memory or old notes.

## Process

1. Normalize the client inputs into a short client brief.
2. If the client has a website URL, review it and identify visible issues: mobile clarity, call-to-action, service pages, trust signals, forms, speed/UX concerns, and whether it looks template-based.
3. Check `references/competitors/noco-web-design.md` for the current Northern Colorado baseline.
4. If competitor details are older than 30 days or the proposal depends on pricing, browse live and update the comparison notes in the proposal draft, not necessarily the reference file.
5. Choose the best offer lane from `references/nexgen-offer.md`:
   - Website Refresh
   - Custom Business Website
   - Website + Operations Workflow
   - Custom Software / Portal
6. Draft a proposal using `templates/proposal.md`.
7. Include a "Local Market Context" section with careful, sourced claims.
8. Include a "Why NexGen Studio" section that contrasts NexGen against template/CMS shops without insulting competitors.
9. Save the draft to `proposals/YYYY-MM-DD-<client-slug>.md`.
10. Show Anson the draft and ask what to revise before finalizing.
11. If he approves the draft, recommend `/proposal-finalizer` to produce the branded PDF.

## Positioning rules

- NexGen Studio is not just another WordPress/template shop. The offer is custom software, websites, and internal tools for small businesses that have outgrown basic templates.
- Be fair about competitors. Say what they appear to offer publicly. Do not overclaim weaknesses.
- If a competitor does not publish pricing, write "pricing not publicly listed" instead of guessing.
- If a claim came from browsing, include a source link.
- Do not tell the client "competitors are worse." Frame the tradeoff: cheaper template/CMS options can work for basic needs; NexGen is stronger when the business needs custom workflows, integrations, dashboards, forms, documents, portals, or long-term technical ownership.
- Match `references/voice.md` Sample 1 register: professional, practical, direct, no corporate-speak.

## Output shape

Use this structure unless the client request clearly needs something else:

```md
# Proposal: {{Client}} Website / Digital System

Prepared by NexGen Studio
Date: {{YYYY-MM-DD}}

## Quick Summary

## What I Understand You Need

## Recommended Scope

## Deliverables

## Local Market Context

## Why NexGen Studio

## Timeline

## Investment Options

## What I Need From You

## Next Steps
```

## Verification

Before reporting done:

```sh
test -f proposals/YYYY-MM-DD-<client-slug>.md
grep -n "Prepared by NexGen Studio" proposals/YYYY-MM-DD-<client-slug>.md
grep -n "Local Market Context" proposals/YYYY-MM-DD-<client-slug>.md
```

If the proposal used live competitor research, confirm the draft includes source links.

## Rules

- Draft only. Never send the proposal or email automatically.
- Do not fabricate client facts, pricing, testimonials, competitor claims, or case-study metrics.
- If pricing is unknown, provide ranges or options labeled "placeholder for Anson to confirm."
- Keep proposals practical. The client should understand what they get, why it matters, what it costs, and what happens next.
- Do not generate the final PDF here. Hand off to `/proposal-finalizer`.
