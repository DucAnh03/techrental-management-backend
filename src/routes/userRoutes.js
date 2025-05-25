import express from 'express';
import {
  getCurrentUserController,
  getAllUsersController,
  becomeOwnerController,
} from '../controllers/userController.js';
import { protect, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, getCurrentUserController);
router.get('/userAll', protect, authorizeRoles('admin'), getAllUsersController);
router.post('/become-owner', protect, becomeOwnerController);

export default router;
