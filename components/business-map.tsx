import { MapPin } from "lucide-react";
import { BUSINESS, GOOGLE_EMBED_URL, GOOGLE_MAPS_LINK } from "@/lib/site";

/**
 * Вградена Google Maps карта на локацијата на AUTO WIND.
 *
 * Го користи официјалниот вграден код од Google (без API клуч), се вчитува
 * одложено и работи без JavaScript на страницата.
 */
export function BusinessMap({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <div className="overflow-hidden border border-gold-500/20 bg-brand-800">
        <iframe
          src={GOOGLE_EMBED_URL}
          title={`Google Maps — ${BUSINESS.name}, ${BUSINESS.addressFull}`}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="block h-[280px] w-full sm:h-[340px]"
          style={{ border: 0 }}
        />
      </div>

      <a
        href={GOOGLE_MAPS_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center gap-2.5 border border-gold-500/35 px-5 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-gold-100 transition-colors hover:border-gold-500 hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 active:scale-[0.99] sm:w-auto"
      >
        <MapPin className="h-4 w-4" aria-hidden="true" />
        Отвори во Google Maps
      </a>
    </div>
  );
}

