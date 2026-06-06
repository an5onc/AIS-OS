# Session: 2026-06-06 — Social engine: first real posts + scheduling

## Status: CLOSED

## Context / Starting Point

- Picked up from `2026-06-05-social-posts.md` (IN PROGRESS). The `social/engine/` daily
  Facebook engine (generate → review dashboard → publish) existed and generated drafts, but
  no Page tokens were wired, nothing had posted, and the 8 AM schedule was not installed.
- Goal for the session: get a real test post live for both brands, then turn on the daily schedule.
  Posting was gated on explicit operator approval through the dashboard at each step.

## Goals

- [x] Eyeball the two existing 2026-06-05 drafts.
- [x] Create `social/engine/secrets.env` (gitignored); map InterlockGo token from the old
      `interlockgo-social` app; set KieferBuilt token via `get-token.js`.
- [x] Post a real InterlockGo test post via the dashboard (operator-approved).
- [x] Connect KieferBuilt Page token and post a real KieferBuilt test post.
- [x] Install the 8 AM daily launchd schedule.
- [x] Harden the engine before unattended runs (prompt-leak fix, delete capability).

## Decisions

- Decision: Run the new engine's dashboard on **port 4600**, not 4500.
  - Rationale: The old `interlockgo-social` app already squats 4500 (launchd `com.interlockgo.review`).
  - Alternatives considered: kill the old app and reuse 4500.
  - Reversibility: easy (REVIEW_PORT in secrets.env).
- Decision: Keep posting via the Graph API (app-published), accept that posts won't appear in
  Meta Business Suite / "Manage posts", and add `delete.js` for removal instead of Business-Suite management.
  - Rationale: API posts are attributed to the Meta app ("Interlockgo Social") and are deliberately
    not surfaced in Meta's management UIs, though they are fully public/live. Verified via post
    `application`/`admin_creator` fields. Daily organic posting rarely needs boosting.
  - Alternatives considered: post manually so Meta owns the post (kills automation).
  - Reversibility: medium.
- Decision: Fix the "Project showcase" caption leak with prompt hardening + hint sanitization + a
  retry-on-leak guard that refuses to save a leaked caption.
  - Rationale: The pillar hint contained author-only instructions that the model narrated into the
    caption. Unattended 8 AM runs must never save/queue a broken caption.
  - Alternatives considered: drop the "Project showcase" pillar from rotation.
  - Reversibility: easy.

## Work Completed

- [x] Created `social/engine/secrets.env` (perms 600, gitignored). InterlockGo token/Page ID copied
      file-to-file from the old app (never printed to chat). KieferBuilt token via `get-token.js`
      (Page: Kiefer Built Contracting, 116789730866824). Validated both tokens read-only.
- [x] InterlockGo real post (2026-06-05) — operator approved in dashboard; verified live via Graph API.
- [x] KieferBuilt real post (2026-06-06) — operator approved; verified live + in the Page's
      published_posts. Diagnosed the "missing from admin views" confusion as expected app-post behavior.
- [x] Added `delete.js` + a "Delete from Facebook" dashboard button and `/delete` route. Operator
      tested it on the live InterlockGo 2026-06-06 post — confirmed deleted (Graph API "Object does not exist").
- [x] Fixed the prompt leak in `generate.js`: `cleanHint()` strips parenthetical author-notes;
      hardened the prompt (public-facing, never mention pillars/rules/AI); `looksLikeLeak()` +
      3-attempt retry that throws rather than saving a leaked caption. 6/6 unit tests; end-to-end
      verified on the actual "Project showcase" pillar → clean caption.
- [x] Installed launchd agents: `com.aios.social.daily` (8:00 AM, both brands) and
      `com.aios.social.review` (dashboard on 4600, RunAtLoad + KeepAlive).
- [x] Verified the REAL launchd daily job authenticates `claude` (Keychain creds work in the gui
      agent context) by kickstarting it and watching it regenerate a caption.
