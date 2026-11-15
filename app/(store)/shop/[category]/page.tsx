import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ShopView from "@/components/ShopView";
import JsonLd from "@/components/JsonLd";
import { CATEGORIES, PRODUCTS } from "@/lib/data";
import { breadcrumbLd, itemListLd } from "@/lib/seo";
import { jpg } from "@/lib/site";

type P = { params: Promise<{ category: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return CATEGORIES.map((c) => ({ category: c.slug })); }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { category } = await params; const c = CATEGORIES.find((x) => x.slug === category); if (!c) return {};
  const first = PRODUCTS.find(c.filter)!;
  return { title: c.title, description: c.desc, alternates: { canonical: `/shop/${c.slug}/` }, openGraph: { title: c.title, description: c.desc, images: [jpg(first.images[0])] } };
}

export default async function Category({ params }: P) {
  const { category } = await params; const c = CATEGORIES.find((x) => x.slug === category); if (!c) notFound();
  return (<>
    <JsonLd data={[breadcrumbLd([["Home", "/"], ["Shop", "/shop/"], [c.name, `/shop/${c.slug}/`]]), itemListLd(PRODUCTS.filter(c.filter))]} />
    <ShopView kind={c.slug} title={c.title} intro={c.desc} />
  </>);
}
