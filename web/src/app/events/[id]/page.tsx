"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getEventById } from "@/services/event.services";
import { EventDetail } from "@/types/event";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default function EventDetailPage({ params }: Props) {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const id = (await params).id;
        const data = await getEventById(id);
        console.log(data);
        setEvent(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (loading) return <p className="mt-20">Loading event...</p>;
  if (!event) return <p>Event not found</p>;

  return (
    <section className="flex flex-col justify-center items-center max-w-5xl mx-auto pt-10">
      {/* Image */}
      <div className="relative self-center w-[450px] h-[180px] md:w-[900px] md:h-[360px] mb-6">
        <Image
          src={event.eventImages[0]?.url ?? "/fallback.jpg"}
          alt={event.name}
          fill
          className="object-cover rounded-xl"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center items-start w-[450px] md:w-[900px] mb-10">
        <h1 className="text-3xl font-bold mb-4">{event.name}</h1>

        <p className="font-semibold mb-2">
          Price: Rp {event.price.toLocaleString("id-ID")}
        </p>

        <p className="text-lg mb-2">{event.description}</p>

        <p className="text-sm text-gray-500">
          Start: {new Date(event.startTime).toLocaleDateString()}
        </p>
      </div>

      {/* Kirim ID melalui query parameter '?eventId=...' */}
      <Link href={`/orders/create?eventId=${event.id}`}>
        <div className="bg-blue-400 w-[450px] md:w-[900px] h-10 rounded-2xl flex justify-center items-center mb-20 hover:bg-blue-500 transition-colors">
          <h2 className="font-semibold text-white tracking-wide">Buy Event</h2>
        </div>
      </Link>

      {/* <Link href="/orders/create">
        <div className="bg-blue-400 w-[450px] md:w-[900px] h-10 rounded-2xl flex justify-center items-center mb-20">
          <h2 className="font-semibold text-white tracking-wide">Buy Event</h2>
        </div>
      </Link> */}
    </section>
  );
}
