import { solution } from "@/data/content";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";

export function Solution() {
  const [line1, line2] = solution.title.split("\n");

  return (
    <section>
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-36">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-8">
            <Eyebrow>{solution.eyebrow}</Eyebrow>
            <Reveal>
              <h2
                className="mt-4 font-display text-ink"
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
              <p className="mt-6 max-w-[52ch] text-ink-soft md:text-lg md:leading-[1.7]">
                {solution.body}
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      <hr className="hairline mx-6 md:mx-10" />
    </section>
  );
}
