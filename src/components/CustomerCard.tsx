import React from "react";

interface CustomerCardProps {
  workspaceId: string | null;
  customerId: string;
  email?: string;
  selected?: boolean;
  onClick?: () => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ workspaceId, customerId, email, selected, onClick }) => {
  return (
    <div
      className={`card mb-3 cursor-pointer shadow-sm ${selected ? "border border-primary border-2" : "border border-light"} ${selected ? "ring-2 ring-blue-400" : "hover:shadow-lg"} bg-white dark:bg-zinc-900`}
      onClick={onClick}
      style={{ minWidth: 0 }}
    >
      <div className="card-body" style={{ width: 490 }}>
        <h5 className="card-title text-primary fw-bold mb-2 dark:text-blue-300">
          {workspaceId || <span className="text-zinc-400">(No workspaceId)</span>}
        </h5>
        <h6 className="card-subtitle mb-2 text-muted" style={{ fontSize: "0.95rem" }}>
          Customer ID: <span className="break-all">{customerId}</span>
        </h6>
        <h6 className="card-subtitle mb-2 text-muted" style={{ fontSize: "0.95rem" }}>
          Email: {email}
        </h6>
      </div>
    </div>
  );
};

export default CustomerCard;
