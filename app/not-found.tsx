import Link from "next/link";
import { Phone } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-[820px] flex-col items-center px-5 py-24 text-center md:px-10 md:py-32">
      <p className="aw-eyebrow">404</p>
      <h1 className="mt-5 font-display text-[34px] leading-tight text-stone md:text-[44px]">
        Оваа страница не постои
      </h1>
      <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-stone-2/70">
        Возилото можеби е продадено или линкот е погрешен. Погледни ја актуелната понуда.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gold-500 px-6 py-4 text-[12.5px] font-bold uppercase tracking-[0.16em] text-brand-950 transition-colors hover:bg-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
        >
          Возила во понуда
        </Link>
        <Link
          href="/#kontakt"
          className="inline-flex items-center gap-2 border border-gold-500/40 px-6 py-4 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-gold-100 transition-colors hover:border-gold-500 hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          Контакт
        </Link>
      </div>
    </div>
  );
}



