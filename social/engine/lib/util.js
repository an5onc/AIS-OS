import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// engine/lib/util.js -> engine root is two dirs up from this file.
export const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
// Repo root is two levels above engine (social/engine -> repo root).
export const REPO_ROOT = path.resolve(ROOT, "..", "..");
export const BRANDS_DIR = path.join(REPO_ROOT, "context", "brands");

// Brand registry. `contextDir` matches the folder under context/brands/.
// `secret` is the suffix used in secrets.env keys (FB_PAGE_ACCESS_TOKEN_<secret>).
// `images: true` means the brand should attach a real photo URL to Facebook posts.
export const BRANDS = [
  {
    key: "kiefer-built",
    name: "KieferBuilt",
    contextDir: "kiefer-built",
    secret: "KIEFER",
    images: true,
  },
  {
    key: "interlockgo",
    name: "InterlockGo",
    contextDir: "interlockgo",
    secret: "INTERLOCKGO",
    images: false,
  },
];

export function getBrand(key) {
  const b = BRANDS.find((x) => x.key === key || x.name.toLowerCase() === String(key).toLowerCase());
  if (!b) throw new Error(`Unknown brand "${key}". Known: ${BRANDS.map((x) => x.key).join(", ")}`);
  return b;
}

// Minimal .env loader (no dependency). Reads KEY=VALUE lines from secrets.env.
export function loadSecrets() {
  const file = path.join(ROOT, "secrets.env");
  const env = {};
  if (fs.existsSync(file)) {
    for (const line of fs.readFileSync(file, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
    }
  }
  return { ...env, ...process.env }; // real env vars win
}

// Returns { token, pageId } for a brand, or throws a clear error if missing.
export function brandSecrets(brand) {
  const env = loadSecrets();
  const token = env[`FB_PAGE_ACCESS_TOKEN_${brand.secret}`];
  const pageId = env[`FB_PAGE_ID_${brand.secret}`];
  if (!token || !pageId) {
    throw new Error(
      `Missing FB_PAGE_ACCESS_TOKEN_${brand.secret} or FB_PAGE_ID_${brand.secret} in secrets.env (see setup-meta.md).`
    );
  }
  return { token, pageId };
}

export function todayStamp(d = new Date()) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

// ---- Drafts -------------------------------------------------------------
// Drafts are stored one JSON file per brand+date+platform:
//   drafts/<brand>-<YYYY-MM-DD>-<platform>.json
export function draftsDir() {
  return path.join(ROOT, "drafts");
}

export function draftId(brandKey, stamp, platform = "facebook") {
  return `${brandKey}-${stamp}-${platform}`;
}

export function draftPath(id) {
  return path.join(draftsDir(), `${id}.json`);
}

export function readDraft(id) {
  const p = draftPath(id);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export function writeDraft(id, draft) {
  fs.mkdirSync(draftsDir(), { recursive: true });
  fs.writeFileSync(draftPath(id), JSON.stringify(draft, null, 2));
}

// All drafts as objects, newest first (by date, then brand).
export function listDrafts() {
  const dir = draftsDir();
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort((a, b) => (b.date || "").localeCompare(a.date || "") || (a.brand || "").localeCompare(b.brand || ""));
}

// Recent drafts for one brand, newest first.
export function brandDrafts(brandKey) {
  return listDrafts().filter((d) => d.brand === brandKey);
}

// ---- Brand context (the Markdown "brain") -------------------------------
function readContextFile(brand, name) {
  const p = path.join(BRANDS_DIR, brand.contextDir, name);
  if (!fs.existsSync(p)) throw new Error(`Missing brand context file: ${p}`);
  return fs.readFileSync(p, "utf8");
}

// Parse numbered pillars from content-pillars.md.
// Matches lines like: "1. **Title** — hint text"
export function parsePillars(md) {
  const pillars = [];
  for (const line of md.split("\n")) {
    const m = line.match(/^\s*(\d+)\.\s+\*\*(.+?)\*\*\s*(?:[—:-]\s*(.*))?$/);
    if (m) {
      pillars.push({ index: Number(m[1]), title: m[2].trim(), hint: (m[3] || "").trim() });
    }
  }
  return pillars;
}

// Parse real photo URLs from image-strategy.md (used for KieferBuilt).
export function parseImageUrls(md) {
  const urls = md.match(/https?:\/\/\S+\.(?:jpg|jpeg|png|webp)/gi) || [];
  // de-dupe, preserve order
  return [...new Set(urls)];
}

export function readBrandContext(brandKey) {
  const brand = getBrand(brandKey);
  const brandMd = readContextFile(brand, "brand.md");
  const voiceMd = readContextFile(brand, "voice.md");
  const pillarsMd = readContextFile(brand, "content-pillars.md");
  let imageUrls = [];
  try {
    imageUrls = parseImageUrls(readContextFile(brand, "image-strategy.md"));
  } catch {
    imageUrls = [];
  }
  return { brand, brandMd, voiceMd, pillars: parsePillars(pillarsMd), imageUrls };
}

// ---- Logging ------------------------------------------------------------
export function log(msg) {
  const dir = path.join(ROOT, "logs");
  fs.mkdirSync(dir, { recursive: true });
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  fs.appendFileSync(path.join(dir, "agent.log"), line);
  process.stdout.write(line);
}
