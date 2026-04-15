import Category from "../../models/category.model.js";
import ApiError from "../../utils/apiErrorHandler.js";
import AsyncHandler from "../../utils/asyncHandler.js";
import Primary from '../../models/primaryMenu.model.js'
import Subcategory from "../../models/subcategory.model.js";
import ApiResponse from '../../utils/apiResponseHandler.js'

export const createSubCategory = AsyncHandler(async (req, res) => {
    const { primaryId, categoryId, name, sequence } = req.body;

    if (!primaryId || !categoryId || !name) {
        throw new ApiError(400, 'All field are required!')
    };

    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(400, 'Invalid category id')
    };

    const primaryMenu = await Primary.findById(primaryId)
    if (!primaryMenu) {
        throw new ApiError(400, 'Invalid primary-menu id')
    };

    const subCategory = await Subcategory.create({
        name: name,
        primaryId: primaryId,
        categoryId: categoryId,
        sequence: sequence
    })

    if (!subCategory) {
        throw new ApiError(400, 'Failed to create subcategory!')
    }

    res.status(201).json(
        new ApiResponse(201, 'Sub-category created successfully!', subCategory)
    )

})

export const getSubCategory = AsyncHandler(async (req, res) => {

    const { subCatId, categoryId, primaryId } = req.query;

    let queryObj = {};

    if (subCatId) queryObj._id = subCatId;
    if (categoryId) queryObj.categoryId = categoryId;
    if (primaryId) queryObj.primaryId = primaryId;

    const subCategory = await Subcategory.find(queryObj);

    if (subCategory.length === 0) {
        throw new ApiError(404, 'No sub-category found');
    }

    res.status(200).json(
        new ApiResponse(200, 'Sub-category fetched successfully', subCategory)
    );
});

