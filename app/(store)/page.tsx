import { Collection, ContinueBrowsing, Edition, Edits, Hero, InMotion, Looks, Ribbon, SignUp, Signature } from "@/components/Home";
import Trust from "@/components/Trust";
import JsonLd from "@/components/JsonLd";
import { itemListLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd data={itemListLd()} />
      <Hero />
      <Ribbon />
      <Edits />
      <ContinueBrowsing />
      <Collection />
      <InMotion />
      <Looks />
      <Signature />
      <Edition />
      <SignUp />
      <Trust />
    </>
  );
}
