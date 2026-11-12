/** Static export: every page is pre-rendered HTML (fast, crawlable, hostable anywhere).
 *  Set PAGES=1 when building for GitHub Pages so links work under /Leno. */
const pages = process.env.PAGES === "1";
const nextConfig = {
  output: "export",
  basePath: pages ? "/Leno" : "",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  env: { NEXT_PUBLIC_BASE_PATH: pages ? "/Leno" : "" },
};
export default nextConfig;
