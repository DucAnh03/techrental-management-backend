import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
    idCategory: {
        type: String,
        required: true,
        unique: true,
        default: () => new mongoose.Types.ObjectId().toString()
    },
    nameCategory: String
}, {
    collection: 'categories',
});
export default mongoose.model('CategoryProduct', CategorySchema);
