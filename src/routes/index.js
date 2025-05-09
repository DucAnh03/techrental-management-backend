import express from "express";
import authRouter from './authRoutes.js';
import productRouter from './productRoutes.js';
import categoryRouter from './categoryRoutes.js';
const router = express.Router();

router.use("/auth", authRouter);
router.use("/product", productRouter);
router.use("/category", categoryRouter);

export default router;
