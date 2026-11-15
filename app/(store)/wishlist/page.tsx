import type { Metadata } from "next";
import Wishlist from "@/components/Wishlist";
export const metadata: Metadata = { title: "Wishlist", robots: { index: false, follow: true } };
export default function Page() { return <Wishlist />; }
