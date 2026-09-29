"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";

type Img = { id: string; url: string };

export function VehicleGallery({ images, alt }: { images: Img[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
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
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, go]);

  if (total === 0) {
    return (
      <div className="relative flex aspect-[16/10] items-center justify-center border border-gold-500/20 bg-brand-800">
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold-500/60">
          Фотографии во подготовка
        </span>
      </div>
    );
  }

  const current = images[Math.min(index, total - 1)];

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden border border-gold-500/20 bg-brand-800">
        <Image
          key={current.id}
          src={current.url}
          alt={`${alt} — фотографија ${index + 1}`}
          fill
          priority={index === 0}
          sizes="(max-width: 1024px) 100vw, 62vw"
          className="object-cover"
        />

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Претходна фотографија"
              className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center border border-gold-500/35 bg-brand-950/70 text-gold-100 backdrop-blur transition-colors hover:bg-brand-950/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Следна фотографија"
              className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center border border-gold-500/35 bg-brand-950/70 text-gold-100 backdrop-blur transition-colors hover:bg-brand-950/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
            >
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Отвори на цел екран"
          className="absolute bottom-3 right-3 inline-flex cursor-pointer items-center gap-2 border border-gold-500/35 bg-brand-950/70 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-100 backdrop-blur transition-colors hover:bg-brand-950/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
        >
          <Expand className="h-3.5 w-3.5" aria-hidden="true" />
          Целосно
        </button>

        <span className="absolute bottom-3 left-3 border border-gold-500/25 bg-brand-950/70 px-3 py-2 text-[11px] font-semibold tracking-[0.14em] text-stone-2/80 backdrop-blur">
          {index + 1} / {total}
        </span>
      </div>

      {total > 1 ? (
        <div className="aw-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Прикажи фотографија ${i + 1}`}
              aria-current={i === index}
              className={`relative h-16 w-24 shrink-0 cursor-pointer overflow-hidden border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 md:h-20 md:w-28 ${
                i === index
                  ? "border-gold-500 opacity-100"
                  : "border-gold-500/20 opacity-60 hover:opacity-100"
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
          className="fixed inset-0 z-[70] flex items-center justify-center bg-brand-950/96 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Затвори"
            className="absolute right-4 top-4 inline-flex h-11 w-11 cursor-pointer items-center justify-center border border-gold-500/35 text-gold-100 transition-colors hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="relative h-[76vh] w-full max-w-5xl">
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
                className="absolute left-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center border border-gold-500/35 text-gold-100 transition-colors hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
              >
                <ArrowLeft className="h-6 w-6" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Следна фотографија"
                className="absolute right-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center border border-gold-500/35 text-gold-100 transition-colors hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
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

