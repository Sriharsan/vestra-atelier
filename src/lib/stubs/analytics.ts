/**
 * BACKEND STUB — analytics events.
 * Replace with Segment / PostHog / your warehouse pipeline.
 */
export function track(event: string, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line no-console
  console.info("[vestra:analytics]", event, props ?? {});
}
