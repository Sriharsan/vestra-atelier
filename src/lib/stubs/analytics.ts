/**
 * BACKEND STUB — analytics events.
 * Replace with Segment / PostHog / your warehouse pipeline.
 */
export function track(event: string, props?: Record<string, unknown>): void {
  if (typeof window !== "undefined") {
    const consent = localStorage.getItem("vestra-cookie-consent");
    if (consent !== "all") return;
  }

  if (typeof process !== "undefined" && process.env?.NODE_ENV === "development") {
    console.info("[vestra:analytics]", event, props);
  }
  // BACKEND STUB — in production, send to Segment, PostHog, or your warehouse pipeline.
}
