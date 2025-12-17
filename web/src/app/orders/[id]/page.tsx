// "use client";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import axios from "axios";
// import Link from "next/link";

// export default function OrderDetailPage() {
//   const { id } = useParams();
//   const [order, setOrder] = useState<any>(null);

//   useEffect(() => {
//     const fetchOrderDetail = async () => {
//       try {
//         const res = await axios.get(`http://localhost:8000/api/orders/${id}`, {
//           withCredentials: true,
//         });
//         console.log(res.data);
//         setOrder(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchOrderDetail();
//   }, [id]);
//   console.log(id);

//   if (!order) return <p className="pt-32 text-center">Loading Receipt...</p>;

//   return (
//     <div className="max-w-2xl mx-auto pt-32 p-6">
//       <div className="bg-white border rounded-3xl p-8 shadow-sm">
//         <div className="text-center mb-8">
//           <h1 className="text-2xl font-bold">Success Create Order</h1>
//           <p className="text-gray-500">Order ID: #{order.id}</p>
//         </div>

//         <div className="space-y-4 border-t border-b py-6 mb-6">
//           {/* <div className="flex justify-between">
//             <span className="text-gray-600">Event</span>
//             <span className="font-semibold">{order.event.name}</span>
//           </div> */}
//           <div className="flex justify-between">
//             <span className="text-gray-600">Quantity</span>
//             <span>{order.quantity} Tickets</span>
//           </div>

//           <div className="flex justify-between">
//             <span className="text-gray-600">Price</span>
//             <span>Rp{order.totalAmount}</span>
//           </div>

//           <div className="flex justify-between text-xl font-bold">
//             <span>Total Paid</span>
//             <span className="text-blue-600">
//               Rp {order.totalAmount.toLocaleString("id-ID")}
//             </span>
//           </div>
//         </div>

//         <Link
//           href={`/payment/${id}`}
//           className="flex justify-center items-center w-full py-3 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition"
//         >
//           Pay
//         </Link>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Tambah useRouter
import axios from "axios";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter(); // Inisialisasi router
  const [order, setOrder] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/orders/${id}`, {
          withCredentials: true,
        });
        // Sesuaikan dengan struktur data backend (biasanya res.data.order atau res.data)
        setOrder(res.data.order || res.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchOrderDetail();
  }, [id]);

  // Fungsi untuk Create Payment
  const handleCreatePayment = async () => {
    try {
      setIsProcessing(true);

      // Kirim request create payment ke backend
      const res = await axios.post(
        `http://localhost:8000/api/payment/create`,
        { orderId: id },
        { withCredentials: true }
      );

      const paymentData = res.data.payment || res.data;

      alert("Proceeding to payment...");

      // Redirect ke halaman detail payment menggunakan ID payment yang baru dibuat
      router.push(`/payment/${paymentData.id}`);
    } catch (error: any) {
      console.error("Payment error:", error);
      alert(error.response?.data?.message || "Failed to initiate payment");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!order) return <p className="pt-32 text-center">Loading Receipt...</p>;

  return (
    <div className="max-w-2xl mx-auto pt-32 p-6">
      <div className="bg-white border rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Order Summary</h1>
          <p className="text-gray-500">Order ID: #{order.id}</p>
        </div>

        <div className="space-y-4 border-t border-b py-6 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Quantity</span>
            <span>{order.quantity} Tickets</span>
          </div>
          <div className="flex justify-between text-xl font-bold">
            <span>Total Amount</span>
            <span className="text-blue-600">
              Rp {order.totalAmount?.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Gunakan button daripada Link */}
        <button
          onClick={handleCreatePayment}
          disabled={isProcessing}
          className={`w-full py-3 rounded-xl font-semibold transition flex justify-center items-center ${
            isProcessing
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}
