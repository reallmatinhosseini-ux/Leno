import { ContinueBrowsing, Edition, Hero, Looks, Ribbon, ShopGrid, Signature } from "@/components/Home";
import Trust from "@/components/Trust";
import JsonLd from "@/components/JsonLd";
import { itemListLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={itemListLd()} />
      <Hero />
      <Ribbon />
      <ContinueBrowsing />
      <ShopGrid />
      <Looks />
      <Signature />
      <Edition />
      <Trust />
    </>
  );
}
