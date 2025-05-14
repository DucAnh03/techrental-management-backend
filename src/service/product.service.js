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
    return await ProductDetail.find().populate("idShop")
        .populate("category");
};

export const getProductById = async (_id) => {
    return await ProductDetail.findById(_id);
};
export const getProductByIdProduct = async (_id) => {
    try {
        const product = await ProductDetail.findOne({ idProduct: _id })
            .populate("idShop")
            .populate("category")
        // .populate("reviews");

        return product;
    } catch (error) {
        console.error("Error getting product:", error);
        throw error;
    }
};

export const getAllProductByIdShop = async (_id) => {
    return await ProductDetail.find({ idShop: _id });
};

export default { createProduct, deleteProductById, getAllProduct, getProductById, getAllProductByIdShop, getProductByIdProduct, createManyProduct };
