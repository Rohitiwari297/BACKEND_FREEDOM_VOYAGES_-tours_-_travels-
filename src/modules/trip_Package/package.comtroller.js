import slugify from "slugify";
import Primary from "../../models/primaryMenu.model";
import Category from "../../models/category.model";
import Subcategory from "../../models/subcategory.model";

export const createPackage = AsyncHandler(async (req, res) => {

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
        isActive
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
    if (parsedItinerary.length !== Number(numberOfDays)) {
        throw new ApiError(400, "Itinerary days must match numberOfDays");
    }

    //  File Upload (assuming multer + cloudinary)
    let pdfUrl = "";
    let imageUrl = "";

    if (req.files?.pdf) {
        pdfUrl = req.files.pdf[0].path;
    }

    if (req.files?.tourPhoto) {
        imageUrl = req.files.tourPhoto[0].path;
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
        showOnHomePage,
        homePageOrder,
        pdf: pdfUrl,
        tourPhoto: imageUrl,
        flightDeparture,
        itinerary: parsedItinerary,
        priceDetails,
        includes,
        hotels,
        extraOptions,
        isActive
    });

    res.status(201).json(
        new ApiResponse(201, "Package created successfully", newPackage)
    );
});