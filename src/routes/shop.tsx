import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SlidersHorizontal, X, ArrowUpDown, ChevronDown, ShoppingBag, Check } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/Eyebrow";
import { Reveal } from "@/components/Reveal";
import { ProductImage } from "@/components/ProductImage";
import {
  garments,
  formatPrice,
  type Garment,
  type GarmentCategory,
  type GarmentGender,
} from "@/data/garments";
import { addToCart } from "@/lib/cartStore";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop the Collection — Vestra" },
      {
        name: "description",
        content:
          "Browse the Vestra collection. Indian and international fashion, curated for the virtual fitting room.",
      },
      { property: "og:title", content: "Shop the Collection — Vestra" },
    ],
    links: [{ rel: "canonical", href: "https://vestra.in/shop" }],
  }),
  component: ShopPage,
});

type SortKey = "price-asc" | "price-desc" | "name";

const CATEGORY_LABELS: Record<GarmentCategory, string> = {
  outerwear: "Outerwear",
  top: "Tops",
  bottom: "Bottoms",
  shoe: "Shoes",
  accessory: "Accessories",
};

const GENDER_LABELS: Record<GarmentGender, string> = {
  unisex: "Unisex",
  men: "Men",
  women: "Women",
};

function ShopPage() {
  const [categoryFilter, setCategoryFilter] = useState<GarmentCategory | "all">("all");
  const [genderFilter, setGenderFilter] = useState<GarmentGender | "all">("all");
  const [sort, setSort] = useState<SortKey>("name");
  const [selectedProduct, setSelectedProduct] = useState<Garment | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let items = [...garments];
    if (categoryFilter !== "all") items = items.filter((g) => g.category === categoryFilter);
    if (genderFilter !== "all")
      items = items.filter((g) => g.gender === genderFilter || g.gender === "unisex");

    switch (sort) {
      case "price-asc":
        items.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        items.sort((a, b) => b.price - a.price);
        break;
      case "name":
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return items;
  }, [categoryFilter, genderFilter, sort]);

  const activeFilters = (categoryFilter !== "all" ? 1 : 0) + (genderFilter !== "all" ? 1 : 0);

  const previewGender: "men" | "women" =
    genderFilter === "men" ? "men" : genderFilter === "women" ? "women" : "women";

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <Header />
      <main id="main">
        <div className="mx-auto max-w-[1400px] px-6 pt-12 pb-24 md:px-10 md:pt-20 md:pb-36">
          <Eyebrow>The Collection</Eyebrow>
          <h1
            className="mt-4 max-w-[20ch] font-display text-ink"
            style={{
              fontSize: "clamp(2.25rem, 5.4vw, 4.25rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            Indian craft.
            <br />
            <span className="italic text-saffron-deep">Global style.</span>
          </h1>
          <p className="mt-6 max-w-[58ch] text-ink-soft md:text-lg md:leading-[1.7]">
            Browse the full catalogue — sarees, kurtas, blazers, denim — and try any piece on
            yourself in the dressing room.
          </p>

          {/* Filters toolbar */}
          <div className="mt-10 flex flex-wrap items-center gap-3 border-b border-line pb-4">
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition hover:border-ink hover:text-ink"
            >
              <SlidersHorizontal aria-hidden className="h-4 w-4" />
              Filters{activeFilters > 0 && ` (${activeFilters})`}
              <ChevronDown
                aria-hidden
                className={`h-3 w-3 transition-transform ${filtersOpen ? "rotate-180" : ""}`}
              />
            </button>

            <div className="ml-auto inline-flex items-center gap-2 text-sm text-ink-soft">
              <ArrowUpDown aria-hidden className="h-4 w-4" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="border-none bg-transparent text-sm text-ink focus:outline-none"
                aria-label="Sort by"
              >
                <option value="name">Name</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>

            <span className="text-xs text-ink-soft">
              {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
            </span>
          </div>

          {filtersOpen && (
            <div className="flex flex-wrap gap-6 border-b border-line py-4">
              <div>
                <span className="eyebrow mb-2 block">Category</span>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    active={categoryFilter === "all"}
                    onClick={() => setCategoryFilter("all")}
                  >
                    All
                  </FilterChip>
                  {(Object.keys(CATEGORY_LABELS) as GarmentCategory[]).map((cat) => (
                    <FilterChip
                      key={cat}
                      active={categoryFilter === cat}
                      onClick={() => setCategoryFilter(cat)}
                    >
                      {CATEGORY_LABELS[cat]}
                    </FilterChip>
                  ))}
                </div>
              </div>
              <div>
                <span className="eyebrow mb-2 block">Gender</span>
                <div className="flex flex-wrap gap-2">
                  <FilterChip
                    active={genderFilter === "all"}
                    onClick={() => setGenderFilter("all")}
                  >
                    All
                  </FilterChip>
                  {(Object.keys(GENDER_LABELS) as GarmentGender[]).map((g) => (
                    <FilterChip
                      key={g}
                      active={genderFilter === g}
                      onClick={() => setGenderFilter(g)}
                    >
                      {GENDER_LABELS[g]}
                    </FilterChip>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Product grid */}
          <div className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((g, i) => (
              <Reveal key={g.id} delay={Math.min(i * 0.03, 0.3)}>
                <ProductCard
                  garment={g}
                  previewGender={
                    g.gender === "men" ? "men" : g.gender === "women" ? "women" : previewGender
                  }
                  onSelect={() => setSelectedProduct(g)}
                />
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-ink-soft">No pieces match these filters.</p>
              <button
                type="button"
                onClick={() => {
                  setCategoryFilter("all");
                  setGenderFilter("all");
                }}
                className="mt-4 text-sm text-saffron-deep underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>

      {selectedProduct && (
        <ProductDetail garment={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      <Footer />
    </div>
  );
}

function ProductCard({
  garment,
  previewGender,
  onSelect,
}: {
  garment: Garment;
  previewGender: "men" | "women";
  onSelect: () => void;
}) {
  const [added, setAdded] = useState(false);

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation();
    addToCart(garment.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="group flex flex-col">
      <button type="button" onClick={onSelect} className="text-left">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-canvas-raised shadow-fabric transition-shadow group-hover:shadow-fabric-lg">
          <ProductImage
            garment={garment}
            variant="model"
            gender={previewGender}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/40 to-transparent p-3 pt-8">
            <span className="text-[11px] font-medium tracking-wide text-canvas/90">
              {garment.brand}
            </span>
          </div>
        </div>
      </button>
      <div className="mt-2.5 flex items-start justify-between gap-2">
        <button type="button" onClick={onSelect} className="min-w-0 flex-1 text-left">
          <h3 className="truncate text-sm font-medium text-ink transition-colors group-hover:text-saffron-deep">
            {garment.name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-ink-soft">{garment.fabric}</p>
          <p className="mt-1 font-display text-base text-ink">{formatPrice(garment.price)}</p>
        </button>
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-0.5 shrink-0 rounded-full border border-line p-2 text-ink-soft transition hover:border-ink hover:text-ink"
          aria-label={`Add ${garment.name} to cart`}
        >
          {added ? (
            <Check aria-hidden className="h-4 w-4 text-saffron-deep" />
          ) : (
            <ShoppingBag aria-hidden className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

function ProductDetail({ garment, onClose }: { garment: Garment; onClose: () => void }) {
  const defaultGender: "men" | "women" = garment.gender === "men" ? "men" : "women";
  const [previewGender, setPreviewGender] = useState<"men" | "women">(defaultGender);
  const [added, setAdded] = useState(false);

  const showGenderToggle = garment.gender === "unisex";

  function handleAdd() {
    addToCart(garment.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-sm border border-line bg-canvas shadow-fabric-lg">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-canvas/90 p-2 text-ink hover:bg-canvas"
          aria-label="Close"
        >
          <X aria-hidden className="h-5 w-5" />
        </button>

        <div className="grid gap-8 p-6 md:grid-cols-2 md:p-8">
          {/* Image side */}
          <div className="space-y-3">
            <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-canvas-raised">
              <ProductImage
                garment={garment}
                variant="model"
                gender={previewGender}
                className="h-full w-full object-cover"
              />
            </div>
            {showGenderToggle && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewGender("women")}
                  className={`flex-1 rounded-sm border px-3 py-2 text-xs transition ${
                    previewGender === "women"
                      ? "border-ink bg-ink text-canvas"
                      : "border-line text-ink-soft hover:border-ink"
                  }`}
                >
                  Women's preview
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewGender("men")}
                  className={`flex-1 rounded-sm border px-3 py-2 text-xs transition ${
                    previewGender === "men"
                      ? "border-ink bg-ink text-canvas"
                      : "border-line text-ink-soft hover:border-ink"
                  }`}
                >
                  Men's preview
                </button>
              </div>
            )}
          </div>

          {/* Detail side */}
          <div className="flex flex-col">
            <Eyebrow>{garment.brand}</Eyebrow>
            <h2
              className="mt-2 font-display text-2xl text-ink md:text-3xl"
              style={{ letterSpacing: "-0.01em" }}
            >
              {garment.name}
            </h2>
            <p className="mt-3 font-display text-2xl text-saffron-deep">
              {formatPrice(garment.price)}
            </p>

            <dl className="mt-6 space-y-3 border-t border-line pt-6">
              <div className="flex justify-between text-sm">
                <dt className="text-ink-soft">Fabric</dt>
                <dd className="text-right text-ink">{garment.fabric}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-ink-soft">Category</dt>
                <dd className="text-ink capitalize">{garment.category}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-ink-soft">Fit</dt>
                <dd className="text-ink capitalize">{garment.gender}</dd>
              </div>
              {garment.features && (
                <div className="text-sm">
                  <dt className="text-ink-soft">Details</dt>
                  <dd className="mt-1 text-ink">{garment.features}</dd>
                </div>
              )}
            </dl>

            <div className="mt-auto space-y-3 pt-8">
              <button
                type="button"
                onClick={handleAdd}
                className="btn-saffron w-full justify-center"
              >
                {added ? (
                  <>
                    <Check aria-hidden className="h-4 w-4" />
                    Added to cart
                  </>
                ) : (
                  <>
                    <ShoppingBag aria-hidden className="h-4 w-4" />
                    Add to cart
                  </>
                )}
              </button>
              <Link
                to="/try-on"
                search={{ garmentId: garment.id }}
                onClick={onClose}
                className="btn-primary w-full justify-center text-center"
              >
                Try this on me
              </Link>
              <p className="text-center text-[11px] text-ink-soft">
                Opens the dressing room with this piece ready to render.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition ${
        active
          ? "border-ink bg-ink text-canvas"
          : "border-line text-ink-soft hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
