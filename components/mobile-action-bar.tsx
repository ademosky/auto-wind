"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { WhatsAppMark } from "@/components/contact-buttons";

/**
 * Fixed bottom action bar on phones: price stays visible and the two
 * contact actions are always one thumb-tap away.
 */
export function MobileActionBar({
  priceLabel,
  phoneHref,
  phoneDisplay,
  whatsappHref,
  subject,
}: {
  priceLabel: string;
  phoneHref?: string | null;
  phoneDisplay?: string | null;
  whatsappHref?: string | null;
  subject?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 280);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!phoneHref && !whatsappHref) return null;

  const waHref = whatsappHref
    ? `${whatsappHref}${subject ? `?text=${encodeURIComponent(subject)}` : ""}`
    : null;

  return (
    <div
      className={`aw-safe-bottom fixed inset-x-3 bottom-[46px] z-40 border border-gold-500/25 bg-brand-950/96 backdrop-blur-xl transition-transform duration-300 lg:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-[150%]"
      }`}
      aria-hidden={!visible}
    >
      <div className="flex items-center gap-3 px-4 pt-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-stone-2/50">Цена</p>
          <p className="truncate font-display text-[21px] leading-tight text-gold-300">{priceLabel}</p>
        </div>

        {waHref ? (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Пиши на WhatsApp"
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center border border-gold-500/40 text-gold-100 transition-colors hover:bg-gold-500/10 active:scale-[0.97]"
          >
            <WhatsAppMark className="h-5 w-5" />
          </a>
        ) : null}

        {phoneHref ? (
          <a
            href={phoneHref}
            className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 bg-gold-500 px-5 text-[13px] font-bold uppercase tracking-[0.14em] text-brand-950 transition-colors hover:bg-gold-300 active:scale-[0.98]"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{phoneDisplay ?? "Јави се"}</span>
            <span className="sm:hidden">Јави се</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}


