import {
  getCurrentUserController,
  getAllUsersController,
} from '../controllers/userController.js';
import {
  protect,
  authorizeRoles,
  ensureVerifiedUser,
} from '../middlewares/authMiddleware.js';

router.get('/me', protect, getCurrentUserController);
router.get('/users', protect, authorizeRoles('admin'), getAllUsersController);
