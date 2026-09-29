import type { Metadata } from "next";
import Link from "next/link";
import { Database } from "lucide-react";
import { ContactButtons } from "@/components/contact-buttons";
import { VehicleBrowser } from "@/components/vehicle-browser";
import type { VehicleWithImages } from "@/lib/types";
import { getListedVehicles, getSettings } from "@/lib/supabase/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Возила во понуда",
  description:
    "Актуелна понуда на половни автомобили во AUTO WIND. Филтрирај по марка, гориво, менувач и цена, и најди го возилото што ти одговара.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Возила во понуда | AUTO WIND",
    description: "Актуелна понуда на проверени половни автомобили.",
    url: "/",
  },
};

function WindLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 top-0 h-[240px] w-full opacity-40"
      aria-hidden="true"
      preserveAspectRatio="none"
      viewBox="0 0 1200 240"
    >
      <defs>
        <linearGradient id="wind" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c9a75a" stopOpacity="0" />
          <stop offset="45%" stopColor="#c9a75a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#c9a75a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g stroke="url(#wind)" strokeWidth="1" fill="none">
        <path d="M-40 46 C 320 30, 780 12, 1240 -12" />
        <path d="M-40 92 C 340 76, 800 56, 1240 30" />
        <path d="M-40 142 C 360 128, 820 110, 1240 84" />
        <path d="M-40 196 C 340 186, 780 170, 1240 148" />
      </g>
    </svg>
  );
}

export default async function HomePage() {
  let vehicles: VehicleWithImages[] = [];
  let loadError = false;

  const [listed, settings] = await Promise.all([
    getListedVehicles().catch(() => {
      loadError = true;
      return [] as VehicleWithImages[];
    }),
    getSettings(),
  ]);
  vehicles = listed;

  return (
    <>
      <section className="relative overflow-hidden border-b border-gold-500/15">
        <WindLines />
        <div className="relative mx-auto w-full max-w-[1280px] px-5 pb-9 pt-10 md:px-10 md:pb-11 md:pt-14">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="aw-eyebrow aw-rise">Актуелна понуда</p>
              <h1
                className="aw-rise mt-3 font-display text-[34px] leading-tight text-stone md:text-[46px]"
                style={{ animationDelay: "70ms" }}
              >
                Возила во понуда
              </h1>
            </div>

            <div
              className="aw-rise flex items-center gap-8"
              style={{ animationDelay: "130ms" }}
            >
              <div className="text-right">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-stone-2/50">
                  Достапни сега
                </p>
                <p className="mt-1.5 font-display text-3xl text-gold-300">{vehicles.length}</p>
              </div>
              {settings.phone_display ? (
                <a
                  href={`tel:${(settings.phone_e164 ?? "").replace(/[^+0-9]/g, "")}`}
                  className="hidden border border-gold-500/35 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-gold-100 transition-colors hover:border-gold-500 hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 md:inline-flex"
                >
                  {settings.phone_display}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-5 py-9 md:px-10 md:py-12">
        {loadError ? (
          <div className="border border-gold-500/20 bg-brand-900/40 px-8 py-14 text-center">
            <Database className="mx-auto h-7 w-7 text-gold-500" aria-hidden="true" />
            <p className="mt-4 font-display text-2xl text-stone">Понудата моментално не е достапна</p>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-stone-2/65">
              Обиди се повторно за неколку минути, или јави се директно.
            </p>
          </div>
        ) : (
          <VehicleBrowser vehicles={vehicles} />
        )}
      </section>

      <section id="kontakt" className="scroll-mt-24 border-t border-gold-500/15">
        <div className="mx-auto w-full max-w-[1280px] px-5 py-14 md:px-10 md:py-16">
          <div className="aw-panel grid gap-10 p-8 md:p-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="aw-eyebrow">Контакт</p>
              <h2 className="mt-3 max-w-[20ch] font-display text-[28px] leading-tight text-stone md:text-[34px]">
                Возилото те интересира? Јави се.
              </h2>
              <p className="mt-4 max-w-[44ch] text-[15.5px] leading-relaxed text-stone-2/70">
                Најбрзо е преку телефон, Viber или WhatsApp — организираме разгледување во термин што ти
                одговара.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <ContactButtons
                phoneDisplay={settings.phone_display}
                phoneE164={settings.phone_e164}
                viber={settings.viber}
                whatsapp={settings.whatsapp}
                subject="Здраво AUTO WIND, ме интересира возило од вашата понуда."
              />
              <p className="text-center text-[12.5px] text-stone-2/50">
                Или погледни го возилото и кликни „Целосни детали“ за сите податоци и фотографии.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1280px] px-5 pb-14 md:px-10">
        <Link
          href="/admin"
          className="text-[11px] uppercase tracking-[0.2em] text-stone-2/25 transition-colors hover:text-gold-300"
        >
          Администрација
        </Link>
      </div>
    </>
  );
}

