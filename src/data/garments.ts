import look1 from "@/assets/look-1.jpg";
import look2 from "@/assets/look-2.jpg";
import look3 from "@/assets/look-3.jpg";

export type GarmentCategory = "outerwear" | "top" | "bottom" | "shoe" | "accessory";

export interface Garment {
  id: string;
  name: string;
  house: string;
  category: GarmentCategory;
  swatch: string; // hex, used as small chip in UI
  fabric: string;
  priceGBP: number;
}

export const garments: Garment[] = [
  // Outerwear
  {
    id: "o-saffron-coat",
    name: "Saffron Tailored Coat",
    house: "Maison Aurelle",
    category: "outerwear",
    swatch: "#E0A435",
    fabric: "Wool / Cashmere",
    priceGBP: 1490,
  },
  {
    id: "o-espresso-blazer",
    name: "Espresso Double-Breasted Blazer",
    house: "Hessen & Co.",
    category: "outerwear",
    swatch: "#3a2a20",
    fabric: "Italian wool",
    priceGBP: 980,
  },
  {
    id: "o-bone-trench",
    name: "Bone Trench",
    house: "Atelier Noir",
    category: "outerwear",
    swatch: "#e7dfc9",
    fabric: "Cotton gabardine",
    priceGBP: 1240,
  },

  // Tops
  {
    id: "t-cream-silk",
    name: "Cream Silk Blouse",
    house: "Soleil Paris",
    category: "top",
    swatch: "#f3ead7",
    fabric: "Silk crêpe",
    priceGBP: 420,
  },
  {
    id: "t-clay-linen",
    name: "Clay Linen Dress",
    house: "Marcellin",
    category: "top",
    swatch: "#B5544A",
    fabric: "Belgian linen",
    priceGBP: 680,
  },
  {
    id: "t-sage-knit",
    name: "Sage Cashmere Knit",
    house: "Norden Knit",
    category: "top",
    swatch: "#8A9A7B",
    fabric: "Mongolian cashmere",
    priceGBP: 540,
  },

  // Bottoms
  {
    id: "b-saffron-trouser",
    name: "Saffron Wide Trouser",
    house: "Maison Aurelle",
    category: "bottom",
    swatch: "#cf9530",
    fabric: "Wool / Cashmere",
    priceGBP: 620,
  },
  {
    id: "b-ink-trouser",
    name: "Ink Tailored Trouser",
    house: "Hessen & Co.",
    category: "bottom",
    swatch: "#211C18",
    fabric: "Italian wool",
    priceGBP: 540,
  },

  // Shoes
  {
    id: "s-heel-nude",
    name: "Nude Square-Toe Heel",
    house: "Roma Edit",
    category: "shoe",
    swatch: "#c9a98a",
    fabric: "Calf leather",
    priceGBP: 480,
  },
  {
    id: "s-loafer-cognac",
    name: "Cognac Penny Loafer",
    house: "Fjord Studio",
    category: "shoe",
    swatch: "#8b5a2b",
    fabric: "Polished calf",
    priceGBP: 520,
  },

  // Accessories
  {
    id: "a-sage-scarf",
    name: "Sage Silk Scarf",
    house: "Soleil Paris",
    category: "accessory",
    swatch: "#8A9A7B",
    fabric: "Silk twill",
    priceGBP: 240,
  },
];

export const lookbook = [
  {
    id: "look-1",
    src: look1,
    title: "Saffron, Sunlit",
    house: "Maison Aurelle",
    caption: "Suiting № 04 — wool / cashmere over silk shirting",
    pieces: ["o-saffron-coat", "t-cream-silk", "b-saffron-trouser"],
  },
  {
    id: "look-2",
    src: look2,
    title: "Clay & Sage",
    house: "Marcellin × Soleil Paris",
    caption: "Resort drop, look № 11 — Belgian linen with silk twill",
    pieces: ["t-clay-linen", "a-sage-scarf", "s-heel-nude"],
  },
  {
    id: "look-3",
    src: look3,
    title: "Atelier Espresso",
    house: "Hessen & Co.",
    caption: "Tailoring № 08 — Italian wool over cream silk",
    pieces: ["o-espresso-blazer", "t-cream-silk", "b-ink-trouser", "s-loafer-cognac"],
  },
] as const;
