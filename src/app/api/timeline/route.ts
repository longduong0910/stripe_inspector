import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

// Helper: get all customers by workspaceId
async function getCustomersByWorkspaceId(workspaceId: string) {
  const all = await stripe.customers.list();
  return all.data.filter((c) => c.metadata?.workspaceId === workspaceId);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");
  const email = searchParams.get("email");

  if (!workspaceId && !email) {
    return NextResponse.json(
      { error: "workspaceId or email required" },
      { status: 400 },
    );
  }

  let customers: Stripe.Customer[] = [];
  if (workspaceId) {
    customers = await getCustomersByWorkspaceId(workspaceId);
  } else if (email) {
    const result = await stripe.customers.list({ email });
    customers = result.data;
  }
  if (!customers.length) {
    return NextResponse.json([]);
  }
  const customerIds = customers.map((c) => c.id);

  // Get all events: invoices, subscriptions, checkout sessions
  type TimelineItem = {
    time: number;
    type: string;
    title: string;
    amount?: number | null;
    status?: string | null;
    rawId: string;
    workspaceId: string | null;
    customerId: string | null;
    invoiceId?: string;
    paymentIntentId?: string;
    chargeId?: string;
    subscriptionId?: string;
    sessionId?: string;
  };
  const events: TimelineItem[] = [];
  for (const customerId of customerIds) {
    // Invoices
    const invs = await stripe.invoices.list({ customer: customerId });
    events.push(
      ...invs.data.map((inv) => ({
        time: inv.created,
        type: inv.status === "paid" ? "invoice_paid" : "invoice_failed",
        title: `Invoice ${inv.status}`,
        amount: inv.amount_paid,
        status: inv.status,
        rawId: inv.id,
        workspaceId: inv.metadata?.workspaceId || null,
        customerId:
          typeof inv.customer === "string"
            ? inv.customer
            : (inv.customer?.id ?? null),
        invoiceId: inv.id,
        // @ts-expect-error Stripe Invoice type missing payment_intent, charge, subscription (present at runtime)
        paymentIntentId: inv.payment_intent || null,
        // @ts-expect-error Stripe Invoice type missing payment_intent, charge, subscription (present at runtime)
        chargeId: inv.charge || null,
        // @ts-expect-error Stripe Invoice type missing payment_intent, charge, subscription (present at runtime)
        subscriptionId: inv.subscription || null,
      })),
    );
    // Subscriptions
    const subs = await stripe.subscriptions.list({ customer: customerId });
    events.push(
      ...subs.data.map((s) => ({
        time: s.start_date,
        type: "subscription_created",
        title: `Subscription created`,
        amount: s.items?.data?.[0]?.price?.unit_amount || null,
        status: s.status,
        rawId: s.id,
        workspaceId: s.metadata?.workspaceId || null,
        customerId:
          typeof s.customer === "string"
            ? s.customer
            : (s.customer?.id ?? null),
        subscriptionId: s.id,
      })),
    );
    // Checkout Sessions
    const sess = await stripe.checkout.sessions.list({ customer: customerId });
    events.push(
      ...sess.data.map((s) => ({
        time: s.created,
        type: "checkout_completed",
        title: `Checkout ${s.status}`,
        amount: s.amount_total,
        status: s.status,
        rawId: s.id,
        workspaceId: s.metadata?.workspaceId || null,
        customerId:
          typeof s.customer === "string"
            ? s.customer
            : (s.customer?.id ?? null),
        sessionId: s.id,
        paymentIntentId:
          typeof s.payment_intent === "string" ? s.payment_intent : undefined,
        subscriptionId:
          typeof s.subscription === "string" ? s.subscription : undefined,
      })),
    );
  }
  // Sort by time desc
  events.sort((a, b) => b.time - a.time);
  return NextResponse.json(events);
}
