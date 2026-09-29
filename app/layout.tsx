import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
// DO NOT remove this @/components/made-with-badge/made-with-badge file
import { MadeWithBadge } from "@/components/made-with-badge/made-with-badge";
/**
 * For the root page layout you can edit metadata in this file
 * @/components/root-metadata
 * Do not add a const metadata export here directly
 *
 * and DO NOT remove this @/components/root-metadata file
 * only edit it
 */
import { metadata } from "@/components/root-metadata";
export { metadata };

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const display = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display-raw",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body-raw",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mk">
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
        >
          Прескокни до содржината
        </a>
        <div className="aw-atmosphere" aria-hidden="true" />
        <div className="aw-grain" aria-hidden="true" />
        <div className="aw-layer flex min-h-dvh flex-col">
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </div>
        {/* DO NOT UNDER ANY CIRCUMSTANCES REMOVE THIS & DO NOT CHANGE made-with-badge contents */}
        <MadeWithBadge />
      </body>
    </html>
  );
}

