import look1 from "@/assets/look-1.jpg";
import look2 from "@/assets/look-2.jpg";
import look3 from "@/assets/look-3.jpg";

export type GarmentCategory = "outerwear" | "top" | "bottom" | "accessory";
export type GarmentGender = "unisex" | "men" | "women";

export interface Garment {
  id: string;
  name: string;
  brand: string;
  category: GarmentCategory;
  gender: GarmentGender;
  swatch: string;
  fabric: string;
  price: number;
  image: string;
  features?: string;
}

export const garments: Garment[] = [
  {
    id: "cream-silk-blouse",
    name: "Cream Silk Blouse",
    brand: "Maison Nord",
    category: "top",
    gender: "women",
    swatch: "#f3ead7",
    fabric: "Silk crepe",
    price: 2999,
    image: "/demo/shop/cream-silk-blouse.jpg",
    features: "French seams, pearl buttons, bias cut",
  },
  {
    id: "clay-linen-dress",
    name: "Clay Linen Dress",
    brand: "Atelier Vestra",
    category: "top",
    gender: "women",
    swatch: "#B5544A",
    fabric: "Belgian linen",
    price: 3499,
    image: "/demo/shop/clay-linen-dress.jpg",
    features: "A line silhouette, side pockets, relaxed shoulder",
  },
  {
    id: "churidar-red",
    name: "Red Churidar Kurta",
    brand: "Atelier Vestra",
    category: "top",
    gender: "women",
    swatch: "#c0392b",
    fabric: "Cotton with zari embroidery",
    price: 4999,
    image: "/demo/shop/churidar-red.jpg",
    features: "Straight-cut kurta, fitted churidar, contrast dupatta",
  },
  {
    id: "banarasi-saree",
    name: "Banarasi Silk Saree",
    brand: "Atelier Vestra",
    category: "top",
    gender: "women",
    swatch: "#8B0000",
    fabric: "Banarasi silk with zari",
    price: 12999,
    image: "/demo/shop/banarasi-saree.jpg",
    features: "Heavy zari border, six yard drape, matching pallu",
  },
  {
    id: "midi-dress-green",
    name: "Pleated Midi Dress",
    brand: "Maison Nord",
    category: "top",
    gender: "women",
    swatch: "#7a9e8e",
    fabric: "Crepe",
    price: 2799,
    image: "/demo/shop/midi-dress-green.jpg",
    features: "Accordion pleats, wrap waist, midi length",
  },
  {
    id: "espresso-blazer",
    name: "Espresso Double Breasted Blazer",
    brand: "Loom & Co",
    category: "outerwear",
    gender: "men",
    swatch: "#3a2a20",
    fabric: "Italian wool",
    price: 7999,
    image: "/demo/shop/espresso-blazer.jpg",
    features: "Peak lapel, horn buttons, ticket pocket",
  },
  {
    id: "nehru-jacket",
    name: "Charcoal Nehru Jacket",
    brand: "Atelier Vestra",
    category: "outerwear",
    gender: "men",
    swatch: "#4a4a4a",
    fabric: "Raw silk",
    price: 4999,
    image: "/demo/shop/nehru-jacket.jpg",
    features: "Mandarin collar, concealed buttons, side vents",
  },
  {
    id: "sherwani-ivory",
    name: "Ivory Sherwani",
    brand: "Loom & Co",
    category: "outerwear",
    gender: "men",
    swatch: "#f0e8d8",
    fabric: "Silk brocade",
    price: 18999,
    image: "/demo/shop/sherwani-ivory.jpg",
    features: "Resham embroidery, floor length, silk satin lining",
  },
  {
    id: "kurta-set-olive",
    name: "Green Kurta Set",
    brand: "Loom & Co",
    category: "top",
    gender: "men",
    swatch: "#5a8c2a",
    fabric: "Khadi cotton",
    price: 2799,
    image: "/demo/shop/kurta-set-olive.jpg",
    features: "Kurta with churidar, wooden buttons, mandarin collar",
  },
  {
    id: "oxford-button-down",
    name: "Oxford Button Down",
    brand: "Loom & Co",
    category: "top",
    gender: "men",
    swatch: "#7eacd4",
    fabric: "Oxford cotton",
    price: 1499,
    image: "/demo/shop/oxford-button-down.jpg",
    features: "Button down collar, single needle stitching, back pleat",
  },
];

export const lookbook = [
  {
    id: "look-1",
    src: look1,
    title: "Saffron, Sunlit",
    brand: "Atelier Vestra",
    caption: "Suiting No. 04 — wool and cashmere over silk shirting",
    pieces: ["cream-silk-blouse", "clay-linen-dress"],
  },
  {
    id: "look-2",
    src: look2,
    title: "Clay & Sage",
    brand: "Atelier Vestra × Maison Nord",
    caption: "Resort drop, look No. 11 — Belgian linen with silk crepe",
    pieces: ["clay-linen-dress", "cream-silk-blouse"],
  },
  {
    id: "look-3",
    src: look3,
    title: "Atelier Espresso",
    brand: "Loom & Co",
    caption: "Tailoring No. 08 — Italian wool over cream silk",
    pieces: ["espresso-blazer", "oxford-button-down"],
  },
] as const;

export function formatPrice(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}
