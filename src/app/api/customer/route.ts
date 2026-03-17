import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email") || undefined;
  const customerId = searchParams.get("customerId") || undefined;

  let customers = [];
  let paymentMethodDetails = null;
  if (customerId) {
    // Query customer directly by ID
    const customer = await stripe.customers.retrieve(customerId);
    customers = customer ? [customer] : [];
    // Fetch payment method details if available
    const pmId = customer?.invoice_settings?.default_payment_method;
    if (pmId) {
      try {
        const pm = await stripe.paymentMethods.retrieve(pmId);
        if (pm && pm.type === "card" && pm.card) {
          paymentMethodDetails = {
            brand: pm.card.brand,
            last4: pm.card.last4,
            exp_month: pm.card.exp_month,
            exp_year: pm.card.exp_year,
          };
        }
      } catch {}
    }
  } else if (email) {
    const result = await stripe.customers.list({ email });
    customers = result.data;
  } else {
    const result = await stripe.customers.list();
    customers = result.data;
  }

  // Map workspaceId từ metadata nếu có
  const mapped = customers.map((c) => ({
    customerId: c.id,
    email: c.email,
    workspaceId: c.metadata?.workspaceId || null,
    paymentMethod: c.invoice_settings?.default_payment_method || null,
    created: c.created,
    cardInfo: paymentMethodDetails || null,
  }));

  return NextResponse.json(mapped);
}
