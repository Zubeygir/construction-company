// Run from the project root: npx sanity exec seed/import.mjs --with-user-token
// Same result as `sanity dataset import seed/tinaz-demo.ndjson --replace`, but authenticated with the CLI login.
import { readFileSync } from "node:fs";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2024-01-01" });
const docs = readFileSync("seed/tinaz-demo.ndjson", "utf8").trim().split("\n").map((line) => JSON.parse(line));
const uploaded = new Map();

async function uploadImage(url) {
  if (uploaded.has(url)) return uploaded.get(url);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const filename = url.match(/photo-[\w-]+/)?.[0] ?? "image";
  const asset = await client.assets.upload("image", buffer, { filename: `${filename}.jpg` });
  uploaded.set(url, asset._id);
  console.log("uploaded", filename);
  return asset._id;
}

async function resolveAssets(value) {
  if (Array.isArray(value)) return Promise.all(value.map(resolveAssets));
  if (!value || typeof value !== "object") return value;
  const out = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === "_sanityAsset") {
      const url = child.replace(/^image@/, "");
      out.asset = { _type: "reference", _ref: await uploadImage(url) };
    } else {
      out[key] = await resolveAssets(child);
    }
  }
  return out;
}

const resolved = [];
for (const doc of docs) resolved.push(await resolveAssets(doc));
const transaction = client.transaction();
resolved.forEach((doc) => transaction.createOrReplace(doc));
await transaction.commit();
console.log(`replaced ${resolved.length} documents`);
