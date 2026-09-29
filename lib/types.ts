export type VehicleStatus = "available" | "reserved" | "sold";

export interface VehicleImage {
  id: string;
  vehicle_id: string;
  url: string;
  storage_path: string | null;
  sort_order: number;
  is_cover: boolean;
  created_at: string;
}

export interface Vehicle {
  id: string;
  slug: string;
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
  equipment: string[] | null;
  status: VehicleStatus;
  featured: boolean;
  sort_order: number;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface VehicleWithImages extends Vehicle {
  vehicle_images: VehicleImage[];
}

export interface SiteSettings {
  id: number;
  phone_display: string | null;
  phone_e164: string | null;
  viber: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  hours: string | null;
}

export const VEHICLE_LIST_COLUMNS =
  "id,slug,brand,model,version,year,price_eur,price_mkd,mileage_km,fuel,transmission,engine,power_kw,power_hp,drive,color,euro_standard,registration,description,equipment,status,featured,sort_order,cover_url,created_at,updated_at";

export const STATUS_LABELS: Record<VehicleStatus, string> = {
  available: "Достапно",
  reserved: "Резервирано",
  sold: "Продадено",
};

