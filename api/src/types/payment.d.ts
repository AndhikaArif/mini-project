import { type StatusPayment } from "../generated/index.js";

export interface ICreatePayment {
  orderId: string;
  voucherId?: string;
  pointId?: string;
  couponId?: string;
  totalPaid: number;
}

export interface IUpdatePaymentProof {
  id: string;
  paymentProof: Express.Multer.File;
  customerId: string;
}

export interface IUpdatePaymentStatus {
  id: string;
  status: StatusPayment;
  eoId: string;
}
