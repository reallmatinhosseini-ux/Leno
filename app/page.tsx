import { ContinueBrowsing, Edition, Hero, Looks, Mark, Moments, Ribbon, ShopGrid, Signature } from "@/components/Home";
import Trust from "@/components/Trust";
import JsonLd from "@/components/JsonLd";
import { itemListLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={itemListLd()} />
      <Hero />
      <Ribbon />
      <Mark />
      <ContinueBrowsing />
      <ShopGrid />
      <Moments />
      <Looks />
      <Signature />
      <Edition />
      <Trust />
    </>
  );
}
