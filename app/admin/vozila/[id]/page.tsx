import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ImageManager } from "@/components/admin/image-manager";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { isAuthenticated } from "@/lib/auth";
import { vehicleTitle } from "@/lib/format";
import { adminGetVehicle } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Уреди возило",
  robots: { index: false, follow: false },
};

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const { id } = await params;
  const vehicle = await adminGetVehicle(id).catch(() => null);
  if (!vehicle) notFound();

  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 py-10 md:px-10 md:py-14">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-stone-2/55 transition-colors hover:text-gold-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Контролен панел
      </Link>

      <header className="mt-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="aw-eyebrow">Уреди возило</p>
          <h1 className="mt-3 font-display text-[30px] leading-tight text-stone md:text-[38px]">
            {vehicleTitle(vehicle)}
          </h1>
          <p className="mt-2 text-[13.5px] text-stone-2/55">/vozila/{vehicle.slug}</p>
        </div>
        <Link
          href={`/vozila/${vehicle.slug}`}
          className="inline-flex items-center gap-2 border border-gold-500/35 px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-gold-100 transition-colors hover:border-gold-500 hover:bg-gold-500/10"
        >
          Види на сајтот
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </header>

      <div className="mt-9 space-y-6">
        <ImageManager vehicleId={vehicle.id} images={vehicle.vehicle_images ?? []} />
        <VehicleForm vehicle={vehicle} />
      </div>
    </div>
  );
}

