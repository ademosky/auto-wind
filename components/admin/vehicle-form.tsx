"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";
import type { VehicleWithImages } from "@/lib/types";

const field =
  "w-full border border-gold-500/25 bg-brand-950/70 px-3.5 py-3 text-[14.5px] text-stone outline-none transition-colors placeholder:text-stone-2/30 hover:border-gold-500/40 focus:border-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500/30";
const label = "mb-2 block text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold-500";
const legend = "font-display text-[20px] text-stone";
const group = "border border-gold-500/18 bg-brand-900/35 p-5 md:p-6";

const FUELS = ["Бензин", "Дизел", "Хибрид", "Приклучен хибрид", "Електричен", "LPG"];
const TRANSMISSIONS = ["Рачен", "Автоматски", "Полуавтоматски"];
const DRIVES = ["Преден", "Заден", "4x4"];
const EURO = ["Euro 3", "Euro 4", "Euro 5", "Euro 6", "Euro 6d"];

type FormState = Record<string, string | boolean>;

function toForm(v?: VehicleWithImages | null): FormState {
  return {
    brand: v?.brand ?? "",
    model: v?.model ?? "",
    version: v?.version ?? "",
    year: v?.year ? String(v.year) : "",
    price_eur: v?.price_eur != null ? String(v.price_eur) : "",
    price_mkd: v?.price_mkd != null ? String(v.price_mkd) : "",
    mileage_km: v?.mileage_km != null ? String(v.mileage_km) : "",
    fuel: v?.fuel ?? "",
    transmission: v?.transmission ?? "",
    engine: v?.engine ?? "",
    power_kw: v?.power_kw != null ? String(v.power_kw) : "",
    power_hp: v?.power_hp != null ? String(v.power_hp) : "",
    drive: v?.drive ?? "",
    color: v?.color ?? "",
    euro_standard: v?.euro_standard ?? "",
    registration: v?.registration ?? "",
    description: v?.description ?? "",
    equipment: (v?.equipment ?? []).join("\n"),
    status: v?.status ?? "available",
    featured: v?.featured ?? false,
    sort_order: v?.sort_order != null ? String(v.sort_order) : "0",
  };
}

