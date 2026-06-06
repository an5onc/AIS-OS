# Meta setup — get a Page access token for each brand (one-time, ~20 min per Page)

This is the only part that can't be automated: it requires clicking inside Meta's dashboards while
logged into the Facebook account that manages the Page. Do it once per brand and you're set.

> This uses Meta's official Graph API. No login automation, no stored password. A Page access token
> is the supported, ToS-safe way for an app to post to a Page you own.

You have two Pages to connect:
- **KieferBuilt** → facebook.com/KieferBuiltContracting → secrets keys `*_KIEFER`
- **InterlockGo** → your existing Page → secrets keys `*_INTERLOCKGO`

> If you already minted an InterlockGo Page token in your old `interlockgo-social` app, you can skip
> the InterlockGo steps and just copy that token into `FB_PAGE_ACCESS_TOKEN_INTERLOCKGO` and the Page
> ID into `FB_PAGE_ID_INTERLOCKGO` in `secrets.env`.

## 1. Create a Meta developer app (once, reusable for both Pages)
1. Go to https://developers.facebook.com/ and log in.
2. Top right → **My Apps** → **Create App**.
3. Name it `AIS-OS Social`, add your email.
4. Choose **Create an app without a use case** → **Next** → create.

## 2. Get a short-lived Page token (repeat per Page)
1. Open the **Graph API Explorer**: https://developers.facebook.com/tools/explorer/
2. Set **Meta App** = your new app.
3. Click **Generate Access Token** → **Get Page Access Token**.
4. Select the brand's Page and grant: `pages_manage_posts`, `pages_read_engagement`, `pages_show_list`.
5. Copy the short-lived token shown.

## 3. Find the App Secret
- App dashboard → **Settings → Basic** → copy **App ID** and **App Secret**.

## 4. Run the helper (does the long-lived exchange for you)
```bash
node get-token.js
```
- Pick the brand.
- Paste App ID, App Secret, and the short-lived token.
- It exchanges for a long-lived (non-expiring) Page token and writes the right
  `FB_PAGE_ACCESS_TOKEN_<BRAND>` / `FB_PAGE_ID_<BRAND>` keys into `secrets.env`.

Repeat steps 2–4 for the second brand.

## 5. Test
1. `node generate.js` to create today's drafts.
2. `node review.js`, open http://localhost:4600, and click **Approve & Post** on one draft.
3. Check the brand's Facebook Page — delete the test post afterward if you like.

## Notes & gotchas
- While the app is in *Development* mode, posting to a Page **you admin** works fine. You do NOT
  need App Review to post to your own Page.
- Keep tokens secret. Anyone with a Page token can post as that Page. `secrets.env` is gitignored.
- If a token stops working (password change, revoked access), redo steps 2–4 for that brand.
- **Instagram** is not wired yet — it needs an IG Business account linked to each Page plus an image
  pipeline. That's the next phase.
