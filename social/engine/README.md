# AIS-OS Social Engine

Generates an on-brand **Facebook** post for each brand every morning, lets you review/edit/approve
from a small local web page (works from your phone too), and posts it to that brand's Page via
Meta's official Graph API.

Brands are driven by the Markdown brand context in `../../context/brands/<brand>/` — edit those files
to change voice, pillars, or image rules. No code change needed.

## How it works
```
8:00 AM launchd  ->  generate.js   for each brand: pick the next content pillar, write a caption
                                    via the `claude` CLI (your Max plan), save a draft JSON.
                                    KieferBuilt attaches a real photo URL; InterlockGo is text-only.
you              ->  review.js      localhost:4600 dashboard: edit, Approve & Post, Reject, Delete
on approve       ->  publish.js     posts to that brand's Facebook Page (photo-by-URL or text)
on delete        ->  delete.js      removes a published post from the Page (Graph API)
```
The only external credential is one Facebook Page token per brand. No separate Claude API key —
captions use the Claude Code CLI under your Max plan.

## One-time setup
1. Connect each brand's Facebook Page: follow [setup-meta.md](setup-meta.md) (or `node get-token.js`).
2. Install the schedule + review server:
   ```bash
   ./install-launchd.sh
   ```

## Daily use
- Each morning you get a notification and the dashboard opens. Review each brand's draft, tweak it,
  hit **Approve & Post** or **Reject**.
- Open the dashboard anytime at http://localhost:4600 — or from your phone on the same wifi at the
  LAN address printed when the server starts.

## Manual commands
```bash
node generate.js                       # today's drafts, all brands
node generate.js 2026-06-07            # a specific date
node generate.js --brand=kiefer-built  # just one brand
node generate.js --force               # regenerate today
node review.js                         # run the dashboard in the foreground
node publish.js kiefer-built-2026-06-07-facebook   # post a specific approved draft from the CLI
node delete.js  kiefer-built-2026-06-07-facebook   # delete that draft's published post from the Page
./install-launchd.sh uninstall         # remove the launchd agents
```

## Attaching a photo from your phone/computer
You can attach a **local image** (no public URL needed):
1. Drop the photo in `social/engine/images/` (e.g. `jobsite.jpg`).
2. In the dashboard, set the draft's **local file** field to that filename (it wins over an image URL).
3. Approve & Post — the engine uploads the file to the Page via multipart.

`images/` contents are gitignored. `imageUrl` still works for public URLs (KieferBuilt's hosted photos).

## Customizing
- **Voice, pillars, image rules:** edit `../../context/brands/<brand>/*.md`.
- **Add a brand:** add a folder under `context/brands/`, then add an entry to `BRANDS` in `lib/util.js`
  and the matching `*_<SECRET>` keys to `secrets.env`.
- **Post time:** change `Hour`/`Minute` in `install-launchd.sh`, then re-run it.

## Status
- Facebook: live (text + photo-by-URL).
- Instagram: not yet — needs an IG Business account per Page and an image-hosting pipeline.
