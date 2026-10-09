"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { parseYouTubeUrl } from "@/lib/youtube";

export function VehicleVideo({ url, title }: { url: string; title: string }) {
  const video = parseYouTubeUrl(url);
  const [playing, setPlaying] = useState(false);

  if (!video) return null;

  return (
    <div className="relative aspect-video overflow-hidden border border-gold-500/20 bg-brand-800">
      {playing ? (
        <iframe
          src={`${video.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
          title={`Видео — ${title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Пусти видео за ${title}`}
          className="group absolute inset-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold-500/60"
        >
          <Image
            src={video.thumbnailUrl}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 62vw"
            className="object-cover opacity-70 transition-opacity duration-300 group-hover:opacity-90"
          />
          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(3,23,14,0.75),rgba(3,23,14,0.25))]" />
          <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-4">
            <span className="inline-flex h-[68px] w-[68px] items-center justify-center rounded-full border border-gold-500/60 bg-brand-950/70 backdrop-blur transition-colors duration-300 group-hover:border-gold-500 group-hover:bg-brand-950/90">
              <Play className="ml-1 h-7 w-7 text-gold-300" aria-hidden="true" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-200">
              Пусти видео
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

