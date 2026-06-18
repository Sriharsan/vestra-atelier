import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Upload, Check, RotateCcw, Loader2, Download, Share2, ShoppingBag } from "lucide-react";
import { Eyebrow } from "@/components/Eyebrow";
import { IridescentBadge } from "@/components/IridescentBadge";
import { garments, lookbook, type Garment, type GarmentCategory } from "@/data/garments";
import { runTryOn, type TryOnStage, type TryOnResult } from "@/lib/stubs/tryOn";
import { track } from "@/lib/stubs/analytics";
import look1 from "@/assets/look-1.jpg";
import look2 from "@/assets/look-2.jpg";
import look3 from "@/assets/look-3.jpg";
import heroModel from "@/assets/hero-model.jpg";

const OUTFIT_PRESETS = [
  {
    name: "Casual",
    garmentIds: ["o-bone-trench", "t-sage-knit", "b-saffron-trouser", "s-loafer-cognac"],
  },
  {
    name: "Professional",
    garmentIds: ["o-espresso-blazer", "t-cream-silk", "b-ink-trouser", "s-loafer-cognac"],
  },
  { name: "Night Out", garmentIds: ["t-clay-linen", "a-sage-scarf", "s-heel-nude"] },
];

const PRESET_SHOPPERS = [
  { id: "shopper-a", label: "Shopper A", src: heroModel },
  { id: "shopper-b", label: "Shopper B", src: look2 },
  { id: "shopper-c", label: "Shopper C", src: look3 },
] as const;

const CATEGORY_ORDER: GarmentCategory[] = ["outerwear", "top", "bottom", "shoe", "accessory"];
const CATEGORY_LABEL: Record<GarmentCategory, string> = {
  outerwear: "Outerwear",
  top: "Top",
  bottom: "Bottom",
  shoe: "Shoe",
  accessory: "Accessory",
};

