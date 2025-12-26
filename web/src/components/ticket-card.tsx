import type { Ticket } from "@/types/ticket";

export function TicketCard({ ticket }: { ticket: Ticket }) {
  const event = ticket.order.event;

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <h2 className="text-lg font-semibold">{event.name}</h2>

      <p className="text-sm text-gray-600">📍 {event.location}</p>

      <p className="text-sm text-gray-600">
        📅 {new Date(event.startTime).toLocaleDateString()}
      </p>

      <div className="mt-3 flex justify-between items-center">
        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
          {ticket.code}
        </span>

        <span
          className={`text-xs px-2 py-1 rounded ${
            ticket.used
              ? "bg-gray-300 text-gray-600"
              : "bg-green-100 text-green-700"
          }`}
        >
          {ticket.used ? "Used" : "Active"}
        </span>
      </div>
    </div>
  );
}
