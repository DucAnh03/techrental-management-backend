import express from "express";
import authRouter from './authRoutes.js';
import productRouter from './productRoutes.js';
import productReviewRoutes from './productReviewRoutes.js';
import shopDetail from './shopDetailRoutes.js';
import cloudinaryRouter from './cloudinaryRouter.js';

import categoryRouter from './categoryRoutes.js';
import { ensureVerifiedUser, protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.use("/auth", authRouter);
router.use("/product", productRouter);
router.use("/category", categoryRouter);
router.use("/productReview", productReviewRoutes);
router.use("/shopDetail", shopDetail);
router.use("/cloudinary", cloudinaryRouter);


export default router;
