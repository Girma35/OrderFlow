// src/types/payment.types.ts

export type PaymentStatus = "success" | "failed";

export interface FakePaymentResponse {
  status: PaymentStatus;
  transaction_id: string;
  order_id: number;
  amount: number;
  reason?: string;
}
