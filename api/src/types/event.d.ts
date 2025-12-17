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
  availableSeats: number;
  startTime: Date;
  endTime: Date;
  eventImage: Express.Multer.File[];
}

export interface IEventSearch {
  page?: number;
  limit?: number;
  search?: string;
  category?: CategoryOption;
  location?: LocationOption;
  sortBy?: "newest" | "latest";
}
