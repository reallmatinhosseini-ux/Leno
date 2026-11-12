import type { MetadataRoute } from "next";
import { BRAND, DESCRIPTION, asset } from "@/lib/site";
export const dynamic = "force-static";
export default function manifest(): MetadataRoute.Manifest {
  return { name: BRAND, short_name: "LENO", description: DESCRIPTION, start_url: asset("/"), scope: asset("/"), display: "standalone", background_color: "#F4EEE4", theme_color: "#D3203A", icons: [{ src: asset("/p/kiss-tag.png"), sizes: "923x688", type: "image/png" }] };
}
