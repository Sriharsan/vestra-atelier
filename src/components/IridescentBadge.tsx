import { Sparkles } from "lucide-react";

interface Props {
  label?: string;
  className?: string;
}

/**
 * The iridescent shimmer is reserved for AI moments. Use this badge
 * to mark something the model just produced.
 */
export function IridescentBadge({ label = "Rendered by Vestra", className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium text-ink shadow-fabric-sm iridescent ${className}`}
      style={{ letterSpacing: "0.14em", textTransform: "uppercase" }}
    >
      <Sparkles aria-hidden className="h-3 w-3" />
      {label}
    </span>
  );
}
