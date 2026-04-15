import ApiError from "../../utils/apiErrorHandler.js";
import ApiResponse from "../../utils/apiResponseHandler.js";
import asyncHandler from "../../utils/asyncHandler.js";
import Category from "../../models/category.model.js";
import { deleteFile } from "../../utils/deleteFile.js";
import Primary from "../../models/primaryMenu.model.js";

export const createCategory = asyncHandler(async (req, res) => {
    // console.log('cookie from category', req.cookies)
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    const { name, primaryId, sequence } = req.body;

    console.log(req.body)

    console.log('cookie from category', req.cookie)

    // validation
    if (!name) {
        if (req.file) await deleteFile(req.file.path);
        throw new ApiError(400, "Category name is required");
    }

    if (!primaryId) {
        if (req.file) await deleteFile(req.file.path);
        throw new ApiError(400, "Primary id is required");
    }

    const primaryMenu = await Primary.findById(primaryId)
    if (!primaryMenu) {
        throw new ApiError(400, 'Invalid primary-menu id')
    };

    const existing = await Category.findOne({ name });
    if (existing) {
        if (req.file) await deleteFile(req.file.path);
        throw new ApiError(400, "Category already exists");
    }

    // const image = req.file ? req.file.path : "";
    const image = req.file
        ? `/uploads/${req.file.filename}`
        : "";

    try {
        const category = await Category.create({
            name,
            primaryId: primaryId,
            sequence: Number(sequence),
            image,
        });

        return res.status(201).json(
            new ApiResponse(201, "Category created successfully", category)
        );

    } catch (error) {
        // cleanup file
        if (req.file) await deleteFile(req.file.path);
        console.log("ERROR:", error);
        throw new ApiError(500, "Server Error while creating category");
    }
});

export const getCategory = asyncHandler(async (req, res) => {
    const { id } = req.query;

    let data;

    if (id) {
        data = await Category.findById(id);

        if (!data) {
            throw new ApiError(404, "No category found with this id");
        }
    } else {
        data = await Category.find();
    }

    res.status(200).json(
        new ApiResponse(200, "Category fetched successfully", data)
    );
});