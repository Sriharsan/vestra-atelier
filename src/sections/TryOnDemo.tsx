import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Upload,
  Check,
  RotateCcw,
  Loader2,
  Download,
  Share2,
  ShoppingBag,
  AlertCircle,
  Heart,
} from "lucide-react";
import { Eyebrow } from "@/components/Eyebrow";
import { IridescentBadge } from "@/components/IridescentBadge";
import {
  garments,
  lookbook,
  formatPrice,
  type Garment,
  type GarmentCategory,
} from "@/data/garments";
import { outfitPresets } from "@/data/content";
import { runTryOn, type TryOnStage, type TryOnResult } from "@/lib/stubs/tryOn";
import { track } from "@/lib/stubs/analytics";
import look1 from "@/assets/look-1.jpg";
import look2 from "@/assets/look-2.jpg";
import look3 from "@/assets/look-3.jpg";
import heroModel from "@/assets/hero-model.jpg";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Images are placeholders — replace with rights-cleared, diverse on-model photos.
// heroModel: South Asian woman · look1: South Asian woman (saffron look)
// look2: East Asian woman · look3: European man
const PRESET_SHOPPERS = [
  { id: "shopper-a", label: "Priya", gender: "women" as const, src: heroModel },
  { id: "shopper-b", label: "Mei", gender: "women" as const, src: look2 },
  { id: "shopper-c", label: "Arjun", gender: "men" as const, src: look3 },
] as const;

const CATEGORY_ORDER: GarmentCategory[] = ["outerwear", "top", "bottom", "shoe", "accessory"];
const CATEGORY_LABEL: Record<GarmentCategory, string> = {
  outerwear: "Outerwear",
  top: "Top",
  bottom: "Bottom",
  shoe: "Shoe",
  accessory: "Accessory",
};

interface SavedLook {
  id: string;
  garmentIds: string[];
  timestamp: number;
}

function getSavedLooks(): SavedLook[] {
  try {
    return JSON.parse(localStorage.getItem("vestra-saved-looks") ?? "[]");
  } catch {
    return [];
  }
}

function saveLook(look: SavedLook) {
  const looks = getSavedLooks();
  if (looks.some((l) => l.id === look.id)) return;
  looks.unshift(look);
  localStorage.setItem("vestra-saved-looks", JSON.stringify(looks.slice(0, 20)));
}

