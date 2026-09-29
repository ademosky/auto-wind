import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { buildVehicleSlug } from "@/lib/format";
import { adminAllSlugs, adminGetVehicle } from "@/lib/supabase/queries";
import { adminClient, PHOTO_BUCKET } from "@/lib/supabase/admin";
import { describeSupabaseError } from "@/lib/supabase/errors";
import { normaliseVehicle, validateVehicle } from "@/lib/vehicle-input";

type Ctx = { params: Promise<{ id: string }> };

async function refresh(slug?: string | null) {
  revalidatePath("/");
  revalidatePath("/vozila");
  if (slug) revalidatePath(`/vozila/${slug}`);
}

export async function PATCH(request: Request, { params }: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Невалидни податоци." }, { status: 400 });

  const existing = await adminGetVehicle(id);
  if (!existing) return NextResponse.json({ error: "Возилото не постои." }, { status: 404 });

  // partial update: status / featured / sort_order only
  if (body.__quick === true) {
    const patch: Record<string, unknown> = {};
    if (typeof body.status === "string") patch.status = body.status;
    if (typeof body.featured === "boolean") patch.featured = body.featured;
    if (typeof body.sort_order === "number") patch.sort_order = body.sort_order;
    const { error } = await adminClient().from("vehicles").update(patch).eq("id", id);
    if (error) return NextResponse.json({ error: describeSupabaseError(error) }, { status: 500 });
    await refresh(existing.slug);
    return NextResponse.json({ ok: true });
  }

  const payload = normaliseVehicle({ ...body });
  const problem = validateVehicle(payload);
  if (problem) return NextResponse.json({ error: problem }, { status: 400 });

  const taken = (await adminAllSlugs()).filter((s) => s !== existing.slug);
  const slug = buildVehicleSlug(payload.brand, payload.model, payload.year, taken);

  const { error } = await adminClient().from("vehicles").update({ ...payload, slug }).eq("id", id);
  if (error) return NextResponse.json({ error: describeSupabaseError(error) }, { status: 500 });

  await refresh(slug);
  if (slug !== existing.slug) await refresh(existing.slug);

  return NextResponse.json({ ok: true, slug });
}

export async function DELETE(_request: Request, { params }: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await adminGetVehicle(id);
  if (!existing) return NextResponse.json({ error: "Возилото не постои." }, { status: 404 });

  const paths = (existing.vehicle_images ?? [])
    .map((img) => img.storage_path)
    .filter((p): p is string => !!p);
  if (paths.length) {
    await adminClient().storage.from(PHOTO_BUCKET).remove(paths);
  }

  const { error } = await adminClient().from("vehicles").delete().eq("id", id);
  if (error) return NextResponse.json({ error: describeSupabaseError(error) }, { status: 500 });

  await refresh(existing.slug);
  return NextResponse.json({ ok: true });
}


