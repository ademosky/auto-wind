import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { adminGetVehicle } from "@/lib/supabase/queries";
import { adminClient, PHOTO_BUCKET } from "@/lib/supabase/admin";
import { describeSupabaseError } from "@/lib/supabase/errors";

type Ctx = { params: Promise<{ id: string }> };

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 10 * 1024 * 1024;

function extFor(file: File): string {
  const byExt = file.name.includes(".") ? file.name.split(".").pop() ?? "" : "";
  const byType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
  };
  return byType[file.type] ?? (byExt.length > 0 && byExt.length <= 5 ? byExt : "jpg");
}

async function refreshAll(id: string) {
  const v = await adminGetVehicle(id);
  revalidatePath("/");
  revalidatePath("/vozila");
  if (v?.slug) revalidatePath(`/vozila/${v.slug}`);
}

export async function POST(request: Request, { params }: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const vehicle = await adminGetVehicle(id);
  if (!vehicle) return NextResponse.json({ error: "Возилото не постои." }, { status: 404 });

  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Невалидни податоци." }, { status: 400 });

  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (!files.length) return NextResponse.json({ error: "Нема избрани фотографии." }, { status: 400 });

  const existingCount = vehicle.vehicle_images?.length ?? 0;
  const hasCover = (vehicle.vehicle_images ?? []).some((i) => i.is_cover);
  const uploaded: { id: string; url: string }[] = [];
  const errors: string[] = [];

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];
    if (!ALLOWED.includes(file.type)) {
      errors.push(`${file.name}: дозволени се само JPG, PNG, WEBP и AVIF.`);
      continue;
    }
    if (file.size > MAX_BYTES) {
      errors.push(`${file.name}: максимум 10 MB по фотографија.`);
      continue;
    }

    const path = `${id}/${crypto.randomUUID()}.${extFor(file)}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await adminClient()
      .storage.from(PHOTO_BUCKET)
      .upload(path, buffer, { contentType: file.type, upsert: false });

    if (uploadError) {
      errors.push(`${file.name}: ${uploadError.message}`);
      continue;
    }

    const { data: publicUrl } = adminClient().storage.from(PHOTO_BUCKET).getPublicUrl(path);
    const isCover = !hasCover && i === 0 && existingCount === 0;

    const { data: row, error: insertError } = await adminClient()
      .from("vehicle_images")
      .insert({
        vehicle_id: id,
        url: publicUrl.publicUrl,
        storage_path: path,
        sort_order: existingCount + i,
        is_cover: isCover,
      })
      .select("id,url")
      .single();

    if (insertError || !row) {
      await adminClient().storage.from(PHOTO_BUCKET).remove([path]);
      errors.push(`${file.name}: ${insertError?.message ?? "грешка при зачувување"}`);
      continue;
    }

    if (isCover) {
      await adminClient().from("vehicles").update({ cover_url: row.url }).eq("id", id);
    }
    uploaded.push(row as { id: string; url: string });
  }

  await refreshAll(id);
  return NextResponse.json({ ok: uploaded.length > 0, uploaded, errors });
}

export async function PATCH(request: Request, { params }: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as
    | { order?: string[]; coverId?: string }
    | null;

  if (body?.order?.length) {
    for (let i = 0; i < body.order.length; i += 1) {
      await adminClient().from("vehicle_images").update({ sort_order: i }).eq("id", body.order[i]).eq("vehicle_id", id);
    }
  }

  if (body?.coverId) {
    await adminClient().from("vehicle_images").update({ is_cover: false }).eq("vehicle_id", id);
    const { data: cover } = await adminClient()
      .from("vehicle_images")
      .update({ is_cover: true })
      .eq("id", body.coverId)
      .eq("vehicle_id", id)
      .select("url")
      .single();
    if (cover?.url) {
      await adminClient().from("vehicles").update({ cover_url: cover.url }).eq("id", id);
    }
  }

  await refreshAll(id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request, { params }: Ctx) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { imageId?: string } | null;
  if (!body?.imageId) return NextResponse.json({ error: "Недостасува идентификатор." }, { status: 400 });

  const vehicle = await adminGetVehicle(id);
  if (!vehicle) return NextResponse.json({ error: "Возилото не постои." }, { status: 404 });

  const image = (vehicle.vehicle_images ?? []).find((i) => i.id === body.imageId);
  if (!image) return NextResponse.json({ error: "Фотографијата не постои." }, { status: 404 });

  if (image.storage_path) {
    await adminClient().storage.from(PHOTO_BUCKET).remove([image.storage_path]);
  }
  await adminClient().from("vehicle_images").delete().eq("id", image.id);

  const remaining = (vehicle.vehicle_images ?? [])
    .filter((i) => i.id !== image.id)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (image.is_cover) {
    const next = remaining[0] ?? null;
    if (next) {
      await adminClient().from("vehicle_images").update({ is_cover: true }).eq("id", next.id);
    }
    await adminClient().from("vehicles").update({ cover_url: next?.url ?? null }).eq("id", id);
  }

  await refreshAll(id);
  return NextResponse.json({ ok: true });
}


