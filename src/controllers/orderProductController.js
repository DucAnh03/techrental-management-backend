import {
    createOrderProduct,
    getOrderProductById,
    updateOrderProductById,
    deleteOrderProductById,
    getAllOrderProducts,
    getOrderProductByUnitId,
    getOrderProductsByProductIds,
} from '../service/orderProduct.service.js';

export const createOrderProductController = async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = await createOrderProduct(orderData);
        res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getOrderProductByIdController = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await getOrderProductById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateOrderProductController = async (req, res) => {
    try {
        const orderId = req.params.id;
        const updateData = req.body;
        const updatedOrder = await updateOrderProductById(orderId, updateData);
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteOrderProductController = async (req, res) => {
    try {
        const orderId = req.params.id;
        const deletedOrder = await deleteOrderProductById(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getOrderProductsByProductIdsController = async (req, res) => {
    try {
        const { id } = req.body;

        if (!Array.isArray(id) || id.length === 0) {
            return res.status(400).json({ success: false, message: 'id must be a non-empty array' });
        }

        const orders = await getOrderProductsByProductIds(id);

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getAllOrderProductsController = async (req, res) => {
    try {
        const orders = await getAllOrderProducts();
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getOrderProductByUnitIdController = async (req, res) => {
    try {
        const { unitId } = req.params;
        const order = await getOrderProductByUnitId(unitId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found for this unitId' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};