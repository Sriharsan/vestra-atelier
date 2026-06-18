import textiles from "@/assets/textiles.jpg";
import { features, brandsUsing, testimonial } from "@/data/content";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";

export function ForBrandsSection() {
  return (
    <section className="bg-canvas-raised">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-36">
        {/* Editorial split */}
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-fabric">
              <img
                src={textiles}
                alt="Folded cashmere, silk and linen in warm bone, saffron and clay tones."
                className="h-full w-full object-cover"
                loading="lazy"
                width={1280}
                height={960}
              />
            </div>
            <p className="mt-4 max-w-[28ch] text-xs text-ink-soft">
              <span className="eyebrow mr-2">Caption</span>
              The materials we model — wool, silk, cashmere, linen.
            </p>
          </div>

          <div className="md:col-span-7">
            <Eyebrow>For the people who run the floor</Eyebrow>
            <h2
              className="mt-4 font-display text-ink"
              style={{
                fontSize: "clamp(2rem, 4.6vw, 3.5rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
              }}
            >
              A fitting room
              <br />
              <span className="italic text-saffron-deep">that travels with the shopper.</span>
            </h2>

            <p className="mt-6 max-w-[52ch] text-ink-soft md:text-lg md:leading-[1.7]">
              Ecommerce leads use Vestra to lift conversion. Merchandisers use it to retire pieces
              that don't flatter. Founders use it because the returns ledger finally moves in the
              right direction.
            </p>

            <ul className="mt-10 grid gap-y-8 sm:grid-cols-2 sm:gap-x-10">
              {features.map((f, i) => (
                <li key={f.title} className="border-t border-line pt-5">
                  <Reveal delay={i * 0.05}>
                    <h3
                      className="font-display text-xl text-ink"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.body}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Brands wordmark row */}
        <div className="mt-24 border-t border-line pt-10">
          <Eyebrow>Houses in the atelier</Eyebrow>
          <ul className="mt-6 flex flex-wrap items-baseline gap-x-10 gap-y-4">
            {brandsUsing.map((b) => (
              <li
                key={b}
                className="font-display text-xl text-ink md:text-2xl"
                style={{ letterSpacing: "0.04em" }}
              >
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Editorial pull quote */}
        <Reveal>
          <figure className="mt-24 grid items-start gap-8 border-t border-line pt-12 md:grid-cols-12">
            <Eyebrow as="div" className="md:col-span-3">
              From the floor
            </Eyebrow>
            <div className="md:col-span-9">
              <blockquote
                className="font-display text-ink"
                style={{
                  fontSize: "clamp(1.5rem, 3.2vw, 2.5rem)",
                  lineHeight: 1.2,
                  letterSpacing: "-0.01em",
                }}
              >
                <span aria-hidden className="text-saffron-deep">
                  "
                </span>
                {testimonial.quote}
                <span aria-hidden className="text-saffron-deep">
                  "
                </span>
              </blockquote>
              <figcaption className="mt-6 text-sm text-ink-soft">
                — {testimonial.author}, <em>{testimonial.role}</em>
              </figcaption>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
