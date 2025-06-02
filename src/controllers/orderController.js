import moment from 'moment';
import User from '../models/User.js';
import {
  updateOrderStatus,
  getProductsFromOrder,
  getAllOrderedProducts,
  createOrder,
  getOrdersByUserId,
  getOrdersByRenterId,
  getOrderWithRenterDetails,
  getOrderById,
} from '../service/order.service.js';
import { sendOrderApprovedEmail } from '../utils/mailer.js';
import qs from 'qs';
import crypto from 'crypto';
import UnitProduct from '../models/UnitProduct.js';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
export const getOrdersByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await getOrdersByUserId(userId);
    console.log(orders);
    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No orders found for this user' });
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

    console.log('orders', orders);

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'No orders found for this renter' });
    }

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const createOrderController = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { products: productIds, ...orderPayload } = req.body;
    const unitProductIds = [];

    for (const productId of productIds) {
      const unit = await UnitProduct.findOneAndUpdate(
        { productId, productStatus: 'available' },
        { productStatus: 'rented' },
        { new: true, session }
      );

      unitProductIds.push(unit?._id);
    }

    const newOrder = await Order.create(
      [
        {
          ...orderPayload,
          products: unitProductIds,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ success: true, data: newOrder[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    console.log('recived status:', status);
    console.log('recived orderId', orderId);

    const updatedOrder = await updateOrderStatus(orderId, status);
    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    const userId = req.body.toId;
    console.log('TO ID', userId);

    const foundUser = await User.findById(userId);

    console.log('foundUser', foundUser);

    if (status == 'pending_payment') {
      console.log('SENDING EMAIL');
      await sendOrderApprovedEmail(foundUser.email, orderId, userId);
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
export const createPaymentController = async (req, res) => {
  try {
    const orderIdReq = req.body.orderId;
    const customerId = req.body.customerId;
    const type = req.body.type;
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const vnp_TmnCode = process.env.VNP_TMNCODE;
    const vnp_HashSecret = process.env.VNP_HASHSECRET;
    const vnp_Url = process.env.VNP_URL;
    const vnp_ReturnUrl = process.env.VNP_RETURNURL;

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');

    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.connection?.socket?.remoteAddress;

    const tmnCode = vnp_TmnCode;
    const secretKey = vnp_HashSecret;
    let vnpUrl = vnp_Url;
    const returnUrl = vnp_ReturnUrl;
    const orderId = moment(date).format('DDHHmmss');

    const amountStr = req.body.amount.toString().replace(/\./g, '');
    const amount = parseInt(amountStr);
    if (isNaN(amount)) {
      return res
        .status(400)
        .json({ success: false, message: 'Amount is invalid' });
    }
    const bankCode = req.body.bankCode;
    let locale = req.body.language;
    if (!locale) {
      locale = 'vn';
    }
    const currCode = 'VND';
    let vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: locale,
      vnp_CurrCode: currCode,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderIdReq + '|' + customerId + '|' + type,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    if (bankCode) {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });
    res.status(200).json({ success: true, data: vnpUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}
export const vnpayReturnController = async (req, res) => {
  try {
    let vnp_Params = req.query;

    const vnp_TmnCode = process.env.VNP_TMNCODE;
    const vnp_HashSecret = process.env.VNP_HASHSECRET;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac('sha512', vnp_HashSecret);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      res.render('success', { code: vnp_Params['vnp_ResponseCode'] });
    } else {
      res.render('success', { code: '97' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderWithRenterDetailsController = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await getOrderWithRenterDetails(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderByIdController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await getOrderById(orderId);

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
