/* Database access. Production uses Postgres from DATABASE_URL (Vercel → Storage → Neon
   sets it automatically). Local development without DATABASE_URL uses an embedded
   Postgres (PGlite) saved in .data/, so the whole store runs offline. */
import "server-only";
import { PRODUCTS } from "@/lib/data";

type Row = Record<string, unknown>;
export type Q = <T = Row>(text: string, params?: unknown[]) => Promise<T[]>;
type Db = { q: Q; tx: <R>(fn: (q: Q) => Promise<R>) => Promise<R> };

const URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
/* Test mode: no DATABASE_URL yet, so data lives in a temporary embedded database
   (on Vercel it resets when the server restarts or redeploys). */
export const testMode = () => !URL;

const SCHEMA = `
create table if not exists settings (key text primary key, value jsonb not null);
create table if not exists products (
  id text primary key, stock jsonb not null, badge text not null default '', hidden boolean not null default false,
  images jsonb, updated_at timestamptz not null default now());
create table if not exists orders (
  id serial primary key, no text unique not null, token text not null, created_at timestamptz not null default now(),
  status text not null default 'new', pay_status text not null default 'pending', pay_method text not null, pay_ref text,
  email text not null, phone text not null default '', name text not null, address jsonb not null, items jsonb not null,
  subtotal int not null, discount int not null default 0, discount_label text not null default '', delivery int not null default 0,
  total int not null, gift boolean not null default false, note text not null default '', speed text not null default 'next',
  stock_back boolean not null default false, admin_note text not null default '');
create index if not exists orders_created on orders (created_at desc);
create table if not exists waitlist (id serial primary key, created_at timestamptz not null default now(), email text not null, product text not null, size text not null, notified boolean not null default false);
create table if not exists subscribers (email text primary key, created_at timestamptz not null default now(), source text not null default 'welcome');
`;

let ready: Promise<Db> | null = null;

async function open(): Promise<Db> {
  if (URL) {
    const { default: postgres } = await import("postgres");
    const sql = postgres(URL, { max: 3, idle_timeout: 20, prepare: false, onnotice: () => {} });
    const wrap = (s: typeof sql): Q => async (text, params = []) => (await s.unsafe(text, params as never[])) as never;
    return { q: wrap(sql), tx: (fn) => sql.begin((t) => fn(wrap(t as unknown as typeof sql))) as never };
  }
  const { PGlite } = await import("@electric-sql/pglite");
  const g = globalThis as unknown as { __pg?: InstanceType<typeof PGlite> };
  const pg = g.__pg || (g.__pg = new PGlite(process.env.VERCEL ? "/tmp/leno-pg" : process.cwd() + "/.data/pg"));
  const wrap = (p: { query: (t: string, v?: unknown[]) => Promise<{ rows: unknown[] }> }): Q => async (text, params = []) => (await p.query(text, params)).rows as never;
  return { q: wrap(pg), tx: (fn) => pg.transaction((t) => fn(wrap(t as never))) as never };
}

async function init(): Promise<Db> {
  const db = await open();
  for (const stmt of SCHEMA.split(";").map((s) => s.trim()).filter(Boolean)) await db.q(stmt);
  /* first run: load the 7 colourways with the stock from the purchase sheet */
  for (const p of PRODUCTS) await db.q("insert into products (id, stock) values ($1, $2) on conflict (id) do nothing", [p.id, JSON.stringify(p.stock)]);
  return db;
}

export function db(): Promise<Db> {
  if (!ready) ready = init().catch((e) => { ready = null; throw e; });
  return ready;
}
export const q: Q = async (text, params) => (await db()).q(text, params);
