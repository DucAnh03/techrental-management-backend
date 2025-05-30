import express from 'express';
import {
  getCurrentUserController,
  getAllUsersController,
  becomeOwnerController,
  updateUserController,
  getUserById,
} from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, getCurrentUserController);
router.patch('/me', protect, updateUserController)
router.get('/userAll', protect, authorizeRoles('admin'), getAllUsersController);
router.post('/become-owner', protect, becomeOwnerController);
router.get('/get-user-by-id/:_id', getUserById);

export default router;
