import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  as?: "span" | "p" | "div";
}

export function Eyebrow({ children, className = "", as: As = "span" }: Props) {
  return <As className={`eyebrow ${className}`}>{children}</As>;
}
