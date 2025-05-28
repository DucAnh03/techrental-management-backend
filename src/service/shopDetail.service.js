import ShopDetail from '../models/ShopDetail.js';

const createShopDetail = async (user, data) => {
  try {
    console.log('first', user);
    console.log('Received user in service:', user);
    console.log('user._id:', user?._id);

    const shopDetail = await ShopDetail.create({
      idUser: user.userId,
      contact: {
        phone: user?.phone,
        email: user?.email,
      },
      ...data,
    });

    return shopDetail;
  } catch (error) {
    throw error;
  }
};
const deleteShopDetailById = async (_id) => {
  try {
    const shopDetail = await ShopDetail.findByIdAndDelete(_id);
    return shopDetail;
  } catch (error) {
    throw error;
  }
};
const getAllShopDetail = async () => {
  try {
    const shopDetails = await ShopDetail.find();
    return shopDetails;
  } catch (error) {
    throw error;
  }
};
const getShopDetailById = async (_id) => {
  try {
    const shopDetail = await ShopDetail.findById(_id);
    return shopDetail;
  } catch (error) {
    throw error;
  }
};

const getShopDetailByUserId = async (userId) => {
  return await ShopDetail.findOne({ idUser: userId });
};

export default {
  createShopDetail,
  deleteShopDetailById,
  getAllShopDetail,
  getShopDetailById,
  getShopDetailByUserId,
};
