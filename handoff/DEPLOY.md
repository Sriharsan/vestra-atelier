# Deployment Runbook — Vestra Atelier (Vercel)

## Prerequisites

- A Vercel account (free tier is fine for launch)
- Node.js 20+ locally
- The repository pushed to GitHub / GitLab / Bitbucket

## 1. Connect the repository

1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New Project**.
3. Import the repository containing this codebase.
4. Set the **Root Directory** to the folder that contains `package.json` (if the repo root is the project root, leave blank).

## 2. Build settings

| Setting | Value |
|---------|-------|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `.output` (Nitro default) or `dist` — check after first build |
| Install Command | `npm install` |
| Node.js Version | 20.x |

If TanStack Start with Nitro outputs to `.output`, set that. Otherwise Vite's default is `dist`.

## 3. Environment variables

Set these in **Project Settings > Environment Variables**:

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `production` |
| `VITE_SITE_URL` | Yes | Your production URL, e.g. `https://vestra.ai` |
| `VITE_TRYON_MODE` | No | `demo` (default) or `live` when the real API is ready |

No secrets are needed for the demo deployment. When the live try-on API is connected, add:

| Variable | Required | Description |
|----------|----------|-------------|
| `TRYON_API_URL` | For live mode | URL of the rendering API |
| `TRYON_API_KEY` | For live mode | API key for the rendering service |

Never commit secrets to the repository. The `.gitignore` already excludes `.env` and `.env.*`.

## 4. Domain

1. In Vercel, go to **Project Settings > Domains**.
2. Add your custom domain (e.g. `vestra.ai`).
3. Follow Vercel's DNS instructions to point your domain.
4. Vercel provisions an SSL certificate automatically.

## 5. First deploy

Push to the branch connected in Vercel (usually `main`). Vercel builds and deploys automatically.

Verify:
- Homepage loads with all sections
- Try-on page renders the fitting room
- Privacy and Terms pages load
- Contact form shows the form fields
- No console errors in browser DevTools
- Security headers are present (check with `curl -I https://your-domain.com`)

## 6. Ongoing

- Every push to `main` triggers a production deployment.
- Pull request branches get preview deployments automatically.
- Vercel shows build logs and deployment status in the dashboard.

## 7. Rollback

If a deployment breaks production:
1. Go to **Deployments** in the Vercel dashboard.
2. Find the last working deployment.
3. Click the three-dot menu and select **Promote to Production**.

## 8. Analytics (optional)

Vercel Analytics can be enabled in **Project Settings > Analytics**. The site already has a consent-gated analytics stub that logs to console in development. Connect your preferred analytics provider when ready.
