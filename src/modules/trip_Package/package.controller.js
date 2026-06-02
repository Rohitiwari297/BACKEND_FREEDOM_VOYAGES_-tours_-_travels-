import path from "path";
import fs from "fs";
import slugify from "slugify";
import Primary from "../../models/primaryMenu.model.js";
import Category from "../../models/category.model.js";
import Subcategory from "../../models/subcategory.model.js";
import { Package, PdfModel } from "../../models/package.model.js";
import AsyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiErrorHandler.js";
import ApiResponse from "../../utils/apiResponseHandler.js";
import { deleteFile } from '../../utils/deleteFile.js'

export const createPackage = AsyncHandler(async (req, res) => {
    // console.log('package data:', req.body)

    const {
        primaryId,
        categoryId,
        subCategoryId,
        name,
        description,
        numberOfDays,
        country,
        cities,
        price,
        showOnHomePage,
        homePageOrder,
        flightDeparture,
        itinerary,
        priceDetails,
        includes,
        hotels,
        extraOptions,
        isActive,
        forHomePage,
    } = req.body;

    // Basic validation
    if (!primaryId || !categoryId || !subCategoryId || !name || !numberOfDays || !price) {
        throw new ApiError(400, "Required fields are missing");
    }

    // Check relations
    const [primary, category, subCategory] = await Promise.all([
        Primary.findById(primaryId),
        Category.findById(categoryId),
        Subcategory.findById(subCategoryId)
    ]);

    if (!primary) throw new ApiError(404, "Invalid primaryId");
    if (!category) throw new ApiError(404, "Invalid categoryId");
    if (!subCategory) throw new ApiError(404, "Invalid subCategoryId");

    // Slug generate
    const slug = slugify(name, { lower: true });

    // Parse cities (if string comes from frontend)
    let parsedCities = [];
    if (cities) {
        parsedCities = Array.isArray(cities)
            ? cities
            : cities.split(",").map(c => c.trim());
    }

    // Parse itinerary (important)
    let parsedItinerary = [];
    if (itinerary) {
        parsedItinerary = typeof itinerary === "string"
            ? JSON.parse(itinerary)
            : itinerary;
    }

    // Validate itinerary
    // if (parsedItinerary.length !== Number(numberOfDays)) {
    //     throw new ApiError(400, "Itinerary days must match numberOfDays");
    // }

    //  File Upload (assuming multer + cloudinary)
    let pdfUrl = "";
    let imageUrl = "";

    if (req.files?.pdf) {
        pdfUrl = `/uploads/${req.files.pdf[0].filename}`;
    }

    console.log('files', req.files.tourPhoto)

    if (req.files?.tourPhoto) {
        imageUrl = req.files?.tourPhoto.map(img => `/uploads/${img.filename}`);
    }

    //  Create package
    const newPackage = await Package.create({
        primaryId,
        categoryId,
        subCategoryId,
        name,
        slug,
        description,
        numberOfDays,
        country,
        cities: parsedCities,
        price,
        showOnHomePage: showOnHomePage === 'true' || showOnHomePage === true,
        homePageOrder: homePageOrder ? Number(homePageOrder) : 0,
        pdf: pdfUrl,
        tourPhoto: imageUrl || [], // Ensure it's an array
        flightDeparture,
        itinerary: parsedItinerary,
        priceDetails,
        includes,
        hotels,
        extraOptions,
        isActive: isActive === 'true' || isActive === true,
        forHomePage: showOnHomePage === 'true' || forHomePage === true
    });

    res.status(201).json(
        new ApiResponse(201, "Package created successfully", newPackage)
    );
});

export const getAllPackages = AsyncHandler(async (req, res) => {
    const packages = await Package.find()
        .populate("primaryId")
        .populate("categoryId")
        .populate("subCategoryId")
        .sort({
            homePageOrder: 1
        });

    res.status(200).json(
        new ApiResponse(200, "Packages retrieved successfully", packages)
    );
});

