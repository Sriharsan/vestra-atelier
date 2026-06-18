import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { aboutSections, brand } from "@/data/content";
import textiles from "@/assets/textiles.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "The House — Vestra" },
      {
        name: "description",
        content:
          "Vestra was founded by a former buyer at Browns and two computer-vision researchers. Couture-grade rendering, built by people who have run the dressing room.",
      },
      { property: "og:title", content: "The House — Vestra" },
      {
        property: "og:description",
        content: "Built by people who have run the dressing room.",
      },
    ],
    links: [{ rel: "canonical", href: "https://vestra.ai/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header />
      <main id="main">
        <section className="mx-auto max-w-[1400px] px-6 pt-16 pb-12 md:px-10 md:pt-24 md:pb-16">
          <Eyebrow>The house</Eyebrow>
          <h1
            className="mt-4 max-w-[18ch] font-display text-ink"
            style={{
              fontSize: "clamp(2.5rem, 6.4vw, 5.5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
            }}
          >
            A mirror with <span className="italic text-saffron-deep">better memory.</span>
          </h1>
          <p className="mt-8 max-w-[58ch] text-ink-soft md:text-lg md:leading-[1.7]">
            {brand.description}
          </p>
        </section>

        <section className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-sm shadow-fabric">
            <img
              src={textiles}
              alt="Folded cashmere, silk, and linen in warm bone, saffron, and clay tones."
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
          <div className="flex flex-col">
            {aboutSections.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <article className="grid grid-cols-1 gap-6 border-t border-line py-14 md:grid-cols-12 md:gap-12">
                  <div className="md:col-span-4">
                    <Eyebrow>{s.eyebrow}</Eyebrow>
                    <span
                      aria-hidden
                      className="mt-3 block font-display text-saffron-deep"
                      style={{
                        fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                        lineHeight: 0.9,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      № {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="md:col-span-8">
                    <h2
                      className="font-display text-ink"
                      style={{
                        fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)",
                        lineHeight: 1.05,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {s.title}
                    </h2>
                    <p className="mt-5 max-w-[58ch] text-ink-soft md:text-lg md:leading-[1.7]">
                      {s.body}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
