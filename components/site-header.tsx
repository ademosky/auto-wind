"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { ViberMark, WhatsAppMark } from "@/components/contact-buttons";

const NAV = [
  { href: "/", label: "Возила во понуда" },
  { href: "/#kontakt", label: "Контакт" },
];

export function SiteHeader({
  phoneDisplay,
  phoneHref,
  viber,
  whatsapp,
}: {
  phoneDisplay?: string | null;
  phoneHref?: string | null;
  viber?: string | null;
  whatsapp?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.replace("/#", "/"));

  const viberHref = viber ? `viber://chat?number=${encodeURIComponent(viber.replace(/[^+0-9]/g, ""))}` : null;
  const whatsappHref = whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}` : null;

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-gold-500/20 bg-brand-950/90 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-2 px-4 sm:h-[72px] sm:gap-3 sm:px-6 md:h-[88px] md:px-10">
        <Link
          href="/"
          aria-label="AUTO WIND — почетна"
          className="flex shrink-0 items-center transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
        >
          <span className="relative block h-[44px] w-[137px] overflow-hidden sm:h-12 sm:w-[149px] md:h-14 md:w-[174px]">
            <Image
              src="/brand/auto-wind-logo.webp"
              alt="AUTO WIND"
              fill
              priority
              sizes="(max-width: 640px) 137px, (max-width: 768px) 149px, 174px"
              unoptimized
              className="object-contain object-left drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Главна навигација">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={isActive(item.href)}
              className="aw-link text-[13px] font-medium uppercase tracking-[0.18em] text-stone-2/80 hover:text-gold-300 data-[active=true]:text-gold-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {phoneDisplay && phoneHref ? (
            <a
              href={phoneHref}
              className="hidden items-center gap-2 border border-gold-500/40 px-4 py-2.5 text-[13px] font-semibold tracking-[0.06em] text-gold-100 transition-colors hover:border-gold-500 hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 md:inline-flex"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {phoneDisplay}
            </a>
          ) : null}

          {phoneHref ? (
            <a
              href={phoneHref}
              aria-label={`Јави се на ${phoneDisplay ?? ""}`}
              className="inline-flex h-11 w-11 items-center justify-center bg-gold-500 text-brand-950 transition-colors hover:bg-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 active:scale-[0.97] md:hidden"
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
            </a>
          ) : null}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Затвори мени" : "Отвори мени"}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center border border-gold-500/30 text-gold-100 transition-colors hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 active:scale-[0.97] lg:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-gold-500/20 bg-brand-950/98 px-5 py-6 backdrop-blur-xl sm:top-[72px] md:top-[88px] lg:hidden"
        >
          <nav className="flex flex-col" aria-label="Мобилна навигација">
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ animationDelay: `${i * 50}ms` }}
                className="aw-rise border-b border-gold-500/12 py-4 font-display text-[24px] text-stone transition-colors hover:text-gold-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="aw-rise mt-7" style={{ animationDelay: "120ms" }}>
            <p className="aw-eyebrow">Контакт</p>
            <div className="mt-4 flex flex-col gap-3">
              {phoneHref ? (
                <a
                  href={phoneHref}
                  className="inline-flex min-h-[56px] items-center justify-center gap-2.5 bg-gold-500 px-5 text-[15px] font-bold tracking-[0.04em] text-brand-950 transition-colors hover:bg-gold-300 active:scale-[0.99]"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  {phoneDisplay ?? "Јави се"}
                </a>
              ) : null}

              <div className="grid grid-cols-2 gap-3">
                {viberHref ? (
                  <a
                    href={viberHref}
                    className="inline-flex min-h-[56px] items-center justify-center gap-2.5 border border-gold-500/40 px-4 text-[14px] font-semibold text-gold-100 transition-colors hover:bg-gold-500/10 active:scale-[0.99]"
                  >
                    <ViberMark className="h-5 w-5" />
                    Viber
                  </a>
                ) : null}
                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[56px] items-center justify-center gap-2.5 border border-gold-500/40 px-4 text-[14px] font-semibold text-gold-100 transition-colors hover:bg-gold-500/10 active:scale-[0.99]"
                  >
                    <WhatsAppMark className="h-5 w-5" />
                    WhatsApp
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

