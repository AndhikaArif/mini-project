"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function PaymentDetailPage() {
  const { id } = useParams();
  const [payment, setPayment] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchPayment = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/payment/${id}`, {
        withCredentials: true,
      });
      setPayment(res.data.payment || res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPayment();
  }, [id]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");
    const formData = new FormData();
    formData.append("paymentProof", file);

    try {
      setUploading(true);
      await axios.put(`http://localhost:8000/api/payment/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("Proof uploaded! Waiting for confirmation.");
      fetchPayment(); // Refresh data
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (!payment)
    return <div className="pt-32 text-center">Loading Payment Info...</div>;

  return (
    <div className="max-w-xl mx-auto pt-32 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 border">
        <h1 className="text-2xl font-bold mb-4">Payment Details</h1>

        {/* Status Badge */}
        <div
          className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-6 ${
            payment.status === "DONE"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          Status: {payment.status}
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Total Paid</span>
            <span className="font-bold text-xl text-blue-600">
              Rp {payment.totalPaid.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Upload Section (Hanya muncul jika belum Done/Expired) */}
        {["PENDING", "WAITING_CONFIRMATION"].includes(payment.status) && (
          <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed">
            <p className="text-sm text-gray-600 mb-4 font-semibold">
              Upload Payment Proof (JPG/PNG)
            </p>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mb-4 w-full text-sm"
            />
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-black text-white py-3 rounded-xl font-bold disabled:bg-gray-400"
            >
              {uploading ? "Uploading..." : "Submit Proof"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
