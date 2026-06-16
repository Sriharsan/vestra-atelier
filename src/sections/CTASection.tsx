import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/Eyebrow";

export function CTASection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <div className="grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <Eyebrow>Step into the dressing room</Eyebrow>
            <h2
              className="mt-4 font-display text-ink"
              style={{
                fontSize: "clamp(2.25rem, 5.2vw, 4.25rem)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              See the look. <br />
              <span className="italic text-saffron-deep">Then decide.</span>
            </h2>
            <p className="mt-6 max-w-[44ch] text-ink-soft md:text-lg md:leading-[1.7]">
              Try the demo with one of three preset shoppers, or upload a photograph and see the spring atelier on you.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/try-on" className="btn-primary">
                Open the dressing room
                <ArrowUpRight aria-hidden className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="btn-ghost">
                Speak to the atelier
              </Link>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative aspect-square w-full max-w-md md:ml-auto">
              <div className="absolute inset-0 rounded-full iridescent opacity-95 blur-3xl" aria-hidden />
              <div className="absolute inset-8 rounded-full iridescent opacity-80" aria-hidden />
              <div className="absolute inset-0 grid place-items-center">
                <div className="rounded-full border border-line bg-canvas px-6 py-3 shadow-fabric">
                  <span className="eyebrow">The AI moment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
