import {
  getBrand,
  brandSecrets,
  readDraft,
  writeDraft,
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

// Publish a saved draft by id and mark it posted.
export async function publishDraft(id) {
  const draft = readDraft(id);
  if (!draft) throw new Error(`No draft found for ${id}.`);
  const brand = getBrand(draft.brand);
  const text = fullText(draft);

  const postId = draft.imageUrl
    ? await postPhoto(brand, text, draft.imageUrl)
    : await postText(brand, text);

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
