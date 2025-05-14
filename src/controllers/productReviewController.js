import service from '../service/category.service.js';
export const createProductReview = async (req, res) => {
    try {
        const newProductReview = await service.createCategoryService(req.body);
        res.status(201).json({
            message: "Category created successfully",
            metadata: newProductReview,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteProductReviewById = async (req, res) => {
    try {
        const { _id } = req.params;

        const deletedProductReview = await service.deleteProductReviewById(_id);

        if (!deletedProductReview) {
            return res.status(404).json({ message: "Product review not found" });
        }

        return res.status(200).json({
            message: `Deleted product review with id ${_id} successfully`,
            metadata: deletedProductReview
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getAllProductReview = async (req, res) => {
    try {
        const productReviews = await service.getAllProductReview();
        if (!productReviews || productReviews.length === 0) {
            return res.status(404).json({ message: "No product reviews found" });
        }

        return res.status(200).json({
            message: "Product reviews retrieved successfully",
            metadata: productReviews,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getProductReviewById = async (req, res) => {
    try {
        const { _id } = req.params;
        const productReview = await service.getProductReviewById(_id);

        if (!productReview) {
            return res.status(404).json({ message: "Product review not found" });
        }

        return res.status(200).json({
            message: "Product review retrieved successfully",
            metadata: productReview,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getAllProductReviewByIdProduct = async (req, res) => {
    try {
        const { _id } = req.params;
        const productReviews = await service.getAllProductReviewByIdProduct(_id);

        if (!productReviews || productReviews.length === 0) {
            return res.status(404).json({ message: "No product reviews found for this product" });
        }

        return res.status(200).json({
            message: "Product reviews retrieved successfully",
            metadata: productReviews,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default {
    createProductReview, deleteProductReviewById, getAllProductReview,
    getProductReviewById, getAllProductReviewByIdProduct
};
