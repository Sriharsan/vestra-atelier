import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { applySecurityHeaders } from "./lib/security-headers";
import { tryOnRequestSchema, demoRequestSchema, subscribeSchema } from "./lib/validation";
import { checkRateLimit } from "./lib/rate-limit";
import { generateTryOn, getProviderName } from "./lib/tryon-provider.server";
import { insertDocument, findByEmail } from "./lib/db.server";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

const MAX_BODY_BYTES = 12 * 1024 * 1024;
const SESSION_GEN_CAP = 20;
const sessionGenerations = new Map<string, number>();

async function handleTryOn(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const ip = clientIp(request);
  const rateCheck = checkRateLimit(ip, 10, 60_000);
  if (!rateCheck.allowed) {
    return jsonResponse(
      { error: "Rate limit exceeded", retryAfterMs: rateCheck.retryAfterMs },
      429,
    );
  }

  const genCount = sessionGenerations.get(ip) ?? 0;
  if (genCount >= SESSION_GEN_CAP) {
    return jsonResponse(
      {
        error: "Session generation cap reached",
        detail: `Maximum ${SESSION_GEN_CAP} generations per session to manage cost.`,
      },
      429,
    );
  }

  const contentLength = parseInt(request.headers.get("content-length") ?? "0", 10);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonResponse({ error: "Request body too large (max 12 MB)" }, 413);
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const parsed = tryOnRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return jsonResponse({ error: "Validation failed", issues: parsed.error.issues }, 400);
  }

  const { shopperImage, garmentImage, category, mode, instruction } = parsed.data;

  try {
    const result = await generateTryOn(
      shopperImage,
      garmentImage,
      (category as "tops" | "bottoms" | "one-pieces" | "auto") ?? "auto",
      mode,
      instruction,
    );

    sessionGenerations.set(ip, genCount + 1);

    return jsonResponse({
      imageUrl: result.imageUrl,
      durationMs: result.durationMs,
      confidence: result.confidence,
      provider: result.provider,
      mock: result.provider === "mock",
    });
  } catch (error) {
    console.error("Try-on provider error:", error);
    return jsonResponse({
      imageUrl: "",
      durationMs: 0,
      confidence: 0,
      provider: "mock",
      mock: true,
      fallback: true,
      message: "Provider unavailable — showing preview instead.",
    });
  }
}

async function handleDemo(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const ip = clientIp(request);
  const rateCheck = checkRateLimit(`demo:${ip}`, 5, 60_000);
  if (!rateCheck.allowed) {
    return jsonResponse({ error: "Rate limit exceeded" }, 429);
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const parsed = demoRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return jsonResponse({ error: "Validation failed", issues: parsed.error.issues }, 400);
  }

  const { persisted } = await insertDocument("demo_requests", parsed.data);

  return jsonResponse({
    success: true,
    persisted,
    ...(!persisted && {
      note: "Submission accepted but persistence is unavailable. For production, set MONGODB_URI to a hosted database (MongoDB Atlas).",
    }),
  });
}

async function handleSubscribe(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const ip = clientIp(request);
  const rateCheck = checkRateLimit(`sub:${ip}`, 5, 60_000);
  if (!rateCheck.allowed) {
    return jsonResponse({ error: "Rate limit exceeded" }, 429);
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const parsed = subscribeSchema.safeParse(rawBody);
  if (!parsed.success) {
    return jsonResponse({ error: "Validation failed", issues: parsed.error.issues }, 400);
  }

  const exists = await findByEmail("subscribers", parsed.data.email);
  if (exists) {
    return jsonResponse({ success: true, persisted: true, duplicate: true });
  }

  const { persisted } = await insertDocument("subscribers", parsed.data);

  return jsonResponse({
    success: true,
    persisted,
    ...(!persisted && {
      note: "Subscription accepted but persistence is unavailable. For production, set MONGODB_URI.",
    }),
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return applySecurityHeaders(
        jsonResponse({ status: "ok", timestamp: new Date().toISOString() }),
      );
    }

    if (url.pathname === "/api/tryon") {
      return applySecurityHeaders(await handleTryOn(request));
    }

    if (url.pathname === "/api/tryon/provider") {
      return applySecurityHeaders(jsonResponse({ provider: getProviderName() }));
    }

    if (url.pathname === "/api/demo") {
      return applySecurityHeaders(await handleDemo(request));
    }

    if (url.pathname === "/api/subscribe") {
      return applySecurityHeaders(await handleSubscribe(request));
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return applySecurityHeaders(await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return applySecurityHeaders(
        new Response(renderErrorPage(), {
          status: 500,
          headers: { "content-type": "text/html; charset=utf-8" },
        }),
      );
    }
  },
};
