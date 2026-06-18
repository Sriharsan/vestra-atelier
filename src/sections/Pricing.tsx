import { Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { pricing } from "@/data/content";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";

export function Pricing() {
  const [line1, line2] = pricing.title.split("\n");

  return (
    <section>
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-36">
        <div className="text-center">
          <Eyebrow>{pricing.eyebrow}</Eyebrow>
          <Reveal>
            <h2
              className="mx-auto mt-4 font-display text-ink"
              style={{
                fontSize: "clamp(2rem, 4.6vw, 3.5rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
              }}
            >
              {line1}
              <br />
              <span className="italic text-saffron-deep">{line2}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mt-6 max-w-[52ch] text-ink-soft md:text-lg md:leading-[1.7]">
              {pricing.body}
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {pricing.tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.08}>
              <div
                className={`flex h-full flex-col rounded-sm border bg-canvas p-8 ${
                  tier.featured ? "border-saffron shadow-fabric" : "border-line"
                }`}
              >
                <Eyebrow>{tier.audience}</Eyebrow>
                <h3
                  className="mt-3 font-display text-2xl text-ink"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {tier.name}
                </h3>
                <p
                  className="mt-4 font-display text-saffron-deep"
                  style={{
                    fontSize: "clamp(1.5rem, 3vw, 1.875rem)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {tier.price}
                </p>

                <ul className="mt-8 flex-1 space-y-3">
                  {tier.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-ink-soft">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-saffron-deep" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link
                    to="/contact"
                    className={
                      tier.featured
                        ? "btn-primary w-full text-center"
                        : "btn-ghost w-full text-center"
                    }
                  >
                    Begin the conversation
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <hr className="hairline mx-6 md:mx-10" />
    </section>
  );
}
