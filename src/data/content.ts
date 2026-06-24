/**
 * All marketing copy in one place. Edit here, not in components.
 *
 * LOCALE = IN — sample data uses Indian names, addresses, ₹ prices, +91 phones.
 * Brand name stays "Vestra". Only sample data and contacts are localized.
 *
 * Swap in real brand names you have rights to use where you see
 * "Atelier Vestra", "Loom & Co", "Maison Nord".
 */

export const brand = {
  name: "VESTRA",
  domain: "vestra.in",
  tagline: "See Every Look Before You Buy.",
  manifesto: "Helping shoppers see themselves before they buy.",
  description:
    "Vestra is the virtual fitting room for fashion. Shoppers see exactly how a full outfit looks on them — before they buy, before they return.",
} as const;

export const nav = [
  { label: "Atelier", to: "/" },
  { label: "Shop", to: "/shop" },
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
  "Atelier Vestra",
  "Loom & Co",
  "Maison Nord",
  "Fjord Studio",
  "Soleil Paris",
  "Marcellin",
  "Norden Knit",
  "Roma Edit",
];

export const testimonial = {
  quote:
    "We replaced six months of sample shoots with one upload pipeline. Returns dropped by a third in the first quarter — and our merchandising team can finally see which pieces flatter, before we cut them.",
  author: "Kavitha Ramachandran",
  role: "Head of Ecommerce, Atelier Vestra",
};

export const forBrands = {
  eyebrow: "For fashion & retail leaders",
  title: "Less guesswork.\nFewer returns.",
  body: "Vestra fits inside the workflow you already have. A script tag on your PDP, a CSV of your SKUs, and your shoppers start seeing themselves in your clothes within a week.",
  bullets: [
    "Live on Shopify, Salesforce Commerce Cloud, and custom storefronts",
    "Average integration: 6 working days",
    "Per-SKU pricing, no per-shopper fees",
    "India and global data residency",
  ],
};

export const aboutSections = [
  {
    eyebrow: "The house",
    title: "Built by people who have run the dressing room.",
    body: "Vestra was founded by a former buyer and two computer-vision researchers. We started because we were tired of watching beautiful garments come back in boxes — bought hopefully, returned silently.",
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
  email: "atelier@vestra.in",
  phone: "+91 80 4567 8900",
  address: "91 MG Road, Bengaluru 560001, Karnataka, India",
};

export const problem = {
  eyebrow: "The gap on the rack",
  title: "Shoppers want to see themselves.\nMost stores still ask them to imagine.",
  body: "Sixty-four percent of fashion returns happen because the garment didn't look the way the shopper expected. The dressing room closes when the browser opens — and the return label is already in the box.",
  stats: [
    { value: "64%", note: "of returns are fit or appearance related" },
    { value: "₹58,000 Cr", note: "returned fashion in India alone, annually" },
  ],
};

export const solution = {
  eyebrow: "What changes",
  title: "Give the shopper a mirror\nthat works from anywhere.",
  body: "Vestra brings the fitting room to the product page. One photograph, every garment in the catalogue, rendered on the shopper in seconds. No app, no rig, no guesswork.",
};

export const integrations = {
  eyebrow: "Runs where you run",
  title: "One script tag.\nYour store, your look.",
  body: "Vestra drops into your existing storefront with a single line of code. No rebuild, no migration, no separate app for the shopper to download.",
  platforms: [
    { name: "Shopify", note: "Theme app embed" },
    { name: "Salesforce Commerce Cloud", note: "Cartridge" },
    { name: "Magento", note: "Extension" },
    { name: "Custom storefront", note: "Script tag" },
  ],
};

export const pricing = {
  eyebrow: "Pricing",
  title: "Per SKU.\nNot per shopper.",
  body: "Every plan includes unlimited try-ons. You pay for the catalogue you render, not the traffic you receive.",
  tiers: [
    {
      name: "Atelier",
      audience: "For emerging houses",
      price: "From ₹14,999 / mo",
      includes: [
        "Up to 200 SKUs",
        "Unlimited shopper renders",
        "Standard cloth rendering",
        "Email support",
      ],
      featured: false,
    },
    {
      name: "Maison",
      audience: "For established brands",
      price: "From ₹49,999 / mo",
      includes: [
        "Up to 2,000 SKUs",
        "Unlimited shopper renders",
        "Couture-grade cloth rendering",
        "Merchandiser console",
        "Priority support",
      ],
      featured: true,
    },
    {
      name: "Haute",
      audience: "For luxury groups",
      price: "Custom",
      includes: [
        "Unlimited SKUs",
        "Unlimited shopper renders",
        "Bespoke model tuning",
        "Dedicated account team",
        "SLA and data residency",
      ],
      featured: false,
    },
  ],
};

export const faq = [
  {
    q: "How accurate is the rendering?",
    a: "Our median photo-real match accuracy is 97%, measured against studio photography of the same garment on the same person. Fabric weight, drape, and colour are all simulated per SKU.",
  },
  {
    q: "Does the shopper need to download an app?",
    a: "No. Vestra runs entirely in the browser, embedded in your product page. The shopper uploads one photograph and sees the result in seconds.",
  },
  {
    q: "What happens to the shopper's photograph?",
    a: "Photographs are processed in-session and deleted after rendering. They are never used for model training and never shared with third parties. Retention windows are auditable and configurable per brand.",
  },
  {
    q: "How long does integration take?",
    a: "Most brands are live within six working days. Shopify and Salesforce Commerce Cloud have pre-built integrations. Custom storefronts use a single script tag.",
  },
  {
    q: "Can I control which garments are available for try-on?",
    a: "Yes. The merchandiser console lets you enable or disable try-on per SKU, per collection, or per season. You can also retire pieces that fit poorly based on conversion data.",
  },
  {
    q: "What about sizing and fit recommendations?",
    a: "Vestra shows the shopper how the garment looks, not how it will fit in a specific size. We complement size-recommendation tools rather than replacing them.",
  },
  {
    q: "Can I try the live rendering on my own catalogue?",
    a: "The demo on this site uses sample looks to illustrate the experience. To run a live pilot with your own catalogue and shopper photos, book a demo and our team will set up a private atelier for your brand.",
  },
];

export const outfitPresets = [
  {
    name: "Casual",
    garmentIds: ["o-bone-trench", "t-sage-knit", "b-denim-indigo"],
  },
  {
    name: "Professional",
    garmentIds: ["o-espresso-blazer", "t-oxford-shirt", "b-palazzo-cream"],
  },
  {
    name: "Night Out",
    garmentIds: ["t-clay-linen", "t-silk-cami", "b-palazzo-cream"],
  },
  {
    name: "Festive",
    garmentIds: ["o-nehru-jacket", "t-kurta-white", "a-potli-red"],
  },
];
