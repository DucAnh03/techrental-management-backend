import mongoose from 'mongoose';
import Order from '../models/Order.js';
import UnitProduct from '../models/UnitProduct.js';
import ProductDetail from '../models/ProductDetail.js';

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const updateData = { status: newStatus };

    if (newStatus === 'before_deadline') {
      updateData.deliveryDate = new Date();
    }

    const order = await Order.findByIdAndUpdate(orderId, updateData, {
      new: true,
      runValidators: true,
    });
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
};
export const getAllOrderedProducts = async () => {
  try {
    const orders = await Order.find().populate('products');
    const allProducts = orders.flatMap((order) => order.products);
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
export const getOrdersByUserId = async (userId) => {
  try {
    const objectId = new mongoose.Types.ObjectId(userId);
    const orders = await Order.find({ customerId: objectId });
    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const detailedProducts = await ProductDetail.find({
          _id: { $in: order.products },
        });

        return {
          ...order.toObject(),
          products: detailedProducts,
        };
      })
    );
    return enrichedOrders;
  } catch (error) {
    throw error;
  }
};

export const getOrdersByRenterId = async (renterId) => {
  try {
    const unitProductIds = await UnitProduct.distinct('_id', { renterId });
    console.log(unitProductIds);
    if (!unitProductIds.length) return [];

   
    const orders = await Order.find({ products: { $in: unitProductIds } })
      .populate({
        path: 'products',
        match: { renterId },         
    return orders.filter((o) => o.products.length);
  } catch (error) {
    throw error;
  }
};

export const getOrderWithRenterDetails = async (orderId) => {
  try {
    const order = await Order.findById(orderId).populate({
      path: 'products',
      populate: {
        path: 'renterId',
        model: 'User',
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  } catch (error) {
    throw error;
  }
};
