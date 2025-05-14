import express from 'express';
import { createShopDetail, deleteShopDetailById, getAllShopDetail, getShopDetailById, getAllShopDetailByIdShop } from '../controllers/shopDetailController.js';
const router = express.Router();

router.post("/", createShopDetail);
router.delete("/:_id", deleteShopDetailById);
router.get("/", getAllShopDetail);
router.get("/:_id", getShopDetailById);
router.get("/store/:_id", getAllShopDetailByIdShop);

export default router;
