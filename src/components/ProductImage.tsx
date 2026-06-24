import { useState, useEffect } from "react";
import type { Garment } from "@/data/garments";
import { getProductImage, hasRealImages } from "@/data/productImages";

interface ProductImageProps {
  garment: Garment;
  variant: "flat" | "model" | "tryOn";
  gender?: "men" | "women";
  className?: string;
  sizes?: string;
}

function Placeholder({
  garment,
  variant,
  className,
}: {
  garment: Garment;
  variant: string;
  className: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-canvas-raised ${className}`}
      role="img"
      aria-label={`${garment.name} — placeholder`}
    >
      <div
        className="mb-3 h-8 w-8 rounded-full ring-1 ring-inset ring-ink/10"
        style={{ background: garment.swatch }}
      />
      <span className="px-4 text-center text-xs font-medium text-ink/40">{garment.name}</span>
      <span className="mt-1 text-[10px] text-ink/25">
        {variant === "tryOn" ? "Try-on preview" : "Awaiting photo"}
      </span>
    </div>
  );
}

export function ProductImage({
  garment,
  variant,
  gender,
  className = "",
  sizes,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const images = getProductImage(garment.id);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!hasRealImages) {
    return <Placeholder garment={garment} variant={variant} className={className} />;
  }

  let src: string;
  let label: string;

  if (variant === "flat") {
    src = images.flat;
    label = `${garment.name} — flat lay`;
  } else if (variant === "tryOn") {
    src = images.tryOn;
    label = `${garment.name} — try-on preview`;
  } else {
    const g = gender ?? (garment.gender === "men" ? "men" : "women");
    src = g === "men" ? images.menModel : images.womenModel;
    label = `${garment.name} — ${g === "men" ? "men's" : "women's"} on-model`;
  }

  if (!src || failed || !mounted) {
    return <Placeholder garment={garment} variant={variant} className={className} />;
  }

  return (
    <img
      src={src}
      alt={label}
      className={className}
      loading="lazy"
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}
