import express from 'express';
import {
    updateOrderStatusController,
    getProductsFromOrderController,
    getAllOrderedProductsController,
} from '../controllers/orderController.js';

const router = express.Router();

router.put('/:orderId/status', updateOrderStatusController);
router.get('/:orderId/products', getProductsFromOrderController);
router.get('/products/all', getAllOrderedProductsController);

export default router;