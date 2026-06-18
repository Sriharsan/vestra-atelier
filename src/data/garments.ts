import look1 from "@/assets/look-1.jpg";
import look2 from "@/assets/look-2.jpg";
import look3 from "@/assets/look-3.jpg";

export type GarmentCategory = "outerwear" | "top" | "bottom" | "shoe" | "accessory";

export interface Garment {
  id: string;
  name: string;
  brand: string;
  category: GarmentCategory;
  swatch: string;
  fabric: string;
  price: number;
  image: string;
}

// Placeholder image path — replace with real flat-lay or on-model photos per garment.
const PH = "/garment-placeholder.svg";

export const garments: Garment[] = [
  // ── Outerwear ─────────────────────────────────────────────
  {
    id: "o-saffron-coat",
    name: "Saffron Tailored Coat",
    brand: "Atelier Vestra",
    category: "outerwear",
    swatch: "#E0A435",
    fabric: "Wool / Cashmere",
    price: 89990,
    image: PH,
  },
  {
    id: "o-espresso-blazer",
    name: "Espresso Double-Breasted Blazer",
    brand: "Loom & Co",
    category: "outerwear",
    swatch: "#3a2a20",
    fabric: "Italian wool",
    price: 59990,
    image: PH,
  },
  {
    id: "o-bone-trench",
    name: "Bone Trench",
    brand: "Maison Nord",
    category: "outerwear",
    swatch: "#e7dfc9",
    fabric: "Cotton gabardine",
    price: 74990,
    image: PH,
  },
  {
    id: "o-nehru-jacket",
    name: "Navy Nehru Jacket",
    brand: "Atelier Vestra",
    category: "outerwear",
    swatch: "#1c2a4a",
    fabric: "Raw silk",
    price: 34990,
    image: PH,
  },
  {
    id: "o-sherwani-ivory",
    name: "Ivory Sherwani",
    brand: "Loom & Co",
    category: "outerwear",
    swatch: "#f0e8d8",
    fabric: "Silk brocade",
    price: 129990,
    image: PH,
  },

  // ── Tops ──────────────────────────────────────────────────
  {
    id: "t-cream-silk",
    name: "Cream Silk Blouse",
    brand: "Maison Nord",
    category: "top",
    swatch: "#f3ead7",
    fabric: "Silk crêpe",
    price: 24990,
    image: PH,
  },
  {
    id: "t-clay-linen",
    name: "Clay Linen Dress",
    brand: "Atelier Vestra",
    category: "top",
    swatch: "#B5544A",
    fabric: "Belgian linen",
    price: 39990,
    image: PH,
  },
  {
    id: "t-sage-knit",
    name: "Sage Cashmere Knit",
    brand: "Maison Nord",
    category: "top",
    swatch: "#8A9A7B",
    fabric: "Mongolian cashmere",
    price: 32990,
    image: PH,
  },
  {
    id: "t-kurta-white",
    name: "White Chikankari Kurta",
    brand: "Loom & Co",
    category: "top",
    swatch: "#faf8f3",
    fabric: "Lucknowi cotton",
    price: 8990,
    image: PH,
  },
  {
    id: "t-kurta-mustard",
    name: "Mustard Printed Kurta",
    brand: "Atelier Vestra",
    category: "top",
    swatch: "#c8a032",
    fabric: "Chanderi silk-cotton",
    price: 12990,
    image: PH,
  },
  {
    id: "t-striped-tee",
    name: "Breton Striped Tee",
    brand: "Maison Nord",
    category: "top",
    swatch: "#2c3e6b",
    fabric: "Organic cotton jersey",
    price: 4990,
    image: PH,
  },
  {
    id: "t-oxford-shirt",
    name: "Oxford Button-Down",
    brand: "Loom & Co",
    category: "top",
    swatch: "#7eacd4",
    fabric: "Oxford cotton",
    price: 6990,
    image: PH,
  },
  {
    id: "t-saree-banarasi",
    name: "Banarasi Silk Saree",
    brand: "Atelier Vestra",
    category: "top",
    swatch: "#8B0000",
    fabric: "Banarasi silk with zari",
    price: 49990,
    image: PH,
  },
  {
    id: "t-saree-linen",
    name: "Handloom Linen Saree",
    brand: "Loom & Co",
    category: "top",
    swatch: "#c4b89e",
    fabric: "Handwoven linen",
    price: 14990,
    image: PH,
  },
  {
    id: "t-midi-dress",
    name: "Pleated Midi Dress",
    brand: "Maison Nord",
    category: "top",
    swatch: "#4a6741",
    fabric: "Crepe",
    price: 19990,
    image: PH,
  },

  // ── Bottoms ───────────────────────────────────────────────
  {
    id: "b-saffron-trouser",
    name: "Saffron Wide Trouser",
    brand: "Atelier Vestra",
    category: "bottom",
    swatch: "#cf9530",
    fabric: "Wool / Cashmere",
    price: 37990,
    image: PH,
  },
  {
    id: "b-ink-trouser",
    name: "Ink Tailored Trouser",
    brand: "Loom & Co",
    category: "bottom",
    swatch: "#211C18",
    fabric: "Italian wool",
    price: 32990,
    image: PH,
  },
  {
    id: "b-denim-indigo",
    name: "Indigo Straight-Leg Denim",
    brand: "Maison Nord",
    category: "bottom",
    swatch: "#3a4f7a",
    fabric: "Japanese selvedge denim",
    price: 9990,
    image: PH,
  },
  {
    id: "b-chinos-khaki",
    name: "Khaki Chinos",
    brand: "Loom & Co",
    category: "bottom",
    swatch: "#b5a482",
    fabric: "Brushed cotton twill",
    price: 6990,
    image: PH,
  },
  {
    id: "b-salwar-black",
    name: "Black Salwar",
    brand: "Atelier Vestra",
    category: "bottom",
    swatch: "#1a1a1a",
    fabric: "Viscose crepe",
    price: 5990,
    image: PH,
  },
  {
    id: "b-lehenga-teal",
    name: "Teal Lehenga Skirt",
    brand: "Loom & Co",
    category: "bottom",
    swatch: "#1f6e6e",
    fabric: "Silk organza with sequin work",
    price: 69990,
    image: PH,
  },

  // ── Shoes ─────────────────────────────────────────────────
  {
    id: "s-heel-nude",
    name: "Nude Square-Toe Heel",
    brand: "Maison Nord",
    category: "shoe",
    swatch: "#c9a98a",
    fabric: "Calf leather",
    price: 28990,
    image: PH,
  },
  {
    id: "s-loafer-cognac",
    name: "Cognac Penny Loafer",
    brand: "Loom & Co",
    category: "shoe",
    swatch: "#8b5a2b",
    fabric: "Polished calf",
    price: 31990,
    image: PH,
  },
  {
    id: "s-kolhapuri",
    name: "Tan Kolhapuri Chappal",
    brand: "Atelier Vestra",
    category: "shoe",
    swatch: "#a0722a",
    fabric: "Vegetable-tanned leather",
    price: 4990,
    image: PH,
  },
  {
    id: "s-sneaker-white",
    name: "Minimal White Sneaker",
    brand: "Maison Nord",
    category: "shoe",
    swatch: "#f5f5f5",
    fabric: "Full-grain leather",
    price: 12990,
    image: PH,
  },

  // ── Accessories ───────────────────────────────────────────
  {
    id: "a-sage-scarf",
    name: "Sage Silk Scarf",
    brand: "Maison Nord",
    category: "accessory",
    swatch: "#8A9A7B",
    fabric: "Silk twill",
    price: 14990,
    image: PH,
  },
  {
    id: "a-dupatta-gold",
    name: "Gold Zari Dupatta",
    brand: "Loom & Co",
    category: "accessory",
    swatch: "#d4af37",
    fabric: "Chanderi silk with zari border",
    price: 9990,
    image: PH,
  },
  {
    id: "a-tote-canvas",
    name: "Canvas Tote",
    brand: "Atelier Vestra",
    category: "accessory",
    swatch: "#e0d5c0",
    fabric: "Waxed canvas / leather trim",
    price: 7990,
    image: PH,
  },
];

export const lookbook = [
  {
    id: "look-1",
    src: look1,
    title: "Saffron, Sunlit",
    brand: "Atelier Vestra",
    caption: "Suiting № 04 — wool / cashmere over silk shirting",
    pieces: ["o-saffron-coat", "t-cream-silk", "b-saffron-trouser"],
  },
  {
    id: "look-2",
    src: look2,
    title: "Clay & Sage",
    brand: "Atelier Vestra × Maison Nord",
    caption: "Resort drop, look № 11 — Belgian linen with silk twill",
    pieces: ["t-clay-linen", "a-sage-scarf", "s-heel-nude"],
  },
  {
    id: "look-3",
    src: look3,
    title: "Atelier Espresso",
    brand: "Loom & Co",
    caption: "Tailoring № 08 — Italian wool over cream silk",
    pieces: ["o-espresso-blazer", "t-cream-silk", "b-ink-trouser", "s-loafer-cognac"],
  },
] as const;

export function formatPrice(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}
