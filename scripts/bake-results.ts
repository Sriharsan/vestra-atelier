/**
 * Generate pre-baked try-on result images using Leffa (full-body dress mode).
 *
 * Usage:
 *   Requires TRYON_API_KEY (HF token) in .env or environment.
 *   npx tsx scripts/bake-results.ts
 *
 * Saves outputs to public/demo/results/.
 * All five Indian looks use "dresses" category for full outfit replacement.
 */

import { Client } from "@gradio/client";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const ROOT = join(import.meta.dirname, "..");
const PEOPLE_DIR = join(ROOT, "public", "demo", "people");
const GARMENT_DIR = join(ROOT, "public", "demo", "garments");
const RESULTS_DIR = join(ROOT, "public", "demo", "results");

type GarmentCategory = "upper_body" | "lower_body" | "dresses";

interface BakePair {
  person: string;
  garment: string;
  out: string;
  category: GarmentCategory;
}

const PAIRS: BakePair[] = [
  {
    person: "woman-1.jpg",
    garment: "anarkali-suit.jpg",
    out: "woman-1--anarkali.jpg",
    category: "dresses",
  },
  {
    person: "woman-2.jpg",
    garment: "anarkali-suit.jpg",
    out: "woman-2--anarkali.jpg",
    category: "dresses",
  },
  {
    person: "woman-1.jpg",
    garment: "lehenga-choli.jpg",
    out: "woman-1--lehenga.jpg",
    category: "dresses",
  },
  {
    person: "woman-2.jpg",
    garment: "lehenga-choli.jpg",
    out: "woman-2--lehenga.jpg",
    category: "dresses",
  },
  {
    person: "woman-1.jpg",
    garment: "salwar-kameez.jpg",
    out: "woman-1--salwar.jpg",
    category: "dresses",
  },
  {
    person: "woman-2.jpg",
    garment: "salwar-kameez.jpg",
    out: "woman-2--salwar.jpg",
    category: "dresses",
  },
  {
    person: "man-1.jpg",
    garment: "kurta-nehru.jpg",
    out: "man-1--kurta-nehru.jpg",
    category: "dresses",
  },
  {
    person: "man-2.jpg",
    garment: "kurta-nehru.jpg",
    out: "man-2--kurta-nehru.jpg",
    category: "dresses",
  },
  { person: "man-1.jpg", garment: "sherwani.jpg", out: "man-1--sherwani.jpg", category: "dresses" },
  { person: "man-2.jpg", garment: "sherwani.jpg", out: "man-2--sherwani.jpg", category: "dresses" },
];

const PRIMARY_SPACE = "franciszzj/Leffa";
const FALLBACK_SPACE = "zhengchong/CatVTON";
const MAX_RETRIES = 4;
const SKIP_EXISTING = process.argv.includes("--skip-existing");

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function backoff(attempt: number): number {
  return Math.min(5000 * Math.pow(2, attempt), 60000);
}

async function fileToBlob(path: string): Promise<Blob> {
  const buf = await readFile(path);
  return new Blob([buf], { type: "image/jpeg" });
}

function extractImageUrl(data: unknown[]): string {
  const first = data[0];
  if (typeof first === "string") return first;
  if (first && typeof first === "object" && "url" in first)
    return (first as { url?: string }).url ?? "";
  return "";
}

async function downloadImage(url: string): Promise<Buffer | null> {
  const res = await fetch(url);
  if (!res.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 10000) {
    console.log(`  Warning: result too small (${buf.length} bytes), rejecting`);
    return null;
  }
  return buf;
}

async function tryLeffa(
  client: Awaited<ReturnType<typeof Client.connect>>,
  personPath: string,
  garmentPath: string,
  category: GarmentCategory,
): Promise<Buffer | null> {
  const personBlob = await fileToBlob(personPath);
  const garmentBlob = await fileToBlob(garmentPath);

  const result = await client.predict("/leffa_predict_vt", {
    src_image_path: personBlob,
    ref_image_path: garmentBlob,
    ref_acceleration: false,
    step: 30,
    scale: 2.5,
    seed: 42,
    vt_model_type: "dress_code",
    vt_garment_type: category,
    vt_repaint: false,
  });

  const imageUrl = extractImageUrl(result.data as unknown[]);
  if (!imageUrl) return null;
  return downloadImage(imageUrl);
}

function mapCategoryToCatVTON(cat: GarmentCategory): string {
  if (cat === "dresses") return "overall";
  if (cat === "lower_body") return "lower";
  return "upper";
}

async function tryCatVTON(
  token: string | undefined,
  personPath: string,
  garmentPath: string,
  category: GarmentCategory,
): Promise<Buffer | null> {
  const client = await Client.connect(FALLBACK_SPACE, {
    hf_token: token as `hf_${string}` | undefined,
  });

  const personBlob = await fileToBlob(personPath);
  const garmentBlob = await fileToBlob(garmentPath);

  const result = await client.predict("/submit_function", [
    { background: personBlob, layers: [], composite: null },
    garmentBlob,
    mapCategoryToCatVTON(category),
    50,
    2.5,
    42,
    "result only",
  ]);

  const imageUrl = extractImageUrl(result.data as unknown[]);
  if (!imageUrl) return null;
  return downloadImage(imageUrl);
}

