import { fileURLToPath } from "node:url";
/** Server build on Vercel: pages are still pre-rendered for speed and SEO, while
 *  /api and /admin run on the server (orders, stock, payments). */
const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (vercel ? `https://${vercel}` : "http://localhost:3000");
const nextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true, outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  serverExternalPackages: ["@electric-sql/pglite", "postgres"],
  outputFileTracingIncludes: { "/api/**/*": ["./node_modules/@electric-sql/pglite/dist/**/*"] },
  env: { NEXT_PUBLIC_BASE_PATH: "", NEXT_PUBLIC_SITE_URL: siteUrl },
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ] },
    /* films and photos: browsers keep them for a day and refresh quietly in the background for a week,
       so returning visitors get the hero instantly while replaced files still show up within a day */
    ...["/v/:file*", "/p/:file*"].map((source) => ({ source, headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] }))];
  },
};
export default nextConfig;
