/**
 * Seed demo assets from Pexels (free API).
 *
 * Usage:
 *   PEXELS_API_KEY=<key> npx tsx scripts/seed-assets.ts
 *
 * Downloads person presets, garment images, and shop product images
 * into public/demo/. Re-running skips files that already exist.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const API_KEY = process.env.PEXELS_API_KEY;
if (!API_KEY) {
  console.error("Set PEXELS_API_KEY in your environment. Get one at https://www.pexels.com/api/");
  process.exit(1);
}

const ROOT = join(import.meta.dirname, "..");
const PEOPLE_DIR = join(ROOT, "public", "demo", "people");
const GARMENT_DIR = join(ROOT, "public", "demo", "garments");
const SHOP_DIR = join(ROOT, "public", "demo", "shop");

interface PexelsPhoto {
  id: number;
  src: { original: string; large2x: string; large: string; medium: string };
  photographer: string;
}

interface PexelsResponse {
  photos: PexelsPhoto[];
}

async function searchPexels(query: string, perPage = 3): Promise<PexelsPhoto[]> {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=portrait`;
  const res = await fetch(url, { headers: { Authorization: API_KEY! } });
  if (!res.ok) throw new Error(`Pexels ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as PexelsResponse;
  return data.photos;
}

const FORCE = process.argv.includes("--force");

async function download(url: string, dest: string): Promise<void> {
  if (!FORCE && existsSync(dest)) {
    console.log(`  SKIP ${dest} (exists, use --force to overwrite)`);
    return;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
  console.log(`  OK ${dest} (${(buf.length / 1024).toFixed(0)} KB)`);
}

const PEOPLE_QUERIES = [
  {
    filename: "woman-1.jpg",
    query: "indian woman full body standing plain white background no accessories",
    gender: "women",
  },
  {
    filename: "woman-2.jpg",
    query: "south asian woman standing full body portrait plain background simple clothing",
    gender: "women",
  },
  {
    filename: "man-1.jpg",
    query: "indian man full body standing plain background simple clothing no accessories",
    gender: "men",
  },
  {
    filename: "man-2.jpg",
    query: "south asian man standing full body portrait plain background casual",
    gender: "men",
  },
];

const GARMENT_QUERIES = [
  {
    filename: "anarkali-suit.jpg",
    query: "anarkali suit indian fashion flat lay",
    id: "tryon-anarkali",
  },
  {
    filename: "lehenga-choli.jpg",
    query: "lehenga choli indian bridal outfit",
    id: "tryon-lehenga",
  },
  {
    filename: "salwar-kameez.jpg",
    query: "salwar kameez indian women fashion",
    id: "tryon-salwar",
  },
  {
    filename: "kurta-nehru.jpg",
    query: "kurta nehru jacket indian men",
    id: "tryon-kurta-nehru",
  },
  {
    filename: "sherwani.jpg",
    query: "sherwani indian men wedding outfit",
    id: "tryon-sherwani",
  },
];

const SHOP_QUERIES = [
  { filename: "cream-silk-blouse.jpg", query: "cream silk blouse elegant women" },
  { filename: "clay-linen-dress.jpg", query: "terracotta brown linen dress woman minimal" },
  { filename: "anarkali-red.jpg", query: "red suit floral dupatta indian woman" },
  { filename: "banarasi-saree.jpg", query: "banarasi silk saree red gold traditional indian" },
  { filename: "midi-dress-green.jpg", query: "turquoise pleated dress woman studio" },
  { filename: "espresso-blazer.jpg", query: "brown double breasted blazer man suit" },
  { filename: "nehru-jacket.jpg", query: "nehru jacket man formal traditional indoors" },
  { filename: "sherwani-ivory.jpg", query: "indian groom white sherwani turban outdoors" },
  { filename: "kurta-set-olive.jpg", query: "green kurta man portrait night" },
  { filename: "oxford-button-down.jpg", query: "blue oxford button down shirt man formal" },
];

async function main() {
  await mkdir(PEOPLE_DIR, { recursive: true });
  await mkdir(GARMENT_DIR, { recursive: true });
  await mkdir(SHOP_DIR, { recursive: true });

  console.log("Seeding person presets...");
  for (const p of PEOPLE_QUERIES) {
    const photos = await searchPexels(p.query, 1);
    if (photos.length === 0) {
      console.log(`  WARN: no results for "${p.query}"`);
      continue;
    }
    await download(photos[0].src.large2x, join(PEOPLE_DIR, p.filename));
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log("\nSeeding garment images...");
  for (const g of GARMENT_QUERIES) {
    const photos = await searchPexels(g.query, 1);
    if (photos.length === 0) {
      console.log(`  WARN: no results for "${g.query}"`);
      continue;
    }
    await download(photos[0].src.large2x, join(GARMENT_DIR, g.filename));
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log("\nSeeding shop product images...");
  for (const s of SHOP_QUERIES) {
    const photos = await searchPexels(s.query, 5);
    if (photos.length === 0) {
      console.log(`  WARN: no results for "${s.query}"`);
      continue;
    }
    const photo = photos[0];
    console.log(`  Query: "${s.query}" → photo ${photo.id} by ${photo.photographer}`);
    await download(photo.src.large2x, join(SHOP_DIR, s.filename));
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log("\nDone. Assets saved to public/demo/");
  console.log("For production, replace these with your own product photography.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
