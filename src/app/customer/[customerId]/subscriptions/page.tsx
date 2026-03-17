"use client";
import React, { useEffect, useState } from "react";
import SubscriptionCard from "@/components/SubscriptionCard";
type Subscription = {
  subscriptionId: string;
  customerId: string;
  workspaceId: string | null;
  paymentMethod: string | null;
  invoiceId: string | null;
  metadata: Record<string, unknown>;
  amount: number | null;
  status: string;
  currentPeriodStart?: number;
  currentPeriodEnd?: number;
  created: number;
};
export default function SubscriptionsPage({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = React.use(params);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    async function fetchSubscriptions() {
      if (!customerId) return;
      try {
        const url = `/api/subscriptions?customerId=${encodeURIComponent(customerId)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Could not fetch subscriptions");
        const data = await res.json();
        setSubscriptions(Array.isArray(data) ? data : []);
      } catch {
        setSubscriptions([]);
      }
    }
    fetchSubscriptions();
  }, [customerId]);

  return (
    <section className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col items-center justify-start py-10 px-2 sm:px-6">
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-800 rounded-xl shadow-lg p-6 sm:p-10 flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2 tracking-tight">Subscriptions</h1>
        <div className="border-b border-zinc-200 dark:border-zinc-700 mb-4" />
        {subscriptions.length === 0 ? (
          <div className="text-zinc-500 text-center py-12 text-lg">No subscriptions found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subscriptions.map((s) => (
              <SubscriptionCard key={s.subscriptionId} subscription={s} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
