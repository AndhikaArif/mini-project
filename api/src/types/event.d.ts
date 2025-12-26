import {
  type CategoryOption,
  type LocationOption,
} from "../generated/index.js";

export interface IEvent {
  eventOrganizerId: string;
  name: string;
  description: string;
  category: CategoryOption;
  location: LocationOption;
  price: number;
  totalSeats: number;
  startTime: Date;
  endTime: Date;
  eventImage: Express.Multer.File[];
}

export interface IEventSearch {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
  category?: CategoryOption | undefined;
  location?: LocationOption | undefined;
  sortBy?: "newest" | "latest" | "startTime" | undefined;
}
