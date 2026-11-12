import { Categories, ContinueBrowsing, Edition, Hero, LastPieces, Looks, ShopGrid, Signature } from "@/components/Home";
import Trust from "@/components/Trust";
import JsonLd from "@/components/JsonLd";
import { itemListLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={itemListLd()} />
      <Hero />
      <ContinueBrowsing />
      <Categories />
      <ShopGrid />
      <Looks />
      <Signature />
      <LastPieces />
      <Edition />
      <Trust />
    </>
  );
}
