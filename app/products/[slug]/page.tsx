import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductView from "@/components/ProductView";
import JsonLd from "@/components/JsonLd";
import { PRODUCTS, STYLES, bySlug } from "@/lib/data";
import { breadcrumbLd, productLd } from "@/lib/seo";
import { jpg, money } from "@/lib/site";

type P = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return PRODUCTS.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = bySlug((await params).slug); if (!p) return {};
  const st = STYLES[p.style], title = `${st.name} in ${p.color}`;
  const description = `${st.name} in ${p.color}, ${money(st.price)}. ${st.desc} Same-day delivery in Dubai, free 14-day returns.`;
  return {
    title, description, alternates: { canonical: `/products/${p.slug}/` },
    openGraph: { type: "website", title: `${title} · LENO WEAR`, description, images: p.images.map((n) => ({ url: jpg(n), alt: title })) },
    twitter: { card: "summary_large_image", title, description, images: [jpg(p.images[0])] },
    other: { "product:price:amount": String(st.price), "product:price:currency": "AED" },
  };
}

export default async function ProductPage({ params }: P) {
  const p = bySlug((await params).slug); if (!p) notFound();
  const st = STYLES[p.style];
  return (<>
    <JsonLd data={[productLd(p), breadcrumbLd([["Home", "/"], ["Shop", "/shop/"], [st.cat === "sets" ? "Sets" : "Dresses", `/shop/${st.cat}/`], [`${st.name} in ${p.color}`, `/products/${p.slug}/`]])]} />
    <ProductView id={p.id} />
  </>);
}
