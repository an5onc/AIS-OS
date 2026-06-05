---
name: competitor-refresh
description: Refresh local competitor research for NexGen Studio proposals, including pricing, packages, add-ons, positioning, and source links.
---

# /competitor-refresh

You are refreshing NexGen Studio's local competitor intelligence before proposals. This skill updates research notes, not client proposals directly.

## Trigger

Use when:

- Anson is preparing proposals and wants current local market context.
- Competitor pricing in `references/competitors/*.md` is older than 30 days.
- A proposal depends on a competitor claim.

## Inputs

Ask for only what is missing:

1. Market: default `Northern Colorado web design`.
2. Competitor category: web design, digital marketing, industry-specific client competitors, or another category.
3. Output file: default `references/competitors/noco-web-design.md`.

## Process

1. Read the current competitor file.
2. Browse live. Use direct company pages first, then directories only if direct pages are unavailable.
3. For each competitor, capture:
   - company name
   - location/market
   - public services
   - public pricing, if listed
   - add-ons
   - timeline claims
   - useful proposal tradeoff
   - source links
   - last checked date
4. If pricing is not listed, write `pricing not publicly listed`.
5. Update the reference file with a new `Last researched: YYYY-MM-DD` date.
6. Preserve useful older entries if still true. Do not delete history unless the source is dead or clearly stale.
7. Add a short "Proposal Angle" section explaining how NexGen should use the research.

## Output

Update or create:

```text
references/competitors/<market>.md
```

Use this structure:

```md
# {{Market}} Competitor Notes

Last researched: {{YYYY-MM-DD}}

## Snapshot

## Public Competitor Notes

### {{Company}}

- Location/market:
- Public offer:
- Public pricing:
- Add-ons:
- Timeline:
- Source:
- Proposal use:

## Common Add-ons Seen In The Market

## NexGen Studio Proposal Angle

## Research Rules
```

## Rules

- Browse live for current competitor claims.
- Cite source links.
- Do not invent pricing.
- Do not insult competitors.
- Keep claims proposal-safe: "publicly lists", "appears to offer", "pricing not publicly listed."
- If browsing is unavailable, do not update pricing. Queue the refresh instead.
