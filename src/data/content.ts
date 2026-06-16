/**
 * All marketing copy in one place. Edit here, not in components.
 */

export const brand = {
  name: "VESTRA",
  domain: "vestra.ai",
  tagline: "See Every Look Before You Buy.",
  manifesto: "Helping shoppers see themselves before they buy.",
  description:
    "Vestra is the virtual fitting room for fashion. Shoppers see exactly how a full outfit looks on them — before they buy, before they return.",
} as const;

export const nav = [
  { label: "Atelier", to: "/" },
  { label: "Try On", to: "/try-on" },
  { label: "For Brands", to: "/for-brands" },
  { label: "House", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export const hero = {
  eyebrow: "Virtual Fitting Room — Couture-grade AI",
  title: "See every look,\nbefore you buy.",
  body: "Vestra renders a full outfit on the shopper, in their light, on their body. Returns fall. Conversion rises. The dressing room follows them home.",
  primaryCta: { label: "Open the dressing room", to: "/try-on" },
  secondaryCta: { label: "For brands", to: "/for-brands" },
};

export const stats = [
  { value: "−38%", label: "Returns, on average" },
  { value: "+24%", label: "Add-to-cart on enabled PDPs" },
  { value: "1.4s", label: "Median time to first render" },
  { value: "97%", label: "Photo-real match accuracy" },
];

export const howItWorks = [
  {
    n: "01",
    title: "A single photograph",
    body: "The shopper uploads one full-length photo. No scanning rig, no app. Lighting, posture, skin tone — all preserved.",
  },
  {
    n: "02",
    title: "The garment, draped",
    body: "Our model fits the chosen pieces to the body with cloth-aware physics. Fabric, drape, hem, and shadow behave the way an atelier would expect.",
  },
  {
    n: "03",
    title: "The full look",
    body: "Layer outerwear, swap a scarf, change a shoe. The look composes in seconds — and the shopper decides with their own eyes.",
  },
];

export const features = [
  {
    title: "Cloth-aware rendering",
    body: "Fabric weight, sheen, and drape are simulated per garment — silk falls like silk, wool sits like wool.",
  },
  {
    title: "Full outfit composition",
    body: "Not a single hero piece. A complete look — outerwear over top over bottom over shoe — rendered in one frame.",
  },
  {
    title: "Brand-faithful colour",
    body: "Calibrated against your hex and pantone references so the shopper sees the colour you sell, not the colour the camera guessed.",
  },
  {
    title: "Embeds in your PDP",
    body: "A single script tag. Vestra inherits your typography, your spacing, your voice. No iframe seams.",
  },
  {
    title: "Private by design",
    body: "Shopper photos are processed in-session and never used for training. Auditable retention windows.",
  },
  {
    title: "Merchandiser console",
    body: "Upload a lookbook, see which try-ons converted, retire pieces that fit poorly. Closed-loop merchandising data, finally.",
  },
];

export const brandsUsing = [
  "Maison Aurelle",
  "Hessen & Co.",
  "Atelier Noir",
  "Fjord Studio",
  "Soleil Paris",
  "Marcellin",
  "Norden Knit",
  "Roma Edit",
];

export const testimonial = {
  quote:
    "We replaced six months of sample shoots with one upload pipeline. Returns dropped by a third in the first quarter — and our merchandising team can finally see which pieces flatter, before we cut them.",
  author: "Hélène Marceau",
  role: "Head of Ecommerce, Maison Aurelle",
};

export const forBrands = {
  eyebrow: "For fashion & retail leaders",
  title: "Less guesswork.\nFewer returns.",
  body: "Vestra fits inside the workflow you already have. A script tag on your PDP, a CSV of your SKUs, and your shoppers start seeing themselves in your clothes within a week.",
  bullets: [
    "Live on Shopify, Salesforce Commerce Cloud, and custom storefronts",
    "Average integration: 6 working days",
    "Per-SKU pricing, no per-shopper fees",
    "EU and US data residency",
  ],
};

export const aboutSections = [
  {
    eyebrow: "The house",
    title: "Built by people who have run the dressing room.",
    body: "Vestra was founded by a former buyer at Browns and two computer-vision researchers. We started because we were tired of watching beautiful garments come back in boxes — bought hopefully, returned silently.",
  },
  {
    eyebrow: "The method",
    title: "Couture-grade rendering, in software.",
    body: "Our models are trained on consented studio captures, not scraped imagery. We measure ourselves against the atelier, not against other software.",
  },
  {
    eyebrow: "The promise",
    title: "The shopper sees themselves. Always.",
    body: "We will never replace the shopper's face. We will never invent a body. Vestra is a mirror with better memory — nothing more, nothing less.",
  },
];

export const contact = {
  eyebrow: "Begin the conversation",
  title: "Tell us about your house.",
  body: "A short note is enough. We reply within a working day.",
  email: "atelier@vestra.ai",
  address: "12 rue de Sévigné, 75004 Paris — 41 Great Eastern Street, London EC2A 3EY",
};
