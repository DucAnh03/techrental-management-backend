import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
    author: String,
    avatar: String,
    rating: Number,
    date: String,
    content: String,
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
}, {
    collection: 'productReview',
});
export default mongoose.model('ProductReview', ReviewSchema);
