import { type StatusPayment } from "../generated/index.js";

export interface ICreatePayment {
  orderId: string;
  voucherId: string;
  pointId: string;
  couponId: string;
  totalPaid: number;
}

export interface IUpdatePayment {
  status: StatusPayment;
  payementProof: string;
  paidAt: Date;
}
