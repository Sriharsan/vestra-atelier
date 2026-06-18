# What I Need From You

Items the client must supply or decide before the site can move from demo to production.

---

## Before launch (demo mode)

| Item | Why | Format |
|------|-----|--------|
| Final logo files | The current logo is a text placeholder | SVG preferred, PNG fallback |
| Hero image(s) | The hero section needs a real product photograph | High-res JPG/WebP, landscape, at least 1600px wide |
| Lookbook images | Three sample rendered looks used in the lookbook section | High-res JPG/WebP, portrait, at least 800px wide |
| Brand photography | For-brands section, about page, and other editorial slots | High-res JPG/WebP |
| Final pricing | The pricing tiers show placeholder figures | Confirmed GBP amounts and feature lists per tier |
| Final statistics | "By the numbers" section uses placeholder metrics | Confirmed figures for returns reduction, add-to-cart lift, render time, match accuracy |
| Contact form endpoint | The form currently logs to console | An email address, webhook URL, or CRM integration |
| Newsletter endpoint | The email capture in the footer currently logs to console | Mailchimp, Loops, or similar integration details |
| Domain name | Where the site will live | DNS access or nameserver delegation to Vercel |
| Legal review | Privacy policy and terms are templates | Reviewed and approved versions from your legal team |

## Before live try-on (switching from demo to live mode)

| Item | Why | Format |
|------|-----|--------|
| Try-on API endpoint | The rendering engine URL | HTTPS URL |
| Try-on API key | Authentication for the rendering service | Secret, set as env var |
| Garment catalogue | Real garment data to replace sample items | JSON or API endpoint with garment images, names, categories |
| Shopper photo handling decision | How long to retain uploaded photos, where to process | Policy decision + infrastructure choice |

## Optional enhancements

| Item | Why |
|------|-----|
| Analytics provider | Replace the console stub with real tracking (e.g. PostHog, Mixpanel, GA4) |
| Error monitoring | Add Sentry or similar for production error tracking |
| CMS | If marketing copy will change frequently, connect a headless CMS |
| CDN for images | Serve garment and lookbook images from a CDN for faster global delivery |
