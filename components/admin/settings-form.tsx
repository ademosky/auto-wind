"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import type { SiteSettings } from "@/lib/types";

const field =
  "w-full border border-gold-500/25 bg-brand-950/70 px-3.5 py-3 text-[14.5px] text-stone outline-none transition-colors placeholder:text-stone-2/30 hover:border-gold-500/40 focus:border-gold-500 focus-visible:ring-2 focus-visible:ring-gold-500/30";
const label = "mb-2 block text-[10.5px] font-semibold uppercase tracking-[0.2em] text-gold-500";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
  const [form, setForm] = useState({
    phone_display: settings.phone_display ?? "",
    phone_e164: settings.phone_e164 ?? "",
    viber: settings.viber ?? "",
    whatsapp: settings.whatsapp ?? "",
    email: settings.email ?? "",
    address: settings.address ?? "",
    hours: settings.hours ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setMessage(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        setError("Зачувувањето не успеа.");
        return;
      }
      setMessage("Контакт податоците се зачувани.");
      router.refresh();
    } catch {
      setError("Не успеавме да се поврземе. Пробај повторно.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="border border-gold-500/18 bg-brand-900/35 p-5 md:p-6">
      <h2 className="font-display text-[20px] text-stone">Контакт податоци</h2>
      <p className="mt-2 text-[13.5px] text-stone-2/60">
        Овие податоци се прикажуваат во подножјето и во контакт секцијата на сајтот.
      </p>

      <form onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className={label} htmlFor="s-phone-display">
            Телефон (за приказ)
          </label>
          <input id="s-phone-display" className={field} value={form.phone_display} onChange={(e) => set("phone_display", e.target.value)} placeholder="+389 78 262 045" />
        </div>
        <div>
          <label className={label} htmlFor="s-phone-e164">
            Телефон (за повик, со +389)
          </label>
          <input id="s-phone-e164" className={field} value={form.phone_e164} onChange={(e) => set("phone_e164", e.target.value)} placeholder="+38978262045" />
        </div>
        <div>
          <label className={label} htmlFor="s-viber">
            Viber број
          </label>
          <input id="s-viber" className={field} value={form.viber} onChange={(e) => set("viber", e.target.value)} placeholder="+38978262045" />
        </div>
        <div>
          <label className={label} htmlFor="s-whatsapp">
            WhatsApp број
          </label>
          <input id="s-whatsapp" className={field} value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="+38978262045" />
        </div>
        <div>
          <label className={label} htmlFor="s-email">
            Е-пошта (незадолжително)
          </label>
          <input id="s-email" type="email" className={field} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="info@auto-wind.com" />
        </div>
        <div>
          <label className={label} htmlFor="s-address">
            Адреса (незадолжително)
          </label>
          <input id="s-address" className={field} value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Скопје" />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className={label} htmlFor="s-hours">
            Работно време (незадолжително)
          </label>
          <input id="s-hours" className={field} value={form.hours} onChange={(e) => set("hours", e.target.value)} placeholder="Пон – Саб, 09:00 – 18:00" />
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:col-span-2 lg:col-span-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex cursor-pointer items-center gap-2.5 bg-gold-500 px-6 py-3.5 text-[12.5px] font-bold uppercase tracking-[0.16em] text-brand-950 transition-colors hover:bg-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
            Зачувај контакт
          </button>
          {message ? <span className="text-[13.5px] text-gold-300">{message}</span> : null}
          {error ? (
            <span role="alert" className="text-[13.5px] text-red-200">
              {error}
            </span>
          ) : null}
        </div>
      </form>
    </section>
  );
}

