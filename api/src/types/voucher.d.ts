export interface IVoucher {
  eventId: string;
  code: string;
  value: number;
  validFrom: Date;
  validUntil: Date;
}
