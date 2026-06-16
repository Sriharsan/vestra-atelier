import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ForBrandsSection } from "@/sections/ForBrandsSection";
import { CTASection } from "@/sections/CTASection";
import { Eyebrow } from "@/components/Eyebrow";
import { forBrands, stats } from "@/data/content";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/for-brands")({
  head: () => ({
    meta: [
      { title: "For Brands — Vestra" },
      {
        name: "description",
        content:
          "Vestra fits inside your existing PDP and merchandising workflow. Less guesswork, fewer returns, more shoppers seeing themselves.",
      },
      { property: "og:title", content: "For Brands — Vestra" },
      {
        property: "og:description",
        content:
          "A virtual fitting room for fashion ecommerce — script-tag install, per-SKU pricing, EU & US data residency.",
      },
    ],
  }),
  component: ForBrandsPage,
});

function ForBrandsPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header />
      <main id="main">
        <section className="mx-auto max-w-[1400px] px-6 pt-16 pb-12 md:px-10 md:pt-24 md:pb-20">
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <Eyebrow>{forBrands.eyebrow}</Eyebrow>
              <h1
                className="mt-4 font-display text-ink"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  lineHeight: 0.98,
                  letterSpacing: "-0.02em",
                }}
              >
                {forBrands.title.split("\n").map((l, i) => (
                  <span key={i} className={i === 1 ? "italic text-saffron-deep" : ""}>
                    {l}
                    {i === 0 && <br />}
                  </span>
                ))}
              </h1>
              <p className="mt-8 max-w-[52ch] text-ink-soft md:text-lg md:leading-[1.7]">
                {forBrands.body}
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/contact" className="btn-primary">
                  Speak to the atelier
                  <ArrowUpRight aria-hidden className="h-4 w-4" />
                </Link>
                <Link to="/try-on" className="btn-ghost">See the demo</Link>
              </div>
            </div>

            <div className="md:col-span-5">
              <ul className="space-y-4 border-t border-line pt-6 md:mt-12">
                {forBrands.bullets.map((b, i) => (
                  <Reveal key={b} delay={i * 0.05}>
                    <li className="flex items-start gap-3 text-ink">
                      <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-saffron-deep" />
                      <span>{b}</span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <hr className="hairline mx-6 md:mx-10" />

        {/* Quick stats line */}
        <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="border-t border-line pt-6">
                <p
                  className="font-display text-ink"
                  style={{
                    fontSize: "clamp(2rem, 3.6vw, 3rem)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {s.value}
                </p>
                <p className="mt-2 text-sm text-ink-soft">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <ForBrandsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
