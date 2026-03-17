"use client";
import React, { useEffect, useState } from "react";
type Customer = {
  customerId: string;
  workspaceId: string | null;
  paymentMethod: string | null;
  created: number;
  email: string;
  cardInfo?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
};

export default function CustomerInfoPage({ params }: { params: Promise<{ customerId: string }> }) {
  const { customerId } = React.use(params);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetchCustomer() {
      setLoading(true);
      setError("");
      try {
        console.log(`Fetching customer info for ID: ${customerId}`);
        const url = `/api/customer?customerId=${encodeURIComponent(customerId)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Customer not found");
        const data = await res.json();
        let found = null;
        if (Array.isArray(data)) {
          found = data[0];
        } else {
          found = data;
        }
        setCustomer(found);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchCustomer();
  }, [customerId]);
  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Customer Info</h1>
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 mb-6">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : customer ? (
          <table className="w-full text-sm mt-2">
            <tbody>
              <tr>
                <td className="font-medium pr-2">Customer ID</td>
                <td>{customer.customerId}</td>
              </tr>
              <tr>
                <td className="font-medium pr-2">Email</td>
                <td>{customer.email}</td>
              </tr>
              <tr>
                <td className="font-medium pr-2">Workspace ID</td>
                <td>{customer.workspaceId}</td>
              </tr>
              <tr>
                <td className="font-medium pr-2">Created</td>
                <td>{customer.created ? new Date(customer.created * 1000).toLocaleString() : ""}</td>
              </tr>
              <tr>
                <td className="font-medium pr-2">Default payment method</td>
                <td>{customer.paymentMethod}</td>
              </tr>
              {customer.cardInfo && (
                <>
                  <tr>
                    <td className="font-medium pr-2">Card Brand</td>
                    <td>{customer.cardInfo.brand}</td>
                  </tr>
                  <tr>
                    <td className="font-medium pr-2">Card Last4</td>
                    <td>{customer.cardInfo.last4}</td>
                  </tr>
                  <tr>
                    <td className="font-medium pr-2">Card Expiry</td>
                    <td>{customer.cardInfo.exp_month}/{customer.cardInfo.exp_year}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        ) : (
          <div>Customer not found.</div>
        )}
      </div>
    </div>
  );
}
