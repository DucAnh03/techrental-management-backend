import OrderProduct from '../models/OrderProduct.js';

export const createOrderProduct = async (orderData) => {
    const newOrder = new OrderProduct(orderData);
    return await newOrder.save();
};

export const getOrderProductById = async (orderId) => {
    return await OrderProduct.findById(orderId).populate('productId');
};

export const updateOrderProductById = async (orderId, updateData) => {
    return await OrderProduct.findByIdAndUpdate(orderId, updateData, {
        new: true,
        runValidators: true,
    });
};

export const deleteOrderProductById = async (orderId) => {
    return await OrderProduct.findByIdAndDelete(orderId);
};

export const getAllOrderProducts = async () => {
    return await OrderProduct.find().populate('productId');
};
export const getOrderProductsByProductIds = async (productIds) => {
    return await OrderProduct.find({ productId: { $in: productIds } });
};
export const getOrderProductByUnitId = async (unitId) => {
    return await OrderProduct.findOne({ unitId }).populate('productId');
};
export default {
    createOrderProduct,
    getOrderProductById,
    updateOrderProductById,
    deleteOrderProductById,
    getAllOrderProducts, getOrderProductByUnitId, getOrderProductsByProductIds
};