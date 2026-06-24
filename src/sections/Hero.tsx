import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import heroModel from "@/assets/hero-model.jpg";
import { hero, brand } from "@/data/content";
import { Eyebrow } from "@/components/Eyebrow";
import { IridescentBadge } from "@/components/IridescentBadge";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 80]);

  // hero.title contains a literal \n we want to honour as a line break
  const [line1, line2] = hero.title.split("\n");

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 pt-12 pb-20 md:grid-cols-12 md:px-10 md:pt-20 md:pb-32 lg:gap-16">
        {/* Copy column */}
        <div className="md:col-span-6 lg:col-span-6">
          <Eyebrow>{hero.eyebrow}</Eyebrow>

          <motion.h1
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-ink"
            style={{
              fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
              fontWeight: 400,
            }}
          >
            {line1}
            <br />
            <span className="italic text-saffron-deep">{line2}</span>
          </motion.h1>

          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-[46ch] text-base leading-[1.7] text-ink-soft md:text-lg"
          >
            {hero.body}
          </motion.p>

          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link to={hero.primaryCta.to} className="btn-primary">
              {hero.primaryCta.label}
              <ArrowUpRight aria-hidden className="h-4 w-4" />
            </Link>
            <Link to={hero.secondaryCta.to} className="btn-ghost">
              {hero.secondaryCta.label}
            </Link>
          </motion.div>

          <div className="mt-8 flex items-center gap-3">
            <IridescentBadge label="AI moments, marked" />
            <span className="text-xs text-ink-soft">
              The shimmer only appears where the model does its work.
            </span>
          </div>
        </div>

        {/* Image column — full-bleed editorial */}
        <div className="relative md:col-span-6 lg:col-span-6">
          <motion.div
            style={{ y }}
            className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-canvas-raised shadow-fabric-lg"
          >
            <img
              src={heroModel}
              alt="A model in a flowing cream silk dress, photographed in a sunlit Parisian atelier."
              className="h-full w-full object-cover"
              width={1280}
              height={1600}
            />
            {/* Side caption like a magazine spread */}
            <div className="absolute left-4 top-4 hidden md:block">
              <span className="eyebrow text-canvas/90 [text-shadow:0_1px_3px_rgba(33,28,24,0.35)]">
                Look № 04 · Spring Atelier
              </span>
            </div>
          </motion.div>

          <div className="mt-6 flex items-start justify-between gap-6">
            <p className="max-w-[28ch] text-xs leading-relaxed text-ink-soft">
              <span className="eyebrow mr-2">Caption</span>
              Maison Aurelle, silk crêpe. Rendered on the shopper in 1.4 seconds.
            </p>
            <span className="font-display text-sm text-ink-soft">{brand.domain}</span>
          </div>
        </div>
      </div>

      {/* Hairline divider — editorial spread */}
      <hr className="hairline mx-6 md:mx-10" />
    </section>
  );
}
