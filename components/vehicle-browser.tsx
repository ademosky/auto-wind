"use client";

import { useMemo, useState } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { VehicleCard } from "@/components/vehicle-card";
import type { VehicleWithImages } from "@/lib/types";

type SortKey = "newest" | "price-asc" | "price-desc" | "mileage";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Најново" },
  { key: "price-asc", label: "Цена — растечки" },
  { key: "price-desc", label: "Цена — опаѓачки" },
  { key: "mileage", label: "Најмалку километри" },
];

function unique(values: (string | null)[]): string[] {
  return Array.from(new Set(values.filter((v): v is string => !!v && v.trim().length > 0))).sort();
}

const fieldClass =
  "w-full cursor-pointer border border-gold-500/25 bg-brand-950/70 px-3 py-2.5 text-[14px] text-stone outline-none transition-colors hover:border-gold-500/45 focus:border-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500/40";

const labelClass = "mb-2 block text-[10.5px] font-semibold uppercase tracking-[0.22em] text-gold-500";

export function VehicleBrowser({ vehicles }: { vehicles: VehicleWithImages[] }) {
  const [brand, setBrand] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

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
    if (sort === "price-asc") {
      sorted.sort((a, b) => (a.price_eur ?? Infinity) - (b.price_eur ?? Infinity));
    } else if (sort === "price-desc") {
      sorted.sort((a, b) => (b.price_eur ?? -Infinity) - (a.price_eur ?? -Infinity));
    } else if (sort === "mileage") {
      sorted.sort((a, b) => (a.mileage_km ?? Infinity) - (b.mileage_km ?? Infinity));
    }
    return sorted;
  }, [vehicles, brand, fuel, transmission, maxPrice, sort]);

  const dirty = brand || fuel || transmission || maxPrice || sort !== "newest";

  const reset = () => {
    setBrand("");
    setFuel("");
    setTransmission("");
    setMaxPrice("");
    setSort("newest");
  };

  return (
    <div>
      <div className="border border-gold-500/20 bg-brand-900/40 p-5 md:p-6">
        <div className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-500">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Филтри
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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

          <div>
            <label className={labelClass} htmlFor="f-sort">
              Подреди
            </label>
            <select
              id="f-sort"
              className={fieldClass}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-gold-500/15 pt-4">
          <p className="text-[13.5px] text-stone-2/60" aria-live="polite">
            Прикажани <span className="text-gold-300">{filtered.length}</span> од {vehicles.length} возила
          </p>
          {dirty ? (
            <button
              type="button"
              onClick={reset}
              className="inline-flex cursor-pointer items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-gold-300 transition-colors hover:text-gold-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Исчисти филтри
            </button>
          ) : null}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      ) : (
        <div className="mt-8 border border-gold-500/20 bg-brand-900/40 px-8 py-16 text-center">
          <p className="font-display text-2xl text-stone">Нема резултати</p>
          <p className="mx-auto mt-3 max-w-md text-[15px] text-stone-2/65">
            Ниту едно возило не одговара на избраните филтри. Пробај да ги прошириш критериумите.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex cursor-pointer items-center gap-2 border border-gold-500/40 px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.16em] text-gold-100 transition-colors hover:border-gold-500 hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 active:scale-[0.99]"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Исчисти филтри
          </button>
        </div>
      )}
    </div>
  );
}

