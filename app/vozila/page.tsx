import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { VehicleBrowser } from "@/components/vehicle-browser";
import { ContactButtons } from "@/components/contact-buttons";
import { getListedVehicles, getSettings } from "@/lib/supabase/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Возила во понуда",
  description:
    "Актуелна понуда на половни автомобили во AUTO WIND. Филтрирај по марка, гориво, менувач и цена, и најди го возилото што ти одговара.",
  alternates: { canonical: "/vozila" },
  openGraph: {
    title: "Возила во понуда | AUTO WIND",
    description: "Актуелна понуда на проверени половни автомобили.",
    url: "/vozila",
  },
};

export default async function VehiclesPage() {
  const [vehicles, settings] = await Promise.all([getListedVehicles(), getSettings()]);

  return (
    <div className="mx-auto w-full max-w-[1280px] px-5 py-12 md:px-10 md:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-stone-2/55 transition-colors hover:text-gold-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Почетна
      </Link>

      <header className="mt-8 max-w-3xl">
        <p className="aw-eyebrow">Актуелна понуда</p>
        <h1 className="mt-4 font-display text-[36px] leading-tight text-stone md:text-[48px]">
          Возила во понуда
        </h1>
        <p className="mt-5 text-[16.5px] leading-relaxed text-stone-2/70">
          Секое возило е проверено и подготвено за регистрација. Користи ги филтрите за да го најдеш
          она што ти одговара — или јави се директно.
        </p>
      </header>

      <div className="mt-10">
        <VehicleBrowser vehicles={vehicles} />
      </div>

      <section className="aw-panel mt-16 grid gap-8 p-8 md:p-10 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <h2 className="font-display text-[26px] leading-tight text-stone md:text-[32px]">
            Не најде што бараш?
          </h2>
          <p className="mt-4 max-w-[46ch] text-[15.5px] leading-relaxed text-stone-2/70">
            Кажи ни какво возило бараш — марка, буџет, опрема. Голем дел од нашите возила ги
            набавуваме по нарачка.
          </p>
        </div>
        <ContactButtons
          phoneDisplay={settings.phone_display}
          phoneE164={settings.phone_e164}
          viber={settings.viber}
          whatsapp={settings.whatsapp}
          subject="Здраво AUTO WIND, барам возило по следниве критериуми:"
        />
      </section>
    </div>
  );
}

