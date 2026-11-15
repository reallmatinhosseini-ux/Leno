import type { Metadata } from "next";
import Checkout from "@/components/Checkout";
export const metadata: Metadata = { title: "Checkout", robots: { index: false, follow: true } };
export default function Page() { return <Checkout />; }
