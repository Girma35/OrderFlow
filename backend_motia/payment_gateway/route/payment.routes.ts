// src/routes/payment.routes.ts

import { Router } from "express";
import { payOrder } from "../controllers/payment.controller";

const router = Router();

router.get("/", payOrder);
router.get("/pay", payOrder);

export default router;
