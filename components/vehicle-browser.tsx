"use client";

import { useMemo, useState } from "react";
import { RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { VehicleCard } from "@/components/vehicle-card";
import type { VehicleWithImages } from "@/lib/types";

type SortKey = "newest" | "price-asc" | "price-desc" | "mileage";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Најново" },
  { key: "price-asc", label: "Цена ↑" },
  { key: "price-desc", label: "Цена ↓" },
  { key: "mileage", label: "Километража" },
];

function unique(values: (string | null)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => !!v && v.trim().length > 0))).sort();
}

const fieldClass =
  "w-full min-h-[48px] cursor-pointer border border-gold-500/25 bg-brand-950/70 px-3.5 py-3 text-[16px] text-stone outline-none transition-colors hover:border-gold-500/45 focus:border-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500/40 sm:min-h-0 sm:text-[14px]";

const labelClass = "mb-2 block text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-500";

export function VehicleBrowser({ vehicles }: { vehicles: VehicleWithImages[] }) {
  const [brand, setBrand] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [open, setOpen] = useState(false);

  const brands = useMemo(() => unique(vehicles.map((v) => v.brand)), [vehicles]);
  const fuels = useMemo(() => unique(vehicles.map((v) => v.fuel)), [vehicles]);
  const transmissions = useMemo(() => unique(vehicles.map((v) => v.transmission)), [vehicles]);

  const filtered = useMemo(() => {
    const max = maxPrice ? Number(maxPrice) : null;
    const rows = vehicles.filter((v) => {
      if (brand && v.brand !== brand) return false;
      if (fuel && v.fuel !== fuel) return false;
      if (transmission && v.transmission !== transmission) return false;
      if (max !== null && (v.price_eur ?? Number.POSITIVE_INFINITY) > max) return false;
      return true;
    });

    const sorted = [...rows];
    if (sort === "price-asc") sorted.sort((a, b) => (a.price_eur ?? Infinity) - (b.price_eur ?? Infinity));
    else if (sort === "price-desc") sorted.sort((a, b) => (b.price_eur ?? -Infinity) - (a.price_eur ?? -Infinity));
    else if (sort === "mileage") sorted.sort((a, b) => (a.mileage_km ?? Infinity) - (b.mileage_km ?? Infinity));
    return sorted;
  }, [vehicles, brand, fuel, transmission, maxPrice, sort]);

  const active: { label: string; clear: () => void }[] = [];
  if (brand) active.push({ label: brand, clear: () => setBrand("") });
  if (fuel) active.push({ label: fuel, clear: () => setFuel("") });
  if (transmission) active.push({ label: transmission, clear: () => setTransmission("") });
  if (maxPrice) active.push({ label: `до ${maxPrice} €`, clear: () => setMaxPrice("") });

  const dirty = active.length > 0 || sort !== "newest";

  const reset = () => {
    setBrand("");
    setFuel("");
    setTransmission("");
    setMaxPrice("");
    setSort("newest");
  };

  return (
    <div>
      {/* control row — sticky on phones so the count and sort stay reachable */}
      <div className="sticky top-16 z-30 -mx-4 mb-3 border-b border-gold-500/15 bg-brand-950/92 px-4 py-2.5 backdrop-blur-xl sm:top-[72px] sm:-mx-5 sm:px-5 md:top-[88px] lg:static lg:mx-0 lg:mb-0 lg:border-b-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
        <div className="flex items-center gap-3">
          <p className="min-w-0 flex-1 truncate text-[14px] text-stone-2/70" aria-live="polite">
            <span className="font-display text-[17px] text-gold-300">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "возило" : "возила"}
            {filtered.length !== vehicles.length ? (
              <span className="text-stone-2/45"> од {vehicles.length}</span>
            ) : null}
          </p>

          <label className="sr-only" htmlFor="sort">
            Подреди
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="min-h-[44px] max-w-[124px] cursor-pointer border border-gold-500/25 bg-brand-950/70 px-2.5 text-[14px] text-stone outline-none transition-colors hover:border-gold-500/45 focus:border-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500/40 sm:max-w-none sm:px-3 lg:min-h-0 lg:py-2.5"
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="vehicle-filters"
            className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center gap-2 border border-gold-500/30 px-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-gold-100 transition-colors hover:border-gold-500 hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 active:scale-[0.98] sm:px-3.5 sm:text-[12.5px] lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Филтри
            {active.length > 0 ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-[11px] font-bold text-brand-950">
                {active.length}
              </span>
            ) : null}
          </button>
        </div>

        {/* active filter chips — one tap to remove */}
        {active.length > 0 ? (
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {active.map((f) => (
              <button
                key={f.label}
                type="button"
                onClick={f.clear}
                className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 border border-gold-500/30 bg-gold-500/10 px-2.5 text-[13px] text-gold-100 transition-colors hover:border-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50"
              >
                {f.label}
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">отстрани филтер</span>
              </button>
            ))}
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-[34px] cursor-pointer items-center gap-1.5 px-1 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold-300 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Исчисти
            </button>
          </div>
        ) : null}

        {/* full filter panel: collapsible on phones, always visible on desktop */}
        <div
          id="vehicle-filters"
          className={`${open ? "grid" : "hidden"} mt-3 gap-4 border border-gold-500/20 bg-brand-900/40 p-4 sm:grid-cols-2 lg:mt-6 lg:grid lg:grid-cols-4 lg:gap-5 lg:p-5`}
        >
          <div>
            <label className={labelClass} htmlFor="f-brand">
              Марка
            </label>
            <select id="f-brand" className={fieldClass} value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="">Сите марки</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="f-fuel">
              Гориво
            </label>
            <select id="f-fuel" className={fieldClass} value={fuel} onChange={(e) => setFuel(e.target.value)}>
              <option value="">Сите</option>
              {fuels.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="f-trans">
              Менувач
            </label>
            <select
              id="f-trans"
              className={fieldClass}
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
            >
              <option value="">Сите</option>
              {transmissions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="f-price">
              Максимална цена (€)
            </label>
            <input
              id="f-price"
              type="number"
              inputMode="numeric"
              min={0}
              step={500}
              placeholder="на пр. 15000"
              className={fieldClass}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 bg-gold-500 px-5 text-[13px] font-bold uppercase tracking-[0.16em] text-brand-950 transition-colors hover:bg-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 active:scale-[0.99] lg:hidden"
            >
              Прикажи {filtered.length} {filtered.length === 1 ? "возило" : "возила"}
            </button>
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {filtered.map((v, i) => (
            <VehicleCard key={v.id} vehicle={v} priority={i === 0} />
          ))}
        </div>
      ) : (
        <div className="border border-gold-500/20 bg-brand-900/40 px-6 py-14 text-center">
          <p className="font-display text-2xl text-stone">Нема резултати</p>
          <p className="mx-auto mt-3 max-w-md text-[15.5px] text-stone-2/65">
            Ниту едно возило не одговара на избраните филтри.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex min-h-[48px] cursor-pointer items-center gap-2 border border-gold-500/40 px-6 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-gold-100 transition-colors hover:border-gold-500 hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 active:scale-[0.99]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Исчисти филтри
          </button>
        </div>
      )}
    </div>
  );
}

