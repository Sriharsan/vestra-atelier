import { integrations } from "@/data/content";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";

export function Integrations() {
  const [line1, line2] = integrations.title.split("\n");

  return (
    <section>
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-36">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-7">
            <Eyebrow>{integrations.eyebrow}</Eyebrow>
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
                {integrations.body}
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {integrations.platforms.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <div className="rounded-sm border border-line p-6">
                <h3 className="font-display text-xl text-ink" style={{ letterSpacing: "-0.01em" }}>
                  {p.name}
                </h3>
                <p className="mt-2 text-sm text-ink-soft">{p.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <hr className="hairline mx-6 md:mx-10" />
    </section>
  );
}
