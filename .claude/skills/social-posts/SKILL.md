---
name: social-posts
description: Daily Facebook post generator + review/publish loop for KieferBuilt and InterlockGo. The engine lives in social/engine/ (generate -> review dashboard -> publish to Facebook). Use when the user says "daily posts", "social posts", "make today's posts", "generate posts", or names a brand and a date.
---

# Daily social post engine

The daily driver is a small Node app in `social/engine/` modeled on Anson's working
`interlockgo-social` app, generalized to both brands. The brand "brain" is the Markdown in
`context/brands/<brand>/` — edit those files to change voice, pillars, or image rules; no code change.

## The loop
```
generate.js  -> for each brand, picks the next content pillar and writes a Facebook caption via the
                `claude` CLI. KieferBuilt attaches a real photo URL (from image-strategy.md);
                InterlockGo is text-only. Saves drafts/<brand>-<date>-facebook.json (status: pending).
review.js    -> http://localhost:4600 dashboard: edit, Approve & Post, Reject, or Delete (phone-friendly).
publish.js   -> on approve, posts to that brand's Facebook Page via Graph API (photo-by-URL or text).
```
Scheduling: `install-launchd.sh` runs generate at 8 AM daily and keeps the dashboard alive.
Credentials: one Facebook Page token per brand in `social/engine/secrets.env` (see `setup-meta.md`).

## To generate/run on demand
- `cd social/engine && node generate.js` (today, both brands) — also `--brand=kiefer-built`, a date, or `--force`.
- `node review.js` then open the dashboard to review/approve.
- Never auto-publish from this skill. Approval + posting happen through the dashboard or `publish.js`.

## Hard rules (still apply)
- Two separate voices; never mix KieferBuilt and InterlockGo.
- KieferBuilt: real photos only, never AI homes. InterlockGo: zero judgment, no legal promises, no DUI jokes.
- Do not invent specific projects, prices, customers, or awards.

## Status
- Facebook: live for both brands.
- Instagram: not wired yet — needs an IG Business account per Page + an image-hosting pipeline (next phase).

## Older flow (superseded)
The earlier static-Markdown approach (`social/_templates/`, `social/<date>/posts.md`, `social/_inbox/`)
is kept for reference and manual notes, but the engine above is now the daily driver.
