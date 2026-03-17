"use client";
import React from "react";

interface SubscriptionCardProps {
  subscription: {
    subscriptionId: string;
    workspaceId: string | null;
    customerId: string;
    status: string;
    amount: number | null;
    currentPeriodStart?: number;
    currentPeriodEnd?: number;
    invoiceId: string | null;
    paymentMethod: string | null;
    metadata: Record<string, unknown>;
    hasTrial?: boolean;
    trialDays?: number;
    trialStart?: number | null;
    trialEnd?: number | null;
    billingStart?: number | null;
  };
}

const cardStyle = "bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 flex flex-col gap-4 border border-zinc-100 dark:border-zinc-800";
const labelStyle = "font-semibold text-zinc-700 dark:text-zinc-200 pr-2 text-xs sm:text-sm whitespace-nowrap";
const valueStyle = "text-zinc-900 dark:text-zinc-100 text-xs sm:text-sm break-all";

const MetadataCard: React.FC<{ metadata: Record<string, unknown> }> = ({ metadata }) => {
  return (
    <div className="mt-4">
      <div className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700">
        <h6 className="font-bold text-zinc-700 dark:text-zinc-200 mb-2 text-sm">Metadata</h6>
        {Object.keys(metadata).length === 0 ? (
          <div className={valueStyle}>No metadata</div>
        ) : (
          <table className="w-full text-xs sm:text-sm mt-2">
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

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription }) => {
  return (
    <div className={cardStyle}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-blue-600 dark:text-blue-300 font-bold text-base sm:text-lg">
          {subscription.workspaceId || <span className="text-zinc-400">(No workspaceId)</span>}
        </span>
        <span
          className={
            `ml-auto px-2 py-0.5 rounded text-xs font-semibold
            ${subscription.status === "canceled" ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-700"
              : subscription.status === "trialing" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-700"
              : subscription.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 border border-green-700"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700"}
            `}
        >
          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm mt-1">
          <tbody>
            <tr>
              <td className={labelStyle}>Subscription ID</td>
              <td className={valueStyle}>{subscription.subscriptionId}</td>
            </tr>
            <tr>
              <td className={labelStyle}>Amount</td>
              <td className={valueStyle}>{subscription.amount ? (subscription.amount / 100).toLocaleString() : "-"}</td>
            </tr>
            <tr>
              <td className={labelStyle}>Start</td>
              <td className={valueStyle}>{subscription.currentPeriodStart ? new Date(subscription.currentPeriodStart * 1000).toLocaleString() : "-"}</td>
            </tr>
            <tr>
              <td className={labelStyle}>End</td>
              <td className={valueStyle}>{subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd * 1000).toLocaleString() : "-"}</td>
            </tr>
            <tr>
              <td className={labelStyle}>Customer ID</td>
              <td className={valueStyle}>{subscription.customerId}</td>
            </tr>
            <tr>
              <td className={labelStyle}>Invoice ID</td>
              <td className={valueStyle}>{subscription.invoiceId}</td>
            </tr>
            <tr>
              <td className={labelStyle}>Payment method</td>
              <td className={valueStyle}>{subscription.paymentMethod}</td>
            </tr>
            {/* Trial info */}
            <tr>
              <td className={labelStyle}>Has Trial</td>
              <td className={valueStyle}>{subscription.hasTrial ? "Yes" : "No"}</td>
            </tr>
            {subscription.hasTrial && (
              <>
                <tr>
                  <td className={labelStyle}>Trial Days</td>
                  <td className={valueStyle}>{subscription.trialDays}</td>
                </tr>
                <tr>
                  <td className={labelStyle}>Trial Start</td>
                  <td className={valueStyle}>{subscription.trialStart ? new Date(subscription.trialStart * 1000).toLocaleString() : "-"}</td>
                </tr>
                <tr>
                  <td className={labelStyle}>Trial End</td>
                  <td className={valueStyle}>{subscription.trialEnd ? new Date(subscription.trialEnd * 1000).toLocaleString() : "-"}</td>
                </tr>
                <tr>
                  <td className={labelStyle}>Billing Start</td>
                  <td className={valueStyle}>{subscription.billingStart ? new Date(subscription.billingStart * 1000).toLocaleString() : "-"}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
      <MetadataCard metadata={subscription.metadata} />
    </div>
  );
};

export default SubscriptionCard;
