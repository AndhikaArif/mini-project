import Image from "next/image";
import Link from "next/link";
import { EventTopThree } from "@/types/event";

export default function TopThreeCard({ event }: { event: EventTopThree }) {
  return (
    <Link href={`/events/${event.id}`}>
      <div className="relative w-[375px] h-[150px] mb-4">
        <Image
          src={event.imageUrl}
          alt="Event image"
          fill
          className="object-cover rounded-2xl hover:scale-95 duration-300"
        />
      </div>
    </Link>
  );
}
