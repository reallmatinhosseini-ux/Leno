# LENO WEAR — store

Next.js 15 (App Router, React 19, TypeScript) static store for LENO WEAR court-wear.

- Real URLs per product and category (`/products/pleat-dress-white/`, `/shop/dresses/`)
- Per-page titles, descriptions, canonical URLs, Open Graph and Twitter cards
- schema.org structured data: Organization, WebSite, Product + Offer (price, stock, shipping, returns), BreadcrumbList, ItemList, FAQPage
- `sitemap.xml` (with product images), `robots.txt`, web app manifest
- Self-hosted fonts via `next/font`, GSAP + Lenis motion, reduced-motion support
- Admin panel at `/admin/` (demo: data stays in the browser)

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site in out/
npm run build:pages  # same, with the /Leno base path for GitHub Pages
```

Set `NEXT_PUBLIC_SITE_URL` to the final domain before launch so canonical URLs and the sitemap point to it.
