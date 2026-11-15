import { handle, ok } from "@/lib/server/http";
import { publicCatalog } from "@/lib/server/shop";
export const dynamic = "force-dynamic";
export const GET = handle(async () => ok(await publicCatalog()));
