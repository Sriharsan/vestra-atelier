/**
 * Generate pre-baked try-on result images using Gemini image generation.
 *
 * Usage:
 *   Requires GEMINI_API_KEY in .env or environment.
 *   npx tsx scripts/bake-results.ts
 *
 * Saves outputs to public/demo/results/.
 * All looks use full-body dress mode for complete outfit replacement.
 */

import { GoogleGenAI } from "@google/genai";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const ROOT = join(import.meta.dirname, "..");
const PEOPLE_DIR = join(ROOT, "public", "demo", "people");
const GARMENT_DIR = join(ROOT, "public", "demo", "garments");
const RESULTS_DIR = join(ROOT, "public", "demo", "results");

const MODEL = "gemini-2.5-flash-image";
const MAX_RETRIES = 3;
const SKIP_EXISTING = process.argv.includes("--skip-existing");

interface BakePair {
  person: string;
  garment: string;
  garmentName: string;
  out: string;
}

const PAIRS: BakePair[] = [
  {
    person: "woman-1.jpg",
    garment: "churidar-kurta.jpg",
    garmentName: "Churidar Kurta",
    out: "woman-1--churidar.jpg",
  },
  {
    person: "woman-2.jpg",
    garment: "lehenga-choli.jpg",
    garmentName: "Lehenga Choli",
    out: "woman-2--lehenga.jpg",
  },
  {
    person: "woman-1.jpg",
    garment: "salwar-kameez.jpg",
    garmentName: "Salwar Kameez",
    out: "woman-1--salwar.jpg",
  },
  {
    person: "man-1.jpg",
    garment: "kurta-nehru.jpg",
    garmentName: "Kurta with Nehru Jacket",
    out: "man-1--kurta-nehru.jpg",
  },
  {
    person: "man-2.jpg",
    garment: "kurta-nehru.jpg",
    garmentName: "Kurta with Nehru Jacket",
    out: "man-2--kurta-nehru.jpg",
  },
  {
    person: "man-1.jpg",
    garment: "sherwani.jpg",
    garmentName: "Sherwani",
    out: "man-1--sherwani.jpg",
  },
];

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function buildPrompt(garmentName: string): string {
  return `Dress the person in the first image in the outfit from the second image: a full-length traditional Indian ${garmentName}. Cover the body head to toe, modestly and fully draped, and replace all existing clothing including any jeans or trousers. Keep the person's exact face, skin tone, body shape, and pose unchanged. Plain consistent studio background. Photographic, natural, no extra props, no held objects, no text.`;
}

function isBillingError(msg: string): boolean {
  return (
    msg.includes("billing") ||
    msg.includes("quota") ||
    msg.includes("RESOURCE_EXHAUSTED") ||
    msg.includes("429") ||
    msg.includes("402")
  );
}

async function generateOne(
  ai: InstanceType<typeof GoogleGenAI>,
  pair: BakePair,
): Promise<Buffer | null> {
  const personPath = join(PEOPLE_DIR, pair.person);
  const garmentPath = join(GARMENT_DIR, pair.garment);

  const personB64 = (await readFile(personPath)).toString("base64");
  const garmentB64 = (await readFile(garmentPath)).toString("base64");

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const delay = Math.min(5000 * Math.pow(2, attempt), 30000);
      console.log(`  Retry ${attempt + 1}/${MAX_RETRIES} in ${(delay / 1000).toFixed(0)}s...`);
      await wait(delay);
    }

    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: [
          {
            role: "user",
            parts: [
              { text: buildPrompt(pair.garmentName) },
              { inlineData: { mimeType: "image/jpeg", data: personB64 } },
              { inlineData: { mimeType: "image/jpeg", data: garmentB64 } },
            ],
          },
        ],
        config: {
          responseModalities: ["IMAGE", "TEXT"],
        },
      });

      const parts = response.candidates?.[0]?.content?.parts ?? [];
      const imagePart = parts.find((p: { inlineData?: { data?: string } }) => p.inlineData?.data);

      if (!imagePart?.inlineData?.data) {
        const textPart = parts.find((p: { text?: string }) => p.text);
        console.log(
          `  No image returned.${textPart?.text ? ` Response: ${(textPart.text as string).substring(0, 150)}` : ""}`,
        );
        continue;
      }

      const buf = Buffer.from(imagePart.inlineData.data, "base64");
      if (buf.length < 5000) {
        console.log(`  Image too small (${buf.length} bytes), retrying...`);
        continue;
      }

      return buf;
    } catch (err) {
      const msg = (err as Error).message ?? "";
      console.log(`  Gemini error: ${msg.substring(0, 200)}`);

      if (isBillingError(msg)) {
        console.error("\n  BILLING/QUOTA ERROR — stopping to avoid charges.");
        process.exit(2);
      }
    }
  }

  return null;
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Set GEMINI_API_KEY in environment or .env.");
    process.exit(1);
  }

  await mkdir(RESULTS_DIR, { recursive: true });

  const ai = new GoogleGenAI({ apiKey });
  console.log(`Using model: ${MODEL}\n`);

  const todo: BakePair[] = [];
  for (const pair of PAIRS) {
    if (SKIP_EXISTING) {
      const outPath = join(RESULTS_DIR, pair.out);
      if (existsSync(outPath) && statSync(outPath).size > 10000) {
        console.log(`SKIP ${pair.out} (already exists)`);
        continue;
      }
    }
    todo.push(pair);
  }

  let completed = 0;
  const failed: string[] = [];

  for (const pair of todo) {
    console.log(`Generating ${pair.out} (${pair.garmentName})...`);

    const buf = await generateOne(ai, pair);

    if (buf) {
      const outPath = join(RESULTS_DIR, pair.out);
      await writeFile(outPath, buf);
      console.log(`  OK ${pair.out} (${(buf.length / 1024).toFixed(0)} KB)\n`);
      completed++;
    } else {
      console.log(`  FAILED ${pair.out}\n`);
      failed.push(pair.out);
    }

    await wait(1500);
  }

  console.log(`\nDone. ${completed}/${todo.length} generated.`);
  if (failed.length > 0) {
    console.log(`Failed: ${failed.join(", ")}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
