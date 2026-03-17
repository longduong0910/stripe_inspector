"use client";
import React, { useEffect, useState } from "react";
import InvoiceCard from "@/components/InvoiceCard";
type Invoice = {
  invoiceId: string;
  customerId: string;
  workspaceId: string | null;
  amount_due: number;
  amount_paid: number;
  status: string;
  created: number;
  due_date?: number;
  paid_at?: number;
  subscription_id?: string;
  hosted_invoice_url?: string;
  metadata: Record<string, unknown>;
};
export default function InvoicesPage({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = React.use(params);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  useEffect(() => {
    async function fetchInvoices() {
      if (!customerId) return;
      try {
        const url = `/api/invoices?customerId=${encodeURIComponent(customerId)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Could not fetch invoices");
        const data = await res.json();
        setInvoices(Array.isArray(data) ? data : []);
      } catch {
        setInvoices([]);
      }
    }
    fetchInvoices();
  }, [customerId]);
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Invoices</h1>
      {invoices.length === 0 ? (
        <div className="text-zinc-500">No invoices found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {invoices.map((inv) => (
            <InvoiceCard key={inv.invoiceId} invoice={inv} />
          ))}
        </div>
      )}
    </div>
  );
}
