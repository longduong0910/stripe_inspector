"use client";



import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomerCard from "@/components/CustomerCard";
import { FiSearch, FiUser, FiCreditCard, FiFileText, FiShoppingCart, FiDollarSign, FiClock } from "react-icons/fi";

export default function Home() {
  const [email, setEmail] = useState("");
  const [workspaceId, setWorkspaceId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Array<{customerId: string; email: string; workspaceId: string|null;}>>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
    // Restore email from localStorage and auto-query customers
    useEffect(() => {
      const savedEmail = localStorage.getItem("stripeInspectorEmail");
      if (savedEmail) {
        setEmail(savedEmail);
        // Auto-query customers
        (async () => {
          setLoading(true);
          setError("");
          try {
            const res = await fetch(`/api/customer?email=${encodeURIComponent(savedEmail)}`);
            if (!res.ok) throw new Error("No customer found for this email");
            const data = await res.json();
            if (!Array.isArray(data) || data.length === 0) {
              setError("No customer found for this email");
              setCustomers([]);
            } else {
              setCustomers(data);
            }
          } catch (e: any) {
            setError(e.message || "Unknown error");
            setCustomers([]);
          } finally {
            setLoading(false);
          }
        })();
      }
    }, []);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCustomers([]);
    setSelectedCustomerId("");
    if (!email.trim() && !workspaceId.trim()) {
      setError("Please enter an email or workspaceId");
      return;
    }
    setLoading(true);
    try {
      let url = "";
      if (workspaceId.trim()) {
        url = `/api/customer?workspaceId=${encodeURIComponent(workspaceId.trim())}`;
      } else {
        url = `/api/customer?email=${encodeURIComponent(email.trim())}`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error("No customer found for this query");
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        setError("No customer found for this query");
        setCustomers([]);
      } else {
        setCustomers(data);
      }
      if (email) localStorage.setItem("stripeInspectorEmail", email);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-200 dark:from-black dark:to-zinc-900 font-sans px-2">
      <main className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-8 md:p-10 flex flex-col gap-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-zinc-900 dark:text-zinc-50 tracking-tight mb-2 flex items-center justify-center gap-2">
          <FiSearch className="inline-block text-blue-500 mb-1" size={32} />
          Stripe Inspector
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            type="email"
            placeholder="Enter email..."
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoFocus
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-md transition disabled:opacity-60 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading && <span className="animate-spin"><FiSearch size={20} /></span>}
            {loading ? "Searching..." : "Find customerId"}
          </button>
          {error && <div className="w-full bg-red-100 text-red-700 rounded-lg px-4 py-2 text-center text-sm font-medium border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700">{error}</div>}
        </form>
        <div className="text-zinc-500 dark:text-zinc-400 text-center text-sm">
          Enter an email or workspaceId to look up related Stripe customerIds.
        </div>
        {customers.length > 0 && (
          <div className="flex flex-col gap-6 mt-2">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full">
              <span className="font-semibold text-zinc-700 dark:text-zinc-200 text-base md:text-lg">Select workspaceId:</span>
              <input
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                type="text"
                placeholder="Filter by workspaceId..."
                value={workspaceId}
                onChange={e => setWorkspaceId(e.target.value)}
                disabled={loading}
                style={{maxWidth: 260}}
              />
            </div>
            {workspaceId && customers.filter(c => c.workspaceId && c.workspaceId.includes(workspaceId)).length === 0 && (
              <div className="w-full bg-yellow-100 text-yellow-800 rounded-lg px-4 py-2 text-center text-sm font-medium border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700">No customer matches this workspaceId.</div>
            )}
            <div className="flex flex-col gap-4">
              {customers
                .filter(c => !workspaceId || (c.workspaceId && c.workspaceId.includes(workspaceId)))
                .map((c) => (
                  <div key={c.customerId} className="w-full">
                    <div
                      className={`transition-all duration-200 border-2 ${selectedCustomerId === c.customerId ? "border-blue-500 shadow-lg" : "border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md"} bg-white dark:bg-zinc-900 rounded-2xl p-5 mb-2 cursor-pointer`}
                      onClick={() => setSelectedCustomerId(c.customerId)}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400 break-all">{c.workspaceId || <span className="text-zinc-400">(No workspaceId)</span>}</span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-300 break-all">Customer ID: <span className="font-mono">{c.customerId}</span></span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-300 break-all">Email: {c.email}</span>
                      </div>
                      {selectedCustomerId === c.customerId && (
                        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-4">
                          <button
                            type="button"
                            onClick={e => {e.stopPropagation(); router.push(`/customer/${c.customerId}/info`);}}
                            className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition shadow group shadow-sm"
                          >
                            <FiUser className="mb-1 text-xl group-hover:scale-110 transition" />
                            <span className="text-xs">Customer Info</span>
                          </button>
                          <button
                            type="button"
                            onClick={e => {e.stopPropagation(); router.push(`/customer/${c.customerId}/subscriptions`);}}
                            className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 font-semibold transition shadow group shadow-sm"
                          >
                            <FiCreditCard className="mb-1 text-xl group-hover:scale-110 transition" />
                            <span className="text-xs">Subs</span>
                          </button>
                          <button
                            type="button"
                            onClick={e => {e.stopPropagation(); router.push(`/customer/${c.customerId}/invoices`);}}
                            className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold transition shadow group shadow-sm"
                          >
                            <FiFileText className="mb-1 text-xl group-hover:scale-110 transition" />
                            <span className="text-xs">Invoices</span>
                          </button>
                          <button
                            type="button"
                            onClick={e => {e.stopPropagation(); router.push(`/customer/${c.customerId}/checkout-sessions`);}}
                            className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold transition shadow group shadow-sm"
                          >
                            <FiShoppingCart className="mb-1 text-xl group-hover:scale-110 transition" />
                            <span className="text-xs">Checkout Sessions</span>
                          </button>
                          <button
                            type="button"
                            onClick={e => {e.stopPropagation(); router.push(`/customer/${c.customerId}/charges`);}}
                            className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-semibold transition shadow group shadow-sm"
                          >
                            <FiDollarSign className="mb-1 text-xl group-hover:scale-110 transition" />
                            <span className="text-xs">Charges</span>
                          </button>
                          <button
                            type="button"
                            onClick={e => {e.stopPropagation(); router.push(`/customer/${c.customerId}/timeline`);}}
                            className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold transition shadow group shadow-sm"
                          >
                            <FiClock className="mb-1 text-xl group-hover:scale-110 transition" />
                            <span className="text-xs">Timeline</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
