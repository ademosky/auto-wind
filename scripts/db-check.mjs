#!/usr/bin/env node
/**
 * Проверка на врската со базата.
 *
 *   npm run db:check
 *
 * Ги чита .env.local и проверува дали табелите што ги бара сајтот
 * навистина постојат. Печати јасна порака за секој проблем.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const out = { ...process.env };
  for (const file of [".env.local", ".env"]) {
    try {
      const text = readFileSync(resolve(process.cwd(), file), "utf8");
      for (const raw of text.split(/\r?\n/)) {
        const line = raw.trim();
        if (!line || line.startsWith("#")) continue;
        const eq = line.indexOf("=");
        if (eq === -1) continue;
        const key = line.slice(0, eq).trim();
        let value = line.slice(eq + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        out[key] = value;
      }
    } catch {
      /* датотеката не постои */
    }
  }
  return out;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;

/** Референтот на Supabase проектот на AUTO WIND (видлив е и во адресата, не е тајна). */
const EXPECTED_PROJECT_REF = "pwajzhkcpemekrvvhdqs";

function refOf(value) {
  try {
    return new URL(value).hostname.split(".")[0];
  } catch {
    return null;
  }
}
const anon = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = env.SUPABASE_SERVICE_ROLE_KEY;

const ok = (m) => console.log(`  \u2713 ${m}`);
const bad = (m) => console.log(`  \u2717 ${m}`);
const warn = (m) => console.log(`  ! ${m}`);

let problems = 0;

console.log("\nAUTO WIND — проверка на базата\n");

if (!url || url.includes("xxxx")) {
  bad("NEXT_PUBLIC_SUPABASE_URL не е пополнет во .env.local");
  problems += 1;
} else {
  const found = refOf(url);
  ok(`проект: ${url}`);
  if (found && found !== EXPECTED_PROJECT_REF) {
    warn(`проектот е ${found}, а AUTO WIND проектот е ${EXPECTED_PROJECT_REF}`);
    warn("ако шемата си ја извршил во AUTO WIND проектот, оваа адреса е погрешна");
  }
}
if (!anon || anon.startsWith("eyJ...")) {
  bad("NEXT_PUBLIC_SUPABASE_ANON_KEY не е пополнет");
  problems += 1;
} else {
  ok("anon клуч: пополнет");
}
if (!service || service.startsWith("eyJ...")) {
  warn("SUPABASE_SERVICE_ROLE_KEY не е пополнет — admin панелот нема да може да зачувува");
} else {
  ok("service_role клуч: пополнет");
}

if (problems > 0) {
  console.log("\nПополни ги вредностите во .env.local од Supabase → Settings → API Keys.\n");
  process.exit(1);
}

const targets = ["vehicles", "vehicle_images", "site_settings"];
console.log("\nТабели:");

for (const table of targets) {
  const endpoint = `${url.replace(/\/$/, "")}/rest/v1/${table}?select=*&limit=1`;
  let res;
  try {
    res = await fetch(endpoint, { headers: { apikey: anon, Authorization: `Bearer ${anon}` } });
  } catch (error) {
    bad(`${table}: не можам да се поврзам (${error.message})`);
    problems += 1;
    continue;
  }

  if (res.ok) {
    ok(`${table}: достапна`);
    continue;
  }

  const body = await res.text();
  if (body.includes("schema cache") || res.status === 404) {
    bad(`${table}: НЕ ПОСТОИ — изврши supabase/migrations/0001_init.sql во SQL Editor`);
    if (refOf(url) !== EXPECTED_PROJECT_REF) {
      bad(`       и провери ја адресата — треба да е проектот ${EXPECTED_PROJECT_REF}`);
    }
  } else if (res.status === 401 || res.status === 403) {
    bad(`${table}: пристапот е одбиен — провери го anon клучот и политиките за читање`);
  } else {
    bad(`${table}: ${res.status} ${body.slice(0, 120)}`);
  }
  problems += 1;
}

console.log("\nКорпа за фотографии:");
// Метаподатоците за корпата ги чита само service_role клучот, па затоа
// проверката не користи anon (инаку дава лажна грешка).
const checker = service && !service.startsWith("eyJ...") ? service : null;
if (!checker) {
  warn("не можам да ја проверам корпата без service_role клуч — пополни го за целосна проверка");
} else {
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/storage/v1/bucket/vehicle-photos`, {
      headers: { apikey: checker, Authorization: `Bearer ${checker}` },
    });
    if (res.ok) {
      const bucket = await res.json();
      ok(`vehicle-photos: постои${bucket.public ? " (јавно достапна)" : " — но НЕ е јавна, фотографиите нема да се прикажуваат"}`);
      if (!bucket.public) problems += 1;
    } else {
      bad("vehicle-photos: не постои — изврши ја шемата (таа ја создава корпата)");
      problems += 1;
    }
  } catch (error) {
    bad(`vehicle-photos: ${error.message}`);
    problems += 1;
  }
}

if (problems === 0) {
  console.log("\nСè е во ред. Базата е подготвена.\n");
} else {
  console.log("\nПрочитај supabase/README.md за чекор-по-чекор решение.\n");
  process.exit(1);
}





