import { stats } from "@/data/content";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";

export function Stats() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      <Eyebrow>By the numbers</Eyebrow>
      <h2
        className="mt-4 max-w-[20ch] font-display text-ink"
        style={{
          fontSize: "clamp(2rem, 4.4vw, 3.5rem)",
          lineHeight: 1.02,
          letterSpacing: "-0.02em",
        }}
      >
        What changes when shoppers can{" "}
        <span className="italic text-saffron-deep">see themselves.</span>
      </h2>

      <dl className="mt-16 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 0.06}
            className="flex h-full flex-col justify-between gap-6 bg-canvas p-8 md:p-10"
          >
            <dt className="eyebrow">{s.label}</dt>
            <dd
              className="font-display text-ink"
              style={{
                fontSize: "clamp(2.75rem, 5vw, 4.25rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
              }}
            >
              {s.value}
            </dd>
          </Reveal>
        ))}
      </dl>

      <p className="mt-6 max-w-[60ch] text-xs text-ink-soft">
        Aggregate figures, twelve-month rolling, across seven partner houses. Individual results
        vary by category and price point.
      </p>
    </section>
  );
}
