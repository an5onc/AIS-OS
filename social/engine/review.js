import http from "node:http";
import os from "node:os";
import { loadSecrets, listDrafts, readDraft, writeDraft, log } from "./lib/util.js";
import { publishDraft } from "./publish.js";
import { deleteDraftPost } from "./delete.js";

const env = loadSecrets();
const PORT = Number(env.REVIEW_PORT) || 4500;

function lanIp() {
  for (const iface of Object.values(os.networkInterfaces()).flat()) {
    if (iface && iface.family === "IPv4" && !iface.internal) return iface.address;
  }
  return "localhost";
}

function esc(s = "") {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function statusColor(s) {
  return { pending: "#b45309", approved: "#1d4ed8", posted: "#15803d", rejected: "#9ca3af", deleted: "#991b1b" }[s] || "#333";
}

function brandColor(b) {
  return { "kiefer-built": "#1e3a8a", interlockgo: "#0f766e" }[b] || "#44403c";
}

function card(d) {
  const tags = (d.hashtags || []).join(" ");
  const editable = d.status === "pending";
  const ro = editable ? "" : "readonly";
  const preview = d.imageUrl
    ? `<img class="preview" src="${esc(d.imageUrl)}" alt="post image preview">`
    : "";
  const img = `${preview}
       <input class="tags" name="imageUrl" value="${esc(d.imageUrl || "")}" ${ro} placeholder="image URL (public https) — optional">
       <input class="tags" name="imagePath" value="${esc(d.imagePath || "")}" ${ro} placeholder="or local file in images/ (e.g. jobsite.jpg) — wins over URL">`;
  return `
  <div class="card">
    <div class="row">
      <span class="brand" style="background:${brandColor(d.brand)}">${esc(d.brandName || d.brand)}</span>
      <span class="badge" style="background:${statusColor(d.status)}">${esc(d.status)}</span>
      <span class="date">${esc(d.date)} · FB · ${esc(d.pillarTitle || "")}</span>
    </div>
    <form method="POST" action="/save">
      <input type="hidden" name="id" value="${esc(d.id)}">
      <textarea name="caption" rows="8" ${ro}>${esc(d.caption)}</textarea>
      <input class="tags" name="hashtags" value="${esc(tags)}" ${ro} placeholder="space-separated hashtags">
      ${img}
      ${
        editable
          ? `<div class="actions">
        <button class="save" formaction="/save">Save edits</button>
        <button class="approve" formaction="/approve" onclick="return confirm('Post this to ${esc(d.brandName || d.brand)} Facebook now?')">Approve &amp; Post</button>
        <button class="reject" formaction="/reject" onclick="return confirm('Reject and discard this draft?')">Reject</button>
      </div>`
          : d.status === "posted" && d.postId
          ? `<div class="actions">
        <span class="meta">Posted · id ${esc(d.postId)}</span>
        <button class="reject" formaction="/delete" onclick="return confirm('Delete this post from ${esc(d.brandName || d.brand)} Facebook? This cannot be undone.')">Delete from Facebook</button>
      </div>`
          : d.status === "deleted"
          ? `<div class="meta">Deleted from Facebook · was id ${esc(d.deletedPostId || "")}</div>`
          : ""
      }
    </form>
  </div>`;
}

function page() {
  const drafts = listDrafts();
  const pending = drafts.filter((d) => d.status === "pending");
  return `<!doctype html><html><head><meta charset="utf8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>AIS-OS — Social Post Review</title>
  <style>
    body{font-family:-apple-system,system-ui,sans-serif;max-width:680px;margin:0 auto;padding:16px;background:#f5f5f4;color:#1c1917}
    h1{font-size:20px} .sub{color:#78716c;font-size:13px;margin-bottom:16px}
    .card{background:#fff;border:1px solid #e7e5e4;border-radius:12px;padding:14px;margin-bottom:16px;box-shadow:0 1px 2px rgba(0,0,0,.04)}
    .row{display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap}
    .brand,.badge{color:#fff;font-size:11px;font-weight:600;padding:2px 8px;border-radius:999px;text-transform:uppercase;letter-spacing:.04em}
    .date{color:#57534e;font-size:13px}
    textarea,.tags{width:100%;box-sizing:border-box;font:inherit;border:1px solid #d6d3d1;border-radius:8px;padding:10px;margin-bottom:8px}
    textarea{resize:vertical;line-height:1.5}
    .preview{width:100%;max-height:280px;object-fit:cover;border-radius:8px;margin-bottom:8px;border:1px solid #e7e5e4}
    .actions{display:flex;gap:8px;flex-wrap:wrap}
    button{font:inherit;font-weight:600;border:0;border-radius:8px;padding:9px 14px;cursor:pointer}
    .save{background:#e7e5e4} .approve{background:#15803d;color:#fff} .reject{background:#fee2e2;color:#991b1b}
    .meta{color:#78716c;font-size:12px} .empty{color:#78716c}
  </style></head><body>
  <h1>AIS-OS — Social Post Review</h1>
  <div class="sub">${pending.length} pending · reachable on your network at http://${lanIp()}:${PORT}</div>
  ${drafts.length ? drafts.map(card).join("") : '<p class="empty">No drafts yet. Run <code>node generate.js</code>.</p>'}
  </body></html>`;
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => resolve(Object.fromEntries(new URLSearchParams(body))));
  });
}

function redirect(res) {
  res.writeHead(303, { Location: "/" });
  res.end();
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(page());
  }

  if (req.method === "POST") {
    const body = await parseBody(req);
    const draft = readDraft(body.id);
    if (!draft) {
      res.writeHead(404);
      return res.end("draft not found");
    }

    const applyEdits = () => {
      if (body.caption != null) draft.caption = body.caption;
      if (body.hashtags != null) draft.hashtags = body.hashtags.split(/\s+/).filter(Boolean);
      if (body.imageUrl != null) draft.imageUrl = body.imageUrl.trim() || null;
      if (body.imagePath != null) draft.imagePath = body.imagePath.trim() || null;
    };

    if (req.url === "/save") {
      applyEdits();
      writeDraft(body.id, draft);
      log(`Edited draft ${body.id}.`);
      return redirect(res);
    }

    if (req.url === "/reject") {
      draft.status = "rejected";
      writeDraft(body.id, draft);
      log(`Rejected draft ${body.id}.`);
      return redirect(res);
    }

    if (req.url === "/approve") {
      applyEdits();
      writeDraft(body.id, draft);
      try {
        await publishDraft(body.id);
      } catch (err) {
        log(`Approve/post failed for ${body.id}: ${err.message}`);
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end(`Post failed: ${err.message}\n\nGo back and try again once fixed.`);
      }
      return redirect(res);
    }

    if (req.url === "/delete") {
      try {
        await deleteDraftPost(body.id);
      } catch (err) {
        log(`Delete failed for ${body.id}: ${err.message}`);
        res.writeHead(500, { "Content-Type": "text/plain" });
        return res.end(`Delete failed: ${err.message}\n\nGo back and try again.`);
      }
      return redirect(res);
    }
  }

  res.writeHead(404);
  res.end("not found");
});

server.listen(PORT, () => {
  log(`Review dashboard at http://localhost:${PORT}  (LAN: http://${lanIp()}:${PORT})`);
});
