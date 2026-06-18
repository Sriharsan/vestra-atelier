import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/sections/Hero";
import { Problem } from "@/sections/Problem";
import { Solution } from "@/sections/Solution";
import { HowItWorks } from "@/sections/HowItWorks";
import { Lookbook } from "@/sections/Lookbook";
import { Stats } from "@/sections/Stats";
import { ForBrandsSection } from "@/sections/ForBrandsSection";
import { Integrations } from "@/sections/Integrations";
import { Pricing } from "@/sections/Pricing";
import { FAQ } from "@/sections/FAQ";
import { CTASection } from "@/sections/CTASection";
import { SoftwareApplicationSchema } from "@/components/StructuredData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vestra — See Every Look Before You Buy." },
      {
        name: "description",
        content:
          "The virtual fitting room for luxury fashion. Shoppers see the full outfit on themselves, before they buy.",
      },
      { property: "og:title", content: "Vestra — See Every Look Before You Buy." },
      {
        property: "og:description",
        content:
          "Couture-grade try-on. Returns down 38%. Add-to-cart up 24%. The dressing room follows the shopper home.",
      },
    ],
    links: [{ rel: "canonical", href: "https://vestra.ai/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <SoftwareApplicationSchema />
      <Header />
      <main id="main">
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <Lookbook />
        <Stats />
        <ForBrandsSection />
        <Integrations />
        <Pricing />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
