import { updateOrderStatus, getProductsFromOrder, getAllOrderedProducts, createOrder, getOrdersByUserId, getOrdersByRenterId, getOrderWithRenterDetails } from '../service/order.service.js';


export const getOrdersByUserIdController = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await getOrdersByUserId(userId);
        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, message: 'No orders found for this user' });
        }

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getOrdersByRenterIdController = async (req, res) => {
    try {
        const { renterId } = req.params;

        const orders = await getOrdersByRenterId(renterId);
        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, message: 'No orders found for this renter' });
        }

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
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


export const getOrderWithRenterDetailsController = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await getOrderWithRenterDetails(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};