import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TryOnDemo } from "@/sections/TryOnDemo";

export const Route = createFileRoute("/try-on")({
  head: () => ({
    meta: [
      { title: "The Dressing Room — Vestra" },
      {
        name: "description",
        content:
          "Try the Vestra fitting room. Upload your photo and see how Indian couture looks on you.",
      },
      { property: "og:title", content: "The Dressing Room — Vestra" },
      {
        property: "og:description",
        content: "A live demo of couture-grade virtual try-on.",
      },
    ],
    links: [{ rel: "canonical", href: "https://vestra.ai/try-on" }],
  }),
  validateSearch: (search: Record<string, unknown>): { garmentId?: string } => {
    const id = search.garmentId;
    return typeof id === "string" && id ? { garmentId: id } : {};
  },
  component: TryOnPage,
});

function TryOnPage() {
  const { garmentId } = Route.useSearch();

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header />
      <main id="main">
        <TryOnDemo initialGarmentId={garmentId} />
      </main>
      <Footer />
    </div>
  );
}
