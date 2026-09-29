import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export function SiteFooter({
  phoneDisplay,
  phoneHref,
  email,
  address,
  hours,
}: {
  phoneDisplay?: string | null;
  phoneHref?: string | null;
  email?: string | null;
  address?: string | null;
  hours?: string | null;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-gold-500/20 bg-brand-950/70">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-14 md:px-10 md:py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <span className="relative block h-11 w-[220px] overflow-hidden">
              <Image
                src="/brand/auto-wind-logo.png"
                alt="AUTO WIND"
                fill
                sizes="220px"
                className="object-contain object-left"
              />
            </span>
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-stone-2/65">
              Увоз и продажба на избрани половни автомобили. Секое возило со проверено потекло,
              целосна документација и коректна историја.
            </p>
          </div>

          <nav aria-label="Навигација во подножјето">
            <h2 className="aw-eyebrow">Навигација</h2>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li>
                <Link href="/" className="text-stone-2/75 transition-colors hover:text-gold-300">
                  Возила во понуда
                </Link>
              </li>
              <li>
                <Link href="/#kontakt" className="text-stone-2/75 transition-colors hover:text-gold-300">
                  Контакт
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-stone-2/75 transition-colors hover:text-gold-300">
                  Администрација
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="aw-eyebrow">Контакт</h2>
            <ul className="mt-5 space-y-3 text-[15px]">
              {phoneDisplay && phoneHref ? (
                <li>
                  <a
                    href={phoneHref}
                    className="inline-flex items-center gap-2 text-stone-2/75 transition-colors hover:text-gold-300"
                  >
                    <Phone className="h-4 w-4 text-gold-500" aria-hidden="true" />
                    {phoneDisplay}
                  </a>
                </li>
              ) : null}
              {email ? (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="inline-flex items-center gap-2 text-stone-2/75 transition-colors hover:text-gold-300"
                  >
                    <Mail className="h-4 w-4 text-gold-500" aria-hidden="true" />
                    {email}
                  </a>
                </li>
              ) : null}
              {address ? (
                <li className="inline-flex items-center gap-2 text-stone-2/75">
                  <MapPin className="h-4 w-4 text-gold-500" aria-hidden="true" />
                  {address}
                </li>
              ) : null}
              {hours ? (
                <li className="inline-flex items-center gap-2 text-stone-2/75">
                  <Clock className="h-4 w-4 text-gold-500" aria-hidden="true" />
                  {hours}
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="aw-hairline mt-14" />
        <div className="mt-7 flex flex-col items-center justify-between gap-4 text-[12px] uppercase tracking-[0.2em] text-stone-2/45 md:flex-row">
          <p>© {year} AUTO WIND — Сите права задржани</p>
          <Link href="/admin" className="transition-colors hover:text-gold-300">
            Администрација
          </Link>
        </div>
      </div>
    </footer>
  );
}


