import express from 'express';
import { createProduct, deleteProductById, getAllProduct, getProductById, getAllProductByIdShop, createManyProduct } from '../controllers/productController.js';
import { ensureVerifiedUser, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/", protect, ensureVerifiedUser, createProduct);
router.post("/createMany", protect, ensureVerifiedUser, createManyProduct);
router.delete("/:_id", protect, ensureVerifiedUser, deleteProductById);
router.get("/", getAllProduct);
router.get("/:_id", getProductById);
router.get("/store/:_id", getAllProductByIdShop);

export default router;
