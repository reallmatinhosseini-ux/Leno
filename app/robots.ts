import type { MetadataRoute } from "next";
import { BASE, SITE_URL } from "@/lib/site";
export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/checkout/", "/order/", "/wishlist/", "/admin/"].map((p) => BASE + p) }], sitemap: `${SITE_URL}/sitemap.xml`, host: SITE_URL };
}
