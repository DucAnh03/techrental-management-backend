import express from 'express';
import authRouter from './authRoutes.js';
import productRouter from './productRoutes.js';
import productReviewRoutes from './productReviewRoutes.js';
import shopDetail from './shopDetailRoutes.js';
import cloudinaryRouter from './cloudinaryRouter.js';
import userRouter from './userRoutes.js';
import chatRouter from './chatRoutes.js';
import UnitProductRoutes from './unitProductRoutes.js';
import orderRoutes from './orderRoutes.js';

import categoryRouter from './categoryRoutes.js';
import orderEvidenceRoutes from './orderEvidenceRoutes.js';
const router = express.Router();

router.use('/auth', authRouter);
router.use('/product', productRouter);
router.use('/category', categoryRouter);
router.use('/productReview', productReviewRoutes);
router.use('/shopDetail', shopDetail);
router.use('/cloudinary', cloudinaryRouter);
router.use('/users', userRouter);
router.use('/chatrooms', chatRouter);
router.use('/order-products', UnitProductRoutes);
router.use('/order-evidence', orderEvidenceRoutes);
router.use('/orders', orderRoutes);
export default router;
