import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import type { OrganizerPayment } from "@/types/payment";
import StatusBadge from "./status-badge";

type Props = {
  payment: OrganizerPayment;
  onSuccess: (id: string, status: "DONE" | "REJECTED") => void;
  onPaymentUpdated: () => void;
};

export default function TransactionRow({
  payment,
  onSuccess,
  onPaymentUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);
  const canAction = payment.status === "WAITING_CONFIRMATION";
  const [showReject, setShowReject] = useState(false);

  async function updateStatus(status: "DONE" | "REJECTED") {
    if (status === "REJECTED") {
      const ok = confirm("Reject this payment?");
      if (!ok) return;
    }

    setLoading(true);

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/organizer/payments/${payment.id}`,
        { status },
        { withCredentials: true }
      );

      onSuccess(payment.id, status);
      onPaymentUpdated();

      toast.success(
        status === "DONE" ? "Payment approved" : "Payment rejected"
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Failed to update payment");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <tr
      className={
        payment.status === "WAITING_CONFIRMATION" ? "bg-yellow-50" : ""
      }
    >
      <td>{payment.order.event.name}</td>

      <td>
        <p>{payment.order.customer.name}</p>
        <p className="text-sm text-gray-500">{payment.order.customer.email}</p>
      </td>

      <td className="text-center">{payment.order.quantity}</td>

      <td>Rp {payment.order.totalAmount.toLocaleString("id-ID")}</td>

      <td>
        <StatusBadge status={payment.status} />
      </td>

      <td>
        {payment.paymentProof ? (
          <a
            href={payment.paymentProof}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View
          </a>
        ) : (
          "-"
        )}
      </td>

      <td className="space-x-2">
        {canAction ? (
          <>
            <button
              disabled={!canAction || loading}
              onClick={() => updateStatus("DONE")}
              className="px-2 py-1 bg-green-600 text-white disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Processing..." : "Approve"}
            </button>

            <button
              disabled={!canAction || loading}
              onClick={() => setShowReject(true)}
              className="px-2 py-1 bg-red-600 text-white disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Processing..." : "Reject"}
            </button>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-400 italic">No action</span>
          </>
        )}

        {showReject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded w-80 space-y-3">
              <h3 className="font-semibold">Reject payment?</h3>
              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-2">
                <button
                  className=" cursor-pointer"
                  onClick={() => setShowReject(false)}
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  onClick={() => updateStatus("REJECTED")}
                  className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                >
                  {loading ? "Processing..." : "Reject"}
                </button>
              </div>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
}
