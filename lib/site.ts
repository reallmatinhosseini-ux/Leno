export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://reallmatinhosseini-ux.github.io/Leno").replace(/\/$/, "");
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const BRAND = "LENO WEAR";
export const TAGLINE = "Leave your mark";
export const DESCRIPTION = "LENO WEAR is court-wear from Dubai: the Pleat, Knot and Tulle dresses and the Studio Set, made in small runs for padel, tennis and everything after. Same-day delivery in Dubai.";

/** Public asset URL that respects the GitHub Pages base path. */
export const asset = (path: string) => `${BASE}${path.startsWith("/") ? path : "/" + path}`;
export const img = (name: string) => asset(`/p/${name}.webp`);
export const jpg = (name: string) => `${SITE_URL}/p/${name}.jpg`;
export const money = (n: number) => "AED " + Math.round(n).toLocaleString("en-US");
