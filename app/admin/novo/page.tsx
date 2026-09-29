import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { VehicleForm } from "@/components/admin/vehicle-form";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ново возило",
  robots: { index: false, follow: false },
};

export default async function NewVehiclePage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  return (
    <div className="mx-auto w-full max-w-[1100px] px-5 py-10 md:px-10 md:py-14">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-stone-2/55 transition-colors hover:text-gold-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Контролен панел
      </Link>

      <header className="mt-7">
        <p className="aw-eyebrow">Ново возило</p>
        <h1 className="mt-3 font-display text-[30px] leading-tight text-stone md:text-[38px]">
          Внеси податоци за возилото
        </h1>
        <p className="mt-4 max-w-[62ch] text-[15.5px] text-stone-2/65">
          Откако ќе го зачуваш возилото, ќе можеш да качиш фотографии и да избереш главна слика.
          Адресата на страницата автоматски се создава од марката, моделот и годината.
        </p>
      </header>

      <div className="mt-9">
        <VehicleForm />
      </div>
    </div>
  );
}

