"use client";

import axios from "axios";

type Props = {
  transaction: {
    id: string;
    status: string;
    paymentProof?: string;
    createdAt: string;
    order: {
      quantity: number;
      totalAmount: number;
      event: { name: string };
      customer: { name: string; email: string };
    };
  };
};

export default function TransactionRow({ transaction }: Props) {
  const updateStatus = async (status: "DONE" | "REJECTED") => {
    if (!confirm(`Are you sure to ${status.toLowerCase()} this payment?`))
      return;

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/payments/${transaction.id}/status`,
        { status },
        { withCredentials: true }
      );

      window.location.reload(); // versi aman dulu
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert("Failed to update payment status");
      }
    }
  };

  return (
    <tr>
      <td className="border px-3 py-2">{transaction.order.event.name}</td>

      <td className="border px-3 py-2">
        <p className="font-medium">{transaction.order.customer.name}</p>
        <p className="text-sm text-gray-500">
          {transaction.order.customer.email}
        </p>
      </td>

      <td className="border px-3 py-2 text-center">
        {transaction.order.quantity}
      </td>

      <td className="border px-3 py-2">
        Rp {transaction.order.totalAmount.toLocaleString("id-ID")}
      </td>

      <td className="border px-3 py-2">{transaction.status}</td>

      <td className="border px-3 py-2">
        {new Date(transaction.createdAt).toLocaleDateString("id-ID")}
      </td>

      <td className="border px-3 py-2 space-x-2">
        {/* VIEW PAYMENT PROOF */}
        {transaction.paymentProof && (
          <a
            href={transaction.paymentProof}
            target="_blank"
            className="text-blue-600 underline text-sm"
          >
            View Proof
          </a>
        )}

        {/* ACTIONS */}
        {transaction.status === "WAITING_CONFIRMATION" && (
          <>
            <button
              onClick={() => updateStatus("DONE")}
              className="px-2 py-1 bg-green-600 text-white rounded text-sm"
            >
              Approve
            </button>

            <button
              onClick={() => updateStatus("REJECTED")}
              className="px-2 py-1 bg-red-600 text-white rounded text-sm"
            >
              Reject
            </button>
          </>
        )}
      </td>
    </tr>
  );
}
