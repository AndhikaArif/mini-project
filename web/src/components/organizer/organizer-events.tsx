"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import OrganizerEventCard from "./organizer-event-card";
import EditEventModal from "./edit-event-modal";
import AttendeeListModal from "./attendee-list-modal";

type Event = {
  id: string;
  name: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
};

export default function OrganizerEvents({
  refreshKey,
}: {
  refreshKey: number;
}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [attendeeEvent, setAttendeeEvent] = useState<Event | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/organizer/events`,
          { withCredentials: true }
        );
        setEvents(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [refreshKey]);

  async function handleDelete(id: string) {
    const ok = confirm("Are you sure you want to delete this event?");
    if (!ok) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/organizer/events/${id}`,
        { withCredentials: true }
      );

      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Failed to delete event");
    }
  }

  function handleEdit(event: Event) {
    setSelectedEvent(event);
  }

  if (loading) return <p>Loading events...</p>;
  if (!events.length) return <p>No events yet</p>;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">My Events</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.map((event) => (
          <OrganizerEventCard
            key={event.id}
            event={event}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewAttendees={(event) => setAttendeeEvent(event)}
          />
        ))}

        {attendeeEvent && (
          <AttendeeListModal
            event={attendeeEvent}
            onClose={() => setAttendeeEvent(null)}
          />
        )}
      </div>

      {selectedEvent && (
        <EditEventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSuccess={(updated) => {
            setEvents((prev) =>
              prev.map((e) => (e.id === updated.id ? updated : e))
            );
          }}
        />
      )}
    </section>
  );
}
