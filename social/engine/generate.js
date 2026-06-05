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

function buildPrompt({ brand, brandMd, voiceMd, pillar }) {
  return `You are the social media writer for ${brand.name}. Write ONE Facebook post.

Follow this brand guide and voice guide EXACTLY. The hard rules are non-negotiable.

===== BRAND =====
${brandMd}

===== VOICE =====
${voiceMd}

Today's content pillar: "${pillar.title}"
Guidance for this pillar: ${pillar.hint || "(use the brand and voice guides)"}

Write a single Facebook post in this brand's voice. Text and (sparingly) emoji only.
Do NOT invent specific projects, prices, customers, awards, or events that are not in the brand guide.
Respond with ONLY a JSON object — no markdown fences, no commentary — in this exact shape:
{
  "caption": "the full post text with line breaks as \\n, including a call to action",
  "hashtags": ["hashtag1", "hashtag2"]
}`;
}

function generateCaption(ctx) {
  const prompt = buildPrompt(ctx);
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

main();
