"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";

type Img = { id: string; url: string; width?: number | null; height?: number | null };

/**
 * Галерија на возилото.
 *
 * Главната фотографија се прикажува во својот природен формат (преку цела ширина),
 * па никогаш не се сече и не скока чудно. Сите фотографии стојат под неа како
 * полици — допир на која било отвора целосен приказ.
 */
export function VehicleGallery({ images, alt }: { images: Img[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const strip = useRef<HTMLDivElement | null>(null);
  const total = images.length;

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + (images.length || 1)) % (images.length || 1)),
    [images.length],
  );

  useEffect(() => {
    const el = strip.current?.querySelector<HTMLElement>(`[data-thumb="${index}"]`);
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [index]);

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
      <div className="flex aspect-[4/3] items-center justify-center border border-gold-500/20 bg-brand-800">
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold-500/60">Фотографии во подготовка</span>
      </div>
    );
  }

  const current = images[Math.min(index, total - 1)];
  const currentW = current.width && current.width > 0 ? current.width : 1200;
  const currentH = current.height && current.height > 0 ? current.height : 900;

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
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
    go(dx < 0 ? 1 : -1);
  };

  return (
    <div>
      {/* the photo keeps its own proportions: it is shown whole, never cropped */}
      <div className="relative border border-gold-500/20 bg-brand-800" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <Image
          key={current.id}
          src={current.url}
          alt={`${alt} — фотографија ${index + 1}`}
          width={currentW}
          height={currentH}
          priority={index === 0}
          fetchPriority={index === 0 ? "high" : "auto"}
          sizes="(max-width: 1024px) 100vw, 62vw"
          className="block h-auto w-full"
        />

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Отвори ги фотографиите на цел екран (${total})`}
          className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-500/60"
        />

        <span className="pointer-events-none absolute right-3 top-3 z-20 inline-flex h-9 items-center gap-2 border border-gold-500/30 bg-brand-950/70 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-100 backdrop-blur">
          <Expand className="h-3.5 w-3.5" aria-hidden="true" />
          Целосно
        </span>

        {total > 1 ? (
          <span className="pointer-events-none absolute bottom-3 left-3 z-20 border border-gold-500/25 bg-brand-950/70 px-3 py-1.5 text-[12px] font-semibold tracking-[0.12em] text-stone-2/85 backdrop-blur">
            {index + 1} / {total}
          </span>
        ) : null}

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Претходна фотографија"
              className="absolute left-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center border border-gold-500/35 bg-brand-950/70 text-gold-100 backdrop-blur transition-colors hover:bg-brand-950/90 sm:inline-flex"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Следна фотографија"
              className="absolute right-2 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center border border-gold-500/35 bg-brand-950/70 text-gold-100 backdrop-blur transition-colors hover:bg-brand-950/90 sm:inline-flex"
            >
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="mt-3">
          <div ref={strip} className="aw-no-scrollbar flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                data-thumb={i}
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
                aria-label={`Отвори фотографија ${i + 1} од ${total}`}
                aria-current={i === index}
                className={`relative h-[76px] w-[104px] shrink-0 cursor-pointer snap-start overflow-hidden border bg-brand-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 sm:h-[88px] sm:w-[120px] ${
                  i === index ? "border-gold-500" : "border-gold-500/20 opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img.url} alt="" fill sizes="120px" className="object-cover" />
              </button>
            ))}
          </div>

          <p className="mt-2 text-center text-[12.5px] text-stone-2/55 sm:hidden">
            Допрете фотографија за целосен приказ
          </p>
        </div>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} — галерија`}
          className="fixed inset-0 z-[70] flex flex-col bg-brand-950/98 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="text-[12.5px] tracking-[0.2em] text-stone-2/70">
              {index + 1} / {total}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Затвори"
              className="inline-flex h-12 w-12 cursor-pointer items-center justify-center border border-gold-500/35 text-gold-100 transition-colors hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="relative flex-1" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <Image
              key={`big-${current.id}`}
              src={current.url}
              alt={`${alt} — фотографија ${index + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />

            {total > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Претходна фотографија"
                  className="absolute left-1 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center border border-gold-500/35 text-gold-100 transition-colors hover:bg-gold-500/10 sm:left-3"
                >
                  <ArrowLeft className="h-6 w-6" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Следна фотографија"
                  className="absolute right-1 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center border border-gold-500/35 text-gold-100 transition-colors hover:bg-gold-500/10 sm:right-3"
                >
                  <ArrowRight className="h-6 w-6" aria-hidden="true" />
                </button>
              </>
            ) : null}
          </div>

          {total > 1 ? (
            <div className="aw-no-scrollbar aw-safe-bottom flex gap-2 overflow-x-auto px-4 py-3">
              {images.map((img, i) => (
                <button
                  key={`pick-${img.id}`}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Прикажи фотографија ${i + 1}`}
                  className={`relative h-14 w-20 shrink-0 cursor-pointer overflow-hidden border ${
                    i === index ? "border-gold-500" : "border-gold-500/20 opacity-60"
                  }`}
                >
                  <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

