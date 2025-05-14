import express from 'express';
import { createProductReview, deleteProductReviewById, getAllProductReview, getProductReviewById, getAllProductReviewByIdProduct } from '../controllers/productReviewController.js';
const router = express.Router();

router.post("/", createProductReview);
router.delete("/:_id", deleteProductReviewById);
router.get("/", getAllProductReview);
router.get("/:_id", getProductReviewById);
router.get("/product/:_id", getAllProductReviewByIdProduct);
// router.get("/store/:_id", getAllProductReviewByIdShop);


export default router;
