import ApiError from "../../utils/apiErrorHandler.js";
import ApiResponse from "../../utils/apiResponseHandler.js";
import asyncHandler from "../../utils/asyncHandler.js";
import Category from "../../models/category.model.js";

export const createCategory = asyncHandler(async (req, res) => {
    const { name, primary, sequence } = req.body;

    if (!name) {
        throw new ApiError(400, "Category name is required");
    }

    const existing = await Category.findOne({ name });
    if (existing) {
        throw new ApiError(400, "Category already exists");
    }

    const image = req.file ? req.file.path : "";

    const category = await Category.create({
        name,
        primary: primary || null,
        sequence,
        image,
    });

    res.status(201).json(
        new ApiResponse(201, "Category created successfully", category)
    );
});

export const getCategory = asyncHandler(async (req, res) => {
    
})