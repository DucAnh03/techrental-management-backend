import express from 'express';
import {
  updateOrderStatusController,
  getProductsFromOrderController,
  getAllOrderedProductsController,
  createPaymentController,
  vnpayReturnController,
} from '../controllers/orderController.js';

const router = express.Router();

router.put('/:orderId/status', updateOrderStatusController);
router.get('/:orderId/products', getProductsFromOrderController);
router.get('/products/all', getAllOrderedProductsController);
router.post('/create-payment-url', createPaymentController);
router.get('/vnpay-return', vnpayReturnController);

export default router;
