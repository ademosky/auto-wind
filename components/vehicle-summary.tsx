import { ContactButtons } from "@/components/contact-buttons";
import { formatNumber, formatPriceEur } from "@/lib/format";
import { STATUS_LABELS, type SiteSettings, type VehicleWithImages } from "@/lib/types";

/**
 * The price / specs / contact block for a vehicle.
 *
 * Rendered twice on the vehicle page so the mobile order can be
 * photos → name & price → details, while on desktop it stays in the
 * sticky right-hand column. Only one instance is visible at a time.
 */
export function VehicleSummary({
  vehicle,
  settings,
  title,
  summary,
  headingLevel = "h1",
}: {
  vehicle: VehicleWithImages;
  settings: SiteSettings;
  title: string;
  summary: string;
  headingLevel?: "h1" | "h2";
}) {
  const sold = vehicle.status === "sold";

  const headingClass =
    "mt-4 font-display text-[27px] leading-tight text-stone sm:text-[30px] md:mt-5 md:text-[36px]";

  return (
    <div className="border border-gold-500/20 bg-brand-900/50 p-4 sm:p-6 md:p-7">
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

      {headingLevel === "h1" ? (
        <h1 className={headingClass}>{title}</h1>
      ) : (
        <h2 className={headingClass}>{title}</h2>
      )}

      {vehicle.version ? <p className="mt-2 text-[15px] text-stone-2/65">{vehicle.version}</p> : null}
      <p className="mt-3 text-[14.5px] leading-relaxed text-stone-2/75">{summary}</p>

      <div className="aw-hairline my-5 md:my-6" />

      <p className="font-display text-[36px] leading-none text-gold-300 sm:text-[38px] md:text-[42px]">
        {formatPriceEur(vehicle.price_eur)}
      </p>
      {vehicle.price_mkd ? (
        <p className="mt-2 text-[14px] text-stone-2/55">≈ {formatNumber(vehicle.price_mkd)} ден.</p>
      ) : null}

      <div className="mt-6">
        <ContactButtons
          phoneDisplay={settings.phone_display}
          phoneE164={settings.phone_e164}
          viber={settings.viber}
          whatsapp={settings.whatsapp}
          subject={`Здраво AUTO WIND, ме интересира ${title} (${vehicle.year}).`}
        />
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-stone-2/55">
        {sold
          ? "Ова возило е продадено. Јави се и ќе ти предложиме слични возила што пристигнуваат."
          : "Јави се за да договориме разгледување во термин што ти одговара. Достапно и за тест вожња."}
      </p>
    </div>
  );
}

