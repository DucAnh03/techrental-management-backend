import mongoose from 'mongoose';
import Order from '../models/Order.js';
import UnitProduct from '../models/UnitProduct.js';
import ProductDetail from '../models/ProductDetail.js';
import ShopDetail from '../models/ShopDetail.js';
import moment from 'moment';

export const autoUpdateOrderStatus = async () => {
  try {
    const orders = await Order.find({ status: 'before_deadline' });
    for (const order of orders) {
      if (order.deliveryDate && order.duration) {
        const deadline = moment(order.deliveryDate).add(order.duration, 'days');
        if (moment().isAfter(deadline)) {
          order.status = 'return_product';
          await order.save();
          console.log(`Order ${order._id} updated to return_product`);
        }
      }
    }
  } catch (error) {
    console.error('Error updating orders status:', error);
  }
};
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
    console.log('1. Searching for shop with renterId:', renterId);
    const shopDetails = await ShopDetail.findOne({ idUser: renterId });
    if (!shopDetails) {
      console.log('No shop found for this renterId');
      return [];
    }
    console.log('2. Found shop:', shopDetails._id);

    const products = await ProductDetail.find({ idShop: shopDetails._id }).select('_id');
    console.log('3. Found products:', products.length, 'products');
    if (!products.length) {
      console.log('No products found for this shop');
      return [];
    }

    const productIds = products.map(p => p._id);
    console.log('4. Product IDs:', productIds);

    const unitProducts = await UnitProduct.find({
      productId: { $in: productIds }
    }).select('_id productId');
    console.log('5. Found unit products:', unitProducts.length, 'units');

    const unitProductIds = unitProducts.map(up => up._id);
    if (!unitProductIds.length) {
      console.log('No unit products found');
      return [];
    }
    console.log('6. Unit product IDs:', unitProductIds);

    // Thay đổi cách tìm kiếm orders
    const allOrders = await Order.find()
      .populate('customerId', '-password')
      .populate({
        path: 'products',
        populate: {
          path: 'productId',
          model: 'ProductDetail',
          select: 'title images price idShop'
        }
      })
      .lean();

    console.log('7. Found all orders:', allOrders.length);

    // Lọc orders có products thuộc về shop
    const filteredOrders = allOrders.filter(order => {
      return order.products.some(product => {
        const productShopId = product.productId?.idShop?.toString();
        const shopId = shopDetails._id.toString();
        console.log('Comparing shop IDs:', {
          productShopId,
          shopId,
          matches: productShopId === shopId
        });
        return productShopId === shopId;
      });
    });

    console.log('8. Filtered orders:', filteredOrders.length);
    console.log('9. Order details:', filteredOrders.map(o => ({
      id: o._id,
      status: o.status,
      products: o.products.length,
      totalPrice: o.totalPrice,
      productShops: o.products.map(p => p.productId?.idShop)
    })));

    return filteredOrders;
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
