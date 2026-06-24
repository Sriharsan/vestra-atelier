/**
 * Generate AI product images for every garment using Pollinations.ai (free, no API key).
 *
 * Usage:  node scripts/generate-images.mjs
 *
 * Outputs images to public/catalog/ following the naming convention in productImages.ts.
 * Only generates the primary on-model image (-women.jpg or -men.jpg) per product.
 */

import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const CATALOG_DIR = join(import.meta.dirname, "..", "public", "catalog");

// Map of garment id → { slug, name, gender, fabric, swatch, features }
// Extracted from garments.ts to avoid ESM/TS import issues
const GARMENTS = [
  {
    slug: "saffron-coat",
    name: "Saffron Tailored Coat",
    gender: "women",
    fabric: "Wool / Cashmere",
    color: "saffron gold",
  },
  {
    slug: "espresso-blazer",
    name: "Espresso Double-Breasted Blazer",
    gender: "men",
    fabric: "Italian wool",
    color: "espresso brown",
  },
  {
    slug: "bone-trench",
    name: "Bone Trench",
    gender: "women",
    fabric: "Cotton gabardine",
    color: "bone cream",
  },
  {
    slug: "nehru-jacket",
    name: "Navy Nehru Jacket",
    gender: "men",
    fabric: "Raw silk",
    color: "navy blue",
  },
  {
    slug: "sherwani-ivory",
    name: "Ivory Sherwani",
    gender: "men",
    fabric: "Silk brocade",
    color: "ivory white",
  },
  {
    slug: "sherwani-maroon",
    name: "Maroon Silk Sherwani",
    gender: "men",
    fabric: "Dupion silk",
    color: "maroon",
  },
  {
    slug: "bandhgala-black",
    name: "Black Bandhgala",
    gender: "men",
    fabric: "Tropical wool",
    color: "black",
  },
  {
    slug: "quilted-jacket",
    name: "Quilted Linen Jacket",
    gender: "men",
    fabric: "Washed linen",
    color: "stone grey",
  },
  {
    slug: "bomber-olive",
    name: "Olive Bomber Jacket",
    gender: "men",
    fabric: "Nylon / cotton",
    color: "olive green",
  },
  {
    slug: "cape-camel",
    name: "Camel Wool Cape",
    gender: "women",
    fabric: "Virgin wool",
    color: "camel",
  },
  {
    slug: "puffer-navy",
    name: "Navy Puffer Vest",
    gender: "men",
    fabric: "Recycled nylon / down",
    color: "navy",
  },
  {
    slug: "cream-silk-blouse",
    name: "Cream Silk Blouse",
    gender: "women",
    fabric: "Silk crêpe",
    color: "cream",
  },
  {
    slug: "clay-linen-dress",
    name: "Clay Linen Dress",
    gender: "women",
    fabric: "Belgian linen",
    color: "clay brown",
  },
  {
    slug: "sage-cashmere-knit",
    name: "Sage Cashmere Knit",
    gender: "women",
    fabric: "Cashmere blend",
    color: "sage green",
  },
  {
    slug: "white-chikankari-kurta",
    name: "White Chikankari Kurta",
    gender: "men",
    fabric: "Cotton voile",
    color: "white",
  },
  {
    slug: "mustard-printed-kurta",
    name: "Mustard Printed Kurta",
    gender: "women",
    fabric: "Cotton / silk",
    color: "mustard yellow",
  },
  {
    slug: "breton-striped-tee",
    name: "Breton Striped Tee",
    gender: "women",
    fabric: "Organic cotton jersey",
    color: "navy and white stripes",
  },
  {
    slug: "oxford-button-down",
    name: "Oxford Button-Down",
    gender: "men",
    fabric: "Oxford cotton",
    color: "light blue",
  },
  {
    slug: "banarasi-silk-saree",
    name: "Banarasi Silk Saree",
    gender: "women",
    fabric: "Banarasi silk with zari",
    color: "deep red with gold",
  },
  {
    slug: "handloom-linen-saree",
    name: "Handloom Linen Saree",
    gender: "women",
    fabric: "Handloom linen",
    color: "indigo with silver",
  },
  {
    slug: "pleated-midi-dress",
    name: "Pleated Midi Dress",
    gender: "women",
    fabric: "Viscose georgette",
    color: "dusty rose",
  },
  {
    slug: "anarkali-red",
    name: "Red Anarkali Suit",
    gender: "women",
    fabric: "Georgette with sequin",
    color: "bright red with gold embroidery",
  },
  {
    slug: "anarkali-blue",
    name: "Royal Blue Anarkali",
    gender: "women",
    fabric: "Silk georgette",
    color: "royal blue",
  },
  {
    slug: "kurta-set-olive",
    name: "Olive Kurta Set",
    gender: "men",
    fabric: "Cotton linen",
    color: "olive green",
  },
  {
    slug: "kurta-set-pink",
    name: "Blush Kurta Set",
    gender: "women",
    fabric: "Modal silk",
    color: "blush pink",
  },
  {
    slug: "polo-navy",
    name: "Navy Piqué Polo",
    gender: "men",
    fabric: "Piqué cotton",
    color: "navy blue",
  },
  {
    slug: "henley-grey",
    name: "Grey Henley",
    gender: "men",
    fabric: "Slub cotton",
    color: "heather grey",
  },
  {
    slug: "crop-top-black",
    name: "Black Cropped Top",
    gender: "women",
    fabric: "Stretch jersey",
    color: "black",
  },
  {
    slug: "tunic-ivory",
    name: "Ivory Embroidered Tunic",
    gender: "women",
    fabric: "Cotton silk",
    color: "ivory with thread-work",
  },
  {
    slug: "silk-cami",
    name: "Champagne Silk Camisole",
    gender: "women",
    fabric: "Charmeuse silk",
    color: "champagne gold",
  },
  {
    slug: "denim-shirt",
    name: "Chambray Denim Shirt",
    gender: "women",
    fabric: "Japanese chambray",
    color: "light indigo",
  },
  {
    slug: "kanjivaram-saree",
    name: "Kanjivaram Silk Saree",
    gender: "women",
    fabric: "Kanjivaram silk",
    color: "temple red with gold border",
  },
  {
    slug: "chiffon-saree",
    name: "Seafoam Chiffon Saree",
    gender: "women",
    fabric: "Pure chiffon",
    color: "seafoam green",
  },
  {
    slug: "wrap-dress-emerald",
    name: "Emerald Wrap Dress",
    gender: "women",
    fabric: "Matte jersey",
    color: "emerald green",
  },
  {
    slug: "shirt-dress-white",
    name: "White Shirt Dress",
    gender: "women",
    fabric: "Poplin cotton",
    color: "crisp white",
  },
  {
    slug: "black-silk-kurta",
    name: "Black Silk Kurta",
    gender: "men",
    fabric: "Raw silk",
    color: "black",
  },
  {
    slug: "linen-blue-kurta",
    name: "Blue Linen Kurta",
    gender: "men",
    fabric: "European linen",
    color: "cerulean blue",
  },
  {
    slug: "saffron-wide-trouser",
    name: "Saffron Wide-Leg Trouser",
    gender: "women",
    fabric: "Gabardine",
    color: "saffron gold",
  },
  {
    slug: "ink-tailored-trouser",
    name: "Ink Tailored Trouser",
    gender: "men",
    fabric: "Tropical wool",
    color: "ink black",
  },
  {
    slug: "indigo-selvedge-denim",
    name: "Indigo Selvedge Denim",
    gender: "men",
    fabric: "Japanese selvedge",
    color: "deep indigo",
  },
  {
    slug: "khaki-chinos",
    name: "Khaki Chinos",
    gender: "men",
    fabric: "Brushed twill",
    color: "khaki",
  },
  {
    slug: "black-salwar",
    name: "Black Salwar",
    gender: "women",
    fabric: "Viscose crepe",
    color: "black",
  },
  {
    slug: "teal-lehenga-skirt",
    name: "Teal Lehenga Skirt",
    gender: "women",
    fabric: "Raw silk with gota",
    color: "teal with gold border",
  },
  {
    slug: "red-lehenga-skirt",
    name: "Bridal Red Lehenga",
    gender: "women",
    fabric: "Velvet with zardozi",
    color: "deep red with gold zardozi",
  },
  {
    slug: "palazzo-cream",
    name: "Cream Palazzo Pants",
    gender: "women",
    fabric: "Rayon crepe",
    color: "cream",
  },
  {
    slug: "jogger-charcoal",
    name: "Charcoal Joggers",
    gender: "men",
    fabric: "French terry",
    color: "charcoal grey",
  },
  {
    slug: "dhoti-white",
    name: "White Cotton Dhoti",
    gender: "men",
    fabric: "Handloom cotton",
    color: "white with gold border",
  },
  {
    slug: "pleated-skirt-navy",
    name: "Navy Pleated Skirt",
    gender: "women",
    fabric: "Suiting wool",
    color: "navy blue",
  },
  {
    slug: "linen-shorts-sand",
    name: "Sand Linen Shorts",
    gender: "men",
    fabric: "Garment-dyed linen",
    color: "sand",
  },
  {
    slug: "nude-square-toe-heel",
    name: "Nude Square-Toe Heel",
    gender: "women",
    fabric: "Nappa leather",
    color: "nude",
  },
  {
    slug: "cognac-penny-loafer",
    name: "Cognac Penny Loafer",
    gender: "men",
    fabric: "Polished calf",
    color: "cognac brown",
  },
  {
    slug: "tan-kolhapuri",
    name: "Tan Kolhapuri",
    gender: "women",
    fabric: "Vegetable-tanned leather",
    color: "tan",
  },
  {
    slug: "white-minimal-sneaker",
    name: "White Minimal Sneaker",
    gender: "men",
    fabric: "Full-grain leather",
    color: "white",
  },
  {
    slug: "gold-jutti",
    name: "Gold Embroidered Jutti",
    gender: "women",
    fabric: "Silk with zari thread",
    color: "gold",
  },
  {
    slug: "brown-oxford",
    name: "Brown Cap-Toe Oxford",
    gender: "men",
    fabric: "Burnished calf",
    color: "brown",
  },
  {
    slug: "black-sandal",
    name: "Black Strappy Sandal",
    gender: "women",
    fabric: "Nappa leather",
    color: "black",
  },
  {
    slug: "chelsea-boot-tan",
    name: "Tan Chelsea Boot",
    gender: "men",
    fabric: "Suede",
    color: "tan",
  },
  {
    slug: "maroon-mojari",
    name: "Maroon Mojari",
    gender: "men",
    fabric: "Velvet / leather",
    color: "maroon",
  },
  {
    slug: "sage-silk-scarf",
    name: "Sage Silk Scarf",
    gender: "women",
    fabric: "Silk twill",
    color: "sage green",
  },
  {
    slug: "gold-zari-dupatta",
    name: "Gold Zari Dupatta",
    gender: "women",
    fabric: "Organza with zari",
    color: "gold",
  },
  {
    slug: "canvas-tote",
    name: "Canvas Tote",
    gender: "women",
    fabric: "Waxed canvas / leather trim",
    color: "olive",
  },
  {
    slug: "gold-clutch",
    name: "Gold Evening Clutch",
    gender: "women",
    fabric: "Metal frame / brocade",
    color: "gold",
  },
  {
    slug: "leather-belt-tan",
    name: "Tan Leather Belt",
    gender: "men",
    fabric: "Bridle leather",
    color: "tan",
  },
  {
    slug: "minimal-watch",
    name: "Minimal Watch",
    gender: "men",
    fabric: "Stainless steel",
    color: "silver",
  },
  {
    slug: "pashmina-stole",
    name: "Ivory Pashmina Stole",
    gender: "women",
    fabric: "Pure pashmina",
    color: "ivory",
  },
  {
    slug: "red-potli",
    name: "Red Silk Potli Bag",
    gender: "women",
    fabric: "Silk with bead work",
    color: "red",
  },
  {
    slug: "pearl-brooch",
    name: "Pearl Crescent Brooch",
    gender: "women",
    fabric: "Brass / freshwater pearl",
    color: "pearl white",
  },
  {
    slug: "saffron-turban",
    name: "Saffron Silk Turban",
    gender: "men",
    fabric: "Silk satin",
    color: "saffron",
  },
];

