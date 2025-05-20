import express from 'express';
import {
  registerController,
  loginController,
  verifyUserController,
  forgotPasswordRequest,
  resetPassword,
  getEmailFromToken,
  checkResetTokenController,
  getAllUsersController,
  resetPasswordWithCode,
} from '../controllers/authController.js';

import {
  protect,
  authorizeRoles,
  ensureVerifiedUser,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.get('/verify/:token', verifyUserController);
router.post('/forgotPassword', forgotPasswordRequest);
router.post('/forgotPassword/:recoveryToken', resetPassword);
router.post('/resetPasswordWithCode', resetPasswordWithCode);
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
