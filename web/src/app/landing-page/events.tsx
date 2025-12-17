"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EventCard from "@/components/event-card";
import { getEvents } from "@/services/event.services";
import { EventItem } from "@/types/event";

export default function EventsPreviewSection() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getEvents(1);

        const mappedEvents: EventItem[] = res.data.map((event: any) => ({
          id: event.id,
          name: event.name,
          description: event.description,
          imageUrl: event.eventImages?.[0]?.url ?? "/placeholder.jpg",
        }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (loading) return <p className="mt-20 self-center">Loading events...</p>;

  console.log(events);

  return (
    <section className="flex flex-col items-center gap-y-6 pt-20">
      <h2 className="self-start ml-6 md:ml-50 text-2xl">This Week’s Events</h2>
      <div className="grid gap-20 md:grid-cols-2 max-w-7xl p-6">
        {events.slice(0, 8).map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <Link
        href="/events"
        className="border-b border-dashed hover:text-blue-400"
      >
        See all events
      </Link>
    </section>
  );
}
