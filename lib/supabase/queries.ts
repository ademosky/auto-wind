import { publicClient } from "./public";
import { adminClient } from "./admin";
import {
  VEHICLE_LIST_COLUMNS,
  type SiteSettings,
  type Vehicle,
  type VehicleWithImages,
} from "../types";

const WITH_IMAGES = `${VEHICLE_LIST_COLUMNS}, vehicle_images(id,vehicle_id,url,storage_path,sort_order,is_cover,created_at)`;

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  phone_display: "+389 78 262 045",
  phone_e164: "+38978262045",
  viber: "+38978262045",
  whatsapp: "+38978262045",
  email: null,
  address: null,
  hours: null,
};

/** Vehicles shown in the public offer (everything that is not sold yet). */
export async function getListedVehicles(): Promise<VehicleWithImages[]> {
  const { data, error } = await publicClient()
    .from("vehicles")
    .select(WITH_IMAGES)
    .neq("status", "sold")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as VehicleWithImages[];
}

export async function getSoldVehicles(limit = 6): Promise<VehicleWithImages[]> {
  const { data, error } = await publicClient()
    .from("vehicles")
    .select(WITH_IMAGES)
    .eq("status", "sold")
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as VehicleWithImages[];
}

export async function getVehicleBySlug(slug: string): Promise<VehicleWithImages | null> {
  const { data, error } = await publicClient()
    .from("vehicles")
    .select(WITH_IMAGES)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as VehicleWithImages) ?? null;
}

export async function getAllSlugs(): Promise<{ slug: string; updated_at: string }[]> {
  const { data, error } = await publicClient()
    .from("vehicles")
    .select("slug,updated_at")
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as { slug: string; updated_at: string }[];
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const { data } = await publicClient()
      .from("site_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    return { ...DEFAULT_SETTINGS, ...(data as SiteSettings | null) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/* ---------------- admin (service role) ---------------- */

export async function adminListVehicles(): Promise<VehicleWithImages[]> {
  const { data, error } = await adminClient()
    .from("vehicles")
    .select(WITH_IMAGES)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as VehicleWithImages[];
}

export async function adminGetVehicle(id: string): Promise<VehicleWithImages | null> {
  const { data, error } = await adminClient()
    .from("vehicles")
    .select(WITH_IMAGES)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as unknown as VehicleWithImages) ?? null;
}

export async function adminAllSlugs(): Promise<string[]> {
  const { data } = await adminClient().from("vehicles").select("slug");
  return ((data ?? []) as { slug: string }[]).map((r) => r.slug);
}

export async function adminCounts(): Promise<{
  total: number;
  available: number;
  reserved: number;
  sold: number;
}> {
  const { data, error } = await adminClient().from("vehicles").select("status");
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as { status: string }[];
  return {
    total: rows.length,
    available: rows.filter((r) => r.status === "available").length,
    reserved: rows.filter((r) => r.status === "reserved").length,
    sold: rows.filter((r) => r.status === "sold").length,
  };
}

export type VehicleInput = Partial<Omit<Vehicle, "id" | "created_at" | "updated_at">>;

