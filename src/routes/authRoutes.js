import express from 'express';
import {
  register,
  login,
  verifyUserController,
  forgotPasswordRequest,
  resetPassword,
  getEmailFromToken,
  checkResetTokenController,
  getAllUsersController,
} from '../controllers/authController.js';

import {
  protect,
  authorizeRoles,
  ensureVerifiedUser,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyUserController);
router.post('/forgotPassword', forgotPasswordRequest);
router.post('/forgotPassword/:recoveryToken', resetPassword);
router.get('/getEmail/:token', getEmailFromToken);
router.get('/checkResetToken/:token', checkResetTokenController);

router.get(
  '/users',
  protect,
  ensureVerifiedUser,
  authorizeRoles('admin'),
  getAllUsersController
);

export default router;
