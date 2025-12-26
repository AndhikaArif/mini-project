"use client";

import { useEffect, useState } from "react";
import EventCard from "@/components/event-card";
import { getEvents } from "@/services/event.services";
import { EventItem } from "@/types/event";
import { useSearchParams } from "next/navigation";
import { parseEnum } from "@/utils/query-parser";
import { CATEGORY_OPTIONS, LOCATION_OPTIONS } from "@/services/event.services";
import EventFilter from "@/components/event-filter";
import EventSort from "@/components/event-sort";

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? undefined;
  const category = parseEnum(searchParams.get("category"), CATEGORY_OPTIONS);
  const location = parseEnum(searchParams.get("location"), LOCATION_OPTIONS);
  const sortBy = parseEnum(searchParams.get("sortBy"), [
    "newest",
    "latest",
    "startTime",
  ] as const);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getEvents({
          page,
          search,
          category,
          location,
          sortBy,
        });

        const mappedEvents: EventItem[] = res.data.map((event: any) => ({
          id: event.id,
          name: event.name,
          description: event.description,
          imageUrl: event.eventImages?.[0]?.url ?? "/placeholder.jpg",
        }));

        setEvents(mappedEvents);
        setTotalPages(res.meta.totalPages);
      } catch (error) {
        console.error(error);
      }
    };

    fetch();
  }, [page, search, category, location, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [search, category, location, sortBy]);

  return (
    <section className="flex flex-col items-center gap-6 pt-20">
      <div className="flex justify-between items-center w-[450px] md:w-[970px]">
        <h1 className="text-3xl font-semibold">All Events</h1>
        <div className="flex justify-between items-center gap-x-2">
          <EventFilter />
          <EventSort />
        </div>
      </div>

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
