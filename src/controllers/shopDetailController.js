import service from '../service/shopDetail.service.js';

export const createShopDetail = async (req, res) => {
    try {
        const newShopDetail = await service.createShopDetail(req.body);
        res.status(201).json({
            message: "ShopDetail created successfully",
            metadata: newShopDetail,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const deleteShopDetailById = async (req, res) => {
    try {
        const { _id } = req.params;

        const deletedShopDetail = await service.deleteShopDetailById(_id);

        if (!deletedShopDetail) {
            return res.status(404).json({ message: "ShopDetail not found" });
        }

        return res.status(200).json({
            message: `Deleted ShopDetail with id ${_id} successfully`,
            metadata: deletedShopDetail
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getAllShopDetail = async (req, res) => {
    try {
        const shopDetails = await service.getAllShopDetail();
        if (!shopDetails || shopDetails.length === 0) {
            return res.status(404).json({ message: "No ShopDetail found" });
        }

        return res.status(200).json({
            message: "ShopDetail retrieved successfully",
            metadata: shopDetails,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getShopDetailById = async (req, res) => {
    try {
        const { _id } = req.params;
        const shopDetail = await service.getShopDetailById(_id);

        if (!shopDetail) {
            return res.status(404).json({ message: "ShopDetail not found" });
        }

        return res.status(200).json({
            message: "ShopDetail retrieved successfully",
            metadata: shopDetail,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getAllShopDetailByIdShop = async (req, res) => {
    try {
        const { _id } = req.params;
        const shopDetails = await service.getAllShopDetailByIdShop(_id);
        if (!shopDetails || shopDetails.length === 0) {
            return res.status(404).json({ message: "No ShopDetail found" });
        }

        return res.status(200).json({
            message: "ShopDetail retrieved successfully",
            metadata: shopDetails,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default { createShopDetail };
