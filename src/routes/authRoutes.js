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
  googleCallbackController,
} from '../controllers/authController.js';

import {
  protect,
  authorizeRoles,
  ensureVerifiedUser,
} from '../middlewares/authMiddleware.js';

import passport from '../config/passport.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

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

// Google OAuth - Production
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  prompt: 'select_account'
}));

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  googleCallbackController
);

// Google OAuth - Local Testing
router.get('/google/local', async (req, res) => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent('http://localhost:5000/api/auth/google/callback/local')}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent('profile email')}&` +
    `prompt=select_account`;
  
  res.redirect(googleAuthUrl);
});

router.get('/google/callback/local', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.redirect('http://localhost:3000/login?error=no_code');
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:5000/api/auth/google/callback/local',
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      return res.redirect('http://localhost:3000/login?error=token_failed');
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
    });

    const userData = await userResponse.json();
    
    // Find or create user
    let user = await User.findOne({ email: userData.email });
    
    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const passwordHash = await bcrypt.hash(randomPassword, 12);
      
      user = await User.create({
        name: userData.name,
        email: userData.email,
        password: passwordHash,
        phone: '',
        roles: ['renter'],
        avatar: userData.picture || '',
        identityVerification: {
          status: 'verified',
          verifiedAt: new Date(),
        },
        isActive: true,
      });
    } else {
      // Update existing user to ensure verified
      if (user.identityVerification?.status !== 'verified') {
        user.identityVerification = {
          ...user.identityVerification,
          status: 'verified',
          verifiedAt: new Date(),
        };
        await user.save();
      }
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        roles: user.roles,
        isVerified: user.identityVerification?.status === 'verified',
        email: user.email,
        phone: user.phone,
      },
      process.env.SECRET_KEY,
      { expiresIn: '30d' }
    );

    // Redirect to localhost frontend
    return res.redirect(
      `http://localhost:3000/oauth-callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
        _id: user._id,
        email: user.email,
        roles: user.roles,
        name: user.name,
        isVerified: user.identityVerification?.status === 'verified',
        phone: user.phone,
        avatar: user.avatar,
      }))}`
    );
  } catch (error) {
    console.error('Local Google callback error:', error);
    return res.redirect('http://localhost:3000/login?error=server_error');
  }
});

// Test route
router.get('/google/test', (req, res) => {
  res.json({
    message: 'Google OAuth is configured',
    clientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
    clientUrl: process.env.CLIENT_URL || 'Not set'
  });
});

export default router;
