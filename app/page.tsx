import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  FileCheck2,
  Handshake,
  ShieldCheck,
} from "lucide-react";
import { ContactButtons } from "@/components/contact-buttons";
import { VehicleCard, VehiclePlaceholder } from "@/components/vehicle-card";
import { coverOf, formatPriceEur, telHref, vehicleShortTitle, vehicleTitle } from "@/lib/format";
import { getListedVehicles, getSettings, getSoldVehicles } from "@/lib/supabase/queries";

export const revalidate = 300;

const TRUST = [
  {
    icon: ShieldCheck,
    title: "Проверено потекло",
    body: "Секое возило поминува проверка на историја, километража и состојба пред да влезе во понуда.",
  },
  {
    icon: FileCheck2,
    title: "Целосна документација",
    body: "Увозот, царинските процедури и регистрацијата ги завршуваме ние — ти добиваш готово возило.",
  },
  {
    icon: Handshake,
    title: "Цена без изненадувања",
    body: "Цената што ја гледаш е цената што ја плаќаш. Без скриени трошоци и без притисок.",
  },
  {
    icon: BadgeCheck,
    title: "Директен контакт",
    body: "Разговараш директно со нас — не со посредник, не со повикувачки центар.",
  },
];

function WindLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.5]"
      aria-hidden="true"
      preserveAspectRatio="none"
      viewBox="0 0 1200 600"
    >
      <defs>
        <linearGradient id="wind" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c9a75a" stopOpacity="0" />
          <stop offset="45%" stopColor="#c9a75a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c9a75a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g stroke="url(#wind)" strokeWidth="1" fill="none">
        <path d="M-40 120 C 320 96, 780 60, 1240 8" />
        <path d="M-40 176 C 340 150, 800 118, 1240 72" />
        <path d="M-40 236 C 360 214, 820 186, 1240 148" />
        <path d="M-40 470 C 340 452, 780 430, 1240 396" />
        <path d="M-40 520 C 330 508, 800 490, 1240 462" />
      </g>
    </svg>
  );
}

