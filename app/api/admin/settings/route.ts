import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthenticated } from "@/lib/auth";
import { adminClient } from "@/lib/supabase/admin";

function text(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s.length ? s : null;
}

export async function PATCH(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Невалидни податоци." }, { status: 400 });

  const patch = {
    phone_display: text(body.phone_display),
    phone_e164: text(body.phone_e164),
    viber: text(body.viber),
    whatsapp: text(body.whatsapp),
    email: text(body.email),
    address: text(body.address),
    hours: text(body.hours),
    updated_at: new Date().toISOString(),
  };

  const { error } = await adminClient().from("site_settings").upsert({ id: 1, ...patch });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}

