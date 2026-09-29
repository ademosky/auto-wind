import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Cog,
  Droplet,
  FileText,
  Fuel,
  Gauge,
  Leaf,
  Palette,
  Route,
  Zap,
} from "lucide-react";
import { ContactButtons } from "@/components/contact-buttons";
import { VehicleGallery } from "@/components/vehicle-gallery";
import { VehicleCard } from "@/components/vehicle-card";
import {
  coverOf,
  formatMileage,
  formatNumber,
  formatPriceEur,
  sortImages,
  vehicleShortTitle,
  vehicleTitle,
} from "@/lib/format";
import { STATUS_LABELS, type VehicleWithImages } from "@/lib/types";
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

function SpecRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 border-b border-gold-500/12 py-4">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-500/80" aria-hidden="true" />
      <dt className="w-[46%] text-[13px] uppercase tracking-[0.12em] text-stone-2/55">{label}</dt>
      <dd className="flex-1 text-[15px] font-medium text-stone">{value}</dd>
    </div>
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
    description: vehicle.description ?? summaryLine(vehicle),
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
    <div className="mx-auto w-full max-w-[1280px] px-5 py-10 md:px-10 md:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Патека" className="flex flex-wrap items-center gap-2 text-[11.5px] uppercase tracking-[0.18em]">
        <Link href="/" className="text-stone-2/50 transition-colors hover:text-gold-300">
          Возила во понуда
        </Link>
        <span className="text-gold-500/40">/</span>
        <span className="text-stone-2/75">{vehicleShortTitle(vehicle)}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start lg:gap-12">
        {/* -------- left column -------- */}
        <div className="order-2 lg:order-1">
          <VehicleGallery images={images} alt={title} />

          <section className="mt-12">
            <h2 className="font-display text-[26px] text-stone md:text-[30px]">Спецификации</h2>
            <dl className="mt-5 grid border-t border-gold-500/20 sm:grid-cols-2 sm:gap-x-10 [&>div:nth-child(-n+2)]:sm:border-t-0">
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
              <SpecRow icon={Droplet} label="Шасија/состојба" value={vehicle.status === "sold" ? "Продадено" : "Достапно за разгледување"} />
            </dl>
          </section>

          {vehicle.description ? (
            <section className="mt-12">
              <h2 className="font-display text-[26px] text-stone md:text-[30px]">Опис</h2>
              <div className="mt-5 max-w-prose space-y-4 text-[16px] leading-relaxed text-stone-2/75">
                {vehicle.description.split(/\n+/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          ) : null}

          {vehicle.equipment && vehicle.equipment.length > 0 ? (
            <section className="mt-12">
              <h2 className="font-display text-[26px] text-stone md:text-[30px]">Опрема</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {vehicle.equipment.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-stone-2/75">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {/* -------- right column -------- */}
        <aside className="order-1 lg:order-2 lg:sticky lg:top-24">
          <div className="border border-gold-500/20 bg-brand-900/50 p-6 md:p-7">
            <div className="flex items-center justify-between gap-3">
              <span className="aw-eyebrow">{sold ? "Архива" : "Во понуда"}</span>
              <span
                className={`px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.22em] ${
                  sold
                    ? "bg-brand-950/85 text-stone-2/70"
                    : vehicle.status === "reserved"
                      ? "bg-gold-500/90 text-brand-950"
                      : "border border-gold-500/40 text-gold-300"
                }`}
              >
                {STATUS_LABELS[vehicle.status]}
              </span>
            </div>

            <h1 className="mt-5 font-display text-[30px] leading-tight text-stone md:text-[36px]">{title}</h1>
            {vehicle.version ? <p className="mt-2 text-[14px] text-stone-2/60">{vehicle.version}</p> : null}
            <p className="mt-4 text-[13.5px] text-stone-2/70">{summaryLine(vehicle)}</p>

            <div className="aw-hairline my-6" />

            <p className="font-display text-[38px] leading-none text-gold-300 md:text-[42px]">
              {formatPriceEur(vehicle.price_eur)}
            </p>
            {vehicle.price_mkd ? (
              <p className="mt-2 text-[13.5px] text-stone-2/55">≈ {formatNumber(vehicle.price_mkd)} ден.</p>
            ) : null}

            <div className="mt-7">
              <ContactButtons
                phoneDisplay={settings.phone_display}
                phoneE164={settings.phone_e164}
                viber={settings.viber}
                whatsapp={settings.whatsapp}
                subject={`Здраво AUTO WIND, ме интересира ${title} (${vehicle.year}).`}
                compact
              />
            </div>

            <p className="mt-5 text-[12.5px] leading-relaxed text-stone-2/50">
              {sold
                ? "Ова возило е продадено. Јави се и ќе ти предложиме слични возила што пристигнуваат."
                : "Јави се за да договориме разгледување во термин што ти одговара. Достапно и за тест вожња."}
            </p>
          </div>

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
        <section className="mt-20 border-t border-gold-500/15 pt-14">
          <p className="aw-eyebrow">Може да те интересира</p>
          <h2 className="mt-4 font-display text-[28px] leading-tight text-stone md:text-[34px]">
            Слични возила во понуда
          </h2>
          <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}





