import service from '../service/product.service.js';

export const createProduct = async (req, res) => {
    try {
        const newProductReview = await service.createProduct(req.body);
        res.status(201).json({
            message: "Product created successfully",
            metadata: newProductReview,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const createManyProduct = async (req, res) => {
    try {
        const newProductReview = await service.createManyProduct(req.body);
        res.status(201).json({
            message: "Product created successfully",
            metadata: newProductReview,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const deleteProductById = async (req, res) => {
    try {
        const { _id } = req.params;

        const deletedProduct = await service.deleteProductById(_id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: `Deleted product with id ${_id} successfully`,
            metadata: deletedProduct
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const getAllProduct = async (req, res) => {
    try {
        const products = await service.getAllProduct();
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        return res.status(200).json({
            message: "Products retrieved successfully",
            metadata: products,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { _id } = req.params;
        const product = await service.getProductById(_id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Product retrieved successfully",
            metadata: product,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllProductByIdShop = async (req, res) => {
    try {
        const { _id } = req.params;
        const products = await service.getAllProductByIdShop(_id);

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found for this shop" });
        }

        return res.status(200).json({
            message: "Products retrieved successfully",
            metadata: products,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default { createProduct, deleteProductById, getAllProduct, getProductById, getAllProductByIdShop };