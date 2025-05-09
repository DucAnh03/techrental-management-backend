import mongoose from 'mongoose';

const mongoose = require('mongoose');

const SpecificationSchema = new mongoose.Schema({
    key: String,
    label: String,
    value: String
});

const ProductSchema = new mongoose.Schema({
    idProduct: {
        type: String,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    title: String,
    brand: String,
    idCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'CategoryProduct' },
    price: Number,
    images: [String],
    view: Number,
    idShop: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopDetail' },
    details: String,
    shortDetails: String,
    parameter: [SpecificationSchema],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductReview' }],
    isHotProduct: Boolean,
    isNewProduct: Boolean,
    location: String
}, {
    collection: 'productDetail',
});
export default mongoose.model('ProductDetail', ProductSchema);
