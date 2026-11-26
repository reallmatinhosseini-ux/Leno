import { Collection, ContinueBrowsing, Edition, Edits, Hero, InMotion, Looks, Signature } from "@/components/Home";
import Trust from "@/components/Trust";
import JsonLd from "@/components/JsonLd";
import { itemListLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={itemListLd()} />
      <Hero />
      <Collection kicker="Just landed" title={<>New <em>releases</em></>} />
      <Edits />
      <ContinueBrowsing />
      <InMotion />
      <Looks />
      <Signature />
      <Edition />
      <Trust />
    </>
  );
}
