import { lookbook, garments } from "@/data/garments";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { IridescentBadge } from "@/components/IridescentBadge";

export function Lookbook() {
  return (
    <section className="bg-canvas-raised">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-36">
        <div className="grid items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <Eyebrow>Lookbook, rendered</Eyebrow>
            <h2
              className="mt-4 font-display text-ink"
              style={{
                fontSize: "clamp(2rem, 4.4vw, 3.5rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
              }}
            >
              Every piece your house cuts,
              <br />
              <span className="italic text-saffron-deep">on every shopper.</span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-ink-soft md:max-w-[34ch] md:text-right md:ml-auto">
              Three looks from current partner houses, each composed in seconds from individual
              SKUs.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
          {lookbook.map((look, i) => (
            <Reveal key={look.id} delay={i * 0.08}>
              <figure className="group flex flex-col">
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-canvas shadow-fabric">
                  <img
                    src={look.src}
                    alt={`${look.title} — ${look.house}`}
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                    loading="lazy"
                    width={900}
                    height={1200}
                  />
                  <div className="absolute left-3 top-3">
                    <IridescentBadge label="Vestra render" />
                  </div>
                </div>
                <figcaption className="mt-5 flex items-start justify-between gap-6">
                  <div>
                    <h3
                      className="font-display text-2xl text-ink"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      {look.title}
                    </h3>
                    <p className="mt-1 text-sm text-ink-soft">{look.house}</p>
                  </div>
                  <span className="eyebrow mt-2 shrink-0">№ {String(i + 1).padStart(2, "0")}</span>
                </figcaption>
                <p className="mt-3 max-w-[36ch] text-xs leading-relaxed text-ink-soft">
                  {look.caption}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {look.pieces.map((id) => {
                    const g = garments.find((g) => g.id === id);
                    if (!g) return null;
                    return (
                      <li
                        key={id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-2.5 py-1 text-[11px] text-ink-soft"
                      >
                        <span
                          aria-hidden
                          className="h-2 w-2 rounded-full"
                          style={{ background: g.swatch }}
                        />
                        {g.name}
                      </li>
                    );
                  })}
                </ul>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
