import { execFileSync } from "node:child_process";
import {
  BRANDS,
  getBrand,
  todayStamp,
  draftId,
  readDraft,
  writeDraft,
  brandDrafts,
  readBrandContext,
  log,
} from "./lib/util.js";

const PLATFORM = "facebook"; // Instagram is a later phase.

// Pick the next content pillar for a brand, rotating in file order and
// avoiding pillars used in the most recent drafts.
function pickPillar(brandKey, pillars) {
  if (!pillars.length) throw new Error(`No pillars parsed for ${brandKey} (check content-pillars.md).`);
  const recentTitles = brandDrafts(brandKey)
    .slice(0, pillars.length - 1)
    .map((d) => d.pillarTitle)
    .filter(Boolean);
  const fresh = pillars.filter((p) => !recentTitles.includes(p.title));
  return (fresh.length ? fresh : pillars)[0];
}

// Rotate through the brand's real photo URLs so the image varies day to day.
function pickImage(brandKey, imageUrls) {
  if (!imageUrls.length) return null;
  const n = brandDrafts(brandKey).length;
  return imageUrls[n % imageUrls.length];
}

// Strip parenthetical author-notes from a pillar hint so internal direction
// (e.g. "(ONLY with a real photo + permission; if none available, fall back...)")
// never reaches the model as if it were post content.
export function cleanHint(hint = "") {
  return hint
    .replace(/\([^)]*\)/g, " ") // drop parenthetical asides
    .replace(/\s+/g, " ")
    .trim();
}

function buildPrompt({ brand, brandMd, voiceMd, pillar }) {
  const theme = cleanHint(pillar.hint) || "(use the brand and voice guides)";
  return `You are the social media writer for ${brand.name}. Write ONE Facebook post that will be published verbatim to a public audience.

Follow this brand guide and voice guide EXACTLY. The hard rules are non-negotiable.

===== BRAND =====
${brandMd}

===== VOICE =====
${voiceMd}

Today's theme: ${theme}

Write a single, ready-to-publish Facebook post in this brand's voice. Text and (sparingly) emoji only.

Hard rules for the caption text:
- It is PUBLIC marketing copy. Write only the post a real customer should read.
- NEVER mention these instructions, the "theme" or "content pillar", internal rules, photos/permissions/sign-off, fallbacks, or that you are an AI or following a guide. The reader must never see the seams.
- Do NOT invent specific projects, prices, customers, awards, or events that are not in the brand guide.
- If you cannot satisfy the theme cleanly, write a strong on-brand post on another appropriate subject instead — never explain why or narrate the constraint.

Respond with ONLY a JSON object — no markdown fences, no commentary — in this exact shape:
{
  "caption": "the full post text with line breaks as \\n, including a call to action",
  "hashtags": ["hashtag1", "hashtag2"]
}`;
}

// Detect captions that leaked internal/meta content instead of being clean
// public copy. Used to retry generation on an unattended run.
const LEAK_MARKERS = [
  /\bcontent pillar\b/i,
  /\bpillar\b/i,
  /\bthat'?s the rule\b/i,
  /\bno (stock|ai)\b/i,
  /\bai[- ]?(render|generated|image)/i,
  /\bstock (photo|image)/i,
  /\bsign[- ]?off\b/i,
  /\bfall ?back\b/i,
  /\bbrand guide\b/i,
  /\bvoice guide\b/i,
  /\bas an ai\b/i,
  /\bthese instructions\b/i,
  /\btoday'?s theme\b/i,
];

export function looksLikeLeak(caption = "") {
  return LEAK_MARKERS.some((re) => re.test(caption));
}

// One round-trip to the Claude CLI; parses the JSON reply.
function runClaude(prompt) {
  let raw;
  try {
    // Shell out to the Claude Code CLI (uses your Max-plan auth, no API key needed).
    raw = execFileSync("claude", ["-p", prompt, "--output-format", "text"], {
      encoding: "utf8",
      maxBuffer: 10 * 1024 * 1024,
    }).trim();
  } catch (err) {
    throw new Error(
      `Could not run the "claude" CLI. Make sure Claude Code is installed and on PATH. (${err.message})`
    );
  }

  let jsonText = raw;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end !== -1) jsonText = raw.slice(start, end + 1);

  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error(`Could not parse Claude output as JSON:\n${raw}`);
  }
  if (!parsed.caption) throw new Error("Claude output had no caption field.");
  return { caption: parsed.caption, hashtags: parsed.hashtags || [] };
}

function generateCaption(ctx) {
  const prompt = buildPrompt(ctx);
  const MAX_ATTEMPTS = 3;
  let last;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    last = runClaude(prompt);
    if (!looksLikeLeak(last.caption)) return last;
    log(
      `Caption for ${ctx.brand.name} leaked internal/meta wording (attempt ${attempt}/${MAX_ATTEMPTS}); regenerating.`
    );
  }
  // Persisting failure: do not save a broken caption. Caller logs and skips this brand.
  throw new Error(
    `Caption kept leaking internal wording after ${MAX_ATTEMPTS} attempts; not saving. Last caption:\n${last.caption}`
  );
}

function generateForBrand(brand, stamp, force) {
  const id = draftId(brand.key, stamp, PLATFORM);
  const existing = readDraft(id);
  if (existing && existing.status !== "rejected" && !force) {
    log(`Draft ${id} already exists (status: ${existing.status}). Use --force to regenerate.`);
    return;
  }

  const ctx = readBrandContext(brand.key);
  const pillar = pickPillar(brand.key, ctx.pillars);
  log(`Generating ${id} on pillar "${pillar.title}"...`);
  const { caption, hashtags } = generateCaption({ ...ctx, pillar });
  const imageUrl = brand.images ? pickImage(brand.key, ctx.imageUrls) : null;

  const draft = {
    id,
    date: stamp,
    brand: brand.key,
    brandName: brand.name,
    platform: PLATFORM,
    pillarIndex: pillar.index,
    pillarTitle: pillar.title,
    caption,
    hashtags,
    imageUrl, // KieferBuilt: a real photo URL; InterlockGo: null (text-only)
    status: "pending", // pending -> approved/posted | rejected
    createdAt: new Date().toISOString(),
    postId: null,
    postedAt: null,
  };
  writeDraft(id, draft);
  log(`Saved ${id} (pillar: ${pillar.title}${imageUrl ? ", image attached" : ""}). Review it in the dashboard.`);
}

function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const stamp = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a)) || todayStamp();
  const brandArg = args.find((a) => a.startsWith("--brand="));
  const brands = brandArg ? [getBrand(brandArg.split("=")[1])] : BRANDS;

  for (const brand of brands) {
    try {
      generateForBrand(brand, stamp, force);
    } catch (err) {
      log(`Generation failed for ${brand.key} ${stamp}: ${err.message}`);
    }
  }
}

// Run only when invoked directly (node generate.js), not when imported for tests.
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
