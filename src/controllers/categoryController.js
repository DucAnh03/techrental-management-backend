import service from '../service/category.service.js';

export const createCategory = async (req, res) => {
    try {
        console.log("first,req.body", req.body);
        const newCategory = await service.createCategoryService(req.body);
        res.status(201).json({
            message: "Category created successfully",
            metadata: newCategory,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default { createCategory };
