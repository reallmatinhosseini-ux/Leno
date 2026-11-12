/* schema.org builders shared by the pages. */
import { PRODUCTS, Product, SIZES, STYLES, total } from "./data";
import { BRAND, SITE_URL, jpg } from "./site";

export const productUrl = (p: Product) => `${SITE_URL}/products/${p.slug}/`;

export function productLd(p: Product) {
  const st = STYLES[p.style];
  const until = new Date(); until.setFullYear(until.getFullYear() + 1);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": productUrl(p) + "#product",
    name: `${st.name} in ${p.color}`,
    description: st.desc,
    sku: `${st.code}-${p.color.toUpperCase()}`,
    mpn: st.code,
    color: p.color,
    size: SIZES.filter((z) => p.stock[z] > 0).join(", ") || undefined,
    category: st.cat === "sets" ? "Apparel & Accessories > Clothing > Activewear" : "Apparel & Accessories > Clothing > Dresses",
    image: p.images.map(jpg),
    brand: { "@type": "Brand", name: BRAND },
    audience: { "@type": "PeopleAudience", suggestedGender: "female" },
    offers: {
      "@type": "Offer",
      url: productUrl(p),
      priceCurrency: "AED",
      price: st.price,
      priceValidUntil: until.toISOString().slice(0, 10),
      itemCondition: "https://schema.org/NewCondition",
      availability: total(p.stock) ? (total(p.stock) <= 3 ? "https://schema.org/LimitedAvailability" : "https://schema.org/InStock") : "https://schema.org/OutOfStock",
      seller: { "@id": SITE_URL + "/#org" },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "AED" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "AE" },
        deliveryTime: { "@type": "ShippingDeliveryTime", handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "DAY" }, transitTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" } },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy", applicableCountry: "AE", returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14, returnMethod: "https://schema.org/ReturnByMail", returnFees: "https://schema.org/FreeReturn",
      },
    },
  };
}

export function breadcrumbLd(items: [string, string][]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: SITE_URL + path })) };
}

export function itemListLd(list: Product[] = PRODUCTS) {
  return { "@context": "https://schema.org", "@type": "ItemList", itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: productUrl(p), name: `${STYLES[p.style].name} in ${p.color}` })) };
}
