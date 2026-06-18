# Vestra Atelier

A virtual fitting room platform and marketing site for fashion brands. Shoppers upload a photograph and see garments rendered on their body in seconds.

## Stack

- **Frontend:** React 19, TanStack Start (SSR), Tailwind CSS 4, Framer Motion
- **Design system:** "Maison" — bone/saffron palette, Fraunces serif + Inter Tight sans
- **Components:** Radix UI / shadcn/ui (50+ components), custom sections
- **Deployment target:** Cloudflare Workers via Nitro (configurable to Vercel)
- **Tests:** Vitest (unit/integration), Playwright (E2E)

## Run locally

```bash
npm install
npm run dev          # starts on http://localhost:5173
npm run build        # production build
npm run test         # unit tests
npm run test:e2e     # end-to-end tests (requires Playwright browsers: npx playwright install)
npm run typecheck    # TypeScript strict check
npm run lint         # ESLint + Prettier
```

## Folder map

```
src/
  routes/          File-based routing (TanStack Router)
  sections/        Marketing page sections (Hero, Problem, Solution, etc.)
  components/      Shared UI components (Header, Footer, Eyebrow, etc.)
  components/ui/   shadcn/ui primitives
  data/            Centralised marketing copy and garment catalog
  lib/             Utilities, validation, security headers, stubs
  lib/stubs/       Backend stubs (analytics, storage, try-on, forms, auth)
  assets/          Images
  styles.css       Design tokens and utility classes
  server.ts        SSR entry with security headers
e2e/               Playwright end-to-end tests
handoff/           Client delivery documents
public/            Static assets (sitemap, manifest, favicon)
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Marketing homepage (11 sections) |
| `/try-on` | Virtual fitting room interactive demo |
| `/for-brands` | Brand partnership page |
| `/contact` | Demo request form |
| `/about` | About page |
| `/privacy` | Privacy policy (GDPR, India DPDP) |
| `/terms` | Terms of service |
