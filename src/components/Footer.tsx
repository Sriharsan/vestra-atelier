import { Link } from "@tanstack/react-router";
import { brand, nav } from "@/data/content";
import { Eyebrow } from "@/components/Eyebrow";

export function Footer() {
  return (
    <footer className="border-t border-line bg-canvas-raised">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <Eyebrow>Manifesto</Eyebrow>
            <p className="mt-4 font-display text-3xl leading-[1.15] text-ink md:text-5xl md:leading-[1.1]">
              {brand.manifesto}
            </p>
          </div>

          <div className="md:col-span-3">
            <Eyebrow>The house</Eyebrow>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-ink-soft">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="link-underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <Eyebrow>Find us</Eyebrow>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-ink-soft">
              <li>{brand.domain}</li>
              <li>atelier@vestra.in</li>
              <li>Bengaluru, India</li>
            </ul>
          </div>
        </div>

        <hr className="hairline my-12" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-ink-soft md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg tracking-[0.22em] text-ink">{brand.name}</span>
            <span className="hidden md:inline">— {brand.tagline}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© {new Date().getFullYear()} Vestra Atelier Ltd.</span>
            <Link to="/privacy" className="link-underline">
              Privacy
            </Link>
            <Link to="/terms" className="link-underline">
              Terms
            </Link>
            <Link to="/" className="link-underline">
              Press
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
