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
import isAdmin from '../middlewares/isAdmin.js';
const router = express.Router();

router.get('/completed', protect, isAdmin, async (req, res) => {
  const Order = (await import('../models/Order.js')).default;
  const orders = await Order.find({ status: 'completed' })
    .populate('customerId')
    .populate({
      path: 'products',
      populate: { path: 'productId', model: 'ProductDetail' },
    });
  res.json({ data: orders });
});

// Test endpoint to check if an order exists
router.get('/test/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const Order = (await import('../models/Order.js')).default;
    const order = await Order.findById(orderId);

    if (order) {
      res.json({
        success: true,
        message: 'Order found',
        orderId: order._id,
        status: order.status
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Order not found',
        orderId
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Test endpoint to update order status without authentication (for testing)
router.put('/test/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    console.log('Test endpoint: Updating order status:', { orderId, status });

    const Order = (await import('../models/Order.js')).default;
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (order) {
      res.json({
        success: true,
        message: 'Order status updated',
        orderId: order._id,
        status: order.status
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Order not found',
        orderId
      });
    }
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/user/:userId', protect, getOrdersByUserIdController);
router.get('/renter/:renterId', protect, getOrdersByRenterIdController);
router.get('/products/all', protect, isAdmin, getAllOrderedProductsController);
router.post('/create-payment-url', protect, createPaymentController);
router.get('/vnpay-return', vnpayReturnController);
router.post('/check', protect, checkOrderController);

router.get('/:orderId', getOrderByIdController);
router.put('/:orderId/status', protect, (req, res, next) => {
  console.log('Route hit: PUT /:orderId/status', {
    orderId: req.params.orderId,
    body: req.body,
    user: req.user?._id,
    headers: req.headers.authorization ? 'Authorization present' : 'No authorization'
  });
  next();
}, updateOrderStatusController);
router.post('/', protect, createOrderController);
router.get('/:orderId/products', getProductsFromOrderController);
router.get(
  '/:orderId/renter-details',
  protect,
  getOrderWithRenterDetailsController
);

export default router;
