// Interactive helper: converts a short-lived user token into a long-lived,
// non-expiring Page token and writes it into secrets.env for one brand.
//
// Run:  node get-token.js
// You pick a brand, then paste your App ID, App Secret, and a short-lived user
// token from the Graph API Explorer. Nothing is sent anywhere except Meta.

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { ROOT, BRANDS } from "./lib/util.js";

const GRAPH = "https://graph.facebook.com/v21.0";
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, (a) => res(a.trim())));

async function getJSON(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) throw new Error(`${data.error.message} (code ${data.error.code})`);
  return data;
}

async function main() {
  console.log("\n=== AIS-OS Social — Facebook token setup ===\n");

  console.log("Which brand is this token for?");
  BRANDS.forEach((b, i) => console.log(`  [${i + 1}] ${b.name}`));
  const choice = await ask("Brand number: ");
  const brand = BRANDS[Number(choice) - 1];
  if (!brand) throw new Error("Invalid brand choice.");

  const appId = await ask("App ID: ");
  const appSecret = await ask("App Secret: ");
  const shortToken = await ask("Short-lived user token (from Graph API Explorer): ");

  console.log("\n1/3 Exchanging for a long-lived user token...");
  const longLived = await getJSON(
    `${GRAPH}/oauth/access_token?grant_type=fb_exchange_token` +
      `&client_id=${encodeURIComponent(appId)}` +
      `&client_secret=${encodeURIComponent(appSecret)}` +
      `&fb_exchange_token=${encodeURIComponent(shortToken)}`
  );
  const userToken = longLived.access_token;
  console.log("    done.");

  console.log("2/3 Fetching the Pages you manage...");
  const accounts = await getJSON(
    `${GRAPH}/me/accounts?fields=name,id,access_token&access_token=${encodeURIComponent(userToken)}`
  );
  const pages = accounts.data || [];
  if (!pages.length) throw new Error("No Pages found. Make sure you granted access to your Page.");

  let page;
  if (pages.length === 1) {
    page = pages[0];
    console.log(`    found: ${page.name} (${page.id})`);
  } else {
    console.log("\n    Pages found:");
    pages.forEach((p, i) => console.log(`      [${i + 1}] ${p.name} (${p.id})`));
    const pc = await ask(`    Choose the ${brand.name} Page number: `);
    page = pages[Number(pc) - 1];
    if (!page) throw new Error("Invalid page choice.");
  }

  const pageToken = page.access_token || userToken;

  console.log("3/3 Writing secrets.env...");
  const envPath = path.join(ROOT, "secrets.env");
  let env = fs.existsSync(envPath)
    ? fs.readFileSync(envPath, "utf8")
    : fs.readFileSync(path.join(ROOT, "secrets.env.example"), "utf8");

  const setKey = (text, key, val) =>
    new RegExp(`^${key}=.*$`, "m").test(text)
      ? text.replace(new RegExp(`^${key}=.*$`, "m"), `${key}=${val}`)
      : text + `\n${key}=${val}\n`;

  env = setKey(env, `FB_PAGE_ACCESS_TOKEN_${brand.secret}`, pageToken);
  env = setKey(env, `FB_PAGE_ID_${brand.secret}`, page.id);
  fs.writeFileSync(envPath, env);

  console.log(`\n✅ Saved Page token + ID for ${brand.name} ("${page.name}") to secrets.env.`);
  console.log("\nTest it with:");
  console.log(`   node -e "import('./publish.js')" # then approve a draft in the dashboard`);
  rl.close();
}

main().catch((err) => {
  console.error("\n❌ " + err.message);
  rl.close();
  process.exit(1);
});
