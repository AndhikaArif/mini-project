export type PaymentStatus =
  | "PENDING"
  | "WAITING_CONFIRMATION"
  | "DONE"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELLED";

export type OrganizerPayment = {
  id: string;
  status: PaymentStatus;
  createdAt: string;
  paymentProof?: string;

  order: {
    quantity: number;
    totalAmount: number;
    event: { name: string };
    customer: { name: string; email: string };
  };
};
