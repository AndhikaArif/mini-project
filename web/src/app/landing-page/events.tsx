import Image from "next/image";
import Link from "next/link";

export default function EventsSection() {
  return (
    <section className="flex flex-col justify-center items-center pt-20 gap-y-6">
      <h2 className="self-start ml-6 md:ml-50 text-2xl tracking-wide">
        This Week's Events
      </h2>

      <div className="flex flex-col justify-baseline items-start bg-white shadow-md border-2 border-gray-100 rounded-2xl w-[450px] h-[300px] hover:shadow-xl duration-300 cursor-pointer">
        <div className="relative w-[450px] h-[180px] mb-4">
          <Image
            src="/dummy-banner.jpg"
            alt="Dummy Banner"
            fill
            className="object-cover rounded-t-2xl"
          />
        </div>
        <div className="flex flex-col justify-center items-start px-2">
          <h3>Event's Title</h3>
          <h4>Event's description</h4>
        </div>
      </div>

      <div className="flex flex-col justify-baseline items-start bg-white shadow-md border-2 border-gray-100 rounded-2xl w-[450px] h-[300px] hover:shadow-xl duration-300 cursor-pointer">
        <div className="relative w-[450px] h-[180px] mb-4">
          <Image
            src="/dummy-banner.jpg"
            alt="Dummy Banner"
            fill
            className="object-cover rounded-t-2xl"
          />
        </div>
        <div className="flex flex-col justify-center items-start px-2">
          <h3>Event's Title</h3>
          <h4>Event's description</h4>
        </div>
      </div>

      <div className="flex flex-col justify-baseline items-start bg-white shadow-md border-2 border-gray-100 rounded-2xl w-[450px] h-[300px] hover:shadow-xl duration-300 cursor-pointer">
        <div className="relative w-[450px] h-[180px] mb-4">
          <Image
            src="/dummy-banner.jpg"
            alt="Dummy Banner"
            fill
            className="object-cover rounded-t-2xl"
          />
        </div>
        <div className="flex flex-col justify-center items-start px-2">
          <h3>Event's Title</h3>
          <h4>Event's description</h4>
        </div>
      </div>

      <Link
        href="/events"
        className="self-center text-md hover:text-blue-400 border-b border-dashed"
      >
        See all events
      </Link>
    </section>
  );
}
