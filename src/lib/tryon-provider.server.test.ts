import { afterEach, describe, expect, it, vi } from "vitest";
import { generateTryOn, getProviderName } from "./tryon-provider.server";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("OpenRouter try-on provider", () => {
  it("uses two image references and returns the generated image", async () => {
    vi.stubEnv("TRYON_PROVIDER", "openrouter");
    vi.stubEnv("VESTRA_OPENROUTER_API_KEY", "company-test-key");
    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: [{ b64_json: "dGVzdA==", media_type: "image/jpeg" }] }), {
        status: 200,
      }),
    );
    vi.stubGlobal("fetch", mockFetch);

    const image = "data:image/jpeg;base64,dGVzdA==";
    const result = await generateTryOn(image, image, "auto", "tryon", "Churidar Kurta");

    expect(getProviderName()).toBe("openrouter");
    expect(result.imageUrl).toBe(image);
    expect(result.provider).toBe("openrouter");
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://openrouter.ai/api/v1/images");
    expect(options.headers).toMatchObject({ Authorization: "Bearer company-test-key" });
    const body = JSON.parse(options.body as string);
    expect(body.model).toBe("black-forest-labs/flux.2-klein-4b");
    expect(body.input_references).toHaveLength(2);
    expect(body.input_references[0].image_url.url).toBe(image);
    expect(body.input_references[1].image_url.url).toBe(image);
  });

  it("does not silently claim success when OpenRouter returns no image", async () => {
    vi.stubEnv("TRYON_PROVIDER", "openrouter");
    vi.stubEnv("VESTRA_OPENROUTER_API_KEY", "company-test-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: [] }))));

    const image = "data:image/jpeg;base64,dGVzdA==";
    await expect(generateTryOn(image, image)).rejects.toThrow("OpenRouter returned no image");
  });
});
