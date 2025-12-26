import type { PaymentStatus } from "@/types/payment";

type Props = {
  status: PaymentStatus;
};

const colors: Record<string, string> = {
  PENDING: "bg-gray-400",
  WAITING_CONFIRMATION: "bg-yellow-500",
  DONE: "bg-green-600",
  REJECTED: "bg-red-600",
  EXPIRED: "bg-orange-500",
  CANCELLED: "bg-slate-500",
};

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`px-2 py-1 rounded text-white text-xs ${
        colors[status] ?? "bg-gray-300"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
