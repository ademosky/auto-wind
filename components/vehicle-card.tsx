import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Fuel, Gauge, Settings2 } from "lucide-react";
import {
  coverOf,
  formatMileage,
  formatNumber,
  formatPriceEur,
  vehicleShortTitle,
  vehicleTitle,
} from "@/lib/format";
import { STATUS_LABELS, type VehicleWithImages } from "@/lib/types";

export function VehiclePlaceholder({ label }: { label?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(150deg,#0a3a26,#03170e_70%)]">
      <div className="flex flex-col items-center gap-3 px-6 text-center">
        <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden="true">
          <circle cx="32" cy="32" r="29" fill="none" stroke="#c9a75a" strokeOpacity="0.5" strokeWidth="1.5" />
          <circle cx="32" cy="32" r="23" fill="none" stroke="#c9a75a" strokeOpacity="0.25" strokeWidth="1" />
        </svg>
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold-500/70">
          {label ?? "AUTO WIND"}
        </span>
      </div>
    </div>
  );
}

function SpecItem({
  icon: Icon,
  value,
}: {
  icon: typeof Fuel;
  value: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px] text-stone-2/70">
      <Icon className="h-3.5 w-3.5 text-gold-500/80" aria-hidden="true" />
      {value}
    </span>
  );
}

export function VehicleCard({ vehicle }: { vehicle: VehicleWithImages }) {
  const cover = coverOf(vehicle);
  const sold = vehicle.status === "sold";
  const reserved = vehicle.status === "reserved";

  return (
    <article className="aw-card group relative flex h-full flex-col overflow-hidden border border-gold-500/18 bg-brand-900/45 transition-colors duration-300 hover:border-gold-500/45 focus-within:border-gold-500/45">
      <Link
        href={`/vozila/${vehicle.slug}`}
        className="aw-card-media relative block aspect-[4/3] overflow-hidden bg-brand-800"
        aria-label={`${vehicleTitle(vehicle)} — отвори детали`}
      >
        {cover ? (
          <Image
            src={cover}
            alt={`${vehicleTitle(vehicle)}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover ${sold ? "grayscale-[85%]" : ""}`}
          />
        ) : (
          <VehiclePlaceholder label={vehicleShortTitle(vehicle)} />
        )}
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(3,23,14,0.85),rgba(3,23,14,0.05)_55%)]" />

        {sold || reserved ? (
          <span
            className={`absolute left-0 top-4 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] ${
              sold ? "bg-brand-950/90 text-gold-300" : "bg-gold-500 text-brand-950"
            }`}
          >
            {STATUS_LABELS[vehicle.status]}
          </span>
        ) : null}

        <span className="absolute bottom-3.5 left-4 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Види детали
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-[21px] leading-tight text-stone">
            {vehicleShortTitle(vehicle)}
          </h3>
          <span className="shrink-0 font-display text-[15px] text-gold-500">{vehicle.year}</span>
        </div>
        {vehicle.version ? (
          <p className="mt-1 text-[13px] text-stone-2/55">{vehicle.version}</p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          <SpecItem icon={Gauge} value={formatMileage(vehicle.mileage_km)} />
          {vehicle.fuel ? <SpecItem icon={Fuel} value={vehicle.fuel} /> : null}
          {vehicle.transmission ? <SpecItem icon={Settings2} value={vehicle.transmission} /> : null}
        </div>

        <div className="aw-hairline mt-5" />

        <div className="mt-4 flex items-end justify-between gap-3">
          <p className="font-display text-[26px] leading-none text-gold-300">
            {formatPriceEur(vehicle.price_eur)}
          </p>
          {vehicle.price_mkd ? (
            <p className="pb-0.5 text-[12.5px] text-stone-2/50">
              ≈ {formatNumber(vehicle.price_mkd)} ден.
            </p>
          ) : null}
        </div>

        <Link
          href={`/vozila/${vehicle.slug}`}
          className="mt-5 inline-flex items-center justify-between gap-2 border border-gold-500/35 px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-gold-100 transition-colors hover:border-gold-500 hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 active:scale-[0.99]"
        >
          Целосни детали
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

