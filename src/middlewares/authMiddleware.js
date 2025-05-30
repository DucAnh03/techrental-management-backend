import jwt from 'jsonwebtoken';
import User from '../models/User.js';
// Parse and verify token
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).send('Unauthorized');

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userDoc = await User.findById(decoded.userId || decoded._id).select(
      '-password'
    );
    if (!userDoc) return res.status(401).send('User not found');
    req.user = userDoc;
    req.authenticatedUser = decoded;
    next();
  } catch (error) {
    console.error('JWT verify error:', error.message);
    res.status(403).send('Forbidden: Invalid Token');
  }
};

// Authorize by role
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (
      !req.authenticatedUser ||
      !roles.some((role) => req.authenticatedUser.roles.includes(role))
    ) {
      return res.status(403).send('Access Denied: Insufficient Permission');
    }
    next();
  };
};

// Ensure email verified
export const ensureVerifiedUser = (req, res, next) => {
  if (req.authenticatedUser.verify === true || req.authenticatedUser.isVerified === true) {
    next();
  } else {
    res.status(401).send('User not verified');
  }
};