function isQuotaError(msg: string): boolean {
  return msg.includes("ZeroGPU quota") || msg.includes("exceeded");
}

function isTransientError(msg: string): boolean {
  return (
    msg.includes("Connection errored") ||
    msg.includes("fetch failed") ||
    msg.includes("queue") ||
    msg.includes("ETIMEDOUT") ||
    msg.includes("ECONNRESET") ||
    msg.includes("503") ||
    msg.includes("504")
  );
}

async function generateOne(
  pair: BakePair,
  token: string,
  leffaClient: Awaited<ReturnType<typeof Client.connect>> | null,
): Promise<{ buf: Buffer | null; leffaDead: boolean }> {
  const personPath = join(PEOPLE_DIR, pair.person);
  const garmentPath = join(GARMENT_DIR, pair.garment);
  let leffaDead = false;

  // Try Leffa with retries
  if (leffaClient) {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        const delay = backoff(attempt);
        console.log(
          `  Retrying Leffa in ${(delay / 1000).toFixed(0)}s (attempt ${attempt + 1}/${MAX_RETRIES})...`,
        );
        await wait(delay);
      }
      try {
        const buf = await tryLeffa(leffaClient, personPath, garmentPath, pair.category);
        if (buf) return { buf, leffaDead: false };
        console.log(`  Leffa returned empty result, retrying...`);
      } catch (err) {
        const msg = (err as Error).message ?? "";
        console.log(`  Leffa error: ${msg.substring(0, 150)}`);
        if (isQuotaError(msg)) {
          console.log("  ZeroGPU quota exhausted for Leffa.");
          leffaDead = true;
          break;
        }
        if (!isTransientError(msg) && attempt >= 1) break;
      }
    }
  }

  // Try CatVTON with retries
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = backoff(attempt);
      console.log(
        `  Retrying CatVTON in ${(delay / 1000).toFixed(0)}s (attempt ${attempt + 1}/${MAX_RETRIES})...`,
      );
      await wait(delay);
    }
    try {
      const buf = await tryCatVTON(token, personPath, garmentPath, pair.category);
      if (buf) return { buf, leffaDead };
      console.log(`  CatVTON returned empty result, retrying...`);
    } catch (err) {
      const msg = (err as Error).message ?? "";
      console.log(`  CatVTON error: ${msg.substring(0, 150)}`);
      if (isQuotaError(msg)) {
        console.log("  ZeroGPU quota exhausted for CatVTON too.");
        return { buf: null, leffaDead };
      }
      if (!isTransientError(msg) && attempt >= 1) break;
    }
  }

  return { buf: null, leffaDead };
}

async function main() {
  const token = process.env.TRYON_API_KEY || undefined;
  if (!token) {
    console.error("Set TRYON_API_KEY (HuggingFace token) in environment.");
    process.exit(1);
  }

  await mkdir(RESULTS_DIR, { recursive: true });

  console.log(`Connecting to ${PRIMARY_SPACE} (full-body dress mode)...`);
  let leffaClient: Awaited<ReturnType<typeof Client.connect>> | null = null;
  try {
    leffaClient = await Client.connect(PRIMARY_SPACE, {
      hf_token: token as `hf_${string}`,
    });
    console.log("Connected to Leffa.");
  } catch (err) {
    console.log("Leffa connect failed:", (err as Error).message?.substring(0, 100));
  }

  const remaining = new Map<string, BakePair>();
  for (const pair of PAIRS) {
    if (SKIP_EXISTING) {
      const outPath = join(RESULTS_DIR, pair.out);
      if (existsSync(outPath)) {
        const { size } = await import("node:fs").then((fs) => fs.statSync(outPath));
        if (size > 10000) {
          console.log(`  SKIP ${pair.out} (${(size / 1024).toFixed(0)} KB, already exists)`);
          continue;
        }
      }
    }
    remaining.set(pair.out, pair);
  }

  let completed = 0;
  let bothQuotaDead = false;

  for (const [name, pair] of remaining) {
    if (bothQuotaDead) break;

    console.log(`\nGenerating ${name} (category: ${pair.category})...`);
    const { buf, leffaDead } = await generateOne(pair, token, leffaClient);

    if (leffaDead) leffaClient = null;

    if (buf && buf.length > 10000) {
      const outPath = join(RESULTS_DIR, name);
      await writeFile(outPath, buf);
      console.log(`  OK ${name} (${(buf.length / 1024).toFixed(0)} KB) [full-body]`);
      remaining.delete(name);
      completed++;
    } else {
      console.log(`  FAILED ${name}`);
      if (!leffaClient) {
        bothQuotaDead = true;
      }
    }

    await wait(2000);
  }

  console.log(`\nDone. ${completed}/${PAIRS.length} new results generated.`);
  if (remaining.size > 0) {
    console.log(`Incomplete: ${[...remaining.keys()].join(", ")}`);
    console.log("Re-run when ZeroGPU quota resets.");
  }
}

process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection:", (err as Error).message?.substring(0, 100));
});

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
