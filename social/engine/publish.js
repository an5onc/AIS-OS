import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  getBrand,
  brandSecrets,
  readDraft,
  writeDraft,
  resolveImagePath,
  log,
} from "./lib/util.js";

const GRAPH = "https://graph.facebook.com/v21.0";

function fullText(draft) {
  const tags = (draft.hashtags || [])
    .map((h) => (h.startsWith("#") ? h : `#${h}`))
    .join(" ");
  return tags ? `${draft.caption}\n\n${tags}` : draft.caption;
}

// Post text to a Page feed. Returns the post id.
async function postText(brand, message) {
  const { token, pageId } = brandSecrets(brand);
  const res = await fetch(`${GRAPH}/${pageId}/feed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, access_token: token }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(`Facebook API error: ${JSON.stringify(data.error || data)}`);
  return data.id;
}

// Post a photo (by public URL) with a caption. Returns the post id.
async function postPhoto(brand, message, imageUrl) {
  const { token, pageId } = brandSecrets(brand);
  const res = await fetch(`${GRAPH}/${pageId}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: imageUrl, caption: message, access_token: token }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(`Facebook API error: ${JSON.stringify(data.error || data)}`);
  return data.post_id || data.id;
}

// Post a photo from a LOCAL file (multipart upload) with a caption. Returns the post id.
async function postPhotoFromFile(brand, message, absPath) {
  const { token, pageId } = brandSecrets(brand);
  const bytes = await readFile(absPath);
  const form = new FormData();
  form.append("source", new Blob([bytes]), path.basename(absPath));
  if (message) form.append("caption", message);
  form.append("access_token", token);
  // fetch sets the multipart/form-data boundary automatically — do not set Content-Type.
  const res = await fetch(`${GRAPH}/${pageId}/photos`, { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(`Facebook API error: ${JSON.stringify(data.error || data)}`);
  return data.post_id || data.id;
}

// Publish a saved draft by id and mark it posted.
export async function publishDraft(id) {
  const draft = readDraft(id);
  if (!draft) throw new Error(`No draft found for ${id}.`);
  const brand = getBrand(draft.brand);
  const text = fullText(draft);

  let postId;
  if (draft.imagePath) {
    // Local file wins over a URL. Resolve against images/ or the engine root.
    const abs = resolveImagePath(draft.imagePath);
    if (!abs) {
      throw new Error(
        `imagePath "${draft.imagePath}" not found (looked in engine/images/ and the engine root). ` +
          `Drop the photo in social/engine/images/ and set imagePath to its filename.`
      );
    }
    postId = await postPhotoFromFile(brand, text, abs);
  } else if (draft.imageUrl) {
    postId = await postPhoto(brand, text, draft.imageUrl);
  } else {
    postId = await postText(brand, text);
  }

  draft.status = "posted";
  draft.postId = postId;
  draft.postedAt = new Date().toISOString();
  writeDraft(id, draft);
  log(`Posted ${id} to ${brand.name} Facebook (post id: ${postId}).`);
  return postId;
}

// CLI: node publish.js <draftId>
if (import.meta.url === `file://${process.argv[1]}`) {
  const id = process.argv[2];
  if (!id) {
    console.error("Usage: node publish.js <draftId>  (e.g. kiefer-built-2026-06-06-facebook)");
    process.exit(1);
  }
  publishDraft(id).catch((err) => {
    log(`Publish failed for ${id}: ${err.message}`);
    process.exit(1);
  });
}
