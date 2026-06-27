import process from "node:process";

export interface TryOnProviderResult {
  imageUrl: string;
  durationMs: number;
  confidence: number;
  provider: "fashn" | "fal" | "gradio" | "gemini" | "mock";
  queued?: boolean;
}

type FashnCategory = "tops" | "bottoms" | "one-pieces" | "auto";
type TryOnMode = "tryon" | "edit";

function resolveProvider(): "fashn" | "fal" | "gradio" | "gemini" | "none" {
  const v = (process.env.TRYON_PROVIDER ?? "none").toLowerCase();
  if (v === "fashn" || v === "fal" || v === "gradio" || v === "gemini") return v;
  if (process.env.GEMINI_API_KEY && v === "none") return "gemini";
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
    body: JSON.stringify({ model_name: "tryon-v1.6", inputs }),
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

async function runGradio(
  personImage: string,
  garmentImage: string,
  category: FashnCategory = "auto",
): Promise<TryOnProviderResult> {
  const { Client } = await import("@gradio/client");

  const spaceUrl = process.env.TRYON_API_URL ?? "franciszzj/Leffa";
  const hfToken = process.env.TRYON_API_KEY || undefined;

  const start = Date.now();

  const client = await Client.connect(spaceUrl, {
    token: hfToken as `hf_${string}` | undefined,
  });

  const personBlob = await urlOrBase64ToBlob(personImage);
  const garmentBlob = await urlOrBase64ToBlob(garmentImage);

  const leffaCategory =
    category === "bottoms" ? "lower_body" : category === "tops" ? "upper_body" : "dresses";

  const result = await client.predict("/leffa_predict_vt", [
    personBlob,
    garmentBlob,
    false,
    30,
    2.5,
    42,
    "dress_code",
    leffaCategory,
    false,
  ]);

  const data = result.data as Array<{ url?: string } | string>;
  let imageUrl = "";

  if (typeof data[0] === "string") {
    imageUrl = data[0];
  } else if (data[0] && typeof data[0] === "object" && "url" in data[0]) {
    imageUrl = data[0].url ?? "";
  }

  if (!imageUrl) {
    throw new Error("Gradio returned no image");
  }

  return {
    imageUrl,
    durationMs: Date.now() - start,
    confidence: 0.85,
    provider: "gradio",
  };
}

async function urlOrBase64ToBlob(input: string): Promise<Blob> {
  if (input.startsWith("data:")) {
    const [header, b64] = input.split(",");
    const mime = header.match(/data:(.*?);/)?.[1] ?? "image/jpeg";
    const buf = Buffer.from(b64, "base64");
    return new Blob([buf], { type: mime });
  }
  if (input.startsWith("http://") || input.startsWith("https://")) {
    const res = await fetch(input);
    return res.blob();
  }
  const buf = Buffer.from(input, "base64");
  return new Blob([buf], { type: "image/jpeg" });
}

function buildTryOnPrompt(garmentName?: string): string {
  const name = garmentName ?? "traditional Indian outfit";
  return `Dress the person in the first image in the outfit from the second image: a full-length traditional Indian ${name}. Cover the body head to toe, modestly and fully draped, and replace all existing clothing including any jeans or trousers. Keep the person's exact face, skin tone, body shape, and pose unchanged. Plain consistent studio background. Photographic, natural, no extra props, no held objects, no text.`;
}

async function runGemini(
  personImage: string,
  garmentImage: string,
  garmentName?: string,
): Promise<TryOnProviderResult> {
  const { GoogleGenAI } = await import("@google/genai");

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const ai = new GoogleGenAI({ apiKey });
  const start = Date.now();

  const personData = await imageToBase64(personImage);
  const garmentData = await imageToBase64(garmentImage);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: [
      {
        role: "user",
        parts: [
          { text: buildTryOnPrompt(garmentName) },
          { inlineData: { mimeType: "image/jpeg", data: personData } },
          { inlineData: { mimeType: "image/jpeg", data: garmentData } },
        ],
      },
    ],
    config: {
      responseModalities: ["IMAGE", "TEXT"],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imagePart = parts.find(
    (p: { inlineData?: { mimeType?: string; data?: string } }) => p.inlineData?.data,
  );

  if (!imagePart?.inlineData?.data) {
    const textPart = parts.find((p: { text?: string }) => p.text);
    throw new Error(
      `Gemini returned no image. ${textPart?.text ? `Response: ${(textPart.text as string).substring(0, 200)}` : "Empty response."}`,
    );
  }

  const mime = imagePart.inlineData.mimeType ?? "image/png";
  const dataUrl = `data:${mime};base64,${imagePart.inlineData.data}`;

  return {
    imageUrl: dataUrl,
    durationMs: Date.now() - start,
    confidence: 0.92,
    provider: "gemini",
  };
}

async function imageToBase64(input: string): Promise<string> {
  if (input.startsWith("data:")) {
    return input.split(",")[1];
  }
  if (input.startsWith("http://") || input.startsWith("https://") || input.startsWith("/")) {
    let url = input;
    if (input.startsWith("/")) {
      url = `file://${input}`;
      const { readFile } = await import("node:fs/promises");
      const buf = await readFile(input.startsWith("/") ? input : new URL(url));
      return buf.toString("base64");
    }
    const res = await fetch(url);
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.toString("base64");
  }
  return input;
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
  if (provider === "gradio" && garmentImage) return runGradio(personImage, garmentImage, category);
  if (provider === "gemini" && garmentImage)
    return runGemini(personImage, garmentImage, instruction);
  return runMock();
}

export function getProviderName(): "fashn" | "fal" | "gradio" | "gemini" | "none" {
  return resolveProvider();
}
