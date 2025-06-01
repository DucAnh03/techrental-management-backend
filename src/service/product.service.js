import UnitProduct from '../models/UnitProduct.js';
import ProductDetail from '../models/ProductDetail.js';
import { v2 as cloudinary } from 'cloudinary';

export const createProduct = async (productData) => {
    console.log(productData);
    const { stock, ...productDetails } = productData;
    console.log("stock", stock)
    const newProduct = new ProductDetail({ ...productDetails, stock });
    const savedProduct = await newProduct.save();

    const UnitProducts = [];
    for (let i = 0; i < stock; i++) {
        const unitId = `${savedProduct._id}-${i + 1}`;
        const newUnitProduct = new UnitProduct({
            productId: savedProduct._id,
            unitId,
            productStatus: 'available',
            renterId: productData.renterId,
        });
        const savedUnitProduct = await newUnitProduct.save();
        UnitProducts.push(savedUnitProduct);
    }

    return { product: savedProduct, orders: UnitProducts };
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
    try {
        const product = await ProductDetail.findById(_id);
        if (!product) {
            throw new Error('Product not found');
        }

        const images = product.images || [];

        const publicIds = images.map((url) => {
            const parts = url.split('/');
            const fileName = parts[parts.length - 1];
            const publicId = fileName.split('.')[0];
            return publicId;
        });

        for (const public_id of publicIds) {
            await cloudinary.uploader.destroy(public_id);
        }

        const deletedProduct = await ProductDetail.findByIdAndDelete(_id);
        return deletedProduct;
    } catch (error) {
        throw error;
    }
};

export const getAllProduct = async () => {
    return await ProductDetail.find()
        .populate("idShop")
        .populate("category").populate('reviews');
};
export const getAllProductAprove = async () => {
    return await ProductDetail.find({ adminApprovalStatus: "approved" })
        .populate("idShop")
        .populate("category")
        .populate("reviews");
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

export default { createProduct, deleteProductById, getAllProduct, getProductById, getAllProductByIdShop, createManyProduct, getAllProductAprove };
