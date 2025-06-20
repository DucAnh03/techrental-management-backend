import mongoose from 'mongoose';

const SpecificationSchema = new mongoose.Schema({
    key: String,
    label: String,
    value: String,
});

const ProductSchema = new mongoose.Schema(
    {
        title: String,
        brand: String,
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CategoryProduct',
            required: true,
        },
        price: { type: Number, required: true },
        priceWeek: { type: Number },
        priceMonth: { type: Number },
        images: [String],
        view: { type: Number, default: 0 },
        idShop: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopDetail' },
        details: String,
        shortDetails: String,
        parameter: [SpecificationSchema],
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductReview' }],
        isHotProduct: { type: Boolean, default: false },
        isNewProduct: { type: Boolean, default: false },
        location: {
            type: String,
            enum: ['Hồ Chí Minh', 'Đà Nẵng', 'Hà Nội'],
            required: true,
        },
        soldCount: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        stock: { type: Number, default: 1 },
        adminApprovalStatus: {
            type: String,
            enum: ['approved', 'pending', 'rejected'],
            default: 'approved',
        },
    },
    {
        collection: 'productDetail',
    },
);

export default mongoose.model('ProductDetail', ProductSchema);