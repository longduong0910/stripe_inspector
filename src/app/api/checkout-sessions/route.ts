import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email") || undefined;

  let customers = [];
  if (email) {
    const result = await stripe.customers.list({ email });
    customers = result.data;
  } else {
    const result = await stripe.customers.list();
    customers = result.data;
  }
  const customerIds = customers.map((c) => c.id);

  let sessions = [];
  if (customerIds.length > 0) {
    for (const customerId of customerIds) {
      const sess = await stripe.checkout.sessions.list({
        customer: customerId,
      });
      sessions.push(...sess.data);
    }
  } else {
    const sess = await stripe.checkout.sessions.list();
    sessions = sess.data;
  }

  const mapped = sessions.map((s) => ({
    sessionId: s.id,
    customerId: s.customer,
    workspaceId: s.metadata?.workspaceId || null,
    amount_total: s.amount_total,
    currency: s.currency,
    status: s.status,
    mode: s.mode,
    created: s.created,
    payment_intent_id: s.payment_intent || null,
    subscription_id: s.subscription || null,
    url: s.url,
    metadata: s.metadata,
  }));

  return NextResponse.json(mapped);
}
