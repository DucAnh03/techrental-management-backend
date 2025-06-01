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
    console.log('Finding orders for renterId:', renterId);

    // First find all unit products where this user is the renter
    const unitProducts = await UnitProduct.find({ renterId }).select('_id');
    console.log('Found unit products:', unitProducts);

    const unitProductIds = unitProducts.map(up => up._id);
    console.log('Unit product IDs:', unitProductIds);

    if (!unitProductIds.length) {
      console.log('No unit products found for this renter');
      return [];
    }

    // Find orders that contain any of these unit products
    const orders = await Order.find({
      products: { $in: unitProductIds }
    })
    .populate({
      path: 'customerId',
      select: '-password'
    })
    .populate({
      path: 'products',
      populate: {
        path: 'productId',
        model: 'ProductDetail'
      }
    })
    .lean();

    console.log('Found orders:', JSON.stringify(orders, null, 2));
    return orders;
  } catch (error) {
    console.error('Error in getOrdersByRenterId:', error);
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

export const getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
      .populate({
        path: 'customerId',
        model: 'User',
        select: '-password'
      })
      .populate({
        path: 'products',
        model: 'UnitProduct',
        populate: {
          path: 'productId',
          model: 'ProductDetail'
        }
      });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  } catch (error) {
    throw error;
  }
};
