/* Admin sign-in: one password (ADMIN_PASSWORD) → signed, http-only cookie for 7 days.
   Uses Web Crypto so the same code runs in middleware and in API routes. */
export const COOKIE = "leno_admin";
const DAYS = 7;

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "leno-test-secret";
}
export function adminPassword() {
  /* TEST password until ADMIN_PASSWORD is set in Vercel. Replace before real launch. */
  return process.env.ADMIN_PASSWORD || "leno2026";
}
const enc = new TextEncoder();
const hex = (b: ArrayBuffer) => Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, "0")).join("");
async function hmac(msg: string) {
  const k = await crypto.subtle.importKey("raw", enc.encode("leno:" + secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", k, enc.encode(msg)));
}
const same = (a: string, b: string) => { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; };

export async function makeSession() { const exp = Date.now() + DAYS * 864e5; return { value: `${exp}.${await hmac(String(exp))}`, maxAge: DAYS * 86400 }; }
export async function validSession(v?: string) {
  if (!v || !secret()) return false; const [exp, sig] = v.split(".");
  if (!exp || !sig || +exp < Date.now()) return false;
  return same(sig, await hmac(exp));
}
export async function checkPassword(p: string) {
  const want = adminPassword(); if (!want) return false;
  return same(await hmac("pw:" + p), await hmac("pw:" + want));
}
