import type { Metadata } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://preview-r3blj13v-668ed6a5f881.codewords.run";

export const SITE_NAME = "AUTO WIND";
export const SITE_TAGLINE = "Увоз и продажба на половни автомобили";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AUTO WIND — Увоз и продажба на половни автомобили",
    template: "%s | AUTO WIND",
  },
  description:
    "AUTO WIND — избрани половни автомобили со проверено потекло, целосна документација и коректна историја. Погледнете ја актуелната понуда и закажете разгледување.",
  keywords: [
    "половни автомобили",
    "увоз на автомобили",
    "автомобили Македонија",
    "AUTO WIND",
    "половни возила",
    "авто плац",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "mk_MK",
    url: "/",
    siteName: SITE_NAME,
    title: "AUTO WIND — Увоз и продажба на половни автомобили",
    description:
      "Избрани половни автомобили со проверено потекло и целосна документација. Погледнете ја актуелната понуда.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AUTO WIND — Увоз и продажба на половни автомобили",
    description: "Избрани половни автомобили со проверено потекло и целосна документација.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: true, address: false, email: false },
};

