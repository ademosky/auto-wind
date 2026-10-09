"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";

type Img = { id: string; url: string; width?: number | null; height?: number | null };

export function VehicleGallery({ images, alt }: { images: Img[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const total = images.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (total === 0) return;
      setIndex((i) => (i + dir + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, go]);

  if (total === 0) {
    return (
      <div className="relative flex aspect-[4/3] items-center justify-center border border-gold-500/20 bg-brand-800 sm:aspect-[16/10]">
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold-500/60">Фотографии во подготовка</span>
      </div>
    );
  }

  const current = images[Math.min(index, total - 1)];
  // portrait photos are shown in full; they would lose the roof and wheels if cropped
  const portrait = (current?.height ?? 0) > (current?.width ?? 0);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || total < 2) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // ignore vertical scrolls and taps
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? 1 : -1);
  };

  return (
    <div>
      <div
        className="relative aspect-[4/3] touch-pan-y overflow-hidden border border-gold-500/20 bg-brand-800"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {portrait ? (
          <Image
            src={current.url}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="scale-110 object-cover opacity-40 blur-2xl"
          />
        ) : null}

        <Image
          key={current.id}
          src={current.url}
          alt={`${alt} — фотографија ${index + 1}`}
          fill
          priority={index === 0}
          fetchPriority={index === 0 ? "high" : "auto"}
          sizes="(max-width: 1024px) 100vw, 62vw"
          className={portrait ? "object-contain" : "object-cover"}
        />

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Претходна фотографија"
              className="absolute left-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center border border-gold-500/35 bg-brand-950/70 text-gold-100 backdrop-blur transition-colors hover:bg-brand-950/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 sm:inline-flex"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Следна фотографија"
              className="absolute right-2 top-1/2 hidden h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center border border-gold-500/35 bg-brand-950/70 text-gold-100 backdrop-blur transition-colors hover:bg-brand-950/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 sm:inline-flex"
            >
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Отвори на цел екран"
          className="absolute right-3 top-3 inline-flex h-11 w-11 cursor-pointer items-center justify-center border border-gold-500/35 bg-brand-950/70 text-gold-100 backdrop-blur transition-colors hover:bg-brand-950/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
        >
          <Expand className="h-5 w-5" aria-hidden="true" />
        </button>

        <span className="absolute bottom-3 left-3 border border-gold-500/25 bg-brand-950/70 px-3 py-1.5 text-[12px] font-semibold tracking-[0.12em] text-stone-2/85 backdrop-blur">
          {index + 1} / {total}
        </span>

        {total > 1 ? (
          <span
            className="absolute bottom-3.5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 sm:hidden"
            aria-hidden="true"
          >
            {images.map((img, i) => (
              <span
                key={img.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-4 bg-gold-300" : "w-1.5 bg-stone-2/35"
                }`}
              />
            ))}
          </span>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="aw-no-scrollbar mt-3 flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-1 sm:gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Прикажи фотографија ${i + 1}`}
              aria-current={i === index}
              className={`relative h-16 w-24 shrink-0 cursor-pointer snap-start overflow-hidden border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 sm:h-20 sm:w-28 ${
                i === index ? "border-gold-500 opacity-100" : "border-gold-500/20 opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img.url} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} — галерија`}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-950/97 p-3 backdrop-blur-sm sm:p-4"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Затвори"
            className="absolute right-3 top-3 inline-flex h-12 w-12 cursor-pointer items-center justify-center border border-gold-500/35 text-gold-100 transition-colors hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <div
            className="relative h-[70vh] w-full max-w-5xl sm:h-[76vh]"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <Image
              key={`big-${current.id}`}
              src={current.url}
              alt={`${alt} — фотографија ${index + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {total > 1 ? (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Претходна фотографија"
                className="absolute left-1 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center border border-gold-500/35 text-gold-100 transition-colors hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 sm:left-3"
              >
                <ArrowLeft className="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Следна фотографија"
                className="absolute right-1 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center border border-gold-500/35 text-gold-100 transition-colors hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 sm:right-3"
              >
                <ArrowRight className="h-6 w-6" aria-hidden="true" />
              </button>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[12px] tracking-[0.2em] text-stone-2/70">
                {index + 1} / {total}
              </span>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

