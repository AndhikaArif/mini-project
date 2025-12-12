import { type StatusPayment } from "../generated/index.js";

export interface IUpdatePayment {
  status: StatusPayment;
  payementProof: string;
  paidAt: Date;
}
