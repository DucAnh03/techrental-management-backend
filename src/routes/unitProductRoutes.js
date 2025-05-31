import express from 'express';
import {
    createUnitProductController,
    getUnitProductByIdController,
    updateUnitProductController,
    deleteUnitProductController,
    getAllUnitProductsController,
    getUnitProductByUnitIdController,
    getUnitProductsByProductIdsController,
} from '../controllers/unitProductController.js';

const router = express.Router();

router.post('/', createUnitProductController);
router.get('/:id', getUnitProductByIdController);
router.put('/:id', updateUnitProductController);
router.post('/byProductIds', getUnitProductsByProductIdsController);

router.delete('/:id', deleteUnitProductController);
router.get('/', getAllUnitProductsController);

router.get('/unit/:unitId', getUnitProductByUnitIdController);
export default router;