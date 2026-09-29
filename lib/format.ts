import type { Vehicle, VehicleImage } from "./types";

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("de-DE").format(value);
}

export function formatMileage(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  return `${formatNumber(value)} км`;
}

export function formatPriceEur(value: number | null | undefined): string {
  if (value === null || value === undefined) return "По договор";
  return `${formatNumber(Math.round(value))} €`;
}

export function formatPriceMkd(value: number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return `${formatNumber(Math.round(value))} ден.`;
}

export function vehicleTitle(v: Pick<Vehicle, "brand" | "model" | "version">): string {
  return [v.brand, v.model, v.version].filter(Boolean).join(" ");
}

export function vehicleShortTitle(v: Pick<Vehicle, "brand" | "model">): string {
  return `${v.brand} ${v.model}`;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/** Builds `bmw-320d-2019`, appending a counter when the base slug is taken. */
export function buildVehicleSlug(
  brand: string,
  model: string,
  year: number | string,
  taken: string[] = [],
): string {
  const base = slugify(`${brand} ${model} ${year}`) || `vozilo-${year}`;
  if (!taken.includes(base)) return base;
  let n = 2;
  while (taken.includes(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export function sortImages(images: VehicleImage[] | null | undefined): VehicleImage[] {
  if (!images?.length) return [];
  return [...images].sort((a, b) => {
    if (a.is_cover !== b.is_cover) return a.is_cover ? -1 : 1;
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return a.created_at.localeCompare(b.created_at);
  });
}

export function coverOf(v: Vehicle & { vehicle_images?: VehicleImage[] | null }): string | null {
  const imgs = sortImages(v.vehicle_images);
  return imgs[0]?.url ?? v.cover_url ?? null;
}

export function statusTone(status: string): "available" | "reserved" | "sold" {
  if (status === "sold") return "sold";
  if (status === "reserved") return "reserved";
  return "available";
}

export function telHref(value: string | null | undefined): string {
  if (!value) return "";
  return `tel:${value.replace(/[^+0-9]/g, "")}`;
}

export function whatsappHref(value: string | null | undefined, text?: string): string {
  if (!value) return "";
  const digits = value.replace(/[^0-9]/g, "");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
}

export function viberHref(value: string | null | undefined): string {
  if (!value) return "";
  return `viber://chat?number=${encodeURIComponent(value.replace(/[^+0-9]/g, ""))}`;
}

