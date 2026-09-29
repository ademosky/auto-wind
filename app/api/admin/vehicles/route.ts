import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { buildVehicleSlug } from "@/lib/format";
import { adminAllSlugs, adminListVehicles } from "@/lib/supabase/queries";
import { adminClient } from "@/lib/supabase/admin";
import { normaliseVehicle, validateVehicle } from "@/lib/vehicle-input";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const vehicles = await adminListVehicles();
  return NextResponse.json({ vehicles });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Невалидни податоци." }, { status: 400 });

  const payload = normaliseVehicle(body);
  const problem = validateVehicle(payload);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const taken = await adminAllSlugs();
  const slug = buildVehicleSlug(payload.brand, payload.model, payload.year, taken);

  const { data, error } = await adminClient()
    .from("vehicles")
    .insert({ ...payload, slug })
    .select("id,slug")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/");
  revalidatePath("/vozila");
  revalidatePath(`/vozila/${slug}`);

  return NextResponse.json({ ok: true, vehicle: data });
}

