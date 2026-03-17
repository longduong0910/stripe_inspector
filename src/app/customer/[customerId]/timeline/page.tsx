"use client";
import { useEffect, useState } from "react";
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
export default function TimelinePage({ params }: { params: { customerId: string } }) {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineError, setTimelineError] = useState("");
  useEffect(() => {
    async function fetchTimeline() {
      if (!params.customerId) return;
      setTimelineLoading(true);
      setTimelineError("");
      try {
        let url = "/api/timeline";
        if (params.customerId.includes("@")) {
          url += `?email=${encodeURIComponent(params.customerId)}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error("Không lấy được timeline");
        const data = await res.json();
        const filtered = Array.isArray(data)
          ? data.filter((t: TimelineItem) => t.customerId === params.customerId || !params.customerId.includes("@"))
          : [];
        setTimeline(filtered.length > 0 ? filtered : data);
      } catch (e: unknown) {
        setTimelineError(e instanceof Error ? e.message : "Lỗi không xác định");
        setTimeline([]);
      } finally {
        setTimelineLoading(false);
      }
    }
    fetchTimeline();
  }, [params.customerId]);
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Timeline</h1>
      {timelineLoading ? (
        <div>Loading timeline...</div>
      ) : timelineError ? (
        <div className="text-red-500">{timelineError}</div>
      ) : timeline.length === 0 ? (
        <div className="text-zinc-500">No events found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-zinc-100 dark:bg-zinc-800">
              <tr>
                <th className="px-2 py-1">Time</th>
                <th className="px-2 py-1">Type</th>
                <th className="px-2 py-1">Title</th>
                <th className="px-2 py-1">Amount</th>
                <th className="px-2 py-1">Status</th>
                <th className="px-2 py-1">ID</th>
                <th className="px-2 py-1">Workspace ID</th>
                <th className="px-2 py-1">Customer ID</th>
                <th className="px-2 py-1">Invoice ID</th>
                <th className="px-2 py-1">PaymentIntent ID</th>
                <th className="px-2 py-1">Charge ID</th>
                <th className="px-2 py-1">Subscription ID</th>
                <th className="px-2 py-1">Session ID</th>
              </tr>
            </thead>
            <tbody>
              {timeline.map((ev) => (
                <tr key={ev.rawId + ev.type + ev.time}>
                  <td className="px-2 py-1">{ev.time ? new Date(ev.time * 1000).toLocaleString() : ""}</td>
                  <td className="px-2 py-1">{ev.type}</td>
                  <td className="px-2 py-1">{ev.title}</td>
                  <td className="px-2 py-1">{ev.amount != null ? (ev.amount / 100).toLocaleString() : ""}</td>
                  <td className="px-2 py-1">{ev.status}</td>
                  <td className="px-2 py-1 font-mono text-xs">
                    <a href="#" onClick={() => navigator.clipboard.writeText(ev.rawId)} title="Copy ID" className="hover:underline">{ev.rawId}</a>
                  </td>
                  <td className="px-2 py-1">{ev.workspaceId}</td>
                  <td className="px-2 py-1 font-mono text-xs">{ev.customerId}</td>
                  <td className="px-2 py-1 font-mono text-xs">{ev.invoiceId}</td>
                  <td className="px-2 py-1 font-mono text-xs">{ev.paymentIntentId}</td>
                  <td className="px-2 py-1 font-mono text-xs">{ev.chargeId}</td>
                  <td className="px-2 py-1 font-mono text-xs">{ev.subscriptionId}</td>
                  <td className="px-2 py-1 font-mono text-xs">{ev.sessionId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
