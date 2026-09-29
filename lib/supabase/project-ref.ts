/**
 * Го враќа референтот (ref) на Supabase проектот кон кој е поврзан сајтот,
 * извлечен од NEXT_PUBLIC_SUPABASE_URL — на пр. "pwajzhkcpemekrvvhdqs".
 *
 * Се користи во пораките за грешки, за да се види веднаш кон кој проект
 * гледа апликацијата (најчеста причина за конфузија при локално поставување).
 */
export function getSupabaseProjectRef(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname.split(".")[0] || null;
  } catch {
    return null;
  }
}

