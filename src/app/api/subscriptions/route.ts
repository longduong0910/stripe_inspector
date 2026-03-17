import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customerId") || undefined;

  let subscriptions = [];
  const listParams: any = { status: "all" };
  if (customerId) {
    listParams.customer = customerId;
  }
  const subs = await stripe.subscriptions.list(listParams);
  subscriptions = subs.data;

  // Map workspaceId và các trường cần thiết
  const mapped = subscriptions.map((s) => ({
    subscriptionId: s.id,
    customerId: s.customer,
    workspaceId: s.metadata?.workspaceId || null,
    paymentMethod: s.default_payment_method || null,
    invoiceId: s.latest_invoice || null,
    metadata: s.metadata,
    amount: s.items?.data?.[0]?.price?.unit_amount || null,
    status: s.status,
    currentPeriodStart: s.items?.data?.[0]?.current_period_start,
    currentPeriodEnd: s.items?.data?.[0]?.current_period_end,
    created: s.created,
    hasTrial: !!s.trial_end && s.trial_end > s.created,
    trialDays:
      s.trial_end && s.trial_start
        ? Math.ceil((s.trial_end - s.trial_start - 60) / 86400)
        : 0,
    trialStart: s.trial_start || null,
    trialEnd: s.trial_end || null,
    billingStart:
      s.trial_end && s.trial_end > s.created ? s.trial_end : s.created,
  }));

  return NextResponse.json(mapped);
}
