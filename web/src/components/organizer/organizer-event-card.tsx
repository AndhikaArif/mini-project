type Props = {
  event: {
    id: string;
    name: string;
    price: number;
    totalSeats: number;
    availableSeats: number;
  };
  onEdit: (event: Props["event"]) => void;
  onDelete: (id: string) => void;
  onViewAttendees: (event: Props["event"]) => void;
};

export default function OrganizerEventCard({
  event,
  onEdit,
  onDelete,
  onViewAttendees,
}: Props) {
  return (
    <div className="border rounded-lg p-4 shadow-sm space-y-2">
      <h3 className="font-semibold text-lg">{event.name}</h3>

      <p>Price: Rp {event.price.toLocaleString("id-ID")}</p>
      <p>
        Seats: {event.availableSeats} / {event.totalSeats}
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(event)}
          className="px-3 py-1 text-sm bg-blue-600 rounded cursor-pointer"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(event.id)}
          className="px-3 py-1 text-sm bg-red-600 rounded cursor-pointer"
        >
          Delete
        </button>

        <button
          onClick={() => onViewAttendees(event)}
          className="px-3 py-1 text-sm bg-emerald-600 rounded cursor-pointer"
        >
          Attendees
        </button>
      </div>
    </div>
  );
}
