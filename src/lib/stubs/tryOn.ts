export interface TryOnRequest {
  personImage: string;
  garmentImage: string;
  garmentId: string;
  category?: string;
}

export interface TryOnResult {
  imageUrl: string;
  durationMs: number;
  confidence: number;
  provider: string;
  mock: boolean;
}

export type TryOnStage =
  | { kind: "idle" }
  | { kind: "uploading"; progress: number }
  | { kind: "rendering"; progress: number; etaMs: number }
  | { kind: "queued"; message: string }
  | { kind: "done"; result: TryOnResult }
  | { kind: "error"; message: string };

const isLive =
  typeof window !== "undefined" &&
  (import.meta.env.VITE_TRYON_MODE === "live" || import.meta.env.VITE_TRYON_MODE === "LIVE");

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function* runTryOn(
  req: TryOnRequest,
  prebakedUrl?: string,
): AsyncGenerator<TryOnStage> {
  yield { kind: "uploading", progress: 0 };
  await wait(200);
  yield { kind: "uploading", progress: 50 };
  await wait(200);
  yield { kind: "uploading", progress: 100 };

  if (!isLive || prebakedUrl) {
    const totalMs = 2000;
    const start = Date.now();
    while (Date.now() - start < totalMs) {
      const elapsed = Date.now() - start;
      const progress = Math.min(99, Math.round((elapsed / totalMs) * 100));
      yield { kind: "rendering", progress, etaMs: Math.max(0, totalMs - elapsed) };
      await wait(150);
    }

    yield {
      kind: "done",
      result: {
        imageUrl: prebakedUrl ?? req.personImage,
        durationMs: 2000,
        confidence: 0.97,
        provider: "demo",
        mock: true,
      },
    };
    return;
  }

  yield { kind: "rendering", progress: 5, etaMs: 30000 };

  try {
    const res = await fetch("/api/tryon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopperImage: req.personImage,
        garmentImage: req.garmentImage,
        mode: "tryon",
        category: req.category ?? "one-pieces",
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Server error" }));
      yield {
        kind: "error",
        message: (body as { error?: string }).error ?? `Server error (${res.status})`,
      };
      return;
    }

    const data = (await res.json()) as TryOnResult & { fallback?: boolean; message?: string };

    if (data.fallback) {
      yield { kind: "error", message: data.message ?? "Provider unavailable" };
      return;
    }

    yield {
      kind: "done",
      result: {
        imageUrl: data.imageUrl,
        durationMs: data.durationMs,
        confidence: data.confidence,
        provider: data.provider,
        mock: data.mock,
      },
    };
  } catch (err) {
    yield {
      kind: "error",
      message: err instanceof Error ? err.message : "Network error",
    };
  }
}
