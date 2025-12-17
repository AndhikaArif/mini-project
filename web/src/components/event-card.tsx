import Image from "next/image";
import Link from "next/link";
import { EventItem } from "@/types/event";

export default function EventCard({ event }: { event: EventItem }) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="flex flex-col bg-white shadow-md border-2 border-gray-100 rounded-2xl w-[450px] h-[300px] hover:shadow-xl duration-300"
    >
      <div className="relative w-[450px] h-[180px] mb-4">
        <Image
          src={event.imageUrl}
          alt={event.name}
          fill
          className="object-cover rounded-t-2xl"
        />
      </div>

      <div className="px-3">
        <h3 className="font-semibold text-lg">{event.name}</h3>
        <h4 className="font-light text-sm">{event.description}</h4>
      </div>
    </Link>
  );
}
