import User from '../../models/User.js';
import {
  sendVerificationEmail,
  generateResetCode,
  sendResetCodeEmail,
} from '../../utils/mailer.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export const register = async (
  username,
  password,
  email,
  address,
  phoneNumber
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { status: false, message: 'Email đã tồn tại' };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name: username,
    email,
    password: hashedPassword,
    address,
    phone: phoneNumber,
    roles: ['renter'],
    identityVerification: {
      status: 'pending',
    },
  });

  await newUser.save();

  return { status: true, payload: newUser };
};

export const login = async (usernameOrEmail, password) => {
  const user = await User.findOne({
    $or: [{ email: usernameOrEmail }, { name: usernameOrEmail }],
  });

  if (!user) return { status: false, message: 'Sai email hoặc tài khoản' };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { status: false, message: 'Sai mật khẩu' };

  return { status: true, payload: user };
};

export const sendToken = async (email, userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
    expiresIn: '1h',
  });

  try {
    await sendVerificationEmail(email, token);
    return { payload: { token } };
  } catch (err) {
    console.error('Gửi email xác minh thất bại:', err.message);
    return { payload: { token }, warning: 'Email verification failed' };
  }
};

export const verifyUser = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);
    if (!user) return { code: 400, message: 'Không tìm thấy người dùng' };

    user.identityVerification.status = 'verified';
    user.identityVerification.verifiedAt = new Date();
    await user.save();

    return { code: 200, message: 'Tài khoản đã được xác minh', metadata: user };
  } catch (err) {
    return { code: 400, message: 'Token không hợp lệ hoặc đã hết hạn' };
  }
};

export const sendResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return { code: 400, message: 'Không tìm thấy người dùng' };

  const resetToken = crypto.randomBytes(20).toString('hex');
  const token = jwt.sign({ email }, process.env.SECRET_KEY, {
    expiresIn: '15m',
  });

  console.log(`[Email] Gửi token reset password tới ${email}: ${token}`);

  return { code: 200, message: 'Token khôi phục đã được gửi qua email' };
};

export const forgotPassword = async (email, token, newPassword) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.email !== email)
      return { code: 400, message: 'Email không khớp token' };

    const user = await User.findOne({ email });
    if (!user) return { code: 400, message: 'Không tìm thấy người dùng' };

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    return { code: 200, message: 'Đổi mật khẩu thành công' };
  } catch (err) {
    return { code: 400, message: 'Token không hợp lệ hoặc đã hết hạn' };
  }
};

export const sendResetCode = async (email) => {
  const user = await User.findOne({ email });
  if (!user) return { code: 400, message: 'Email không tồn tại' };

  const code = generateResetCode();
  user.resetCode = code;
  user.resetCodeExpiry = Date.now() + 15 * 60 * 1000;
  await user.save();

  await sendResetCodeEmail(email, code);
  return { code: 200, message: 'Đã gửi mã khôi phục', email };
};

export const getEmailByToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    return { code: 200, email: decoded.email };
  } catch (err) {
    return { code: 400, message: 'Token không hợp lệ' };
  }
};

export const checkToken = async (token) => {
  try {
    jwt.verify(token, process.env.SECRET_KEY);
    return { code: 200, message: 'Token hợp lệ' };
  } catch (err) {
    return { code: 400, message: 'Token không hợp lệ hoặc hết hạn' };
  }
};

export const getAllUsers = async () => {
  const users = await User.find().select('-password');
  return users;
};
