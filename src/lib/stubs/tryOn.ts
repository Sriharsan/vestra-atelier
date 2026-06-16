/**
 * BACKEND STUB — virtual try-on.
 *
 * In production this calls a model-serving endpoint that composites the
 * selected garments onto the uploaded shopper photograph. Here we simulate
 * the lifecycle so the UI can be built end-to-end against a stable contract.
 */

import type { Garment } from "@/data/garments";

export interface TryOnRequest {
  shopperImage: File | string; // File from <input>, or a URL for demo presets
  garmentIds: string[];
  /** Optional lighting / pose hints — passed straight through in production. */
  hints?: {
    indoor?: boolean;
    seed?: number;
  };
}

export interface TryOnResult {
  id: string;
  imageUrl: string;
  garments: Garment[];
  /** Milliseconds the render took, surfaced to the merchandiser console. */
  durationMs: number;
  /** 0..1 — model self-reported drape confidence. */
  confidence: number;
}

export type TryOnStage =
  | { kind: "idle" }
  | { kind: "uploading"; progress: number }
  | { kind: "rendering"; progress: number; etaMs: number }
  | { kind: "done"; result: TryOnResult }
  | { kind: "error"; message: string };

/**
 * BACKEND STUB — replace with a real call to the model service.
 * Streams stage updates via an async generator so the UI can paint the
 * iridescent shimmer while the render is in flight.
 */
export async function* runTryOn(
  req: TryOnRequest,
  resolveResult: (req: TryOnRequest) => TryOnResult,
): AsyncGenerator<TryOnStage> {
  // Upload phase
  for (let p = 0; p <= 100; p += 20) {
    await wait(80);
    yield { kind: "uploading", progress: p };
  }

  // Render phase
  const totalMs = 2200;
  const start = Date.now();
  while (Date.now() - start < totalMs) {
    const elapsed = Date.now() - start;
    const progress = Math.min(99, Math.round((elapsed / totalMs) * 100));
    yield { kind: "rendering", progress, etaMs: Math.max(0, totalMs - elapsed) };
    await wait(140);
  }

  yield { kind: "done", result: resolveResult(req) };
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
