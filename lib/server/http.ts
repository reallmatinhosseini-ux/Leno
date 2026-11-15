import "server-only";
import { NextResponse } from "next/server";
import { ShopError } from "./shop";

export const ok = (data: unknown, init?: ResponseInit) => NextResponse.json(data, { ...init, headers: { "Cache-Control": "no-store", ...(init?.headers || {}) } });
export const fail = (msg: string, status = 400) => ok({ error: msg }, { status });
/* Wrap a handler: shop errors go back to the customer as a readable message, anything else is logged. */
export const handle = <A extends unknown[]>(fn: (...a: A) => Promise<Response>) => async (...a: A) => {
  try { return await fn(...a); }
  catch (e) {
    if (e instanceof ShopError) return fail(e.message, e.status);
    console.error(e);
    const msg = e instanceof Error && /DATABASE_URL/.test(e.message) ? e.message : "Something went wrong on our side. Please try again in a moment.";
    return fail(msg, 500);
  }
};
export const body = async <T,>(req: Request): Promise<Partial<T>> => { try { return (await req.json()) as Partial<T>; } catch { return {}; } };
export const origin = (req: Request) => { const h = req.headers; const host = h.get("x-forwarded-host") || h.get("host"); const proto = h.get("x-forwarded-proto") || "https"; return host ? `${proto}://${host}` : new URL(req.url).origin; };

/* Admin routes: middleware already checks the cookie; this checks again inside the route. */
import { cookies } from "next/headers";
import { COOKIE, validSession } from "./auth";
export const admin = <A extends unknown[]>(fn: (...a: A) => Promise<Response>) => handle(async (...a: A) => {
  if (!(await validSession((await cookies()).get(COOKIE)?.value))) return fail("Please sign in again", 401);
  return fn(...a);
});
