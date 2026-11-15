import { admin, fail, ok } from "@/lib/server/http";
export const dynamic = "force-dynamic";

/* Product photo upload to Vercel Blob (Storage → Blob). Returns the public URL. */
export const POST = admin(async (req: Request) => {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return fail("Photo storage is not connected. In Vercel open Storage → Create → Blob and connect it to this project.", 503);
  const f = (await req.formData()).get("file");
  if (!(f instanceof File)) return fail("No file");
  if (!/^image\/(jpeg|png|webp|avif)$/.test(f.type)) return fail("Use a JPG, PNG, WebP or AVIF photo");
  if (f.size > 8 * 1024 * 1024) return fail("Photo is over 8 MB");
  const { put } = await import("@vercel/blob");
  const name = "products/" + f.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
  const r = await put(name, f, { access: "public", addRandomSuffix: true, contentType: f.type });
  return ok({ url: r.url });
});
