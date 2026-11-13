import { fileURLToPath } from "node:url";
/** Static export: every page is pre-rendered HTML (fast, crawlable, hostable anywhere).
 *  Set PAGES=1 when building for GitHub Pages so links work under /Leno. */
const pages = process.env.PAGES === "1";
/* canonical site address: explicit env, else Vercel's production domain, else GitHub Pages */
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (!pages && vercel ? `https://${vercel}` : "https://reallmatinhosseini-ux.github.io/Leno");
const nextConfig = {
  output: "export",
  basePath: pages ? "/Leno" : "",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true, outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  env: { NEXT_PUBLIC_BASE_PATH: pages ? "/Leno" : "", NEXT_PUBLIC_SITE_URL: siteUrl },
};
export default nextConfig;
