type Props = {
  event: {
    id: string;
    name: string;
    price: number;
    totalSeats: number;
    availableSeats: number;
  };
};

export default function OrganizerEventCard({ event }: Props) {
  return (
    <div className="border rounded-lg p-4 shadow-sm space-y-2">
      <h3 className="font-semibold text-lg">{event.name}</h3>

      <p>Price: Rp {event.price.toLocaleString("id-ID")}</p>
      <p>
        Seats: {event.availableSeats} / {event.totalSeats}
      </p>

      <div className="flex gap-2">
        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded cursor-pointer">
          Edit
        </button>
        <button className="px-3 py-1 text-sm bg-red-600 text-white rounded cursor-pointer">
          Delete
        </button>
      </div>
    </div>
  );
}