export function TryOnDemo() {
  const reduced = useReducedMotion();

  // Shopper selection
  const [shopperId, setShopperId] = useState<string>(PRESET_SHOPPERS[0].id);
  const [uploadedShopper, setUploadedShopper] = useState<string | null>(null);
  const shopperSrc =
    uploadedShopper ??
    PRESET_SHOPPERS.find((s) => s.id === shopperId)?.src ??
    PRESET_SHOPPERS[0].src;

  // Garment selection (one per category)
  const initialSelection = useMemo(() => {
    const map: Partial<Record<GarmentCategory, string>> = {};
    lookbook[0].pieces.forEach((id) => {
      const g = garments.find((g) => g.id === id);
      if (g) map[g.category] = g.id;
    });
    return map;
  }, []);
  const [selection, setSelection] =
    useState<Partial<Record<GarmentCategory, string>>>(initialSelection);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [shareTooltip, setShareTooltip] = useState(false);
  const garmentListRef = useRef<HTMLDivElement>(null);

  const selectedGarments: Garment[] = useMemo(
    () =>
      CATEGORY_ORDER.map((c) => selection[c])
        .filter((id): id is string => !!id)
        .map((id) => garments.find((g) => g.id === id)!)
        .filter(Boolean),
    [selection],
  );

  // Render lifecycle
  const [stage, setStage] = useState<TryOnStage>({ kind: "idle" });
  const [result, setResult] = useState<TryOnResult | null>(null);

  // Resolve a "rendered" image deterministically from selection — demo only.
  const resolvedSrc = useMemo(() => {
    const ids = Object.values(selection).filter(Boolean) as string[];
    if (ids.includes("o-saffron-coat")) return look1;
    if (ids.includes("t-clay-linen")) return look2;
    if (ids.includes("o-espresso-blazer")) return look3;
    return shopperSrc;
  }, [selection, shopperSrc]);

  function applyPreset(preset: (typeof OUTFIT_PRESETS)[number]) {
    const next: Partial<Record<GarmentCategory, string>> = {};
    for (const gId of preset.garmentIds) {
      const g = garments.find((g) => g.id === gId);
      if (g) next[g.category] = g.id;
    }
    setSelection(next);
    setActivePreset(preset.name);
    track("tryon_preset_applied", { preset: preset.name });
  }

  // Check if current selection matches a preset
  const currentPreset = useMemo(() => {
    if (activePreset) {
      const preset = OUTFIT_PRESETS.find((p) => p.name === activePreset);
      if (preset) {
        const presetMap: Partial<Record<GarmentCategory, string>> = {};
        for (const gId of preset.garmentIds) {
          const g = garments.find((g) => g.id === gId);
          if (g) presetMap[g.category] = g.id;
        }
        const matches = CATEGORY_ORDER.every(
          (cat) => (presetMap[cat] ?? undefined) === (selection[cat] ?? undefined),
        );
        if (matches) return activePreset;
      }
    }
    return null;
  }, [activePreset, selection]);

  // Alternative garment suggestions (Task 3)
  const alternatives = useMemo(() => {
    if (stage.kind !== "done") return [];
    const alts: { selected: Garment; suggestion: Garment }[] = [];
    for (const sg of selectedGarments) {
      const others = garments.filter((g) => g.category === sg.category && g.id !== sg.id);
      for (const other of others) {
        alts.push({ selected: sg, suggestion: other });
        if (alts.length >= 3) return alts;
      }
    }
    return alts;
  }, [selectedGarments, stage.kind]);

  // ARIA live text for render progress (Task 6)
  const ariaStageText = useMemo(() => {
    switch (stage.kind) {
      case "idle":
        return "Ready to render.";
      case "uploading":
        return `Uploading image, ${stage.progress} percent complete.`;
      case "rendering":
        return `Draping fabric, ${stage.progress} percent complete.`;
      case "done":
        return `Render complete. ${Math.round((result?.confidence ?? 0) * 100)} percent drape confidence.`;
      case "error":
        return `Render error: ${stage.message}`;
      default:
        return "";
    }
  }, [stage, result]);

  async function handleRender() {
    track("tryon_render_start", { shopperId, garments: Object.values(selection) });
    setResult(null);
    for await (const s of runTryOn(
      { shopperImage: shopperSrc, garmentIds: Object.values(selection) as string[] },
      (_req) => ({
        id: `tr_${Date.now()}`,
        imageUrl: resolvedSrc,
        garments: selectedGarments,
        durationMs: 1400,
        confidence: 0.97,
      }),
    )) {
      setStage(s);
      if (s.kind === "done") {
        setResult(s.result);
        track("tryon_render_done", { id: s.result.id });
      }
    }
  }

  // Auto-render once on first mount so visitors see the magic immediately
  useEffect(() => {
    handleRender();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // BACKEND STUB — in production we upload to object storage; here we use a local object URL.
    const url = URL.createObjectURL(file);
    setUploadedShopper(url);
    track("tryon_shopper_upload");
  }

  function reset() {
    setSelection(initialSelection);
    setUploadedShopper(null);
    setShopperId(PRESET_SHOPPERS[0].id);
  }

  const isRendering = stage.kind === "uploading" || stage.kind === "rendering";
  const total = selectedGarments.reduce((s, g) => s + g.priceGBP, 0);

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
      <div className="grid gap-10 md:grid-cols-12 lg:gap-14">
        {/* Render canvas — the AI moment */}
        <div className="md:col-span-7">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-canvas-raised shadow-fabric-lg">
            <AnimatePresence mode="wait">
              <motion.img
                key={result?.imageUrl ?? shopperSrc}
                src={result?.imageUrl ?? shopperSrc}
                alt="Virtual try-on render"
                className="absolute inset-0 h-full w-full object-cover"
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduced ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }}
                width={1080}
                height={1440}
              />
            </AnimatePresence>

            {/* Iridescent shimmer while rendering */}
            {isRendering && (
              <div className="absolute inset-0 iridescent mix-blend-soft-light" aria-hidden />
            )}

            {/* Badge */}
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <IridescentBadge label={isRendering ? "Rendering" : "Rendered by Vestra"} />
              {!isRendering && result && (
                <span className="rounded-full border border-line bg-canvas/90 px-2.5 py-0.5 text-[10px] font-medium text-ink-soft">
                  Preview
                </span>
              )}
            </div>

            {/* Status pill and action buttons */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start gap-2">
              <div className="rounded-full border border-line bg-canvas/95 px-3 py-1.5 text-[11px] text-ink shadow-fabric-sm">
                {stage.kind === "uploading" && <>Uploading — {stage.progress}%</>}
                {stage.kind === "rendering" && <>Draping fabric — {stage.progress}%</>}
                {stage.kind === "done" && (
                  <span className="inline-flex items-center gap-1.5">
                    <Check aria-hidden className="h-3 w-3 text-saffron-deep" />
                    {Math.round((result?.confidence ?? 0) * 100)}% drape confidence ·{" "}
                    {(result!.durationMs / 1000).toFixed(1)}s
                  </span>
                )}
                {stage.kind === "idle" && <>Ready</>}
                {stage.kind === "error" && <span className="text-clay">{stage.message}</span>}
              </div>

              {stage.kind === "done" && result && (
                <div className="flex items-center gap-2">
                  <a
                    href={result.imageUrl}
                    download="vestra-look.jpg"
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas/95 px-3 py-1.5 text-[11px] font-medium shadow-fabric-sm transition-colors hover:border-ink"
                  >
                    <Download aria-hidden className="h-3 w-3" />
                    Save
                  </a>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setShareTooltip(true);
                        track("tryon_share");
                        setTimeout(() => setShareTooltip(false), 1500);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas/95 px-3 py-1.5 text-[11px] font-medium shadow-fabric-sm transition-colors hover:border-ink"
                    >
                      <Share2 aria-hidden className="h-3 w-3" />
                      Share
                    </button>
                    {shareTooltip && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-0.5 text-[10px] text-canvas">
                        Copied
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => garmentListRef.current?.scrollIntoView({ behavior: "smooth" })}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas/95 px-3 py-1.5 text-[11px] font-medium shadow-fabric-sm transition-colors hover:border-ink"
                  >
                    <ShoppingBag aria-hidden className="h-3 w-3" />
                    Shop the look
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="mt-3 max-w-[60ch] text-xs text-ink-soft">
            <span className="eyebrow mr-2">Note</span>
            Your photograph stays in your browser and is never uploaded to our servers. In
            production, shopper images are processed in-session, retained for up to 24 hours for
            quality assurance, then permanently deleted. Images are never used for model training.
          </p>
        </div>

        {/* Controls */}
        <div className="md:col-span-5">
          <Eyebrow>The dressing room</Eyebrow>
          <h2
            className="mt-3 font-display text-ink"
            style={{
              fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Compose a look,
            <br />
            <span className="italic text-saffron-deep">see it on you.</span>
          </h2>

          {/* Shopper picker */}
          <div className="mt-8">
            <Eyebrow as="div">Shopper</Eyebrow>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {PRESET_SHOPPERS.map((s) => {
                const active = !uploadedShopper && shopperId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setUploadedShopper(null);
                      setShopperId(s.id);
                    }}
                    aria-pressed={active}
                    aria-label={`Use ${s.label}`}
                    className={`relative h-14 w-14 overflow-hidden rounded-full border transition ${
                      active
                        ? "border-ink ring-2 ring-saffron ring-offset-2 ring-offset-canvas"
                        : "border-line hover:border-ink"
                    }`}
                  >
                    <img src={s.src} alt="" className="h-full w-full object-cover" />
                  </button>
                );
              })}

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-canvas-raised px-3 py-2 text-xs text-ink-soft transition hover:border-ink hover:text-ink">
                <Upload aria-hidden className="h-3.5 w-3.5" />
                Upload photo
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={onUpload}
                  aria-label="Upload a shopper photograph"
                />
              </label>
            </div>
          </div>

          {/* Quick looks — outfit presets */}
          <div className="mt-8">
            <Eyebrow as="div">Quick looks</Eyebrow>
            <div className="mt-3 flex flex-wrap gap-2">
              {OUTFIT_PRESETS.map((preset) => {
                const active = currentPreset === preset.name;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      active
                        ? "border-ink bg-ink text-canvas"
                        : "border-line bg-canvas text-ink-soft hover:border-ink hover:text-ink"
                    }`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Garment picker per category */}
          <div ref={garmentListRef} className="mt-8 space-y-5">
            {CATEGORY_ORDER.map((cat) => {
              const opts = garments.filter((g) => g.category === cat);
              if (opts.length === 0) return null;
              return (
                <div key={cat}>
                  <div className="flex items-baseline justify-between">
                    <Eyebrow as="div">{CATEGORY_LABEL[cat]}</Eyebrow>
                    {selection[cat] && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = { ...selection };
                          delete next[cat];
                          setSelection(next);
                        }}
                        className="text-[11px] text-ink-soft underline-offset-2 hover:text-ink hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {opts.map((g) => {
                      const active = selection[cat] === g.id;
                      return (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => {
                            setSelection({ ...selection, [cat]: g.id });
                            setActivePreset(null);
                          }}
                          aria-pressed={active}
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition ${
                            active
                              ? "border-ink bg-ink text-canvas"
                              : "border-line bg-canvas text-ink-soft hover:border-ink hover:text-ink"
                          }`}
                        >
                          <span
                            aria-hidden
                            className="h-2.5 w-2.5 rounded-full ring-1 ring-inset ring-ink/10"
                            style={{ background: g.swatch }}
                          />
                          {g.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Outfit variation suggestions */}
          {alternatives.length > 0 && (
            <div className="mt-6">
              <Eyebrow as="div">Try instead</Eyebrow>
              <div className="mt-2 flex flex-wrap gap-2">
                {alternatives.map(({ selected, suggestion }) => (
                  <button
                    key={`${selected.id}-${suggestion.id}`}
                    type="button"
                    onClick={() => {
                      setSelection({ ...selection, [suggestion.category]: suggestion.id });
                      setActivePreset(null);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1.5 text-[11px] text-ink-soft transition hover:border-ink hover:text-ink"
                  >
                    <span
                      aria-hidden
                      className="h-2 w-2 rounded-full ring-1 ring-inset ring-ink/10"
                      style={{ background: suggestion.swatch }}
                    />
                    {suggestion.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ARIA live region for render progress */}
          <div aria-live="polite" className="sr-only">
            {ariaStageText}
          </div>

          {/* Render action */}
          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-6">
            <button
              type="button"
              onClick={handleRender}
              disabled={isRendering}
              className="btn-saffron"
            >
              {isRendering ? (
                <>
                  <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                  Draping…
                </>
              ) : (
                <>Render the look</>
              )}
            </button>
            <button type="button" onClick={reset} className="btn-ghost">
              <RotateCcw aria-hidden className="h-4 w-4" />
              Reset
            </button>
            <div className="ml-auto text-right">
              <div className="eyebrow">Outfit total</div>
              <div className="font-display text-2xl text-ink">£{total.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
