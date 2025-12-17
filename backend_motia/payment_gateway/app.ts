// src/payment_gateway/app.ts

import express from "express";
import paymentRoutes from "./route/payment.routes";

const app = express();

app.use(express.json());
app.use("/api/payment", paymentRoutes);

export default app;