export function VehicleForm({ vehicle }: { vehicle?: VehicleWithImages | null }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toForm(vehicle));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const set = (key: string, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }));
    setSaved(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(vehicle ? `/api/admin/vehicles/${vehicle.id}` : "/api/admin/vehicles", {
        method: vehicle ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { error?: string; vehicle?: { id: string } };
      if (!res.ok) {
        setError(data.error ?? "Грешка при зачувување.");
        return;
      }
      setSaved(true);
      router.refresh();
      if (!vehicle && data.vehicle?.id) {
        router.push(`/admin/vozila/${data.vehicle.id}`);
      }
    } catch {
      setError("Не успеавме да се поврземе. Пробај повторно.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!vehicle) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 5000);
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicle.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError("Бришењето не успеа.");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <fieldset className={group}>
        <legend className={legend}>Основно</legend>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={label} htmlFor="brand">
              Марка *
            </label>
            <input id="brand" className={field} required value={String(form.brand)} onChange={(e) => set("brand", e.target.value)} placeholder="BMW" />
          </div>
          <div>
            <label className={label} htmlFor="model">
              Модел *
            </label>
            <input id="model" className={field} required value={String(form.model)} onChange={(e) => set("model", e.target.value)} placeholder="320d" />
          </div>
          <div>
            <label className={label} htmlFor="version">
              Верзија
            </label>
            <input id="version" className={field} value={String(form.version)} onChange={(e) => set("version", e.target.value)} placeholder="M Sport" />
          </div>
          <div>
            <label className={label} htmlFor="year">
              Година *
            </label>
            <input id="year" type="number" inputMode="numeric" className={field} required value={String(form.year)} onChange={(e) => set("year", e.target.value)} placeholder="2019" />
          </div>
          <div>
            <label className={label} htmlFor="mileage_km">
              Километри
            </label>
            <input id="mileage_km" type="number" inputMode="numeric" className={field} value={String(form.mileage_km)} onChange={(e) => set("mileage_km", e.target.value)} placeholder="142000" />
          </div>
          <div>
            <label className={label} htmlFor="status">
              Статус
            </label>
            <select id="status" className={field} value={String(form.status)} onChange={(e) => set("status", e.target.value)}>
              <option value="available">Достапно</option>
              <option value="reserved">Резервирано</option>
              <option value="sold">Продадено</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset className={group}>
        <legend className={legend}>Цена</legend>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={label} htmlFor="price_eur">
              Цена (EUR)
            </label>
            <input id="price_eur" inputMode="decimal" className={field} value={String(form.price_eur)} onChange={(e) => set("price_eur", e.target.value)} placeholder="14900" />
          </div>
          <div>
            <label className={label} htmlFor="price_mkd">
              Цена (MKD)
            </label>
            <input id="price_mkd" inputMode="decimal" className={field} value={String(form.price_mkd)} onChange={(e) => set("price_mkd", e.target.value)} placeholder="915000" />
          </div>
          <div>
            <label className={label} htmlFor="sort_order">
              Редослед во понуда
            </label>
            <input id="sort_order" type="number" inputMode="numeric" className={field} value={String(form.sort_order)} onChange={(e) => set("sort_order", e.target.value)} placeholder="0" />
          </div>
        </div>
        <label className="mt-5 inline-flex cursor-pointer items-center gap-3 text-[14.5px] text-stone-2/80">
          <input
            type="checkbox"
            checked={Boolean(form.featured)}
            onChange={(e) => set("featured", e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-[#c9a75a]"
          />
          Истакни на почетна страница
        </label>
      </fieldset>

      <fieldset className={group}>
        <legend className={legend}>Технички податоци</legend>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={label} htmlFor="fuel">
              Гориво
            </label>
            <select id="fuel" className={field} value={String(form.fuel)} onChange={(e) => set("fuel", e.target.value)}>
              <option value="">—</option>
              {FUELS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="transmission">
              Менувач
            </label>
            <select id="transmission" className={field} value={String(form.transmission)} onChange={(e) => set("transmission", e.target.value)}>
              <option value="">—</option>
              {TRANSMISSIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="engine">
              Мотор
            </label>
            <input id="engine" className={field} value={String(form.engine)} onChange={(e) => set("engine", e.target.value)} placeholder="2.0 TDI" />
          </div>
          <div>
            <label className={label} htmlFor="power_kw">
              Моќност (kW)
            </label>
            <input id="power_kw" type="number" inputMode="numeric" className={field} value={String(form.power_kw)} onChange={(e) => set("power_kw", e.target.value)} placeholder="110" />
          </div>
          <div>
            <label className={label} htmlFor="power_hp">
              Моќност (КС)
            </label>
            <input id="power_hp" type="number" inputMode="numeric" className={field} value={String(form.power_hp)} onChange={(e) => set("power_hp", e.target.value)} placeholder="150" />
          </div>
          <div>
            <label className={label} htmlFor="drive">
              Погон
            </label>
            <select id="drive" className={field} value={String(form.drive)} onChange={(e) => set("drive", e.target.value)}>
              <option value="">—</option>
              {DRIVES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="color">
              Боја
            </label>
            <input id="color" className={field} value={String(form.color)} onChange={(e) => set("color", e.target.value)} placeholder="Црна металик" />
          </div>
          <div>
            <label className={label} htmlFor="euro_standard">
              Euro стандард
            </label>
            <select id="euro_standard" className={field} value={String(form.euro_standard)} onChange={(e) => set("euro_standard", e.target.value)}>
              <option value="">—</option>
              {EURO.map((e2) => (
                <option key={e2} value={e2}>
                  {e2}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="registration">
              Регистрација / увозен статус
            </label>
            <input id="registration" className={field} value={String(form.registration)} onChange={(e) => set("registration", e.target.value)} placeholder="Увезено, нерегистрирано" />
          </div>
        </div>
      </fieldset>

      <fieldset className={group}>
        <legend className={legend}>Опис и опрема</legend>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div>
            <label className={label} htmlFor="description">
              Детален опис
            </label>
            <textarea id="description" rows={9} className={field} value={String(form.description)} onChange={(e) => set("description", e.target.value)} placeholder="Опиши го возилото, историјата, сервисната книшка, состојбата..." />
          </div>
          <div>
            <label className={label} htmlFor="equipment">
              Опрема (секој ред — една ставка)
            </label>
            <textarea id="equipment" rows={9} className={field} value={String(form.equipment)} onChange={(e) => set("equipment", e.target.value)} placeholder={"Клима\nНавигација\nПарктроник"} />
          </div>
        </div>
      </fieldset>

      {error ? (
        <p role="alert" className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-[14px] text-red-200">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex cursor-pointer items-center gap-2.5 bg-gold-500 px-6 py-3.5 text-[12.5px] font-bold uppercase tracking-[0.16em] text-brand-950 transition-colors hover:bg-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
          {vehicle ? "Зачувај промени" : "Создај возило"}
        </button>

        {saved ? <span className="text-[13.5px] text-gold-300">Зачувано.</span> : null}

        {vehicle ? (
          <button
            type="button"
            onClick={remove}
            disabled={deleting}
            className="ml-auto inline-flex cursor-pointer items-center gap-2 border border-red-500/40 px-5 py-3.5 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-red-200 transition-colors hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40 disabled:opacity-60"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Trash2 className="h-4 w-4" aria-hidden="true" />}
            {confirmDelete ? "Потврди бришење" : "Избриши возило"}
          </button>
        ) : null}
      </div>
    </form>
  );
}

