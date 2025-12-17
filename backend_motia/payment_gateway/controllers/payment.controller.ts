// src/controllers/payment.controller.ts

import type { Request, Response } from "express";
import { processFakePayment } from "../services/fakePayment.service";

export async function payOrder(req: Request, res: Response): Promise<void> {
  const orderIdStr = req.query.orderId as string || "101";
  const amountStr = req.query.amount as string || "750";

  const orderId = parseInt(orderIdStr);
  const amount = parseFloat(amountStr);

  const paymentResult = processFakePayment(orderId, amount);

  if (paymentResult.status === "success") {
    // Example:
    // await Order.update({ status: "PAID" }, { where: { id: orderId } });
  }

  res.status(200).json(paymentResult);
}
