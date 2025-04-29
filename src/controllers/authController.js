import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  sendToken,
  sendResetToken,
  verifyUser,
  forgotPassword,
  checkToken,
  getEmailByToken,
  getAllUsers,
} from '../service/authentication/index.js';

// Register User
export const register = async (req, res) => {
  try {
    const { username, password, email, phoneNumber, address } = req.body;
    const password_hash = await bcrypt.hash(password, 10);

    const result = await register(
      username,
      password_hash,
      email,
      address,
      phoneNumber
    );

    if (result.status) {
      const token = await sendToken(email, result.payload._id);
      res.status(201).json(result);
    } else {
      res
        .status(400)
        .json({ message: 'Registration failed', error: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const result = await login(usernameOrEmail, password);

    if (result.status) {
      const payload = {
        usernameOrEmail,
        userId: result.payload._id,
        roles: result.payload.roles,
        verify: result.payload.verify,
      };

      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '30d',
      });

      res.json({
        token,
        userId: result.payload._id,
        roles: result.payload.roles,
        verify: result.payload.verify,
        email: result.payload.email,
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Email
export const verifyUserController = async (req, res) => {
  const { token } = req.params;
  const result = await verifyUser(token);
  res.status(result.code).send(result.message);
};

// Forgot Password
export const forgotPasswordRequest = async (req, res) => {
  const { email } = req.body;
  const result = await sendResetToken(email);
  res.status(result.code).send(result);
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const { recoveryToken } = req.params;
  const result = await forgotPassword(email, recoveryToken, newPassword);
  res.status(result.code).send(result.message);
};

// Get Email by token
export const getEmailFromToken = async (req, res) => {
  const { token } = req.params;
  const result = await getEmailByToken(token);
  res.status(result.code).send(result);
};

// Check Reset Token
export const checkResetTokenController = async (req, res) => {
  const { token } = req.params;
  const result = await checkToken(token);
  res.status(result.code).send(result);
};

// Get all users
export const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