export const getPackageById = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    const packageData = await Package.findById(id)
        .populate("primaryId")
        .populate("categoryId")
        .populate("subCategoryId")
        .sort({
            homePageOrder: 1
        })
    if (!packageData) {
        throw new ApiError(404, "Package not found");
    }

    res.status(200).json(
        new ApiResponse(200, "Package retrieved successfully", packageData)
    );
});

export const updatePackage = AsyncHandler(async (req, res) => {
    const {
        primaryId,
        categoryId,
        subCategoryId,
        name,
        description,
        numberOfDays,
        country,
        cities,
        price,
        showOnHomePage,
        homePageOrder,
        flightDeparture,
        itinerary,
        priceDetails,
        includes,
        hotels,
        extraOptions,
        isActive,
        forHomePage,
    } = req.body;
    console.log('isfordesktop:', showOnHomePage)

    const packageData = await Package.findById(req.params.id);

    if (!packageData) {
        throw new ApiError(400, 'Failed! Invalid package id');
    }

    // update fields only if provided
    packageData.primaryId = primaryId ?? packageData.primaryId;
    packageData.categoryId = categoryId ?? packageData.categoryId;
    packageData.subCategoryId = subCategoryId ?? packageData.subCategoryId;
    packageData.name = name ?? packageData.name;
    packageData.description = description ?? packageData.description;
    packageData.numberOfDays = numberOfDays ?? packageData.numberOfDays;
    packageData.country = country ?? packageData.country;

    if (cities) {
        packageData.cities = Array.isArray(cities) ? cities : cities.split(",").map(c => c.trim());
    }

    packageData.price = price ?? packageData.price;
    packageData.showOnHomePage = showOnHomePage === 'true' || showOnHomePage === true ? true : (showOnHomePage === 'false' || showOnHomePage === false ? false : packageData.showOnHomePage);
    packageData.homePageOrder = homePageOrder ?? packageData.homePageOrder;
    packageData.flightDeparture = flightDeparture ?? packageData.flightDeparture;

    if (itinerary) {
        packageData.itinerary = typeof itinerary === "string" ? JSON.parse(itinerary) : itinerary;
    }

    packageData.priceDetails = priceDetails ?? packageData.priceDetails;
    packageData.includes = includes ?? packageData.includes;
    packageData.hotels = hotels ?? packageData.hotels;
    packageData.extraOptions = extraOptions ?? packageData.extraOptions;
    packageData.isActive = isActive === 'true' || isActive === true ? true : (isActive === 'false' || isActive === false ? false : packageData.isActive);
    packageData.forHomePage = showOnHomePage ?? packageData.forHomePage;

    // Handle files
    if (req.files?.pdf) {
        // Delete old PDF if exists
        if (packageData.pdf) {
            const oldPdfPath = path.join(process.cwd(), "src", packageData.pdf.replace("/uploads/", "uploads/"));
            if (fs.existsSync(oldPdfPath)) {
                fs.unlinkSync(oldPdfPath);
            }
        }
        packageData.pdf = `/uploads/${req.files.pdf[0].filename}`;
    }
    if (req.files?.tourPhoto) {
        // Delete old tour photos if they exist
        if (packageData.tourPhoto && packageData.tourPhoto.length > 0) {
            packageData.tourPhoto.forEach(photoPath => {
                const oldPhotoPath = path.join(process.cwd(), "src", photoPath.replace("/uploads/", "uploads/"));
                if (fs.existsSync(oldPhotoPath)) {
                    fs.unlinkSync(oldPhotoPath);
                }
            });
        }
        // Save new tour photos
        packageData.tourPhoto = req.files.tourPhoto.map(img => `/uploads/${img.filename}`);
    }

    const updatedPackage = await packageData.save();

    res.status(200).json(
        new ApiResponse(200, "Package updated successfully", updatedPackage)
    );
});

export const deletePackage = AsyncHandler(async (req, res) => {

    const packageData = await Package.findByIdAndDelete(req.params.id);
    if (!packageData) throw new ApiError(400, 'Failed! Invalid package id');

    res.status(200).json(
        new ApiResponse(200, 'Package deleted successfully!', packageData)
    )
})

