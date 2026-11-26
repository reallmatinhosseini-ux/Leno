export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://reallmatinhosseini-ux.github.io/Leno").replace(/\/$/, "");
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const BRAND = "LENO WEAR";
export const TAGLINE = "Leave your mark";
export const DESCRIPTION = "LENO WEAR is court-wear from Dubai: the Pleat, Knot and Padel dresses and the Studio Set, made in small runs for padel, tennis and everything after. Same-day delivery in Dubai.";

/** Public asset URL that respects the GitHub Pages base path. */
export const asset = (path: string) => `${BASE}${path.startsWith("/") ? path : "/" + path}`;
/** Bump when the files in public/p are replaced, so browsers holding the old photos fetch the new ones. */
export const PHOTO_V = "2";
export const img = (name: string) => (/^https?:\/\//.test(name) ? name : asset(`/p/${name}.webp?v=${PHOTO_V}`));
export const jpg = (name: string) => (/^https?:\/\//.test(name) ? name : `${SITE_URL}/p/${name}.jpg`);
export const money = (n: number) => "AED " + Math.round(n).toLocaleString("en-US");
