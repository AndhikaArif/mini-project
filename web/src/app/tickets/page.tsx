"use client";

import { useEffect, useState } from "react";
import { getMyTickets } from "@/services/ticket.service";
import { TicketCard } from "@/components/ticket-card";
import { type Ticket } from "@/types/ticket";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const data = await getMyTickets();
        setTickets(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!tickets.length)
    return (
      <p className="text-center mt-10 text-gray-500">
        You don't have any tickets yet
      </p>
    );

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">My Tickets</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </main>
  );
}
