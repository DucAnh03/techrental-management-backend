import ProductDetail from '../models/ProductDetail.js';
export const createProduct = async (productData) => {
    const newProduct = new ProductDetail(productData);
    return await newProduct.save();
};
export const createManyProduct = async (productData) => {
    try {
        const insertedProducts = await ProductDetail.insertMany(productData);
        return insertedProducts;
    } catch (err) {
        console.error('Error inserting products:', err);
        throw err;
    }
};

export const deleteProductById = async (_id) => {
    return await ProductDetail.findByIdAndDelete(_id);
};

export const getAllProduct = async () => {
    return await ProductDetail.find()
        .populate("idShop")
        .populate("category").populate('reviews');
};

export const getProductById = async (_id) => {
    try {
        const product = await ProductDetail.findById(_id).populate("idShop")
            .populate("category").populate('reviews')

        return product;
    } catch (error) {
        console.error("Error getting product:", error);
        throw error;
    }
};

export const getAllProductByIdShop = async (_id) => {
    return await ProductDetail.find({ idShop: _id }).populate("idShop")
        .populate("category").populate('reviews');
};

export default { createProduct, deleteProductById, getAllProduct, getProductById, getAllProductByIdShop, createManyProduct };
