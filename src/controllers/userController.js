import {
  getCurrentUser,
  getAllUsers,
  becomeOwner,
} from '../service/user/index.js';

export const getCurrentUserController = async (req, res) => {
  try {
    const user = await getCurrentUser(req.authenticatedUser.userId);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

export const becomeOwnerController = async (req, res) => {
  try {
    const userId = req.user?._id || req.authenticatedUser?.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: 'Missing user ID in token' });
    }
    const shopPayload = req.body;
    const shop = await becomeOwner(userId, shopPayload);
    return res.status(201).json({
      success: true,
      message: 'Trở thành chủ sở hữu thành công',
      data: shop,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
