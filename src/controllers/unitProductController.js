import {
    createUnitProduct,
    getUnitProductById,
    updateUnitProductById,
    deleteUnitProductById,
    getAllUnitProducts,
    getUnitProductByUnitId,
    getUnitProductsByProductIds,
} from '../service/unitProduct.service.js';

export const createUnitProductController = async (req, res) => {
    try {
        const orderData = req.body;
        const newOrder = await createUnitProduct(orderData);
        res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUnitProductByIdController = async (req, res) => {
    try {
        const orderId = req.params.id;
        const order = await getUnitProductById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUnitProductController = async (req, res) => {
    try {
        const orderId = req.params.id;
        const updateData = req.body;
        const updatedOrder = await updateUnitProductById(orderId, updateData);
        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, data: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteUnitProductController = async (req, res) => {
    try {
        const orderId = req.params.id;
        const deletedOrder = await deleteUnitProductById(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getUnitProductsByProductIdsController = async (req, res) => {
    try {
        const { id } = req.body;

        if (!Array.isArray(id) || id.length === 0) {
            return res.status(400).json({ success: false, message: 'id must be a non-empty array' });
        }

        const orders = await getUnitProductsByProductIds(id);

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getAllUnitProductsController = async (req, res) => {
    try {
        const orders = await getAllUnitProducts();
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getUnitProductByUnitIdController = async (req, res) => {
    try {
        const { unitId } = req.params;
        const order = await getUnitProductByUnitId(unitId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found for this unitId' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};