- [x] Fixed `daily.sh` double-logging and `install-launchd.sh` port message. Updated docs to 4600.
- [x] Rejected the stale KieferBuilt 2026-06-05 draft so it can't be accidentally posted.
- [x] Added local-image support: `imagePath` on a draft uploads a file from `social/engine/images/`
      via multipart (`resolveImagePath` in util, `postPhotoFromFile` in publish, `imagePath` input in
      the dashboard). Verified with a real unpublished upload+delete against InterlockGo (no feed post).
- [x] Reviewed pillar rotation: both brands parse 6 pillars and rotate avoiding recent repeats.
      Next 8 AM picks — KieferBuilt: "Project showcase" (now leak-safe); InterlockGo: "DMV / compliance help".
- [x] Committed the session's work (docs, session note, engine features).

## Files Changed

- `social/engine/delete.js` (new)
- `social/engine/generate.js` (modified — leak fix, exports, CLI guard, imagePath field)
- `social/engine/publish.js` (modified — local-file multipart upload path)
- `social/engine/lib/util.js` (modified — imagesDir/resolveImagePath helpers)
- `social/engine/images/.gitkeep` (new — drop local photos here; contents gitignored)
- `social/engine/.gitignore` (modified — ignore images/ contents)
- `social/engine/review.js` (modified — delete button + /delete route + deleted status + imagePath input)
- `social/engine/daily.sh` (modified — log redirect fix)
- `social/engine/install-launchd.sh` (modified — port message)
- `social/engine/README.md` (modified — 4600, delete docs)
- `social/engine/setup-meta.md` (modified — 4600)
- `.claude/skills/social-posts/SKILL.md` + `.agents/skills/social-posts/SKILL.md` (modified — 4600/Delete; mirror in sync)
- `social/engine/secrets.env` (new, gitignored — NOT committed)
- `social/engine/drafts/*.json`, `social/engine/logs/*` (gitignored runtime state)

## How to Run / Verify

- `git status --short`
- `for f in social/engine/*.js social/engine/lib/util.js; do node --check "$f"; done`
- `cmp -s .claude/skills/social-posts/SKILL.md .agents/skills/social-posts/SKILL.md` (parity)
- `launchctl list | grep com.aios.social` (both agents loaded)
- `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4600/` (dashboard 200)
- Leak guard unit test: `node --input-type=module -e "import {looksLikeLeak} from './social/engine/generate.js'..."`

## Issues / Risks

- App-published posts are invisible in Meta Business Suite / "Manage posts" and cannot be boosted
  from there. Management is via the engine dashboard + `delete.js`. (By design, not a bug.)
- The 8 AM job depends on the `claude` CLI staying logged in (Keychain). If `claude` is ever logged
  out, `generate.js` fails and `daily.sh` fires a "generation failed" notification. Verified working
  under launchd this session.
- Local images: posting a local file is NOT supported yet — `imageUrl` must be a public URL
  (publish.js uses Facebook photo-by-URL). Adding `imagePath` (multipart upload) is a queued option.
- secrets.env holds live Page tokens; gitignored, perms 600. Never commit.

## TODO / Next Session

- [ ] Watch the first unattended 8 AM run (next morning): confirm both drafts generate cleanly and
      the notification + dashboard auto-open fire. KieferBuilt lands on "Project showcase" (leak-guarded).
- [ ] If you want a real KieferBuilt project showcase, drop a permissioned photo in
      `social/engine/images/` and set it on the draft before approving.
- [ ] Instagram still intentionally not built (logged in EXPANSIONS.md).

## Notes

- Both brands are live end-to-end: generate → review dashboard (localhost:4600) → approve → publish,
  with delete as a safety valve. Nothing auto-publishes; operator approves each post.
- Old `com.interlockgo.*` launchd jobs (port 4500) are the separate legacy app — left untouched.
