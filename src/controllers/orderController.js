import { updateOrderStatus, getProductsFromOrder, getAllOrderedProducts, createOrder } from '../service/order.service.js';


export const createOrderController = async (req, res) => {
    try {
        const orderData = req.body;

        const newOrder = await createOrder(orderData);
        res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateOrderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const updatedOrder = await updateOrderStatus(orderId, status);
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getProductsFromOrderController = async (req, res) => {
    try {
        const { orderId } = req.params;

        const products = await getProductsFromOrder(orderId);
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getAllOrderedProductsController = async (req, res) => {
    try {
        const products = await getAllOrderedProducts();
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};