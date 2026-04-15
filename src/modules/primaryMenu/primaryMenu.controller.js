import Primary from "../../models/primaryMenu.model.js";
import ApiError from "../../utils/apiErrorHandler.js";
import ApiResponse from "../../utils/apiResponseHandler.js";
import AsyncHandler from "../../utils/asyncHandler.js";

export const createPrimaryMenu = AsyncHandler(async (req, res) => {
    const { primaryMenuName, discriptions } = req.body;
    if (!primaryMenuName || !discriptions) throw new ApiError(400, 'All files are required!');

    const primary = await Primary.create({
        name: primaryMenuName,
        description: discriptions
    })
    if (!primary) throw new ApiError(400, 'Error while creating the Primary menu option, Please try again!');

    return res.status(201).json(
        new ApiResponse(200, 'Primary menu option created successfully', primary)
    )

});

export const getPrimaryMunu = AsyncHandler(async (req, res) => {
    const { primaryId } = req.query;
    // if(!primaryId) throw new ApiError(400, 'Invalid primary menu id!');
    const queryObj = {}

    if (primaryId) {
        queryObj._id = primaryId
    }

    const primary = await Primary.find(primaryId);
    if (!primary) throw new ApiError(400, 'Not Data found');

    return res.status(200).json(
        new ApiResponse(200, 'Data fetched successfully !', primary)
    )

})