import type { Metadata } from "next";
import Story from "@/components/Story";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd } from "@/lib/seo";
export const metadata: Metadata = { title: "Our story", description: "LENO WEAR is court-wear from Dubai: four styles in small runs, built for padel, tennis and the studio, and cut to be worn long after.", alternates: { canonical: "/story/" } };
export default function Page() { return (<><JsonLd data={breadcrumbLd([["Home", "/"], ["Our story", "/story/"]])} /><Story /></>); }
