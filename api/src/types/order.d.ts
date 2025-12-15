import { type StatusOrder } from "../generated/client.d.ts";

export interface ICreateOrder {
  eventId: string;
  customerId: string;
  quantity: number;
}

export interface IUpdateOrder {
  status: StatusOrder;
}