export function TryOnDemo() {
  const reduced = useReducedMotion();

  const [shopperId, setShopperId] = useState<string>(PRESET_SHOPPERS[0].id);
  const [uploadedShopper, setUploadedShopper] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const shopperSrc =
    uploadedShopper ??
    PRESET_SHOPPERS.find((s) => s.id === shopperId)?.src ??
    PRESET_SHOPPERS[0].src;

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
  const [saved, setSaved] = useState(false);
  const garmentListRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedGarments: Garment[] = useMemo(
    () =>
      CATEGORY_ORDER.map((c) => selection[c])
        .filter((id): id is string => !!id)
        .map((id) => garments.find((g) => g.id === id)!)
        .filter(Boolean),
    [selection],
  );

  const [stage, setStage] = useState<TryOnStage>({ kind: "idle" });
  const [result, setResult] = useState<TryOnResult | null>(null);
  const [providerUsed, setProviderUsed] = useState<"fashn" | "fal" | "mock">("mock");
  const [editInstruction, setEditInstruction] = useState("");
  const [tryOnMode, setTryOnMode] = useState<"tryon" | "edit">("tryon");

  const resolvedSrc = useMemo(() => {
    const ids = Object.values(selection).filter(Boolean) as string[];
    if (ids.includes("o-saffron-coat")) return look1;
    if (ids.includes("t-clay-linen")) return look2;
    if (ids.includes("o-espresso-blazer")) return look3;
    return shopperSrc;
  }, [selection, shopperSrc]);

  function applyPreset(preset: (typeof outfitPresets)[number]) {
    const next: Partial<Record<GarmentCategory, string>> = {};
    for (const gId of preset.garmentIds) {
      const g = garments.find((g) => g.id === gId);
      if (g) next[g.category] = g.id;
    }
    setSelection(next);
    setActivePreset(preset.name);
    track("tryon_preset_applied", { preset: preset.name });
  }

  const currentPreset = useMemo(() => {
    if (!activePreset) return null;
    const preset = outfitPresets.find((p) => p.name === activePreset);
    if (!preset) return null;
    const presetMap: Partial<Record<GarmentCategory, string>> = {};
    for (const gId of preset.garmentIds) {
      const g = garments.find((g) => g.id === gId);
      if (g) presetMap[g.category] = g.id;
    }
    const matches = CATEGORY_ORDER.every(
      (cat) => (presetMap[cat] ?? undefined) === (selection[cat] ?? undefined),
    );
    return matches ? activePreset : null;
  }, [activePreset, selection]);

  const alternatives = useMemo(() => {
    if (stage.kind !== "done") return [];
    const alts: { selected: Garment; suggestion: Garment }[] = [];
    for (const sg of selectedGarments) {
      const others = garments.filter((g) => g.category === sg.category && g.id !== sg.id);
      for (const other of others) {
        alts.push({ selected: sg, suggestion: other });
        if (alts.length >= 4) return alts;
      }
    }
    return alts;
  }, [selectedGarments, stage.kind]);

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

  const handleRender = useCallback(async () => {
    if (selectedGarments.length === 0) return;

    track("tryon_render_start", { shopperId, garments: Object.values(selection) });
    setResult(null);
    setSaved(false);
    setProviderUsed("mock");

    for await (const s of runTryOn(
      {
        shopperImage: shopperSrc,
        garmentIds: Object.values(selection).filter(Boolean) as string[],
      },
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
        setProviderUsed("mock");
        track("tryon_render_done", { id: s.result.id });
      }
    }
  }, [shopperSrc, selection, resolvedSrc, selectedGarments, shopperId]);

  useEffect(() => {
    handleRender();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    if (!ACCEPTED_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith(".heic")) {
      setUploadError("Please upload a JPG, PNG, or HEIC image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("Image must be under 10 MB.");
      return;
    }

    const url = URL.createObjectURL(file);
    setUploadedShopper(url);
    setShopperId("custom");
    track("tryon_shopper_upload");
  }

  async function handleShare() {
    const shareData = {
      title: "My Vestra Look",
      text: "Check out this outfit I composed on Vestra!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        track("tryon_share", { method: "native" });
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    await navigator.clipboard.writeText(window.location.href);
    setShareTooltip(true);
    track("tryon_share", { method: "clipboard" });
    setTimeout(() => setShareTooltip(false), 1500);
  }

  function handleSaveLook() {
    if (!result) return;
    const ids = Object.values(selection).filter(Boolean) as string[];
    saveLook({ id: result.id, garmentIds: ids, timestamp: Date.now() });
    setSaved(true);
    track("tryon_save_look", { id: result.id });
  }

  function reset() {
    setSelection(initialSelection);
    setUploadedShopper(null);
    setUploadError(null);
    setShopperId(PRESET_SHOPPERS[0].id);
    setActivePreset(null);
    setSaved(false);
  }

  const isRendering = stage.kind === "uploading" || stage.kind === "rendering";
  const total = selectedGarments.reduce((s, g) => s + g.price, 0);
  const hasSelection = selectedGarments.length > 0;
  const isMock = providerUsed === "mock";

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
      <div className="grid gap-10 md:grid-cols-12 lg:gap-14">
        {/* Render canvas */}
        <div className="md:col-span-7">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-canvas-raised shadow-fabric-lg">
            {!hasSelection && !result ? (
              <div className="flex h-full items-center justify-center p-8 text-center">
                <div>
                  <p className="font-display text-xl text-ink/60">
                    Select garments to compose a look
                  </p>
                  <p className="mt-2 text-sm text-ink-soft">
                    Pick pieces from the categories on the right, then hit Render.
                  </p>
                </div>
              </div>
            ) : (
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
            )}

            {isRendering && (
              <div className="absolute inset-0 iridescent mix-blend-soft-light" aria-hidden />
            )}

            <div className="absolute left-4 top-4 flex items-center gap-2">
              <IridescentBadge label={isRendering ? "Rendering" : "Rendered by Vestra"} />
              {!isRendering && result && isMock && (
                <span className="rounded-full border border-line bg-canvas/90 px-2.5 py-0.5 text-[10px] font-medium text-ink-soft">
                  Preview
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex flex-col items-start gap-2">
              <div className="rounded-full border border-line bg-canvas/95 px-3 py-1.5 text-[11px] text-ink shadow-fabric-sm">
                {stage.kind === "uploading" && <>Uploading — {stage.progress}%</>}
                {stage.kind === "rendering" && <>Draping fabric — {stage.progress}%</>}
                {stage.kind === "done" && result && (
                  <span className="inline-flex items-center gap-1.5">
                    <Check aria-hidden className="h-3 w-3 text-saffron-deep" />
                    {Math.round((result.confidence ?? 0) * 100)}% drape confidence ·{" "}
                    {(result.durationMs / 1000).toFixed(1)}s{isMock && " · AI preview"}
                  </span>
                )}
                {stage.kind === "idle" && <>Ready</>}
                {stage.kind === "error" && <span className="text-clay">{stage.message}</span>}
              </div>

              {stage.kind === "done" && result && (
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={result.imageUrl}
                    download="vestra-look.jpg"
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas/95 px-3 py-1.5 text-[11px] font-medium shadow-fabric-sm transition-colors hover:border-ink focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-offset-1"
                  >
                    <Download aria-hidden className="h-3 w-3" />
                    Save image
                  </a>
                  <button
                    type="button"
                    onClick={handleSaveLook}
                    disabled={saved}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas/95 px-3 py-1.5 text-[11px] font-medium shadow-fabric-sm transition-colors hover:border-ink focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-offset-1 disabled:opacity-60"
                  >
                    <Heart
                      aria-hidden
                      className={`h-3 w-3 ${saved ? "fill-saffron-deep text-saffron-deep" : ""}`}
                    />
                    {saved ? "Saved" : "Save look"}
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleShare}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas/95 px-3 py-1.5 text-[11px] font-medium shadow-fabric-sm transition-colors hover:border-ink focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-offset-1"
                    >
                      <Share2 aria-hidden className="h-3 w-3" />
                      Share
                    </button>
                    {shareTooltip && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-0.5 text-[10px] text-canvas">
                        Link copied
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => garmentListRef.current?.scrollIntoView({ behavior: "smooth" })}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas/95 px-3 py-1.5 text-[11px] font-medium shadow-fabric-sm transition-colors hover:border-ink focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-offset-1"
                  >
                    <ShoppingBag aria-hidden className="h-3 w-3" />
                    Shop the look
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <p className="max-w-[60ch] text-xs text-ink-soft">
              <span className="eyebrow mr-2">Note</span>
              Results are AI-generated previews. For best results, use a clear, well-lit,
              front-facing half or full body photo. Your photograph stays in your browser during
              demo mode. In production, images are processed in-session, retained briefly for
              quality, then permanently deleted. Never used for training.
            </p>
            {isMock && (
              <p className="max-w-[60ch] text-xs text-ink-soft/70">
                Running in preview mode — real rendering requires a configured provider key (FASHN
                or fal.ai).
              </p>
            )}
          </div>
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
            <p className="mt-1 text-xs text-ink-soft">
              Use a clear, front-facing half or full body photo for best results.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {PRESET_SHOPPERS.map((s) => {
                const active = !uploadedShopper && shopperId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setUploadedShopper(null);
                      setUploadError(null);
                      setShopperId(s.id);
                    }}
                    aria-pressed={active}
                    aria-label={`Use ${s.label}`}
                    className={`relative h-14 w-14 overflow-hidden rounded-full border transition focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-offset-1 ${
                      active
                        ? "border-ink ring-2 ring-saffron ring-offset-2 ring-offset-canvas"
                        : "border-line hover:border-ink"
                    }`}
                  >
                    <img src={s.src} alt="" className="h-full w-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-ink/60 px-1 py-0.5 text-[8px] text-canvas text-center">
                      {s.label}
                    </span>
                  </button>
                );
              })}

              {uploadedShopper && (
                <button
                  type="button"
                  aria-pressed
                  aria-label="Your uploaded photo"
                  className="relative h-14 w-14 overflow-hidden rounded-full border border-ink ring-2 ring-saffron ring-offset-2 ring-offset-canvas transition"
                >
                  <img src={uploadedShopper} alt="" className="h-full w-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-ink/60 px-1 py-0.5 text-[8px] text-canvas text-center">
                    You
                  </span>
                </button>
              )}

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-canvas-raised px-3 py-2 text-xs text-ink-soft transition hover:border-ink hover:text-ink focus-within:ring-2 focus-within:ring-saffron focus-within:ring-offset-1">
                <Upload aria-hidden className="h-3.5 w-3.5" />
                Upload photo
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                  className="sr-only"
                  onChange={onUpload}
                  aria-label="Upload a shopper photograph"
                />
              </label>
            </div>
            {uploadError && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-clay" role="alert">
                <AlertCircle aria-hidden className="h-3.5 w-3.5 shrink-0" />
                {uploadError}
              </p>
            )}
          </div>

          {/* Quick looks */}
          <div className="mt-8">
            <Eyebrow as="div">Quick looks</Eyebrow>
            <div className="mt-3 flex flex-wrap gap-2">
              {outfitPresets.map((preset) => {
                const active = currentPreset === preset.name;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-offset-1 ${
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

          {/* Garment picker */}
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
                          setActivePreset(null);
                        }}
                        className="text-[11px] text-ink-soft underline-offset-2 hover:text-ink hover:underline focus:outline-none focus:underline"
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
                            if (active) {
                              const next = { ...selection };
                              delete next[cat];
                              setSelection(next);
                            } else {
                              setSelection({ ...selection, [cat]: g.id });
                            }
                            setActivePreset(null);
                          }}
                          aria-pressed={active}
                          title={`${g.name} — ${g.brand} — ${formatPrice(g.price)}`}
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-offset-1 ${
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

          {/* Try instead suggestions */}
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
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1.5 text-[11px] text-ink-soft transition hover:border-ink hover:text-ink focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-offset-1"
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

          {/* Recolor / edit mode */}
          <div className="mt-8">
            <Eyebrow as="div">Restyle</Eyebrow>
            <p className="mt-1 text-xs text-ink-soft">
              Describe a change — recolor, swap fabric, adjust styling — and the AI will apply it
              while keeping your pose and identity.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Change the blazer to mustard yellow",
                "Make the kurta cobalt blue",
                "Switch to a floral print",
                "Add a red silk dupatta",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setEditInstruction(suggestion);
                    setTryOnMode("edit");
                  }}
                  className="rounded-full border border-line px-3 py-1.5 text-[11px] text-ink-soft transition hover:border-ink hover:text-ink"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <textarea
              value={editInstruction}
              onChange={(e) => {
                setEditInstruction(e.target.value);
                setTryOnMode(e.target.value ? "edit" : "tryon");
              }}
              placeholder="e.g. change the tie to cobalt blue, keep everything else"
              rows={2}
              maxLength={500}
              className="mt-3 w-full resize-none rounded-sm border border-line bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-soft/60 focus:border-ink focus:outline-none"
            />
            {editInstruction && (
              <button
                type="button"
                onClick={() => {
                  setEditInstruction("");
                  setTryOnMode("tryon");
                }}
                className="mt-1 text-[11px] text-ink-soft underline-offset-2 hover:underline"
              >
                Clear instruction (use garment swap instead)
              </button>
            )}
          </div>

          {/* ARIA live region */}
          <div aria-live="polite" className="sr-only">
            {ariaStageText}
          </div>

          {/* Render action */}
          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-6">
            <button
              type="button"
              onClick={handleRender}
              disabled={isRendering || (!hasSelection && !editInstruction)}
              className="btn-saffron disabled:opacity-50"
            >
              {isRendering ? (
                <>
                  <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                  Draping…
                </>
              ) : tryOnMode === "edit" ? (
                <>Restyle it</>
              ) : (
                <>See it on me</>
              )}
            </button>
            <button type="button" onClick={reset} className="btn-ghost">
              <RotateCcw aria-hidden className="h-4 w-4" />
              Reset
            </button>
            {hasSelection && (
              <div className="ml-auto text-right">
                <div className="eyebrow">Outfit total</div>
                <div className="font-display text-2xl text-ink">{formatPrice(total)}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
