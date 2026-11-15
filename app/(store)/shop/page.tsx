import type { Metadata } from "next";
import ShopView from "@/components/ShopView";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, itemListLd } from "@/lib/seo";

const intro = "Court dresses and studio sets from Dubai, made in small runs for padel, tennis and everything after.";
export const metadata: Metadata = { title: "Shop all court-wear", description: "Shop LENO WEAR: the Pleat, Knot and Tulle court dresses and the Studio Set. " + intro, alternates: { canonical: "/shop/" } };

export default function Shop() {
  return (<>
    <JsonLd data={[breadcrumbLd([["Home", "/"], ["Shop", "/shop/"]]), itemListLd()]} />
    <ShopView kind="all" title="All pieces" intro={intro} />
  </>);
}
