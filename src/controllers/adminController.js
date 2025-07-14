import Order from '../models/Order.js';
import ProductDetail from '../models/ProductDetail.js';
import User from '../models/User.js';

export const getAdminSummary = async (req, res) => {
    try {
        // Tổng doanh thu (30% mỗi đơn, parseFloat nếu là string)
        const completedOrders = await Order.find({ status: 'completed' }).sort({ createdAt: -1 });
        const totalRevenue = completedOrders.reduce((sum, o) => sum + ((parseFloat(o.totalPrice) || 0) * 0.3), 0);

        // Số sản phẩm đang cho thuê (UnitProduct có productStatus: 'rented')
        const productsRented = await ProductDetail.aggregate([
            { $match: {} },
            { $group: { _id: null, total: { $sum: '$soldCount' } } }
        ]);
        const rentedCount = productsRented[0]?.total || 0;

        // Số đơn hàng bị huỷ
        const canceledOrders = await Order.find({ status: 'canceled' }).sort({ createdAt: -1 });
        const ordersCanceled = canceledOrders.length;

        // Số user mới trong tháng
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const newUsersList = await User.find({ createdAt: { $gte: startOfMonth } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email createdAt');
        const newUsersThisMonth = newUsersList.length;

        // Tổng user
        const totalUsers = await User.countDocuments();
        const latestUsersList = await User.find().sort({ createdAt: -1 }).limit(5).select('name email createdAt');

        // Top 5 đơn completed mới nhất
        const topCompletedOrders = completedOrders.slice(0, 5).map(o => ({
            customer: o.customerId?.name || '',
            totalPrice: o.totalPrice,
            createdAt: o.createdAt
        }));
        // Top 5 đơn canceled mới nhất
        const topCanceledOrders = canceledOrders.slice(0, 5).map(o => ({
            customer: o.customerId?.name || '',
            totalPrice: o.totalPrice,
            createdAt: o.createdAt
        }));
        // Top 5 sản phẩm đang cho thuê nhiều nhất
        const topRentedProducts = await ProductDetail.find({ soldCount: { $gt: 0 } })
            .sort({ soldCount: -1 })
            .limit(5)
            .select('title soldCount');

        res.json({
            totalRevenue,
            productsRented: rentedCount,
            ordersCanceled,
            newUsersThisMonth,
            totalUsers,
            newUsersList,
            latestUsersList,
            topCompletedOrders,
            topCanceledOrders,
            topRentedProducts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
