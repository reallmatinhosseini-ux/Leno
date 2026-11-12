import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Motion from "@/components/Motion";
import { Announcement, BagDrawer, Footer, Header, MobileMenu, OfferCard, QuickView, SearchOverlay, TabBar, Toast } from "@/components/Chrome";
import { BRAND, DESCRIPTION, SITE_URL, asset, jpg } from "@/lib/site";
import JsonLd from "@/components/JsonLd";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL + "/"),
  title: { default: `${BRAND} · Court-wear from Dubai`, template: `%s · ${BRAND}` },
  description: DESCRIPTION,
  applicationName: BRAND,
  keywords: ["tennis dress Dubai", "padel dress UAE", "women's activewear Dubai", "court dress", "pleated tennis dress", "studio set", "LENO WEAR"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: BRAND, locale: "en_AE", url: SITE_URL + "/", title: `${BRAND} · Leave your mark`, description: DESCRIPTION, images: [{ url: jpg("h-pleat-white"), width: 1000, height: 1191, alt: "The Pleat Dress in White" }] },
  twitter: { card: "summary_large_image", title: `${BRAND} · Leave your mark`, description: DESCRIPTION, images: [jpg("h-pleat-white")] },
  icons: { icon: asset("/p/kiss-tag.png"), apple: asset("/p/kiss-tag.png") },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = { themeColor: "#F4EEE4", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const org = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": SITE_URL + "/#org", name: BRAND, url: SITE_URL + "/", logo: SITE_URL + "/p/kiss-tag.png", slogan: "Leave your mark", areaServed: "AE", address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" } },
      { "@type": "WebSite", "@id": SITE_URL + "/#site", url: SITE_URL + "/", name: BRAND, publisher: { "@id": SITE_URL + "/#org" }, inLanguage: "en-AE" },
    ],
  };
  return (
    <html lang="en" className={`${archivo.variable} ${sans.variable}`}>
      <body style={{ ["--kiss-url" as string]: `url(${asset("/p/kiss-tag.png")})` }}>
        <JsonLd data={org} />
        <StoreProvider>
          <a className="sr skip" href="#view">Skip to content</a>
          <Announcement />
          <Header />
          <main id="view">{children}</main>
          <Footer />
          <MobileMenu />
          <SearchOverlay />
          <BagDrawer />
          <QuickView />
          <TabBar />
          <OfferCard />
          <Toast />
          <Motion />
        </StoreProvider>
      </body>
    </html>
  );
}
