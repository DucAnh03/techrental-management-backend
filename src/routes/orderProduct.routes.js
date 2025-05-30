import express from 'express';
import {
    createOrderProductController,
    getOrderProductByIdController,
    updateOrderProductController,
    deleteOrderProductController,
    getAllOrderProductsController,
    getOrderProductByUnitIdController,
    getOrderProductsByProductIdsController,
} from '../controllers/orderProductController.js';

const router = express.Router();

router.post('/', createOrderProductController);
router.get('/:id', getOrderProductByIdController);
router.put('/:id', updateOrderProductController);
router.post('/byProductIds', getOrderProductsByProductIdsController);

router.delete('/:id', deleteOrderProductController);
router.get('/', getAllOrderProductsController);

router.get('/unit/:unitId', getOrderProductByUnitIdController);
export default router;