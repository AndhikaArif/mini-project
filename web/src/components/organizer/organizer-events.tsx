"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import OrganizerEventCard from "./organizer-event-card";

type Event = {
  id: string;
  name: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
};

export default function OrganizerEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/organizer/events`,
          { withCredentials: true }
        );
        setEvents(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (!events.length) return <p>No events yet</p>;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">My Events</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.map((event) => (
          <OrganizerEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
