import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customerId") || undefined;

  let invoices = [];
  if (customerId) {
    const invs = await stripe.invoices.list({ customer: customerId });
    invoices = invs.data;
  } else {
    const invs = await stripe.invoices.list();
    invoices = invs.data;
  }

  const mapped = invoices.map((inv) => ({
    invoiceId: inv.id,
    customerId: inv.customer,
    workspaceId: inv.lines?.data?.[0]?.metadata?.workspaceId || null,
    amount_due: inv.amount_due,
    amount_paid: inv.amount_paid,
    status: inv.status,
    created: inv.created,
    due_date: inv.due_date,
    paid_at: inv.status === "paid" ? inv.status_transitions?.paid_at : null,
    subscription_id: inv.parent?.subscription_details?.subscription || null,
    hosted_invoice_url: inv.hosted_invoice_url,
    metadata: inv.lines?.data?.[0]?.metadata || {},
  }));

  return NextResponse.json(mapped);
}
