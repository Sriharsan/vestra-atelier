/**
 * Generate pre-baked try-on result images using HuggingFace IDM-VTON.
 *
 * Usage:
 *   Requires TRYON_API_KEY (HF token) in .env or environment.
 *   npx tsx scripts/bake-results.ts
 *
 * Saves outputs to public/demo/results/.
 */

import { Client } from "@gradio/client";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

const ROOT = join(import.meta.dirname, "..");
const PEOPLE_DIR = join(ROOT, "public", "demo", "people");
const GARMENT_DIR = join(ROOT, "public", "demo", "garments");
const RESULTS_DIR = join(ROOT, "public", "demo", "results");

const PAIRS = [
  {
    person: "woman-1.jpg",
    garment: "anarkali-suit.jpg",
    out: "woman-1--anarkali.jpg",
    desc: "anarkali suit indian dress",
  },
  {
    person: "woman-2.jpg",
    garment: "anarkali-suit.jpg",
    out: "woman-2--anarkali.jpg",
    desc: "anarkali suit indian dress",
  },
  {
    person: "woman-1.jpg",
    garment: "lehenga-choli.jpg",
    out: "woman-1--lehenga.jpg",
    desc: "lehenga choli bridal dress",
  },
  {
    person: "woman-2.jpg",
    garment: "lehenga-choli.jpg",
    out: "woman-2--lehenga.jpg",
    desc: "lehenga choli bridal dress",
  },
  {
    person: "woman-1.jpg",
    garment: "salwar-kameez.jpg",
    out: "woman-1--salwar.jpg",
    desc: "salwar kameez cotton dress",
  },
  {
    person: "woman-2.jpg",
    garment: "salwar-kameez.jpg",
    out: "woman-2--salwar.jpg",
    desc: "salwar kameez cotton dress",
  },
  {
    person: "man-1.jpg",
    garment: "kurta-nehru.jpg",
    out: "man-1--kurta-nehru.jpg",
    desc: "kurta with nehru jacket",
  },
  {
    person: "man-2.jpg",
    garment: "kurta-nehru.jpg",
    out: "man-2--kurta-nehru.jpg",
    desc: "kurta with nehru jacket",
  },
  {
    person: "man-1.jpg",
    garment: "sherwani.jpg",
    out: "man-1--sherwani.jpg",
    desc: "sherwani wedding outfit",
  },
  {
    person: "man-2.jpg",
    garment: "sherwani.jpg",
    out: "man-2--sherwani.jpg",
    desc: "sherwani wedding outfit",
  },
];

const SPACES = ["yisol/IDM-VTON", "BoyuanJiang/Virtual-Try-On"];

async function fileToBlob(path: string): Promise<Blob> {
  const buf = await readFile(path);
  return new Blob([buf], { type: "image/jpeg" });
}

async function fileExists(path: string): Promise<boolean> {
  try {
    const s = await stat(path);
    return s.size > 1000;
  } catch {
    return false;
  }
}

async function tryIDMVTON(
  client: ReturnType<typeof Client.connect> extends Promise<infer T> ? T : never,
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

  const data = result.data as Array<{ url?: string } | string>;
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

async function tryGenericSpace(
  spaceUrl: string,
  token: string | undefined,
  personPath: string,
  garmentPath: string,
): Promise<Buffer | null> {
  const client = await Client.connect(spaceUrl, {
    token: token as `hf_${string}` | undefined,
  });

  const personBlob = await fileToBlob(personPath);
  const garmentBlob = await fileToBlob(garmentPath);

  const api = await client.view_api();
  const endpoints = Object.keys(api.named_endpoints || {});
  const tryonEndpoint =
    endpoints.find((e) => e.includes("tryon") || e.includes("try")) || endpoints[0];

  if (!tryonEndpoint) return null;

  const result = await client.predict(tryonEndpoint as `/${string}`, [personBlob, garmentBlob]);

  const data = result.data as Array<{ url?: string } | string>;
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

async function main() {
  const token = process.env.TRYON_API_KEY || undefined;
  if (!token) {
    console.error("Set TRYON_API_KEY (HuggingFace token) in environment.");
    process.exit(1);
  }

  await mkdir(RESULTS_DIR, { recursive: true });

  console.log("Connecting to IDM-VTON...");
  let idmClient: Awaited<ReturnType<typeof Client.connect>> | null = null;
  try {
    idmClient = await Client.connect(SPACES[0], {
      token: token as `hf_${string}`,
    });
    console.log("Connected to IDM-VTON.");
  } catch (err) {
    console.log("IDM-VTON connect failed:", (err as Error).message?.substring(0, 100));
  }

  const failed: string[] = [];
  let completed = 0;

  for (const pair of PAIRS) {
    const outPath = join(RESULTS_DIR, pair.out);

    if (await fileExists(outPath)) {
      console.log(`SKIP ${pair.out} (exists, ${(await stat(outPath)).size} bytes)`);
      completed++;
      continue;
    }

    console.log(`\nGenerating ${pair.out}...`);
    const personPath = join(PEOPLE_DIR, pair.person);
    const garmentPath = join(GARMENT_DIR, pair.garment);

    let buf: Buffer | null = null;

    for (let attempt = 0; attempt < 3 && !buf; attempt++) {
      if (attempt > 0) {
        console.log(`  Retry ${attempt}/2...`);
        await new Promise((r) => setTimeout(r, 5000));
      }

      if (idmClient) {
        try {
          buf = await tryIDMVTON(idmClient, personPath, garmentPath, pair.desc);
        } catch (err) {
          console.log(`  IDM-VTON error: ${(err as Error).message?.substring(0, 150)}`);
        }
      }
    }

    if (!buf && SPACES.length > 1) {
      console.log(`  Trying fallback space: ${SPACES[1]}...`);
      try {
        buf = await tryGenericSpace(SPACES[1], token, personPath, garmentPath);
      } catch (err) {
        console.log(`  Fallback error: ${(err as Error).message?.substring(0, 150)}`);
      }
    }

    if (buf && buf.length > 1000) {
      await writeFile(outPath, buf);
      console.log(`  OK ${pair.out} (${(buf.length / 1024).toFixed(0)} KB)`);
      completed++;
    } else {
      console.log(`  FAILED ${pair.out} — no valid image returned`);
      failed.push(pair.out);
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log(`\nDone. ${completed}/10 results generated.`);
  if (failed.length > 0) {
    console.log("Failed slots:", failed.join(", "));
    console.log("These will fall back to showing the person photo in demo mode.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
