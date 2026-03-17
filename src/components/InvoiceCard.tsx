"use client";
import React from "react";

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

interface InvoiceCardProps {
  invoice: Invoice;
}

const cardStyle = "bg-white dark:bg-zinc-900 rounded-lg shadow p-6 mb-6";
const labelStyle = "font-medium pr-2 text-sm";
const valueStyle = "text-sm";

const MetadataCard: React.FC<{ metadata: Record<string, unknown> }> = ({ metadata }) => {
  return (
    <div className="mt-3">
      <div className="card card-body bg-zinc-100 dark:bg-zinc-700 border-0">
        <h6 className="fw-bold mb-2">Metadata</h6>
        {Object.keys(metadata).length === 0 ? (
          <div className={valueStyle}>No metadata</div>
        ) : (
          <table className="w-full text-sm mt-2">
            <tbody>
              {Object.entries(metadata).map(([key, value]) => (
                <tr key={key}>
                  <td className={labelStyle}>{key}</td>
                  <td className={valueStyle}>{typeof value === "object" ? JSON.stringify(value) : String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice }) => {
  return (
    <div className={cardStyle}>
      <div className="mb-4">
        <span className="text-primary font-bold text-lg dark:text-blue-300">
          {invoice.workspaceId || <span className="text-zinc-400">(No workspaceId)</span>}
        </span>
      </div>
      <table className="w-full text-sm mt-2">
        <tbody>
          <tr>
            <td className={labelStyle}>Invoice ID</td>
            <td className={valueStyle}>{invoice.invoiceId}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Status</td>
            <td className={valueStyle}>{invoice.status}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Amount Due</td>
            <td className={valueStyle}>{(invoice.amount_due / 100).toLocaleString()}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Amount Paid</td>
            <td className={valueStyle}>{(invoice.amount_paid / 100).toLocaleString()}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Created</td>
            <td className={valueStyle}>{invoice.created ? new Date(invoice.created * 1000).toLocaleString() : "-"}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Due Date</td>
            <td className={valueStyle}>{invoice.due_date ? new Date(invoice.due_date * 1000).toLocaleString() : "-"}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Paid At</td>
            <td className={valueStyle}>{invoice.paid_at ? new Date(invoice.paid_at * 1000).toLocaleString() : "-"}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Customer ID</td>
            <td className={valueStyle}>{invoice.customerId}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Workspace ID</td>
            <td className={valueStyle}>{invoice.workspaceId}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Subscription ID</td>
            <td className={valueStyle}>{invoice.subscription_id}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Link</td>
            <td className={valueStyle}>
              {invoice.hosted_invoice_url ? (
                <a href={invoice.hosted_invoice_url} target="_blank" rel="noopener" className="text-blue-600 underline">View Invoice</a>
              ) : (
                "-"
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <MetadataCard metadata={invoice.metadata} />
    </div>
  );
};

export default InvoiceCard;