function buildPrompt(g) {
  const person =
    g.gender === "women" ? "a beautiful Indian woman model" : "a handsome Indian man model";

  const isAccessory = [
    "Scarf",
    "Dupatta",
    "Tote",
    "Clutch",
    "Belt",
    "Watch",
    "Stole",
    "Potli",
    "Brooch",
    "Turban",
  ].some((k) => g.name.includes(k));
  const isShoe = [
    "Heel",
    "Loafer",
    "Kolhapuri",
    "Sneaker",
    "Jutti",
    "Oxford",
    "Sandal",
    "Boot",
    "Mojari",
  ].some((k) => g.name.includes(k));

  let wearing;
  if (isShoe) {
    wearing = `wearing stylish ${g.name} shoes in ${g.color}, ${g.fabric}, close-up on feet, fashion editorial`;
  } else if (isAccessory) {
    wearing = `elegantly styled with ${g.name} accessory in ${g.color}, ${g.fabric}, fashion editorial portrait`;
  } else {
    wearing = `wearing a stunning ${g.name} in ${g.color}, made of ${g.fabric}, full body shot, fashion editorial`;
  }

  return `Professional fashion photography, ${person} ${wearing}, clean white studio background, soft natural lighting, 4K, high fashion magazine quality, sharp focus, elegant pose`;
}

