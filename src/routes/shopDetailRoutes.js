import express from 'express';
import {
  createShopDetail,
  deleteShopDetailById,
  getAllShopDetail,
  getShopDetailById,
  getAllShopDetailByIdShop,
  getMyShopDetail,
  getShopDetailByUserId,
  updateShopPackagesController,
} from '../controllers/shopDetailController.js';
import { ensureVerifiedUser, protect } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/me', protect, getMyShopDetail);
router.get('/by-user/:userId', getShopDetailByUserId);

router.post('/', protect, ensureVerifiedUser, createShopDetail);
router.delete('/:_id', protect, ensureVerifiedUser, deleteShopDetailById);
router.get('/', getAllShopDetail);
router.get('/:_id', getShopDetailById);
router.get('/store/:_id', getAllShopDetailByIdShop);

router.put('/packages',
  protect, ensureVerifiedUser,
  updateShopPackagesController);
export default router;
