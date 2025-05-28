import jwt from 'jsonwebtoken';
import {
  sendToken,
  sendResetToken,
  sendResetCode,
  verifyUser,
  forgotPassword,
  checkToken,
  getEmailByToken,
  getAllUsers,
  register as registerService,
  login as loginService,
} from '../service/authentication/index.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import ProductDetail from '../models/ProductDetail.js';

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
          isVerified: user.identityVerification?.status === 'verified',
          email: user.email,
          phone: user.phone,
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
          isVerified: user.identityVerification?.status === 'verified',
          phone: user.phone,
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
  const user = result.metadata;
  const ownedProductsCount = await ProductDetail.countDocuments({ owner: user._id });
  const rentingProductsCount = await ProductDetail.countDocuments({ renters: user._id });

  res.status(result.code).json({
    _id: user._id.toString(),
    fullname: user.identityVerification?.status === 'verified' ? user.name : undefined,
    name: user.name,
    email: user.email,
    roles: user.roles,
    joinDate: user.createdAt.toISOString(),
    phone: user.phone || '',
    address: user.identityVerification?.address || '',
    isVerified: user.identityVerification?.status === 'verified',
    ownedProducts: ownedProductsCount || 0,
    rentingProducts: rentingProductsCount || 0,
    registeredLessor: user.roles.includes('owner'),
  });
};

// Forgot Password

export const resetPasswordWithCode = async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res
      .status(400)
      .json({ message: 'Thiếu email, mã hoặc mật khẩu mới' });
  }

  const user = await User.findOne({ email });
  if (!user)
    return res.status(400).json({ message: 'Không tìm thấy người dùng' });
  console.log('[DEBUG] code từ client:', code);
  console.log('[DEBUG] code trong DB:', user.resetCode);
  console.log('[DEBUG] hết hạn lúc  :', new Date(user.resetCodeExpiry));
  if (!user.resetCode || user.resetCode.toString() !== code.toString()) {
    return res.status(400).json({ message: 'Mã không chính xác' });
  }

  if (Date.now() > user.resetCodeExpiry) {
    return res.status(400).json({ message: 'Mã đã hết hạn' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetCode = null;
  user.resetCodeExpiry = null;

  await user.save();

  return res.status(200).json({ message: 'Đổi mật khẩu thành công' });
};
export const forgotPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email là bắt buộc' });

    const result = await sendResetCode(email);
    return res.status(result.code).json(result);
  } catch (error) {
    console.error('ForgotPwd error:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
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
