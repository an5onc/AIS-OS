---
name: social-posts
description: Generate one Facebook and one Instagram draft post per brand (KieferBuilt and InterlockGo) for a given day, formatted for human review and manual scheduling in Meta Business Suite. Use when the user says "daily posts", "social posts", "make today's posts", or names a brand and a date.
---

# Daily social post generator

## What this does
Produces 4 draft posts (KieferBuilt FB + IG, InterlockGo FB + IG) for one day into a dated review file. Does NOT publish anything.

## Steps (follow in order)

1. **Determine the date.** Default to today unless the user gives a date. Set `DATE = YYYY-MM-DD`.

2. **Check for input notes.** Look in `social/_inbox/` for files named `{DATE}-kiefer-built.md` and `{DATE}-interlockgo.md`. If present, their instructions OVERRIDE the pillar rotation for that brand.

3. **For EACH brand (kiefer-built, interlockgo):**
   a. Read `context/brands/<brand>/brand.md`, `voice.md`, `content-pillars.md`, `image-strategy.md`.
   b. Pick the day's pillar: if an input note specifies a topic, use it; otherwise advance the pillar rotation. To find the last pillar used, look at the most recent prior file in `social/` and pick the next pillar in the list (loop after the last). If no prior file exists, start at pillar 1.
   c. Write a **Facebook** caption following that brand's voice + platform notes (FB rules).
   d. Write an **Instagram** caption following that brand's voice + platform notes (IG rules).
   e. For each post, produce an **image plan** strictly per that brand's `image-strategy.md` (KieferBuilt = REAL PHOTO or NEEDS PHOTO, never AI homes; InterlockGo = REAL PHOTO / GENERATE / TEXT GRAPHIC).
   f. Choose platform-appropriate hashtags per voice.md.

4. **Write the output file.** Copy `social/_templates/daily-posts-template.md` to `social/{DATE}/posts.md` and fill in every `{{...}}` placeholder. Suggested times: KieferBuilt ~ weekday late morning (10:00) and early evening (17:30); InterlockGo ~ weekday morning (08:30) and midday (12:00). These are suggestions the human can change.

5. **Apply the golden rules** from the build prompt: no publishing, no invented facts, two separate voices, no shaming for InterlockGo, no AI homes for KieferBuilt.

6. **Report.** Tell the user the file path and a one-line summary of what each post covers. Remind them to review, approve, and paste into Meta Business Suite.

## Quality bar (match these examples)

**KieferBuilt — Instagram (craftsmanship pillar):**
> Twenty-five years in, and the part we still obsess over is the finish work — trim that lines up, tile that meets clean, details you'll run your hand across for the next thirty years. Custom homes and remodels across Northern Colorado.
> Planning a build? Link in bio. 📍 Windsor, CO
> Hashtags: #northerncolorado #customhomebuilder #windsorco #fortcollins #lovelandco #remodel #craftsmanship #coloradohomes
> Image plan: REAL PHOTO — https://www.builtbykiefer.com/images/project-3/kitchen-island-front.jpg (finish detail matches the caption)

**InterlockGo — Facebook (how-it-works pillar):**
> Got an interlock requirement and not sure where to start? Here's the short version: call us, we match you to the right device (Lifesafer or Guardian), install it the same day with clean wiring, and notarize your Colorado DMV affidavit before you leave — one trip. Straight answers, no judgment.
> Call 970-515-5740 · interlockgo.io
> Hashtags: #northerncolorado #greeleyco #evansco
> Image plan: GENERATE — clean, calm photo of a car dashboard/steering wheel in daylight, device discreetly present, professional, 1.91:1, no text; avoid any police/handcuffs/alcohol/shaming imagery.
