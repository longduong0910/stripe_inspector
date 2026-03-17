"use client";
import { useEffect, useState } from "react";
type CheckoutSession = {
  sessionId: string;
  customerId: string;
  workspaceId: string | null;
  amount_total: number;
  currency: string;
  status: string;
  mode: string;
  created: number;
  payment_intent_id?: string;
  subscription_id?: string;
  url?: string;
  metadata: Record<string, unknown>;
};
export default function CheckoutSessionsPage({ params }: { params: { customerId: string } }) {
  const [checkoutSessions, setCheckoutSessions] = useState<CheckoutSession[]>([]);
  useEffect(() => {
    async function fetchCheckoutSessions() {
      if (!params.customerId) return;
      try {
        let url = "/api/checkout-sessions";
        if (params.customerId.includes("@")) {
          url += `?email=${encodeURIComponent(params.customerId)}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error("Không lấy được checkout sessions");
        const data = await res.json();
        const filtered = Array.isArray(data)
          ? data.filter((s: CheckoutSession) => s.customerId === params.customerId || !params.customerId.includes("@"))
          : [];
        setCheckoutSessions(filtered.length > 0 ? filtered : data);
      } catch {
        setCheckoutSessions([]);
      }
    }
    fetchCheckoutSessions();
  }, [params.customerId]);
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">One-time Payments (Checkout Sessions)</h1>
      {checkoutSessions.length === 0 ? (
        <div className="text-zinc-500">No checkout sessions found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-zinc-100 dark:bg-zinc-800">
              <tr>
                <th className="px-2 py-1">Session ID</th>
                <th className="px-2 py-1">Status</th>
                <th className="px-2 py-1">Mode</th>
                <th className="px-2 py-1">Amount</th>
                <th className="px-2 py-1">Created</th>
                <th className="px-2 py-1">Customer ID</th>
                <th className="px-2 py-1">Workspace ID</th>
                <th className="px-2 py-1">Payment Intent ID</th>
                <th className="px-2 py-1">Subscription ID</th>
                <th className="px-2 py-1">URL</th>
                <th className="px-2 py-1">Metadata</th>
              </tr>
            </thead>
            <tbody>
              {checkoutSessions.map((s) => (
                <tr key={s.sessionId}>
                  <td className="px-2 py-1 font-mono text-xs">{s.sessionId}</td>
                  <td className="px-2 py-1">{s.status}</td>
                  <td className="px-2 py-1">{s.mode}</td>
                  <td className="px-2 py-1">{(s.amount_total / 100).toLocaleString()}</td>
                  <td className="px-2 py-1">{s.created ? new Date(s.created * 1000).toLocaleString() : ""}</td>
                  <td className="px-2 py-1 font-mono text-xs">{s.customerId}</td>
                  <td className="px-2 py-1">{s.workspaceId}</td>
                  <td className="px-2 py-1 font-mono text-xs">{s.payment_intent_id}</td>
                  <td className="px-2 py-1 font-mono text-xs">{s.subscription_id}</td>
                  <td className="px-2 py-1">
                    {s.url && (
                      <a href={s.url} target="_blank" rel="noopener" className="text-blue-600 underline">View</a>
                    )}
                  </td>
                  <td className="px-2 py-1 text-xs break-all">{JSON.stringify(s.metadata)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
