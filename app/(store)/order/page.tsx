import type { Metadata } from "next";
import Order from "@/components/Order";
export const metadata: Metadata = { title: "Order confirmed", robots: { index: false, follow: true } };
export default function Page() { return <Order />; }
