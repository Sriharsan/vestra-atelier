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
  {
    person: "man-1.jpg",
    garment: "sherwani.jpg",
    out: "man-1--sherwani.jpg",
    category: "dresses",
  },
  {
    person: "man-2.jpg",
    garment: "sherwani.jpg",
    out: "man-2--sherwani.jpg",
    category: "dresses",
  },
];

const PRIMARY_SPACE = "franciszzj/Leffa";
const FALLBACK_SPACE = "zhengchong/CatVTON";
const LEGACY_SPACE = "yisol/IDM-VTON";

async function fileToBlob(path: string): Promise<Blob> {
  const buf = await readFile(path);
  return new Blob([buf], { type: "image/jpeg" });
}

async function tryLeffa(
  client: Awaited<ReturnType<typeof Client.connect>>,
  personPath: string,
  garmentPath: string,
  category: GarmentCategory,
): Promise<Buffer | null> {
  const personBlob = await fileToBlob(personPath);
  const garmentBlob = await fileToBlob(garmentPath);

  const result = await client.predict("/leffa_predict_vt", [
    personBlob,
    garmentBlob,
    false,
    30,
    2.5,
    42,
    "dress_code",
    category,
    false,
  ]);

  const data = result.data as Array<{ url?: string } | string | null>;
  let imageUrl = "";

  if (typeof data[0] === "string") {
    imageUrl = data[0];
  } else if (data[0] && typeof data[0] === "object" && "url" in data[0]) {
    imageUrl = data[0].url ?? "";
  }

  if (!imageUrl) return null;

  const res = await fetch(imageUrl);
  if (!res.ok) return null;
  return Buffer.from(await res.arrayBuffer());
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
    token: token as `hf_${string}` | undefined,
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

  const data = result.data as Array<{ url?: string } | string | null>;
  let imageUrl = "";

  if (typeof data[0] === "string") {
    imageUrl = data[0];
  } else if (data[0] && typeof data[0] === "object" && "url" in data[0]) {
    imageUrl = data[0].url ?? "";
  }

  if (!imageUrl) return null;

  const res = await fetch(imageUrl);
  if (!res.ok) return null;
  return Buffer.from(await res.arrayBuffer());
}

async function tryIDMVTON(
  client: Awaited<ReturnType<typeof Client.connect>>,
  personPath: string,
  garmentPath: string,
  desc: string,
): Promise<Buffer | null> {
  const personBlob = await fileToBlob(personPath);
  const garmentBlob = await fileToBlob(garmentPath);

  const result = await client.predict("/tryon", [
    { background: personBlob, layers: [], composite: null },
    garmentBlob,
    desc,
    true,
    false,
    30,
    42,
  ]);

  const data = result.data as Array<{ url?: string } | string | null>;
  let imageUrl = "";

  if (typeof data[0] === "string") {
    imageUrl = data[0];
  } else if (data[0] && typeof data[0] === "object" && "url" in data[0]) {
    imageUrl = data[0].url ?? "";
  }

  if (!imageUrl) return null;

  const res = await fetch(imageUrl);
  if (!res.ok) return null;
  return Buffer.from(await res.arrayBuffer());
}

const GARMENT_DESCS: Record<string, string> = {
  "anarkali-suit.jpg": "full length anarkali suit dress with churidar",
  "lehenga-choli.jpg": "bridal lehenga choli outfit with dupatta",
  "salwar-kameez.jpg": "salwar kameez full outfit with dupatta",
  "kurta-nehru.jpg": "kurta with nehru jacket full outfit",
  "sherwani.jpg": "full length sherwani with churidar",
};

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
      token: token as `hf_${string}`,
    });
    console.log("Connected to Leffa.");
  } catch (err) {
    console.log("Leffa connect failed:", (err as Error).message?.substring(0, 100));
  }

  console.log(`Connecting to ${LEGACY_SPACE} (upper-body fallback)...`);
  let idmClient: Awaited<ReturnType<typeof Client.connect>> | null = null;
  try {
    idmClient = await Client.connect(LEGACY_SPACE, {
      token: token as `hf_${string}`,
    });
    console.log("Connected to IDM-VTON.");
  } catch (err) {
    console.log("IDM-VTON connect failed:", (err as Error).message?.substring(0, 100));
  }

  const failed: string[] = [];
  const upperOnly: string[] = [];
  let completed = 0;

  for (const pair of PAIRS) {
    const outPath = join(RESULTS_DIR, pair.out);

    console.log(`\nGenerating ${pair.out} (category: ${pair.category})...`);
    const personPath = join(PEOPLE_DIR, pair.person);
    const garmentPath = join(GARMENT_DIR, pair.garment);

    let buf: Buffer | null = null;
    let usedFallback = false;

    // Try Leffa first (full-body dress mode)
    if (leffaClient) {
      for (let attempt = 0; attempt < 2 && !buf; attempt++) {
        if (attempt > 0) await new Promise((r) => setTimeout(r, 5000));
        try {
          buf = await tryLeffa(leffaClient, personPath, garmentPath, pair.category);
        } catch (err) {
          const msg = (err as Error).message ?? "";
          console.log(`  Leffa error: ${msg.substring(0, 150)}`);
          if (msg.includes("ZeroGPU quota")) {
            console.log("  ZeroGPU quota exhausted, skipping Leffa for remaining items.");
            leffaClient = null;
            break;
          }
        }
      }
    }

    // Try CatVTON (also full-body)
    if (!buf) {
      try {
        buf = await tryCatVTON(token, personPath, garmentPath, pair.category);
      } catch (err) {
        const msg = (err as Error).message ?? "";
        console.log(`  CatVTON error: ${msg.substring(0, 150)}`);
      }
    }

    // Fall back to IDM-VTON (upper-body only)
    if (!buf && idmClient) {
      console.log("  Falling back to IDM-VTON (upper-body only)...");
      for (let attempt = 0; attempt < 3 && !buf; attempt++) {
        if (attempt > 0) await new Promise((r) => setTimeout(r, 5000));
        try {
          const desc = GARMENT_DESCS[pair.garment] ?? "garment";
          buf = await tryIDMVTON(idmClient, personPath, garmentPath, desc);
          usedFallback = true;
        } catch (err) {
          console.log(`  IDM-VTON error: ${(err as Error).message?.substring(0, 150)}`);
        }
      }
    }

    if (buf && buf.length > 1000) {
      await writeFile(outPath, buf);
      const source = usedFallback ? " [upper-body only — IDM-VTON fallback]" : " [full-body]";
      console.log(`  OK ${pair.out} (${(buf.length / 1024).toFixed(0)} KB)${source}`);
      completed++;
      if (usedFallback) upperOnly.push(pair.out);
    } else {
      console.log(`  FAILED ${pair.out} — no valid image returned`);
      failed.push(pair.out);
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`\nDone. ${completed}/10 results generated.`);
  if (upperOnly.length > 0) {
    console.log(`Upper-body only (IDM-VTON fallback): ${upperOnly.join(", ")}`);
    console.log("Re-run when ZeroGPU quota resets for full-body dress results via Leffa.");
  }
  if (failed.length > 0) {
    console.log("Failed slots:", failed.join(", "));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
