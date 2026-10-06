import { ReportStatus } from "../types";

interface StatusBadgeProps {
  status: ReportStatus | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colors: Record<string, string> = {
    Solved: "bg-green-100 text-green-700 border-green-400",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-400",
    "In Progress": "bg-blue-100 text-blue-700 border-blue-400",
  };

  const badgeClass =
    colors[status] || "bg-gray-100 text-gray-700 border-gray-300";

  return (
    <span
      className={`text-xs font-semibold border px-2.5 py-0.5 rounded-full inline-block ${badgeClass}`}
    >
      {status}
    </span>
  );
}
