export type TryOnGarmentCategory = "upper_body" | "lower_body" | "dresses";

export interface TryOnLook {
  id: string;
  name: string;
  gender: "women" | "men";
  image: string;
  shopLink: string;
  fabric: string;
  description: string;
  garmentCategory: TryOnGarmentCategory;
  prebakedResults?: Record<string, string>;
}

export interface PersonPreset {
  id: string;
  label: string;
  gender: "women" | "men";
  src: string;
}

export const PERSON_PRESETS: PersonPreset[] = [
  { id: "woman-1", label: "Priya", gender: "women", src: "/demo/people/woman-1.jpg" },
  { id: "woman-2", label: "Anika", gender: "women", src: "/demo/people/woman-2.jpg" },
  { id: "man-1", label: "Arjun", gender: "men", src: "/demo/people/man-1.jpg" },
  { id: "man-2", label: "Rohan", gender: "men", src: "/demo/people/man-2.jpg" },
];

export const TRYON_LOOKS: TryOnLook[] = [
  {
    id: "tryon-anarkali",
    name: "Anarkali Suit",
    gender: "women",
    image: "/demo/garments/anarkali-suit.jpg",
    shopLink: "/shop?search=anarkali",
    fabric: "Georgette with thread work",
    description: "Floor-length flared kali with churidar and dupatta",
    garmentCategory: "dresses",
    prebakedResults: {
      "woman-1": "/demo/results/woman-1--anarkali.jpg",
      "woman-2": "/demo/results/woman-2--anarkali.jpg",
    },
  },
  {
    id: "tryon-lehenga",
    name: "Lehenga Choli",
    gender: "women",
    image: "/demo/garments/lehenga-choli.jpg",
    shopLink: "/shop?search=lehenga",
    fabric: "Raw silk with gota patti",
    description: "Bridal lehenga with embroidered choli and net dupatta",
    garmentCategory: "dresses",
    prebakedResults: {
      "woman-1": "/demo/results/woman-1--lehenga.jpg",
      "woman-2": "/demo/results/woman-2--lehenga.jpg",
    },
  },
  {
    id: "tryon-salwar",
    name: "Salwar Kameez",
    gender: "women",
    image: "/demo/garments/salwar-kameez.jpg",
    shopLink: "/shop?search=salwar",
    fabric: "Cotton silk blend",
    description: "Straight-cut kameez with palazzo salwar and printed dupatta",
    garmentCategory: "dresses",
    prebakedResults: {
      "woman-1": "/demo/results/woman-1--salwar.jpg",
      "woman-2": "/demo/results/woman-2--salwar.jpg",
    },
  },
  {
    id: "tryon-kurta-nehru",
    name: "Kurta with Nehru Jacket",
    gender: "men",
    image: "/demo/garments/kurta-nehru.jpg",
    shopLink: "/shop?search=kurta",
    fabric: "Khadi cotton with raw silk jacket",
    description: "Knee-length kurta paired with a mandarin-collar Nehru jacket",
    garmentCategory: "dresses",
    prebakedResults: {
      "man-1": "/demo/results/man-1--kurta-nehru.jpg",
      "man-2": "/demo/results/man-2--kurta-nehru.jpg",
    },
  },
  {
    id: "tryon-sherwani",
    name: "Sherwani",
    gender: "men",
    image: "/demo/garments/sherwani.jpg",
    shopLink: "/shop?search=sherwani",
    fabric: "Silk brocade with resham embroidery",
    description: "Floor-length sherwani with churidar for weddings and celebrations",
    garmentCategory: "dresses",
    prebakedResults: {
      "man-1": "/demo/results/man-1--sherwani.jpg",
      "man-2": "/demo/results/man-2--sherwani.jpg",
    },
  },
];

export function getLookById(id: string): TryOnLook | undefined {
  return TRYON_LOOKS.find((l) => l.id === id);
}

export function getLooksByGender(gender: "women" | "men"): TryOnLook[] {
  return TRYON_LOOKS.filter((l) => l.gender === gender);
}
