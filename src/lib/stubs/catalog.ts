// BACKEND STUB — in production, fetch from a catalog API or CMS.
import { garments, lookbook, type Garment } from "@/data/garments";

export async function fetchGarments(): Promise<Garment[]> {
  return garments;
}

export async function fetchGarment(id: string): Promise<Garment | null> {
  return garments.find((g) => g.id === id) ?? null;
}

export function getLookbook() {
  return lookbook;
}
