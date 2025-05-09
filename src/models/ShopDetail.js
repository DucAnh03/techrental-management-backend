import mongoose from 'mongoose';

const ShopSchema = new mongoose.Schema({
    idShop: {
        type: String,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    response: Number,
    nameShop: String,
    rentered: Number,
    rate: Number,
    totalReviews: Number,
    avatar: String
}, {
    collection: 'shopDetail',
});
export default mongoose.model('ShopDetail', ShopSchema);
