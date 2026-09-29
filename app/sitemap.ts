import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/supabase/queries";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://preview-r3blj13v-668ed6a5f881.codewords.run";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/vozila`, changeFrequency: "daily", priority: 0.9 },
  ];

  try {
    const vehicles = await getAllSlugs();
    return [
      ...staticRoutes,
      ...vehicles.map((v) => ({
        url: `${SITE_URL}/vozila/${v.slug}`,
        lastModified: v.updated_at ? new Date(v.updated_at) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}

