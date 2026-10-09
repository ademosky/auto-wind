import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.auto-wind.com";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AUTO WIND — Возила во понуда",
    short_name: "AUTO WIND",
    description:
      "Увоз и продажба на избрани половни автомобили. Актуелна понуда со фотографии, спецификации и директен контакт.",
    start_url: "/",
    display: "standalone",
    background_color: "#03170e",
    theme_color: "#03170e",
    lang: "mk",
    dir: "ltr",
    categories: ["shopping", "business"],
    icons: [
      { src: "/icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
    id: SITE_URL,
  };
}

