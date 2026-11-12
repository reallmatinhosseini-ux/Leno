/* LENO WEAR catalogue: the 7 colourways from the purchase sheet (2681401.xlsx). */

export const SIZES = ["S", "M", "L", "XL"] as const;
export type Size = (typeof SIZES)[number];
export type StyleKey = "pleat" | "knot" | "tulle" | "set";
export type Category = "dresses" | "sets";

export interface Style {
  key: StyleKey;
  code: string;
  name: string;
  verb: string;
  price: number;
  cat: Category;
  desc: string;
  points: string[];
}

export interface Product {
  id: string;
  slug: string;
  style: StyleKey;
  color: string;
  hex: string;
  edit: "navy" | "light";
  stock: Record<Size, number>;
  images: string[];
  hero?: string;
}

export const STYLES: Record<StyleKey, Style> = {
  pleat: {
    key: "pleat", code: "YY9141", name: "The Pleat Dress", verb: "swings", price: 365, cat: "dresses",
    desc: "Square neckline, wide straps and a bodice that dips into a V at the waist. Knife pleats swing with every step, and the back is cut wide open.",
    points: ["Open back held by a band", "Knife-pleated flared skirt", "V-shaped front waist"],
  },
  knot: {
    key: "knot", code: "YY8793", name: "The Knot Dress", verb: "ties", price: 345, cat: "dresses",
    desc: "A sleeveless crew-neck dress with a wrap skirt that ties at the hip and opens as you move. Inner shorts underneath, and a low scoop back.",
    points: ["Self-tie wrap skirt", "Inner shorts", "Low scoop back"],
  },
  tulle: {
    key: "tulle", code: "YY9091", name: "The Tulle Dress", verb: "floats", price: 395, cat: "dresses",
    desc: "A racer-back bodice with a square neckline over a layered tulle skirt with a piped hem. Inner shorts underneath.",
    points: ["Layered tulle skirt", "Racer back", "Inner shorts"],
  },
  set: {
    key: "set", code: "YY8047", name: "The Studio Set", verb: "zips", price: 595, cat: "sets",
    desc: "A cropped zip jacket with a stand collar and thumbholes over a square-neck bra, with high-waisted shorts and leggings. Final set contents to be confirmed.",
    points: ["Cropped zip jacket, thumbholes", "Square-neck bra", "High-waisted shorts and leggings"],
  },
};

export const PRODUCTS: Product[] = [
  { id: "pleat-white", slug: "pleat-dress-white", style: "pleat", color: "White", hex: "#F4F3EF", edit: "light", stock: { S: 2, M: 3, L: 1, XL: 0 }, images: ["pleat-white-3", "pleat-white-2", "pleat-white-1", "pleat-white-4"], hero: "h-pleat-white" },
  { id: "knot-navy", slug: "knot-dress-navy", style: "knot", color: "Navy", hex: "#1F2642", edit: "navy", stock: { S: 3, M: 3, L: 2, XL: 1 }, images: ["knot-navy-2", "knot-navy-4", "knot-navy-3", "knot-navy-1"], hero: "h-knot-navy" },
  { id: "set-navy", slug: "studio-set-navy", style: "set", color: "Navy", hex: "#1F2642", edit: "navy", stock: { S: 1, M: 3, L: 2, XL: 1 }, images: ["set-navy-3", "set-navy-4", "set-navy-1", "set-navy-2", "set-navy-5"], hero: "h-set-navy" },
  { id: "pleat-blue", slug: "pleat-dress-blue", style: "pleat", color: "Blue", hex: "#1F3279", edit: "navy", stock: { S: 2, M: 3, L: 2, XL: 1 }, images: ["pleat-blue-2", "pleat-blue-3", "pleat-blue-crop", "pleat-blue-1"], hero: "h-pleat-blue" },
  { id: "knot-sand", slug: "knot-dress-sand", style: "knot", color: "Sand", hex: "#D9D3C5", edit: "light", stock: { S: 2, M: 3, L: 2, XL: 0 }, images: ["knot-sand-1", "knot-sand-3", "knot-sand-2", "knot-sand-4"] },
  { id: "set-white", slug: "studio-set-white", style: "set", color: "White", hex: "#F2F1EC", edit: "light", stock: { S: 1, M: 2, L: 2, XL: 1 }, images: ["set-white-3", "set-white-4", "set-white-1", "set-white-2"], hero: "h-set-white" },
  { id: "tulle-ivory", slug: "tulle-dress-ivory", style: "tulle", color: "Ivory", hex: "#EEEADB", edit: "light", stock: { S: 0, M: 1, L: 0, XL: 0 }, images: ["tulle-ivory-1", "tulle-ivory-2", "tulle-ivory-lips", "tulle-ivory-3"], hero: "h-tulle-ivory" },
];

export const CATEGORIES = [
  { slug: "dresses", name: "Dresses", title: "Court dresses", desc: "Pleat, Knot and Tulle court dresses with inner shorts, made for padel, tennis and everything after.", filter: (p: Product) => STYLES[p.style].cat === "dresses" },
  { slug: "sets", name: "Sets", title: "Studio sets", desc: "The Studio Set: cropped zip jacket, square-neck bra, shorts and leggings in Navy and White.", filter: (p: Product) => STYLES[p.style].cat === "sets" },
  { slug: "navy-edit", name: "The Navy Edit", title: "The Navy Edit", desc: "Navy and blue court-wear: the Knot Dress, the Pleat Dress in Blue and the Navy Studio Set.", filter: (p: Product) => p.edit === "navy" },
  { slug: "light-edit", name: "The Light Edit", title: "The Light Edit", desc: "White, ivory and sand court-wear: the Pleat Dress, the Tulle Dress, the Knot Dress in Sand and the White Studio Set.", filter: (p: Product) => p.edit === "light" },
] as const;

export const FREE_DELIVERY = 600;
export const byId = (id: string) => PRODUCTS.find((p) => p.id === id);
export const bySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const siblings = (p: Product) => PRODUCTS.filter((q) => q.style === p.style);
export const total = (stock: Record<Size, number>) => SIZES.reduce((a, z) => a + (stock[z] || 0), 0);
export const partnerOf = (p: Product) => byId(STYLES[p.style].cat === "sets" ? (p.edit === "navy" ? "knot-navy" : "pleat-white") : (p.edit === "navy" ? "set-navy" : "set-white"))!;
export const LOOKS = [
  { id: "navy", name: "The Navy Look", img: "set-navy-2", items: ["knot-navy", "set-navy"] },
  { id: "light", name: "The Light Look", img: "set-white-1", items: ["pleat-white", "set-white"] },
];
