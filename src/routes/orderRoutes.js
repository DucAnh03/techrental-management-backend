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

const router = express.Router();

router.get('/completed', async (req, res) => {
  const Order = (await import('../models/Order.js')).default;
  const orders = await Order.find({ status: 'completed' })
    .populate('customerId')
    .populate({
      path: 'products',
      populate: { path: 'productId', model: 'ProductDetail' }
    });
  res.json({ data: orders });
});

router.get('/:orderId', getOrderByIdController);
router.post('/', createOrderController);
router.post('/check', checkOrderController);
router.get('/:orderId/products', getProductsFromOrderController);
router.get('/products/all', getAllOrderedProductsController);
router.post('/create-payment-url', createPaymentController);
router.get('/vnpay-return', vnpayReturnController);

router.get('/user/:userId', getOrdersByUserIdController);
router.get('/renter/:renterId', getOrdersByRenterIdController);
router.get('/:orderId/renter-details', getOrderWithRenterDetailsController);

export default router;
