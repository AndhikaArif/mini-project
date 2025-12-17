import axios from "axios";
import { EventItem, EventDetail } from "@/types/event";

type GetEventsResponse = {
  data: EventItem[];
  totalData: number;
  totalPages: number;
  currentPage: number;
};

export const getEvents = async (page = 1) => {
  const res = await axios.get<GetEventsResponse>(
    "http://localhost:8000/api/events",
    {
      params: { page },
    }
  );

  return res.data;
};

export const getEventById = async (id: string) => {
  const res = await axios.get<EventDetail>(
    `http://localhost:8000/api/events/${id}`
  );

  return res.data;
};
