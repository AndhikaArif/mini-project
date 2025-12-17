"use client";

import { useEffect, useState } from "react";
import EventCard from "@/components/event-card";
import { getEvents } from "@/services/event.services";
import { EventItem } from "@/types/event";

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getEvents(page);

        const mappedEvents: EventItem[] = res.data.map((event: any) => ({
          id: event.id,
          name: event.name,
          description: event.description,
          imageUrl: event.eventImages?.[0]?.url ?? "/placeholder.jpg",
        }));

        setEvents(mappedEvents);
        setTotalPages(res.totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    fetch();
  }, [page]);

  return (
    <section className="flex flex-col items-center gap-6 pt-20">
      <h1 className="text-3xl font-semibold">All Events</h1>

      <div className="grid gap-20 md:grid-cols-2 max-w-7xl p-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex gap-4 mt-6 pb-30 md:pb-20">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="cursor-pointer hover:scale-110"
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="cursor-pointer hover:scale-110"
        >
          Next
        </button>
      </div>
    </section>
  );
}
