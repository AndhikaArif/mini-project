export type EventItem = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

export type EventDetail = EventItem & {
  price: number;
  startTime: string;
  endTime: string;
  eventImages: { url: string }[];
};

export type EventTopThree = {
  id: string;
  imageUrl: string;
};
