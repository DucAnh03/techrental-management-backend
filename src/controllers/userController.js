import ProductDetail from '../models/ProductDetail.js';
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
    const ownedProductsCount = await ProductDetail.countDocuments({ owner: req.authenticatedUser.userId });
    const rentingProductsCount = await ProductDetail.countDocuments({ renters: req.authenticatedUser.userId });

    res.status(200).json({
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

    const user = await getCurrentUser(userId);

    const ownedProductsCount = await ProductDetail.countDocuments({ owner: userId });
    const rentingProductsCount = await ProductDetail.countDocuments({ renters: userId });

    return res.status(201).json({
      success: true,
      message: 'Trở thành chủ sở hữu thành công',
      data: {
        user: {
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
        },
        shop: {
          _id: user._id.toString(),
          ...shop
        },
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};