import { type StatusOrder } from "../generated/client.d.ts";

export interface ICreateOrder {
  eventId: string;
  customerId: string;
  voucherId: string;
  pointUsed: number;
  couponId: string;
  quantity: number;
}

export interface IUpdateOrder {
  status: StatusOrder;
}
