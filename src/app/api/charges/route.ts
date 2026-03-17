import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customerId") || undefined;

  let charges = [];
  if (customerId) {
    const chs = await stripe.charges.list({ customer: customerId });
    charges = chs.data;
  } else {
    const chs = await stripe.charges.list();
    charges = chs.data;
  }

  const mapped = charges.map((ch) => ({
    chargeId: ch.id,
    customerId: ch.customer,
    workspaceId: ch.metadata?.workspaceId || null,
    amount: ch.amount,
    currency: ch.currency,
    status: ch.status,
    paid: ch.paid,
    refunded: ch.refunded,
    created: ch.created,
    payment_intent_id: ch.payment_intent || null,
    failure_message: ch.failure_message || null,
    metadata: ch.metadata,
  }));

  return NextResponse.json(mapped);
}
