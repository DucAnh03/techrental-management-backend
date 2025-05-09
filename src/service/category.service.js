import CategoryProduct from '../models/CategoryProduct.js';

const createCategoryService = async (data) => {
    try {
        const { nameCategory } = data;

        if (!nameCategory) {
            throw new Error("nameCategory is required");
        }

        const existingCategory = await CategoryProduct.findOne({ nameCategory });
        if (existingCategory) {
            throw new Error("Category already exists");
        }

        const category = await CategoryProduct.create({ nameCategory });
        return category;
    } catch (error) {
        throw error;
    }
};

export default {
    createCategoryService,
};
