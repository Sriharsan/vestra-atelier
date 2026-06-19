import process from "node:process";

export interface TryOnProviderResult {
  imageUrl: string;
  durationMs: number;
  confidence: number;
  provider: "fashn" | "fal" | "mock";
}

type FashnCategory = "tops" | "bottoms" | "one-pieces" | "auto";
type TryOnMode = "tryon" | "edit";

function resolveProvider(): "fashn" | "fal" | "none" {
  const v = (process.env.TRYON_PROVIDER ?? "none").toLowerCase();
  if (v === "fashn" || v === "fal") return v;
  return "none";
}

async function runFashn(
  personImage: string,
  garmentImage: string | undefined,
  category: FashnCategory,
  mode: TryOnMode,
  instruction?: string,
): Promise<TryOnProviderResult> {
  const apiKey = process.env.FASHN_API_KEY;
  if (!apiKey) throw new Error("FASHN_API_KEY not set");

  const baseUrl = process.env.FASHN_BASE_URL ?? "https://api.fashn.ai";
  const start = Date.now();

  const inputs: Record<string, unknown> = {
    model_image: personImage,
    category,
    mode: "balanced",
    garment_photo_type: "auto",
    segmentation_free: true,
    num_samples: 1,
  };

  if (mode === "edit" && instruction) {
    inputs.instruction = instruction;
  } else if (garmentImage) {
    inputs.garment_image = garmentImage;
  }

  const runRes = await fetch(`${baseUrl}/v1/run`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model_name: "tryon-v1.6",
      inputs,
    }),
  });

  if (!runRes.ok) {
    const body = await runRes.text();
    throw new Error(`FASHN /v1/run failed (${runRes.status}): ${body}`);
  }

  const { id: predictionId, error: runError } = (await runRes.json()) as {
    id?: string;
    error?: string;
  };
  if (runError || !predictionId) throw new Error(runError ?? "No prediction ID returned");

  const maxPollMs = 180_000;
  const pollInterval = 2_000;
  const deadline = Date.now() + maxPollMs;

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, pollInterval));
    const statusRes = await fetch(`${baseUrl}/v1/status/${predictionId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!statusRes.ok) continue;

    const status = (await statusRes.json()) as {
      status: string;
      output?: string[];
      error?: { message?: string };
    };

    if (status.status === "completed" && status.output?.[0]) {
      return {
        imageUrl: status.output[0],
        durationMs: Date.now() - start,
        confidence: 0.95,
        provider: "fashn",
      };
    }
    if (
      status.status === "failed" ||
      status.status === "canceled" ||
      status.status === "time_out"
    ) {
      throw new Error(status.error?.message ?? `Prediction ${status.status}`);
    }
  }

  throw new Error("FASHN prediction timed out after 180s");
}

async function runFal(
  personImage: string,
  garmentImage: string | undefined,
  category: FashnCategory,
  mode: TryOnMode,
  instruction?: string,
): Promise<TryOnProviderResult> {
  const apiKey = process.env.FAL_KEY;
  if (!apiKey) throw new Error("FAL_KEY not set");

  const start = Date.now();

  const body: Record<string, unknown> = {
    model_image: personImage,
    category,
    mode: "balanced",
    garment_photo_type: "auto",
    segmentation_free: true,
    num_samples: 1,
  };

  if (mode === "edit" && instruction) {
    body.instruction = instruction;
  } else if (garmentImage) {
    body.garment_image = garmentImage;
  }

  const submitRes = await fetch("https://queue.fal.run/fal-ai/fashn/tryon/v1.5", {
    method: "POST",
    headers: {
      Authorization: `Key ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!submitRes.ok) {
    const errBody = await submitRes.text();
    throw new Error(`fal submit failed (${submitRes.status}): ${errBody}`);
  }

  const { request_id, status: initStatus } = (await submitRes.json()) as {
    request_id: string;
    status: string;
  };

  if (initStatus === "COMPLETED") {
    const resultRes = await fetch(
      `https://queue.fal.run/fal-ai/fashn/tryon/v1.5/requests/${request_id}`,
      { headers: { Authorization: `Key ${apiKey}` } },
    );
    const result = (await resultRes.json()) as { images?: { url: string }[] };
    if (result.images?.[0]?.url) {
      return {
        imageUrl: result.images[0].url,
        durationMs: Date.now() - start,
        confidence: 0.95,
        provider: "fal",
      };
    }
  }

  const maxPollMs = 180_000;
  const pollInterval = 2_000;
  const deadline = Date.now() + maxPollMs;

  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, pollInterval));
    const statusRes = await fetch(
      `https://queue.fal.run/fal-ai/fashn/tryon/v1.5/requests/${request_id}/status`,
      { headers: { Authorization: `Key ${apiKey}` } },
    );
    if (!statusRes.ok) continue;
    const status = (await statusRes.json()) as { status: string };

    if (status.status === "COMPLETED") {
      const resultRes = await fetch(
        `https://queue.fal.run/fal-ai/fashn/tryon/v1.5/requests/${request_id}`,
        { headers: { Authorization: `Key ${apiKey}` } },
      );
      const result = (await resultRes.json()) as { images?: { url: string }[] };
      if (result.images?.[0]?.url) {
        return {
          imageUrl: result.images[0].url,
          durationMs: Date.now() - start,
          confidence: 0.95,
          provider: "fal",
        };
      }
      throw new Error("fal completed but no image in response");
    }
    if (status.status === "FAILED") {
      throw new Error("fal prediction failed");
    }
  }

  throw new Error("fal prediction timed out after 180s");
}

async function runMock(): Promise<TryOnProviderResult> {
  await new Promise((r) => setTimeout(r, 1500));
  return { imageUrl: "", durationMs: 1400, confidence: 0.97, provider: "mock" };
}

export async function generateTryOn(
  personImage: string,
  garmentImage: string | undefined,
  category: FashnCategory = "auto",
  mode: TryOnMode = "tryon",
  instruction?: string,
): Promise<TryOnProviderResult> {
  const provider = resolveProvider();

  if (provider === "fashn") return runFashn(personImage, garmentImage, category, mode, instruction);
  if (provider === "fal") return runFal(personImage, garmentImage, category, mode, instruction);
  return runMock();
}

export function getProviderName(): "fashn" | "fal" | "none" {
  return resolveProvider();
}
