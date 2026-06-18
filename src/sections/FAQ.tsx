import { faq } from "@/data/content";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export function FAQ() {
  return (
    <section>
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-36">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-4">
            <Eyebrow>Common questions</Eyebrow>
            <Reveal>
              <h2
                className="mt-4 font-display text-ink"
                style={{
                  fontSize: "clamp(2rem, 4.6vw, 3.5rem)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.02em",
                }}
              >
                What brands
                <br />
                <span className="italic text-saffron-deep">ask us.</span>
              </h2>
            </Reveal>
          </div>

          <div className="md:col-span-8">
            <Reveal delay={0.1}>
              <Accordion type="single" collapsible className="w-full">
                {faq.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="border-line">
                    <AccordionTrigger
                      className="font-display text-base text-ink md:text-lg"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-ink-soft leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Reveal>
          </div>
        </div>
      </div>

      <hr className="hairline mx-6 md:mx-10" />
    </section>
  );
}
