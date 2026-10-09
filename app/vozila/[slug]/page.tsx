import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Car,
  Check,
  Cog,
  FileText,
  Fuel,
  Gauge,
  Leaf,
  Palette,
  Route,
  Zap,
} from "lucide-react";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { VehicleGallery } from "@/components/vehicle-gallery";
import { VehicleSummary } from "@/components/vehicle-summary";
import { VehicleVideo } from "@/components/vehicle-video";
import { VehicleCard } from "@/components/vehicle-card";
import {
  coverOf,
  formatMileage,
  formatNumber,
  formatPriceEur,
  sortImages,
  telHref,
  vehicleShortTitle,
  vehicleTitle,
} from "@/lib/format";
import type { VehicleWithImages } from "@/lib/types";
import { getAllSlugs, getListedVehicles, getSettings, getVehicleBySlug } from "@/lib/supabase/queries";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const rows = await getAllSlugs();
    return rows.map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

function summaryLine(v: VehicleWithImages): string {
  const specs = [
    String(v.year),
    v.mileage_km != null ? `${formatNumber(v.mileage_km)} км` : null,
    v.fuel,
    v.transmission,
    v.power_hp ? `${v.power_hp} КС` : v.power_kw ? `${v.power_kw} kW` : null,
  ].filter(Boolean);
  return specs.join(" · ");
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVehicleBySlug(slug).catch(() => null);
  if (!v) return { title: "Возилото не е пронајдено" };

  const title = vehicleTitle(v);
  const price = v.price_eur != null ? `Цена ${formatPriceEur(v.price_eur)}. ` : "";
  const description = `${title} — ${summaryLine(v)}. ${price}Проверено потекло, целосна документација и можност за разгледување. AUTO WIND.`;
  const cover = coverOf(v);

  return {
    title,
    description,
    alternates: { canonical: `/vozila/${v.slug}` },
    openGraph: {
      type: "website",
      title: `${title} | AUTO WIND`,
      description,
      url: `/vozila/${v.slug}`,
      images: cover ? [{ url: cover, width: 1200, height: 900, alt: title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | AUTO WIND`,
      description,
      images: cover ? [cover] : undefined,
    },
  };
}

function SpecRow({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-gold-500/12 py-3.5 sm:gap-4 sm:py-4">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/80 sm:h-4 sm:w-4" aria-hidden="true" />
      <dt className="w-[42%] shrink-0 text-[12.5px] uppercase tracking-[0.1em] text-stone-2/55 sm:w-[46%] sm:text-[13px] sm:tracking-[0.12em]">
        {label}
      </dt>
      <dd className="flex-1 text-[15.5px] font-medium text-stone sm:text-[15px]">{value}</dd>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-[23px] leading-tight text-stone sm:text-[26px] md:text-[30px]">{children}</h2>
  );
}

export default async function VehicleDetailPage({ params }: Params) {
  const { slug } = await params;
  const [vehicle, settings, listed] = await Promise.all([
    getVehicleBySlug(slug).catch(() => null),
    getSettings(),
    getListedVehicles().catch(() => [] as VehicleWithImages[]),
  ]);

  if (!vehicle) notFound();

  const images = sortImages(vehicle.vehicle_images).map((i) => ({ id: i.id, url: i.url }));
  const title = vehicleTitle(vehicle);
  const sold = vehicle.status === "sold";
  const summary = summaryLine(vehicle);
  const phoneHref = telHref(settings.phone_e164) || null;
  const whatsappHref = settings.whatsapp ? `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}` : null;

  const similar = listed
    .filter((v) => v.slug !== vehicle.slug)
    .sort((a, b) => (a.brand === vehicle.brand ? -1 : 0) - (b.brand === vehicle.brand ? -1 : 0))
    .slice(0, 3);

  const power =
    vehicle.power_kw || vehicle.power_hp
      ? [vehicle.power_kw ? `${vehicle.power_kw} kW` : null, vehicle.power_hp ? `${vehicle.power_hp} КС` : null]
          .filter(Boolean)
          .join(" / ")
      : "—";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Car",
    name: title,
    brand: { "@type": "Brand", name: vehicle.brand },
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    bodyType: vehicle.version ?? undefined,
    color: vehicle.color ?? undefined,
    fuelType: vehicle.fuel ?? undefined,
    vehicleTransmission: vehicle.transmission ?? undefined,
    driveWheelConfiguration: vehicle.drive ?? undefined,
    mileageFromOdometer: vehicle.mileage_km
      ? { "@type": "QuantitativeValue", value: vehicle.mileage_km, unitCode: "KMT" }
      : undefined,
    image: images.map((i) => i.url),
    description: vehicle.description ?? summary,
    itemCondition: "https://schema.org/UsedCondition",
    offers: vehicle.price_eur
      ? {
          "@type": "Offer",
          price: vehicle.price_eur,
          priceCurrency: "EUR",
          availability: sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
        }
      : undefined,
  };

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pb-28 pt-5 sm:px-5 md:px-10 md:pb-14 md:pt-10 lg:pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Патека" className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] sm:text-[11.5px]">
        <Link href="/" className="shrink-0 text-stone-2/50 transition-colors hover:text-gold-300">
          Возила во понуда
        </Link>
        <span className="text-gold-500/40">/</span>
        <span className="truncate text-stone-2/75">{vehicleShortTitle(vehicle)}</span>
      </nav>

      <div className="mt-5 grid gap-8 md:mt-8 lg:grid-cols-[1.55fr_1fr] lg:items-start lg:gap-12">
        {/* ---------- main column ---------- */}
        <div>
          <VehicleGallery images={images} alt={title} />

          {/* on phones the name, price and contact buttons come right after the photos */}
          <div className="mt-6 lg:hidden">
            <VehicleSummary
              vehicle={vehicle}
              settings={settings}
              title={title}
              summary={summary}
              headingLevel="h1"
            />
          </div>

          {vehicle.video_url ? (
            <section className="mt-10 md:mt-12">
              <SectionHeading>Видео од возилото</SectionHeading>
              <div className="mt-4 md:mt-5">
                <VehicleVideo url={vehicle.video_url} title={title} />
              </div>
            </section>
          ) : null}

          <section className="mt-10 md:mt-12">
            <SectionHeading>Спецификации</SectionHeading>
            <dl className="mt-4 grid border-t border-gold-500/20 sm:mt-5 sm:grid-cols-2 sm:gap-x-10 [&>div:nth-child(-n+2)]:sm:border-t-0">
              <SpecRow icon={CalendarDays} label="Година" value={String(vehicle.year)} />
              <SpecRow icon={Gauge} label="Километри" value={formatMileage(vehicle.mileage_km)} />
              <SpecRow icon={Fuel} label="Гориво" value={vehicle.fuel ?? "—"} />
              <SpecRow icon={Cog} label="Менувач" value={vehicle.transmission ?? "—"} />
              <SpecRow icon={Zap} label="Мотор" value={vehicle.engine ?? "—"} />
              <SpecRow icon={Zap} label="Моќност" value={power} />
              <SpecRow icon={Route} label="Погон" value={vehicle.drive ?? "—"} />
              <SpecRow icon={Palette} label="Боја" value={vehicle.color ?? "—"} />
              <SpecRow icon={Leaf} label="Euro стандард" value={vehicle.euro_standard ?? "—"} />
              <SpecRow icon={FileText} label="Регистрација" value={vehicle.registration ?? "—"} />
              <SpecRow
                icon={Car}
                label="Состојба"
                value={sold ? "Продадено" : "Достапно за разгледување"}
              />
            </dl>
          </section>

          {vehicle.description ? (
            <section className="mt-10 md:mt-12">
              <SectionHeading>Опис</SectionHeading>
              <div className="mt-4 max-w-prose space-y-4 text-[16.5px] leading-relaxed text-stone-2/78 sm:text-[16px] md:mt-5">
                {vehicle.description.split(/\n+/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          ) : null}

          {vehicle.equipment && vehicle.equipment.length > 0 ? (
            <section className="mt-10 md:mt-12">
              <SectionHeading>Опрема</SectionHeading>
              <ul className="mt-4 grid gap-3 sm:mt-5 sm:grid-cols-2">
                {vehicle.equipment.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15.5px] text-stone-2/78 sm:text-[15px]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {/* contact block again at the end of the page, after the details */}
          <div className="mt-10 lg:hidden">
            <SectionHeading>Контакт</SectionHeading>
            <p className="mt-3 text-[15.5px] leading-relaxed text-stone-2/70">
              Јави се за да договориме разгледување во термин што ти одговара.
            </p>
            <a
              href={phoneHref ?? "#"}
              className="mt-4 inline-flex min-h-[56px] w-full items-center justify-center bg-gold-500 px-6 text-[15px] font-bold tracking-[0.04em] text-brand-950 transition-colors hover:bg-gold-300 active:scale-[0.99]"
            >
              {settings.phone_display ?? "Јави се"}
            </a>
          </div>
        </div>

        {/* ---------- sticky column (desktop only) ---------- */}
        <aside className="hidden lg:sticky lg:top-24 lg:block">
          <VehicleSummary
            vehicle={vehicle}
            settings={settings}
            title={title}
            summary={summary}
            headingLevel="h2"
          />

          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-stone-2/55 transition-colors hover:text-gold-300"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Сите возила
          </Link>
        </aside>
      </div>

      {similar.length > 0 ? (
        <section className="mt-14 border-t border-gold-500/15 pt-10 md:mt-20 md:pt-14">
          <p className="aw-eyebrow">Може да те интересира</p>
          <h2 className="mt-3 font-display text-[26px] leading-tight text-stone sm:text-[28px] md:mt-4 md:text-[34px]">
            Слични возила во понуда
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 sm:gap-6 md:mt-9 lg:grid-cols-3">
            {similar.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </section>
      ) : null}

      <MobileActionBar
        priceLabel={formatPriceEur(vehicle.price_eur)}
        phoneHref={phoneHref}
        phoneDisplay={settings.phone_display}
        whatsappHref={whatsappHref}
        subject={`Здраво AUTO WIND, ме интересира ${title} (${vehicle.year}).`}
      />
    </div>
  );
}

