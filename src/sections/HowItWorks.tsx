import { howItWorks } from "@/data/content";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-36">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <Eyebrow>The method</Eyebrow>
          <h2
            className="mt-4 font-display text-ink"
            style={{
              fontSize: "clamp(2rem, 4.4vw, 3.5rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            }}
          >
            Three steps, <span className="italic text-saffron-deep">no rig.</span>
          </h2>
          <p className="mt-6 max-w-[36ch] text-ink-soft">
            The shopper does almost nothing. The atelier does the rest.
          </p>
        </div>

        <ol className="md:col-span-8 flex flex-col">
          {howItWorks.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.1}>
              <li className="grid grid-cols-[auto_1fr] items-start gap-6 border-t border-line py-10 md:grid-cols-[160px_1fr] md:gap-12 md:py-14">
                <span
                  className="font-display text-saffron-deep"
                  style={{
                    fontSize: "clamp(3.5rem, 7vw, 6rem)",
                    lineHeight: 0.9,
                    letterSpacing: "-0.03em",
                  }}
                  aria-hidden
                >
                  {step.n}
                </span>
                <div>
                  <h3
                    className="font-display text-2xl text-ink md:text-3xl"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-[52ch] text-ink-soft">{step.body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
