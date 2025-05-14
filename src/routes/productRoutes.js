import express from 'express';
import { createProduct, deleteProductById, getAllProduct, getProductById, getAllProductByIdShop, createManyProduct } from '../controllers/productController.js';

const router = express.Router();

router.post("/", createProduct);
router.post("/createMany", createManyProduct);
router.delete("/:_id", deleteProductById);
router.get("/", getAllProduct);
router.get("/:_id", getProductById);
router.get("/store/:_id", getAllProductByIdShop);

export default router;
