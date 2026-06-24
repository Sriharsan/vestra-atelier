/**
 * Single source of truth for product images.
 *
 * Each garment ID maps to four image paths under /public/catalog/:
 *   - flat:       garment laid flat / on hanger
 *   - womenModel: on a women's model
 *   - menModel:   on a men's model
 *   - tryOn:      sample try-on result image
 *
 * When a file is missing the UI renders a labeled placeholder.
 * To add real images, drop files into /public/catalog/ matching the
 * filenames listed here. See HANDOFF section at the bottom.
 */

export interface ProductImageSet {
  flat: string;
  womenModel: string;
  menModel: string;
  tryOn: string;
}

function img(id: string): ProductImageSet {
  return {
    flat: `/catalog/${id}-flat.jpg`,
    womenModel: `/catalog/${id}-women.jpg`,
    menModel: `/catalog/${id}-men.jpg`,
    tryOn: `/catalog/${id}-tryon.jpg`,
  };
}

export const productImages: Record<string, ProductImageSet> = {
  // ── Outerwear ─────────────────────────────────
  "o-saffron-coat": img("saffron-coat"),
  "o-espresso-blazer": img("espresso-blazer"),
  "o-bone-trench": img("bone-trench"),
  "o-nehru-jacket": img("nehru-jacket"),
  "o-sherwani-ivory": img("sherwani-ivory"),
  "o-sherwani-maroon": img("sherwani-maroon"),
  "o-bandhgala-black": img("bandhgala-black"),
  "o-quilted-jacket": img("quilted-jacket"),
  "o-bomber-olive": img("bomber-olive"),
  "o-cape-camel": img("cape-camel"),
  "o-puffer-navy": img("puffer-navy"),

  // ── Tops ──────────────────────────────────────
  "t-cream-silk": img("cream-silk-blouse"),
  "t-clay-linen": img("clay-linen-dress"),
  "t-sage-knit": img("sage-cashmere-knit"),
  "t-kurta-white": img("white-chikankari-kurta"),
  "t-kurta-mustard": img("mustard-printed-kurta"),
  "t-striped-tee": img("breton-striped-tee"),
  "t-oxford-shirt": img("oxford-button-down"),
  "t-saree-banarasi": img("banarasi-silk-saree"),
  "t-saree-linen": img("handloom-linen-saree"),
  "t-midi-dress": img("pleated-midi-dress"),
  "t-anarkali-red": img("anarkali-red"),
  "t-anarkali-blue": img("anarkali-blue"),
  "t-kurta-set-olive": img("kurta-set-olive"),
  "t-kurta-set-pink": img("kurta-set-pink"),
  "t-polo-navy": img("polo-navy"),
  "t-henley-grey": img("henley-grey"),
  "t-crop-top-black": img("crop-top-black"),
  "t-tunic-ivory": img("tunic-ivory"),
  "t-silk-cami": img("silk-cami"),
  "t-denim-shirt": img("denim-shirt"),
  "t-saree-kanjivaram": img("kanjivaram-saree"),
  "t-saree-chiffon": img("chiffon-saree"),
  "t-wrap-dress": img("wrap-dress-emerald"),
  "t-shirt-dress": img("shirt-dress-white"),
  "t-kurta-black-silk": img("black-silk-kurta"),

  // ── Bottoms ───────────────────────────────────
  "b-denim-indigo": img("indigo-selvedge-denim"),
  "b-palazzo-cream": img("palazzo-cream"),

  // ── Accessories ───────────────────────────────
  "a-potli-red": img("red-potli"),
};

// Set to false to show swatch placeholders instead of loading images
export const hasRealImages = true;

export function getProductImage(garmentId: string): ProductImageSet {
  return (
    productImages[garmentId] ?? {
      flat: "",
      womenModel: "",
      menModel: "",
      tryOn: "",
    }
  );
}

/**
 * HANDOFF — Image filenames to add
 *
 * Drop images into /public/catalog/ with these exact names.
 * Each product needs up to four images (all .jpg):
 *
 *   {slug}-flat.jpg      Garment on white/hanger, ~800×1067px
 *   {slug}-women.jpg     On women's model, ~800×1067px
 *   {slug}-men.jpg       On men's model, ~800×1067px
 *   {slug}-tryon.jpg     Sample try-on result, ~800×1067px
 *
 * Gender-specific items only need their matching model image:
 *   - women-only items: skip {slug}-men.jpg
 *   - men-only items: skip {slug}-women.jpg
 *
 * Full slug list (alphabetical):
 *
 * anarkali-blue, anarkali-red, banarasi-silk-saree, bandhgala-black,
 * black-salwar, black-sandal, black-silk-kurta, bomber-olive,
 * bone-trench, breton-striped-tee, brown-oxford, canvas-tote,
 * cape-camel, chelsea-boot-tan, chiffon-saree, clay-linen-dress,
 * cognac-penny-loafer, cream-silk-blouse, crop-top-black,
 * denim-shirt, dhoti-white, espresso-blazer, gold-clutch,
 * gold-jutti, gold-zari-dupatta, handloom-linen-saree,
 * henley-grey, indigo-selvedge-denim, ink-tailored-trouser,
 * jogger-charcoal, kanjivaram-saree, khaki-chinos,
 * kurta-set-olive, kurta-set-pink, leather-belt-tan,
 * linen-blue-kurta, linen-shorts-sand, maroon-mojari,
 * minimal-watch, mustard-printed-kurta, nehru-jacket,
 * nude-square-toe-heel, oxford-button-down, palazzo-cream,
 * pashmina-stole, pearl-brooch, pleated-midi-dress,
 * pleated-skirt-navy, polo-navy, puffer-navy, red-lehenga-skirt,
 * red-potli, saffron-coat, saffron-turban, saffron-wide-trouser,
 * sage-cashmere-knit, sage-silk-scarf, sherwani-ivory,
 * sherwani-maroon, shirt-dress-white, silk-cami,
 * tan-kolhapuri, teal-lehenga-skirt, tunic-ivory,
 * white-chikankari-kurta, white-minimal-sneaker,
 * wrap-dress-emerald
 */
