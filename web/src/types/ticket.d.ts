export interface Ticket {
  id: string;
  code: string;
  used: boolean;
  createdAt: string;
  order: {
    event: {
      id: string;
      name: string;
      startTime: string;
      location: string;
    };
  };
}
