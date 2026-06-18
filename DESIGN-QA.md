# Design QA — Vestra Atelier

Visual design QA performed at 375px (mobile), 768px (tablet), and 1280px (desktop) viewports.

## Section audit

| Section | 375px | 768px | 1280px | Tokens | Type | Eyebrow | Shimmer | Surfaces | Layout | Buttons | Rhythm | Motion | Notes |
|---------|-------|-------|--------|--------|------|---------|---------|----------|--------|---------|--------|--------|-------|
| Nav | Pass | Pass | Pass | Pass | Pass | n/a | n/a | Pass | Hamburger on mobile, full on md+ | Pass | Pass | Pass | — |
| Hero | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Editorial split, stacks on mobile | Pass | Pass | Pass | — |
| Problem | Pass | Pass | Pass | Pass | Pass | Pass | n/a | Pass | 7/5 editorial split, stats stack on mobile | Pass | Pass | Pass | — |
| Solution | Pass | Pass | Pass | Pass | Pass | Pass | n/a | Pass | 8-col editorial, stacks on mobile | Pass | Pass | Pass | — |
| HowItWorks | Pass | Pass | Pass | Pass | Pass | Pass | n/a | Pass | Split with numbered steps | Pass | Pass | Pass | — |
| Lookbook | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass | 3-col cards, stack on mobile | Pass | Pass | Pass | Shimmer on AI badges only |
| Stats | Pass | Pass | Pass | Pass | Pass | Pass | n/a | Pass | 4-col grid, stacks on mobile | Pass | Pass | Pass | — |
| ForBrands | Pass | Pass | Pass | Pass | Pass | Pass | n/a | Pass | Image + editorial + feature grid | Pass | Pass | Pass | — |
| Integrations | Pass | Pass | Pass | Pass | Pass | Pass | n/a | Pass | 4-col restrained grid, 2x2 on tablet | Pass | Pass | Pass | — |
| Pricing | Pass | Pass | Pass | Pass | Pass | Pass | n/a | Pass | 3-col tiers, featured border-saffron, stacks on mobile | Pass | Pass | Pass | Centered layout; editorial asymmetry was considered but centered is appropriate for comparison layout |
| FAQ | Pass | Pass | Pass | Pass | Pass | Pass | n/a | Pass | 4/8 editorial split with Radix accordion | Pass | Pass | Pass | Accordion restyled: no hover-underline, ink-soft chevron |
| CTA | Pass | Pass | Pass | Pass | Pass | Pass | n/a | Pass | Editorial + newsletter capture + lookbook preview | Pass | Pass | Pass | — |
| Footer | Pass | Pass | Pass | Pass | Pass | n/a | n/a | Pass | Manifesto + nav + contact columns | Pass | Pass | Pass | Privacy/Terms linked |
| Cookie Consent | Pass | Pass | Pass | Pass | n/a | n/a | n/a | Pass | Bottom banner, btn-primary + btn-ghost | Pass | Pass | n/a | — |

## Design system fixes applied

1. **Accordion hover-underline removed** — Stock shadcn accordion had `hover:underline` on triggers. Removed to match editorial design system.
2. **Accordion chevron colour** — Changed from `text-muted-foreground` (default Tailwind) to `text-ink-soft` (design token).
3. **TryOnDemo action buttons** — Removed conflicting `btn-ghost` class from small Save/Share/Shop buttons that fully override it with inline sizing. Added proper hover transition.
4. **Cookie consent analytics gating** — `track()` now checks `localStorage("vestra-cookie-consent") === "all"` before firing. Analytics is blocked until user explicitly accepts.
5. **.gitignore** — Added `.env` and `.env.*` patterns (was missing; security risk).

## Token audit

- No raw hex values in section components (only in garments.ts product data and chart.tsx Recharts selectors — both acceptable).
- No default Tailwind grays (`slate`, `gray`, `zinc`, `neutral`, `stone`) used as colours in any section component.
- All shadows use `shadow-fabric` / `shadow-fabric-sm` tokens. Stock shadcn components (dialog, sheet, dropdown) retain `shadow-lg` for modals only — not visible on marketing pages.
- All radii use `rounded-sm` (cards) or `rounded-full` (pills/buttons). No oversized radii.

## Accessibility

- Skip link present in root layout.
- All headings use `font-display` (Fraunces serif).
- All images have alt text.
- Accordion is keyboard-navigable via Radix primitives.
- Focus rings visible on all interactive elements.
- Saffron buttons: contrast ratio on bone background meets WCAG AA for large text (button text is 14px/500 weight — passes at 4.5:1).
- All form inputs have associated labels.
- Fitting room: ARIA live region on render progress.

## CSP note

`script-src 'self' 'unsafe-inline'` is required because TanStack Start injects inline scripts for SSR hydration data serialisation. Without `unsafe-inline`, the page renders blank. Switching to nonce-based CSP requires TanStack Start framework support for nonce injection into serialised data scripts — not currently available. This is documented as a known limitation.

## Validation endpoints

| Endpoint / Handler | Schema | Status |
|---|---|---|
| Contact form (`/contact`) | `contactFormSchema` (Zod) | Active |
| Try-on request | `tryOnRequestSchema` (Zod) | Active (stub backend) |
| Newsletter subscribe | Client-side email validation | Active |

## Rate limiting

In-memory sliding-window limiter (`src/lib/rate-limit.ts`). Functional — tracks per-key request counts and blocks after threshold. Must move to Redis / Cloudflare Durable Objects for production (single-process memory does not survive restarts or scale across workers).
