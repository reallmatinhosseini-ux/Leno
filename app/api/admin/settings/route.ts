import { admin, body, ok } from "@/lib/server/http";
import { getSettings, saveSettings, type Settings } from "@/lib/server/shop";
import { gatewayReady } from "@/lib/server/pay";
export const dynamic = "force-dynamic";
const env = () => ({ card: gatewayReady(), provider: process.env.PAYMENT_PROVIDER || "", email: !!process.env.RESEND_API_KEY, adminEmail: process.env.ADMIN_EMAIL || "", blob: !!process.env.BLOB_READ_WRITE_TOKEN, db: !!(process.env.DATABASE_URL || process.env.POSTGRES_URL) });
export const GET = admin(async () => ok({ ...(await getSettings()), env: env() }));
export const PUT = admin(async (req: Request) => ok({ ...(await saveSettings(await body<Settings>(req))), env: env() }));
