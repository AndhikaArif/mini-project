"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import TransactionRow from "./transaction-row";

type Transaction = {
  id: string;
  quantity: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  event: {
    name: string;
  };
  customer: {
    name: string;
    email: string;
  };
};

export default function OrganizerTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/organizer/transactions`,
          { withCredentials: true }
        );
        setTransactions(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  if (loading) return <p>Loading transactions...</p>;
  if (!transactions.length) return <p>No transactions yet</p>;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Transactions</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Event</th>
              <th className="border px-3 py-2 text-left">Customer</th>
              <th className="border px-3 py-2">Qty</th>
              <th className="border px-3 py-2">Total</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((trx) => (
              <TransactionRow key={trx.id} transaction={trx} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