export default async function HomePage() {
  const [vehicles, sold, settings] = await Promise.all([
    getListedVehicles(),
    getSoldVehicles(3),
    getSettings(),
  ]);

  const hero = vehicles.find((v) => v.featured) ?? vehicles[0] ?? null;
  const heroCover = hero ? coverOf(hero) : null;
  const preview = vehicles.slice(0, 6);

  return (
    <>
      {/* ---------------- hero ---------------- */}
      <section className="relative overflow-hidden">
        <WindLines />
        <div className="mx-auto w-full max-w-[1280px] px-5 pb-16 pt-12 md:px-10 md:pb-24 md:pt-20">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="aw-rise inline-block border border-gold-500/35 p-3 md:p-4">
                <span className="relative block h-12 w-[240px] md:h-14 md:w-[290px]">
                  <Image
                    src="/brand/auto-wind-logo.png"
                    alt="AUTO WIND"
                    fill
                    priority
                    sizes="290px"
                    className="object-contain"
                  />
                </span>
              </div>

              <p
                className="aw-eyebrow aw-rise mt-9"
                style={{ animationDelay: "80ms" }}
              >
                Увоз · Проверка · Продажба
              </p>

              <h1
                className="aw-rise mt-5 max-w-[19ch] font-display text-[38px] leading-[1.06] text-stone sm:text-[50px] lg:text-[58px]"
                style={{ animationDelay: "140ms" }}
              >
                Половни автомобили со <em className="aw-gold-text not-italic">проверено потекло</em>.
              </h1>

              <p
                className="aw-rise mt-6 max-w-[56ch] text-[17px] leading-relaxed text-stone-2/72"
                style={{ animationDelay: "200ms" }}
              >
                AUTO WIND увезува и продава избрани возила со реална километража, уредна документација и
                коректна историја. Без изненадувања — ниту во состојбата, ниту во цената.
              </p>

              <div
                className="aw-rise mt-9 flex flex-wrap items-center gap-4"
                style={{ animationDelay: "260ms" }}
              >
                <Link
                  href="/vozila"
                  className="inline-flex items-center gap-2.5 bg-gold-500 px-6 py-4 text-[12.5px] font-bold uppercase tracking-[0.16em] text-brand-950 transition-colors hover:bg-gold-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60 active:scale-[0.99]"
                >
                  Разгледај ги возилата
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                {settings.phone_display ? (
                  <a
                    href={telHref(settings.phone_e164)}
                    className="inline-flex items-center gap-2 border border-gold-500/35 px-6 py-4 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-gold-100 transition-colors hover:border-gold-500 hover:bg-gold-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
                  >
                    {settings.phone_display}
                  </a>
                ) : null}
              </div>

              <dl className="aw-rise mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-gold-500/20 pt-7">
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.22em] text-stone-2/50">Во понуда</dt>
                  <dd className="mt-2 font-display text-3xl text-gold-300">{vehicles.length}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.22em] text-stone-2/50">Проверка</dt>
                  <dd className="mt-2 font-display text-3xl text-gold-300">100%</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-[0.22em] text-stone-2/50">Документација</dt>
                  <dd className="mt-2 font-display text-3xl text-gold-300">Целосна</dd>
                </div>
              </dl>
            </div>

            {hero ? (
              <div className="aw-fade" style={{ animationDelay: "220ms" }}>
                <Link
                  href={`/vozila/${hero.slug}`}
                  className="group block focus-visible:outline-none"
                  aria-label={`${vehicleTitle(hero)} — најново во понуда`}
                >
                  <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden rounded-t-full border border-gold-500/30 bg-brand-800 transition-colors duration-500 group-hover:border-gold-500/60">
                    {heroCover ? (
                      <Image
                        src={heroCover}
                        alt={vehicleTitle(hero)}
                        fill
                        priority
                        sizes="(max-width: 1024px) 90vw, 460px"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <VehiclePlaceholder label={vehicleShortTitle(hero)} />
                    )}
                    <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(3,23,14,0.9),transparent_55%)]" />
                    <span className="absolute left-0 top-8 bg-brand-950/85 px-4 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.24em] text-gold-300">
                      Најново во понуда
                    </span>
                  </div>

                  <div className="mx-auto mt-6 flex max-w-[460px] items-end justify-between gap-4 border-t border-gold-500/20 pt-5">
                    <div>
                      <p className="font-display text-[22px] text-stone">{vehicleShortTitle(hero)}</p>
                      <p className="mt-1 text-[13px] text-stone-2/55">
                        {[hero.year, hero.fuel, hero.transmission].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    <p className="shrink-0 font-display text-[22px] text-gold-300">
                      {formatPriceEur(hero.price_eur)}
                    </p>
                  </div>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ---------------- offer ---------------- */}
      <section id="ponuda" className="relative scroll-mt-24 border-t border-gold-500/15">
        <div className="mx-auto w-full max-w-[1280px] px-5 py-16 md:px-10 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="aw-eyebrow">Актуелна понуда</p>
              <h2 className="mt-4 font-display text-[32px] leading-tight text-stone md:text-[42px]">
                Возила во понуда
              </h2>
            </div>
            {vehicles.length > 0 ? (
              <Link
                href="/vozila"
                className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.18em] text-gold-300 transition-colors hover:text-gold-100"
              >
                Сите возила ({vehicles.length})
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ) : null}
          </div>

          {preview.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {preview.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          ) : (
            <div className="mt-10 border border-gold-500/20 bg-brand-900/40 px-8 py-16 text-center">
              <p className="font-display text-2xl text-stone">Понудата се ажурира</p>
              <p className="mx-auto mt-3 max-w-md text-[15px] text-stone-2/65">
                Во моментов нема активни возила. Јави се и ќе ти кажеме што пристигнува следно.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ---------------- trust ---------------- */}
      <section id="zosto-nie" className="relative scroll-mt-24 border-y border-gold-500/15 bg-brand-900/35">
        <div className="mx-auto w-full max-w-[1280px] px-5 py-16 md:px-10 md:py-24">
          <p className="aw-eyebrow">Зошто AUTO WIND</p>
          <h2 className="mt-4 max-w-[22ch] font-display text-[32px] leading-tight text-stone md:text-[42px]">
            Четири работи што никогаш не ги прескокнуваме
          </h2>

          <div className="mt-12 grid gap-px overflow-hidden border border-gold-500/20 bg-gold-500/15 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-brand-950/85 p-7 transition-colors hover:bg-brand-900/70">
                <Icon className="h-7 w-7 text-gold-500" aria-hidden="true" />
                <h3 className="mt-5 font-display text-[20px] text-stone">{title}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-stone-2/65">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- recently sold ---------------- */}
      {sold.length > 0 ? (
        <section className="relative border-b border-gold-500/15">
          <div className="mx-auto w-full max-w-[1280px] px-5 py-16 md:px-10 md:py-20">
            <p className="aw-eyebrow">Неодамна продадени</p>
            <h2 className="mt-4 font-display text-[28px] leading-tight text-stone md:text-[34px]">
              Возила што веќе најдоа сопственик
            </h2>
            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sold.map((v) => (
                <VehicleCard key={v.id} vehicle={v} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ---------------- contact ---------------- */}
      <section id="kontakt" className="relative scroll-mt-24">
        <div className="mx-auto w-full max-w-[1280px] px-5 py-16 md:px-10 md:py-24">
          <div className="aw-panel grid gap-12 p-8 md:p-12 lg:grid-cols-[1fr_1fr] lg:p-16">
            <div>
              <p className="aw-eyebrow">Контакт</p>
              <h2 className="mt-4 max-w-[18ch] font-display text-[32px] leading-tight text-stone md:text-[42px]">
                Возилото те интересира? Јави се.
              </h2>
              <p className="mt-5 max-w-[48ch] text-[16px] leading-relaxed text-stone-2/70">
                Најбрзо е преку телефон, Viber или WhatsApp — одговараме лично и организираме
                разгледување во термин што ти одговара.
              </p>
              {(settings.address || settings.hours) && (
                <div className="mt-8 space-y-2 text-[15px] text-stone-2/70">
                  {settings.address ? <p>{settings.address}</p> : null}
                  {settings.hours ? <p className="text-stone-2/55">{settings.hours}</p> : null}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center gap-6">
              <ContactButtons
                phoneDisplay={settings.phone_display}
                phoneE164={settings.phone_e164}
                viber={settings.viber}
                whatsapp={settings.whatsapp}
                subject="Здраво AUTO WIND, ме интересира возило од вашата понуда."
              />
              {settings.phone_display ? (
                <p className="text-center font-display text-[26px] text-gold-300 md:text-[30px]">
                  {settings.phone_display}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

