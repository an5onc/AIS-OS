// Delete a previously published post from a brand's Facebook Page.
//
// Posts created by this engine are attributed to the Meta app, so they do NOT
// appear in Meta Business Suite / "Manage posts" and can't be deleted there.
// This is the supported way to remove one: DELETE the post node via the Graph
// API with the brand's Page token.
//
// Usage:
//   node delete.js <draftId>                e.g. kiefer-built-2026-06-06-facebook
//   node delete.js --post=<postId> --brand=<brandKey>
//
// Deleting by draftId marks the draft "deleted" (keeps a record of the old post id).
import { getBrand, brandSecrets, readDraft, writeDraft, log } from "./lib/util.js";

const GRAPH = "https://graph.facebook.com/v21.0";

// Delete a post by its Facebook post id using the brand's Page token.
export async function deletePost(brand, postId) {
  const { token } = brandSecrets(brand);
  const res = await fetch(`${GRAPH}/${encodeURIComponent(postId)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token: token }),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Facebook API error: ${JSON.stringify(data.error || data)}`);
  }
  return data.success === true || data.success === "true";
}

// Delete the Facebook post tied to a draft, then mark the draft "deleted".
export async function deleteDraftPost(id) {
  const draft = readDraft(id);
  if (!draft) throw new Error(`No draft found for ${id}.`);
  if (!draft.postId) {
    throw new Error(`Draft ${id} has no postId — nothing was published to delete.`);
  }
  const brand = getBrand(draft.brand);
  const oldPostId = draft.postId;

  await deletePost(brand, oldPostId);

  draft.status = "deleted";
  draft.deletedPostId = oldPostId;
  draft.deletedAt = new Date().toISOString();
  draft.postId = null;
  draft.postedAt = null;
  writeDraft(id, draft);
  log(`Deleted ${id} from ${brand.name} Facebook (was post id: ${oldPostId}).`);
  return oldPostId;
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const postArg = args.find((a) => a.startsWith("--post="));
  const brandArg = args.find((a) => a.startsWith("--brand="));
  const draftId = args.find((a) => !a.startsWith("--"));

  const run = async () => {
    if (postArg) {
      if (!brandArg) throw new Error("--post=<id> also needs --brand=<brandKey>.");
      const brand = getBrand(brandArg.split("=")[1]);
      await deletePost(brand, postArg.split("=")[1]);
      log(`Deleted post ${postArg.split("=")[1]} from ${brand.name} Facebook.`);
    } else if (draftId) {
      await deleteDraftPost(draftId);
    } else {
      console.error(
        "Usage:\n  node delete.js <draftId>\n  node delete.js --post=<postId> --brand=<brandKey>"
      );
      process.exit(1);
    }
  };

  run().catch((err) => {
    log(`Delete failed: ${err.message}`);
    process.exit(1);
  });
}
