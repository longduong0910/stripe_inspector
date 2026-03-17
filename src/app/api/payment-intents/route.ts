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

  let paymentIntents = [];
  if (customerIds.length > 0) {
    for (const customerId of customerIds) {
      const pis = await stripe.paymentIntents.list({ customer: customerId });
      paymentIntents.push(...pis.data);
    }
  } else {
    const pis = await stripe.paymentIntents.list();
    paymentIntents = pis.data;
  }

  const mapped = paymentIntents.map((pi) => ({
    payment_intent_id: pi.id,
    customerId: pi.customer,
    workspaceId: pi.metadata?.workspaceId || null,
    amount: pi.amount,
    currency: pi.currency,
    status: pi.status,
    created: pi.created,
    chargeId: pi.latest_charge || null,
    last_payment_error: pi.last_payment_error || null,
    metadata: pi.metadata,
  }));

  return NextResponse.json(mapped);
}
