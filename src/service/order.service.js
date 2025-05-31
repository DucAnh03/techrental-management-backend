import Order from '../models/Order.js';

export const updateOrderStatus = async (orderId, newStatus) => {
    try {
        const updateData = { status: newStatus };

        if (newStatus === 'before_deadline') {
            updateData.deliveryDate = new Date();
        }

        const order = await Order.findByIdAndUpdate(orderId, updateData, { new: true, runValidators: true });
        return order;
    } catch (error) {
        throw error;
    }
};
export const getProductsFromOrder = async (orderId) => {
    try {
        const order = await Order.findById(orderId).populate('products');
        if (!order) {
            throw new Error('Order not found');
        }
        return order.products;
    } catch (error) {
        throw error;
    }
}; export const getAllOrderedProducts = async () => {
    try {
        const orders = await Order.find().populate('products');
        const allProducts = orders.flatMap(order => order.products);
        return allProducts;
    } catch (error) {
        throw error;
    }
};

export const createOrder = async (orderData) => {
    try {
        const newOrder = new Order(orderData);
        return await newOrder.save();
    } catch (error) {
        throw error;
    }
};
