import express from 'express';
import {
    updateOrderStatusController,
    getProductsFromOrderController,
    getAllOrderedProductsController,
    createOrderController,
    getOrdersByUserIdController,
    getOrdersByRenterIdController,
    getOrderWithRenterDetailsController,
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', createOrderController);
router.put('/:orderId/status', updateOrderStatusController);
router.get('/:orderId/products', getProductsFromOrderController);
router.get('/products/all', getAllOrderedProductsController);
router.get('/user/:userId', getOrdersByUserIdController);
router.get('/renter/:renterId', getOrdersByRenterIdController);
router.get('/:orderId/renter-details', getOrderWithRenterDetailsController);
export default router;