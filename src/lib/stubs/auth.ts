/**
 * BACKEND STUB — authentication.
 * No real auth in this demo. Wire up to your IdP of choice in production.
 */

export interface Session {
  email: string;
  house: string;
}

export async function requestMagicLink(_email: string): Promise<{ ok: true }> {
  // BACKEND STUB — send a magic link via your email provider.
  await new Promise((r) => setTimeout(r, 600));
  return { ok: true };
}

export async function getSession(): Promise<Session | null> {
  // BACKEND STUB — read session cookie / JWT.
  return null;
}
