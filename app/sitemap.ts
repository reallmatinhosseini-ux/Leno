import type { MetadataRoute } from "next";
import { CATEGORIES, PRODUCTS } from "@/lib/data";
import { SITE_URL, jpg } from "@/lib/site";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/shop/`, lastModified: now, changeFrequency: "daily", priority: .9 },
    ...CATEGORIES.map((c) => ({ url: `${SITE_URL}/shop/${c.slug}/`, lastModified: now, changeFrequency: "daily" as const, priority: .8 })),
    ...PRODUCTS.map((p) => ({ url: `${SITE_URL}/products/${p.slug}/`, lastModified: now, changeFrequency: "daily" as const, priority: .8, images: p.images.map(jpg) })),
    { url: `${SITE_URL}/story/`, lastModified: now, changeFrequency: "monthly", priority: .5 },
    { url: `${SITE_URL}/help/`, lastModified: now, changeFrequency: "monthly", priority: .5 },
  ];
}
