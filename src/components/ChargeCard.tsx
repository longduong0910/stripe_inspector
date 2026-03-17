"use client";
import React from "react";

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

interface ChargeCardProps {
  charge: Charge;
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

const ChargeCard: React.FC<ChargeCardProps> = ({ charge }) => {
  return (
    <div className={cardStyle}>
      <div className="mb-4">
        <span className="text-primary font-bold text-lg dark:text-blue-300">
          {charge.workspaceId || <span className="text-zinc-400">(No workspaceId)</span>}
        </span>
      </div>
      <table className="w-full text-sm mt-2">
        <tbody>
          <tr>
            <td className={labelStyle}>Charge ID</td>
            <td className={valueStyle}>{charge.chargeId}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Amount</td>
            <td className={valueStyle}>{(charge.amount / 100).toLocaleString()} {charge.currency}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Status</td>
            <td className={valueStyle}>{charge.status}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Paid</td>
            <td className={valueStyle}>{charge.paid ? "true" : "false"}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Refunded</td>
            <td className={valueStyle}>{charge.refunded ? "true" : "false"}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Created</td>
            <td className={valueStyle}>{charge.created ? new Date(charge.created * 1000).toLocaleString() : "-"}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Customer ID</td>
            <td className={valueStyle}>{charge.customerId || "-"}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Workspace ID</td>
            <td className={valueStyle}>{charge.workspaceId || "-"}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Payment Intent ID</td>
            <td className={valueStyle}>{charge.payment_intent_id || "-"}</td>
          </tr>
          <tr>
            <td className={labelStyle}>Failure Message</td>
            <td className={valueStyle}>{charge.failure_message || "-"}</td>
          </tr>
        </tbody>
      </table>
      <MetadataCard metadata={charge.metadata} />
    </div>
  );
};

export default ChargeCard;
