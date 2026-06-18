import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TryOnDemo } from "@/sections/TryOnDemo";
import { Eyebrow } from "@/components/Eyebrow";

export const Route = createFileRoute("/try-on")({
  head: () => ({
    meta: [
      { title: "The Dressing Room — Vestra" },
      {
        name: "description",
        content:
          "Try the Vestra fitting room. Compose a full outfit on a preset shopper, or upload your own photograph.",
      },
      { property: "og:title", content: "The Dressing Room — Vestra" },
      {
        property: "og:description",
        content: "A live demo of couture-grade virtual try-on.",
      },
    ],
    links: [{ rel: "canonical", href: "https://vestra.ai/try-on" }],
  }),
  component: TryOnPage,
});

function TryOnPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header />
      <main id="main">
        <div className="mx-auto max-w-[1400px] px-6 pt-12 md:px-10 md:pt-20">
          <Eyebrow>The dressing room — interactive demo</Eyebrow>
          <h1
            className="mt-4 max-w-[20ch] font-display text-ink"
            style={{
              fontSize: "clamp(2.25rem, 5.4vw, 4.25rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Compose the look.
            <br />
            <span className="italic text-saffron-deep">See it on you.</span>
          </h1>
          <p className="mt-6 max-w-[58ch] text-ink-soft md:text-lg md:leading-[1.7]">
            Pick a preset shopper or upload a photograph, then assemble an outfit piece by piece.
            The render appears in seconds — the shimmer marks the AI moment.
          </p>
        </div>
        <TryOnDemo />
      </main>
      <Footer />
    </div>
  );
}
