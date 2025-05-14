import ShopDetail from '../models/ShopDetail.js';

const createShopDetail = async (data) => {
    try {
        const shopDetail = await ShopDetail.create(data);
        return shopDetail;
    } catch (error) {
        throw error;
    }
};
const deleteShopDetailById = async (_id) => {
    try {
        const shopDetail = await ShopDetail.findByIdAndDelete(_id);
        return shopDetail;
    }
    catch (error) {
        throw error;
    }
}
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
    }
    catch (error) {
        throw error;
    }
}
const getAllShopDetailByIdShop = async (_id) => {
    try {
        const shopDetails = await ShopDetail.find({ idShop: _id });
        return shopDetails;
    } catch (error) {
        throw error;
    }
}

export default {
    createShopDetail, deleteShopDetailById, getAllShopDetail
    , getAllShopDetailByIdShop,
    getShopDetailById
};
