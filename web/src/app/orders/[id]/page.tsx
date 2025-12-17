"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/orders/${id}`, {
          withCredentials: true,
        });
        setOrder(res.data.order);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrderDetail();
  }, [id]);
  console.log(id);

  if (!order) return <p className="pt-32 text-center">Loading Receipt...</p>;

  return (
    <div className="max-w-2xl mx-auto pt-32 p-6">
      <div className="bg-white border rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-green-600">
            Payment Successful!
          </h1>
          <p className="text-gray-500">Order ID: #{order.id}</p>
        </div>

        <div className="space-y-4 border-t border-b py-6 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Event</span>
            <span className="font-semibold">{order.event.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Quantity</span>
            <span>{order.quantity} Tickets</span>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span>Total Paid</span>
            <span className="text-blue-600">
              Rp {order.totalAmount.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="w-full py-3 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Download Receipt (Print)
        </button>
      </div>
    </div>
  );
}
