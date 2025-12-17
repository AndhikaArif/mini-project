"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CreateOrderPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        console.error("Event ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8000/api/events/${eventId}`
        );

        console.log("Response API Lengkap:", res);
        console.log("Data Event:", res.data.data);

        const eventData = res.data.data || res.data;

        if (eventData) {
          setEvent(eventData);
        } else {
          console.warn("API Berhasil tapi data kosong");
        }
      } catch (err) {
        console.error("Gagal Fetch Event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const totalAmount = event ? event.price * quantity : 0;

  const handlePayment = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/orders/create",
        {
          eventId: eventId, // Pastikan diconvert ke Number
          quantity: quantity,
          totalAmount: totalAmount,
        },
        {
          withCredentials: true,
        }
      );

      // 1. Ambil ID dari struktur data response backend Anda
      const newOrderId = res.data.order.id;

      alert("Order Created Successfully!");

      // 2. Arahkan ke halaman detail order
      // Pastikan route ini sesuai dengan folder struktur Anda (misal: /orders/[id])
      router.push(`/orders/${newOrderId}`);
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert("Sesi berakhir, silakan login kembali");
      } else {
        alert(error.response?.data?.message || "Payment failed");
      }
    }
  };

  if (loading)
    return (
      <div className="pt-32 text-center text-xl">Loading Order Details...</div>
    );
  if (!event)
    return (
      <div className="pt-32 text-center text-xl text-red-500">
        Event Not Found
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto pt-32 p-6">
      <h1 className="text-3xl font-bold mb-8 border-b pb-4">
        Checkout Confirmation
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white shadow-xl rounded-3xl p-8 border">
        {/* Sisi Kiri: Detail Event */}
        <div className="space-y-4">
          <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md">
            <Image
              src={event.eventImages?.[0]?.url || "/placeholder.jpg"}
              alt={event.name}
              fill
              className="object-cover"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{event.name}</h2>
          <p className="text-gray-500 line-clamp-3">{event.description}</p>
        </div>

        {/* Sisi Kanan: Rincian Pembayaran */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Price per Ticket</span>
              <span className="font-semibold text-lg">
                Rp {event.price.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Quantity</span>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border rounded-lg px-4 py-2 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-400"
              >
                {[1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num} Ticket{num > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-xl font-bold">Total Amount</span>
              <span className="text-2xl font-extrabold text-blue-600">
                Rp {totalAmount.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}