async function downloadImage(url, filepath, retries = 3) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url);
    if (res.status === 429) {
      const wait = (attempt + 1) * 15000;
      console.log(`    rate-limited, waiting ${wait / 1000}s...`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    await writeFile(filepath, buffer);
    return buffer.length;
  }
  throw new Error("rate-limited after retries");
}

async function main() {
  if (!existsSync(CATALOG_DIR)) {
    await mkdir(CATALOG_DIR, { recursive: true });
  }

  console.log(`Generating ${GARMENTS.length} product images...`);
  console.log(`Output: ${CATALOG_DIR}\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < GARMENTS.length; i++) {
    const g = GARMENTS[i];
    const suffix = g.gender === "women" ? "-women.jpg" : "-men.jpg";
    const filename = `${g.slug}${suffix}`;
    const filepath = join(CATALOG_DIR, filename);

    if (existsSync(filepath)) {
      console.log(`[${i + 1}/${GARMENTS.length}] SKIP ${filename} (exists)`);
      success++;
      continue;
    }

    const prompt = buildPrompt(g);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=1067&seed=${i * 7 + 42}&nologo=true&model=flux`;

    console.log(`[${i + 1}/${GARMENTS.length}] ${filename} ...`);

    try {
      const bytes = await downloadImage(url, filepath);
      console.log(`  ✓ ${(bytes / 1024).toFixed(0)} KB`);
      success++;
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
      failed++;
    }

    // delay to stay under Pollinations rate limit
    if (i < GARMENTS.length - 1) {
      await new Promise((r) => setTimeout(r, 8000));
    }
  }

  console.log(`\nDone: ${success} generated, ${failed} failed out of ${GARMENTS.length}`);
}

main().catch(console.error);
