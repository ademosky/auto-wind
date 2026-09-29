import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ExternalLink, Plus } from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";
import { SettingsForm } from "@/components/admin/settings-form";
import { VehicleTable } from "@/components/admin/vehicle-table";
import { isAuthenticated } from "@/lib/auth";
import { adminCounts, adminListVehicles, getSettings } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Администрација",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const [vehicles, counts, settings] = await Promise.all([
    adminListVehicles(),
    adminCounts(),
    getSettings(),
  ]);

  const tiles = [
    { label: "Вкупно", value: counts.total },
    { label: "Достапни", value: counts.available },
    { label: "Резервирани", value: counts.reserved },
    { label: "Продадени", value: counts.sold },
  ];

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 py-10 md:px-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="aw-eyebrow">Контролен панел</p>
          <h1 className="mt-3 font-display text-[32px] leading-tight text-stone md:text-[40px]">
            Возила и поставки
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/novo"
            className="inline-flex items-center gap-2 bg-gold-500 px-5 py-3 text-[12px] font-bold uppercase tracking-[0.16em] text-brand-950 transition-colors hover:bg-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Ново возило
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="mt-9 grid gap-px overflow-hidden border border-gold-500/20 bg-gold-500/15 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="bg-brand-950/85 p-6">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-gold-500">{t.label}</p>
            <p className="mt-3 font-display text-4xl text-stone">{t.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-[24px] text-stone">Сите возила</h2>
          <Link
            href="/vozila"
            className="inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.18em] text-gold-300 transition-colors hover:text-gold-100"
          >
            Види на сајтот
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-5">
          <VehicleTable vehicles={vehicles} />
        </div>
      </section>

      <div className="mt-12">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}


