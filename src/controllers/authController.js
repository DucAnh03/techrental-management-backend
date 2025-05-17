import jwt from 'jsonwebtoken';
import {
  sendToken,
  sendResetToken,
  verifyUser,
  forgotPassword,
  checkToken,
  getEmailByToken,
  getAllUsers,
  register as registerService,
  login as loginService,
} from '../service/authentication/index.js';

// Register User
// this function just send mail to user not exist in database
export const registerController = async (req, res) => {
  try {
    const { username, password, email, phoneNumber, address } = req.body;
    const result = await registerService(
      username,
      password,
      email,
      address,
      phoneNumber
    );

    if (result.status) {
      const tokenResponse = await sendToken(email, result.payload._id);
      res.status(201).json({
        message: tokenResponse.warning
          ? 'Tạo tài khoản thành công nhưng không gửi được email xác minh'
          : 'Đăng ký thành công, vui lòng xác minh email',
        user: result.payload,
        token: tokenResponse.payload.token,
      });
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
export const loginController = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const result = await loginService(usernameOrEmail, password);
    console.log('✅ [POST] /register nhận được:', req.body);

    if (result.status) {
      const user = result.payload;
      const token = jwt.sign(
        {
          userId: user._id,
          roles: user.roles,
          verify: user.identityVerification?.status === 'verified',
          email: user.email,
        },
        process.env.SECRET_KEY,
        { expiresIn: '30d' }
      );

      res.status(200).json({
        token,
        user: {
          _id: user._id,
          email: user.email,
          roles: user.roles,
          name: user.name,
          verify: user.identityVerification?.status === 'verified',
        },
      });
    } else {
      res.status(400).json({ message: result.message });
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
