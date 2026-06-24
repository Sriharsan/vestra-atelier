export interface ProductImageSet {
  flat: string;
  womenModel: string;
  menModel: string;
  tryOn: string;
}

function shopImg(slug: string): ProductImageSet {
  const src = `/demo/shop/${slug}.jpg`;
  return {
    flat: src,
    womenModel: src,
    menModel: src,
    tryOn: src,
  };
}

export const productImages: Record<string, ProductImageSet> = {
  "cream-silk-blouse": shopImg("cream-silk-blouse"),
  "clay-linen-dress": shopImg("clay-linen-dress"),
  "anarkali-red": shopImg("anarkali-red"),
  "banarasi-saree": shopImg("banarasi-saree"),
  "midi-dress-green": shopImg("midi-dress-green"),
  "espresso-blazer": shopImg("espresso-blazer"),
  "nehru-jacket": shopImg("nehru-jacket"),
  "sherwani-ivory": shopImg("sherwani-ivory"),
  "kurta-set-olive": shopImg("kurta-set-olive"),
  "oxford-button-down": shopImg("oxford-button-down"),
};

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
