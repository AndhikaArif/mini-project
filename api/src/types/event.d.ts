export interface IEvent {
  eventOrganizerId: string;
  venueId: string;
  categoryId: string;
  name: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  startTime: Date;
  endTime: Date;
}
