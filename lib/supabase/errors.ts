import { getSupabaseProjectRef } from "./project-ref";

type MaybeError = {
  message?: string;
  code?: string;
  details?: string | null;
  hint?: string | null;
} | null | undefined;

const MIGRATION_FILE = "supabase/migrations/0001_init.sql";

function ref(): string {
  const projectRef = getSupabaseProjectRef();
  return projectRef ? `https://${projectRef}.supabase.co` : "проектот наведен во NEXT_PUBLIC_SUPABASE_URL";
}

/**
 * Претвора сурова Supabase грешка во јасна порака со конкретен чекор за решение.
 *
 * Ги покрива случаите што најчесто се случуваат при локално поставување:
 * празна/неизвршена шема, погрешен проект во .env.local, и недостапен клуч.
 */
export function describeSupabaseError(error: MaybeError): string {
  const message = error?.message ?? "";
  const code = error?.code ?? "";
  const lower = message.toLowerCase();

  // 1) Табелата не постои (или кешот на шемата не е освежен)
  if (lower.includes("schema cache") || code === "PGRST205" || code === "42P01") {
    return [
      `Табелата не е најдена во базата — ${ref()}.`,
      "",
      "Најчесто е едно од овие три:",
      `  1. Шемата не е извршена. Отвори Supabase → SQL Editor и изврши ${MIGRATION_FILE}.`,
      "  2. .env.local покажува на погрешен Supabase проект (на пр. од претходен сајт).",
      "     Провери го проектот на адресата погоре — тоа е проектот што го користи сајтот.",
      "  3. Кешот не е освежен. Изврши во SQL Editor:  notify pgrst, 'reload schema';",
      "",
      "Проверка со една команда:  npm run db:check",
      `(оригинална порака: ${message})`,
    ].join("\n");
  }

  // 2) Пристапот е одбиен
  if (
    lower.includes("permission denied") ||
    lower.includes("row level security") ||
    code === "42501" ||
    code === "PGRST301" ||
    code === "401" ||
    code === "403"
  ) {
    return [
      "Пристапот до базата е одбиен.",
      "",
      "Провери:",
      "  · Дали политиките за читање постојат — тие се во " + MIGRATION_FILE + ".",
      "  · Дали NEXT_PUBLIC_SUPABASE_ANON_KEY е од истиот проект како URL-то.",
      "  · За admin панелот: дали SUPABASE_SERVICE_ROLE_KEY е пополнет во .env.local.",
      "",
      "Проверка со една команда:  npm run db:check",
      `(оригинална порака: ${message})`,
    ].join("\n");
  }

  // 3) Погрешен или невалиден клуч
  if (lower.includes("invalid api key") || lower.includes("invalid jwt") || lower.includes("jwt expired")) {
    return [
      "Клучот за базата не е валиден.",
      "",
      "Отвори Supabase → Settings → API Keys и копирај ги вредностите повторно во .env.local.",
      "Потоа рестартирај:  npm run dev",
      `(оригинална порака: ${message})`,
    ].join("\n");
  }

  // 4) Врската не е конфигурирана
  if (lower.includes("is not configured") || lower.includes("supabase_url")) {
    return [
      "Базата не е конфигурирана во .env.local.",
      "",
      "Пополни ги NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY и SUPABASE_SERVICE_ROLE_KEY.",
      `Потоа изврши ја шемата од ${MIGRATION_FILE} во Supabase → SQL Editor.`,
      "",
      "Проверка со една команда:  npm run db:check",
      `(оригинална порака: ${message})`,
    ].join("\n");
  }

  // 5) Дупка во податоците (на пр. дупликат slug)
  if (code === "23505" || lower.includes("duplicate key")) {
    return `Веќе постои возило со истата адреса. Смени ја марката/моделот или отвори го постоечкото возило. (${message})`;
  }

  // 6) Сè останато — пренеси ја пораката, без да ја сокриеш причината
  return message || "Непозната грешка при пристап до базата. Отвори Supabase → Logs за детали.";
}

