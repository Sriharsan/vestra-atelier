import { useCallback, useMemo, useRef, useState } from "react";
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
  GripVertical,
  User,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Eyebrow } from "@/components/Eyebrow";
import { IridescentBadge } from "@/components/IridescentBadge";
import {
  PERSON_PRESETS,
  TRYON_LOOKS,
  getLooksByGender,
  getLookById,
  type PersonPreset,
  type TryOnLook,
} from "@/data/tryonCatalogue";
import { runTryOn, type TryOnStage, type TryOnResult } from "@/lib/stubs/tryOn";
import { track } from "@/lib/stubs/analytics";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_FILE_SIZE = 8 * 1024 * 1024;

export function TryOnDemo({ initialGarmentId }: { initialGarmentId?: string } = {}) {
  const reduced = useReducedMotion();

  const [gender, setGender] = useState<"women" | "men">("women");
  const [personPresetId, setPersonPresetId] = useState<string | null>(PERSON_PRESETS[0].id);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const initialLookId = initialGarmentId
    ? TRYON_LOOKS.find((l) => l.id === initialGarmentId)?.id
    : undefined;
  const [selectedLookId, setSelectedLookId] = useState<string | null>(initialLookId ?? null);
  const [stage, setStage] = useState<TryOnStage>({ kind: "idle" });
  const [result, setResult] = useState<TryOnResult | null>(null);
  const [shareTooltip, setShareTooltip] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const draggingSlider = useRef(false);

  const personSrc = useMemo(() => {
    if (uploadedImage) return uploadedImage;
    const preset = PERSON_PRESETS.find((p) => p.id === personPresetId);
    return preset?.src ?? PERSON_PRESETS[0].src;
  }, [uploadedImage, personPresetId]);

  const selectedLook = useMemo(
    () => (selectedLookId ? getLookById(selectedLookId) : undefined),
    [selectedLookId],
  );

  const filteredLooks = useMemo(() => getLooksByGender(gender), [gender]);

  const isRendering =
    stage.kind === "uploading" || stage.kind === "rendering" || stage.kind === "queued";
  const canTry = !!personSrc && !!selectedLook && !isRendering;

  function selectPreset(preset: PersonPreset) {
    setPersonPresetId(preset.id);
    setUploadedImage(null);
    setUploadedFile(null);
    setUploadError(null);
    setGender(preset.gender);
    setResult(null);
    setStage({ kind: "idle" });
  }

  function handleFileSelect(file: File) {
    setUploadError(null);
    if (!ACCEPTED_TYPES.includes(file.type) && !file.name.toLowerCase().endsWith(".heic")) {
      setUploadError("Upload a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("Image must be under 8 MB.");
      return;
    }
    const url = URL.createObjectURL(file);
    setUploadedImage(url);
    setUploadedFile(file);
    setPersonPresetId(null);
    setResult(null);
    setStage({ kind: "idle" });
    track("tryon_upload");
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  function selectLook(look: TryOnLook) {
    setSelectedLookId(look.id);
    setResult(null);
    setStage({ kind: "idle" });
  }

  const handleTryOn = useCallback(async () => {
    if (!personSrc || !selectedLook) return;

    track("tryon_start", { lookId: selectedLook.id });
    setResult(null);
    setSliderPos(50);

    let personB64 = personSrc;
    if (uploadedFile) {
      const buf = await uploadedFile.arrayBuffer();
      const b64 = btoa(new Uint8Array(buf).reduce((s, b) => s + String.fromCharCode(b), ""));
      personB64 = `data:${uploadedFile.type};base64,${b64}`;
    }

    const presetId = personPresetId;
    const prebaked =
      presetId && selectedLook.prebakedResults?.[presetId]
        ? selectedLook.prebakedResults[presetId]
        : undefined;

    for await (const s of runTryOn(
      {
        personImage: personB64,
        garmentImage: selectedLook.image,
        garmentId: selectedLook.id,
        garmentName: selectedLook.name,
        category: selectedLook.garmentCategory,
      },
      prebaked,
    )) {
      setStage(s);
      if (s.kind === "done") {
        setResult(s.result);
        track("tryon_done", { lookId: selectedLook.id, provider: s.result.provider });
      }
    }
  }, [personSrc, selectedLook, uploadedFile, personPresetId]);

  function reset() {
    setPersonPresetId(PERSON_PRESETS[0].id);
    setUploadedImage(null);
    setUploadedFile(null);
    setUploadError(null);
    setGender("women");
    setSelectedLookId(null);
    setResult(null);
    setStage({ kind: "idle" });
  }

  async function handleShare() {
    const shareData = {
      title: "My Vestra Look",
      text: "See this look I tried on Vestra.",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        track("tryon_share", { method: "native" });
        return;
      } catch {
        /* cancelled */
      }
    }
    await navigator.clipboard.writeText(window.location.href);
    setShareTooltip(true);
    track("tryon_share", { method: "clipboard" });
    setTimeout(() => setShareTooltip(false), 1500);
  }

  function onSliderMove(clientX: number) {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }

  function onSliderPointerDown(e: React.PointerEvent) {
    draggingSlider.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    onSliderMove(e.clientX);
  }

  function onSliderPointerMove(e: React.PointerEvent) {
    if (!draggingSlider.current) return;
    onSliderMove(e.clientX);
  }

  function onSliderPointerUp() {
    draggingSlider.current = false;
  }

  const ariaStageText = useMemo(() => {
    switch (stage.kind) {
      case "idle":
        return "Ready to try on.";
      case "uploading":
        return `Uploading, ${stage.progress} percent.`;
      case "rendering":
        return `Tailoring your look, ${stage.progress} percent.`;
      case "queued":
        return stage.message;
      case "done":
        return "Your look is ready.";
      case "error":
        return `Error: ${stage.message}`;
      default:
        return "";
    }
  }, [stage]);

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-12 md:px-10 md:py-20">
      <div className="mb-10 max-w-2xl">
        <Eyebrow>The dressing room</Eyebrow>
        <h2
          className="mt-3 font-display text-ink"
          style={{
            fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          Upload your photo, <span className="italic text-saffron-deep">try it on.</span>
        </h2>
        <p className="mt-3 max-w-lg text-sm text-ink-soft">
          Pick a person, choose a look, and see how it fits. Your photo stays in your browser during
          demo mode.
        </p>
      </div>

      {/* Diptych layout */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* LEFT — Person panel */}
        <div>
          <Eyebrow as="div">Your photo</Eyebrow>

          {/* Upload zone */}
          <div
            className={`relative mt-3 aspect-[3/4] w-full overflow-hidden rounded-sm border-2 border-dashed transition ${
              isDragging ? "border-saffron bg-saffron/5" : "border-line bg-canvas-raised"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            {personSrc ? (
              <img src={personSrc} alt="Selected person" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <User className="h-10 w-10 text-ink/20" />
                <p className="text-sm text-ink-soft">Drop a photo here or use a preset below</p>
              </div>
            )}

            {/* Shimmer overlay during render */}
            {isRendering && (
              <div className="absolute inset-0 iridescent mix-blend-soft-light" aria-hidden />
            )}

            {/* Result comparison slider */}
            {result && result.imageUrl && stage.kind === "done" && (
              <div
                ref={sliderRef}
                className="absolute inset-0 cursor-ew-resize select-none"
                onPointerDown={onSliderPointerDown}
                onPointerMove={onSliderPointerMove}
                onPointerUp={onSliderPointerUp}
                role="slider"
                aria-label="Drag to compare"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(sliderPos)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") setSliderPos((p) => Math.max(0, p - 2));
                  if (e.key === "ArrowRight") setSliderPos((p) => Math.min(100, p + 2));
                }}
              >
                <AnimatePresence>
                  <motion.img
                    key="result"
                    src={result.imageUrl}
                    alt="Try-on result"
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                    initial={reduced ? { opacity: 0 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduced ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }}
                  />
                </AnimatePresence>

                {/* Slider handle */}
                <div
                  className="absolute top-0 bottom-0 z-10 w-0.5 bg-white shadow-lg"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-ink/70 text-white shadow-fabric">
                    <GripVertical className="h-4 w-4" />
                  </div>
                </div>

                {/* Labels */}
                <span className="absolute left-3 top-3 rounded-full bg-ink/60 px-2 py-0.5 text-[10px] font-medium text-white">
                  Before
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-ink/60 px-2 py-0.5 text-[10px] font-medium text-white">
                  After
                </span>
              </div>
            )}

            {/* Badge */}
            <div className="absolute left-3 bottom-3">
              {isRendering && <IridescentBadge label="Tailoring your look" />}
              {stage.kind === "done" && result && <IridescentBadge label="Rendered by Vestra" />}
            </div>
          </div>

          {/* Presets */}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {PERSON_PRESETS.filter((p) => p.gender === gender).map((p) => {
              const active = !uploadedImage && personPresetId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => selectPreset(p)}
                  aria-pressed={active}
                  aria-label={`Use ${p.label}`}
                  className={`relative h-12 w-12 overflow-hidden rounded-full border transition focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-offset-1 ${
                    active
                      ? "border-ink ring-2 ring-saffron ring-offset-2 ring-offset-canvas"
                      : "border-line hover:border-ink"
                  }`}
                >
                  <img src={p.src} alt="" className="h-full w-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-ink/60 px-1 py-px text-[8px] text-canvas text-center">
                    {p.label}
                  </span>
                </button>
              );
            })}

            {uploadedImage && (
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-ink ring-2 ring-saffron ring-offset-2 ring-offset-canvas">
                <img src={uploadedImage} alt="Your upload" className="h-full w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-ink/60 px-1 py-px text-[8px] text-canvas text-center">
                  You
                </span>
              </div>
            )}

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-canvas-raised px-3 py-2 text-xs text-ink-soft transition hover:border-ink hover:text-ink focus-within:ring-2 focus-within:ring-saffron focus-within:ring-offset-1">
              <Upload aria-hidden className="h-3.5 w-3.5" />
              Upload photo
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                className="sr-only"
                onChange={onFileChange}
                aria-label="Upload your photograph"
              />
            </label>
          </div>

          {uploadError && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-clay" role="alert">
              <AlertCircle aria-hidden className="h-3.5 w-3.5 shrink-0" />
              {uploadError}
            </p>
          )}

          {/* Status bar */}
          <div className="mt-4">
            {stage.kind === "uploading" && (
              <div className="flex items-center gap-2 text-xs text-ink-soft">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Uploading — {stage.progress}%
              </div>
            )}
            {stage.kind === "rendering" && (
              <div className="flex items-center gap-2 text-xs text-ink-soft">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Tailoring your look — {stage.progress}%
                {stage.etaMs > 5000 && (
                  <span className="text-ink-soft/60">
                    (may take up to {Math.ceil(stage.etaMs / 1000)}s on a free provider)
                  </span>
                )}
              </div>
            )}
            {stage.kind === "queued" && (
              <div className="flex items-center gap-2 text-xs text-ink-soft">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {stage.message}
              </div>
            )}
            {stage.kind === "done" && result && (
              <div className="flex items-center gap-2 text-xs text-ink-soft">
                <Check className="h-3.5 w-3.5 text-saffron-deep" />
                {result.mock
                  ? "Demo preview"
                  : `Rendered in ${(result.durationMs / 1000).toFixed(1)}s`}
                {" · "}Drag to compare
              </div>
            )}
            {stage.kind === "error" && (
              <p className="flex items-center gap-2 text-xs text-clay" role="alert">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {stage.message}
                <button
                  type="button"
                  onClick={handleTryOn}
                  className="ml-1 underline underline-offset-2 hover:text-ink"
                >
                  Retry
                </button>
              </p>
            )}
          </div>

          {/* Result actions */}
          {stage.kind === "done" && result && (
            <div className="mt-4 flex flex-wrap gap-2">
              {result.imageUrl && (
                <a
                  href={result.imageUrl}
                  download="vestra-look.jpg"
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs transition hover:border-ink focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-offset-1"
                >
                  <Download aria-hidden className="h-3 w-3" />
                  Download
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setStage({ kind: "idle" });
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs transition hover:border-ink focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-offset-1"
              >
                <RotateCcw aria-hidden className="h-3 w-3" />
                Try another
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs transition hover:border-ink focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-offset-1"
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
              {selectedLook && (
                <Link
                  to={selectedLook.shopLink}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs transition hover:border-ink focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-offset-1"
                >
                  <ShoppingBag aria-hidden className="h-3 w-3" />
                  Shop this look
                </Link>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — Garment panel */}
        <div>
          {/* Gender toggle */}
          <Eyebrow as="div">Whose look is this?</Eyebrow>
          <div
            className="mt-3 inline-flex rounded-full border border-line p-0.5"
            role="radiogroup"
            aria-label="Gender selection"
          >
            {(["women", "men"] as const).map((g) => (
              <button
                key={g}
                type="button"
                role="radio"
                aria-checked={gender === g}
                onClick={() => {
                  setGender(g);
                  setSelectedLookId(null);
                  setResult(null);
                  setStage({ kind: "idle" });
                  if (!uploadedImage) {
                    const preset = PERSON_PRESETS.find((p) => p.gender === g);
                    if (preset) setPersonPresetId(preset.id);
                  }
                }}
                className={`rounded-full px-5 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-offset-1 ${
                  gender === g
                    ? "bg-ink text-canvas shadow-fabric-sm"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {g === "women" ? "Women" : "Men"}
              </button>
            ))}
          </div>

          {/* Dress rail */}
          <div className="mt-8">
            <Eyebrow as="div">Choose a look</Eyebrow>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {filteredLooks.map((look) => {
                const active = selectedLookId === look.id;
                return (
                  <button
                    key={look.id}
                    type="button"
                    onClick={() => selectLook(look)}
                    aria-pressed={active}
                    className={`group relative overflow-hidden rounded-sm border-2 transition focus:outline-none focus:ring-2 focus:ring-saffron focus:ring-offset-1 ${
                      active
                        ? "border-saffron shadow-fabric"
                        : "border-transparent hover:border-line"
                    }`}
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-canvas-raised">
                      <img
                        src={look.image}
                        alt={look.name}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-2 text-left">
                      <p className="text-xs font-medium text-ink">{look.name}</p>
                      <p className="mt-0.5 text-[10px] text-ink-soft">{look.fabric}</p>
                    </div>
                    {active && (
                      <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-saffron text-white">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected look detail */}
          {selectedLook && (
            <div className="mt-6 rounded-sm border border-line bg-canvas-raised p-4">
              <p className="font-display text-lg text-ink">{selectedLook.name}</p>
              <p className="mt-1 text-xs text-ink-soft">{selectedLook.description}</p>
              <p className="mt-1 text-xs text-ink-soft">Fabric: {selectedLook.fabric}</p>
            </div>
          )}

          {/* Action */}
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
            <button
              type="button"
              onClick={handleTryOn}
              disabled={!canTry}
              className="btn-saffron disabled:opacity-50"
            >
              {isRendering ? (
                <>
                  <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                  Tailoring…
                </>
              ) : (
                "Try it on"
              )}
            </button>
            <button type="button" onClick={reset} className="btn-ghost">
              <RotateCcw aria-hidden className="h-4 w-4" />
              Reset
            </button>
          </div>

          {/* Privacy note */}
          <p className="mt-6 max-w-md text-[11px] text-ink-soft/70">
            Results are AI-generated previews. Your photograph stays in your browser during demo
            mode. In production, images are processed in-session, retained briefly for quality, then
            permanently deleted. Never used for training.
          </p>
        </div>
      </div>

      {/* ARIA live region */}
      <div aria-live="polite" className="sr-only">
        {ariaStageText}
      </div>
    </section>
  );
}
