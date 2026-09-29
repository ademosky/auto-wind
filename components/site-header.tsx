"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";

const NAV = [
  { href: "/", label: "Почетна" },
  { href: "/vozila", label: "Возила" },
  { href: "/#zosto-nie", label: "Зошто AUTO WIND" },
  { href: "/#kontakt", label: "Контакт" },
];

export function SiteHeader({
  phoneDisplay,
  phoneHref,
}: {
  phoneDisplay?: string | null;
  phoneHref?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href.replace("/#", "/"));

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gold-500/20 bg-brand-950/88 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[74px] w-full max-w-[1280px] items-center justify-between px-5 md:px-10">
        <Link
          href="/"
          aria-label="AUTO WIND — почетна"
          className="group flex shrink-0 items-center gap-3 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
        >
          <span className="relative block h-9 w-[178px] overflow-hidden md:h-10 md:w-[206px]">
            <Image
              src="/brand/auto-wind-logo.png"
              alt="AUTO WIND"
              fill
              priority
              sizes="206px"
              className="object-contain object-left"
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

        <div className="flex items-center gap-3">
          {phoneDisplay && phoneHref ? (
            <a
              href={phoneHref}
              className="hidden items-center gap-2 border border-gold-500/40 px-4 py-2 text-[13px] font-semibold tracking-[0.08em] text-gold-100 transition-colors hover:border-gold-500 hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 md:inline-flex"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {phoneDisplay}
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
          className="fixed inset-x-0 top-[74px] bottom-0 z-40 overflow-y-auto border-t border-gold-500/20 bg-brand-950/97 px-6 py-8 backdrop-blur-xl lg:hidden"
        >
          <nav className="flex flex-col" aria-label="Мобилна навигација">
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ animationDelay: `${i * 60}ms` }}
                className="aw-rise border-b border-gold-500/12 py-5 text-2xl text-stone transition-colors hover:text-gold-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {phoneDisplay && phoneHref ? (
            <a
              href={phoneHref}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-gold-500 px-5 py-4 text-sm font-bold uppercase tracking-[0.14em] text-brand-950"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {phoneDisplay}
            </a>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}

