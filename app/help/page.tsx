import type { Metadata } from "next";
import Help from "@/components/Help";
import JsonLd from "@/components/JsonLd";
import { FAQ } from "@/lib/faq";
import { breadcrumbLd } from "@/lib/seo";
export const metadata: Metadata = { title: "Help, delivery & returns", description: "Same-day delivery in Dubai, next day across the UAE, free 14-day returns, Tabby and Tamara. Track your LENO WEAR order and find answers.", alternates: { canonical: "/help/" } };
const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
export default function Page() { return (<><JsonLd data={[faqLd, breadcrumbLd([["Home", "/"], ["Help", "/help/"]])]} /><Help /></>); }