export const getPackedWiseImages = AsyncHandler(async (req, res) => {

    const packageData = await Package.find()
    const imgageData = packageData.map((pkg) => ({
        packageId: pkg._id,
        PackageName: pkg.name,
        packageImage: pkg.tourPhoto
    }))
    return res.status(200).json(
        new ApiResponse(200, 'Images fetched successfully!', imgageData)
    )
})

export const updatePackageImageById = AsyncHandler(async (req, res) => {
    const { imageIndex } = req.body;
    if (imageIndex === undefined) new ApiError(400, 'Failed ! Image Index missing');

    // uploaded file
    const newImg = `uploads/${req.file.filename}`;
    if (!newImg) new ApiError(400, 'Failed ! New image required');

    const packageData = await Package.findById(req.params.id);
    if (!packageData) new ApiError(400, 'Failed ! Invalid package id');

    // index validation
    if (imageIndex < 0 || imageIndex >= packageData.tourPhoto.length) throw new ApiError(400, 'Invalid image index');

    // replace image
    const updatedImg = packageData.tourPhoto[imageIndex] = newImg;
    await packageData.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            'Image updated successfully',
            updatedImg,

        )
    );
})

export const addPackageImageById = AsyncHandler(async (req, res) => {

    const packageData = await Package.findById(req.params.id);

    if (!packageData) {
        throw new ApiError(400, 'Failed ! Invalid package id');
    }

    // uploaded image
    if (!req.file) {
        throw new ApiError(400, 'Failed ! Image required');
    }

    const newImg = `/uploads/${req.file.filename}`;

    // add new image
    packageData.tourPhoto.push(newImg);

    await packageData.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            'Image added successfully',
            packageData,

        )
    );
});

export const deletePackageImageById = AsyncHandler(async (req, res) => {
    const { imageIndex } = req.body;
    if (imageIndex === undefined) new ApiError(400, 'Failed ! Image Index missing');

    const packageData = await Package.findById(req.params.id);
    if (!packageData) new ApiError(400, 'Failed ! Invalid package id');

    // index validation
    if (imageIndex < 0 || imageIndex >= packageData.tourPhoto.length) throw new ApiError(400, 'Invalid image index');

    // delete image
    const deletedImg = packageData.tourPhoto.splice(imageIndex, 1);
    await packageData.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            'Image deleted successfully',
            deletedImg,

        )
    );
})


/**
 * APIs FOR PDF FOR RECO
 */

export const addPdf = AsyncHandler(async (req, res) => {
    const pdfFile = `uploads/${req.file.filename}`;

    const existingPdf = await PdfModel.findOne();

    if (existingPdf) {
        await deleteFile(existingPdf.pdfFile);

        existingPdf.pdfFile = pdfFile;
        await existingPdf.save();

        return res.status(200).json(
            new ApiResponse(200, "PDF updated successfully", existingPdf)
        );
    }

    const savedPdf = await PdfModel.create({ pdfFile });

    return res.status(201).json(
        new ApiResponse(201, "PDF saved successfully", savedPdf)
    );
});

export const updatePdf = AsyncHandler(async (req, res) => {
    // const { id } = req.params;

    const pdf = await PdfModel.findById();

    if (!pdf) {
        return res.status(404).json(
            new ApiResponse(404, "PDF record not found")
        );
    }

    const newFilePath = req.file?.path;

    if (!newFilePath) {
        return res.status(400).json(
            new ApiResponse(400, "Please upload a file")
        );
    }

    // Delete old file if it exists
    if (pdf.pdfFile) {
        await deleteFile(pdf.pdfFile);
    }

    pdf.pdfFile = newFilePath;
    await pdf.save();

    return res.status(200).json(
        new ApiResponse(200, "File updated successfully", pdf)
    );
});

export const getPdf = AsyncHandler(async (req, res) => {
    const pdfs = await PdfModel.find().sort({ createdAt: -1 });

    if (!pdfs.length) {
        return res.status(404).json(
            new ApiResponse(
                404,
                "No PDFs found",
                []
            )
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            "PDFs fetched successfully",
            pdfs
        )
    );
});




