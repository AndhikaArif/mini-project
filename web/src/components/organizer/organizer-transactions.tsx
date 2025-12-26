"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import TransactionRow from "./transaction-row";
import type { OrganizerPayment, PaymentStatus } from "@/types/payment";

type Props = {
  onPaymentUpdated: () => void;
};

export default function OrganizerTransactions({ onPaymentUpdated }: Props) {
  const [payments, setPayments] = useState<OrganizerPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PaymentStatus | "ALL">(
    "WAITING_CONFIRMATION"
  );

  const filteredPayments =
    filter === "ALL" ? payments : payments.filter((p) => p.status === filter);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/organizer/transactions`,
          { withCredentials: true }
        );
        setPayments(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  function updatePaymentLocal(paymentId: string, status: "DONE" | "REJECTED") {
    setPayments((prev) =>
      prev.map((p) => (p.id === paymentId ? { ...p, status } : p))
    );
  }

  const FILTERS: (PaymentStatus | "ALL")[] = [
    "WAITING_CONFIRMATION",
    "DONE",
    "REJECTED",
    "ALL",
  ];

  if (loading) return <p>Loading transactions...</p>;
  if (!payments.length) return <p>No transactions yet</p>;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Transactions</h2>

      <div className="flex gap-2 mb-4">
        {FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded cursor-pointer ${
              filter === s ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">Event</th>
            <th className="border px-3 py-2 text-left">Customer</th>
            <th className="border px-3 py-2">Qty</th>
            <th className="border px-3 py-2">Total</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Proof</th>
            <th className="border px-3 py-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredPayments.map((payment) => (
            <TransactionRow
              key={payment.id}
              payment={payment}
              onSuccess={updatePaymentLocal}
              onPaymentUpdated={onPaymentUpdated}
            />
          ))}
        </tbody>
      </table>
    </section>
  );
}
