// BACKEND STUB — in production, send to a CRM webhook (HubSpot, Salesforce) and trigger a confirmation email.

export interface DemoRequest {
  name: string;
  house: string;
  email: string;
  role?: string;
  catalogue?: string;
  message?: string;
}

export async function submitDemoRequest(data: DemoRequest): Promise<{ ok: boolean }> {
  // BACKEND STUB — simulates a 600ms network delay.
  await new Promise((r) => setTimeout(r, 600));
  console.info("[vestra:forms] demo request", data.email);
  return { ok: true };
}

export async function subscribeNewsletter(email: string): Promise<{ ok: boolean }> {
  // BACKEND STUB — simulates subscribing to a mailing list.
  await new Promise((r) => setTimeout(r, 400));
  console.info("[vestra:forms] newsletter subscribe", email);
  return { ok: true };
}
