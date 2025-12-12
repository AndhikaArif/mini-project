import {
  type CategoryOption,
  type LocationOption,
} from "../generated/index.js";

export interface IEvent {
  eventOrganizerId: string;
  name: string;
  category: CategoryOption;
  location: LocationOption;
  price: number;
  totalSeats: number;
  availableSeats: number;
  startTime: Date;
  endTime: Date;
}
