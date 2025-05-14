import User from '../../models/User.js';
import { sendVerificationEmail } from '../../utils/mailer.js';

import jwt from 'jsonwebtoken';

import User from '../../models/User.js';

export const getCurrentUser = async (userId) => {
  return await User.findById(userId).select('-password');
};

export const getAllUsers = async () => {
  return await User.find().select('-password');
};
