"use client";

import axios from "axios";
import { Formik, Form, Field } from "formik";

type Event = {
  id: string;
  name: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
};

type Props = {
  event: Event;
  onClose: () => void;
  onSuccess: (updated: Event) => void;
};

export default function EditEventModal({ event, onClose, onSuccess }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Edit Event</h2>

        <Formik
          initialValues={{
            name: event.name,
            price: event.price,
            totalSeats: event.totalSeats,
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/organizer/events/${event.id}`,
                values,
                { withCredentials: true }
              );

              onSuccess(res.data);
              onClose();
            } catch (error) {
              if (axios.isAxiosError(error)) {
                alert("Failed to update event");
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-3">
              <Field name="name" className="w-full border p-2" />
              <Field name="price" type="number" className="w-full border p-2" />
              <Field
                name="totalSeats"
                type="number"
                className="w-full border p-2"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1 border rounded cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer"
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
