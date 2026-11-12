import Link from "next/link";
import { asset } from "@/lib/site";
export const metadata = { title: "Page not found", robots: { index: false } };
export default function NotFound() {
  return <section className="g"><div className="w empty" style={{ minHeight: "70svh", alignContent: "center" }}><img src={asset("/p/kiss-tag.png")} alt="" style={{ width: 80 }} /><span className="H">Page not found</span><p className="mute">This page has moved or no longer exists.</p><Link className="btn" href="/">Back to home</Link></div></section>;
}
