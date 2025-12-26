import axios from "axios";
import { EventItem, EventDetail } from "@/types/event";

type GetEventsResponse = {
  data: EventItem[];
  meta: {
    page: number;
    limit: number;
    totalData: number;
    totalPages: number;
  };
};

export const CATEGORY_OPTIONS = [
  "ENTERTAINMENT",
  "SPORTS_AND_COMPETITION",
  "EDUCATION_AND_WORKSHOP",
  "BUSSINESS_AND_NETWORKING",
  "ART_AND_CULTURE",
] as const;

export type CategoryOption = (typeof CATEGORY_OPTIONS)[number];

export const LOCATION_OPTIONS = [
  "JAKARTA",
  "SURABAYA",
  "BANDUNG",
  "MEDAN",
  "SEMARANG",
  "YOGYAKARTA",
  "MAKASSAR",
  "BALI",
  "PALEMBANG",
  "BALIKPAPAN",
] as const;

export type LocationOption = (typeof LOCATION_OPTIONS)[number];

type IEventSearch = {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  category?: CategoryOption | undefined;
  location?: LocationOption | undefined;
  sortBy?: "newest" | "latest" | "startTime" | undefined;
};

export const getEvents = async ({
  page = 1,
  search,
  category,
  location,
  sortBy,
}: IEventSearch) => {
  const res = await axios.get<GetEventsResponse>(
    "http://localhost:8000/api/events",
    {
      params: {
        page,
        search,
        category,
        location,
        sortBy,
      },
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
