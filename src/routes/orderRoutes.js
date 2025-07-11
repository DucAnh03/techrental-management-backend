import express from 'express';
import {
  updateOrderStatusController,
  getProductsFromOrderController,
  getAllOrderedProductsController,
  createPaymentController,
  vnpayReturnController,
  getOrdersByUserIdController,
  getOrdersByRenterIdController,
  getOrderWithRenterDetailsController,
  createOrderController,
  getOrderByIdController,
  checkOrderController,
} from '../controllers/orderController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/completed', async (req, res) => {
  const Order = (await import('../models/Order.js')).default;
  const orders = await Order.find({ status: 'completed' })
    .populate('customerId')
    .populate({
      path: 'products',
      populate: { path: 'productId', model: 'ProductDetail' },
    });
  res.json({ data: orders });
});

router.get('/:orderId', getOrderByIdController);
router.put('/:orderId/status', protect, updateOrderStatusController);
router.post('/', protect, createOrderController);
router.post('/check', protect, checkOrderController);
router.get('/:orderId/products', getProductsFromOrderController);
router.get('/products/all', getAllOrderedProductsController);
router.post('/create-payment-url', protect, createPaymentController);
router.get('/vnpay-return', vnpayReturnController);

router.get('/user/:userId', protect, getOrdersByUserIdController);
router.get('/renter/:renterId', protect, getOrdersByRenterIdController);
router.get(
  '/:orderId/renter-details',
  protect,
  getOrderWithRenterDetailsController
);

export default router;
