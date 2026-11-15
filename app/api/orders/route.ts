import { body, handle, ok, origin } from "@/lib/server/http";
import { createOrder, validate, type OrderIn } from "@/lib/server/shop";
import { gateway } from "@/lib/server/pay";
import { sendOrderMails } from "@/lib/server/mail";
export const dynamic = "force-dynamic";

/* Place an order. Cash on delivery is confirmed at once; card goes to the gateway. */
export const POST = handle(async (req: Request) => {
  const input = validate(await body<OrderIn>(req));
  const o = await createOrder(input);
  if (o.pay_method === "cod") { await sendOrderMails(o); return ok({ no: o.no, token: o.token, next: `/order/?no=${o.no}&t=${o.token}` }); }
  const url = await gateway()!.start(o, origin(req));
  return ok({ no: o.no, token: o.token, next: url });
});
