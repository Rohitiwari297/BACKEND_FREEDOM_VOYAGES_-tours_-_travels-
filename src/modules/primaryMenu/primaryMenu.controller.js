import Primary from "../../models/primaryMenu.model.js";
import ApiError from "../../utils/apiErrorHandler.js";
import ApiResponse from "../../utils/apiResponseHandler.js";
import AsyncHandler from "../../utils/asyncHandler.js";

export const createPrimaryMenu = AsyncHandler(async (req, res) => {
    const { name, discriptions, indexNumber } = req.body;
    console.log('req.body', indexNumber)
    if (!name) throw new ApiError(400, 'All files are required!');

    const primary = await Primary.create({
        name: name,
        description: discriptions,
        indexNumber: indexNumber
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

    const primary = await Primary.find(primaryId).sort({ indexNumber: 1 });
    if (!primary) throw new ApiError(400, 'Not Data found');

    return res.status(200).json(
        new ApiResponse(200, 'Data fetched successfully !', primary)
    )

})

export const updatePrimary = AsyncHandler(async (req, res) => {

    const { name, discriptions, indexNumber } = req.body;
    const { id } = req.params;

    const primaryData = await Primary.findById(id);
    if (!primaryData) throw new ApiError(400, 'Invalid request id!');

    primaryData.name = name ?? primaryData.name;
    primaryData.discriptions = discriptions ?? primaryData.discriptions;
    primaryData.indexNumber = indexNumber ?? primaryData.indexNumber

    const updatedPrimaryData = await primaryData.save();
    if (!updatedPrimaryData) throw new ApiError(400, 'Error while saving the updated Details, Please try again!');

    return res.status(200).json(
        new ApiResponse(200, 'Details updated successfully!', updatedPrimaryData)
    )
});

export const deletePrimary = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedData = await Primary.findByIdAndDelete(id)
    if (!deletedData) throw new ApiError(400, 'Invalid id');

    return res.status(200).json(
        new ApiResponse(200, 'Data Deleted Successfully!', deletedData)
    );
});