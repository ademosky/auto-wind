import type { VehicleStatus } from "./types";

const STATUSES: VehicleStatus[] = ["available", "reserved", "sold"];

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const cleaned = String(value).replace(/[^0-9.,-]/g, "").replace(/\.(?=\d{3}\b)/g, "").replace(",", ".");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function toText(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s.length ? s : null;
}

function toEquipment(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export interface NormalisedVehicle {
  brand: string;
  model: string;
  version: string | null;
  year: number;
  price_eur: number | null;
  price_mkd: number | null;
  mileage_km: number | null;
  fuel: string | null;
  transmission: string | null;
  engine: string | null;
  power_kw: number | null;
  power_hp: number | null;
  drive: string | null;
  color: string | null;
  euro_standard: string | null;
  registration: string | null;
  description: string | null;
  equipment: string[];
  status: VehicleStatus;
  featured: boolean;
  sort_order: number;
}

export function normaliseVehicle(input: Record<string, unknown>): NormalisedVehicle {
  const status = STATUSES.includes(input.status as VehicleStatus)
    ? (input.status as VehicleStatus)
    : "available";

  const year = toNumber(input.year);

  return {
    brand: toText(input.brand) ?? "",
    model: toText(input.model) ?? "",
    version: toText(input.version),
    year: year ?? new Date().getFullYear(),
    price_eur: toNumber(input.price_eur),
    price_mkd: toNumber(input.price_mkd),
    mileage_km: toNumber(input.mileage_km),
    fuel: toText(input.fuel),
    transmission: toText(input.transmission),
    engine: toText(input.engine),
    power_kw: toNumber(input.power_kw),
    power_hp: toNumber(input.power_hp),
    drive: toText(input.drive),
    color: toText(input.color),
    euro_standard: toText(input.euro_standard),
    registration: toText(input.registration),
    description: toText(input.description),
    equipment: toEquipment(input.equipment),
    status,
    featured: input.featured === true || input.featured === "true",
    sort_order: toNumber(input.sort_order) ?? 0,
  };
}

export function validateVehicle(v: NormalisedVehicle): string | null {
  if (!v.brand) return "Марката е задолжителна.";
  if (!v.model) return "Моделот е задолжителен.";
  if (!v.year || v.year < 1950 || v.year > new Date().getFullYear() + 1) {
    return "Внеси валидна година.";
  }
  return null;
}

