"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation } from "lucide-react";
import { BUSINESS, GOOGLE_DIRECTIONS_LINK, GOOGLE_MAPS_LINK } from "@/lib/site";

/**
 * Интерактивна карта на локацијата (OpenStreetMap).
 *
 * Без API клуч и без колачиња од трети страни. Картата се вчитува само кога
 * е видлива на екранот, за да не го забавува мобилниот.
 */
export function BusinessMap({ className = "" }: { className?: string }) {
  const holder = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const node = holder.current;
    if (!node) return;

    let map: import("leaflet").Map | null = null;
    let cancelled = false;
    let started = false;

    const start = async () => {
      if (started || cancelled) return;
      started = true;
      try {
        const L = await import("leaflet");
        if (cancelled || !holder.current) return;

        map = L.map(holder.current, {
          center: [BUSINESS.latitude, BUSINESS.longitude],
          zoom: BUSINESS.zoom,
          // не го заробува скролот на страницата на телефон
          dragging: !L.Browser.mobile,
          touchZoom: true,
          scrollWheelZoom: false,
          zoomControl: false,
          keyboard: true,
        });

        L.control.zoom({ position: "bottomright" }).addTo(map);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
        }).addTo(map);

        const icon = L.divIcon({
          className: "",
          html: `<span style="display:block;width:22px;height:22px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:linear-gradient(135deg,#f8efcf,#c9a75a 45%,#96742f);border:2px solid #03170e;box-shadow:0 4px 12px rgba(0,0,0,.5)"></span>`,
          iconSize: [22, 22],
          iconAnchor: [11, 22],
          popupAnchor: [0, -20],
        });

        const marker = L.marker([BUSINESS.latitude, BUSINESS.longitude], {
          icon,
          title: BUSINESS.name,
          alt: BUSINESS.addressFull,
          keyboard: true,
        }).addTo(map);

        marker.bindPopup(
          `<strong style="display:block;font-size:14px;letter-spacing:.02em">${BUSINESS.name}</strong>` +
            `<span style="display:block;margin-top:4px;color:rgba(246,243,236,.8)">${BUSINESS.addressFull}</span>` +
            `<a href="${GOOGLE_DIRECTIONS_LINK}" target="_blank" rel="noopener" style="display:inline-block;margin-top:8px;color:#f0d9a3;font-weight:600">Отвори насоки ›</a>`,
          { closeButton: false, autoClose: false, closeOnClick: false, offset: [0, -6] },
        );

        if (window.innerWidth >= 640) marker.openPopup();
        marker.on("click", () => marker.openPopup());

        setReady(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          void start();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
      map?.remove();
    };
  }, []);

  return (
    <div className={className}>
      <div className="relative overflow-hidden border border-gold-500/20 bg-brand-800">
        <div
          ref={holder}
          className="aw-map h-[280px] w-full sm:h-[320px]"
          role="region"
          aria-label={`Карта — ${BUSINESS.addressFull}`}
          data-lat={BUSINESS.latitude}
          data-lng={BUSINESS.longitude}
          data-address={BUSINESS.addressFull}
        />

        {!ready && !failed ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[linear-gradient(150deg,#0a3a26,#03170e_70%)]">
            <span className="text-[11px] uppercase tracking-[0.28em] text-gold-500/70">Се вчитува картата…</span>
          </div>
        ) : null}

        {failed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[linear-gradient(150deg,#0a3a26,#03170e_70%)] px-6 text-center">
            <MapPin className="h-6 w-6 text-gold-500" aria-hidden="true" />
            <p className="text-[14px] text-stone-2/75">{BUSINESS.addressFull}</p>
            <a
              href={GOOGLE_MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-gold-300 underline-offset-4 hover:underline"
            >
              Отвори во Google Maps
            </a>
          </div>
        ) : null}

        {ready ? (
          <a
            href={GOOGLE_DIRECTIONS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute left-3 top-3 z-[500] inline-flex min-h-[40px] items-center gap-2 border border-gold-500/40 bg-brand-950/85 px-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-gold-100 backdrop-blur transition-colors hover:bg-brand-950 active:scale-[0.98]"
          >
            <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
            Насоки
          </a>
        ) : null}
      </div>

      <p className="mt-2 text-[12.5px] text-stone-2/50 sm:hidden">
        На телефон: со два прста за движење по картата
      </p>
    </div>
  );
}

