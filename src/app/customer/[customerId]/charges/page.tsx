"use client";
import React, { useEffect, useState } from "react";
import ChargeCard from "@/components/ChargeCard";
type Charge = {
  chargeId: string;
  customerId: string;
  workspaceId: string | null;
  amount: number;
  currency: string;
  status: string;
  paid: boolean;
  refunded: boolean;
  created: number;
  invoiceId?: string;
  payment_intent_id?: string;
  failure_message?: string;
  metadata: Record<string, unknown>;
};
export default function ChargesPage({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = React.use(params);
  const [charges, setCharges] = useState<Charge[]>([]);
  useEffect(() => {
    async function fetchCharges() {
      if (!customerId) return;
      try {
        const url = `/api/charges?customerId=${encodeURIComponent(customerId)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Could not fetch charges");
        const data = await res.json();
        setCharges(Array.isArray(data) ? data : []);
      } catch {
        setCharges([]);
      }
    }
    fetchCharges();
  }, [customerId]);
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Charges</h1>
      {charges.length === 0 ? (
        <div className="text-zinc-500">No charges found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {charges.map((ch) => (
            <ChargeCard key={ch.chargeId} charge={ch} />
          ))}
        </div>
      )}
    </div>
  );
}
