"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type Props = {
  event: {
    id: string;
    name: string;
  };
  onClose: () => void;
};

type Attendee = {
  name: string;
  email: string;
  quantity: number;
  totalPaid: number;
};

export default function AttendeeListModal({ event, onClose }: Props) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [summary, setSummary] = useState<{
    totalAttendees: number;
    totalTicketsSold: number;
    totalRevenue: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttendees() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/organizer/events/${event.id}/attendees`,
          { withCredentials: true }
        );

        setAttendees(res.data.attendees);
        setSummary(res.data.summary);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          alert("Failed to load attendees");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAttendees();
  }, [event.id]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-3xl space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Attendees – {event.name}</h2>
          <button onClick={onClose} className="text-sm cursor-pointer">
            ✕
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {summary && (
          <div className="flex gap-6 text-sm">
            <p>Orders: {summary.totalAttendees}</p>
            <p>Tickets Sold: {summary.totalTicketsSold}</p>
            <p>Revenue: Rp {summary.totalRevenue.toLocaleString("id-ID")}</p>
          </div>
        )}

        {!loading && !attendees.length && (
          <p className="text-sm text-gray-500">No attendees yet</p>
        )}

        {!!attendees.length && (
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">Name</th>
                <th className="border px-3 py-2">Tickets</th>
                <th className="border px-3 py-2">Total Paid</th>
              </tr>
            </thead>
            <tbody>
              {attendees.map((a, i) => (
                <tr key={i}>
                  <td className="border px-3 py-2">
                    <div className="font-medium">{a.name}</div>
                    <div className="text-xs text-gray-500">{a.email}</div>
                  </td>
                  <td className="border px-3 py-2 text-center">{a.quantity}</td>
                  <td className="border px-3 py-2 text-right">
                    Rp {a.totalPaid.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
