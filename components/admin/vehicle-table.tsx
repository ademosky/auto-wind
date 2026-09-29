"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, Loader2, Pencil, Star, Tag, Trash2, Undo2 } from "lucide-react";
import { coverOf, formatMileage, formatNumber, vehicleShortTitle } from "@/lib/format";
import { STATUS_LABELS, type VehicleWithImages } from "@/lib/types";

export function VehicleTable({ vehicles }: { vehicles: VehicleWithImages[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const quick = async (id: string, body: Record<string, unknown>) => {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ __quick: true, ...body }),
      });
      if (!res.ok) {
        setError("Промената не успеа.");
        return;
      }
      router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    if (confirmId !== id) {
      setConfirmId(id);
      setTimeout(() => setConfirmId((c) => (c === id ? null : c)), 5000);
      return;
    }
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/vehicles/${id}`, { method: "DELETE" });
      if (!res.ok) {
        setError("Бришењето не успеа.");
        return;
      }
      setConfirmId(null);
      router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  if (vehicles.length === 0) {
    return (
      <div className="border border-gold-500/20 bg-brand-900/35 px-8 py-14 text-center">
        <p className="font-display text-2xl text-stone">Сè уште нема возила</p>
        <p className="mx-auto mt-3 max-w-md text-[14.5px] text-stone-2/65">
          Додај го првото возило и тоа веднаш ќе се појави на сајтот.
        </p>
        <Link
          href="/admin/novo"
          className="mt-6 inline-flex items-center gap-2 bg-gold-500 px-5 py-3 text-[12px] font-bold uppercase tracking-[0.16em] text-brand-950 transition-colors hover:bg-gold-300"
        >
          Ново возило
        </Link>
      </div>
    );
  }

  const action =
    "inline-flex h-9 w-9 cursor-pointer items-center justify-center border border-gold-500/30 text-gold-100 transition-colors hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div>
      {error ? (
        <p role="alert" className="mb-4 border border-red-500/40 bg-red-500/10 px-4 py-3 text-[13.5px] text-red-200">
          {error}
        </p>
      ) : null}

      <ul className="space-y-3">
        {vehicles.map((v) => {
          const cover = coverOf(v);
          const busy = busyId === v.id;
          return (
            <li
              key={v.id}
              className="grid gap-4 border border-gold-500/18 bg-brand-900/35 p-4 md:grid-cols-[132px_1fr_auto] md:items-center"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-800 md:w-[132px]">
                {cover ? (
                  <Image src={cover} alt="" fill sizes="132px" className="object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-gold-500/50">
                    Без слика
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <p className="font-display text-[19px] text-stone">{vehicleShortTitle(v)}</p>
                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
                      v.status === "sold"
                        ? "bg-brand-950/80 text-stone-2/60"
                        : v.status === "reserved"
                          ? "bg-gold-500/90 text-brand-950"
                          : "border border-gold-500/40 text-gold-300"
                    }`}
                  >
                    {STATUS_LABELS[v.status]}
                  </span>
                  {v.featured ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gold-300">
                      <Star className="h-3 w-3" aria-hidden="true" />
                      Истакнато
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 text-[13px] text-stone-2/55">
                  {[v.year, formatMileage(v.mileage_km), v.fuel, v.transmission].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-1 text-[13.5px] text-gold-300">
                  {v.price_eur != null ? `${formatNumber(Math.round(v.price_eur))} €` : "Без цена"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                {busy ? <Loader2 className="h-4 w-4 animate-spin text-gold-500" aria-hidden="true" /> : null}

                <button
                  type="button"
                  onClick={() => void quick(v.id, { status: v.status === "sold" ? "available" : "sold" })}
                  disabled={busy}
                  title={v.status === "sold" ? "Означи како достапно" : "Означи како продадено"}
                  aria-label={v.status === "sold" ? "Означи како достапно" : "Означи како продадено"}
                  className={action}
                >
                  {v.status === "sold" ? (
                    <Undo2 className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Tag className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => void quick(v.id, { status: v.status === "reserved" ? "available" : "reserved" })}
                  disabled={busy}
                  title="Резервирано"
                  aria-label="Означи како резервирано"
                  className={action}
                >
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => void quick(v.id, { featured: !v.featured })}
                  disabled={busy}
                  title="Истакни на почетна"
                  aria-label="Истакни на почетна"
                  className={`${action} ${v.featured ? "border-gold-500 text-gold-300" : ""}`}
                >
                  <Star className="h-4 w-4" aria-hidden="true" />
                </button>

                <Link
                  href={`/admin/vozila/${v.id}`}
                  title="Уреди"
                  aria-label="Уреди возило"
                  className={action}
                >
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                </Link>

                <button
                  type="button"
                  onClick={() => void remove(v.id)}
                  disabled={busy}
                  title="Избриши"
                  aria-label="Избриши возило"
                  className="inline-flex h-9 cursor-pointer items-center gap-1.5 border border-red-500/35 px-2.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-red-200 transition-colors hover:bg-red-500/10 disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {confirmId === v.id ? "Потврди" : ""}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

