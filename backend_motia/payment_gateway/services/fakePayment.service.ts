// src/services/fakePayment.service.ts

import { FakePaymentResponse } from "../types/payment.types";

export function processFakePayment(
  orderId: string,
  amount: number
): FakePaymentResponse {
  const isSuccess = Math.random() > 0.0; // 70% success rate

  if (isSuccess) {
    return {
      status: "success",
      transaction_id: `FAKE_TXN_${Date.now()}`,
      orderId: orderId,
      amount,
    };
  }

  return {
    status: "failed",
    transaction_id: `FAKE_TXN_${Date.now()}`,
    orderId: orderId,
    amount,
    reason: "Payment declined",
  };
}
