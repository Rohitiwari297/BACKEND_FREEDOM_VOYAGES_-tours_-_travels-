import slugify from "slugify";
import Primary from "../../models/primaryMenu.model.js";
import Category from "../../models/category.model.js";
import Subcategory from "../../models/subcategory.model.js";
import Package from "../../models/package.model.js";
import AsyncHandler from "../../utils/asyncHandler.js";
import ApiError from "../../utils/apiErrorHandler.js";
import ApiResponse from "../../utils/apiResponseHandler.js";

export const createPackage = AsyncHandler(async (req, res) => {
    console.log('package data:', req.body)

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
        pdfUrl = `/uploads/${req.files.pdf[0].filename.replace(/\s+/g, "-")}`;
    }

    if (req.files?.tourPhoto) {
        imageUrl = `/uploads/${req.files.tourPhoto[0].filename.replace(/\s+/g, "-")}`;
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
        tourPhoto: imageUrl,
        flightDeparture,
        itinerary: parsedItinerary,
        priceDetails,
        includes,
        hotels,
        extraOptions,
        isActive: isActive === 'true' || isActive === true,
        forHomePage
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
        .sort({ createdAt: -1 });

    res.status(200).json(
        new ApiResponse(200, "Packages retrieved successfully", packages)
    );
});

export const getPackageById = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    const packageData = await Package.findById(id)
        .populate("primaryId")
        .populate("categoryId")
        .populate("subCategoryId");

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
    packageData.forHomePage = forHomePage ?? packageData.forHomePage;

    // Handle files
    if (req.files?.pdf) {
        packageData.pdf = `/uploads/${req.files.pdf[0].filename.replace(/\s+/g, "-")}`;
    }
    if (req.files?.tourPhoto) {
        packageData.tourPhoto = `/uploads/${req.files.tourPhoto[0].filename.replace(/\s+/g, "-")}`;
    }

    const updatedPackage = await packageData.save();

    res.status(200).json(
        new ApiResponse(200, "Package updated successfully", updatedPackage)
    );
});

export const deletePackage = AsyncHandler(async (req, res) => {

    const packageData = await Package.findByIdAndDelete(req.params.id);
    if (!packageData) throw ApiError(400, 'Failed! Invalid package id');

    res.status(200).json(
        new ApiResponse(200, 'Package deleted successfully!', packageData)
    )
})