"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import TopThreeCard from "@/components/top-three-events";
import { getEvents } from "@/services/event.services";
import { EventTopThree } from "@/types/event";

export default function EventsPreviewSection() {
  const [events, setEvents] = useState<EventTopThree[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getEvents(1);

        const mappedEvents: EventTopThree[] = res.data.map((event: any) => ({
          id: event.id,
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
    <section className="flex flex-col justify-center items-center px-6 md:px-50 bg-gray-100 w-full h-[650px] md:h-[300px] mt-20">
      <h2 className="self-start text-2xl mb-6">Top 3 Events</h2>
      <div className="flex flex-col md:flex-row gap-3">
        {events.slice(0, 3).map((event) => (
          <TopThreeCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
